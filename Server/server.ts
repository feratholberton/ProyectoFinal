
import Fastify from 'fastify';
import registerEndpoints from './endpoints/index.js';
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import 'dotenv/config';

// inicializar instancia de Fastify
const fastify = Fastify({ logger: true });

// Configurar el swagger
(async () => {
  try {
    await registerEndpoints(fastify);
    const port = process.env.PORT ? Number(process.env.PORT) : 10000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening at http://0.0.0.0:${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
})();
