import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: req.body.message || "",
    });

    res.json({ response: response.text });
  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
});

export { router as aiRoutes };
