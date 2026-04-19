// AdSense pub: ca-pub-5379540026739666
// Slot IDs are placeholders — replace with real ones after AdSense approval.

const FORMAT_HEIGHT = {
  rectangle:    120,
  leaderboard:   60,
  'in-article': 100,
  'in-content': 100,
  auto:          60,
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
        margin: '16px 0',
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
        overflow: 'hidden',   // prevent ins from expanding beyond wrapper
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
        style={{
          display: 'block',
          width: '100%',
          height: 0,           // force height 0 until AdSense approved
          overflow: 'hidden',  // prevent layout expansion
        }}
        data-ad-client="ca-pub-5379540026739666"
        data-ad-slot={slot || '0000000000'}
        data-ad-format={format === 'rectangle' ? 'auto' : format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
