import { useMemo } from 'react'

/**
 * Reads encoded params from URL ?s= query string.
 * Returns parsed object or null.
 */
export function useSharedParams() {
  return useMemo(() => {
    try {
      const search = window.location.search || window.location.hash.split('?')[1] || ''
      const params = new URLSearchParams(search)
      const s = params.get('s')
      if (!s) return null
      return JSON.parse(atob(s))
    } catch {
      return null
    }
  }, [])
}
