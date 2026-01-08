import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import cytoscape, { Core, NodeSingular } from 'cytoscape';
import type { Term, GraphData } from '../types';
import { CATEGORY_COLORS, GRAPH_LAYOUT } from '../constants';

interface GraphProps {
  graphData: GraphData | null;
  terms: Term[];
  onNodeSelect: (term: Term | null) => void;
}

export interface GraphRef {
  highlightNode: (nodeId: string) => void;
  resetHighlight: () => void;
  fitGraph: () => void;
  centerOnNode: (nodeId: string) => void;
}

export const Graph = forwardRef<GraphRef, GraphProps>(({ graphData, terms, onNodeSelect }, ref) => {
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightNode = useCallback((nodeId: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('highlighted faded');
    const node = cy.getElementById(nodeId);
    const neighborhood = node.neighborhood().add(node);
    cy.elements().addClass('faded');
    neighborhood.removeClass('faded').addClass('highlighted');
  }, []);

  const resetHighlight = useCallback(() => {
    cyRef.current?.elements().removeClass('highlighted faded');
  }, []);

  const fitGraph = useCallback(() => {
    cyRef.current?.fit(undefined, 30);
  }, []);

  const resetLayout = useCallback(() => {
    cyRef.current?.layout({
      ...GRAPH_LAYOUT,
      animate: true,
      animationDuration: 500
    }).run();
  }, []);

  const zoomIn = useCallback(() => {
    const cy = cyRef.current;
    if (cy) cy.zoom(cy.zoom() * 1.2);
  }, []);

  const zoomOut = useCallback(() => {
    const cy = cyRef.current;
    if (cy) cy.zoom(cy.zoom() / 1.2);
  }, []);

  const centerOnNode = useCallback((nodeId: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      highlightNode(nodeId);
      cy.animate({
        center: { eles: node },
        zoom: 1.5
      }, { duration: 300 });
    }
  }, [highlightNode]);

  useImperativeHandle(ref, () => ({
    highlightNode,
    resetHighlight,
    fitGraph,
    centerOnNode
  }), [highlightNode, resetHighlight, fitGraph, centerOnNode]);

  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...graphData.nodes, ...graphData.edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: NodeSingular) => CATEGORY_COLORS[ele.data('category')] || '#64748b',
            'label': 'data(label)',
            'color': '#e2e8f0',
            'font-size': '11px',
            'font-weight': 500,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 32,
            'height': 32,
            'border-width': 2,
            'border-color': '#1e293b',
            'text-wrap': 'wrap',
            'text-max-width': 90,
            'text-outline-color': '#0f172a',
            'text-outline-width': 2
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#818cf8',
            'width': 42,
            'height': 42
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#818cf8',
            'width': 38,
            'height': 38
          }
        },
        {
          selector: 'node.faded',
          style: {
            'opacity': 0.2
          }
        },
        {
          selector: 'node.hover',
          style: {
            'border-width': 3,
            'border-color': '#f8fafc',
            'width': 40,
            'height': 40,
            'z-index': 999
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#475569',
            'curve-style': 'bezier',
            'opacity': 0.5
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#818cf8',
            'width': 2,
            'opacity': 1
          }
        },
        {
          selector: 'edge.faded',
          style: {
            'opacity': 0.08
          }
        }
      ],
      layout: GRAPH_LAYOUT,
      minZoom: 0.2,
      maxZoom: 3
    });

    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id();
      const term = terms.find(t => t.id === nodeId);
      if (term) {
        onNodeSelect(term);
        highlightNode(nodeId);
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        onNodeSelect(null);
        resetHighlight();
      }
    });

    cy.on('mouseover', 'node', (evt) => {
      evt.target.addClass('hover');
    });

    cy.on('mouseout', 'node', (evt) => {
      evt.target.removeClass('hover');
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graphData, terms, onNodeSelect, highlightNode, resetHighlight]);

  return (
    <>
      <div className="graph-controls">
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
        <button onClick={fitGraph}>Центрировать</button>
        <button onClick={resetLayout}>Сброс</button>
        <span>{graphData?.nodes?.length || 0} терминов, {graphData?.edges?.length || 0} связей</span>
      </div>
      <div id="cy" ref={containerRef}></div>
    </>
  );
});

Graph.displayName = 'Graph';
