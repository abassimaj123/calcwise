// AdSense pub: ca-pub-5379540026739666
// Slot IDs are placeholders — replace with real ones after AdSense approval.
// The wrapper always has a fixed minHeight so the page layout never shifts
// and CLS (Cumulative Layout Shift) score stays clean.

const FORMAT_HEIGHT = {
  rectangle:  120,
  leaderboard: 60,
  'in-article': 100,
  auto: 60,
}

export default function AdSenseSlot({ format = 'rectangle', slot, placement = '', className = '' }) {
  const minH = FORMAT_HEIGHT[format] || 90

  return (
    <div
      data-placement={placement}
      className={className}
      style={{
        width: '100%',
        minHeight: `${minH}px`,
        margin: '24px 0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFBEB',
        border: '1.5px dashed #FCD34D',
        borderRadius: '8px',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{
        position: 'absolute', top: 4, left: 8,
        fontSize: '10px', color: '#92400E',
        fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.05em', pointerEvents: 'none',
      }}>
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: `${minH - 20}px` }}
        data-ad-client="ca-pub-5379540026739666"
        data-ad-slot={slot || '0000000000'}
        data-ad-format={format === 'rectangle' ? 'auto' : format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
