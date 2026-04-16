import { useEffect } from 'react'
import { adsense } from '../config/adsense'

const isDev = import.meta.env.DEV

const DIM = {
  rectangle:   { h: 'h-[250px]', w: 'w-full max-w-sm', label: '336×280' },
  leaderboard: { h: 'h-[90px]',  w: 'w-full max-w-3xl', label: '728×90' },
  responsive:  { h: 'h-[200px]', w: 'w-full', label: 'Responsive' },
}

export default function AdSenseSlot({ format = 'rectangle', className = '' }) {
  const slotId = adsense.slots[format] || adsense.slots.rectangle
  const dim = DIM[format] || DIM.rectangle

  useEffect(() => {
    if (!isDev && window.adsbygoogle) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch (e) {}
    }
  }, [])

  if (isDev) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${dim.h} ${dim.w} mx-auto my-6 rounded-lg ${className}`}
        style={{ border: '2px dashed #F5C842', background: 'rgba(245, 200, 66, 0.08)' }}
      >
        <span style={{ color: '#F5C842' }} className="text-xs font-medium">AdSense · {format} · {dim.label}</span>
      </div>
    )
  }

  return (
    <div className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsense.publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
