import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db/pool.js";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  token_version?: number;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ─── JWT Secret — MUST be set in production ─────────────────────
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  console.error("       Set it in your .env or hosting provider.");
  process.exit(1);
}
const JWT_SECRET: string = process.env.JWT_SECRET;

/**
 * Generate a JWT token for a user.
 */
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, token_version: user.token_version || 1 },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Required auth middleware — rejects with 401 if no valid token.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthUser;
    
    // Check against DB to ensure token is not invalidated
    const userRes = await query("SELECT id, token_version FROM users WHERE id = $1", [decoded.id]);
    if (userRes.rows.length === 0) {
      res.status(401).json({ error: "User no longer exists" });
      return;
    }
    
    const dbUser = userRes.rows[0];
    if (dbUser.token_version !== decoded.token_version) {
      res.status(401).json({ error: "Session expired. Please log in again." });
      return;
    }
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Optional auth middleware — attaches user if token present, but doesn't reject.
 * Useful for routes that behave differently for logged-in vs guest users.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthUser;
      
      const userRes = await query("SELECT id, token_version FROM users WHERE id = $1", [decoded.id]);
      if (userRes.rows.length > 0 && userRes.rows[0].token_version === decoded.token_version) {
        req.user = decoded;
      }
    } catch {
      // Invalid token — proceed as guest
    }
  }

  next();
}

/**
 * Admin-only middleware — must be used after requireAuth.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

// ─── Validation Helpers ─────────────────────────────────────────

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 200;
}

/**
 * Validate Indian phone number format (10 digits, optionally prefixed with +91 or 91).
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Sanitize a string — trim and limit length.
 */
export function sanitizeString(value: string, maxLength: number = 200): string {
  return value.trim().slice(0, maxLength);
}
