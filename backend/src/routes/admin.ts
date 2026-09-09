import { Router } from "express";
import { query, getClient } from "../db/pool.js";
import {
  sendOrderStatusUpdate,
  sendDeliveryNotification,
  sendCustomMessage,
  sendTestMessage,
  isWhatsAppConfigured,
  getWhatsAppStatus,
} from "../services/whatsapp.js";
import { upload } from "../middleware/upload.js";
import { uploadProductImage } from "../services/storage.js";

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
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status as string)) {
        res.status(400).json({ error: "Invalid status filter" });
        return;
      }
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
                order_number, created_at, updated_at
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
  const client = await getClient();
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

    await client.query("BEGIN");

    // Get current order info (need items for stock restore, customer details for WhatsApp)
    const orderRes = await client.query(
      `SELECT id, customer_name, customer_phone, customer_email, status AS current_status,
              tracking_info, items
       FROM orders WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = orderRes.rows[0];
    
    // If cancelling an active order, restore stock
    if (status === "cancelled" && order.current_status !== "cancelled") {
      const items = order.items || [];
      for (const item of items) {
        if (item.productId) {
          await client.query(
            `UPDATE products
             SET stock_quantity = stock_quantity + $1,
                 in_stock = true
             WHERE id = $2`,
            [item.quantity || 1, item.productId]
          );
        }
      }
    }

    // Update status and append tracking event
    const trackingInfo = order.tracking_info || { events: [] };
    trackingInfo.events.push({
      status,
      message: `Order ${status.replace("_", " ")}`,
      timestamp: new Date().toISOString(),
    });

    const result = await client.query(
      `UPDATE orders
       SET status = $1, tracking_info = $2
       WHERE id = $3
       RETURNING id, status, updated_at`,
      [status, JSON.stringify(trackingInfo), id]
    );

    await client.query("COMMIT");

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
    await client.query("ROLLBACK");
    console.error("Admin order update error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  } finally {
    client.release();
  }
});

// DELETE /api/admin/orders/:id — cancel order + restore stock
// Orders are financial records and should never be permanently deleted
router.delete("/orders/:id", async (req, res) => {
  const client = await getClient();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // Get the order and its items before cancelling
    const orderRes = await client.query(
      `SELECT id, status, items FROM orders WHERE id = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const order = orderRes.rows[0];

    if (order.status === "cancelled") {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Order is already cancelled" });
      return;
    }

    // Restore stock for each item
    const items = order.items || [];
    for (const item of items) {
      if (item.productId) {
        await client.query(
          `UPDATE products
           SET stock_quantity = stock_quantity + $1,
               in_stock = true
           WHERE id = $2`,
          [item.quantity || 1, item.productId]
        );
      }
    }

    // Cancel the order
    const result = await client.query(
      `UPDATE orders SET status = 'cancelled'
       WHERE id = $1
       RETURNING id, order_number, status`,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Order cancelled and stock restored",
      orderId: result.rows[0].id,
      orderNumber: result.rows[0].order_number,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin order cancel error:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  } finally {
    client.release();
  }
});

