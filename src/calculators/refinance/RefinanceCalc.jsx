import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

function calcRefinance({ currentBalance, currentRate, remainingMonths, newRate, newTermYears, closingCosts }) {
  const currentMonthlyRate = currentRate / 100 / 12
  const newMonthlyRate = newRate / 100 / 12
  const n = newTermYears * 12

  if (currentBalance <= 0 || currentMonthlyRate <= 0 || newMonthlyRate <= 0) return null

  const currentPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, remainingMonths)) / (Math.pow(1 + currentMonthlyRate, remainingMonths) - 1)
  const newPayment = currentBalance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, n)) / (Math.pow(1 + newMonthlyRate, n) - 1)

  const monthlySavings = currentPayment - newPayment
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity

  const currentTotalRemaining = currentPayment * remainingMonths
  const newTotal = newPayment * n + closingCosts
  const lifetimeSavings = currentTotalRemaining - newTotal

  // Cumulative interest data for chart (sample every 12 months)
  const oldInterestData = []
  let oldBalance = currentBalance
  let cumulOldInterest = 0
  let newBalance = currentBalance
  let cumulNewInterest = closingCosts // include closing costs upfront

  const maxMonths = Math.max(remainingMonths, n)
  const step = Math.max(1, Math.floor(maxMonths / 20))

  for (let mo = 0; mo <= maxMonths; mo += step) {
    // Old loan cumulative interest up to month mo
    let ci = 0
    let bal = currentBalance
    for (let i = 0; i < mo && i < remainingMonths; i++) {
      const interest = bal * currentMonthlyRate
      ci += interest
      bal -= (currentPayment - interest)
    }

    // New loan cumulative interest up to month mo
    let ni = closingCosts
    let nbal = currentBalance
    for (let i = 0; i < mo && i < n; i++) {
      const interest = nbal * newMonthlyRate
      ni += interest
      nbal -= (newPayment - interest)
    }

    oldInterestData.push({
      month: mo,
      'Old Loan': Math.round(ci),
      'New Loan': Math.round(ni),
    })
  }

  return {
    currentPayment, newPayment, monthlySavings, breakEvenMonths,
    currentTotalRemaining, newTotal, lifetimeSavings,
    cumulativeData: oldInterestData,
  }
}

const defaultsByCountry = {
  us: { balance: 320000, currentRate: 7.5, newRate: 6.5, closingCosts: 6000 },
  ca: { balance: 400000, currentRate: 5.5, newRate: 4.75, closingCosts: 3000 },
  uk: { balance: 200000, currentRate: 5.5, newRate: 4.5, closingCosts: 2000 },
  au: { balance: 500000, currentRate: 6.5, newRate: 5.75, closingCosts: 2000 },
  ie: { balance: 300000, currentRate: 4.5, newRate: 3.75, closingCosts: 2000 },
  nz: { balance: 500000, currentRate: 7.0, newRate: 6.0, closingCosts: 2000 },
}

const jsonLd = (country) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Refinance Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: `Calculate mortgage refinance savings, break-even point, and lifetime savings in ${country.toUpperCase()}.`,
})

