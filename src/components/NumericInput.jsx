/**
 * NumericInput — +/- buttons + optional range slider.
 *
 * Props:
 *   value, onChange, min, max, step, prefix, suffix, className, inputMode
 *   showSlider?  boolean  — show a range slider below the input (default false)
 *   label?       string   — label shown above the input
 *   hint?        string   — small help text shown below min/max labels
 *
 * Display behaviour:
 *   When unfocused and value ≥ 1000, shows compact form: 700k, 1.2M
 *   When focused, shows the raw number for editing.
 *   Percentage / small values (step < 1) are never compacted.
 */
import { useState } from 'react'

// Compact formatter: 1800 → "1.8k", 700000 → "700k", 1200000 → "1.2M"
function fmtCompact(v, step) {
  const n = parseFloat(v)
  if (isNaN(n)) return String(v)
  // Don't compact decimals/percentages
  if (step < 1 || Math.abs(n) < 1000) return String(n)
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  // Keep 1 decimal so 1800 → "1.8k" and 2100 → "2.1k" (not both "2k")
  return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}

export default function NumericInput({
  value, onChange, min = -Infinity, max = Infinity, step = 1,
  prefix = '', suffix = '', className = '', inputMode = 'decimal',
  showSlider = false, label = '', hint = '',
}) {
  const [focused, setFocused] = useState(false)

  const clamp = (v) => Math.min(Math.max(v, min), max)
  const decrement = () => onChange(clamp(parseFloat((+value - step).toFixed(10))))
  const increment = () => onChange(clamp(parseFloat((+value + step).toFixed(10))))

  const handleChange = (e) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') { onChange(raw === '' ? 0 : min); return }
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(clamp(parsed))
  }

  const handleFocus = (e) => {
    setFocused(true)
    // Select all on focus so typing replaces the value
    setTimeout(() => e.target.select(), 0)
  }
  const handleBlur = () => setFocused(false)

  const handleSlider = (e) => onChange(clamp(parseFloat(e.target.value)))

  const sliderPct = (max !== Infinity && min !== -Infinity)
    ? Math.round(((value - min) / (max - min)) * 100)
    : 50

  // When focused: show raw number. When blurred: show compact format.
  const displayValue = focused ? value : fmtCompact(value, step)

  const btnBase = [
    'flex items-center justify-center',
    'w-7 min-h-[44px]',             // 28px — compact; leaves max room for value
    'bg-slate-100 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100',
    'text-slate-600 font-bold text-xl transition-colors select-none shrink-0',
  ].join(' ')

  return (
    <div className={`${className}`} style={{ overflow: 'visible' }}>
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* ── Input row: [−] [prefix value suffix] [+] ── */}
      <div
        className="flex items-stretch rounded-lg"
        style={{ border: '1.5px solid #94A3B8', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', overflow: 'visible' }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = '#1A6AFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,106,255,0.15)'; }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)'; }}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={`${btnBase} border-r border-slate-200 rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Decrease"
        >−</button>

        {/* Value area — flex row, prefix · input · suffix always visible */}
        <div className="flex flex-1 items-center min-w-0 bg-white">
          {prefix && (
            <span className="pl-2 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0 leading-none">
              {prefix}
            </span>
          )}
          <input
            type={focused ? 'number' : 'text'}
            inputMode={inputMode}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min={min}
            max={max}
            step={step}
            className="flex-1 min-w-0 min-h-[44px] bg-white text-center text-slate-900 font-semibold text-sm focus:outline-none"
            style={{ minWidth: '60px' }}
          />
          {suffix && (
            <span className="pr-2 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0 leading-none">
              {suffix}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={`${btnBase} border-l border-slate-200 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label="Increase"
        >+</button>
      </div>

      {/* ── Slider (always BELOW the input row, never overlapping) ── */}
      {showSlider && min !== -Infinity && max !== Infinity && (
        <div className="px-1" style={{ marginTop: '6px', paddingTop: '10px', paddingBottom: '2px' }}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSlider}
            className="w-full appearance-none cursor-pointer block"
            style={{
              height: '4px',
              background: `linear-gradient(to right, #1A6AFF ${sliderPct}%, #E2E8F0 ${sliderPct}%)`,
              borderRadius: '4px',
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{prefix}{fmtCompact(min, step)}{suffix}</span>
            <span>{prefix}{fmtCompact(max, step)}{suffix}</span>
          </div>
        </div>
      )}

      {/* ── Hint line (avg rate, context info) — always last ── */}
      {hint && (
        <p className="text-[11px] text-blue-500 font-medium mt-1 text-left">{hint}</p>
      )}
    </div>
  )
}
