import { useState, useEffect } from 'react';
import type { Term, Category, Metadata, GraphData } from '../types';

interface GlossaryData {
  metadata: Metadata | null;
  categories: Category[];
  terms: Term[];
  graphData: GraphData | null;
  loading: boolean;
  error: string | null;
}

interface GlossaryJSON {
  metadata: Metadata;
  categories: Category[];
  terms: Term[];
}

function buildGraphData(terms: Term[]): GraphData {
  const nodes = terms.map(term => ({
    data: {
      id: term.id,
      label: term.term,
      category: term.category,
      definition: term.definition
    }
  }));

  const edges: GraphData['edges'] = [];
  const termIds = new Set(terms.map(t => t.id));

  terms.forEach(term => {
    term.relatedTerms.forEach(relatedId => {
      if (termIds.has(relatedId)) {
        edges.push({
          data: {
            id: `${term.id}-${relatedId}`,
            source: term.id,
            target: relatedId
          }
        });
      }
    });
  });

  return { nodes, edges };
}

export function useGlossaryData(): GlossaryData {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}glossary.json`);

        if (!response.ok) {
          throw new Error('Failed to fetch glossary data');
        }

        const data: GlossaryJSON = await response.json();

        setMetadata(data.metadata);
        setCategories(data.categories);
        setTerms(data.terms);
        setGraphData(buildGraphData(data.terms));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { metadata, categories, terms, graphData, loading, error };
}
