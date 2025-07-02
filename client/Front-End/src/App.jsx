// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\App.jsx
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import BillsPage from './pages/BillsPage';
import DashboardPage from './pages/DashboardPage'; // Import the new DashboardPage
import Navbar from './components/Navbar';

function App() {
  // State to keep track of the current page
  // Added 'dashboard' to the possible page states
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'products', 'customers', 'bills', 'dashboard'

  // Function to change the current page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Conditionally render the current page
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
      case 'dashboard': // New case for DashboardPage
        return <DashboardPage />;
      default:
        return <HomePage onNavigate={handlePageChange} />; // Fallback to home
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar onNavigate={handlePageChange} />

      <main className="my-auto flex-grow-1">
        {renderPage()}
      </main>

      <footer className="mt-auto py-3 bg-dark text-white text-center">
        &copy; {new Date().getFullYear()} Retail ERP. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
