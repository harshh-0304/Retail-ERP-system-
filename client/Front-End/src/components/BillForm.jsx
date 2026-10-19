import React, { useState, useEffect } from 'react';
import erpService from '../services/erpService';
import { formatCurrency } from '../utils/formatters';
import { calculateBillTotals } from '../utils/invoiceGenerator';

function BillForm({ onBillAdded, onCancel }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [billItems, setBillItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          erpService.getCustomers(),
          erpService.getProducts()
        ]);
        setCustomers(customersData || []);
        setProducts(productsData || []);
        if (customersData?.length) setSelectedCustomerId(String(customersData[0].id));
      } catch (err) {
        console.error("Failed to fetch data for BillForm:", err);
        setError("Failed to load catalog data. Using local memory store.");
      }
    };
    fetchData();
  }, []);

  const totals = calculateBillTotals(billItems, 0.08, discountPercent);

  const handleAddProduct = (productId) => {
    const prod = products.find(p => p.id === Number(productId));
    if (!prod) return;

    setBillItems(prev => {
      const exists = prev.find(item => item.productId === prod.id);
      if (exists) {
        return prev.map(item =>
          item.productId === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          priceAtSale: prod.price,
          unitPrice: prod.price,
          quantity: 1,
          availableStock: prod.stockQuantity
        }
      ];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setBillItems(prev =>
      prev
        .map(item => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setBillItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError("Please select a customer for this transaction.");
      return;
    }
    if (billItems.length === 0) {
      setError("Cart is empty. Please add at least one product.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const billPayload = {
      customerId: parseInt(selectedCustomerId, 10),
      billDate: new Date().toISOString(),
      totalAmount: totals.grandTotal,
      paymentMethod,
      items: billItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.priceAtSale,
        itemTotal: item.quantity * item.priceAtSale
      }))
    };

    try {
      await erpService.createBill(billPayload);
      setSuccess(true);
      if (onBillAdded) onBillAdded();
    } catch (err) {
      console.error("Failed to create bill:", err);
      setError(err.message || "Failed to record transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card erp-card-elevated border-0 p-4 mb-4 shadow-lg erp-animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-light)' }}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-2 erp-gradient-primary text-white"
            style={{ width: 34, height: 34 }}
          >
            <i className="bi bi-cart-check-fill" />
          </div>
          <div>
            <h4 className="h5 fw-bold erp-heading mb-0">POS Checkout &amp; Billing Terminal</h4>
            <small className="text-muted">Scan catalog items, apply discounts, and generate receipt</small>
          </div>
        </div>
        <button type="button" className="btn-close" onClick={onCancel} aria-label="Close" />
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
          <i className="bi bi-check-circle-fill" />
          <span>Transaction successfully recorded and billed!</span>
        </div>
      )}

      <div className="row g-4">
        {/* Left: Product Picker & Customer Selection */}
        <div className="col-12 col-lg-7">
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-7">
              <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Customer *</label>
              <select
                className="form-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.contact || c.email || 'Retail'})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Digital</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-semibold erp-heading" style={{ fontSize: '0.9rem' }}>Quick Add Catalog Item:</span>
            <small className="text-muted">{products.length} items available</small>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 g-2 mb-4" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {products.map(p => (
              <div key={p.id} className="col">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 text-start p-2.5 rounded-3 d-flex justify-content-between align-items-center erp-card-elevated"
                  onClick={() => handleAddProduct(p.id)}
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <div className="overflow-hidden pe-2">
                    <strong className="d-block text-truncate" style={{ fontSize: '0.85rem' }}>{p.name}</strong>
                    <small className="text-muted">{formatCurrency(p.price)} • Stock: {p.stockQuantity}</small>
                  </div>
                  <i className="bi bi-plus-circle text-primary fs-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Cart & Calculation Summary */}
        <div className="col-12 col-lg-5">
          <div className="card p-3 h-100 border erp-card-elevated" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-light)' }}>
              <span className="fw-bold erp-heading">Current Cart Items</span>
              <span className="badge bg-primary rounded-pill">{billItems.length} items</span>
            </div>

            {billItems.length === 0 ? (
              <div className="text-center py-5 text-muted my-auto">
                <i className="bi bi-cart-x fs-1 d-block mb-2" />
                <p className="mb-0 small">No items added to cart yet.<br />Click items on the left to add.</p>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-between flex-grow-1">
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {billItems.map(item => (
                    <div key={item.productId} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded bg-card border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                      <div className="overflow-hidden pe-2">
                        <strong className="d-block text-truncate" style={{ fontSize: '0.85rem' }}>{item.productName}</strong>
                        <small className="text-muted">{formatCurrency(item.priceAtSale)} each</small>
                      </div>

                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          className="btn btn-sm btn-light border p-1 rounded-circle"
                          style={{ width: 26, height: 26, lineHeight: 1 }}
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                        >
                          -
                        </button>
                        <span className="fw-bold erp-mono px-1" style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-light border p-1 rounded-circle"
                          style={{ width: 26, height: 26, lineHeight: 1 }}
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0 ms-1"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Grand Total */}
                <div className="pt-3 border-top mt-2" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal</span>
                    <span className="erp-mono">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                    <span>Discount (%)</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-control form-control-sm text-end p-1 erp-mono"
                      style={{ width: 64, height: 26 }}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>Estimated Tax (8%)</span>
                    <span className="erp-mono">{formatCurrency(totals.taxAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="h6 fw-bold erp-heading mb-0">Total Due</span>
                    <span className="h4 fw-bolder text-success erp-mono mb-0">
                      {formatCurrency(totals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light rounded-pill flex-grow-1"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success rounded-pill px-4 fw-semibold flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={handleSubmit}
                disabled={submitting || billItems.length === 0}
              >
                {submitting && <span className="spinner-border spinner-border-sm" role="status" />}
                <span>Checkout &amp; Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillForm;
