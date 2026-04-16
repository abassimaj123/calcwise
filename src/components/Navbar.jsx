import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, BarChart2 } from 'lucide-react'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'

const ICON_COLOR = '#1A6AFF'
const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'fr', label: 'FR', full: 'Français' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const dropTimer = useRef(null)

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]

  const openDrop  = useCallback((code) => { clearTimeout(dropTimer.current); setActiveDropdown(code) }, [])
  const closeDrop = useCallback(() => { dropTimer.current = setTimeout(() => setActiveDropdown(null), 220) }, [])

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const switchLang = (code) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-display font-bold text-slate-900">
          Calc<span className="text-primary">Wise</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {Object.entries(countries).map(([code, country]) => (
            <div
              key={code}
              className="relative"
              onMouseEnter={() => openDrop(code)}
              onMouseLeave={closeDrop}
            >
              <Link
                to={`/${code}`}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDropdown === code
                    ? 'bg-blue-50 text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {country.name}
                <ChevronDown size={13} className={`ml-1 transition-transform ${activeDropdown === code ? 'rotate-180' : ''}`} />
              </Link>
              {activeDropdown === code && (
                <div
                  className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-xl py-2 z-50"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)', marginTop: '2px' }}
                  onMouseEnter={() => openDrop(code)}
                  onMouseLeave={closeDrop}
                >
                  {calcsByCountry[code].map(calcKey => {
                    const Icon = calcIconMap[calcKey] || BarChart2
                    return (
                      <Link
                        key={calcKey}
                        to={`/${code}/${calcMeta[calcKey]?.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-primary transition-colors"
                      >
                        <Icon size={15} color={ICON_COLOR} />
                        <span>{calcMeta[calcKey]?.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Lang switcher + CTA + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative hidden md:block" ref={langRef}>
            <button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {currentLang.label}
              <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-card-hover py-2 z-50">
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => switchLang(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      lang.code === i18n.language
                        ? 'text-primary font-semibold bg-primary-light'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {lang.full}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/us/mortgage" className="hidden md:block cw-btn text-sm">
            {t('nav.getApp')}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 text-lg"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto">
          {/* Mobile language switcher */}
          <div className="flex gap-2 px-4 py-3 border-b border-slate-100">
            {LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  lang.code === i18n.language
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          {Object.entries(countries).map(([code, country]) => (
            <div key={code}>
              <Link
                to={`/${code}`}
                className="flex items-center gap-2 px-4 py-3 font-semibold text-slate-900 border-b border-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded">{code.toUpperCase()}</span>
                <span>{country.name}</span>
              </Link>
              <div className="pl-4">
                {calcsByCountry[code].map(calcKey => {
                  const Icon = calcIconMap[calcKey] || BarChart2
                  return (
                    <Link
                      key={calcKey}
                      to={`/${code}/${calcMeta[calcKey]?.slug}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-500 hover:text-slate-900"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={15} color={ICON_COLOR} />
                      <span>{calcMeta[calcKey]?.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
