// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\BillDetailModal.jsx
import React from 'react';
// Removed: import { Modal, Button } from 'react-bootstrap'; // No longer needed

function BillDetailModal({ bill, show, onHide }) {
  if (!bill) {
    return null; // Don't render if no bill is selected
  }

  // Determine modal display style based on 'show' prop
  const modalStyle = {
    display: show ? 'block' : 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  };

  // Add 'show' and 'd-block' classes when modal is visible
  const modalClassName = `modal fade ${show ? 'show d-block' : ''}`;

  return (
    <div className={modalClassName} tabIndex="-1" role="dialog" style={modalStyle}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Bill Details (ID: {bill.id})</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}
            </div>
            <div className="mb-3">
              <strong>Customer:</strong> {bill.customer ? `${bill.customer.name} (${bill.customer.contact})` : 'N/A'}
              {bill.customer && bill.customer.email && ` - ${bill.customer.email}`}
            </div>
            <div className="mb-4">
              <strong>Total Amount:</strong> <span className="text-success fw-bold">${bill.totalAmount ? bill.totalAmount.toFixed(2) : '0.00'}</span>
            </div>

            <h5>Items:</h5>
            {bill.items && bill.items.length > 0 ? (
              <ul className="list-group">
                {bill.items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.quantity}x</strong> {item.product ? item.product.name : 'Unknown Product'}
                      <br />
                      <small className="text-muted">
                        Unit Price: ${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}
                      </small>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      ${item.itemTotal ? item.itemTotal.toFixed(2) : '0.00'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No items in this bill.</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetailModal;
