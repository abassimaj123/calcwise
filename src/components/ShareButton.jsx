import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

/**
 * ShareButton — encodes params into URL hash and copies to clipboard.
 *
 * Props:
 *   params: object — key/value pairs to encode (e.g., { price: 400000, rate: 6.8, term: 30 })
 */
export default function ShareButton({ params }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const encoded = btoa(JSON.stringify(params))
    const url = `${window.location.href.split('?')[0].split('#')[0]}${window.location.hash.split('?')[0]}?s=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        copied
          ? 'bg-green-50 border-green-300 text-green-700'
          : 'bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
      }`}
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? 'Copied!' : 'Share Results'}
    </button>
  )
}
