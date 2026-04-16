export const countries = {
  us: { name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', locale: 'en-US' },
  ca: { name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  uk: { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', locale: 'en-GB' },
  au: { name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$', locale: 'en-AU' },
  ie: { name: 'Ireland', flag: '🇮🇪', currency: 'EUR', symbol: '€', locale: 'en-IE' },
  nz: { name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', symbol: 'NZ$', locale: 'en-NZ' },
}

export const calcsByCountry = {
  us: ['mortgage','tax','salary','autoloan','rent-vs-buy','savings','retirement','budget','debt-payoff','net-worth','loan-payoff','credit-card','heloc','student-loan','property-roi','refinance','affordability'],
  ca: ['mortgage','tax','salary','autoloan','rent-vs-buy','savings','retirement','budget','debt-payoff','net-worth','rideprofit','loan-payoff','credit-card','affordability','property-roi','refinance'],
  uk: ['mortgage','tax','salary','autoloan','rent-vs-buy','savings','retirement','budget','debt-payoff','net-worth','rideprofit','affordability','loan-payoff','credit-card','property-roi','refinance','stamp-duty'],
  au: ['mortgage','tax','salary','savings','retirement','budget','debt-payoff','net-worth','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability'],
  ie: ['mortgage','tax','salary','savings','retirement','budget','debt-payoff','net-worth','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability'],
  nz: ['mortgage','tax','salary','savings','retirement','budget','debt-payoff','net-worth','rideprofit','autoloan','rent-vs-buy','loan-payoff','credit-card','affordability'],
}

export const calcMeta = {
  mortgage:      { label: 'Mortgage',        icon: '🏠', slug: 'mortgage' },
  tax:           { label: 'Tax',             icon: '📊', slug: 'tax' },
  autoloan:      { label: 'Auto Loan',       icon: '🚗', slug: 'autoloan' },
  'rent-vs-buy': { label: 'Rent vs Buy',    icon: '🏡', slug: 'rent-vs-buy' },
  salary:        { label: 'Salary',          icon: '💰', slug: 'salary' },
  rideprofit:    { label: 'RideProfit',      icon: '🚘', slug: 'rideprofit' },
  'loan-payoff': { label: 'Loan Payoff',    icon: '📉', slug: 'loan-payoff' },
  'credit-card': { label: 'Credit Card',    icon: '💳', slug: 'credit-card' },
  heloc:         { label: 'HELOC',           icon: '🏦', slug: 'heloc' },
  'student-loan':{ label: 'Student Loan',   icon: '🎓', slug: 'student-loan' },
  'property-roi':{ label: 'Property ROI',   icon: '📈', slug: 'property-roi' },
  refinance:     { label: 'Refinance',       icon: '🔄', slug: 'refinance' },
  affordability: { label: 'Affordability',  icon: '✅', slug: 'affordability' },
  'stamp-duty':  { label: 'Stamp Duty',     icon: '🏷️', slug: 'stamp-duty' },
  savings:       { label: 'Savings',         icon: '🐷', slug: 'savings' },
  retirement:    { label: 'Retirement',      icon: '🏖️', slug: 'retirement' },
  'net-worth':   { label: 'Net Worth',       icon: '💎', slug: 'net-worth' },
  'debt-payoff': { label: 'Debt Payoff',    icon: '⚡', slug: 'debt-payoff' },
  budget:        { label: 'Budget Planner', icon: '📋', slug: 'budget' },
}
