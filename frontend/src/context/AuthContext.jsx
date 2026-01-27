import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearTokens, getAccessToken, setTokens } from '../api/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

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

