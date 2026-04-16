/**
 * CalcShell — 2-column calc layout
 *
 * On desktop: inputs (left, fixed width) | results (right, sticky)
 * On mobile:  stacked — results appear first for immediate feedback
 *
 * Props:
 *   inputs   — ReactNode  (form fields, sliders)
 *   results  — ReactNode  (result cards, tabs, charts)
 *   title    — string     (calc page title, shown above grid)
 *   badge    — string     (optional small label, e.g. "Updated 2026")
 */
export default function CalcShell({ inputs, results, title, badge }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      {(title || badge) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
          )}
          {badge && (
            <span className="cw-badge blue">{badge}</span>
          )}
        </div>
      )}

      {/* Calc grid */}
      <div className="calc-grid">
        {/* Inputs — left column */}
        <div className="calc-inputs-panel order-2 lg:order-1">
          {inputs}
        </div>

        {/* Results — right column, sticky on desktop */}
        <div className="calc-results-panel order-1 lg:order-2">
          {results}
        </div>
      </div>
    </div>
  )
}
