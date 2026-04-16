import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'
import { CalcFAQ, CalcRelated } from '../../components/CalcSEO'

const NETWORTH_FAQS = [
  { q: 'What is net worth and why should I track it?', a: 'Net worth = total assets − total liabilities. It\'s the most complete picture of your financial health — more meaningful than income alone. Tracking it monthly or quarterly shows whether you\'re building wealth or falling behind.' },
  { q: 'What counts as an asset?', a: 'Assets include: cash and savings accounts, chequing accounts, investment accounts (stocks, ETFs, funds), retirement accounts (401k, RRSP, Super), real estate market value, vehicle value, business interests, and other valuables.' },
  { q: 'What counts as a liability?', a: 'Liabilities include: mortgage remaining balance, home equity line of credit (HELOC), car loans, student loans, credit card balances, personal loans, and any other money you owe to lenders or individuals.' },
  { q: 'Should I include my home in my net worth?', a: 'Yes — include current market value as an asset and your outstanding mortgage as a liability. The difference is your home equity. Note that real estate is illiquid; you can\'t spend it without selling or borrowing against it.' },
  { q: 'What is a good net worth by age?', a: 'A common benchmark: net worth = age × 10% of annual income. At 40 earning $80K, target $320K. More practical: track your own trajectory and ensure net worth grows year over year rather than comparing to averages.' },
]

// ---------------------------------------------------------------------------
// Pie chart colors
// ---------------------------------------------------------------------------
const ASSET_COLORS = ['#1A6AFF', '#00D4FF', '#1D9E75', '#F5C842', '#f97316', '#8b5cf6', '#ec4899']
const LIAB_COLORS  = ['#ef4444', '#f97316', '#f59e0b', '#a855f7', '#64748b']

