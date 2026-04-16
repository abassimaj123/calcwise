/**
 * mortgageRules.js — Country-specific mortgage rules, stress tests, insurance.
 * Update this file when regulations change.
 */

export const MORTGAGE_RULES = {
  us: {
    stressTest: null,
    pmiThreshold: 80,       // LTV% above which PMI required
    pmiRate: 0.0085,        // 0.85% of loan per year (avg)
    minDown: { conventional: 3, fha: 3.5, va: 0, usda: 0 },
    fhaMIP: { upfront: 0.0175, annual: 0.0055 },
    vaFundingFee: 0.0215,
    usdaFee: { upfront: 0.01, annual: 0.0035 },
  },
  ca: {
    stressTest: { buffer: 2.0, floor: 5.25 },  // max(rate+2%, 5.25%)
    cmhcRates: [
      { maxDown: 9.99,  rate: 0.040 },
      { maxDown: 14.99, rate: 0.031 },
      { maxDown: 19.99, rate: 0.028 },
      { maxDown: 100,   rate: 0     },
    ],
    maxInsuredAmortization: 25,
    maxAmortization: 30,
    minDown: { under500k: 5, between500_1m: 10, over1m: 20 },
    gdsLimit: 0.32,
    tdsLimit: 0.44,
  },
  uk: {
    stressTest: { buffer: 3.0 },  // FCA: rate + 3%
    ltv: { max: 95, ftbMax: 95, btlMax: 75 },
    sdlt: {
      standard:   [[250000, 0], [675000, 0.05], [575000, 0.10], [Infinity, 0.12]],
      ftb:        [[425000, 0], [200000, 0.05], [Infinity, 'standard']],
      additional: 0.03,
    },
    interestOnly: true,
  },
  au: {
    stressTest: { buffer: 3.0 },  // APRA: rate + 3%
    lmiThreshold: 80,             // LVR% above which LMI required
    lmiRates: [
      { maxLvr: 85, rate: 0.005 },
      { maxLvr: 90, rate: 0.015 },
      { maxLvr: 95, rate: 0.030 },
    ],
    incomeLimit: 0.30,            // max 30% of gross income
  },
  ie: {
    incomeCap: { ftb: 4.0, secondBuyer: 3.5 },  // x gross income
    ltvCap: { ftb: 90, secondBuyer: 80 },
    htb: { maxGrant: 30000, maxPctPrice: 0.10, maxPrice: 500000 },
    mortgageProtectionRequired: true,
  },
  nz: {
    dtiCap: 6,                   // max debt-to-income ratio
    lvrMin: 20,                  // min deposit %
    firstHomeLoan: {
      minDeposit: 5,
      incomeCapSingle: 95000,
      incomeCapJoint: 150000,
      priceCaps: { auckland: 875000, wellington: 750000, other: 625000 },
    },
  },
}
