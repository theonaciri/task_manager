import React from 'react';
import Button from './Button';
import './Pagination.css';

const Pagination = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  loading = false
}) => {
  if (lastPage <= 1) return null;

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = lastPage - 4; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      <div className="pagination__info">
        Affichage de {startItem} à {endItem} sur {total} éléments
      </div>
      
      <div className="pagination__controls">
        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          ← Précédent
        </Button>

        <div className="pagination__pages">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "secondary"}
                size="small"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className="pagination__page-btn"
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="secondary"
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage || loading}
        >
          Suivant →
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
