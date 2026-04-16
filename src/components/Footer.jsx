import { Link } from 'react-router-dom'
import { countries } from '../config/countries'

export default function Footer() {
  return (
    <footer className="bg-dark2 border-t border-white/[0.08] mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-4">
              Calc<span className="text-primary">Wise</span>
            </h3>
            <p className="text-sm text-cw-gray">
              Free financial calculators for 6 countries. What your bank doesn't show you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Countries</h4>
            <ul className="space-y-2">
              {Object.entries(countries).map(([code, c]) => (
                <li key={code}>
                  <Link to={`/${code}`} className="text-sm text-cw-gray hover:text-white">
                    {c.flag} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Top Calculators</h4>
            <ul className="space-y-2 text-sm text-cw-gray">
              <li><Link to="/us/mortgage" className="hover:text-white">🏠 Mortgage US</Link></li>
              <li><Link to="/ca/mortgage" className="hover:text-white">🏠 Mortgage CA</Link></li>
              <li><Link to="/uk/mortgage" className="hover:text-white">🏠 Mortgage UK</Link></li>
              <li><Link to="/us/tax" className="hover:text-white">📊 Tax US</Link></li>
              <li><Link to="/ca/tax" className="hover:text-white">📊 Tax CA</Link></li>
              <li><Link to="/us/salary" className="hover:text-white">💰 Salary US</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-cw-gray">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cw-gray">© 2026 CalcWise. For informational purposes only. Not financial advice.</p>
          <p className="text-xs text-cw-gray">Covering US · CA · UK · AU · IE · NZ</p>
        </div>
      </div>
    </footer>
  )
}
