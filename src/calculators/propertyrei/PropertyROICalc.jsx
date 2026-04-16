import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

// ---------------------------------------------------------------------------
// Country-specific additional expense definitions
// ---------------------------------------------------------------------------
const EXTRA_EXPENSES = {
  us: [
    { key: 'propmgmt',  label: 'Property Management',    hint: '8-12% of monthly rent · if using an agent',  type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'hoa',       label: 'HOA Fees',               hint: 'Monthly HOA/condo fees',                     type: 'monthly',  defaultVal: 0,    step: 50  },
    { key: 'capex',     label: 'CapEx Reserve',          hint: 'Capital expenditure reserve · typical 5-10%', type: 'pct_rent', defaultVal: 5,    step: 0.5 },
    { key: 'util',      label: 'Utilities (landlord)',   hint: 'If landlord pays water, heat etc.',           type: 'monthly',  defaultVal: 0,    step: 25  },
    { key: 'landlord',  label: 'Landlord Insurance',     hint: 'Annual premium · ~$1,200-2,000',             type: 'annual',   defaultVal: 1500, step: 100 },
  ],
  ca: [
    { key: 'propmgmt',  label: 'Gestion locative',       hint: '8-12% du loyer mensuel',                     type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'condo',     label: 'Frais de condo',         hint: 'Frais mensuels strata/condo',                type: 'monthly',  defaultVal: 0,    step: 50  },
    { key: 'capex',     label: 'Réserve CapEx',          hint: 'Réserve pour rénovations majeures · 5-10%',  type: 'pct_rent', defaultVal: 5,    step: 0.5 },
    { key: 'util',      label: 'Services publics',       hint: 'Si propriétaire paie eau/chauffage',         type: 'monthly',  defaultVal: 0,    step: 25  },
    { key: 'landlord',  label: 'Assurance propriétaire', hint: 'Prime annuelle · CA$1,500-2,500',            type: 'annual',   defaultVal: 2000, step: 100 },
  ],
  uk: [
    { key: 'propmgmt',  label: 'Letting Agent Fees',     hint: '10-15% of monthly rent',                     type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'service',   label: 'Service Charge',         hint: 'Annual leasehold service charge',            type: 'annual',   defaultVal: 0,    step: 100 },
    { key: 'capex',     label: 'Maintenance Reserve',    hint: 'Typical 5-10% of rent',                      type: 'pct_rent', defaultVal: 5,    step: 0.5 },
    { key: 'insurance', label: 'Landlord Insurance',     hint: 'Annual buy-to-let insurance',                type: 'annual',   defaultVal: 500,  step: 50  },
  ],
  au: [
    { key: 'propmgmt',  label: 'Property Management',   hint: '7-10% of weekly rent',                       type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'strata',    label: 'Strata Fees',            hint: 'Annual strata (units/apts)',                 type: 'annual',   defaultVal: 0,    step: 100 },
    { key: 'capex',     label: 'Maintenance Reserve',   hint: 'Typical 5-10% of rent',                      type: 'pct_rent', defaultVal: 5,    step: 0.5 },
    { key: 'insurance', label: 'Landlord Insurance',    hint: 'Annual landlord policy',                     type: 'annual',   defaultVal: 2000, step: 100 },
  ],
  ie: [
    { key: 'propmgmt',  label: 'Property Management',   hint: '8-12% of monthly rent',                      type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'capex',     label: 'Maintenance Reserve',   hint: '5-10% of monthly rent',                      type: 'pct_rent', defaultVal: 5,    step: 0.5 },
    { key: 'insurance', label: 'Landlord Insurance',    hint: 'Annual premium',                             type: 'annual',   defaultVal: 800,  step: 50  },
  ],
  nz: [
    { key: 'propmgmt',  label: 'Property Management',   hint: '8-10% of weekly rent',                       type: 'pct_rent', defaultVal: 0,    step: 0.5 },
    { key: 'rates',     label: 'Council Rates',         hint: 'Annual local rates',                         type: 'annual',   defaultVal: 2500, step: 100 },
    { key: 'insurance', label: 'Landlord Insurance',    hint: 'Annual premium',                             type: 'annual',   defaultVal: 2000, step: 100 },
  ],
}

