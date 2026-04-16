import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

function calcRentVsBuy({ homePrice, downPayment, mortgageRate, termYears, monthlyRent, rentIncrease, homeAppreciation }) {
  const principal = homePrice - downPayment
  const monthlyRate = mortgageRate / 100 / 12
  const n = termYears * 12

  if (principal <= 0 || monthlyRate <= 0) return null

  const mortgage = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const propertyTaxMonthly = homePrice * 0.012 / 12
  const insuranceMonthly = homePrice * 0.003 / 12
  const maintenanceMonthly = homePrice * 0.01 / 12
  const totalBuyCostMonthly = mortgage + propertyTaxMonthly + insuranceMonthly + maintenanceMonthly

  // Find break-even year
  let buyWealth = -downPayment
  let rentWealth = 0
  let investedDown = downPayment
  let cumulativeRent = 0
  let cumulativeBuyCost = 0
  let currentRent = monthlyRent
  let homeValue = homePrice
  let mortgageBalance = principal
  let breakEvenYear = null

  const yearlyData = []

  for (let year = 1; year <= termYears; year++) {
    for (let m = 0; m < 12; m++) {
      const interest = mortgageBalance * monthlyRate
      const principalPayment = mortgage - interest
      mortgageBalance -= principalPayment
      cumulativeRent += currentRent
      cumulativeBuyCost += totalBuyCostMonthly
    }
    homeValue *= (1 + homeAppreciation / 100)
    currentRent *= (1 + rentIncrease / 100)
    investedDown *= 1.07 // 7% investment return on down payment

    const buyEquity = homeValue - Math.max(0, mortgageBalance)
    rentWealth = investedDown - cumulativeRent

    if (buyEquity > rentWealth && breakEvenYear === null) {
      breakEvenYear = year
    }

    yearlyData.push({
      year,
      homeValue: Math.round(homeValue),
      buyEquity: Math.round(buyEquity),
      rentWealth: Math.round(rentWealth),
      isBetter: buyEquity > rentWealth,
    })
  }

  return {
    mortgage, totalBuyCostMonthly, breakEvenYear,
    finalHomeValue: Math.round(homeValue),
    finalBuyEquity: Math.round(yearlyData[yearlyData.length - 1]?.buyEquity || 0),
    finalRentWealth: Math.round(yearlyData[yearlyData.length - 1]?.rentWealth || 0),
    yearlyData,
  }
}

export default function RentVsBuyCalc({ country }) {
  const c = countries[country]

  const [homePrice, setHomePrice] = useState(country === 'ca' ? 600000 : country === 'uk' ? 350000 : 400000)
  const [downPayment, setDownPayment] = useState(country === 'ca' ? 120000 : country === 'uk' ? 70000 : 80000)
  const [rate, setRate] = useState(country === 'ca' ? 5.0 : country === 'uk' ? 4.5 : 7.0)
  const [term, setTerm] = useState(25)
  const [rent, setRent] = useState(country === 'ca' ? 2500 : country === 'uk' ? 1800 : 2000)
  const [rentIncrease, setRentIncrease] = useState(3)
  const [appreciation, setAppreciation] = useState(4)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcRentVsBuy({ homePrice, downPayment, mortgageRate: rate, termYears: term, monthlyRent: rent, rentIncrease, homeAppreciation: appreciation }),
    [homePrice, downPayment, rate, term, rent, rentIncrease, appreciation]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const pageTitle = `${c.name} Rent vs Buy Calculator 2026 — Break-Even Year | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Should you rent or buy in ${c.name}? Find your break-even year with our free calculator. Compare wealth building over time. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/rent-vs-buy`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.flag} {c.name} Rent vs Buy Calculator
          </h1>
          <p className="text-cw-gray">Find the year when buying becomes financially smarter than renting.</p>
        </div>

        <div className="cw-card mb-6">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-cw-gray">Buying Scenario</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Home Price ({c.symbol})</label>
              <NumericInput value={homePrice} onChange={setHomePrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Down Payment ({c.symbol})</label>
              <NumericInput value={downPayment} onChange={setDownPayment} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Mortgage Rate (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Loan Term (years)</label>
              <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                {[15, 20, 25, 30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Home Appreciation (%/yr)</label>
              <NumericInput value={appreciation} onChange={setAppreciation} min={0} step={0.1} suffix="%" />
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-4 text-sm uppercase tracking-wider text-cw-gray">Renting Scenario</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Monthly Rent ({c.symbol})</label>
              <NumericInput value={rent} onChange={setRent} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Annual Rent Increase (%)</label>
              <NumericInput value={rentIncrease} onChange={setRentIncrease} min={0} step={0.1} suffix="%" />
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
          <>
            <div className="cw-card text-center border-primary/40 bg-primary/10 mb-4">
              <p className="text-cw-gray text-sm mb-2">Break-Even Year</p>
              <p className="text-6xl font-display font-bold text-white">
                {result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'Never'}
              </p>
              <p className="text-cw-gray text-sm mt-2">
                {result.breakEvenYear
                  ? `Buying beats renting after ${result.breakEvenYear} years`
                  : `Renting is better over the full ${term}-year period`}
              </p>
            </div>
            <ResultSimple
              metrics={[
                { label: `Buy Equity (Year ${term})`, value: fmt(result.finalBuyEquity) },
                { label: `Rent Wealth (Year ${term})`, value: fmt(result.finalRentWealth) },
                { label: 'Monthly Mortgage Cost', value: fmtD(result.totalBuyCostMonthly) },
              ]}
            />
          </>
        )}

        {result && view === 'detailed' && (
          <>
            <ResultDetailed
              title="Year-by-Year Comparison (every 5 years)"
              rows={result.yearlyData.filter(r => r.year % 5 === 0 || r.year === 1).map(r => ({
                label: `Year ${r.year}`,
                value: fmt(r.buyEquity),
                sub: `Rent wealth: ${fmt(r.rentWealth)} | Home value: ${fmt(r.homeValue)}`,
                bold: r.isBetter,
              }))}
            />
          </>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter valid values above to compare renting vs buying.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
