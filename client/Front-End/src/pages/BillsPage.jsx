import React, { useEffect, useState } from 'react';
import erpService from '../services/erpService';
import BillForm from '../components/BillForm';
import BillDetailModal from '../components/BillDetailModal';
import Badge from '../components/common/Badge';
import SearchBar from '../components/common/SearchBar';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import FilterPillGroup from '../components/common/FilterPillGroup';
import { formatCurrency, formatDate } from '../utils/formatters';

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false);
  const [refreshBills, setRefreshBills] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBills();
      setBills(data || []);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [refreshBills]);

  const handleBillAdded = () => {
    setShowBillForm(false);
    setRefreshBills(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setShowBillForm(false);
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    setDeleting(true);
    try {
      await erpService.deleteBill(billToDelete.id);
      setBillToDelete(null);
      setRefreshBills(prev => prev + 1);
    } catch (err) {
      console.error("Failed to delete bill:", err);
      alert(`Error deleting bill: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const filteredBills = bills.filter(bill => {
    if (paymentFilter !== 'all' && (bill.paymentMethod || 'Cash').toLowerCase() !== paymentFilter.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const invId = String(bill.id);
    const custName = bill.customer?.name?.toLowerCase() || '';
    return invId.includes(q) || custName.includes(q);
  });

  const paginatedBills = filteredBills.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalRevenue = bills.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const avgOrderValue = bills.length ? totalRevenue / bills.length : 0;

  return (
    <div className="container-fluid px-3 px-lg-5 py-4 erp-animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-inline-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success-emphasis rounded-pill erp-badge-text">
              Sales Ledger
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>POS Billing &amp; Invoices</span>
          </div>
          <h2 className="h3 fw-bold erp-heading mb-1">Billing &amp; Transactions</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Process point of sale orders, issue official receipts, and audit transaction records.
          </p>
        </div>

        <button
          className={`btn ${showBillForm ? 'btn-outline-secondary' : 'btn-primary'} rounded-pill px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2`}
          onClick={() => setShowBillForm(!showBillForm)}
        >
          <i className={`bi ${showBillForm ? 'bi-x-lg' : 'bi-plus-circle-fill'}`} />
          <span>{showBillForm ? 'Close Terminal' : 'New POS Bill / Sale'}</span>
        </button>
      </div>

      {showBillForm && (
        <div className="mb-4">
          <BillForm
            onBillAdded={handleBillAdded}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Top Ledger Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card erp-card-elevated border-0 p-3">
            <span className="text-muted text-uppercase fw-semibold erp-badge-text">Total Recorded Sales</span>
            <h3 className="h3 fw-bolder text-success erp-mono mb-0 mt-1">{formatCurrency(totalRevenue)}</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card erp-card-elevated border-0 p-3">
            <span className="text-muted text-uppercase fw-semibold erp-badge-text">Total Invoices Issued</span>
            <h3 className="h3 fw-bolder erp-heading mb-0 mt-1">{bills.length} bills</h3>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card erp-card-elevated border-0 p-3">
            <span className="text-muted text-uppercase fw-semibold erp-badge-text">Average Ticket Size</span>
            <h3 className="h3 fw-bolder text-primary erp-mono mb-0 mt-1">{formatCurrency(avgOrderValue)}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card erp-card-elevated border-0 p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-5">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice # or Customer name..."
            />
          </div>
          <div className="col-12 col-md-7">
            <FilterPillGroup
              options={[
                { id: 'all', label: 'All Invoices', count: bills.length },
                { id: 'credit card', label: 'Card' },
                { id: 'cash', label: 'Cash' },
                { id: 'upi', label: 'UPI / Digital' }
              ]}
              activeId={paymentFilter}
              onChange={setPaymentFilter}
            />
          </div>
        </div>
      </div>

      {/* Bills Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredBills.length === 0 ? (
        <EmptyState
          title="No billing transactions found"
          description="Try adjusting your filters or click 'New POS Bill' to record a sale."
          icon="bi-receipt"
          actionLabel="Create Bill"
          onAction={() => setShowBillForm(true)}
        />
      ) : (
        <div className="card erp-card-elevated border-0 shadow-sm overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <tr className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th className="ps-4">Invoice #</th>
                  <th>Date &amp; Time</th>
                  <th>Customer Account</th>
                  <th>Payment Mode</th>
                  <th className="text-end">Grand Total</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBills.map(bill => (
                  <tr key={bill.id}>
                    <td className="ps-4">
                      <span className="fw-bold erp-mono text-primary">#{bill.id}</span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.875rem' }}>
                      {formatDate(bill.billDate, 'full')}
                    </td>
                    <td>
                      <div className="fw-bold erp-heading">{bill.customer?.name || 'Walk-in Customer'}</div>
                      <small className="text-muted">{bill.customer?.contact || 'Standard Retail'}</small>
                    </td>
                    <td>
                      <Badge variant="primary" dot size="sm">
                        {bill.paymentMethod || 'Cash'}
                      </Badge>
                    </td>
                    <td className="text-end fw-bold text-success erp-mono" style={{ fontSize: '1rem' }}>
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                          onClick={() => handleViewDetails(bill)}
                        >
                          <i className="bi bi-eye" />
                          View
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2.5"
                          onClick={() => setBillToDelete(bill)}
                          title="Delete Bill"
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
            totalItems={filteredBills.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={Boolean(billToDelete)}
        onClose={() => setBillToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Void / Delete Transaction?"
        message={`Are you sure you want to permanently delete Invoice #${billToDelete?.id} for ${billToDelete?.customer?.name || 'Walk-in Customer'}?`}
        confirmLabel="Void Invoice"
        loading={deleting}
      />
    </div>
  );
}

export default BillsPage;
