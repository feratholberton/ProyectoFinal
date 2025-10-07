import type { FastifyInstance } from "fastify";
import { PartialState } from "../session.ts";
import { ConsultationController } from "../controller.ts";
import { sessions } from "./start.ts";

export default function registerCollectEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string; opciones1: string[]; opciones2: string[]; opciones3: string[]; opciones4: string[]; opciones5: string[]; opciones6: string[]; opciones7: string[]; opciones8: string[] } }>(
    "/api/collect",
    {
      schema: {
        description: "Recibe opciones seleccionadas (8 campos separados) y las guarda en partialState",
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "ID de la sesión" },
            opciones1: { type: "array", items: { type: "string" }, description: "Opción 1 seleccionada" },
            opciones2: { type: "array", items: { type: "string" }, description: "Opción 2 seleccionada" },
            opciones3: { type: "array", items: { type: "string" }, description: "Opción 3 seleccionada" },
            opciones4: { type: "array", items: { type: "string" }, description: "Opción 4 seleccionada" },
            opciones5: { type: "array", items: { type: "string" }, description: "Opción 5 seleccionada" },
            opciones6: { type: "array", items: { type: "string" }, description: "Opción 6 seleccionada" },
            opciones7: { type: "array", items: { type: "string" }, description: "Opción 7 seleccionada" },
            opciones8: { type: "array", items: { type: "string" }, description: "Opción 8 seleccionada" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              partialState: { type: "object", description: "Estado parcial actualizado" },
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
      const { id, opciones1, opciones2, opciones3, opciones4, opciones5, opciones6, opciones7, opciones8 } = req.body;
      const controller = sessions.get(id);
      if (!controller) return reply.status(404).send({ error: "No existe la sesión" });

      // Recolectar opciones seleccionadas (solo las que tienen contenido y no son placeholders)
      const opciones: { label: string; checked: boolean }[] = [];
      [opciones1, opciones2, opciones3, opciones4, opciones5, opciones6, opciones7, opciones8].forEach((opt, index) => {
        if (opt && opt.length > 0 && opt[0] !== 'string') {
          opciones.push({ label: opt[0], checked: true });
        }
      });

      // Solo guardar las opciones seleccionadas en partialState
      controller.savePartialState({ opciones });

      return {
        partialState: controller.getPartialState(),
      };
    }
  );
}
