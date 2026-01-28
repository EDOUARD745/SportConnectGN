import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const COOKIE_KEY = 'scgn_cookie_consent'

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const v = getCookie(COOKIE_KEY)
    if (!v) setOpen(true)
  }, [])

  const copy = useMemo(
    () => ({
      title: 'Cookies',
      body:
        'On utilise des cookies pour améliorer votre expérience (connexion, préférences, sécurité). Vous pouvez accepter ou refuser les cookies non essentiels.',
    }),
    [],
  )

  const choose = (value) => {
    setCookie(COOKIE_KEY, value, 365)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-24 sm:px-6 sm:pb-4 lg:px-10"
        >
          <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-4 shadow-2xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-950/90 dark:ring-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {copy.title}
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {copy.body}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => choose('declined')}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={() => choose('accepted')}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

