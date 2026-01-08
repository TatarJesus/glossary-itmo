export interface Source {
  title: string;
  url: string;
}

export interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms: string[];
  sources: Source[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Metadata {
  title: string;
  topic: string;
  author: string;
  version: string;
  lastUpdated: string;
}

export interface GlossaryData {
  metadata: Metadata;
  categories: Category[];
  terms: Term[];
}

export interface GraphNode {
  data: {
    id: string;
    label: string;
    category: string;
    definition: string;
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
