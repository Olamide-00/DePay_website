import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readJSON, writeJSON, removeKey } from '../lib/storage'
import { setTokens, clearTokens, getToken, apiErrorMessage, setUnauthorizedHandler } from '../lib/api/client'
import * as authApi from '../lib/api/auth'
import { connectSocket, disconnectSocket, getSocket } from '../lib/socket'
import type { AuthUser } from '../types'

interface ActionResult {
  success: boolean
  message?: string
}

interface AuthContextValue {
  user: AuthUser | null
  balance: number
  isAuthenticated: boolean
  isInitializing: boolean
  login: (email: string, password: string) => Promise<ActionResult>
  logout: () => void
  loginWithSession: (token: string, refreshToken: string, user: AuthUser) => void
  refreshBalance: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => readJSON<AuthUser | null>('user', null))
  const [balance, setBalance] = useState<number>(() => user?.balance ?? 0)
  const [isInitializing, setIsInitializing] = useState(true)

  const persistUser = useCallback((next: AuthUser | null) => {
    setUserState(next)
    if (next) writeJSON('user', next)
    else removeKey('user')
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    persistUser(null)
    setBalance(0)
    disconnectSocket()
  }, [persistUser])

  // Wire the API client's "refresh failed" handler straight to
  // logout, so an expired session anywhere in the app cleanly drops
  // the user back to /login instead of leaving them looking at a
  // half-authenticated dashboard with silently-failing requests.
  useEffect(() => {
    setUnauthorizedHandler(() => logout())
  }, [logout])

  const refreshBalance = useCallback(async () => {
    if (!user) return
    try {
      const bal = await authApi.getWalletBalance(user.email)
      setBalance(bal)
    } catch {
      // Non-fatal — keep showing the last known balance rather than
      // blanking it out over a transient network hiccup.
    }
  }, [user])

  const refreshUser = useCallback(async () => {
    if (!user) return
    try {
      const fresh = await authApi.getUser(user.email)
      persistUser({ ...user, ...fresh })
      if (typeof fresh.balance === 'number') setBalance(fresh.balance)
    } catch {
      // ignore — keep the cached user rather than blanking the page
    }
  }, [user, persistUser])

  const loginWithSession = useCallback(
    (token: string, refreshToken: string, nextUser: AuthUser) => {
      setTokens(token, refreshToken)
      persistUser(nextUser)
      setBalance(nextUser.balance)
      connectSocket(nextUser.email)
    },
    [persistUser]
  )

  const login = useCallback(
    async (email: string, password: string): Promise<ActionResult> => {
      try {
        const res = await authApi.login(email, password)
        loginWithSession(res.token, res.refreshToken, res.user)
        return { success: true }
      } catch (error) {
        return { success: false, message: apiErrorMessage(error, 'Could not log you in.') }
      }
    },
    [loginWithSession]
  )

  // On first mount: if there's a token + cached user from a previous
  // session, reconnect the socket and refresh balance in the
  // background so the dashboard doesn't show a stale number after a
  // page reload.
  useEffect(() => {
    const token = getToken()
    if (token && user) {
      connectSocket(user.email)
      refreshBalance()
    }
    setIsInitializing(false)
    // Intentionally only on mount — this is a one-time session
    // rehydration, not something that should re-run on user change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live balance updates — pushed by the backend the instant a
  // dedicated-account deposit is credited (see
  // DEPAY_BACKEND webhook/version2/funds.ts).
  useEffect(() => {
    if (!user) return
    const socket = getSocket()
    if (!socket) return
    const handler = (payload: { newBalance: number }) => setBalance(payload.newBalance)
    socket.on('balance_updated', handler)
    return () => {
      socket.off('balance_updated', handler)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      balance,
      isAuthenticated: !!user && !!getToken(),
      isInitializing,
      login,
      logout,
      loginWithSession,
      refreshBalance,
      refreshUser,
      setUser: persistUser,
    }),
    [user, balance, isInitializing, login, logout, loginWithSession, refreshBalance, refreshUser, persistUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
