import { motion } from 'framer-motion'

export default function ConfirmModal({
  open,
  title = 'Confirmer',
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/55" onClick={() => !loading && onClose?.()} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{title}</div>
        {description ? (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={[
              'rounded-full px-5 py-3 text-sm font-extrabold shadow-xl disabled:opacity-60',
              danger
                ? 'bg-red-600 text-white shadow-red-500/20'
                : 'bg-emerald-500 text-slate-950 shadow-emerald-500/25',
            ].join(' ')}
          >
            {loading ? 'Traitement…' : confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

