import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, BarChart2 } from 'lucide-react'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'

const ICON_COLOR = '#1A6AFF'
const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'fr', label: 'FR', full: 'Français' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]

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
    <nav className="sticky top-0 z-50 bg-dark2/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-display font-bold">
          Calc<span className="text-primary">Wise</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {Object.entries(countries).map(([code, country]) => (
            <div
              key={code}
              className="relative"
              onMouseEnter={() => setActiveDropdown(code)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={`/${code}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/[0.08] text-sm font-medium transition-colors"
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span>{code.toUpperCase()}</span>
              </Link>
              {activeDropdown === code && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-dark2 border border-border-subtle rounded-card shadow-xl py-2 z-50">
                  {calcsByCountry[code].map(calcKey => {
                    const Icon = calcIconMap[calcKey] || BarChart2
                    return (
                      <Link
                        key={calcKey}
                        to={`/${code}/${calcMeta[calcKey]?.slug}`}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/[0.08] transition-colors"
                      >
                        <Icon size={16} color={ICON_COLOR} />
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
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/[0.08] text-sm font-medium transition-colors text-cw-gray hover:text-white"
            >
              {currentLang.label}
              <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-dark2 border border-border-subtle rounded-card shadow-xl py-2 z-50">
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => switchLang(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/[0.08] transition-colors ${
                      lang.code === i18n.language ? 'text-primary' : 'text-cw-gray hover:text-white'
                    }`}
                  >
                    {lang.full}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/us/mortgage" className="hidden md:block cw-btn text-sm py-2 px-5">
            {t('nav.getApp')}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.08] text-white text-lg"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark2 border-t border-border-subtle max-h-[80vh] overflow-y-auto">
          {/* Mobile language switcher */}
          <div className="flex gap-2 px-4 py-3 border-b border-white/[0.05]">
            {LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  lang.code === i18n.language
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-cw-gray hover:text-white'
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
                className="flex items-center gap-2 px-4 py-3 font-semibold border-b border-white/[0.05]"
                onClick={() => setMobileOpen(false)}
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </Link>
              <div className="pl-4">
                {calcsByCountry[code].map(calcKey => {
                  const Icon = calcIconMap[calcKey] || BarChart2
                  return (
                    <Link
                      key={calcKey}
                      to={`/${code}/${calcMeta[calcKey]?.slug}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-cw-gray hover:text-white"
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
