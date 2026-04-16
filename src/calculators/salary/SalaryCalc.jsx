import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'

// Reuse tax logic inline (simplified)
function calcTax(gross, country) {
  switch (country) {
    case 'us': {
      const stdDed = 14600
      const taxable = Math.max(0, gross - stdDed)
      const brackets = [[11600,0.10,0],[47150,0.12,11600],[100525,0.22,47150],[191950,0.24,100525],[243725,0.32,191950],[609350,0.35,243725],[Infinity,0.37,609350]]
      let fed = 0
      for (const [lim, r, fl] of brackets) {
        if (taxable <= fl) break
        fed += (Math.min(taxable, lim) - fl) * r
      }
      const ss = Math.min(gross, 168600) * 0.062
      const medicare = gross * 0.0145
      const state = gross * 0.045
      return fed + ss + medicare + state
    }
    case 'ca': {
      const bpa = 15705
      const taxable = Math.max(0, gross - bpa)
      const brackets = [[57375,0.15,0],[114750,0.205,57375],[158519,0.26,114750],[220000,0.29,158519],[Infinity,0.33,220000]]
      let fed = 0
      for (const [lim, r, fl] of brackets) {
        if (taxable <= fl) break
        fed += (Math.min(taxable, lim) - fl) * r
      }
      const fedCredit = bpa * 0.15
      const fedFinal = Math.max(0, fed - fedCredit)
      const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
      const ei = Math.min(gross, 63200) * 0.0166
      const prov = gross * 0.08
      return fedFinal + cpp + ei + prov
    }
    case 'uk': {
      const pa = 12570
      const taxable = Math.max(0, gross - pa)
      const basic = Math.min(taxable, 37700) * 0.20
      const higher = Math.max(0, Math.min(taxable - 37700, 74870)) * 0.40
      const add = Math.max(0, taxable - 112570) * 0.45
      const ni1 = Math.min(Math.max(0, gross - 12570), 37700) * 0.08
      const ni2 = Math.max(0, gross - 50270) * 0.02
      return basic + higher + add + ni1 + ni2
    }
    case 'au': {
      const brackets = [[18200,0,0],[45000,0.19,18200],[120000,0.325,45000],[180000,0.37,120000],[Infinity,0.45,180000]]
      let tax = 0
      for (const [lim, r, fl] of brackets) {
        if (gross <= fl) break
        tax += (Math.min(gross, lim) - fl) * r
      }
      return tax + gross * 0.02
    }
    case 'ie': {
      const it = Math.min(gross, 44000) * 0.20 + Math.max(0, gross - 44000) * 0.40
      const prsi = gross * 0.041
      const usc = Math.min(gross, 12012) * 0.005
        + Math.min(Math.max(0, gross - 12012), 15370) * 0.02
        + Math.min(Math.max(0, gross - 27382), 42662) * 0.045
        + Math.max(0, gross - 70044) * 0.08
      return it + prsi + usc
    }
    case 'nz': {
      const brackets = [[14000,0.105,0],[48000,0.175,14000],[70000,0.30,48000],[180000,0.33,70000],[Infinity,0.39,180000]]
      let tax = 0
      for (const [lim, r, fl] of brackets) {
        if (gross <= fl) break
        tax += (Math.min(gross, lim) - fl) * r
      }
      return tax + gross * 0.016
    }
    default: return gross * 0.25
  }
}

const defaultSalaries = { us: 75000, ca: 80000, uk: 45000, au: 85000, ie: 55000, nz: 70000 }

const periods = [
  { key: 'annual', label: 'Annual', divisor: 1 },
  { key: 'monthly', label: 'Monthly', divisor: 12 },
  { key: 'biweekly', label: 'Bi-Weekly', divisor: 26 },
  { key: 'weekly', label: 'Weekly', divisor: 52 },
  { key: 'daily', label: 'Daily', divisor: 260 },
  { key: 'hourly', label: 'Hourly', divisor: 2080 },
]

const PIE_COLORS = ['#22c55e', '#ef4444', '#f97316']

