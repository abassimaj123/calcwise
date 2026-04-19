import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const POPULAR = [
  { to: '/us/mortgage', label: 'Mortgage Calculator — US' },
  { to: '/ca/mortgage', label: 'Mortgage Calculator — Canada' },
  { to: '/uk/mortgage', label: 'Mortgage Calculator — UK' },
  { to: '/us/tax',      label: 'Income Tax Calculator — US' },
  { to: '/ca/tax',      label: 'Income Tax Calculator — Canada' },
  { to: '/us/salary',   label: 'Salary Calculator — US' },
]

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>Page Not Found | CalqWise</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
        <div className="text-7xl mb-6">404</div>
        <h1 className="text-3xl font-display font-bold mb-3">{t('notFound.title')}</h1>
        <p className="text-slate-500 mb-8 max-w-md">{t('notFound.desc')}</p>
        <div className="flex gap-4 flex-wrap justify-center mb-12">
          <Link to="/" className="cw-btn">{t('notFound.home')}</Link>
          <Link to="/us/mortgage" className="cw-btn-ghost">{t('notFound.calc')}</Link>
        </div>
        <div className="max-w-md w-full text-left">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 text-center">Popular calculators</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-2 text-sm text-primary hover:underline px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  → {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
