import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'
import { countries } from '../../config/countries'

// ---------------------------------------------------------------------------
// Country-specific repayment options
// ---------------------------------------------------------------------------
const REPAYMENT_OPTIONS = {
  us: [
    { key: 'extra', label: 'Extra Monthly Payment',  hint: 'Applied directly to principal',                   type: 'amount', step: 25 },
    { key: 'pslf',  label: 'PSLF Track',             hint: 'Public Service: forgiveness after 120 payments',  type: 'toggle' },
    { key: 'save',  label: 'SAVE Plan',              hint: 'Income-based: 5% of discretionary income',        type: 'toggle' },
  ],
  ca: [
    { key: 'extra', label: 'Paiement supplémentaire', hint: 'Appliqué directement au capital',                type: 'amount', step: 25 },
    { key: 'ril',   label: 'RAD (Remboursement aid rev.)', hint: 'Paiements basés sur revenu',               type: 'toggle' },
  ],
  uk: [
    { key: 'extra', label: 'Extra Monthly Payment',  hint: 'Applied to principal',                            type: 'amount', step: 25 },
    { key: 'plan',  label: 'Plan 1 vs Plan 2',       hint: 'Plan 2 threshold: £27,295 · 9% above',           type: 'toggle' },
  ],
  au: [
    { key: 'extra', label: 'Extra Voluntary Payment', hint: 'Applied to principal',                           type: 'amount', step: 25 },
  ],
  ie: [
    { key: 'extra', label: 'Extra Monthly Payment',  hint: 'Applied to principal',                            type: 'amount', step: 25 },
  ],
  nz: [
    { key: 'extra', label: 'Extra Weekly Payment',   hint: 'Applied directly to balance',                     type: 'amount', step: 10 },
  ],
}

// Info text shown when a toggle plan is enabled
const PLAN_INFO = {
  pslf: {
    title: 'Public Service Loan Forgiveness (PSLF)',
    body: 'Work full-time for a qualifying employer (government, non-profit) and make 120 qualifying payments under an IDR plan. Remaining balance is forgiven tax-free. Use the PSLF Help Tool at StudentAid.gov to verify employer eligibility.',
  },
  save: {
    title: 'SAVE Plan (Saving on a Valuable Education)',
    body: 'Payments are capped at 5% of discretionary income (undergraduate loans) with an expanded poverty line exclusion. Unpaid interest does not capitalize. Note: SAVE plan benefits are subject to ongoing legal proceedings — check StudentAid.gov for current status.',
  },
  ril: {
    title: 'Remboursement en fonction du revenu (RAD)',
    body: "Le RAD plafonne les paiements mensuels à un pourcentage du revenu net. Disponible si vous avez du mal à effectuer vos paiements réguliers. Contactez le NSLSC pour les conditions d'admissibilité.",
  },
  plan: {
    title: 'Plan 1 vs Plan 2 — UK Student Loans',
    body: 'Plan 1 (pre-2012): repay 9% above £24,990/yr, written off after 25 years. Plan 2 (2012–2023): repay 9% above £27,295/yr, written off after 30 years. Plan 5 (post-Aug 2023): repay 9% above £25,000/yr, written off after 40 years. Your plan depends on when and where you studied.',
  },
}

const POVERTY_LINE = 15060
const POVERTY_MULTIPLIERS = { 1: 1, 2: 1.35, 3: 1.62, 4: 1.89 }

const PIE_COLORS = ['#6366f1', '#f59e0b']
const AREA_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981']

function calcStandard({ balance, rate, termYears = 10 }) {
  const monthlyRate = rate / 100 / 12
  const n = termYears * 12
  if (balance <= 0 || monthlyRate <= 0) return null
  const payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  return { payment, totalPaid: payment * n, totalInterest: payment * n - balance, months: n, forgiveness: 0 }
}

function calcIDR({ balance, rate, income, familySize, planName, payPct, povertyMultiplier, maxYears }) {
  const povertyGuideline = POVERTY_LINE * (POVERTY_MULTIPLIERS[familySize] || 1.89)
  const discretionary = Math.max(0, income - povertyGuideline * povertyMultiplier)
  const annualPayment = discretionary * payPct
  const monthlyPayment = Math.max(0, annualPayment / 12)

  const monthlyRate = rate / 100 / 12
  let balance_ = balance
  let months = 0
  let totalInterest = 0
  let totalPaid = 0

  while (balance_ > 0.01 && months < maxYears * 12) {
    const interest = balance_ * monthlyRate
    const payment = Math.min(monthlyPayment, balance_ + interest)
    balance_ = balance_ + interest - payment
    totalInterest += interest
    totalPaid += payment
    months++
  }

  const forgiveness = Math.max(0, balance_)
  return { payment: monthlyPayment, totalPaid, totalInterest, months, forgiveness, planName }
}

