const NS = 'depay'

function key(name: string): string {
  return `${NS}::${name}`
}

export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(name))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value))
  } catch {
    // storage unavailable (e.g. private mode) — fail silently, app still
    // works for the current session, it just won't persist across reloads.
  }
}

export function removeKey(name: string): void {
  try {
    localStorage.removeItem(key(name))
  } catch {
    // ignore
  }
}
