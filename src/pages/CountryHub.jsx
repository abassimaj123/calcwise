import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BarChart2, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'
import AdSenseSlot from '../components/AdSenseSlot'
import CountryFlag from '../components/CountryFlag'

const ICON_COLOR = '#1A6AFF'

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
        <title>{c.name} Financial Calculators 2026 | CalcWise</title>
        <meta
          name="description"
          content={`Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`}
        />
        <link rel="canonical" href={`https://calqwise.com/${country}`} />
        {country === 'ca' && (
          <link rel="alternate" hreflang="fr-ca" href={`https://calqwise.com/ca`} />
        )}
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
                    <h2 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {m.label}
                    </h2>
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
