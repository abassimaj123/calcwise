import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated, CalcPageMeta } from '../../components/CalcSEO'
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Country-specific additional buying costs
// ---------------------------------------------------------------------------
const BUY_OPTIONS = {
  us: [
    { key: 'pmi',       label: 'PMI',                hint: 'If down < 20% · avg 0.5-1.5%/yr of loan',  type: 'pct', step: 0.1, defaultVal: 0 },
    { key: 'propertax', label: 'Property Tax Rate',  hint: 'Annual % of home value · US avg 1.1%',      type: 'pct', step: 0.1, defaultVal: 1.1 },
    { key: 'hoa',       label: 'HOA Fees',           hint: 'Monthly HOA fee',                            type: 'amt', step: 50,  defaultVal: 0 },
    { key: 'homeins',   label: 'Home Insurance',     hint: 'Annual premium',                             type: 'amt', step: 100, defaultVal: 1500 },
  ],
  ca: [
    { key: 'propertax', label: 'Property Tax Rate',  hint: 'Annual % · CA avg ~0.9%',                   type: 'pct', step: 0.1, defaultVal: 0.9 },
    { key: 'condo',     label: 'Condo / Strata Fees',hint: 'Monthly fees',                               type: 'amt', step: 50,  defaultVal: 0 },
    { key: 'homeins',   label: 'Home Insurance',     hint: 'Annual premium',                             type: 'amt', step: 100, defaultVal: 2000 },
  ],
  uk: [
    { key: 'council',   label: 'Council Tax',        hint: 'Annual council tax',                         type: 'amt', step: 100, defaultVal: 2000 },
    { key: 'service',   label: 'Service Charge',     hint: 'Annual leasehold service charge',            type: 'amt', step: 100, defaultVal: 0 },
    { key: 'homeins',   label: 'Buildings Insurance',hint: 'Annual premium',                             type: 'amt', step: 50,  defaultVal: 300 },
  ],
  au: [
    { key: 'rates',     label: 'Council Rates',      hint: 'Annual local rates',                         type: 'amt', step: 100, defaultVal: 1800 },
    { key: 'strata',    label: 'Strata Fees',         hint: 'Annual strata (units only)',                 type: 'amt', step: 100, defaultVal: 0 },
    { key: 'homeins',   label: 'Home Insurance',     hint: 'Annual premium',                             type: 'amt', step: 100, defaultVal: 2000 },
  ],
  ie: [
    { key: 'lpt',       label: 'Local Property Tax', hint: 'Annual LPT',                                 type: 'amt', step: 100, defaultVal: 800 },
    { key: 'homeins',   label: 'Home Insurance',     hint: 'Annual premium',                             type: 'amt', step: 50,  defaultVal: 900 },
  ],
  nz: [
    { key: 'rates',     label: 'Council Rates',      hint: 'Annual rates',                               type: 'amt', step: 100, defaultVal: 2500 },
    { key: 'homeins',   label: 'Home Insurance',     hint: 'Annual premium',                             type: 'amt', step: 100, defaultVal: 2000 },
  ],
}

