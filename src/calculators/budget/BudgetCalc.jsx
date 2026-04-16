import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'

// ---------------------------------------------------------------------------
// Country defaults (monthly amounts in local currency)
// ---------------------------------------------------------------------------
const BUDGET_DEFAULTS = {
  us: { takeHome: 5500, otherIncome: 0, rent: 1800, propTax: 0, homeIns: 0, utilities: 200, internet: 80, carPayment: 450, carIns: 150, gas: 150, parking: 30, groceries: 500, diningOut: 300, debtPayments: 0, savings: 500, emergency: 100, health: 400, subscriptions: 60, clothing: 100, entertainment: 150, other: 200 },
  ca: { takeHome: 5000, otherIncome: 0, rent: 2000, propTax: 0, homeIns: 0, utilities: 180, internet: 80, carPayment: 400, carIns: 180, gas: 150, parking: 50, groceries: 600, diningOut: 250, debtPayments: 0, savings: 500, emergency: 100, health: 150, subscriptions: 50, clothing: 100, entertainment: 120, other: 200 },
  uk: { takeHome: 3500, otherIncome: 0, rent: 1200, propTax: 0, homeIns: 0, utilities: 200, internet: 40, carPayment: 0, carIns: 100, gas: 80, parking: 40, groceries: 400, diningOut: 200, debtPayments: 0, savings: 400, emergency: 80, health: 0, subscriptions: 40, clothing: 80, entertainment: 100, other: 150 },
  au: { takeHome: 6000, otherIncome: 0, rent: 2200, propTax: 0, homeIns: 0, utilities: 250, internet: 80, carPayment: 400, carIns: 150, gas: 150, parking: 50, groceries: 700, diningOut: 350, debtPayments: 0, savings: 600, emergency: 100, health: 150, subscriptions: 60, clothing: 120, entertainment: 150, other: 200 },
  ie: { takeHome: 4000, otherIncome: 0, rent: 1800, propTax: 0, homeIns: 0, utilities: 200, internet: 50, carPayment: 300, carIns: 150, gas: 120, parking: 40, groceries: 500, diningOut: 250, debtPayments: 0, savings: 400, emergency: 80, health: 100, subscriptions: 50, clothing: 80, entertainment: 100, other: 150 },
  nz: { takeHome: 5000, otherIncome: 0, rent: 2000, propTax: 0, homeIns: 0, utilities: 220, internet: 70, carPayment: 350, carIns: 150, gas: 150, parking: 40, groceries: 600, diningOut: 300, debtPayments: 0, savings: 500, emergency: 80, health: 100, subscriptions: 50, clothing: 100, entertainment: 120, other: 200 },
}

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

const TABS = ['overview', 'chart', 'breakdown']

