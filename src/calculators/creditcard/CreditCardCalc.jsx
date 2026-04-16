import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444']

function simulate(balance, monthlyRate, getPayment) {
  let bal = balance
  let months = 0
  let totalInterest = 0
  let totalPaid = 0
  const schedule = []

  while (bal > 0.01 && months < 1200) {
    const interest = bal * monthlyRate
    let payment = getPayment(bal)
    payment = Math.min(payment, bal + interest)
    if (payment <= interest) break

    totalInterest += interest
    totalPaid += payment
    bal = bal + interest - payment
    months++
    schedule.push({ month: months, balance: Math.max(0, bal), interest, payment })
  }
  return { months, totalInterest, totalPaid, schedule }
}

function calcCreditCard({ balance, apr, minType, minPct, minFixed, extraPayment }) {
  const monthlyRate = apr / 100 / 12
  if (balance <= 0 || monthlyRate <= 0) return null

  const getMinPayment = (bal) =>
    minType === 'percent' ? Math.max(bal * (minPct / 100), 25) : minFixed

  const withExtra = simulate(balance, monthlyRate, (bal) => getMinPayment(bal) + extraPayment)
  const withoutExtra = simulate(balance, monthlyRate, (bal) => getMinPayment(bal))

  const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest
  const monthsSaved = withoutExtra.months - withExtra.months

  return {
    ...withExtra,
    interestSaved,
    monthsSaved,
    totalInterestNoExtra: withoutExtra.totalInterest,
    scheduleMin: withoutExtra.schedule,
  }
}

function buildAreaData(scheduleWith, scheduleMin, maxMonths) {
  const len = Math.min(maxMonths, Math.max(scheduleWith.length, scheduleMin.length))
  const data = []
  for (let i = 0; i < len; i += Math.max(1, Math.floor(len / 60))) {
    data.push({
      month: i + 1,
      withExtra: scheduleWith[i] ? +scheduleWith[i].balance.toFixed(2) : 0,
      minOnly: scheduleMin[i] ? +scheduleMin[i].balance.toFixed(2) : 0,
    })
  }
  // ensure final point
  if (data[data.length - 1]?.month !== len) {
    data.push({
      month: len,
      withExtra: 0,
      minOnly: scheduleMin[len - 1] ? +scheduleMin[len - 1].balance.toFixed(2) : 0,
    })
  }
  return data
}

const defaultsByCountry = {
  us: { balance: 8500, apr: 24.99 },
  ca: { balance: 5000, apr: 19.99 },
  uk: { balance: 3000, apr: 24.9 },
  au: { balance: 4000, apr: 19.99 },
  ie: { balance: 3000, apr: 22.9 },
  nz: { balance: 3000, apr: 19.95 },
}

const TABS = ['summary', 'chart', 'payoff']

