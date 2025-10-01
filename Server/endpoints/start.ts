import type { FastifyInstance } from "fastify";
import { PartialState, simulateGeminiOptions, Option } from "../session.ts";
import { ConsultationController } from "../controller.ts";

// Compartir el mismo sessions map entre todos los endpoints
export const sessions = new Map<string, ConsultationController>();

export default function registerStartEndpoint(fastify: FastifyInstance) {
  // Endpoint GET /start para navegadores
  fastify.get("/start", async (req, reply) => {
    return {
      message: "Usa POST /start para crear una nueva consulta. Este endpoint solo acepta POST para crear recursos.",
      status: "ok"
    };
  });

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
      const patientID = `${Date.now()}`;
      const controller = new ConsultationController(patientID);
      const opciones = simulateGeminiOptions(motivo_consulta);
      controller.savePartialState({ motivo_consulta, opciones });
      sessions.set(patientID, controller);
      return { patientID, pasoActual: controller.getCurrentStep(), opciones };
    }
  );
}
