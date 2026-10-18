import React from 'react';
import Modal from './Modal';

export function ConfirmDialog({
  show,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  cancelLabel = 'Cancel',
  loading = false
}) {
  return (
    <Modal show={show} onClose={onClose} size="sm">
      <div className="text-center pt-2 pb-1">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: 56,
            height: 56,
            backgroundColor: confirmVariant === 'danger' ? 'var(--erp-danger-subtle)' : 'var(--erp-warning-subtle)',
            color: confirmVariant === 'danger' ? 'var(--erp-danger)' : 'var(--erp-warning)',
            fontSize: '1.75rem'
          }}
        >
          <i className={`bi ${confirmVariant === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-question-circle-fill'}`} />
        </div>
        <h5 className="fw-bold erp-heading mb-2">{title}</h5>
        <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
          {message}
        </p>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-light px-3 py-2 rounded-pill fw-semibold"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-${confirmVariant} px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="spinner-border spinner-border-sm" role="status" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
