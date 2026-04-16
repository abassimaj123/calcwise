import { AlertTriangle, Info, CheckCircle, TrendingDown } from 'lucide-react'

const VARIANTS = {
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon_color: '#D97706' },
  info:    { icon: Info,          bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-800',  icon_color: '#1A6AFF' },
  success: { icon: CheckCircle,   bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', icon_color: '#059669' },
  saving:  { icon: TrendingDown,  bg: 'bg-purple-50',border: 'border-purple-200',text: 'text-purple-800',icon_color: '#7C3AED' },
}

/**
 * SmartAlert — contextual alert card.
 *
 * Props:
 *   type: 'warning' | 'info' | 'success' | 'saving'
 *   title: string
 *   message: string
 *   show?: boolean (default true)
 */
export default function SmartAlert({ type = 'info', title, message, show = true }) {
  if (!show) return null
  const v = VARIANTS[type] || VARIANTS.info
  const Icon = v.icon
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${v.bg} ${v.border} mb-4`}>
      <Icon size={18} color={v.icon_color} className="shrink-0 mt-0.5" />
      <div>
        {title && <p className={`text-sm font-semibold ${v.text} mb-0.5`}>{title}</p>}
        <p className={`text-xs leading-relaxed ${v.text}`}>{message}</p>
      </div>
    </div>
  )
}
