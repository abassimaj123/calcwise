import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { CalcIntro, CalcFAQ, CalcRelated } from '../../components/CalcSEO'

// SDLT rates as of April 2025
function calcSDLT({ price, buyerType }) {
  if (price <= 0) return null

  let bands = []
  let sdlt = 0

  if (buyerType === 'ftb') {
    // First-Time Buyer: 0% up to £425k, 5% £425k-£625k, no relief above £625k
    if (price <= 425000) {
      sdlt = 0
      bands = [{ label: 'Up to £425,000 (FTB relief)', rate: '0%', taxable: price, tax: 0 }]
    } else if (price <= 625000) {
      const band1 = 425000
      const band2 = price - 425000
      const tax2 = band2 * 0.05
      sdlt = tax2
      bands = [
        { label: '£0 – £425,000 (FTB relief)', rate: '0%', taxable: band1, tax: 0 },
        { label: `£425,001 – £${price.toLocaleString()}`, rate: '5%', taxable: band2, tax: tax2 },
      ]
    } else {
      // Above £625k: full standard rates apply (no FTB relief)
      return calcSDLT({ price, buyerType: 'standard' })
    }
  } else {
    // Standard rates: 0% up to £250k, 5% £250k-£925k, 10% £925k-£1.5M, 12% above £1.5M
    const surcharge = buyerType === 'additional' ? 0.03 : 0

    const rate0 = 0 + surcharge
    const rate5 = 0.05 + surcharge
    const rate10 = 0.10 + surcharge
    const rate12 = 0.12 + surcharge

    if (price <= 250000) {
      const tax = price * rate0
      sdlt = tax
      bands = [{ label: `Up to £250,000`, rate: `${(rate0 * 100).toFixed(0)}%`, taxable: price, tax }]
    } else if (price <= 925000) {
      const t1 = 250000 * rate0
      const t2 = (price - 250000) * rate5
      sdlt = t1 + t2
      bands = [
        { label: '£0 – £250,000', rate: `${(rate0 * 100).toFixed(0)}%`, taxable: 250000, tax: t1 },
        { label: `£250,001 – £${price.toLocaleString()}`, rate: `${(rate5 * 100).toFixed(0)}%`, taxable: price - 250000, tax: t2 },
      ]
    } else if (price <= 1500000) {
      const t1 = 250000 * rate0
      const t2 = (925000 - 250000) * rate5
      const t3 = (price - 925000) * rate10
      sdlt = t1 + t2 + t3
      bands = [
        { label: '£0 – £250,000', rate: `${(rate0 * 100).toFixed(0)}%`, taxable: 250000, tax: t1 },
        { label: '£250,001 – £925,000', rate: `${(rate5 * 100).toFixed(0)}%`, taxable: 675000, tax: t2 },
        { label: `£925,001 – £${price.toLocaleString()}`, rate: `${(rate10 * 100).toFixed(0)}%`, taxable: price - 925000, tax: t3 },
      ]
    } else {
      const t1 = 250000 * rate0
      const t2 = (925000 - 250000) * rate5
      const t3 = (1500000 - 925000) * rate10
      const t4 = (price - 1500000) * rate12
      sdlt = t1 + t2 + t3 + t4
      bands = [
        { label: '£0 – £250,000', rate: `${(rate0 * 100).toFixed(0)}%`, taxable: 250000, tax: t1 },
        { label: '£250,001 – £925,000', rate: `${(rate5 * 100).toFixed(0)}%`, taxable: 675000, tax: t2 },
        { label: '£925,001 – £1,500,000', rate: `${(rate10 * 100).toFixed(0)}%`, taxable: 575000, tax: t3 },
        { label: `£1,500,001 – £${price.toLocaleString()}`, rate: `${(rate12 * 100).toFixed(0)}%`, taxable: price - 1500000, tax: t4 },
      ]
    }
  }

  const effectiveRate = price > 0 ? ((sdlt / price) * 100).toFixed(2) : '0.00'

  return { sdlt, effectiveRate, bands }
}

const buyerTypes = [
  { value: 'standard', label: 'Standard Buyer' },
  { value: 'ftb', label: 'First-Time Buyer (FTB)' },
  { value: 'additional', label: 'Additional Property (+3%)' },
]

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']
const PIE_COLORS = ['#6366f1', '#22d3ee']

