import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, clearTokens, getAccessToken, setTokens } from '../api/api.js'

const AuthContext = createContext(null)

/** Délai d'inactivité avant déconnexion automatique (15 minutes) */
const INACTIVITY_MS = 15 * 60 * 1000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const inactivityRef = useRef(null)

  const fetchMe = useCallback(async () => {
    const res = await api.get('users/me/')
    setUser(res.data)
    return res.data
  }, [])

  const login = useCallback(async (username, password) => {
    const res = await api.post('auth/token/', { username, password })
    setTokens(res.data)
    await fetchMe()
  }, [fetchMe])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (getAccessToken()) {
          await fetchMe()
        }
      } catch {
        clearTokens()
        setUser(null)
      } finally {
        setIsBootstrapping(false)
      }
    })()
  }, [fetchMe])

  // Déconnexion automatique après 15 min d'inactivité (uniquement si connecté)
  useEffect(() => {
    if (!user) return

    const scheduleLogout = () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current)
      inactivityRef.current = setTimeout(() => {
        logout()
      }, INACTIVITY_MS)
    }

    scheduleLogout()

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    const onActivity = () => scheduleLogout()

    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }))

    return () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current)
      events.forEach((ev) => window.removeEventListener(ev, onActivity))
    }
  }, [user, logout])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      logout,
      refreshMe: fetchMe,
    }),
    [fetchMe, isBootstrapping, login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return ctx
}

