import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home as HomeIcon, BarChart2, Car, DollarSign, Navigation, CheckCircle } from 'lucide-react'
import { countries, calcsByCountry } from '../config/countries'
import AdSenseSlot from '../components/AdSenseSlot'

const ICON_COLOR = '#1A6AFF'

const featuredCalcs = [
  { to: '/us/mortgage', Icon: HomeIcon,   title: 'Mortgage Calculator US', desc: 'Monthly payment with PMI, property tax, amortization schedule.' },
  { to: '/ca/mortgage', Icon: HomeIcon,   title: 'Mortgage Calculator CA', desc: 'CMHC insurance, stress test rate, bi-weekly payments.' },
  { to: '/uk/mortgage', Icon: HomeIcon,   title: 'Mortgage Calculator UK', desc: 'SDLT, LTV ratio, FCA stress test, repayment & interest-only.' },
  { to: '/us/tax',      Icon: BarChart2,  title: 'Tax Calculator US',      desc: 'Federal + state tax, FICA, effective rate. All 50 states.' },
  { to: '/ca/tax',      Icon: BarChart2,  title: 'Tax Calculator CA',      desc: 'Federal + provincial tax, CPP & EI contributions.' },
  { to: '/us/salary',   Icon: DollarSign, title: 'Salary Calculator US',   desc: 'Gross to net, hourly/weekly/monthly/annual breakdown.' },
  { to: '/ca/rideprofit', Icon: Car,      title: 'RideProfit CA',          desc: 'Real profit for Uber/DoorDash drivers. CRA $0.72/km deduction.' },
  { to: '/uk/rideprofit', Icon: Car,      title: 'RideProfit UK',          desc: 'HMRC 45p/mi mileage deduction. True hourly earnings.' },
  { to: '/us/affordability', Icon: CheckCircle, title: 'Affordability Calculator', desc: 'How much home can you afford? DTI rules, FHA/VA/Conv.' },
]

export default function Home() {
  const { t } = useTranslation()

  const stats = [
    { value: '47+',  label: t('stats.calculators') },
    { value: '6',    label: t('stats.countries') },
    { value: '2026', label: t('stats.taxRates') },
    { value: t('stats.noSignup'), label: '' },
  ]

  return (
    <>
      <Helmet>
        <title>CalcWise — Free Financial Calculators for US, CA, UK, AU, IE, NZ</title>
        <meta name="description" content="Free mortgage, tax, salary, auto loan and more calculators for US, Canada, UK, Australia, Ireland and New Zealand. Accurate 2026 rates. No signup required." />
        <link rel="canonical" href="https://calqwise.com" />
      </Helmet>

      {/* Hero */}
      <section
        className="max-w-full px-4 pt-16 pb-14 text-center"
        style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-5 text-slate-900">
            {t('hero.title')}<br />
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {stats.map(({ value, label }) => (
              <div key={value} className="bg-white border border-slate-200 rounded-xl px-6 py-3 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="text-2xl font-display font-bold text-primary">{value}</div>
                {label && <div className="text-xs text-slate-500 mt-0.5">{label}</div>}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/us/mortgage" className="cw-btn flex items-center gap-2 text-sm">
              <HomeIcon size={17} /> {t('hero.cta_mortgage')}
            </Link>
            <Link to="/us/tax" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
              <BarChart2 size={17} /> {t('hero.cta_tax')}
            </Link>
          </div>
        </div>
      </section>

      <AdSenseSlot format="leaderboard" />

      {/* Country Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold mb-8 text-center text-slate-900">{t('home.chooseCountry')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(countries).map(([code, c]) => (
            <Link
              key={code}
              to={`/${code}`}
              className="bg-white border border-slate-200 hover:border-primary hover:shadow-card-hover rounded-xl p-5 text-center transition-all group"
            >
              <div className="text-4xl mb-3">{c.flag}</div>
              <div className="font-semibold text-sm text-slate-900">{c.name}</div>
              <div className="text-xs text-slate-400 mt-1">{calcsByCountry[code].length} {t('home.calculators')}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Calcs */}
      <section className="py-12" style={{ background: '#F1F5F9' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold mb-8 text-center text-slate-900">{t('home.popular')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCalcs.map(({ to, Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="bg-white border border-slate-200 hover:border-primary hover:shadow-card-hover rounded-xl p-6 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EFF6FF' }}>
                  <Icon size={20} color={ICON_COLOR} />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdSenseSlot format="leaderboard" />

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-display font-bold mb-10 text-slate-900">{t('home.howItWorks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: t('home.step1Title'), desc: t('home.step1Desc') },
            { step: '2', title: t('home.step2Title'), desc: t('home.step2Desc') },
            { step: '3', title: t('home.step3Title'), desc: t('home.step3Desc') },
          ].map(({ step, title, desc }) => (
            <div key={step} className="cw-card text-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-lg mx-auto mb-4 text-white">
                {step}
              </div>
              <h3 className="font-semibold mb-2 text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
