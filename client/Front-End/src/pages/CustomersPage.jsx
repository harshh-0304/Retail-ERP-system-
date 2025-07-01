// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\CustomersPage.jsx
import React from 'react';

function CustomersPage({ onBackToHome }) {
  return (
    <div className="container py-4">
      <h2 className="display-4 fw-bold text-center mb-4">Our Customers</h2>
      <button className="btn btn-secondary mb-4" onClick={onBackToHome}>
        ← Back to Home
      </button>
      <p className="lead text-center">Customer management features will go here.</p>
      {/* You can add a CustomerList component here later */}
    </div>
  );
}

export default CustomersPage;
