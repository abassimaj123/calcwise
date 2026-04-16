/**
 * taxBrackets.js — Income tax brackets and contribution rates for 2026.
 * Update rates here. Do NOT edit calculator files for tax rate updates.
 */

export const TAX_DATA_2026 = {
  us: {
    standardDeduction: 14600,
    brackets: [
      [11600,  0.10, 0],
      [47150,  0.12, 11600],
      [100525, 0.22, 47150],
      [191950, 0.24, 100525],
      [243725, 0.32, 191950],
      [609350, 0.35, 243725],
      [Infinity, 0.37, 609350],
    ],
    fica: {
      ssCap: 168600,
      ssRate: 0.062,
      medicareRate: 0.0145,
    },
    avgStateRate: 0.045,
  },
  ca: {
    bpa: 15705,
    federalBrackets: [
      [57375,    0.15,  0],
      [114750,   0.205, 57375],
      [158519,   0.26,  114750],
      [220000,   0.29,  158519],
      [Infinity, 0.33,  220000],
    ],
    avgProvRate: 0.08,
    cpp: { exemption: 3500, cap: 68500, rate: 0.0595 },
    ei:  { cap: 63200, rate: 0.0166 },
  },
  uk: {
    personalAllowance: 12570,
    basicRate: 0.20,  basicLimit: 37700,
    higherRate: 0.40, higherLimit: 112570,
    addRate: 0.45,
    ni: { primaryThreshold: 12570, upperEarnings: 50270, rate1: 0.08, rate2: 0.02 },
  },
  au: {
    brackets: [
      [18200,    0,     0],
      [45000,    0.19,  18200],
      [120000,   0.325, 45000],
      [180000,   0.37,  120000],
      [Infinity, 0.45,  180000],
    ],
    medicareLevy: 0.02,
  },
  ie: {
    standardBand: 44000,
    standardRate: 0.20,
    higherRate: 0.40,
    prsi: 0.041,
    usc: [
      [12012,    0.005],
      [15370,    0.02],
      [42662,    0.045],
      [Infinity, 0.08],
    ],
  },
  nz: {
    brackets: [
      [14000,    0.105, 0],
      [48000,    0.175, 14000],
      [70000,    0.30,  48000],
      [180000,   0.33,  70000],
      [Infinity, 0.39,  180000],
    ],
    acc: 0.016,
  },
}
