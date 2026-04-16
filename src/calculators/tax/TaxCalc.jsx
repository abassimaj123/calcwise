import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import NumericInput from '../../components/NumericInput'

const COLORS = { primary: '#1A6AFF', accent: '#00D4FF', success: '#1D9E75', warn: '#F5C842', red: '#EF4444' }
const PIE_COLORS = [COLORS.success, COLORS.red, COLORS.warn, COLORS.accent]

// ── Tax calculation engines ────────────────────────────────────────

function applyBrackets(income, brackets) {
  let tax = 0
  for (const [limit, rate, floor] of brackets) {
    if (income <= (floor || 0)) continue
    const taxable = Math.min(income, limit) - (floor || 0)
    if (taxable <= 0) break
    tax += taxable * rate
  }
  return tax
}

// US Federal 2026
const usFedBrackets = [
  [11925,   0.10,  0],
  [48475,   0.12,  11925],
  [103350,  0.22,  48475],
  [197300,  0.24,  103350],
  [250525,  0.32,  197300],
  [626350,  0.35,  250525],
  [Infinity,0.37,  626350],
]

function calcUS(gross) {
  const stdDeduction = 14600
  const taxableIncome = Math.max(0, gross - stdDeduction)
  const fedTax = applyBrackets(taxableIncome, usFedBrackets)
  const ssTax = Math.min(gross, 176100) * 0.062
  const medicareTax = gross * 0.0145
  const fica = ssTax + medicareTax
  const stateTaxEst = gross * 0.045
  const totalTax = fedTax + fica + stateTaxEst
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    fedTax, fica, ssTax, medicareTax, stateTaxEst, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Federal Tax', value: Math.round(fedTax) },
      { name: 'FICA', value: Math.round(fica) },
      { name: 'State Tax', value: Math.round(stateTaxEst) },
    ],
    barData: [
      { name: 'Federal', amount: Math.round(fedTax) },
      { name: 'SS', amount: Math.round(ssTax) },
      { name: 'Medicare', amount: Math.round(medicareTax) },
      { name: 'State', amount: Math.round(stateTaxEst) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Standard Deduction', value: -stdDeduction },
      { label: 'Taxable Income', value: taxableIncome },
      { label: 'Federal Income Tax', value: fedTax },
      { label: 'Social Security (6.2%)', value: ssTax, sub: 'On up to $176,100' },
      { label: 'Medicare (1.45%)', value: medicareTax },
      { label: 'State Tax (est. ~4.5%)', value: stateTaxEst, sub: 'Average — varies by state' },
      { label: 'Total Tax & Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// CA Federal 2026
const caFedBrackets = [
  [57375,   0.15,  0],
  [114750,  0.205, 57375],
  [158519,  0.26,  114750],
  [220000,  0.29,  158519],
  [Infinity,0.33,  220000],
]

function calcCA(gross) {
  const bpa = 15705
  const taxableIncome = Math.max(0, gross - bpa)
  const fedTax = applyBrackets(taxableIncome, caFedBrackets)
  const fedCredit = bpa * 0.15
  const fedTaxFinal = Math.max(0, fedTax - fedCredit)
  const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
  const ei = Math.min(gross, 63200) * 0.0166
  const provTaxEst = gross * 0.08
  const totalTax = fedTaxFinal + cpp + ei + provTaxEst
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    fedTax: fedTaxFinal, cpp, ei, provTaxEst, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Federal Tax', value: Math.round(fedTaxFinal) },
      { name: 'CPP + EI', value: Math.round(cpp + ei) },
      { name: 'Provincial', value: Math.round(provTaxEst) },
    ],
    barData: [
      { name: 'Federal', amount: Math.round(fedTaxFinal) },
      { name: 'CPP', amount: Math.round(cpp) },
      { name: 'EI', amount: Math.round(ei) },
      { name: 'Provincial', amount: Math.round(provTaxEst) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Basic Personal Amount', value: -bpa },
      { label: 'Federal Income Tax', value: fedTaxFinal },
      { label: 'CPP (5.95%)', value: cpp, sub: 'On $3,500–$68,500' },
      { label: 'EI (1.66%)', value: ei, sub: 'On up to $63,200' },
      { label: 'Provincial Tax (est. ~8%)', value: provTaxEst, sub: 'Average — varies by province' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// UK 2025-26
function calcUK(gross) {
  const personalAllowance = 12570
  const basicRateLimit = 50270
  const higherRateLimit = 125140
  const taxable = Math.max(0, gross - personalAllowance)
  const basic = Math.min(taxable, basicRateLimit - personalAllowance) * 0.20
  const higher = Math.max(0, Math.min(taxable, higherRateLimit - personalAllowance) - (basicRateLimit - personalAllowance)) * 0.40
  const additional = Math.max(0, taxable - (higherRateLimit - personalAllowance)) * 0.45
  const incomeTax = basic + higher + additional
  const ni1 = Math.min(Math.max(0, gross - 12570), 50270 - 12570) * 0.08
  const ni2 = Math.max(0, gross - 50270) * 0.02
  const ni = ni1 + ni2
  const totalTax = incomeTax + ni
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, ni, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'National Insurance', value: Math.round(ni) },
    ],
    barData: [
      { name: 'Basic (20%)', amount: Math.round(basic) },
      { name: 'Higher (40%)', amount: Math.round(higher) },
      { name: 'NI 8%', amount: Math.round(ni1) },
      { name: 'NI 2%', amount: Math.round(ni2) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Personal Allowance', value: -personalAllowance },
      { label: 'Income Tax (20%/40%/45%)', value: incomeTax },
      { label: 'National Insurance', value: ni, sub: '8% up to £50,270 / 2% above' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// AU 2024-25
const auBrackets = [
  [18200,   0,     0],
  [45000,   0.19,  18200],
  [120000,  0.325, 45000],
  [180000,  0.37,  120000],
  [Infinity,0.45,  180000],
]

function calcAU(gross) {
  const incomeTax = applyBrackets(gross, auBrackets)
  const medicare = gross * 0.02
  const super_ = gross * 0.115
  const totalTax = incomeTax + medicare
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, medicare, super_, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'Medicare', value: Math.round(medicare) },
    ],
    barData: [
      { name: 'Income Tax', amount: Math.round(incomeTax) },
      { name: 'Medicare', amount: Math.round(medicare) },
      { name: 'Super (employer)', amount: Math.round(super_) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax', value: incomeTax },
      { label: 'Medicare Levy (2%)', value: medicare },
      { label: 'Total Tax', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
      { label: 'Super (11.5% — employer pays)', value: super_, sub: 'Employer pays in addition to salary' },
    ],
  }
}

// IE 2025
function calcIE(gross) {
  const standardRateLimit = 42000
  const it1 = Math.min(gross, standardRateLimit) * 0.20
  const it2 = Math.max(0, gross - standardRateLimit) * 0.40
  const incomeTax = it1 + it2
  const prsi = gross * 0.041
  const usc1 = Math.min(gross, 12012) * 0.005
  const usc2 = Math.min(Math.max(0, gross - 12012), 27382 - 12012) * 0.02
  const usc3 = Math.min(Math.max(0, gross - 27382), 70044 - 27382) * 0.04
  const usc4 = Math.max(0, gross - 70044) * 0.08
  const usc = usc1 + usc2 + usc3 + usc4
  const totalTax = incomeTax + prsi + usc
  const netAnnual = gross - totalTax
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, prsi, usc, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'PRSI', value: Math.round(prsi) },
      { name: 'USC', value: Math.round(usc) },
    ],
    barData: [
      { name: 'IT 20%', amount: Math.round(it1) },
      { name: 'IT 40%', amount: Math.round(it2) },
      { name: 'PRSI', amount: Math.round(prsi) },
      { name: 'USC', amount: Math.round(usc) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax (20%/40%)', value: incomeTax },
      { label: 'PRSI (4.1%)', value: prsi },
      { label: 'USC', value: usc, sub: '0.5% / 2% / 4% / 8% bands' },
      { label: 'Total Deductions', value: totalTax, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

// NZ 2025
const nzBrackets = [
  [14000,   0.105, 0],
  [48000,   0.175, 14000],
  [70000,   0.30,  48000],
  [180000,  0.33,  70000],
  [Infinity,0.39,  180000],
]

function calcNZ(gross) {
  const incomeTax = applyBrackets(gross, nzBrackets)
  const acc = gross * 0.016
  const kiwisaver = gross * 0.03
  const totalTax = incomeTax + acc
  const netAnnual = gross - totalTax - kiwisaver
  const effectiveRate = (totalTax / gross) * 100
  return {
    incomeTax, acc, kiwisaver, totalTax, netAnnual, effectiveRate,
    pieData: [
      { name: 'Take-Home', value: Math.round(netAnnual) },
      { name: 'Income Tax', value: Math.round(incomeTax) },
      { name: 'ACC', value: Math.round(acc) },
      { name: 'KiwiSaver', value: Math.round(kiwisaver) },
    ],
    barData: [
      { name: 'Income Tax', amount: Math.round(incomeTax) },
      { name: 'ACC', amount: Math.round(acc) },
      { name: 'KiwiSaver', amount: Math.round(kiwisaver) },
    ],
    rows: [
      { label: 'Gross Income', value: gross, bold: true },
      { label: 'Income Tax', value: incomeTax },
      { label: 'ACC Levy (1.6%)', value: acc },
      { label: 'KiwiSaver (3%)', value: kiwisaver },
      { label: 'Total Deductions', value: totalTax + kiwisaver, bold: true },
      { label: 'Net Take-Home', value: netAnnual, bold: true },
    ],
  }
}

const calcEngines = { us: calcUS, ca: calcCA, uk: calcUK, au: calcAU, ie: calcIE, nz: calcNZ }
const defaultIncomes = { us: 75000, ca: 80000, uk: 45000, au: 85000, ie: 55000, nz: 70000 }

export default function TaxCalc({ country }) {
  const c = countries[country]
  const [gross, setGross] = useState(defaultIncomes[country] || 60000)
  const [view, setView] = useState('simple')

  const result = useMemo(() => {
    if (!gross || gross <= 0) return null
    const engine = calcEngines[country]
    return engine ? engine(gross) : null
  }, [gross, country])

  const fmt = (n) =>
    new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(Math.abs(n))

  const pageTitle = `${c.name} Tax Calculator 2026 — Income Tax & Take-Home Pay | CalcWise`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Free ${c.name} income tax calculator 2026. Calculate take-home pay, effective rate, ${country === 'us' ? 'federal + state + FICA' : country === 'ca' ? 'federal + provincial + CPP + EI' : country === 'uk' ? 'PAYE + National Insurance' : 'income tax + levies'}. Updated 2025-26 brackets.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}/tax`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Tax Calculator
          </h1>
          <p className="text-cw-gray">
            Calculate your take-home pay and effective tax rate. Updated for 2025-26.
          </p>
        </div>

        <div className="cw-card mb-6">
          <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">
            Annual Gross Income ({c.symbol})
          </label>
          <NumericInput value={gross} onChange={setGross} min={0} step={1000} prefix={c.symbol} />
          <p className="text-xs text-cw-gray mt-2">Enter your gross (before-tax) annual income</p>
        </div>

        <div className="flex gap-2 mb-4">
          {['simple', 'detailed'].map(v => (
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

        {result && view === 'simple' && (
          <ResultSimple
            metrics={[
              { label: 'Net Annual Income', value: fmt(result.netAnnual), highlight: true },
              { label: 'Monthly Take-Home', value: fmt(result.netAnnual / 12) },
              { label: 'Effective Tax Rate', value: `${result.effectiveRate.toFixed(1)}%` },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <>
            <ResultDetailed
              title="Tax Breakdown"
              rows={result.rows.map(r => ({
                label: r.label,
                value: r.value < 0 ? `-${fmt(r.value)}` : fmt(r.value),
                bold: r.bold,
                sub: r.sub,
              }))}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Pie: take-home vs taxes */}
              <div className="cw-card flex flex-col items-center">
                <h3 className="font-semibold mb-4 text-sm self-start">Income Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={result.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {result.pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => fmt(val)}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar: tax components */}
              <div className="cw-card">
                <h3 className="font-semibold mb-4 text-sm">Tax Components</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={result.barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8A9BB5' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `${c.symbol}${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => fmt(val)}
                    />
                    <Bar dataKey="amount" name="Amount" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter your annual income above to see the breakdown.
          </div>
        )}

        <div className="mt-4 p-3 bg-white/[0.03] rounded-lg text-xs text-cw-gray">
          ℹ️ These are estimates based on standard deductions and average rates. Actual tax may differ based on filing status, deductions, credits, and jurisdiction. Consult a tax professional for advice.
        </div>

        <AppDownloadBanner calcKey="tax" country={country} />
        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
