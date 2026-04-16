import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'
import NumericInput from '../../components/NumericInput'

const COLORS = { primary: '#1A6AFF', accent: '#00D4FF', success: '#1D9E75', warn: '#F5C842' }
const PIE_COLORS_LIST = ['#1A6AFF', '#00D4FF', '#F5C842', '#1D9E75', '#f97316', '#ec4899', '#8b5cf6']

// ---------------------------------------------------------------------------
// Country-specific optional costs
// ---------------------------------------------------------------------------
const COUNTRY_OPTIONS = {
  us: [
    { key: 'pmi',       label: 'PMI (Mortgage Insurance)',     hint: 'Required if down < 20% · avg 0.5-1.5% of loan/yr', type: 'pct_loan',  defaultVal: 0.85 },
    { key: 'propertax', label: 'Property Tax',                  hint: 'Annual rate · US avg ~1.1%',                        type: 'pct_value', defaultVal: 1.1  },
    { key: 'homeins',   label: 'Home Insurance',                hint: 'Annual premium · avg $1,200-2,000/yr',              type: 'fixed',     defaultVal: 1500 },
    { key: 'hoa',       label: 'HOA Fees',                      hint: 'Monthly homeowners association fee',                type: 'monthly',   defaultVal: 0    },
  ],
  ca: [
    { key: 'cmhc',      label: 'CMHC Insurance',               hint: 'Required if down < 20% · 2.8-4.0% of loan',        type: 'cmhc',      defaultVal: 0    },
    { key: 'propertax', label: 'Property Tax',                  hint: 'Annual rate · CA avg ~0.7-1.1%',                   type: 'pct_value', defaultVal: 0.9  },
    { key: 'homeins',   label: 'Home Insurance',                hint: 'Annual premium · avg CA$1,500-2,500',              type: 'fixed',     defaultVal: 2000 },
    { key: 'condo',     label: 'Condo Fees',                    hint: 'Monthly strata/condo fees',                        type: 'monthly',   defaultVal: 0    },
  ],
  uk: [
    { key: 'propertax', label: 'Council Tax',                   hint: 'Annual council tax · avg £1,800-2,500',            type: 'fixed',     defaultVal: 2000 },
    { key: 'homeins',   label: 'Buildings Insurance',           hint: 'Annual premium · avg £150-350',                    type: 'fixed',     defaultVal: 250  },
    { key: 'lifeins',   label: 'Life Insurance (mortgage)',      hint: 'Monthly decreasing term policy',                   type: 'monthly',   defaultVal: 0    },
    { key: 'service',   label: 'Service Charge (leasehold)',     hint: 'Annual leasehold service charge',                  type: 'fixed',     defaultVal: 0    },
  ],
  au: [
    { key: 'lmi',       label: 'LMI (Lenders Mortgage Ins.)',   hint: 'Required if LVR > 80% · 1-3% of loan',            type: 'pct_loan',  defaultVal: 1.5  },
    { key: 'propertax', label: 'Council Rates',                  hint: 'Annual council rates · avg A$1,000-2,500',         type: 'fixed',     defaultVal: 1800 },
    { key: 'homeins',   label: 'Home Insurance',                hint: 'Annual premium · avg A$1,500-2,500',               type: 'fixed',     defaultVal: 2000 },
    { key: 'strata',    label: 'Strata / Body Corporate',        hint: 'Annual strata fees (units/apts)',                  type: 'fixed',     defaultVal: 0    },
  ],
  ie: [
    { key: 'propertax', label: 'Local Property Tax (LPT)',      hint: 'Annual rate · based on property value band',       type: 'fixed',     defaultVal: 800  },
    { key: 'homeins',   label: 'Home Insurance',                hint: 'Annual premium · avg €600-1,200',                  type: 'fixed',     defaultVal: 900  },
    { key: 'lifeins',   label: 'Mortgage Protection',           hint: 'Required in IE · monthly premium',                 type: 'monthly',   defaultVal: 0    },
  ],
  nz: [
    { key: 'propertax', label: 'Rates (Council)',               hint: 'Annual local authority rates · avg NZ$2,000-4,000', type: 'fixed',     defaultVal: 2500 },
    { key: 'homeins',   label: 'Home Insurance',                hint: 'Annual premium · avg NZ$1,500-2,500',              type: 'fixed',     defaultVal: 2000 },
    { key: 'body',      label: 'Body Corporate Fees',           hint: 'Annual fees for units/apartments',                 type: 'fixed',     defaultVal: 0    },
  ],
}

// ---------------------------------------------------------------------------
// Compute monthly cost for an option
// Returns null for 'cmhc' (one-time, handled separately)
// ---------------------------------------------------------------------------
function optionMonthly(opt, val, loanAmount, homePrice) {
  switch (opt.type) {
    case 'pct_loan':  return loanAmount * val / 100 / 12
    case 'pct_value': return homePrice * val / 100 / 12
    case 'fixed':     return val / 12
    case 'monthly':   return val
    case 'cmhc':      return null // one-time only
    default:          return 0
  }
}

function calcMortgage({ price, down, rate, termYears, country }) {
  const principal = price - down
  const monthlyRate = rate / 100 / 12
  const n = termYears * 12
  if (principal <= 0 || rate <= 0 || n <= 0) return null

  const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const totalPaid = monthly * n
  const totalInterest = totalPaid - principal
  const ltv = (principal / price) * 100

  // UK SDLT — April 2025 rates
  let sdlt = 0
  if (country === 'uk') {
    const slabs = [
      [125000, 0],
      [125000, 0.02],
      [675000, 0.05],
      [575000, 0.10],
      [Infinity, 0.12],
    ]
    let rem = price
    for (const [limit, r] of slabs) {
      const taxable = Math.min(rem, limit)
      sdlt += taxable * r
      rem -= taxable
      if (rem <= 0) break
    }
  }

  // CA CMHC premium
  let cmhc = 0
  if (country === 'ca') {
    const dpPct = (down / price) * 100
    const cmhcRate = dpPct < 10 ? 0.04 : dpPct < 15 ? 0.031 : dpPct < 20 ? 0.028 : 0
    cmhc = principal * cmhcRate
  }

  // US PMI
  let pmi = 0
  if (country === 'us' && ltv > 80) {
    pmi = (principal * 0.005) / 12
  }

  // AU LMI (simplified estimate)
  let lmi = 0
  if (country === 'au' && ltv > 80) {
    lmi = principal * 0.02
  }

  return { monthly, totalInterest, totalPaid, ltv, sdlt, cmhc, pmi, lmi, principal, n }
}

function buildAmortData(principal, monthlyRate, monthly, n) {
  const data = []
  let balance = principal
  let cumPrincipal = 0
  let cumInterest = 0
  for (let m = 1; m <= n; m++) {
    const interestPart = balance * monthlyRate
    const principalPart = monthly - interestPart
    balance -= principalPart
    cumPrincipal += principalPart
    cumInterest += interestPart
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        principal: Math.round(cumPrincipal),
        interest: Math.round(cumInterest),
      })
    }
  }
  return data
}

function buildScheduleData(principal, monthlyRate, monthly, n) {
  const rows = []
  let balance = principal
  for (let m = 1; m <= n; m++) {
    const interestPart = balance * monthlyRate
    const principalPart = monthly - interestPart
    balance = Math.max(0, balance - principalPart)
    rows.push({ month: m, principal: principalPart, interest: interestPart, balance })
  }
  return rows
}

function calcMonthlyPayment(principal, rate, termYears) {
  const monthlyRate = rate / 100 / 12
  const n = termYears * 12
  if (principal <= 0 || rate <= 0 || n <= 0) return 0
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
}

const defaultValues = {
  us: { price: 400000, down: 80000, rate: 7.0, term: 30 },
  ca: { price: 600000, down: 120000, rate: 5.0, term: 25 },
  uk: { price: 300000, down: 60000, rate: 4.5, term: 25 },
  au: { price: 750000, down: 150000, rate: 6.5, term: 30 },
  ie: { price: 350000, down: 70000, rate: 4.0, term: 30 },
  nz: { price: 700000, down: 140000, rate: 7.0, term: 30 },
}

