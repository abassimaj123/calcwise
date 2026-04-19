import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
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

function runAmortization(balance, monthlyRate, payment) {
  if (payment <= balance * monthlyRate) return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [] }
  let bal = balance
  let months = 0
  let totalInterest = 0
  const schedule = []
  while (bal > 0 && months < 600) {
    const interest = bal * monthlyRate
    const prin = Math.min(payment - interest, bal)
    totalInterest += interest
    bal -= prin
    months++
    schedule.push({
      month: months,
      payment: +(interest + prin).toFixed(2),
      principal: +prin.toFixed(2),
      interest: +interest.toFixed(2),
      balance: +Math.max(0, bal).toFixed(2),
    })
  }
  return { months, totalInterest, totalPaid: balance + totalInterest, schedule }
}

function calcPayoff({ balance, apr, minPayment, extraPayment }) {
  const monthlyRate = apr / 100 / 12
  const payment = minPayment + extraPayment
  if (balance <= 0 || monthlyRate <= 0 || payment <= 0) return null
  if (payment <= balance * monthlyRate) return null

  const withExtra = runAmortization(balance, monthlyRate, payment)
  const withoutExtra = minPayment > balance * monthlyRate
    ? runAmortization(balance, monthlyRate, minPayment)
    : { months: 0, totalInterest: 0, schedule: [] }

  const interestSaved = withoutExtra.totalInterest - withExtra.totalInterest
  const monthsSaved = withoutExtra.months - withExtra.months

  return {
    ...withExtra,
    months2: withoutExtra.months,
    totalInterest2: withoutExtra.totalInterest,
    scheduleMin: withoutExtra.schedule,
    interestSaved,
    monthsSaved,
  }
}

function buildAreaData(scheduleWith, scheduleMin) {
  const len = Math.max(scheduleWith.length, scheduleMin.length)
  if (len === 0) return []
  const step = Math.max(1, Math.floor(len / 60))
  const data = []
  for (let i = 0; i < len; i += step) {
    data.push({
      month: i + 1,
      withExtra: scheduleWith[i] ? scheduleWith[i].balance : 0,
      minOnly: scheduleMin[i] ? scheduleMin[i].balance : 0,
    })
  }
  return data
}

const defaultsByCountry = {
  us: { balance: 25000, apr: 6.5, payment: 450 },
  ca: { balance: 25000, apr: 8.0, payment: 500 },
  uk: { balance: 20000, apr: 7.9, payment: 450 },
  au: { balance: 25000, apr: 8.5, payment: 550 },
  ie: { balance: 20000, apr: 8.5, payment: 450 },
  nz: { balance: 20000, apr: 9.0, payment: 500 },
}

const TABS = ['summary', 'chart', 'schedule']

