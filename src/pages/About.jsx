import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { countries } from '../config/countries'

const OFFICIAL_SOURCES = [
  { name: 'IRS (US Income Tax)', url: 'https://www.irs.gov/tax-professionals/tax-code-regulations-and-official-guidance', country: '🇺🇸' },
  { name: 'IRS Publication 15-T (Federal Withholding)', url: 'https://www.irs.gov/publications/p15t', country: '🇺🇸' },
  { name: 'FHFA (US Conforming Loan Limits)', url: 'https://www.fhfa.gov/DataTools/Downloads/Pages/Conforming-Loan-Limits.aspx', country: '🇺🇸' },
  { name: 'Canada Revenue Agency (CRA)', url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html', country: '🇨🇦' },
  { name: 'CMHC (Mortgage Insurance Premiums)', url: 'https://www.cmhc-schl.gc.ca/en/consumers/home-buying/mortgage-loan-insurance-for-consumers/what-is-mortgage-loan-insurance', country: '🇨🇦' },
  { name: 'OSFI Guideline B-20 (Stress Test)', url: 'https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures', country: '🇨🇦' },
  { name: 'HMRC (UK Income Tax & NI)', url: 'https://www.gov.uk/income-tax-rates', country: '🇬🇧' },
  { name: 'UK Government SDLT Rates', url: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates', country: '🇬🇧' },
  { name: 'ATO (Australian Tax Rates)', url: 'https://www.ato.gov.au/rates/individual-income-tax-rates/', country: '🇦🇺' },
  { name: 'APRA (Serviceability Buffer)', url: 'https://www.apra.gov.au/media-releases/apra-finalises-guidance-on-home-loan-serviceability', country: '🇦🇺' },
  { name: 'Revenue.ie (Irish Income Tax)', url: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx', country: '🇮🇪' },
  { name: 'IRD New Zealand (PAYE)', url: 'https://www.ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals', country: '🇳🇿' },
]

const METHODOLOGY = [
  {
    title: 'Mortgage Calculations',
    points: [
      'Standard amortization formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]',
      'Canada: interest compounded semi-annually per the Interest Act R.S.C. 1985, c. I-15 §6',
      'CMHC premiums sourced directly from CMHC published rate tables (2.80%–4.00%)',
      'US PMI estimated at 0.50%–1.50% of loan balance annually (industry average)',
      'UK SDLT uses the April 2025 rate bands from HMRC guidance',
      'APRA serviceability buffer of +3.0% applied for Australian mortgages',
      'OSFI B-20 stress test rate: max(contract rate + 2%, 5.25%) for Canadian mortgages',
    ],
  },
  {
    title: 'Income Tax & Salary Calculations',
    points: [
      'US: IRS 2026 tax brackets (Publication 15-T), all 50 state rates, FICA 7.65%',
      'Canada: CRA federal brackets + all 13 provincial/territorial rates, CPP 5.95%, EI 1.66%',
      'UK: HMRC 2026/27 PAYE bands, National Insurance Class 1 (8% / 2%)',
      'Australia: ATO 2025/26 individual rates + 2% Medicare Levy',
      'Ireland: Standard Rate (20%), Higher Rate (40%), PRSI 4%, all USC tiers',
      'New Zealand: IRD PAYE rates, ACC earners levy 1.33%',
    ],
  },
  {
    title: 'All Other Calculators',
    points: [
      'Rent vs Buy: opportunity cost uses 7% default annual investment return (S&P 500 long-term average)',
      'Loan Payoff: standard amortization with extra payment applied to principal',
      'Property ROI: cap rate = NOI / purchase price, CoC = annual pre-tax cash flow / total cash invested',
      'Auto Loan: standard simple interest amortization with provincial/state sales tax applied',
      'Debt Payoff (Snowball/Avalanche): standard minimum payment + surplus allocation algorithms',
    ],
  },
]

export default function About() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CalqWise',
    url: 'https://calqwise.com',
    logo: 'https://calqwise.com/og-image.jpg',
    description: 'Free financial calculators for mortgage, tax, salary, and more — covering US, Canada, UK, Australia, Ireland, and New Zealand.',
    foundingDate: '2024',
    areaServed: ['US', 'CA', 'GB', 'AU', 'IE', 'NZ'],
    knowsAbout: ['Mortgage Calculator', 'Income Tax Calculator', 'Salary Calculator', 'Auto Loan Calculator', 'Financial Planning'],
    sameAs: [
      'https://play.google.com/store/apps/developer?id=CalqWise',
    ],
  }

  return (
    <>
      <Helmet>
        <title>About CalqWise — Methodology, Data Sources & Accuracy</title>
        <meta name="description" content="How CalqWise calculates mortgage payments, income taxes, and salaries. Our methodology, official data sources, and quarterly update policy for US, Canada, UK, Australia, Ireland, and New Zealand." />
        <link rel="canonical" href="https://calqwise.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About CalqWise — Methodology & Data Sources" />
        <meta property="og:description" content="Our calculation methodology, official data sources (IRS, CRA, HMRC, ATO), and update policy." />
        <meta property="og:url" content="https://calqwise.com/about" />
        <meta property="og:image" content="https://calqwise.com/og-image.jpg" />
        <meta property="og:site_name" content="CalqWise" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About CalqWise — Methodology & Data Sources" />
        <meta name="twitter:description" content="How we calculate mortgage, tax, and salary — with links to official sources." />
        <meta name="twitter:image" content="https://calqwise.com/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">About CalqWise</h1>
          <p className="text-slate-500 text-lg">Transparent calculations. Official sources. No guesswork.</p>
        </div>

        <div className="space-y-6">

          {/* Mission */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-slate-500 leading-relaxed">
              CalqWise was built on a simple belief: everyone deserves to understand the true cost of their financial decisions — before they sign anything. Banks and lenders show you the number they want you to see. We show you the full picture.
            </p>
            <p className="text-slate-500 leading-relaxed mt-4">
              From mortgage amortization to take-home salary to real rideshare profits, CalqWise gives you accurate, transparent calculations with zero signup required. All processing happens in your browser — we never see your data.
            </p>
          </div>

          {/* Methodology */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-1 text-primary">How Our Calculations Work</h2>
            <p className="text-xs text-slate-400 mb-4">All formulas reference official government and regulatory sources.</p>
            <div className="space-y-5">
              {METHODOLOGY.map(({ title, points }) => (
                <div key={title}>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">{title}</h3>
                  <ul className="space-y-1">
                    {points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                        <span className="shrink-0 text-primary mt-0.5">→</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Official Sources */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-1 text-primary">Official Data Sources</h2>
            <p className="text-xs text-slate-400 mb-4">
              Rates and tax brackets are verified against these primary government sources. We update calculators within 30 days of any official rate change.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OFFICIAL_SOURCES.map(({ name, url, country }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>{country}</span>
                  <span>{name} ↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Update Policy */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">How We Stay Current</h2>
            <ul className="space-y-3">
              {[
                { icon: '📅', title: 'Annual updates', text: 'Tax brackets, FICA limits, and personal allowances are updated every January for the new tax year across all 6 countries.' },
                { icon: '🔔', title: 'Policy changes', text: 'Major regulatory changes (CMHC rate changes, SDLT band revisions, APRA buffer updates) are applied within 30 days of official announcement.' },
                { icon: '✅', title: 'Rate verification', text: 'Mortgage rate defaults are updated quarterly to reflect current market conditions. Users can always override with their own rate.' },
                { icon: '📋', title: 'Transparency', text: 'Every calculator shows the key assumptions used (e.g. "2026 brackets", "CMHC 4.00% for LTV 90–95%"). No hidden parameters.' },
              ].map(({ icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-slate-700">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* What Makes Us Different */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">What Makes Us Different</h2>
            <ul className="space-y-3 text-slate-500">
              {[
                { icon: '🔒', text: 'No account, no data collection — all calculations run locally in your browser. Zero server-side data processing.' },
                { icon: '🌍', text: '6 countries with country-specific rules: CMHC, SDLT, CPP/EI, USC/PRSI, LMI, KiwiSaver — not generic "international" estimates.' },
                { icon: '📱', text: 'Mobile apps on Google Play for Mortgage, Tax, Salary, Auto Loan, and RideProfit.' },
                { icon: '🔄', text: 'Updated annually and after every major regulatory change — never running on stale brackets.' },
                { icon: '💡', text: 'Full component breakdowns, not just totals — see PMI, CMHC, SDLT, Medicare Levy, NI separately.' },
                { icon: '⚡', text: 'Instant results — live calculation as you type, no "Calculate" button needed.' },
              ].map(({ icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <p className="text-sm leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">Countries We Cover</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(countries).map(([code, c]) => (
                <Link
                  key={code}
                  to={`/${code}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="cw-card border-amber-200 bg-amber-50">
            <h2 className="text-xl font-display font-bold mb-4 text-amber-700">Important Disclaimer</h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              CalqWise calculators are provided for informational and educational purposes only. Results are estimates based on the inputs you provide and publicly available rate information. <strong>They do not constitute financial, tax, legal, or investment advice.</strong>
            </p>
            <p className="text-amber-800 text-sm leading-relaxed mt-3">
              Always consult a qualified financial advisor, mortgage broker, tax professional, or legal counsel before making financial decisions. Rates, tax laws, and regulations change frequently — always verify with current official sources (links above).
            </p>
            <p className="text-amber-800 text-sm leading-relaxed mt-3">
              CalqWise is not affiliated with, endorsed by, or connected to any bank, lender, government agency, or financial institution, including the IRS, CRA, HMRC, ATO, Revenue.ie, or IRD New Zealand.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
