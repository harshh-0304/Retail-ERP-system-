/**
 * Invoice, SKU, and Billing Calculations
 */

export function generateInvoiceNumber(id, date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = isNaN(d.getFullYear()) ? new Date().getFullYear() : d.getFullYear();
  const paddedId = String(id || Math.floor(Math.random() * 1000)).padStart(4, '0');
  return `INV-${year}-${paddedId}`;
}

export function generateSKU(name = '', category = 'GEN', id = 1) {
  const cleanCat = category.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() || 'GEN';
  const cleanName = name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() || 'ITM';
  const paddedId = String(id).padStart(4, '0');
  return `${cleanCat}-${cleanName}-${paddedId}`;
}

export function calculateBillTotals(items = [], taxRate = 0.08, discountPercent = 0) {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.priceAtSale || item.unitPrice || item.price) || 0;
    return sum + (qty * price);
  }, 0);

  const discountAmount = subtotal * (Number(discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * Number(taxRate);
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal,
    discountPercent,
    discountAmount,
    taxRate,
    taxAmount,
    grandTotal
  };
}

export function getPaymentBadgeVariant(method = 'Cash') {
  switch (method.toLowerCase()) {
    case 'credit card':
    case 'card':
      return { variant: 'primary', icon: 'bi-credit-card-2-front' };
    case 'upi':
    case 'digital':
      return { variant: 'info', icon: 'bi-phone' };
    case 'bank transfer':
      return { variant: 'secondary', icon: 'bi-bank' };
    case 'cash':
    default:
      return { variant: 'success', icon: 'bi-cash-coin' };
  }
}
