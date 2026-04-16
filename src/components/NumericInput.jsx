/**
 * NumericInput — +/- buttons + optional range slider.
 *
 * Props:
 *   value, onChange, min, max, step, prefix, suffix, className, inputMode — same as before
 *   showSlider?  boolean  — show a range slider below the input (default false)
 *   label?       string   — label shown above the input
 *   hint?        string   — small help text below (e.g. "2026 avg: 7.25%")
 */
export default function NumericInput({
  value, onChange, min = -Infinity, max = Infinity, step = 1,
  prefix = '', suffix = '', className = '', inputMode = 'decimal',
  showSlider = false, label = '', hint = '',
}) {
  const clamp = (v) => Math.min(Math.max(v, min), max)
  const decrement = () => onChange(clamp(parseFloat((value - step).toFixed(10))))
  const increment = () => onChange(clamp(parseFloat((value + step).toFixed(10))))

  const handleChange = (e) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') { onChange(raw === '' ? 0 : min); return }
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(clamp(parsed))
  }

  const handleSlider = (e) => onChange(clamp(parseFloat(e.target.value)))

  // Slider fill % for visual fill
  const sliderPct = (max !== Infinity && min !== -Infinity)
    ? Math.round(((value - min) / (max - min)) * 100)
    : 50

  const btnBase = 'flex items-center justify-center min-w-[44px] min-h-[44px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 text-slate-600 font-bold text-xl transition-colors select-none shrink-0'

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="flex items-stretch rounded-lg overflow-hidden transition-all"
        style={{ border: '1.5px solid #94A3B8', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = '#1A6AFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,106,255,0.15)'; }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; }}
      >
        <button type="button" onClick={decrement} disabled={value <= min}
          className={`${btnBase} border-r border-slate-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed`} aria-label="Decrease">−</button>
        <div className="relative flex-1 flex items-center">
          {prefix && <span className="pl-3 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0">{prefix}</span>}
          <input type="number" inputMode={inputMode} value={value} onChange={handleChange}
            min={min} max={max} step={step}
            className="w-full min-h-[44px] bg-white text-center text-slate-900 font-semibold text-sm focus:outline-none px-2" />
          {suffix && <span className="pr-3 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0">{suffix}</span>}
        </div>
        <button type="button" onClick={increment} disabled={value >= max}
          className={`${btnBase} border-l border-slate-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed`} aria-label="Increase">+</button>
      </div>
      {showSlider && min !== -Infinity && max !== Infinity && (
        <div className="mt-2 px-1">
          <input
            type="range" min={min} max={max} step={step} value={value}
            onChange={handleSlider}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1A6AFF ${sliderPct}%, #E2E8F0 ${sliderPct}%)`
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>{prefix}{min}{suffix}</span>
            <span>{prefix}{max}{suffix}</span>
          </div>
        </div>
      )}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}
