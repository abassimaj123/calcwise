import { useState, useMemo, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'
import { CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const RETIREMENT_FAQS = [
  { q: 'How much do I need to retire?', a: 'The 25× rule: save 25 times your expected annual expenses in retirement. This supports a 4% annual withdrawal rate. For $60,000/year spending, you need $1.5M. Adjust for state pension/government benefits you expect to receive.' },
  { q: 'What is the 4% withdrawal rule?', a: 'Research by Bengen (1994) showed a 4% annual withdrawal from a balanced portfolio historically lasted 30+ years. It\'s a starting guideline — adjust based on your investment mix, health, and market conditions at retirement.' },
  { q: 'When should I start saving for retirement?', a: 'Start as early as possible. $200/month from age 25 at 7% return grows to ~$525,000 by 65. Starting at 35 with the same parameters yields only ~$243,000. Time in the market is the most powerful retirement tool.' },
  { q: 'What retirement accounts are available in my country?', a: 'US: 401(k) and IRA. Canada: RRSP and TFSA. UK: Workplace pension and SIPP. Australia: Superannuation. New Zealand: KiwiSaver. Ireland: ARF and PRSA. Check the Country Tips tab for 2026 limits and tax advantages for your country.' },
  { q: 'What employer match should I always take?', a: 'Always contribute enough to get the full employer match — it\'s an immediate 50%–100% return. If your employer matches 50% up to 6% of salary, contributing 6% is an automatic 3% raise you shouldn\'t leave on the table.' },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const COLORS = {
  primary:  '#1A6AFF',
  accent:   '#00D4FF',
  success:  '#1D9E75',
  warn:     '#F5C842',
  purple:   '#7C3AED',
  orange:   '#F97316',
}

const CHART_COLORS = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.warn, COLORS.orange, COLORS.purple]

const GOVT_BENEFIT_HINT = {
  us: 'Social Security avg: ~$1,800/mo at 67',
  ca: 'CPP avg: ~$800/mo + OAS: ~$700/mo at 65',
  uk: 'State Pension: ~£815/mo (£9,775/yr) at 67',
  au: 'Age Pension: ~A$1,100/mo (single) at 67',
  ie: 'State Pension: ~€1,000/mo (€13,172/yr) at 66',
  nz: 'NZ Super: ~NZ$1,140/mo (single) at 65',
}

const GOVT_BENEFIT_DEFAULT = { us: 1800, ca: 1500, uk: 815, au: 1100, ie: 1000, nz: 1140 }

const COUNTRY_TAB_LABEL = {
  us: '401(k) Planner',
  ca: 'RRSP / TFSA',
  au: 'Superannuation',
  nz: 'KiwiSaver',
  uk: 'ISA & Pension',
  ie: 'Pension Relief',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmt(n, symbol, locale, currency) {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(n)
}

function fmtShort(n, symbol) {
  if (n == null || isNaN(n)) return '—'
  if (Math.abs(n) >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000)    return `${symbol}${(n / 1_000).toFixed(1)}k`
  return `${symbol}${Math.round(n).toLocaleString()}`
}

function fmtYears(months) {
  if (!isFinite(months) || months <= 0) return 'Forever'
  const yrs = Math.floor(months / 12)
  const mo  = Math.round(months % 12)
  if (yrs >= 100) return '100+ yrs'
  if (mo === 0)   return `${yrs} yrs`
  return `${yrs} yrs ${mo} mo`
}

// ---------------------------------------------------------------------------
// Core retirement calculation
// ---------------------------------------------------------------------------
function calcRetirement({ currentAge, retireAge, currentSavings, monthlyContrib, preRate, monthlyNeed, postRate, inflation, govtBenefit }) {
  const yearsToRetire  = Math.max(0, retireAge - currentAge)
  const monthsToRetire = yearsToRetire * 12
  const monthlyPreRate = preRate / 100 / 12

  const fvCurrent  = currentSavings * Math.pow(1 + monthlyPreRate, monthsToRetire)
  const fvContribs = monthlyPreRate > 0
    ? monthlyContrib * ((Math.pow(1 + monthlyPreRate, monthsToRetire) - 1) / monthlyPreRate)
    : monthlyContrib * monthsToRetire
  const projectedSavings = fvCurrent + fvContribs

  const realMonthlyNeed  = monthlyNeed * Math.pow(1 + inflation / 100, yearsToRetire)
  const monthlyShortfall = Math.max(0, realMonthlyNeed - govtBenefit)

  const monthlyPostRate = postRate / 100 / 12
  let monthsCanSustain
  if (monthlyShortfall <= 0) {
    monthsCanSustain = Infinity
  } else if (monthlyPostRate > 0 && projectedSavings * monthlyPostRate < monthlyShortfall) {
    monthsCanSustain = projectedSavings / monthlyShortfall
  } else if (monthlyPostRate > 0) {
    monthsCanSustain = Math.log(1 - (projectedSavings * monthlyPostRate) / monthlyShortfall) / Math.log(1 + monthlyPostRate) * -1
  } else {
    monthsCanSustain = projectedSavings / monthlyShortfall
  }

  const annualNeed   = monthlyShortfall * 12
  const savingsNeeded = postRate > 0 ? annualNeed / (postRate / 100) : annualNeed * 25
  const onTrack      = projectedSavings >= savingsNeeded * 0.8

  const yearData = []
  let balance = currentSavings
  for (let y = 1; y <= yearsToRetire; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyPreRate) + monthlyContrib
    }
    yearData.push({
      age:           currentAge + y,
      balance:       Math.round(balance),
      contributions: Math.round(currentSavings + monthlyContrib * 12 * y),
    })
  }

  return { projectedSavings, savingsNeeded, monthsCanSustain, onTrack, yearData, realMonthlyNeed, monthlyShortfall }
}

// ---------------------------------------------------------------------------
// FV helper
// ---------------------------------------------------------------------------
function fv(pv, rate, periods, pmt = 0) {
  const r = rate / 100 / 12
  if (r === 0) return pv + pmt * periods
  return pv * Math.pow(1 + r, periods) + pmt * ((Math.pow(1 + r, periods) - 1) / r)
}

function buildGrowthData(startBalance, monthlyContrib, annualRate, years, label = 'Balance') {
  const data = []
  let bal = startBalance
  const mr = annualRate / 100 / 12
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) bal = bal * (1 + mr) + monthlyContrib
    data.push({ year: `Yr ${y}`, [label]: Math.round(bal) })
  }
  return data
}