export default function StampDutyCalc() {
  const c = countries['uk']
  const [price, setPrice] = useState(285000)
  const [buyerType, setBuyerType] = useState('standard')
  const [tab, setTab] = useState('summary')

  const result = useMemo(() => calcSDLT({ price, buyerType }), [price, buyerType])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const barData = result
    ? result.bands.filter(b => b.tax > 0).map(b => ({
        name: b.rate,
        tax: Math.round(b.tax),
        label: b.label,
      }))
    : []

  const pieData = result
    ? [
        { name: 'Purchase Price', value: price - result.sdlt },
        { name: 'SDLT', value: Math.round(result.sdlt) },
      ]
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UK Stamp Duty Calculator 2025',
    url: 'https://calqwise.com/uk/stamp-duty',
    applicationCategory: 'FinanceApplication',
    description: 'Calculate UK Stamp Duty Land Tax (SDLT) for 2025. Covers first-time buyers, standard rates, and additional property surcharge.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  }

  return (
    <>
      <Helmet>
        <title>UK Stamp Duty Calculator 2025 — SDLT Rates & Bands | CalcWise</title>
        <meta name="description" content="Calculate UK Stamp Duty Land Tax (SDLT) for 2025. Covers first-time buyers, standard rates, and additional property surcharge. Free UK stamp duty calculator." />
        <link rel="canonical" href="https://calqwise.com/uk/stamp-duty" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Stamp Duty Calculator</h1>
          <p className="text-slate-500">Calculate your UK Stamp Duty Land Tax (SDLT) — April 2025 rates.</p>
        </div>

        <CalcIntro
          intro="The UK Stamp Duty Land Tax (SDLT) calculator uses April 2025 rates to show exactly how much tax you'll pay when purchasing property. Includes First Time Buyer relief and Additional Dwelling Surcharge calculations."
          hiddenCost="Additional property surcharge adds 3% to ALL bands"
        />

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Property Price ({c.symbol})</label>
              <NumericInput value={price} onChange={setPrice} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Buyer Type</label>
              <select className="cw-input" value={buyerType} onChange={e => setBuyerType(e.target.value)}>
                {buyerTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {buyerType === 'ftb' && (
            <div className="mt-3 p-3 bg-primary/10 rounded-lg text-xs text-slate-500">
              FTB relief: 0% up to £425,000; 5% on £425k–£625k. No relief above £625,000 — standard rates apply.
            </div>
          )}
          {buyerType === 'additional' && (
            <div className="mt-3 p-3 bg-amber-500/10 rounded-lg text-xs text-slate-500">
              Additional property surcharge: standard SDLT rates + 3% on every band.
            </div>
          )}
        </div>

        <div className="cw-tabs mb-4">
          {['summary', 'bands', 'chart'].map(v => (
            <button key={v} onClick={() => setTab(v)}
              className={`cw-tab${tab === v ? ' active' : ''}`}>
              {v}
            </button>
          ))}
        </div>

        {result && tab === 'summary' && (
          <ResultSimple
            metrics={[
              { label: 'Stamp Duty (SDLT)', value: fmt(result.sdlt), highlight: true },
              { label: 'Effective Rate', value: `${result.effectiveRate}%` },
              { label: 'Total Cost', value: fmt(price + result.sdlt), sub: 'Property + SDLT' },
            ]}
          />
        )}

        {result && tab === 'bands' && (
          <ResultDetailed
            title="SDLT Breakdown by Band"
            rows={[
              ...result.bands.map(b => ({
                label: `${b.label} @ ${b.rate}`,
                value: fmt(b.tax),
                sub: `On ${fmt(b.taxable)}`,
              })),
              { label: 'Total SDLT', value: fmt(result.sdlt), bold: true },
              { label: 'Effective Rate', value: `${result.effectiveRate}%`, bold: true },
              { label: 'Property Price', value: fmt(price) },
              { label: 'Total Cost (Price + SDLT)', value: fmt(price + result.sdlt), bold: true },
            ]}
          />
        )}

        {result && tab === 'chart' && (
          <div className="space-y-6">
            {barData.length > 0 ? (
              <div className="cw-card">
                <h3 className="font-semibold text-sm mb-4">SDLT by Band</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v, _n, props) => [`£${v.toLocaleString()}`, props.payload.label]}
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
                      {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="cw-card text-center py-6 text-slate-500 text-sm">No SDLT due at this price.</div>
            )}

            <div className="cw-card">
              <h3 className="font-semibold text-sm mb-4">Purchase Price vs SDLT</h3>
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
                    formatter={v => `£${v.toLocaleString()}`}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-slate-500">
            Enter a property price above to calculate your stamp duty.
          </div>
        )}

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          ℹ️ Rates are for England and Northern Ireland (SDLT). Scotland uses LBTT; Wales uses LTT — different rates apply. Rates effective April 2025.
        </div>

        <CalcFAQ faqs={[
          { q: 'What is the First Time Buyer relief threshold?', a: 'From April 2025: 0% on the first £425,000, then 5% up to £625,000. No relief above £625,000 — you pay standard rates. Properties must be your only home.' },
          { q: 'What is the Additional Dwelling Surcharge?', a: 'If you own another property, a 3% surcharge applies to all SDLT bands. This applies to buy-to-let purchases, second homes, and investment properties.' },
          { q: 'When do you pay Stamp Duty?', a: 'SDLT must be paid within 14 days of completing your property purchase. Your solicitor typically handles this as part of the conveyancing process.' },
        ]} />

        <CalcRelated links={[
          { to: '/uk/mortgage', label: 'UK Mortgage Calculator' },
          { to: '/uk/affordability', label: 'UK Affordability' },
          { to: '/uk/property-roi', label: 'Property ROI' },
        ]} />

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