export default function CreditCardCalc({ country = 'us' }) {
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [apr, setApr] = useState(d.apr)
  const [minType, setMinType] = useState('percent')
  const [minPct, setMinPct] = useState(2)
  const [minFixed, setMinFixed] = useState(200)
  const [extraPayment, setExtraPayment] = useState(100)
  const [tab, setTab] = useState('summary')

  const result = useMemo(
    () => calcCreditCard({ balance, apr, minType, minPct, minFixed, extraPayment }),
    [balance, apr, minType, minPct, minFixed, extraPayment]
  )

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt0 = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmtK = (n) => {
    if (Math.abs(n) >= 1000) return `${c.symbol}${(n / 1000).toFixed(1)}k`
    return fmt0(n)
  }

  const months2years = (m) => {
    const y = Math.floor(m / 12)
    const mo = m % 12
    return y > 0 ? `${y}y ${mo}m` : `${mo}m`
  }

  const areaData = useMemo(() => {
    if (!result) return []
    return buildAreaData(result.schedule, result.scheduleMin, result.scheduleMin.length)
  }, [result])

  const pieData = result
    ? [
        { name: 'Original Balance', value: +balance.toFixed(2) },
        { name: 'Total Interest', value: +result.totalInterest.toFixed(2) },
      ]
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Credit Card Payoff Calculator ${c.name}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Calculate how long to pay off your credit card in ${c.name} and how much interest you'll pay with extra payments.`,
    url: `https://calqwise.com/${country}/credit-card`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <Helmet>
        <title>Credit Card Payoff Calculator {c.name} 2026 | CalcWise</title>
        <meta name="description" content={`Calculate how long to pay off your credit card in ${c.name} and how much interest you'll pay. See savings from extra payments. Free credit card payoff calculator.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/credit-card`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Credit Card Payoff Calculator</h1>
          <p className="text-cw-gray">Find out when you'll be debt-free and how much interest you can save.</p>
        </div>

        <CalcIntro
          intro="This credit card payoff calculator shows exactly how long it will take to pay off your balance at minimum payments — and how much you can save by paying more each month."
          hiddenCost="Minimum payments cost 3-4x more in interest"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Current Balance ({c.symbol})</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">APR (%)</label>
              <NumericInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Minimum Payment Type</label>
              <select className="cw-input" value={minType} onChange={e => setMinType(e.target.value)}>
                <option value="percent">% of Balance</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              {minType === 'percent' ? (
                <>
                  <label className="block text-xs text-cw-gray mb-1">Min Payment % (min {c.symbol}25)</label>
                  <NumericInput value={minPct} onChange={setMinPct} min={1} step={0.5} suffix="%" />
                </>
              ) : (
                <>
                  <label className="block text-xs text-cw-gray mb-1">Fixed Monthly Payment ({c.symbol})</label>
                  <NumericInput value={minFixed} onChange={setMinFixed} min={25} step={50} prefix={c.symbol} />
                </>
              )}
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Extra Monthly Payment ({c.symbol})</label>
              <NumericInput value={extraPayment} onChange={setExtraPayment} min={0} step={50} prefix={c.symbol} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                tab === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your credit card details above.
          </div>
        )}

        {/* Summary Tab */}
        {result && tab === 'summary' && (
          <>
            <ResultSimple
              metrics={[
                { label: 'Payoff Time', value: months2years(result.months), highlight: true },
                { label: 'Total Interest', value: fmt0(result.totalInterest) },
                { label: 'Interest Saved', value: fmt0(result.interestSaved), sub: `${months2years(result.monthsSaved)} faster` },
              ]}
            />
            <ResultDetailed
              title="Payoff Details"
              rows={[
                { label: 'Balance', value: fmt0(balance) },
                { label: 'APR', value: `${apr}%` },
                { label: 'Payoff Time (with extra)', value: months2years(result.months), bold: true },
                { label: 'Total Interest', value: fmt0(result.totalInterest) },
                { label: 'Total Paid', value: fmt(result.totalPaid), bold: true },
                { label: 'Interest Without Extra', value: fmt0(result.totalInterestNoExtra) },
                { label: 'Interest Saved', value: fmt0(result.interestSaved), bold: true },
                { label: 'Time Saved', value: months2years(result.monthsSaved), bold: true },
              ]}
            />
          </>
        )}

        {/* Chart Tab */}
        {result && tab === 'chart' && (
          <div className="space-y-6">
            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">Remaining Balance Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={areaData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExtra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
                  <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={60} />
                  <Tooltip formatter={(v) => fmt0(v)} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Area type="monotone" dataKey="minOnly" name="Min Payment Only" stroke={COLORS[1]} fill="url(#gradMin)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="withExtra" name={`With +${fmt0(extraPayment)} Extra`} stroke={COLORS[0]} fill="url(#gradExtra)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">Balance vs Total Interest Paid</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt0(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payoff Table Tab */}
        {result && tab === 'payoff' && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold mb-4 text-sm">Monthly Payment Schedule (with extra payment)</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-3 text-cw-gray font-medium">Month</th>
                  <th className="text-right py-2 pr-3 text-cw-gray font-medium">Payment</th>
                  <th className="text-right py-2 pr-3 text-cw-gray font-medium">Interest</th>
                  <th className="text-right py-2 text-cw-gray font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-1.5 pr-3">{row.month}</td>
                    <td className="py-1.5 pr-3 text-right">{fmt(row.payment)}</td>
                    <td className="py-1.5 pr-3 text-right text-amber-600">{fmt(row.interest)}</td>
                    <td className="py-1.5 text-right">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdSenseSlot format="rectangle" />

        <CalcFAQ faqs={[
          { q: 'Why should I pay more than the minimum?', a: 'Minimum payments are designed to maximize interest revenue for the bank. Paying just $50-100 more per month can cut years off your payoff and save thousands in interest.' },
          { q: 'What APR is considered high for a credit card?', a: 'Anything above 20% APR is considered high. Average credit card APR in 2026 is around 21-24%. Premium travel cards can exceed 28%.' },
          { q: 'Should I consolidate my credit card debt?', a: 'If you can get a personal loan or balance transfer at a lower APR, consolidation can save significant money. Compare total interest paid before and after.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/loan-payoff`, label: 'Loan Payoff Calculator' },
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/salary`, label: 'Salary Calculator' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
