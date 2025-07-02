// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\ProductsPage.jsx
import React, { useState } from 'react'; // Import useState
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm'; // Import the ProductForm component

function ProductsPage() { // Removed onBackToHome prop as Navbar handles navigation
  const [showProductForm, setShowProductForm] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(0); // State to trigger ProductList refresh

  const handleProductAdded = () => {
    setShowProductForm(false); // Hide form after adding
    setRefreshProducts(prev => prev + 1); // Increment to trigger ProductList's useEffect
  };

  return (
    <div className="container py-4">
      <h2 className="display-4 fw-bold text-center mb-4">Our Products</h2>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-success"
          onClick={() => setShowProductForm(!showProductForm)}
        >
          {showProductForm ? 'Hide Form' : 'Add New Product'}
        </button>
      </div>

      {showProductForm && (
        <ProductForm
          onProductAdded={handleProductAdded}
          onCancel={() => setShowProductForm(false)}
        />
      )}

      {/* Pass refreshProducts as a key to ProductList to force re-render and re-fetch data */}
      <ProductList key={refreshProducts} />
    </div>
  );
}

export default ProductsPage;
