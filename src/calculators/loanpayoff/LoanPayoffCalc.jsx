import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'

function calcPayoff({ balance, apr, minPayment, extraPayment }) {
  const monthlyRate = apr / 100 / 12
  const payment = minPayment + extraPayment
  if (balance <= 0 || monthlyRate <= 0 || payment <= 0) return null
  if (payment <= balance * monthlyRate) return null // payment doesn't cover interest

  // With extra payment
  let bal = balance
  let months = 0
  let totalInterest = 0
  while (bal > 0 && months < 600) {
    const interest = bal * monthlyRate
    const prin = Math.min(payment - interest, bal)
    totalInterest += interest
    bal -= prin
    months++
  }

  // Without extra payment (min only)
  let bal2 = balance
  let months2 = 0
  let totalInterest2 = 0
  const payment2 = minPayment
  if (payment2 > balance * monthlyRate) {
    while (bal2 > 0 && months2 < 600) {
      const interest = bal2 * monthlyRate
      const prin = Math.min(payment2 - interest, bal2)
      totalInterest2 += interest
      bal2 -= prin
      months2++
    }
  }

  const interestSaved = totalInterest2 - totalInterest
  const monthsSaved = months2 - months

  return { months, totalInterest, totalPaid: balance + totalInterest, months2, totalInterest2, interestSaved, monthsSaved }
}

const defaultsByCountry = {
  us: { balance: 25000, apr: 6.5, payment: 450 },
  ca: { balance: 25000, apr: 8.0, payment: 500 },
  uk: { balance: 20000, apr: 7.9, payment: 450 },
  au: { balance: 25000, apr: 8.5, payment: 550 },
  ie: { balance: 20000, apr: 8.5, payment: 450 },
  nz: { balance: 20000, apr: 9.0, payment: 500 },
}

export default function LoanPayoffCalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [apr, setApr] = useState(d.apr)
  const [minPayment, setMinPayment] = useState(d.payment)
  const [extraPayment, setExtraPayment] = useState(200)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcPayoff({ balance, apr, minPayment, extraPayment }),
    [balance, apr, minPayment, extraPayment]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const months2years = (m) => {
    const y = Math.floor(m / 12)
    const mo = m % 12
    return y > 0 ? `${y}y ${mo}m` : `${mo}m`
  }

  return (
    <>
      <Helmet>
        <title>Loan Payoff Calculator {c.name} 2026 — Extra Payments Savings | CalcWise</title>
        <meta name="description" content={`Calculate how extra loan payments save you interest and time in ${c.name}. See payoff date comparison with and without extra payments. Free loan payoff calculator.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/loan-payoff`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{c.flag} Loan Payoff Calculator</h1>
          <p className="text-cw-gray">See how extra payments accelerate your payoff and save interest.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Loan Balance ({c.symbol})</label>
              <input type="number" className="cw-input" value={balance} min={0} onChange={e => setBalance(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Annual Interest Rate (APR %)</label>
              <input type="number" step="0.1" className="cw-input" value={apr} min={0} onChange={e => setApr(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Regular Monthly Payment ({c.symbol})</label>
              <input type="number" className="cw-input" value={minPayment} min={0} onChange={e => setMinPayment(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Extra Monthly Payment ({c.symbol})</label>
              <input type="number" className="cw-input" value={extraPayment} min={0} onChange={e => setExtraPayment(+e.target.value)} />
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
              { label: 'Payoff Time', value: months2years(result.months), highlight: true },
              { label: 'Total Interest', value: fmt(result.totalInterest) },
              { label: 'Interest Saved', value: fmt(result.interestSaved), sub: `${months2years(result.monthsSaved)} faster` },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Payoff Comparison"
            rows={[
              { label: 'Loan Balance', value: fmt(balance) },
              { label: '— With Extra Payment', value: '', bold: true },
              { label: 'Monthly Payment', value: fmt(minPayment + extraPayment) },
              { label: 'Payoff Time', value: months2years(result.months), bold: true },
              { label: 'Total Interest Paid', value: fmt(result.totalInterest) },
              { label: 'Total Paid', value: fmt(result.totalPaid) },
              { label: '— Without Extra Payment', value: '', bold: true },
              { label: 'Payoff Time', value: result.months2 < 600 ? months2years(result.months2) : '50+ years' },
              { label: 'Total Interest', value: result.months2 < 600 ? fmt(result.totalInterest2) : 'N/A' },
              { label: 'Interest Saved', value: fmt(result.interestSaved), bold: true },
              { label: 'Time Saved', value: months2years(result.monthsSaved), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter valid loan details above to see your payoff plan.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
