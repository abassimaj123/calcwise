export default function ResultSimple({ metrics }) {
  // metrics = [{ label, value, sub?, highlight? }]
  const [main, ...rest] = metrics
  return (
    <div className="my-6">
      {/* Main highlighted metric */}
      {main && (
        <div className="bg-white border-l-4 border-primary rounded-xl p-6 mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p className="text-slate-500 text-sm font-medium mb-1">{main.label}</p>
          <p className="font-display font-bold text-4xl text-slate-900">{main.value}</p>
          {main.sub && <p className="text-xs text-slate-400 mt-1">{main.sub}</p>}
        </div>
      )}
      {/* Secondary metrics */}
      {rest.length > 0 && (
        <div className={`grid gap-3 ${rest.length === 1 ? 'grid-cols-1' : rest.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {rest.map(({ label, value, sub }, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
              <p className="font-semibold text-lg text-slate-900">{value}</p>
              {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
