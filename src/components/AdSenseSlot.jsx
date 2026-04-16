import { useEffect } from 'react'
import { adsense } from '../config/adsense'

const isDev = import.meta.env.DEV

export default function AdSenseSlot({ format = 'rectangle', className = '' }) {
  const slotId = adsense.slots[format] || adsense.slots.rectangle

  useEffect(() => {
    if (!isDev && window.adsbygoogle) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch (e) {}
    }
  }, [])

  if (isDev) {
    const dims = {
      rectangle:   'h-[280px] w-full max-w-sm',
      leaderboard: 'h-[90px] w-full max-w-3xl',
      responsive:  'h-[200px] w-full',
    }
    return (
      <div className={`flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg bg-white/[0.03] ${dims[format] || dims.rectangle} mx-auto my-6 ${className}`}>
        <span className="text-cw-gray text-sm">Ad Slot ({format})</span>
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
