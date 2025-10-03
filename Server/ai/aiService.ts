import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY no definida en .env");
}

export const gemini = new GoogleGenerativeAI(apiKey);

// Obtener opciones sugeridas por Gemini
export async function getGeminiOptions(motivo: string): Promise<string[]> {
    const prompt = `## Motivo de consulta\n${motivo}\n\nGenera 8 opciones relevantes para continuar la consulta médica. Devuelve solo una lista en texto plano.`;
    try {
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        const opciones = response
            .split("\n")
            .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
            .filter((line: string) => line.length > 0);
        return opciones.slice(0, 8);
    } catch (error) {
        console.error("Error llamando a Gemini:", error);
        return ["Error al obtener opciones de Gemini."];
    }
}

// Obtener un borrador clínico completo
export async function getGeminiDraft(contexto: string): Promise<string> {
    const prompt = `## Contexto clínico\n${contexto}\n\nGenera un borrador clínico estructurado en secciones (antecedentes, alergias, fármacos, anamnesis, examen físico, resumen). Devuelve solo el texto del borrador.`;
    try {
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        return await result.response.text();
    } catch (error) {
        console.error("Error generando borrador con Gemini:", error);
        return "Error al generar borrador clínico.";
    }
}