// Calculate payoff with an extra monthly payment on top of the standard payment
function calcWithExtra({ balance, rate, basePayment, extraPayment }) {
  const monthlyRate = rate / 100 / 12
  const totalPayment = basePayment + extraPayment
  let bal = balance
  let months = 0
  let totalInterest = 0

  while (bal > 0.01 && months < 360) {
    const interest = bal * monthlyRate
    const payment = Math.min(totalPayment, bal + interest)
    bal = Math.max(0, bal + interest - payment)
    totalInterest += interest
    months++
  }
  return { months, totalInterest }
}

// Build yearly balance schedule for a plan
function buildSchedule({ balance, rate, monthlyPayment, maxMonths }) {
  const monthlyRate = rate / 100 / 12
  let bal = balance
  const rows = [{ year: 0, balance: Math.round(bal) }]
  for (let m = 1; m <= maxMonths; m++) {
    const interest = bal * monthlyRate
    const payment = Math.min(monthlyPayment, bal + interest)
    bal = Math.max(0, bal + interest - payment)
    if (m % 12 === 0) rows.push({ year: m / 12, balance: Math.round(bal) })
  }
  return rows
}

// Build yearly amortization table
function buildYearlyAmort({ balance, rate, monthlyPayment, maxMonths }) {
  const monthlyRate = rate / 100 / 12
  let bal = balance
  const rows = []
  for (let yr = 1; yr * 12 <= maxMonths && bal > 0.01; yr++) {
    let yearInterest = 0
    let yearPrincipal = 0
    let yearPaid = 0
    for (let m = 0; m < 12 && bal > 0.01; m++) {
      const interest = bal * monthlyRate
      const payment = Math.min(monthlyPayment, bal + interest)
      const principal = payment - interest
      yearInterest += interest
      yearPrincipal += principal
      yearPaid += payment
      bal = Math.max(0, bal - principal)
    }
    rows.push({
      year: yr,
      payment: Math.round(monthlyPayment),
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.round(bal),
    })
    if (bal <= 0.01) break
  }
  return rows
}

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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StudentLoanCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const sym = countries[country]?.symbol || '$'
  const [balance, setBalance] = useState(35000)
  const [rate, setRate] = useState(6.54)
  const [income, setIncome] = useState(55000)
  const [familySize, setFamilySize] = useState(1)
  const [tab, setTab] = useState('summary')

  // Repayment options state
  const repayDefs = REPAYMENT_OPTIONS[country] || []
  const [repayOpen, setRepayOpen] = useState(true)
  const [repayEnabled, setRepayEnabled] = useState({})
  const [repayAmounts, setRepayAmounts] = useState(
    Object.fromEntries(repayDefs.filter(d => d.type === 'amount').map(d => [d.key, 0]))
  )

  const toggleRepay = (key, val) => setRepayEnabled(prev => ({ ...prev, [key]: val }))
  const setRepayAmt  = (key, val) => setRepayAmounts(prev => ({ ...prev, [key]: val }))

  // Extra monthly payment (NZ is weekly, convert to monthly)
  const extraPayment = useMemo(() => {
    const extraDef = repayDefs.find(d => d.key === 'extra')
    if (!extraDef || !repayEnabled['extra']) return 0
    const amt = repayAmounts['extra'] || 0
    return country === 'nz' ? amt * 52 / 12 : amt
  }, [repayDefs, repayEnabled, repayAmounts, country])

  const activeRepayCount = repayDefs.filter(d => repayEnabled[d.key]).length

  const results = useMemo(() => {
    if (!balance || !rate || !income) return null

    const standard = calcStandard({ balance, rate })
    const ibr  = calcIDR({ balance, rate, income, familySize, planName: 'IBR',  payPct: 0.10, povertyMultiplier: 1.5,  maxYears: 25 })
    const paye = calcIDR({ balance, rate, income, familySize, planName: 'PAYE', payPct: 0.10, povertyMultiplier: 1.5,  maxYears: 20 })
    const save = calcIDR({ balance, rate, income, familySize, planName: 'SAVE', payPct: 0.05, povertyMultiplier: 2.25, maxYears: 25 })

    return { standard, ibr, paye, save }
  }, [balance, rate, income, familySize])

  // Extra payment savings vs standard
  const extraSavings = useMemo(() => {
    if (!results || !results.standard || extraPayment <= 0) return null
    const base = results.standard
    const withExtra = calcWithExtra({ balance, rate, basePayment: base.payment, extraPayment })
    const monthsSaved = base.months - withExtra.months
    const interestSaved = base.totalInterest - withExtra.totalInterest
    return { monthsSaved, interestSaved, newMonths: withExtra.months }
  }, [results, balance, rate, extraPayment])

  // Chart data
  const balanceChartData = useMemo(() => {
    if (!results) return []
    const stdSched  = buildSchedule({ balance, rate, monthlyPayment: results.standard.payment, maxMonths: results.standard.months })
    const saveSched = buildSchedule({ balance, rate, monthlyPayment: results.save.payment,     maxMonths: results.save.months })

    const maxYr = Math.max(stdSched[stdSched.length - 1]?.year || 0, saveSched[saveSched.length - 1]?.year || 0)
    const data = []
    for (let y = 0; y <= maxYr; y++) {
      const stdPt  = stdSched.find(r => r.year === y)
      const savePt = saveSched.find(r => r.year === y)
      data.push({
        year: `Yr ${y}`,
        Standard: stdPt  ? stdPt.balance  : 0,
        SAVE:     savePt ? savePt.balance : undefined,
      })
    }
    return data
  }, [results, balance, rate])

  const pieData = results
    ? [
        { name: 'Principal',      value: balance },
        { name: 'Total Interest', value: Math.round(results.standard.totalInterest) },
      ]
    : []

  const amortRows = useMemo(() => {
    if (!results) return []
    return buildYearlyAmort({ balance, rate, monthlyPayment: results.standard.payment, maxMonths: results.standard.months })
  }, [results, balance, rate])

  const fmt  = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const years = (m) => `${Math.round(m / 12)} yr`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Student Loan Calculator US 2026',
    url: `https://calqwise.com/${country}/student-loan`,
    applicationCategory: 'FinanceApplication',
    description: 'Compare US student loan repayment plans: Standard, IBR, PAYE, SAVE. Calculate monthly payment, total interest, and loan forgiveness.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <Helmet>
        <title>Student Loan Calculator US 2026 — IBR, PAYE, SAVE Plan Comparison | CalcWise</title>
        <meta name="description" content="Compare US student loan repayment plans: Standard, IBR, PAYE, SAVE. Calculate monthly payment, total interest, and loan forgiveness. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/student-loan" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{t('studentloan.title')}</h1>
          <p className="text-slate-500">{t('studentloan.desc')}</p>
        </div>

        <CalcIntro
          intro="The student loan calculator shows your monthly payment, total interest, and payoff date based on your loan balance, interest rate, and repayment term. Compare standard and extended repayment plans to make the best choice."
          hiddenCost="Extended repayment plans double or triple total interest"
        />

        {/* Main inputs */}
        <div className="cw-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('studentloan.loanBalance')} ($)</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={sym} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('studentloan.interestRate')} (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Annual Gross Income ($)</label>
              <NumericInput value={income} onChange={setIncome} min={0} step={1000} prefix={sym} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Family Size</label>
              <select className="cw-input" value={familySize} onChange={e => setFamilySize(+e.target.value)}>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} person{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Repayment Options collapsible */}
        {repayDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setRepayOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">Repayment Options</span>
                {activeRepayCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeRepayCount} active
                  </span>
                )}
              </div>
              {repayOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {repayOpen && (
              <div className="mt-5 space-y-3">
                {repayDefs.map(def => {
                  const enabled = !!repayEnabled[def.key]
                  const isAmount = def.type === 'amount'
                  const isToggle = def.type === 'toggle'
                  const info = PLAN_INFO[def.key]

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
                        <Toggle on={enabled} onChange={v => toggleRepay(def.key, v)} />
                      </div>

                      {enabled && isAmount && (
                        <div className="mt-2">
                          <NumericInput
                            label=""
                            value={repayAmounts[def.key] || 0}
                            onChange={v => setRepayAmt(def.key, v)}
                            min={0}
                            step={def.step}
                            prefix={sym}
                          />
                        </div>
                      )}

                      {enabled && isToggle && info && (
                        <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg">
                          <p className="text-xs font-bold text-slate-700 mb-1">{info.title}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{info.body}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Extra payment savings callout */}
        {extraSavings && extraSavings.monthsSaved > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-bold text-green-800 mb-1">With extra payment</p>
            <p className="text-sm text-green-700">
              Pay off <span className="font-bold">{extraSavings.monthsSaved} month{extraSavings.monthsSaved !== 1 ? 's' : ''} sooner</span> and save{' '}
              <span className="font-bold">{fmt(extraSavings.interestSaved)}</span> in interest.
              New payoff: <span className="font-bold">{years(extraSavings.newMonths)}</span>.
            </p>
          </div>
        )}

        {/* View tabs */}
        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'schedule'].map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`cw-tab${tab === v ? ' active' : ''}`}>
              {t(`calc.${v}`)}
            </button>
          ))}
        </div>

        {results && tab === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4 mb-6">
            {[results.standard, results.ibr, results.paye, results.save].map((plan, i) => (
              <div key={i} className={`cw-card ${i === 0 ? '' : 'border-primary/20'}`}>
                <h3 className="font-bold text-accent mb-3">
                  {i === 0 ? 'Standard (10yr)' : i === 1 ? 'IBR (25yr)' : i === 2 ? 'PAYE (20yr)' : 'SAVE (25yr)'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('studentloan.monthlyPayment')}</span>
                    <span className="font-semibold">{fmtD(plan.payment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('studentloan.repaymentPlan')}</span>
                    <span>{years(plan.months)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('studentloan.totalInterest')}</span>
                    <span>{fmt(plan.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('studentloan.totalCost')}</span>
                    <span className="font-bold">{fmt(plan.totalPaid)}</span>
                  </div>
                  {plan.forgiveness > 0 && (
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-slate-500">Forgiven Balance</span>
                      <span className="text-cw-success font-bold">{fmt(plan.forgiveness)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results && tab === 'chart' && (
          <div className="space-y-6">
            <div className="cw-card">
              <h3 className="font-semibold text-sm mb-1">Loan Balance Over Time</h3>
              <p className="text-xs text-slate-500 mb-4">Standard (10yr) vs SAVE plan — balance remaining each year</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={balanceChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="stdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    interval={Math.max(1, Math.floor(balanceChartData.length / 8))}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={v => v !== undefined ? `$${v.toLocaleString()}` : 'N/A'}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="Standard" stroke="#6366f1" fill="url(#stdGrad)" strokeWidth={2} connectNulls />
                  <Area type="monotone" dataKey="SAVE"     stroke="#22d3ee" fill="url(#saveGrad)" strokeWidth={2} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="cw-card">
              <h3 className="font-semibold text-sm mb-4">Principal vs Interest (Standard Plan)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={v => `$${v.toLocaleString()}`}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {results && tab === 'schedule' && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold text-sm mb-4">{t('studentloan.repaymentPlan')} — Standard Plan</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="text-left py-2 pr-3">Year</th>
                  <th className="text-right py-2 pr-3">{t('studentloan.monthlyPayment')}</th>
                  <th className="text-right py-2 pr-3">Principal</th>
                  <th className="text-right py-2 pr-3">{t('calc.totalInterest')}</th>
                  <th className="text-right py-2">{t('studentloan.loanBalance')}</th>
                </tr>
              </thead>
              <tbody>
                {amortRows.map(row => (
                  <tr key={row.year} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-3">{row.year}</td>
                    <td className="text-right py-2 pr-3">{fmt(row.payment)}</td>
                    <td className="text-right py-2 pr-3 text-cw-success">{fmt(row.principal)}</td>
                    <td className="text-right py-2 pr-3 text-amber-400">{fmt(row.interest)}</td>
                    <td className="text-right py-2 font-semibold">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          IDR plan calculations are estimates. Actual payments depend on your exact AGI, family size, and plan eligibility. SAVE plan benefits are subject to ongoing legal proceedings. Consult StudentAid.gov for current information.
        </div>

        <CalcFAQ faqs={[
          { q: 'What repayment term should I choose?', a: 'Standard 10-year plans minimize total interest. Extended plans (20-25 years) lower monthly payments but cost significantly more. Income-based plans cap payments at 5-10% of discretionary income.' },
          { q: 'Should I pay extra on my student loans?', a: 'If your rate is above 5-6%, yes. Extra payments reduce principal directly and cut total interest dramatically. Even $50-100/month extra saves thousands over the loan term.' },
          { q: 'What is student loan refinancing?', a: 'Refinancing replaces your existing loans with a new private loan at a lower rate. You lose federal protections (IBR, forgiveness) so weigh carefully before refinancing federal loans.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/loan-payoff`, label: 'Loan Payoff Calculator' },
          { to: `/${country}/salary`,      label: 'Salary Calculator' },
          { to: `/${country}/tax`,         label: 'Tax Calculator' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
