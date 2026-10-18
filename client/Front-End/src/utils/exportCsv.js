/**
 * CSV Export utility for Retail ERP tables and reports
 */

export function exportToCsv(data = [], filename = 'retail_erp_export.csv', columns = null) {
  if (!data || !data.length) {
    alert('No data to export.');
    return;
  }

  const keys = columns ? Object.keys(columns) : Object.keys(data[0]);
  const headers = columns ? Object.values(columns) : keys;

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(escapeCell).join(',');
  const rows = data.map(item => {
    return keys.map(k => escapeCell(item[k])).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
