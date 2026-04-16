import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'
import AdSenseSlot from '../components/AdSenseSlot'

const ICON_COLOR = '#1A6AFF'

export default function CountryHub({ country }) {
  const c = countries[country]
  const calcs = calcsByCountry[country] || []
  const currencyLabel = c.currency === 'GBP' ? 'GBP · £' : `${c.currency} · ${c.symbol}`

  return (
    <>
      <Helmet>
        <title>{c.name} Financial Calculators 2026 | CalcWise</title>
        <meta name="description" content={`Free financial calculators for ${c.name}: mortgage, tax, salary, auto loan and more. Accurate 2026 rates.`} />
        <link rel="canonical" href={`https://calqwise.com/${country}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{c.flag}</div>
          <h1 className="text-4xl font-display font-bold mb-3">
            {c.name} Financial Calculators
          </h1>
          <p className="text-cw-gray text-lg">
            {calcs.length} free calculators — all updated for 2026
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calcs.map(calcKey => {
            const m = calcMeta[calcKey]
            const Icon = calcIconMap[calcKey] || BarChart2
            return (
              <Link
                key={calcKey}
                to={`/${country}/${m.slug}`}
                className="cw-card hover:border-primary/40 hover:bg-primary/5 transition-all group flex items-center gap-4"
              >
                <div className="shrink-0">
                  <Icon size={24} color={ICON_COLOR} />
                </div>
                <div>
                  <h2 className="font-semibold group-hover:text-primary transition-colors">{m.label}</h2>
                  <p className="text-xs text-cw-gray">{currencyLabel} · Updated 2026</p>
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
