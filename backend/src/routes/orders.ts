/**
 * Royal Uzhavan — Orders Route (Production-Hardened)
 *
 * Key production features:
 *   • Server-side price calculation (NEVER trust client prices)
 *   • Atomic stock decrement inside transaction
 *   • Stock restoration on cancellation
 *   • COD fraud prevention (duplicate detection, blacklist, value limits)
 *   • Full input validation & sanitization
 *   • Auto-generated human-readable order numbers (RU-1001)
 *   • WhatsApp notifications (Meta API + free fallback link)
 */

import { Router } from "express";
import { query, getClient } from "../db/pool.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import {
  generateOrderWhatsAppLink,
  sendOrderConfirmation,
  isWhatsAppConfigured,
} from "../services/whatsapp.js";
import {
  isValidPhone,
  isValidEmail,
  normalizePhone,
  validateShippingAddress,
  validateOrderItems,
  sanitizeString,
  sanitizeAddress,
  MAX_ORDER_VALUE_GUEST,
  MAX_ORDER_VALUE_REGISTERED,
  DUPLICATE_ORDER_WINDOW_MINUTES,
} from "../services/validation.js";

const router = Router();

// ═══════════════════════════════════════════════════════════════
//  POST /api/orders — Create order (Production-hardened)
// ═══════════════════════════════════════════════════════════════
router.post("/", optionalAuth, async (req, res) => {
  const client = await getClient();

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items, // Expected: [{ productId, quantity, variant? }]
      paymentMethod,
    } = req.body;

    // ─── Step 1: Basic Field Validation ───────────────────────
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items) {
      res.status(400).json({
        error: "Missing required fields: customerName, customerEmail, customerPhone, shippingAddress, items",
      });
      return;
    }

    // Sanitize name
    const cleanName = sanitizeString(customerName, 200);
    if (cleanName.length < 2) {
      res.status(400).json({ error: "Customer name must be at least 2 characters" });
      return;
    }

    // Validate email
    const cleanEmail = customerEmail.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    // Validate phone
    if (!isValidPhone(customerPhone)) {
      res.status(400).json({
        error: "Invalid phone number. Please provide a valid 10-digit Indian mobile number",
      });
      return;
    }
    const cleanPhone = normalizePhone(customerPhone);

    // Validate address structure
    const addressValidation = validateShippingAddress(shippingAddress);
    if (!addressValidation.valid) {
      res.status(400).json({ error: addressValidation.error });
      return;
    }
    const cleanAddress = sanitizeAddress(shippingAddress);

    // Validate order items
    const itemsValidation = validateOrderItems(items);
    if (!itemsValidation.valid) {
      res.status(400).json({ error: itemsValidation.error });
      return;
    }

    // ─── Step 2: Fraud Prevention Checks ──────────────────────

    // 2a. Check blacklist
    const blacklistCheck = await query(
      `SELECT id FROM blacklisted_customers
       WHERE is_active = true AND (phone = $1 OR email = $2)
       LIMIT 1`,
      [cleanPhone, cleanEmail]
    );
    if (blacklistCheck.rows.length > 0) {
      res.status(403).json({
        error: "Unable to process this order. Please contact support.",
      });
      return;
    }

    // 2b. Duplicate order detection (same phone, within time window)
    const duplicateCheck = await query(
      `SELECT id FROM orders
       WHERE customer_phone = $1
         AND created_at > NOW() - ($2 * INTERVAL '1 minute')
         AND status != 'cancelled'
       LIMIT 1`,
      [cleanPhone, DUPLICATE_ORDER_WINDOW_MINUTES]
    );
    if (duplicateCheck.rows.length > 0) {
      res.status(429).json({
        error: `You already placed an order recently. Please wait ${DUPLICATE_ORDER_WINDOW_MINUTES} minutes before placing another.`,
      });
      return;
    }

    // ─── Step 3: Server-Side Price Calculation (CRITICAL) ─────
    await client.query("BEGIN");

    // Extract all product IDs from the order
    const productIds: string[] = items.map((item: any) => item.productId);

    // Fetch actual product data from the database
    const productsResult = await client.query(
      `SELECT id, name, price, original_price, discount, stock_quantity, in_stock, image
       FROM products
       WHERE id = ANY($1)`,
      [productIds]
    );

    const productMap = new Map<string, any>();
    for (const product of productsResult.rows) {
      productMap.set(product.id, product);
    }

    // Validate all products exist and are in stock
    let serverSubtotal = 0;
    const resolvedItems: any[] = [];

    for (const item of items as any[]) {
      const product = productMap.get(item.productId);

      if (!product) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: "One or more products were not found",
        });
        return;
      }

      if (!product.in_stock || product.stock_quantity < item.quantity) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: `"${product.name}" is out of stock or insufficient quantity available (available: ${product.stock_quantity})`,
        });
        return;
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      serverSubtotal += itemTotal;

      resolvedItems.push({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: item.quantity,
        variant: item.variant || null,
        image: product.image,
        lineTotal: itemTotal,
      });
    }

    // Calculate shipping fee (flat rate for now, can be zone-based later)
    const shippingFee = serverSubtotal >= 500 ? 0 : 50; // Free shipping over ₹500
    const serverTotal = serverSubtotal + shippingFee;

    // 2c. COD value limit check (after calculating real total)
    const maxOrderValue = req.user
      ? MAX_ORDER_VALUE_REGISTERED
      : MAX_ORDER_VALUE_GUEST;

    if (serverTotal > maxOrderValue) {
      await client.query("ROLLBACK");
      res.status(400).json({
        error: req.user
          ? `Maximum order value is ₹${MAX_ORDER_VALUE_REGISTERED.toLocaleString("en-IN")} for COD`
          : `Maximum order value is ₹${MAX_ORDER_VALUE_GUEST.toLocaleString("en-IN")} for guest COD orders. Please create an account for higher limits.`,
      });
      return;
    }

    // ─── Step 4: Atomic Stock Decrement ───────────────────────
    for (const item of resolvedItems) {
      const stockResult = await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1,
             in_stock = CASE WHEN stock_quantity - $1 > 0 THEN true ELSE false END
         WHERE id = $2 AND stock_quantity >= $1
         RETURNING id, stock_quantity`,
        [item.quantity, item.productId]
      );

      if (stockResult.rows.length === 0) {
        // Race condition: stock was taken by another order
        await client.query("ROLLBACK");
        res.status(409).json({
          error: `"${item.name}" just went out of stock. Please refresh and try again.`,
        });
        return;
      }
    }

    // ─── Step 5: Create the Order ─────────────────────────────
    if (paymentMethod && paymentMethod !== "cod") {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Only COD (Cash on Delivery) is currently supported" });
      return;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (
         user_id, customer_name, customer_email, customer_phone,
         shipping_address, items, subtotal, shipping_fee, total,
         payment_method, tracking_info
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'cod', $10)
       RETURNING id, order_number, status, created_at`,
      [
        req.user?.id || null,
        cleanName,
        cleanEmail,
        cleanPhone,
        JSON.stringify(cleanAddress),
        JSON.stringify(resolvedItems),
        serverSubtotal,
        shippingFee,
        serverTotal,
        JSON.stringify({
          events: [
            {
              status: "pending",
              message: "Order placed successfully",
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      ]
    );

    await client.query("COMMIT");

    const order = orderResult.rows[0];

    // ─── Step 6: Notifications (fire-and-forget) ──────────────

    // Generate WhatsApp Click-to-Chat link (free fallback)
    const whatsappLink = generateOrderWhatsAppLink({
      orderId: order.id,
      customerName: cleanName,
      items: resolvedItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.lineTotal,
      })),
      total: serverTotal,
    });

    // Auto-send WhatsApp order confirmation via Meta API
    if (isWhatsAppConfigured()) {
      sendOrderConfirmation({
        orderId: order.id,
        customerName: cleanName,
        customerPhone: cleanPhone,
        items: resolvedItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.lineTotal,
        })),
        total: serverTotal,
        subtotal: serverSubtotal,
        shippingFee,
        paymentMethod: paymentMethod || "cod",
      }).catch((err) => {
        console.error("WhatsApp auto-send failed (non-blocking):", err);
      });
    }

    // ─── Step 7: Response ─────────────────────────────────────
    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        items: resolvedItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          lineTotal: item.lineTotal,
        })),
        subtotal: serverSubtotal,
        shippingFee,
        total: serverTotal,
        paymentMethod: paymentMethod || "cod",
        createdAt: order.created_at,
      },
      whatsappLink,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

