// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\Navbar.jsx
import React from 'react';

function Navbar({ onNavigate }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fs-4 fw-bold" href="#" onClick={() => onNavigate('home')}>
          Retail ERP
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
                onClick={() => onNavigate('home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              {/* New Dashboard link - Comment moved outside onClick attribute */}
              <a
                className="nav-link"
                href="#"
                onClick={() => onNavigate('dashboard')}
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => onNavigate('products')}
              >
                Products
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => onNavigate('customers')}
              >
                Customers
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => onNavigate('bills')}
              >
                Bills
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
