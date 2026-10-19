import React from 'react';
import Badge from './common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateInvoiceNumber } from '../utils/invoiceGenerator';

function BillDetailModal({ bill, show, onHide }) {
  if (!bill || !show) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = generateInvoiceNumber(bill.id, bill.billDate);
  const items = bill.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.itemTotal) || (Number(item.quantity) * Number(item.unitPrice)) || 0), 0);
  const grandTotal = Number(bill.totalAmount) || subtotal;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1060
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onHide();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content erp-card-elevated border-0 shadow-2xl erp-animate-fade-in overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
          {/* Action Header */}
          <div className="modal-header border-bottom px-4 py-3 align-items-center no-print" style={{ borderColor: 'var(--border-light)' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-text-fill text-primary fs-5" />
              <h5 className="modal-title fw-bold erp-heading mb-0">Official Tax Invoice ({invoiceNumber})</h5>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm"
                onClick={handlePrint}
              >
                <i className="bi bi-printer-fill" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              />
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="modal-body p-4 p-md-5 erp-printable-area">
            {/* Top Company & Invoice Meta */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start pb-4 border-bottom mb-4" style={{ borderColor: 'var(--border-light)' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 erp-gradient-primary text-white"
                    style={{ width: 36, height: 36 }}
                  >
                    <i className="bi bi-shop fs-5" />
                  </div>
                  <h4 className="fw-bolder erp-heading mb-0">Retail ERP Suite Inc.</h4>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  100 Enterprise Boulevard, Suite 400<br />
                  Tech District, Seattle, WA 98101<br />
                  Tax ID: <span className="erp-mono">US-9821-RET-01</span>
                </p>
              </div>

              <div className="text-sm-end mt-3 mt-sm-0">
                <span className="badge bg-success-subtle text-success-emphasis rounded-pill erp-badge-text mb-2">
                  OFFICIAL RECEIPT
                </span>
                <h5 className="erp-mono fw-bold text-primary mb-1">{invoiceNumber}</h5>
                <p className="text-muted small mb-0">
                  Date: <strong className="text-dark-emphasis">{formatDate(bill.billDate, 'full')}</strong><br />
                  Payment: <strong>{bill.paymentMethod || 'Credit Card'}</strong>
                </p>
              </div>
            </div>

            {/* Billed To Customer */}
            <div className="row mb-4">
              <div className="col-12 col-sm-6">
                <span className="text-muted text-uppercase fw-semibold erp-badge-text d-block mb-1">
                  Billed To Customer:
                </span>
                <h6 className="fw-bold erp-heading mb-1">{bill.customer?.name || 'Walk-in Retail Customer'}</h6>
                <p className="text-muted small mb-0">
                  {bill.customer?.contact && <span>Phone: {bill.customer.contact}<br /></span>}
                  {bill.customer?.email && <span>Email: {bill.customer.email}<br /></span>}
                  {bill.customer?.address || 'Over-the-counter POS Sale'}
                </p>
              </div>
              <div className="col-12 col-sm-6 text-sm-end mt-3 mt-sm-0">
                <span className="text-muted text-uppercase fw-semibold erp-badge-text d-block mb-1">
                  Payment Status:
                </span>
                <Badge variant="success" dot size="md">
                  Paid in Full
                </Badge>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table align-middle">
                <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <tr className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th className="ps-3">Item Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end pe-3">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        Standard POS Line Item Transaction
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => {
                      const qty = Number(item.quantity) || 1;
                      const unit = Number(item.unitPrice) || 0;
                      const total = Number(item.itemTotal) || (qty * unit);
                      return (
                        <tr key={idx}>
                          <td className="ps-3">
                            <strong className="d-block">{item.product?.name || `Catalog Item #${item.productId || idx + 1}`}</strong>
                            <small className="text-muted">SKU-{String(item.productId || idx + 1).padStart(4, '0')}</small>
                          </td>
                          <td className="text-center fw-semibold erp-mono">{qty}</td>
                          <td className="text-end erp-mono text-muted">{formatCurrency(unit)}</td>
                          <td className="text-end pe-3 fw-bold erp-mono text-dark-emphasis">{formatCurrency(total)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="d-flex justify-content-end mb-4">
              <div style={{ minWidth: 260 }}>
                <div className="d-flex justify-content-between text-muted small mb-1.5">
                  <span>Subtotal:</span>
                  <span className="erp-mono">{formatCurrency(subtotal || grandTotal)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-1.5">
                  <span>Tax (Inclusive):</span>
                  <span className="erp-mono">$0.00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <strong className="h6 erp-heading mb-0">Grand Total:</strong>
                  <strong className="h4 text-success erp-mono mb-0">{formatCurrency(grandTotal)}</strong>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-muted small pt-3 border-top" style={{ borderColor: 'var(--border-light)' }}>
              <p className="mb-0">Thank you for your business! For inquiries, email support@retailerp.internal</p>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="modal-footer border-top px-4 py-3 no-print" style={{ borderColor: 'var(--border-light)' }}>
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>
              Close
            </button>
            <button type="button" className="btn btn-primary rounded-pill px-4 fw-semibold" onClick={handlePrint}>
              <i className="bi bi-printer me-1.5" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetailModal;