// ---------------------------------------------------------------------------
// Toggle (reusable)
// ---------------------------------------------------------------------------
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${on ? 'bg-blue-500' : 'bg-slate-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

// ---------------------------------------------------------------------------
// SmartAlert inline (avoid extra import)
// ---------------------------------------------------------------------------
function Alert({ type = 'info', title, message }) {
  const styles = {
    success: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', dot: 'bg-green-500' },
    warning: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  dot: 'bg-amber-500' },
    info:    { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  }
  const s = styles[type] || styles.info
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border mb-4 ${s.bg} ${s.border}`}>
      <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
      <div>
        {title && <p className={`text-sm font-semibold mb-0.5 ${s.text}`}>{title}</p>}
        <p className={`text-xs leading-relaxed ${s.text}`}>{message}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section title
// ---------------------------------------------------------------------------
function SectionTitle({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 mt-1">{children}</p>
  )
}

// ---------------------------------------------------------------------------
// Metric card row
// ---------------------------------------------------------------------------
function MetricRow({ label, value, color }) {
  const colorClass = color === 'green' ? 'text-green-600' : color === 'orange' ? 'text-orange-500' : color === 'purple' ? 'text-purple-600' : 'text-slate-800'
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`text-sm font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Country-specific Tab 2 components
// ---------------------------------------------------------------------------

// ---- US: 401(k) ----
function US401k({ c }) {
  const sym   = c.symbol
  const locale = c.locale
  const cur   = c.currency

  const [salary,       setSalary]       = useState(75000)
  const [contribPct,   setContribPct]   = useState(6)
  const [matchPct,     setMatchPct]     = useState(3)
  const [matchCap,     setMatchCap]     = useState(6)
  const [balance,      setBalance]      = useState(25000)
  const [returnRate,   setReturnRate]   = useState(7.0)
  const [years,        setYears]        = useState(25)

  const result = useMemo(() => {
    const yourAnnual     = salary * contribPct / 100
    const effectiveCap   = Math.min(contribPct, matchCap)
    const employerAnnual = salary * Math.min(effectiveCap, matchCap) * matchPct / (matchCap || 1) / 100
    const totalAnnual    = yourAnnual + employerAnnual
    const monthlyTotal   = totalAnnual / 12
    const projected      = fv(balance, returnRate, years * 12, monthlyTotal)
    const projectedNoMatch = fv(balance, returnRate, years * 12, yourAnnual / 12)
    const taxSavings     = yourAnnual * 0.24 // approx 24% federal bracket

    // Stacked chart data
    const chartData = []
    let balYour = balance, balMatch = 0
    const mrYour  = returnRate / 100 / 12
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balYour  = balYour  * (1 + mrYour) + (yourAnnual / 12)
        balMatch = balMatch * (1 + mrYour) + (employerAnnual / 12)
      }
      chartData.push({ year: `Yr ${y}`, Your: Math.round(balYour), Employer: Math.round(balMatch) })
    }

    return { yourAnnual, employerAnnual, totalAnnual, projected, projectedNoMatch, taxSavings, chartData }
  }, [salary, contribPct, matchPct, matchCap, balance, returnRate, years])

  const f = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>Your 401(k) Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Salary" value={salary} onChange={setSalary} min={0} max={1000000} step={1000} prefix={sym} showSlider hint="Your gross annual salary" />
            <NumericInput label="Your Contribution (%)" value={contribPct} onChange={setContribPct} min={1} max={23} step={0.5} suffix="%" showSlider hint="2026 limit: $23,500/yr" />
            <NumericInput label="Employer Match (%)" value={matchPct} onChange={setMatchPct} min={0} max={10} step={0.5} suffix="%" showSlider hint='Common: 3% match (50% on 6%)' />
            <NumericInput label="Match Cap (%)" value={matchCap} onChange={setMatchCap} min={0} max={15} step={0.5} suffix="%" showSlider hint="Max salary % matched by employer" />
            <NumericInput label="Current 401k Balance" value={balance} onChange={setBalance} min={0} max={2000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Rate of Return (%)" value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.1} suffix="%" showSlider hint="Historical avg: 7-10%" />
            <NumericInput label="Years to Retirement" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" yrs" showSlider />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="cw-result-hero">
        <p className="cw-result-hero-label">401(k) Projected Balance</p>
        <p className="cw-result-hero-value">{fs(result.projected)}</p>
        <p className="cw-result-hero-sub">After {years} years at {returnRate}% return</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">Total Annual Contribution</p><p className="cw-result-hero-mini-value">{f(result.totalAnnual)}</p></div>
          <div><p className="cw-result-hero-mini-label">Employer Free Money/yr</p><p className="cw-result-hero-mini-value">{f(result.employerAnnual)}</p></div>
          <div><p className="cw-result-hero-mini-label">Est. Tax Savings/yr</p><p className="cw-result-hero-mini-value">{f(result.taxSavings)}</p></div>
        </div>
      </div>

      {result.employerAnnual > 0 && (
        <Alert type="success" title="Free employer match!" message={`Your employer contributes ${f(result.employerAnnual)}/year — always contribute at least enough to capture the full match.`} />
      )}

      <div className="cw-card">
        <SectionTitle>Growth Projection: Your Contributions vs Employer Match</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(years / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Legend />
            <Bar dataKey="Your" stackId="a" fill={COLORS.primary} name="Your Contributions" />
            <Bar dataKey="Employer" stackId="a" fill={COLORS.success} name="Employer Match" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ResultDetailed title="Annual Breakdown" rows={[
        { label: 'Your Annual Contribution',    value: f(result.yourAnnual) },
        { label: 'Employer Annual Match',        value: f(result.employerAnnual),   bold: true },
        { label: 'Total Annual to 401(k)',       value: f(result.totalAnnual),       total: true },
        { label: 'Est. Federal Tax Savings/yr',  value: f(result.taxSavings) },
        { label: 'Projected Balance (no match)', value: fs(result.projectedNoMatch) },
        { label: 'Projected Balance (w/ match)', value: fs(result.projected),        bold: true },
      ]} />
    </div>
  )
}

// ---- CA: RRSP / TFSA ----
function CARRSP({ c }) {
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  // RRSP
  const [income,        setIncome]       = useState(85000)
  const [rrspContrib,   setRrspContrib]  = useState(15000)
  const [marginalRate,  setMarginalRate] = useState(33)
  const [rrspBalance,   setRrspBalance]  = useState(50000)
  const [rrspReturn,    setRrspReturn]   = useState(6.5)
  const [rrspYears,     setRrspYears]    = useState(20)
  // TFSA
  const [tfsaContrib,   setTfsaContrib]  = useState(7000)
  const [tfsaBalance,   setTfsaBalance]  = useState(30000)
  const [tfsaReturn,    setTfsaReturn]   = useState(6.0)

  const result = useMemo(() => {
    const rrspRoom    = Math.min(income * 0.18, 31560)
    const effectiveContrib = Math.min(rrspContrib, rrspRoom)
    const taxRefund   = effectiveContrib * (marginalRate / 100)
    const rrspProjected = fv(rrspBalance, rrspReturn, rrspYears * 12, effectiveContrib / 12)
    const totalTaxSavings = taxRefund * rrspYears

    const tfsaProjected = fv(tfsaBalance, tfsaReturn, rrspYears * 12, tfsaContrib / 12)
    const tfsaGrowth    = tfsaProjected - tfsaBalance - tfsaContrib * rrspYears

    // Chart
    const chartData = []
    let rBal = rrspBalance, tBal = tfsaBalance
    const rrspMr = rrspReturn / 100 / 12
    const tfsaMr = tfsaReturn / 100 / 12
    for (let y = 1; y <= rrspYears; y++) {
      for (let m = 0; m < 12; m++) {
        rBal = rBal * (1 + rrspMr) + effectiveContrib / 12
        tBal = tBal * (1 + tfsaMr) + tfsaContrib / 12
      }
      chartData.push({ year: `Yr ${y}`, RRSP: Math.round(rBal), TFSA: Math.round(tBal) })
    }

    return { rrspRoom, taxRefund, rrspProjected, totalTaxSavings, tfsaProjected, tfsaGrowth, chartData, effectiveContrib }
  }, [income, rrspContrib, marginalRate, rrspBalance, rrspReturn, rrspYears, tfsaContrib, tfsaBalance, tfsaReturn])

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>RRSP Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Income" value={income} onChange={setIncome} min={0} max={500000} step={1000} prefix={sym} showSlider hint="Determines your RRSP room (18% of prior-year income)" />
            <NumericInput label="RRSP Contribution" value={rrspContrib} onChange={setRrspContrib} min={0} max={31560} step={500} prefix={sym} showSlider hint="2026 annual limit: $31,560" />
            <NumericInput label="Marginal Tax Rate (%)" value={marginalRate} onChange={setMarginalRate} min={20} max={54} step={1} suffix="%" showSlider hint="Combined federal + provincial rate" />
            <NumericInput label="Current RRSP Balance" value={rrspBalance} onChange={setRrspBalance} min={0} max={2000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Rate of Return (%)" value={rrspReturn} onChange={setRrspReturn} min={1} max={15} step={0.1} suffix="%" showSlider />
            <NumericInput label="Years to Retirement" value={rrspYears} onChange={setRrspYears} min={1} max={50} step={1} suffix=" yrs" showSlider />
          </div>
        </div>

        <div className="cw-input-group mt-4">
          <SectionTitle>TFSA Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual TFSA Contribution" value={tfsaContrib} onChange={setTfsaContrib} min={0} max={7000} step={500} prefix={sym} showSlider hint="2026 annual limit: $7,000" />
            <NumericInput label="Current TFSA Balance" value={tfsaBalance} onChange={setTfsaBalance} min={0} max={500000} step={1000} prefix={sym} showSlider />
            <NumericInput label="TFSA Rate of Return (%)" value={tfsaReturn} onChange={setTfsaReturn} min={1} max={15} step={0.1} suffix="%" showSlider />
          </div>
        </div>
      </div>

      {/* RRSP Hero */}
      <div className="cw-result-hero">
        <p className="cw-result-hero-label">RRSP Projected Balance</p>
        <p className="cw-result-hero-value">{fs(result.rrspProjected)}</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">Tax Refund This Year</p><p className="cw-result-hero-mini-value">{f(result.taxRefund)}</p></div>
          <div><p className="cw-result-hero-mini-label">RRSP Room Available</p><p className="cw-result-hero-mini-value">{f(result.rrspRoom)}</p></div>
          <div><p className="cw-result-hero-mini-label">Total Tax Savings</p><p className="cw-result-hero-mini-value">{fs(result.totalTaxSavings)}</p></div>
        </div>
      </div>

      <Alert type="success" title={`Tax refund: ${f(result.taxRefund)} this year`} message={`Contributing ${f(result.effectiveContrib)} to RRSP at a ${marginalRate}% marginal rate returns ${f(result.taxRefund)} as a tax refund. Over ${rrspYears} years that's ${fs(result.totalTaxSavings)} in total tax savings.`} />

      <ResultDetailed title="TFSA vs RRSP Comparison" rows={[
        { label: 'RRSP Projected Balance',   value: fs(result.rrspProjected), bold: true },
        { label: 'TFSA Projected Balance',   value: fs(result.tfsaProjected), bold: true },
        { label: 'TFSA Tax-Free Growth',     value: fs(Math.max(0, result.tfsaGrowth)) },
        { label: 'Combined Portfolio',       value: fs(result.rrspProjected + result.tfsaProjected), total: true },
      ]} />

      <div className="cw-card">
        <SectionTitle>RRSP vs TFSA Growth Over {rrspYears} Years</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(rrspYears / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Legend />
            <Area type="monotone" dataKey="RRSP" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
            <Area type="monotone" dataKey="TFSA" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ---- AU: Superannuation ----
function AUSuper({ c }) {
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  const [salary,       setSalary]     = useState(90000)
  const [sgrPct,       setSgrPct]     = useState(11.5)
  const [voluntary,    setVoluntary]  = useState(0)
  const [balance,      setBalance]    = useState(80000)
  const [returnRate,   setReturnRate] = useState(7.0)
  const [years,        setYears]      = useState(25)

  const result = useMemo(() => {
    const annualEmployer  = salary * sgrPct / 100
    const annualVoluntary = voluntary * 12
    const monthlyTotal    = (annualEmployer + annualVoluntary) / 12
    const projected       = fv(balance, returnRate, years * 12, monthlyTotal)
    const totalContribs   = (annualEmployer + annualVoluntary) * years + balance

    const chartData = buildGrowthData(balance, monthlyTotal, returnRate, years, 'Super Balance')

    return { annualEmployer, annualVoluntary, projected, totalContribs, chartData, monthlyTotal }
  }, [salary, sgrPct, voluntary, balance, returnRate, years])

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>Superannuation Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Salary (before super)" value={salary} onChange={setSalary} min={0} max={1000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Super Guarantee Rate (%)" value={sgrPct} onChange={setSgrPct} min={9} max={15} step={0.5} suffix="%" showSlider hint="Legislated 11.5% in 2025-26, rising to 12% in 2026-27" />
            <NumericInput label="Voluntary Contributions (monthly)" value={voluntary} onChange={setVoluntary} min={0} max={5000} step={50} prefix={sym} showSlider />
            <NumericInput label="Current Super Balance" value={balance} onChange={setBalance} min={0} max={2000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Rate of Return (%)" value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.1} suffix="%" showSlider hint="Historical super avg: 7-8%" />
            <NumericInput label="Years to Retirement" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" yrs" showSlider hint="Access from age 60 (preservation age) or 67" />
          </div>
        </div>
      </div>

      <div className="cw-result-hero">
        <p className="cw-result-hero-label">Super at Retirement</p>
        <p className="cw-result-hero-value">{fs(result.projected)}</p>
        <p className="cw-result-hero-sub">After {years} years at {returnRate}% return</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">Annual Employer Contrib</p><p className="cw-result-hero-mini-value">{f(result.annualEmployer)}</p></div>
          <div><p className="cw-result-hero-mini-label">Annual Voluntary Contrib</p><p className="cw-result-hero-mini-value">{f(result.annualVoluntary)}</p></div>
          <div><p className="cw-result-hero-mini-label">Total Contributions</p><p className="cw-result-hero-mini-value">{fs(result.totalContribs)}</p></div>
        </div>
      </div>

      <div className="cw-card">
        <SectionTitle>Super Balance Growth Over {years} Years</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(years / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Area type="monotone" dataKey="Super Balance" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ResultDetailed title="Superannuation Summary" rows={[
        { label: 'Annual Employer SGR Contribution', value: f(result.annualEmployer) },
        { label: 'Annual Voluntary Contribution',     value: f(result.annualVoluntary) },
        { label: 'Monthly Total to Super',            value: f(result.monthlyTotal) },
        { label: 'Total Contributions over period',   value: fs(result.totalContribs - balance) },
        { label: 'Projected Super Balance',           value: fs(result.projected), bold: true, total: true },
      ]} />
    </div>
  )
}

// ---- NZ: KiwiSaver ----
function NZKiwiSaver({ c }) {
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  const KIWI_RATES = [3, 4, 6, 8, 10]

  const [salary,      setSalary]     = useState(75000)
  const [kiwiRate,    setKiwiRate]   = useState(3)
  const [employerPct, setEmployerPct] = useState(3)
  const [showGovt,    setShowGovt]   = useState(true)
  const [balance,     setBalance]    = useState(20000)
  const [returnRate,  setReturnRate] = useState(6.0)
  const [years,       setYears]      = useState(20)

  const GOVT_CREDIT = 521.43

  const result = useMemo(() => {
    const yourAnnual     = salary * kiwiRate / 100
    const employerAnnual = salary * employerPct / 100
    const govtCredit     = showGovt ? GOVT_CREDIT : 0
    const totalAnnual    = yourAnnual + employerAnnual + govtCredit
    const monthlyTotal   = totalAnnual / 12
    const projected      = fv(balance, returnRate, years * 12, monthlyTotal)
    const totalBoost     = yourAnnual + employerAnnual + govtCredit

    const chartData = buildGrowthData(balance, monthlyTotal, returnRate, years, 'KiwiSaver')

    return { yourAnnual, employerAnnual, govtCredit, projected, totalAnnual, totalBoost, chartData }
  }, [salary, kiwiRate, employerPct, showGovt, balance, returnRate, years])

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>KiwiSaver Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Salary" value={salary} onChange={setSalary} min={0} max={500000} step={1000} prefix={sym} showSlider />
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Your KiwiSaver Rate</label>
              <select
                className="cw-input"
                value={kiwiRate}
                onChange={e => setKiwiRate(Number(e.target.value))}
              >
                {KIWI_RATES.map(r => (
                  <option key={r} value={r}>{r}%</option>
                ))}
              </select>
            </div>
            <NumericInput label="Employer Contribution (%)" value={employerPct} onChange={setEmployerPct} min={3} max={10} step={0.5} suffix="%" showSlider hint="Compulsory minimum: 3%" />
            <NumericInput label="Current KiwiSaver Balance" value={balance} onChange={setBalance} min={0} max={1000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Rate of Return (%)" value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.1} suffix="%" showSlider />
            <NumericInput label="Years to Retirement (Age 65)" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" yrs" showSlider />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Toggle on={showGovt} onChange={setShowGovt} />
            <div>
              <p className="text-sm font-semibold text-slate-700">Include Government Member Tax Credit</p>
              <p className="text-xs text-slate-400">$521.43/year automatically credited (if contributing ≥$1,042.86/yr)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cw-result-hero">
        <p className="cw-result-hero-label">KiwiSaver at Retirement</p>
        <p className="cw-result-hero-value">{fs(result.projected)}</p>
        <p className="cw-result-hero-sub">After {years} years at {returnRate}% return</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">Your Annual Contrib</p><p className="cw-result-hero-mini-value">{f(result.yourAnnual)}</p></div>
          <div><p className="cw-result-hero-mini-label">Employer Annual</p><p className="cw-result-hero-mini-value">{f(result.employerAnnual)}</p></div>
          <div><p className="cw-result-hero-mini-label">Govt Credit/yr</p><p className="cw-result-hero-mini-value">{showGovt ? f(result.govtCredit) : '—'}</p></div>
        </div>
      </div>

      <div className="cw-card">
        <SectionTitle>KiwiSaver Growth Over {years} Years</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(years / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Area type="monotone" dataKey="KiwiSaver" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ResultDetailed title="Annual KiwiSaver Boost" rows={[
        { label: `Your Contribution (${kiwiRate}%)`, value: f(result.yourAnnual) },
        { label: `Employer Contribution (${employerPct}%)`, value: f(result.employerAnnual) },
        { label: 'Government Member Tax Credit',      value: showGovt ? f(result.govtCredit) : '$0' },
        { label: 'Total Annual Boost',                value: f(result.totalAnnual), bold: true, total: true },
      ]} />
    </div>
  )
}

// ---- UK: ISA & Pension ----
function UKISAPension({ c }) {
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  // ISA
  const [isaContrib,    setIsaContrib]    = useState(10000)
  const [isaBalance,    setIsaBalance]    = useState(20000)
  const [isaReturn,     setIsaReturn]     = useState(6.0)
  // Pension
  const [pensionContrib, setPensionContrib] = useState(8000)
  const [employerPct,   setEmployerPct]   = useState(5)
  const [pensionBalance, setPensionBalance] = useState(50000)
  const [pensionReturn, setPensionReturn] = useState(7.0)
  const [years,         setYears]         = useState(25)

  const result = useMemo(() => {
    const months = years * 12
    const isaProjected     = fv(isaBalance, isaReturn, months, isaContrib / 12)
    const isaGrowth        = isaProjected - isaBalance - isaContrib * years

    const annualSalaryApprox = pensionContrib / 0.08 // rough
    const employerAnnual   = pensionContrib * (employerPct / 100) / (0.08) * (employerPct / 100)
    // simpler: employer contributes employerPct% of salary, but we only have pension contrib
    // Let's just use employerPct as match on pension contribution
    const employerPensionAnnual = pensionContrib * (employerPct / pensionContrib) // percent
    const totalPensionAnnual = pensionContrib + pensionContrib * (employerPct / 100)
    const taxRelief        = pensionContrib * 0.20 // basic rate 20%
    const pensionProjected = fv(pensionBalance, pensionReturn, months, totalPensionAnnual / 12)

    const combined = isaProjected + pensionProjected

    // Chart
    const chartData = []
    let iBal = isaBalance, pBal = pensionBalance
    const iMr = isaReturn / 100 / 12
    const pMr = pensionReturn / 100 / 12
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        iBal = iBal * (1 + iMr) + isaContrib / 12
        pBal = pBal * (1 + pMr) + totalPensionAnnual / 12
      }
      chartData.push({ year: `Yr ${y}`, ISA: Math.round(iBal), Pension: Math.round(pBal) })
    }

    return { isaProjected, isaGrowth, taxRelief, pensionProjected, combined, chartData, totalPensionAnnual, employerAnnual: pensionContrib * (employerPct / 100) }
  }, [isaContrib, isaBalance, isaReturn, pensionContrib, employerPct, pensionBalance, pensionReturn, years])

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>ISA Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual ISA Contribution" value={isaContrib} onChange={setIsaContrib} min={0} max={20000} step={500} prefix={sym} showSlider hint="2026 annual limit: £20,000" />
            <NumericInput label="Current ISA Balance" value={isaBalance} onChange={setIsaBalance} min={0} max={1000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="ISA Rate of Return (%)" value={isaReturn} onChange={setIsaReturn} min={1} max={15} step={0.1} suffix="%" showSlider />
          </div>
        </div>

        <div className="cw-input-group mt-4">
          <SectionTitle>Pension Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Pension Contribution" value={pensionContrib} onChange={setPensionContrib} min={0} max={60000} step={500} prefix={sym} showSlider />
            <NumericInput label="Employer Contribution (%)" value={employerPct} onChange={setEmployerPct} min={0} max={20} step={0.5} suffix="%" showSlider />
            <NumericInput label="Current Pension Balance" value={pensionBalance} onChange={setPensionBalance} min={0} max={2000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Pension Rate of Return (%)" value={pensionReturn} onChange={setPensionReturn} min={1} max={15} step={0.1} suffix="%" showSlider />
            <NumericInput label="Years to Retirement" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" yrs" showSlider />
          </div>
        </div>
      </div>

      <div className="cw-result-hero">
        <p className="cw-result-hero-label">ISA + Pension at Retirement</p>
        <p className="cw-result-hero-value">{fs(result.combined)}</p>
        <p className="cw-result-hero-sub">After {years} years</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">ISA Balance</p><p className="cw-result-hero-mini-value">{fs(result.isaProjected)}</p></div>
          <div><p className="cw-result-hero-mini-label">Pension Balance</p><p className="cw-result-hero-mini-value">{fs(result.pensionProjected)}</p></div>
          <div><p className="cw-result-hero-mini-label">Pension Tax Relief/yr</p><p className="cw-result-hero-mini-value">{f(result.taxRelief)}</p></div>
        </div>
      </div>

      <div className="cw-card">
        <SectionTitle>ISA vs Pension Growth Over {years} Years</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(years / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Legend />
            <Area type="monotone" dataKey="ISA" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.25} strokeWidth={2} />
            <Area type="monotone" dataKey="Pension" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ResultDetailed title="Retirement Portfolio Breakdown" rows={[
        { label: 'ISA Projected Balance',      value: fs(result.isaProjected) },
        { label: 'ISA Tax-Free Growth',        value: fs(Math.max(0, result.isaGrowth)) },
        { label: 'Pension Projected Balance',  value: fs(result.pensionProjected) },
        { label: 'Employer Pension/yr',        value: f(result.employerAnnual) },
        { label: 'Pension Tax Relief/yr (20%)', value: f(result.taxRelief) },
        { label: 'Combined Total',             value: fs(result.combined), bold: true, total: true },
      ]} />
    </div>
  )
}

// ---- IE: Pension Relief ----
function IEPension({ c }) {
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  const [income,        setIncome]       = useState(65000)
  const [contribPct,    setContribPct]   = useState(15)
  const [employerPct,   setEmployerPct]  = useState(5)
  const [balance,       setBalance]      = useState(40000)
  const [returnRate,    setReturnRate]   = useState(6.5)
  const [years,         setYears]        = useState(20)

  // Age-related contribution limit hints
  const ageHint = 'Age limits: <30: 15%, 30-39: 20%, 40-49: 25%, 50-54: 30%, 55-59: 35%, 60+: 40%'

  const result = useMemo(() => {
    const yourAnnual     = income * contribPct / 100
    const employerAnnual = income * employerPct / 100
    const totalAnnual    = yourAnnual + employerAnnual
    const taxRelief      = yourAnnual * 0.40 // 40% marginal rate IE
    const totalTaxSaved  = taxRelief * years
    const projected      = fv(balance, returnRate, years * 12, totalAnnual / 12)

    const chartData = buildGrowthData(balance, totalAnnual / 12, returnRate, years, 'Pension')

    return { yourAnnual, employerAnnual, totalAnnual, taxRelief, totalTaxSaved, projected, chartData }
  }, [income, contribPct, employerPct, balance, returnRate, years])

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  return (
    <div className="space-y-4">
      <div className="cw-inputs-panel">
        <div className="cw-input-group">
          <SectionTitle>Irish Pension Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <NumericInput label="Annual Income" value={income} onChange={setIncome} min={0} max={500000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Your Pension Contribution (%)" value={contribPct} onChange={setContribPct} min={0} max={40} step={1} suffix="%" showSlider hint={ageHint} />
            <NumericInput label="Employer Contribution (%)" value={employerPct} onChange={setEmployerPct} min={0} max={20} step={0.5} suffix="%" showSlider />
            <NumericInput label="Current Pension Value" value={balance} onChange={setBalance} min={0} max={2000000} step={1000} prefix={sym} showSlider />
            <NumericInput label="Rate of Return (%)" value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.1} suffix="%" showSlider />
            <NumericInput label="Years to Retirement (Age 66)" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" yrs" showSlider />
          </div>
        </div>
      </div>

      <div className="cw-result-hero">
        <p className="cw-result-hero-label">Tax Relief This Year</p>
        <p className="cw-result-hero-value">{f(result.taxRelief)}</p>
        <p className="cw-result-hero-sub">At 40% marginal rate on {f(result.yourAnnual)} contribution</p>
        <hr className="cw-result-hero-divider" />
        <div className="cw-result-hero-grid">
          <div><p className="cw-result-hero-mini-label">Pension at Retirement</p><p className="cw-result-hero-mini-value">{fs(result.projected)}</p></div>
          <div><p className="cw-result-hero-mini-label">Employer/yr</p><p className="cw-result-hero-mini-value">{f(result.employerAnnual)}</p></div>
          <div><p className="cw-result-hero-mini-label">Total Tax Saved</p><p className="cw-result-hero-mini-value">{fs(result.totalTaxSaved)}</p></div>
        </div>
      </div>

      <Alert type="success" title={`${f(result.taxRelief)} back from Revenue this year`} message={`Contributing ${contribPct}% of your income (${f(result.yourAnnual)}) to a pension gives you ${f(result.taxRelief)} in tax relief at the 40% rate. Over ${years} years that's ${fs(result.totalTaxSaved)} in total tax savings.`} />

      <div className="cw-card">
        <SectionTitle>Pension Growth Over {years} Years</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={Math.floor(years / 5)} />
            <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => f(v)} />
            <Area type="monotone" dataKey="Pension" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ResultDetailed title="Pension Contribution Breakdown" rows={[
        { label: `Your Annual Contribution (${contribPct}%)`, value: f(result.yourAnnual) },
        { label: `Employer Annual Contribution (${employerPct}%)`, value: f(result.employerAnnual) },
        { label: 'Total Annual to Pension',                    value: f(result.totalAnnual), bold: true },
        { label: 'Tax Relief This Year (40%)',                 value: f(result.taxRelief) },
        { label: 'Total Tax Saved over Period',                value: fs(result.totalTaxSaved) },
        { label: 'Projected Pension at Retirement',            value: fs(result.projected), total: true },
      ]} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Country-specific Tab 2 dispatcher
// ---------------------------------------------------------------------------
function CountryTab({ country, c }) {
  switch (country) {
    case 'us': return <US401k c={c} />
    case 'ca': return <CARRSP c={c} />
    case 'au': return <AUSuper c={c} />
    case 'nz': return <NZKiwiSaver c={c} />
    case 'uk': return <UKISAPension c={c} />
    case 'ie': return <IEPension c={c} />
    default:   return <p className="text-slate-500 text-sm p-4">Country not configured.</p>
  }
}

// ---------------------------------------------------------------------------
// Main RetirementCalc component
// ---------------------------------------------------------------------------
export default function RetirementCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country] || countries.us
  const sym    = c.symbol
  const locale  = c.locale
  const cur    = c.currency

  // Top-level tab
  const [topTab, setTopTab] = useState('planner')

  // Planner inputs
  const [currentAge,    setCurrentAge]    = useState(35)
  const [retireAge,     setRetireAge]     = useState(65)
  const [currentSavings, setCurrentSavings] = useState(50000)
  const [monthlyContrib, setMonthlyContrib] = useState(1000)
  const [preRate,       setPreRate]       = useState(7.0)
  const [monthlyNeed,   setMonthlyNeed]   = useState(4000)
  const [postRate,      setPostRate]      = useState(4.0)
  const [inflation,     setInflation]     = useState(2.5)
  const [govtBenefit,   setGovtBenefit]   = useState(GOVT_BENEFIT_DEFAULT[country] || 1000)

  // Result sub-tab
  const [view, setView] = useState('overview')

  const f  = (n) => fmt(n, sym, locale, cur)
  const fs = (n) => fmtShort(n, sym)

  const result = useMemo(() => calcRetirement({
    currentAge, retireAge, currentSavings, monthlyContrib,
    preRate, monthlyNeed, postRate, inflation, govtBenefit,
  }), [currentAge, retireAge, currentSavings, monthlyContrib, preRate, monthlyNeed, postRate, inflation, govtBenefit])

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('retirement', country)
      tracked.current = true
    }
  }, [result])

  const shortfallAmt = result.savingsNeeded - result.projectedSavings

  return (
    <>
      <Helmet>
        <title>{c.name} Retirement Calculator 2026 | CalcWise</title>
        <meta name="description" content={`Plan your retirement in ${c.name}. Project savings, calculate ${COUNTRY_TAB_LABEL[country]} contributions, and find out if you're on track. Free 2026 calculator.`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {c.flag} {c.name} {t('retirement.title')}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t('retirement.desc')}</p>
          </div>
          <span className="cw-badge blue">Updated 2026</span>
        </div>

        {/* Top-level tabs */}
        <div className="cw-tabs mb-6">
          <button
            onClick={() => setTopTab('planner')}
            className={`cw-tab${topTab === 'planner' ? ' active' : ''}`}
          >
            {t('retirement.tabPlanner')}
          </button>
          <button
            onClick={() => setTopTab('country')}
            className={`cw-tab${topTab === 'country' ? ' active' : ''}`}
          >
            {COUNTRY_TAB_LABEL[country]}
          </button>
        </div>

        {/* ================================================================
            TAB 1: Retirement Planner
        ================================================================ */}
        {topTab === 'planner' && (
          <div className="calc-grid">
            {/* LEFT: Inputs */}
            <div className="calc-inputs-panel">
              <div className="cw-inputs-panel">

                {/* Profile group */}
                <div className="cw-input-group">
                  <p className="cw-input-group-title">{t('retirement.yourProfile')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
                    <NumericInput
                      label={t('retirement.currentAge')}
                      value={currentAge}
                      onChange={setCurrentAge}
                      min={18} max={70} step={1}
                      suffix=" yrs"
                      showSlider
                    />
                    <NumericInput
                      label={t('retirement.retirementAge')}
                      value={retireAge}
                      onChange={v => setRetireAge(Math.max(v, currentAge + 1))}
                      min={50} max={75} step={1}
                      suffix=" yrs"
                      showSlider
                    />
                    <NumericInput
                      label={`${t('retirement.currentSavings')} (${sym})`}
                      value={currentSavings}
                      onChange={setCurrentSavings}
                      min={0} max={2000000} step={5000}
                      prefix={sym}
                      showSlider
                    />
                    <NumericInput
                      label={`${t('retirement.monthlyContribution')} (${sym})`}
                      value={monthlyContrib}
                      onChange={setMonthlyContrib}
                      min={0} max={10000} step={50}
                      prefix={sym}
                      showSlider
                    />
                    <NumericInput
                      label={t('retirement.preRetirementReturn')}
                      value={preRate}
                      onChange={setPreRate}
                      min={1} max={15} step={0.1}
                      suffix="%"
                      showSlider
                      hint="Historical equity avg: 7-10%"
                    />
                  </div>
                </div>

                {/* Retirement income group */}
                <div className="cw-input-group">
                  <p className="cw-input-group-title">{t('retirement.retirementIncome')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
                    <NumericInput
                      label={`${t('retirement.monthlyIncomeNeeded')} (${sym})`}
                      value={monthlyNeed}
                      onChange={setMonthlyNeed}
                      min={1000} max={20000} step={100}
                      prefix={sym}
                      showSlider
                    />
                    <NumericInput
                      label={t('retirement.postRetirementReturn')}
                      value={postRate}
                      onChange={setPostRate}
                      min={1} max={8} step={0.1}
                      suffix="%"
                      showSlider
                    />
                    <NumericInput
                      label={t('retirement.inflationRate')}
                      value={inflation}
                      onChange={setInflation}
                      min={0} max={6} step={0.1}
                      suffix="%"
                      showSlider
                    />
                    <NumericInput
                      label={t('retirement.govtPensionBenefit')}
                      value={govtBenefit}
                      onChange={setGovtBenefit}
                      min={0} max={5000} step={50}
                      prefix={sym}
                      showSlider
                      hint={GOVT_BENEFIT_HINT[country]}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: Results */}
            <div className="calc-results-panel">

              {/* SmartAlert */}
              {result.onTrack ? (
                <Alert type="success" title={t('retirement.onTrackAlertTitle')} message={`Your projected ${fs(result.projectedSavings)} comfortably covers the estimated ${fs(result.savingsNeeded)} needed. Keep contributing ${f(monthlyContrib)}/month.`} />
              ) : (
                <Alert type="warning" title={`${t('retirement.shortfallAlertTitle')} ${fs(Math.max(0, shortfallAmt))}`} message={`To close this gap, increase your monthly contribution or extend your retirement age. Target savings needed: ${fs(result.savingsNeeded)}.`} />
              )}

              {/* Result sub-tabs */}
              <div className="cw-tabs mb-4">
                {['overview', 'growth', 'yearly'].map(v => (
                  <button key={v} onClick={() => setView(v)} className={`cw-tab${view === v ? ' active' : ''}`}>
                    {v === 'overview' ? t('retirement.tabOverview') : v === 'growth' ? t('retirement.tabGrowthChart') : t('retirement.tabYearByYear')}
                  </button>
                ))}
              </div>

              {/* ---- Overview ---- */}
              {view === 'overview' && (
                <>
                  <div className="cw-result-hero mb-4">
                    <p className="cw-result-hero-label">{t('retirement.projectedAtRetirement')}</p>
                    <p className="cw-result-hero-value">{fs(result.projectedSavings)}</p>
                    <p className="cw-result-hero-sub">At age {retireAge} · {retireAge - currentAge} years of growth</p>
                    <hr className="cw-result-hero-divider" />
                    <div className="cw-result-hero-grid">
                      <div>
                        <p className="cw-result-hero-mini-label">{t('retirement.monthlyNeedInflAdj')}</p>
                        <p className="cw-result-hero-mini-value">{f(result.realMonthlyNeed)}</p>
                      </div>
                      <div>
                        <p className="cw-result-hero-mini-label">{t('retirement.yearsSavingsLast')}</p>
                        <p className="cw-result-hero-mini-value">{fmtYears(result.monthsCanSustain)}</p>
                      </div>
                      <div>
                        <p className="cw-result-hero-mini-label">{t('retirement.status')}</p>
                        <p className="cw-result-hero-mini-value">{result.onTrack ? t('retirement.onTrack') : t('retirement.shortfall')}</p>
                      </div>
                    </div>
                  </div>

                  <ResultDetailed title={t('retirement.retirementSnapshot')} rows={[
                    { label: t('retirement.yearsUntilRetirement'),      value: `${retireAge - currentAge} yrs` },
                    { label: t('retirement.projectedSavings'),           value: fs(result.projectedSavings), bold: true },
                    { label: t('retirement.savingsNeededPerpetuity'),    value: fs(result.savingsNeeded) },
                    { label: t('retirement.monthlyShortfallCovered'),    value: f(result.monthlyShortfall) },
                    { label: t('retirement.govtBenefitMo'),             value: f(govtBenefit) },
                    { label: t('retirement.inflAdjMonthlyNeed'),         value: f(result.realMonthlyNeed) },
                    { label: t('retirement.savingsDuration'),            value: fmtYears(result.monthsCanSustain), total: true },
                  ]} />
                </>
              )}

              {/* ---- Growth Chart ---- */}
              {view === 'growth' && (
                <div className="cw-card">
                  <p className="cw-section-title">{t('retirement.savingsGrowthBalanceVsContribs')}</p>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={result.yearData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="age" tickFormatter={(v) => `Age ${v}`} tick={{ fontSize: 10 }} interval={Math.floor(result.yearData.length / 6)} />
                      <YAxis tickFormatter={(v) => `${sym}${v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k'}`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => f(v)} labelFormatter={(age) => `Age ${age}`} />
                      <Legend />
                      <Area type="monotone" dataKey="balance" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.25} strokeWidth={2} name="Projected Balance" />
                      <Area type="monotone" dataKey="contributions" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.15} strokeWidth={2} name="Total Contributions" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-400 text-center mt-2">{t('retirement.shadedAreaNote')}</p>
                </div>
              )}

              {/* ---- Year by Year ---- */}
              {view === 'yearly' && (
                <div className="cw-card overflow-x-auto">
                  <p className="cw-section-title">{t('retirement.yearByYearAccumulation')}</p>
                  <table className="w-full text-sm min-w-[320px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-2 text-xs font-bold text-slate-500 uppercase">{t('retirement.age')}</th>
                        <th className="text-right py-2 px-2 text-xs font-bold text-slate-500 uppercase">{t('retirement.projectedBalanceCol')}</th>
                        <th className="text-right py-2 px-2 text-xs font-bold text-slate-500 uppercase">{t('retirement.totalContributed')}</th>
                        <th className="text-right py-2 px-2 text-xs font-bold text-slate-500 uppercase">{t('retirement.growth')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearData.map((row, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-1.5 px-2 font-semibold text-slate-700">{row.age}</td>
                          <td className="py-1.5 px-2 text-right font-bold text-blue-600">{fs(row.balance)}</td>
                          <td className="py-1.5 px-2 text-right text-slate-600">{fs(row.contributions)}</td>
                          <td className="py-1.5 px-2 text-right text-green-600 font-semibold">{fs(Math.max(0, row.balance - row.contributions))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdSenseSlot format="responsive" className="mt-4" />
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 2: Country-Specific Account
        ================================================================ */}
        {topTab === 'country' && (
          <div>
            <CountryTab country={country} c={c} />
            <AdSenseSlot format="responsive" className="mt-6" />
          </div>
        )}
        <CalcFAQ faqs={RETIREMENT_FAQS} />
        <CalcRelated links={[
          { to: `/${country}/savings`,   label: 'Savings Calculator' },
          { to: `/${country}/net-worth`, label: 'Net Worth Calculator' },
          { to: `/${country}/budget`,    label: 'Budget Planner' },
        ]} />
      </div>
    </>
  )
}
