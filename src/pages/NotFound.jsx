import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-display font-bold mb-4">{t('notFound.title')}</h1>
      <p className="text-slate-500 mb-8">{t('notFound.desc')}</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/" className="cw-btn">{t('notFound.home')}</Link>
        <Link to="/us/mortgage" className="cw-btn-ghost">{t('notFound.calc')}</Link>
      </div>
    </div>
  )
}
