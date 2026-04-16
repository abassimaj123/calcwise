import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { countries } from '../../config/countries'
import ResultSimple from '../../components/ResultSimple'
import ResultDetailed from '../../components/ResultDetailed'
import AdSenseSlot from '../../components/AdSenseSlot'
import AppDownloadBanner from '../../components/AppDownloadBanner'
import { CalcIntro, CalcFAQ, CalcAlsoAvailable, CalcRelated } from '../../components/CalcSEO'
import NumericInput from '../../components/NumericInput'

const COLORS = { primary: '#1A6AFF', accent: '#00D4FF', success: '#1D9E75', warn: '#F5C842' }

function calcMortgage({ price, down, rate, termYears, country }) {
  const principal = price - down
  const monthlyRate = rate / 100 / 12
  const n = termYears * 12
  if (principal <= 0 || rate <= 0 || n <= 0) return null

  const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  const totalPaid = monthly * n
  const totalInterest = totalPaid - principal
  const ltv = (principal / price) * 100

  // UK SDLT — April 2025 rates
  let sdlt = 0
  if (country === 'uk') {
    const slabs = [
      [125000, 0],
      [125000, 0.02],
      [675000, 0.05],
      [575000, 0.10],
      [Infinity, 0.12],
    ]
    let rem = price
    for (const [limit, r] of slabs) {
      const taxable = Math.min(rem, limit)
      sdlt += taxable * r
      rem -= taxable
      if (rem <= 0) break
    }
  }

  // CA CMHC premium
  let cmhc = 0
  if (country === 'ca') {
    const dpPct = (down / price) * 100
    const cmhcRate = dpPct < 10 ? 0.04 : dpPct < 15 ? 0.031 : dpPct < 20 ? 0.028 : 0
    cmhc = principal * cmhcRate
  }

  // US PMI
  let pmi = 0
  if (country === 'us' && ltv > 80) {
    pmi = (principal * 0.005) / 12
  }

  // AU LMI (simplified estimate)
  let lmi = 0
  if (country === 'au' && ltv > 80) {
    lmi = principal * 0.02
  }

  return { monthly, totalInterest, totalPaid, ltv, sdlt, cmhc, pmi, lmi, principal, n }
}

function buildAmortData(principal, monthlyRate, monthly, n) {
  const data = []
  let balance = principal
  let cumPrincipal = 0
  let cumInterest = 0
  for (let m = 1; m <= n; m++) {
    const interestPart = balance * monthlyRate
    const principalPart = monthly - interestPart
    balance -= principalPart
    cumPrincipal += principalPart
    cumInterest += interestPart
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        principal: Math.round(cumPrincipal),
        interest: Math.round(cumInterest),
      })
    }
  }
  return data
}

const defaultValues = {
  us: { price: 400000, down: 80000, rate: 7.0, term: 30 },
  ca: { price: 600000, down: 120000, rate: 5.0, term: 25 },
  uk: { price: 300000, down: 60000, rate: 4.5, term: 25 },
  au: { price: 750000, down: 150000, rate: 6.5, term: 30 },
  ie: { price: 350000, down: 70000, rate: 4.0, term: 30 },
  nz: { price: 700000, down: 140000, rate: 7.0, term: 30 },
}

