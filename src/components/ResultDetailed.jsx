/**
 * ResultDetailed — premium breakdown list
 *
 * rows = [{ label, value, sub?, bold?, total? }]
 * title — optional section title
 */
export default function ResultDetailed({ rows, title }) {
  return (
    <div className="cw-card anim-fadein">
      {title && <p className="cw-section-title">{title}</p>}
      <div>
        {rows.map(({ label, value, sub, bold, total }, i) => (
          <div
            key={i}
            className={`cw-breakdown-row${bold ? ' bold' : ''}${total ? ' total' : ''}`}
          >
            <div>
              <p className="cw-breakdown-label">{label}</p>
              {sub && <p className="cw-breakdown-label-sub">{sub}</p>}
            </div>
            <p className="cw-breakdown-value">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
