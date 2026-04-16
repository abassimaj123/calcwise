import { mobileApps, playStoreLinks } from '../config/apps'

export default function AppDownloadBanner({ calcKey, country }) {
  const status = mobileApps[calcKey]?.[country]

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1)
  const linkKey = `${calcKey}${countryCapitalized}`
  const playLink = playStoreLinks[linkKey] || null

  return (
    <div className="my-6 p-5 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)' }}>
      <div>
        <p className="font-semibold text-sm text-slate-900">📱 Get the full experience on mobile</p>
        <p className="text-xs text-slate-500 mt-1">More features · History · Export PDF</p>
      </div>
      <div className="flex gap-3 shrink-0">
        {status === true && playLink ? (
          <a
            href={playLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            ▶ Google Play
          </a>
        ) : (
          <span className="flex items-center gap-2 bg-white border border-slate-200 text-slate-400 px-4 py-2 rounded-lg text-xs font-semibold">
            ▶ Google Play · Coming Soon
          </span>
        )}
        <span className="flex items-center gap-2 bg-white border border-slate-200 text-slate-400 px-4 py-2 rounded-lg text-xs font-semibold">
          ⬛ App Store · Coming Soon
        </span>
      </div>
    </div>
  )
}
