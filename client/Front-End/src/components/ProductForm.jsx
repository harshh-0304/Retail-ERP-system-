// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\ProductForm.jsx
import React, { useState, useEffect } from 'react';

// ProductForm now accepts initialData (for editing) and callbacks for added/updated/cancel
function ProductForm({ onProductAdded, onProductUpdated, onCancel, initialData }) {
  const [product, setProduct] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    stockQuantity: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Determine if we are in editing mode
  const isEditing = !!initialData;

  // Confirm your backend's HTTP port here
  const API_URL = 'http://localhost:5219/api/products';

  // Effect to update form fields if initialData changes (e.g., when switching product to edit)
  useEffect(() => {
    setProduct(initialData || { name: '', description: '', price: '', stockQuantity: '' });
    setError(null); // Clear errors when data changes
    setSuccess(false); // Clear success when data changes
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!product.name || !product.price || !product.stockQuantity) {
      setError("Name, Price, and Stock Quantity are required.");
      setSubmitting(false);
      return;
    }

    // Convert price and stockQuantity to numbers
    const productToSend = {
      ...product,
      price: parseFloat(product.price),
      stockQuantity: parseInt(product.stockQuantity, 10)
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/${product.id}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const updatedOrNewProduct = await response.json();
      setSuccess(true);

      if (!isEditing) {
        setProduct({ name: '', description: '', price: '', stockQuantity: '' }); // Clear form only if adding new
        if (onProductAdded) {
          onProductAdded(updatedOrNewProduct); // Notify parent for new product
        }
      } else {
        if (onProductUpdated) {
          onProductUpdated(updatedOrNewProduct); // Notify parent for updated product
        }
      }

      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds

    } catch (err) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} product:`, err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-3">
      <h4 className="card-title text-primary mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h4>
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Product {isEditing ? 'updated' : 'added'} successfully!
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
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description || ''} // Handle null description
            onChange={handleChange}
            rows="3"
            disabled={submitting}
          ></textarea>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              id="stockQuantity"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">{isEditing ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : (
              isEditing ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
