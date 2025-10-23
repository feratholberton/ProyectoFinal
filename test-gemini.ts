import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY no definida en .env");
}

const gemini = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hola, ¿puedes responderme?");
    const response = await result.response.text();
    console.log("Respuesta de Gemini:", response);
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
  }
}

testGemini();
