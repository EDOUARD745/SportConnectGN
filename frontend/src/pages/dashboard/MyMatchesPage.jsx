import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarDays, ClipboardList, Flag, Pencil, Trash2 } from 'lucide-react'
import { api, getApiErrorMessage } from '../../api/api.js'
import ActivityCard from '../../components/ActivityCard.jsx'
import Toast from '../../components/Toast.jsx'
import ActivityUpsertModal from '../../components/ActivityUpsertModal.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'

function toMs(iso) {
  const t = iso ? Date.parse(iso) : NaN
  return Number.isFinite(t) ? t : null
}

export default function MyMatchesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [participations, setParticipations] = useState([])
  const [myActivities, setMyActivities] = useState([])
  const [sports, setSports] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [editActivity, setEditActivity] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteActivity, setDeleteActivity] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const [partsRes, mineRes] = await Promise.all([
          api.get('participations/'),
          api.get('activities/mine/'),
        ])

        const partsData = partsRes.data
        const partsItems = Array.isArray(partsData) ? partsData : partsData?.results ?? []
        setParticipations(partsItems)

        const mineData = mineRes.data
        const mineItems = Array.isArray(mineData) ? mineData : mineData?.results ?? []
        setMyActivities(mineItems)
      } catch (e) {
        setError(getApiErrorMessage(e))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const ensureSports = async () => {
    if (sports.length) return sports
    const res = await api.get('sports/')
    const data = res.data
    const items = Array.isArray(data) ? data : data?.results ?? []
    setSports(items)
    return items
  }

  const onCancel = async (participationId) => {
    try {
      await api.delete(`participations/${participationId}/`)
      setParticipations((prev) => prev.filter((p) => p.id !== participationId))
      setToastMsg('Réservation annulée.')
      setToastOpen(true)
    } catch (e) {
      setToastMsg(getApiErrorMessage(e))
      setToastOpen(true)
    }
  }

  const onOpenEdit = async (activity) => {
    if (!activity) return
    try {
      await ensureSports()
    } catch {
      // ok
    }
    setEditActivity(activity)
    setEditOpen(true)
  }

  const onUpdate = async (payload) => {
    const id = editActivity?.id
    if (typeof id !== 'number') return
    const res = await api.patch(`activities/${id}/`, payload)
    const updated = res.data
    setMyActivities((prev) => prev.map((a) => (a.id === id ? updated : a)))
    setToastMsg('Activité mise à jour.')
    setToastOpen(true)
  }

  const onAskDelete = (activity) => {
    if (!activity) return
    setDeleteActivity(activity)
    setDeleteOpen(true)
  }

  const onDelete = async () => {
    const id = deleteActivity?.id
    if (typeof id !== 'number') return
    setDeleteLoading(true)
    try {
      await api.delete(`activities/${id}/`)
      setMyActivities((prev) => prev.filter((a) => a.id !== id))
      setToastMsg('Activité supprimée.')
      setToastOpen(true)
      setDeleteOpen(false)
      setDeleteActivity(null)
    } catch (e) {
      setToastMsg(getApiErrorMessage(e))
      setToastOpen(true)
    } finally {
      setDeleteLoading(false)
    }
  }

  const nowMs = Date.now()
  const upcomingReservations = participations
    .filter((p) => {
      const ms = toMs(p?.activity_detail?.date_heure)
      return ms != null ? ms >= nowMs : true
    })
    .sort((a, b) => (toMs(a?.activity_detail?.date_heure) ?? 0) - (toMs(b?.activity_detail?.date_heure) ?? 0))

  const upcomingMine = myActivities
    .filter((a) => {
      const ms = toMs(a?.date_heure)
      return ms != null ? ms >= nowMs : true
    })
    .sort((a, b) => (toMs(a?.date_heure) ?? 0) - (toMs(b?.date_heure) ?? 0))

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <ActivityUpsertModal
        open={editOpen}
        mode="edit"
        sports={sports}
        initialActivity={editActivity}
        onClose={() => {
          setEditOpen(false)
          setEditActivity(null)
        }}
        onSubmit={onUpdate}
      />
      <ConfirmModal
        open={deleteOpen}
        title="Supprimer ce match ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        loading={deleteLoading}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        onConfirm={onDelete}
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Mes Matchs
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Deux vues: tes matchs que tu organises et tes réservations à venir.
          </p>
        </div>
        <Link
          to="/activities"
          className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform sm:inline-flex"
        >
          Trouver un match
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* A. Mes matchs (organisés) */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Mes matchs (organisés)
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Les activités que tu as publiées et qui arrivent bientôt.
                </p>
              </div>
              <Link
                to="/activities"
                className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800 sm:inline-flex"
              >
                Proposer
              </Link>
            </div>

            {upcomingMine.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                    <ClipboardList className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Aucun match organisé
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Propose une activité pour rassembler des joueurs.
                    </div>
                    <Link
                      to="/activities"
                      className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
                    >
                      Proposer une activité
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4">
                {upcomingMine.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    action={
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(a)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => onAskDelete(a)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 shadow-sm hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/15"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* B. Mes réservations à venir */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Mes activités réservées (à venir)
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Les sessions que tu as rejointes et qui arrivent bientôt.
                </p>
              </div>
              <Link
                to="/activities"
                className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform sm:inline-flex"
              >
                Réserver
              </Link>
            </div>

            {upcomingReservations.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                    <CalendarDays className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Aucune réservation à venir
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Rejoins une activité pour la voir apparaître ici.
                    </div>
                    <Link
                      to="/activities"
                      className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Trouver une activité
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4">
                {upcomingReservations.map((p) => {
                  const activity = p.activity_detail
                  return (
                    <ActivityCard
                      key={p.id}
                      activity={activity}
                      action={
                        <button
                          type="button"
                          onClick={() => onCancel(p.id)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                          Annuler la réservation
                        </button>
                      }
                    />
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