// ---------------------------------------------------------------------------
// Financial health badge
// ---------------------------------------------------------------------------
function healthBadge(netWorth) {
  if (netWorth > 500000) return { labelKey: 'networth.excellent',  bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300'  }
  if (netWorth > 100000) return { labelKey: 'networth.strong',     bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300'   }
  if (netWorth > 0)      return { labelKey: 'networth.building',   bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300'  }
  return                        { labelKey: 'networth.inDebt',     bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300'    }
}

// ---------------------------------------------------------------------------
// Assets & liabilities definitions
// ---------------------------------------------------------------------------
const ASSET_FIELDS = [
  { key: 'residence',   label: 'Primary Residence Value',                         step: 10000 },
  { key: 'investments', label: 'Investment Accounts (stocks, ETFs, mutual funds)', step: 1000  },
  { key: 'retirement',  label: 'Retirement Savings (401k / RRSP / Super / KiwiSaver)', step: 1000 },
  { key: 'cash',        label: 'Cash & Savings Accounts',                          step: 1000  },
  { key: 'vehicles',    label: 'Vehicle(s) Value',                                 step: 1000  },
  { key: 'realEstate',  label: 'Other Real Estate',                                step: 10000 },
  { key: 'otherAssets', label: 'Other Assets',                                     step: 1000  },
]

const LIAB_FIELDS = [
  { key: 'mortgage',    label: 'Mortgage Balance',  step: 10000 },
  { key: 'carLoan',     label: 'Car Loan(s)',        step: 1000  },
  { key: 'creditCard',  label: 'Credit Card Debt',  step: 500   },
  { key: 'studentLoan', label: 'Student Loans',     step: 1000  },
  { key: 'otherLoans',  label: 'Other Loans',       step: 1000  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function NetWorthCalc({ country = 'us' }) {
  const { t } = useTranslation()
  const c = countries[country]

  const TABS = [t('networth.tabSummary'), t('networth.tabAssetsChart'), t('networth.tabLiabilitiesChart')]

  const ASSET_LABELS = {
    residence:   t('networth.primaryResidence'),
    investments: t('networth.investmentAccounts'),
    retirement:  t('networth.retirementSavings'),
    cash:        t('networth.cashAndSavings'),
    vehicles:    t('networth.vehicles'),
    realEstate:  t('networth.otherRealEstate'),
    otherAssets: t('networth.otherAssets'),
  }

  const LIAB_LABELS = {
    mortgage:    t('networth.mortgageBalance2'),
    carLoan:     t('networth.carLoans'),
    creditCard:  t('networth.creditCardDebt'),
    studentLoan: t('networth.studentLoans'),
    otherLoans:  t('networth.otherLoans'),
  }

  // Assets state
  const [assets, setAssets] = useState(
    Object.fromEntries(ASSET_FIELDS.map((f) => [f.key, 0]))
  )
  // Liabilities state
  const [liabs, setLiabs] = useState(
    Object.fromEntries(LIAB_FIELDS.map((f) => [f.key, 0]))
  )

  const [tab, setTab] = useState(t('networth.tabSummary'))

  const setAsset = (key, val) => setAssets((prev) => ({ ...prev, [key]: val }))
  const setLiab  = (key, val) => setLiabs((prev)  => ({ ...prev, [key]: val  }))

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, {
      style: 'currency', currency: c.currency, maximumFractionDigits: 0,
    }).format(n)

  const totalAssets = useMemo(
    () => Object.values(assets).reduce((s, v) => s + v, 0),
    [assets]
  )
  const totalLiabs = useMemo(
    () => Object.values(liabs).reduce((s, v) => s + v, 0),
    [liabs]
  )
  const netWorth = totalAssets - totalLiabs

  const hasData = totalAssets > 0 || totalLiabs > 0

  const badge = healthBadge(netWorth)

  // Pie data — filter out zeros for cleaner charts
  const assetsPieData = ASSET_FIELDS
    .map((f, i) => ({ name: ASSET_LABELS[f.key] ?? f.label.split('(')[0].trim(), value: assets[f.key], color: ASSET_COLORS[i] }))
    .filter((d) => d.value > 0)

  const liabsPieData = LIAB_FIELDS
    .map((f, i) => ({ name: LIAB_LABELS[f.key] ?? f.label, value: liabs[f.key], color: LIAB_COLORS[i] }))
    .filter((d) => d.value > 0)

  const isPositive = netWorth >= 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${c.name} Net Worth Calculator`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: `Calculate your net worth in ${c.name}. Enter your assets and liabilities to see your financial health score.`,
    url: `https://calqwise.com/${country}/net-worth`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: c.currency },
  }

  return (
    <>
      <Helmet>
        <title>{c.name} Net Worth Calculator 2026 | CalcWise</title>
        <meta
          name="description"
          content={`Free net worth calculator for ${c.name}. Add your assets and liabilities to calculate your net worth and financial health score.`}
        />
        <link rel="canonical" href={`https://calqwise.com/${country}/net-worth`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold mb-1">{c.name} {t('networth.title')}</h1>
          <p className="text-slate-500 text-sm">{t('networth.desc')}</p>
        </div>

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Assets */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('networth.assets')}</p>
                <div className="space-y-4">
                  {ASSET_FIELDS.map((f) => (
                    <NumericInput
                      key={f.key}
                      label={ASSET_LABELS[f.key] ?? f.label}
                      value={assets[f.key]}
                      onChange={(v) => setAsset(f.key, v)}
                      min={0}
                      step={f.step}
                      prefix={c.symbol}
                    />
                  ))}
                </div>
              </div>

              {/* Liabilities */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">{t('networth.liabilities')}</p>
                <div className="space-y-4">
                  {LIAB_FIELDS.map((f) => (
                    <NumericInput
                      key={f.key}
                      label={LIAB_LABELS[f.key] ?? f.label}
                      value={liabs[f.key]}
                      onChange={(v) => setLiab(f.key, v)}
                      min={0}
                      step={f.step}
                      prefix={c.symbol}
                    />
                  ))}
                </div>
              </div>

            </div>{/* /cw-inputs-panel */}
          </div>{/* /calc-inputs-panel */}

          {/* ── RIGHT: Results ── */}
          <div className="calc-results-panel">

            {/* Empty state */}
            {!hasData && (
              <div
                className="cw-result-hero mb-4"
                style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
              >
                <p className="cw-result-hero-label">{t('networth.netWorth')}</p>
                <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>
                  {fmt(0)}
                </p>
                <p className="cw-result-hero-sub">
                  {t('networth.enterToSeeNetWorth')}
                </p>
              </div>
            )}

            {/* Hero result */}
            {hasData && (
              <div
                className="cw-result-hero mb-4"
                style={
                  isPositive
                    ? { background: 'linear-gradient(135deg, #0d4f2f 0%, #065f46 100%)' }
                    : { background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' }
                }
              >
                <p className="cw-result-hero-label">{t('networth.netWorth')}</p>
                <p className="cw-result-hero-value">{fmt(netWorth)}</p>
                <p className="cw-result-hero-sub">
                  {t('networth.totalAssetsMinusLiabs')}
                </p>
                <hr className="cw-result-hero-divider" />
                <div className="cw-result-hero-grid">
                  <div>
                    <p className="cw-result-hero-mini-label">{t('networth.totalAssets')}</p>
                    <p className="cw-result-hero-mini-value">{fmt(totalAssets)}</p>
                  </div>
                  <div>
                    <p className="cw-result-hero-mini-label">{t('networth.totalLiabilities')}</p>
                    <p className="cw-result-hero-mini-value">{fmt(totalLiabs)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Health badge */}
            {hasData && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-4 ${badge.bg} ${badge.text} ${badge.border}`}>
                <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
                {t('networth.financialHealth')}: {t(badge.labelKey)}
              </div>
            )}

            {/* Tabs */}
            {hasData && (
              <>
                <div className="cw-tabs mb-4">
                  {TABS.map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`cw-tab${tab === t ? ' active' : ''}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* ── Summary Tab ── */}
                {tab === t('networth.tabSummary') && (
                  <>
                    <ResultDetailed
                      title={t('networth.assets')}
                      rows={[
                        ...ASSET_FIELDS.map((f) => ({
                          label: ASSET_LABELS[f.key] ?? f.label.split('(')[0].trim(),
                          value: fmt(assets[f.key]),
                        })),
                        { label: t('networth.totalAssets'), value: fmt(totalAssets), bold: true, total: true },
                      ]}
                    />
                    <div className="mt-4">
                      <ResultDetailed
                        title={t('networth.liabilities')}
                        rows={[
                          ...LIAB_FIELDS.map((f) => ({
                            label: LIAB_LABELS[f.key] ?? f.label,
                            value: fmt(liabs[f.key]),
                          })),
                          { label: t('networth.totalLiabilities'), value: fmt(totalLiabs), bold: true, total: true },
                        ]}
                      />
                    </div>
                    <div className="mt-4">
                      <ResultDetailed
                        title={t('networth.netWorthSummary')}
                        rows={[
                          { label: t('networth.totalAssets'),      value: fmt(totalAssets) },
                          { label: t('networth.totalLiabilities'), value: `-${fmt(totalLiabs)}` },
                          { label: t('networth.netWorth'),         value: fmt(netWorth), bold: true, total: true },
                          ...(totalAssets > 0 ? [{ label: t('networth.debtToAsset'), value: `${((totalLiabs / totalAssets) * 100).toFixed(1)}%` }] : []),
                        ]}
                      />
                    </div>
                  </>
                )}

                {/* ── Assets Chart Tab ── */}
                {tab === t('networth.tabAssetsChart') && (
                  <div className="cw-card">
                    <h3 className="font-semibold text-sm mb-4">{t('networth.assetsBreakdown')}</h3>
                    {assetsPieData.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">{t('networth.noAssetsEntered')}</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={assetsPieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            dataKey="value"
                            label={({ name, percent }) =>
                              percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                            }
                          >
                            {assetsPieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => fmt(v)} />
                          <Legend
                            formatter={(value) =>
                              value.length > 28 ? value.slice(0, 28) + '…' : value
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}

                {/* ── Liabilities Chart Tab ── */}
                {tab === t('networth.tabLiabilitiesChart') && (
                  <div className="cw-card">
                    <h3 className="font-semibold text-sm mb-4">{t('networth.liabilitiesBreakdown')}</h3>
                    {liabsPieData.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">{t('networth.noLiabilitiesEntered')}</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={liabsPieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            dataKey="value"
                            label={({ name, percent }) =>
                              percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                            }
                          >
                            {liabsPieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => fmt(v)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}
              </>
            )}

            <AdSenseSlot format="rectangle" className="mt-4" />

          </div>{/* /calc-results-panel */}
        </div>{/* /calc-grid */}

        <CalcFAQ faqs={NETWORTH_FAQS} />
        <CalcRelated links={[
          { to: `/${country}/savings`,    label: 'Savings Calculator' },
          { to: `/${country}/retirement`, label: 'Retirement Calculator' },
          { to: `/${country}/budget`,     label: 'Budget Planner' },
          { to: `/${country}/debt-payoff`, label: 'Debt Payoff' },
        ]} />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
