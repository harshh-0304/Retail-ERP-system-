// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\ProductsPage.jsx
import React from 'react';
import ProductList from '../components/ProductList'; // Assuming ProductList is in src/components

function ProductsPage({ onBackToHome }) {
  return (
    <div className="container py-4">
      <h2 className="display-4 fw-bold text-center mb-4">Our Products</h2>
      <button className="btn btn-secondary mb-4" onClick={onBackToHome}>
        ← Back to Home
      </button>
      <ProductList /> {/* Render the ProductList component here */}
    </div>
  );
}

export default ProductsPage;
