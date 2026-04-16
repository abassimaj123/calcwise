import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { countries } from '../config/countries'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About CalcWise — Free Financial Calculators</title>
        <meta name="description" content="CalcWise provides free, accurate financial calculators for US, Canada, UK, Australia, Ireland and New Zealand. Our mission: transparency in personal finance." />
        <link rel="canonical" href="https://calqwise.com/about" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">About CalcWise</h1>
          <p className="text-cw-gray text-lg">Financial clarity for everyone, everywhere.</p>
        </div>

        <div className="space-y-8">
          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-cw-gray leading-relaxed">
              CalcWise was built on a simple belief: everyone deserves to understand the true cost of their financial decisions — before they sign anything. Banks and lenders show you the number they want you to see. We show you the full picture.
            </p>
            <p className="text-cw-gray leading-relaxed mt-4">
              From mortgage amortization to take-home salary to real rideshare profits, CalcWise gives you accurate, transparent calculations with zero signup required. All processing happens in your browser — we never see your data.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">Countries We Cover</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(countries).map(([code, c]) => (
                <Link
                  key={code}
                  to={`/${code}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-cw-gray">{c.currency}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">What Makes Us Different</h2>
            <ul className="space-y-3 text-cw-gray">
              {[
                { icon: '🔒', text: 'No account, no data collection — all calculations run locally in your browser' },
                { icon: '🌍', text: '6 countries with country-specific rules: CMHC, SDLT, CPP, USC, LMI and more' },
                { icon: '📱', text: 'Mobile apps available for Mortgage, Tax, Auto Loan and more (Google Play)' },
                { icon: '🔄', text: 'Updated regularly for the latest tax brackets, rates and regulations' },
                { icon: '💡', text: 'Detailed breakdowns, not just totals — understand every component' },
                { icon: '⚡', text: 'Instant results — no "calculate" button needed, updates as you type' },
              ].map(({ icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{icon}</span>
                  <p className="text-sm leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-display font-bold mb-4 text-primary">Disclaimer</h2>
            <p className="text-cw-gray text-sm leading-relaxed">
              CalcWise calculators are provided for informational and educational purposes only. Results are estimates based on the inputs you provide and publicly available rate information. They do not constitute financial, tax, legal or investment advice.
            </p>
            <p className="text-cw-gray text-sm leading-relaxed mt-3">
              Always consult a qualified financial advisor, mortgage broker, tax professional or legal counsel before making financial decisions. Rates, tax laws and regulations change frequently — always verify with current official sources.
            </p>
            <p className="text-cw-gray text-sm leading-relaxed mt-3">
              CalcWise is not affiliated with, endorsed by, or connected to any bank, lender, government agency, or financial institution.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
