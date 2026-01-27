import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'

export default function MyMatchesPage() {
  // Mock data (à remplacer par API)
  const matches = []

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Mes Matchs
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Retrouve tes activités à venir et ton historique.
          </p>
        </div>
        <Link
          to="/activities"
          className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform sm:inline-flex"
        >
          Trouver un match
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
              <CalendarDays className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Aucun match enregistré
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Rejoins une activité pour la voir apparaître ici.
              </div>
              <Link
                to="/activities"
                className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Trouver un match
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">{/* TODO */}</div>
      )}
    </div>
  )
}

