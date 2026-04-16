import { Helmet } from 'react-helmet-async'

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | CalcWise</title>
        <meta name="description" content="CalcWise privacy policy. How we handle your data, cookies, Google Analytics and AdSense. GDPR and CCPA compliant." />
        <link rel="canonical" href="https://calqwise.com/privacy" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: January 1, 2026</p>
        </div>

        <div className="space-y-6 text-slate-500">

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
            <p className="text-sm leading-relaxed">
              CalcWise ("we", "our", "us") operates the website calqwise.com (the "Service"). This Privacy Policy explains how we collect, use, and protect information when you use our Service.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              <strong className="text-white">Key fact:</strong> All financial calculations on CalcWise run entirely in your browser. We never transmit your financial inputs (income, home price, debt amounts, etc.) to our servers. That data stays on your device.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="font-semibold text-white mt-4 mb-2">2.1 Calculator Inputs</h3>
            <p className="text-sm leading-relaxed">
              We do NOT collect, store, or process any financial data you enter into our calculators. All calculations are performed client-side using JavaScript.
            </p>
            <h3 className="font-semibold text-white mt-4 mb-2">2.2 Usage Data (Google Analytics 4)</h3>
            <p className="text-sm leading-relaxed">
              We use Google Analytics 4 to collect anonymized usage data including: pages visited, time on page, browser type, approximate geographic region (country/city level), and referring websites. This data is used to improve our calculators and understand which features are most useful.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              GA4 data is processed by Google LLC under their Privacy Policy. You can opt out via the Google Analytics Opt-out Browser Add-on.
            </p>
            <h3 className="font-semibold text-white mt-4 mb-2">2.3 Advertising (Google AdSense)</h3>
            <p className="text-sm leading-relaxed">
              We display advertisements via Google AdSense. Google may use cookies and similar technologies to serve personalized ads based on your browsing history. You can manage ad personalization at adssettings.google.com.
            </p>
            <h3 className="font-semibold text-white mt-4 mb-2">2.4 Contact Form</h3>
            <p className="text-sm leading-relaxed">
              If you submit our contact form, your name, email address and message are processed through Formspree (our form backend provider). We use this information solely to respond to your inquiry.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">3. Cookies</h2>
            <p className="text-sm leading-relaxed">We use the following cookies:</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="text-accent shrink-0">•</span>
                <span><strong className="text-white">Analytics cookies</strong> (Google Analytics): Track page views and user behavior anonymously. Persist for up to 2 years.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent shrink-0">•</span>
                <span><strong className="text-white">Advertising cookies</strong> (Google AdSense): Used to serve and measure advertisements. Managed by Google.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent shrink-0">•</span>
                <span><strong className="text-white">Functional cookies</strong>: We may store your calculator preferences (e.g., last selected country) in localStorage. This data never leaves your device.</span>
              </li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              You can control cookies through your browser settings. Note that blocking cookies may affect the functionality of third-party services (analytics, ads).
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">4. GDPR (European Users)</h2>
            <p className="text-sm leading-relaxed">
              If you are located in the European Economic Area (EEA), you have the following rights under GDPR:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-3"><span className="text-accent shrink-0">•</span><span><strong className="text-white">Right to access:</strong> Request a copy of personal data we hold about you.</span></li>
              <li className="flex gap-3"><span className="text-accent shrink-0">•</span><span><strong className="text-white">Right to erasure:</strong> Request deletion of your personal data.</span></li>
              <li className="flex gap-3"><span className="text-accent shrink-0">•</span><span><strong className="text-white">Right to object:</strong> Object to processing of your data for marketing purposes.</span></li>
              <li className="flex gap-3"><span className="text-accent shrink-0">•</span><span><strong className="text-white">Right to portability:</strong> Receive your data in a structured, machine-readable format.</span></li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Our legal basis for processing analytics data is legitimate interest. For advertising, we rely on consent where required by law. To exercise your rights, contact us via the Contact page.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">5. CCPA (California Users)</h2>
            <p className="text-sm leading-relaxed">
              California residents have the right to: know what personal information we collect and how it's used; request deletion of personal information; opt out of the "sale" of personal information (we do not sell personal information); and non-discrimination for exercising your rights.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Note: Sharing data with Google for analytics and advertising purposes may constitute a "sale" under CCPA's broad definition. To opt out, you can use Google's opt-out tools or enable the Global Privacy Control (GPC) signal in your browser.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">6. Children's Privacy</h2>
            <p className="text-sm leading-relaxed">
              CalcWise is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us immediately.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Links</h2>
            <p className="text-sm leading-relaxed">
              Our website may contain links to third-party websites (e.g., Google Play Store, App Store). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "last modified" date. Continued use of CalcWise after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="cw-card">
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
            <p className="text-sm leading-relaxed">
              For privacy-related inquiries, data requests, or concerns, please use our <a href="#/contact" className="text-primary hover:text-accent">Contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
