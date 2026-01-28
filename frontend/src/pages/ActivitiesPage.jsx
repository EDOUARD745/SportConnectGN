import { useEffect, useMemo, useState } from 'react'
import { api, getApiErrorMessage } from '../api/api.js'
import ActivityCard from '../components/ActivityCard.jsx'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import AuthModal from '../components/AuthModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Plus } from 'lucide-react'
import ActivityUpsertModal from '../components/ActivityUpsertModal.jsx'
import { Link } from 'react-router-dom'

export default function ActivitiesPage() {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sports, setSports] = useState([])
  const [reservedIds, setReservedIds] = useState(() => new Set())
  const [authOpen, setAuthOpen] = useState(false)
  const [authTitle, setAuthTitle] = useState('Connexion requise')
  const [authBody, setAuthBody] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [query, setQuery] = useState(() => {
    const sp = new URLSearchParams(window.location.search)
    return sp.get('q') ?? ''
  })

  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const q = sp.get('q') ?? ''
    setQuery(q)
  }, [location.search])

  const loadActivities = async () => {
    const res = await api.get('activities/')
    const data = res.data
    return Array.isArray(data) ? data : data?.results ?? []
  }

  const loadParticipations = async () => {
    const res = await api.get('participations/')
    const data = res.data
    const items = Array.isArray(data) ? data : data?.results ?? []
    return items
  }

  const ensureSports = async () => {
    if (sports.length) return sports
    const res = await api.get('sports/')
    const data = res.data
    const items = Array.isArray(data) ? data : data?.results ?? []
    setSports(items)
    return items
  }

  useEffect(() => {
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const items = await loadActivities()
        setActivities(items)
      } catch {
        setError("Impossible de charger les activités.")
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isBootstrapping) return
    ;(async () => {
      try {
        // Quand on se connecte/déconnecte, on recharge pour récupérer has_joined/is_full…
        const items = await loadActivities()
        setActivities(items)
        if (isAuthenticated) {
          const parts = await loadParticipations()
          setReservedIds(new Set(parts.map((p) => p.activity).filter(Boolean)))
        } else {
          setReservedIds(new Set())
        }
      } catch {
        // Silencieux: on ne veut pas polluer l’UX.
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isBootstrapping])

  const filtered = activities.filter((a) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    const hay = `${a?.titre ?? ''} ${a?.lieu ?? ''} ${a?.sport?.name ?? ''}`.toLowerCase()
    return hay.includes(q)
  })

  const demoActivities = useMemo(() => {
    const now = Date.now()
    const iso = (ms) => new Date(ms).toISOString()
    return [
      {
        id: 'demo-1',
        titre: 'Futsal ce soir',
        sport: { name: 'Football' },
        date_heure: iso(now + 6 * 60 * 60 * 1000),
        lieu: 'Nongo (Conakry)',
        nombre_places: 10,
        niveau_requis: 'intermediaire',
        description: 'Match détente, ambiance clean. Viens avec tes crampons !',
      },
      {
        id: 'demo-2',
        titre: 'Running Sunrise',
        sport: { name: 'Running' },
        date_heure: iso(now + 24 * 60 * 60 * 1000),
        lieu: 'Kipé',
        nombre_places: 8,
        niveau_requis: 'debutant',
        description: 'Course légère + étirements. Objectif: régularité.',
      },
      {
        id: 'demo-3',
        titre: 'Séance Fitness en groupe',
        sport: { name: 'Fitness' },
        date_heure: iso(now + 2 * 24 * 60 * 60 * 1000),
        lieu: 'Ratoma',
        nombre_places: 12,
        niveau_requis: 'intermediaire',
        description: 'Circuit training (HIIT doux). On s’encourage, on progresse.',
      },
      {
        id: 'demo-4',
        titre: 'Basket 3x3',
        sport: { name: 'Basket' },
        date_heure: iso(now + 3 * 24 * 60 * 60 * 1000),
        lieu: 'Dixinn',
        nombre_places: 6,
        niveau_requis: 'avance',
        description: '3x3 rapide. Niveau avancé, intensité élevée.',
      },
    ]
  }, [])

  const openAuth = ({ title, body }) => {
    setAuthTitle(title)
    setAuthBody(body)
    setAuthOpen(true)
  }

  const currentPath = `${location.pathname}${location.search || ''}`

  const onReserve = async (activity) => {
    const id = activity?.id
    if (typeof id !== 'number') {
      setToastMsg("Réservation indisponible sur un exemple (démo).")
      setToastOpen(true)
      return
    }

    if (!isAuthenticated) {
      openAuth({
        title: 'Réserver une place ?',
        body: (
          <>
            Pour réserver une place et rejoindre cette activité, tu dois créer un compte gratuit.
          </>
        ),
      })
      return
    }

    if (activity?.created_by?.id && user?.id && activity.created_by.id === user.id) {
      setToastMsg("Tu es l’organisateur: tu es déjà inscrit d’office.")
      setToastOpen(true)
      return
    }

    try {
      await api.post('participations/', { activity: id })
      setReservedIds((prev) => new Set(prev).add(id))
      setActivities((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a
          const participants = typeof a.participants_count === 'number' ? a.participants_count : 0
          const places = typeof a.nombre_places === 'number' ? a.nombre_places : null
          const nextCount = participants + 1
          return {
            ...a,
            has_joined: true,
            participants_count: nextCount,
            is_full: places != null ? nextCount >= places : a.is_full,
          }
        }),
      )
      setToastMsg('Réservation confirmée. Tu es inscrit(e) !')
      setToastOpen(true)
    } catch (e) {
      setToastMsg(getApiErrorMessage(e))
      setToastOpen(true)
    }
  }

  const onOpenCreate = async () => {
    if (!isAuthenticated) {
      openAuth({
        title: 'Proposer une activité ?',
        body: <>Pour publier une activité et recevoir des réservations, tu dois créer un compte gratuit.</>,
      })
      return
    }
    try {
      await ensureSports()
    } catch {
      // On laisse le modal s'ouvrir même si sports vide; le formulaire affichera "Aucun sport"
    }
    setCreateOpen(true)
  }

  const onCreate = async (payload) => {
    const res = await api.post('activities/', payload)
    const created = res.data
    setActivities((prev) => [created, ...prev])
    if (typeof created?.id === 'number') {
      setReservedIds((prev) => new Set(prev).add(created.id))
    }
    setToastMsg('Activité publiée. Tu es inscrit d’office comme organisateur.')
    setToastOpen(true)
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-10">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <motion.div initial={false}>
        <AuthModal open={authOpen} title={authTitle} nextPath={currentPath} onClose={() => setAuthOpen(false)}>
          {authBody}
        </AuthModal>
        <ActivityUpsertModal
          open={createOpen}
          mode="create"
          sports={sports}
          onClose={() => setCreateOpen(false)}
          onSubmit={onCreate}
        />
      </motion.div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Activités
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Découvre les sessions disponibles autour de toi.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Proposer une activité
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Rechercher
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Nongo, Running, Foot…"
              className="mt-1 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"
            />
          </label>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Astuce
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Propose & réserve
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Tu peux publier une activité et réserver une place en un clic (connexion requise).
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
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
      ) : filtered.length === 0 ? (
        query.trim() ? (
          <div className="mt-6 rounded-3xl bg-white px-5 py-5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/10">
            Aucun résultat. Essaie un autre mot-clé (quartier, sport…).
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Exemples d’activités
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  En attendant du contenu, voici des exemples réalistes (Conakry).
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {demoActivities.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                >
                  <ActivityCard
                    activity={a}
                    action={
                      <button
                        type="button"
                        onClick={() => onReserve(a)}
                        className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        Réserver (démo)
                      </button>
                    }
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 28 }}
            >
              <ActivityCard
                activity={a}
                action={
                  a?.created_by?.id && user?.id && a.created_by.id === user.id ? (
                    <Link
                      to="/dashboard/matches"
                      className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
                    >
                      Gérer dans le dashboard
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReserve(a)}
                      disabled={Boolean(a?.is_full) || Boolean(a?.has_joined) || reservedIds.has(a?.id)}
                      className={[
                        'w-full rounded-full px-4 py-2.5 text-sm font-extrabold shadow-xl transition-transform',
                        Boolean(a?.has_joined) || reservedIds.has(a?.id)
                          ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10'
                          : Boolean(a?.is_full)
                            ? 'bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-400 dark:ring-white/10'
                            : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:-translate-y-0.5',
                      ].join(' ')}
                    >
                      {Boolean(a?.has_joined) || reservedIds.has(a?.id)
                        ? 'Déjà réservé'
                        : Boolean(a?.is_full)
                          ? 'Complet'
                          : 'Réserver une place'}
                    </button>
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

