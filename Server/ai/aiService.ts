import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY no definida en .env");
}

export const gemini = new GoogleGenerativeAI(apiKey);

// Obtener opciones sugeridas por Gemini
export async function getGeminiOptions(input: string, tipo: string): Promise<string[]> {
    let prompt = "";
    switch (tipo) {
        case "antecedentes":
            prompt = `Motivo de consulta: ${input}.
      Genera 8 posibles antecedentes relevantes para este motivo.
      Solo lista los antecedentes (2–5 palabras cada uno), sin texto adicional.`;
            break;
      
      case "alergias":
        prompt = `Antecedentes del paciente: ${input}.
      Genera posibles alergias farmacológicas o ambientales relevantes.
      Devuelve solo texto plano.`;
        break;

      case "farmacos":
        prompt = `Antecedentes: ${input}.
      Genera una lista de posibles fármacos habituales que podría usar este paciente.
      Devuelve solo texto plano.`;
        break;

        case "anamnesis":
      prompt = `Motivo de consulta: ${input}.
      Genera preguntas de anamnesis médica breves y relevantes para continuar la historia clínica.
      Devuelve solo texto plano.`;
      break;

        case "examen_fisico":
        prompt = `Contexto clínico: ${input}.
      Genera una lista de hallazgos posibles para el examen físico por sistemas.
      Devuelve solo texto plano.`;
        break;

        default:
            prompt = input;
            break;
    
    }
    try {
        const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
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