export default function MortgageCalc({ country }) {
  const c = countries[country]
  const sym = c.symbol
  const defs = defaultValues[country] || defaultValues.us

  const [price, setPrice] = useState(defs.price)
  const [down, setDown] = useState(defs.down)
  const [rate, setRate] = useState(defs.rate)
  const [term, setTerm] = useState(defs.term)
  const [view, setView] = useState('simple')

  const result = useMemo(
    () => calcMortgage({ price, down, rate, termYears: term, country }),
    [price, down, rate, term, country]
  )

  const amortData = useMemo(() => {
    if (!result) return []
    return buildAmortData(result.principal, rate / 100 / 12, result.monthly, result.n)
  }, [result, rate])

  const pieData = useMemo(() => {
    if (!result) return []
    const items = [
      { name: 'Principal', value: Math.round(result.principal) },
      { name: 'Interest', value: Math.round(result.totalInterest) },
    ]
    if (result.pmi > 0) items.push({ name: 'PMI (total)', value: Math.round(result.pmi * result.n) })
    return items
  }, [result])

  const fmt = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, maximumFractionDigits: 0 }).format(n)
      : '—'
  const fmtD = (n) =>
    n != null
      ? new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
      : '—'

  const downPct = price > 0 ? ((down / price) * 100).toFixed(1) : 0
  const stressRate = Math.max(rate + 2, 5.25)
  const termOptions = [10, 15, 20, 25, 30].filter(y => country !== 'ca' || y <= 25)

  const pageTitle = `${c.name} Mortgage Calculator 2026 — Monthly Payment | CalcWise`
  const pageDesc = `Free ${c.name} mortgage calculator. Instant monthly payment, total interest, amortization.${country === 'uk' ? ' SDLT included.' : country === 'ca' ? ' CMHC & stress test.' : ''} Updated 2026.`

  const PIE_COLORS = [COLORS.primary, COLORS.accent, COLORS.warn]

  const otherCountries = Object.entries(countries)
    .filter(([code]) => code !== country)
    .map(([code, ct]) => ({ code, flag: ct.flag, name: ct.name }))

  const relatedLinks = [
    country === 'us' && { to: '/us/refinance', label: 'Refinance US' },
    country === 'us' && { to: '/us/rent-vs-buy', label: 'Rent vs Buy US' },
    country === 'us' && { to: '/us/affordability', label: 'Affordability US' },
    country === 'ca' && { to: '/ca/affordability', label: 'Affordability CA' },
    country === 'ca' && { to: '/ca/rent-vs-buy', label: 'Rent vs Buy CA' },
    country === 'uk' && { to: '/uk/stamp-duty', label: 'Stamp Duty UK' },
    country === 'uk' && { to: '/uk/affordability', label: 'Affordability UK' },
    { to: `/${country}/tax`, label: `Tax ${country.toUpperCase()}` },
  ].filter(Boolean)

  const introText = {
    us: 'Our US mortgage calculator goes beyond the basic monthly payment. We include PMI (when your down payment is under 20%), show your LTV ratio, and display the full amortization schedule — revealing exactly how much of every payment goes to principal vs. interest. Your bank\'s calculator won\'t show you how much PMI really costs over the life of the loan.',
    ca: 'Our Canadian mortgage calculator includes CMHC mortgage insurance (required when down payment is under 20%), the OSFI stress test at qualifying rate, and bi-weekly payment options. See the true cost of your mortgage including all fees your bank might not advertise.',
    uk: 'Our UK mortgage calculator includes Stamp Duty Land Tax (SDLT) using April 2025 rates, LTV ratio, and FCA stress test rate. See the full cost of buying property in the UK, including the hidden upfront tax costs that catch many buyers by surprise.',
    au: 'Our Australian mortgage calculator includes Lenders Mortgage Insurance (LMI) when your LVR exceeds 80%, giving you the real picture of what homeownership costs — not just the repayment amount.',
    ie: 'Our Irish mortgage calculator uses 2026 ECB-influenced rates and shows your true monthly repayment. Compare with rent costs to make an informed decision about buying property in Ireland.',
    nz: 'Our New Zealand mortgage calculator helps you understand the full cost of home ownership in 2026. See how your interest rate, loan term, and deposit affect your weekly and fortnightly payments.',
  }

  const hiddenCostLabel = {
    us: result?.pmi > 0 ? `PMI adds ${fmtD(result.pmi)}/mo until LTV < 80%` : 'PMI applies if down payment < 20%',
    ca: 'CMHC premium adds to your mortgage balance',
    uk: result?.sdlt > 0 ? `SDLT: ${fmt(result.sdlt)} due at completion` : 'SDLT may apply based on purchase price',
    au: result?.lmi > 0 ? `LMI: ${fmt(result.lmi)} if LVR > 80%` : 'LMI applies if LVR > 80%',
    ie: 'Solicitor fees, valuation, and survey not included',
    nz: 'Legal fees and LIM report costs not included',
  }

  const faqs = {
    us: [
      { q: 'What is included in my monthly mortgage payment?', a: 'Your monthly payment (P&I) covers principal repayment and interest. You may also owe PMI (if LTV > 80%), property tax (~1.1%/yr), and homeowner\'s insurance (~$150/mo) — which this calculator also estimates.' },
      { q: 'How is PMI calculated?', a: 'PMI (Private Mortgage Insurance) applies when your down payment is less than 20%. It\'s typically 0.5%–1% of the loan amount annually. It automatically drops off once your LTV reaches 80%.' },
      { q: 'What is a good debt-to-income ratio for a mortgage?', a: 'Lenders typically want your housing costs (PITI) below 28% of gross income (front-end DTI), and total debts below 36%–43% (back-end DTI) depending on loan type.' },
    ],
    ca: [
      { q: 'What is the CMHC mortgage insurance?', a: 'CMHC insurance is mandatory when your down payment is between 5%–19.99% of the purchase price. The premium ranges from 2.8%–4% of the insured mortgage amount and is added to your balance.' },
      { q: 'What is the mortgage stress test in Canada?', a: 'The OSFI stress test requires you to qualify at the higher of your contract rate + 2%, or 5.25%. This ensures you can afford payments if rates rise.' },
      { q: 'What is the maximum amortization in Canada?', a: 'For insured mortgages (down payment < 20%), the maximum amortization is 25 years. For uninsured mortgages, lenders may offer up to 30 years.' },
    ],
    uk: [
      { q: 'What is Stamp Duty (SDLT)?', a: 'Stamp Duty Land Tax is a tax on property purchases in England and Northern Ireland. Rates start at 0% up to £250,000 and rise to 12% above £1.5M. First-time buyers get relief up to £425,000.' },
      { q: 'What is the LTV ratio?', a: 'Loan-to-Value (LTV) is your mortgage amount as a percentage of the property value. Most lenders require at least 5%-10% deposit (90-95% LTV max). Lower LTV = better interest rates.' },
      { q: 'What is the FCA stress test?', a: 'UK mortgage lenders must verify you can afford repayments if rates rise by 3%. This stress test rate is applied to ensure affordability under adverse conditions.' },
    ],
    au: [
      { q: 'What is LMI (Lenders Mortgage Insurance)?', a: 'LMI protects the lender if you default. It applies when your LVR exceeds 80% (deposit less than 20%). The cost is typically 1%–3% of the loan amount and can be added to your mortgage.' },
      { q: 'What is the serviceability buffer?', a: 'APRA requires lenders to assess loan serviceability at the higher of the interest rate + 3% buffer or a floor rate. This ensures you can afford repayments if rates rise.' },
      { q: 'What is the First Home Owner Grant (FHOG)?', a: 'FHOG is a government grant for eligible first-home buyers. The amount varies by state (typically $10,000–$30,000) and applies to new homes only.' },
    ],
    ie: [
      { q: 'What is the Central Bank lending limit in Ireland?', a: 'The Central Bank of Ireland limits mortgages to 3.5× your gross income for owner-occupier purchases, with a 20% deposit required (10% for first-time buyers on amounts up to €500,000).' },
      { q: 'What additional costs should I budget for?', a: 'Beyond the mortgage, budget for solicitor fees (€1,500–€2,500), valuation (€150–€300), survey (€400–€600), and stamp duty (1% on residential property).' },
      { q: 'What is the Mortgage to Rent scheme?', a: 'The MTR scheme allows homeowners in arrears to remain in their home as social housing tenants while the lender or a housing body takes ownership. It\'s a last-resort option for those in mortgage difficulty.' },
    ],
    nz: [
      { q: 'What is the LVR restriction in New Zealand?', a: 'RBNZ LVR restrictions limit high-LVR lending. Owner-occupiers need at least 20% deposit, investors need 35%. Some exceptions exist for new builds and first-home buyers.' },
      { q: 'What are typical mortgage rates in NZ in 2026?', a: 'Rates vary by term and lender. Fixed 1-year rates are typically 6.5%–7.5% in 2026, while floating rates may be higher. Shopping across lenders can save thousands.' },
      { q: 'What other costs are involved in buying a home in NZ?', a: 'Budget for legal fees ($1,500–$2,500), building inspection ($400–$800), LIM report ($200–$400), and potential KiwiSaver withdrawal for your deposit.' },
    ],
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`https://calqwise.com/${country}/mortgage`} />
        {country === 'ca' && <link rel="alternate" hreflang="fr-ca" href="https://calqwise.com/ca/mortgage" />}
        <link rel="alternate" hreflang="en" href={`https://calqwise.com/${country}/mortgage`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${c.name} Mortgage Calculator`,
          "applicationCategory": "FinanceApplication",
          "applicationSubCategory": "Financial Calculator",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": c.currency },
          "description": pageDesc,
          "url": `https://calqwise.com/${country}/mortgage`,
        })}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            {c.name} Mortgage Calculator
          </h1>
          <p className="text-cw-gray">
            Calculate your monthly payment, total interest and amortization schedule.
          </p>
        </div>

        <CalcIntro intro={introText[country] || introText.us} hiddenCost={result ? hiddenCostLabel[country] : null} />

        {/* Inputs */}
        <div className="cw-card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cw-gray mb-1">Home Price ({sym})</label>
              <NumericInput value={price} onChange={setPrice} min={0} step={1000} prefix={sym} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Down Payment ({sym}) — {downPct}%</label>
              <NumericInput value={down} onChange={setDown} min={0} step={1000} prefix={sym} />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Annual Interest Rate (%)</label>
              <NumericInput value={rate} onChange={setRate} min={0} step={0.1} suffix="%" />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1">Loan Term (years)</label>
              <select className="cw-input" value={term} onChange={e => setTerm(+e.target.value)}>
                {termOptions.map(y => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
          </div>

          {country === 'ca' && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-cw-gray">
              🇨🇦 <strong className="text-white">Stress test rate:</strong> {stressRate.toFixed(2)}% — lenders qualify you at the higher of (rate + 2%) or 5.25%
            </div>
          )}
          {country === 'uk' && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-cw-gray">
              🇬🇧 <strong className="text-white">SDLT:</strong> Stamp Duty Land Tax is calculated using April 2025 residential rates
            </div>
          )}
          {country === 'us' && result && result.ltv > 80 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-cw-gray">
              ⚠️ <strong className="text-white">PMI applies:</strong> LTV {result.ltv.toFixed(1)}% &gt; 80% — PMI ~0.5%/yr until LTV reaches 80%
            </div>
          )}
        </div>

        {/* View Toggle */}
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
              { label: 'Monthly Payment', value: fmtD(result.monthly + result.pmi), highlight: true },
              { label: 'Total Interest', value: fmt(result.totalInterest) },
              { label: 'Total Cost', value: fmt(result.totalPaid) },
            ]}
          />
        )}

        {result && view === 'detailed' && (
          <>
            <ResultDetailed
              title="Full Breakdown"
              rows={[
                { label: 'Purchase Price', value: fmt(price) },
                { label: 'Down Payment', value: `${fmt(down)} (${downPct}%)` },
                { label: 'Loan Amount', value: fmt(result.principal) },
                { label: 'Monthly Payment (P&I)', value: fmtD(result.monthly), bold: true },
                result.pmi > 0 && { label: 'PMI (monthly)', value: fmtD(result.pmi), sub: 'Removed when LTV < 80%' },
                result.cmhc > 0 && { label: 'CMHC Premium', value: fmt(result.cmhc), sub: 'Added to mortgage balance' },
                result.lmi > 0 && { label: 'LMI (est.)', value: fmt(result.lmi), sub: 'Lenders Mortgage Insurance' },
                { label: 'LTV Ratio', value: `${result.ltv.toFixed(1)}%` },
                { label: 'Total Interest', value: fmt(result.totalInterest) },
                { label: 'Total of All Payments', value: fmt(result.totalPaid), bold: true },
                result.sdlt > 0 && { label: 'Stamp Duty (SDLT)', value: fmt(result.sdlt), sub: 'April 2025 rates — paid upfront', bold: true },
              ].filter(Boolean)}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Area Chart: Principal vs Interest over time */}
              <div className="cw-card">
                <h3 className="font-semibold mb-4 text-sm">Principal vs Interest Over Time</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={amortData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `Y${v}`} />
                    <YAxis tick={{ fontSize: 11, fill: '#8A9BB5' }} tickFormatter={v => `${sym}${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                      formatter={(val, name) => [fmt(val), name]}
                      labelFormatter={l => `Year ${l}`}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="principal" name="Cumulative Principal" stroke={COLORS.primary} fill="url(#gradPrincipal)" strokeWidth={2} />
                    <Area type="monotone" dataKey="interest" name="Cumulative Interest" stroke={COLORS.accent} fill="url(#gradInterest)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart: total cost breakdown */}
              <div className="cw-card flex flex-col items-center">
                <h3 className="font-semibold mb-4 text-sm self-start">Total Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
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
            </div>
          </>
        )}

        {!result && (
          <div className="cw-card text-center py-8 text-cw-gray">
            Enter valid values above to see your results.
          </div>
        )}

        <CalcFAQ faqs={faqs[country] || faqs.us} />
        <CalcAlsoAvailable calcSlug="mortgage" calcLabel="Mortgage" countries={otherCountries} />
        <CalcRelated links={relatedLinks} />

        <AppDownloadBanner calcKey="mortgage" country={country} />
        <AdSenseSlot format="rectangle" />
        <AdSenseSlot format="leaderboard" />
      </div>
    </>
  )
}
