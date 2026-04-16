import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

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
  const chartData = []

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

    // For cost chart: cumulative cost of renting vs buying
    chartData.push({
      year,
      Renting: Math.round(cumulativeRent),
      Buying: Math.round(cumulativeBuyCost + downPayment),
    })
  }

  // Year 5 data for pie
  const y5 = yearlyData[4] || yearlyData[yearlyData.length - 1]
  const year5RentPaid = chartData[4]?.Renting || 0
  const year5Equity = y5?.buyEquity || 0

  return {
    mortgage, totalBuyCostMonthly, breakEvenYear,
    finalHomeValue: Math.round(homeValue),
    finalBuyEquity: Math.round(yearlyData[yearlyData.length - 1]?.buyEquity || 0),
    finalRentWealth: Math.round(yearlyData[yearlyData.length - 1]?.rentWealth || 0),
    yearlyData,
    chartData,
    year5RentPaid,
    year5Equity,
  }
}

const COLORS = { buy: '#3b82f6', rent: '#f97316' }

const currencyFormatter = (locale, currency) => (val) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(val)

export default function RentVsBuyCalc({ country }) {
  const c = countries[country]

  const [homePrice, setHomePrice] = useState(country === 'ca' ? 600000 : country === 'uk' ? 350000 : 400000)
  const [downPayment, setDownPayment] = useState(country === 'ca' ? 120000 : country === 'uk' ? 70000 : 80000)
  const [rate, setRate] = useState(country === 'ca' ? 5.0 : country === 'uk' ? 4.5 : 7.0)
  const [term, setTerm] = useState(25)
  const [rent, setRent] = useState(country === 'ca' ? 2500 : country === 'uk' ? 1800 : 2000)
  const [rentIncrease, setRentIncrease] = useState(3)
  const [appreciation, setAppreciation] = useState(4)
  const [view, setView] = useState('summary')

  const result = useMemo(
    () => calcRentVsBuy({ homePrice, downPayment, mortgageRate: rate, termYears: term, monthlyRent: rent, rentIncrease, homeAppreciation: appreciation }),
    [homePrice, downPayment, rate, term, rent, rentIncrease, appreciation]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const fmtAxis = currencyFormatter(c.locale, c.currency)

  const pageTitle = `${c.name} Rent vs Buy Calculator 2026 — Break-Even Year | CalcWise`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${c.name} Rent vs Buy Calculator`,
    url: `https://calqwise.com/${country}/rent-vs-buy`,
    description: `Compare the true cost of renting vs buying in ${c.name}. Find your break-even year with cumulative cost charts.`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  const pie5Data = result
    ? [
        { name: 'Rent Paid (5 yr)', value: result.year5RentPaid },
        { name: 'Equity Built (5 yr)', value: Math.max(0, result.year5Equity) },
      ]
    : []

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Should you rent or buy in ${c.name}? Find your break-even year with our free calculator. Compare wealth building over time. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/rent-vs-buy`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Rent vs Buy Calculator
          </h1>
          <p className="text-cw-gray">Find the year when buying becomes financially smarter than renting.</p>
        </div>

        <CalcIntro
          intro="The rent vs buy calculator compares the true total cost of renting versus buying a home over time. It accounts for mortgage payments, property appreciation, rent increases, tax benefits, and opportunity cost of your down payment."
          hiddenCost="Opportunity cost of down payment is often ignored"
        />

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

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
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

        {/* Summary tab */}
        {result && view === 'summary' && (
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

        {/* Chart tab */}
        {result && view === 'chart' && (
          <>
            {/* Break-even metric card */}
            <div className="cw-card text-center border-primary/40 bg-primary/10 mb-6">
              <p className="text-cw-gray text-sm mb-1">Break-Even Year</p>
              <p className="text-5xl font-display font-bold text-white">
                {result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'Never'}
              </p>
              <p className="text-cw-gray text-xs mt-1">
                {result.breakEvenYear
                  ? `After year ${result.breakEvenYear}, cumulative buying costs become lower than renting`
                  : 'Renting remains cheaper over the full period'}
              </p>
            </div>

            {/* Cumulative cost comparison line chart */}
            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-cw-gray">
                Cumulative Cost: Renting vs Buying (30 Years)
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={result.chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Year', position: 'insideBottom', offset: -2, fill: '#94a3b8' }}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(v) => fmtAxis(v)}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(val, name) => [fmt(val), name]}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: 8 }} />
                  <Line
                    type="monotone"
                    dataKey="Renting"
                    stroke={COLORS.rent}
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Buying"
                    stroke={COLORS.buy}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-cw-gray mt-2 text-center">
                Lines cross at break-even. Rent increases {rentIncrease}%/yr. Buy cost includes mortgage, tax, insurance &amp; maintenance.
              </p>
            </div>

            {/* Year 5 Pie Chart */}
            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-cw-gray">
                Year 5 Snapshot: Rent Paid vs Equity Built
              </h3>
              {pie5Data[0].value > 0 || pie5Data[1].value > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pie5Data}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      <Cell fill={COLORS.rent} />
                      <Cell fill={COLORS.buy} />
                    </Pie>
                    <Tooltip
                      formatter={(val) => fmt(val)}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-cw-gray text-center py-8">Insufficient data for year-5 comparison.</p>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <p className="text-xs text-cw-gray mb-1">Rent Paid (5 yr)</p>
                  <p className="font-bold text-orange-400">{fmt(result.year5RentPaid)}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-cw-gray mb-1">Equity Built (5 yr)</p>
                  <p className="font-bold text-blue-400">{fmt(Math.max(0, result.year5Equity))}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Detailed tab */}
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

        <CalcFAQ faqs={[
          { q: 'When does buying become cheaper than renting?', a: 'Typically after 5-7 years in most markets. The break-even point depends on local prices, rent levels, and your mortgage rate.' },
          { q: 'What is opportunity cost?', a: 'Your down payment invested in the stock market (avg 7% return) instead of real estate. This is a hidden cost of buying that most calculators ignore.' },
          { q: 'Does rent vs buy depend on my market?', a: 'Absolutely. In high price-to-rent ratio cities (NYC, London, Toronto), renting often wins short-term. In smaller cities, buying wins faster.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/affordability`, label: 'Affordability Calculator' },
          { to: `/${country}/property-roi`, label: 'Property ROI' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
