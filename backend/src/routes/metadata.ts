import type { FastifyInstance } from 'fastify';
import { metadataSchema } from '../schemas.js';
import { getMetadata } from '../services/glossary.js';

export async function metadataRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/metadata', {
    schema: {
      response: {
        200: metadataSchema
      }
    }
  }, async () => {
    return getMetadata();
  });
}
