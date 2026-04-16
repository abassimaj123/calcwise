import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'

function calcAffordabilityUS({ grossIncome, monthlyDebts, downPayment, rate, loanType }) {
  const frontEndLimits = { conventional: 0.28, fha: 0.31, va: 0.41 }
  const backEndLimits = { conventional: 0.36, fha: 0.43, va: 0.41 }

  const monthlyIncome = grossIncome / 12
  const maxFrontEnd = monthlyIncome * (frontEndLimits[loanType] || 0.28)
  const maxBackEnd = monthlyIncome * (backEndLimits[loanType] || 0.36) - monthlyDebts
  const maxMonthlyPayment = Math.min(maxFrontEnd, maxBackEnd)

  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  const maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -n)) / monthlyRate)
  const maxHomePrice = maxLoan + downPayment

  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const frontEndDTI = ((actualMonthly / monthlyIncome) * 100).toFixed(1)
  const backEndDTI = (((actualMonthly + monthlyDebts) / monthlyIncome) * 100).toFixed(1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    frontEndDTI, backEndDTI, monthlyIncome,
  }
}

function calcAffordabilityUK({ grossIncome, monthlyDebts, downPayment, rate }) {
  const stressRate = Math.max(rate + 3, 7.0)
  const monthlyIncome = grossIncome / 12
  const maxLoan = grossIncome * 4.5
  const maxHomePrice = maxLoan + downPayment

  const monthlyRate = rate / 100 / 12
  const n = 25 * 12
  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const stressMonthlyRate = stressRate / 100 / 12
  const stressPayment = maxLoan * (stressMonthlyRate * Math.pow(1 + stressMonthlyRate, n)) / (Math.pow(1 + stressMonthlyRate, n) - 1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    stressRate, stressPayment, ltv: ((maxLoan / maxHomePrice) * 100).toFixed(1),
    monthlyIncome,
  }
}

function calcAffordabilityCA({ grossIncome, monthlyDebts, downPayment, rate }) {
  // Canada: GDS 32%, TDS 44%, stress test at max(rate+2, 5.25%)
  const stressRate = Math.max(rate + 2, 5.25)
  const monthlyIncome = grossIncome / 12
  const stressMonthlyRate = stressRate / 100 / 12
  const n = 25 * 12

  // GDS limit: max 32% of monthly income for housing costs
  const maxGDS = monthlyIncome * 0.32
  // TDS limit: max 44% of monthly income for all debts
  const maxTDS = monthlyIncome * 0.44 - monthlyDebts

  const maxMonthlyPayment = Math.min(maxGDS, maxTDS)

  // Qualify at stress rate
  const maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + stressMonthlyRate, -n)) / stressMonthlyRate)
  const maxHomePrice = maxLoan + downPayment

  // Actual payment at contract rate
  const monthlyRate = rate / 100 / 12
  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const gdsPct = ((actualMonthly / monthlyIncome) * 100).toFixed(1)
  const tdsPct = (((actualMonthly + monthlyDebts) / monthlyIncome) * 100).toFixed(1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    stressRate, gdsPct, tdsPct, monthlyIncome,
  }
}

function calcAffordabilityAU({ grossIncome, monthlyDebts, downPayment, rate }) {
  // Australia: serviceability buffer rate+3%, APRA LVR limits
  const stressRate = rate + 3
  const monthlyIncome = grossIncome / 12
  const stressMonthlyRate = stressRate / 100 / 12
  const n = 30 * 12

  // Max 30% of gross monthly income for housing (common benchmark)
  const maxMonthlyPayment = monthlyIncome * 0.30 - monthlyDebts

  const maxLoan = maxMonthlyPayment > 0
    ? maxMonthlyPayment * ((1 - Math.pow(1 + stressMonthlyRate, -n)) / stressMonthlyRate)
    : 0
  const maxHomePrice = maxLoan + downPayment

  const monthlyRate = rate / 100 / 12
  const actualMonthly = maxLoan > 0
    ? maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : 0
  const lvr = maxHomePrice > 0 ? ((maxLoan / maxHomePrice) * 100).toFixed(1) : '0.0'

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    stressRate, lvr, monthlyIncome,
  }
}

