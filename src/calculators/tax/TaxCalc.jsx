import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import { trackCalcUsed } from '../../utils/analytics'
import { CalcIntro, CalcFAQ, CalcHowTo, CalcRelated, CalcSubTopics, CalcAlsoAvailable, CalcFeatures, CalcPageMeta } from '../../components/CalcSEO'
import { subPagesByCalc } from '../../data/seoPages'
import NumericInput from '../../components/NumericInput'

const TAX_FAQS = {
  us: [
    { q: 'What is the standard deduction for 2026?', a: 'The 2026 standard deduction is $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household. These amounts are inflation-adjusted annually by the IRS.' },
    { q: 'How do US tax brackets work?', a: 'The US uses a progressive system — you only pay each rate on income within that bracket, not your entire income. Being in the 22% bracket does not mean all your income is taxed at 22%.' },
    { q: 'What is FICA tax?', a: 'FICA funds Social Security (6.2%, up to $176,100 wage base) and Medicare (1.45%, no cap) — totaling 7.65% for employees. An additional 0.9% Medicare surtax applies above $200K ($250K married).' },
  ],
  ca: [
    { q: 'How is Canadian income tax calculated?', a: 'Canadian income tax = federal tax (15%–33%) + provincial/territorial tax. Both are progressive. The combined top marginal rate ranges from 46% to 54% depending on your province.' },
    { q: 'What is CPP and how much is deducted?', a: 'CPP contributions are 5.95% on earnings from $3,500–$68,500 in 2026 (max $3,867/yr). CPP2 adds 4% on earnings from $68,500–$73,200.' },
    { q: 'What is EI?', a: 'Employment Insurance premiums are 1.66% of insurable earnings up to $65,700/year (max $1,090/yr). Your employer contributes 1.4× your premium.' },
  ],
  uk: [
    { q: 'What are UK income tax rates for 2026?', a: 'UK rates: 0% on the Personal Allowance (£12,570); 20% Basic Rate (£12,571–£50,270); 40% Higher Rate (£50,271–£125,140); 45% Additional Rate above £125,140.' },
    { q: 'What is National Insurance (NI)?', a: 'NI Class 1 employee contributions: 8% on earnings from £12,570–£50,270, then 2% above £50,270. NI funds the NHS, state pension, and other benefits.' },
    { q: 'Can pension contributions reduce my tax?', a: 'Yes — workplace pension contributions come from pre-tax income, reducing your taxable earnings. A £500/month pension contribution in the 40% bracket saves £200/month in income tax.' },
  ],
  au: [
    { q: 'What are Australian income tax rates for 2026?', a: 'Australian rates: 0% up to $18,200; 19% from $18,201–$45,000; 32.5% from $45,001–$120,000; 37% from $120,001–$180,000; 45% above $180,000. Plus 2% Medicare Levy.' },
    { q: 'What is the Medicare Levy?', a: 'The Medicare Levy is 2% of taxable income and funds Australia\'s public health system (Medicare). A Medicare Levy Surcharge of 1%–1.5% applies to high earners without private hospital cover.' },
    { q: 'What is PAYG withholding?', a: 'PAYG (Pay As You Go) is income tax your employer deducts each pay period and remits to the ATO. It\'s reconciled when you lodge your annual tax return — you may receive a refund or owe more.' },
  ],
  ie: [
    { q: 'What are Irish income tax rates for 2026?', a: 'Ireland taxes income at 20% (Standard Rate) up to €42,000 for single individuals, and 40% (Higher Rate) above that. The Personal Tax Credit of €1,875 directly reduces your tax bill.' },
    { q: 'What is PRSI?', a: 'Pay Related Social Insurance (PRSI) is 4% for employees earning over €352/week. It funds jobseeker\'s benefit, illness benefit, state pension, and other social welfare payments.' },
    { q: 'What is USC (Universal Social Charge)?', a: 'USC: 0.5% on income up to €12,012; 2% from €12,013–€25,760; 4% from €25,761–€70,044; 8% above €70,044. Medical card holders and certain other groups have reduced rates.' },
  ],
  nz: [
    { q: 'What are New Zealand income tax rates for 2026?', a: 'NZ rates: 10.5% on the first $14,000; 17.5% from $14,001–$48,000; 30% from $48,001–$70,000; 33% from $70,001–$180,000; 39% above $180,000.' },
    { q: 'What is ACC?', a: 'The ACC earners levy (1.33% in 2026, capped at $142,283) funds no-fault accident compensation. It covers medical treatment and income replacement for accidental injuries regardless of fault.' },
    { q: 'Do I need to file a tax return in NZ?', a: 'Most NZ employees have tax deducted automatically via PAYE. You may need an IR3 return if you have business income, rental income, overseas income, or significant investment returns.' },
  ],
}

