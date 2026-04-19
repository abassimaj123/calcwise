import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import fr from './locales/fr/translation.json'
import es from './locales/es/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'en',
    lng: undefined, // let detection decide; fallback is 'en'
    supportedLngs: ['en', 'fr', 'es'],
    detection: {
      // Check localStorage first (respects user's explicit choice),
      // then browser language, but we default to 'en' via fallbackLng.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'cw_lang',
      // Only accept supported languages; anything else falls back to 'en'
      checkWhitelist: true,
    },
    interpolation: { escapeValue: false },
  })

export default i18n
