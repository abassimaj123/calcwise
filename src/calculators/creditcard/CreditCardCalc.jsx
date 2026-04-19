import { useState, useMemo, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated, CalcPageMeta } from '../../components/CalcSEO'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444']

const CC_HINTS = {
  us: 'US avg APR 2026: 21.5%',
  ca: 'CA avg APR: 19.99% (most cards)',
  uk: 'UK avg APR: 23%',
  au: 'AU avg APR: 19.5%',
  ie: 'IE avg APR: 22%',
  nz: 'NZ avg APR: 20%',
}

// payment mode: 'minimum' | 'fixed' | 'payoff'
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

// Calculate required monthly payment to pay off in targetMonths
function calcFixedPayoff(balance, monthlyRate, targetMonths) {
  if (monthlyRate === 0) return balance / targetMonths
  return balance * (monthlyRate * Math.pow(1 + monthlyRate, targetMonths)) / (Math.pow(1 + monthlyRate, targetMonths) - 1)
}

function calcCreditCard({ balance, apr, payMode, minPct, fixedAmount, payoffMonths, extraPayment }) {
  const monthlyRate = apr / 100 / 12
  if (balance <= 0 || monthlyRate <= 0) return null

  let basePaymentFn
  if (payMode === 'minimum') {
    basePaymentFn = (bal) => Math.max(bal * (minPct / 100), 25)
  } else if (payMode === 'fixed') {
    basePaymentFn = () => fixedAmount
  } else {
    // payoff in X months
    const required = calcFixedPayoff(balance, monthlyRate, payoffMonths)
    basePaymentFn = () => required
  }

  const withExtra = simulate(balance, monthlyRate, (bal) => basePaymentFn(bal) + extraPayment)
  const withoutExtra = simulate(balance, monthlyRate, (bal) => basePaymentFn(bal))

  const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest
  const monthsSaved = withoutExtra.months - withExtra.months

  // For display: base monthly payment (first month)
  const baseMonthlyPayment = payMode === 'payoff'
    ? calcFixedPayoff(balance, monthlyRate, payoffMonths)
    : basePaymentFn(balance)

  return {
    ...withExtra,
    interestSaved,
    monthsSaved,
    totalInterestNoExtra: withoutExtra.totalInterest,
    scheduleMin: withoutExtra.schedule,
    baseMonthlyPayment,
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

const TABS = ['chart', 'summary', 'payoff']

const PAY_MODES_KEYS = [
  { key: 'minimum', labelKey: 'calc.minPayment' },
  { key: 'fixed',   labelKey: 'calc.fixedAmount' },
  { key: 'payoff',  labelKey: 'calc.payOffIn' },
]

export default function CreditCardCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [apr, setApr] = useState(d.apr)

  // Payment mode state
  const [payMode, setPayMode]         = useState('minimum')
  const [minPct, setMinPct]           = useState(2)
  const [fixedAmount, setFixedAmount] = useState(200)
  const [payoffMonths, setPayoffMonths] = useState(24)

  // Extra payment
  const [extraOpen, setExtraOpen]         = useState(false)
  const [extraPayment, setExtraPayment]   = useState(0)

  const [tab, setTab] = useState('chart')

  const result = useMemo(
    () => calcCreditCard({ balance, apr, payMode, minPct, fixedAmount, payoffMonths, extraPayment }),
    [balance, apr, payMode, minPct, fixedAmount, payoffMonths, extraPayment]
  )

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('credit-card', country)
      tracked.current = true
    }
  }, [result])

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

  const extraLabel = extraPayment > 0 ? `With +${fmt0(extraPayment)} Extra` : 'With Extra'

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
      <CalcPageMeta
        country={country}
        slug="credit-card"
        title={`Credit Card Payoff Calculator ${c.name} 2026 — APR & Minimum Payment Cost | CalqWise`}
        description={`Free ${c.name} credit card payoff calculator. See how long to pay off your balance and total interest at any APR. Compare minimum payment vs accelerated payoff strategy.`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{t('creditcard.title')}</h1>
          <p className="text-slate-500">{t('creditcard.desc')}</p>
        </div>

        <CalcIntro
          intro={t('creditcard.calcIntro', { defaultValue: 'This credit card payoff calculator shows exactly how long it will take to pay off your balance at minimum payments — and how much you can save by paying more each month.' })}
          hiddenCost="Minimum payments cost 3-4x more in interest"
        />

        {/* Main inputs */}
        <div className="cw-card mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('creditcard.balance')} ({c.symbol})</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('creditcard.apr')}</label>
              <NumericInput
                value={apr}
                onChange={setApr}
                min={0}
                step={0.1}
                suffix="%"
                hint={CC_HINTS[country] || ''}
              />
            </div>
          </div>
        </div>

        {/* Payment Strategy — always visible */}
        <div className="cw-card mb-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">{t('calc.paymentStrategy')}</p>

          {/* Pill selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PAY_MODES_KEYS.map(m => (
              <button
                key={m.key}
                type="button"
                onClick={() => setPayMode(m.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  payMode === m.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-primary hover:text-primary'
                }`}
              >
                {t(m.labelKey)}
              </button>
            ))}
          </div>

          {/* Mode-specific input */}
          {payMode === 'minimum' && (
            <div className="max-w-xs">
              <label className="block text-xs text-slate-500 mb-1">{t('creditcard.minPayPct')}</label>
              <NumericInput value={minPct} onChange={setMinPct} min={1} max={10} step={0.1} suffix="%" />
              <p className="text-xs text-slate-500 mt-1">Monthly: {c.symbol}25 floor applies automatically</p>
            </div>
          )}

          {payMode === 'fixed' && (
            <div className="max-w-xs">
              <label className="block text-xs text-slate-500 mb-1">{t('calc.fixedAmount')}</label>
              <NumericInput value={fixedAmount} onChange={setFixedAmount} min={10} step={10} prefix={c.symbol} />
            </div>
          )}

          {payMode === 'payoff' && (
            <div className="max-w-xs">
              <label className="block text-xs text-slate-500 mb-1">{t('calc.payOffIn')}</label>
              <NumericInput value={payoffMonths} onChange={setPayoffMonths} min={1} max={120} step={1} suffix=" months" />
              {result && (
                <p className="text-xs text-slate-500 mt-1">
                  Required payment: {fmt(result.baseMonthlyPayment)}/mo
                </p>
              )}
            </div>
          )}
        </div>

        {/* Extra Payment — collapsible */}
        <div className="cw-card mb-6">
          <button
            type="button"
            onClick={() => setExtraOpen(o => !o)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800">{t('calc.extraPayment')}</span>
              {extraPayment > 0 && (
                <span className="text-xs bg-green-100 border border-green-200 text-green-700 rounded-full px-2 py-0.5">
                  +{fmt0(extraPayment)}/mo active
                </span>
              )}
            </div>
            {extraOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          {extraOpen && (
            <div className="mt-4 max-w-xs">
              <label className="block text-xs text-slate-500 mb-1">{t('calc.extraPayment')}</label>
              <NumericInput value={extraPayment} onChange={setExtraPayment} min={0} step={10} prefix={c.symbol} />
            </div>
          )}
        </div>

        {/* Extra payment savings callout */}
        {result && extraPayment > 0 && result.monthsSaved > 0 && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 flex items-start gap-3">
            <div className="text-green-600 text-xl mt-0.5">💡</div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                You'll pay off {months2years(result.monthsSaved)} sooner by paying {fmt0(extraPayment)}/month extra
              </p>
              <p className="text-sm text-green-700 mt-0.5">
                That saves you {fmt0(result.interestSaved)} in interest.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="cw-tabs mb-4">
          {TABS.map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`cw-tab${tab === v ? ' active' : ''}`}>
              {v === 'payoff' ? t('calc.schedule') : v === 'chart' ? t('calc.chart') : t('calc.summary')}
            </button>
          ))}
        </div>

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterValid')}
          </div>
        )}

        {/* Chart Tab — default */}
        {result && tab === 'chart' && (
          <div className="space-y-6">
            <div className="cw-card">
              <h3 className="font-semibold mb-1 text-sm">{t('creditcard.payoffTime')}</h3>
              {extraPayment > 0 && result.monthsSaved > 0 && (
                <p className="text-xs text-green-600 mb-3">
                  Extra {fmt0(extraPayment)}/mo eliminates debt {months2years(result.monthsSaved)} sooner
                </p>
              )}
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
                  <Area type="monotone" dataKey="minOnly" name="Base Payment" stroke={COLORS[1]} fill="url(#gradMin)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="withExtra" name={extraPayment > 0 ? extraLabel : 'Base Payment'} stroke={COLORS[0]} fill="url(#gradExtra)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">{t('creditcard.balance')} vs {t('creditcard.interestPaid')}</h3>
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

        {/* Summary Tab */}
        {result && tab === 'summary' && (
          <>
            <ResultSimple
              metrics={[
                { label: t('creditcard.payoffTime'), value: months2years(result.months), highlight: true },
                { label: t('creditcard.interestPaid'), value: fmt0(result.totalInterest) },
                { label: t('debtpayoff.interestSaved'), value: fmt0(result.interestSaved), sub: `${months2years(result.monthsSaved)} faster` },
              ]}
            />
            <ResultDetailed
              title={t('creditcard.paymentDetails')}
              rows={[
                { label: t('creditcard.balance'), value: fmt0(balance) },
                { label: t('creditcard.apr'), value: `${apr}%` },
                { label: t('calc.paymentStrategy'), value: t(PAY_MODES_KEYS.find(m => m.key === payMode)?.labelKey) },
                { label: t('calc.monthlyPayment'), value: fmt(result.baseMonthlyPayment) },
                ...(extraPayment > 0 ? [{ label: t('calc.extraPayment'), value: fmt0(extraPayment) }] : []),
                { label: t('creditcard.payoffTime'), value: months2years(result.months), bold: true },
                { label: t('creditcard.interestPaid'), value: fmt0(result.totalInterest) },
                { label: t('calc.totalInterest'), value: fmt(result.totalPaid), bold: true },
                ...(extraPayment > 0 ? [
                  { label: t('creditcard.interestPaid'), value: fmt0(result.totalInterestNoExtra) },
                  { label: t('debtpayoff.interestSaved'), value: fmt0(result.interestSaved), bold: true },
                  { label: t('debtpayoff.timeSaved'), value: months2years(result.monthsSaved), bold: true },
                ] : []),
              ]}
            />
          </>
        )}

        {/* Payoff Table Tab */}
        {result && tab === 'payoff' && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold mb-4 text-sm">{t('debtpayoff.payoffSchedule')}</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-3 text-slate-500 font-medium">Month</th>
                  <th className="text-right py-2 pr-3 text-slate-500 font-medium">Payment</th>
                  <th className="text-right py-2 pr-3 text-slate-500 font-medium">Interest</th>
                  <th className="text-right py-2 text-slate-500 font-medium">Balance</th>
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
          { q: 'What is the "Pay Off In X Months" mode?', a: 'This calculates the exact fixed payment you need to make every month to become debt-free in your chosen timeframe. It is the most goal-oriented payoff strategy.' },
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
