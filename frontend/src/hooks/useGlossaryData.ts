import { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import type { Term, Category, Metadata, GraphData } from '../types';

interface GlossaryData {
  metadata: Metadata | null;
  categories: Category[];
  terms: Term[];
  graphData: GraphData | null;
  loading: boolean;
  error: string | null;
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
        const [metaRes, catsRes, termsRes, graphRes] = await Promise.all([
          fetch(`${API_URL}/metadata`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/terms`),
          fetch(`${API_URL}/graph`)
        ]);

        if (!metaRes.ok || !catsRes.ok || !termsRes.ok || !graphRes.ok) {
          throw new Error('Failed to fetch data');
        }

        setMetadata(await metaRes.json());
        setCategories(await catsRes.json());
        setTerms(await termsRes.json());
        setGraphData(await graphRes.json());
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
