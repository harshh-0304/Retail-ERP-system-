import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import BillsPage from './pages/BillsPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
