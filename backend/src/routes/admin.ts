import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

// GET /api/admin/orders
// Fetch all orders with customer details
router.get("/orders", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, customer_name, customer_email, status, total, items, created_at, updated_at
       FROM orders
       ORDER BY created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT /api/admin/orders/:id/status
// Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const result = await query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING id, status, updated_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ message: "Order status updated", order: result.rows[0] });
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// GET /api/admin/feedbacks
// Fetch all contact messages
router.get("/feedbacks", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, subject, message, is_read, created_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );
    res.json({ feedbacks: result.rows });
  } catch (error) {
    console.error("Admin feedbacks fetch error:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// POST /api/admin/products
// Create a new product
router.post("/products", async (req, res) => {
  try {
    const {
      name,
      slug,
      price,
      original_price,
      discount,
      category_name, // Client passes category_name, we resolve ID
      animal_type,
      image,
      tags,
      variants,
      in_stock,
      description
    } = req.body;

    // Resolve category ID
    let category_id = null;
    if (category_name) {
      const catRes = await query(`SELECT id FROM categories WHERE name = $1`, [category_name]);
      if (catRes.rows.length > 0) {
        category_id = catRes.rows[0].id;
      }
    }

    const result = await query(
      `INSERT INTO products (
        name, slug, price, original_price, discount, category_id,
        animal_type, image, tags, variants, in_stock, description
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        name, slug, price, original_price, discount, category_id,
        animal_type, image, tags, variants, in_stock, description
      ]
    );

    res.status(201).json({ message: "Product created successfully", product_id: result.rows[0].id });
  } catch (error) {
    console.error("Admin product create error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/admin/products/:id
// Update an existing product
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
      description
    } = req.body;

    let category_id = null;
    if (category_name) {
      const catRes = await query(`SELECT id FROM categories WHERE name = $1`, [category_name]);
      if (catRes.rows.length > 0) {
        category_id = catRes.rows[0].id;
      }
    }

    const result = await query(
      `UPDATE products SET
        name = $1, slug = $2, price = $3, original_price = $4, discount = $5,
        category_id = $6, animal_type = $7, image = $8, tags = $9, variants = $10,
        in_stock = $11, description = $12
       WHERE id = $13
       RETURNING id`,
      [
        name, slug, price, original_price, discount, category_id,
        animal_type, image, tags, variants, in_stock, description, id
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product updated successfully", product_id: result.rows[0].id });
  } catch (error) {
    console.error("Admin product update error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

export { router as adminRoutes };
