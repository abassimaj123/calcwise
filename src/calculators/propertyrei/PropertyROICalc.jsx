import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

function calcPropertyROI({ purchasePrice, downPayment, monthlyRent, expensePct, managementPct, vacancyRate, mortgageRate }) {
  if (purchasePrice <= 0 || monthlyRent <= 0) return null

  const loanAmount = purchasePrice - downPayment
  const monthlyRate = mortgageRate / 100 / 12
  const n = 30 * 12
  const mortgagePayment = loanAmount > 0 && mortgageRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : 0

  const effectiveRent = monthlyRent * (1 - vacancyRate / 100)
  const annualRent = effectiveRent * 12
  const annualExpenses = annualRent * (expensePct / 100)
  const managementCost = annualRent * (managementPct / 100)
  const annualMortgage = mortgagePayment * 12
  const noi = annualRent - annualExpenses - managementCost  // Net Operating Income
  const annualCashFlow = noi - annualMortgage
  const monthlyCashFlow = annualCashFlow / 12
  const capRate = (noi / purchasePrice) * 100
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0
  const grossYield = (monthlyRent * 12 / purchasePrice) * 100

  return {
    mortgagePayment, effectiveRent, annualRent, annualExpenses, managementCost,
    noi, annualCashFlow, monthlyCashFlow, capRate, cashOnCash, grossYield,
    annualMortgage,
  }
}

const defaultsByCountry = {
  us: { price: 350000, downPct: 25, rent: 2200, rate: 7.0 },
  ca: { price: 600000, downPct: 25, rent: 2500, rate: 6.5 },
  uk: { price: 285000, downPct: 25, rent: 1400, rate: 5.5 },
  au: { price: 650000, downPct: 20, rent: 2500, rate: 6.5 },
  ie: { price: 350000, downPct: 20, rent: 1800, rate: 5.0 },
  nz: { price: 650000, downPct: 20, rent: 2800, rate: 7.0 },
}

export default function PropertyROICalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [price, setPrice] = useState(d.price)
  const [down, setDown] = useState(Math.round(d.price * d.downPct / 100))
  const [rent, setRent] = useState(d.rent)
  const [expenses, setExpenses] = useState(30)
  const [management, setManagement] = useState(10)
  const [vacancy, setVacancy] = useState(5)
  const [mortgageRate, setMortgageRate] = useState(d.rate)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcPropertyROI({ purchasePrice: price, downPayment: down, monthlyRent: rent, expensePct: expenses, managementPct: management, vacancyRate: vacancy, mortgageRate }),
    [price, down, rent, expenses, management, vacancy, mortgageRate]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const pct = (n) => `${n.toFixed(2)}%`

  return (
    <>
      <Helmet>
        <title>Property ROI Calculator {c.name} 2026 — Cash Flow & Cap Rate | CalcWise</title>
        <meta name="description" content={`Calculate rental property ROI, cash-on-cash return, cap rate, and monthly cash flow in ${c.name}. Free investment property calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/property-roi`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Property ROI Calculator</h1>
          <p className="text-cw-gray">Calculate cash flow, cap rate, and return on your rental property.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Purchase Price ({c.symbol})</label>
              <NumericInput value={price} onChange={setPrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Down Payment ({c.symbol})</label>
              <NumericInput value={down} onChange={setDown} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Monthly Rent ({c.symbol})</label>
              <NumericInput value={rent} onChange={setRent} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Mortgage Rate (%)</label>
              <NumericInput value={mortgageRate} onChange={setMortgageRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Operating Expenses (% of rent)</label>
              <NumericInput value={expenses} onChange={setExpenses} min={0} max={100} step={1} suffix="%" />
              <p className="text-xs text-cw-gray mt-1">Taxes, insurance, maintenance</p>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Property Mgmt (% of rent)</label>
              <NumericInput value={management} onChange={setManagement} min={0} max={100} step={1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Vacancy Rate (%)</label>
              <NumericInput value={vacancy} onChange={setVacancy} min={0} max={100} step={1} suffix="%" />
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
                label: 'Monthly Cash Flow',
                value: fmtD(result.monthlyCashFlow),
                highlight: true,
                sub: result.monthlyCashFlow >= 0 ? '✓ Positive' : '⚠ Negative',
              },
              { label: 'Cash-on-Cash Return', value: pct(result.cashOnCash) },
              { label: 'Cap Rate', value: pct(result.capRate) },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Investment Analysis"
            rows={[
              { label: 'Monthly Rent', value: fmtD(rent) },
              { label: 'Effective Rent (after vacancy)', value: fmtD(result.effectiveRent) },
              { label: 'Annual Gross Rent', value: fmt(result.annualRent) },
              { label: 'Operating Expenses', value: `-${fmt(result.annualExpenses)}` },
              { label: 'Management Cost', value: `-${fmt(result.managementCost)}` },
              { label: 'Net Operating Income (NOI)', value: fmt(result.noi), bold: true },
              { label: 'Annual Mortgage', value: `-${fmt(result.annualMortgage)}` },
              { label: 'Annual Cash Flow', value: fmt(result.annualCashFlow), bold: true },
              { label: 'Monthly Cash Flow', value: fmtD(result.monthlyCashFlow), bold: true },
              { label: 'Gross Yield', value: pct(result.grossYield) },
              { label: 'Cap Rate', value: pct(result.capRate) },
              { label: 'Cash-on-Cash Return', value: pct(result.cashOnCash), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your property details above.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
