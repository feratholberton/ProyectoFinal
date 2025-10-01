// importar el sdk de gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

// leer api key desde las variables de entorno
const apiKey = process.env.GEMINI_API_KEY;

// inicializar cliente de gemini
export const gemini = new GoogleGenerativeAI(apiKey!);

// con esto voy a usar gemini para llamar a los métodos de la api de gemini

export async function getGeminiOptions(motivo: string) : Promise<string[]> {
    // transformar lo que viene en json a md
    const prompt = `## Motivo de consulta\n${motivo}\n\nGenera 8 opciones relevantes para continuar la consulta médica. Devuelve solo una lista en texto plano.`;

    // llamo a gemini
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response.txt();

    // procesar la respuesta para devolver un array de opciones
    const opciones = response
    .split('\n')
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim()) // quitar números y espacios
    .filter((line: string) => line.length > 0); // quitar lineas vacias

    // devolver solo 8 opciones
    return opciones.slice(0, 8);
}