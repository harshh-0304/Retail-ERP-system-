import React, { useState, useEffect } from 'react';
import erpService from '../services/erpService';

function CustomerForm({ onCustomerAdded, onCustomerUpdated, onCancel, initialData }) {
  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    email: '',
    tier: 'Regular',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setCustomer({
        name: initialData.name || '',
        contact: initialData.contact || '',
        email: initialData.email || '',
        tier: initialData.tier || 'Regular',
        address: initialData.address || ''
      });
    } else {
      setCustomer({
        name: '',
        contact: '',
        email: '',
        tier: 'Regular',
        address: ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!customer.name.trim() || !customer.contact.trim()) {
      setError("Customer Name and Contact phone number are required.");
      setSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await erpService.updateCustomer(initialData.id, { ...customer, id: initialData.id });
        setSuccess(true);
        if (onCustomerUpdated) onCustomerUpdated();
      } else {
        await erpService.createCustomer(customer);
        setSuccess(true);
        if (onCustomerAdded) onCustomerAdded();
      }
    } catch (err) {
      console.error("Failed to save customer:", err);
      setError(err.message || 'Error saving customer profile');
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
            <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus-fill'}`} />
          </div>
          <div>
            <h4 className="h5 fw-bold erp-heading mb-0">{isEditing ? `Edit Customer (${customer.name})` : 'Register New Client Profile'}</h4>
            <small className="text-muted">Enter contact info, account tier and billing address</small>
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
          <span>Customer profile successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g., Alexander Wright"
              value={customer.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Contact Phone *</label>
            <input
              type="tel"
              name="contact"
              className="form-control"
              placeholder="e.g., +1 (555) 234-5678"
              value={customer.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g., alex@company.com"
              value={customer.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Customer Tier</label>
            <select
              name="tier"
              className="form-select"
              value={customer.tier}
              onChange={handleChange}
            >
              <option value="Regular">Regular Customer</option>
              <option value="VIP">VIP Account</option>
              <option value="New">New Prospect</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Billing / Delivery Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="e.g., 742 Evergreen Terrace, Seattle, WA"
              value={customer.address}
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
            <span>{isEditing ? 'Save Changes' : 'Register Customer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
