import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const MODE_KEY = 'scgn_theme_mode'
const ThemeContext = createContext(null)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  // mode: 'auto' (système) | 'light' | 'dark'
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'auto'
    const saved = localStorage.getItem(MODE_KEY)
    return saved === 'dark' || saved === 'light' || saved === 'auto' ? saved : 'auto'
  })

  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const onChange = () => setSystemTheme(mq.matches ? 'dark' : 'light')
    onChange()
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  const theme = mode === 'auto' ? systemTheme : mode

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
    try {
      localStorage.setItem(MODE_KEY, mode)
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [mode, theme])

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      // Si on est en auto, un toggle fixe un mode manuel (inverse du système)
      if (m === 'auto') {
        const sys = getSystemTheme()
        return sys === 'dark' ? 'light' : 'dark'
      }
      return m === 'dark' ? 'light' : 'dark'
    })
  }, [])

  const value = useMemo(
    () => ({ theme, mode, setMode, toggleTheme }),
    [mode, theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  return ctx
}

