import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function safeNextPath(input) {
  if (!input) return null
  if (!input.startsWith('/')) return null
  if (input.startsWith('//')) return null
  return input
}

export default function AuthModal({
  open,
  title,
  children,
  nextPath,
  onClose,
  loginLabel = 'Se connecter',
  signupLabel = 'S’inscrire rapidement',
}) {
  if (!open) return null

  const next = safeNextPath(nextPath) ?? '/'
  const loginTo = `/login?next=${encodeURIComponent(next)}`
  const signupTo = `/signup?next=${encodeURIComponent(next)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-label="Connexion requise"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" />
        <div className="p-6">
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {title ?? 'Connexion requise'}
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{children}</div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link
              to={loginTo}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              {loginLabel}
            </Link>
            <Link
              to={signupTo}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25"
              onClick={onClose}
            >
              {signupLabel}
            </Link>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-slate-500 hover:underline dark:text-slate-300"
          >
            Pas maintenant
          </button>
        </div>
      </motion.div>
    </div>
  )
}

