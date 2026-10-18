import React from 'react';

export function FilterPillGroup({
  options = [],
  activeId,
  onChange,
  className = ''
}) {
  return (
    <div className={`d-flex align-items-center gap-2 overflow-x-auto pb-1 ${className}`} style={{ scrollbarWidth: 'none' }}>
      {options.map((opt) => {
        const isActive = activeId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className="btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 text-nowrap fw-semibold border-0 transition-all"
            style={{
              backgroundColor: isActive ? 'var(--erp-primary)' : 'var(--bg-card)',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              border: `1px solid ${isActive ? 'var(--erp-primary)' : 'var(--border-light)'}`,
              fontSize: '0.85rem'
            }}
            onClick={() => onChange(opt.id)}
          >
            {opt.icon && <i className={`bi ${opt.icon}`} />}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className="badge rounded-pill ms-1"
                style={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-subtle)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.7rem'
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FilterPillGroup;
