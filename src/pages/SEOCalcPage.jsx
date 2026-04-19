import { lazy, Suspense } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { seoPageMap } from '../data/seoPages'
import { CalcFAQ, CalcRelated, CalcSubTopics } from '../components/CalcSEO'
import AdSenseSlot from '../components/AdSenseSlot'

// Calc components keyed by "country/calc"
const calcComponents = {
  'us/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'ca/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'uk/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'au/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'ie/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'nz/mortgage':      lazy(() => import('../calculators/mortgage/MortgageCalc')),
  'us/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'ca/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'uk/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'au/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'ie/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'nz/tax':           lazy(() => import('../calculators/tax/TaxCalc')),
  'us/salary':        lazy(() => import('../calculators/salary/SalaryCalc')),
  'ca/salary':        lazy(() => import('../calculators/salary/SalaryCalc')),
  'uk/salary':        lazy(() => import('../calculators/salary/SalaryCalc')),
  'au/salary':        lazy(() => import('../calculators/salary/SalaryCalc')),
  'us/rideprofit':    lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
  'ca/rideprofit':    lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
  'uk/rideprofit':    lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
  'au/rideprofit':    lazy(() => import('../calculators/rideprofit/RideProfitCalc')),
  'us/affordability': lazy(() => import('../calculators/affordability/AffordabilityCalc')),
  'ca/affordability': lazy(() => import('../calculators/affordability/AffordabilityCalc')),
  'uk/affordability': lazy(() => import('../calculators/affordability/AffordabilityCalc')),
  'us/autoloan':      lazy(() => import('../calculators/autoloan/AutoLoanCalc')),
  'ca/autoloan':      lazy(() => import('../calculators/autoloan/AutoLoanCalc')),
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function SEOCalcPage() {
  const { country, calc, slug } = useParams()
  const { i18n } = useTranslation()
  const pageKey = `${country}/${calc}/${slug}`
  const page = seoPageMap[pageKey]

  if (!page) return <Navigate to={`/${country}/${calc}`} replace />

  const CalcComponent = calcComponents[`${country}/${calc}`]

  return (
    <>
      <Helmet>
        <title>{page.title} | CalqWise</title>
        <meta name="description" content={page.metaDesc} />
        <link rel="canonical" href={`https://calqwise.com/${country}/${calc}/${slug}`} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${page.title} | CalqWise`} />
        <meta property="og:description" content={page.metaDesc} />
        <meta property="og:url" content={`https://calqwise.com/${country}/${calc}/${slug}`} />
        <meta property="og:image" content="https://calqwise.com/og-image.jpg" />
        <meta property="og:site_name" content="CalqWise" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${page.title} | CalqWise`} />
        <meta name="twitter:description" content={page.metaDesc} />
        <meta name="twitter:image" content="https://calqwise.com/og-image.jpg" />
        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'CalqWise', item: 'https://calqwise.com/' },
            { '@type': 'ListItem', position: 2, name: country.toUpperCase(), item: `https://calqwise.com/${country}` },
            { '@type': 'ListItem', position: 3, name: calc.charAt(0).toUpperCase() + calc.slice(1), item: `https://calqwise.com/${country}/${calc}` },
            { '@type': 'ListItem', position: 4, name: page.h1, item: `https://calqwise.com/${country}/${calc}/${slug}` },
          ],
        })}</script>
        {/* Article JSON-LD — signals authoritative content for Google */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: page.h1,
          description: page.metaDesc,
          url: `https://calqwise.com/${country}/${calc}/${slug}`,
          dateModified: '2026-04-19',
          author: { '@type': 'Organization', name: 'CalqWise', url: 'https://calqwise.com' },
          publisher: {
            '@type': 'Organization',
            name: 'CalqWise',
            url: 'https://calqwise.com',
            logo: { '@type': 'ImageObject', url: 'https://calqwise.com/og-image.jpg' },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://calqwise.com/${country}/${calc}/${slug}` },
        })}</script>
      </Helmet>

      {/* SEO Article Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">CalqWise</Link>
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
          {i18n.language !== 'en' && (
            <p className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 mb-3">
              📝 Article content available in English only · Contenu de l'article disponible en anglais seulement
            </p>
          )}
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

      <div className="max-w-7xl mx-auto px-4">
        <AdSenseSlot format="in-article" placement="before-calc" />
      </div>

      {/* Embedded Calculator */}
      {CalcComponent && (
        <Suspense fallback={<LoadingSpinner />}>
          <CalcComponent country={country} embedded={true} />
        </Suspense>
      )}

      {/* FAQ + Related */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <CalcFAQ faqs={page.faqs} />
        <AdSenseSlot format="rectangle" placement="after-faq" />
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
        <AdSenseSlot format="leaderboard" placement="bottom" />
      </div>
    </>
  )
}
