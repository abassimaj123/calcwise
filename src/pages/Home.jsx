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

const trustItems = [
  { Icon: Shield,     label: 'Bank-level accuracy' },
  { Icon: Zap,        label: 'Instant results' },
  { Icon: Globe,      label: '6 countries' },
  { Icon: Calculator, label: '47+ calculators' },
]

const whyFeatures = [
  {
    Icon: Shield,
    title: 'Accurate 2026 Rates',
    desc: 'Updated tax brackets, interest rates, and regulations for all 6 countries.',
  },
  {
    Icon: Zap,
    title: 'Instant Calculations',
    desc: 'Real-time results as you type. No waiting, no submissions.',
  },
  {
    Icon: Globe,
    title: 'Multi-Country',
    desc: 'Switch between US, Canada, UK, Australia, Ireland and New Zealand instantly.',
  },
]

export default function Home() {
  const { t } = useTranslation()

  const stats = [
    { value: '47+',              label: t('stats.calculators') },
    { value: '6',                label: t('stats.countries') },
    { value: '2026',             label: t('stats.taxRates') },
    { value: t('stats.noSignup'), label: 'No Signup' },
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
        className="w-full px-4 pt-20 pb-16 text-center"
        style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-primary text-xs font-semibold px-4 py-1.5 rounded-full">
              🌍 6 Countries · 47+ Calculators · Free Forever
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-5 text-slate-900 leading-tight">
            {t('hero.title')}<br />
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/us/mortgage"
              className="cw-btn flex items-center gap-2 text-sm px-6 py-3"
            >
              <HomeIcon size={17} />
              {t('hero.cta_mortgage')}
            </Link>
            <Link
              to="/us/tax"
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary font-semibold px-6 py-3 rounded-lg transition-colors text-sm shadow-sm"
            >
              <BarChart2 size={17} />
              {t('hero.cta_tax')}
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={value}
                className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-center min-w-[110px]"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="text-2xl font-display font-bold text-primary leading-none">{value}</div>
                {label && <div className="text-xs text-slate-500 mt-1">{label}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="bg-white border-y border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {trustItems.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Icon size={15} className="text-primary shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdSenseSlot format="leaderboard" />

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
                className="bg-white border border-slate-200 hover:border-primary hover:shadow-card-hover rounded-2xl p-5 text-center transition-all hover:scale-105 group"
              >
                <div className="flex justify-center mb-3">
                  <CountryFlag code={code} size="lg" />
                </div>
                <div className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                  {c.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {calcsByCountry[code].length} {t('home.calculators')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Calculators ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-center text-slate-900">
            {t('home.popular')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCalcs.map(({ to, calcKey, title, desc }) => {
              const Icon = calcIconMap[calcKey] || BarChart2
              return (
                <Link
                  key={to}
                  to={to}
                  className="bg-white border border-slate-200 hover:border-primary hover:shadow-card-hover rounded-2xl p-5 transition-all group flex items-start gap-4"
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: '#EFF6FF' }}
                  >
                    <Icon size={20} color={ICON_COLOR} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors mb-1 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="ml-auto shrink-0 mt-1 text-slate-300 group-hover:text-primary transition-colors"
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
            Why CalcWise?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyFeatures.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-7 text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: '#EFF6FF' }}
                >
                  <Icon size={26} color={ICON_COLOR} />
                </div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: t('home.step1Title'), desc: t('home.step1Desc') },
              { step: '2', title: t('home.step2Title'), desc: t('home.step2Desc') },
              { step: '3', title: t('home.step3Title'), desc: t('home.step3Desc') },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-slate-200 rounded-2xl p-7 text-center shadow-sm">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-2xl mx-auto mb-5 text-white"
                  style={{ background: ICON_COLOR }}
                >
                  {step}
                </div>
                <h3 className="font-display font-semibold mb-2 text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
