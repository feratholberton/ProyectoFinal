import type { FastifyInstance } from "fastify";
import { Option } from "../session.ts";
import { getGeminiOptions } from "../ai/aiService.ts";
import { sessions } from "./start.ts";

export default function registerGeneratorEndpoint(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: string } }>(
    "/generator/:id",
    {
      schema: {
        description: "Generar opciones para el paso actual basado en partialState",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de la sesión" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
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
          404: {
            type: "object",
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const controller = sessions.get(id);
      if (!controller) return reply.status(404).send({ error: "No existe la sesión" });

      // Obtener el paso actual y partialState
      const tipo = controller.getCurrentStep();
      const state = controller.getPartialState();

      // Generar opciones usando getGeminiOptions (que usa prompts.ts, anamnesisPrompt.ts, etc.)
      const opcionesRaw = await getGeminiOptions(state, tipo);
      const opciones = opcionesRaw.map(label => ({ label, checked: false }));

      return { opciones };
    }
  );
}