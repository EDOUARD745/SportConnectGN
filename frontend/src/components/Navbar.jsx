import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

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

        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm md:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-3 md:flex">
          <Link to="/" className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Accueil
          </Link>
          <Link
            to="/activities"
            className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Activités
          </Link>
          <Link
            to="/contact"
            className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Contact
          </Link>

          <Link
            to="/#download"
            className="hidden rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-xl shadow-amber-500/20 transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Télécharger l’app
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
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {user?.username ?? 'Moi'}
              </span>
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
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={onLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-slate-200/70 md:hidden dark:border-white/10">
          <div className="w-full px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="block py-2 text-sm text-slate-800 dark:text-slate-100"
              onClick={() => setOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/activities"
              className="block py-2 text-sm text-slate-800 dark:text-slate-100"
              onClick={() => setOpen(false)}
            >
              Activités
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-sm text-slate-800 dark:text-slate-100"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/#download"
              className="mt-2 block rounded-full bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-xl shadow-amber-500/20"
              onClick={() => setOpen(false)}
            >
              Télécharger l’app
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="mt-2 block rounded-full bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-xl shadow-emerald-500/20"
                  onClick={() => setOpen(false)}
                >
                  S’inscrire
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                    aria-label="Basculer le thème"
                    title={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
                  >
                    {theme === 'dark' ? '☀️' : '🌙'}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                >
                  Déconnexion
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                  aria-label="Basculer le thème"
                  title={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

