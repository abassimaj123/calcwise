import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'
import { countries } from '../config/countries'

const BASE_URL = 'https://calqwise.com'
const OG_IMAGE = `${BASE_URL}/og-image.svg`

/**
 * Drop-in replacement for the <Helmet> block in every calculator page.
 * Emits: title, meta description, canonical, OG tags, Twitter card,
 * and a BreadcrumbList JSON-LD — all from a single component call.
 *
 * Usage:
 *   <CalcPageMeta country="ca" slug="mortgage" title={pageTitle} description={pageDesc} />
 *
 * Extra schemas (e.g. SoftwareApplication) can still be added via a
 * separate <Helmet> block after this component.
 */
export function CalcPageMeta({ country, slug, title, description, embedded = false }) {
  if (embedded) return null
  const c = countries[country]
  const countryName = c?.name ?? country.toUpperCase()
  const url = `${BASE_URL}/${country}/${slug}`

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'CalqWise', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: `${countryName} Calculators`, item: `${BASE_URL}/${country}` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="CalqWise" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {/* Breadcrumb */}
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
    </Helmet>
  )
}

export function CalcIntro({ intro, hiddenCost }) {
  return (
    <div className="mb-6 p-5 bg-white border border-slate-200 rounded-xl" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <p className="text-sm text-slate-600 leading-relaxed">{intro}</p>
      {hiddenCost && (
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs text-primary font-medium">
          💡 Hidden cost revealed: {hiddenCost}
        </div>
      )}
    </div>
  )
}

export function CalcFAQ({ faqs }) {
  const [open, setOpen] = useState(null)
  if (!faqs || !faqs.length) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="px-6 pt-4 pb-2">
          <h2 className="font-display font-bold text-lg text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="px-6 pb-4 space-y-1">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border border-slate-100 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-sm text-slate-800 pr-4">{q}</span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-3 bg-slate-50 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed pt-3">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function CalcAlsoAvailable({ calcSlug, countries }) {
  return (
    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Also available for</p>
      <div className="flex flex-wrap gap-2">
        {countries.map(({ code, flag, name }) => (
          <Link
            key={code}
            to={`/${code}/${calcSlug}`}
            className="text-xs bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-full px-3 py-1 text-slate-600 transition-colors"
          >
            {flag} {name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CalcHowTo({ title, steps }) {
  if (!steps || !steps.length) return null
  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="px-6 pt-6 pb-4">
        <h2 className="font-display font-bold text-lg text-slate-900 mb-3">{title || 'How to use this calculator'}</h2>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function CalcSubTopics({ links }) {
  if (!links || !links.length) return null
  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
      <p className="text-xs text-primary mb-2 font-bold uppercase tracking-wider">Explore specific topics</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-xs bg-white border border-blue-200 hover:border-primary hover:text-primary hover:bg-white rounded-full px-3 py-1.5 text-slate-700 font-medium transition-colors"
          >
            → {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CalcFeatures({ features }) {
  if (!features || !features.length) return null
  return (
    <div className="mt-2 bg-white border border-slate-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="px-6 pt-4 pb-2">
        <h2 className="font-display font-bold text-base text-slate-900">What's included</h2>
      </div>
      <ul className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
            <span className="shrink-0 text-primary mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CalcRelated({ links }) {
  return (
    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Related Calculators</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-xs bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-full px-3 py-1 text-slate-600 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