function calcAffordabilityIE({ grossIncome, monthlyDebts, downPayment, rate }) {
  // Ireland: Central Bank 3.5x income cap (10% exception for FTB)
  const monthlyIncome = grossIncome / 12
  const maxLoan = grossIncome * 3.5
  const maxHomePrice = maxLoan + downPayment

  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const dti = (((actualMonthly + monthlyDebts) / monthlyIncome) * 100).toFixed(1)
  const ltv = ((maxLoan / maxHomePrice) * 100).toFixed(1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    dti, ltv, monthlyIncome,
  }
}

function calcAffordabilityNZ({ grossIncome, monthlyDebts, downPayment, rate }) {
  // New Zealand: RBNZ DTI cap 6x income
  const monthlyIncome = grossIncome / 12
  const maxLoan = grossIncome * 6
  const maxHomePrice = maxLoan + downPayment

  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const dti = (((actualMonthly + monthlyDebts) / monthlyIncome) * 100).toFixed(1)
  const ltv = ((maxLoan / maxHomePrice) * 100).toFixed(1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    dti, ltv, monthlyIncome,
  }
}

const loanTypes = [
  { value: 'conventional', label: 'Conventional (28/36 DTI)' },
  { value: 'fha', label: 'FHA (31/43 DTI)' },
  { value: 'va', label: 'VA (41% DTI)' },
]

const defaultsByCountry = {
  us: { grossIncome: 90000, downPayment: 60000, rate: 7.0 },
  ca: { grossIncome: 100000, downPayment: 55000, rate: 5.45 },
  uk: { grossIncome: 60000, downPayment: 50000, rate: 4.5 },
  au: { grossIncome: 120000, downPayment: 130000, rate: 6.25 },
  ie: { grossIncome: 70000, downPayment: 35000, rate: 4.85 },
  nz: { grossIncome: 100000, downPayment: 130000, rate: 7.15 },
}

// Affordability meter bar colors
const meterColor = (pct) => {
  if (pct <= 60) return '#22c55e'  // green: conservative
  if (pct <= 80) return '#f97316'  // orange: moderate
  return '#ef4444'                  // red: aggressive
}