// POST /api/admin/upload — upload product image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const publicUrl = await uploadProductImage(req.file);

    res.json({
      message: "Image uploaded successfully",
      url: publicUrl,
    });
  } catch (error: any) {
    console.error("Admin upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

// ═══════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════

// POST /api/admin/products — create product (with stock_quantity)
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
      stock_quantity,
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

    const qty = stock_quantity ?? 0;

    const result = await query(
      `INSERT INTO products (
        name, slug, price, original_price, discount, category_id,
        animal_type, image, tags, variants, in_stock, stock_quantity, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, name, slug, stock_quantity`,
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
        qty > 0 ? true : (in_stock !== false),
        qty,
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

// PUT /api/admin/products/:id — update product (with stock_quantity)
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
      stock_quantity,
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
        stock_quantity = COALESCE($12, stock_quantity),
        description = COALESCE($13, description)
       WHERE id = $14
       RETURNING id, name, slug, stock_quantity, in_stock`,
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
        stock_quantity ?? null,
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
    const { unread_only, page = "1", limit = "20" } = req.query;

    let whereClause = "";
    if (unread_only === "true") {
      whereClause = "WHERE is_read = false";
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    const [countRes, result] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total FROM contact_messages ${whereClause}`),
      query(
        `SELECT id, name, email, phone, subject, message, is_read, created_at
         FROM contact_messages
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limitNum, offset]
      )
    ]);

    res.json({
      feedbacks: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countRes.rows[0].total,
        totalPages: Math.ceil(countRes.rows[0].total / limitNum),
      }
    });
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

import { isValidPhone } from "../middleware/auth.js";

// POST /api/admin/whatsapp/send — send custom WhatsApp message
router.post("/whatsapp/send", async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      res.status(400).json({ error: "phone and message are required" });
      return;
    }

    if (!isValidPhone(phone)) {
      res.status(400).json({ error: "Invalid phone number format" });
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

// ═══════════════════════════════════════════════════════
//  BLACKLIST MANAGEMENT (COD Fraud Prevention)
// ═══════════════════════════════════════════════════════

// GET /api/admin/blacklist — list all blacklisted customers
router.get("/blacklist", async (req, res) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    const [countRes, result] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total FROM blacklisted_customers`),
      query(
        `SELECT bl.id, bl.phone, bl.email, bl.reason, bl.is_active, bl.created_at,
                u.name AS created_by_name
         FROM blacklisted_customers bl
         LEFT JOIN users u ON bl.created_by = u.id
         ORDER BY bl.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limitNum, offset]
      )
    ]);
    
    res.json({
      blacklist: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countRes.rows[0].total,
        totalPages: Math.ceil(countRes.rows[0].total / limitNum),
      }
    });
  } catch (error) {
    console.error("Admin blacklist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch blacklist" });
  }
});

// POST /api/admin/blacklist — add customer to blacklist
router.post("/blacklist", async (req, res) => {
  try {
    const { phone, email, reason } = req.body;

    if (!reason) {
      res.status(400).json({ error: "Reason is required" });
      return;
    }
    if (!phone && !email) {
      res.status(400).json({ error: "Phone or email is required" });
      return;
    }

    const result = await query(
      `INSERT INTO blacklisted_customers (phone, email, reason, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, phone, email, reason, created_at`,
      [phone || null, email?.toLowerCase() || null, reason, req.user!.id]
    );

    res.status(201).json({
      message: "Customer added to blacklist",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error("Admin blacklist add error:", error);
    res.status(500).json({ error: "Failed to add to blacklist" });
  }
});

// DELETE /api/admin/blacklist/:id — remove from blacklist
router.delete("/blacklist/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE blacklisted_customers SET is_active = false WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Blacklist entry not found" });
      return;
    }

    res.json({ message: "Customer removed from blacklist", id: result.rows[0].id });
  } catch (error) {
    console.error("Admin blacklist remove error:", error);
    res.status(500).json({ error: "Failed to remove from blacklist" });
  }
});

// ═══════════════════════════════════════════════════════
//  INVENTORY (Quick stock management)
// ═══════════════════════════════════════════════════════

// GET /api/admin/inventory — stock overview
router.get("/inventory", async (_req, res) => {
  try {
    const result = await query(
      `SELECT p.id, p.name, p.slug, p.price, p.stock_quantity, p.in_stock,
              c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.stock_quantity ASC`
    );

    const lowStock = result.rows.filter((p: any) => p.stock_quantity > 0 && p.stock_quantity <= 5);
    const outOfStock = result.rows.filter((p: any) => p.stock_quantity <= 0);

    res.json({
      products: result.rows,
      summary: {
        total: result.rows.length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
      },
      alerts: {
        lowStock: lowStock.map((p: any) => ({ id: p.id, name: p.name, stock: p.stock_quantity })),
        outOfStock: outOfStock.map((p: any) => ({ id: p.id, name: p.name })),
      },
    });
  } catch (error) {
    console.error("Admin inventory error:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// PUT /api/admin/inventory/:id — update stock for a product
router.put("/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || stock_quantity === null || stock_quantity < 0) {
      res.status(400).json({ error: "stock_quantity must be >= 0" });
      return;
    }

    const result = await query(
      `UPDATE products
       SET stock_quantity = $1,
           in_stock = $1 > 0
       WHERE id = $2
       RETURNING id, name, stock_quantity, in_stock`,
      [stock_quantity, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      message: "Stock updated",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Admin stock update error:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

export { router as adminRoutes };
