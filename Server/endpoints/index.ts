import type { FastifyInstance } from "fastify";
import registerStartEndpoint from "./start.ts";
import registerCollectEndpoint from "./collect.ts";
import registerConsultaEndpoint from "./consulta.ts";
import registerEndEndpoint from "./end.ts";
import registerGeneratorEndpoint from "./generator.ts";
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
  registerGeneratorEndpoint(fastify);
}
