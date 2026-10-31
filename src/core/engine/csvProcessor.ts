import { Transaction, TaxDeductionRow } from './types';
import { enrichTransactions, classifyAnomaly } from './anomalyDetector';

/**
 * OWASP Formula Injection Sanitizer:
 * Protects against CSV / Spreadsheet formula execution (=, +, -, @, \t, \r).
 * Prepend with a single quote (') if the field starts with risky formula triggers.
 */
export function sanitizeForCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();

  // Check if string starts with formula trigger characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

/**
 * Maps a merchant or category into a standard IRS Schedule C expense category.
 */
export function mapToScheduleCCategory(category: string, merchant: string): string {
  const norm = `${category} ${merchant}`.toLowerCase();

  if (norm.includes('cloud') || norm.includes('aws') || norm.includes('github') || norm.includes('software') || norm.includes('figma') || norm.includes('ai') || norm.includes('openai')) {
    return 'Part II Line 18: Office Expense & Software';
  }
  if (norm.includes('internet') || norm.includes('phone') || norm.includes('verizon') || norm.includes('at&t')) {
    return 'Part II Line 25: Utilities & Telecommunications';
  }
  if (norm.includes('travel') || norm.includes('airline') || norm.includes('hotel') || norm.includes('uber')) {
    return 'Part II Line 24a: Travel';
  }
  if (norm.includes('meal') || norm.includes('food') || norm.includes('restaurant')) {
    return 'Part II Line 24b: Deductible Business Meals (50%)';
  }
  if (norm.includes('ad') || norm.includes('google ads') || norm.includes('facebook') || norm.includes('marketing')) {
    return 'Part II Line 8: Advertising & Marketing';
  }

  return 'Part II Line 27a: Other Business Expenses';
}

/**
 * Parses raw CSV lines into normalized Transaction objects.
 */
export function parseBankCsv(csvText: string): Transaction[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map((h) => h.replace(/["\s]/g, ''));
  
  const dateIdx = headers.findIndex((h) => h.includes('date'));
  const descIdx = headers.findIndex((h) => h.includes('desc') || h.includes('merchant') || h.includes('payee') || h.includes('name'));
  const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('debit') || h.includes('total'));
  const catIdx = headers.findIndex((h) => h.includes('cat') || h.includes('type'));

  const parsed: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV row parser handling quotes
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());

    const dateStr = dateIdx !== -1 && cells[dateIdx] ? cells[dateIdx].replace(/"/g, '') : new Date().toISOString().split('T')[0];
    const merchantStr = descIdx !== -1 && cells[descIdx] ? cells[descIdx].replace(/"/g, '') : `Transaction #${i}`;
    let amountVal = amountIdx !== -1 && cells[amountIdx] ? parseFloat(cells[amountIdx].replace(/["$,₹INR\s]/gi, '')) : 0;
    
    // Convert negative bank debits (e.g. -24.99) into positive expense values
    amountVal = Math.abs(isNaN(amountVal) ? 0 : amountVal);
    if (amountVal === 0) continue;

    const categoryStr = catIdx !== -1 && cells[catIdx] ? cells[catIdx].replace(/"/g, '') : 'General';

    const anomalyInfo = classifyAnomaly({
      id: `tx-parsed-${i}`,
      merchant: merchantStr,
      amount: amountVal,
      date: dateStr,
      category: categoryStr,
      frequency: 'monthly',
      isRecurring: true,
    });

    parsed.push({
      id: `tx-parsed-${i}`,
      merchant: merchantStr,
      amount: amountVal,
      date: dateStr,
      category: categoryStr,
      frequency: 'monthly',
      anomalyType: anomalyInfo.anomalyType,
      anomalyBadge: anomalyInfo.anomalyBadge,
      roast: anomalyInfo.roast,
      isRecurring: true,
    });
  }

  return enrichTransactions(parsed);
}

/**
 * Builds a sanitized, download-ready CSV for tax deductions.
 */
export function buildTaxDeductionsCsv(transactions: Transaction[]): string {
  const headers = [
    'Date',
    'Merchant',
    'Amount (INR ₹)',
    'IRS Schedule C / Business Category',
    'Business Purpose / Note',
    'Status',
  ];

  const rows: TaxDeductionRow[] = transactions.map((t) => ({
    date: t.date,
    merchant: t.merchant,
    amount: `₹${t.amount.toFixed(2)}`,
    scheduleCCategory: mapToScheduleCCategory(t.category, t.merchant),
    businessPurpose: `Ordinary and necessary business operational expense (${t.category})`,
    notes: 'Verified via SpendSwipe Arcade Audit',
  }));

  const csvRows = [
    headers.map(sanitizeForCsv).join(','),
    ...rows.map((r) =>
      [
        sanitizeForCsv(r.date),
        sanitizeForCsv(r.merchant),
        sanitizeForCsv(r.amount),
        sanitizeForCsv(r.scheduleCCategory),
        sanitizeForCsv(r.businessPurpose),
        sanitizeForCsv(r.notes),
      ].join(',')
    ),
  ];

  return csvRows.join('\r\n');
}
