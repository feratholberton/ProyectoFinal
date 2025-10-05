import type { FastifyInstance } from "fastify";
import { PartialState, Option } from "../session.ts";
import { getGeminiOptions } from "../ai/aiService.ts"
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

      // determino el prompt dinamicamente segun el paso
      const tipo = controller.getCurrentStep(); // devuelve antecedentes, alergias etc
      // construir el input para gemini a partir de las opciones seleccionadas
      const seleccionadas = opciones.filter( o => o.checked).map( o => o.label).join(", ");
      // obtener nuevas opciones desde gemini
      const nuevasOpcionesRaw = await getGeminiOptions(seleccionadas, tipo);

      // formatear nuevas opciones para que sean del tipo label/checked/false
      const nuevasOpciones = nuevasOpcionesRaw.map(label => ({ label, checked: false }));
      controller.savePartialState({ opciones: nuevasOpciones});

      return {
        pasoActual: tipo,
        opciones: nuevasOpciones,
      };
    }
  );
}
