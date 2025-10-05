import type { FastifyInstance } from "fastify";
import { PartialState, simulateGeminiOptions, Option } from "../session.ts";
import { ConsultationController } from "../controller.ts";
import { getGeminiOptions } from "../ai/aiService.ts";
import { stringify } from "querystring";

// Compartir el mismo sessions map entre todos los endpoints
export const sessions = new Map<string, ConsultationController>();

export default function registerStartEndpoint(fastify: FastifyInstance) {
 
  fastify.post<{ Body: { motivo_consulta: string } }>(
    "/start",
    {
      schema: {
        description: "Crear una nueva consulta para un paciente",
        body: {
          type: "object",
          required: ["motivo_consulta"],
          properties: {
            motivo_consulta: { type: "string", description: "Motivo de la consulta" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              patientID: { type: "string", description: "ID único de la sesión" },
              pasoActual: { type: "string", description: "Paso inicial de la consulta" },
              opciones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    checked: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const { motivo_consulta } = req.body;
      // validación: que no sea string vacío o solo espacios
      if (!motivo_consulta || motivo_consulta.trim() === "") {
        return reply.status(400).send({ error: "Motivo de consulta requerido" });
      }
      const patientID = `${Date.now()}`;
      const controller = new ConsultationController(patientID);

      // llamo a gemini
      const opcionesGemini = await getGeminiOptions(motivo_consulta, "antecedentes");
      // formateo las opciones para que tengan formato label checked
      const opciones = opcionesGemini.map(label => ({ label, checked: false }));

      controller.savePartialState({ motivo_consulta, opciones });
      sessions.set(patientID, controller);
      return { patientID, pasoActual: controller.getCurrentStep(), opciones };
    }
  );
}
