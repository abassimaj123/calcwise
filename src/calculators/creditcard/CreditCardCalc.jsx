import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'

function calcCreditCard({ balance, apr, minType, minPct, minFixed, extraPayment }) {
  const monthlyRate = apr / 100 / 12
  if (balance <= 0 || monthlyRate <= 0) return null

  function simulate(extra) {
    let bal = balance
    let months = 0
    let totalInterest = 0
    let totalPaid = 0

    while (bal > 0.01 && months < 1200) {
      const interest = bal * monthlyRate
      let payment = extra
      if (minType === 'percent') {
        payment = Math.max(bal * (minPct / 100), 25) + extra
      } else {
        payment = minFixed + extra
      }
      payment = Math.min(payment, bal + interest)
      if (payment <= interest) break // trapped in debt

      totalInterest += interest
      totalPaid += payment
      bal = bal + interest - payment
      months++
    }
    return { months, totalInterest, totalPaid }
  }

  const withExtra = simulate(extraPayment)
  const withoutExtra = simulate(0)

  const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest
  const monthsSaved = withoutExtra.months - withExtra.months

  return { ...withExtra, interestSaved, monthsSaved, totalInterestNoExtra: withoutExtra.totalInterest }
}

export default function CreditCardCalc({ country = 'us' }) {
  const [balance, setBalance] = useState(8500)
  const [apr, setApr] = useState(24.99)
  const [minType, setMinType] = useState('percent')
  const [minPct, setMinPct] = useState(2)
  const [minFixed, setMinFixed] = useState(200)
  const [extraPayment, setExtraPayment] = useState(100)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcCreditCard({ balance, apr, minType, minPct, minFixed, extraPayment }),
    [balance, apr, minType, minPct, minFixed, extraPayment]
  )

  const fmt = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const fmt0 = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const months2years = (m) => {
    const y = Math.floor(m / 12)
    const mo = m % 12
    return y > 0 ? `${y}y ${mo}m` : `${mo}m`
  }

  return (
    <>
      <Helmet>
        <title>Credit Card Payoff Calculator US 2026 | CalcWise</title>
        <meta name="description" content="Calculate how long to pay off your credit card and how much interest you'll pay. See savings from extra payments. Free US credit card payoff calculator." />
        <link rel="canonical" href="https://calqwise.com/us/credit-card" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">💳 Credit Card Payoff Calculator</h1>
          <p className="text-cw-gray">Find out when you'll be debt-free and how much interest you can save.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Current Balance ($)</label>
              <input type="number" className="cw-input" value={balance} min={0} onChange={e => setBalance(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">APR (%)</label>
              <input type="number" step="0.01" className="cw-input" value={apr} min={0} onChange={e => setApr(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Minimum Payment Type</label>
              <select className="cw-input" value={minType} onChange={e => setMinType(e.target.value)}>
                <option value="percent">% of Balance</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              {minType === 'percent' ? (
                <>
                  <label className="block text-xs text-cw-gray mb-1">Min Payment % (min $25)</label>
                  <input type="number" step="0.5" className="cw-input" value={minPct} min={1} onChange={e => setMinPct(+e.target.value)} />
                </>
              ) : (
                <>
                  <label className="block text-xs text-cw-gray mb-1">Fixed Monthly Payment ($)</label>
                  <input type="number" className="cw-input" value={minFixed} min={25} onChange={e => setMinFixed(+e.target.value)} />
                </>
              )}
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Extra Monthly Payment ($)</label>
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
              { label: 'Total Interest', value: fmt0(result.totalInterest) },
              { label: 'Interest Saved', value: fmt0(result.interestSaved), sub: `${months2years(result.monthsSaved)} faster` },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Payoff Details"
            rows={[
              { label: 'Balance', value: fmt0(balance) },
              { label: 'APR', value: `${apr}%` },
              { label: 'Payoff Time', value: months2years(result.months), bold: true },
              { label: 'Total Interest', value: fmt0(result.totalInterest) },
              { label: 'Total Paid', value: fmt(result.totalPaid), bold: true },
              { label: 'vs. No Extra Payment', value: '', bold: false },
              { label: 'Interest Without Extra', value: fmt0(result.totalInterestNoExtra) },
              { label: 'Interest Saved', value: fmt0(result.interestSaved), bold: true },
              { label: 'Time Saved', value: months2years(result.monthsSaved), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your credit card details above.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
