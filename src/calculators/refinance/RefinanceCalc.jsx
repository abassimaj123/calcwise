import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'

function calcRefinance({ currentBalance, currentRate, remainingMonths, newRate, newTermYears, closingCosts }) {
  const currentMonthlyRate = currentRate / 100 / 12
  const newMonthlyRate = newRate / 100 / 12
  const n = newTermYears * 12

  if (currentBalance <= 0 || currentMonthlyRate <= 0 || newMonthlyRate <= 0) return null

  // Current payment
  const currentPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, remainingMonths)) / (Math.pow(1 + currentMonthlyRate, remainingMonths) - 1)

  // New payment
  const newPayment = currentBalance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, n)) / (Math.pow(1 + newMonthlyRate, n) - 1)

  const monthlySavings = currentPayment - newPayment
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity

  const currentTotalRemaining = currentPayment * remainingMonths
  const newTotal = newPayment * n + closingCosts
  const lifetimeSavings = currentTotalRemaining - newTotal

  return {
    currentPayment, newPayment, monthlySavings, breakEvenMonths,
    currentTotalRemaining, newTotal, lifetimeSavings,
  }
}

export default function RefinanceCalc({ country = 'us' }) {
  const [balance, setBalance] = useState(320000)
  const [currentRate, setCurrentRate] = useState(7.5)
  const [remainingYears, setRemainingYears] = useState(25)
  const [newRate, setNewRate] = useState(6.5)
  const [newTerm, setNewTerm] = useState(30)
  const [closingCosts, setClosingCosts] = useState(6000)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcRefinance({ currentBalance: balance, currentRate, remainingMonths: remainingYears * 12, newRate, newTermYears: newTerm, closingCosts }),
    [balance, currentRate, remainingYears, newRate, newTerm, closingCosts]
  )

  const fmt = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <>
      <Helmet>
        <title>Refinance Calculator US 2026 — Break-Even & Monthly Savings | CalcWise</title>
        <meta name="description" content="Calculate mortgage refinance savings, break-even point, and lifetime savings. Free US refinance calculator. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/refinance" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">🔄 Refinance Calculator</h1>
          <p className="text-cw-gray">Is it worth refinancing? Find your break-even point and lifetime savings.</p>
        </div>

        <div className="cw-card mb-6">
          <h3 className="text-sm text-cw-gray uppercase tracking-wider mb-4">Current Mortgage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Outstanding Balance ($)</label>
              <input type="number" className="cw-input" value={balance} min={0} onChange={e => setBalance(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Current Rate (%)</label>
              <input type="number" step="0.1" className="cw-input" value={currentRate} min={0} onChange={e => setCurrentRate(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Remaining Term (years)</label>
              <select className="cw-input" value={remainingYears} onChange={e => setRemainingYears(+e.target.value)}>
                {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
          </div>

          <h3 className="text-sm text-cw-gray uppercase tracking-wider mb-4 mt-6">New Mortgage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">New Rate (%)</label>
              <input type="number" step="0.1" className="cw-input" value={newRate} min={0} onChange={e => setNewRate(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">New Term (years)</label>
              <select className="cw-input" value={newTerm} onChange={e => setNewTerm(+e.target.value)}>
                {[10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Closing Costs ($)</label>
              <input type="number" className="cw-input" value={closingCosts} min={0} onChange={e => setClosingCosts(+e.target.value)} />
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
              {
                label: 'Break-Even Point',
                value: result.breakEvenMonths === Infinity ? 'Never' : `${result.breakEvenMonths} mo`,
                highlight: true,
                sub: result.breakEvenMonths < Infinity ? `≈ ${(result.breakEvenMonths / 12).toFixed(1)} years` : 'Rate too high',
              },
              { label: 'Monthly Savings', value: fmtD(result.monthlySavings) },
              { label: 'Lifetime Savings', value: fmt(result.lifetimeSavings) },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Refinance Analysis"
            rows={[
              { label: 'Current Monthly Payment', value: fmtD(result.currentPayment) },
              { label: 'New Monthly Payment', value: fmtD(result.newPayment), bold: true },
              { label: 'Monthly Savings', value: fmtD(result.monthlySavings), bold: true },
              { label: 'Closing Costs', value: fmt(closingCosts) },
              { label: 'Break-Even Point', value: result.breakEvenMonths === Infinity ? 'Never' : `${result.breakEvenMonths} months`, bold: true },
              { label: 'Remaining Payments (current)', value: fmt(result.currentTotalRemaining) },
              { label: 'Total New Mortgage Cost', value: fmt(result.newTotal) },
              { label: 'Lifetime Savings', value: fmt(result.lifetimeSavings), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your current and new mortgage details above.
          </div>
        )}

        <div className="mt-4 p-3 bg-white/[0.03] rounded-lg text-xs text-cw-gray">
          ℹ️ This calculator assumes you refinance the full remaining balance. Actual closing costs vary by lender and location. Rate buydowns and lender credits not included.
        </div>

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
