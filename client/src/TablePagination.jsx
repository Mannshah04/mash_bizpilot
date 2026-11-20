import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Standard Reusable Table Pagination Component for BizzPilot ERP
 * Supports dark & light theme, page-size selection, and jump navigation.
 */
export function TablePagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`table-pagination-bar ${className}`}>
      <div className="table-pagination-left">
        <span className="table-pagination-info">
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="table-page-size-wrapper">
            <span className="table-page-size-label">Rows per page:</span>
            <select
              className="table-page-size-select"
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                if (onPageSizeChange) onPageSizeChange(newSize);
                if (onPageChange) onPageChange(1);
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="table-pagination-controls">
        <button
          type="button"
          className="table-page-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(1)}
          title="First Page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          type="button"
          className="table-page-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          title="Previous Page"
        >
          <ChevronLeft size={14} />
          <span className="page-btn-text">Prev</span>
        </button>

        <div className="table-page-numbers">
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="table-page-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`table-page-btn table-page-num ${p === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange && onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="table-page-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          title="Next Page"
        >
          <span className="page-btn-text">Next</span>
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="table-page-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(totalPages)}
          title="Last Page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

/**
 * Custom Hook for effortless pagination on any array of data
 */
export function useTablePagination(items = [], initialPageSize = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalItems = items?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Auto-reset page if search/filter shrinks total pages below currentPage
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = (items || []).slice(startIndex, startIndex + pageSize);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedItems,
    paginationProps: {
      currentPage,
      pageSize,
      totalItems,
      onPageChange: setCurrentPage,
      onPageSizeChange: setPageSize
    }
  };
}
