import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [productStockData, setProductStockData] = useState([]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [averageBillValue, setAverageBillValue] = useState(0);
  const [lowStockProductsCount, setLowStockProductsCount] = useState(0);

  const API_BASE_URL = 'http://localhost:5219/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [billsResponse, productsResponse, customersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/bills`),
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/customers`)
        ]);

        if (!billsResponse.ok) throw new Error(`HTTP error! Status: ${billsResponse.status} for bills.`);
        if (!productsResponse.ok) throw new Error(`HTTP error! Status: ${productsResponse.status} for products.`);
        if (!customersResponse.ok) throw new Error(`HTTP error! Status: ${customersResponse.status} for customers.`);

        const bills = await billsResponse.json();
        const products = await productsResponse.json();
        const customers = await customersResponse.json();

        const salesByDate = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          salesByDate[date.toLocaleDateString()] = 0;
        }

        let overallTotalSales = 0;
        bills.forEach(bill => {
          const billDate = new Date(bill.billDate);
          billDate.setHours(0, 0, 0, 0);
          const dateString = billDate.toLocaleDateString();
          if (salesByDate.hasOwnProperty(dateString)) {
            salesByDate[dateString] += bill.totalAmount;
          }
          overallTotalSales += bill.totalAmount;
        });

        const processedSalesData = Object.keys(salesByDate).map(date => ({
          date: date,
          sales: parseFloat(salesByDate[date].toFixed(2))
        }));
        setSalesData(processedSalesData);

        const topProducts = products
          .sort((a, b) => b.stockQuantity - a.stockQuantity)
          .slice(0, 10)
          .map(p => ({
            name: p.name,
            stock: p.stockQuantity
          }));
        setProductStockData(topProducts);

        setTotalSales(overallTotalSales.toFixed(2));
        setTotalCustomers(customers.length);
        setTotalProducts(products.length);
        setTotalBills(bills.length);
        setAverageBillValue(bills.length > 0 ? (overallTotalSales / bills.length).toFixed(2) : 0);
        const lowStockCount = products.filter(p => p.stockQuantity < 10).length;
        setLowStockProductsCount(lowStockCount);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-light rounded-3 shadow-sm" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading dashboard data...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center p-4 rounded-3 shadow-sm" role="alert">
        <h4 className="alert-heading">Error Loading Dashboard!</h4>
        <p>There was a problem fetching data for the dashboard.</p>
        <hr />
        <p className="mb-0">
          <strong>Details:</strong> {error.message}
        </p>
        <p className="mb-0 mt-2">
          Please ensure your ASP.NET Core backend is running and accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 px-4" style={{ maxWidth: '1600px' }}>
      <h2 className="display-4 fw-bold text-center mb-5 text-primary">Retail ERP Dashboard Analytics</h2>

      <h3 className="text-center text-muted fw-bold mb-4">📊 Key Performance Indicators</h3>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mb-5 justify-content-center">
        {/* KPI Cards */}
        <div className="col">
          <div className="card text-white bg-success shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Sales</h5>
              <p className="card-text display-5 fw-bolder">${totalSales}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-info shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Customers</h5>
              <p className="card-text display-5 fw-bolder">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-warning shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Unique Products</h5>
              <p className="card-text display-5 fw-bolder">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-danger shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Bills</h5>
              <p className="card-text display-5 fw-bolder">{totalBills}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-secondary shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Average Bill Value</h5>
              <p className="card-text display-5 fw-bolder">${averageBillValue}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-dark shadow-lg rounded-4 h-100 p-4">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Low Stock Products</h5>
              <p className="card-text display-5 fw-bolder">{lowStockProductsCount}</p>
              <small className="text-muted">(Stock &lt; 10 units)</small>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-center text-muted fw-bold mb-4">📈 Sales & Inventory Charts</h3>
      <div className="row g-5 mt-4">
        <div className="col-lg-6">
          <div className="card shadow-lg p-4 rounded-4 h-100" style={{ minHeight: '420px' }}>
            <h4 className="card-title text-center mb-4 text-success">Sales Over Last 7 Days</h4>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="sales" stroke="#28a745" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            {salesData.every(d => d.sales === 0) && (
              <p className="text-center text-muted mt-3">No sales recorded in the last 7 days.</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-lg p-4 rounded-4 h-100" style={{ minHeight: '420px' }}>
            <h4 className="card-title text-center mb-4 text-primary">Top 10 Product Stock Levels</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={productStockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
            {productStockData.length === 0 && (
              <p className="text-center text-muted mt-3">No product stock data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
