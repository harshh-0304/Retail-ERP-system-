// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\BillsPage.jsx
import React, { useEffect, useState } from 'react';

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = 'http://localhost:5219/api/bills'; // Confirm your backend's HTTP port

    const fetchBills = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Response: ${errorText}`);
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        console.error("Failed to fetch bills:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-light rounded-3 shadow-sm">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center p-4 rounded-3 shadow-sm" role="alert">
        <h4 className="alert-heading">Error Loading Bills!</h4>
        <p>There was a problem fetching data from the backend.</p>
        <hr />
        <p className="mb-0">
          <strong>Details:</strong> {error.message}
        </p>
        <p className="mb-0 mt-2">
          Please ensure your ASP.NET Core backend is running and accessible at: <br />
          <code className="text-break">{API_URL}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">All Bills</h3>
      {bills.length === 0 ? (
        <div className="alert alert-info text-center p-4 rounded-3 shadow-sm" role="alert">
          <h4 className="alert-heading">No Bills Found!</h4>
          <p className="mb-0">
            The backend returned no bill data. Please add some bills using Postman or through Entity Framework Core seeding.
          </p>
        </div>
      ) : (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-success">
              <tr>
                <th scope="col">Bill ID</th>
                <th scope="col">Date</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Items</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id}>
                  <th scope="row">{bill.id}</th>
                  <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td>{bill.customer ? bill.customer.name : 'N/A'}</td>
                  <td>${bill.totalAmount ? bill.totalAmount.toFixed(2) : '0.00'}</td>
                  <td>
                    {bill.items && bill.items.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {bill.items.map(item => (
                          <li key={item.id}>
                            {item.quantity}x {item.product ? item.product.name : 'Unknown Product'} (${item.unitPrice.toFixed(2)} each)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No items'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BillsPage;
