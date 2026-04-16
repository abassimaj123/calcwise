import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const POVERTY_LINE = 15060  // 2025 federal poverty line, family of 1
const POVERTY_MULTIPLIERS = { 1: 1, 2: 1.35, 3: 1.62, 4: 1.89 }

const PIE_COLORS = ['#6366f1', '#f59e0b']
const AREA_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981']

function calcStandard({ balance, rate, termYears = 10 }) {
  const monthlyRate = rate / 100 / 12
  const n = termYears * 12
  if (balance <= 0 || monthlyRate <= 0) return null
  const payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  return { payment, totalPaid: payment * n, totalInterest: payment * n - balance, months: n, forgiveness: 0 }
}

function calcIDR({ balance, rate, income, familySize, planName, payPct, povertyMultiplier, maxYears }) {
  const povertyGuideline = POVERTY_LINE * (POVERTY_MULTIPLIERS[familySize] || 1.89)
  const discretionary = Math.max(0, income - povertyGuideline * povertyMultiplier)
  const annualPayment = discretionary * payPct
  const monthlyPayment = Math.max(0, annualPayment / 12)

  const monthlyRate = rate / 100 / 12
  let balance_ = balance
  let months = 0
  let totalInterest = 0
  let totalPaid = 0

  while (balance_ > 0.01 && months < maxYears * 12) {
    const interest = balance_ * monthlyRate
    const payment = Math.min(monthlyPayment, balance_ + interest)
    balance_ = balance_ + interest - payment
    totalInterest += interest
    totalPaid += payment
    months++
  }

  const forgiveness = Math.max(0, balance_)

  return { payment: monthlyPayment, totalPaid, totalInterest, months, forgiveness, planName }
}

// Build yearly balance schedule for a plan
function buildSchedule({ balance, rate, monthlyPayment, maxMonths }) {
  const monthlyRate = rate / 100 / 12
  let bal = balance
  const rows = [{ year: 0, balance: Math.round(bal) }]
  for (let m = 1; m <= maxMonths; m++) {
    const interest = bal * monthlyRate
    const payment = Math.min(monthlyPayment, bal + interest)
    bal = Math.max(0, bal + interest - payment)
    if (m % 12 === 0) rows.push({ year: m / 12, balance: Math.round(bal) })
  }
  return rows
}

// Build yearly amortization table
function buildYearlyAmort({ balance, rate, monthlyPayment, maxMonths }) {
  const monthlyRate = rate / 100 / 12
  let bal = balance
  const rows = []
  for (let yr = 1; yr * 12 <= maxMonths && bal > 0.01; yr++) {
    let yearInterest = 0
    let yearPrincipal = 0
    let yearPaid = 0
    for (let m = 0; m < 12 && bal > 0.01; m++) {
      const interest = bal * monthlyRate
      const payment = Math.min(monthlyPayment, bal + interest)
      const principal = payment - interest
      yearInterest += interest
      yearPrincipal += principal
      yearPaid += payment
      bal = Math.max(0, bal - principal)
    }
    rows.push({
      year: yr,
      payment: Math.round(monthlyPayment),
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.round(bal),
    })
    if (bal <= 0.01) break
  }
  return rows
}

