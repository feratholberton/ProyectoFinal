import { GoogleGenerativeAI } from "@google/generative-ai";
import { anamnesisPrompt } from "./anamnesisPrompt.ts";
import { prompts } from "./prompts.ts"
import { buildClinicalPrompt } from "./resumenPrompt.ts"
import dotenv from "dotenv";
import { PartialState } from "../session.ts";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY no definida en .env");
}

export const gemini = new GoogleGenerativeAI(apiKey);

// Obtener opciones sugeridas por Gemini
export async function getGeminiOptions(state: PartialState, tipo: string): Promise<string[]> {
    let prompt = "";
    switch (tipo) {
        case "antecedentes":
          prompt = prompts.antecedentes(state)
            break;

      case "alergias":
        prompt = prompts.alergias(state)
        break;
        
      case "farmacos":
        prompt = prompts.farmacos(state)
        break;

        case "anamnesis":
      prompt = prompts.anamnesis(state, anamnesisPrompt);
      break;

        case "examen_fisico":
        prompt = prompts.examen_fisico(state);
        break;

        default:
            prompt = JSON.stringify(state);
            break;
    
    }
    try {
        const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        let cleanedResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        let opciones: string[] = [];
        try {
            const parsed = JSON.parse(cleanedResponse);
            if (Array.isArray(parsed)) {
                opciones = parsed;
            } else {
                throw new Error("Not array");
            }
        } catch {
            // Fallback to splitting
            opciones = cleanedResponse
                .split("\n")
                .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
                .filter((line: string) => line.length > 0);
        }

        // limitar 8 opciones pero si es anamnesis mandar formulario hardcodeado
        if (tipo === "anamnesis") {
          return opciones;
        } else {
            return opciones.slice(0, 8);
        }       
    } catch (error) {
        console.error("Error llamando a Gemini:", error);
        return ["Error al obtener opciones de Gemini."];
    }
}

// Obtener un borrador clínico completo
export async function getGeminiResumen(state: PartialState): Promise<string> {
    const prompt = buildClinicalPrompt(state);
    try {
      const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      return await result.response.text();
    } catch (error) {
      console.error("Error generando resumen clinico con Gemini:", error);
      return "Error al generar el resumen clinico.";
    }
}
