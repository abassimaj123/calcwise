import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const BASE = 'https://calqwise.com'

const CALCS = [
  // Mortgage
  { id: 'us/mortgage',  label: 'Mortgage Calculator — US',  category: 'Mortgage' },
  { id: 'ca/mortgage',  label: 'Mortgage Calculator — Canada', category: 'Mortgage' },
  { id: 'uk/mortgage',  label: 'Mortgage Calculator — UK',  category: 'Mortgage' },
  { id: 'au/mortgage',  label: 'Mortgage Calculator — Australia', category: 'Mortgage' },
  { id: 'ie/mortgage',  label: 'Mortgage Calculator — Ireland', category: 'Mortgage' },
  { id: 'nz/mortgage',  label: 'Mortgage Calculator — NZ',  category: 'Mortgage' },
  // Tax
  { id: 'us/tax',       label: 'Income Tax Calculator — US', category: 'Tax & Salary' },
  { id: 'ca/tax',       label: 'Income Tax Calculator — Canada', category: 'Tax & Salary' },
  { id: 'uk/tax',       label: 'Income Tax Calculator — UK', category: 'Tax & Salary' },
  { id: 'au/tax',       label: 'Income Tax Calculator — Australia', category: 'Tax & Salary' },
  // Salary
  { id: 'us/salary',    label: 'Salary Calculator — US',    category: 'Tax & Salary' },
  { id: 'ca/salary',    label: 'Salary Calculator — Canada', category: 'Tax & Salary' },
  { id: 'uk/salary',    label: 'Salary Calculator — UK',    category: 'Tax & Salary' },
  { id: 'au/salary',    label: 'Salary Calculator — Australia', category: 'Tax & Salary' },
  // Auto Loan
  { id: 'us/autoloan',  label: 'Auto Loan Calculator — US', category: 'Other' },
  { id: 'ca/autoloan',  label: 'Auto Loan Calculator — Canada', category: 'Other' },
  { id: 'uk/autoloan',  label: 'Auto Loan Calculator — UK', category: 'Other' },
  // Affordability
  { id: 'us/affordability', label: 'Affordability Calculator — US', category: 'Other' },
  { id: 'ca/affordability', label: 'Affordability Calculator — Canada', category: 'Other' },
  { id: 'uk/affordability', label: 'Affordability Calculator — UK', category: 'Other' },
  // RideProfit
  { id: 'us/rideprofit', label: 'RideProfit Calculator — US', category: 'Other' },
  { id: 'ca/rideprofit', label: 'RideProfit Calculator — Canada', category: 'Other' },
]

const CATEGORIES = ['Mortgage', 'Tax & Salary', 'Other']

function EmbedCard({ calc }) {
  const [copied, setCopied] = useState(false)
  const url = `${BASE}/${calc.id}`
  const iframeCode = `<iframe\n  src="${url}"\n  width="100%"\n  height="720"\n  frameborder="0"\n  style="border-radius:12px;max-width:900px"\n  title="${calc.label}"\n  loading="lazy"\n></iframe>`

  function handleCopy() {
    navigator.clipboard.writeText(iframeCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="cw-card">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-800">{calc.label}</h3>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            {url} ↗
          </a>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={copied
            ? { background: '#dcfce7', borderColor: '#86efac', color: '#15803d' }
            : { background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' }
          }
        >
          {copied ? '✓ Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="bg-slate-950 text-slate-300 text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {iframeCode}
      </pre>
    </div>
  )
}

export default function Embed() {
  const [activeCategory, setActiveCategory] = useState('Mortgage')

  const filtered = CALCS.filter(c => c.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>Embed CalqWise Calculators — Free Iframe Widget</title>
        <meta name="description" content="Embed any CalqWise calculator on your website for free. Copy the iframe code for mortgage, tax, salary, auto loan, and more — 6 countries covered." />
        <link rel="canonical" href="https://calqwise.com/embed" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Embed CalqWise Calculators — Free Iframe Widget" />
        <meta property="og:description" content="Add a free financial calculator to your website in seconds. Mortgage, tax, salary, auto loan — US, CA, UK, AU, IE, NZ." />
        <meta property="og:url" content="https://calqwise.com/embed" />
        <meta property="og:site_name" content="CalqWise" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold mb-4">Embed a Calculator</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Add any CalqWise calculator to your blog, website, or app — completely free.
            Copy the iframe code below and paste it into your HTML.
          </p>
        </div>

        {/* How it works */}
        <div className="cw-card mb-8">
          <h2 className="font-display font-bold text-base mb-4 text-primary">How it works</h2>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span>Choose the calculator you want to embed from the list below.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span>Click <strong>Copy code</strong> to copy the iframe snippet to your clipboard.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span>Paste the snippet into your website HTML, WordPress post, or CMS page editor.</span>
            </li>
          </ol>
          <p className="mt-4 text-xs text-slate-400">
            No API key, no sign-up, and no attribution required — though a link back to CalqWise is always appreciated.
            All calculations happen in your visitor's browser; no user data is sent to our servers.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={activeCategory === cat
                ? { background: 'var(--color-primary, #3b82f6)', color: '#fff' }
                : { background: '#f1f5f9', color: '#64748b' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Calc cards */}
        <div className="space-y-4">
          {filtered.map(calc => (
            <EmbedCard key={calc.id} calc={calc} />
          ))}
        </div>

        {/* Notes */}
        <div className="mt-8 cw-card border-amber-200 bg-amber-50">
          <h2 className="font-semibold text-sm text-amber-800 mb-2">Usage notes</h2>
          <ul className="text-xs text-amber-700 space-y-1.5">
            <li>• The recommended minimum iframe width is <strong>360px</strong>. Below this, some UI elements may not display correctly on very narrow embeds.</li>
            <li>• Set <strong>height="720"</strong> for mortgage and tax calculators; <strong>height="600"</strong> works well for simpler tools. Adjust to taste.</li>
            <li>• The calculators are updated automatically — you never need to update the embed code when we release new features.</li>
            <li>• For commercial embedding at scale or co-branded white-label versions, please <a href="/contact" className="underline">contact us</a>.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