export default function StudentLoanCalc({ country = 'us' }) {
  const [balance, setBalance] = useState(35000)
  const [rate, setRate] = useState(6.54)
  const [income, setIncome] = useState(55000)
  const [familySize, setFamilySize] = useState(1)
  const [tab, setTab] = useState('summary')

  const results = useMemo(() => {
    if (!balance || !rate || !income) return null

    const standard = calcStandard({ balance, rate })
    const ibr = calcIDR({ balance, rate, income, familySize, planName: 'IBR', payPct: 0.10, povertyMultiplier: 1.5, maxYears: 25 })
    const paye = calcIDR({ balance, rate, income, familySize, planName: 'PAYE', payPct: 0.10, povertyMultiplier: 1.5, maxYears: 20 })
    const save = calcIDR({ balance, rate, income, familySize, planName: 'SAVE', payPct: 0.05, povertyMultiplier: 2.25, maxYears: 25 })

    return { standard, ibr, paye, save }
  }, [balance, rate, income, familySize])

  // Chart data: balance over time for Standard and SAVE
  const balanceChartData = useMemo(() => {
    if (!results) return []
    const stdSched = buildSchedule({ balance, rate, monthlyPayment: results.standard.payment, maxMonths: results.standard.months })
    const saveSched = buildSchedule({ balance, rate, monthlyPayment: results.save.payment, maxMonths: results.save.months })

    const maxYr = Math.max(stdSched[stdSched.length - 1]?.year || 0, saveSched[saveSched.length - 1]?.year || 0)
    const data = []
    for (let y = 0; y <= maxYr; y++) {
      const stdPt = stdSched.find(r => r.year === y)
      const savePt = saveSched.find(r => r.year === y)
      data.push({
        year: `Yr ${y}`,
        Standard: stdPt ? stdPt.balance : 0,
        SAVE: savePt ? savePt.balance : undefined,
      })
    }
    return data
  }, [results, balance, rate])

  // Pie: principal vs interest at payoff for standard plan
  const pieData = results
    ? [
        { name: 'Principal', value: balance },
        { name: 'Total Interest', value: Math.round(results.standard.totalInterest) },
      ]
    : []

  // Amortization schedule for standard plan
  const amortRows = useMemo(() => {
    if (!results) return []
    return buildYearlyAmort({ balance, rate, monthlyPayment: results.standard.payment, maxMonths: results.standard.months })
  }, [results, balance, rate])

  const fmt = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const years = (m) => `${Math.round(m / 12)} yr`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Student Loan Calculator US 2026',
    url: `https://calqwise.com/${country}/student-loan`,
    applicationCategory: 'FinanceApplication',
    description: 'Compare US student loan repayment plans: Standard, IBR, PAYE, SAVE. Calculate monthly payment, total interest, and loan forgiveness.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <Helmet>
        <title>Student Loan Calculator US 2026 — IBR, PAYE, SAVE Plan Comparison | CalcWise</title>
        <meta name="description" content="Compare US student loan repayment plans: Standard, IBR, PAYE, SAVE. Calculate monthly payment, total interest, and loan forgiveness. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/student-loan" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Student Loan Calculator</h1>
          <p className="text-cw-gray">Compare Standard, IBR, PAYE, and SAVE repayment plans.</p>
        </div>

        <CalcIntro
          intro="The student loan calculator shows your monthly payment, total interest, and payoff date based on your loan balance, interest rate, and repayment term. Compare standard and extended repayment plans to make the best choice."
          hiddenCost="Extended repayment plans double or triple total interest"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Loan Balance ($)</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix="$" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Interest Rate (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Annual Gross Income ($)</label>
              <NumericInput value={income} onChange={setIncome} min={0} step={1000} prefix="$" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Family Size</label>
              <select className="cw-input" value={familySize} onChange={e => setFamilySize(+e.target.value)}>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} person{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['summary', 'chart', 'schedule'].map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                tab === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {results && tab === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[results.standard, results.ibr, results.paye, results.save].map((plan, i) => (
              <div key={i} className={`cw-card ${i === 0 ? '' : 'border-primary/20'}`}>
                <h3 className="font-bold text-accent mb-3">
                  {i === 0 ? 'Standard (10yr)' : i === 1 ? 'IBR (25yr)' : i === 2 ? 'PAYE (20yr)' : 'SAVE (25yr)'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cw-gray">Monthly Payment</span>
                    <span className="font-semibold">{fmtD(plan.payment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cw-gray">Payoff Time</span>
                    <span>{years(plan.months)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cw-gray">Total Interest</span>
                    <span>{fmt(plan.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cw-gray">Total Paid</span>
                    <span className="font-bold">{fmt(plan.totalPaid)}</span>
                  </div>
                  {plan.forgiveness > 0 && (
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-cw-gray">Forgiven Balance</span>
                      <span className="text-cw-success font-bold">{fmt(plan.forgiveness)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results && tab === 'chart' && (
          <div className="space-y-6">
            <div className="cw-card">
              <h3 className="font-semibold text-sm mb-1">Loan Balance Over Time</h3>
              <p className="text-xs text-cw-gray mb-4">Standard (10yr) vs SAVE plan — balance remaining each year</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={balanceChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="stdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    interval={Math.max(1, Math.floor(balanceChartData.length / 8))}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={v => v !== undefined ? `$${v.toLocaleString()}` : 'N/A'}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="Standard" stroke="#6366f1" fill="url(#stdGrad)" strokeWidth={2} connectNulls />
                  <Area type="monotone" dataKey="SAVE" stroke="#22d3ee" fill="url(#saveGrad)" strokeWidth={2} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="cw-card">
              <h3 className="font-semibold text-sm mb-4">Principal vs Interest (Standard Plan)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={v => `$${v.toLocaleString()}`}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {results && tab === 'schedule' && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold text-sm mb-4">Yearly Amortization — Standard Plan</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-cw-gray">
                  <th className="text-left py-2 pr-3">Year</th>
                  <th className="text-right py-2 pr-3">Monthly Pmt</th>
                  <th className="text-right py-2 pr-3">Principal</th>
                  <th className="text-right py-2 pr-3">Interest</th>
                  <th className="text-right py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortRows.map(row => (
                  <tr key={row.year} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-3">{row.year}</td>
                    <td className="text-right py-2 pr-3">{fmt(row.payment)}</td>
                    <td className="text-right py-2 pr-3 text-cw-success">{fmt(row.principal)}</td>
                    <td className="text-right py-2 pr-3 text-amber-400">{fmt(row.interest)}</td>
                    <td className="text-right py-2 font-semibold">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-3 bg-white/[0.03] rounded-lg text-xs text-cw-gray">
          ℹ️ IDR plan calculations are estimates. Actual payments depend on your exact AGI, family size, and plan eligibility. SAVE plan benefits are subject to ongoing legal proceedings. Consult StudentAid.gov for current information.
        </div>

        <CalcFAQ faqs={[
          { q: 'What repayment term should I choose?', a: 'Standard 10-year plans minimize total interest. Extended plans (20-25 years) lower monthly payments but cost significantly more. Income-based plans cap payments at 5-10% of discretionary income.' },
          { q: 'Should I pay extra on my student loans?', a: 'If your rate is above 5-6%, yes. Extra payments reduce principal directly and cut total interest dramatically. Even $50-100/month extra saves thousands over the loan term.' },
          { q: 'What is student loan refinancing?', a: 'Refinancing replaces your existing loans with a new private loan at a lower rate. You lose federal protections (IBR, forgiveness) so weigh carefully before refinancing federal loans.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/loan-payoff`, label: 'Loan Payoff Calculator' },
          { to: `/${country}/salary`, label: 'Salary Calculator' },
          { to: `/${country}/tax`, label: 'Tax Calculator' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