const COLORS = { primary: '#1A6AFF', accent: '#00D4FF', success: '#1D9E75', warn: '#F5C842', red: '#EF4444' }
const PIE_COLORS = [COLORS.success, COLORS.red, COLORS.warn, COLORS.accent]

// ---------------------------------------------------------------------------
// Country-specific optional deductions
// ---------------------------------------------------------------------------
const TAX_DEDUCTIONS = {
  us: [
    { key: 'rrsp_401k', label: '401(k) / IRA Contribution',  hint: 'Pre-tax · reduces AGI · 2026 max $23,000', step: 500  },
    { key: 'hsa',       label: 'HSA Contribution',           hint: 'Pre-tax · max $4,150 single',               step: 100  },
    { key: 'mortgage',  label: 'Mortgage Interest',          hint: 'Itemized deduction (if > std deduction)',    step: 500  },
    { key: 'charity',   label: 'Charitable Donations',       hint: 'Up to 60% of AGI for cash donations',       step: 100  },
    { key: 'medical',   label: 'Medical Expenses',           hint: 'Amount exceeding 7.5% of AGI',              step: 100  },
  ],
  ca: [
    { key: 'rrsp',      label: 'Cotisation REER',            hint: 'Déduit avant impôt · limite 18% du revenu', step: 500  },
    { key: 'union',     label: 'Cotisation syndicale',       hint: 'Déductible à 100%',                         step: 50   },
    { key: 'medical',   label: 'Frais médicaux',             hint: 'Montant > 3% du revenu net',               step: 100  },
    { key: 'charity',   label: 'Dons de bienfaisance',       hint: 'Crédit fédéral 15% / 29%',                 step: 100  },
    { key: 'childcare', label: 'Frais de garde',             hint: 'Déductibles par le parent moins bien payé', step: 100  },
  ],
  uk: [
    { key: 'pension',   label: 'Pension Contribution',       hint: 'Reduces taxable income',                    step: 100  },
    { key: 'charity',   label: 'Gift Aid Donations',         hint: 'Treated as given from net income',          step: 50   },
    { key: 'workexp',   label: 'Work Expenses',              hint: 'Uniform, tools, professional fees',         step: 50   },
  ],
  au: [
    { key: 'super',     label: 'Extra Super Contribution',   hint: 'Pre-tax salary sacrifice',                  step: 100  },
    { key: 'workded',   label: 'Work-related Deductions',    hint: 'Tools, uniform, home office, travel',       step: 100  },
    { key: 'charity',   label: 'Charitable Donations',       hint: 'Donations to DGR organisations',            step: 50   },
  ],
  ie: [
    { key: 'pension',   label: 'Pension (AVC)',              hint: 'Reduces income tax at marginal rate',       step: 100  },
    { key: 'medical',   label: 'Medical Expenses',           hint: '20% tax relief on qualifying expenses',     step: 100  },
    { key: 'rent',      label: 'Rent Tax Credit',            hint: '€1,000 credit for private renters (2026)', step: 250  },
  ],
  nz: [
    { key: 'workded',   label: 'Work-related Deductions',    hint: 'Tools, travel, home office portion',        step: 100  },
    { key: 'kiwi',      label: 'KiwiSaver Contribution',     hint: 'Employer contributions taxed separately',   step: 50   },
  ],
}

// ── Tax calculation engines ────────────────────────────────────────

