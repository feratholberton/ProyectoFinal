import type { FastifyInstance } from "fastify";
import { sessions } from "./start.ts";
import { getGeminiResumen } from "../ai/aiService.ts"

export default function registerEndEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string } }>(
    "/api/end",
    {
      schema: {
        description: "Finaliza la consulta y devuelve un resumen clínico simulado",
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "ID de la sesión" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              resumen: { type: "string", description: "Resumen clínico generado" },
              partialState: { type: "object", description: "Estado final de la consulta" },
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
      const { id } = req.body;
      const controller = sessions.get(id);
      if (!controller) return reply.status(404).send({ error: "No existe la sesión" });
      const partialState = controller.getPartialState();
      const resumen = await getGeminiResumen(partialState);
      return { resumen, partialState };
    }
  );
}
