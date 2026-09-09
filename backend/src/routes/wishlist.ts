import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All wishlist routes require authentication
router.use(requireAuth);

// GET /api/wishlist — fetch user's wishlist with product details
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT w.id AS wishlist_id, w.created_at AS wishlisted_at,
              p.id, p.slug, p.name, p.price, p.original_price, p.discount,
              p.rating, p.reviews, p.image, p.tags, p.variants, p.in_stock,
              p.description, c.name AS category
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user!.id]
    );

    res.json({ wishlist: result.rows });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist/:productId — add product to wishlist
router.post("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const productCheck = await query("SELECT id FROM products WHERE id = $1", [productId]);
    if (productCheck.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Upsert — ignore if already exists
    await query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [req.user!.id, productId]
    );

    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Wishlist add error:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/:productId — remove from wishlist
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    await query(
      "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [req.user!.id, productId]
    );

    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export { router as wishlistRoutes };
