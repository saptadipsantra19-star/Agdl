import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare contents payload
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const config = {
        systemInstruction: `You are Gemini, an AI agricultural assistant for farmers. Keep answers concise, helpful, and directly related to farming, crops, weather, and yield optimization.
        
Current Context: ${context || 'Unknown'}

When the user asks to buy agricultural products, seeds, fertilizers, tools, or DL agricultural necessaries, you MUST provide direct search links to Amazon and Flipkart.
Format the links like this:
- [Product Name on Amazon](https://www.amazon.in/s?k=product+name)
- [Product Name on Flipkart](https://www.flipkart.com/search?q=product+name)`,
      };

      let response;
      let retries = 2;
      let delay = 1000;
      
      while (retries >= 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config
          });
          break; // Success!
        } catch (error: any) {
          if (retries === 0) {
            throw error; // All retries failed
          }
          
          if (error.status === 503 || error.message?.includes("503") || error.message?.includes("UNAVAILABLE") || error.message?.includes("high demand") || error.status === 429) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            retries--;
          } else {
            throw error;
          }
        }
      }

      res.json({ text: response?.text || "Sorry, I couldn't generate a response." });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
