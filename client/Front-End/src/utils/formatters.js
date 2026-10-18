/**
 * Retail ERP formatting helpers
 */

export function formatCurrency(amount, currency = 'USD') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatDate(dateStr, style = 'medium') {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);

    if (style === 'short') {
      return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
    }
    if (style === 'time') {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (style === 'full') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return String(dateStr);
  }
}

export function formatPercent(val) {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
}

export function formatNumber(num) {
  const n = typeof num === 'number' ? num : parseFloat(num) || 0;
  return new Intl.NumberFormat('en-US').format(n);
}

export function truncateText(text, max = 30) {
  if (!text) return '';
  return text.length > max ? `${text.substring(0, max)}...` : text;
}
