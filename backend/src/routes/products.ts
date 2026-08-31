import { Router } from "express";

const router = Router();

// GET /api/products
router.get("/", (_req, res) => {
  // TODO: Connect to database
  res.json({ message: "Products endpoint ready" });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  // TODO: Fetch from database
  res.json({ message: `Product ${req.params.id} endpoint ready` });
});

export { router as productRoutes };
