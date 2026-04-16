import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultDetailed from '../../components/ResultDetailed'
import NumericInput from '../../components/NumericInput'
import AdSenseSlot from '../../components/AdSenseSlot'

// ---------------------------------------------------------------------------
// Pie chart colors
// ---------------------------------------------------------------------------
const ASSET_COLORS = ['#1A6AFF', '#00D4FF', '#1D9E75', '#F5C842', '#f97316', '#8b5cf6', '#ec4899']
const LIAB_COLORS  = ['#ef4444', '#f97316', '#f59e0b', '#a855f7', '#64748b']

// ---------------------------------------------------------------------------
// Financial health badge
// ---------------------------------------------------------------------------
function healthBadge(netWorth) {
  if (netWorth > 500000) return { label: 'Excellent',  bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300'  }
  if (netWorth > 100000) return { label: 'Strong',     bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300'   }
  if (netWorth > 0)      return { label: 'Building',   bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300'  }
  return                        { label: 'In Debt',    bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300'    }
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

const TABS = ['Summary', 'Assets Chart', 'Liabilities Chart']

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function NetWorthCalc({ country = 'us' }) {
  const c = countries[country]

  // Assets state
  const [assets, setAssets] = useState(
    Object.fromEntries(ASSET_FIELDS.map((f) => [f.key, 0]))
  )
  // Liabilities state
  const [liabs, setLiabs] = useState(
    Object.fromEntries(LIAB_FIELDS.map((f) => [f.key, 0]))
  )

  const [tab, setTab] = useState('Summary')

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
    .map((f, i) => ({ name: f.label.split('(')[0].trim(), value: assets[f.key], color: ASSET_COLORS[i] }))
    .filter((d) => d.value > 0)

  const liabsPieData = LIAB_FIELDS
    .map((f, i) => ({ name: f.label, value: liabs[f.key], color: LIAB_COLORS[i] }))
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
          <h1 className="text-2xl font-display font-bold mb-1">{c.name} Net Worth Calculator</h1>
          <p className="text-slate-500 text-sm">Assets minus liabilities · financial health score</p>
        </div>

        <div className="calc-grid">
          {/* ── LEFT: Inputs ── */}
          <div className="calc-inputs-panel">
            <div className="cw-inputs-panel">

              {/* Assets */}
              <div className="cw-input-group">
                <p className="cw-input-group-title">Assets</p>
                <div className="space-y-4">
                  {ASSET_FIELDS.map((f) => (
                    <NumericInput
                      key={f.key}
                      label={f.label}
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
                <p className="cw-input-group-title">Liabilities</p>
                <div className="space-y-4">
                  {LIAB_FIELDS.map((f) => (
                    <NumericInput
                      key={f.key}
                      label={f.label}
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
                <p className="cw-result-hero-label">Net Worth</p>
                <p className="cw-result-hero-value" style={{ fontSize: '1.5rem', opacity: 0.4 }}>
                  {fmt(0)}
                </p>
                <p className="cw-result-hero-sub">
                  Enter your assets and liabilities above to see your net worth.
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
                <p className="cw-result-hero-label">Net Worth</p>
                <p className="cw-result-hero-value">{fmt(netWorth)}</p>
                <p className="cw-result-hero-sub">
                  Total Assets minus Total Liabilities
                </p>
                <hr className="cw-result-hero-divider" />
                <div className="cw-result-hero-grid">
                  <div>
                    <p className="cw-result-hero-mini-label">Total Assets</p>
                    <p className="cw-result-hero-mini-value">{fmt(totalAssets)}</p>
                  </div>
                  <div>
                    <p className="cw-result-hero-mini-label">Total Liabilities</p>
                    <p className="cw-result-hero-mini-value">{fmt(totalLiabs)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Health badge */}
            {hasData && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-4 ${badge.bg} ${badge.text} ${badge.border}`}>
                <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
                Financial Health: {badge.label}
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
                {tab === 'Summary' && (
                  <>
                    <ResultDetailed
                      title="Assets"
                      rows={[
                        ...ASSET_FIELDS.map((f) => ({
                          label: f.label.split('(')[0].trim(),
                          value: fmt(assets[f.key]),
                        })),
                        { label: 'Total Assets', value: fmt(totalAssets), bold: true, total: true },
                      ]}
                    />
                    <div className="mt-4">
                      <ResultDetailed
                        title="Liabilities"
                        rows={[
                          ...LIAB_FIELDS.map((f) => ({
                            label: f.label,
                            value: fmt(liabs[f.key]),
                          })),
                          { label: 'Total Liabilities', value: fmt(totalLiabs), bold: true, total: true },
                        ]}
                      />
                    </div>
                    <div className="mt-4">
                      <ResultDetailed
                        title="Net Worth Summary"
                        rows={[
                          { label: 'Total Assets',      value: fmt(totalAssets) },
                          { label: 'Total Liabilities', value: `-${fmt(totalLiabs)}` },
                          { label: 'Net Worth',         value: fmt(netWorth), bold: true, total: true },
                          ...(totalAssets > 0 ? [{ label: 'Debt-to-Asset Ratio', value: `${((totalLiabs / totalAssets) * 100).toFixed(1)}%` }] : []),
                        ]}
                      />
                    </div>
                  </>
                )}

                {/* ── Assets Chart Tab ── */}
                {tab === 'Assets Chart' && (
                  <div className="cw-card">
                    <h3 className="font-semibold text-sm mb-4">Assets Breakdown</h3>
                    {assetsPieData.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">No asset values entered yet.</p>
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
                {tab === 'Liabilities Chart' && (
                  <div className="cw-card">
                    <h3 className="font-semibold text-sm mb-4">Liabilities Breakdown</h3>
                    {liabsPieData.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">No liability values entered yet.</p>
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

        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
