// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\BillsPage.jsx
import React, { useEffect, useState } from 'react';
import BillForm from '../components/BillForm'; // Import the BillForm component
import BillDetailModal from '../components/BillDetailModal'; // Import the new BillDetailModal component

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false); // State to toggle form visibility
  const [refreshBills, setRefreshBills] = useState(0); // State to trigger bill list refresh
  const [showDetailModal, setShowDetailModal] = useState(false); // State for detail modal visibility
  const [selectedBill, setSelectedBill] = useState(null); // State to hold the bill for details

  const API_URL = 'http://localhost:5219/api/bills'; // Confirm your backend's HTTP port

  const fetchBills = async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null);   // Clear any previous errors
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

  useEffect(() => {
    fetchBills();
  }, [refreshBills]); // Re-fetch bills when refreshBills state changes

  const handleBillAdded = () => {
    setShowBillForm(false); // Hide the form
    setRefreshBills(prev => prev + 1); // Trigger a refresh of the bill list
  };

  const handleCancelForm = () => {
    setShowBillForm(false);
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm(`Are you sure you want to delete Bill ID: ${billId}?`)) {
      try {
        const response = await fetch(`${API_URL}/${billId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }

        // If deletion is successful, refresh the list of bills
        setRefreshBills(prev => prev + 1);
        alert('Bill deleted successfully!'); // Use custom modal later
      } catch (err) {
        console.error("Failed to delete bill:", err);
        alert(`Error deleting bill: ${err.message}`); // Use custom modal later
      }
    }
  };

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

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-success"
          onClick={() => setShowBillForm(!showBillForm)}
        >
          {showBillForm ? 'Hide Bill Form' : 'Create New Bill'}
        </button>
      </div>

      {showBillForm && (
        <BillForm
          onBillAdded={handleBillAdded}
          onCancel={handleCancelForm}
        />
      )}

      {bills.length === 0 ? (
        <div className="alert alert-info text-center p-4 rounded-3 shadow-sm" role="alert">
          <h4 className="alert-heading">No Bills Found!</h4>
          <p className="mb-0">
            The backend returned no bill data. Please create a new bill using the form above.
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
                <th scope="col">Actions</th> {/* New Actions column */}
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
                            {item.quantity}x {item.product ? item.product.name : 'Unknown Product'} (${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'} each)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No items'
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleViewDetails(bill)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBill(bill.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bill Detail Modal */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}

export default BillsPage;
