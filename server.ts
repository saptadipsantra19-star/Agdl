import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Diagnosis Route
  app.post("/api/diagnose", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      const cropType = req.body.cropType;
      if (!cropType) {
        return res.status(400).json({ error: "Crop type is required" });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      };

      const prompt = `You are an expert plant pathologist. I am providing an image of a leaf from a ${cropType} plant. Please analyze this image and output ONLY a valid JSON object matching this schema (do NOT include markdown codeblocks or any other text):
{
  "disease": "Name of the disease (or 'Healthy')",
  "confidence": "High, Medium, or Low",
  "treatment": ["Action step 1", "Action step 2"]
}`;

      const fallbackModels = [
        "gemini-3.7-flash",
        "gemini-3.6-flash"
      ];

      let response;
      let lastError;
      
      for (const modelName of fallbackModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
              responseMimeType: "application/json"
            }
          });
          break; // Success!
        } catch (error: any) {
          console.warn(`Model ${modelName} failed, trying next...`);
          lastError = error;
        }
      }

      if (!response) {
        throw lastError;
      }

      let diagnosisData;
      try {
        const rawText = response.text || "{}";
        diagnosisData = JSON.parse(rawText);
      } catch (parseError) {
        console.error("JSON parse error from Gemini output:", parseError);
        diagnosisData = {
          disease: "Analysis Complete",
          confidence: "Medium",
          treatment: [response.text || "Could not parse analysis."]
        };
      }

      res.json({ diagnosis: diagnosisData });
    } catch (error: any) {
      console.error("Diagnosis Error:", error);
      let errorMessage = "Failed to analyze image. Please try again.";
      if (error.message) {
        try {
           const parsed = JSON.parse(error.message);
           if (parsed.error && parsed.error.message) errorMessage = parsed.error.message;
        } catch(e) {
           errorMessage = error.message;
        }
      }
      res.status(500).json({ error: errorMessage });
    }
  });

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

      const fallbackModels = [
        "gemini-3.7-flash",
        "gemini-3.6-flash"
      ];

      let response;
      let lastError;
      
      for (const modelName of fallbackModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config
          });
          break; // Success!
        } catch (error: any) {
          console.warn(`Model ${modelName} failed, trying next...`);
          lastError = error;
        }
      }

      if (!response) {
        throw lastError;
      }

      res.json({ text: response.text || "Sorry, I couldn't generate a response." });
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
