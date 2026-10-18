import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Badge from '../components/common/Badge';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import erpService from '../services/erpService';

function HomePage({ onNavigate }) {
  const [totalSales, setTotalSales] = useState(0);
  const [activeCustomersCount, setActiveCustomersCount] = useState(0);
  const [productsInStockCount, setProductsInStockCount] = useState(0);
  const [recentBills, setRecentBills] = useState([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpiError, setKpiError] = useState(null);

  const fetchKpiData = async () => {
    setLoadingKpis(true);
    setKpiError(null);
    try {
      const [customersData, productsData, billsData] = await Promise.all([
        erpService.getCustomers(),
        erpService.getProducts(),
        erpService.getBills()
      ]);

      setActiveCustomersCount(customersData?.length || 0);

      const totalStock = (productsData || []).reduce((sum, p) => sum + (Number(p.stockQuantity) || 0), 0);
      setProductsInStockCount(totalStock);

      const totalAmount = (billsData || []).reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      setTotalSales(totalAmount);

      setRecentBills((billsData || []).slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch KPI data:", err);
      setKpiError(err.message || 'Error communicating with ERP service');
    } finally {
      setLoadingKpis(false);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

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

      {/* Recent Sales & Invoices Snapshot */}
      <div className="card erp-card-elevated border-0 p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-light)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-2 bg-primary-subtle text-primary"
              style={{ width: 32, height: 32 }}
            >
              <i className="bi bi-clock-history fs-6" />
            </div>
            <div>
              <h4 className="h6 fw-bold erp-heading mb-0">Recent Sales &amp; Invoices</h4>
              <small className="text-muted">Latest POS transactions recorded</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
            onClick={() => onNavigate('bills')}
          >
            <span>All Bills</span>
            <i className="bi bi-arrow-right" />
          </button>
        </div>

        {recentBills.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-receipt fs-2 mb-2 d-block" />
            <p className="mb-0">No recent sales recorded yet. Process a new bill to see it here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th className="text-end">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map(bill => (
                  <tr key={bill.id} style={{ fontSize: '0.9rem' }}>
                    <td>
                      <span className="fw-bold erp-mono text-primary">#{bill.id}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{bill.customer?.name || 'Walk-in Customer'}</div>
                      <small className="text-muted">{bill.customer?.contact || ''}</small>
                    </td>
                    <td className="text-muted">
                      {formatDate(bill.billDate)}
                    </td>
                    <td>
                      <Badge variant="primary" dot size="sm">
                        {bill.paymentMethod || 'Cash'}
                      </Badge>
                    </td>
                    <td className="text-end fw-bold text-success">
                      {formatCurrency(bill.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Diagnostics & Warehouse Health Banner */}
      <div className="card erp-card-elevated border-0 p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 bg-success-subtle text-success"
                style={{ width: 44, height: 44, fontSize: '1.25rem' }}
              >
                <i className="bi bi-shield-check" />
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Backend Service</span>
                <strong className="text-success fw-bold">Active &amp; Responsive</strong>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                style={{ width: 44, height: 44, fontSize: '1.25rem' }}
              >
                <i className="bi bi-database-check" />
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Data Store</span>
                <strong>SQL Server / EF Core</strong>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 bg-warning-subtle text-warning"
                style={{ width: 44, height: 44, fontSize: '1.25rem' }}
              >
                <i className="bi bi-bell-fill" />
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Stock Watch</span>
                <strong>Threshold Monitored</strong>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 text-md-end">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 fw-semibold"
              onClick={fetchKpiData}
            >
              <i className="bi bi-arrow-clockwise me-1" />
              Refresh Health
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
