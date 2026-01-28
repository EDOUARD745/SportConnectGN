import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { motion } from 'framer-motion'
import PasswordInput from '../components/PasswordInput.jsx'

function safeNextPath(input) {
  if (!input) return null
  if (!input.startsWith('/')) return null
  if (input.startsWith('//')) return null
  return input
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
      const next = safeNextPath(new URLSearchParams(location.search).get('next')) ?? '/'
      navigate(next)
    } catch {
      setError("Identifiants invalides ou serveur indisponible.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Reviens sur le terrain.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-base text-slate-600 dark:text-slate-300"
          >
            Connecte-toi pour créer et rejoindre des activités. Une expérience
            mobile-first, simple et rapide.
          </motion.p>

          <div className="mt-6 grid gap-3">
            {[
              { t: 'Trouve des gens au bon niveau', i: '🎯' },
              { t: 'Des lieux proches (quartier, ville)', i: '📍' },
              { t: 'Des matchs qui se remplissent vite', i: '⚡️' },
            ].map((b) => (
              <div
                key={b.t}
                className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                  {b.i}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{b.t}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Connexion
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                Accède à ton compte
              </h2>
            </div>
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          </div>

          <form onSubmit={onSubmit} className="mt-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nom d’utilisateur
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                autoComplete="username"
                required
              />
            </label>

            <div className="mt-3">
              <PasswordInput
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
              className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </motion.button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Astuce: tu peux créer un utilisateur via l’admin Django (MVP).
          </p>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Pas encore de compte ?{' '}
            <Link
              to={`/signup${location.search || ''}`}
              className="font-semibold text-emerald-700 hover:underline"
            >
              S’inscrire
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

