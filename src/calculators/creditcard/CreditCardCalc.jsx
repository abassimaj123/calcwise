import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

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

const defaultsByCountry = {
  us: { balance: 8500, apr: 24.99 },
  ca: { balance: 5000, apr: 19.99 },
  uk: { balance: 3000, apr: 24.9 },
  au: { balance: 4000, apr: 19.99 },
  ie: { balance: 3000, apr: 22.9 },
  nz: { balance: 3000, apr: 19.95 },
}

export default function CreditCardCalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [apr, setApr] = useState(d.apr)
  const [minType, setMinType] = useState('percent')
  const [minPct, setMinPct] = useState(2)
  const [minFixed, setMinFixed] = useState(200)
  const [extraPayment, setExtraPayment] = useState(100)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcCreditCard({ balance, apr, minType, minPct, minFixed, extraPayment }),
    [balance, apr, minType, minPct, minFixed, extraPayment]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt0 = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const months2years = (m) => {
    const y = Math.floor(m / 12)
    const mo = m % 12
    return y > 0 ? `${y}y ${mo}m` : `${mo}m`
  }

  return (
    <>
      <Helmet>
        <title>Credit Card Payoff Calculator {c.name} 2026 | CalcWise</title>
        <meta name="description" content={`Calculate how long to pay off your credit card in ${c.name} and how much interest you'll pay. See savings from extra payments. Free credit card payoff calculator.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/credit-card`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{c.flag} Credit Card Payoff Calculator</h1>
          <p className="text-cw-gray">Find out when you'll be debt-free and how much interest you can save.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Current Balance ({c.symbol})</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">APR (%)</label>
              <NumericInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" />
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
                  <label className="block text-xs text-cw-gray mb-1">Min Payment % (min {c.symbol}25)</label>
                  <NumericInput value={minPct} onChange={setMinPct} min={1} step={0.5} suffix="%" />
                </>
              ) : (
                <>
                  <label className="block text-xs text-cw-gray mb-1">Fixed Monthly Payment ({c.symbol})</label>
                  <NumericInput value={minFixed} onChange={setMinFixed} min={25} step={50} prefix={c.symbol} />
                </>
              )}
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Extra Monthly Payment ({c.symbol})</label>
              <NumericInput value={extraPayment} onChange={setExtraPayment} min={0} step={50} prefix={c.symbol} />
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
