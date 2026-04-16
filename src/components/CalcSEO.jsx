import { Link } from 'react-router-dom'

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
  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h3 className="font-display font-bold text-lg mb-5 text-slate-900">Frequently Asked Questions</h3>
      <div className="space-y-5">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <p className="font-semibold text-sm text-slate-900 mb-1">{q}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CalcAlsoAvailable({ calcSlug, countries }) {
  return (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
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

export function CalcRelated({ links }) {
  return (
    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
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
