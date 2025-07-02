
// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\ProductList.jsx
import React, { useEffect, useState } from 'react';

// ProductList now accepts searchTerm and minStock props (which are now the 'applied' states)
function ProductList({ onEditProduct, onProductDeleted, refreshTrigger, searchTerm, minStock }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5219/api/products'; // Confirm your backend's HTTP port

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct the URL with query parameters based on searchTerm and minStock
        const queryParams = new URLSearchParams();
        if (searchTerm) { // Now 'searchTerm' is the applied search term
          queryParams.append('search', searchTerm);
        }
        if (minStock && minStock !== '') { // Now 'minStock' is the applied min stock filter
          queryParams.append('minStock', minStock);
        }

        const url = `${API_BASE_URL}?${queryParams.toString()}`;
        console.log("Fetching products from URL:", url); // Debugging log

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Update dependency array to use the 'applied' states
  }, [refreshTrigger, searchTerm, minStock]); // These are now the 'applied' states from ProductsPage


  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }

        // Notify parent component that a product was deleted, triggering a refresh
        if (onProductDeleted) {
          onProductDeleted();
        }
        alert('Product deleted successfully!');
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-light rounded-3 shadow-sm">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center p-4 rounded-3 shadow-sm" role="alert">
        <h4 className="alert-heading">Error Loading Products!</h4>
        <p>There was a problem fetching data from the backend.</p>
        <hr />
        <p className="mb-0">
          <strong>Details:</strong> {error.message}
        </p>
        <p className="mb-0 mt-2">
          Please ensure your ASP.NET Core backend is running and accessible at: <br />
          <code className="text-break">{API_BASE_URL}</code>
        </p>
        <p className="mb-0 mt-2">
          Also, verify that **CORS is correctly configured** in your backend's `Program.cs` to allow requests from your frontend's origin (e.g., `http://localhost:5173`).
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">Available Products</h3>
      {products.length === 0 ? (
        <div className="alert alert-info text-center p-4 rounded-3 shadow-sm" role="alert">
          <h4 className="alert-heading">No Products Found!</h4>
          <p className="mb-0">
            The backend returned no product data matching your criteria. Please adjust your filters or add new products.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-lg rounded-3 border-0">
                <img
                  src={`https://placehold.co/400x200/e0e0e0/333333?text=Product+Image`}
                  className="card-img-top rounded-top"
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/cccccc/000000?text=Image+Not+Found"; }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary fw-bold mb-2">{product.name}</h5>
                  <p className="card-text text-muted flex-grow-1">{product.description || 'No description available.'}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <p className="card-text mb-0">
                      <span className="fw-bold fs-5 text-success">${product.price.toFixed(2)}</span>
                    </p>
                    <p className="card-text mb-0">
                      <small className="text-muted">Stock: {product.stockQuantity}</small>
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-3 gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => onEditProduct(product)} // Call parent's edit handler
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(product.id)} // Call local delete handler
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
