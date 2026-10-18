import React, { useEffect } from 'react';

export function Modal({
  show,
  onClose,
  title,
  icon,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };
    if (show) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  if (!show) return null;

  const sizeClass = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }[size] || '';

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1055
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${sizeClass}`} role="document">
        <div className="modal-content erp-card-elevated border-0 shadow-xl erp-animate-fade-in" style={{ borderRadius: 'var(--radius-xl)' }}>
          {title && (
            <div className="modal-header border-bottom px-4 py-3 align-items-center" style={{ borderColor: 'var(--border-light)' }}>
              <div className="d-flex align-items-center gap-2">
                {icon && <i className={`bi ${icon} text-primary fs-5`} />}
                <h5 className="modal-title fw-bold erp-heading mb-0">{title}</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
          )}
          <div className="modal-body p-4">{children}</div>
          {footer && (
            <div className="modal-footer border-top px-4 py-3" style={{ borderColor: 'var(--border-light)' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
