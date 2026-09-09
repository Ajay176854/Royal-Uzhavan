import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { testConnection, closePool, checkHealth } from "./db/pool.js";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === "production";

// ─── Static Files ───────────────────────────────────────────────
// Serve the local uploads folder (used when STORAGE_PROVIDER=local)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Security Headers ───────────────────────────────────────────
app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// ─── CORS ────────────────────────────────────────────────────────
const allowedOrigins: string[] = [];
if (process.env.FRONTEND_URL) {
  // Support comma-separated origins for multiple frontends
  allowedOrigins.push(...process.env.FRONTEND_URL.split(",").map(s => s.trim()));
}
if (!isProduction) {
  allowedOrigins.push("http://localhost:3000", "http://localhost:5173");
}
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ─── Body Parsing (with size limit) ─────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Rate Limiting ──────────────────────────────────────────────

// Global rate limit: 200 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Strict rate limit for auth endpoints: 10 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});

// Strict rate limit for contact/order creation: 10 per 15 min
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// ─── Request Logger ─────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(
      JSON.stringify({
        level: logLevel,
        timestamp: new Date().toISOString(),
        requestId,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      })
    );
  });
  next();
});

// ─── Request Timeout (30 seconds) ───────────────────────────────
app.use((_req, res, next) => {
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: "Request timeout" });
    }
  });
  next();
});

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

app.post("/api/orders", createLimiter); // rate limit order creation
app.use("/api/orders", orderRoutes);

app.use("/api/contact", createLimiter);
app.use("/api/contact", contactRoutes);

app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get("/", async (_req, res) => {
  try {
    const dbOk = await checkHealth();
    const statusCode = dbOk ? 200 : 503;
    
    if (isProduction) {
      res.status(statusCode).json({ status: dbOk ? "healthy" : "unhealthy" });
    } else {
      res.status(statusCode).json({
        status: dbOk ? "healthy" : "degraded",
        app: "Royal Uzhavan API",
        version: "1.0.0",
        environment: "development",
        database: dbOk ? "connected" : "disconnected",
      });
    }
  } catch {
    res.status(503).json({ status: "unhealthy" });
  }
});

// ─── 404 Handler ────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(JSON.stringify({
    level: "ERROR",
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: isProduction ? undefined : err.stack,
  }));

  if (!res.headersSent) {
    res.status(500).json({
      error: isProduction ? "Internal server error" : err.message,
    });
  }
});

// ─── Start Server ───────────────────────────────────────────────
async function start() {
  // Validate required env vars
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error("⚠️  Server starting WITHOUT database connection.");
    console.error("   Run: npx tsx src/db/setup.ts to initialize the database.\n");
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Royal Uzhavan API running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
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
    console.log(`🛡️  Security:     Helmet ✅ | Rate Limiting ✅ | CORS ✅`);
    console.log("");
  });

  // Set server-level timeout
  server.timeout = 30000;
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\n🛑 Shutting down...");
    server.close();
    await closePool();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Catch unhandled rejections
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Promise Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    shutdown();
  });
}

start();
