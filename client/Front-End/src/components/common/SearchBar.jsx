import React from 'react';

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search records...',
  className = '',
  shortcutBadge
}) {
  return (
    <div className={`position-relative d-flex align-items-center ${className}`}>
      <i
        className="bi bi-search position-absolute text-muted"
        style={{ left: 14, fontSize: '0.9rem', pointerEvents: 'none' }}
      />
      <input
        type="text"
        className="form-control rounded-pill ps-5 pe-5 py-2 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-light)',
          color: 'var(--text-main)',
          fontSize: '0.9rem'
        }}
      />
      {value ? (
        <button
          type="button"
          className="btn btn-link position-absolute end-0 me-2 p-0 text-muted border-0"
          style={{ width: 28, height: 28 }}
          onClick={() => {
            if (onClear) onClear();
            else if (onChange) onChange({ target: { value: '' } });
          }}
          aria-label="Clear search"
        >
          <i className="bi bi-x-circle-fill" />
        </button>
      ) : shortcutBadge ? (
        <span
          className="position-absolute end-0 me-3 px-1.5 py-0.5 rounded text-muted erp-mono"
          style={{
            fontSize: '0.7rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)'
          }}
        >
          {shortcutBadge}
        </span>
      ) : null}
    </div>
  );
}

export default SearchBar;
