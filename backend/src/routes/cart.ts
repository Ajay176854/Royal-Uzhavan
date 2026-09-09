import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

// GET /api/cart — fetch user's cart with product details
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT ci.id AS cart_item_id, ci.quantity, ci.selected_variant,
              p.id AS product_id, p.slug, p.name, p.price, p.original_price,
              p.discount, p.rating, p.reviews, p.image, p.tags, p.variants,
              p.in_stock, p.description, c.name AS category
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [req.user!.id]
    );

    // Calculate totals
    const items = result.rows;
    const cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum: number, item: any) => {
      const variantMultiplier = item.selected_variant;
      const baseVariant = item.variants?.[0] || 1;
      const effectivePrice = parseFloat(item.price) * (variantMultiplier / baseVariant);
      return sum + effectivePrice * item.quantity;
    }, 0);

    res.json({ items, cartCount, cartTotal });
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart — add item to cart (or increment quantity if exists)
router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariant = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    // Verify product exists
    const productCheck = await query("SELECT id FROM products WHERE id = $1", [productId]);
    if (productCheck.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Upsert — if same product+variant exists, increment quantity
    const result = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity, selected_variant)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, product_id, selected_variant)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                     updated_at = NOW()
       RETURNING id, quantity`,
      [req.user!.id, productId, quantity, selectedVariant]
    );

    res.status(201).json({
      message: "Added to cart",
      cartItem: result.rows[0],
    });
  } catch (error) {
    console.error("Cart add error:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PUT /api/cart/:itemId — update quantity of a cart item
router.put("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ error: "Quantity must be at least 1" });
      return;
    }

    const result = await query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING id, quantity`,
      [quantity, itemId, req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    res.json({ message: "Cart updated", cartItem: result.rows[0] });
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// DELETE /api/cart/:itemId — remove a single item from cart
router.delete("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    await query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
      [itemId, req.user!.id]
    );

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Cart remove error:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// DELETE /api/cart — clear entire cart
router.delete("/", async (req, res) => {
  try {
    await query("DELETE FROM cart_items WHERE user_id = $1", [req.user!.id]);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Cart clear error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export { router as cartRoutes };