// ---------------------------------------------------------------------------
// Toggle switch (same style as SalaryCalc)
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-blue-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Status dot helper
// ---------------------------------------------------------------------------
function StatusDot({ color }) {
  const cls = color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
  return <span className={`inline-block w-2 h-2 rounded-full ${cls} mr-1.5`} />
}

// ---------------------------------------------------------------------------
// CountryMortgageSpecialist component
// ---------------------------------------------------------------------------
function CountryMortgageSpecialist({ country, price, down, rate, term, c }) {
  const [offsetAU, setOffsetAU] = useState(20000)
  const [incomeIE, setIncomeIE] = useState(70000)
  const [incomeNZ, setIncomeNZ] = useState(90000)

  const fmt = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
      : '—'
  const fmtD = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
      : '—'

  const principal = price - down
  const ltv = price > 0 ? (principal / price) * 100 : 0
  const dpPct = price > 0 ? (down / price) * 100 : 0

  switch (country) {
    // -----------------------------------------------------------------------
    // US
    // -----------------------------------------------------------------------
    case 'us': {
      // Loan type computations
      const loanTypes = [
        {
          name: 'Conventional',
          minDown: '3%',
          upfront: null,
          hasPMI: dpPct < 20,
          monthlyPMI: dpPct < 20 ? (principal * 0.0085) / 12 : 0,
          loanAmt: principal,
          note: dpPct < 20 ? 'PMI required' : 'No PMI',
        },
        {
          name: 'FHA',
          minDown: '3.5%',
          upfront: principal * 0.0175,
          hasPMI: true,
          monthlyPMI: (principal * 0.0055) / 12,
          loanAmt: principal + principal * 0.0175,
          note: 'MIP always required',
        },
        {
          name: 'VA',
          minDown: '0%',
          upfront: principal * 0.0215,
          hasPMI: false,
          monthlyPMI: 0,
          loanAmt: principal + principal * 0.0215,
          note: 'No monthly PMI · funding fee 2.15%',
        },
        {
          name: 'USDA',
          minDown: '0%',
          upfront: principal * 0.01,
          hasPMI: false,
          monthlyPMI: (principal * 0.0035) / 12,
          loanAmt: principal + principal * 0.01,
          note: 'Rural only · 0.35%/yr guarantee fee',
        },
      ]

      loanTypes.forEach(lt => {
        lt.monthly = calcMonthlyPayment(lt.loanAmt, rate, term) + lt.monthlyPMI
      })

      // PMI removal
      const pmiApplies = dpPct < 20
      let pmiMonth = null
      let pmiSavings = 0
      if (pmiApplies) {
        const monthlyRate = rate / 100 / 12
        const n = term * 12
        const mp = calcMonthlyPayment(principal, rate, term)
        const targetBalance = price * 0.80
        let balance = principal
        const monthlyPMI = (principal * 0.0085) / 12
        for (let m = 1; m <= n; m++) {
          const intPart = balance * monthlyRate
          const prinPart = mp - intPart
          balance -= prinPart
          if (balance <= targetBalance) {
            pmiMonth = m
            pmiSavings = monthlyPMI * (n - m)
            break
          }
        }
      }

      // ARM vs Fixed
      const armRate = Math.max(rate - 1.0, 1)
      const armRateAfter = rate + 1.5
      const fixedMonthly = calcMonthlyPayment(principal, rate, term)
      const armMonthly5yr = calcMonthlyPayment(principal, armRate, term)
      const armMonthllyAfter = calcMonthlyPayment(principal, armRateAfter, term)
      const arm5yrSavings = (fixedMonthly - armMonthly5yr) * 60

      return (
        <div className="space-y-5">
          {/* Loan Type Comparison */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Loan Type Comparison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loanTypes.map(lt => (
                <div key={lt.name} className="border border-slate-200 rounded-xl p-3 bg-white">
                  <p className="font-bold text-slate-800 text-sm">{lt.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{lt.note}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Min Down</span>
                      <span className="font-semibold">{lt.minDown}</span>
                    </div>
                    {lt.upfront != null && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Upfront Fee</span>
                        <span className="font-semibold">{fmt(lt.upfront)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly PMI/MIP</span>
                      <span className="font-semibold">{lt.monthlyPMI > 0 ? fmtD(lt.monthlyPMI) : 'None'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1 mt-1">
                      <span className="text-slate-600 font-semibold">Est. Monthly</span>
                      <span className="font-bold text-blue-700">{fmtD(lt.monthly)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PMI Removal Timeline */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">PMI Removal Timeline</h3>
            {pmiApplies && pmiMonth ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <StatusDot color="green" />
                  <span>PMI drops off at <strong>Month {pmiMonth}</strong> (Year {Math.ceil(pmiMonth / 12)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot color="green" />
                  <span>Monthly PMI: <strong>{fmtD((principal * 0.0085) / 12)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot color="green" />
                  <span>Total PMI savings after removal: <strong>{fmt(pmiSavings)}</strong></span>
                </div>
                <p className="text-xs text-slate-500 mt-2">You can request PMI removal when balance reaches 80% of original home value. It automatically cancels at 78%.</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <StatusDot color="green" />
                <span>No PMI — your down payment is {dpPct.toFixed(1)}% (&ge;20%)</span>
              </div>
            )}
          </div>

          {/* ARM vs Fixed */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Fixed vs ARM Comparison</h3>
            <div className="grid grid-cols-3 gap-3 text-sm mb-3">
              <div className="col-span-1" />
              <div className="text-center font-bold text-slate-700">30-yr Fixed</div>
              <div className="text-center font-bold text-slate-700">5/1 ARM</div>

              <div className="text-slate-500 text-xs">Rate (first 5 yrs)</div>
              <div className="text-center">{rate.toFixed(2)}%</div>
              <div className="text-center text-green-700 font-semibold">{armRate.toFixed(2)}%</div>

              <div className="text-slate-500 text-xs">Monthly Payment</div>
              <div className="text-center">{fmtD(fixedMonthly)}</div>
              <div className="text-center text-green-700 font-semibold">{fmtD(armMonthly5yr)}</div>

              <div className="text-slate-500 text-xs">Rate after yr 5</div>
              <div className="text-center">—</div>
              <div className="text-center text-red-600 font-semibold">{armRateAfter.toFixed(2)}%</div>

              <div className="text-slate-500 text-xs">Monthly after yr 5</div>
              <div className="text-center">—</div>
              <div className="text-center text-red-600 font-semibold">{fmtD(armMonthllyAfter)}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              <strong>5-yr ARM savings: {fmt(arm5yrSavings)}</strong> vs fixed — but rate could jump to {armRateAfter.toFixed(2)}% after year 5, adding {fmtD(armMonthllyAfter - fixedMonthly)}/mo.
            </div>
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // CA
    // -----------------------------------------------------------------------
    case 'ca': {
      // OSFI stress test
      const qualifyingRate = Math.max(rate + 2, 5.25)
      const contractMonthly = calcMonthlyPayment(principal, rate, term)
      const qualifyingMonthly = calcMonthlyPayment(principal, qualifyingRate, term)
      const requiredIncome = (qualifyingMonthly * 12) / 0.32

      // Payment frequencies
      const monthlyPayment = contractMonthly
      const semiMonthly = monthlyPayment / 2
      const biWeekly = (monthlyPayment * 12) / 26
      const accelBiWeekly = monthlyPayment / 2 // paid 26 times = 13 months/yr

      // Total interest for different frequencies
      function totalInterestFreq(paymentPerPeriod, periodsPerYear, loanPrincipal, annualRate) {
        const periodicRate = annualRate / 100 / periodsPerYear
        const nPeriods = Math.ceil(
          -Math.log(1 - (loanPrincipal * periodicRate) / paymentPerPeriod) / Math.log(1 + periodicRate)
        )
        return { total: paymentPerPeriod * nPeriods - loanPrincipal, periods: nPeriods }
      }
      const monthlyInfo = { total: monthlyPayment * term * 12 - principal, periods: term * 12 }
      const semiInfo = totalInterestFreq(semiMonthly, 24, principal, rate)
      const biInfo = totalInterestFreq(biWeekly, 26, principal, rate)
      const accelInfo = totalInterestFreq(accelBiWeekly, 26, principal, rate)

      const accelSavedInterest = monthlyInfo.total - accelInfo.total
      const accelSavedMonths = monthlyInfo.periods - accelInfo.periods

      // CMHC table
      const cmhcRows = [
        { label: '< 10%', rate: '4.00%', threshold: 10 },
        { label: '10% – 14.99%', rate: '3.10%', threshold: 15 },
        { label: '15% – 19.99%', rate: '2.80%', threshold: 20 },
        { label: '≥ 20%', rate: '0%', threshold: Infinity },
      ]
      const cmhcRate = dpPct < 10 ? 0.04 : dpPct < 15 ? 0.031 : dpPct < 20 ? 0.028 : 0
      const cmhcPremium = principal * cmhcRate

      function cmhcHighlight(row) {
        if (row.label === '< 10%' && dpPct < 10) return true
        if (row.label === '10% – 14.99%' && dpPct >= 10 && dpPct < 15) return true
        if (row.label === '15% – 19.99%' && dpPct >= 15 && dpPct < 20) return true
        if (row.label === '≥ 20%' && dpPct >= 20) return true
        return false
      }

      return (
        <div className="space-y-5">
          {/* OSFI Stress Test */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Test de résistance OSFI 2026</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Your Contract Rate</p>
                  <p className="font-bold text-slate-800 text-lg">{rate.toFixed(2)}%</p>
                  <p className="text-xs text-slate-500 mt-1">Monthly: {fmtD(contractMonthly)}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs text-orange-600 mb-1">Qualifying Rate</p>
                  <p className="font-bold text-orange-700 text-lg">{qualifyingRate.toFixed(2)}%</p>
                  <p className="text-xs text-orange-600 mt-1">Monthly: {fmtD(qualifyingMonthly)}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">Required Annual Income (GDS 32%)</p>
                <p className="font-bold text-blue-800 text-xl">{fmt(requiredIncome)}</p>
                <p className="text-xs text-blue-600 mt-1">You qualify if your income can support {fmtD(qualifyingMonthly)}/month at the stress rate</p>
              </div>
              <p className="text-xs text-slate-500">Qualifying rate = max(contract rate + 2%, 5.25%) per OSFI B-20 guidelines.</p>
            </div>
          </div>

          {/* Payment Frequency */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Fréquence de paiement</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Monthly', payment: fmtD(monthlyPayment), totalInt: fmt(monthlyInfo.total), periods: `${term * 12} months`, highlight: false },
                { label: 'Semi-monthly (×24/yr)', payment: fmtD(semiMonthly), totalInt: fmt(semiInfo.total), periods: `${Math.round(semiInfo.periods / 2)} months`, highlight: false },
                { label: 'Bi-weekly (×26/yr)', payment: fmtD(biWeekly), totalInt: fmt(biInfo.total), periods: `${Math.round(biInfo.periods * 14 / 30)} months`, highlight: false },
                { label: 'Accelerated Bi-weekly', payment: fmtD(accelBiWeekly), totalInt: fmt(accelInfo.total), periods: `${Math.round(accelInfo.periods * 14 / 30)} months`, highlight: true },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between rounded-lg px-3 py-2 ${row.highlight ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
                  <div>
                    <span className={`font-semibold ${row.highlight ? 'text-green-800' : 'text-slate-700'}`}>{row.label}</span>
                    {row.highlight && <span className="ml-2 text-xs bg-green-200 text-green-800 rounded-full px-2 py-0.5">Best</span>}
                    <p className="text-xs text-slate-500">{row.periods} · Interest: {row.totalInt}</p>
                  </div>
                  <span className={`font-bold ${row.highlight ? 'text-green-700' : 'text-slate-700'}`}>{row.payment}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
              <strong>Accelerated bi-weekly saves {fmt(accelSavedInterest)} in interest</strong> and pays off your mortgage ~{Math.round(accelSavedMonths / 12)} years earlier.
            </div>
          </div>

          {/* CMHC Premium Table */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Barème CMHC 2026</h3>
            <p className="text-xs text-slate-500 mb-3">Your down payment: {dpPct.toFixed(1)}% ({fmt(down)})</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="text-left pb-2">Down Payment</th>
                  <th className="text-right pb-2">CMHC Rate</th>
                  <th className="text-right pb-2">Your Premium</th>
                </tr>
              </thead>
              <tbody>
                {cmhcRows.map(row => {
                  const isActive = cmhcHighlight(row)
                  const rowRate = row.label === '< 10%' ? 0.04 : row.label === '10% – 14.99%' ? 0.031 : row.label === '15% – 19.99%' ? 0.028 : 0
                  const rowPremium = principal * rowRate
                  return (
                    <tr key={row.label} className={`border-b border-slate-100 ${isActive ? 'bg-blue-50' : ''}`}>
                      <td className="py-2">
                        {isActive && <StatusDot color="green" />}
                        <span className={isActive ? 'font-bold text-blue-800' : 'text-slate-600'}>{row.label}</span>
                      </td>
                      <td className={`text-right py-2 font-semibold ${isActive ? 'text-blue-800' : 'text-slate-600'}`}>{row.rate}</td>
                      <td className={`text-right py-2 font-semibold ${isActive ? 'text-blue-800' : 'text-slate-500'}`}>{rowPremium > 0 ? fmt(rowPremium) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {cmhcPremium > 0 && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                Your CMHC premium: <strong>{fmt(cmhcPremium)}</strong> — added to your mortgage balance (loan becomes {fmt(principal + cmhcPremium)}).
              </div>
            )}
            {dpPct >= 20 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <StatusDot color="green" />No CMHC insurance required — your down payment is 20% or more.
              </div>
            )}
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // UK
    // -----------------------------------------------------------------------
    case 'uk': {
      // FCA Stress Test
      const stressRate = rate + 3
      const contractMonthly = calcMonthlyPayment(principal, rate, term)
      const stressedMonthly = calcMonthlyPayment(principal, stressRate, term)
      const requiredIncome = (stressedMonthly * 12) / 0.35

      // Interest-only
      const interestOnly = (principal * rate) / 100 / 12
      const ioMonthlySaving = contractMonthly - interestOnly

      // SDLT April 2025 bands
      function calcSDLT(p, ftb = false) {
        if (ftb) {
          if (p <= 425000) return 0
          if (p <= 625000) return (p - 425000) * 0.05
          // above 625k: standard rates apply in full
        }
        // Standard rates (April 2025)
        const bands = [
          [250000, 0],
          [675000, 0.05],
          [575000, 0.10],
          [Infinity, 0.12],
        ]
        let tax = 0; let rem = p
        for (const [limit, r] of bands) {
          const taxable = Math.min(rem, limit)
          tax += taxable * r
          rem -= taxable
          if (rem <= 0) break
        }
        return tax
      }

      const sdltStandard = calcSDLT(price, false)
      const sdltFTB = calcSDLT(price, true)

      const sdltBandsStd = [
        { range: '£0 – £250k', rate: '0%', amount: Math.min(price, 250000) * 0 },
        { range: '£250k – £925k', rate: '5%', amount: Math.max(0, Math.min(price, 925000) - 250000) * 0.05 },
        { range: '£925k – £1.5M', rate: '10%', amount: Math.max(0, Math.min(price, 1500000) - 925000) * 0.10 },
        { range: 'Above £1.5M', rate: '12%', amount: Math.max(0, price - 1500000) * 0.12 },
      ]

      return (
        <div className="space-y-5">
          {/* FCA Affordability Stress Test */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">FCA Affordability Stress Test</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Contract Rate</p>
                <p className="font-bold text-slate-800 text-lg">{rate.toFixed(2)}%</p>
                <p className="text-xs text-slate-500 mt-1">{fmtD(contractMonthly)}/mo</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-600 mb-1">Stress Rate (+3%)</p>
                <p className="font-bold text-red-700 text-lg">{stressRate.toFixed(2)}%</p>
                <p className="text-xs text-red-600 mt-1">{fmtD(stressedMonthly)}/mo</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-xs text-blue-600 mb-1">Required Gross Income (35% rule)</p>
              <p className="font-bold text-blue-800 text-xl">{fmt(requiredIncome)}</p>
              <p className="text-xs text-blue-600 mt-1">Lenders assess you at the stress rate to ensure affordability if rates rise.</p>
            </div>
          </div>

          {/* Interest-Only vs Repayment */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Repayment vs Interest-Only</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">Repayment Mortgage</p>
                <p className="font-bold text-blue-800 text-lg">{fmtD(contractMonthly)}/mo</p>
                <p className="text-xs text-blue-600 mt-1">Balance: £0 at end of term</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-600 mb-1">Interest-Only</p>
                <p className="font-bold text-orange-700 text-lg">{fmtD(interestOnly)}/mo</p>
                <p className="text-xs text-orange-600 mt-1">Saves {fmtD(ioMonthlySaving)}/mo</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-xs text-red-800">
              <strong>Warning:</strong> Interest-only leaves <strong>{fmt(principal)}</strong> outstanding at term end — you must have a repayment strategy.
            </div>
          </div>

          {/* SDLT Breakdown */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">SDLT Breakdown (April 2025)</h3>
            <table className="w-full text-sm mb-3">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="text-left pb-2">Band</th>
                  <th className="text-right pb-2">Rate</th>
                  <th className="text-right pb-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {sdltBandsStd.map(row => (
                  <tr key={row.range} className="border-b border-slate-100">
                    <td className="py-1.5 text-slate-600">{row.range}</td>
                    <td className="text-right py-1.5 text-slate-600">{row.rate}</td>
                    <td className="text-right py-1.5 font-semibold text-slate-700">{row.amount > 0 ? fmt(row.amount) : '—'}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-300">
                  <td className="py-2 font-bold text-slate-800" colSpan={2}>Total SDLT (standard)</td>
                  <td className="text-right py-2 font-bold text-slate-800">{fmt(sdltStandard)}</td>
                </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Standard Buyer</p>
                <p className="font-bold text-slate-800">{fmt(sdltStandard)}</p>
                <p className="text-xs text-slate-500">Effective rate: {price > 0 ? ((sdltStandard / price) * 100).toFixed(2) : 0}%</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-600 mb-1">First-Time Buyer</p>
                <p className="font-bold text-green-800">{fmt(sdltFTB)}</p>
                <p className="text-xs text-green-600">Saving: {fmt(sdltStandard - sdltFTB)}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // AU
    // -----------------------------------------------------------------------
    case 'au': {
      // APRA buffer
      const apraRate = rate + 3
      const contractMonthly = calcMonthlyPayment(principal, rate, term)
      const apraMonthly = calcMonthlyPayment(principal, apraRate, term)
      const apraIncome = (apraMonthly * 12) / 0.30

      // Offset account
      const effectiveLoan = Math.max(0, principal - offsetAU)
      const normalInterestYr = principal * rate / 100
      const offsetInterestYr = effectiveLoan * rate / 100
      const offsetSavingsYr = normalInterestYr - offsetInterestYr
      const approxMonthsOff = offsetAU > 0 && contractMonthly > 0
        ? Math.round((offsetAU / contractMonthly) * (rate / 100 / 12 + 1) * 12)
        : 0

      // LMI table
      const lvr = ltv
      const lmiRows = [
        { range: '≤ 80%', approxRate: '0%', premium: 0, isApplicable: lvr <= 80 },
        { range: '80% – 85%', approxRate: '~0.5%', premium: principal * 0.005, isApplicable: lvr > 80 && lvr <= 85 },
        { range: '85% – 90%', approxRate: '~1.5%', premium: principal * 0.015, isApplicable: lvr > 85 && lvr <= 90 },
        { range: '90% – 95%', approxRate: '~3%', premium: principal * 0.03, isApplicable: lvr > 90 && lvr <= 95 },
      ]

      return (
        <div className="space-y-5">
          {/* APRA Serviceability Buffer */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">APRA Serviceability Buffer</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Your Rate</p>
                <p className="font-bold text-slate-800 text-lg">{rate.toFixed(2)}%</p>
                <p className="text-xs text-slate-500 mt-1">{fmtD(contractMonthly)}/mo</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-600 mb-1">Assessment Rate (+3%)</p>
                <p className="font-bold text-orange-700 text-lg">{apraRate.toFixed(2)}%</p>
                <p className="text-xs text-orange-600 mt-1">{fmtD(apraMonthly)}/mo</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-xs text-blue-600 mb-1">Required Gross Income (30% rule)</p>
              <p className="font-bold text-blue-800 text-xl">{fmt(apraIncome)}</p>
              <p className="text-xs text-blue-600 mt-1">Banks assess your ability to repay at your rate + 3% buffer (APRA requirement).</p>
            </div>
          </div>

          {/* Offset Account */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Offset Account Savings</h3>
            <div className="mb-4">
              <NumericInput
                label="Offset Balance (A$)"
                value={offsetAU}
                onChange={setOffsetAU}
                min={0}
                max={500000}
                step={5000}
                prefix="A$"
                showSlider
                hint="Amount held in your offset account"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-600 mb-1">Interest Saved / Year</p>
                <p className="font-bold text-green-800 text-lg">{fmt(offsetSavingsYr)}</p>
                <p className="text-xs text-green-600 mt-1">Effective loan: {fmt(effectiveLoan)}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-1">Approx. Months Saved</p>
                <p className="font-bold text-blue-800 text-lg">{approxMonthsOff} months</p>
                <p className="text-xs text-blue-600 mt-1">By keeping {fmt(offsetAU)} in offset</p>
              </div>
            </div>
          </div>

          {/* LMI Table */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">LMI Estimate by LVR</h3>
            <p className="text-xs text-slate-500 mb-3">Your LVR: {lvr.toFixed(1)}% — Loan: {fmt(principal)}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="text-left pb-2">LVR Range</th>
                  <th className="text-right pb-2">Approx. Rate</th>
                  <th className="text-right pb-2">Est. LMI</th>
                </tr>
              </thead>
              <tbody>
                {lmiRows.map(row => (
                  <tr key={row.range} className={`border-b border-slate-100 ${row.isApplicable ? 'bg-blue-50' : ''}`}>
                    <td className="py-2">
                      {row.isApplicable && <StatusDot color={row.premium > 0 ? 'red' : 'green'} />}
                      <span className={row.isApplicable ? 'font-bold text-blue-800' : 'text-slate-600'}>{row.range}</span>
                    </td>
                    <td className={`text-right py-2 ${row.isApplicable ? 'font-bold text-blue-800' : 'text-slate-500'}`}>{row.approxRate}</td>
                    <td className={`text-right py-2 font-semibold ${row.isApplicable ? 'text-blue-800' : 'text-slate-500'}`}>{row.premium > 0 ? fmt(row.premium) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lvr <= 80 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <StatusDot color="green" />No LMI required — your LVR is {lvr.toFixed(1)}% (&le;80%).
              </div>
            )}
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // IE
    // -----------------------------------------------------------------------
    case 'ie': {
      const maxLoanFTB = incomeIE * 4
      const maxLoanSecond = incomeIE * 3.5
      const requiredLoan = principal
      const canBorrowFTB = requiredLoan <= maxLoanFTB
      const canBorrowSecond = requiredLoan <= maxLoanSecond

      // LTV check
      const ltvFTBOK = ltv <= 90
      const ltvSecondOK = ltv <= 80

      // HTB
      const htbAmount = price <= 500000 ? Math.min(30000, price * 0.10) : 0
      const adjustedDown = down + htbAmount

      return (
        <div className="space-y-5">
          {/* Central Bank Income Multiplier */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Central Bank Mortgage Rules 2026</h3>
            <div className="mb-4">
              <NumericInput
                label="Gross Annual Income (€)"
                value={incomeIE}
                onChange={setIncomeIE}
                min={20000}
                max={500000}
                step={5000}
                prefix="€"
                hint="Individual or combined household income"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className={`rounded-lg p-3 border ${canBorrowFTB ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs mb-1 ${canBorrowFTB ? 'text-green-600' : 'text-red-600'}`}>FTB (4× income)</p>
                <p className={`font-bold text-lg ${canBorrowFTB ? 'text-green-800' : 'text-red-800'}`}>{fmt(maxLoanFTB)}</p>
                <div className="flex items-center mt-1 text-xs">
                  <StatusDot color={canBorrowFTB ? 'green' : 'red'} />
                  <span className={canBorrowFTB ? 'text-green-700' : 'text-red-700'}>{canBorrowFTB ? 'Within limit' : 'Exceeds limit'}</span>
                </div>
              </div>
              <div className={`rounded-lg p-3 border ${canBorrowSecond ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs mb-1 ${canBorrowSecond ? 'text-green-600' : 'text-red-600'}`}>Second Buyer (3.5× income)</p>
                <p className={`font-bold text-lg ${canBorrowSecond ? 'text-green-800' : 'text-red-800'}`}>{fmt(maxLoanSecond)}</p>
                <div className="flex items-center mt-1 text-xs">
                  <StatusDot color={canBorrowSecond ? 'green' : 'red'} />
                  <span className={canBorrowSecond ? 'text-green-700' : 'text-red-700'}>{canBorrowSecond ? 'Within limit' : 'Exceeds limit'}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
              Required loan: <strong>{fmt(requiredLoan)}</strong> · Your income: <strong>{fmt(incomeIE)}</strong>
            </div>
          </div>

          {/* Help-to-Buy */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Help-to-Buy Scheme</h3>
            {price <= 500000 ? (
              <div className="space-y-3 text-sm">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Estimated HTB Benefit</p>
                  <p className="font-bold text-green-800 text-xl">{fmt(htbAmount)}</p>
                  <p className="text-xs text-green-600 mt-1">= min(€30,000, 10% of purchase price)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Your Down Payment</p>
                    <p className="font-semibold text-slate-800">{fmt(down)}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-1">With HTB</p>
                    <p className="font-bold text-blue-800">{fmt(adjustedDown)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">HTB applies to new builds for first-time buyers. Claim via Revenue.ie.</p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                HTB not available — property price exceeds €500,000. Only new builds under €500k qualify.
              </div>
            )}
          </div>

          {/* LTV Eligibility */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">LTV Eligibility Check</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-slate-600">Your LTV</span>
                <span className="font-bold text-slate-800 text-lg">{ltv.toFixed(1)}%</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${ltvFTBOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <StatusDot color={ltvFTBOK ? 'green' : 'red'} />
                <div>
                  <p className={`font-semibold ${ltvFTBOK ? 'text-green-800' : 'text-red-800'}`}>First-Time Buyer: max 90% LTV</p>
                  <p className={`text-xs ${ltvFTBOK ? 'text-green-600' : 'text-red-600'}`}>{ltvFTBOK ? 'Eligible — your LTV is within limit' : `You need a minimum ${fmt(price * 0.10)} deposit`}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${ltvSecondOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <StatusDot color={ltvSecondOK ? 'green' : 'red'} />
                <div>
                  <p className={`font-semibold ${ltvSecondOK ? 'text-green-800' : 'text-red-800'}`}>Second Buyer: max 80% LTV</p>
                  <p className={`text-xs ${ltvSecondOK ? 'text-green-600' : 'text-red-600'}`}>{ltvSecondOK ? 'Eligible — your LTV is within limit' : `You need a minimum ${fmt(price * 0.20)} deposit`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // -----------------------------------------------------------------------
    // NZ
    // -----------------------------------------------------------------------
    case 'nz': {
      const maxLoanDTI = incomeNZ * 6
      const dtiOK = principal <= maxLoanDTI

      // LVR
      const minDeposit20 = price * 0.20
      const lvrOK = ltv <= 80

      // First Home Loan
      const fhlSingleIncomeOK = incomeNZ < 95000
      const fhlJointIncomeOK = incomeNZ < 150000
      const fhlPriceCaps = [
        { region: 'Auckland', cap: 875000 },
        { region: 'Wellington', cap: 750000 },
        { region: 'Other regions', cap: 625000 },
      ]
      const fhlMin5pct = price * 0.05

      return (
        <div className="space-y-5">
          {/* RBNZ DTI Limits */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">RBNZ DTI Rules 2026</h3>
            <div className="mb-4">
              <NumericInput
                label="Gross Annual Income (NZ$)"
                value={incomeNZ}
                onChange={setIncomeNZ}
                min={20000}
                max={500000}
                step={5000}
                prefix="NZ$"
                hint="Individual or combined household income"
              />
            </div>
            <div className={`rounded-lg p-4 border mb-3 ${dtiOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${dtiOK ? 'text-green-800' : 'text-red-800'}`}>Owner-Occupier: max 6× income</span>
                <div className="flex items-center gap-1.5 text-xs">
                  <StatusDot color={dtiOK ? 'green' : 'red'} />
                  <span className={dtiOK ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{dtiOK ? 'Within limit' : 'Exceeds limit'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Max Loan Allowed</p>
                  <p className={`font-bold text-lg ${dtiOK ? 'text-green-800' : 'text-red-800'}`}>{fmt(maxLoanDTI)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Your Loan</p>
                  <p className="font-bold text-slate-800 text-lg">{fmt(principal)}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">RBNZ DTI restrictions limit most owner-occupier loans to 6× gross income from mid-2024.</p>
          </div>

          {/* LVR Restrictions */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">LVR Restrictions (RBNZ)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-slate-600">Current LVR</span>
                <span className="font-bold text-slate-800 text-lg">{ltv.toFixed(1)}%</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${lvrOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <StatusDot color={lvrOK ? 'green' : 'red'} />
                <div>
                  <p className={`font-semibold ${lvrOK ? 'text-green-800' : 'text-red-800'}`}>
                    {lvrOK ? 'LVR within RBNZ limits (≤80%)' : 'LVR exceeds RBNZ standard limit (>80%)'}
                  </p>
                  {!lvrOK && (
                    <p className="text-xs text-red-600 mt-0.5">
                      Standard minimum deposit: {fmt(minDeposit20)} (20% of {fmt(price)}). You have: {fmt(down)}.
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">RBNZ restricts high-LVR lending. Up to 15% of new owner-occupier loans may be above 80% LVR.</p>
            </div>
          </div>

          {/* Kāinga Ora First Home Loan */}
          <div className="cw-card">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Kāinga Ora First Home Loan</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 border ${fhlSingleIncomeOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-xs mb-1 ${fhlSingleIncomeOK ? 'text-green-600' : 'text-red-600'}`}>Single Income Cap</p>
                  <p className={`font-bold ${fhlSingleIncomeOK ? 'text-green-800' : 'text-red-800'}`}>&lt; NZ$95,000</p>
                  <div className="flex items-center mt-1 text-xs">
                    <StatusDot color={fhlSingleIncomeOK ? 'green' : 'red'} />
                    <span className={fhlSingleIncomeOK ? 'text-green-700' : 'text-red-700'}>{fhlSingleIncomeOK ? 'Eligible' : 'Above cap'}</span>
                  </div>
                </div>
                <div className={`rounded-lg p-3 border ${fhlJointIncomeOK ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-xs mb-1 ${fhlJointIncomeOK ? 'text-green-600' : 'text-red-600'}`}>Joint Income Cap</p>
                  <p className={`font-bold ${fhlJointIncomeOK ? 'text-green-800' : 'text-red-800'}`}>&lt; NZ$150,000</p>
                  <div className="flex items-center mt-1 text-xs">
                    <StatusDot color={fhlJointIncomeOK ? 'green' : 'red'} />
                    <span className={fhlJointIncomeOK ? 'text-green-700' : 'text-red-700'}>{fhlJointIncomeOK ? 'Eligible' : 'Above cap'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 mb-2">Min Deposit (5%): <strong>{fmt(fhlMin5pct)}</strong></p>
                <p className="text-xs text-blue-700 font-semibold mb-2">Price Caps by Region:</p>
                <div className="space-y-1">
                  {fhlPriceCaps.map(r => (
                    <div key={r.region} className="flex justify-between text-xs">
                      <span className="text-blue-700">{r.region}</span>
                      <span className={`font-semibold ${price <= r.cap ? 'text-green-700' : 'text-red-600'}`}>
                        {fmt(r.cap)} {price <= r.cap ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">First Home Loan allows eligible buyers to purchase with as little as 5% deposit. Subject to Kāinga Ora eligibility criteria.</p>
            </div>
          </div>
        </div>
      )
    }

    default:
      return (
        <div className="cw-card text-center py-8 text-slate-500">
          Specialist tools not available for this region.
        </div>
      )
  }
}

export default function MortgageCalc({ country }) {
  const c = countries[country]
  const sym = c.symbol
  const defs = defaultValues[country] || defaultValues.us
  const optionDefs = COUNTRY_OPTIONS[country] || []

  const [price, setPrice] = useState(defs.price)
  const [down, setDown] = useState(defs.down)
  const [rate, setRate] = useState(defs.rate)
  const [term, setTerm] = useState(defs.term)
  const [activeTab, setActiveTab] = useState('summary')

  // Optional costs state
  const [optOpen, setOptOpen] = useState(true)
  const [optEnabled, setOptEnabled] = useState({})
  const [optValues, setOptValues] = useState(
    Object.fromEntries(optionDefs.map(o => [o.key, o.defaultVal]))
  )

  const toggleOpt = (key, val) => setOptEnabled(prev => ({ ...prev, [key]: val }))
  const setOptVal  = (key, val) => setOptValues(prev => ({ ...prev, [key]: val }))

  const result = useMemo(
    () => calcMortgage({ price, down, rate, termYears: term, country }),
    [price, down, rate, term, country]
  )

  const amortData = useMemo(() => {
    if (!result) return []
    return buildAmortData(result.principal, rate / 100 / 12, result.monthly, result.n)
  }, [result, rate])

  const scheduleData = useMemo(() => {
    if (!result) return []
    return buildScheduleData(result.principal, rate / 100 / 12, result.monthly, result.n)
  }, [result, rate])

  // Compute active optional monthly costs
  const activeOptMonthly = useMemo(() => {
    if (!result) return {}
    const out = {}
    for (const opt of optionDefs) {
      if (!optEnabled[opt.key]) continue
      const val = optValues[opt.key] ?? opt.defaultVal
      const mo = optionMonthly(opt, val, result.principal, price)
      if (mo !== null) out[opt.key] = mo
    }
    return out
  }, [result, optionDefs, optEnabled, optValues, price])

  const totalOptMonthly = useMemo(
    () => Object.values(activeOptMonthly).reduce((s, v) => s + v, 0),
    [activeOptMonthly]
  )

  // CMHC one-time (CA specific, from optional panel)
  const cmhcOptOneTime = useMemo(() => {
    if (country !== 'ca' || !optEnabled['cmhc'] || !result) return 0
    const val = optValues['cmhc'] ?? 0
    // val is a pct of loan
    return result.principal * val / 100
  }, [country, optEnabled, optValues, result])

  const trueMonthly = result ? result.monthly + totalOptMonthly : 0

  const activeOptCount = optionDefs.filter(o => optEnabled[o.key]).length
  const activeOptLabels = optionDefs.filter(o => optEnabled[o.key]).map(o => o.label)

  const pieData = useMemo(() => {
    if (!result) return []
    const items = [
      { name: 'Principal', value: Math.round(result.principal) },
      { name: 'Interest',  value: Math.round(result.totalInterest) },
    ]
    // Add enabled optional cost slices (annualised totals for the full term)
    for (const opt of optionDefs) {
      if (!optEnabled[opt.key]) continue
      if (opt.type === 'cmhc') continue
      const mo = activeOptMonthly[opt.key]
      if (mo > 0) items.push({ name: opt.label, value: Math.round(mo * result.n) })
    }
    return items
  }, [result, optionDefs, optEnabled, activeOptMonthly])

  const fmt = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
      : '—'
  const fmtD = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
      : '—'

  const downPct = price > 0 ? ((down / price) * 100).toFixed(1) : 0
  const stressRate = Math.max(rate + 2, 5.25)
  const termOptions = [10, 15, 20, 25, 30].filter(y => country !== 'ca' || y <= 25)

  const rateHint = country === 'us'
    ? '2026 avg: 6.8%'
    : country === 'ca'
    ? '2026 avg: 5.4%'
    : '2026 avg: 4.8% UK'

  const pageTitle = `${c.name} Mortgage Calculator 2026 — Monthly Payment | CalcWise`
  const pageDesc = `Free ${c.name} mortgage calculator. Instant monthly payment, total interest, amortization.${country === 'uk' ? ' SDLT included.' : country === 'ca' ? ' CMHC & stress test.' : ''} Updated 2026.`

  const otherCountries = Object.entries(countries)
    .filter(([code]) => code !== country)
    .map(([code, ct]) => ({ code, flag: ct.flag, name: ct.name }))

  const relatedLinks = [
    country === 'us' && { to: '/us/refinance', label: 'Refinance US' },
    country === 'us' && { to: '/us/rent-vs-buy', label: 'Rent vs Buy US' },
    country === 'us' && { to: '/us/affordability', label: 'Affordability US' },
    country === 'ca' && { to: '/ca/affordability', label: 'Affordability CA' },
    country === 'ca' && { to: '/ca/rent-vs-buy', label: 'Rent vs Buy CA' },
    country === 'uk' && { to: '/uk/stamp-duty', label: 'Stamp Duty UK' },
    country === 'uk' && { to: '/uk/affordability', label: 'Affordability UK' },
    { to: `/${country}/tax`, label: `Tax ${country.toUpperCase()}` },
  ].filter(Boolean)

  const introText = {
    us: 'Our US mortgage calculator goes beyond the basic monthly payment. We include PMI (when your down payment is under 20%), show your LTV ratio, and display the full amortization schedule — revealing exactly how much of every payment goes to principal vs. interest. Your bank\'s calculator won\'t show you how much PMI really costs over the life of the loan.',
    ca: 'Our Canadian mortgage calculator includes CMHC mortgage insurance (required when down payment is under 20%), the OSFI stress test at qualifying rate, and bi-weekly payment options. See the true cost of your mortgage including all fees your bank might not advertise.',
    uk: 'Our UK mortgage calculator includes Stamp Duty Land Tax (SDLT) using April 2025 rates, LTV ratio, and FCA stress test rate. See the full cost of buying property in the UK, including the hidden upfront tax costs that catch many buyers by surprise.',
    au: 'Our Australian mortgage calculator includes Lenders Mortgage Insurance (LMI) when your LVR exceeds 80%, giving you the real picture of what homeownership costs — not just the repayment amount.',
    ie: 'Our Irish mortgage calculator uses 2026 ECB-influenced rates and shows your true monthly repayment. Compare with rent costs to make an informed decision about buying property in Ireland.',
    nz: 'Our New Zealand mortgage calculator helps you understand the full cost of home ownership in 2026. See how your interest rate, loan term, and deposit affect your weekly and fortnightly payments.',
  }

  const hiddenCostLabel = {
    us: result?.pmi > 0 ? `PMI adds ${fmtD(result.pmi)}/mo until LTV < 80%` : 'PMI applies if down payment < 20%',
    ca: 'CMHC premium adds to your mortgage balance',
    uk: result?.sdlt > 0 ? `SDLT: ${fmt(result.sdlt)} due at completion` : 'SDLT may apply based on purchase price',
    au: result?.lmi > 0 ? `LMI: ${fmt(result.lmi)} if LVR > 80%` : 'LMI applies if LVR > 80%',
    ie: 'Solicitor fees, valuation, and survey not included',
    nz: 'Legal fees and LIM report costs not included',
  }

  const faqs = {
    us: [
      { q: 'What is included in my monthly mortgage payment?', a: 'Your monthly payment (P&I) covers principal repayment and interest. You may also owe PMI (if LTV > 80%), property tax (~1.1%/yr), and homeowner\'s insurance (~$150/mo) — which this calculator also estimates.' },
      { q: 'How is PMI calculated?', a: 'PMI (Private Mortgage Insurance) applies when your down payment is less than 20%. It\'s typically 0.5%–1% of the loan amount annually. It automatically drops off once your LTV reaches 80%.' },
      { q: 'What is a good debt-to-income ratio for a mortgage?', a: 'Lenders typically want your housing costs (PITI) below 28% of gross income (front-end DTI), and total debts below 36%–43% (back-end DTI) depending on loan type.' },
    ],
    ca: [
      { q: 'What is the CMHC mortgage insurance?', a: 'CMHC insurance is mandatory when your down payment is between 5%–19.99% of the purchase price. The premium ranges from 2.8%–4% of the insured mortgage amount and is added to your balance.' },
      { q: 'What is the mortgage stress test in Canada?', a: 'The OSFI stress test requires you to qualify at the higher of your contract rate + 2%, or 5.25%. This ensures you can afford payments if rates rise.' },
      { q: 'What is the maximum amortization in Canada?', a: 'For insured mortgages (down payment < 20%), the maximum amortization is 25 years. For uninsured mortgages, lenders may offer up to 30 years.' },
    ],
    uk: [
      { q: 'What is Stamp Duty (SDLT)?', a: 'Stamp Duty Land Tax is a tax on property purchases in England and Northern Ireland. Rates start at 0% up to £250,000 and rise to 12% above £1.5M. First-time buyers get relief up to £425,000.' },
      { q: 'What is the LTV ratio?', a: 'Loan-to-Value (LTV) is your mortgage amount as a percentage of the property value. Most lenders require at least 5%-10% deposit (90-95% LTV max). Lower LTV = better interest rates.' },
      { q: 'What is the FCA stress test?', a: 'UK mortgage lenders must verify you can afford repayments if rates rise by 3%. This stress test rate is applied to ensure affordability under adverse conditions.' },
    ],
    au: [
      { q: 'What is LMI (Lenders Mortgage Insurance)?', a: 'LMI protects the lender if you default. It applies when your LVR exceeds 80% (deposit less than 20%). The cost is typically 1%–3% of the loan amount and can be added to your mortgage.' },
      { q: 'What is the serviceability buffer?', a: 'APRA requires lenders to assess loan serviceability at the higher of the interest rate + 3% buffer or a floor rate. This ensures you can afford repayments if rates rise.' },
      { q: 'What is the First Home Owner Grant (FHOG)?', a: 'FHOG is a government grant for eligible first-home buyers. The amount varies by state (typically $10,000–$30,000) and applies to new homes only.' },
    ],
    ie: [
      { q: 'What is the Central Bank lending limit in Ireland?', a: 'The Central Bank of Ireland limits mortgages to 3.5× your gross income for owner-occupier purchases, with a 20% deposit required (10% for first-time buyers on amounts up to €500,000).' },
      { q: 'What additional costs should I budget for?', a: 'Beyond the mortgage, budget for solicitor fees (€1,500–€2,500), valuation (€150–€300), survey (€400–€600), and stamp duty (1% on residential property).' },
      { q: 'What is the Mortgage to Rent scheme?', a: 'The MTR scheme allows homeowners in arrears to remain in their home as social housing tenants while the lender or a housing body takes ownership. It\'s a last-resort option for those in mortgage difficulty.' },
    ],
    nz: [
      { q: 'What is the LVR restriction in New Zealand?', a: 'RBNZ LVR restrictions limit high-LVR lending. Owner-occupiers need at least 20% deposit, investors need 35%. Some exceptions exist for new builds and first-home buyers.' },
      { q: 'What are typical mortgage rates in NZ in 2026?', a: 'Rates vary by term and lender. Fixed 1-year rates are typically 6.5%–7.5% in 2026, while floating rates may be higher. Shopping across lenders can save thousands.' },
      { q: 'What other costs are involved in buying a home in NZ?', a: 'Budget for legal fees ($1,500–$2,500), building inspection ($400–$800), LIM report ($200–$400), and potential KiwiSaver withdrawal for your deposit.' },
    ],
  }

  const TABS = [
    { key: 'summary',    label: 'Summary' },
    { key: 'chart',      label: 'Chart' },
    { key: 'schedule',   label: 'Schedule' },
    { key: 'specialist', label: 'Specialist', badge: true },
  ]

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`https://calqwise.com/${country}/mortgage`} />
        {country === 'ca' && <link rel="alternate" hreflang="fr-ca" href="https://calqwise.com/ca/mortgage" />}
        <link rel="alternate" hreflang="en" href={`https://calqwise.com/${country}/mortgage`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${c.name} Mortgage Calculator`,
          "applicationCategory": "FinanceApplication",
          "applicationSubCategory": "Financial Calculator",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": c.currency },
          "description": pageDesc,
          "url": `https://calqwise.com/${country}/mortgage`,
        })}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 text-slate-900 tracking-tight">
            {c.name} Mortgage Calculator
          </h1>
          <p className="text-slate-500 text-sm">Monthly payment · total interest · amortization — 2026 rates</p>
        </div>

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Property Details group */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">Property Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumericInput
                    label={`Home Price (${sym})`}
                    value={price}
                    onChange={setPrice}
                    min={50000}
                    max={2000000}
                    step={5000}
                    prefix={sym}
                    showSlider
                    hint="Median 2026: $420k US · CA$650k · £295k UK"
                  />
                  <NumericInput
                    label={`Down Payment — ${downPct}%`}
                    value={down}
                    onChange={setDown}
                    min={0}
                    max={Math.min(price, 500000)}
                    step={1000}
                    prefix={sym}
                    showSlider
                    hint="Min: 3.5% FHA · 5% conventional · 20% avoids PMI"
                  />
                </div>
              </div>

              {/* Financing group */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">Financing</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumericInput
                    label="Interest Rate (%)"
                    value={rate}
                    onChange={setRate}
                    min={2}
                    max={12}
                    step={0.05}
                    suffix="%"
                    showSlider
                    hint={rateHint}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Loan Term</label>
                    <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                      {termOptions.map(y => <option key={y} value={y}>{y} years</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Country notes inside input panel */}
              {country === 'ca' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  <strong>Stress test rate:</strong> {stressRate.toFixed(2)}% — lenders qualify you at the higher of (rate + 2%) or 5.25%
                </div>
              )}
              {country === 'uk' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  <strong>SDLT:</strong> Stamp Duty Land Tax is calculated using April 2025 residential rates
                </div>
              )}
              {country === 'us' && result && result.ltv > 80 && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <strong>PMI applies:</strong> LTV {result.ltv.toFixed(1)}% &gt; 80% — PMI ~0.5%/yr until LTV reaches 80%
                </div>
              )}
            </div>{/* /cw-inputs-panel */}

            {/* Optional Costs — inside inputs panel */}
            {optionDefs.length > 0 && (
              <div className="cw-card mt-4" style={{ background: '#F5F9FF', border: '1px solid #BFDBFE' }}>
            <button
              type="button"
              onClick={() => setOptOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">Optional Costs</span>
                {activeOptCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeOptCount} active · +{fmtD(totalOptMonthly)}/mo
                  </span>
                )}
              </div>
              {optOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {optOpen && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Monthly cost estimates</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {optionDefs.map(opt => {
                    const enabled = !!optEnabled[opt.key]
                    const val = optValues[opt.key] ?? opt.defaultVal
                    const isPct = opt.type === 'pct_loan' || opt.type === 'pct_value' || opt.type === 'cmhc'
                    return (
                      <div
                        key={opt.key}
                        className={`border rounded-xl p-3 transition-colors ${enabled ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{opt.hint}</p>
                          </div>
                          <Toggle on={enabled} onChange={v => toggleOpt(opt.key, v)} />
                        </div>
                        {enabled && (
                          <div className="mt-2">
                            <NumericInput
                              label=""
                              value={val}
                              onChange={v => setOptVal(opt.key, v)}
                              min={0}
                              max={isPct ? 20 : 50000}
                              step={isPct ? 0.05 : (opt.type === 'monthly' ? 25 : 50)}
                              {...(isPct ? { suffix: '%' } : { prefix: sym })}
                            />
                            {result && opt.type !== 'cmhc' && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">
                                ≈ {fmtD(optionMonthly(opt, val, result.principal, price))}/mo
                              </p>
                            )}
                            {opt.type === 'cmhc' && result && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">
                                One-time: {fmt(result.principal * val / 100)} added to loan
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            </div>
          )}
          </div>{/* /calc-inputs-panel */}

          {/* ── RIGHT: Results ── */}
          <div className="calc-results-panel">

        {/* Tab bar */}
        <div className="cw-tabs mb-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cw-tab${activeTab === tab.key ? ' active' : ''}`}
            >
              {tab.label}
              {tab.badge && <span style={{ marginLeft: 3, fontSize: '0.65rem' }}>★</span>}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {activeTab === 'summary' && result && (
          <>
            <ResultSimple
              metrics={[
                { label: 'Monthly Payment (P&I)', value: fmtD(result.monthly), highlight: true },
                { label: 'Total Interest', value: fmt(result.totalInterest) },
                { label: 'Total Cost', value: fmt(result.totalPaid) },
              ]}
            />
            <div className="mt-4">
              <ResultDetailed
                title="Full Breakdown"
                rows={[
                  { label: 'Purchase Price', value: fmt(price) },
                  { label: 'Down Payment', value: `${fmt(down)} (${downPct}%)` },
                  { label: 'Loan Amount', value: fmt(result.principal) },
                  { label: 'Monthly Payment (P&I)', value: fmtD(result.monthly), bold: true },
                  result.pmi > 0 && { label: 'PMI (monthly)', value: fmtD(result.pmi), sub: 'Removed when LTV < 80%' },
                  result.cmhc > 0 && { label: 'CMHC Premium', value: fmt(result.cmhc), sub: 'Added to mortgage balance' },
                  result.lmi > 0 && { label: 'LMI (est.)', value: fmt(result.lmi), sub: 'Lenders Mortgage Insurance' },
                  { label: 'LTV Ratio', value: `${result.ltv.toFixed(1)}%` },
                  { label: 'Total Interest', value: fmt(result.totalInterest) },
                  { label: 'Total of All Payments', value: fmt(result.totalPaid), bold: true },
                  result.sdlt > 0 && { label: 'Stamp Duty (SDLT)', value: fmt(result.sdlt), sub: 'April 2025 rates — paid upfront', bold: true },
                  totalOptMonthly > 0 && { label: 'Optional Costs (monthly)', value: fmtD(totalOptMonthly), sub: activeOptLabels.join(', ') },
                  totalOptMonthly > 0 && { label: 'True Monthly Cost (PITI)', value: fmtD(trueMonthly), bold: true, sub: 'P&I + all enabled optional costs' },
                ].filter(Boolean)}
              />
            </div>
            {/* True Monthly Cost card — shown when optional costs are active */}
            {totalOptMonthly > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="cw-metric green">
                  <p className="cw-metric-label">True Monthly Cost</p>
                  <p className="cw-metric-value">{fmtD(trueMonthly)}</p>
                  <p className="cw-metric-sub">P&amp;I + {activeOptCount} optional cost{activeOptCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="cw-card">
                  <p className="text-sm font-bold text-slate-700 mb-2">Cost Breakdown</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mortgage P&amp;I</span>
                      <span className="font-semibold">{fmtD(result.monthly)}</span>
                    </div>
                    {optionDefs.filter(o => optEnabled[o.key] && o.type !== 'cmhc').map(opt => {
                      const mo = activeOptMonthly[opt.key]
                      if (!mo) return null
                      return (
                        <div key={opt.key} className="flex justify-between text-blue-700">
                          <span>{opt.label}</span>
                          <span className="font-semibold">+{fmtD(mo)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t border-slate-100 pt-1.5 flex justify-between font-bold">
                      <span>Total / mo</span>
                      <span className="text-green-700">{fmtD(trueMonthly)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Chart tab */}
        {activeTab === 'chart' && result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Area Chart */}
            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">Principal vs Interest Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={amortData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `Y${v}`} />
                  <YAxis tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                    formatter={(val, name) => [fmt(val), name]}
                    labelFormatter={l => `Year ${l}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="principal" name="Cumulative Principal" stroke={COLORS.primary} fill="url(#gradPrincipal)" strokeWidth={2} />
                  <Area type="monotone" dataKey="interest" name="Cumulative Interest" stroke={COLORS.accent} fill="url(#gradInterest)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Pie Chart */}
            <div className="cw-card flex flex-col items-center">
              <h3 className="font-semibold mb-4 text-sm self-start">Total Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_LIST[i % PIE_COLORS_LIST.length]} />
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
          </div>
        )}

        {/* Schedule tab */}
        {activeTab === 'schedule' && result && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Amortization Schedule</h3>
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="text-left pb-2 pr-4">Month</th>
                  <th className="text-right pb-2 pr-4">Year</th>
                  <th className="text-right pb-2 pr-4">Principal</th>
                  <th className="text-right pb-2 pr-4">Interest</th>
                  <th className="text-right pb-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.filter((_, i) => i % 12 === 11 || i === 0).map((row) => (
                  <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-1.5 pr-4 text-slate-600">{row.month}</td>
                    <td className="text-right py-1.5 pr-4 text-slate-600">{Math.ceil(row.month / 12)}</td>
                    <td className="text-right py-1.5 pr-4 text-blue-700 font-medium">{fmtD(row.principal)}</td>
                    <td className="text-right py-1.5 pr-4 text-orange-600 font-medium">{fmtD(row.interest)}</td>
                    <td className="text-right py-1.5 font-semibold text-slate-800">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Specialist tab */}
        {activeTab === 'specialist' && result && (
          <CountryMortgageSpecialist
            country={country}
            price={price}
            down={down}
            rate={rate}
            term={term}
            c={c}
          />
        )}

        {!result && (
          <div className="cw-result-hero" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
            <p className="cw-result-hero-label">Monthly Payment</p>
            <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>Enter details →</p>
            <p className="cw-result-hero-sub">Fill in home price, down payment and rate to see your payment.</p>
          </div>
        )}

          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <CalcFAQ faqs={faqs[country] || faqs.us} />
        <CalcAlsoAvailable calcSlug="mortgage" calcLabel="Mortgage" countries={otherCountries} />
        <CalcRelated links={relatedLinks} />

        <AppDownloadBanner calcKey="mortgage" country={country} />
        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
