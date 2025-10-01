import type { FastifyInstance } from "fastify";
import { PartialState, simulateGeminiOptions, Option } from "../session.ts";
import { ConsultationController } from "../controller.ts";
import { sessions } from "./start.ts";

export default function registerCollectEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string; opciones: Option[] } }>(
    "/api/collect",
    {
      schema: {
        description: "Recibe opciones seleccionadas, actualiza el estado y devuelve nuevas opciones",
        body: {
          type: "object",
          required: ["id", "opciones"],
          properties: {
            id: { type: "string", description: "ID de la sesión" },
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
        response: {
          200: {
            type: "object",
            properties: {
              pasoActual: { type: "string" },
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
      const { id, opciones } = req.body;
      const controller = sessions.get(id);
      if (!controller) return reply.status(404).send({ error: "No existe la sesión" });
      controller.savePartialState({ opciones });
      const nuevasOpciones = simulateGeminiOptions(
        opciones.filter(o => o.checked).map(o => o.label).join(", ")
      );
      controller.savePartialState({ opciones: nuevasOpciones });
      return {
        pasoActual: controller.getCurrentStep(),
        opciones: nuevasOpciones,
      };
    }
  );
}
