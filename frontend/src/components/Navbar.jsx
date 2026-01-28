import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ChevronDown, LayoutDashboard, Home, LogOut, Menu, Trophy, X } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const userMenuRef = useRef(null)

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    if (!userMenuOpen) return
    const onDocClick = (e) => {
      const el = userMenuRef.current
      if (!el) return
      if (!el.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [userMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileMenuOpen])

  // Ferme le menu mobile quand on scroll (home) ou quand on navigue ailleurs.
  useEffect(() => {
    if (!mobileMenuOpen) return
    const close = () => setMobileMenuOpen(false)
    const onScroll = () => close()
    const onTouchMove = () => close()
    const onWheel = () => close()
    const onResize = () => close()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    setMobileMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash])

  const mobileUserLabel = user?.email ?? user?.username ?? 'Mon compte'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-2xl bg-emerald-600 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xl shadow-emerald-500/20">
            SC
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
            SportConnectGN
          </span>
        </Link>

        {/* Mobile: header minimal (logo + actions) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Basculer le thème"
            title={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="hidden items-center gap-3 md:flex">
          <Link to="/" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Accueil
          </Link>
          <Link
            to="/trouver-partenaire"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
          >
            Trouver un partenaire
          </Link>
          <Link
            to="/activities"
            className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Activités
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
              >
                S’inscrire
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Se connecter
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Basculer le thème"
                title={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  title="Menu utilisateur"
                >
                  <span className="max-w-[160px] truncate">
                    {user?.username ?? 'Mon compte'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>

                {userMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-950/90 dark:ring-white/10">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/10"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/10"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                      Déconnexion
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Basculer le thème"
                title={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative mx-4 mt-4 overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-950/95 dark:ring-white/10"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-emerald-600 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xl shadow-emerald-500/20">
                    SC
                  </span>
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                    SportConnectGN
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    <Home className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                    Accueil
                  </Link>
                  <Link
                    to="/activities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    <Activity className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                    Activités
                  </Link>

                  <Link
                    to="/trouver-partenaire"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-600 px-3 py-3 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/20"
                  >
                    <span className="flex items-center gap-3">
                      <Trophy className="h-5 w-5" />
                      Trouver un partenaire
                    </span>
                    <span className="text-base leading-none">🤝</span>
                  </Link>
                </div>

                <div className="mt-4 rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Connecté en tant que
                      </div>
                      <div className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {mobileUserLabel}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onLogout()
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800"
                      >
                        <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-extrabold text-white shadow-xl shadow-emerald-500/20"
                      >
                        S’inscrire
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Se connecter
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

