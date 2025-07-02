// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\HomePage.jsx
import React from 'react';

function HomePage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-lg border border-light" style={{ minHeight: '75vh', width: '100%', maxWidth: '900px', margin: 'auto' }}>
      <h2 className="display-2 fw-bolder text-dark mb-4 animate-fade-in text-center">
        Welcome to <span className="text-primary">Retail ERP</span>
      </h2>
      <p className="lead text-muted text-center mb-5 animate-slide-up" style={{ maxWidth: '700px', fontSize: '1.25rem' }}>
        Your comprehensive, modern solution for seamless management of products, customers, and sales operations. Streamline your retail business with efficiency and precision.
      </p>
      {/* Navigation is now handled by the Navbar component */}
      <p className="text-muted fs-6 mt-4">
        Explore our features using the elegant navigation bar above.
      </p>
    </div>
  );
}

export default HomePage;
