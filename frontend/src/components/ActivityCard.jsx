function levelLabel(value) {
  const v = `${value ?? ''}`.toLowerCase()
  if (v === 'debutant') return 'Débutant'
  if (v === 'intermediaire') return 'Intermédiaire'
  if (v === 'avance') return 'Avancé'
  if (v === 'pro') return 'Pro'
  return value ?? '—'
}

export default function ActivityCard({ activity, action }) {
  const sportName = activity?.sport?.name ?? 'Sport'
  const dateLabel = activity?.date_heure
    ? new Date(activity.date_heure).toLocaleString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Date à définir'

  const participantsCount =
    typeof activity?.participants_count === 'number' ? activity.participants_count : null
  const places =
    typeof activity?.nombre_places === 'number'
      ? activity.nombre_places
      : Number.isFinite(Number(activity?.nombre_places))
        ? Number(activity.nombre_places)
        : null
  const pct =
    participantsCount != null && places != null && places > 0
      ? Math.min(100, Math.round((participantsCount / places) * 100))
      : null

  return (
    <article className="rounded-3xl bg-white p-5 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {activity?.titre ?? 'Activité'}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{sportName}</span>
            <span className="mx-2 text-slate-300 dark:text-white/20">•</span>
            {dateLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
          {levelLabel(activity?.niveau_requis)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
          <div className="text-xs text-slate-500 dark:text-slate-400">Lieu</div>
          <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {activity?.lieu ?? '-'}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
          <div className="text-xs text-slate-500 dark:text-slate-400">Places</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {activity?.nombre_places ?? '-'}
          </div>
        </div>
      </div>

      {participantsCount != null && places != null ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold">
              {participantsCount}/{places} réservations
            </span>
            {pct != null ? <span>{pct}%</span> : null}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct ?? 0}%` }} />
          </div>
        </div>
      ) : null}

      {activity?.description ? (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  )
}

