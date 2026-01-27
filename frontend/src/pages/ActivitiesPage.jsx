import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/api.js'
import ActivityCard from '../components/ActivityCard.jsx'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function ActivitiesPage() {
  const location = useLocation()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState(() => {
    const sp = new URLSearchParams(window.location.search)
    return sp.get('q') ?? ''
  })

  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const q = sp.get('q') ?? ''
    setQuery(q)
  }, [location.search])

  useEffect(() => {
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const res = await api.get('activities/')
        const data = res.data
        const items = Array.isArray(data) ? data : data?.results ?? []
        setActivities(items)
      } catch {
        setError("Impossible de charger les activités.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Activités
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Découvre les sessions disponibles autour de toi.
          </p>
        </div>
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
            Crée des activités dans l’admin
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Puis reviens ici: la liste se met à jour.
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
                  <ActivityCard activity={a} />
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
              <ActivityCard activity={a} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