export default function RefinanceCalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [currentRate, setCurrentRate] = useState(d.currentRate)
  const [remainingYears, setRemainingYears] = useState(25)
  const [newRate, setNewRate] = useState(d.newRate)
  const [newTerm, setNewTerm] = useState(30)
  const [closingCosts, setClosingCosts] = useState(d.closingCosts)
  const [view, setView] = useState('summary')

  const result = useMemo(
    () => calcRefinance({ currentBalance: balance, currentRate, remainingMonths: remainingYears * 12, newRate, newTermYears: newTerm, closingCosts }),
    [balance, currentRate, remainingYears, newRate, newTerm, closingCosts]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  // Monthly savings bar chart data
  const savingsBarData = result ? [
    {
      name: 'Monthly',
      'Current Payment': Math.round(result.currentPayment),
      'New Payment': Math.round(result.newPayment),
    },
  ] : []

  return (
    <>
      <Helmet>
        <title>Refinance Calculator {c.name} 2026 — Break-Even &amp; Monthly Savings | CalcWise</title>
        <meta name="description" content={`Calculate mortgage refinance savings, break-even point, and lifetime savings in ${c.name}. Free refinance calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/refinance`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd(country))}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Refinance Calculator</h1>
          <p className="text-slate-500">Is it worth refinancing? Find your break-even point and lifetime savings.</p>
        </div>

        <CalcIntro intro="The mortgage refinance calculator shows whether refinancing makes financial sense. It calculates your monthly savings, break-even point (when savings exceed closing costs), and total interest saved over the life of the loan." hiddenCost="Closing costs add 2-5% to your new loan" />

        <div className="cw-card mb-6">
          <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4">Current Mortgage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Outstanding Balance ({c.symbol})</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Current Rate (%)</label>
              <NumericInput value={currentRate} onChange={setCurrentRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Remaining Term (years)</label>
              <select className="cw-input" value={remainingYears} onChange={e => setRemainingYears(+e.target.value)}>
                {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
          </div>

          <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-4 mt-6">New Mortgage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">New Rate (%)</label>
              <NumericInput value={newRate} onChange={setNewRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">New Term (years)</label>
              <select className="cw-input" value={newTerm} onChange={e => setNewTerm(+e.target.value)}>
                {[10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Closing Costs ({c.symbol})</label>
              <NumericInput value={closingCosts} onChange={setClosingCosts} min={0} step={100} prefix={c.symbol} />
            </div>
          </div>
        </div>

        <div className="cw-tabs mb-4">
          {['summary', 'chart', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}>
              {v}
            </button>
          ))}
        </div>

        {result && view === 'summary' && (
          <ResultSimple
            metrics={[
              {
                label: 'Break-Even Point',
                value: result.breakEvenMonths === Infinity ? 'Never' : `${result.breakEvenMonths} mo`,
                highlight: true,
                sub: result.breakEvenMonths < Infinity ? `≈ ${(result.breakEvenMonths / 12).toFixed(1)} years` : 'Rate too high',
              },
              { label: 'Monthly Savings', value: fmtD(result.monthlySavings) },
              { label: 'Lifetime Savings', value: fmt(result.lifetimeSavings) },
            ]}
          />
        )}

        {result && view === 'chart' && (
          <div className="space-y-8">
            {/* Cumulative interest AreaChart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Cumulative Interest Paid — Old vs New Loan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={result.cumulativeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="oldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="month" tickFormatter={v => `Mo ${v}`} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmt(v)} labelFormatter={l => `Month ${l}`} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                  <Area type="monotone" dataKey="Old Loan" stroke="#f43f5e" strokeWidth={2} fill="url(#oldGrad)" />
                  <Area type="monotone" dataKey="New Loan" stroke="#6366f1" strokeWidth={2} fill="url(#newGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly savings BarChart */}
            <div className="cw-card">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Monthly Payment Comparison</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={savingsBarData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v) => fmtD(v)} contentStyle={{ background: '#1e2130', border: 'none', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Current Payment" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="New Payment" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {result.monthlySavings > 0 && (
                <p className="text-center text-sm text-slate-500 mt-2">
                  Monthly saving: <span className="text-cw-success font-semibold">{fmtD(result.monthlySavings)}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {result && view === 'detailed' && (
          <ResultDetailed
            title="Refinance Analysis"
            rows={[
              { label: 'Current Monthly Payment', value: fmtD(result.currentPayment) },
              { label: 'New Monthly Payment', value: fmtD(result.newPayment), bold: true },
              { label: 'Monthly Savings', value: fmtD(result.monthlySavings), bold: true },
              { label: 'Closing Costs', value: fmt(closingCosts) },
              { label: 'Break-Even Point', value: result.breakEvenMonths === Infinity ? 'Never' : `${result.breakEvenMonths} months`, bold: true },
              { label: 'Remaining Payments (current)', value: fmt(result.currentTotalRemaining) },
              { label: 'Total New Mortgage Cost', value: fmt(result.newTotal) },
              { label: 'Lifetime Savings', value: fmt(result.lifetimeSavings), bold: true },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            Enter your current and new mortgage details above.
          </div>
        )}

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          This calculator assumes you refinance the full remaining balance. Actual closing costs vary by lender and location. Rate buydowns and lender credits not included.
        </div>

        <AdSenseSlot format="rectangle" />

        <CalcFAQ faqs={[
          { q: 'When does refinancing make sense?', a: 'Generally when you can lower your rate by at least 0.75-1%, plan to stay in the home past the break-even point, and closing costs are reasonable (2-3 years to recoup).' },
          { q: 'What are typical refinancing closing costs?', a: 'Usually 2-5% of loan amount. On a $400k loan this is $8,000-$20,000. Some lenders offer no-closing-cost refinances with a slightly higher rate.' },
          { q: 'Should I reset to a 30-year term when refinancing?', a: 'Not always. Resetting extends your payoff date. Consider refinancing to a shorter term (15 or 20 years) to save more interest even with similar monthly payment.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/loan-payoff`, label: 'Loan Payoff' },
          { to: `/${country}/affordability`, label: 'Affordability' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
