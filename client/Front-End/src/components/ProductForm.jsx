// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\ProductForm.jsx
import React, { useState } from 'react';

function ProductForm({ onProductAdded, onCancel }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = 'http://localhost:5219/api/products'; // Confirm your backend's HTTP port

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const newProduct = await response.json();
      setSuccess(true);
      setProduct({ name: '', description: '', price: '', stockQuantity: '' }); // Clear form
      if (onProductAdded) {
        onProductAdded(newProduct); // Notify parent component that a product was added
      }
      // Optionally hide the form after a short delay or on a button click
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-3">
      <h4 className="card-title text-primary mb-4">Add New Product</h4>
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Product added successfully!
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
            value={product.description}
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
                <span className="ms-2">Adding...</span>
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
