import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, closePool } from "./db/pool.js";
import { productRoutes } from "./routes/products.js";
import { orderRoutes } from "./routes/orders.js";
import { aiRoutes } from "./routes/ai.js";
import { authRoutes } from "./routes/auth.js";
import { contactRoutes } from "./routes/contact.js";
import { adminRoutes } from "./routes/admin.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "healthy", app: "Royal Uzhavan API", version: "1.0.0" });
});

// Start server with DB connection check
async function start() {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error("⚠️  Server starting WITHOUT database connection.");
    console.error("   Run: npx tsx src/db/setup.ts to initialize the database.\n");
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Royal Uzhavan API running on http://localhost:${PORT}`);
    console.log(`📡 API routes:`);
    console.log(`   Auth:          /api/auth`);
    console.log(`   Products:      /api/products`);
    console.log(`   Orders:        /api/orders`);
    console.log(`   Contact:       /api/contact`);
    console.log(`   AI:            /api/ai\n`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\n🛑 Shutting down...");
    server.close();
    await closePool();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();
