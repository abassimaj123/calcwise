import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { countries } from '../../config/countries'
import { SALARY_DEDUCTIONS } from '../../config/salaryDeductions'
import { SALARY_DEFAULTS } from '../../config/calcDefaults'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'

// ---------------------------------------------------------------------------
// Tax calculation — returns { incomeTax, contributions, total }
// ---------------------------------------------------------------------------
function calcTaxDetail(gross, country) {
  switch (country) {
    case 'us': {
      const stdDed = 14600
      const taxable = Math.max(0, gross - stdDed)
      const brackets = [
        [11600, 0.10, 0], [47150, 0.12, 11600], [100525, 0.22, 47150],
        [191950, 0.24, 100525], [243725, 0.32, 191950], [609350, 0.35, 243725],
        [Infinity, 0.37, 609350],
      ]
      let fed = 0
      for (const [lim, r, fl] of brackets) {
        if (taxable <= fl) break
        fed += (Math.min(taxable, lim) - fl) * r
      }
      const state = gross * 0.045
      const incomeTax = fed + state
      const ss = Math.min(gross, 168600) * 0.062
      const medicare = gross * 0.0145
      const contributions = ss + medicare
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    case 'ca': {
      const bpa = 15705
      const taxable = Math.max(0, gross - bpa)
      const brackets = [
        [57375, 0.15, 0], [114750, 0.205, 57375], [158519, 0.26, 114750],
        [220000, 0.29, 158519], [Infinity, 0.33, 220000],
      ]
      let fed = 0
      for (const [lim, r, fl] of brackets) {
        if (taxable <= fl) break
        fed += (Math.min(taxable, lim) - fl) * r
      }
      const fedCredit = bpa * 0.15
      const fedFinal = Math.max(0, fed - fedCredit)
      const prov = gross * 0.08
      const incomeTax = fedFinal + prov
      const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
      const ei = Math.min(gross, 63200) * 0.0166
      const contributions = cpp + ei
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    case 'uk': {
      const pa = 12570
      const taxable = Math.max(0, gross - pa)
      const basic = Math.min(taxable, 37700) * 0.20
      const higher = Math.max(0, Math.min(taxable - 37700, 74870)) * 0.40
      const add = Math.max(0, taxable - 112570) * 0.45
      const incomeTax = basic + higher + add
      const ni1 = Math.min(Math.max(0, gross - 12570), 37700) * 0.08
      const ni2 = Math.max(0, gross - 50270) * 0.02
      const contributions = ni1 + ni2
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    case 'au': {
      const brackets = [
        [18200, 0, 0], [45000, 0.19, 18200], [120000, 0.325, 45000],
        [180000, 0.37, 120000], [Infinity, 0.45, 180000],
      ]
      let incomeTax = 0
      for (const [lim, r, fl] of brackets) {
        if (gross <= fl) break
        incomeTax += (Math.min(gross, lim) - fl) * r
      }
      const contributions = gross * 0.02 // Medicare levy
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    case 'ie': {
      const incomeTax = Math.min(gross, 44000) * 0.20 + Math.max(0, gross - 44000) * 0.40
      const prsi = gross * 0.041
      const usc =
        Math.min(gross, 12012) * 0.005 +
        Math.min(Math.max(0, gross - 12012), 15370) * 0.02 +
        Math.min(Math.max(0, gross - 27382), 42662) * 0.045 +
        Math.max(0, gross - 70044) * 0.08
      const contributions = prsi + usc
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    case 'nz': {
      const brackets = [
        [14000, 0.105, 0], [48000, 0.175, 14000], [70000, 0.30, 48000],
        [180000, 0.33, 70000], [Infinity, 0.39, 180000],
      ]
      let incomeTax = 0
      for (const [lim, r, fl] of brackets) {
        if (gross <= fl) break
        incomeTax += (Math.min(gross, lim) - fl) * r
      }
      const contributions = gross * 0.016 // ACC levy
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
    default: {
      const incomeTax = gross * 0.20
      const contributions = gross * 0.05
      return { incomeTax, contributions, total: incomeTax + contributions }
    }
  }
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const periods = [
  { key: 'annual',   label: 'Annual',   divisor: 1    },
  { key: 'monthly',  label: 'Monthly',  divisor: 12   },
  { key: 'biweekly', label: 'Bi-Weekly',divisor: 26   },
  { key: 'weekly',   label: 'Weekly',   divisor: 52   },
  { key: 'daily',    label: 'Daily',    divisor: 260  },
  { key: 'hourly',   label: 'Hourly',   divisor: 2080 },
]

const COLORS = ['#22c55e', '#ef4444', '#f97316', '#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6']

const viewLabels = { breakdown: 'Summary', chart: 'Chart', periods: 'All Periods' }

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function Toggle({ on, onChange, color = 'green' }) {
  const bg = on ? (color === 'green' ? 'bg-green-500' : 'bg-orange-500') : 'bg-slate-300'
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${bg}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SalaryCalc({ country }) {
  const { t } = useTranslation()
  const c = countries[country]
  const deductionDefs = SALARY_DEDUCTIONS[country] || []

  const [gross, setGross] = useState(SALARY_DEFAULTS[country] || 60000)
  const [inputPeriod, setInputPeriod] = useState('annual')
  const [view, setView] = useState('breakdown')
  const [dedOpen, setDedOpen] = useState(true)
  const [dedEnabled, setDedEnabled] = useState({})
  const [dedAmounts, setDedAmounts] = useState(
    Object.fromEntries(deductionDefs.map(d => [d.key, 0]))
  )

  // ---- derived values ----
  const annualGross = useMemo(() => {
    const p = periods.find(p => p.key === inputPeriod)
    return gross * (p ? p.divisor : 1)
  }, [gross, inputPeriod])

  const preTaxTotal = useMemo(() =>
    deductionDefs
      .filter(d => d.preTax && dedEnabled[d.key])
      .reduce((sum, d) => sum + (dedAmounts[d.key] || 0), 0),
    [deductionDefs, dedEnabled, dedAmounts]
  )

  const postTaxTotal = useMemo(() =>
    deductionDefs
      .filter(d => !d.preTax && dedEnabled[d.key])
      .reduce((sum, d) => sum + (dedAmounts[d.key] || 0), 0),
    [deductionDefs, dedEnabled, dedAmounts]
  )

  const taxableIncome = Math.max(0, annualGross - preTaxTotal)
  const { incomeTax, contributions } = useMemo(() => calcTaxDetail(taxableIncome, country), [taxableIncome, country])

  const annualNet = annualGross - incomeTax - contributions - postTaxTotal
  const effectiveRate = annualGross > 0 ? (incomeTax + contributions) / annualGross * 100 : 0

  const activeDeductions = deductionDefs.filter(d => dedEnabled[d.key] && dedAmounts[d.key] > 0)
  const activeDedTotal = preTaxTotal + postTaxTotal
  const activeDedCount = activeDeductions.length

  // ---- formatting ----
  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const fmtShort = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  // ---- rows for result table ----
  const rows = periods.map(p => ({
    label: p.label,
    value: fmt(annualNet / p.divisor),
    sub: `Gross: ${fmt(annualGross / p.divisor)}`,
    bold: p.key === 'annual',
  }))

  // ---- chart data ----
  const pieBase = [
    { name: 'Net Income',    value: Math.max(0, Math.round(annualNet))    },
    { name: 'Income Tax',    value: Math.max(0, Math.round(incomeTax))    },
    { name: 'Contributions', value: Math.max(0, Math.round(contributions)) },
  ]
  const pieDeductions = activeDeductions.map(d => ({
    name: d.label,
    value: Math.max(0, Math.round(dedAmounts[d.key] || 0)),
  }))
  const pieData = [...pieBase, ...pieDeductions].filter(d => d.value > 0)

  const barData = periods.map(p => ({
    period: p.label,
    Gross: Math.round(annualGross / p.divisor * 100) / 100,
    Net:   Math.round(annualNet   / p.divisor * 100) / 100,
  }))

  // ---- helpers ----
  const toggleDed = (key, val) => setDedEnabled(prev => ({ ...prev, [key]: val }))
  const setDedAmt = (key, val) => setDedAmounts(prev => ({ ...prev, [key]: val }))

  const preDefs  = deductionDefs.filter(d =>  d.preTax)
  const postDefs = deductionDefs.filter(d => !d.preTax)

  const pageTitle = `${c.name} Salary Calculator 2026 — Gross to Net Take-Home | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} salary calculator 2026. Convert gross to net. See hourly, weekly, monthly, annual take-home pay. Updated tax brackets.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/salary`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${c.name} Salary Calculator`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
          description: `Free salary calculator for ${c.name}. Convert gross income to net take-home pay across all pay periods.`,
        })}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="calc-page-header">
          <h1>
            {t(`nav.country_${country}`, { defaultValue: c.name })} — {t('salary.title')}
          </h1>
          <p>{t('salary.subtitle')}</p>
        </div>

        <div className="calc-grid">
          {/* LEFT: Inputs */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Income group */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('salary.incomeDetails')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
                  <NumericInput
                    label={`${t('salary.annualSalary')} (${c.symbol})`}
                    value={gross}
                    onChange={setGross}
                    min={0}
                    max={500000}
                    step={1000}
                    prefix={c.symbol}
                    showSlider
                    hint={`Median ${c.name}: ${fmtShort(SALARY_DEFAULTS[country])}/yr`}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">{t('salary.payPeriod')}</label>
                    <select className="cw-input" value={inputPeriod} onChange={e => setInputPeriod(e.target.value)}>
                      {periods.map(p => (
                        <option key={p.key} value={p.key}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

        {/* Deductions collapsible card */}
        {deductionDefs.length > 0 && (
          <div className="cw-card mb-6">
            {/* Header row */}
            <button
              type="button"
              onClick={() => setDedOpen(o => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{t('calc.optionalDeductions')}</span>
                {activeDedCount > 0 && (
                  <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-2 py-0.5">
                    {activeDedCount} active · -{fmtShort(activeDedTotal)}/yr
                  </span>
                )}
              </div>
              {dedOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {dedOpen && (
              <div className="mt-5 space-y-6">
                {/* Pre-tax section */}
                {preDefs.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-3">{t('calc.preTax')} {t('salary.deductions')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                      {preDefs.map(d => (
                        <div
                          key={d.key}
                          className={`border rounded-xl p-3 transition-colors ${dedEnabled[d.key] ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{d.hint}</p>
                            </div>
                            <Toggle on={!!dedEnabled[d.key]} onChange={v => toggleDed(d.key, v)} color="green" />
                          </div>
                          {dedEnabled[d.key] && (
                            <div className="mt-2">
                              <NumericInput
                                label=""
                                value={dedAmounts[d.key] || 0}
                                onChange={v => setDedAmt(d.key, v)}
                                min={0}
                                max={500000}
                                step={d.step}
                                prefix={c.symbol}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post-tax section */}
                {postDefs.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3">{t('calc.postTax')} {t('salary.deductions')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
                      {postDefs.map(d => (
                        <div
                          key={d.key}
                          className={`border rounded-xl p-3 transition-colors ${dedEnabled[d.key] ? 'border-orange-300 bg-orange-50' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{d.hint}</p>
                            </div>
                            <Toggle on={!!dedEnabled[d.key]} onChange={v => toggleDed(d.key, v)} color="orange" />
                          </div>
                          {dedEnabled[d.key] && (
                            <div className="mt-2">
                              <NumericInput
                                label=""
                                value={dedAmounts[d.key] || 0}
                                onChange={v => setDedAmt(d.key, v)}
                                min={0}
                                max={500000}
                                step={d.step}
                                prefix={c.symbol}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

            </div>{/* /cw-inputs-panel */}
          </div>{/* /calc-inputs-panel */}

          {/* RIGHT: Results */}
          <div className="calc-results-panel">

        {/* View tabs */}
        <div className="cw-tabs mb-4">
          {['breakdown', 'chart', 'periods'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`cw-tab${view === v ? ' active' : ''}`}
            >
              {v === 'breakdown' ? t('calc.summary') : v === 'chart' ? t('calc.chart') : t('salary.allPeriods')}
            </button>
          ))}
        </div>

        {/* ---- Summary view ---- */}
        {annualGross > 0 && view === 'breakdown' && (
          <>
            {/* Hero result + metric cards */}
            <div className="cw-result-hero mb-4">
              <p className="cw-result-hero-label">{t('salary.annualNet')}</p>
              <p className="cw-result-hero-value">{fmtShort(annualNet)}</p>
              <hr className="cw-result-hero-divider" />
              <div className="cw-result-hero-grid">
                <div>
                  <p className="cw-result-hero-mini-label">{t('salary.monthlyNet')}</p>
                  <p className="cw-result-hero-mini-value">{fmt(annualNet / 12)}</p>
                </div>
                <div>
                  <p className="cw-result-hero-mini-label">{t('calc.effectiveRate')}</p>
                  <p className="cw-result-hero-mini-value">{effectiveRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="cw-result-hero-mini-label">{t('salary.totalDeductions')}</p>
                  <p className="cw-result-hero-mini-value">{fmtShort(incomeTax + contributions + postTaxTotal)}</p>
                </div>
              </div>
            </div>

            {/* Active deductions card */}
            {activeDeductions.length > 0 && (
              <div className="cw-card mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">{t('salary.deductions')}</p>
                <div className="space-y-2">
                  {activeDeductions.map(d => (
                    <div key={d.key} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${d.preTax ? 'text-green-700' : 'text-orange-700'}`}>
                        {d.label}
                        <span className="ml-1 text-xs font-normal opacity-70">{d.preTax ? `(${t('calc.preTax')})` : `(${t('calc.postTax')})`}</span>
                      </span>
                      <span className="text-slate-700 font-semibold">-{fmtShort(dedAmounts[d.key] || 0)}/yr</span>
                    </div>
                  ))}
                </div>
                {preTaxTotal > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-green-700 font-semibold">
                    Tax saved: +{fmtShort(calcTaxDetail(annualGross, country).total - incomeTax - contributions)}
                  </div>
                )}
              </div>
            )}

            <ResultDetailed title={`${t('salary.netPay')} — ${t('salary.payPeriod')}`} rows={rows} />
          </>
        )}

        {/* ---- Chart view ---- */}
        {annualGross > 0 && view === 'chart' && (
          <div className="cw-card space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">{t('salary.taxBreakdown')}</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmtShort(value)} />
                  <Legend verticalAlign="bottom" height={60} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">{t('salary.grossPay')} vs {t('salary.netPay')} — {t('salary.payPeriod')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${c.symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => fmtShort(value)} />
                  <Legend />
                  <Bar dataKey="Gross" fill="#64748b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Net"   fill="#22c55e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ---- All Periods view ---- */}
        {annualGross > 0 && view === 'periods' && (
          <ResultDetailed title="Pay Period Breakdown (Net)" rows={rows} />
        )}

        {annualGross <= 0 && (
          <div className="cw-result-hero" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
            <p className="cw-result-hero-label">{t('salary.annualNet')}</p>
            <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>{t('calc.enterIncome')} →</p>
            <p className="cw-result-hero-sub">{t('calc.enterIncome')}</p>
          </div>
        )}

          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>

      {/* SEO content */}
      <div className="max-w-4xl mx-auto px-4">
        <CalcIntro intro="This salary calculator converts your gross income to net take-home pay across all pay periods — hourly, daily, weekly, bi-weekly, monthly and annually. It accounts for income tax, social contributions, and standard deductions for 2026. Use the optional deductions panel to model pre-tax contributions (pension, 401k, RRSP, etc.) and post-tax payroll items to see your true take-home pay." />
        <CalcFAQ faqs={[
          { q: 'What is the difference between gross and net salary?', a: 'Gross salary is your total earnings before deductions. Net salary (take-home pay) is what you actually receive after income tax and other contributions.' },
          { q: 'What deductions are included?', a: 'This calculator includes federal/national income tax, social security contributions (CPP/EI, NI, PRSI etc.), and standard deductions for your country. You can also add optional deductions like pension contributions, health insurance, and union dues.' },
          { q: 'How is the effective tax rate calculated?', a: 'Effective tax rate = total tax paid / gross income x 100. It differs from your marginal rate which only applies to your last dollar earned.' },
          { q: 'What are pre-tax deductions?', a: 'Pre-tax deductions (like 401k, RRSP, pension contributions) reduce your taxable income before tax is calculated, which means you pay less income tax overall.' },
          { q: 'What are post-tax deductions?', a: 'Post-tax deductions (like union dues, some insurance premiums) come out of your pay after tax has been calculated, so they do not reduce your tax bill.' },
        ]} />
        <CalcRelated links={[
          { to: `/${country}/tax`,          label: 'Tax Calculator' },
          { to: `/${country}/affordability`, label: 'Affordability Calculator' },
          { to: `/${country}/rent-vs-buy`,   label: 'Rent vs Buy' },
        ]} />
      </div>
    </>
  )
}
