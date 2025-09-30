
import Fastify from 'fastify';
import registerEndpoints from './endpoints.js';
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const fastify = Fastify({ logger: true });

(async () => {
  try {
    await registerEndpoints(fastify);
    await fastify.listen({ port: 10000, host: '0.0.0.0' });
    console.log(`Server listening at http://0.0.0.0:10000`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
})();
