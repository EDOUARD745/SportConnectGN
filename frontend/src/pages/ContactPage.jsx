import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')

  const mailtoHref = useMemo(() => {
    const to = 'contact@sportconnectgn.com'
    const s = subject?.trim() ? subject.trim() : 'Contact SportConnectGN'
    const body = [
      `Nom: ${name || '-'}`,
      `Email: ${email || '-'}`,
      '',
      message || '',
    ].join('\n')
    return `mailto:${to}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(body)}`
  }, [email, message, name, subject])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Merci de renseigner le nom, l’email et le message.')
      return
    }

    // MVP: pas encore de backend mail. On simule l’envoi et on propose mailto.
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 700))
    setStatus('sent')
  }

  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Parlons sport, parlons communauté.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-base text-slate-600 dark:text-slate-300"
          >
            Un bug, une idée, un partenariat (clubs, universités, entreprises) ?
            Écris-nous ici — on répond vite.
          </motion.p>

          <div className="mt-6 grid gap-3">
            {[
              { i: '🤝', t: 'Partenariats', d: 'Clubs, marques, universités.' },
              { i: '🛠️', t: 'Support', d: 'Problèmes de connexion ou d’affichage.' },
              { i: '💡', t: 'Idées produit', d: 'Améliorations MVP & features.' },
            ].map((b) => (
              <div
                key={b.t}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                    {b.i}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {b.t}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {b.d}
                    </div>
                  </div>
                </div>
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
                Contact
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                Envoyer un message
              </h2>
            </div>
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          </div>

          <form onSubmit={onSubmit} className="mt-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nom
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                required
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                required
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sujet (optionnel)
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                placeholder="Partenariat, bug, suggestion…"
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Message
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                required
              />
            </label>

            {error ? (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            ) : null}

            {status === 'sent' ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                Message prêt. Pour l’instant, clique sur “Envoyer par email” pour
                finaliser (MVP).
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 disabled:opacity-60 sm:w-auto"
              >
                {status === 'sending' ? 'Préparation…' : 'Préparer le message'}
              </motion.button>

              <a
                href={mailtoHref}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto"
              >
                Envoyer par email
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

