import { useEffect } from 'react'
import { adsense } from '../config/adsense'

const isDev = import.meta.env.DEV

const DIM = {
  rectangle:   { minH: '250px', w: 'w-full max-w-sm', label: '336×280' },
  leaderboard: { minH: '90px',  w: 'w-full max-w-3xl', label: '728×90' },
  responsive:  { minH: '200px', w: 'w-full', label: 'Responsive' },
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
        className={`flex flex-col items-center justify-center ${dim.w} mx-auto my-6 rounded-lg ${className}`}
        style={{ minHeight: dim.minH, border: '1px dashed #CBD5E1', background: '#F8FAFC' }}
      >
        <span className="text-xs text-slate-400">AdSense · {format} · {dim.label}</span>
      </div>
    )
  }

  return (
    <div className={`my-6 ${className}`} style={{ display: 'block', minHeight: dim.minH }}>
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
