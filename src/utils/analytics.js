const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args)
}

export const trackCalcUsed = (calcType, country) =>
  gtag('event', 'calc_used', { calc_type: calcType, country })

export const trackAppDownloadClick = (platform, calc, country) =>
  gtag('event', 'app_download_click', { platform, calc, country })

export const trackLanguageSwitch = (language) =>
  gtag('event', 'language_switch', { language })
