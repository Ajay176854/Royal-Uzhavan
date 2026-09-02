import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { productRoutes } from "./routes/products";
import { orderRoutes } from "./routes/orders";
import { aiRoutes } from "./routes/ai";
import { wishlistRoutes } from "./routes/wishlist";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "healthy", app: "Royal Uzhavan API" });
});

app.listen(PORT, () => {
  console.log(`🚀 Royal Uzhavan API running on http://localhost:${PORT}`);
});
