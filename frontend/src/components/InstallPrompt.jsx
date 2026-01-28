import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function isIOSDevice() {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent || ''
  return /iphone|ipad|ipod/i.test(ua)
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false
  // iOS Safari legacy
  const navStandalone = window.navigator.standalone === true
  // Standard
  const mqlStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches
  return Boolean(navStandalone || mqlStandalone)
}

/**
 * InstallPrompt
 * - Android/Desktop: utilise beforeinstallprompt (déclenchement au clic)
 * - iOS: affiche une modale d’instructions (pas de prompt programmatique)
 */
export default function InstallPrompt({
  className = '',
  children = "Télécharger l'app",
  onAfterClick,
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSHelp, setShowIOSHelp] = useState(false)

  const isIOS = useMemo(() => isIOSDevice(), [])
  const isStandalone = useMemo(() => isInStandaloneMode(), [])

  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      // On garde l’événement pour un déclenchement manuel depuis la navbar
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  const onClick = async () => {
    try {
      onAfterClick?.()
    } catch {
      // ignore
    }

    if (isStandalone) return

    // iOS: pas de prompt, on affiche un guide
    if (isIOS) {
      setShowIOSHelp(true)
      return
    }

    // Android/Desktop
    if (deferredPrompt) {
      deferredPrompt.prompt()
      try {
        await deferredPrompt.userChoice
      } finally {
        setDeferredPrompt(null)
      }
      return
    }

    // Non installable (criteria non atteints / déjà installé)
    // On donne une info légère via la même modale iOS (copy générique).
    setShowIOSHelp(true)
  }

  return (
    <>
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>

      <AnimatePresence>
        {showIOSHelp ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
              onClick={() => setShowIOSHelp(false)}
              aria-label="Fermer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-950/95 dark:ring-white/10"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <div className="px-5 py-4">
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Installer SportConnectGN
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {isIOS ? (
                    <>
                      Sur iPhone/iPad, l’installation se fait via Safari.
                      <br />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Pour installer :
                      </span>{' '}
                      appuie sur{' '}
                      <span className="font-semibold">Partager</span> (carré avec flèche) puis sur{' '}
                      <span className="font-semibold">“Sur l’écran d’accueil”</span>.
                    </>
                  ) : (
                    <>
                      Si le bouton d’installation ne s’affiche pas, vérifie que tu es bien en{' '}
                      <span className="font-semibold">HTTPS</span> (ou en local), et que le site a été
                      visité quelques secondes.
                    </>
                  )}
                </p>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIOSHelp(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

