import React from 'react';

const VARIANT_MAP = {
  success: {
    bg: 'var(--erp-success-subtle)',
    color: '#065f46',
    border: 'rgba(16, 185, 129, 0.25)',
    dot: '#10b981'
  },
  warning: {
    bg: 'var(--erp-warning-subtle)',
    color: '#92400e',
    border: 'rgba(245, 158, 11, 0.25)',
    dot: '#f59e0b'
  },
  danger: {
    bg: 'var(--erp-danger-subtle)',
    color: '#991b1b',
    border: 'rgba(239, 68, 68, 0.25)',
    dot: '#ef4444'
  },
  primary: {
    bg: 'var(--erp-primary-subtle)',
    color: '#3730a3',
    border: 'rgba(79, 70, 229, 0.25)',
    dot: '#4f46e5'
  },
  info: {
    bg: '#e0f2fe',
    color: '#075985',
    border: 'rgba(14, 165, 233, 0.25)',
    dot: '#0ea5e9'
  },
  secondary: {
    bg: 'var(--bg-subtle)',
    color: 'var(--text-muted)',
    border: 'var(--border-light)',
    dot: '#94a3b8'
  }
};

export function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  dot = false,
  pill = true,
  className = '',
  icon
}) {
  const current = VARIANT_MAP[variant] || VARIANT_MAP.secondary;
  const isSm = size === 'sm';

  return (
    <span
      className={`d-inline-flex align-items-center gap-1 erp-badge-text ${className}`}
      style={{
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        borderRadius: pill ? '9999px' : 'var(--radius-sm)',
        padding: isSm ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: isSm ? '0.7rem' : '0.75rem',
        lineHeight: 1.2
      }}
    >
      {dot && (
        <span
          style={{
            width: isSm ? 5 : 6,
            height: isSm ? 5 : 6,
            borderRadius: '50%',
            backgroundColor: current.dot,
            display: 'inline-block'
          }}
        />
      )}
      {icon && <i className={`${icon} me-1`} style={{ fontSize: isSm ? '0.7rem' : '0.75rem' }} />}
      {children}
    </span>
  );
}

export default Badge;