export default function SalaryCalc({ country }) {
  const c = countries[country]
  const [gross, setGross] = useState(defaultSalaries[country] || 60000)
  const [inputPeriod, setInputPeriod] = useState('annual')
  const [view, setView] = useState('breakdown')

  const annualGross = useMemo(() => {
    const p = periods.find(p => p.key === inputPeriod)
    return gross * (p ? p.divisor : 1)
  }, [gross, inputPeriod])

  const totalTax = useMemo(() => calcTax(annualGross, country), [annualGross, country])
  const annualNet = annualGross - totalTax
  const effectiveRate = annualGross > 0 ? (totalTax / annualGross) * 100 : 0

  // Approximate income tax vs deductions/contributions split
  const incomeTaxPortion = useMemo(() => {
    // Recalculate just income tax (without contributions)
    switch (country) {
      case 'us': {
        const stdDed = 14600
        const taxable = Math.max(0, annualGross - stdDed)
        const brackets = [[11600,0.10,0],[47150,0.12,11600],[100525,0.22,47150],[191950,0.24,100525],[243725,0.32,191950],[609350,0.35,243725],[Infinity,0.37,609350]]
        let fed = 0
        for (const [lim, r, fl] of brackets) {
          if (taxable <= fl) break
          fed += (Math.min(taxable, lim) - fl) * r
        }
        return fed + annualGross * 0.045
      }
      case 'ca': {
        const bpa = 15705
        const taxable = Math.max(0, annualGross - bpa)
        const brackets = [[57375,0.15,0],[114750,0.205,57375],[158519,0.26,114750],[220000,0.29,158519],[Infinity,0.33,220000]]
        let fed = 0
        for (const [lim, r, fl] of brackets) {
          if (taxable <= fl) break
          fed += (Math.min(taxable, lim) - fl) * r
        }
        return Math.max(0, fed - bpa * 0.15) + annualGross * 0.08
      }
      case 'uk': {
        const pa = 12570
        const taxable = Math.max(0, annualGross - pa)
        const basic = Math.min(taxable, 37700) * 0.20
        const higher = Math.max(0, Math.min(taxable - 37700, 74870)) * 0.40
        const add = Math.max(0, taxable - 112570) * 0.45
        return basic + higher + add
      }
      case 'au': {
        const brackets = [[18200,0,0],[45000,0.19,18200],[120000,0.325,45000],[180000,0.37,120000],[Infinity,0.45,180000]]
        let tax = 0
        for (const [lim, r, fl] of brackets) {
          if (annualGross <= fl) break
          tax += (Math.min(annualGross, lim) - fl) * r
        }
        return tax
      }
      case 'ie': {
        return Math.min(annualGross, 44000) * 0.20 + Math.max(0, annualGross - 44000) * 0.40
      }
      case 'nz': {
        const brackets = [[14000,0.105,0],[48000,0.175,14000],[70000,0.30,48000],[180000,0.33,70000],[Infinity,0.39,180000]]
        let tax = 0
        for (const [lim, r, fl] of brackets) {
          if (annualGross <= fl) break
          tax += (Math.min(annualGross, lim) - fl) * r
        }
        return tax
      }
      default: return annualGross * 0.20
    }
  }, [annualGross, country])

  const deductions = Math.max(0, totalTax - incomeTaxPortion)

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const fmtShort = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)

  const rows = periods.map(p => ({
    label: p.label,
    value: fmt(annualNet / p.divisor),
    sub: `Gross: ${fmt(annualGross / p.divisor)}`,
    bold: p.key === 'annual',
  }))

  const pieData = [
    { name: 'Net Income', value: Math.round(annualNet) },
    { name: 'Income Tax', value: Math.round(incomeTaxPortion) },
    { name: 'Deductions', value: Math.round(deductions) },
  ].filter(d => d.value > 0)

  const barData = periods.map(p => ({
    period: p.label,
    Gross: Math.round(annualGross / p.divisor * 100) / 100,
    Net: Math.round(annualNet / p.divisor * 100) / 100,
  }))

  const pageTitle = `${c.name} Salary Calculator 2026 — Gross to Net Take-Home | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} salary calculator 2026. Convert gross to net. See hourly, weekly, monthly, annual take-home pay. Updated tax brackets.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/salary`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${c.name} Salary Calculator`,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": c.currency },
          "description": `Free salary calculator for ${c.name}. Convert gross income to net take-home pay across all pay periods.`
        })}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Salary Calculator
          </h1>
          <p className="text-cw-gray">Convert gross income to net take-home. All pay periods.</p>
        </div>

        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Gross Income ({c.symbol})</label>
              <NumericInput value={gross} onChange={setGross} min={0} step={1000} prefix={c.symbol} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Income Period</label>
              <select className="cw-input" value={inputPeriod} onChange={e => setInputPeriod(e.target.value)}>
                {periods.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['breakdown', 'chart', 'periods'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors capitalize ${
                view === v ? 'bg-primary text-white' : 'bg-white/10 text-cw-gray hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {annualGross > 0 && view === 'breakdown' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="cw-card text-center border-blue-500/40 bg-blue-500/10">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Annual Net Income</p>
                <p className="font-display font-bold text-3xl text-white">{fmt(annualNet)}</p>
              </div>
              <div className="cw-card text-center border-green-500/40 bg-green-500/10">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Monthly Take-Home</p>
                <p className="font-display font-bold text-2xl text-green-400">{fmt(annualNet / 12)}</p>
              </div>
              <div className="cw-card text-center border-orange-500/40 bg-orange-500/10">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Effective Tax Rate</p>
                <p className="font-display font-bold text-2xl text-orange-400">{effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
            <ResultDetailed
              title="Pay Period Breakdown (Net)"
              rows={rows}
            />
          </>
        )}

        {annualGross > 0 && view === 'chart' && (
          <div className="cw-card space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4 text-center">Income Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmtShort(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-cw-gray uppercase tracking-wider mb-4 text-center">Gross vs Net by Pay Period</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${c.symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => fmtShort(value)} />
                  <Legend />
                  <Bar dataKey="Gross" fill="#64748b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Net" fill="#22c55e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {annualGross > 0 && view === 'periods' && (
          <ResultDetailed
            title="Pay Period Breakdown (Net)"
            rows={rows}
          />
        )}

        {annualGross <= 0 && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter a gross income above to see your take-home pay.
          </div>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>

      <CalcIntro intro="This salary calculator converts your gross income to net take-home pay across all pay periods — hourly, daily, weekly, bi-weekly, monthly and annually. It accounts for income tax, social contributions, and standard deductions for 2026." />
      <CalcFAQ faqs={[
        { q: 'What is the difference between gross and net salary?', a: 'Gross salary is your total earnings before deductions. Net salary (take-home pay) is what you actually receive after income tax and other contributions.' },
        { q: 'What deductions are included?', a: 'This calculator includes federal/national income tax, social security contributions (CPP/EI, NI, PRSI etc.), and standard deductions for your country.' },
        { q: 'How is the effective tax rate calculated?', a: 'Effective tax rate = total tax paid / gross income x 100. It differs from your marginal rate which only applies to your last dollar earned.' },
      ]} />
      <CalcRelated links={[
        { to: `/${country}/tax`, label: 'Tax Calculator' },
        { to: `/${country}/affordability`, label: 'Affordability Calculator' },
        { to: `/${country}/rent-vs-buy`, label: 'Rent vs Buy' },
      ]} />
    </>
  )
}
