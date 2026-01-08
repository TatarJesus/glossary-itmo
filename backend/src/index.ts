import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { loadGlossaryData } from './services/glossary.js';
import { registerRoutes } from './routes/index.js';

const fastify = Fastify({
  logger: true
});

async function start(): Promise<void> {
  try {
    await fastify.register(cors, config.cors);

    await loadGlossaryData();
    fastify.log.info('Glossary data loaded successfully');

    await registerRoutes(fastify);

    await fastify.listen({ port: config.port, host: config.host });
    fastify.log.info(`Server running at http://${config.host}:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
