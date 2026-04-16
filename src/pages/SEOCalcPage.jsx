import { lazy, Suspense } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { seoPageMap } from '../data/seoPages'
import { CalcFAQ, CalcRelated, CalcSubTopics } from '../components/CalcSEO'

// Calc components keyed by "country/calc"
const calcComponents = {
  'us/mortgage':    lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'ca/mortgage':    lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'uk/mortgage':    lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'au/mortgage':    lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'us/tax':         lazy(() => import('../calculators/tax/TaxCalc')),
  'ca/tax':         lazy(() => import('../calculators/tax/TaxCalc')),
  'us/rideprofit':  lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
  'ca/rideprofit':  lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function SEOCalcPage() {
  const { country, calc, slug } = useParams()
  const pageKey = `${country}/${calc}/${slug}`
  const page = seoPageMap[pageKey]

  if (!page) return <Navigate to={`/${country}/${calc}`} replace />

  const CalcComponent = calcComponents[`${country}/${calc}`]

  return (
    <>
      <Helmet>
        <title>{page.title} | CalcWise</title>
        <meta name="description" content={page.metaDesc} />
        <link rel="canonical" href={`https://calqwise.com/${country}/${calc}/${slug}`} />
      </Helmet>

      {/* SEO Article Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">CalcWise</Link>
          <span>/</span>
          <Link to={`/${country}`} className="hover:text-primary transition-colors capitalize">{country.toUpperCase()}</Link>
          <span>/</span>
          <Link to={page.parentCalc} className="hover:text-primary transition-colors capitalize">{calc}</Link>
          <span>/</span>
          <span className="text-slate-600">{slug.replace(/-/g, ' ')}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-tight mb-3">
          {page.h1}
        </h1>

        {/* Intro paragraphs */}
        <div className="max-w-3xl">
          {page.intro.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{para.trim()}</p>
          ))}
        </div>

        {/* Sub-page topic links if there are siblings */}
        {page.relatedSubPages && page.relatedSubPages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            <span className="text-xs text-slate-400 self-center">Related topics:</span>
            {page.relatedSubPages.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs bg-blue-50 border border-blue-200 hover:border-primary hover:text-primary rounded-full px-3 py-1 text-slate-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Calculator */}
      {CalcComponent && (
        <Suspense fallback={<LoadingSpinner />}>
          <CalcComponent country={country} />
        </Suspense>
      )}

      {/* FAQ + Related */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <CalcFAQ faqs={page.faqs} />
        {page.relatedCalcs && page.relatedCalcs.length > 0 && (
          <CalcRelated links={page.relatedCalcs} />
        )}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            to={page.parentCalc}
            className="text-sm text-primary hover:underline font-medium"
          >
            ← Back to full {calc} calculator
          </Link>
        </div>
      </div>
    </>
  )
}
