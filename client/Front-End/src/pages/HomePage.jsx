// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\HomePage.jsx
import React from 'react';

function HomePage({ onNavigate }) {
  return (
    // Main container now takes full viewport height and width, with darker colors
    <div className="d-flex flex-column align-items-center justify-content-center p-5 rounded-0 shadow-lg"
         style={{
           minHeight: '100vh', // Full viewport height
           width: '100%',     // Full width
           backgroundColor: '#1A237E', // Dark Indigo Blue
           border: 'none', // Removed border for a cleaner look
           position: 'relative',
           zIndex: 1,
         }}>
      <h2 className="display-2 fw-bolder text-white mb-4 animate-fade-in text-center">
        Welcome to <span style={{ color: '#FFD700' }}>Retail ERP</span> {/* Gold text */}
      </h2>
      <p className="lead text-white text-center mb-5 animate-slide-up" style={{ maxWidth: '700px', fontSize: '1.25rem' }}>
        Your comprehensive, modern solution for seamless management of products, customers, and sales operations. Streamline your retail business with efficiency and precision.
      </p>

      <div className="row g-4 justify-content-center w-100 px-3"> {/* Responsive grid for cards, added padding */}
        {/* Products Card */}
        <div className="col-12 col-md-4">
          <div
            className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-1 cursor-pointer hover-scale hover-glow" // Added hover-glow
            onClick={() => onNavigate('products')}
            style={{
              cursor: 'pointer',
              backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
              color: '#1A237E', // Dark Indigo Blue text for card content
              borderRadius: '15px' // More rounded corners for cards
            }}
          >
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>📦</span> {/* Gold icon, added icon-hover-grow */}
              <h5 className="card-title fw-bold">Manage Products</h5>
              <p className="card-text">Add, view, edit, and delete your inventory items.</p>
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="col-12 col-md-4">
          <div
            className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-2 cursor-pointer hover-scale hover-glow" // Added hover-glow
            onClick={() => onNavigate('customers')}
            style={{
              cursor: 'pointer',
              backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
              color: '#1A237E', // Dark Indigo Blue text for card content
              borderRadius: '15px'
            }}
          >
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>👥</span> {/* Gold icon, added icon-hover-grow */}
              <h5 className="card-title fw-bold">Handle Customers</h5>
              <p className="card-text">Keep track of your customer base and their details.</p>
            </div>
          </div>
        </div>

        {/* Bills Card */}
        <div className="col-12 col-md-4">
          <div
            className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-3 cursor-pointer hover-scale hover-glow" // Added hover-glow
            onClick={() => onNavigate('bills')}
            style={{
              cursor: 'pointer',
              backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
              color: '#1A237E', // Dark Indigo Blue text for card content
              borderRadius: '15px'
            }}
          >
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>🧾</span> {/* Gold icon, added icon-hover-grow */}
              <h5 className="card-title fw-bold">View Sales & Bills</h5>
              <p className="card-text">Monitor all transactions and billing records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
