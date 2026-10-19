import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import erpService from '../services/erpService';
import StatCard from '../components/common/StatCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import FilterPillGroup from '../components/common/FilterPillGroup';
import { formatCurrency, formatNumber } from '../utils/formatters';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="card erp-card-elevated border-0 shadow-lg p-2.5" style={{ borderRadius: 'var(--radius-md)' }}>
        <p className="fw-semibold text-muted mb-1" style={{ fontSize: '0.8rem' }}>{label}</p>
        <p className="fw-bold text-primary mb-0 erp-mono" style={{ fontSize: '0.95rem' }}>
          {typeof payload[0].value === 'number' && payload[0].name?.toLowerCase().includes('sale')
            ? formatCurrency(payload[0].value)
            : `${payload[0].value} units`}
        </p>
      </div>
    );
  }
  return null;
}

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productStockData, setProductStockData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [averageBillValue, setAverageBillValue] = useState(0);
  const [lowStockProductsCount, setLowStockProductsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [bills, products, customers] = await Promise.all([
          erpService.getBills(),
          erpService.getProducts(),
          erpService.getCustomers()
        ]);

        const salesByDate = {};
        const days = timeRange === '30d' ? 30 : 7;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          salesByDate[key] = 0;
        }

        let overallTotalSales = 0;
        (bills || []).forEach(bill => {
          const billDate = new Date(bill.billDate);
          billDate.setHours(0, 0, 0, 0);
          const key = billDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const amt = Number(bill.totalAmount) || 0;
          if (salesByDate.hasOwnProperty(key)) {
            salesByDate[key] += amt;
          }
          overallTotalSales += amt;
        });

        const processedSalesData = Object.keys(salesByDate).map(date => ({
          date,
          sales: parseFloat(salesByDate[date].toFixed(2))
        }));
        setSalesData(processedSalesData);

        const topProducts = (products || [])
          .sort((a, b) => b.stockQuantity - a.stockQuantity)
          .slice(0, 8)
          .map(p => ({
            name: p.name.length > 18 ? `${p.name.substring(0, 18)}...` : p.name,
            stock: p.stockQuantity
          }));
        setProductStockData(topProducts);

        setTotalSales(overallTotalSales);
        setTotalCustomers(customers?.length || 0);
        setTotalProducts(products?.length || 0);
        setTotalBills(bills?.length || 0);
        setAverageBillValue(bills?.length ? overallTotalSales / bills.length : 0);
        const lowStockCount = (products || []).filter(p => Number(p.stockQuantity) < 10).length;
        setLowStockProductsCount(lowStockCount);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="container-fluid px-3 px-lg-5 py-4">
        <LoadingSkeleton type="card" count={4} className="mb-4" />
        <LoadingSkeleton type="table" count={4} />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-lg-5 py-4 erp-animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge bg-purple-subtle text-primary rounded-pill erp-badge-text" style={{ backgroundColor: 'var(--erp-primary-subtle)' }}>
              Business Telemetry
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Executive Overview</span>
          </div>
          <h2 className="h3 fw-bold erp-heading mb-1">Analytics &amp; Revenue Intelligence</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Monitor financial metrics, customer growth rates, and warehouse stock movement.
          </p>
        </div>

        <FilterPillGroup
          options={[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' }
          ]}
          activeId={timeRange}
          onChange={setTimeRange}
        />
      </div>

      {/* Low Stock Warning Alert Banner */}
      {lowStockProductsCount > 0 && (
        <div className="card border-0 mb-4 p-3 shadow-sm" style={{ backgroundColor: 'var(--erp-warning-subtle)', borderLeft: '4px solid #f59e0b' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2.5">
              <i className="bi bi-exclamation-triangle-fill fs-5 text-warning" />
              <div>
                <strong className="text-dark-emphasis">Low Stock Alert:</strong>
                <span className="ms-1 text-dark-emphasis" style={{ fontSize: '0.9rem' }}>
                  {lowStockProductsCount} product{lowStockProductsCount > 1 ? 's are' : ' is'} below the 10-unit minimum reorder threshold.
                </span>
              </div>
            </div>
            <span className="badge bg-warning text-dark rounded-pill erp-badge-text">Action Required</span>
          </div>
        </div>
      )}

      {/* KPI Stat Cards Grid */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalSales)}
            subtitle="All sales transactions"
            icon="bi-wallet2"
            iconColor="#10b981"
            iconBg="rgba(16, 185, 129, 0.12)"
            trend={14.8}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Registered Clients"
            value={formatNumber(totalCustomers)}
            subtitle="Active verified accounts"
            icon="bi-people"
            iconColor="#0ea5e9"
            iconBg="rgba(14, 165, 233, 0.12)"
            trend={6.5}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Warehouse Catalog"
            value={formatNumber(totalProducts)}
            subtitle="Unique active SKUs"
            icon="bi-box-seam"
            iconColor="#6366f1"
            iconBg="rgba(99, 102, 241, 0.12)"
            trend={2.0}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Average Ticket Size"
            value={formatCurrency(averageBillValue)}
            subtitle={`${totalBills} total bills generated`}
            icon="bi-receipt"
            iconColor="#f59e0b"
            iconBg="rgba(245, 158, 11, 0.12)"
            trend={8.3}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Revenue Velocity Chart */}
        <div className="col-12 col-lg-7">
          <div className="card erp-card-elevated border-0 p-4 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="h5 fw-bold erp-heading mb-0">Sales Revenue Velocity</h4>
                <small className="text-muted">Daily billed volume in USD</small>
              </div>
              <span className="badge bg-success-subtle text-success-emphasis rounded-pill erp-badge-text">
                Live Daily Trend
              </span>
            </div>

            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Daily Sales"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 7, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Product Inventory Stock Levels */}
        <div className="col-12 col-lg-5">
          <div className="card erp-card-elevated border-0 p-4 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="h5 fw-bold erp-heading mb-0">Stock Availability</h4>
                <small className="text-muted">Top inventory items on hand</small>
              </div>
              <span className="badge bg-primary-subtle text-primary rounded-pill erp-badge-text">
                Warehouse
              </span>
            </div>

            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productStockData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-light)" />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={11} width={110} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="stock" name="Stock Units" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Operations Health */}
      <div className="card erp-card-elevated border-0 p-4 shadow-sm mb-4">
        <h4 className="h5 fw-bold erp-heading mb-1">Catalog Department Distribution</h4>
        <p className="text-muted small mb-4">Inventory allocation by product classification</p>

        <div className="row g-3">
          {[
            { name: 'Electronics', count: 18, share: '36%', color: '#4f46e5' },
            { name: 'Audio Systems', count: 12, share: '24%', color: '#0ea5e9' },
            { name: 'Furniture & Ergonomics', count: 8, share: '16%', color: '#10b981' },
            { name: 'Accessories & Cables', count: 15, share: '30%', color: '#f59e0b' }
          ].map((cat, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong style={{ fontSize: '0.875rem' }}>{cat.name}</strong>
                  <span className="badge rounded-pill erp-badge-text" style={{ backgroundColor: cat.color, color: '#fff' }}>
                    {cat.share}
                  </span>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div className="progress-bar" style={{ width: cat.share, backgroundColor: cat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
