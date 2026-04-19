import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated, CalcPageMeta } from '../../components/CalcSEO'

const PRIME_RATE = 8.5 // Current US prime rate estimate

// ---------------------------------------------------------------------------
// Country-specific HELOC options
// ---------------------------------------------------------------------------
const HELOC_OPTIONS = {
  us: [
    { key: 'insurance', label: 'Hazard Insurance',   hint: 'Annual homeowners insurance · add to monthly', type: 'annual',  step: 100, defaultVal: 0 },
    { key: 'propertax', label: 'Property Tax',        hint: 'Annual property tax on equity value',          type: 'annual',  step: 100, defaultVal: 0 },
    { key: 'annualfee', label: 'Annual Fee',          hint: 'Some HELOCs charge $50-100/yr',               type: 'annual',  step: 25,  defaultVal: 0 },
  ],
  ca: [
    { key: 'insurance', label: 'Home Insurance',      hint: 'Portion attributable to HELOC property',      type: 'annual',  step: 100, defaultVal: 0 },
    { key: 'annualfee', label: 'Frais annuels',       hint: 'Certains HELOC: $50-150/an',                  type: 'annual',  step: 25,  defaultVal: 0 },
    { key: 'legal',     label: 'Frais légaux',        hint: 'Frais notariaux one-time (amortized monthly)', type: 'monthly', step: 10,  defaultVal: 0 },
  ],
  uk: [
    { key: 'insurance',   label: 'Buildings Insurance', hint: 'Annual buildings insurance',                type: 'annual',  step: 50,  defaultVal: 0 },
    { key: 'arrangement', label: 'Arrangement Fee',    hint: 'One-time lender fee (amortized monthly)',    type: 'monthly', step: 10,  defaultVal: 0 },
  ],
  au: [
    { key: 'insurance', label: 'Home Insurance',      hint: 'Annual home insurance',                        type: 'annual',  step: 100, defaultVal: 0 },
    { key: 'annualfee', label: 'Annual Fee',          hint: 'Line of credit annual fee',                    type: 'annual',  step: 25,  defaultVal: 0 },
  ],
  ie: [
    { key: 'insurance', label: 'Home Insurance',      hint: 'Annual home insurance',                        type: 'annual',  step: 50,  defaultVal: 0 },
  ],
  nz: [
    { key: 'insurance', label: 'Home Insurance',      hint: 'Annual home insurance',                        type: 'annual',  step: 100, defaultVal: 0 },
    { key: 'annualfee', label: 'Annual Fee',          hint: 'Revolving credit facility fee',                type: 'annual',  step: 25,  defaultVal: 0 },
  ],
}

