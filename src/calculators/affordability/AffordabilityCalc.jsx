import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'

function calcAffordabilityUS({ grossIncome, monthlyDebts, downPayment, rate, loanType }) {
  // Front-end DTI limits
  const frontEndLimits = { conventional: 0.28, fha: 0.31, va: 0.41 }
  // Back-end DTI limits
  const backEndLimits = { conventional: 0.36, fha: 0.43, va: 0.41 }

  const monthlyIncome = grossIncome / 12
  const maxFrontEnd = monthlyIncome * (frontEndLimits[loanType] || 0.28)
  const maxBackEnd = monthlyIncome * (backEndLimits[loanType] || 0.36) - monthlyDebts
  const maxMonthlyPayment = Math.min(maxFrontEnd, maxBackEnd)

  const monthlyRate = rate / 100 / 12
  const n = 30 * 12
  // Reverse mortgage formula: P = payment * [(1-(1+r)^-n)/r]
  const maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -n)) / monthlyRate)
  const maxHomePrice = maxLoan + downPayment

  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const frontEndDTI = ((actualMonthly / monthlyIncome) * 100).toFixed(1)
  const backEndDTI = (((actualMonthly + monthlyDebts) / monthlyIncome) * 100).toFixed(1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    frontEndDTI, backEndDTI, monthlyIncome,
  }
}

function calcAffordabilityUK({ grossIncome, monthlyDebts, downPayment, rate }) {
  // FCA stress test: rate + 3% or floor 7%
  const stressRate = Math.max(rate + 3, 7.0)
  const monthlyIncome = grossIncome / 12
  // FCA: max 4.5x income (standard), some lenders up to 5.5x for high earners
  const maxLoan = grossIncome * 4.5
  const maxHomePrice = maxLoan + downPayment

  const monthlyRate = rate / 100 / 12
  const n = 25 * 12
  const actualMonthly = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const stressMonthlyRate = stressRate / 100 / 12
  const stressPayment = maxLoan * (stressMonthlyRate * Math.pow(1 + stressMonthlyRate, n)) / (Math.pow(1 + stressMonthlyRate, n) - 1)

  return {
    maxHomePrice, maxLoan, maxMonthlyPayment: actualMonthly,
    stressRate, stressPayment, ltv: ((maxLoan / maxHomePrice) * 100).toFixed(1),
  }
}

const loanTypes = [
  { value: 'conventional', label: 'Conventional (28/36 DTI)' },
  { value: 'fha', label: 'FHA (31/43 DTI)' },
  { value: 'va', label: 'VA (41% DTI)' },
]

export default function AffordabilityCalc({ country = 'us' }) {
  const [grossIncome, setGrossIncome] = useState(country === 'uk' ? 60000 : 90000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [downPayment, setDownPayment] = useState(country === 'uk' ? 50000 : 60000)
  const [rate, setRate] = useState(country === 'uk' ? 4.5 : 7.0)
  const [loanType, setLoanType] = useState('conventional')
  const [view, setView] = useState('simple')

  const result = useMemo(() => {
    if (!grossIncome || !downPayment) return null
    if (country === 'uk') {
      return calcAffordabilityUK({ grossIncome, monthlyDebts, downPayment, rate })
    }
    return calcAffordabilityUS({ grossIncome, monthlyDebts, downPayment, rate, loanType })
  }, [grossIncome, monthlyDebts, downPayment, rate, loanType, country])

  const sym = country === 'uk' ? '£' : '$'
  const locale = country === 'uk' ? 'en-GB' : 'en-US'
  const currency = country === 'uk' ? 'GBP' : 'USD'

  const fmt = (n) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
  const fmtD = (n) => new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const pageTitle = country === 'uk'
    ? 'UK Mortgage Affordability Calculator 2026 — FCA Stress Test | CalcWise'
    : 'US Home Affordability Calculator 2026 — DTI & Max Home Price | CalcWise'

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`How much ${country === 'uk' ? 'property' : 'home'} can you afford? ${country === 'uk' ? 'FCA stress test, 4.5x income rule.' : 'Front-end & back-end DTI. FHA, VA, Conventional comparison.'} Free calculator. Updated 2026.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/affordability`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {country === 'uk' ? '🇬🇧' : '🇺🇸'} Affordability Calculator
          </h1>
          <p className="text-cw-gray">
            {country === 'uk'
              ? 'How much can you borrow? Based on FCA stress test and 4.5x income rule.'
              : 'How much home can you afford? Based on front-end and back-end DTI rules.'}
          </p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Annual Gross Income ({sym})</label>
              <input type="number" className="cw-input" value={grossIncome} min={0} step={1000} onChange={e => setGrossIncome(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Monthly Debts ({sym})</label>
              <input type="number" className="cw-input" value={monthlyDebts} min={0}
                onChange={e => setMonthlyDebts(+e.target.value)}
                placeholder="Car loan, student loan, etc." />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Down Payment ({sym})</label>
              <input type="number" className="cw-input" value={downPayment} min={0} onChange={e => setDownPayment(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Mortgage Rate (%)</label>
              <input type="number" step="0.1" className="cw-input" value={rate} min={0} onChange={e => setRate(+e.target.value)} />
            </div>
            {country === 'us' && (
              <div className="sm:col-span-2">
                <label className="block text-xs text-cw-gray mb-1">Loan Type</label>
                <select className="cw-input" value={loanType} onChange={e => setLoanType(e.target.value)}>
                  {loanTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['simple', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                view === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}>
              {v}
            </button>
          ))}
        </div>

        {result && view === 'simple' && (
          <ResultSimple
            metrics={[
              { label: 'Max Home Price', value: fmt(result.maxHomePrice), highlight: true },
              { label: 'Max Loan', value: fmt(result.maxLoan) },
              { label: 'Est. Monthly Payment', value: fmtD(result.maxMonthlyPayment) },
            ]}
          />
        )}

        {result && view === 'detailed' && country === 'us' && (
          <ResultDetailed
            title="Affordability Analysis"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Monthly Income', value: fmt(result.monthlyIncome) },
              { label: 'Monthly Debts', value: fmt(monthlyDebts) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Home Price', value: fmt(result.maxHomePrice), bold: true },
              { label: 'Monthly Payment', value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'Front-End DTI', value: `${result.frontEndDTI}%`, sub: `Limit: ${loanType === 'fha' ? '31' : loanType === 'va' ? '41' : '28'}%` },
              { label: 'Back-End DTI', value: `${result.backEndDTI}%`, sub: `Limit: ${loanType === 'fha' ? '43' : loanType === 'va' ? '41' : '36'}%` },
            ]}
          />
        )}

        {result && view === 'detailed' && country === 'uk' && (
          <ResultDetailed
            title="Affordability Analysis"
            rows={[
              { label: 'Annual Income', value: fmt(grossIncome) },
              { label: 'Income Multiple (4.5x)', value: fmt(grossIncome * 4.5) },
              { label: 'Down Payment', value: fmt(downPayment) },
              { label: 'Maximum Loan', value: fmt(result.maxLoan), bold: true },
              { label: 'Maximum Property Price', value: fmt(result.maxHomePrice), bold: true },
              { label: 'LTV Ratio', value: `${result.ltv}%` },
              { label: 'Monthly Payment at {rate}%', value: fmtD(result.maxMonthlyPayment), bold: true },
              { label: 'FCA Stress Test Rate', value: `${result.stressRate}%` },
              { label: 'Stress Test Monthly Payment', value: fmtD(result.stressPayment), sub: 'Must be affordable at this rate' },
            ]}
          />
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your income and details above to see how much you can afford.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
