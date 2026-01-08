import type { FastifyInstance } from 'fastify';
import { graphSchema } from '../schemas.js';
import { getGraphData } from '../services/glossary.js';
import type { GraphData } from '../types.js';

export async function graphRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/graph', {
    schema: {
      response: {
        200: graphSchema
      }
    }
  }, async (): Promise<GraphData> => {
    return getGraphData();
  });
}
