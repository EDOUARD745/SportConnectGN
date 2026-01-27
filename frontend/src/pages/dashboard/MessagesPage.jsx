import { MessageCircle } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Messages
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
          Discute avec tes partenaires et organise tes matchs.
        </p>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
            <MessageCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Bientôt disponible
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              La messagerie arrive dans la prochaine itération du MVP.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

