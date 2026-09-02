import { Router } from "express";

const router = Router();

// In-memory data store for persistence without external dependencies
// Key: userId, Value: Array of productIds
const wishlists = new Map<string, string[]>();

// GET /api/wishlist/:userId
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const wishlist = wishlists.get(userId) || [];
  res.json({ wishlist });
});

// POST /api/wishlist
router.post("/", (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: "userId and productId are required" });
  }
  
  const userWishlist = wishlists.get(userId) || [];
  if (!userWishlist.includes(productId)) {
    userWishlist.push(productId);
    wishlists.set(userId, userWishlist);
  }
  
  res.status(201).json({ message: "Added to wishlist", wishlist: userWishlist });
});

// DELETE /api/wishlist/:userId/:productId
router.delete("/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;
  
  const userWishlist = wishlists.get(userId) || [];
  const updatedWishlist = userWishlist.filter(id => id !== productId);
  wishlists.set(userId, updatedWishlist);
  
  res.json({ message: "Removed from wishlist", wishlist: updatedWishlist });
});

export { router as wishlistRoutes };
