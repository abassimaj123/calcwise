import { useState, useMemo, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'
import SmartAlert from '../../components/SmartAlert'
import { CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const SAVINGS_FAQS = [
  { q: 'What is compound interest and why does it matter?', a: 'Compound interest is interest earned on both your principal and previously earned interest. Over time it creates exponential growth — $10,000 at 7% for 30 years grows to over $76,000 without adding a single dollar.' },
  { q: 'What is the difference between APR and APY?', a: 'APR (Annual Percentage Rate) is the simple annual rate. APY (Annual Percentage Yield) accounts for compounding within the year and is always ≥ APR. Banks advertise savings rates as APY — it\'s the more accurate figure for growth calculations.' },
  { q: 'What is the Rule of 72?', a: 'Divide 72 by your annual interest rate to estimate years to double your money. At 6% annual return, money doubles in approximately 12 years (72 ÷ 6 = 12). At 9%, it doubles in about 8 years.' },
  { q: 'How much should I save?', a: 'The standard recommendation is to save at least 20% of take-home pay: 10% for retirement accounts and 10% for other goals. Build 3–6 months of expenses as an emergency fund first, then focus on long-term growth.' },
  { q: 'How does inflation affect my savings?', a: 'Inflation reduces purchasing power over time. If your savings earn 2% but inflation runs at 3%, your real return is -1%. This calculator shows both your nominal balance and its inflation-adjusted "real" value in today\'s purchasing power.' },
]

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULTS = {
  us: { principal: 10000, monthly: 500,  rate: 7.0, years: 20, tax: 25 },
  ca: { principal: 10000, monthly: 500,  rate: 6.5, years: 20, tax: 26 },
  uk: { principal: 10000, monthly: 400,  rate: 5.5, years: 20, tax: 20 },
  au: { principal: 10000, monthly: 500,  rate: 6.0, years: 20, tax: 32 },
  ie: { principal: 10000, monthly: 400,  rate: 5.5, years: 20, tax: 33 },
  nz: { principal: 10000, monthly: 400,  rate: 6.0, years: 20, tax: 28 },
}

const COMPOUND_VALUES = [
  { tKey: 'savings.compoundMonthly',      value: 12 },
  { tKey: 'savings.compoundQuarterly',    value: 4  },
  { tKey: 'savings.compoundSemiAnnually', value: 2  },
  { tKey: 'savings.compoundAnnually',     value: 1  },
]

// ---------------------------------------------------------------------------
// Calculation logic
// ---------------------------------------------------------------------------
function calcSavings({ principal, monthly, rate, years, compoundFreq, inflation, taxRate }) {
  const n = compoundFreq
  const r = rate / 100 / n
  const months = years * 12

  // Guard against r = 0 (0% interest)
  let fvPrincipal, fvContribs
  if (r === 0) {
    fvPrincipal = principal
    fvContribs  = monthly * months
  } else {
    fvPrincipal = principal * Math.pow(1 + r, n * years)
    // Monthly contributions with compound adjustment
    const periodsPerMonth = n / 12
    fvContribs = monthly * ((Math.pow(1 + r, n * years) - 1) / (r / (12 / n)))
  }

  const finalBalance       = fvPrincipal + fvContribs
  const totalContributions = principal + monthly * months
  const totalInterest      = finalBalance - totalContributions
  const interestAfterTax   = totalInterest * (1 - taxRate / 100)
  const finalAfterTax      = totalContributions + interestAfterTax

  const inflationFactor = Math.pow(1 + inflation / 100, years)
  const realValue       = finalBalance / inflationFactor

  return { finalBalance, totalContributions, totalInterest, finalAfterTax, realValue, interestAfterTax }
}

function buildYearlyData(principal, monthly, rate, years, compoundFreq, inflation) {
  const data = []
  const n = compoundFreq
  const r = rate / 100 / n

  for (let y = 1; y <= years; y++) {
    let fvP, fvC
    if (r === 0) {
      fvP = principal
      fvC = monthly * 12 * y
    } else {
      fvP = principal * Math.pow(1 + r, n * y)
      fvC = monthly * ((Math.pow(1 + r, n * y) - 1) / (r / (12 / n)))
    }
    const balance       = fvP + fvC
    const contributions = principal + monthly * 12 * y
    const interest      = balance - contributions
    const realBalance   = balance / Math.pow(1 + inflation / 100, y)
    data.push({
      year:          y,
      balance:       Math.round(balance),
      contributions: Math.round(contributions),
      interest:      Math.round(Math.max(0, interest)),
      realBalance:   Math.round(realBalance),
    })
  }
  return data
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SavingsCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country]
  const d = DEFAULTS[country] ?? DEFAULTS.us

  const COMPOUND_OPTIONS = COMPOUND_VALUES.map((o) => ({ label: t(o.tKey), value: o.value }))
  const TABS = [t('savings.tabSummary'), t('savings.tabGrowthChart'), t('savings.tabYearByYear')]

  const [principal,    setPrincipal]    = useState(d.principal)
  const [monthly,      setMonthly]      = useState(d.monthly)
  const [rate,         setRate]         = useState(d.rate)
  const [compoundFreq, setCompoundFreq] = useState(12)
  const [years,        setYears]        = useState(d.years)
  const [inflation,    setInflation]    = useState(2.5)
  const [taxRate,      setTaxRate]      = useState(d.tax)
  const [tab,          setTab]          = useState(t('savings.tabSummary'))

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, {
      style: 'currency', currency: c.currency, maximumFractionDigits: 0,
    }).format(n)

  const fmtK = (n) => {
    if (Math.abs(n) >= 1000000) return `${c.symbol}${(n / 1000000).toFixed(1)}M`
    if (Math.abs(n) >= 1000)    return `${c.symbol}${(n / 1000).toFixed(0)}k`
    return fmt(n)
  }

  const result = useMemo(
    () => calcSavings({ principal, monthly, rate, years, compoundFreq, inflation, taxRate }),
    [principal, monthly, rate, years, compoundFreq, inflation, taxRate]
  )

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('savings', country)
      tracked.current = true
    }
  }, [result])

  const yearlyData = useMemo(
    () => buildYearlyData(principal, monthly, rate, years, compoundFreq, inflation),
    [principal, monthly, rate, years, compoundFreq, inflation]
  )

  const totalGain = result.finalBalance - result.totalContributions

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${c.name} Savings Calculator`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Calculate compound interest and savings growth in ${c.name}. See how your money grows with regular contributions over time.`,
    url: `https://calqwise.com/${country}/savings`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <Helmet>
        <title>{c.name} Savings &amp; Compound Interest Calculator 2026 | CalcWise</title>
        <meta
          name="description"
          content={`Free savings calculator for ${c.name}. Calculate compound interest, savings growth, and inflation-adjusted returns. See how your deposits grow over time.`}
        />
        <link rel="canonical" href={`https://calqwise.com/${country}/savings`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold mb-1">{c.name} {t('savings.title')}</h1>
          <p className="text-slate-500 text-sm">{t('savings.desc')}</p>
        </div>

        {/* Rate benchmarks */}
        <SmartAlert
          type="warning"
          title={t('savings.alertHighReturnTitle')}
          message={t('savings.alertHighReturnMsg')}
          show={rate > 8}
        />
        <SmartAlert
          type="info"
          title={t('savings.alertLowReturnTitle')}
          message={
            country === 'ca'
              ? t('savings.alertLowReturnMsgTFSA')
              : country === 'uk'
              ? t('savings.alertLowReturnMsgISA')
              : t('savings.alertLowReturnMsgDefault')
          }
          show={rate < 2}
        />

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Savings Details */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('savings.savingsDetails')}</p>
                <div className="space-y-4">
                  <NumericInput
                    label={`${t('savings.initialDeposit')} (${c.symbol})`}
                    value={principal}
                    onChange={setPrincipal}
                    min={0}
                    max={100000}
                    step={500}
                    prefix={c.symbol}
                    showSlider
                  />
                  <NumericInput
                    label={`${t('savings.monthlyContribution')} (${c.symbol})`}
                    value={monthly}
                    onChange={setMonthly}
                    min={0}
                    max={5000}
                    step={50}
                    prefix={c.symbol}
                    showSlider
                  />
                  <NumericInput
                    label={t('savings.annualInterestRate')}
                    value={rate}
                    onChange={setRate}
                    min={0.5}
                    max={20}
                    step={0.1}
                    suffix="%"
                    showSlider
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      {t('savings.compoundFreq')}
                    </label>
                    <select
                      className="cw-input"
                      value={compoundFreq}
                      onChange={(e) => setCompoundFreq(Number(e.target.value))}
                    >
                      {COMPOUND_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Time & Options */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('savings.timeAndOptions')}</p>
                <div className="space-y-4">
                  <NumericInput
                    label={t('savings.years')}
                    value={years}
                    onChange={setYears}
                    min={1}
                    max={40}
                    step={1}
                    suffix=" yrs"
                    showSlider
                  />
                  <NumericInput
                    label={t('savings.annualInflationRate')}
                    value={inflation}
                    onChange={setInflation}
                    min={0}
                    max={6}
                    step={0.1}
                    suffix="%"
                    showSlider
                    hint={t('savings.inflationHint')}
                  />
                  <NumericInput
                    label={t('savings.taxOnInterestPct')}
                    value={taxRate}
                    onChange={setTaxRate}
                    min={0}
                    max={50}
                    step={1}
                    suffix="%"
                    showSlider
                    hint={`${c.name} marginal rate on interest income`}
                  />
                </div>
              </div>

            </div>{/* /cw-inputs-panel */}
          </div>{/* /calc-inputs-panel */}

          {/* ── RIGHT: Results ── */}
          <div className="calc-results-panel">

            {/* Hero metrics */}
            <ResultSimple
              metrics={[
                {
                  label: t('savings.finalBalance'),
                  value: fmt(result.finalBalance),
                  sub: `After ${years} years · ${COMPOUND_OPTIONS.find(o => o.value === compoundFreq)?.label} compounding`,
                  highlight: true,
                },
                {
                  label: t('savings.totalInterestEarned'),
                  value: fmt(Math.max(0, totalGain)),
                },
                {
                  label: t('savings.totalContributions'),
                  value: fmt(result.totalContributions),
                },
              ]}
            />

            {/* Tabs */}
            <div className="cw-tabs mb-4 mt-4">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`cw-tab${tab === t ? ' active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* ── Summary Tab ── */}
            {tab === t('savings.tabSummary') && (
              <ResultDetailed
                title={t('savings.savingsBreakdown')}
                rows={[
                  { label: t('savings.initialDeposit'),                                   value: fmt(principal) },
                  { label: `${t('savings.monthlyContribution')} × ${years * 12}`,         value: fmt(monthly * years * 12) },
                  { label: t('savings.totalContributions'),                                value: fmt(result.totalContributions), bold: true },
                  { label: t('savings.totalInterestEarned'),                               value: fmt(Math.max(0, result.totalInterest)) },
                  { label: `${t('savings.taxOnInterest')} (${taxRate}%)`,                 value: `-${fmt(Math.max(0, result.totalInterest - result.interestAfterTax))}` },
                  { label: t('savings.netInterestAfterTax'),                               value: fmt(result.interestAfterTax) },
                  { label: t('savings.finalBalanceBeforeTax'),                             value: fmt(result.finalBalance), bold: true },
                  { label: t('savings.finalBalanceAfterTax'),                              value: fmt(result.finalAfterTax), bold: true, total: true },
                  { label: `${t('savings.realValue')} (${inflation}% ${t('savings.inflationRate')})`, value: fmt(result.realValue), sub: t('savings.purchasingPowerToday') },
                ]}
              />
            )}

            {/* ── Growth Chart Tab ── */}
            {tab === t('savings.tabGrowthChart') && (
              <div className="cw-card">
                <h3 className="font-semibold text-sm mb-1">{t('savings.savingsGrowthOver', { years })}</h3>
                <p className="text-xs text-slate-400 mb-4">{t('savings.chartSubtext')}</p>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={yearlyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradContrib" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1A6AFF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1A6AFF" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11 }}
                      label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
                    />
                    <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={64} />
                    <Tooltip
                      formatter={(v, name) => [fmt(v), name]}
                      labelFormatter={(l) => `Year ${l}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      name="Contributions"
                      stackId="1"
                      stroke="#1A6AFF"
                      fill="url(#gradContrib)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      name="Interest Earned"
                      stackId="1"
                      stroke="#00D4FF"
                      fill="url(#gradInterest)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="realBalance"
                      name="Real Value (inflation-adj.)"
                      stroke="#1D9E75"
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="5 3"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Year by Year Tab ── */}
            {tab === t('savings.tabYearByYear') && (
              <div className="cw-card overflow-x-auto">
                <h3 className="font-semibold text-sm mb-4">{t('savings.yearByYearBreakdown')}</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 pr-3 text-slate-500 font-medium">{t('savings.year')}</th>
                      <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t('savings.contributions')}</th>
                      <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t('savings.interestEarned')}</th>
                      <th className="text-right py-2 text-slate-500 font-medium">{t('savings.balance')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyData.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-1.5 pr-3 font-medium">{row.year}</td>
                        <td className="py-1.5 pr-3 text-right">{fmt(row.contributions)}</td>
                        <td className="py-1.5 pr-3 text-right text-blue-600">{fmt(row.interest)}</td>
                        <td className="py-1.5 text-right font-semibold">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <AdSenseSlot format="rectangle" className="mt-4" />

          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <CalcFAQ faqs={SAVINGS_FAQS} />
        <CalcRelated links={[
          { to: `/${country}/retirement`, label: 'Retirement Calculator' },
          { to: `/${country}/net-worth`,  label: 'Net Worth Calculator' },
          { to: `/${country}/budget`,     label: 'Budget Planner' },
        ]} />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
