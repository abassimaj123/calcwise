import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import AdSenseSlot from '../components/AdSenseSlot'

export default function CountryHub({ country }) {
  const c = countries[country]
  const calcs = calcsByCountry[country] || []

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
            return (
              <Link
                key={calcKey}
                to={`/${country}/${m.slug}`}
                className="cw-card hover:border-primary/40 hover:bg-primary/5 transition-all group flex items-center gap-4"
              >
                <div className="text-4xl">{m.icon}</div>
                <div>
                  <h2 className="font-semibold group-hover:text-primary transition-colors">{m.label}</h2>
                  <p className="text-xs text-cw-gray">{c.currency} · Updated 2026</p>
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
