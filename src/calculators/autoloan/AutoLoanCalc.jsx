import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import { AUTOLOAN_DEFAULTS } from '../../config/calcDefaults'
import { AUTOLOAN_RATES_2026 } from '../../config/rates2026'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import NumericInput from '../../components/NumericInput'
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'

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

function buildSchedule(loanAmount, apr, termMonths) {
  const monthlyRate = apr / 100 / 12
  let balance = loanAmount
  const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  const rows = []
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate
    const principal = payment - interest
    balance = Math.max(0, balance - principal)
    rows.push({ month: m, payment, principal, interest, balance })
  }
  return rows
}


const termOptions = [24, 36, 48, 60, 72, 84]

export default function AutoLoanCalc({ country }) {
  const c = countries[country]
  const d = AUTOLOAN_DEFAULTS[country] || AUTOLOAN_DEFAULTS.us

  const [price, setPrice] = useState(d.price)
  const [down, setDown] = useState(d.down)
  const [tradeIn, setTradeIn] = useState(d.tradeIn)
  const [apr, setApr] = useState(d.apr)
  const [term, setTerm] = useState(d.term)
  const [taxRate, setTaxRate] = useState(d.taxRate)
  const [view, setView] = useState('summary')

  const result = useMemo(
    () => calcAutoLoan({ vehiclePrice: price, downPayment: down, tradeIn, apr, termMonths: term, salesTaxRate: taxRate }),
    [price, down, tradeIn, apr, term, taxRate]
  )

  const schedule = useMemo(
    () => result ? buildSchedule(result.loanAmount, apr, term) : [],
    [result, apr, term]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const pieData = result
    ? [
        { name: 'Principal', value: Math.round(result.loanAmount) },
        { name: 'Total Interest', value: Math.round(result.totalInterest) },
      ]
    : []

  const PIE_COLORS = ['#3b82f6', '#f97316']

  const chartData = schedule.map(r => ({
    month: r.month,
    balance: Math.round(r.balance),
  }))

  const aprHint = (AUTOLOAN_RATES_2026[country] || AUTOLOAN_RATES_2026.us).hint

  const pageTitle = `${c.name} Auto Loan Calculator 2026 | Monthly Payment | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} auto loan calculator. Calculate monthly car payment, total interest, and total cost. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/autoloan`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${c.name} Auto Loan Calculator`,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": c.currency },
          "description": `Free auto loan calculator for ${c.name}. Calculate monthly car payment and total interest.`
        })}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Auto Loan Calculator
          </h1>
          <p className="text-slate-500">Calculate your monthly car payment, total interest and true cost.</p>
        </div>

        <div className="cw-card mb-6">
          {/* Vehicle Details section */}
          <h3 className="font-semibold text-slate-700 text-sm mb-4 uppercase tracking-wider">Vehicle Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <NumericInput
              label={`Vehicle Price (${c.symbol})`}
              value={price}
              onChange={setPrice}
              min={5000}
              max={150000}
              step={1000}
              prefix={c.symbol}
              showSlider
              hint="Average new car: $48k US · $55k CA · £35k UK"
            />
            <NumericInput
              label={`Down Payment (${c.symbol})`}
              value={down}
              onChange={setDown}
              min={0}
              max={50000}
              step={500}
              prefix={c.symbol}
              showSlider
              hint="Recommended: 10-20% of vehicle price"
            />
            <NumericInput
              label={`Trade-In Value (${c.symbol})`}
              value={tradeIn}
              onChange={setTradeIn}
              min={0}
              max={30000}
              step={500}
              prefix={c.symbol}
              showSlider
            />
          </div>

          {/* Financing section */}
          <div className="border-t border-slate-100 mt-5 pt-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4 uppercase tracking-wider">Financing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <NumericInput
                label="APR (%)"
                value={apr}
                onChange={setApr}
                min={2}
                max={25}
                step={0.1}
                suffix="%"
                showSlider
                hint={aprHint}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Loan Term</label>
                <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                  {termOptions.map(t => (
                    <option key={t} value={t}>{t} months ({(t / 12).toFixed(1)} yr)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {country === 'ca' ? 'HST/GST+PST (%)' : (country === 'uk' || country === 'au' || country === 'ie' || country === 'nz') ? 'Tax (included in price)' : 'Sales Tax (%)'}
                </label>
                <NumericInput value={taxRate} onChange={setTaxRate} min={0} step={0.1} suffix="%" />
              </div>
            </div>
          </div>
        </div>

        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'schedule'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}
            >
              {v}
            </button>
          ))}
        </div>

        {result && view === 'summary' && (
          <>
            <ResultSimple
              metrics={[
                { label: 'Monthly Payment', value: fmtD(result.monthly), highlight: true },
                { label: 'Total Interest', value: fmt(result.totalInterest) },
                { label: 'Total Cost', value: fmt(result.totalPaid) },
              ]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="cw-card text-center">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Bi-Weekly Payment</p>
                <p className="font-display font-bold text-2xl text-white">{fmtD(result.biWeekly)}</p>
              </div>
              <div className="cw-card text-center">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Loan Amount</p>
                <p className="font-display font-bold text-2xl text-white">{fmt(result.loanAmount)}</p>
              </div>
            </div>
          </>
        )}

        {result && view === 'chart' && (
          <div className="cw-card space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Principal vs Interest</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmt(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Loan Balance Over Time</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -2 }} tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${c.symbol}${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [fmt(value), 'Balance']} labelFormatter={(l) => `Month ${l}`} />
                  <Area type="monotone" dataKey="balance" stroke="#3b82f6" fill="url(#balanceGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {result && view === 'schedule' && (
          <div className="cw-card">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Amortization Schedule</h3>
            <div className="max-h-96 overflow-y-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="px-3 py-2 text-left font-semibold">Month</th>
                    <th className="px-3 py-2 text-right font-semibold">Payment</th>
                    <th className="px-3 py-2 text-right font-semibold">Principal</th>
                    <th className="px-3 py-2 text-right font-semibold">Interest</th>
                    <th className="px-3 py-2 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr
                      key={row.month}
                      className={row.month % 2 === 0 ? 'bg-slate-50 text-slate-800' : 'bg-white text-slate-800'}
                    >
                      <td className="px-3 py-1.5">{row.month}</td>
                      <td className="px-3 py-1.5 text-right">{fmtD(row.payment)}</td>
                      <td className="px-3 py-1.5 text-right">{fmtD(row.principal)}</td>
                      <td className="px-3 py-1.5 text-right">{fmtD(row.interest)}</td>
                      <td className="px-3 py-1.5 text-right">{fmtD(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            Enter valid values above to see your results.
          </div>
        )}

        <AppDownloadBanner calcKey="autoloan" country={country} />
        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>

      <CalcIntro intro="An auto loan calculator helps you find the exact monthly payment for your vehicle financing. Enter the vehicle price, your down payment, trade-in value, APR and loan term to see total interest and true cost of ownership." />
      <CalcFAQ faqs={[
        { q: 'What is a good APR for a car loan?', a: 'In 2026, good credit borrowers get 5-7% APR. Average is around 7-9%. Credit unions often offer lower rates than dealerships.' },
        { q: 'Should I put more money down?', a: 'Yes — a larger down payment reduces your loan amount, monthly payments and total interest paid. Aim for at least 10-20% down.' },
        { q: 'Is a longer loan term better?', a: 'Longer terms (72-84 months) lower monthly payments but significantly increase total interest. 48-60 months is typically the sweet spot.' },
      ]} />
      <CalcRelated links={[
        { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
        { to: `/${country}/loan-payoff`, label: 'Loan Payoff' },
        { to: `/${country}/affordability`, label: 'Affordability Calculator' },
      ]} />
    </>
  )
}
