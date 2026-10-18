import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatCurrency, formatNumber } from '../utils/formatters';
import erpService from '../services/erpService';

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
    <div className="container-fluid px-3 px-lg-5 py-4 py-lg-5 erp-animate-fade-in">
      {/* Hero Section */}
      <div className="card border-0 erp-gradient-dark p-4 p-md-5 mb-5 shadow-lg overflow-hidden position-relative" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="position-relative" style={{ zIndex: 1, maxWidth: 840 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span className="text-white fw-bold erp-badge-text" style={{ fontSize: '0.75rem' }}>ENTERPRISE RETAIL SUITE 2026</span>
          </div>
          <h1 className="display-4 fw-bolder text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Manage Products, Customers &amp; Sales with <span className="erp-gradient-text">Precision</span>
          </h1>
          <p className="lead text-white-50 mb-4" style={{ fontSize: '1.15rem', maxWidth: 680 }}>
            Unified retail operations platform connecting real-time inventory tracking, customer relationships, and POS billing into one seamless workflow.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-primary px-4 py-2.5 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
              onClick={() => onNavigate('dashboard')}
            >
              <i className="bi bi-speedometer2" />
              <span>Launch Dashboard</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-light px-4 py-2.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
              onClick={() => onNavigate('bills')}
            >
              <i className="bi bi-receipt" />
              <span>New POS Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Business KPI Summary */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="h4 fw-bold erp-heading mb-1">Key Performance Metrics</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Real-time telemetry across sales, customers, and stock availability</p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1.5"
            onClick={() => onNavigate('dashboard')}
          >
            <span>Deep Analytics</span>
            <i className="bi bi-arrow-right" />
          </button>
        </div>

        {loadingKpis ? (
          <LoadingSkeleton type="card" count={3} />
        ) : (
          <div className="row g-3 g-lg-4">
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="Total Revenue (All Time)"
                value={formatCurrency(totalSales)}
                subtitle="Calculated across all billed transactions"
                icon="bi-currency-dollar"
                iconColor="#10b981"
                iconBg="rgba(16, 185, 129, 0.12)"
                trend={12.4}
                onClick={() => onNavigate('bills')}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="Active Customers"
                value={formatNumber(activeCustomersCount)}
                subtitle="Verified accounts registered in database"
                icon="bi-people-fill"
                iconColor="#4f46e5"
                iconBg="rgba(79, 70, 229, 0.12)"
                trend={8.2}
                onClick={() => onNavigate('customers')}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <StatCard
                title="Inventory Units in Stock"
                value={formatNumber(productsInStockCount)}
                subtitle="Available units across warehouse catalog"
                icon="bi-boxes"
                iconColor="#f59e0b"
                iconBg="rgba(245, 158, 11, 0.12)"
                trend={-2.1}
                onClick={() => onNavigate('products')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Core Modules Quick Launchpad */}
      <div className="mb-5">
        <h3 className="h4 fw-bold erp-heading mb-3">Enterprise Operations Modules</h3>
        <div className="row g-3 g-lg-4">
          {[
            {
              id: 'products',
              title: 'Inventory & Catalog',
              description: 'Manage SKU pricing, stock reorders, and search warehouse inventory.',
              icon: 'bi-box-seam-fill',
              color: '#4f46e5',
              badge: 'Catalog',
              action: 'View Inventory'
            },
            {
              id: 'bills',
              title: 'Point of Sale & Billing',
              description: 'Process customer checkouts, print professional invoices, and track revenue.',
              icon: 'bi-receipt-cutoff',
              color: '#10b981',
              badge: 'POS Active',
              action: 'Open POS'
            },
            {
              id: 'customers',
              title: 'Customer Directory',
              description: 'Maintain verified client profiles, purchase histories, and contact tiers.',
              icon: 'bi-people-fill',
              color: '#0ea5e9',
              badge: 'CRM',
              action: 'Browse Clients'
            },
            {
              id: 'dashboard',
              title: 'Analytics & Insights',
              description: 'Visualize sales trends, daily revenue trajectories, and top selling products.',
              icon: 'bi-graph-up-arrow',
              color: '#8b5cf6',
              badge: 'Telemetry',
              action: 'View Insights'
            }
          ].map(mod => (
            <div key={mod.id} className="col-12 col-md-6 col-xl-3">
              <div
                className="card erp-card-elevated erp-hover-lift h-100 p-4 border-0 cursor-pointer d-flex flex-column justify-content-between"
                onClick={() => onNavigate(mod.id)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
                      style={{ width: 48, height: 48, backgroundColor: mod.color, fontSize: '1.35rem' }}
                    >
                      <i className={`bi ${mod.icon}`} />
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill erp-badge-text">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="h5 fw-bold erp-heading mb-2">{mod.title}</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {mod.description}
                  </p>
                </div>
                <div className="pt-2 border-top d-flex align-items-center justify-content-between text-primary fw-semibold" style={{ borderColor: 'var(--border-light)', fontSize: '0.875rem' }}>
                  <span>{mod.action}</span>
                  <i className="bi bi-arrow-right" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
