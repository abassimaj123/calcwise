import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/XXXXXXXX', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact CalcWise</title>
        <meta name="description" content="Get in touch with the CalcWise team. Report a bug, suggest a calculator, or ask a question." />
        <link rel="canonical" href="https://calqwise.com/contact" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-cw-gray">Bug report, feature request, or just saying hello — we read everything.</p>
        </div>

        {submitted ? (
          <div className="cw-card text-center py-12">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-display font-bold mb-3">Message Sent!</h2>
            <p className="text-cw-gray">Thanks for reaching out. We'll get back to you within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="cw-card space-y-5">
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Jane Smith"
                className="cw-input"
              />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                className="cw-input"
              />
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Subject</label>
              <select name="subject" className="cw-input">
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="calculator">Calculator Question</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-cw-gray mb-1 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell us what's on your mind..."
                className="cw-input resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="cw-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            <p className="text-xs text-cw-gray text-center">
              Messages are processed via Formspree. By submitting, you agree to our{' '}
              <a href="#/privacy" className="text-primary hover:text-accent">Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </>
  )
}
