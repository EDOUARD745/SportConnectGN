import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ open, message, onClose }) {
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => onClose?.(), 2400)
    return () => window.clearTimeout(id)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-start gap-3 rounded-3xl bg-white p-4 shadow-xl shadow-emerald-500/15 ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-white/10">
        <div className="mt-0.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Succès
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {message}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

