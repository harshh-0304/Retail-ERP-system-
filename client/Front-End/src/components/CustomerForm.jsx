// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\CustomerForm.jsx
import React, { useState, useEffect } from 'react';

// CustomerForm now accepts initialData (for editing) and isEditing flag
function CustomerForm({ onCustomerAdded, onCustomerUpdated, onCancel, initialData }) {
  const [customer, setCustomer] = useState(initialData || {
    name: '',
    contact: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Determine if we are in editing mode
  const isEditing = !!initialData;

  // Confirm your backend's HTTP port here
  const API_URL = 'http://localhost:5219/api/customers';

  // Effect to update form fields if initialData changes (e.g., when switching customer to edit)
  useEffect(() => {
    setCustomer(initialData || { name: '', contact: '', email: '' });
    setError(null); // Clear errors when data changes
    setSuccess(false); // Clear success when data changes
  }, [initialData]);

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
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/${customer.id}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const updatedOrNewCustomer = await response.json();
      setSuccess(true);

      if (!isEditing) {
        setCustomer({ name: '', contact: '', email: '' }); // Clear form only if adding new
        if (onCustomerAdded) {
          onCustomerAdded(updatedOrNewCustomer); // Notify parent for new customer
        }
      } else {
        if (onCustomerUpdated) {
          onCustomerUpdated(updatedOrNewCustomer); // Notify parent for updated customer
        }
      }

      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds

    } catch (err) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} customer:`, err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-3">
      <h4 className="card-title text-info mb-4">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h4>
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Customer {isEditing ? 'updated' : 'added'} successfully!
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
            value={customer.email || ''} // Handle null email
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
                <span className="ms-2">{isEditing ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : (
              isEditing ? 'Update Customer' : 'Add Customer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
