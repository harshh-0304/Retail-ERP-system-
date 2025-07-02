// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\pages\CustomersPage.jsx
import React, { useEffect, useState } from 'react';
import CustomerForm from '../components/CustomerForm'; // Import the CustomerForm component

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false); // State to toggle form visibility
  const [refreshCustomers, setRefreshCustomers] = useState(0); // State to trigger customer list refresh

  useEffect(() => {
    const API_URL = 'http://localhost:5219/api/customers'; // Confirm your backend's HTTP port

    const fetchCustomers = async () => {
      setLoading(true); // Set loading to true when fetching
      setError(null);   // Clear any previous errors
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    // Add refreshCustomers to dependency array so it refetches when a new customer is added
  }, [refreshCustomers]);

  const handleCustomerAdded = () => {
    setShowCustomerForm(false); // Hide the form
    setRefreshCustomers(prev => prev + 1); // Trigger a refresh of the customer list
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-light rounded-3 shadow-sm">
        <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-muted">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center p-4 rounded-3 shadow-sm" role="alert">
        <h4 className="alert-heading">Error Loading Customers!</h4>
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
      <h3 className="text-center mb-4">Our Customers</h3>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-info text-white" // Bootstrap info color for button
          onClick={() => setShowCustomerForm(!showCustomerForm)}
        >
          {showCustomerForm ? 'Hide Form' : 'Add New Customer'}
        </button>
      </div>

      {showCustomerForm && (
        <CustomerForm
          onCustomerAdded={handleCustomerAdded}
          onCancel={() => setShowCustomerForm(false)}
        />
      )}

      {customers.length === 0 ? (
        <div className="alert alert-info text-center p-4 rounded-3 shadow-sm" role="alert">
          <h4 className="alert-heading">No Customers Found!</h4>
          <p className="mb-0">
            The backend returned no customer data. Please add some customers using the form above or through Entity Framework Core seeding.
          </p>
        </div>
      ) : (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Email</th>
                {/* Add a column for actions (Edit/Delete) later */}
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <th scope="row">{customer.id}</th>
                  <td>{customer.name}</td>
                  <td>{customer.contact}</td>
                  <td>{customer.email || '-'}</td> {/* Display '-' if email is null */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;