// ---------------------------------------------------------------------------
// Collapsible group component
// ---------------------------------------------------------------------------
function InputGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="cw-input-group">
      <button
        type="button"
        className="w-full flex items-center justify-between"
        onClick={() => setOpen(o => !o)}
      >
        <p className="cw-input-group-title" style={{ marginBottom: 0 }}>{title}</p>
        {open
          ? <ChevronUp size={16} className="text-slate-400 shrink-0" />
          : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 50/30/20 Bar component
// ---------------------------------------------------------------------------
function RuleBar({ label, pct, target, positiveCondition, color }) {
  const isOk = positiveCondition(pct)
  const barColor = isOk ? '#10b981' : color
  const cappedPct = Math.min(pct, 100)

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className={`text-xs font-bold ${isOk ? 'text-green-600' : 'text-red-500'}`}>
          {pct.toFixed(1)}% <span className="text-slate-400 font-normal">(target: {target})</span>
        </span>
      </div>
      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${cappedPct}%`, backgroundColor: barColor }}
        />
        {/* Target line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-400 opacity-50"
          style={{ left: `${Math.min(parseFloat(target), 100)}%` }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// A single input row
// ---------------------------------------------------------------------------
function BudgetRow({ label, value, onChange, min = 0, max = 20000, step = 50, sym }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <NumericInput
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        prefix={sym}
        showSlider
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function BudgetCalc({ country = 'us' }) {
  const c = countries[country] || countries.us
  const sym = c.symbol
  const d = BUDGET_DEFAULTS[country] || BUDGET_DEFAULTS.us

  // ── Income ──
  const [takeHome, setTakeHome]       = useState(d.takeHome)
  const [otherIncome, setOtherIncome] = useState(d.otherIncome)

  // ── Housing ──
  const [rent, setRent]         = useState(d.rent)
  const [propTax, setPropTax]   = useState(d.propTax)
  const [homeIns, setHomeIns]   = useState(d.homeIns)
  const [utilities, setUtil]    = useState(d.utilities)
  const [internet, setInternet] = useState(d.internet)

  // ── Transport ──
  const [carPayment, setCarPay]  = useState(d.carPayment)
  const [carIns, setCarIns]      = useState(d.carIns)
  const [gas, setGas]            = useState(d.gas)
  const [parking, setParking]    = useState(d.parking)

  // ── Food ──
  const [groceries, setGroceries] = useState(d.groceries)
  const [diningOut, setDiningOut] = useState(d.diningOut)

  // ── Finance ──
  const [debtPayments, setDebtPay]  = useState(d.debtPayments)
  const [savings, setSavings]        = useState(d.savings)
  const [emergency, setEmergency]    = useState(d.emergency)

  // ── Personal ──
  const [health, setHealth]           = useState(d.health)
  const [subscriptions, setSubs]      = useState(d.subscriptions)
  const [clothing, setClothing]       = useState(d.clothing)
  const [entertainment, setEntertain] = useState(d.entertainment)
  const [other, setOther]             = useState(d.other)

  const [view, setView] = useState('overview')

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const fmtPct = (n) => `${n.toFixed(1)}%`

  // ── Calculations ──
  const result = useMemo(() => {
    const totalIncome = takeHome + otherIncome
    if (totalIncome <= 0) return null

    const housingTotal   = rent + propTax + homeIns + utilities + internet
    const transportTotal = carPayment + carIns + gas + parking
    const foodTotal      = groceries + diningOut
    const financeTotal   = debtPayments + savings + emergency
    const personalTotal  = health + subscriptions + clothing + entertainment + other
    const totalExpenses  = housingTotal + transportTotal + foodTotal + financeTotal + personalTotal
    const surplus        = totalIncome - totalExpenses
    const savingsRate    = totalIncome > 0 ? ((savings + emergency) / totalIncome) * 100 : 0

    // 50/30/20 Rule
    const needs    = housingTotal + transportTotal + groceries + health + debtPayments
    const wants    = diningOut + subscriptions + clothing + entertainment + other
    const savingsT = savings + emergency
    const needsPct   = (needs    / totalIncome) * 100
    const wantsPct   = (wants    / totalIncome) * 100
    const savingsPct = (savingsT / totalIncome) * 100

    // Pie data
    const pieData = [
      { name: 'Housing',     value: housingTotal   },
      { name: 'Transport',   value: transportTotal },
      { name: 'Food',        value: foodTotal       },
      { name: 'Finance',     value: financeTotal    },
      { name: 'Personal',    value: personalTotal   },
    ].filter(p => p.value > 0)

    return {
      totalIncome, housingTotal, transportTotal, foodTotal, financeTotal, personalTotal,
      totalExpenses, surplus, savingsRate, needsPct, wantsPct, savingsPct, pieData,
    }
  }, [
    takeHome, otherIncome,
    rent, propTax, homeIns, utilities, internet,
    carPayment, carIns, gas, parking,
    groceries, diningOut,
    debtPayments, savings, emergency,
    health, subscriptions, clothing, entertainment, other,
  ])

  const isPositive = result && result.surplus >= 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Monthly Budget Calculator ${c.name}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Free monthly budget planner for ${c.name}. Track income vs expenses, see your savings rate, and check the 50/30/20 rule.`,
    url: `https://calqwise.com/${country}/budget`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <Helmet>
        <title>Monthly Budget Calculator {c.name} 2026 | CalcWise</title>
        <meta name="description" content={`Free monthly budget calculator for ${c.name}. See your surplus or deficit, check the 50/30/20 rule, and visualize where your money goes.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/budget`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Monthly Budget Calculator</h1>
          <p className="text-slate-500">Track your income vs expenses and see where your money goes.</p>
        </div>

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Income */}
              <InputGroup title="Income">
                <BudgetRow label={`Monthly Take-Home Pay (after tax) (${sym})`} value={takeHome} onChange={setTakeHome} min={0} max={50000} step={100} sym={sym} />
                <BudgetRow label={`Other Income — rental, freelance, etc. (${sym})`} value={otherIncome} onChange={setOtherIncome} min={0} max={20000} step={50} sym={sym} />
              </InputGroup>

              {/* Housing */}
              <InputGroup title="Housing">
                <BudgetRow label={`Rent / Mortgage Payment (${sym})`} value={rent} onChange={setRent} min={0} max={10000} step={50} sym={sym} />
                <BudgetRow label={`Property Tax — monthly (${sym})`} value={propTax} onChange={setPropTax} min={0} max={3000} step={25} sym={sym} />
                <BudgetRow label={`Home Insurance (${sym})`} value={homeIns} onChange={setHomeIns} min={0} max={2000} step={25} sym={sym} />
                <BudgetRow label={`Utilities — electricity, gas, water (${sym})`} value={utilities} onChange={setUtil} min={0} max={1000} step={10} sym={sym} />
                <BudgetRow label={`Internet & Phone (${sym})`} value={internet} onChange={setInternet} min={0} max={500} step={10} sym={sym} />
              </InputGroup>

              {/* Transportation */}
              <InputGroup title="Transportation">
                <BudgetRow label={`Car Payment (${sym})`} value={carPayment} onChange={setCarPay} min={0} max={2000} step={25} sym={sym} />
                <BudgetRow label={`Car Insurance (${sym})`} value={carIns} onChange={setCarIns} min={0} max={1000} step={10} sym={sym} />
                <BudgetRow label={`Gas / Petrol (${sym})`} value={gas} onChange={setGas} min={0} max={800} step={10} sym={sym} />
                <BudgetRow label={`Parking & Transit (${sym})`} value={parking} onChange={setParking} min={0} max={500} step={10} sym={sym} />
              </InputGroup>

              {/* Food */}
              <InputGroup title="Food">
                <BudgetRow label={`Groceries (${sym})`} value={groceries} onChange={setGroceries} min={0} max={3000} step={25} sym={sym} />
                <BudgetRow label={`Dining Out / Takeaway (${sym})`} value={diningOut} onChange={setDiningOut} min={0} max={2000} step={25} sym={sym} />
              </InputGroup>

              {/* Finance */}
              <InputGroup title="Finance & Savings">
                <BudgetRow label={`Debt Payments — loans, credit cards (${sym})`} value={debtPayments} onChange={setDebtPay} min={0} max={5000} step={25} sym={sym} />
                <BudgetRow label={`Savings / Investments (${sym})`} value={savings} onChange={setSavings} min={0} max={5000} step={50} sym={sym} />
                <BudgetRow label={`Emergency Fund Contribution (${sym})`} value={emergency} onChange={setEmergency} min={0} max={2000} step={25} sym={sym} />
              </InputGroup>

              {/* Personal */}
              <InputGroup title="Personal">
                <BudgetRow label={`Health Insurance / Medical (${sym})`} value={health} onChange={setHealth} min={0} max={2000} step={25} sym={sym} />
                <BudgetRow label={`Subscriptions — Netflix, gym, etc. (${sym})`} value={subscriptions} onChange={setSubs} min={0} max={500} step={5} sym={sym} />
                <BudgetRow label={`Clothing & Personal Care (${sym})`} value={clothing} onChange={setClothing} min={0} max={1000} step={25} sym={sym} />
                <BudgetRow label={`Entertainment & Hobbies (${sym})`} value={entertainment} onChange={setEntertain} min={0} max={2000} step={25} sym={sym} />
                <BudgetRow label={`Other Expenses (${sym})`} value={other} onChange={setOther} min={0} max={2000} step={25} sym={sym} />
              </InputGroup>

            </div>
          </div>

          {/* ── RIGHT: Results ── */}
          <div className="calc-results-panel">

            {/* Tabs */}
            <div className="cw-tabs mb-4">
              {TABS.map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`cw-tab${view === v ? ' active' : ''}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {!result && (
              <div className="cw-result-hero">
                <p className="cw-result-hero-label">Monthly Surplus</p>
                <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>Enter income →</p>
                <p className="cw-result-hero-sub">Add your income and expenses to see your budget.</p>
              </div>
            )}

            {/* Overview Tab */}
            {result && view === 'overview' && (
              <div className="space-y-4">
                {/* Hero — surplus or deficit */}
                <div
                  className="cw-result-hero"
                  style={isPositive
                    ? { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
                    : undefined}
                >
                  <p className="cw-result-hero-label">
                    Monthly {isPositive ? 'Surplus' : 'Deficit'}
                  </p>
                  <p className="cw-result-hero-value">
                    {isPositive ? '' : '−'}{fmt(Math.abs(result.surplus))}
                  </p>
                  <p className="cw-result-hero-sub">
                    {isPositive
                      ? `You have ${fmt(result.surplus)} left after all expenses`
                      : `You're spending ${fmt(Math.abs(result.surplus))} more than you earn`}
                  </p>
                  <hr className="cw-result-hero-divider" />
                  <div className="cw-result-hero-grid">
                    <div>
                      <p className="cw-result-hero-mini-label">Total Income</p>
                      <p className="cw-result-hero-mini-value">{fmt(result.totalIncome)}</p>
                    </div>
                    <div>
                      <p className="cw-result-hero-mini-label">Total Expenses</p>
                      <p className="cw-result-hero-mini-value">{fmt(result.totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="cw-result-hero-mini-label">Savings Rate</p>
                      <p className="cw-result-hero-mini-value">{fmtPct(result.savingsRate)}</p>
                    </div>
                  </div>
                </div>

                {/* 50/30/20 Rule */}
                <div className="cw-card">
                  <p className="cw-section-title">50/30/20 Rule Assessment</p>
                  <RuleBar
                    label="Needs (housing, transport, food, health)"
                    pct={result.needsPct}
                    target="≤50%"
                    positiveCondition={p => p <= 50}
                    color="#ef4444"
                  />
                  <RuleBar
                    label="Wants (dining, subscriptions, entertainment)"
                    pct={result.wantsPct}
                    target="≤30%"
                    positiveCondition={p => p <= 30}
                    color="#f59e0b"
                  />
                  <RuleBar
                    label="Savings & Emergency Fund"
                    pct={result.savingsPct}
                    target="≥20%"
                    positiveCondition={p => p >= 20}
                    color="#ef4444"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    The 50/30/20 rule: spend 50% on needs, 30% on wants, save 20%.
                  </p>
                </div>

                {/* Category breakdown metrics */}
                <div className="cw-metrics-grid">
                  <div className="cw-metric">
                    <p className="cw-metric-label">Housing</p>
                    <p className="cw-metric-value">{fmt(result.housingTotal)}</p>
                    <p className="cw-metric-sub">{fmtPct(result.totalIncome > 0 ? (result.housingTotal / result.totalIncome) * 100 : 0)} of income</p>
                  </div>
                  <div className="cw-metric">
                    <p className="cw-metric-label">Transport</p>
                    <p className="cw-metric-value">{fmt(result.transportTotal)}</p>
                    <p className="cw-metric-sub">{fmtPct(result.totalIncome > 0 ? (result.transportTotal / result.totalIncome) * 100 : 0)} of income</p>
                  </div>
                  <div className="cw-metric">
                    <p className="cw-metric-label">Food</p>
                    <p className="cw-metric-value">{fmt(result.foodTotal)}</p>
                    <p className="cw-metric-sub">{fmtPct(result.totalIncome > 0 ? (result.foodTotal / result.totalIncome) * 100 : 0)} of income</p>
                  </div>
                  <div className={`cw-metric ${result.savingsRate >= 20 ? 'green' : result.savingsRate >= 10 ? 'orange' : 'red'}`}>
                    <p className="cw-metric-label">Savings Rate</p>
                    <p className="cw-metric-value">{fmtPct(result.savingsRate)}</p>
                    <p className="cw-metric-sub">Target: 20%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Tab */}
            {result && view === 'chart' && (
              <div className="space-y-4">
                <div className="cw-card">
                  <p className="text-sm font-semibold text-slate-800 mb-4">Expense Breakdown</p>
                  {result.pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={result.pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {result.pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => [
                            new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(v),
                            'Amount',
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">No expenses entered yet.</p>
                  )}
                </div>

                {/* Income vs Expenses summary */}
                <div className="cw-card">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Income vs Expenses</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Total Income', value: result.totalIncome, color: '#10b981' },
                      { label: 'Total Expenses', value: result.totalExpenses, color: '#ef4444' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-semibold">{fmt(item.value)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((item.value / Math.max(result.totalIncome, result.totalExpenses)) * 100, 100)}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Breakdown Tab */}
            {result && view === 'breakdown' && (
              <div className="space-y-3">
                <ResultDetailed
                  title="Income"
                  rows={[
                    { label: 'Take-Home Pay', value: fmt(takeHome) },
                    { label: 'Other Income', value: fmt(otherIncome) },
                    { label: 'Total Income', value: fmt(result.totalIncome), bold: true, total: true },
                  ]}
                />
                <ResultDetailed
                  title="Housing"
                  rows={[
                    { label: 'Rent / Mortgage', value: fmt(rent) },
                    { label: 'Property Tax', value: fmt(propTax) },
                    { label: 'Home Insurance', value: fmt(homeIns) },
                    { label: 'Utilities', value: fmt(utilities) },
                    { label: 'Internet & Phone', value: fmt(internet) },
                    { label: 'Housing Subtotal', value: fmt(result.housingTotal), bold: true },
                  ]}
                />
                <ResultDetailed
                  title="Transportation"
                  rows={[
                    { label: 'Car Payment', value: fmt(carPayment) },
                    { label: 'Car Insurance', value: fmt(carIns) },
                    { label: 'Gas / Petrol', value: fmt(gas) },
                    { label: 'Parking & Transit', value: fmt(parking) },
                    { label: 'Transport Subtotal', value: fmt(result.transportTotal), bold: true },
                  ]}
                />
                <ResultDetailed
                  title="Food"
                  rows={[
                    { label: 'Groceries', value: fmt(groceries) },
                    { label: 'Dining Out / Takeaway', value: fmt(diningOut) },
                    { label: 'Food Subtotal', value: fmt(result.foodTotal), bold: true },
                  ]}
                />
                <ResultDetailed
                  title="Finance & Savings"
                  rows={[
                    { label: 'Debt Payments', value: fmt(debtPayments) },
                    { label: 'Savings / Investments', value: fmt(savings) },
                    { label: 'Emergency Fund', value: fmt(emergency) },
                    { label: 'Finance Subtotal', value: fmt(result.financeTotal), bold: true },
                  ]}
                />
                <ResultDetailed
                  title="Personal"
                  rows={[
                    { label: 'Health Insurance / Medical', value: fmt(health) },
                    { label: 'Subscriptions', value: fmt(subscriptions) },
                    { label: 'Clothing & Personal Care', value: fmt(clothing) },
                    { label: 'Entertainment & Hobbies', value: fmt(entertainment) },
                    { label: 'Other Expenses', value: fmt(other) },
                    { label: 'Personal Subtotal', value: fmt(result.personalTotal), bold: true },
                  ]}
                />
                <ResultDetailed
                  title="Budget Summary"
                  rows={[
                    { label: 'Total Income', value: fmt(result.totalIncome) },
                    { label: 'Total Expenses', value: fmt(result.totalExpenses) },
                    { label: isPositive ? 'Monthly Surplus' : 'Monthly Deficit', value: `${isPositive ? '' : '−'}${fmt(Math.abs(result.surplus))}`, bold: true, total: true },
                    { label: 'Savings Rate', value: fmtPct(result.savingsRate), bold: true },
                  ]}
                />
              </div>
            )}

            <AdSenseSlot format="rectangle" />
          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
