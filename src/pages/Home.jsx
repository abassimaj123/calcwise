import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Home as HomeIcon, BarChart2, Car, DollarSign, TrendingUp,
  CheckCircle, Shield, Zap, Globe, ChevronRight, Calculator
} from 'lucide-react'
import { countries, calcsByCountry, calcMeta } from '../config/countries'
import { calcIconMap } from '../config/calcIcons'
import AdSenseSlot from '../components/AdSenseSlot'
import CountryFlag from '../components/CountryFlag'

const ICON_COLOR = '#1A6AFF'

const featuredCalcs = [
  { to: '/us/mortgage',      calcKey: 'mortgage',      title: 'Mortgage Calculator US',     desc: 'Monthly payment with PMI, property tax, amortization schedule.' },
  { to: '/ca/mortgage',      calcKey: 'mortgage',      title: 'Mortgage Calculator CA',     desc: 'CMHC insurance, stress test rate, bi-weekly payments.' },
  { to: '/uk/mortgage',      calcKey: 'mortgage',      title: 'Mortgage Calculator UK',     desc: 'SDLT, LTV ratio, FCA stress test, repayment & interest-only.' },
  { to: '/us/tax',           calcKey: 'tax',           title: 'Tax Calculator US',          desc: 'Federal + state tax, FICA, effective rate. All 50 states.' },
  { to: '/ca/tax',           calcKey: 'tax',           title: 'Tax Calculator CA',          desc: 'Federal + provincial tax, CPP & EI contributions.' },
  { to: '/us/salary',        calcKey: 'salary',        title: 'Salary Calculator US',       desc: 'Gross to net, hourly/weekly/monthly/annual breakdown.' },
  { to: '/ca/rideprofit',    calcKey: 'rideprofit',    title: 'RideProfit CA',              desc: 'Real profit for Uber/DoorDash drivers. CRA $0.72/km deduction.' },
  { to: '/uk/rideprofit',    calcKey: 'rideprofit',    title: 'RideProfit UK',              desc: 'HMRC 45p/mi mileage deduction. True hourly earnings.' },
  { to: '/us/affordability', calcKey: 'affordability', title: 'Affordability Calculator US', desc: 'How much home can you afford? DTI rules, FHA/VA/Conv.' },
]

const trustItemKeys = [
  { Icon: Shield,     key: 'home.trustAccuracy' },
  { Icon: Zap,        key: 'home.trustInstant' },
  { Icon: Globe,      key: 'home.trustCountries' },
  { Icon: Calculator, key: 'home.trustCalcs' },
]

const whyFeatureKeys = [
  { Icon: Shield, titleKey: 'home.whyAccurateTitle', descKey: 'home.whyAccurateDesc' },
  { Icon: Zap,    titleKey: 'home.whyInstantTitle',  descKey: 'home.whyInstantDesc'  },
  { Icon: Globe,  titleKey: 'home.whyHiddenTitle',   descKey: 'home.whyHiddenDesc'   },
]

export default function Home() {
  const { t } = useTranslation()

  const stats = [
    { value: '57+',  label: t('stats.calculators') },
    { value: '6',    label: t('stats.countries') },
    { value: '2026', label: t('stats.taxRates') },
    { value: t('stats.noSignup'), label: null },
  ]

  return (
    <>
      <Helmet>
        <title>CalcWise — Free Financial Calculators for US, CA, UK, AU, IE, NZ</title>
        <meta name="description" content="Free mortgage, tax, salary, auto loan and more calculators for US, Canada, UK, Australia, Ireland and New Zealand. Accurate 2026 rates. No signup required." />
        <link rel="canonical" href="https://calqwise.com" />
      </Helmet>

      {/* ── Hero ── */}
      <section
        className="w-full px-4 pt-24 pb-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F0F6FF 0%, #FAFCFF 50%, #F0F9FF 100%)' }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,106,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,106,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="max-w-4xl mx-auto relative">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <span className="cw-hero-badge">
              <span>✦</span>
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-slate-900 leading-tight tracking-tight">
            {t('hero.title')}<br />
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            <Link to="/us/mortgage" className="cw-btn text-sm px-7 py-3.5">
              <HomeIcon size={17} />
              {t('hero.cta_mortgage')}
            </Link>
            <Link
              to="/us/tax"
              className="cw-btn-ghost text-sm px-7 py-3.5"
              style={{ fontSize: '0.875rem', padding: '0.625rem 1.5rem' }}
            >
              <BarChart2 size={17} />
              {t('hero.cta_tax')}
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map(({ value, label }) => (
              <div key={value} className="cw-stat-card">
                <div className="cw-stat-value">{value}</div>
                {label && <div className="cw-stat-label">{label}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="bg-white border-y border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {trustItemKeys.map(({ Icon, key }) => (
              <div key={key} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Icon size={15} className="text-primary shrink-0" />
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Countries ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-center text-slate-900">
            {t('home.chooseCountry')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(countries).map(([code, c]) => (
              <Link
                key={code}
                to={`/${code}`}
                className="group bg-white border border-slate-200 hover:border-primary rounded-2xl p-5 text-center transition-all"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,106,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              >
                <div className="flex justify-center mb-3">
                  <CountryFlag code={code} size="lg" />
                </div>
                <div className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                  {c.name}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {calcsByCountry[code].length} {t('home.calculators')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hidden Costs Revealed banner ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-lg mb-1">We reveal what others hide</p>
            <p className="text-blue-100 text-sm">Group insurance, union dues, PMI, property tax, CMHC — every cost that affects your real bottom line.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {['PMI/CMHC', 'Assurance collective', 'Property Tax', 'Union Dues', 'Closing Costs'].map(tag => (
              <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Popular Calculators ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-center text-slate-900">
            {t('home.popular')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCalcs.map(({ to, calcKey, title, desc }) => {
              const Icon = calcIconMap[calcKey] || BarChart2
              return (
                <Link key={to} to={to} className="cw-calc-card group">
                  <div className="cw-calc-card-icon group-hover:bg-blue-100 transition-colors">
                    <Icon size={20} color={ICON_COLOR} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors mb-1 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                  <ChevronRight
                    size={15}
                    className="shrink-0 mt-0.5 text-slate-300 group-hover:text-primary transition-colors"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <AdSenseSlot format="leaderboard" />

      {/* ── Why CalcWise ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-center text-slate-900">
            {t('home.whyTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyFeatureKeys.map(({ Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="bg-white border border-slate-200 rounded-2xl p-7"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#EFF6FF' }}
                >
                  <Icon size={22} color={ICON_COLOR} />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2 text-base">{t(titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-12 text-slate-900">
            {t('home.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '1', title: t('home.step1Title'), desc: t('home.step1Desc') },
              { step: '2', title: t('home.step2Title'), desc: t('home.step2Desc') },
              { step: '3', title: t('home.step3Title'), desc: t('home.step3Desc') },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-slate-200 rounded-2xl p-7 relative" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-lg mb-5 text-white"
                  style={{ background: 'linear-gradient(135deg, #1A6AFF 0%, #1455CC 100%)', boxShadow: '0 3px 10px rgba(26,106,255,0.3)' }}
                >
                  {step}
                </div>
                <h3 className="font-display font-bold mb-2 text-slate-900 text-base">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
