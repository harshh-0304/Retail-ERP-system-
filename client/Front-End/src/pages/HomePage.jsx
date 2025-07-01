// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\HomePage.jsx
import React from 'react';

// HomePage now accepts an 'onNavigate' prop from App.jsx
function HomePage({ onNavigate }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 bg-white rounded-3 shadow-lg" style={{ minHeight: '70vh', width: '100%' }}>
      <h2 className="display-3 fw-bold text-dark mb-4 animate-fade-in">
        Welcome to Retail ERP
      </h2>
      <p className="lead text-muted text-center mb-4 animate-slide-up" style={{ maxWidth: '700px' }}>
        Your comprehensive solution for managing products, customers, and sales.
      </p>
      <div className="d-flex flex-column flex-sm-row gap-3">
        {/* Use onClick to trigger page change via the onNavigate prop */}
        <button
          className="btn btn-primary btn-lg rounded-pill shadow-sm"
          onClick={() => onNavigate('products')} // Call onNavigate with 'products'
        >
          View Products
        </button>
        <button
          className="btn btn-info btn-lg rounded-pill shadow-sm"
          onClick={() => onNavigate('customers')} // Call onNavigate with 'customers'
        >
          Manage Customers
        </button>
      </div>
    </div>
  );
}

export default HomePage;
