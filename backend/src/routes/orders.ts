import { Router } from "express";
import { query, getClient } from "../db/pool.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { isValidEmail, sanitizeString } from "../middleware/auth.js";
import {
  generateOrderWhatsAppLink,
  sendOrderConfirmation,
  isWhatsAppConfigured,
} from "../services/whatsapp.js";

const router = Router();

// POST /api/orders — create order (auth optional)
router.post("/", optionalAuth, async (req, res) => {
  const client = await getClient();

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingFee = 0,
      total,
      paymentMethod,
    } = req.body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !total) {
      res.status(400).json({
        error: "Missing required fields: customerName, customerEmail, customerPhone, shippingAddress, items, total",
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item" });
      return;
    }

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, customer_phone,
                           shipping_address, items, subtotal, shipping_fee, total,
                           payment_method, tracking_info)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, status, created_at`,
      [
        req.user?.id || null,
        customerName,
        customerEmail.toLowerCase(),
        customerPhone,
        JSON.stringify(shippingAddress),
        JSON.stringify(items),
        subtotal || total,
        shippingFee,
        total,
        paymentMethod || "cod",
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

    const order = result.rows[0];

    // Generate WhatsApp Click-to-Chat link (free fallback)
    const whatsappLink = generateOrderWhatsAppLink({
      orderId: order.id,
      customerName,
      items: items.map((item: any) => ({
        name: item.name || item.productName || "Product",
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
      total,
    });

    // Auto-send WhatsApp order confirmation via Meta API (fire-and-forget)
    if (isWhatsAppConfigured()) {
      sendOrderConfirmation({
        orderId: order.id,
        customerName,
        customerPhone,
        items: items.map((item: any) => ({
          name: item.name || item.productName || "Product",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        total,
        subtotal,
        shippingFee,
        paymentMethod: paymentMethod || "cod",
      }).catch((err) => {
        console.error("WhatsApp auto-send failed (non-blocking):", err);
      });
    }

    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: order.id,
        status: order.status,
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

// GET /api/orders/lookup — guest order lookup by email or phone
// Returns limited data — no personal info leaked
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
      conditions.push(`customer_email = $${params.length + 1}`);
      params.push((email as string).toLowerCase().trim());
    }
    if (phone) {
      conditions.push(`customer_phone = $${params.length + 1}`);
      params.push(phone);
    }

    const result = await query(
      `SELECT id, items, subtotal, shipping_fee, total, status,
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

// GET /api/orders/my-orders — user's orders (protected)
router.get("/my-orders", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, items, subtotal, shipping_fee, total, status,
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

// GET /api/orders/:id — get order details (auth recommended)
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, customer_name, customer_email, customer_phone,
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

    // For unauthenticated / non-owner requests, return limited data
    res.json({
      order: {
        id: order.id,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shipping_fee,
        total: order.total,
        status: order.status,
        payment_method: order.payment_method,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// GET /api/orders/:id/track
router.get("/:id/track", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, status, tracking_info, shipping_address,
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
      status: order.status,
      customerName: order.customer_name,
      shippingAddress: order.shipping_address,
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
