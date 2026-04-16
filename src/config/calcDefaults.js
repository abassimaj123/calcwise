/**
 * calcDefaults.js — Default input values per calculator per country.
 * Update this file to change starting values. Do NOT edit calculator files.
 */

export const MORTGAGE_DEFAULTS = {
  us: { price: 420000, down: 84000,  rate: 6.80, term: 30 },
  ca: { price: 700000, down: 140000, rate: 5.40, term: 25 },
  uk: { price: 285000, down: 57000,  rate: 4.80, term: 25 },
  au: { price: 850000, down: 170000, rate: 6.50, term: 30 },
  ie: { price: 420000, down: 84000,  rate: 4.00, term: 30 },
  nz: { price: 780000, down: 156000, rate: 7.00, term: 30 },
}

export const AUTOLOAN_DEFAULTS = {
  us: { price: 45000, down: 5000, tradeIn: 3000, apr: 7.50, term: 60, taxRate: 7.0  },
  ca: { price: 52000, down: 5000, tradeIn: 3000, apr: 6.90, term: 60, taxRate: 13.0 },
  uk: { price: 28000, down: 3000, tradeIn: 2000, apr: 8.50, term: 48, taxRate: 0    },
  au: { price: 45000, down: 5000, tradeIn: 3000, apr: 7.50, term: 60, taxRate: 0    },
  ie: { price: 30000, down: 5000, tradeIn: 2000, apr: 7.90, term: 60, taxRate: 0    },
  nz: { price: 35000, down: 5000, tradeIn: 2000, apr: 9.50, term: 60, taxRate: 0    },
}

export const SALARY_DEFAULTS = {
  us: 75000,
  ca: 80000,
  uk: 45000,
  au: 85000,
  ie: 55000,
  nz: 70000,
}

export const TAX_DEFAULTS = {
  us: 75000,
  ca: 80000,
  uk: 45000,
  au: 85000,
  ie: 55000,
  nz: 70000,
}

export const CREDITCARD_DEFAULTS = {
  us: { balance: 8000,  apr: 21.5,  minRate: 2 },
  ca: { balance: 6000,  apr: 19.99, minRate: 2 },
  uk: { balance: 4000,  apr: 23.0,  minRate: 2 },
  au: { balance: 5000,  apr: 19.5,  minRate: 2 },
  ie: { balance: 4000,  apr: 22.0,  minRate: 2 },
  nz: { balance: 4000,  apr: 20.0,  minRate: 2 },
}

export const RIDEPROFIT_DEFAULTS = {
  us: { weeklyHours: 30, weeklyTrips: 60, avgFare: 18, fuelCostPerMile: 0.18, milesPerTrip: 8,  mileageRate: 0.67 },
  ca: { weeklyHours: 30, weeklyTrips: 60, avgFare: 20, fuelCostPerKm:   0.12, kmPerTrip:    12, mileageRate: 0.72 },
  uk: { weeklyHours: 30, weeklyTrips: 60, avgFare: 15, fuelCostPerMile: 0.18, milesPerTrip: 6,  mileageRate: 0.45 },
  au: { weeklyHours: 30, weeklyTrips: 60, avgFare: 22, fuelCostPerKm:   0.14, kmPerTrip:    10, mileageRate: 0    },
  ie: { weeklyHours: 30, weeklyTrips: 50, avgFare: 18, fuelCostPerKm:   0.13, kmPerTrip:    8,  mileageRate: 0    },
  nz: { weeklyHours: 30, weeklyTrips: 50, avgFare: 20, fuelCostPerKm:   0.13, kmPerTrip:    10, mileageRate: 0    },
}

export const RENTVSBUY_DEFAULTS = {
  us: { homePrice: 420000, downPct: 20, mortgageRate: 6.80, term: 30, monthlyRent: 2200, rentIncrease: 3, appreciation: 3.5, investReturn: 7 },
  ca: { homePrice: 700000, downPct: 20, mortgageRate: 5.40, term: 25, monthlyRent: 2500, rentIncrease: 3, appreciation: 3.0, investReturn: 7 },
  uk: { homePrice: 285000, downPct: 20, mortgageRate: 4.80, term: 25, monthlyRent: 1600, rentIncrease: 4, appreciation: 3.0, investReturn: 6 },
  au: { homePrice: 850000, downPct: 20, mortgageRate: 6.50, term: 30, monthlyRent: 2800, rentIncrease: 4, appreciation: 4.0, investReturn: 7 },
  ie: { homePrice: 420000, downPct: 20, mortgageRate: 4.00, term: 30, monthlyRent: 2000, rentIncrease: 5, appreciation: 3.5, investReturn: 6 },
  nz: { homePrice: 780000, downPct: 20, mortgageRate: 7.00, term: 30, monthlyRent: 2500, rentIncrease: 4, appreciation: 3.5, investReturn: 7 },
}

export const AFFORDABILITY_DEFAULTS = {
  us: { income: 100000, monthlyDebts: 500,  downPayment:  60000, rate: 6.80, term: 30 },
  ca: { income: 110000, monthlyDebts: 400,  downPayment: 100000, rate: 5.40, term: 25 },
  uk: { income:  55000, monthlyDebts: 300,  downPayment:  50000, rate: 4.80, term: 25 },
  au: { income: 110000, monthlyDebts: 500,  downPayment: 120000, rate: 6.50, term: 30 },
  ie: { income:  70000, monthlyDebts: 400,  downPayment:  60000, rate: 4.00, term: 30 },
  nz: { income:  90000, monthlyDebts: 400,  downPayment: 100000, rate: 7.00, term: 30 },
}
