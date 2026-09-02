import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

// POST /api/contact — submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [name, email.toLowerCase(), phone || null, subject || null, message]
    );

    res.status(201).json({
      message: "Message sent successfully! We'll get back to you soon.",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export { router as contactRoutes };
