import React, { useEffect, useState } from 'react';
import erpService from '../services/erpService';
import Badge from './common/Badge';
import LoadingSkeleton from './common/LoadingSkeleton';
import EmptyState from './common/EmptyState';
import ConfirmDialog from './common/ConfirmDialog';
import { formatCurrency } from '../utils/formatters';

function ProductList({
  onEditProduct,
  onProductDeleted,
  refreshTrigger,
  searchTerm,
  minStock,
  viewMode = 'table'
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const valA = a[sortBy] ?? '';
    const valB = b[sortBy] ?? '';
    if (typeof valA === 'string') {
      const comp = valA.localeCompare(String(valB));
      return sortOrder === 'asc' ? comp : -comp;
    }
    return sortOrder === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await erpService.getProducts({ search: searchTerm, minStock });
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger, searchTerm, minStock]);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await erpService.deleteProduct(productToDelete.id);
      setProductToDelete(null);
      if (onProductDeleted) onProductDeleted();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const getStockBadge = (quantity) => {
    const qty = Number(quantity) || 0;
    if (qty === 0) return <Badge variant="danger" dot>Out of Stock</Badge>;
    if (qty < 10) return <Badge variant="warning" dot>Low Stock ({qty})</Badge>;
    return <Badge variant="success" dot>In Stock ({qty})</Badge>;
  };

  if (loading) {
    return <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'table'} count={6} />;
  }

  if (error && !products.length) {
    return (
      <div className="alert alert-danger p-4 rounded-3 shadow-sm text-center" role="alert">
        <h5 className="alert-heading fw-bold">Unable to Fetch Inventory</h5>
        <p className="mb-0">{error.message || 'Error communicating with backend'}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products match your criteria"
        description="Try adjusting your keyword search or minimum stock threshold."
        icon="bi-box-seam"
      />
    );
  }

  return (
    <div>
      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {sortedProducts.map(product => (
            <div key={product.id} className="col">
              <div className="card erp-card-elevated erp-hover-lift h-100 p-4 border-0 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill erp-badge-text">
                      {product.category || 'General'}
                    </span>
                    {getStockBadge(product.stockQuantity)}
                  </div>
                  <h4 className="h5 fw-bold erp-heading mb-2">{product.name}</h4>
                  <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                    {product.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-top" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="h4 fw-bolder text-primary mb-0 erp-mono">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                      SKU #{product.id}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary rounded-pill flex-grow-1 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5"
                      onClick={() => onEditProduct(product)}
                    >
                      <i className="bi bi-pencil" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      onClick={() => setProductToDelete(product)}
                      title="Delete Product"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card erp-card-elevated border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <tr className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th className="ps-4 cursor-pointer" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    <div className="d-inline-flex align-items-center gap-1">
                      <span>Product Name</span>
                      <i className={`bi ${sortBy === 'name' ? (sortOrder === 'asc' ? 'bi-sort-alpha-down text-primary' : 'bi-sort-alpha-up text-primary') : 'bi-arrow-down-up text-muted opacity-50'}`} />
                    </div>
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    <div className="d-inline-flex align-items-center gap-1">
                      <span>Category</span>
                      <i className={`bi ${sortBy === 'category' ? (sortOrder === 'asc' ? 'bi-sort-alpha-down text-primary' : 'bi-sort-alpha-up text-primary') : 'bi-arrow-down-up text-muted opacity-50'}`} />
                    </div>
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    <div className="d-inline-flex align-items-center gap-1">
                      <span>Unit Price</span>
                      <i className={`bi ${sortBy === 'price' ? (sortOrder === 'asc' ? 'bi-sort-numeric-down text-primary' : 'bi-sort-numeric-up text-primary') : 'bi-arrow-down-up text-muted opacity-50'}`} />
                    </div>
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('stockQuantity')} style={{ cursor: 'pointer' }}>
                    <div className="d-inline-flex align-items-center gap-1">
                      <span>Stock Status</span>
                      <i className={`bi ${sortBy === 'stockQuantity' ? (sortOrder === 'asc' ? 'bi-sort-numeric-down text-primary' : 'bi-sort-numeric-up text-primary') : 'bi-arrow-down-up text-muted opacity-50'}`} />
                    </div>
                  </th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => (
                  <tr key={product.id}>
                    <td className="ps-4">
                      <div className="fw-bold erp-heading">{product.name}</div>
                      <small className="text-muted erp-mono">SKU-{String(product.id).padStart(4, '0')}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill erp-badge-text">
                        {product.category || 'Standard'}
                      </span>
                    </td>
                    <td className="fw-bold erp-mono text-dark-emphasis">
                      {formatCurrency(product.price)}
                    </td>
                    <td>
                      {getStockBadge(product.stockQuantity)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                          onClick={() => onEditProduct(product)}
                        >
                          <i className="bi bi-pencil me-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2.5"
                          onClick={() => setProductToDelete(product)}
                          title="Delete Product"
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
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product?"
        message={`Are you sure you want to permanently remove "${productToDelete?.name}" from warehouse catalog?`}
        confirmLabel="Delete Product"
        loading={deleting}
      />
    </div>
  );
}

export default ProductList;
