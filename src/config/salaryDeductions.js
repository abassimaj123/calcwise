/**
 * salaryDeductions.js — Optional salary deductions by country.
 * Add/remove deductions here without editing SalaryCalc.jsx.
 */

export const SALARY_DEDUCTIONS = {
  us: [
    { key: '401k',   label: '401(k) Contribution',   hint: 'Pre-tax · 2026 max: $23,000',          preTax: true,  step: 500 },
    { key: 'health', label: 'Health Insurance',       hint: 'Pre-tax employer plan premium',         preTax: true,  step: 50  },
    { key: 'hsa',    label: 'HSA Contribution',       hint: 'Pre-tax · 2026 max: $4,150',            preTax: true,  step: 100 },
    { key: 'union',  label: 'Union Dues',             hint: 'Post-tax · varies by local',            preTax: false, step: 10  },
    { key: 'life',   label: 'Life / Disability Ins.', hint: 'Post-tax supplemental',                 preTax: false, step: 10  },
  ],
  ca: [
    { key: 'rrsp',     label: 'Cotisation REER',          hint: 'Avant impôt · réduit revenu imposable', preTax: true,  step: 500 },
    { key: 'pension',  label: 'Régime de retraite (RPP)', hint: 'Avant impôt · pension entreprise',      preTax: true,  step: 100 },
    { key: 'groupins', label: 'Assurance collective',      hint: 'Après impôt · santé/vie/dentaire',     preTax: false, step: 20  },
    { key: 'union',    label: 'Cotisation syndicale',      hint: 'Après impôt · déductible déclaration', preTax: false, step: 10  },
    { key: 'club',     label: 'Club social / loisirs',     hint: 'Après impôt · activités parrainées',   preTax: false, step: 5   },
    { key: 'parking',  label: 'Stationnement / transport', hint: 'Avant impôt · laissez-passer commun',  preTax: true,  step: 20  },
  ],
  uk: [
    { key: 'pension',     label: 'Pension Contribution',     hint: 'Pre-tax · typical 5% employee',   preTax: true,  step: 50 },
    { key: 'healthins',   label: 'Private Health Insurance', hint: 'Post-tax · BUPA, AXA etc.',        preTax: false, step: 20 },
    { key: 'union',       label: 'Union Dues',               hint: 'Post-tax · TUC affiliated',        preTax: false, step: 5  },
    { key: 'studentloan', label: 'Student Loan Repayment',   hint: 'Post-tax · Plan 1/2',              preTax: false, step: 20 },
    { key: 'cycle',       label: 'Cycle to Work Scheme',     hint: 'Pre-tax salary sacrifice',         preTax: true,  step: 10 },
  ],
  au: [
    { key: 'super',         label: 'Extra Super Contribution', hint: 'Pre-tax · above mandatory 11%',             preTax: true,  step: 100 },
    { key: 'privatehealth', label: 'Private Health Insurance', hint: 'Post-tax · avoids Medicare Levy Surcharge', preTax: false, step: 30  },
    { key: 'union',         label: 'Union Dues',               hint: 'Post-tax · ACTU affiliated',                preTax: false, step: 10  },
    { key: 'salary_sac',    label: 'Salary Sacrifice (other)', hint: 'Pre-tax · FBT-exempt benefits',             preTax: true,  step: 50  },
  ],
  ie: [
    { key: 'pension', label: 'Pension (AVC)',          hint: 'Pre-tax · Additional Voluntary',   preTax: true,  step: 100 },
    { key: 'health',  label: 'Health Insurance',       hint: 'Post-tax · VHI, Laya, Irish Life', preTax: false, step: 20  },
    { key: 'union',   label: 'Union Dues',             hint: 'Post-tax · ICTU affiliated',       preTax: false, step: 5   },
    { key: 'travel',  label: 'Travel Pass (TaxSaver)', hint: 'Pre-tax · public transport',       preTax: true,  step: 20  },
  ],
  nz: [
    { key: 'kiwisaver', label: 'KiwiSaver Extra',    hint: 'Pre-tax · above 3% mandatory',        preTax: true,  step: 50 },
    { key: 'health',    label: 'Health Insurance',    hint: 'Post-tax · Southern Cross, nib etc.', preTax: false, step: 20 },
    { key: 'union',     label: 'Union Dues',          hint: 'Post-tax · CTU affiliated',           preTax: false, step: 5  },
  ],
}
