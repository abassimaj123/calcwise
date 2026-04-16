import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'

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

  return {
    maxCredit, actualDraw, rate, drawMonthlyPayment, repayMonthly, drawTotalInterest,
    repayTotalInterest, totalInterest, ltv: ((mortgageBalance + actualDraw) / homeValue * 100).toFixed(1),
  }
}

export default function HelocCalc({ country = 'us' }) {
  const [homeValue, setHomeValue] = useState(500000)
  const [mortgageBalance, setMortgageBalance] = useState(300000)
  const [margin, setMargin] = useState(0.5)
  const [drawAmount, setDrawAmount] = useState(80000)
  const [drawPeriod, setDrawPeriod] = useState(10)
  const [repayPeriod, setRepayPeriod] = useState(20)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcHELOC({ homeValue, mortgageBalance, margin, drawAmount, drawPeriodYears: drawPeriod, repayPeriodYears: repayPeriod }),
    [homeValue, mortgageBalance, margin, drawAmount, drawPeriod, repayPeriod]
  )

  const fmt = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <>
      <Helmet>
        <title>HELOC Calculator US 2026 — Home Equity Line of Credit | CalcWise</title>
        <meta name="description" content="Calculate your HELOC available credit, draw period payments, and repayment schedule. Free US HELOC calculator with Prime + margin rate. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/heloc" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">🏦 HELOC Calculator</h1>
          <p className="text-cw-gray">Calculate available credit, draw period payments, and repayment schedule.</p>
          <p className="text-xs text-cw-gray mt-2">Prime Rate: {PRIME_RATE}% (estimate)</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Home Value ($)</label>
              <input type="number" className="cw-input" value={homeValue} min={0} onChange={e => setHomeValue(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Mortgage Balance ($)</label>
              <input type="number" className="cw-input" value={mortgageBalance} min={0} onChange={e => setMortgageBalance(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Margin above Prime (%)</label>
              <input type="number" step="0.25" className="cw-input" value={margin} min={0} onChange={e => setMargin(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Amount to Draw ($)</label>
              <input type="number" className="cw-input" value={drawAmount} min={0}
                max={result?.maxCredit || undefined}
                onChange={e => setDrawAmount(+e.target.value)} />
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
          {['simple', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                view === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {result && view === 'simple' && (
          <ResultSimple
            metrics={[
              { label: 'Available Credit', value: fmt(result.maxCredit), highlight: true },
              { label: 'Draw Period Payment', value: `${fmtD(result.drawMonthlyPayment)}/mo`, sub: 'Interest-only' },
              { label: 'Repayment Payment', value: `${fmtD(result.repayMonthly)}/mo`, sub: 'P+I' },
            ]}
          />
        )}

        {result && view === 'detailed' && (
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

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