// Compute monthly cost for a single extra expense entry
function extraMonthly(def, val, monthlyRent) {
  if (def.type === 'pct_rent') return monthlyRent * val / 100
  if (def.type === 'annual')   return val / 12
  return val // monthly
}

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------
function calcPropertyROI({ purchasePrice, downPayment, monthlyRent, expensePct, managementPct, vacancyRate, mortgageRate, extraMonthlyTotal }) {
  if (purchasePrice <= 0 || monthlyRent <= 0) return null

  const loanAmount = purchasePrice - downPayment
  const monthlyRate = mortgageRate / 100 / 12
  const n = 30 * 12
  const mortgagePayment = loanAmount > 0 && mortgageRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : 0

  const effectiveRent = monthlyRent * (1 - vacancyRate / 100)
  const annualRent = effectiveRent * 12
  const annualExpenses = annualRent * (expensePct / 100)
  const managementCost = annualRent * (managementPct / 100)
  const annualMortgage = mortgagePayment * 12
  const annualExtra = extraMonthlyTotal * 12
  const noi = annualRent - annualExpenses - managementCost - annualExtra
  const annualCashFlow = noi - annualMortgage
  const monthlyCashFlow = annualCashFlow / 12
  const capRate = (noi / purchasePrice) * 100
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0
  const grossYield = (monthlyRent * 12 / purchasePrice) * 100

  const taxesPct = 0.35
  const insurancePct = 0.20
  const maintenancePct = 0.30
  const annualVacancyCost = monthlyRent * 12 * (vacancyRate / 100)

  return {
    mortgagePayment, effectiveRent, annualRent, annualExpenses, managementCost,
    noi, annualCashFlow, monthlyCashFlow, capRate, cashOnCash, grossYield,
    annualMortgage, annualExtra,
    expenseBreakdown: {
      mortgage: annualMortgage,
      taxes: annualExpenses * taxesPct,
      insurance: annualExpenses * insurancePct,
      maintenance: annualExpenses * maintenancePct,
      vacancy: annualVacancyCost,
    },
  }
}

// ---------------------------------------------------------------------------
// Toggle switch (same pattern as SalaryCalc)
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

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e']

const defaultsByCountry = {
  us: { price: 350000, downPct: 25, rent: 2200, rate: 7.0 },
  ca: { price: 600000, downPct: 25, rent: 2500, rate: 6.5 },
  uk: { price: 285000, downPct: 25, rent: 1400, rate: 5.5 },
  au: { price: 650000, downPct: 20, rent: 2500, rate: 6.5 },
  ie: { price: 350000, downPct: 20, rent: 1800, rate: 5.0 },
  nz: { price: 650000, downPct: 20, rent: 2800, rate: 7.0 },
}

const jsonLd = (country) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Property ROI Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `Calculate rental property ROI, cash-on-cash return, cap rate, and monthly cash flow in ${country.toUpperCase()}.`,
})

