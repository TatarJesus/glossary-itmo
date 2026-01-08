import type { Term, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DetailPanelProps {
  term: Term | null;
  terms: Term[];
  categories: Category[];
  onRelatedTermClick: (termId: string) => void;
}

export function DetailPanel({ term, terms, categories, onRelatedTermClick }: DetailPanelProps) {
  if (!term) {
    return (
      <div className="empty-state">
        Выберите термин для просмотра
      </div>
    );
  }

  const getCategoryName = (categoryId: string): string => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  return (
    <div className="detail-content">
      <h2>{term.term}</h2>
      <span
        className="detail-category"
        style={{
          background: `${CATEGORY_COLORS[term.category]}20`,
          color: CATEGORY_COLORS[term.category]
        }}
      >
        {getCategoryName(term.category)}
      </span>

      <div className="detail-section">
        <h4>Определение</h4>
        <p>{term.definition}</p>
      </div>

      {term.relatedTerms?.length > 0 && (
        <div className="detail-section">
          <h4>Связанные термины</h4>
          <div className="related-terms">
            {term.relatedTerms.map(relId => {
              const relTerm = terms.find(t => t.id === relId);
              return relTerm ? (
                <span
                  key={relId}
                  className="related-term"
                  onClick={() => onRelatedTermClick(relId)}
                >
                  {relTerm.term}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {term.sources?.length > 0 && (
        <div className="detail-section">
          <h4>Источники</h4>
          <ul className="sources-list">
            {term.sources.map((source, idx) => (
              <li key={idx}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
