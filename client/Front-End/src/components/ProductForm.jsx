import React, { useState, useEffect } from 'react';
import erpService from '../services/erpService';
import Badge from './common/Badge';
import { formatCurrency } from '../utils/formatters';

const CATEGORIES = ['Electronics', 'Audio', 'Furniture', 'Accessories', 'Lighting', 'Appliances', 'General'];

function ProductForm({ onProductAdded, onProductUpdated, onCancel, initialData }) {
  const [product, setProduct] = useState({
    name: '',
    category: 'Electronics',
    description: '',
    price: '',
    stockQuantity: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        category: initialData.category || 'Electronics',
        price: String(initialData.price ?? ''),
        stockQuantity: String(initialData.stockQuantity ?? '')
      });
    } else {
      setProduct({
        name: '',
        category: 'Electronics',
        description: '',
        price: '',
        stockQuantity: ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!product.name?.trim()) {
      setError("Product Name is required.");
      setSubmitting(false);
      return;
    }

    const priceNum = parseFloat(product.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please provide a valid unit price greater than $0.00.");
      setSubmitting(false);
      return;
    }

    const stockNum = parseInt(product.stockQuantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Stock Quantity must be 0 or greater.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...product,
      name: product.name.trim(),
      category: product.category,
      description: product.description?.trim() || '',
      price: priceNum,
      stockQuantity: stockNum
    };

    try {
      if (isEditing) {
        await erpService.updateProduct(product.id, payload);
        setSuccess(true);
        if (onProductUpdated) onProductUpdated();
      } else {
        await erpService.createProduct(payload);
        setSuccess(true);
        if (onProductAdded) onProductAdded();
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      setError(err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card erp-card-elevated border-0 p-4 mb-4 erp-animate-fade-in shadow-md">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-light)' }}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-2 erp-gradient-primary text-white"
            style={{ width: 34, height: 34 }}
          >
            <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-box-seam'}`} />
          </div>
          <div>
            <h4 className="h5 fw-bold erp-heading mb-0">{isEditing ? `Edit Product (SKU #${product.id})` : 'Create Inventory Product'}</h4>
            <small className="text-muted">Enter specifications, pricing and initial stock</small>
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
          <span>Product successfully saved to catalog!</span>
        </div>
      )}

      <div className="row g-4">
        {/* Form Fields */}
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Product Title *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g., Wireless Mechanical Keyboard"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={product.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Unit Price ($) *</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    className="form-control"
                    placeholder="0.00"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Available Stock Units *</label>
                <input
                  type="number"
                  min="0"
                  name="stockQuantity"
                  className="form-control"
                  placeholder="e.g., 50"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Description &amp; Specifications</label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-control"
                  placeholder="Brief summary of product features, dimensions, or compatibility..."
                  value={product.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top" style={{ borderColor: 'var(--border-light)' }}>
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 fw-semibold"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                disabled={submitting}
              >
                {submitting && <span className="spinner-border spinner-border-sm" role="status" />}
                <span>{isEditing ? 'Save Changes' : 'Add to Inventory'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="col-12 col-lg-4">
          <div className="card h-100 p-3 bg-subtle border erp-card-elevated" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <span className="text-uppercase text-muted fw-bold erp-badge-text mb-3 d-block">
              Live Catalog Preview
            </span>
            <div className="card erp-card-elevated p-3 border-0 flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill erp-badge-text">
                    {product.category || 'Category'}
                  </span>
                  <Badge variant={Number(product.stockQuantity) < 10 ? 'warning' : 'success'} dot size="sm">
                    {Number(product.stockQuantity) || 0} in stock
                  </Badge>
                </div>
                <h5 className="fw-bold erp-heading mb-1">{product.name || 'Product Title'}</h5>
                <p className="text-muted small mb-3">
                  {product.description || 'Product details will appear here as you type...'}
                </p>
              </div>
              <div className="pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-light)' }}>
                <span className="h5 fw-bolder text-primary mb-0 erp-mono">
                  {formatCurrency(Number(product.price) || 0)}
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>SKU #{product.id || 'NEW'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
