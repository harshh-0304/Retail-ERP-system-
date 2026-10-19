import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import BillsPage from './pages/BillsPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/common/Modal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';

function CommandPalette({ show, onClose, onNavigate }) {
  const [search, setSearch] = useState('');
  const { toggleTheme, isDark } = useTheme();

  const commands = [
    { id: 'home', label: 'Go to Home Overview', icon: 'bi-house-door-fill', category: 'Navigation', action: () => { onNavigate('home'); onClose(); } },
    { id: 'dashboard', label: 'Go to Analytics Dashboard', icon: 'bi-speedometer2', category: 'Navigation', action: () => { onNavigate('dashboard'); onClose(); } },
    { id: 'products', label: 'Go to Products & Inventory', icon: 'bi-box-seam-fill', category: 'Navigation', action: () => { onNavigate('products'); onClose(); } },
    { id: 'customers', label: 'Go to Customer Directory', icon: 'bi-people-fill', category: 'Navigation', action: () => { onNavigate('customers'); onClose(); } },
    { id: 'bills', label: 'Go to POS Billing & Invoices', icon: 'bi-receipt-cutoff', category: 'Navigation', action: () => { onNavigate('bills'); onClose(); } },
    { id: 'theme', label: `Toggle Theme (Currently ${isDark ? 'Dark' : 'Light'})`, icon: isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill', category: 'Preferences', action: () => { toggleTheme(); onClose(); } }
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal show={show} onClose={onClose} size="md">
      <div className="p-1">
        <div className="position-relative mb-3">
          <i className="bi bi-search position-absolute text-muted" style={{ left: 14, top: 12 }} />
          <input
            type="text"
            className="form-control rounded-pill ps-5 py-2 shadow-sm"
            placeholder="Type a command or jump to page... (Esc to close)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="d-flex flex-column gap-1" style={{ maxHeight: 320, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0 small">No commands matching "{search}"</p>
          ) : (
            filtered.map(cmd => (
              <button
                key={cmd.id}
                type="button"
                className="btn btn-outline-secondary border-0 text-start d-flex align-items-center justify-content-between p-2.5 rounded-3 erp-hover-lift"
                onClick={cmd.action}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 bg-primary-subtle text-primary"
                    style={{ width: 32, height: 32 }}
                  >
                    <i className={`bi ${cmd.icon}`} />
                  </div>
                  <div>
                    <span className="fw-semibold d-block text-dark-emphasis" style={{ fontSize: '0.9rem' }}>{cmd.label}</span>
                    <small className="text-muted">{cmd.category}</small>
                  </div>
                </div>
                <i className="bi bi-arrow-return-left text-muted small" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showPalette, setShowPalette] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />;
      case 'products':
        return <ProductsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'bills':
        return <BillsPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
      <Navbar onNavigate={handlePageChange} currentPage={currentPage} />

      <main className="flex-grow-1">
        {renderPage()}
      </main>

      <Footer onNavigate={handlePageChange} />

      <CommandPalette
        show={showPalette}
        onClose={() => setShowPalette(false)}
        onNavigate={handlePageChange}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
