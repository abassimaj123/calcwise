/**
 * rates2026.js — 2026 benchmark rates by calculator and country.
 * Update this file when rates change. Do NOT edit calculator files for rate updates.
 */

export const MORTGAGE_RATES_2026 = {
  us: { avg: 6.80, low: 5.5,  high: 8.5,  hint: '2026 avg: 6.80% · 30yr fixed' },
  ca: { avg: 5.40, low: 4.2,  high: 7.0,  hint: '2026 avg: 5.40% · 5yr fixed' },
  uk: { avg: 4.80, low: 3.5,  high: 6.5,  hint: '2026 avg: 4.80% · 2yr fixed' },
  au: { avg: 6.50, low: 5.5,  high: 7.5,  hint: '2026 avg: 6.50% · variable' },
  ie: { avg: 4.00, low: 3.0,  high: 5.5,  hint: '2026 avg: 4.00% · 3yr fixed' },
  nz: { avg: 7.00, low: 6.0,  high: 8.5,  hint: '2026 avg: 7.00% · 1yr fixed' },
}

export const AUTOLOAN_RATES_2026 = {
  us: { avg: 7.50, hint: '2026 avg: 7.5% (good credit)' },
  ca: { avg: 6.90, hint: '2026 avg: 6.9% (good credit)' },
  uk: { avg: 8.50, hint: '2026 avg: 8.5%' },
  au: { avg: 7.50, hint: '2026 avg: 7.5%' },
  ie: { avg: 7.90, hint: '2026 avg: 7.9%' },
  nz: { avg: 9.50, hint: '2026 avg: 9.5%' },
}

export const CREDITCARD_RATES_2026 = {
  us: { avg: 21.5,  hint: 'US avg APR 2026: 21.5%' },
  ca: { avg: 19.99, hint: 'CA avg APR: 19.99% (most cards)' },
  uk: { avg: 23.0,  hint: 'UK avg APR: 23%' },
  au: { avg: 19.5,  hint: 'AU avg APR: 19.5%' },
  ie: { avg: 22.0,  hint: 'IE avg APR: 22%' },
  nz: { avg: 20.0,  hint: 'NZ avg APR: 20%' },
}

export const SALARY_MEDIANS_2026 = {
  us: { median: 75000, hint: 'US median: $75,000/yr' },
  ca: { median: 80000, hint: 'CA median: CA$80,000/yr' },
  uk: { median: 45000, hint: 'UK median: £45,000/yr' },
  au: { median: 85000, hint: 'AU median: A$85,000/yr' },
  ie: { median: 55000, hint: 'IE median: €55,000/yr' },
  nz: { median: 70000, hint: 'NZ median: NZ$70,000/yr' },
}

export const HOME_PRICE_MEDIANS_2026 = {
  us: { median: 420000, hint: 'Median 2026: $420k' },
  ca: { median: 700000, hint: 'Median 2026: CA$700k' },
  uk: { median: 285000, hint: 'Median 2026: £285k' },
  au: { median: 850000, hint: 'Median 2026: A$850k' },
  ie: { median: 420000, hint: 'Median 2026: €420k' },
  nz: { median: 780000, hint: 'Median 2026: NZ$780k' },
}
