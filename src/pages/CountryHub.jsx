import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BarChart2, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'
import AdSenseSlot from '../components/AdSenseSlot'
import CountryFlag from '../components/CountryFlag'

const ICON_COLOR = '#1A6AFF'

// Brief financial context per country — adds E-E-A-T signal and non-thin content
const countryContext = {
  us: 'The United States has a complex federal + state tax system with 50 different state income tax regimes, FICA (Social Security + Medicare), and some of the most detailed mortgage rules in the world — including PMI, conforming loan limits set by FHFA, and FHA/VA programs. Our US calculators apply current IRS brackets, all 50 state rates, and 2026 FICA limits.',
  ca: 'Canada operates a federal + provincial/territorial tax system across 13 jurisdictions. CMHC mortgage insurance is mandatory for down payments under 20%, and all mortgages must pass the OSFI B-20 stress test. CPP and EI contributions are calculated per CRA annual limits. Our Canadian calculators apply 2026 CRA federal brackets, all provincial rates, and current CMHC premium tables.',
  uk: 'The United Kingdom uses a PAYE (Pay As You Earn) system with HMRC-defined bands and National Insurance Class 1 contributions. Stamp Duty Land Tax (SDLT) applies to property purchases, including a 3% surcharge for second homes. The 2026/27 tax year rates apply across all our UK calculators, including the standard personal allowance of £12,570.',
  au: 'Australia\'s tax year runs July–June. Income is taxed under ATO progressive rates with a 2% Medicare Levy. APRA requires a 3% serviceability buffer on all mortgage applications. Lenders Mortgage Insurance (LMI) applies for deposits below 20%. Superannuation (11.5% employer contribution in 2025/26) is factored into all salary and retirement calculations.',
  ie: 'Ireland uses a two-rate system (Standard Rate 20%, Higher Rate 40%) plus USC (Universal Social Charge) and PRSI contributions. The Central Bank of Ireland enforces a 3.5× income lending cap for mortgages with LTV limits for first-time and second buyers. Our Irish calculators apply 2026 Revenue.ie rates and Central Bank macro-prudential rules.',
  nz: 'New Zealand uses IRD PAYE rates with no capital gains tax. The ACC earners\' levy (1.33% for 2025/26) applies to all employment income. The RBNZ enforces LVR (Loan-to-Value Ratio) restrictions and DTI caps for mortgage lending. KiwiSaver contributions (3%–10%) are integrated into all NZ salary and retirement calculations.',
}

// Short descriptions for each calc type to show on cards
const calcDescriptions = {
  mortgage:       'Monthly payment, amortization & full cost breakdown.',
  tax:            'Income tax, effective rate & take-home pay.',
  autoloan:       'Monthly repayment, total interest & loan schedule.',
  'rent-vs-buy':  'Compare renting vs buying over any time horizon.',
  salary:         'Gross-to-net: hourly, weekly, monthly & annual.',
  rideprofit:     'True profit for rideshare & delivery drivers.',
  'loan-payoff':  'Payoff date, interest saved & extra payment impact.',
  'credit-card':  'Minimum payment, interest cost & payoff strategy.',
  heloc:          'Home equity line draw & repayment calculator.',
  'student-loan': 'Repayment plan comparison & interest totals.',
  'property-roi': 'Rental yield, cap rate & return on investment.',
  refinance:      'Break-even point & lifetime savings from refinancing.',
  affordability:  'Max purchase price based on income & DTI rules.',
  'stamp-duty':   'SDLT / stamp duty land tax estimate.',
}

// First 3 calcKeys in a country list get a "Popular" badge
const POPULAR_COUNT = 3

