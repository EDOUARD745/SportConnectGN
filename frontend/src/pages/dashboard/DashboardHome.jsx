import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Activity, Star, Trophy } from 'lucide-react'

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </div>
          {helper ? (
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {helper}
            </div>
          ) : null}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
          <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.first_name?.trim() || user?.username || 'sportif'

  // Mock data (à remplacer par API)
  const stats = [
    { icon: Trophy, label: 'Matchs joués', value: '12', helper: 'Ce mois-ci: 2' },
    { icon: Star, label: 'Note moyenne', value: '4.7', helper: 'Basée sur 19 avis' },
    { icon: Activity, label: 'Fiabilité', value: '92%', helper: 'Présence régulière' },
  ]

  const upcoming = [] // TODO: via API (activités à venir)

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Prêt pour un match aujourd’hui ? Voici ton tableau de bord.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Tes matchs à venir
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Les prochaines activités auxquelles tu participes.
            </p>
          </div>
          <Link
            to="/activities"
            className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform sm:inline-flex"
          >
            Trouver un match
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <div className="text-sm text-slate-700 dark:text-slate-200">
              Aucun match prévu pour le moment.
            </div>
            <Link
              to="/activities"
              className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Trouver un match
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* TODO: list upcoming cards */}
          </div>
        )}
      </div>
    </div>
  )
}

