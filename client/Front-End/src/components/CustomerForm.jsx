// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\CustomerForm.jsx
import React, { useState } from 'react';

function CustomerForm({ onCustomerAdded, onCancel }) {
  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Confirm your backend's HTTP port here
  const API_URL = 'http://localhost:5219/api/customers';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!customer.name || !customer.contact) {
      setError("Name and Contact are required.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST', // This form is for adding new customers
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const newCustomer = await response.json();
      setSuccess(true);
      setCustomer({ name: '', contact: '', email: '' }); // Clear form
      if (onCustomerAdded) {
        onCustomerAdded(newCustomer); // Notify parent component that a customer was added
      }
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds

    } catch (err) {
      console.error("Failed to add customer:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-3">
      <h4 className="card-title text-info mb-4">Add New Customer</h4>
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Customer added successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact (Phone)</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            name="contact"
            value={customer.contact}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email (Optional)</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-info" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Adding...</span>
              </>
            ) : (
              'Add Customer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
