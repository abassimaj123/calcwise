const CONFIG = {
  us: { bg: '#002868', text: '#FFFFFF', stripe: '#BF0A30', label: 'US' },
  ca: { bg: '#D52B1E', text: '#FFFFFF', stripe: '#FFFFFF', label: 'CA' },
  uk: { bg: '#012169', text: '#FFFFFF', stripe: '#C8102E', label: 'UK' },
  au: { bg: '#00008B', text: '#FFCC00', stripe: '#009C3B', label: 'AU' },
  ie: { bg: '#169B62', text: '#FFFFFF', stripe: '#FF883E', label: 'IE' },
  nz: { bg: '#00247D', text: '#FFFFFF', stripe: '#CC142B', label: 'NZ' },
}

/**
 * CountryFlag — renders a styled badge instead of emoji (works on all OS).
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
export default function CountryFlag({ code, size = 'md' }) {
  const cfg = CONFIG[code] || { bg: '#64748B', text: '#FFFFFF', stripe: '#94A3B8', label: code?.toUpperCase() }

  const sizeMap = {
    sm:  { outer: 'w-8 h-8 rounded-lg text-xs',    inner: 'text-xs font-bold' },
    md:  { outer: 'w-12 h-12 rounded-xl text-sm',   inner: 'text-sm font-bold' },
    lg:  { outer: 'w-16 h-16 rounded-2xl text-base', inner: 'text-base font-bold' },
    xl:  { outer: 'w-24 h-24 rounded-3xl text-2xl', inner: 'text-2xl font-extrabold' },
  }
  const s = sizeMap[size] || sizeMap.md

  return (
    <div
      className={`${s.outer} flex items-center justify-center relative overflow-hidden shrink-0`}
      style={{ background: cfg.bg }}
    >
      {/* Decorative stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{ background: cfg.stripe, opacity: 0.7 }}
      />
      <span className={`${s.inner} relative z-10 tracking-wide`} style={{ color: cfg.text }}>
        {cfg.label}
      </span>
    </div>
  )
}
