/**
 * NumericInput — clean number input with [-] [+] buttons, no browser spinners.
 *
 * Props:
 *   value       number
 *   onChange    (newValue: number) => void
 *   min?        number  (default -Infinity)
 *   max?        number  (default Infinity)
 *   step?       number  (default 1)
 *   prefix?     string  (e.g. "$", "£", "€")
 *   suffix?     string  (e.g. "%", " yrs")
 *   className?  string
 *   inputMode?  string  (default "decimal")
 */
export default function NumericInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  prefix = '',
  suffix = '',
  className = '',
  inputMode = 'decimal',
}) {
  const clamp = (v) => Math.min(Math.max(v, min), max)

  const decrement = () => onChange(clamp(parseFloat((value - step).toFixed(10))))
  const increment = () => onChange(clamp(parseFloat((value + step).toFixed(10))))

  const handleChange = (e) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') {
      onChange(raw === '' ? 0 : min)
      return
    }
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(clamp(parsed))
  }

  const btnBase = [
    'flex items-center justify-center',
    'min-w-[44px] min-h-[44px]',
    'bg-slate-100 hover:bg-slate-200 active:bg-slate-300',
    'text-slate-700 font-semibold text-lg',
    'transition-colors select-none',
    'shrink-0',
  ].join(' ')

  return (
    <div className={`flex items-stretch border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all ${className}`}>
      {/* Decrement */}
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={`${btnBase} border-r border-slate-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Decrease"
      >
        −
      </button>

      {/* Input */}
      <div className="relative flex-1 flex items-center">
        {prefix && (
          <span className="pl-3 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode={inputMode}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-full min-h-[44px] bg-white text-center text-slate-900 font-medium text-sm focus:outline-none px-2"
        />
        {suffix && (
          <span className="pr-3 text-slate-500 text-sm font-medium pointer-events-none select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>

      {/* Increment */}
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={`${btnBase} border-l border-slate-200 rounded-none disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  )
}
