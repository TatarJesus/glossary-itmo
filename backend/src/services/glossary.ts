import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { GlossaryData, Term, Category, Metadata, GraphData, GraphNode, GraphEdge } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let glossaryData: GlossaryData | null = null;

export async function loadGlossaryData(): Promise<void> {
  const glossaryPath = join(__dirname, '..', '..', 'data', 'glossary.json');
  const data = await readFile(glossaryPath, 'utf-8');
  glossaryData = JSON.parse(data) as GlossaryData;
}

function ensureLoaded(): GlossaryData {
  if (!glossaryData) {
    throw new Error('Glossary data not loaded');
  }
  return glossaryData;
}

export function getMetadata(): Metadata & { totalTerms: number; totalCategories: number } {
  const data = ensureLoaded();
  return {
    ...data.metadata,
    totalTerms: data.terms.length,
    totalCategories: data.categories.length
  };
}

export function getCategories(): Category[] {
  return ensureLoaded().categories;
}

export function getTerms(category?: string, search?: string): Term[] {
  let terms = ensureLoaded().terms;

  if (category) {
    terms = terms.filter(t => t.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    terms = terms.filter(t =>
      t.term.toLowerCase().includes(searchLower) ||
      t.definition.toLowerCase().includes(searchLower)
    );
  }

  return terms;
}

export function getTermById(id: string): Term | undefined {
  return ensureLoaded().terms.find(t => t.id === id);
}

export function getGraphData(): GraphData {
  const data = ensureLoaded();

  const nodes: GraphNode[] = data.terms.map(term => ({
    data: {
      id: term.id,
      label: term.term,
      category: term.category,
      definition: term.definition
    }
  }));

  const edges: GraphEdge[] = [];
  const termIds = new Set(data.terms.map(t => t.id));
  const addedEdges = new Set<string>();

  data.terms.forEach(term => {
    if (term.relatedTerms) {
      term.relatedTerms.forEach(relatedId => {
        if (termIds.has(relatedId)) {
          const edgeId = [term.id, relatedId].sort().join('-');
          if (!addedEdges.has(edgeId)) {
            addedEdges.add(edgeId);
            edges.push({
              data: {
                id: edgeId,
                source: term.id,
                target: relatedId
              }
            });
          }
        }
      });
    }
  });

  return { nodes, edges };
}