export default function AffordabilityCalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [grossIncome, setGrossIncome] = useState(d.grossIncome)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [downPayment, setDownPayment] = useState(d.downPayment)
  const [rate, setRate] = useState(d.rate)
  const [loanType, setLoanType] = useState('conventional')
  const [homePrice, setHomePrice] = useState(0)
  const [view, setView] = useState('result')

  const result = useMemo(() => {
    if (!grossIncome || !downPayment) return null
    switch (country) {
      case 'uk': return calcAffordabilityUK({ grossIncome, monthlyDebts, downPayment, rate })
      case 'ca': return calcAffordabilityCA({ grossIncome, monthlyDebts, downPayment, rate })
      case 'au': return calcAffordabilityAU({ grossIncome, monthlyDebts, downPayment, rate })
      case 'ie': return calcAffordabilityIE({ grossIncome, monthlyDebts, downPayment, rate })
      case 'nz': return calcAffordabilityNZ({ grossIncome, monthlyDebts, downPayment, rate })
      default: return calcAffordabilityUS({ grossIncome, monthlyDebts, downPayment, rate, loanType })
    }
  }, [grossIncome, monthlyDebts, downPayment, rate, loanType, country])

  const fmt = (n) => new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) => new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const descByCountry = {
    us: 'How much home can you afford? Based on front-end and back-end DTI rules.',
    ca: 'How much can you borrow? Based on GDS/TDS ratios and OSFI stress test.',
    uk: 'How much can you borrow? Based on FCA stress test and 4.5x income rule.',
    au: 'How much can you borrow? Based on APRA serviceability buffer (rate+3%).',
    ie: 'How much can you borrow? Central Bank Ireland 3.5x income cap.',
    nz: 'How much can you borrow? RBNZ DTI cap of 6x gross income.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${c.name} Home Affordability Calculator`,
    url: `https://calqwise.com/${country}/affordability`,
    description: `How much home can you afford in ${c.name}? Uses official lender DTI guidelines, stress tests, and income caps.`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  // Chart data: max, recommended (80%), conservative (60%)
  const priceBarData = result
    ? [
        { name: 'Max Affordable', price: Math.round(result.maxHomePrice) },
        { name: 'Recommended (80%)', price: Math.round(result.maxHomePrice * 0.80) },
        { name: 'Conservative (60%)', price: Math.round(result.maxHomePrice * 0.60) },
      ]
    : []

  // DTI breakdown for monthly income bar chart
  const monthlyIncome = result?.monthlyIncome || 0
  const dtiBarData = result
    ? [
        { name: '28% Threshold', amount: Math.round(monthlyIncome * 0.28), fill: '#22c55e' },
        { name: '36% Threshold', amount: Math.round(monthlyIncome * 0.36), fill: '#f97316' },
        { name: '43% Threshold', amount: Math.round(monthlyIncome * 0.43), fill: '#ef4444' },
        { name: 'Your Payment', amount: Math.round(result.maxMonthlyPayment), fill: '#3b82f6' },
      ]
    : []

  // Affordability meter: % of max budget for entered home price
  const meterPct = result && homePrice > 0
    ? Math.min(Math.round((homePrice / result.maxHomePrice) * 100), 150)
    : null

  return (
    <>
      <Helmet>
        <title>{c.name} Affordability Calculator 2026 | CalcWise</title>
        <meta name="description" content={`How much property can you afford in ${c.name}? ${descByCountry[country] || ''} Free calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/affordability`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Affordability Calculator
          </h1>
          <p className="text-slate-500">{descByCountry[country] || descByCountry.us}</p>
        </div>

        <CalcIntro
          intro="The home affordability calculator tells you the maximum home price you can afford based on your income, debts, and down payment. It uses official lender guidelines for your country — DTI ratios, stress tests, and income caps."
          hiddenCost="Lender stress tests add 2-3% to qualifying rate"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Annual Gross Income ({c.symbol})</label>
              <NumericInput value={grossIncome} onChange={setGrossIncome} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Monthly Debts ({c.symbol})</label>
              <NumericInput value={monthlyDebts} onChange={setMonthlyDebts} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Down Payment ({c.symbol})</label>
              <NumericInput value={downPayment} onChange={setDownPayment} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mortgage Rate (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            {country === 'us' && (
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Loan Type</label>
                <select className="cw-input" value={loanType} onChange={e => setLoanType(e.target.value)}>
                  {loanTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="cw-tabs mb-4">
          {['result', 'chart', 'breakdown'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Result tab */}
        {result && view === 'result' && (
          <>
            <ResultSimple
              metrics={[
                { label: 'Max Home Price', value: fmt(result.maxHomePrice), highlight: true },
                { label: 'Max Loan', value: fmt(result.maxLoan) },
                { label: 'Est. Monthly Payment', value: fmtD(result.maxMonthlyPayment) },
              ]}
            />

            {/* Affordability Meter */}
            <div className="cw-card mt-4">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">
                Affordability Meter
              </h3>
              <div className="mb-2">
                <label className="block text-xs text-slate-500 mb-1">Enter a target home price to check ({c.symbol})</label>
                <NumericInput value={homePrice} onChange={setHomePrice} min={0} step={1000} prefix={c.symbol} />
              </div>
              {meterPct !== null && (
                <>
                  <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden mt-3">
                    <div
                      className="h-5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(meterPct, 100)}%`,
                        backgroundColor: meterColor(meterPct),
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span className="font-semibold" style={{ color: meterColor(meterPct) }}>
                      {meterPct}% of max budget
                      {meterPct > 100 ? ' — Over budget!' : meterPct > 80 ? ' — Aggressive' : meterPct > 60 ? ' — Moderate' : ' — Conservative'}
                    </span>
                    <span>100%</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Chart tab */}
        {result && view === 'chart' && (
          <>
            {/* Price tiers bar chart */}
            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">
                Affordable Price Tiers
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={priceBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => fmt(v)}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    formatter={(val) => [fmt(val), 'Home Price']}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                    <Cell fill="#ef4444" />
                    <Cell fill="#f97316" />
                    <Cell fill="#22c55e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Recommended = 80% of max. Conservative = 60% of max. Red = upper limit.
              </p>
            </div>

            {/* DTI thresholds bar chart */}
            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">
                Monthly Payment vs DTI Thresholds
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dtiBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => fmt(v)}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    formatter={(val) => [fmt(val), 'Monthly Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {dtiBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Green = 28% front-end. Orange = 36% back-end. Red = 43% max. Blue = your qualifying payment.
              </p>
            </div>
          </>
        )}

        {/* Breakdown tab (detailed) */}
        {result && view === 'breakdown' && country === 'us' && (
          <ResultDetailed
            title="Affordability Analysis"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: 'Monthly Payment', value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'Front-End DTI', value: `${result.frontEndDTI}%`, sub: `Limit: ${loanType === 'fha' ? '31' : loanType === 'va' ? '41' : '28'}%` },
              { label: 'Back-End DTI', value: `${result.backEndDTI}%`, sub: `Limit: ${loanType === 'fha' ? '43' : loanType === 'va' ? '41' : '36'}%` },
            ]}
          />
        )}

        {result && view === 'breakdown' && country === 'uk' && (
          <ResultDetailed
            title="Affordability Analysis"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Income Multiple (4.5x)', value: fmt(grossIncome * 4.5) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Property Price', value: fmt(result.maxHomePrice), bold: true },
              { label: 'LTV Ratio', value: `${result.ltv}%` },
              { label: `Monthly Payment at ${rate}%`, value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'FCA Stress Test Rate', value: `${result.stressRate}%` },
              { label: 'Stress Test Monthly Payment', value: fmtD(result.stressPayment), sub: 'Must be affordable at this rate' },
            ]}
          />
        )}

        {result && view === 'breakdown' && country === 'ca' && (
          <ResultDetailed
            title="Affordability Analysis (Canada)"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'OSFI Stress Test Rate', value: `${result.stressRate}%`, sub: 'max(rate+2%, 5.25%)' },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: `Monthly Payment at ${rate}%`, value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'GDS Ratio', value: `${result.gdsPct}%`, sub: 'Limit: 32%' },
              { label: 'TDS Ratio', value: `${result.tdsPct}%`, sub: 'Limit: 44%' },
            ]}
          />
        )}

        {result && view === 'breakdown' && country === 'au' && (
          <ResultDetailed
            title="Affordability Analysis (Australia)"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'APRA Serviceability Rate', value: `${result.stressRate}%`, sub: 'rate + 3% buffer' },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: `Monthly Payment at ${rate}%`, value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'LVR', value: `${result.lvr}%` },
            ]}
          />
        )}

        {result && view === 'breakdown' && country === 'ie' && (
          <ResultDetailed
            title="Affordability Analysis (Ireland)"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'CBI Income Multiple (3.5x)', value: fmt(grossIncome * 3.5), sub: '10% exception for FTB' },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: `Monthly Payment at ${rate}%`, value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'LTV Ratio', value: `${result.ltv}%` },
              { label: 'DTI', value: `${result.dti}%` },
            ]}
          />
        )}

        {result && view === 'breakdown' && country === 'nz' && (
          <ResultDetailed
            title="Affordability Analysis (New Zealand)"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'RBNZ DTI Cap (6x income)', value: fmt(grossIncome * 6) },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: `Monthly Payment at ${rate}%`, value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'LTV Ratio', value: `${result.ltv}%` },
              { label: 'DTI', value: `${result.dti}%` },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            Enter your income and details above to see how much you can afford.
          </div>
        )}

        <CalcFAQ faqs={[
          { q: 'What is DTI ratio?', a: 'Debt-to-Income ratio: your monthly debt payments divided by gross monthly income. Lenders typically allow up to 43% DTI, with 28-36% for housing costs alone.' },
          { q: 'What is the OSFI stress test (Canada)?', a: 'Canadian mortgage applicants must qualify at the higher of their contract rate + 2% or 5.25%. This ensures you can handle rate increases.' },
          { q: 'How much should I put as a down payment?', a: 'Typically 10-20%. Less than 20% requires mortgage insurance (PMI/CMHC). More down payment means lower monthly payments and less interest.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/rent-vs-buy`, label: 'Rent vs Buy' },
          { to: `/${country}/salary`, label: 'Salary Calculator' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