export default function LoanPayoffCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country]
  const d = defaultsByCountry[country] || defaultsByCountry.us

  const [balance, setBalance] = useState(d.balance)
  const [apr, setApr] = useState(d.apr)
  const [minPayment, setMinPayment] = useState(d.payment)
  const [extraPayment, setExtraPayment] = useState(200)
  const [tab, setTab] = useState('summary')

  const result = useMemo(
    () => calcPayoff({ balance, apr, minPayment, extraPayment }),
    [balance, apr, minPayment, extraPayment]
  )

  const tracked = useRef(false)
  useEffect(() => {
    if (result && !tracked.current) {
      trackCalcUsed('loan-payoff', country)
      tracked.current = true
    }
  }, [result])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
  const fmt2 = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmtK = (n) => {
    if (Math.abs(n) >= 1000) return `${c.symbol}${(n / 1000).toFixed(1)}k`
    return fmt(n)
  }

  const months2years = (m) => {
    if (!m || m <= 0) return 'N/A'
    const y = Math.floor(m / 12)
    const mo = m % 12
    return y > 0 ? `${y}y ${mo}m` : `${mo}m`
  }

  const areaData = useMemo(() => {
    if (!result) return []
    return buildAreaData(result.schedule, result.scheduleMin)
  }, [result])

  const pieData = result
    ? [
        { name: 'Principal', value: +balance.toFixed(2) },
        { name: 'Total Interest', value: +result.totalInterest.toFixed(2) },
      ]
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Loan Payoff Calculator ${c.name}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Calculate how extra loan payments save you interest and time in ${c.name}. See payoff date comparison with and without extra payments.`,
    url: `https://calqwise.com/${country}/loan-payoff`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <CalcPageMeta
        country={country}
        slug="loan-payoff"
        title={`Loan Payoff Calculator ${c.name} 2026 — Early Payoff & Interest Savings | CalqWise`}
        description={`Free ${c.name} loan payoff calculator. See how extra monthly payments reduce total interest and shorten your loan term. Works for mortgage, auto, student, and personal loans.`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">{t('loanpayoff.title')}</h1>
          <p className="text-slate-500">{t('loanpayoff.desc')}</p>
        </div>

        <CalcIntro
          intro="The loan payoff calculator shows how extra monthly payments dramatically reduce your total interest and payoff time. Enter your loan balance, rate, and extra payments to see the side-by-side comparison."
          hiddenCost="Each extra payment reduces future interest exponentially"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('loanpayoff.loanBalance')} ({c.symbol})</label>
              <NumericInput value={balance} onChange={setBalance} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('loanpayoff.interestRate')} (APR %)</label>
              <NumericInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('calc.monthlyPayment')} ({c.symbol})</label>
              <NumericInput value={minPayment} onChange={setMinPayment} min={0} step={50} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('calc.extraPayment')} ({c.symbol})</label>
              <NumericInput value={extraPayment} onChange={setExtraPayment} min={0} step={50} prefix={c.symbol} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="cw-tabs mb-4">
          {TABS.map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`cw-tab${tab === v ? ' active' : ''}`}>
              {t(`calc.${v}`)}
            </button>
          ))}
        </div>

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            {t('calc.enterValid')}
          </div>
        )}

        {/* Summary Tab */}
        {result && tab === 'summary' && (
          <>
            <ResultSimple
              metrics={[
                { label: t('loanpayoff.payoffDate'), value: months2years(result.months), highlight: true },
                { label: t('calc.totalInterest'), value: fmt(result.totalInterest) },
                { label: t('loanpayoff.interestSaved'), value: fmt(result.interestSaved), sub: result.monthsSaved > 0 ? `${months2years(result.monthsSaved)} faster` : undefined },
              ]}
            />
            <ResultDetailed
              title={t('loanpayoff.payoffStrategy')}
              rows={[
                { label: t('loanpayoff.loanBalance'), value: fmt(balance) },
                { label: `— ${t('calc.extraPayment')}`, value: '', bold: true },
                { label: t('calc.monthlyPayment'), value: fmt(minPayment + extraPayment) },
                { label: t('loanpayoff.payoffDate'), value: months2years(result.months), bold: true },
                { label: t('calc.totalInterest'), value: fmt(result.totalInterest) },
                { label: t('loanpayoff.loanDetails'), value: fmt(result.totalPaid) },
                { label: `— ${t('calc.minPayment')}`, value: '', bold: true },
                { label: t('loanpayoff.payoffDate'), value: result.months2 > 0 && result.months2 < 600 ? months2years(result.months2) : '50+ years' },
                { label: t('calc.totalInterest'), value: result.months2 > 0 && result.months2 < 600 ? fmt(result.totalInterest2) : 'N/A' },
                { label: t('loanpayoff.interestSaved'), value: fmt(result.interestSaved), bold: true },
                { label: t('calc.payOffSooner', { months: result.monthsSaved, amount: '' }).split('{')[0], value: months2years(result.monthsSaved), bold: true },
              ]}
            />
          </>
        )}

        {/* Chart Tab */}
        {result && tab === 'chart' && (
          <div className="space-y-6">
            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">{t('loanpayoff.loanBalance')} — {t('calc.schedule')}</h3>
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
                  <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} width={64} />
                  <Tooltip formatter={(v) => fmt(v)} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Area type="monotone" dataKey="minOnly" name="Regular Payment Only" stroke={COLORS[1]} fill="url(#gradMin)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="withExtra" name={`With +${fmt(extraPayment)} Extra`} stroke={COLORS[0]} fill="url(#gradExtra)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="cw-card">
              <h3 className="font-semibold mb-4 text-sm">{t('calc.totalInterest')}</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {result && tab === 'schedule' && (
          <div className="cw-card overflow-x-auto">
            <h3 className="font-semibold mb-4 text-sm">{t('calc.schedule')} ({t('calc.extraPayment')})</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-3 text-slate-500 font-medium">{t('loanpayoff.monthsRemaining')}</th>
                  <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t('calc.monthlyPayment')}</th>
                  <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t('loanpayoff.loanDetails')}</th>
                  <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t('calc.totalInterest')}</th>
                  <th className="text-right py-2 text-slate-500 font-medium">{t('loanpayoff.loanBalance')}</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-1.5 pr-3">{row.month}</td>
                    <td className="py-1.5 pr-3 text-right">{fmt2(row.payment)}</td>
                    <td className="py-1.5 pr-3 text-right text-indigo-600">{fmt2(row.principal)}</td>
                    <td className="py-1.5 pr-3 text-right text-amber-600">{fmt2(row.interest)}</td>
                    <td className="py-1.5 text-right">{fmt2(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdSenseSlot format="rectangle" />

        <CalcFAQ faqs={[
          { q: 'Does it matter when I make extra payments?', a: 'Yes — earlier extra payments save more interest because they reduce the principal balance that future interest is calculated on. Every dollar early matters more.' },
          { q: 'Should I pay off loans or invest?', a: 'If your loan rate is above 7%, paying off is usually better. If below 5%, investing in diversified index funds often wins long-term. Between 5-7% is a judgment call.' },
          { q: 'What is a loan payoff date?', a: 'The month and year when your loan balance reaches zero. Making extra payments moves this date earlier, often by years on a typical mortgage or auto loan.' },
        ]} />

        <CalcRelated links={[
          { to: `/${country}/mortgage`, label: 'Mortgage Calculator' },
          { to: `/${country}/autoloan`, label: 'Auto Loan Calculator' },
          { to: `/${country}/refinance`, label: 'Refinance Calculator' },
        ]} />

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
