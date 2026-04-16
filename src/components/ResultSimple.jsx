export default function ResultSimple({ metrics }) {
  // metrics = [{ label, value, sub?, highlight? }]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {metrics.map(({ label, value, sub, highlight }, i) => (
        <div key={i} className={`cw-card text-center ${highlight ? 'border-primary/40 bg-primary/10' : ''}`}>
          <p className="text-cw-gray text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className={`font-display font-bold ${highlight ? 'text-4xl text-white' : 'text-2xl text-accent'}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-cw-gray mt-1">{sub}</p>}
        </div>
      ))}
    </div>
  )
}
