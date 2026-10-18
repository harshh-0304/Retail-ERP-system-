import React from 'react';

export function Footer({ onNavigate }) {
  return (
    <footer className="mt-auto border-top py-4" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}>
      <div className="container-fluid px-3 px-lg-4">
        <div className="row align-items-center gy-3">
          {/* Brand & info */}
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 mb-1">
              <div
                className="d-flex align-items-center justify-content-center rounded-2 erp-gradient-primary text-white"
                style={{ width: 24, height: 24, fontSize: '0.8rem' }}
              >
                <i className="bi bi-shop" />
              </div>
              <span className="fw-bold erp-heading fs-6">Retail ERP Suite</span>
              <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill erp-badge-text" style={{ fontSize: '0.65rem' }}>
                v2.4 LTS
              </span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
              Full-Stack Retail Management • ASP.NET Core &amp; React Enterprise Architecture.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-4 text-md-center">
            <div className="d-flex flex-wrap justify-content-md-center gap-3" style={{ fontSize: '0.85rem' }}>
              <a href="#home" className="text-muted text-decoration-none hover-text-primary" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
              <a href="#dashboard" className="text-muted text-decoration-none hover-text-primary" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Dashboard</a>
              <a href="#products" className="text-muted text-decoration-none hover-text-primary" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>Products</a>
              <a href="#customers" className="text-muted text-decoration-none hover-text-primary" onClick={(e) => { e.preventDefault(); onNavigate('customers'); }}>Customers</a>
              <a href="#bills" className="text-muted text-decoration-none hover-text-primary" onClick={(e) => { e.preventDefault(); onNavigate('bills'); }}>Bills</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-12 col-md-3 text-md-end">
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
              &copy; {new Date().getFullYear()} Retail ERP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
