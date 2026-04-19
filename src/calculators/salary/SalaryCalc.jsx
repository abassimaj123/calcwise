import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { trackCalcUsed } from '../../utils/analytics'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { countries } from '../../config/countries'
import { SALARY_DEDUCTIONS } from '../../config/salaryDeductions'
import { SALARY_DEFAULTS } from '../../config/calcDefaults'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CalcIntro, CalcFAQ, CalcHowTo, CalcAlsoAvailable, CalcRelated, CalcSubTopics, CalcFeatures, CalcPageMeta } from '../../components/CalcSEO'
import { subPagesByCalc } from '../../data/seoPages'

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
export default function SalaryCalc({ country, embedded = false }) {
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

  const tracked = useRef(false)
  useEffect(() => {
    if (annualNet > 0 && !tracked.current) {
      trackCalcUsed('salary', country)
      tracked.current = true
    }
  }, [annualNet])

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

  const pageTitles = {
    us: 'Salary Calculator US — Hourly, Annual & Take-Home Pay | CalqWise',
    ca: 'Canada Salary Calculator — Gross to Net, All Provinces | CalqWise',
    uk: 'UK Salary Calculator — Take-Home Pay After Tax & NI | CalqWise',
    au: 'Australia Salary Calculator — Take-Home Pay & Super | CalqWise',
    ie: 'Irish Salary Calculator — Take-Home After Tax, PRSI & USC | CalqWise',
    nz: 'NZ Salary Calculator — Take-Home After PAYE & KiwiSaver | CalqWise',
  }
  const pageDescs = {
    us: 'Free US salary calculator 2026. Convert hourly, weekly, monthly, annual pay. Take-home after federal tax, all 50 state taxes, Social Security, and Medicare. Updated 2026.',
    ca: 'Free Canadian salary calculator 2026. Gross to net after federal and provincial tax, CPP, and EI. All provinces and territories. Updated 2026 rates.',
    uk: 'Free UK salary calculator 2026/27. Take-home pay after Income Tax and National Insurance. Pension, student loan, and Scottish tax included. Weekly, monthly, annual breakdown.',
    au: 'Free Australian salary calculator 2025/26. Take-home after income tax, Medicare levy, and employer super (11.5%). Salary sacrifice modelling. Updated ATO rates.',
    ie: 'Free Irish salary calculator 2026. Net pay after income tax, PRSI, and USC. Personal and PAYE tax credits pre-applied. All pay periods. Updated 2026.',
    nz: 'Free NZ salary calculator 2026. Take-home after PAYE, ACC levy, and KiwiSaver. Student loan repayment option. Weekly, fortnightly, monthly output.',
  }
  const pageTitle = pageTitles[country] || pageTitles.us
  const pageDesc = pageDescs[country] || pageDescs.us

  const salaryIntroText = {
    us: 'Our US salary calculator converts any gross income to net take-home pay for all pay periods — hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annually. It applies federal income tax, FICA (Social Security 6.2% + Medicare 1.45%), and state income taxes for all 50 states. Model 401(k), HSA, and other pre-tax deductions to see your real take-home.',
    ca: 'Our Canadian salary calculator shows gross-to-net for all provinces and territories. We apply federal and provincial income tax, CPP (5.95% up to $68,500), CPP2, and EI (1.66% up to $65,700). Enter RRSP contributions and employment expenses to see how much tax you can save. Results are shown weekly, bi-weekly, semi-monthly, monthly, and annually.',
    uk: 'Our UK salary calculator converts annual salary to net take-home using 2026/27 PAYE rates and National Insurance (8% / 2%). It handles the Personal Allowance taper above £100K, Scottish income tax rates, and pension contributions under Auto-Enrolment. See exactly what hits your bank account each week or month.',
    au: 'Our Australian salary calculator applies 2025–26 ATO tax rates, 2% Medicare Levy, and superannuation (11.5% employer SG rate). See your PAYG withholding, net salary, and employer super contributions side-by-side. Model salary sacrifice arrangements to see how pre-tax super boosts your retirement while reducing today\'s tax.',
    ie: 'Our Irish salary calculator applies Standard Rate (20%), Higher Rate (40%), PRSI, and USC tiers for 2026. Tax credits (Personal Credit €1,875 + PAYE Credit €1,875) are pre-applied, giving you accurate take-home pay results. Model pension contributions to see the immediate tax saving from employee contributions.',
    nz: 'Our New Zealand salary calculator applies PAYE brackets for 2026, the ACC earners levy (1.33%), and KiwiSaver contributions. See your weekly, fortnightly, and monthly take-home with all deductions transparent. Toggle student loan repayment to see the combined impact on your pay.',
  }

  const salaryFeatures = {
    us: ['Federal income tax (all 7 brackets)', 'All 50 US state income taxes', 'Social Security + Medicare (FICA)', 'Pre-tax: 401(k), HSA, traditional IRA', 'Post-tax deductions modelling', 'Standard vs itemized deduction', 'All pay frequencies (hourly to annual)', 'Effective and marginal rate display'],
    ca: ['Federal + all provincial/territorial tax', 'CPP contributions (CPP1 + CPP2)', 'EI premium calculation', 'RRSP deduction modelling', 'Quebec QPIP included', 'All pay frequencies', 'Combined effective tax rate', 'Net pay displayed by pay period'],
    uk: ['PAYE income tax (2026/27 rates)', 'National Insurance Class 1', 'Personal Allowance taper (£100K+)', 'Scottish income tax rates option', 'Pension (% or fixed amount)', 'Auto-Enrolment employer contribution shown', 'Weekly, monthly, annual take-home', 'Student loan Plan 1/2/4 repayments'],
    au: ['ATO income tax (all brackets)', 'Medicare Levy (2%)', 'Medicare Levy Surcharge', 'Employer super (11.5% SG rate)', 'Salary sacrifice / pre-tax super', 'LITO and LMITO offsets', 'Weekly, fortnightly, monthly, annual', 'PAYG reconciliation shown'],
    ie: ['Income tax Standard + Higher Rate', 'PRSI Class A (4%)', 'All USC tiers (0.5%–8%)', 'Personal + PAYE tax credits', 'Pension contribution relief', 'Gross-to-net by pay period', 'Effective vs marginal tax rates', 'SARP and other relief options'],
    nz: ['PAYE tax across all brackets', 'ACC earners levy (1.33%)', 'KiwiSaver (3%, 4%, 6%, 8%, 10%)', 'Employer KiwiSaver contribution', 'Student loan repayment (12%)', 'Independent earner tax credit', 'Weekly, fortnightly, monthly output', 'Effective tax rate breakdown'],
  }

  const salaryHowToSteps = {
    us: [
      'Enter your gross salary (annual, or hourly rate and hours/week).',
      'Select your state for accurate state income tax and any local tax.',
      'Choose your filing status and add 401(k), HSA, or other pre-tax deductions.',
      'Review the Summary: federal tax, state tax, FICA, deductions, and net take-home.',
      'Toggle pay frequency to see weekly, bi-weekly, or monthly deposit amounts.',
    ],
    ca: [
      'Enter your gross annual salary and select your province or territory.',
      'Add RRSP contributions to see the tax savings applied immediately.',
      'CPP and EI are auto-calculated — edit if you\'re self-employed or exempt.',
      'Review federal tax, provincial tax, CPP, EI, and net take-home by pay period.',
      'Use the Deductions panel to add union dues, health benefits, or other items.',
    ],
    uk: [
      'Enter your gross annual salary. PAYE bands and the Personal Allowance are applied automatically.',
      'Select Scotland if you pay Scottish income tax rates.',
      'Enter your pension contribution percentage (or fixed amount per month).',
      'Add student loan plan if applicable (Plan 1, Plan 2, or Plan 4).',
      'Review weekly, monthly, and annual take-home net of all deductions.',
    ],
    au: [
      'Enter your gross annual salary. ATO tax rates are applied automatically.',
      'Employer super (11.5%) is shown alongside your salary — toggle salary sacrifice to add pre-tax contributions.',
      'Enable Medicare Levy Surcharge if you earn above $93,000 without private hospital cover.',
      'Review your fortnightly PAYG withholding and annual net income.',
      'Use the chart to compare gross vs net and see how super grows alongside your take-home.',
    ],
    ie: [
      'Enter your gross annual salary. Standard and Higher Rate income tax are applied automatically.',
      'Default tax credits (Personal + PAYE €3,750 total) are pre-applied — adjust if different.',
      'Add pension contributions (%) to see the immediate tax saving.',
      'Review income tax, PRSI, USC, and net take-home by pay period.',
      'Toggle pay frequency between weekly, fortnightly, and monthly.',
    ],
    nz: [
      'Enter your gross annual salary or hourly rate and hours per week.',
      'Select your KiwiSaver rate (3%, 4%, 6%, 8%, or 10%). Employer match is shown separately.',
      'Toggle student loan repayment (12%) if applicable.',
      'Review PAYE tax, ACC levy, KiwiSaver, and net take-home.',
      'Switch between weekly, fortnightly, and monthly output to match your pay cycle.',
    ],
  }

  const otherCountriesSalary = Object.entries(countries)
    .filter(([code]) => code !== country)
    .map(([code, ct]) => ({ code, flag: ct.flag, name: ct.name }))

  return (
    <>
      <CalcPageMeta country={country} slug="salary" title={pageTitle} description={pageDesc} embedded={embedded} />
      <Helmet>
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
                <div className="grid grid-cols-1 items-start gap-4">
                  <NumericInput
                    label={`${t('salary.annualSalary')} (${c.symbol})`}
                    value={gross}
                    onChange={setGross}
                    min={20000}
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
                    <div className="grid grid-cols-1 items-start gap-3">
                      {preDefs.map(d => (
                        <div
                          key={d.key}
                          className={`border rounded-xl p-3 transition-colors ${dedEnabled[d.key] ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="flex justify-between gap-2 mb-1" style={{ minHeight: '48px' }}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 leading-snug">{d.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{d.hint}</p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              <Toggle on={!!dedEnabled[d.key]} onChange={v => toggleDed(d.key, v)} color="green" />
                            </div>
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
                    <div className="grid grid-cols-1 items-start gap-3">
                      {postDefs.map(d => (
                        <div
                          key={d.key}
                          className={`border rounded-xl p-3 transition-colors ${dedEnabled[d.key] ? 'border-orange-300 bg-orange-50' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="flex justify-between gap-2 mb-1" style={{ minHeight: '48px' }}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 leading-snug">{d.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{d.hint}</p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              <Toggle on={!!dedEnabled[d.key]} onChange={v => toggleDed(d.key, v)} color="orange" />
                            </div>
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
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <CalcIntro intro={salaryIntroText[country] || salaryIntroText.us} />
        <CalcFeatures features={salaryFeatures[country] || salaryFeatures.us} />
        <CalcHowTo steps={salaryHowToSteps[country] || salaryHowToSteps.us} />
        <AdSenseSlot format="in-article" placement="in-content" />
        <CalcFAQ faqs={[
          { q: 'What is the difference between gross and net salary?', a: 'Gross salary is your total earnings before any deductions. Net salary (take-home pay) is what you actually receive after income tax, social insurance contributions, and any voluntary deductions like pension or health insurance.' },
          { q: 'What deductions does this calculator include?', a: 'This calculator includes national income tax, social security contributions (CPP/EI in Canada, National Insurance in the UK, FICA in the US, PRSI + USC in Ireland, Medicare Levy in Australia, ACC in New Zealand), and standard deductions for your country. Optional deductions like pension, 401(k), RRSP, and health insurance can be added manually.' },
          { q: 'How is the effective tax rate calculated?', a: 'Effective tax rate = total tax and deductions paid ÷ gross income × 100. It reflects your actual tax burden across all sources. It is always lower than your marginal (top bracket) rate because lower earnings are taxed at lower rates under progressive systems.' },
          { q: 'What are pre-tax deductions and why do they matter?', a: 'Pre-tax deductions (401(k), RRSP, pension contributions, HSA) reduce your taxable income before tax is calculated. This saves you money at your marginal rate — a $500/month RRSP contribution in the 33% federal bracket saves about $165/month in federal tax alone.' },
          { q: 'Does this include employer contributions?', a: 'This calculator shows employee-side deductions only (what comes from your pay). Employer contributions to super (Australia), pension auto-enrolment (UK), or CPP/EI matching (Canada) are shown separately where applicable but do not reduce your take-home pay.' },
        ]} />
        <CalcSubTopics links={subPagesByCalc[`${country}/salary`] || []} />
        <CalcRelated links={[
          { to: `/${country}/tax`,          label: 'Tax Calculator' },
          { to: `/${country}/affordability`, label: 'Affordability Calculator' },
          { to: `/${country}/rent-vs-buy`,   label: 'Rent vs Buy' },
        ]} />
        <CalcAlsoAvailable calcSlug="salary" calcLabel="Salary" countries={otherCountriesSalary} />
        <AdSenseSlot format="leaderboard" placement="bottom" />
      </div>
    </>
  )
}
