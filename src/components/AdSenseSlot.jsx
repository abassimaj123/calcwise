// TODO: Replace slot IDs with real AdSense IDs after approval at pub-5379540026739666
const SLOTS = {
  rectangle:   { id: 'rect-1',   w: 336, h: 280 },
  leaderboard: { id: 'leader-1', w: 728, h: 90  },
  responsive:  { id: 'resp-1',   w: null, h: 200 },
}

const isProd = typeof window !== 'undefined' &&
  window.location.hostname.includes('calqwise.com')

export default function AdSenseSlot({ format = 'rectangle', className = '' }) {
  const slot = SLOTS[format] || SLOTS.rectangle
  const isLeaderboard = format === 'leaderboard'

  // Production: render real AdSense ins tag
  if (isProd) {
    return (
      <div
        className={`my-6 ${className}`}
        style={{ display: 'block', minHeight: slot.h + 'px', width: '100%', textAlign: 'center' }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5379540026739666"
          data-ad-slot={slot.id}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Dev / staging: always-visible amber placeholder
  return (
    <div
      className={`my-6 mx-auto ${className}`}
      style={{
        width: '100%',
        maxWidth: slot.w ? slot.w + 'px' : '100%',
        minHeight: slot.h + 'px',
        background: '#FFFBEB',
        border: '2px dashed #F59E0B',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <p style={{ fontSize: '11px', fontWeight: '600', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
        Advertisement
      </p>
      <p style={{ fontSize: '11px', color: '#B45309', margin: '4px 0 0' }}>
        AdSense · {slot.w ? `${slot.w}×${slot.h}` : 'Responsive'} · Pending approval
      </p>
    </div>
  )
}
