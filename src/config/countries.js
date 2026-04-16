export const countries = {
  us: { name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', locale: 'en-US' },
  ca: { name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  uk: { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£', locale: 'en-GB' },
  au: { name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$', locale: 'en-AU' },
  ie: { name: 'Ireland', flag: '🇮🇪', currency: 'EUR', symbol: '€', locale: 'en-IE' },
  nz: { name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', symbol: 'NZ$', locale: 'en-NZ' },
}

export const calcsByCountry = {
  us: ['mortgage','tax','autoloan','rent-vs-buy','salary','loan-payoff','credit-card','heloc','student-loan','property-roi','refinance','affordability'],
  ca: ['mortgage','tax','autoloan','salary','rent-vs-buy','rideprofit'],
  uk: ['mortgage','tax','autoloan','salary','rent-vs-buy','rideprofit'],
  au: ['mortgage','tax','salary','rideprofit'],
  ie: ['mortgage','tax','salary','rideprofit'],
  nz: ['mortgage','tax','salary','rideprofit'],
}

export const calcMeta = {
  mortgage:      { label: 'Mortgage',       icon: '🏠', slug: 'mortgage' },
  tax:           { label: 'Tax',            icon: '📊', slug: 'tax' },
  autoloan:      { label: 'Auto Loan',      icon: '🚗', slug: 'autoloan' },
  'rent-vs-buy': { label: 'Rent vs Buy',   icon: '🏡', slug: 'rent-vs-buy' },
  salary:        { label: 'Salary',         icon: '💰', slug: 'salary' },
  rideprofit:    { label: 'RideProfit',     icon: '🚘', slug: 'rideprofit' },
  'loan-payoff': { label: 'Loan Payoff',   icon: '📉', slug: 'loan-payoff' },
  'credit-card': { label: 'Credit Card',   icon: '💳', slug: 'credit-card' },
  heloc:         { label: 'HELOC',          icon: '🏦', slug: 'heloc' },
  'student-loan':{ label: 'Student Loan',  icon: '🎓', slug: 'student-loan' },
  'property-roi':{ label: 'Property ROI',  icon: '📈', slug: 'property-roi' },
  refinance:     { label: 'Refinance',      icon: '🔄', slug: 'refinance' },
  affordability: { label: 'Affordability', icon: '✅', slug: 'affordability' },
}
