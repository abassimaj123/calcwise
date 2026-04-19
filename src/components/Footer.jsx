import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, BarChart2, DollarSign } from 'lucide-react'
import { countries } from '../config/countries'

const ICON_COLOR = '#94A3B8'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-800 mt-16 py-12" style={{ background: '#0F172A' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-white">
              Calc<span className="text-primary">Wise</span>
            </h3>
            <p className="text-sm text-slate-400">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-slate-300">{t('footer.countries')}</h4>
            <ul className="space-y-2">
              {Object.entries(countries).map(([code, c]) => (
                <li key={code}>
                  <Link to={`/${code}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-slate-300">{t('footer.topCalcs')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/us/mortgage" className="hover:text-white transition-colors flex items-center gap-2"><Home size={13} color={ICON_COLOR} /> Mortgage US</Link></li>
              <li><Link to="/ca/mortgage" className="hover:text-white transition-colors flex items-center gap-2"><Home size={13} color={ICON_COLOR} /> Mortgage CA</Link></li>
              <li><Link to="/uk/mortgage" className="hover:text-white transition-colors flex items-center gap-2"><Home size={13} color={ICON_COLOR} /> Mortgage UK</Link></li>
              <li><Link to="/us/tax"      className="hover:text-white transition-colors flex items-center gap-2"><BarChart2 size={13} color={ICON_COLOR} /> Tax US</Link></li>
              <li><Link to="/ca/tax"      className="hover:text-white transition-colors flex items-center gap-2"><BarChart2 size={13} color={ICON_COLOR} /> Tax CA</Link></li>
              <li><Link to="/uk/tax"      className="hover:text-white transition-colors flex items-center gap-2"><BarChart2 size={13} color={ICON_COLOR} /> Tax UK</Link></li>
              <li><Link to="/us/salary"   className="hover:text-white transition-colors flex items-center gap-2"><DollarSign size={13} color={ICON_COLOR} /> Salary US</Link></li>
              <li><Link to="/uk/salary"   className="hover:text-white transition-colors flex items-center gap-2"><DollarSign size={13} color={ICON_COLOR} /> Salary UK</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-slate-300">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/ca/mortgage/cmhc-insurance" className="hover:text-white transition-colors">CMHC Insurance Guide</Link></li>
              <li><Link to="/ca/mortgage/stress-test"    className="hover:text-white transition-colors">CA Stress Test</Link></li>
              <li><Link to="/us/tax/california"          className="hover:text-white transition-colors">California Tax</Link></li>
              <li><Link to="/us/tax/new-york"            className="hover:text-white transition-colors">New York Tax</Link></li>
              <li><Link to="/uk/mortgage/buy-to-let"     className="hover:text-white transition-colors">Buy-to-Let UK</Link></li>
              <li><Link to="/embed"   className="hover:text-white transition-colors">Embed a Calculator</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/about"   className="hover:text-white transition-colors">About & Methodology</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 CalqWise. {t('footer.disclaimer')}</p>
          <p className="text-xs text-slate-500">{t('footer.covering')}</p>
        </div>
      </div>
    </footer>
  )
}
