import { mobileApps, playStoreLinks } from '../config/apps'

export default function AppDownloadBanner({ calcKey, country }) {
  const status = mobileApps[calcKey]?.[country]
  if (!status) return null

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1)
  const linkKey = `${calcKey}${countryCapitalized}`
  const playLink = playStoreLinks[linkKey] || '#'

  return (
    <div className="my-6 p-4 bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 rounded-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm">📱 Get the full experience on mobile</p>
          <p className="text-xs text-cw-gray mt-1">Amortization · History · Extra payments · Offline</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {status === true ? (
            <a
              href={playLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-dark px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors"
            >
              ▶ Google Play
            </a>
          ) : (
            <span className="flex items-center gap-2 bg-white/10 text-cw-gray px-4 py-2 rounded-lg text-xs font-semibold">
              🔜 Coming Soon
            </span>
          )}
          <span className="flex items-center gap-2 bg-white/10 text-cw-gray px-4 py-2 rounded-lg text-xs font-semibold">
            ⬛ App Store · Soon
          </span>
        </div>
      </div>
    </div>
  )
}
