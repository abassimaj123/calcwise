import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CONTACT_EMAIL = 'hello@calqwise.com'

const ANDROID_APPS = [
  'Mortgage Calculator CA', 'Mortgage Calculator UK', 'Mortgage Calculator US',
  'Auto Loan CA', 'Auto Loan UK', 'Auto Loan US',
  'Tax Calculator CA', 'Tax Calculator UK', 'Tax Calculator US', 'Tax Calculator AU',
  'RideProfit', 'Salary Calculator CA', 'Salary Calculator UK', 'Salary Calculator US',
]

function Section({ number, title, children }) {
  return (
    <div className="cw-card">
      <h2 className="text-xl font-semibold text-white mb-3">{number}. {title}</h2>
      {children}
    </div>
  )
}

function Sub({ title, children }) {
  return (
    <>
      <h3 className="font-semibold text-white mt-4 mb-2">{title}</h3>
      {children}
    </>
  )
}

function P({ children, className = '' }) {
  return <p className={`text-sm leading-relaxed ${className}`}>{children}</p>
}

function Bullet({ children }) {
  return (
    <li className="flex gap-3">
      <span className="text-accent shrink-0">•</span>
      <span>{children}</span>
    </li>
  )
}

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{t('privacy.meta.title')}</title>
        <meta name="description" content={t('privacy.meta.desc')} />
        <link rel="canonical" href="https://calqwise.com/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | CalqWise" />
        <meta property="og:description" content="CalqWise privacy policy — website and Android apps. GDPR and CCPA compliant. No personal data collected during calculations." />
        <meta property="og:url" content="https://calqwise.com/privacy" />
        <meta property="og:site_name" content="CalqWise" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">{t('privacy.heading')}</h1>
          <p className="text-slate-500">{t('privacy.updated')}: April 17, 2026</p>
        </div>

        <div className="space-y-6 text-slate-400">

          {/* 1. Overview */}
          <Section number="1" title={t('privacy.s1.title')}>
            <P>{t('privacy.s1.p1')}</P>
            <P className="mt-3">
              <strong className="text-white">{t('privacy.s1.keyFact')}:</strong>{' '}
              {t('privacy.s1.p2')}
            </P>
          </Section>

          {/* 2. Website Data */}
          <Section number="2" title={t('privacy.s2.title')}>
            <Sub title={t('privacy.s2.calcTitle')}>
              <P>{t('privacy.s2.calcText')}</P>
            </Sub>
            <Sub title={t('privacy.s2.analyticsTitle')}>
              <P>{t('privacy.s2.analyticsText')}</P>
              <P className="mt-2">{t('privacy.s2.analyticsOptOut')}</P>
            </Sub>
            <Sub title={t('privacy.s2.adsenseTitle')}>
              <P>{t('privacy.s2.adsenseText')}</P>
            </Sub>
            <Sub title={t('privacy.s2.contactTitle')}>
              <P>{t('privacy.s2.contactText')}</P>
            </Sub>
          </Section>

          {/* 3. Mobile Apps */}
          <Section number="3" title={t('privacy.s3.title')}>
            <P>{t('privacy.s3.intro')}</P>
            <ul className="mt-3 mb-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {ANDROID_APPS.map(app => (
                <li key={app} className="flex gap-2 items-center">
                  <span className="text-accent shrink-0">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
            <Sub title={t('privacy.s3.admobTitle')}>
              <P>{t('privacy.s3.admobText')}</P>
            </Sub>
            <Sub title={t('privacy.s3.analyticsTitle')}>
              <P>{t('privacy.s3.analyticsText')}</P>
            </Sub>
            <Sub title={t('privacy.s3.crashlyticsTitle')}>
              <P>{t('privacy.s3.crashlyticsText')}</P>
            </Sub>
            <P className="mt-3">{t('privacy.s3.noSale')}</P>
          </Section>

          {/* 4. Cookies */}
          <Section number="4" title={t('privacy.s4.title')}>
            <P>{t('privacy.s4.intro')}</P>
            <ul className="mt-3 space-y-2 text-sm">
              <Bullet><strong className="text-white">{t('privacy.s4.analyticsCookie')}</strong> — {t('privacy.s4.analyticsCookieText')}</Bullet>
              <Bullet><strong className="text-white">{t('privacy.s4.adsCookie')}</strong> — {t('privacy.s4.adsCookieText')}</Bullet>
              <Bullet><strong className="text-white">{t('privacy.s4.functionalCookie')}</strong> — {t('privacy.s4.functionalCookieText')}</Bullet>
            </ul>
            <P className="mt-3">{t('privacy.s4.control')}</P>
          </Section>

          {/* 5. GDPR */}
          <Section number="5" title={t('privacy.s5.title')}>
            <P>{t('privacy.s5.intro')}</P>
            <ul className="mt-3 space-y-2 text-sm">
              <Bullet><strong className="text-white">{t('privacy.s5.access')}</strong> — {t('privacy.s5.accessText')}</Bullet>
              <Bullet><strong className="text-white">{t('privacy.s5.erasure')}</strong> — {t('privacy.s5.erasureText')}</Bullet>
              <Bullet><strong className="text-white">{t('privacy.s5.object')}</strong> — {t('privacy.s5.objectText')}</Bullet>
              <Bullet><strong className="text-white">{t('privacy.s5.portability')}</strong> — {t('privacy.s5.portabilityText')}</Bullet>
            </ul>
            <P className="mt-3">{t('privacy.s5.basis')}</P>
          </Section>

          {/* 6. CCPA */}
          <Section number="6" title={t('privacy.s6.title')}>
            <P>{t('privacy.s6.text')}</P>
            <P className="mt-3">{t('privacy.s6.note')}</P>
          </Section>

          {/* 7. Children */}
          <Section number="7" title={t('privacy.s7.title')}>
            <P>{t('privacy.s7.text')}</P>
          </Section>

          {/* 8. Third-party links */}
          <Section number="8" title={t('privacy.s8.title')}>
            <P>{t('privacy.s8.text')}</P>
          </Section>

          {/* 9. Changes */}
          <Section number="9" title={t('privacy.s9.title')}>
            <P>{t('privacy.s9.text')}</P>
          </Section>

          {/* 10. Contact */}
          <Section number="10" title={t('privacy.s10.title')}>
            <P>
              {t('privacy.s10.text')}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-accent transition-colors">
                {CONTACT_EMAIL}
              </a>{' '}
              {t('privacy.s10.or')}{' '}
              <Link to="/contact" className="text-primary hover:text-accent transition-colors">
                {t('privacy.s10.contactPage')}
              </Link>.
            </P>
          </Section>

        </div>
      </div>
    </>
  )
}
