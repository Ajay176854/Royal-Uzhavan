import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, closePool } from "./db/pool.js";
import { productRoutes } from "./routes/products.js";
import { orderRoutes } from "./routes/orders.js";
import { authRoutes } from "./routes/auth.js";
import { contactRoutes } from "./routes/contact.js";
import { adminRoutes } from "./routes/admin.js";
import { wishlistRoutes } from "./routes/wishlist.js";
import { cartRoutes } from "./routes/cart.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";
import { getWhatsAppStatus } from "./services/whatsapp.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
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
    console.log(`   Contact:       /api/contact\n`);
    
    const waStatus = getWhatsAppStatus();
    console.log(`💬 WhatsApp API:  ${waStatus.configured ? '✅ Configured' : '❌ Not Configured'}`);
    if (waStatus.configured) {
      console.log(`                  Phone ID: ${waStatus.phoneNumberId}`);
    }
    console.log("");
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
