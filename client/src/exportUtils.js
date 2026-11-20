// Shared Export & Formatting Utilities
// Independent of React components to avoid circular import bundles

export function downloadCSV(filename, rows) {
  const processRow = (row) => row.map(val => {
    let text = (val === null || val === undefined) ? '' : val.toString();
    if (text.search(/("|,|\n)/g) >= 0) text = `"${text.replace(/"/g, '""')}"`;
    return text;
  }).join(',');
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(processRow).join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatWeightInKg(val) {
  if (val === null || val === undefined || val === '') return '—';
  const str = String(val).trim();
  if (!str) return '—';

  if (/kg\s*$/i.test(str)) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `${parseFloat(num.toFixed(3))} kg`;
    return str;
  }

  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return str;

  const kg = num / 1000;
  return `${parseFloat(kg.toFixed(3))} kg`;
}

export function formatWeightInGrams(val) {
  if (val === null || val === undefined || val === '') return '';
  const str = String(val).trim();
  if (!str) return '';

  if (/kg\s*$/i.test(str)) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return String(Math.round(num * 1000));
    return str;
  }

  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return str;
  return String(Math.round(num));
}
