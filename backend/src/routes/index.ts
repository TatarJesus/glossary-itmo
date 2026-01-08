import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { metadataRoutes } from './metadata.js';
import { categoriesRoutes } from './categories.js';
import { termsRoutes } from './terms.js';
import { graphRoutes } from './graph.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(healthRoutes);
  await fastify.register(metadataRoutes);
  await fastify.register(categoriesRoutes);
  await fastify.register(termsRoutes);
  await fastify.register(graphRoutes);
}
