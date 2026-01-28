import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { getApiErrorMessage } from '../api/api.js'

const LEVELS = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
  { value: 'pro', label: 'Pro' },
]

function toDateTimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ActivityUpsertModal({
  open,
  mode, // 'create' | 'edit'
  sports,
  initialActivity,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit'

  const defaults = useMemo(() => {
    const a = initialActivity ?? null
    const sportId =
      typeof a?.sport?.id === 'number'
        ? String(a.sport.id)
        : sports?.[0]?.id
          ? String(sports[0].id)
          : ''

    return {
      titre: a?.titre ?? '',
      sportId,
      dateTime: toDateTimeLocal(a?.date_heure),
      lieu: a?.lieu ?? '',
      places: typeof a?.nombre_places === 'number' ? a.nombre_places : 10,
      niveau: a?.niveau_requis ?? 'intermediaire',
      description: a?.description ?? '',
    }
  }, [initialActivity, sports])

  const [titre, setTitre] = useState(defaults.titre)
  const [sportId, setSportId] = useState(defaults.sportId)
  const [dateTime, setDateTime] = useState(defaults.dateTime)
  const [lieu, setLieu] = useState(defaults.lieu)
  const [places, setPlaces] = useState(defaults.places)
  const [niveau, setNiveau] = useState(defaults.niveau)
  const [description, setDescription] = useState(defaults.description)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    setLoading(false)
    setTitre(defaults.titre)
    setSportId(defaults.sportId)
    setDateTime(defaults.dateTime)
    setLieu(defaults.lieu)
    setPlaces(defaults.places)
    setNiveau(defaults.niveau)
    setDescription(defaults.description)
  }, [open, defaults])

  const canSubmit = titre.trim() && sportId && dateTime && lieu.trim() && Number(places) > 0

  const submit = async () => {
    setError('')
    if (!canSubmit) return
    setLoading(true)
    try {
      const iso = new Date(dateTime).toISOString()
      const payload = {
        titre: titre.trim(),
        sport_id: Number(sportId),
        date_heure: iso,
        lieu: lieu.trim(),
        nombre_places: Number(places),
        niveau_requis: niveau,
        description: description.trim(),
      }
      await onSubmit(payload)
      onClose?.()
    } catch (e) {
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !loading && onClose?.()} />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 520, damping: 28 }}
            className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-label={isEdit ? 'Modifier une activité' : 'Proposer une activité'}
          >
            <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {isEdit ? 'Modifier mon activité' : 'Proposer une activité'}
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {isEdit
                ? 'Mets à jour les infos: titre, lieu, horaire, places…'
                : 'Tu crées la session, et les autres peuvent réserver une place.'}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Titre
                </span>
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Five à Nongo (20h)"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Sport
                </span>
                <div className="relative mt-1">
                  <select
                    value={sportId}
                    onChange={(e) => setSportId(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                  >
                    {sports?.length ? (
                      sports.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Aucun sport</option>
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Niveau
                </span>
                <div className="relative mt-1">
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Lieu
                </span>
                <input
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  placeholder="Ex: Stade de Nongo"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Date / Heure
                </span>
                <input
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  type="datetime-local"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Places
                </span>
                <input
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                  type="number"
                  min="2"
                  max="50"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Description (optionnel)
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ex: Match détente, ambiance clean…"
                  className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 whitespace-pre-line">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!canSubmit || loading}
                onClick={submit}
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 disabled:opacity-60"
              >
                {loading ? (isEdit ? 'Sauvegarde…' : 'Création…') : isEdit ? 'Enregistrer' : 'Publier'}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

