import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'
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
  const noi = annualRent - annualExpenses - managementCost
  const annualCashFlow = noi - annualMortgage
  const monthlyCashFlow = annualCashFlow / 12
  const capRate = (noi / purchasePrice) * 100
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0
  const grossYield = (monthlyRent * 12 / purchasePrice) * 100

  // Expense sub-breakdown (proportional split of annualExpenses)
  const taxesPct = 0.35
  const insurancePct = 0.20
  const maintenancePct = 0.30
  const vacancyCostPct = 0.15
  const annualVacancyCost = monthlyRent * 12 * (vacancyRate / 100)

  return {
    mortgagePayment, effectiveRent, annualRent, annualExpenses, managementCost,
    noi, annualCashFlow, monthlyCashFlow, capRate, cashOnCash, grossYield,
    annualMortgage,
    expenseBreakdown: {
      mortgage: annualMortgage,
      taxes: annualExpenses * taxesPct,
      insurance: annualExpenses * insurancePct,
      maintenance: annualExpenses * maintenancePct,
      vacancy: annualVacancyCost,
    },
  }
}

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e']

const defaultsByCountry = {
  us: { price: 350000, downPct: 25, rent: 2200, rate: 7.0 },
  ca: { price: 600000, downPct: 25, rent: 2500, rate: 6.5 },
  uk: { price: 285000, downPct: 25, rent: 1400, rate: 5.5 },
  au: { price: 650000, downPct: 20, rent: 2500, rate: 6.5 },
  ie: { price: 350000, downPct: 20, rent: 1800, rate: 5.0 },
  nz: { price: 650000, downPct: 20, rent: 2800, rate: 7.0 },
}

const jsonLd = (country) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Property ROI Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `Calculate rental property ROI, cash-on-cash return, cap rate, and monthly cash flow in ${country.toUpperCase()}.`,
})

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
  const [view, setView] = useState('summary')

  const result = useMemo(
    () => calcPropertyROI({ purchasePrice: price, downPayment: down, monthlyRent: rent, expensePct: expenses, managementPct: management, vacancyRate: vacancy, mortgageRate }),
    [price, down, rent, expenses, management, vacancy, mortgageRate]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const pct = (n) => `${n.toFixed(2)}%`

  // Chart data
  const incomeExpenseData = result ? [
    { name: 'Annual', Income: Math.round(result.annualRent), Expenses: Math.round(result.annualExpenses + result.managementCost + result.annualMortgage) },
  ] : []

  const pieData = result ? [
    { name: 'Mortgage', value: Math.round(result.expenseBreakdown.mortgage) },
    { name: 'Taxes', value: Math.round(result.expenseBreakdown.taxes) },
    { name: 'Insurance', value: Math.round(result.expenseBreakdown.insurance) },
    { name: 'Maintenance', value: Math.round(result.expenseBreakdown.maintenance) },
    { name: 'Vacancy', value: Math.round(result.expenseBreakdown.vacancy) },
  ] : []

  const appreciationData = result
    ? Array.from({ length: 11 }, (_, i) => ({
        year: `Year ${i}`,
        Value: Math.round(price * Math.pow(1.035, i)),
      }))
    : []

  return (
    <>
      <Helmet>
        <title>Property ROI Calculator {c.name} 2026 — Cash Flow &amp; Cap Rate | CalcWise</title>
        <meta name="description" content={`Calculate rental property ROI, cash-on-cash return, cap rate, and monthly cash flow in ${c.name}. Free investment property calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/property-roi`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd(country))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Property ROI Calculator</h1>
          <p className="text-cw-gray">Calculate cash flow, cap rate, and return on your rental property.</p>
        </div>

        <CalcIntro intro="The property ROI calculator measures the return on investment of a rental property. Enter purchase price, rent, expenses and financing to see cap rate, cash-on-cash return, and total ROI including appreciation." hiddenCost="Vacancy costs reduce ROI by 8-10% annually" />

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
          {['summary', 'chart', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                view === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {result && view === 'summary' && (
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

        {result && view === 'chart' && (
          <div className="space-y-8">
            {/* Income vs Expenses Bar Chart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4">Annual Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={incomeExpenseData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown Pie */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4">Expense Breakdown</h3>
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

            {/* Appreciation Area Chart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4">Property Value Appreciation (3.5%/yr)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={appreciationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="Value" stroke="#6366f1" strokeWidth={2} fill="url(#roiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
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

        <CalcFAQ faqs={[
          { q: 'What is a good cap rate?', a: 'Cap rate (NOI ÷ property value) of 5-10% is generally good. Lower cap rates (3-4%) are common in expensive cities but indicate lower cash flow relative to price.' },
          { q: 'What is cash-on-cash return?', a: 'Annual cash flow ÷ cash invested. Unlike cap rate, it accounts for financing. A 6-10% cash-on-cash return is considered solid for rental properties.' },
          { q: 'Should I include property appreciation?', a: 'Yes, but conservatively. Historical appreciation averages 3-4% annually but varies hugely by location. Dont count on appreciation — buy for cash flow.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/rent-vs-buy`, label: 'Rent vs Buy' },
          { to: `/${country}/affordability`, label: 'Affordability' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
