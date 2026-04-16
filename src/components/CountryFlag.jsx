const EMOJI = {
  us: '🇺🇸',
  ca: '🇨🇦',
  uk: '🇬🇧',
  au: '🇦🇺',
  ie: '🇮🇪',
  nz: '🇳🇿',
}

const SIZE = {
  sm: '1.5rem',
  md: '2rem',
  lg: '2.75rem',
  xl: '4rem',
}

export default function CountryFlag({ code, size = 'md' }) {
  const emoji = EMOJI[code] || '🏳️'
  const fontSize = SIZE[size] || SIZE.md
  return (
    <span
      style={{ fontSize, lineHeight: 1, display: 'inline-block' }}
      role="img"
      aria-label={code?.toUpperCase()}
    >
      {emoji}
    </span>
  )
}
