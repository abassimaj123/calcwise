import { useState } from 'react'
import { Link } from 'react-router-dom'
import { countries, calcsByCountry, calcMeta } from '../config/countries'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  return (
    <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/[0.08]">
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
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/[0.08] text-sm font-medium transition-colors"
              >
                <span>{country.flag}</span>
                <span>{code.toUpperCase()}</span>
              </Link>
              {/* Dropdown */}
              {activeDropdown === code && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-dark2 border border-white/10 rounded-card shadow-xl py-2 z-50">
                  {calcsByCountry[code].map(calcKey => (
                    <Link
                      key={calcKey}
                      to={`/${code}/${calcMeta[calcKey]?.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/[0.08] transition-colors"
                    >
                      <span>{calcMeta[calcKey]?.icon}</span>
                      <span>{calcMeta[calcKey]?.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <Link to="/us/mortgage" className="hidden md:block cw-btn text-sm py-2 px-5">
            Try Calculators
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
        <div className="md:hidden bg-dark2 border-t border-white/[0.05] max-h-96 overflow-y-auto">
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
                {calcsByCountry[code].map(calcKey => (
                  <Link
                    key={calcKey}
                    to={`/${code}/${calcMeta[calcKey]?.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-cw-gray hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{calcMeta[calcKey]?.icon}</span>
                    <span>{calcMeta[calcKey]?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
