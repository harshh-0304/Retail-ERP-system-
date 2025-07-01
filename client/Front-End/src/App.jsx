// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\App.jsx
import React, { useState } from 'react'; // Import useState
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import BillsPage from './pages/BillsPage'; // Assuming you have a BillsPage
import Navbar from './components/Navbar'; // Import the Navbar component

function App() {
  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'products', 'customers', 'bills'

  // Function to change the current page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Conditionally render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />; // Pass navigation function to HomePage
      case 'products':
        return <ProductsPage />; // ProductsPage no longer needs onBackToHome if Navbar handles it
      case 'customers':
        return <CustomersPage />; // CustomersPage no longer needs onBackToHome if Navbar handles it
      case 'bills':
        return <BillsPage />; // BillsPage no longer needs onBackToHome if Navbar handles it
      default:
        return <HomePage onNavigate={handlePageChange} />; // Fallback to home
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar placed here, outside the main content, but within the main app div */}
      <Navbar onNavigate={handlePageChange} />

      <header className="text-center mb-5 mt-3"> {/* Added mt-3 for spacing below navbar */}
        <h1 className="display-4 fw-bold text-dark">Retail ERP Frontend</h1>
        <p className="lead text-muted mt-2">Powered by React & ASP.NET Core</p>
      </header>

      <main className="container my-auto flex-grow-1"> {/* flex-grow-1 ensures content pushes footer down */}
        {renderPage()} {/* Render the selected page based on state */}
      </main>

      <footer className="mt-auto py-3 bg-dark text-white text-center"> {/* mt-auto pushes footer to bottom */}
        &copy; {new Date().getFullYear()} Retail ERP. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
