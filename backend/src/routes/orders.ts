import { Router } from "express";
import { query, getClient } from "../db/pool.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { sendOrderConfirmationWhatsApp } from "../services/whatsapp.js";

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

    // Trigger WhatsApp notification asynchronously (do not block the response)
    sendOrderConfirmationWhatsApp(customerPhone, order.id, customerName);

    res.status(201).json({
      message: "Order placed successfully!",
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
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

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, customer_name, customer_email, customer_phone,
              shipping_address, items, subtotal, shipping_fee, total,
              status, payment_method, tracking_info, created_at, updated_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order: result.rows[0] });
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
