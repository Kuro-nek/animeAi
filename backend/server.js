import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Direct API key
const genAI = new GoogleGenerativeAI("AIzaSyCq0K5eekFmnWy_6qSX0pSRLPp7MM8CSQg");

// Model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  try {

    // Validate message
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    // Gemini API call with correct format
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

app.listen(8000, () => {
  console.log("✅ Server running at http://localhost:8000");
});
