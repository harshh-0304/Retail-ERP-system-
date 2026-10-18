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
              {[
                { id: 'home', label: 'Home', icon: 'bi-house-door' },
                { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
                { id: 'products', label: 'Products', icon: 'bi-box-seam' },
                { id: 'customers', label: 'Customers', icon: 'bi-people' },
                { id: 'bills', label: 'Bills & POS', icon: 'bi-receipt' },
              ].map(item => {
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      className={`nav-link px-3 py-1.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${isActive ? 'active' : ''}`}
                      href={`#${item.id}`}
                      style={{
                        backgroundColor: isActive ? 'var(--erp-primary)' : 'transparent',
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                        boxShadow: isActive ? '0 2px 4px rgba(79, 70, 229, 0.25)' : 'none',
                        fontSize: '0.9rem'
                      }}
                      onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                    >
                      <i className={`bi ${item.icon}`} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* System Status Indicator */}
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              <span
                className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill erp-badge-text border"
                style={{
                  backgroundColor: 'var(--erp-success-subtle)',
                  borderColor: 'rgba(16, 185, 129, 0.25)',
                  color: '#065f46',
                  fontSize: '0.72rem'
                }}
                title="System Operational - ASP.NET Core & Local DB synced"
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block'
                  }}
                  className="animate-pulse"
                />
                <span>SYSTEM ONLINE</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
