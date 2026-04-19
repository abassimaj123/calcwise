import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import { CalcIntro, CalcFAQ, CalcRelated, CalcSubTopics, CalcPageMeta } from '../../components/CalcSEO'
import { subPagesByCalc } from '../../data/seoPages'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import { trackCalcUsed } from '../../utils/analytics'
import NumericInput from '../../components/NumericInput'

// Mileage deduction rates 2025
const mileageRates = {
  us: { rate: 0.70, unit: 'mile', label: 'IRS $0.70/mile (2026)' },
  ca: { rate: 0.72, unit: 'km', label: 'CRA $0.72/km (2026)' },
  uk: { rate: 0.45, unit: 'mile', label: 'HMRC £0.45/mile (first 10k)' },
  au: { rate: 0.88, unit: 'km', label: 'ATO $0.88/km (2025-26)' },
  ie: { rate: 0.43, unit: 'km', label: 'Revenue €0.43/km' },
  nz: { rate: 0.27, unit: 'km', label: 'IRD $0.27/km' },
}

// ---------------------------------------------------------------------------
// Country-specific additional monthly expenses
// ---------------------------------------------------------------------------
const EXTRA_EXPENSES = {
  us: [
    { key: 'phone',    label: 'Phone Plan (business %)',  hint: 'Deductible business portion · avg $40-80/mo', monthly: true,  step: 5   },
    { key: 'parking',  label: 'Parking & Tolls',          hint: 'Monthly parking/toll costs',                  monthly: true,  step: 10  },
    { key: 'supplies', label: 'Supplies (water, bags)',    hint: 'Monthly passenger supplies',                  monthly: true,  step: 5   },
    { key: 'carwash',  label: 'Car Washes',               hint: 'Monthly cleaning costs',                      monthly: true,  step: 10  },
    { key: 'insurance',label: 'Extra Insurance Premium',  hint: 'Rideshare coverage add-on',                   monthly: true,  step: 10  },
  ],
  ca: [
    { key: 'phone',    label: 'Forfait téléphone',        hint: 'Portion affaires · $40-80/mois',              monthly: true,  step: 5   },
    { key: 'parking',  label: 'Stationnement / péages',   hint: 'Frais mensuels',                              monthly: true,  step: 10  },
    { key: 'supplies', label: 'Fournitures passagers',    hint: 'Eau, sacs, etc.',                             monthly: true,  step: 5   },
    { key: 'carwash',  label: 'Lavage auto',              hint: 'Frais mensuels de nettoyage',                 monthly: true,  step: 10  },
    { key: 'insurance',label: 'Surprime assurance',       hint: 'Couverture covoiturage',                      monthly: true,  step: 10  },
    { key: 'deprec',   label: 'Dépréciation véhicule',   hint: '$0.05-0.15/km · valeur marchande perdue',     monthly: true,  step: 25  },
  ],
  uk: [
    { key: 'phone',    label: 'Phone Plan (business)',    hint: 'Business portion deductible',                 monthly: true,  step: 5   },
    { key: 'parking',  label: 'Parking & Congestion',     hint: 'London zone + parking monthly',               monthly: true,  step: 20  },
    { key: 'insurance',label: 'Private Hire Insurance',   hint: 'PCO/PHV insurance add-on',                    monthly: true,  step: 15  },
    { key: 'licences', label: 'Licences & MOT',           hint: 'PCO licence amortized monthly',               monthly: true,  step: 20  },
  ],
  au: [
    { key: 'phone',    label: 'Phone Plan (business)',    hint: 'Work-related portion deductible',             monthly: true,  step: 5   },
    { key: 'parking',  label: 'Parking & Tolls',          hint: 'Monthly road tolls + parking',                monthly: true,  step: 15  },
    { key: 'insurance',label: 'Rideshare Insurance',      hint: 'Commercial vehicle cover add-on',             monthly: true,  step: 20  },
  ],
  ie: [
    { key: 'phone',    label: 'Phone (business portion)', hint: 'Deductible business use',                     monthly: true,  step: 5   },
    { key: 'insurance',label: 'Taxi/Rideshare Insurance', hint: 'PSV insurance monthly cost',                  monthly: true,  step: 30  },
    { key: 'licence',  label: 'PSV / Taxi Licence',       hint: 'Amortized monthly cost',                      monthly: true,  step: 15  },
  ],
  nz: [
    { key: 'phone',    label: 'Phone (business portion)', hint: 'Deductible business use',                     monthly: true,  step: 5   },
    { key: 'parking',  label: 'Parking & Tolls',          hint: 'Monthly costs',                               monthly: true,  step: 10  },
    { key: 'insurance',label: 'Rideshare Insurance',      hint: 'Additional coverage',                         monthly: true,  step: 20  },
  ],
}

