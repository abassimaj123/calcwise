import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
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

export default function RideProfitCalc({ country }) {
  const c = countries[country]
  const mr = mileageRates[country] || mileageRates.ca
  const isImperial = mr.unit === 'mile'

  const [revenue, setRevenue] = useState(1200)
  const [distance, setDistance] = useState(isImperial ? 600 : 900)
  const [fuelConsumption, setFuelConsumption] = useState(9.0) // L/100km or MPG
  const [fuelPrice, setFuelPrice] = useState(
    country === 'us' ? 3.5 : country === 'uk' ? 1.55 : country === 'au' ? 2.0 : country === 'ca' ? 1.65 : country === 'ie' ? 1.75 : 2.1
  )
  const [hoursWorked, setHoursWorked] = useState(30)
  const [platform, setPlatform] = useState('Uber')
  const [view, setView] = useState('simple')

  const result = useMemo(() => {
    if (!revenue || !distance || !hoursWorked) return null

    // Convert distance to km for calculations
    const distKm = isImperial ? distance * 1.60934 : distance

    // Fuel cost
    let fuelCost = 0
    if (isImperial) {
      // MPG-based: gallons = miles / mpg, cost = gallons * price_per_gallon
      const gallons = distance / (fuelConsumption || 30)
      fuelCost = gallons * fuelPrice
    } else {
      // L/100km: litres = km * consumption / 100
      fuelCost = (distKm * fuelConsumption) / 100 * fuelPrice
    }

    const wearTear = distKm * 0.08
    const depreciation = distKm * 0.05
    const totalCosts = fuelCost + wearTear + depreciation
    const netProfit = revenue - totalCosts
    const hourlyRate = netProfit / hoursWorked
    const weeklyNet = netProfit

    // Tax deduction
    const taxDeduction = isImperial
      ? distance * mr.rate
      : distance * mr.rate

    const annualNet = netProfit * 52
    const annualTaxDeduction = taxDeduction * 52

    return {
      revenue, fuelCost, wearTear, depreciation, totalCosts,
      netProfit, hourlyRate, weeklyNet, taxDeduction,
      annualNet, annualTaxDeduction, distKm,
    }
  }, [revenue, distance, fuelConsumption, fuelPrice, hoursWorked, isImperial, mr.rate])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt0 = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const pageTitle = `${c.name} RideProfit Calculator — Real Uber/DoorDash Earnings | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Calculate your real rideshare and delivery profit in ${c.name}. True hourly rate after fuel, wear & tear, depreciation. ${mr.label}.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/rideprofit`} />
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
              { label: 'Real Hourly Rate', value: fmt(result.hourlyRate), highlight: true },
              { label: 'Weekly Net Profit', value: fmt0(result.netProfit) },
              { label: 'Tax Deductible', value: fmt0(result.taxDeduction), sub: 'This week' },
            ]}
          />
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
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
