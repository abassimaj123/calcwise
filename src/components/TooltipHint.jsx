import { useState, useRef, useEffect } from 'react'
import { Info } from 'lucide-react'

/**
 * TooltipHint — inline ⓘ icon with hover/click popover.
 *
 * Props:
 *   text: string — the tooltip text
 *   size?: number — icon size (default 13)
 */
export default function TooltipHint({ text, size = 13 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex items-center ml-1" style={{ verticalAlign: 'middle' }}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
        aria-label="More info"
      >
        <Info size={size} />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
        </div>
      )}
    </span>
  )
}
