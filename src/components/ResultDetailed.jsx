export default function ResultDetailed({ rows, title = 'Breakdown' }) {
  // rows = [{ label, value, sub?, bold? }]
  return (
    <div className="cw-card my-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-cw-gray mb-4">{title}</h3>
      <div className="divide-y divide-white/[0.05]">
        {rows.map(({ label, value, sub, bold }, i) => (
          <div key={i} className="flex justify-between items-center py-3">
            <div>
              <p className={`text-sm ${bold ? 'font-semibold text-white' : 'text-cw-gray'}`}>{label}</p>
              {sub && <p className="text-xs text-cw-gray/60">{sub}</p>}
            </div>
            <p className={`text-sm font-mono ${bold ? 'font-bold text-accent' : 'text-white'}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
