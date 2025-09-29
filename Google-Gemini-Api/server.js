const fastify = require('fastify')({ 
  logger: true,
  bodyLimit: 10485760 // 10MB
});
require('dotenv').config();

const GeminiClient = require('./utils/geminiClient');
const geminiClient = new GeminiClient();

// Registrar plugins
async function registerPlugins() {
  // CORS
  await fastify.register(require('@fastify/cors'), {
    origin: true
  });

  // Helmet para seguridad
  await fastify.register(require('@fastify/helmet'));
}

// Registrar rutas
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  });

  // POST /api/gemini/generate - Generar texto simple
  fastify.post('/api/gemini/generate', {
    schema: {
      body: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string' },
          options: {
            type: 'object',
            properties: {
              temperature: { type: 'number', minimum: 0, maximum: 2 },
              maxOutputTokens: { type: 'number', minimum: 1, maximum: 8192 },
              topP: { type: 'number', minimum: 0, maximum: 1 },
              topK: { type: 'number', minimum: 1 }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { prompt, options = {} } = request.body;

    try {
      const result = await geminiClient.generateText(prompt, options);
      return result;
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  });

  // POST /api/gemini/chat - Chat conversacional
  fastify.post('/api/gemini/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['messages'],
        properties: {
          messages: {
            type: 'array',
            items: {
              type: 'object',
              required: ['role', 'content'],
              properties: {
                role: { type: 'string', enum: ['user', 'assistant'] },
                content: { type: 'string' }
              }
            }
          },
          options: {
            type: 'object',
            properties: {
              temperature: { type: 'number', minimum: 0, maximum: 2 },
              maxOutputTokens: { type: 'number', minimum: 1, maximum: 8192 },
              topP: { type: 'number', minimum: 0, maximum: 1 },
              topK: { type: 'number', minimum: 1 }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { messages, options = {} } = request.body;

    if (!messages || messages.length === 0) {
      reply.status(400);
      return {
        success: false,
        error: 'Messages array is required and cannot be empty'
      };
    }

    try {
      const result = await geminiClient.generateChat(messages, options);
      return result;
    } catch (error) {
      reply.status(500);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  });
}

// Inicializar servidor
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`Fastify server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nShutting down CALVO Y GAY...');
  await fastify.close();
  process.exit(0);
});

start();