export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const CATEGORY_COLORS: Record<string, string> = {
  'nodejs-core': '#22c55e',
  'frameworks': '#f472b6',
  'performance': '#f87171',
  'http': '#22d3ee',
  'async': '#facc15',
  'architecture': '#a78bfa',
  'testing': '#60a5fa'
};

export const GRAPH_LAYOUT = {
  name: 'cose',
  idealEdgeLength: () => 100,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: () => 400000,
  edgeElasticity: () => 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
} as const;