function applyBrackets(income, brackets) {
  let tax = 0
  for (const [limit, rate, floor] of brackets) {
    if (income <= (floor || 0)) continue
    const taxable = Math.min(income, limit) - (floor || 0)
    if (taxable <= 0) break
    tax += taxable * rate
  }
  return tax
}

// US Federal 2026
const usFedBrackets = [
  [11925,   0.10,  0],
  [48475,   0.12,  11925],
  [103350,  0.22,  48475],
  [197300,  0.24,  103350],
  [250525,  0.32,  197300],
  [626350,  0.35,  250525],
  [Infinity,0.37,  626350],
]

function calcUS(gross) {
  const stdDeduction = 14600
  const taxableIncome = Math.max(0, gross - stdDeduction)
  const fedTax = applyBrackets(taxableIncome, usFedBrackets)
  const ssTax = Math.min(gross, 176100) * 0.062
  const medicareTax = gross * 0.0145
  const fica = ssTax + medicareTax
  const stateTaxEst = gross * 0.045
  const totalTax = fedTax + fica + stateTaxEst
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    fedTax, fica, ssTax, medicareTax, stateTaxEst, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Federal Tax', value: Math.round(fedTax) },
      { name: 'FICA', value: Math.round(fica) },
      { name: 'State Tax', value: Math.round(stateTaxEst) },
    ],
    barData: [
      { name: 'Federal', amount: Math.round(fedTax) },
      { name: 'SS', amount: Math.round(ssTax) },
      { name: 'Medicare', amount: Math.round(medicareTax) },
      { name: 'State', amount: Math.round(stateTaxEst) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Standard Deduction', value: -stdDeduction },
      { label: 'Taxable Income', value: taxableIncome },
      { label: 'Federal Income Tax', value: fedTax },
      { label: 'Social Security (6.2%)', value: ssTax, sub: 'On up to $176,100' },
      { label: 'Medicare (1.45%)', value: medicareTax },
      { label: 'State Tax (est. ~4.5%)', value: stateTaxEst, sub: 'Average — varies by state' },
      { label: 'Total Tax & Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// CA Federal 2026
const caFedBrackets = [
  [57375,   0.15,  0],
  [114750,  0.205, 57375],
  [158519,  0.26,  114750],
  [220000,  0.29,  158519],
  [Infinity,0.33,  220000],
]

function calcCA(gross) {
  const bpa = 15705
  const taxableIncome = Math.max(0, gross - bpa)
  const fedTax = applyBrackets(taxableIncome, caFedBrackets)
  const fedCredit = bpa * 0.15
  const fedTaxFinal = Math.max(0, fedTax - fedCredit)
  const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
  const ei = Math.min(gross, 63200) * 0.0166
  const provTaxEst = gross * 0.08
  const totalTax = fedTaxFinal + cpp + ei + provTaxEst
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    fedTax: fedTaxFinal, cpp, ei, provTaxEst, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Federal Tax', value: Math.round(fedTaxFinal) },
      { name: 'CPP + EI', value: Math.round(cpp + ei) },
      { name: 'Provincial', value: Math.round(provTaxEst) },
    ],
    barData: [
      { name: 'Federal', amount: Math.round(fedTaxFinal) },
      { name: 'CPP', amount: Math.round(cpp) },
      { name: 'EI', amount: Math.round(ei) },
      { name: 'Provincial', amount: Math.round(provTaxEst) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Basic Personal Amount', value: -bpa },
      { label: 'Federal Income Tax', value: fedTaxFinal },
      { label: 'CPP (5.95%)', value: cpp, sub: 'On $3,500–$68,500' },
      { label: 'EI (1.66%)', value: ei, sub: 'On up to $63,200' },
      { label: 'Provincial Tax (est. ~8%)', value: provTaxEst, sub: 'Average — varies by province' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// UK 2025-26
function calcUK(gross) {
  const personalAllowance = 12570
  const basicRateLimit = 50270
  const higherRateLimit = 125140
  const taxable = Math.max(0, gross - personalAllowance)
  const basic = Math.min(taxable, basicRateLimit - personalAllowance) * 0.20
  const higher = Math.max(0, Math.min(taxable, higherRateLimit - personalAllowance) - (basicRateLimit - personalAllowance)) * 0.40
  const additional = Math.max(0, taxable - (higherRateLimit - personalAllowance)) * 0.45
  const incomeTax = basic + higher + additional
  const ni1 = Math.min(Math.max(0, gross - 12570), 50270 - 12570) * 0.08
  const ni2 = Math.max(0, gross - 50270) * 0.02
  const ni = ni1 + ni2
  const totalTax = incomeTax + ni
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, ni, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'National Insurance', value: Math.round(ni) },
    ],
    barData: [
      { name: 'Basic (20%)', amount: Math.round(basic) },
      { name: 'Higher (40%)', amount: Math.round(higher) },
      { name: 'NI 8%', amount: Math.round(ni1) },
      { name: 'NI 2%', amount: Math.round(ni2) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Personal Allowance', value: -personalAllowance },
      { label: 'Income Tax (20%/40%/45%)', value: incomeTax },
      { label: 'National Insurance', value: ni, sub: '8% up to £50,270 / 2% above' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// AU 2024-25
const auBrackets = [
  [18200,   0,     0],
  [45000,   0.19,  18200],
  [120000,  0.325, 45000],
  [180000,  0.37,  120000],
  [Infinity,0.45,  180000],
]

function calcAU(gross) {
  const incomeTax = applyBrackets(gross, auBrackets)
  const medicare = gross * 0.02
  const super_ = gross * 0.115
  const totalTax = incomeTax + medicare
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, medicare, super_, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'Medicare', value: Math.round(medicare) },
    ],
    barData: [
      { name: 'Income Tax', amount: Math.round(incomeTax) },
      { name: 'Medicare', amount: Math.round(medicare) },
      { name: 'Super (employer)', amount: Math.round(super_) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax', value: incomeTax },
      { label: 'Medicare Levy (2%)', value: medicare },
      { label: 'Total Tax', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
      { label: 'Super (11.5% — employer pays)', value: super_, sub: 'Employer pays in addition to salary' },
    ],
  }
}

// IE 2025
function calcIE(gross) {
  const standardRateLimit = 42000
  const it1 = Math.min(gross, standardRateLimit) * 0.20
  const it2 = Math.max(0, gross - standardRateLimit) * 0.40
  const incomeTax = it1 + it2
  const prsi = gross * 0.041
  const usc1 = Math.min(gross, 12012) * 0.005
  const usc2 = Math.min(Math.max(0, gross - 12012), 27382 - 12012) * 0.02
  const usc3 = Math.min(Math.max(0, gross - 27382), 70044 - 27382) * 0.04
  const usc4 = Math.max(0, gross - 70044) * 0.08
  const usc = usc1 + usc2 + usc3 + usc4
  const totalTax = incomeTax + prsi + usc
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, prsi, usc, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'PRSI', value: Math.round(prsi) },
      { name: 'USC', value: Math.round(usc) },
    ],
    barData: [
      { name: 'IT 20%', amount: Math.round(it1) },
      { name: 'IT 40%', amount: Math.round(it2) },
      { name: 'PRSI', amount: Math.round(prsi) },
      { name: 'USC', amount: Math.round(usc) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax (20%/40%)', value: incomeTax },
      { label: 'PRSI (4.1%)', value: prsi },
      { label: 'USC', value: usc, sub: '0.5% / 2% / 4% / 8% bands' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// NZ 2025
const nzBrackets = [
  [14000,   0.105, 0],
  [48000,   0.175, 14000],
  [70000,   0.30,  48000],
  [180000,  0.33,  70000],
  [Infinity,0.39,  180000],
]

function calcNZ(gross) {
  const incomeTax = applyBrackets(gross, nzBrackets)
  const acc = gross * 0.016
  const kiwisaver = gross * 0.03
  const totalTax = incomeTax + acc
  const netAnnual = gross - totalTax - kiwisaver
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, acc, kiwisaver, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'ACC', value: Math.round(acc) },
      { name: 'KiwiSaver', value: Math.round(kiwisaver) },
    ],
    barData: [
      { name: 'Income Tax', amount: Math.round(incomeTax) },
      { name: 'ACC', amount: Math.round(acc) },
      { name: 'KiwiSaver', amount: Math.round(kiwisaver) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax', value: incomeTax },
      { label: 'ACC Levy (1.6%)', value: acc },
      { label: 'KiwiSaver (3%)', value: kiwisaver },
      { label: 'Total Deductions', value: totalTax + kiwisaver, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

const calcEngines = { us: calcUS, ca: calcCA, uk: calcUK, au: calcAU, ie: calcIE, nz: calcNZ }
const defaultIncomes = { us: 75000, ca: 80000, uk: 45000, au: 85000, ie: 55000, nz: 70000 }

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-green-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function TaxCalc({ country, embedded = false }) {
  const { t } = useTranslation()
  const c = countries[country]
  const deductionDefs = TAX_DEDUCTIONS[country] || []

  const [gross, setGross] = useState(defaultIncomes[country] || 60000)
  const [view, setView] = useState('simple')
  const [dedOpen, setDedOpen] = useState(true)
  const [dedEnabled, setDedEnabled] = useState({})
  const [dedAmounts, setDedAmounts] = useState(
    Object.fromEntries(deductionDefs.map(d => [d.key, 0]))
  )

  const toggleDed = (key, val) => setDedEnabled(prev => ({ ...prev, [key]: val }))
  const setDedAmt = (key, val) => setDedAmounts(prev => ({ ...prev, [key]: val }))

  const totalDeductions = useMemo(() =>
    deductionDefs
      .filter(d => dedEnabled[d.key])
      .reduce((sum, d) => sum + (dedAmounts[d.key] || 0), 0),
    [deductionDefs, dedEnabled, dedAmounts]
  )

  const taxableGross = Math.max(0, gross - totalDeductions)

  const result = useMemo(() => {
    if (!taxableGross || taxableGross <= 0) return null
    const engine = calcEngines[country]
    return engine ? engine(taxableGross) : null
  }, [taxableGross, country])

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('tax', country)
      tracked.current = true
    }
  }, [result])

  const activeDeductions = deductionDefs.filter(d => dedEnabled[d.key] && dedAmounts[d.key] > 0)
  const activeDedCount = activeDeductions.length

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(Math.abs(n))

  const fmtShort = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const pageTitles = {
    us: 'US Tax Calculator 2026 — Federal, State Income Tax & FICA | CalqWise',
    ca: 'Canada Tax Calculator 2026 — Federal, Provincial, CPP & EI | CalqWise',
    uk: 'UK Tax Calculator 2026/27 — Income Tax, NI & Take-Home Pay | CalqWise',
    au: 'Australia Tax Calculator 2025/26 — Income Tax & Medicare Levy | CalqWise',
    ie: 'Ireland Tax Calculator 2026 — Income Tax, PRSI & USC | CalqWise',
    nz: 'New Zealand Tax Calculator 2026 — PAYE, ACC & KiwiSaver | CalqWise',
  }
  const pageDescs = {
    us: 'Free US income tax calculator 2026. Federal brackets, all 50 state income taxes, Social Security and Medicare (FICA). Calculate take-home pay by filing status. Updated 2026.',
    ca: 'Free Canadian income tax calculator 2026. Federal + all provincial/territorial tax, CPP, EI, and net take-home. All provinces. Updated 2026 brackets.',
    uk: 'Free UK income tax calculator 2026/27. Income Tax, National Insurance, and take-home pay. Scottish tax bands, pension contribution modelling. Updated rates.',
    au: 'Free Australian income tax calculator 2025/26. Tax, Medicare levy, HELP/HECS repayments, and take-home pay. Super contributions modelled. Updated ATO rates.',
    ie: 'Free Irish income tax calculator 2026. Income tax, PRSI, Universal Social Charge (USC), and take-home pay. All tax credits applied. Updated 2026 rates.',
    nz: 'Free New Zealand income tax calculator 2026. PAYE brackets, ACC earners levy, KiwiSaver, and student loan repayment. All pay frequencies. Updated 2026.',
  }
  const pageTitle = pageTitles[country] || pageTitles.us
  const pageDesc = pageDescs[country] || pageDescs.us

  const taxIntroText = {
    us: 'Our US income tax calculator covers all seven federal brackets (10%–37%), FICA (Social Security + Medicare), and all 50 state income taxes. Enter your gross salary to instantly see federal tax, state tax, FICA, and your true net take-home — broken down by pay period. Model 401(k), HSA, and other pre-tax deductions to reduce your taxable income.',
    ca: 'Our Canadian income tax calculator combines federal brackets (15%–33%) with all 13 provincial and territorial tax rates. We automatically calculate CPP contributions (5.95% up to $68,500) and EI premiums (1.66%), then show your federal and provincial taxes side-by-side. Enter RRSP contributions to see how they reduce your tax bill.',
    uk: 'Our UK income tax calculator applies 2026/27 PAYE rates and National Insurance contributions. See exactly how much income tax you pay across the Personal Allowance (£12,570), Basic Rate (20%), Higher Rate (40%), and Additional Rate (45%), plus NI Class 1 at 8% and 2%. Includes pension contribution modelling to show take-home at any salary.',
    au: 'Our Australian income tax calculator uses 2025–26 ATO rates with the full progressive bracket structure, 2% Medicare Levy, and optional Medicare Levy Surcharge. See the before and after impact of the Stage 3 tax cuts and model super contributions, salary sacrifice, and other pre-tax deductions to optimize your take-home pay.',
    ie: 'Our Irish income tax calculator covers the Standard Rate (20%) and Higher Rate (40%), PRSI (4%), and the Universal Social Charge (0.5%–8%). See your exact tax credits (Personal, PAYE, Employee Tax Credit) applied, and model pension contributions to legally reduce your taxable income.',
    nz: 'Our New Zealand income tax calculator applies 2026 PAYE rates across all five brackets, plus the ACC earners levy (1.33%). See your weekly, fortnightly, and monthly take-home pay with KiwiSaver contribution options modelled across all employee rates (3%–10%).',
  }

  const taxFeatures = {
    us: ['Federal income tax (10%–37%)', 'All 50 state income taxes', 'Social Security (6.2%)', 'Medicare (1.45% + 0.9% surcharge)', 'Pre-tax deductions: 401(k), HSA, IRA', 'Standard vs itemized deduction comparison', 'Effective vs marginal rate breakdown', 'All pay period outputs (hourly to annual)'],
    ca: ['Federal tax (15%–33%)', 'All provincial/territorial tax rates', 'CPP contributions (CPP1 + CPP2)', 'EI premiums', 'RRSP deduction modelling', 'Quebec QPIP included', 'Federal + provincial effective rate', 'Net pay by pay period'],
    uk: ['Income tax across all PAYE bands', 'National Insurance Class 1', 'Personal Allowance taper (£100K+)', 'Pension contribution impact', 'Blind Person\'s Allowance option', 'Scotland / RUK rate comparison', 'Gross to net by pay period', 'Effective and marginal rates'],
    au: ['All ATO income tax brackets', 'Medicare Levy (2%)', 'Medicare Levy Surcharge', 'Low Income Tax Offset (LITO)', 'Low & Middle Income Tax Offset (LMITO)', 'Superannuation contribution modelling', 'Salary sacrifice impact', 'PAYG vs actual tax reconciliation'],
    ie: ['Standard Rate (20%) and Higher Rate (40%)', 'PRSI Class A contributions', 'Universal Social Charge (USC)', 'Personal + PAYE Tax Credits', 'Pension contribution relief', 'Net take-home by pay period', 'Effective and marginal tax rates', 'Comparison with neighboring tax systems'],
    nz: ['All PAYE tax brackets (10.5%–39%)', 'ACC earners levy (1.33%)', 'KiwiSaver contributions (3%–10%)', 'Employer KiwiSaver match shown', 'Student loan repayment (12%)', 'Independent earner tax credit', 'Net pay weekly, fortnightly, monthly', 'Effective tax rate visualized'],
  }

  const taxHowToSteps = {
    us: [
      'Enter your gross annual salary or hourly rate and select your filing status (Single, MFJ, MFS, HOH).',
      'Select your state to apply the correct state income tax rate.',
      'Add pre-tax deductions like 401(k), HSA, or traditional IRA contributions to reduce your taxable income.',
      'Review the Summary: federal tax, state tax, FICA, and net take-home across all pay periods.',
      'Check the Breakdown chart to see your effective tax rate vs. marginal rate.',
    ],
    ca: [
      'Enter your gross annual income and select your province or territory.',
      'Add any RRSP contributions to see the immediate tax savings.',
      'CPP and EI are automatically calculated based on your earnings.',
      'Review the Summary showing federal tax, provincial tax, CPP, EI, and net take-home.',
      'Switch pay periods (weekly, bi-weekly, monthly) to match your actual pay schedule.',
    ],
    uk: [
      'Enter your gross annual salary. The calculator applies the 2026/27 PAYE bands automatically.',
      'Add pension contributions (% or fixed) to see how they reduce your income tax and NI.',
      'Select Scotland if you pay Scottish income tax rates (different from England/Wales/NI).',
      'Review income tax, National Insurance, and net take-home for each pay period.',
      'Adjust salary to model a pay rise, and see how your effective rate changes.',
    ],
    au: [
      'Enter your gross annual income. ATO tax rates and the Medicare Levy are applied automatically.',
      'Add salary sacrifice or super contributions to see how pre-tax contributions reduce your tax.',
      'Toggle the Medicare Levy Surcharge if you earn above $93,000 without private hospital cover.',
      'Review the breakdown of income tax, Medicare Levy, and net take-home.',
      'Switch between pay periods to see your actual bank deposit amount.',
    ],
    ie: [
      'Enter your gross annual salary. Standard Rate (20%) and Higher Rate (40%) are applied automatically.',
      'Tax credits (Personal + PAYE Employee Credit) are applied by default — edit if yours differ.',
      'Add pension contributions to see the tax relief on your contributions.',
      'Review PRSI, USC, and income tax totals alongside your net take-home.',
      'Compare different salary scenarios to understand the marginal tax rate impact.',
    ],
    nz: [
      'Enter your gross annual salary. PAYE rates across all brackets are applied automatically.',
      'Select your KiwiSaver contribution rate (3%, 4%, 6%, 8%, or 10%).',
      'Toggle student loan repayment (12%) if applicable.',
      'Review income tax, ACC levy, KiwiSaver, and net take-home for your pay frequency.',
      'Adjust income to see how NZ\'s progressive brackets affect your effective tax rate.',
    ],
  }

  const otherCountriesTax = Object.entries(countries)
    .filter(([code]) => code !== country)
    .map(([code, ct]) => ({ code, flag: ct.flag, name: ct.name }))

  return (
    <>
      <CalcPageMeta country={country} slug="tax" title={pageTitle} description={pageDesc} embedded={embedded} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: `${c.name} Tax Calculator`,
          description: `Free ${c.name} income tax calculator 2026. Calculate take-home pay, effective rate, and deductions.`,
          url: `https://calqwise.com/${country}/tax`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
        })}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {t(`nav.country_${country}`, { defaultValue: c.name })} — {t('tax.title')}
          </h1>
          <p className="text-slate-500">{t('tax.subtitle')}</p>
        </div>

        <div className="cw-card mb-4">
          <label className="block text-xs text-slate-500 mb-1 uppercase tracking-wider">
            {t('tax.annualIncome')} ({c.symbol})
          </label>
          <NumericInput value={gross} onChange={setGross} min={20000} max={300000} step={1000} prefix={c.symbol} showSlider hint="Typical range: $20k–$300k" />
          <p className="text-xs text-slate-500 mt-2">{t('tax.enterGross')}</p>
        </div>

        {/* Optional Deductions collapsible */}
        {deductionDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setDedOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{t('calc.optionalDeductions')}</span>
                {activeDedCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeDedCount} active · -{fmtShort(totalDeductions)}/yr
                  </span>
                )}
              </div>
              {dedOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {dedOpen && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-3">{t('tax.deductionsTip')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                  {deductionDefs.map(d => (
                    <div
                      key={d.key}
                      className={`border rounded-xl p-3 transition-colors ${dedEnabled[d.key] ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{d.hint}</p>
                        </div>
                        <Toggle on={!!dedEnabled[d.key]} onChange={v => toggleDed(d.key, v)} />
                      </div>
                      {dedEnabled[d.key] && (
                        <div className="mt-2">
                          <NumericInput
                            label=""
                            value={dedAmounts[d.key] || 0}
                            onChange={v => setDedAmt(d.key, v)}
                            min={0}
                            max={500000}
                            step={d.step}
                            prefix={c.symbol}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="cw-tabs mb-4">
          {[
            { key: 'simple', label: t('calc.simple') },
            { key: 'detailed', label: t('calc.detailed') },
          ].map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`cw-tab${view === v.key ? ' active' : ''}`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {result && view === 'simple' && (
          <>
            {totalDeductions > 0 && (
              <div className="cw-card mb-4 border border-green-500/30 bg-green-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Active Deductions</p>
                <div className="space-y-1">
                  {activeDeductions.map(d => (
                    <div key={d.key} className="flex items-center justify-between text-sm">
                      <span className="text-green-700 font-medium">{d.label}</span>
                      <span className="text-slate-700 font-semibold">-{fmtShort(dedAmounts[d.key] || 0)}/yr</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-green-100 text-xs text-green-700 font-semibold">
                    Taxable income reduced by {fmtShort(totalDeductions)} → {fmtShort(taxableGross)}
                  </div>
                </div>
              </div>
            )}
            <ResultSimple
              metrics={[
                { label: t('calc.netAnnual'), value: fmt(result.netAnnual), highlight: true },
                { label: t('calc.monthlyTakeHome'), value: fmt(result.netAnnual / 12) },
                { label: t('calc.effectiveRate'), value: `${result.effectiveRate.toFixed(1)}%` },
              ]}
            />
          </>
        )}

        {result && view === 'detailed' && (
          <>
            {totalDeductions > 0 && (
              <div className="cw-card mb-4 border border-green-500/30 bg-green-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">Optional Deductions Applied</p>
                <div className="space-y-1">
                  {activeDeductions.map(d => (
                    <div key={d.key} className="flex items-center justify-between text-sm">
                      <span className="text-green-700 font-medium">{d.label}</span>
                      <span className="text-slate-700 font-semibold">-{fmtShort(dedAmounts[d.key] || 0)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-green-100 text-xs text-green-700 font-semibold">
                    Tax calculated on {fmtShort(taxableGross)} (gross {fmtShort(gross)} − deductions {fmtShort(totalDeductions)})
                  </div>
                </div>
              </div>
            )}
            <ResultDetailed
              title={t('tax.incomeTax')}
              rows={result.rows.map(r => ({
                label: r.label,
                value: r.value < 0 ? `-${fmt(r.value)}` : fmt(r.value),
                bold: r.bold,
                sub: r.sub,
              }))}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 mt-6">
              <div className="cw-card flex flex-col items-center">
                <h3 className="font-semibold mb-4 text-sm self-start">Income Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={result.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {result.pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => fmt(val)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="cw-card">
                <h3 className="font-semibold mb-4 text-sm">Tax Components</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={result.barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A9BB5' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `${c.symbol}${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => fmt(val)}
                    />
                    <Bar dataKey="amount" name="Amount" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterIncome')}
          </div>
        )}

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          {t('tax.disclaimer')}
        </div>

        <AppDownloadBanner calcKey="tax" country={country} />
        <AdSenseSlot format="rectangle" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <CalcIntro intro={taxIntroText[country] || taxIntroText.us} />
        <CalcFeatures features={taxFeatures[country] || taxFeatures.us} />
        <CalcHowTo steps={taxHowToSteps[country] || taxHowToSteps.us} />
        <CalcFAQ faqs={TAX_FAQS[country] || TAX_FAQS.us} />
        <CalcSubTopics links={subPagesByCalc[`${country}/tax`] || []} />
        <CalcRelated links={[
          { to: `/${country}/salary`,       label: 'Salary Calculator' },
          { to: `/${country}/affordability`, label: 'Affordability Calculator' },
          { to: `/${country}/budget`,        label: 'Budget Planner' },
        ]} />
        <CalcAlsoAvailable calcSlug="tax" calcLabel="Tax" countries={otherCountriesTax} />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
