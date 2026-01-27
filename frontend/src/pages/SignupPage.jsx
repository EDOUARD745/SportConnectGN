import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api, getApiErrorMessage } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await api.post('auth/register/', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
        email: email.trim() || undefined,
        password,
        password_confirm: passwordConfirm,
      })

      // Auto-login après inscription
      await login(username.trim(), password)
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err))
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
            Crée ton profil et trouve ton crew.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-base text-slate-600 dark:text-slate-300"
          >
            En Guinée, le sport c’est la communauté. Rejoins SportConnectGN et
            organise tes sessions sans friction.
          </motion.p>

          <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Déjà un compte ?
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              <Link className="font-semibold text-emerald-700 hover:underline" to="/login">
                Se connecter
              </Link>
            </p>
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
                Inscription
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                Créer un compte
              </h2>
            </div>
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          </div>

          <form onSubmit={onSubmit} className="mt-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Prénom
                </span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nom
                </span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>

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

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                autoComplete="email"
                placeholder="optionnel"
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Mot de passe
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                autoComplete="new-password"
                required
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Confirmer le mot de passe
              </span>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                autoComplete="new-password"
                required
              />
            </label>

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
              {loading ? 'Création…' : 'Créer mon compte'}
            </motion.button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            En créant un compte, tu acceptes une expérience MVP (bêta).
          </p>
        </motion.div>
      </div>
    </div>
  )
}

