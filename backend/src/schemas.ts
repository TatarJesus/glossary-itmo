export const sourceSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    url: { type: 'string' }
  }
} as const;

export const termSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    term: { type: 'string' },
    definition: { type: 'string' },
    category: { type: 'string' },
    relatedTerms: { type: 'array', items: { type: 'string' } },
    sources: { type: 'array', items: sourceSchema }
  }
} as const;

export const categorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' }
  }
} as const;

export const metadataSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    topic: { type: 'string' },
    author: { type: 'string' },
    version: { type: 'string' },
    lastUpdated: { type: 'string' },
    totalTerms: { type: 'number' },
    totalCategories: { type: 'number' }
  }
} as const;

export const graphNodeSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        label: { type: 'string' },
        category: { type: 'string' },
        definition: { type: 'string' }
      }
    }
  }
} as const;

export const graphEdgeSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        source: { type: 'string' },
        target: { type: 'string' }
      }
    }
  }
} as const;

export const graphSchema = {
  type: 'object',
  properties: {
    nodes: { type: 'array', items: graphNodeSchema },
    edges: { type: 'array', items: graphEdgeSchema }
  }
} as const;

export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' }
  }
} as const;
