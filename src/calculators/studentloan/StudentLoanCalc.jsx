import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

const POVERTY_LINE = 15060  // 2025 federal poverty line, family of 1
const POVERTY_MULTIPLIERS = { 1: 1, 2: 1.35, 3: 1.62, 4: 1.89 }

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

export default function StudentLoanCalc({ country = 'us' }) {
  const [balance, setBalance] = useState(35000)
  const [rate, setRate] = useState(6.54)
  const [income, setIncome] = useState(55000)
  const [familySize, setFamilySize] = useState(1)

  const results = useMemo(() => {
    if (!balance || !rate || !income) return null

    const standard = calcStandard({ balance, rate })
    const ibr = calcIDR({ balance, rate, income, familySize, planName: 'IBR', payPct: 0.10, povertyMultiplier: 1.5, maxYears: 25 })
    const paye = calcIDR({ balance, rate, income, familySize, planName: 'PAYE', payPct: 0.10, povertyMultiplier: 1.5, maxYears: 20 })
    const save = calcIDR({ balance, rate, income, familySize, planName: 'SAVE', payPct: 0.05, povertyMultiplier: 2.25, maxYears: 25 })

    return { standard, ibr, paye, save }
  }, [balance, rate, income, familySize])

  const fmt = (n) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  const fmtD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const years = (m) => `${Math.round(m / 12)} yr`

  return (
    <>
      <Helmet>
        <title>Student Loan Calculator US 2026 — IBR, PAYE, SAVE Plan Comparison | CalcWise</title>
        <meta name="description" content="Compare US student loan repayment plans: Standard, IBR, PAYE, SAVE. Calculate monthly payment, total interest, and loan forgiveness. Updated 2026." />
        <link rel="canonical" href="https://calqwise.com/us/student-loan" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">🎓 Student Loan Calculator</h1>
          <p className="text-cw-gray">Compare Standard, IBR, PAYE, and SAVE repayment plans.</p>
        </div>

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

        {results && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[results.standard, results.ibr, results.paye, results.save].map((plan, i) => (
              <div key={i} className={`cw-card ${i === 0 ? '' : 'border-primary/20'}`}>
                <h3 className="font-bold text-accent mb-3">
                  {i === 0 ? '📋 Standard (10yr)' : i === 1 ? '💡 IBR (25yr)' : i === 2 ? '⚡ PAYE (20yr)' : '🌟 SAVE (25yr)'}
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

        <div className="mt-4 p-3 bg-white/[0.03] rounded-lg text-xs text-cw-gray">
          ℹ️ IDR plan calculations are estimates. Actual payments depend on your exact AGI, family size, and plan eligibility. SAVE plan benefits are subject to ongoing legal proceedings. Consult StudentAid.gov for current information.
        </div>

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
