import React from 'react';

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search filters or add a new record to get started.',
  icon = 'bi-inbox',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className = ''
}) {
  return (
    <div className={`card erp-card-elevated border-0 text-center py-5 px-4 my-3 ${className}`}>
      <div className="d-flex justify-content-center mb-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: 72,
            height: 72,
            backgroundColor: 'var(--erp-primary-subtle)',
            color: 'var(--erp-primary)',
            fontSize: '2rem'
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <h4 className="fw-bold erp-heading mb-2">{title}</h4>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: 460, fontSize: '0.95rem' }}>
        {description}
      </p>
      {(actionLabel || secondaryLabel) && (
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          {actionLabel && (
            <button
              type="button"
              className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
              onClick={onAction}
            >
              <i className="bi bi-plus-lg" />
              {actionLabel}
            </button>
          )}
          {secondaryLabel && (
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
