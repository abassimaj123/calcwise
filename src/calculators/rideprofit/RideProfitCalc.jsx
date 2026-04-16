import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import NumericInput from '../../components/NumericInput'

// Mileage deduction rates 2025
const mileageRates = {
  us: { rate: 0.70, unit: 'mile', label: 'IRS $0.70/mile (2025)' },
  ca: { rate: 0.72, unit: 'km', label: 'CRA $0.72/km (2025)' },
  uk: { rate: 0.45, unit: 'mile', label: 'HMRC £0.45/mile (first 10k)' },
  au: { rate: 0.88, unit: 'km', label: 'ATO $0.88/km (2024-25)' },
  ie: { rate: 0.43, unit: 'km', label: 'Revenue €0.43/km' },
  nz: { rate: 0.27, unit: 'km', label: 'IRD $0.27/km' },
}

const platforms = ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Bolt', 'Deliveroo', 'Menulog', 'Skip The Dishes', 'Other']

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#f43f5e']

const jsonLd = (country) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RideProfit Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `Calculate your real rideshare and delivery profit in ${country.toUpperCase()}. True hourly rate after fuel, wear & tear, and depreciation.`,
})

export default function RideProfitCalc({ country }) {
  const c = countries[country]
  const mr = mileageRates[country] || mileageRates.ca
  const isImperial = mr.unit === 'mile'

  const [revenue, setRevenue] = useState(1200)
  const [distance, setDistance] = useState(isImperial ? 600 : 900)
  const [fuelConsumption, setFuelConsumption] = useState(9.0)
  const [fuelPrice, setFuelPrice] = useState(
    country === 'us' ? 3.5 : country === 'uk' ? 1.55 : country === 'au' ? 2.0 : country === 'ca' ? 1.65 : country === 'ie' ? 1.75 : 2.1
  )
  const [hoursWorked, setHoursWorked] = useState(30)
  const [platform, setPlatform] = useState('Uber')
  const [view, setView] = useState('summary')

  const result = useMemo(() => {
    if (!revenue || !distance || !hoursWorked) return null

    const distKm = isImperial ? distance * 1.60934 : distance

    let fuelCost = 0
    if (isImperial) {
      const gallons = distance / (fuelConsumption || 30)
      fuelCost = gallons * fuelPrice
    } else {
      fuelCost = (distKm * fuelConsumption) / 100 * fuelPrice
    }

    const wearTear = distKm * 0.08
    const depreciation = distKm * 0.05
    // Platform fee approximation ~25% of gross
    const platformFee = revenue * 0.25
    const totalCosts = fuelCost + wearTear + depreciation
    const netProfit = revenue - totalCosts
    const hourlyRate = netProfit / hoursWorked

    const taxDeduction = distance * mr.rate

    const annualNet = netProfit * 52
    const annualTaxDeduction = taxDeduction * 52

    return {
      revenue, fuelCost, wearTear, depreciation, platformFee, totalCosts,
      netProfit, hourlyRate, weeklyNet: netProfit, taxDeduction,
      annualNet, annualTaxDeduction, distKm,
    }
  }, [revenue, distance, fuelConsumption, fuelPrice, hoursWorked, isImperial, mr.rate])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt0 = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  // Bar chart data
  const barData = result ? [
    {
      name: 'Weekly',
      Revenue: Math.round(result.revenue),
      Expenses: Math.round(result.totalCosts),
      'Net Profit': Math.round(result.netProfit),
    },
  ] : []

  // Pie chart data — expense breakdown
  const pieData = result ? [
    { name: 'Fuel', value: Math.round(result.fuelCost) },
    { name: 'Mileage Deduction', value: Math.round(result.taxDeduction) },
    { name: 'Platform Fees (est.)', value: Math.round(result.platformFee) },
    { name: 'Wear & Tear', value: Math.round(result.wearTear + result.depreciation) },
  ] : []

  const pageTitle = `${c.name} RideProfit Calculator — Real Uber/DoorDash Earnings | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Calculate your real rideshare and delivery profit in ${c.name}. True hourly rate after fuel, wear & tear, depreciation. ${mr.label}.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/rideprofit`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd(country))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} RideProfit Calculator
          </h1>
          <p className="text-cw-gray">
            Find out what you actually earn driving for Uber, DoorDash, Deliveroo and more.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-cw-success/10 border border-cw-success/30 rounded-full px-4 py-1 text-xs text-cw-success">
            ✓ {mr.label}
          </div>
        </div>

        <CalcIntro intro="The RideProfit calculator shows your true earnings as a rideshare or delivery driver after all expenses. It accounts for fuel costs, mileage tax deductions, platform fees, and vehicle wear to reveal your real hourly rate." hiddenCost="Vehicle depreciation costs drivers $0.05-0.15/km" />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Platform</label>
              <select className="cw-input" value={platform} onChange={e => setPlatform(e.target.value)}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Weekly Revenue ({c.symbol})</label>
              <NumericInput value={revenue} onChange={setRevenue} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">
                Weekly Distance ({isImperial ? 'miles' : 'km'})
              </label>
              <NumericInput value={distance} onChange={setDistance} min={0} step={10} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Hours Worked per Week</label>
              <NumericInput value={hoursWorked} onChange={setHoursWorked} min={1} step={1} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">
                {isImperial ? 'Fuel Efficiency (MPG)' : 'Fuel Consumption (L/100km)'}
              </label>
              <NumericInput value={fuelConsumption} onChange={setFuelConsumption} min={0.1} step={isImperial ? 1 : 0.5} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">
                Fuel Price ({c.symbol}/{isImperial ? 'gallon' : 'litre'})
              </label>
              <NumericInput value={fuelPrice} onChange={setFuelPrice} min={0} step={0.01} prefix={c.symbol} />
            </div>
          </div>
        </div>

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

        {result && view === 'summary' && (
          <>
            {/* True Hourly Rate — big highlighted metric */}
            <div className="cw-card mb-4 text-center py-6 border border-primary/30 bg-primary/5">
              <p className="text-xs text-cw-gray uppercase tracking-widest mb-1">True Hourly Rate</p>
              <p className={`text-5xl font-display font-bold ${result.hourlyRate >= 15 ? 'text-cw-success' : result.hourlyRate >= 10 ? 'text-yellow-400' : 'text-cw-danger'}`}>
                {fmt(result.hourlyRate)}
              </p>
              <p className="text-xs text-cw-gray mt-2">After all expenses — {hoursWorked}h/week</p>
            </div>
            <ResultSimple
              metrics={[
                { label: 'Weekly Net Profit', value: fmt0(result.netProfit) },
                { label: 'Tax Deductible', value: fmt0(result.taxDeduction), sub: 'This week' },
                { label: 'Annual Net (×52)', value: fmt0(result.annualNet) },
              ]}
            />
          </>
        )}

        {result && view === 'chart' && (
          <div className="space-y-8">
            {/* Revenue vs Expenses vs Net Profit Bar Chart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4">Revenue vs Expenses vs Net Profit</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt0(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={70} />
                  <Tooltip formatter={(v) => fmt0(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown Pie */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4">Cost & Deduction Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* True Hourly Rate callout in chart view */}
            <div className="cw-card text-center py-5 border border-primary/30 bg-primary/5">
              <p className="text-xs text-cw-gray uppercase tracking-widest mb-1">True Hourly Rate</p>
              <p className={`text-4xl font-display font-bold ${result.hourlyRate >= 15 ? 'text-cw-success' : result.hourlyRate >= 10 ? 'text-yellow-400' : 'text-cw-danger'}`}>
                {fmt(result.hourlyRate)}
              </p>
            </div>
          </div>
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Weekly Breakdown"
            rows={[
              { label: 'Gross Revenue', value: fmt(result.revenue), bold: true },
              { label: 'Fuel Cost', value: `-${fmt(result.fuelCost)}` },
              { label: 'Wear & Tear', value: `-${fmt(result.wearTear)}`, sub: `${isImperial ? (result.distKm / 1.60934).toFixed(0) : result.distKm.toFixed(0)}${isImperial ? ' mi' : 'km'} × ${c.symbol}0.08` },
              { label: 'Depreciation', value: `-${fmt(result.depreciation)}`, sub: `${isImperial ? (result.distKm / 1.60934).toFixed(0) : result.distKm.toFixed(0)}${isImperial ? ' mi' : 'km'} × ${c.symbol}0.05` },
              { label: 'Total Costs', value: `-${fmt(result.totalCosts)}`, bold: true },
              { label: 'Net Profit', value: fmt(result.netProfit), bold: true },
              { label: 'Real Hourly Rate', value: fmt(result.hourlyRate), bold: true },
              { label: 'Tax Deduction (mileage)', value: fmt(result.taxDeduction), sub: mr.label },
              { label: 'Annual Net (×52)', value: fmt0(result.annualNet) },
              { label: 'Annual Tax Deduction', value: fmt0(result.annualTaxDeduction) },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your weekly numbers above to see your real profit.
          </div>
        )}

        <AppDownloadBanner calcKey="rideprofit" country={country} />
        <AdSenseSlot format="rectangle" />

        <CalcFAQ faqs={[
          { q: 'What mileage deduction can I claim?', a: 'Canada: $0.72/km for the first 5,000km, $0.66/km after. US: $0.67/mile (2024). UK: 45p/mile for first 10,000 miles, 25p after. These significantly reduce taxable income.' },
          { q: 'What expenses can rideshare drivers deduct?', a: 'Mileage (or actual car expenses), phone plan (business portion), car washes, parking fees, insurance premium increase, and any supplies used for passengers.' },
          { q: 'Is rideshare worth it financially?', a: 'After all expenses, many drivers earn $12-18/hr true net. It depends heavily on your city, vehicle efficiency, and which hours you drive. This calculator shows your real number.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/tax`, label: 'Tax Calculator' },
          { to: `/${country}/salary`, label: 'Salary Calculator' },
          { to: `/${country}/autoloan`, label: 'Auto Loan' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
