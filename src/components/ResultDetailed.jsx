export default function ResultDetailed({ rows, title = 'Breakdown' }) {
  // rows = [{ label, value, sub?, bold? }]
  return (
    <div className="cw-card my-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">{title}</h3>
      <div className="divide-y divide-slate-100">
        {rows.map(({ label, value, sub, bold }, i) => (
          <div key={i} className={`flex justify-between items-center py-3 ${i % 2 === 1 ? 'bg-slate-50 -mx-6 px-6' : ''}`}>
            <div>
              <p className={`text-sm ${bold ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{label}</p>
              {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
            <p className={`text-sm font-mono ${bold ? 'font-bold text-primary' : 'text-slate-700'}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
