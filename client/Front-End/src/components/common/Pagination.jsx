import React from 'react';

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let left = Math.max(2, currentPage - 1);
      let right = Math.min(totalPages - 1, currentPage + 1);

      if (left > 2) pages.push('...');
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-3 px-1 ${className}`}>
      <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.875rem' }}>
        <span>Showing <strong className="text-dark-emphasis">{startItem}</strong> to <strong className="text-dark-emphasis">{endItem}</strong> of <strong className="text-dark-emphasis">{totalItems}</strong> entries</span>
        {onPageSizeChange && (
          <div className="d-flex align-items-center gap-1 ms-2">
            <span>Show</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', paddingRight: '1.75rem' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <nav aria-label="Table pagination">
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link rounded-circle border-0 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous"
            >
              <i className="bi bi-chevron-left" />
            </button>
          </li>

          {getPageNumbers().map((page, idx) => (
            <li key={idx} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
              {page === '...' ? (
                <span className="page-link border-0 text-muted" style={{ width: 32, height: 32, textAlign: 'center', lineHeight: '32px', padding: 0 }}>...</span>
              ) : (
                <button
                  className={`page-link rounded-circle border-0 d-flex align-items-center justify-content-center ${page === currentPage ? 'fw-bold' : ''}`}
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: page === currentPage ? 'var(--erp-primary)' : 'transparent',
                    color: page === currentPage ? '#ffffff' : 'var(--text-main)'
                  }}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link rounded-circle border-0 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