function calcRentVsBuy({ homePrice, downPayment, mortgageRate, termYears, monthlyRent, rentIncrease, homeAppreciation, extraBuyMonthly }) {
  const principal = homePrice - downPayment
  const monthlyRate = mortgageRate / 100 / 12
  const n = termYears * 12

  if (principal <= 0 || monthlyRate <= 0) return null

  const mortgage = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const propertyTaxMonthly = homePrice * 0.012 / 12
  const insuranceMonthly = homePrice * 0.003 / 12
  const maintenanceMonthly = homePrice * 0.01 / 12
  const baseBuyCostMonthly = mortgage + propertyTaxMonthly + insuranceMonthly + maintenanceMonthly
  const totalBuyCostMonthly = baseBuyCostMonthly + extraBuyMonthly

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

    chartData.push({
      year,
      Renting: Math.round(cumulativeRent),
      Buying: Math.round(cumulativeBuyCost + downPayment),
    })
  }

  const y5 = yearlyData[4] || yearlyData[yearlyData.length - 1]
  const year5RentPaid = chartData[4]?.Renting || 0
  const year5Equity = y5?.buyEquity || 0

  return {
    mortgage, baseBuyCostMonthly, totalBuyCostMonthly, breakEvenYear,
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

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-blue-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function RentVsBuyCalc({ country }) {
  const { t } = useTranslation()
  const c = countries[country]
  const buyOptionDefs = BUY_OPTIONS[country] || []

  const [homePrice, setHomePrice] = useState(country === 'ca' ? 600000 : country === 'uk' ? 350000 : 400000)
  const [downPayment, setDownPayment] = useState(country === 'ca' ? 120000 : country === 'uk' ? 70000 : 80000)
  const [rate, setRate] = useState(country === 'ca' ? 5.0 : country === 'uk' ? 4.5 : 7.0)
  const [term, setTerm] = useState(25)
  const [rent, setRent] = useState(country === 'ca' ? 2500 : country === 'uk' ? 1800 : 2000)
  const [rentIncrease, setRentIncrease] = useState(3)
  const [appreciation, setAppreciation] = useState(4)
  const [view, setView] = useState('summary')
  const [buyOptOpen, setBuyOptOpen] = useState(true)
  const [buyOptEnabled, setBuyOptEnabled] = useState({})
  const [buyOptAmounts, setBuyOptAmounts] = useState(
    Object.fromEntries(buyOptionDefs.map(d => [d.key, d.defaultVal]))
  )

  const toggleBuyOpt = (key, val) => setBuyOptEnabled(prev => ({ ...prev, [key]: val }))
  const setBuyOptAmt = (key, val) => setBuyOptAmounts(prev => ({ ...prev, [key]: val }))

  const activeBuyOpts = buyOptionDefs.filter(d => buyOptEnabled[d.key])
  const activeBuyOptCount = activeBuyOpts.length

  // Compute extra monthly buy cost from active options
  const extraBuyMonthly = useMemo(() => {
    let total = 0
    for (const d of buyOptionDefs) {
      if (!buyOptEnabled[d.key]) continue
      const val = buyOptAmounts[d.key] || 0
      if (d.type === 'pct') {
        // percentage of home price annually → monthly
        total += (homePrice * val / 100) / 12
      } else {
        // amt: monthly if it's a monthly fee, annual / 12 otherwise
        // HOA and condo are already monthly; insurance/council/rates are annual
        const annualKeys = ['homeins', 'council', 'service', 'rates', 'strata', 'lpt']
        if (annualKeys.includes(d.key)) {
          total += val / 12
        } else {
          total += val // monthly (hoa, condo)
        }
      }
    }
    return total
  }, [buyOptionDefs, buyOptEnabled, buyOptAmounts, homePrice])

  const result = useMemo(
    () => calcRentVsBuy({ homePrice, downPayment, mortgageRate: rate, termYears: term, monthlyRent: rent, rentIncrease, homeAppreciation: appreciation, extraBuyMonthly }),
    [homePrice, downPayment, rate, term, rent, rentIncrease, appreciation, extraBuyMonthly]
  )

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('rentvsbuy', country)
      tracked.current = true
    }
  }, [result])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmtShort = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const fmtAxis = currencyFormatter(c.locale, c.currency)

  const pageTitles = {
    us: 'Rent vs Buy Calculator US — Break-Even Year & Wealth Comparison | CalqWise',
    ca: 'Rent vs Buy Calculator Canada — Break-Even Year & True Cost | CalqWise',
    uk: 'Rent vs Buy Calculator UK — Is Buying Worth It in 2026? | CalqWise',
    au: 'Rent vs Buy Calculator Australia — Break-Even Analysis 2026 | CalqWise',
  }
  const pageDescs = {
    us: 'Should you rent or buy in the US? Calculate your break-even year with mortgage costs, property tax, maintenance, rent increases, and opportunity cost of your down payment factored in.',
    ca: 'Rent or buy in Canada? Compare true cost of ownership (CMHC, property tax, maintenance) vs renting and investing your down payment. Free 2026 break-even calculator.',
    uk: 'Rent or buy in the UK? Calculate break-even after stamp duty, mortgage, council tax, and opportunity cost of your deposit. Free 2026 rent vs buy calculator.',
    au: 'Rent or buy in Australia? Compare ownership costs (LMI, rates, insurance) with renting and investing your deposit. Free 2026 break-even analysis.',
  }
  const pageTitle = pageTitles[country] || pageTitles.us
  const pageDesc = pageDescs[country] || pageDescs.us

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
      <CalcPageMeta country={country} slug="rent-vs-buy" title={pageTitle} description={pageDesc} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} {t('rentvsbuy.title')}
          </h1>
          <p className="text-slate-500">{t('rentvsbuy.desc')}</p>
        </div>

        <CalcIntro
          intro={t('rentvsbuy.calcIntro', { defaultValue: 'The rent vs buy calculator compares the true total cost of renting versus buying a home over time. It accounts for mortgage payments, property appreciation, rent increases, tax benefits, and opportunity cost of your down payment.' })}
          hiddenCost="Opportunity cost of down payment is often ignored"
        />

        <div className="cw-card mb-4">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">{t('rentvsbuy.buying')} {t('rentvsbuy.scenario')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.homePrice')} ({c.symbol})</label>
              <NumericInput value={homePrice} onChange={setHomePrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.downPayment')} ({c.symbol})</label>
              <NumericInput value={downPayment} onChange={setDownPayment} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.mortgageRate')} (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.timeHorizon')}</label>
              <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                {[15, 20, 25, 30].map(y => <option key={y} value={y}>{y} {t('calc.years', { defaultValue: 'years' })}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.appreciationRate')} (%/yr)</label>
              <NumericInput value={appreciation} onChange={setAppreciation} min={0} step={0.1} suffix="%" />
            </div>
          </div>

          <h3 className="font-semibold mt-6 mb-4 text-sm uppercase tracking-wider text-slate-500">{t('rentvsbuy.renting')} {t('rentvsbuy.scenario')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('rentvsbuy.monthlyRent')} ({c.symbol})</label>
              <NumericInput value={rent} onChange={setRent} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Annual Rent Increase (%)</label>
              <NumericInput value={rentIncrease} onChange={setRentIncrease} min={0} step={0.1} suffix="%" />
            </div>
          </div>
        </div>

        {/* Additional Buying Costs collapsible */}
        {buyOptionDefs.length > 0 && (
          <div className="cw-card mb-6">
            <button
              type="button"
              onClick={() => setBuyOptOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">Additional Costs (Buying)</span>
                {activeBuyOptCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeBuyOptCount} active · +{fmtShort(extraBuyMonthly)}/mo
                  </span>
                )}
              </div>
              {buyOptOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {buyOptOpen && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Added to monthly buying cost</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                  {buyOptionDefs.map(d => (
                    <div
                      key={d.key}
                      className={`border rounded-xl p-3 transition-colors ${buyOptEnabled[d.key] ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{d.hint}</p>
                          <p className="text-xs text-blue-500 mt-0.5">{d.type === 'pct' ? '% of home value / yr' : ['homeins','council','service','rates','strata','lpt'].includes(d.key) ? 'Annual amount' : 'Monthly amount'}</p>
                        </div>
                        <Toggle on={!!buyOptEnabled[d.key]} onChange={v => toggleBuyOpt(d.key, v)} />
                      </div>
                      {buyOptEnabled[d.key] && (
                        <div className="mt-2">
                          <NumericInput
                            label=""
                            value={buyOptAmounts[d.key] ?? d.defaultVal}
                            onChange={v => setBuyOptAmt(d.key, v)}
                            min={0}
                            max={d.type === 'pct' ? 10 : 100000}
                            step={d.step}
                            prefix={d.type === 'pct' ? undefined : c.symbol}
                            suffix={d.type === 'pct' ? '%' : undefined}
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

        {/* Tabs */}
        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}
            >
              {t(`calc.${v}`)}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {result && view === 'summary' && (
          <>
            <div className="cw-card text-center border-primary/40 bg-primary/10 mb-4">
              <p className="text-slate-500 text-sm mb-2">{t('rentvsbuy.breakEvenYear')}</p>
              <p className="text-6xl font-display font-bold text-white">
                {result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'Never'}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {result.breakEvenYear
                  ? `Buying beats renting after ${result.breakEvenYear} years`
                  : `Renting is better over the full ${term}-year period`}
              </p>
            </div>
            <ResultSimple
              metrics={[
                { label: `Buy Equity (Year ${term})`, value: fmt(result.finalBuyEquity) },
                { label: `Rent Wealth (Year ${term})`, value: fmt(result.finalRentWealth) },
                { label: 'True Monthly Cost (buying)', value: fmtD(result.totalBuyCostMonthly), sub: extraBuyMonthly > 0 ? `Incl. ${fmtShort(extraBuyMonthly)}/mo extra costs` : 'Mortgage + tax + insurance + maintenance' },
              ]}
            />
            {activeBuyOpts.length > 0 && (
              <div className="cw-card mt-4 border border-blue-500/30 bg-blue-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Additional Buying Costs Included</p>
                <div className="space-y-1">
                  {activeBuyOpts.map(d => {
                    const val = buyOptAmounts[d.key] || 0
                    const monthly = d.type === 'pct'
                      ? (homePrice * val / 100) / 12
                      : (['homeins','council','service','rates','strata','lpt'].includes(d.key) ? val / 12 : val)
                    return (
                      <div key={d.key} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">{d.label}</span>
                        <span className="text-slate-700 font-semibold">
                          {fmtShort(monthly)}/mo
                          {d.type === 'pct' ? ` (${val}%/yr)` : ''}
                        </span>
                      </div>
                    )
                  })}
                  <div className="pt-2 mt-1 border-t border-blue-100 text-xs text-blue-700 font-semibold">
                    Total extra: +{fmtShort(extraBuyMonthly)}/mo (+{fmtShort(extraBuyMonthly * 12)}/yr)
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Chart tab */}
        {result && view === 'chart' && (
          <>
            <div className="cw-card text-center border-primary/40 bg-primary/10 mb-6">
              <p className="text-slate-500 text-sm mb-1">{t('rentvsbuy.breakEvenYear')}</p>
              <p className="text-5xl font-display font-bold text-white">
                {result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'Never'}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {result.breakEvenYear
                  ? `After year ${result.breakEvenYear}, cumulative buying costs become lower than renting`
                  : 'Renting remains cheaper over the full period'}
              </p>
            </div>

            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">
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
              <p className="text-xs text-slate-500 mt-2 text-center">
                Lines cross at break-even. Rent increases {rentIncrease}%/yr. Buy cost includes mortgage, tax, insurance &amp; maintenance
                {extraBuyMonthly > 0 ? ` + ${fmtShort(extraBuyMonthly)}/mo additional costs` : ''}.
              </p>
            </div>

            <div className="cw-card mb-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">
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
                <p className="text-slate-500 text-center py-8">Insufficient data for year-5 comparison.</p>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div className="bg-orange-500/10 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Rent Paid (5 yr)</p>
                  <p className="font-bold text-orange-400">{fmt(result.year5RentPaid)}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Equity Built (5 yr)</p>
                  <p className="font-bold text-blue-400">{fmt(Math.max(0, result.year5Equity))}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Detailed tab */}
        {result && view === 'detailed' && (
          <>
            {activeBuyOpts.length > 0 && (
              <div className="cw-card mb-4 border border-blue-500/30 bg-blue-500/5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">True Monthly Cost (buying)</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mortgage payment</span>
                    <span className="font-semibold">{fmtD(result.mortgage)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base costs (tax, ins, maintenance)</span>
                    <span className="font-semibold">{fmtD(result.baseBuyCostMonthly - result.mortgage)}/mo</span>
                  </div>
                  {activeBuyOpts.map(d => {
                    const val = buyOptAmounts[d.key] || 0
                    const monthly = d.type === 'pct'
                      ? (homePrice * val / 100) / 12
                      : (['homeins','council','service','rates','strata','lpt'].includes(d.key) ? val / 12 : val)
                    return (
                      <div key={d.key} className="flex justify-between">
                        <span className="text-blue-700">{d.label}</span>
                        <span className="font-semibold text-blue-700">+{fmtD(monthly)}/mo</span>
                      </div>
                    )
                  })}
                  <div className="pt-2 mt-1 border-t border-blue-100 font-bold flex justify-between text-blue-800">
                    <span>Total Monthly (buying)</span>
                    <span>{fmtD(result.totalBuyCostMonthly)}/mo</span>
                  </div>
                </div>
              </div>
            )}
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
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterValid')}
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
