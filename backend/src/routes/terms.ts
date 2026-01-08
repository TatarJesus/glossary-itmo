import type { FastifyInstance, FastifyRequest } from 'fastify';
import { termSchema, errorSchema } from '../schemas.js';
import { getTerms, getTermById } from '../services/glossary.js';
import type { Term } from '../types.js';

interface TermsQuery {
  category?: string;
  search?: string;
}

interface TermParams {
  id: string;
}

export async function termsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/terms', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          search: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: termSchema
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: TermsQuery }>): Promise<Term[]> => {
    const { category, search } = request.query;
    return getTerms(category, search);
  });

  fastify.get('/api/terms/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: termSchema,
        404: errorSchema
      }
    }
  }, async (request: FastifyRequest<{ Params: TermParams }>, reply) => {
    const term = getTermById(request.params.id);

    if (!term) {
      reply.code(404);
      return { error: 'Term not found' };
    }

    return term;
  });
}
