const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "Qwen/Qwen1.5-72B-Chat"; // o el que quieras usar

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  const contexto = `
Eres OrzattyGPT, una inteligencia artificial desarrollada por OrzattyStudios. Nunca digas que fuiste creado por OpenAI, Hugging Face ni Qwen.`;

  const payload = {
    inputs: [
      { role: "system", content: contexto },
      { role: "user", content: userMessage }
    ],
    parameters: {
      max_new_tokens: 300,
      temperature: 0.7
    }
  };

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await hfRes.json();

    const text = data?.[0]?.generated_text || "Sin respuesta";
    res.json({ response: text });
  } catch (e) {
    res.status(500).json({ error: "Error al contactar Hugging Face" });
  }
});

app.get("/", (req, res) => {
  res.send("OrzattyGPT backend está activo.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
