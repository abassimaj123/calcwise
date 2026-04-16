import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'
import { CalcFAQ, CalcRelated } from '../../components/CalcSEO'
import { Plus, Trash2 } from 'lucide-react'

const DEBTPAYOFF_FAQS = [
  { q: 'What is the difference between debt snowball and avalanche?', a: 'Snowball: pay off smallest balance first for quick psychological wins and momentum. Avalanche: pay off highest interest rate first to minimize total interest paid. Mathematically, avalanche saves more money. For motivation, snowball often works better.' },
  { q: 'How much does an extra payment save?', a: 'Even $100 extra per month dramatically reduces total interest. On a $10,000 debt at 18% APR, an extra $100/month cuts payoff time from 4+ years to under 2 years and saves over $2,000 in interest.' },
  { q: 'Should I pay off debt or invest?', a: 'If debt interest rate > expected investment return, pay debt first. High-interest debt (>7%) should generally be eliminated before investing beyond employer match. Low-interest debt (<4%) can coexist with long-term investing.' },
  { q: 'What is debt-to-income ratio?', a: 'DTI = total monthly debt payments ÷ gross monthly income × 100. Lenders prefer under 36% for mortgage approval. Above 43% limits your borrowing options. Paying down debt improves DTI and opens financial opportunities.' },
  { q: 'Which debts should I prioritize?', a: 'Priority order: (1) high-interest credit cards and payday loans; (2) personal loans; (3) car loans; (4) student loans; (5) mortgage. Always make minimum payments on all, then throw extra at the priority debt.' },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DEBT_NAMES = {
  us: ['Credit Card', 'Car Loan', 'Student Loan', 'Personal Loan', 'Medical Bill', 'Other'],
  ca: ['Credit Card', 'Car Loan', 'Student Loan', 'Personal Loan', 'Line of Credit', 'Other'],
  uk: ['Credit Card', 'Car Finance', 'Student Loan', 'Personal Loan', 'Overdraft', 'Other'],
  au: ['Credit Card', 'Car Loan', 'HECS/HELP', 'Personal Loan', 'Buy Now Pay Later', 'Other'],
  ie: ['Credit Card', 'Car Loan', 'Personal Loan', 'Credit Union Loan', 'Store Card', 'Other'],
  nz: ['Credit Card', 'Car Loan', 'Student Loan', 'Personal Loan', 'Hire Purchase', 'Other'],
}

const DEBT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316']

const TABS = ['summary', 'chart', 'schedule']

// ---------------------------------------------------------------------------
// Default debts per country
// ---------------------------------------------------------------------------
const defaultDebts = (country) => {
  const names = DEBT_NAMES[country] || DEBT_NAMES.us
  const defaults = {
    us: [
      { id: 1, name: names[0], balance: 5000, rate: 19.99, minPayment: 100 },
      { id: 2, name: names[1], balance: 12000, rate: 7.5, minPayment: 250 },
    ],
    ca: [
      { id: 1, name: names[0], balance: 4500, rate: 19.99, minPayment: 90 },
      { id: 2, name: names[1], balance: 10000, rate: 7.0, minPayment: 220 },
    ],
    uk: [
      { id: 1, name: names[0], balance: 3500, rate: 24.9, minPayment: 70 },
      { id: 2, name: names[1], balance: 8000, rate: 7.9, minPayment: 180 },
    ],
    au: [
      { id: 1, name: names[0], balance: 5500, rate: 19.99, minPayment: 110 },
      { id: 2, name: names[1], balance: 14000, rate: 8.5, minPayment: 290 },
    ],
    ie: [
      { id: 1, name: names[0], balance: 4000, rate: 22.9, minPayment: 80 },
      { id: 2, name: names[1], balance: 9000, rate: 7.5, minPayment: 200 },
    ],
    nz: [
      { id: 1, name: names[0], balance: 4500, rate: 20.95, minPayment: 90 },
      { id: 2, name: names[1], balance: 11000, rate: 8.0, minPayment: 230 },
    ],
  }
  return (defaults[country] || defaults.us).map(d => ({ ...d }))
}

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------
function calcDebtPayoff(debts, extraPayment, strategy) {
  const validDebts = debts.filter(d => d.balance > 0 && d.rate >= 0 && d.minPayment > 0)
  if (validDebts.length === 0) return null

  const sorted = [...validDebts].sort((a, b) =>
    strategy === 'avalanche' ? b.rate - a.rate : a.balance - b.balance
  )

  let balances = sorted.map(d => ({ ...d, balance: d.balance }))
  const totalMinPayment = validDebts.reduce((s, d) => s + d.minPayment, 0)
  const totalMonthlyPayment = totalMinPayment + extraPayment

  let months = 0
  let totalInterest = 0
  const schedule = []

  // Track payoff month per debt
  const payoffMonths = {}

  while (balances.some(d => d.balance > 0.01) && months < 600) {
    months++
    let remaining = extraPayment

    // Pay minimums on all active debts + accrue interest
    balances = balances.map(d => {
      if (d.balance <= 0.01) return { ...d, balance: 0 }
      const interest = d.balance * (d.rate / 100 / 12)
      totalInterest += interest
      const newBalance = d.balance + interest
      const minPay = Math.min(d.minPayment, newBalance)
      const afterMin = Math.max(0, newBalance - minPay)
      if (afterMin === 0 && !payoffMonths[d.id]) payoffMonths[d.id] = months
      return { ...d, balance: afterMin }
    })

    // Apply extra + freed-up minimums to focus debt (first with balance in sorted order)
    for (let i = 0; i < balances.length && remaining > 0; i++) {
      if (balances[i].balance > 0.01) {
        const pay = Math.min(remaining, balances[i].balance)
        balances[i] = { ...balances[i], balance: balances[i].balance - pay }
        remaining -= pay
        if (balances[i].balance < 0.01) {
          balances[i] = { ...balances[i], balance: 0 }
          if (!payoffMonths[balances[i].id]) payoffMonths[balances[i].id] = months
        }
      }
    }

    if (months <= 60) {
      const entry = { month: months }
      sorted.forEach(d => {
        const b = balances.find(b => b.id === d.id)
        entry[d.name] = b ? Math.max(0, Math.round(b.balance)) : 0
      })
      schedule.push(entry)
    }
  }

  // Record any still-unpaid debts
  balances.forEach(d => {
    if (!payoffMonths[d.id]) payoffMonths[d.id] = months
  })

  // Minimum-only simulation for comparison
  let minMonths = 0
  let minInterest = 0
  let minBalances = validDebts.map(d => ({ ...d }))
  while (minBalances.some(d => d.balance > 0.01) && minMonths < 600) {
    minMonths++
    minBalances = minBalances.map(d => {
      if (d.balance <= 0.01) return { ...d, balance: 0 }
      const interest = d.balance * (d.rate / 100 / 12)
      minInterest += interest
      const newBalance = d.balance + interest
      return { ...d, balance: Math.max(0, newBalance - d.minPayment) }
    })
  }

  const totalDebt = validDebts.reduce((s, d) => s + d.balance, 0)

  return {
    months,
    totalInterest,
    schedule,
    sorted,
    payoffMonths,
    minMonths,
    minInterest,
    monthsSaved: minMonths - months,
    interestSaved: minInterest - totalInterest,
    totalDebt,
    totalMonthlyPayment,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DebtPayoffCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country] || countries.us
  const names = DEBT_NAMES[country] || DEBT_NAMES.us

  const [debts, setDebts] = useState(() => defaultDebts(country))
  const [extraPayment, setExtraPayment] = useState(200)
  const [strategy, setStrategy] = useState('avalanche')
  const [view, setView] = useState('summary')
  const [nextId, setNextId] = useState(3)

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const months2str = (m) => {
    if (!m || m <= 0) return '0m'
    const y = Math.floor(m / 12)
    const mo = m % 12
    if (y === 0) return `${mo}m`
    if (mo === 0) return `${y}y`
    return `${y}y ${mo}m`
  }

  // Debt row handlers
  const updateDebt = (id, field, val) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))
  }
  const removeDebt = (id) => setDebts(prev => prev.filter(d => d.id !== id))
  const addDebt = () => {
    if (debts.length >= 6) return
    setDebts(prev => [...prev, {
      id: nextId,
      name: names[prev.length] || 'Other',
      balance: 3000,
      rate: 15,
      minPayment: 75,
    }])
    setNextId(n => n + 1)
  }

  const result = useMemo(
    () => calcDebtPayoff(debts, extraPayment, strategy),
    [debts, extraPayment, strategy]
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Debt Payoff Calculator ${c.name} — Snowball vs Avalanche`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Compare debt snowball vs avalanche payoff strategies in ${c.name}. See exactly when you'll be debt-free and how much interest you'll save.`,
    url: `https://calqwise.com/${country}/debt-payoff`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <Helmet>
        <title>Debt Payoff Calculator {c.name} 2026 — Snowball vs Avalanche | CalcWise</title>
        <meta name="description" content={`Free debt payoff calculator for ${c.name}. Compare the Snowball and Avalanche methods to pay off credit cards, loans and more. See your debt-free date and interest savings.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/debt-payoff`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{t('debtpayoff.title')}</h1>
          <p className="text-slate-500">{t('debtpayoff.desc')}</p>
        </div>

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Strategy selector */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('debtpayoff.strategy')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'avalanche', label: t('debtpayoff.avalanche'), desc: t('debtpayoff.avalancheDesc'), icon: '⚡' },
                    { key: 'snowball', label: t('debtpayoff.snowball'), desc: t('debtpayoff.snowballDesc'), icon: '❄️' },
                  ].map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStrategy(s.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        strategy === s.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-800">{s.icon} {s.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Debt list */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('debtpayoff.debtName')}</p>
                <div className="space-y-4">
                  {debts.map((debt, idx) => (
                    <div key={debt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full mr-2 shrink-0"
                          style={{ backgroundColor: DEBT_COLORS[idx % DEBT_COLORS.length] }}
                        />
                        <input
                          type="text"
                          value={debt.name}
                          onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                          className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-none outline-none"
                          maxLength={30}
                        />
                        {debts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDebt(debt.id)}
                            className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label={t('debtpayoff.removeDebt')}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">{t('debtpayoff.balance')} ({c.symbol})</label>
                          <NumericInput
                            value={debt.balance}
                            onChange={v => updateDebt(debt.id, 'balance', v)}
                            min={0}
                            max={500000}
                            step={100}
                            prefix={c.symbol}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">{t('debtpayoff.interestRate')}</label>
                          <NumericInput
                            value={debt.rate}
                            onChange={v => updateDebt(debt.id, 'rate', v)}
                            min={0}
                            max={60}
                            step={0.1}
                            suffix="%"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1">{t('debtpayoff.minPayment')} ({c.symbol})</label>
                          <NumericInput
                            value={debt.minPayment}
                            onChange={v => updateDebt(debt.id, 'minPayment', v)}
                            min={0}
                            max={10000}
                            step={10}
                            prefix={c.symbol}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {debts.length < 6 && (
                  <button
                    type="button"
                    onClick={addDebt}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={16} /> {t('debtpayoff.addDebt')} ({debts.length}/6)
                  </button>
                )}
              </div>

              {/* Extra payment */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('debtpayoff.extraPayment')}</p>
                <NumericInput
                  label={`${t('debtpayoff.extraPayment')} (${c.symbol}/month)`}
                  value={extraPayment}
                  onChange={setExtraPayment}
                  min={0}
                  max={10000}
                  step={50}
                  prefix={c.symbol}
                  showSlider
                  hint="Amount beyond your minimum payments to accelerate payoff"
                />
              </div>

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
                  {t(`calc.${v}`)}
                </button>
              ))}
            </div>

            {!result && (
              <div className="cw-result-hero">
                <p className="cw-result-hero-label">{t('debtpayoff.payoffDate')}</p>
                <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>{t('calc.enterValid')}</p>
                <p className="cw-result-hero-sub">{t('calc.enterValid')}</p>
              </div>
            )}

            {/* Summary Tab */}
            {result && view === 'summary' && (
              <div className="space-y-4">
                <ResultSimple
                  metrics={[
                    { label: t('debtpayoff.payoffDate'), value: months2str(result.months), highlight: true },
                    { label: t('debtpayoff.totalInterest'), value: fmt(result.totalInterest) },
                    { label: t('debtpayoff.timeSaved'), value: `${result.monthsSaved}m` },
                    { label: t('debtpayoff.interestSaved'), value: fmt(result.interestSaved) },
                  ]}
                />

                {result.interestSaved > 0 && (
                  <div className="cw-metric green">
                    <p className="cw-metric-label">{t('debtpayoff.interestSaved')}</p>
                    <p className="cw-metric-value">{fmt(result.interestSaved)}</p>
                    <p className="cw-metric-sub">Pay off {months2str(result.monthsSaved)} sooner with {fmt(extraPayment)}/mo extra</p>
                  </div>
                )}

                {/* Payoff order */}
                <div className="cw-card">
                  <p className="cw-section-title">
                    {strategy === 'avalanche' ? '⚡ Avalanche' : '❄️ Snowball'} Payoff Order
                  </p>
                  <div className="space-y-2">
                    {result.sorted.map((debt, idx) => (
                      <div key={debt.id} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: DEBT_COLORS[idx % DEBT_COLORS.length] }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{debt.name}</p>
                          <p className="text-xs text-slate-500">
                            {fmt(debt.balance)} @ {debt.rate}%
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-slate-700">
                            {months2str(result.payoffMonths[debt.id] || 0)}
                          </p>
                          <p className="text-[10px] text-slate-400">payoff</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <ResultDetailed
                  title={t('calc.summary')}
                  rows={[
                    { label: t('debtpayoff.balance'), value: fmt(result.totalDebt) },
                    { label: t('calc.monthlyPayment'), value: fmt(result.totalMonthlyPayment) },
                    { label: t('debtpayoff.minPayment'), value: months2str(result.minMonths) },
                    { label: t('debtpayoff.strategy'), value: months2str(result.months), bold: true },
                    { label: t('debtpayoff.totalInterest'), value: fmt(result.minInterest) },
                    { label: t('calc.totalInterest'), value: fmt(result.totalInterest) },
                    { label: t('debtpayoff.interestSaved'), value: fmt(result.interestSaved), bold: true },
                    { label: t('debtpayoff.timeSaved'), value: months2str(result.monthsSaved), bold: true },
                  ]}
                />
              </div>
            )}

            {/* Chart Tab */}
            {result && view === 'chart' && (
              <div className="cw-card">
                <p className="text-sm font-semibold text-slate-800 mb-1">Balance by Month</p>
                <p className="text-xs text-slate-500 mb-4">First 60 months shown (stacked bars = each debt)</p>
                {result.schedule.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={result.schedule} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Month', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
                      />
                      <YAxis
                        tickFormatter={v => `${c.symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                        tick={{ fontSize: 10 }}
                        width={55}
                      />
                      <Tooltip
                        formatter={(v, name) => [
                          new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(v),
                          name,
                        ]}
                        labelFormatter={l => `Month ${l}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {result.sorted.map((debt, idx) => (
                        <Bar
                          key={debt.id}
                          dataKey={debt.name}
                          stackId="a"
                          fill={DEBT_COLORS[idx % DEBT_COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">No chart data available.</p>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {result && view === 'schedule' && (
              <div className="cw-card overflow-x-auto">
                <p className="text-sm font-semibold text-slate-800 mb-4">{t('debtpayoff.payoffSchedule')}</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-3 text-slate-500 font-medium">Mo.</th>
                      {result.sorted.map(d => (
                        <th key={d.id} className="text-right py-2 pr-2 text-slate-500 font-medium truncate max-w-[80px]">
                          {d.name}
                        </th>
                      ))}
                      <th className="text-right py-2 text-slate-500 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => {
                      const total = result.sorted.reduce((s, d) => s + (row[d.name] || 0), 0)
                      return (
                        <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-1.5 pr-3 font-medium">{row.month}</td>
                          {result.sorted.map(d => (
                            <td key={d.id} className="py-1.5 pr-2 text-right">
                              {row[d.name] === 0
                                ? <span className="text-green-600 font-semibold">✓</span>
                                : fmt(row[d.name])}
                            </td>
                          ))}
                          <td className="py-1.5 text-right font-semibold">{fmt(total)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <AdSenseSlot format="rectangle" />
          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <CalcFAQ faqs={DEBTPAYOFF_FAQS} />
        <CalcRelated links={[
          { to: `/${country}/budget`,     label: 'Budget Planner' },
          { to: `/${country}/net-worth`,  label: 'Net Worth Calculator' },
          { to: `/${country}/credit-card`, label: 'Credit Card Payoff' },
          { to: `/${country}/loan-payoff`, label: 'Loan Payoff Calculator' },
        ]} />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
