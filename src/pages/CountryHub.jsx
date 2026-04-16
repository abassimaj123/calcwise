import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'
import AdSenseSlot from '../components/AdSenseSlot'

const ICON_COLOR = '#1A6AFF'

export default function CountryHub({ country }) {
  const { t } = useTranslation()
  const c = countries[country]
  const calcs = calcsByCountry[country] || []
  const currencyLabel = c.currency === 'GBP' ? 'GBP · £' : `${c.currency} · ${c.symbol}`

  return (
    <>
      <Helmet>
        <title>{c.name} Financial Calculators 2026 | CalcWise</title>
        <meta name="description" content={`Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}`} />
        {country === 'ca' && <link rel="alternate" hreflang="fr-ca" href={`https://calqwise.com/ca`} />}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{c.flag}</div>
          <h1 className="text-4xl font-display font-bold mb-3 text-slate-900">
            {c.name} {t('countryHub.financialCalcs')}
          </h1>
          <p className="text-slate-500 text-lg">
            {calcs.length} {t('countryHub.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {calcs.map(calcKey => {
            const m = calcMeta[calcKey]
            if (!m) return null
            const Icon = calcIconMap[calcKey] || BarChart2
            return (
              <Link
                key={calcKey}
                to={`/${country}/${m.slug}`}
                className="bg-white border border-slate-200 hover:border-primary hover:shadow-card-hover rounded-xl p-5 transition-all group flex items-center gap-4"
              >
                <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                  <Icon size={22} color={ICON_COLOR} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{m.label}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{currencyLabel} · {t('countryHub.updated')}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <AdSenseSlot format="leaderboard" className="mt-12" />
      </div>
    </>
  )
}
