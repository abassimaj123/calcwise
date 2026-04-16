import { mobileApps, playStoreLinks } from '../config/apps'

export default function AppDownloadBanner({ calcKey, country }) {
  const status = mobileApps[calcKey]?.[country]

  const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1)
  const linkKey = `${calcKey}${countryCapitalized}`
  const playLink = playStoreLinks[linkKey] || null

  return (
    <div className="my-6 p-4 bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 rounded-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm">📱 Get the full experience on mobile</p>
          <p className="text-xs text-cw-gray mt-1">More features · History · Export PDF</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {status === true && playLink ? (
            <a
              href={playLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-cw-success text-white px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              ▶ Google Play
            </a>
          ) : (
            <span className="flex items-center gap-2 bg-white/10 text-cw-gray px-4 py-2 rounded-lg text-xs font-semibold">
              ▶ Google Play · Coming Soon
            </span>
          )}
          <span className="flex items-center gap-2 bg-white/10 text-cw-gray px-4 py-2 rounded-lg text-xs font-semibold">
            ⬛ App Store · Coming Soon
          </span>
        </div>
      </div>
    </div>
  )
}
