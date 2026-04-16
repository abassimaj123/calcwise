// AdSense pub: ca-pub-5379540026739666
// Slot IDs will be replaced with real ones after approval.
// The wrapper always renders with a fixed minimum height so it never
// creates invisible empty space while awaiting AdSense approval.

const SLOTS = {
  rectangle:   { id: '0000000001', w: 336, h: 250 },
  leaderboard: { id: '0000000002', w: 728, h: 90  },
  responsive:  { id: '0000000003', w: null, h: 100 },
}

export default function AdSenseSlot({ format = 'rectangle', className = '' }) {
  const slot = SLOTS[format] || SLOTS.rectangle

  return (
    <div
      className={`my-4 mx-auto ${className}`}
      style={{
        width: '100%',
        maxWidth: slot.w ? `${slot.w}px` : '100%',
        minHeight: `${slot.h}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Placeholder shown while AdSense is pending approval */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFFBEB',
          border: '1.5px dashed #F59E0B',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Advertisement
        </span>
        <span style={{ fontSize: '10px', color: '#B45309' }}>
          {slot.w ? `${slot.w}×${slot.h}` : 'Responsive'} · Pending AdSense approval
        </span>
      </div>

      {/* Real AdSense tag — will activate and overlay the placeholder after approval */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', position: 'relative', zIndex: 1 }}
        data-ad-client="ca-pub-5379540026739666"
        data-ad-slot={slot.id}
        data-ad-format={format === 'responsive' ? 'auto' : format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
