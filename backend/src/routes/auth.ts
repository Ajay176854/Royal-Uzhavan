import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import { generateToken, requireAuth, isValidEmail, sanitizeString } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const cleanName = sanitizeString(name, 200);
    const cleanEmail = email.toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    if (password.length > 128) {
      res.status(400).json({ error: "Password is too long" });
      return;
    }

    // Check if user exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [
      cleanEmail,
    ]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, role, created_at`,
      [cleanName, cleanEmail, phone || null, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const result = await query(
      "SELECT id, name, email, phone, password_hash, role, address FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/profile (protected)
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, phone, role, address, created_at FROM users WHERE id = $1",
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/auth/profile (protected)
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address)
       WHERE id = $4
       RETURNING id, name, email, phone, role, address, updated_at`,
      [name || null, phone || null, address ? JSON.stringify(address) : null, req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "Profile updated",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export { router as authRoutes };
