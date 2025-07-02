// File: C:\Users\bakas\Desktop\Retail ERP\client\Front-End\src\components\BillForm.jsx
import React, { useState, useEffect } from 'react';

function BillForm({ onBillAdded, onCancel }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [billItems, setBillItems] = useState([]); // Array of { productId, quantity, priceAtSale, productName }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Confirm your backend's HTTP port here
  const API_BASE_URL = 'http://localhost:5219/api';

  // Fetch customers and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch(`${API_BASE_URL}/customers`);
        const customersData = await customersResponse.json();
        setCustomers(customersData);

        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

      } catch (err) {
        console.error("Failed to fetch data for BillForm:", err);
        setError("Failed to load customers or products. Please check backend.");
      }
    };
    fetchData();
  }, []);

  // Calculate total amount of the bill
  const calculateTotalAmount = () => {
    return billItems.reduce((total, item) => total + (item.quantity * item.priceAtSale), 0);
  };

  const handleProductSelection = (e) => {
    const productId = parseInt(e.target.value);
    if (!productId) return; // If "Select Product" is chosen

    const selectedProduct = products.find(p => p.id === productId);

    // Prevent adding the same product multiple times, or allow if quantity is editable
    if (selectedProduct && !billItems.some(item => item.productId === productId)) {
      setBillItems(prevItems => [
        ...prevItems,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          priceAtSale: selectedProduct.price, // Capture price at the time of sale
          quantity: 1, // Default quantity
          availableStock: selectedProduct.stockQuantity // For validation
        }
      ]);
    }
    e.target.value = ''; // Reset select input
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...billItems];
    const item = updatedItems[index];
    const parsedQuantity = parseInt(newQuantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      item.quantity = 0; // Or keep previous valid quantity
    } else if (parsedQuantity > item.availableStock) {
      item.quantity = item.availableStock; // Cap at available stock
      setError(`Quantity for ${item.productName} cannot exceed available stock (${item.availableStock}).`);
    } else {
      item.quantity = parsedQuantity;
      setError(null); // Clear error if quantity is valid
    }
    setBillItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setBillItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!selectedCustomerId) {
      setError("Please select a customer.");
      setSubmitting(false);
      return;
    }
    if (billItems.length === 0) {
      setError("Please add at least one product to the bill.");
      setSubmitting(false);
      return;
    }
    if (billItems.some(item => item.quantity <= 0)) {
      setError("All product quantities must be greater than zero.");
      setSubmitting(false);
      return;
    }

    const billToSend = {
      customerId: parseInt(selectedCustomerId),
      totalAmount: calculateTotalAmount(),
      // Ensure billItems are mapped to the exact structure the backend expects for BillItem model
      items: billItems.map(item => ({ // Changed to 'items' to match backend Bill.Items property name
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.priceAtSale // Changed to unitPrice to match backend BillItem.UnitPrice
      }))
    };

    console.log("Payload being sent to backend:", billToSend); // ADDED THIS LOG

    try {
      const response = await fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
      }

      const newBill = await response.json();
      setSuccess(true);
      // Clear form
      setSelectedCustomerId('');
      setBillItems([]);
      if (onBillAdded) {
        onBillAdded(newBill); // Notify parent component
      }
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error("Failed to create bill:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-3">
      <h4 className="card-title text-success mb-4">Create New Bill</h4>
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Bill created successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Selection */}
        <div className="mb-3">
          <label htmlFor="customerSelect" className="form-label">Select Customer</label>
          <select
            id="customerSelect"
            className="form-select"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            required
            disabled={submitting}
          >
            <option value="">-- Select a Customer --</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.contact})
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection for Bill Items */}
        <div className="mb-3">
          <label htmlFor="productSelect" className="form-label">Add Products to Bill</label>
          <select
            id="productSelect"
            className="form-select"
            onChange={handleProductSelection}
            disabled={submitting}
          >
            <option value="">-- Select a Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (${product.price.toFixed(2)}) - Stock: {product.stockQuantity}
              </option>
            ))}
          </select>
        </div>

        {/* Bill Items List */}
        {billItems.length > 0 && (
          <div className="mb-3">
            <h6 className="mb-3">Bill Items:</h6>
            <ul className="list-group mb-3">
              {billItems.map((item, index) => (
                <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {item.productName} (${item.priceAtSale.toFixed(2)} each)
                  </div>
                  <div className="d-flex align-items-center">
                    <input
                      type="number"
                      className="form-control form-control-sm me-2"
                      style={{ width: '80px' }}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      min="1"
                      max={item.availableStock} // Max quantity is available stock
                      disabled={submitting}
                    />
                    <span className="me-2">x ${item.priceAtSale.toFixed(2)} = ${(item.quantity * item.priceAtSale).toFixed(2)}</span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={submitting}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-end fs-5 fw-bold">
              Total: <span className="text-success">${calculateTotalAmount().toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Creating...</span>
              </>
            ) : (
              'Create Bill'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BillForm;