export default function PropertyROICalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us
  const extraDefs = EXTRA_EXPENSES[country] || []

  const [price, setPrice] = useState(d.price)
  const [down, setDown] = useState(Math.round(d.price * d.downPct / 100))
  const [rent, setRent] = useState(d.rent)
  const [expenses, setExpenses] = useState(30)
  const [management, setManagement] = useState(10)
  const [vacancy, setVacancy] = useState(5)
  const [mortgageRate, setMortgageRate] = useState(d.rate)
  const [view, setView] = useState('summary')

  // Additional expenses collapsible state
  const [extraOpen, setExtraOpen] = useState(true)
  const [extraEnabled, setExtraEnabled] = useState({})
  const [extraAmounts, setExtraAmounts] = useState(
    Object.fromEntries(extraDefs.map(def => [def.key, def.defaultVal]))
  )

  const toggleExtra = (key, val) => setExtraEnabled(prev => ({ ...prev, [key]: val }))
  const setExtraAmt  = (key, val) => setExtraAmounts(prev => ({ ...prev, [key]: val }))

  // Total extra monthly cost (only enabled items)
  const extraMonthlyTotal = useMemo(() =>
    extraDefs
      .filter(def => extraEnabled[def.key])
      .reduce((sum, def) => sum + extraMonthly(def, extraAmounts[def.key] ?? def.defaultVal, rent), 0),
    [extraDefs, extraEnabled, extraAmounts, rent]
  )

  const activeExtraCount = extraDefs.filter(def => extraEnabled[def.key]).length

  const result = useMemo(
    () => calcPropertyROI({ purchasePrice: price, downPayment: down, monthlyRent: rent, expensePct: expenses, managementPct: management, vacancyRate: vacancy, mortgageRate, extraMonthlyTotal }),
    [price, down, rent, expenses, management, vacancy, mortgageRate, extraMonthlyTotal]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const pct = (n) => `${n.toFixed(2)}%`

  // Chart data
  const incomeExpenseData = result ? [
    { name: 'Annual', Income: Math.round(result.annualRent), Expenses: Math.round(result.annualExpenses + result.managementCost + result.annualMortgage + result.annualExtra) },
  ] : []

  const pieData = result ? [
    { name: 'Mortgage', value: Math.round(result.expenseBreakdown.mortgage) },
    { name: 'Taxes', value: Math.round(result.expenseBreakdown.taxes) },
    { name: 'Insurance', value: Math.round(result.expenseBreakdown.insurance) },
    { name: 'Maintenance', value: Math.round(result.expenseBreakdown.maintenance) },
    { name: 'Vacancy', value: Math.round(result.expenseBreakdown.vacancy) },
  ] : []

  const appreciationData = result
    ? Array.from({ length: 11 }, (_, i) => ({
        year: `Year ${i}`,
        Value: Math.round(price * Math.pow(1.035, i)),
      }))
    : []

  return (
    <>
      <Helmet>
        <title>Property ROI Calculator {c.name} 2026 — Cash Flow &amp; Cap Rate | CalcWise</title>
        <meta name="description" content={`Calculate rental property ROI, cash-on-cash return, cap rate, and monthly cash flow in ${c.name}. Free investment property calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/property-roi`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd(country))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Property ROI Calculator</h1>
          <p className="text-slate-500">Calculate cash flow, cap rate, and return on your rental property.</p>
        </div>

        <CalcIntro intro="The property ROI calculator measures the return on investment of a rental property. Enter purchase price, rent, expenses and financing to see cap rate, cash-on-cash return, and total ROI including appreciation." hiddenCost="Vacancy costs reduce ROI by 8-10% annually" />

        {/* Main inputs */}
        <div className="cw-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Purchase Price ({c.symbol})</label>
              <NumericInput value={price} onChange={setPrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Down Payment ({c.symbol})</label>
              <NumericInput value={down} onChange={setDown} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Monthly Rent ({c.symbol})</label>
              <NumericInput value={rent} onChange={setRent} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mortgage Rate (%)</label>
              <NumericInput value={mortgageRate} onChange={setMortgageRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Operating Expenses (% of rent)</label>
              <NumericInput value={expenses} onChange={setExpenses} min={0} max={100} step={1} suffix="%" />
              <p className="text-xs text-slate-500 mt-1">Taxes, insurance, maintenance</p>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Property Mgmt (% of rent)</label>
              <NumericInput value={management} onChange={setManagement} min={0} max={100} step={1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Vacancy Rate (%)</label>
              <NumericInput value={vacancy} onChange={setVacancy} min={0} max={100} step={1} suffix="%" />
            </div>
          </div>
        </div>

        {/* Additional Expenses collapsible */}
        {extraDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setExtraOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">Additional Expenses</span>
                {activeExtraCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeExtraCount} active · -{fmtD(extraMonthlyTotal)}/mo
                  </span>
                )}
              </div>
              {extraOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {extraOpen && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-3">Property-specific costs</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extraDefs.map(def => {
                    const enabled = !!extraEnabled[def.key]
                    const val = extraAmounts[def.key] ?? def.defaultVal
                    const monthly = extraMonthly(def, val, rent)
                    return (
                      <div
                        key={def.key}
                        className={`border rounded-xl p-3 transition-colors ${enabled ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{def.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{def.hint}</p>
                          </div>
                          <Toggle on={enabled} onChange={v => toggleExtra(def.key, v)} />
                        </div>
                        {enabled && (
                          <div className="mt-2">
                            <NumericInput
                              label=""
                              value={val}
                              onChange={v => setExtraAmt(def.key, v)}
                              min={0}
                              step={def.step}
                              suffix={def.type === 'pct_rent' ? '%' : undefined}
                              prefix={def.type !== 'pct_rent' ? c.symbol : undefined}
                            />
                            {def.type !== 'monthly' && (
                              <p className="text-xs text-slate-500 mt-1">
                                {fmtD(monthly)}/mo
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

        {/* View tabs */}
        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}>
              {v}
            </button>
          ))}
        </div>

        {result && view === 'summary' && (
          <ResultSimple
            metrics={[
              {
                label: 'Monthly Cash Flow',
                value: fmtD(result.monthlyCashFlow),
                highlight: true,
                sub: result.monthlyCashFlow >= 0 ? '✓ Positive' : '⚠ Negative',
              },
              { label: 'Cash-on-Cash Return', value: pct(result.cashOnCash) },
              { label: 'Cap Rate', value: pct(result.capRate) },
            ]}
          />
        )}

        {result && view === 'chart' && (
          <div className="space-y-8">
            {/* Income vs Expenses Bar Chart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Annual Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={incomeExpenseData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown Pie */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Appreciation Area Chart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Property Value Appreciation (3.5%/yr)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={appreciationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="Value" stroke="#6366f1" strokeWidth={2} fill="url(#roiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Investment Analysis"
            rows={[
              { label: 'Monthly Rent', value: fmtD(rent) },
              { label: 'Effective Rent (after vacancy)', value: fmtD(result.effectiveRent) },
              { label: 'Annual Gross Rent', value: fmt(result.annualRent) },
              { label: 'Operating Expenses', value: `-${fmt(result.annualExpenses)}` },
              { label: 'Management Cost', value: `-${fmt(result.managementCost)}` },
              ...(result.annualExtra > 0 ? [{ label: 'Additional Expenses', value: `-${fmt(result.annualExtra)}` }] : []),
              { label: 'Net Operating Income (NOI)', value: fmt(result.noi), bold: true },
              { label: 'Annual Mortgage', value: `-${fmt(result.annualMortgage)}` },
              { label: 'Annual Cash Flow', value: fmt(result.annualCashFlow), bold: true },
              { label: 'Monthly Cash Flow', value: fmtD(result.monthlyCashFlow), bold: true },
              { label: 'Gross Yield', value: pct(result.grossYield) },
              { label: 'Cap Rate', value: pct(result.capRate) },
              { label: 'Cash-on-Cash Return', value: pct(result.cashOnCash), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            Enter your property details above.
          </div>
        )}

        <AdSenseSlot format="rectangle" />

        <CalcFAQ faqs={[
          { q: 'What is a good cap rate?', a: 'Cap rate (NOI ÷ property value) of 5-10% is generally good. Lower cap rates (3-4%) are common in expensive cities but indicate lower cash flow relative to price.' },
          { q: 'What is cash-on-cash return?', a: 'Annual cash flow ÷ cash invested. Unlike cap rate, it accounts for financing. A 6-10% cash-on-cash return is considered solid for rental properties.' },
          { q: 'Should I include property appreciation?', a: 'Yes, but conservatively. Historical appreciation averages 3-4% annually but varies hugely by location. Dont count on appreciation — buy for cash flow.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/rent-vs-buy`, label: 'Rent vs Buy' },
          { to: `/${country}/affordability`, label: 'Affordability' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
