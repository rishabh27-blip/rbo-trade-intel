// ============================================================
// LocalStorage helpers with prefix namespacing
// ============================================================

const NS = 'rbo_'

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch (e) {
    console.warn('Storage save failed:', e)
  }
}

export function remove(key) {
  try { localStorage.removeItem(NS + key) } catch {}
}

export function clearAll() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(NS))
  keys.forEach(k => localStorage.removeItem(k))
}

// Storage keys
export const KEYS = {
  THEME: 'theme',
  TRADES: 'trades',
  ESTIMATOR: 'estimator_inputs',
  OPERATIONS: 'operations',
  FINANCIALS: 'financials',
  SETTINGS: 'settings',
  CAPITAL: 'capital'
}
