import { useState, useEffect } from 'react'

// Sticky bottom banner — mobile only (<768px).
// Dismissed state persists 4 hours via localStorage so it re-appears on return visits.

const DISMISS_KEY = 'cw_sticky_ad_dismissed'
const DISMISS_TTL = 4 * 60 * 60 * 1000 // 4 hours

export default function StickyAdBanner() {
  const [dismissed, setDismissed] = useState(true) // start hidden, check localStorage
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY)
    if (!stored || Date.now() - Number(stored) > DISMISS_TTL) {
      setDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setDismissed(true)
  }

  if (!isMobile || dismissed) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#ffffff',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        minHeight: '60px',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: 6,
        fontSize: '9px', color: '#94A3B8',
        fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        Ad
      </span>
      <button
        onClick={handleDismiss}
        aria-label="Close ad"
        style={{
          position: 'absolute', top: 2, right: 6,
          background: 'none', border: 'none',
          color: '#94A3B8', fontSize: '14px',
          cursor: 'pointer', lineHeight: 1,
          padding: '2px 4px',
        }}
      >
        ✕
      </button>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '320px', height: '50px' }}
        data-ad-client="ca-pub-5379540026739666"
        data-ad-slot="0000000003"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