// ---------------------------------------------------------------------------
// Toggle switch (same pattern as SalaryCalc)
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-indigo-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Core HELOC calculation
// ---------------------------------------------------------------------------
function calcHELOC({ homeValue, mortgageBalance, margin, drawAmount, drawPeriodYears, repayPeriodYears, extraMonthlyDraw, extraMonthlyRepay }) {
  const maxLTV = 0.85
  const maxCredit = homeValue * maxLTV - mortgageBalance
  if (maxCredit <= 0) return null

  const rate = PRIME_RATE + margin
  const monthlyRate = rate / 100 / 12
  const actualDraw = Math.min(drawAmount, maxCredit)

  // Draw period: interest-only payments
  const drawMonthlyPayment = actualDraw * monthlyRate
  const drawTotalInterest = drawMonthlyPayment * drawPeriodYears * 12

  // Repayment period: P&I on drawn amount
  const repayN = repayPeriodYears * 12
  const repayMonthly = actualDraw * (monthlyRate * Math.pow(1 + monthlyRate, repayN)) / (Math.pow(1 + monthlyRate, repayN) - 1)
  const repayTotalInterest = repayMonthly * repayN - actualDraw

  const totalInterest = drawTotalInterest + repayTotalInterest

  // True monthly cost (base + extra country fees)
  const trueMonthlyCostDraw  = drawMonthlyPayment  + extraMonthlyDraw
  const trueMonthlyCostRepay = repayMonthly        + extraMonthlyRepay

  // Build balance chart data (yearly)
  const chartData = []
  for (let y = 0; y <= drawPeriodYears; y++) {
    chartData.push({
      year: `Yr ${y}`,
      balance: Math.round(actualDraw),
      payment: Math.round(drawMonthlyPayment),
      phase: 'Draw',
    })
  }
  let bal = actualDraw
  for (let y = 1; y <= repayPeriodYears; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = bal * monthlyRate
      const principal = repayMonthly - interest
      bal = Math.max(0, bal - principal)
    }
    chartData.push({
      year: `Yr ${drawPeriodYears + y}`,
      balance: Math.round(bal),
      payment: Math.round(repayMonthly),
      phase: 'Repay',
    })
  }

  return {
    maxCredit, actualDraw, rate, drawMonthlyPayment, repayMonthly,
    drawTotalInterest, repayTotalInterest, totalInterest, chartData,
    ltv: ((mortgageBalance + actualDraw) / homeValue * 100).toFixed(1),
    trueMonthlyCostDraw,
    trueMonthlyCostRepay,
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function HelocCalc({ country = 'us' }) {
  const { t, i18n } = useTranslation()
  const tYears = (n) => {
    if (i18n.language.startsWith('fr')) return `${n} ans`
    if (i18n.language.startsWith('es')) return `${n} años`
    return `${n} years`
  }
  const c = countries[country] || { symbol: '$', locale: 'en-US', currency: 'USD', name: 'US' }
  const optionDefs = HELOC_OPTIONS[country] || []

  const [homeValue, setHomeValue]         = useState(500000)
  const [mortgageBalance, setMortgageBalance] = useState(300000)
  const [margin, setMargin]               = useState(0.5)
  const [drawAmount, setDrawAmount]       = useState(80000)
  const [drawPeriod, setDrawPeriod]       = useState(10)
  const [repayPeriod, setRepayPeriod]     = useState(20)
  const [tab, setTab]                     = useState('summary')

  // Country options state
  const [optOpen, setOptOpen]         = useState(false)
  const [optEnabled, setOptEnabled]   = useState({})
  const [optAmounts, setOptAmounts]   = useState(
    Object.fromEntries(optionDefs.map(o => [o.key, o.defaultVal]))
  )

  // Compute total extra monthly cost from enabled options
  const { extraMonthlyDraw, extraMonthlyRepay } = useMemo(() => {
    let total = 0
    for (const opt of optionDefs) {
      if (!optEnabled[opt.key]) continue
      const val = optAmounts[opt.key] || 0
      total += opt.type === 'annual' ? val / 12 : val
    }
    return { extraMonthlyDraw: total, extraMonthlyRepay: total }
  }, [optionDefs, optEnabled, optAmounts])

  const activeOptCount = optionDefs.filter(o => optEnabled[o.key] && (optAmounts[o.key] || 0) > 0).length

  const result = useMemo(
    () => calcHELOC({
      homeValue, mortgageBalance, margin, drawAmount,
      drawPeriodYears: drawPeriod, repayPeriodYears: repayPeriod,
      extraMonthlyDraw, extraMonthlyRepay,
    }),
    [homeValue, mortgageBalance, margin, drawAmount, drawPeriod, repayPeriod, extraMonthlyDraw, extraMonthlyRepay]
  )

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('heloc', country)
      tracked.current = true
    }
  }, [result])

  const fmt  = (n) => new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) => new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const toggleOpt = (key, val) => setOptEnabled(prev => ({ ...prev, [key]: val }))
  const setOptAmt = (key, val) => setOptAmounts(prev => ({ ...prev, [key]: val }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `HELOC Calculator ${c.name} 2026`,
    url: `https://calqwise.com/${country}/heloc`,
    applicationCategory: 'FinanceApplication',
    description: 'Calculate your HELOC available credit, draw period payments, and full repayment phase schedule.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <CalcPageMeta country={country} slug="heloc" title={`HELOC Calculator ${c.name} 2026 — Draw Period, Repayment & Interest | CalqWise`} description={`Free ${c.name} HELOC calculator. Calculate available credit, interest-only draw period payments, and principal + interest repayment phase. Prime + margin rate. Updated 2026.`} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{t('heloc.title')}</h1>
          <p className="text-slate-500">{t('heloc.desc')}</p>
          <p className="text-xs text-slate-500 mt-2">Prime Rate: {PRIME_RATE}% (estimate)</p>
        </div>

        <CalcIntro
          intro={t('heloc.calcIntro', { defaultValue: "A HELOC (Home Equity Line of Credit) lets you borrow against your home's equity. This calculator shows your available credit, interest-only draw period payments, and full repayment phase payments." })}
          hiddenCost="Repayment phase payments can be 2-3x the draw phase amount"
        />

        {/* Main inputs */}
        <div className="cw-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.homeValue')} ({c.symbol})</label>
              <NumericInput value={homeValue} onChange={setHomeValue} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.mortgageBalance')} ({c.symbol})</label>
              <NumericInput value={mortgageBalance} onChange={setMortgageBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.marginAbovePrime', { defaultValue: 'Margin above Prime (%)' })}</label>
              <NumericInput value={margin} onChange={setMargin} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.drawAmount')} ({c.symbol})</label>
              <NumericInput value={drawAmount} onChange={setDrawAmount} min={0} step={1000} max={result?.maxCredit || undefined} prefix={c.symbol} />
              {result && <p className="text-xs text-slate-500 mt-1">Max available: {fmt(result.maxCredit)}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.drawPeriod')}</label>
              <select className="cw-input" value={drawPeriod} onChange={e => setDrawPeriod(+e.target.value)}>
                {[5, 10, 15].map(y => <option key={y} value={y}>{tYears(y)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('heloc.repayPeriod')}</label>
              <select className="cw-input" value={repayPeriod} onChange={e => setRepayPeriod(+e.target.value)}>
                {[10, 15, 20].map(y => <option key={y} value={y}>{tYears(y)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Country-specific options — collapsible */}
        {optionDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setOptOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{t('heloc.additionalCosts', { defaultValue: 'Additional Costs' })} ({c.name})</span>
                {activeOptCount > 0 && (
                  <span className="text-xs bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full px-2 py-0.5">
                    {activeOptCount} active · +{fmtD(extraMonthlyDraw)}/mo
                  </span>
                )}
              </div>
              {optOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {optOpen && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                {optionDefs.map(opt => (
                  <div
                    key={opt.key}
                    className={`border rounded-xl p-3 transition-colors ${optEnabled[opt.key] ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.hint}</p>
                      </div>
                      <Toggle on={!!optEnabled[opt.key]} onChange={v => toggleOpt(opt.key, v)} />
                    </div>
                    {optEnabled[opt.key] && (
                      <div className="mt-2">
                        <NumericInput
                          value={optAmounts[opt.key] || 0}
                          onChange={v => setOptAmt(opt.key, v)}
                          min={0}
                          step={opt.step}
                          prefix={c.symbol}
                          suffix={opt.type === 'annual' ? '/yr' : '/mo'}
                        />
                        {opt.type === 'annual' && (
                          <p className="text-xs text-slate-400 mt-1">
                            = {fmtD((optAmounts[opt.key] || 0) / 12)}/mo
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* True Monthly Cost callout */}
        {result && activeOptCount > 0 && (
          <div className="mb-6 rounded-xl border border-indigo-300 bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-indigo-800 mb-2">True Monthly Cost</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-indigo-600">Draw Phase (incl. fees)</p>
                <p className="text-lg font-bold text-indigo-900">{fmtD(result.trueMonthlyCostDraw)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-indigo-600">Repay Phase (incl. fees)</p>
                <p className="text-lg font-bold text-indigo-900">{fmtD(result.trueMonthlyCostRepay)}/mo</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`cw-tab${tab === v ? ' active' : ''}`}>
              {t(`calc.${v}`)}
            </button>
          ))}
        </div>

        {result && tab === 'summary' && (
          <ResultSimple
            metrics={[
              { label: t('heloc.availableCredit'), value: fmt(result.maxCredit), highlight: true },
              { label: t('heloc.drawPayment'), value: `${fmtD(result.drawMonthlyPayment)}/mo`, sub: 'Interest-only' },
              { label: t('heloc.repayPayment'), value: `${fmtD(result.repayMonthly)}/mo`, sub: 'P+I' },
              ...(activeOptCount > 0 ? [
                { label: 'True Cost (Draw)', value: `${fmtD(result.trueMonthlyCostDraw)}/mo`, sub: 'incl. fees' },
                { label: 'True Cost (Repay)', value: `${fmtD(result.trueMonthlyCostRepay)}/mo`, sub: 'incl. fees' },
              ] : []),
            ]}
          />
        )}

        {result && tab === 'chart' && (
          <div className="cw-card">
            <h3 className="font-semibold text-sm mb-1">HELOC Balance Over Time</h3>
            <p className="text-xs text-slate-500 mb-4">
              Draw phase ({drawPeriod} yr, interest-only) then repayment phase ({repayPeriod} yr, P+I)
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={result.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="pmtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  interval={Math.floor(result.chartData.length / 8)}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${c.symbol}${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v, name) => [fmt(v), name === 'balance' ? 'Balance' : 'Monthly Payment']}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="url(#balGrad)" strokeWidth={2} name="Balance" />
                <Area type="monotone" dataKey="payment" stroke="#22d3ee" fill="url(#pmtGrad)" strokeWidth={2} name="Monthly Payment" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-xs text-slate-500">
              <span>Draw phase: {fmtD(result.drawMonthlyPayment)}/mo (interest-only)</span>
              <span>Repay phase: {fmtD(result.repayMonthly)}/mo (P+I)</span>
              {activeOptCount > 0 && (
                <span className="text-indigo-600">+{fmtD(extraMonthlyDraw)}/mo fees</span>
              )}
            </div>
          </div>
        )}

        {result && tab === 'detailed' && (
          <ResultDetailed
            title="HELOC Breakdown"
            rows={[
              { label: 'Home Value', value: fmt(homeValue) },
              { label: 'Mortgage Balance', value: fmt(mortgageBalance) },
              { label: 'Available Credit (85% LTV)', value: fmt(result.maxCredit), bold: true },
              { label: 'Amount Drawn', value: fmt(result.actualDraw) },
              { label: 'Rate (Prime + margin)', value: `${result.rate.toFixed(2)}%` },
              { label: 'Combined LTV', value: `${result.ltv}%` },
              { label: 'Draw Period Payment (I-O)', value: fmtD(result.drawMonthlyPayment), sub: `${drawPeriod} years` },
              { label: 'Draw Period Total Interest', value: fmt(result.drawTotalInterest) },
              { label: 'Repayment Monthly Payment', value: fmtD(result.repayMonthly), sub: `${repayPeriod} years`, bold: true },
              { label: 'Repayment Total Interest', value: fmt(result.repayTotalInterest) },
              { label: 'Total Interest (all phases)', value: fmt(result.totalInterest), bold: true },
              ...(activeOptCount > 0 ? [
                { label: 'Additional Costs/mo', value: fmtD(extraMonthlyDraw) },
                { label: 'True Monthly Cost (Draw)', value: fmtD(result.trueMonthlyCostDraw), bold: true },
                { label: 'True Monthly Cost (Repay)', value: fmtD(result.trueMonthlyCostRepay), bold: true },
              ] : []),
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterValid')}
          </div>
        )}

        <CalcFAQ faqs={[
          { q: 'How much equity can I borrow against?', a: 'Most lenders allow up to 80-85% of your home value minus your mortgage balance. Example: $500k home, $300k mortgage = up to $100-125k available.' },
          { q: 'What is the draw period?', a: 'Typically 5-10 years during which you can borrow and repay freely, usually paying interest only. After this, the repayment period begins (10-20 years of P&I payments).' },
          { q: 'What does True Monthly Cost include?', a: 'True Monthly Cost adds insurance, property tax, annual fees, and other country-specific costs to your HELOC payment to show the real monthly outlay.' },
          { q: 'Is a HELOC better than a cash-out refinance?', a: 'HELOCs offer flexibility (variable credit line) but have variable rates. Cash-out refinancing gives a lump sum at a fixed rate. Best choice depends on your use case and rate environment.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/refinance`, label: 'Refinance Calculator' },
          { to: `/${country}/property-roi`, label: 'Property ROI' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
