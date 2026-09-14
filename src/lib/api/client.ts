import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { readJSON, writeJSON, removeKey } from '../storage'

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.depay.com.ng').replace(/\/$/, '')

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
})

// ── Token persistence ────────────────────────────────────────────
export function getToken(): string | null {
  return readJSON<string | null>('token', null)
}
export function getRefreshToken(): string | null {
  return readJSON<string | null>('refreshToken', null)
}
export function setTokens(token: string, refreshToken: string): void {
  writeJSON('token', token)
  writeJSON('refreshToken', refreshToken)
}
export function clearTokens(): void {
  removeKey('token')
  removeKey('refreshToken')
}

// ── Attach bearer token to every request ────────────────────────
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── On 401, try exactly one silent refresh, then retry the
//    original request. If the refresh itself fails, give up and
//    let the app's normal "session expired" handling take over
//    (AuthContext listens for this via the `onUnauthorized`
//    callback below, since this file can't import AuthContext
//    without a circular dependency). ────────────────────────────
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    // Don't try to refresh on the auth endpoints themselves — a 401
    // from /login or /refresh-token means bad credentials or a
    // genuinely dead session, not something a retry can fix.
    if (original.url?.includes('/login') || original.url?.includes('/refresh-token')) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      onUnauthorized?.()
      return Promise.reject(error)
    }

    original._retry = true

    if (isRefreshing) {
      // A refresh is already in flight — queue this request behind it
      // rather than firing a second concurrent refresh call.
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(error)
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${token}`
          resolve(api(original))
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await axios.post<{ token: string; refreshToken: string }>(
        `${BASE_URL}/api/v1/user/refresh-token`,
        { refreshToken }
      )
      setTokens(data.token, data.refreshToken)
      pendingQueue.forEach((cb) => cb(data.token))
      pendingQueue = []
      original.headers = original.headers ?? {}
      original.headers.Authorization = `Bearer ${data.token}`
      return api(original)
    } catch (refreshError) {
      pendingQueue.forEach((cb) => cb(null))
      pendingQueue = []
      clearTokens()
      onUnauthorized?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

// ── Consistent error message extraction ─────────────────────────
// The backend returns `{ message }` on most routes but `{ success,
// message }` on others — this covers both without the caller
// needing to know which.
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
