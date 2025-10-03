import type { FastifyInstance } from "fastify";
import { PartialState } from "../session.ts";
import { ConsultationController } from "../controller.ts";
import { sessions } from "./start.ts";

export default function registerConsultaEndpoint(fastify: FastifyInstance) {
  // Actualizar estado y avanzar paso
  fastify.post<{ Body: PartialState; Params: { id: string } }>(
    "/consulta/:id",
    {
      schema: {
        description: "Actualizar los datos de un paso de la consulta y avanzar al siguiente",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de la sesión del paciente" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          description: "Datos parciales de la consulta a actualizar",
          properties: {
            motivo_consulta: { type: "string", description: "Motivo de la consulta" },
            antecedentes_personales: {
              type: "array",
              items: { type: "string" },
              description: "Lista de antecedentes personales",
            },
            alergias: { type: "array", items: { type: "string" }, description: "Lista de alergias" },
            farmacos_habituales: { type: "array", items: { type: "string" }, description: "Medicamentos habituales" },
            examen_fisico: { type: "string", description: "Resultados del examen físico" },
            resumen_clinico: { type: "string", description: "Resumen clínico del paciente" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              pasoActual: { type: "string", description: "Paso actual luego de actualizar" },
              partialState: { type: "object", description: "Estado completo acumulado de la consulta" },
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
      controller.savePartialState(req.body);
      controller.nextStep();
      return {
        pasoActual: controller.getCurrentStep(),
        partialState: controller.getPartialState(),
      };
    }
  );

  // Obtener estado actual
  fastify.get<{ Params: { id: string } }>(
    "/consulta/:id",
    {
      schema: {
        description: "Obtener el estado actual de la consulta",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de la sesión del paciente" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              pasoActual: { type: "string" },
              partialState: { type: "object" },
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
      return {
        pasoActual: controller.getCurrentStep(),
        partialState: controller.getPartialState(),
      };
    }
  );

  // Endpoint GET /consulta-test para probar el backend
  fastify.get("/consulta-test", async (req, reply) => {
    return {
      message: "ENDPOINT PARA PELADOS.",
      status: "ok",
    };
  });
}
