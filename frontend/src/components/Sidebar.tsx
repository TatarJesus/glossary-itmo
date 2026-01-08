import type { Term, Category } from '../types';

interface SidebarProps {
  categories: Category[];
  terms: Term[];
  selectedTerm: Term | null;
  searchQuery: string;
  selectedCategory: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onTermSelect: (term: Term) => void;
}

export function Sidebar({
  categories,
  terms,
  selectedTerm,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onTermSelect
}: SidebarProps) {
  const filteredTerms = terms.filter(term => {
    const matchesSearch = !searchQuery ||
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск терминов..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="category-filter">
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="terms-list">
        {filteredTerms.length === 0 ? (
          <div className="no-results">
            Ничего не найдено
          </div>
        ) : (
          filteredTerms.map(term => (
            <div
              key={term.id}
              className={`term-item ${selectedTerm?.id === term.id ? 'selected' : ''}`}
              onClick={() => onTermSelect(term)}
            >
              <h3>{term.term}</h3>
              <p>{term.definition}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