export default function CountryHub({ country }) {
  const { t } = useTranslation()
  const c = countries[country]
  const calcs = calcsByCountry[country] || []
  const currencyDisplay = `${c.symbol} ${c.currency}`

  return (
    <>
      <Helmet>
        <title>{c.name} Financial Calculators 2026 | CalqWise</title>
        <meta
          name="description"
          content={`Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`}
        />
        <link rel="canonical" href={`https://calqwise.com/${country}`} />
        <link rel="alternate" hreflang="en" href={`https://calqwise.com/${country}`} />
        <link rel="alternate" hreflang="x-default" href={`https://calqwise.com/${country}`} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${c.name} Financial Calculators 2026 | CalqWise`} />
        <meta property="og:description" content={`Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`} />
        <meta property="og:url" content={`https://calqwise.com/${country}`} />
        <meta property="og:image" content="https://calqwise.com/og-image.svg" />
        <meta property="og:image:alt" content={`${c.name} Financial Calculators — CalqWise`} />
        <meta property="og:site_name" content="CalqWise" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${c.name} Financial Calculators 2026 | CalqWise`} />
        <meta name="twitter:description" content={`Free financial calculators for ${c.name}: mortgage, tax, salary and more.`} />
        <meta name="twitter:image" content="https://calqwise.com/og-image.svg" />
        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'CalqWise', item: 'https://calqwise.com/' },
            { '@type': 'ListItem', position: 2, name: `${c.name} Calculators`, item: `https://calqwise.com/${country}` },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${c.name} Financial Calculators 2026`,
          description: `Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`,
          url: `https://calqwise.com/${country}`,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${c.name} Financial Calculators`,
          url: `https://calqwise.com/${country}`,
          numberOfItems: calcs.length,
          itemListElement: calcs.map((calcKey, idx) => {
            const m = calcMeta[calcKey]
            return {
              '@type': 'ListItem',
              position: idx + 1,
              name: m?.label ?? calcKey,
              url: `https://calqwise.com/${country}/${m?.slug ?? calcKey}`,
            }
          }),
        })}</script>
      </Helmet>

      {/* ── Hero header ── */}
      <section
        className="w-full px-4 pt-16 pb-12 text-center"
        style={{ background: 'linear-gradient(160deg, #F0F6FF 0%, #FAFCFF 60%, #F5F9FF 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-5">
            <CountryFlag code={country} size="xl" />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3 leading-tight">
            {c.name}{' '}
            <span className="text-primary">{t('countryHub.financialCalcs')}</span>
          </h1>

          <p className="text-slate-500 text-lg mb-6">
            {calcs.length} {t('countryHub.subtitle')}
          </p>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="cw-badge blue">Currency: {currencyDisplay}</span>
            <span className="cw-badge blue">Updated 2026</span>
            <span className="cw-badge green">100% Free</span>
          </div>
        </div>
      </section>

      {/* ── Country context ── */}
      {countryContext[country] && (
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
          <p className="text-sm text-slate-500 leading-relaxed">{countryContext[country]}</p>
        </div>
      )}

      {/* ── Ad between context and grid ── */}
      <div className="max-w-3xl mx-auto px-4">
        <AdSenseSlot format="rectangle" placement="in-content" />
      </div>

      {/* ── Calc grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calcs.map((calcKey, idx) => {
            const m = calcMeta[calcKey]
            if (!m) return null
            const Icon = calcIconMap[calcKey] || BarChart2
            const isPopular = idx < POPULAR_COUNT
            const shortDesc = calcDescriptions[calcKey] || t('countryHub.updated')

            return (
              <Link key={calcKey} to={`/${country}/${m.slug}`} className="cw-calc-card group">
                <div className="cw-calc-card-icon group-hover:bg-blue-100 transition-colors">
                  <Icon size={20} color={ICON_COLOR} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {m.label}
                    </h3>
                    {isPopular && (
                      <span className="cw-badge blue" style={{ fontSize: '0.6rem' }}>
                        ★ Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{shortDesc}</p>
                </div>

                <ChevronRight
                  size={15}
                  className="shrink-0 mt-0.5 text-slate-300 group-hover:text-primary transition-colors"
                />
              </Link>
            )
          })}
        </div>

        <AdSenseSlot format="leaderboard" className="mt-12" />
      </div>
    </>
  )
}
