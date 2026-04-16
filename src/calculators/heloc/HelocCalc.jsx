import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const PRIME_RATE = 8.5 // Current US prime rate estimate

function calcHELOC({ homeValue, mortgageBalance, margin, drawAmount, drawPeriodYears, repayPeriodYears }) {
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

  // Build balance chart data (yearly)
  const chartData = []
  // Draw phase: balance stays at actualDraw (interest-only)
  for (let y = 0; y <= drawPeriodYears; y++) {
    chartData.push({
      year: `Yr ${y}`,
      balance: Math.round(actualDraw),
      payment: Math.round(drawMonthlyPayment),
      phase: 'Draw',
    })
  }
  // Repayment phase: amortising balance
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
    maxCredit, actualDraw, rate, drawMonthlyPayment, repayMonthly, drawTotalInterest,
    repayTotalInterest, totalInterest, chartData,
    ltv: ((mortgageBalance + actualDraw) / homeValue * 100).toFixed(1),
  }
}

export default function HelocCalc({ country = 'us' }) {
  const [homeValue, setHomeValue] = useState(500000)
  const [mortgageBalance, setMortgageBalance] = useState(300000)
  const [margin, setMargin] = useState(0.5)
  const [drawAmount, setDrawAmount] = useState(80000)
  const [drawPeriod, setDrawPeriod] = useState(10)
  const [repayPeriod, setRepayPeriod] = useState(20)
  const [tab, setTab] = useState('summary')

  const result = useMemo(
    () => calcHELOC({ homeValue, mortgageBalance, margin, drawAmount, drawPeriodYears: drawPeriod, repayPeriodYears: repayPeriod }),
    [homeValue, mortgageBalance, margin, drawAmount, drawPeriod, repayPeriod]
  )

  const fmt = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HELOC Calculator US 2026',
    url: `https://calqwise.com/${country}/heloc`,
    applicationCategory: 'FinanceApplication',
    description: 'Calculate your HELOC available credit, draw period payments, and full repayment phase schedule.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <Helmet>
        <title>HELOC Calculator US 2026 — Home Equity Line of Credit | CalcWise</title>
        <meta name="description" content="Calculate your HELOC available credit, draw period payments, and repayment schedule. Free US HELOC calculator with Prime + margin rate. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/heloc" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">HELOC Calculator</h1>
          <p className="text-cw-gray">Calculate available credit, draw period payments, and repayment schedule.</p>
          <p className="text-xs text-cw-gray mt-2">Prime Rate: {PRIME_RATE}% (estimate)</p>
        </div>

        <CalcIntro
          intro="A HELOC (Home Equity Line of Credit) lets you borrow against your home's equity. This calculator shows your available credit, interest-only draw period payments, and full repayment phase payments."
          hiddenCost="Repayment phase payments can be 2-3x the draw phase amount"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Home Value ($)</label>
              <NumericInput value={homeValue} onChange={setHomeValue} min={0} step={1000} prefix="$" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Mortgage Balance ($)</label>
              <NumericInput value={mortgageBalance} onChange={setMortgageBalance} min={0} step={1000} prefix="$" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Margin above Prime (%)</label>
              <NumericInput value={margin} onChange={setMargin} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Amount to Draw ($)</label>
              <NumericInput value={drawAmount} onChange={setDrawAmount} min={0} step={1000} max={result?.maxCredit || undefined} prefix="$" />
              {result && <p className="text-xs text-cw-gray mt-1">Max available: {fmt(result.maxCredit)}</p>}
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Draw Period (years)</label>
              <select className="cw-input" value={drawPeriod} onChange={e => setDrawPeriod(+e.target.value)}>
                {[5, 10, 15].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Repayment Period (years)</label>
              <select className="cw-input" value={repayPeriod} onChange={e => setRepayPeriod(+e.target.value)}>
                {[10, 15, 20].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                tab === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {result && tab === 'summary' && (
          <ResultSimple
            metrics={[
              { label: 'Available Credit', value: fmt(result.maxCredit), highlight: true },
              { label: 'Draw Period Payment', value: `${fmtD(result.drawMonthlyPayment)}/mo`, sub: 'Interest-only' },
              { label: 'Repayment Payment', value: `${fmtD(result.repayMonthly)}/mo`, sub: 'P+I' },
            ]}
          />
        )}

        {result && tab === 'chart' && (
          <div className="cw-card">
            <h3 className="font-semibold text-sm mb-1">HELOC Balance Over Time</h3>
            <p className="text-xs text-cw-gray mb-4">
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
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v, name) => [`$${v.toLocaleString()}`, name === 'balance' ? 'Balance' : 'Monthly Payment']}
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="url(#balGrad)" strokeWidth={2} name="Balance" />
                <Area type="monotone" dataKey="payment" stroke="#22d3ee" fill="url(#pmtGrad)" strokeWidth={2} name="Monthly Payment" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 text-xs text-cw-gray">
              <span>Draw phase: {fmtD(result.drawMonthlyPayment)}/mo (interest-only)</span>
              <span>Repay phase: {fmtD(result.repayMonthly)}/mo (P+I)</span>
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
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your home details above. You need at least 15% equity (85% LTV limit).
          </div>
        )}

        <CalcFAQ faqs={[
          { q: 'How much equity can I borrow against?', a: 'Most lenders allow up to 80-85% of your home value minus your mortgage balance. Example: $500k home, $300k mortgage = up to $100-125k available.' },
          { q: 'What is the draw period?', a: 'Typically 5-10 years during which you can borrow and repay freely, usually paying interest only. After this, the repayment period begins (10-20 years of P&I payments).' },
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
