// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\HomePage.jsx
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

function HomePage({ onNavigate }) {
  const [totalSales, setTotalSales] = useState('...'); // Placeholder for loading state
  const [activeCustomersCount, setActiveCustomersCount] = useState('...');
  const [productsInStockCount, setProductsInStockCount] = useState('...');
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpiError, setKpiError] = useState(null);

  const API_BASE_URL = 'http://localhost:5219/api'; // Base URL for your backend API

  useEffect(() => {
    const fetchKpiData = async () => {
      setLoadingKpis(true);
      setKpiError(null);
      try {
        // Fetch Customers
        const customersResponse = await fetch(`${API_BASE_URL}/customers`);
        if (!customersResponse.ok) throw new Error(`HTTP error! Status: ${customersResponse.status} for customers.`);
        const customersData = await customersResponse.json();
        setActiveCustomersCount(customersData.length);

        // Fetch Products and calculate total stock
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (!productsResponse.ok) throw new Error(`HTTP error! Status: ${productsResponse.status} for products.`);
        const productsData = await productsResponse.json();
        const totalStock = productsData.reduce((sum, product) => sum + product.stockQuantity, 0);
        setProductsInStockCount(totalStock);

        // Fetch Bills and calculate total sales
        const billsResponse = await fetch(`${API_BASE_URL}/bills`);
        if (!billsResponse.ok) throw new Error(`HTTP error! Status: ${billsResponse.status} for bills.`);
        const billsData = await billsResponse.json();
        const totalAmount = billsData.reduce((sum, bill) => sum + bill.totalAmount, 0);
        setTotalSales(totalAmount.toFixed(2)); // Format to 2 decimal places

      } catch (err) {
        console.error("Failed to fetch KPI data:", err);
        setKpiError(err.message);
      } finally {
        setLoadingKpis(false);
      }
    };

    fetchKpiData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    // Main container takes full viewport height and width, with dark blue background
    <div className="d-flex flex-column align-items-center justify-content-start py-5 px-3 position-relative overflow-hidden"
         style={{
           minHeight: '100vh', // Full viewport height
           width: '100%',     // Full width
           backgroundColor: '#1A237E', // Dark Indigo Blue
           zIndex: 1,
           paddingTop: 'calc(5rem + 56px)' // Adjust padding to account for fixed navbar height if any
         }}>
      {/* Subtle background pattern/texture overlay for visual interest */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        opacity: 0.2,
        zIndex: -1,
      }}></div>

      {/* Hero Section - Main Welcome Message */}
      <div className="text-center mb-5 animate-fade-in" style={{ maxWidth: '900px' }}>
        <h2 className="display-2 fw-bolder text-white mb-3">
          Welcome to <span style={{ color: '#FFD700' }}>Retail ERP</span>
        </h2>
        <p className="lead text-white-50 text-center" style={{ fontSize: '1.25rem' }}>
          Your comprehensive, modern solution for seamless management of products, customers, and sales operations. Streamline your retail business with efficiency and precision.
        </p>
      </div>

      {/* Dashboard Overview Section - Dynamic KPIs */}
      <div className="container-fluid mb-5 animate-slide-up" style={{ maxWidth: '1200px' }}>
        <h3 className="text-center text-white-75 mb-4 fw-bold">Dashboard Overview</h3>
        {loadingKpis ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading KPIs...</span>
            </div>
          </div>
        ) : kpiError ? (
          <div className="alert alert-danger text-center" role="alert">
            Error loading KPIs: {kpiError}
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {/* KPI Card 1: Total Sales */}
            <div className="col-12 col-md-6 col-lg-4"> {/* Adjusted column size for 3 cards */}
              <div className="card h-100 bg-dark text-white shadow-lg border-0 hover-scale-sm">
                <div className="card-body p-4 text-center">
                  <h6 className="card-subtitle mb-2 text-white-50">Total Sales (All Time)</h6> {/* Changed to All Time */}
                  <p className="card-text display-5 fw-bold" style={{ color: '#FFD700' }}>${totalSales}</p>
                  <small className="text-success">From all bills</small>
                </div>
              </div>
            </div>
            {/* KPI Card 2: Active Customers */}
            <div className="col-12 col-md-6 col-lg-4"> {/* Adjusted column size for 3 cards */}
              <div className="card h-100 bg-dark text-white shadow-lg border-0 hover-scale-sm">
                <div className="card-body p-4 text-center">
                  <h6 className="card-subtitle mb-2 text-white-50">Total Customers</h6>
                  <p className="card-text display-5 fw-bold" style={{ color: '#FFD700' }}>{activeCustomersCount}</p>
                  <small className="text-info">Registered in the system</small>
                </div>
              </div>
            </div>
            {/* KPI Card 3: Products in Stock */}
            <div className="col-12 col-md-6 col-lg-4"> {/* Adjusted column size for 3 cards */}
              <div className="card h-100 bg-dark text-white shadow-lg border-0 hover-scale-sm">
                <div className="card-body p-4 text-center">
                  <h6 className="card-subtitle mb-2 text-white-50">Total Products in Stock</h6>
                  <p className="card-text display-5 fw-bold" style={{ color: '#FFD700' }}>{productsInStockCount}</p>
                  <small className="text-warning">Across all inventory</small>
                </div>
              </div>
            </div>
            {/* Removed KPI Card 4: Orders Processed */}
          </div>
        )}
      </div>

      {/* Feature Cards Section - Existing Navigation */}
      <div className="container-fluid mb-5 animate-slide-up" style={{ maxWidth: '1200px' }}>
        <h3 className="text-center text-white-75 mb-4 fw-bold">Core Modules</h3>
        <div className="row g-4 justify-content-center">
          {/* Products Card */}
          <div className="col-12 col-md-4">
            <div
              className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-1 cursor-pointer hover-scale hover-glow"
              onClick={() => onNavigate('products')}
              style={{
                cursor: 'pointer',
                backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
                color: '#1A237E', // Dark Indigo Blue text for card content
                borderRadius: '15px' // More rounded corners for cards
              }}
            >
              <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
                <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>📦</span> {/* Gold icon */}
                <h5 className="card-title fw-bold">Manage Products</h5>
                <p className="card-text">Add, view, edit, and delete your inventory items.</p>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="col-12 col-md-4">
            <div
              className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-2 cursor-pointer hover-scale hover-glow"
              onClick={() => onNavigate('customers')}
              style={{
                cursor: 'pointer',
                backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
                color: '#1A237E', // Dark Indigo Blue text for card content
                borderRadius: '15px'
              }}
            >
              <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
                <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>👥</span> {/* Gold icon */}
                <h5 className="card-title fw-bold">Handle Customers</h5>
                <p className="card-text">Keep track of your customer base and their details.</p>
              </div>
            </div>
          </div>

          {/* Bills Card */}
          <div className="col-12 col-md-4">
            <div
              className="card h-100 text-center shadow-lg border-0 animate-fade-in-delay-3 cursor-pointer hover-scale hover-glow"
              onClick={() => onNavigate('bills')}
              style={{
                cursor: 'pointer',
                backgroundColor: '#FFFDE0', // Very light, warm yellow/cream background for card
                color: '#1A237E', // Dark Indigo Blue text for card content
                borderRadius: '15px'
              }}
            >
              <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
                <span className="display-4 icon-hover-grow" style={{ color: '#FFD700' }}>🧾</span> {/* Gold icon */}
                <h5 className="card-title fw-bold">View Sales & Bills</h5>
                <p className="card-text">Monitor all transactions and billing records.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
