// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\App.jsx
import React, { useState } from 'react'; // Import useState
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'products', 'customers'

  // Function to change the current page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to go back to home from other pages
  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Conditionally render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />; // Pass navigation function to HomePage
      case 'products':
        // Pass handleBackToHome to ProductsPage so it can navigate back
        return <ProductsPage onBackToHome={handleBackToHome} />;
      case 'customers':
        // Pass handleBackToHome to CustomersPage so it can navigate back
        return <CustomersPage onBackToHome={handleBackToHome} />;
      default:
        return <HomePage onNavigate={handlePageChange} />; // Fallback to home
    }
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 py-5 bg-light">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">Retail ERP Frontend</h1>
        <p className="lead text-muted mt-2">Powered by React & ASP.NET Core</p>
      </header>
      <main className="container my-auto">
        {renderPage()} {/* Render the selected page based on state */}
      </main>
      <footer className="mt-5 text-muted text-sm">
        &copy; {new Date().getFullYear()} Retail ERP. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
