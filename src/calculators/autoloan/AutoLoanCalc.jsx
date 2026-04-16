import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import NumericInput from '../../components/NumericInput'

function calcAutoLoan({ vehiclePrice, downPayment, tradeIn, apr, termMonths, salesTaxRate }) {
  const taxAmount = vehiclePrice * (salesTaxRate / 100)
  const loanAmount = vehiclePrice + taxAmount - downPayment - tradeIn
  if (loanAmount <= 0 || apr <= 0 || termMonths <= 0) return null

  const monthlyRate = apr / 100 / 12
  const monthly = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  const totalPaid = monthly * termMonths
  const totalInterest = totalPaid - loanAmount
  const biWeekly = (monthly * 12) / 26

  return { loanAmount, monthly, biWeekly, totalInterest, totalPaid, taxAmount }
}

const defaults = {
  us: { price: 35000, down: 5000, tradeIn: 3000, apr: 7.5, term: 60, taxRate: 7.0 },
  ca: { price: 40000, down: 5000, tradeIn: 3000, apr: 6.9, term: 60, taxRate: 13.0 },
  uk: { price: 25000, down: 3000, tradeIn: 2000, apr: 8.5, term: 48, taxRate: 0 },
  au: { price: 40000, down: 5000, tradeIn: 3000, apr: 7.5, term: 60, taxRate: 0 },
  ie: { price: 30000, down: 5000, tradeIn: 2000, apr: 7.9, term: 60, taxRate: 0 },
  nz: { price: 35000, down: 5000, tradeIn: 2000, apr: 9.5, term: 60, taxRate: 0 },
}

const termOptions = [24, 36, 48, 60, 72, 84]

export default function AutoLoanCalc({ country }) {
  const c = countries[country]
  const d = defaults[country] || defaults.us

  const [price, setPrice] = useState(d.price)
  const [down, setDown] = useState(d.down)
  const [tradeIn, setTradeIn] = useState(d.tradeIn)
  const [apr, setApr] = useState(d.apr)
  const [term, setTerm] = useState(d.term)
  const [taxRate, setTaxRate] = useState(d.taxRate)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcAutoLoan({ vehiclePrice: price, downPayment: down, tradeIn, apr, termMonths: term, salesTaxRate: taxRate }),
    [price, down, tradeIn, apr, term, taxRate]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const pageTitle = `${c.name} Auto Loan Calculator 2026 | Monthly Payment | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} auto loan calculator. Calculate monthly car payment, total interest, and total cost. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/autoloan`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Auto Loan Calculator
          </h1>
          <p className="text-cw-gray">Calculate your monthly car payment, total interest and true cost.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Vehicle Price ({c.symbol})</label>
              <NumericInput value={price} onChange={setPrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Down Payment ({c.symbol})</label>
              <NumericInput value={down} onChange={setDown} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Trade-In Value ({c.symbol})</label>
              <NumericInput value={tradeIn} onChange={setTradeIn} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">APR (%)</label>
              <NumericInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Loan Term</label>
              <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                {termOptions.map(t => (
                  <option key={t} value={t}>{t} months ({(t / 12).toFixed(1)} yr)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">
                {country === 'ca' ? 'HST/GST+PST (%)' : (country === 'uk' || country === 'au' || country === 'ie' || country === 'nz') ? 'Tax (included in price)' : 'Sales Tax (%)'}
              </label>
              <NumericInput value={taxRate} onChange={setTaxRate} min={0} step={0.1} suffix="%" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['simple', 'detailed'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                view === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {result && view === 'simple' && (
          <ResultSimple
            metrics={[
              { label: 'Monthly Payment', value: fmtD(result.monthly), highlight: true },
              { label: 'Total Interest', value: fmt(result.totalInterest) },
              { label: 'Total Cost', value: fmt(result.totalPaid) },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Auto Loan Breakdown"
            rows={[
              { label: 'Vehicle Price', value: fmt(price) },
              result.taxAmount > 0 && { label: 'Tax Amount', value: fmt(result.taxAmount) },
              { label: 'Down Payment', value: `-${fmt(down)}` },
              tradeIn > 0 && { label: 'Trade-In Value', value: `-${fmt(tradeIn)}` },
              { label: 'Loan Amount', value: fmt(result.loanAmount), bold: true },
              { label: 'Monthly Payment', value: fmtD(result.monthly), bold: true },
              { label: 'Bi-Weekly Payment', value: fmtD(result.biWeekly) },
              { label: 'Total Interest', value: fmt(result.totalInterest) },
              { label: 'Total of All Payments', value: fmt(result.totalPaid), bold: true },
            ].filter(Boolean)}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter valid values above to see your results.
          </div>
        )}

        <AppDownloadBanner calcKey="autoloan" country={country} />
        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
