import React from 'react';

function Navbar({ onNavigate, currentPage = 'home' }) {
  return (
    <header className="sticky-top erp-glass-panel border-bottom" style={{ zIndex: 1020, borderColor: 'var(--border-light)' }}>
      <nav className="navbar navbar-expand-lg py-2.5">
        <div className="container-fluid px-3 px-lg-4">
          {/* Brand Logo & Name */}
          <a
            className="navbar-brand d-flex align-items-center gap-2.5 cursor-pointer text-decoration-none"
            href="#home"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3 erp-gradient-primary shadow-sm"
              style={{ width: 38, height: 38 }}
            >
              <i className="bi bi-shop fs-5 text-white" />
            </div>
            <div>
              <span className="fw-bolder fs-5 erp-heading d-block lh-1" style={{ letterSpacing: '-0.02em' }}>
                Retail<span style={{ color: 'var(--erp-primary)' }}>ERP</span>
              </span>
              <span className="text-muted d-block text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', fontWeight: 600 }}>
                Enterprise Suite
              </span>
            </div>
          </a>

          {/* Mobile menu button */}
          <button
            className="navbar-toggler border-0 shadow-none p-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#erpNavbarNav"
            aria-controls="erpNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-3" />
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="erpNavbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <a
                  className="nav-link px-3 py-2 rounded-pill fw-medium cursor-pointer"
                  href="#home"
                  onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                >
                  <i className="bi bi-house-door me-1.5" />
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-3 py-2 rounded-pill fw-medium cursor-pointer"
                  href="#dashboard"
                  onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
                >
                  <i className="bi bi-speedometer2 me-1.5" />
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-3 py-2 rounded-pill fw-medium cursor-pointer"
                  href="#products"
                  onClick={(e) => { e.preventDefault(); onNavigate('products'); }}
                >
                  <i className="bi bi-box-seam me-1.5" />
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-3 py-2 rounded-pill fw-medium cursor-pointer"
                  href="#customers"
                  onClick={(e) => { e.preventDefault(); onNavigate('customers'); }}
                >
                  <i className="bi bi-people me-1.5" />
                  Customers
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-3 py-2 rounded-pill fw-medium cursor-pointer"
                  href="#bills"
                  onClick={(e) => { e.preventDefault(); onNavigate('bills'); }}
                >
                  <i className="bi bi-receipt me-1.5" />
                  Bills
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
