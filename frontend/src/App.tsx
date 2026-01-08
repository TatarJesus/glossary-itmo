import { useState, useRef, useCallback, useEffect } from 'react';
import { useGlossaryData } from './hooks/useGlossaryData';
import { Header, Sidebar, Graph, DetailPanel } from './components';
import type { GraphRef } from './components';
import type { Term } from './types';

type MobilePanel = 'list' | 'graph' | 'detail';

function App() {
  const { metadata, categories, terms, graphData, loading, error } = useGlossaryData();

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<MobilePanel>('list');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const graphRef = useRef<GraphRef>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTermSelect = useCallback((term: Term) => {
    setSelectedTerm(term);
    graphRef.current?.centerOnNode(term.id);
    if (isMobile) {
      setActivePanel('detail');
    }
  }, [isMobile]);

  const handleNodeSelect = useCallback((term: Term | null) => {
    setSelectedTerm(term);
    if (isMobile && term) {
      setActivePanel('detail');
    }
  }, [isMobile]);

  const handleRelatedTermClick = useCallback((termId: string) => {
    const term = terms.find(t => t.id === termId);
    if (term) {
      handleTermSelect(term);
    }
  }, [terms, handleTermSelect]);

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="loading">Ошибка: {error}</div>;
  }

  return (
    <div className="app">
      <Header metadata={metadata} />

      <main className="main-content">
        <div className={`sidebar ${activePanel === 'list' ? 'active' : ''}`}>
          <Sidebar
            categories={categories}
            terms={terms}
            selectedTerm={selectedTerm}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onTermSelect={handleTermSelect}
          />
        </div>

        <div className={`graph-container ${activePanel === 'graph' ? 'active' : ''}`}>
          <Graph
            ref={graphRef}
            graphData={graphData}
            terms={terms}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        <div className={`detail-panel ${activePanel === 'detail' ? 'active' : ''}`}>
          <DetailPanel
            term={selectedTerm}
            terms={terms}
            categories={categories}
            onRelatedTermClick={handleRelatedTermClick}
          />
        </div>
      </main>

      {isMobile && (
        <nav className="mobile-nav">
          <button
            className={`mobile-nav-btn ${activePanel === 'list' ? 'active' : ''}`}
            onClick={() => setActivePanel('list')}
          >
            <span className="mobile-nav-icon">📋</span>
            <span>Термины</span>
          </button>
          <button
            className={`mobile-nav-btn ${activePanel === 'graph' ? 'active' : ''}`}
            onClick={() => setActivePanel('graph')}
          >
            <span className="mobile-nav-icon">🔗</span>
            <span>Граф</span>
          </button>
          <button
            className={`mobile-nav-btn ${activePanel === 'detail' ? 'active' : ''}`}
            onClick={() => setActivePanel('detail')}
          >
            <span className="mobile-nav-icon">📖</span>
            <span>Детали</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;
