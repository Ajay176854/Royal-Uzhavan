import { Router } from "express";
import { query } from "../db/pool.js";
import {
  sendOrderStatusUpdate,
  sendDeliveryNotification,
  sendCustomMessage,
  sendTestMessage,
  isWhatsAppConfigured,
  getWhatsAppStatus,
} from "../services/whatsapp.js";

const router = Router();

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════

// GET /api/admin/stats — dashboard statistics
router.get("/stats", async (_req, res) => {
  try {
    const [ordersRes, revenueRes, productsRes, usersRes, pendingRes, feedbackRes] =
      await Promise.all([
        query("SELECT COUNT(*)::int AS total FROM orders"),
        query(
          "SELECT COALESCE(SUM(total), 0)::numeric AS revenue FROM orders WHERE status != 'cancelled'"
        ),
        query("SELECT COUNT(*)::int AS total FROM products WHERE in_stock = true"),
        query("SELECT COUNT(*)::int AS total FROM users"),
        query("SELECT COUNT(*)::int AS total FROM orders WHERE status = 'pending'"),
        query("SELECT COUNT(*)::int AS total FROM contact_messages WHERE is_read = false"),
      ]);

    res.json({
      stats: {
        totalOrders: ordersRes.rows[0].total,
        totalRevenue: parseFloat(revenueRes.rows[0].revenue),
        activeProducts: productsRes.rows[0].total,
        totalUsers: usersRes.rows[0].total,
        pendingOrders: pendingRes.rows[0].total,
        unreadFeedbacks: feedbackRes.rows[0].total,
        whatsapp: getWhatsAppStatus(),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// ═══════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════

// GET /api/admin/orders — fetch all orders
router.get("/orders", async (req, res) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== "all") {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    const [countRes, ordersRes] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total FROM orders ${whereClause}`, params),
      query(
        `SELECT id, customer_name, customer_email, customer_phone, status,
                total, items, payment_method, shipping_address,
                created_at, updated_at
         FROM orders
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limitNum, offset]
      ),
    ]);

    res.json({
      orders: ordersRes.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countRes.rows[0].total,
        totalPages: Math.ceil(countRes.rows[0].total / limitNum),
      },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT /api/admin/orders/:id/status — update order status + WhatsApp notification
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        error: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
      });
      return;
    }

    // Get current order info (need customer details for WhatsApp)
    const orderRes = await query(
      `SELECT id, customer_name, customer_phone, customer_email, status AS current_status,
              tracking_info
       FROM orders WHERE id = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = orderRes.rows[0];

    // Update status and append tracking event
    const trackingInfo = order.tracking_info || { events: [] };
    trackingInfo.events.push({
      status,
      message: `Order ${status.replace("_", " ")}`,
      timestamp: new Date().toISOString(),
    });

    const result = await query(
      `UPDATE orders
       SET status = $1, tracking_info = $2
       WHERE id = $3
       RETURNING id, status, updated_at`,
      [status, JSON.stringify(trackingInfo), id]
    );

    // Send WhatsApp notification (fire-and-forget)
    let whatsappResult: { success: boolean; messageId?: string; error?: string } = { success: false, error: "not attempted" };

    if (isWhatsAppConfigured() && order.customer_phone) {
      try {
        if (status === "delivered") {
          whatsappResult = await sendDeliveryNotification(
            order.customer_phone,
            order.customer_name,
            id
          );
        } else {
          whatsappResult = await sendOrderStatusUpdate(
            order.customer_phone,
            order.customer_name,
            id,
            status
          );
        }
      } catch (err) {
        console.error("WhatsApp notification failed (non-blocking):", err);
        whatsappResult = { success: false, error: "Send failed" };
      }
    }

    res.json({
      message: "Order status updated",
      order: result.rows[0],
      whatsapp: {
        sent: whatsappResult.success,
        messageId: whatsappResult.messageId || null,
        error: whatsappResult.error || null,
      },
    });
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// DELETE /api/admin/orders/:id — delete/cancel an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM orders WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ message: "Order deleted", orderId: result.rows[0].id });
  } catch (error) {
    console.error("Admin order delete error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// ═══════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════

// POST /api/admin/products — create product
router.post("/products", async (req, res) => {
  try {
    const {
      name,
      slug,
      price,
      original_price,
      discount,
      category_name,
      animal_type,
      image,
      tags,
      variants,
      in_stock,
      description,
    } = req.body;

    if (!name || !slug || !price) {
      res.status(400).json({ error: "name, slug, and price are required" });
      return;
    }

    // Resolve category ID
    let category_id = null;
    if (category_name) {
      const catRes = await query(`SELECT id FROM categories WHERE name = $1`, [
        category_name,
      ]);
      if (catRes.rows.length > 0) {
        category_id = catRes.rows[0].id;
      }
    }

    const result = await query(
      `INSERT INTO products (
        name, slug, price, original_price, discount, category_id,
        animal_type, image, tags, variants, in_stock, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, name, slug`,
      [
        name,
        slug,
        price,
        original_price || null,
        discount || 0,
        category_id,
        animal_type || "Human",
        image || null,
        tags || [],
        variants || [],
        in_stock !== false,
        description || null,
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Product with this slug already exists" });
      return;
    }
    console.error("Admin product create error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/admin/products/:id — update product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      price,
      original_price,
      discount,
      category_name,
      animal_type,
      image,
      tags,
      variants,
      in_stock,
      description,
    } = req.body;

    let category_id = null;
    if (category_name) {
      const catRes = await query(`SELECT id FROM categories WHERE name = $1`, [
        category_name,
      ]);
      if (catRes.rows.length > 0) {
        category_id = catRes.rows[0].id;
      }
    }

    const result = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        price = COALESCE($3, price),
        original_price = $4,
        discount = COALESCE($5, discount),
        category_id = COALESCE($6, category_id),
        animal_type = COALESCE($7, animal_type),
        image = COALESCE($8, image),
        tags = COALESCE($9, tags),
        variants = COALESCE($10, variants),
        in_stock = COALESCE($11, in_stock),
        description = COALESCE($12, description)
       WHERE id = $13
       RETURNING id, name, slug`,
      [
        name || null,
        slug || null,
        price || null,
        original_price ?? null,
        discount ?? null,
        category_id,
        animal_type || null,
        image || null,
        tags || null,
        variants || null,
        in_stock ?? null,
        description || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    console.error("Admin product update error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id — delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM products WHERE id = $1 RETURNING id, name`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Admin product delete error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ═══════════════════════════════════════════════════════
//  FEEDBACKS / CONTACT MESSAGES
// ═══════════════════════════════════════════════════════

// GET /api/admin/feedbacks — fetch all contact messages
router.get("/feedbacks", async (req, res) => {
  try {
    const { unread_only } = req.query;

    let whereClause = "";
    if (unread_only === "true") {
      whereClause = "WHERE is_read = false";
    }

    const result = await query(
      `SELECT id, name, email, phone, subject, message, is_read, created_at
       FROM contact_messages
       ${whereClause}
       ORDER BY created_at DESC`
    );

    res.json({ feedbacks: result.rows });
  } catch (error) {
    console.error("Admin feedbacks fetch error:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// PUT /api/admin/feedbacks/:id/read — mark feedback as read
router.put("/feedbacks/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Feedback not found" });
      return;
    }

    res.json({ message: "Feedback marked as read", id: result.rows[0].id });
  } catch (error) {
    console.error("Admin feedback update error:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

// ═══════════════════════════════════════════════════════
//  WHATSAPP
// ═══════════════════════════════════════════════════════

// POST /api/admin/whatsapp/send — send custom WhatsApp message
router.post("/whatsapp/send", async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      res.status(400).json({ error: "phone and message are required" });
      return;
    }

    if (!isWhatsAppConfigured()) {
      res.status(503).json({
        error: "WhatsApp API not configured. Check META_WHATSAPP_* env vars.",
      });
      return;
    }

    const result = await sendCustomMessage(phone, message);

    if (result.success) {
      res.json({
        message: "WhatsApp message sent successfully",
        messageId: result.messageId,
      });
    } else {
      res.status(400).json({
        error: "Failed to send WhatsApp message",
        details: result.error,
      });
    }
  } catch (error) {
    console.error("Admin WhatsApp send error:", error);
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
});

// POST /api/admin/whatsapp/test — send test message
router.post("/whatsapp/test", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ error: "phone is required" });
      return;
    }

    if (!isWhatsAppConfigured()) {
      res.status(503).json({
        error: "WhatsApp API not configured. Check META_WHATSAPP_* env vars.",
      });
      return;
    }

    const result = await sendTestMessage(phone);

    res.json({
      success: result.success,
      messageId: result.messageId || null,
      error: result.error || null,
      status: getWhatsAppStatus(),
    });
  } catch (error) {
    console.error("Admin WhatsApp test error:", error);
    res.status(500).json({ error: "Failed to send test message" });
  }
});

// GET /api/admin/whatsapp/status — check WhatsApp service status
router.get("/whatsapp/status", async (_req, res) => {
  res.json({ whatsapp: getWhatsAppStatus() });
});

export { router as adminRoutes };