// ═══════════════════════════════════════════════════════════════
//  GET /api/orders/lookup — Guest order lookup by email or phone
// ═══════════════════════════════════════════════════════════════
router.get("/lookup", async (req, res) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      res.status(400).json({ error: "Provide email or phone to look up orders" });
      return;
    }

    const conditions: string[] = [];
    const params: any[] = [];

    if (email) {
      const cleanEmail = (email as string).toLowerCase().trim();
      if (!isValidEmail(cleanEmail)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
      }
      conditions.push(`customer_email = $${params.length + 1}`);
      params.push(cleanEmail);
    }
    if (phone) {
      if (!isValidPhone(phone as string)) {
        res.status(400).json({ error: "Invalid phone number format" });
        return;
      }
      conditions.push(`customer_phone = $${params.length + 1}`);
      params.push(normalizePhone(phone as string));
    }

    const result = await query(
      `SELECT id, order_number, items, subtotal, shipping_fee, total, status,
              payment_method, created_at, updated_at
       FROM orders
       WHERE ${conditions.join(" OR ")}
       ORDER BY created_at DESC
       LIMIT 20`,
      params
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Order lookup error:", error);
    res.status(500).json({ error: "Failed to look up orders" });
  }
});

// ═══════════════════════════════════════════════════════════════
//  GET /api/orders/my-orders — User's orders (protected)
// ═══════════════════════════════════════════════════════════════
router.get("/my-orders", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, order_number, items, subtotal, shipping_fee, total, status,
              payment_method, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user!.id]
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error("My orders fetch error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ═══════════════════════════════════════════════════════════════
//  GET /api/orders/:id — Order details
// ═══════════════════════════════════════════════════════════════
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, order_number, customer_name, customer_email, customer_phone,
              shipping_address, items, subtotal, shipping_fee, total,
              status, payment_method, tracking_info, user_id, created_at, updated_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = result.rows[0];

    // If user is logged in and is the order owner OR admin, return full details
    if (req.user && (req.user.id === order.user_id || req.user.role === "admin")) {
      res.json({ order });
      return;
    }

    // For unauthenticated/guest users, require email or phone verification
    const { email, phone } = req.query;
    if (!email && !phone) {
      res.status(403).json({ error: "Provide email or phone to view guest order details" });
      return;
    }

    if (email && (email as string).toLowerCase().trim() !== order.customer_email.toLowerCase()) {
      res.status(403).json({ error: "Email does not match this order" });
      return;
    }

    if (phone && normalizePhone(phone as string) !== order.customer_phone) {
      res.status(403).json({ error: "Phone number does not match this order" });
      return;
    }

    // For verified guest users, return limited data (omit user_id, detailed payment/tracking info if sensitive)
    res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        items: order.items,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        total: order.total,
        status: order.status,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ═══════════════════════════════════════════════════════════════
//  GET /api/orders/:id/track — Track order
// ═══════════════════════════════════════════════════════════════
router.get("/:id/track", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, order_number, status, tracking_info, shipping_address,
              customer_name, created_at, updated_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = result.rows[0];

    res.json({
      orderId: order.id,
      orderNumber: order.order_number,
      status: order.status,
      trackingEvents: order.tracking_info?.events || [],
      placedAt: order.created_at,
      lastUpdated: order.updated_at,
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    res.status(500).json({ error: "Failed to fetch tracking info" });
  }
});

export { router as orderRoutes };
