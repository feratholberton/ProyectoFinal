import type { FastifyInstance } from "fastify";
import registerStartEndpoint from "./start.js";
import registerCollectEndpoint from "./collect.js";
import registerConsultaEndpoint from "./consulta.js";
import registerEndEndpoint from "./end.js";
import registerConsultaTestEndpoint from "./consulta.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default async function registerEndpoints(fastify: FastifyInstance) {
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

  registerStartEndpoint(fastify);
  registerCollectEndpoint(fastify);
  registerConsultaEndpoint(fastify);
  registerEndEndpoint(fastify);
  registerConsultaTestEndpoint(fastify); // endpoint de testing
}
