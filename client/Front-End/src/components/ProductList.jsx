// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\ProductList.jsx
import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the URL of your ASP.NET Core backend API
    // IMPORTANT: Ensure this matches the HTTP port your backend is actually listening on.
    // Check your backend terminal output for "Now listening on: http://localhost:XXXX"
    const API_URL = 'http://localhost:5219/api/products';

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          // If response is not OK (e.g., 404, 500), throw an error
          const errorText = await response.text(); // Try to get more details from the response body
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        // Catch any network errors or errors from the response.ok check
        console.error("Failed to fetch products:", err);
        setError(err);
      } finally {
        setLoading(false); // Always stop loading, regardless of success or failure
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

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
          <code className="text-break">{API_URL}</code>
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
            The backend returned no product data. Please add some products using Postman or through Entity Framework Core seeding.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm rounded-3">
                <div className="card-body">
                  <h5 className="card-title text-primary">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <p className="card-text">
                    <span className="fw-bold fs-5 text-success">${product.price.toFixed(2)}</span>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Stock: {product.stockQuantity}</small>
                  </p>
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
