import React, { useEffect, useState } from 'react';
import erpService from '../services/erpService';
import CustomerForm from '../components/CustomerForm';
import Badge from '../components/common/Badge';
import SearchBar from '../components/common/SearchBar';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [refreshCustomers, setRefreshCustomers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await erpService.getCustomers();
        setCustomers(data || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshCustomers]);

  const handleCustomerAdded = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
    setRefreshCustomers(prev => prev + 1);
  };

  const handleCustomerUpdated = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
    setRefreshCustomers(prev => prev + 1);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      await erpService.deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
      setRefreshCustomers(prev => prev + 1);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert(`Error deleting customer: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelForm = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'CU';
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.contact?.toLowerCase().includes(q)
    );
  });

  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container-fluid px-3 px-lg-5 py-4 erp-animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge bg-info-subtle text-info-emphasis rounded-pill erp-badge-text">
              Client Relations
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Customer Profiles</span>
          </div>
          <h2 className="h3 fw-bold erp-heading mb-1">Customer Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Browse registered clients, update contacts, and review sales engagement.
          </p>
        </div>

        <button
          className={`btn ${showCustomerForm ? 'btn-outline-secondary' : 'btn-primary'} rounded-pill px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2`}
          onClick={() => {
            if (showCustomerForm) handleCancelForm();
            else { setEditingCustomer(null); setShowCustomerForm(true); }
          }}
        >
          <i className={`bi ${showCustomerForm ? 'bi-x-lg' : 'bi-person-plus-fill'}`} />
          <span>{showCustomerForm && !editingCustomer ? 'Close Form' : (editingCustomer ? 'Cancel Edit' : 'Add New Customer')}</span>
        </button>
      </div>

      {showCustomerForm && (
        <div className="mb-4">
          <CustomerForm
            initialData={editingCustomer}
            onCustomerAdded={handleCustomerAdded}
            onCustomerUpdated={handleCustomerUpdated}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="card erp-card-elevated border-0 p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, or phone..."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-7 text-md-end text-muted" style={{ fontSize: '0.875rem' }}>
            <span>Total Clients: <strong className="text-dark-emphasis">{customers.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try modifying your search or click 'Add New Customer' to register a client."
          icon="bi-people"
          actionLabel="Add Customer"
          onAction={() => setShowCustomerForm(true)}
        />
      ) : (
        <div className="card erp-card-elevated border-0 shadow-sm overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <tr className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th className="ps-4">Customer</th>
                  <th>Contact Phone</th>
                  <th>Email Address</th>
                  <th>Tier Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white erp-gradient-primary shadow-sm"
                          style={{ width: 40, height: 40, fontSize: '0.85rem' }}
                        >
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <div className="fw-bold erp-heading">{customer.name}</div>
                          <small className="text-muted erp-mono">CID-{String(customer.id).padStart(4, '0')}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="erp-mono text-dark-emphasis">{customer.contact || '-'}</span>
                    </td>
                    <td className="text-muted">
                      {customer.email ? (
                        <a href={`mailto:${customer.email}`} className="text-decoration-none text-primary">
                          {customer.email}
                        </a>
                      ) : '-'}
                    </td>
                    <td>
                      <Badge variant={customer.tier === 'VIP' ? 'primary' : 'success'} dot size="sm">
                        {customer.tier || 'Regular'}
                      </Badge>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                          onClick={() => handleEditClick(customer)}
                        >
                          <i className="bi bi-pencil me-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2.5"
                          onClick={() => setCustomerToDelete(customer)}
                          title="Delete Customer"
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer Profile?"
        message={`Are you sure you want to delete profile for "${customerToDelete?.name}"? Previous billing records will remain archived.`}
        confirmLabel="Delete Customer"
        loading={deleting}
      />
    </div>
  );
}

export default CustomersPage;
