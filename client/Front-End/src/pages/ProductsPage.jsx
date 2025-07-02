// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\ProductsPage.jsx
import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function ProductsPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited
  const [refreshProducts, setRefreshProducts] = useState(0); // State to trigger ProductList refresh

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

      {/* Pass refreshProducts as refreshTrigger prop to ProductList to force re-render/re-fetch */}
      <ProductList
        refreshTrigger={refreshProducts}
        onEditProduct={handleEditClick}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}

export default ProductsPage;
