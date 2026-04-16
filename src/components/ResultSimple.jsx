/**
 * ResultSimple — premium hero card + metric grid
 *
 * metrics = [
 *   { label, value, sub?, highlight? }  ← first = hero
 *   { label, value, sub?, color? }      ← rest = metric cards (color: 'green'|'orange'|'red'|'purple')
 * ]
 */
export default function ResultSimple({ metrics }) {
  const [main, ...rest] = metrics ?? []

  if (!main) return null

  return (
    <div className="space-y-3 anim-fadeup">
      {/* ── Hero card ── */}
      <div className="cw-result-hero">
        <p className="cw-result-hero-label">{main.label}</p>
        <p className="cw-result-hero-value">{main.value}</p>
        {main.sub && <p className="cw-result-hero-sub">{main.sub}</p>}

        {rest.length > 0 && (
          <>
            <hr className="cw-result-hero-divider" />
            <div className="cw-result-hero-grid">
              {rest.map(({ label, value, sub }, i) => (
                <div key={i}>
                  <p className="cw-result-hero-mini-label">{label}</p>
                  <p className="cw-result-hero-mini-value">{value}</p>
                  {sub && <p style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.1rem' }}>{sub}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
