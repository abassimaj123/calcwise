import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { countries } from '../../config/countries'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import NumericInput from '../../components/NumericInput'

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

export default function SalaryCalc({ country }) {
  const c = countries[country]
  const [gross, setGross] = useState(defaultSalaries[country] || 60000)
  const [inputPeriod, setInputPeriod] = useState('annual')

  const annualGross = useMemo(() => {
    const p = periods.find(p => p.key === inputPeriod)
    return gross * (p ? p.divisor : 1)
  }, [gross, inputPeriod])

  const totalTax = useMemo(() => calcTax(annualGross, country), [annualGross, country])
  const annualNet = annualGross - totalTax
  const effectiveRate = annualGross > 0 ? (totalTax / annualGross) * 100 : 0

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const rows = periods.map(p => ({
    label: p.label,
    value: fmt(annualNet / p.divisor),
    sub: `Gross: ${fmt(annualGross / p.divisor)}`,
    bold: p.key === 'annual',
  }))

  const pageTitle = `${c.name} Salary Calculator 2026 — Gross to Net Take-Home | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} salary calculator 2026. Convert gross to net. See hourly, weekly, monthly, annual take-home pay. Updated tax brackets.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/salary`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.flag} {c.name} Salary Calculator
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

        {annualGross > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="cw-card text-center border-primary/40 bg-primary/10">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Annual Net Income</p>
                <p className="font-display font-bold text-3xl text-white">{fmt(annualNet)}</p>
              </div>
              <div className="cw-card text-center">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Monthly Take-Home</p>
                <p className="font-display font-bold text-2xl text-accent">{fmt(annualNet / 12)}</p>
              </div>
              <div className="cw-card text-center">
                <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">Effective Tax Rate</p>
                <p className="font-display font-bold text-2xl text-accent">{effectiveRate.toFixed(1)}%</p>
              </div>
            </div>

            <ResultDetailed
              title="Pay Period Breakdown (Net)"
              rows={rows}
            />
          </>
        )}

        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
