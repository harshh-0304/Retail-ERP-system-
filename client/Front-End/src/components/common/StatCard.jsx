import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon = 'bi-bar-chart-fill',
  iconColor = '#4f46e5',
  iconBg = 'rgba(79, 70, 229, 0.1)',
  trend,
  trendLabel = 'vs last period',
  onClick,
  className = ''
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div
      onClick={onClick}
      className={`card erp-card-elevated erp-hover-lift h-100 p-3 p-lg-4 border-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          {title}
        </span>
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: 44,
            height: 44,
            backgroundColor: iconBg,
            color: iconColor,
            fontSize: '1.25rem'
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>

      <div className="mb-2">
        <h3 className="h2 fw-bolder mb-0 erp-heading" style={{ letterSpacing: '-0.03em' }}>
          {value}
        </h3>
      </div>

      <div className="d-flex align-items-center flex-wrap gap-2 pt-1">
        {trend !== undefined && trend !== null && (
          <span
            className="d-inline-flex align-items-center gap-1 fw-bold px-2 py-0.5 rounded-pill"
            style={{
              fontSize: '0.75rem',
              backgroundColor: isPositive ? 'var(--erp-success-subtle)' : isNegative ? 'var(--erp-danger-subtle)' : 'var(--bg-subtle)',
              color: isPositive ? '#065f46' : isNegative ? '#991b1b' : 'var(--text-muted)'
            }}
          >
            <i className={`bi ${isPositive ? 'bi-arrow-up-right' : isNegative ? 'bi-arrow-down-right' : 'bi-dash'}`} />
            {Math.abs(trend)}%
          </span>
        )}
        {(subtitle || trendLabel) && (
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            {subtitle || trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
