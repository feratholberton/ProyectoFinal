import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { ConsultationController, PartialState } from "./session.ts";

const sessions = new Map<string, ConsultationController>();

export default async function registerEndpoints(fastify: FastifyInstance) {
  // Registrar Swagger
  await fastify.register(swagger, {
    openapi: {
      info: { title: "Elio", version: "1.0.0", description: "API de testing" },
      servers: [{ url: "http://localhost:10000", description: "Servidor local" }],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list" },
  });

  // -----------------------------
  // Crear nueva sesión
  // -----------------------------
  fastify.post(
    "/start",
    {
      schema: {
        description: "Crear una nueva consulta para un paciente",
        response: {
          200: {
            type: "object",
            properties: {
              patientID: { type: "string", description: "ID único de la sesión" },
              pasoActual: { type: "string", description: "Paso inicial de la consulta" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const patientID = `${Date.now()}`;
      const controller = new ConsultationController(patientID);
      sessions.set(patientID, controller);
      return { patientID, pasoActual: controller.getCurrentStep() };
    }
  );

  // -----------------------------
  // Actualizar estado y avanzar paso
  // -----------------------------
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

  // -----------------------------
  // Obtener estado actual
  // -----------------------------
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

  // -----------------------------
  // Ruta de prueba
  // -----------------------------
  fastify.get("/", async () => ({ hello: "world" }));
}