const platforms = ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Bolt', 'Deliveroo', 'Menulog', 'Skip The Dishes', 'Other']

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#f43f5e', '#10b981', '#a855f7']

const jsonLd = (country) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RideProfit Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `Calculate your real rideshare and delivery profit in ${country.toUpperCase()}. True hourly rate after fuel, wear & tear, and depreciation.`,
})

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-green-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function RideProfitCalc({ country, embedded = false }) {
  const { t } = useTranslation()
  const c = countries[country]
  const mr = mileageRates[country] || mileageRates.ca
  const isImperial = mr.unit === 'mile'
  const expenseDefs = EXTRA_EXPENSES[country] || []

  const [revenue, setRevenue] = useState(1200)
  const [distance, setDistance] = useState(isImperial ? 600 : 900)
  const [fuelConsumption, setFuelConsumption] = useState(9.0)
  const [fuelPrice, setFuelPrice] = useState(
    country === 'us' ? 3.5 : country === 'uk' ? 1.55 : country === 'au' ? 2.0 : country === 'ca' ? 1.65 : country === 'ie' ? 1.75 : 2.1
  )
  const [hoursWorked, setHoursWorked] = useState(30)
  const [platform, setPlatform] = useState('Uber')
  const [view, setView] = useState('summary')
  const [expOpen, setExpOpen] = useState(true)
  const [expEnabled, setExpEnabled] = useState({})
  const [expAmounts, setExpAmounts] = useState(
    Object.fromEntries(expenseDefs.map(d => [d.key, 0]))
  )

  const toggleExp = (key, val) => setExpEnabled(prev => ({ ...prev, [key]: val }))
  const setExpAmt = (key, val) => setExpAmounts(prev => ({ ...prev, [key]: val }))

  const activeExpenses = expenseDefs.filter(d => expEnabled[d.key] && expAmounts[d.key] > 0)
  const activeExpCount = activeExpenses.length

  // Monthly extra expenses total (each item is monthly)
  const monthlyExtraTotal = useMemo(() =>
    expenseDefs
      .filter(d => expEnabled[d.key])
      .reduce((sum, d) => sum + (expAmounts[d.key] || 0), 0),
    [expenseDefs, expEnabled, expAmounts]
  )

  // Weekly extra expenses (monthly / 4.33)
  const weeklyExtraTotal = monthlyExtraTotal / 4.33

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
    const totalCosts = fuelCost + wearTear + depreciation + weeklyExtraTotal
    const netProfit = revenue - totalCosts
    const hourlyRate = netProfit / hoursWorked

    const taxDeduction = distance * mr.rate

    const annualNet = netProfit * 52
    const annualTaxDeduction = taxDeduction * 52

    return {
      revenue, fuelCost, wearTear, depreciation, platformFee,
      weeklyExtraTotal, totalCosts,
      netProfit, hourlyRate, weeklyNet: netProfit, taxDeduction,
      annualNet, annualTaxDeduction, distKm,
    }
  }, [revenue, distance, fuelConsumption, fuelPrice, hoursWorked, isImperial, mr.rate, weeklyExtraTotal])

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('rideprofit', country)
      tracked.current = true
    }
  }, [result])

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
    ...(result.weeklyExtraTotal > 0 ? [{ name: 'Additional Expenses', value: Math.round(result.weeklyExtraTotal) }] : []),
  ] : []

  const pageTitles = {
    us: 'Rideshare Profit Calculator US — Real Uber, Lyft & DoorDash Earnings | CalqWise',
    ca: 'Rideshare Profit Calculator Canada — True Uber & DoorDash Profit | CalqWise',
    uk: 'UK Rideshare Profit Calculator — Real Uber & Deliveroo Earnings | CalqWise',
    au: 'Australia Rideshare Profit Calculator — Real Uber & DoorDash Profit | CalqWise',
  }
  const pageDescs = {
    us: 'Free US rideshare profit calculator. True earnings after fuel, wear & tear, depreciation, and taxes. GPS mileage tracking for IRS deductions. Uber, Lyft, DoorDash, Uber Eats.',
    ca: 'Free Canadian rideshare profit calculator. Real hourly rate after fuel, vehicle costs, and CRA mileage deductions. Uber, DoorDash, Skip the Dishes, Instacart.',
    uk: 'Free UK rideshare profit calculator. True earnings after fuel, wear & tear, depreciation, and HMRC mileage allowance. Uber, Deliveroo, Just Eat, Amazon Flex.',
    au: 'Free Australian rideshare profit calculator. True earnings after fuel, vehicle depreciation, and ATO mileage deductions. Uber, DoorDash, Deliveroo, Menulog.',
  }
  const pageTitle = pageTitles[country] || pageTitles.us
  const pageDesc = pageDescs[country] || pageDescs.us

  return (
    <>
      <CalcPageMeta country={country} slug="rideprofit" title={pageTitle} description={pageDesc} embedded={embedded} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd(country))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {t(`nav.country_${country}`, { defaultValue: c.name })} — {t('rideprofit.title')}
          </h1>
          <p className="text-slate-500">
            {t('rideprofit.desc')}
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-cw-success/10 border border-cw-success/30 rounded-full px-4 py-1 text-xs text-cw-success">
            ✓ {mr.label}
          </div>
        </div>

        <CalcIntro intro="The RideProfit calculator shows your true earnings as a rideshare or delivery driver after all expenses. It accounts for fuel costs, mileage tax deductions, platform fees, and vehicle wear to reveal your real hourly rate." hiddenCost="Vehicle depreciation costs drivers $0.05-0.15/km" />

        <div className="cw-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Platform</label>
              <select className="cw-input" value={platform} onChange={e => setPlatform(e.target.value)}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rideprofit.weeklyEarnings')} ({c.symbol})</label>
              <NumericInput value={revenue} onChange={setRevenue} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('rideprofit.weeklyDistance', { defaultValue: 'Weekly Distance' })} ({isImperial ? 'miles' : 'km'})
              </label>
              <NumericInput value={distance} onChange={setDistance} min={0} step={10} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rideprofit.weeklyHours')}</label>
              <NumericInput value={hoursWorked} onChange={setHoursWorked} min={1} step={1} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {isImperial ? t('rideprofit.fuelEfficiency', { defaultValue: 'Fuel Efficiency (MPG)' }) : t('rideprofit.fuelConsumption', { defaultValue: 'Fuel Consumption (L/100km)' })}
              </label>
              <NumericInput value={fuelConsumption} onChange={setFuelConsumption} min={0.1} step={isImperial ? 1 : 0.5} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('rideprofit.fuelPrice', { defaultValue: 'Fuel Price' })} ({c.symbol}/{isImperial ? 'gallon' : 'litre'})
              </label>
              <NumericInput value={fuelPrice} onChange={setFuelPrice} min={0} step={0.01} prefix={c.symbol} />
            </div>
          </div>
        </div>

        {/* Additional Expenses collapsible */}
        {expenseDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setExpOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{t('rideprofit.costDetails')}</span>
                {activeExpCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeExpCount} active · -{fmt0(monthlyExtraTotal)}/mo
                  </span>
                )}
              </div>
              {expOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {expOpen && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3">Monthly costs subtracted from profit</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                  {expenseDefs.map(d => (
                    <div
                      key={d.key}
                      className={`border rounded-xl p-3 transition-colors ${expEnabled[d.key] ? 'border-orange-300 bg-orange-50' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{d.hint}</p>
                        </div>
                        <Toggle on={!!expEnabled[d.key]} onChange={v => toggleExp(d.key, v)} />
                      </div>
                      {expEnabled[d.key] && (
                        <div className="mt-2">
                          <NumericInput
                            label=""
                            value={expAmounts[d.key] || 0}
                            onChange={v => setExpAmt(d.key, v)}
                            min={0}
                            max={10000}
                            step={d.step}
                            prefix={c.symbol}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}
            >
              {v === 'summary' ? t('calc.summary') : v === 'chart' ? t('calc.chart') : t('calc.detailed')}
            </button>
          ))}
        </div>

        {result && view === 'summary' && (
          <>
            <div className="cw-card mb-4 text-center py-6 border border-primary/30 bg-primary/5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('rideprofit.trueHourlyProfit')}</p>
              <p className={`text-5xl font-display font-bold ${result.hourlyRate >= 15 ? 'text-cw-success' : result.hourlyRate >= 10 ? 'text-yellow-400' : 'text-cw-danger'}`}>
                {fmt(result.hourlyRate)}
              </p>
              <p className="text-xs text-slate-500 mt-2">After all expenses — {hoursWorked}h/week</p>
            </div>
            {activeExpenses.length > 0 && (
              <div className="cw-card mb-4 border border-orange-500/30 bg-orange-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">Additional Monthly Expenses</p>
                <div className="space-y-1">
                  {activeExpenses.map(d => (
                    <div key={d.key} className="flex items-center justify-between text-sm">
                      <span className="text-orange-700 font-medium">{d.label}</span>
                      <span className="text-slate-700 font-semibold">-{fmt0(expAmounts[d.key] || 0)}/mo</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-orange-100 text-xs text-orange-700 font-semibold">
                    Weekly impact: -{fmt(weeklyExtraTotal)}/wk
                  </div>
                </div>
              </div>
            )}
            <ResultSimple
              metrics={[
                { label: t('rideprofit.weeklyProfit'), value: fmt0(result.netProfit) },
                { label: t('rideprofit.fuelCost'), value: fmt0(result.taxDeduction), sub: 'This week' },
                { label: t('rideprofit.annualProfit'), value: fmt0(result.annualNet) },
              ]}
            />
          </>
        )}

        {result && view === 'chart' && (
          <div className="space-y-8">
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Revenue vs Expenses vs Net Profit</h3>
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

            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Cost & Deduction Breakdown</h3>
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

            <div className="cw-card text-center py-5 border border-primary/30 bg-primary/5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('rideprofit.trueHourlyProfit')}</p>
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
              ...(result.weeklyExtraTotal > 0 ? [{ label: 'Additional Expenses (weekly)', value: `-${fmt(result.weeklyExtraTotal)}`, sub: `${fmt0(monthlyExtraTotal)}/mo ÷ 4.33` }] : []),
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
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterValid')}
          </div>
        )}

        <AppDownloadBanner calcKey="rideprofit" country={country} />
        <AdSenseSlot format="rectangle" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdSenseSlot format="in-article" placement="in-content" />
        <CalcFAQ faqs={[
          { q: 'What mileage deduction can I claim?', a: 'Canada: $0.72/km for the first 5,000km, $0.66/km after. US: $0.67/mile (2024). UK: 45p/mile for first 10,000 miles, 25p after. These significantly reduce taxable income.' },
          { q: 'What expenses can rideshare drivers deduct?', a: 'Mileage (or actual car expenses), phone plan (business portion), car washes, parking fees, insurance premium increase, and any supplies used for passengers.' },
          { q: 'Is rideshare worth it financially?', a: 'After all expenses, many drivers earn $12-18/hr true net. It depends heavily on your city, vehicle efficiency, and which hours you drive. This calculator shows your real number.' },
        ]} />
        <CalcSubTopics links={subPagesByCalc[`${country}/rideprofit`] || []} />
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
