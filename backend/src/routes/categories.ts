import type { FastifyInstance } from 'fastify';
import { categorySchema } from '../schemas.js';
import { getCategories } from '../services/glossary.js';
import type { Category } from '../types.js';

export async function categoriesRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/categories', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: categorySchema
        }
      }
    }
  }, async (): Promise<Category[]> => {
    return getCategories();
  });
}
