// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\ProductsPage.jsx
import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function ProductsPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited
  const [refreshProducts, setRefreshProducts] = useState(0); // State to trigger ProductList refresh

  // States for search and filter input fields (controlled by user typing)
  const [searchTerm, setSearchTerm] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');

  // States for *applied* search and filter terms (only update on button click)
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedMinStockFilter, setAppliedMinStockFilter] = useState('');


  const handleProductAdded = () => {
    setShowProductForm(false); // Hide form after adding
    setEditingProduct(null); // Clear editing state
    setRefreshProducts(prev => prev + 1); // Increment to trigger ProductList's useEffect
  };

  const handleProductUpdated = () => {
    setShowProductForm(false); // Hide form after updating
    setEditingProduct(null); // Clear editing state
    setRefreshProducts(prev => prev + 1); // Increment to trigger ProductList's useEffect
  };

  const handleProductDeleted = () => {
    setRefreshProducts(prev => prev + 1); // Increment to trigger ProductList's useEffect
  };

  const handleEditClick = (product) => {
    setEditingProduct(product); // Set the product to be edited
    setShowProductForm(true);    // Show the form
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(null); // Clear editing state on cancel
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Updates input field state
  };

  const handleMinStockChange = (e) => {
    // Ensure the input is a valid number or empty string
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setMinStockFilter(value); // Updates input field state
    }
  };

  const handleApplyFilters = () => {
    // ONLY update the applied filter states when the button is clicked
    setAppliedSearchTerm(searchTerm);
    setAppliedMinStockFilter(minStockFilter);
    // No need to increment refreshProducts here, as changing applied states will trigger ProductList's useEffect
  };

  const handleClearFilters = () => {
    setSearchTerm(''); // Clear input field state
    setMinStockFilter(''); // Clear input field state
    setAppliedSearchTerm(''); // Clear applied filter state
    setAppliedMinStockFilter(''); // Clear applied filter state
    // No need to increment refreshProducts here, as changing applied states will trigger ProductList's useEffect
  };

  return (
    <div className="container py-4">
      <h2 className="display-4 fw-bold text-center mb-4">Our Products</h2>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-success"
          onClick={() => {
            setEditingProduct(null); // Ensure we are in "add" mode when clicking "Add New Product"
            setShowProductForm(!showProductForm);
          }}
        >
          {showProductForm && !editingProduct ? 'Hide Form' : (editingProduct ? 'Cancel Edit' : 'Add New Product')}
        </button>
      </div>

      {showProductForm && (
        <ProductForm
          initialData={editingProduct} // Pass the product data if editing
          onProductAdded={handleProductAdded}
          onProductUpdated={handleProductUpdated}
          onCancel={handleCancelForm}
        />
      )}

      {/* Search and Filter Section */}
      <div className="card shadow-sm p-3 mb-4 rounded-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label htmlFor="productSearch" className="form-label">Search by Name/Description</label>
            <input
              type="text"
              className="form-control"
              id="productSearch"
              placeholder="e.g., Laptop, Mouse"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="minStock" className="form-label">Min Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              id="minStock"
              placeholder="e.g., 10"
              value={minStockFilter}
              onChange={handleMinStockChange}
              min="0"
            />
          </div>
          <div className="col-md-3 d-flex justify-content-end">
            <button className="btn btn-primary me-2" onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product List - now receives applied search and filter terms */}
      <ProductList
        refreshTrigger={refreshProducts}
        onEditProduct={handleEditClick}
        onProductDeleted={handleProductDeleted}
        searchTerm={appliedSearchTerm} // Pass applied search term
        minStock={appliedMinStockFilter} // Pass applied min stock filter
      />
    </div>
  );
}

export default ProductsPage;
