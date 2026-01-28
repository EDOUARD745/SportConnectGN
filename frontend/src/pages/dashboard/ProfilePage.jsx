import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../api/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Toast from '../../components/Toast.jsx'

const COMMUNES = ['Kaloum', 'Dixinn', 'Ratoma', 'Matoto', 'Matam']
const SPORTS = ['Football', 'Running', 'Basketball', 'Fitness']

function levelLabel(value) {
  const map = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    pro: 'Semi-Pro',
  }
  return map[value] ?? 'Débutant'
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
      aria-pressed={checked}
    >
      <span
        className={[
          'relative inline-flex h-7 w-12 items-center rounded-full transition',
          checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-white/10',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-6 w-6 translate-x-0 rounded-full bg-white shadow transition',
            checked ? 'translate-x-5' : 'translate-x-1',
          ].join(' ')}
        />
      </span>
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </span>
    </button>
  )
}

export default function ProfilePage() {
  const { user, logout, refreshMe } = useAuth()
  const navigate = useNavigate()

  // Mock data (à brancher à l’API plus tard)
  const initial = useMemo(
    () => ({
      fullName:
        [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
        'Edouard Diallo',
      username: user?.username || 'edouard',
      level: user?.niveau_sportif || 'debutant',
      available: true,
      bio:
        user?.bio ||
        "Sportif motivé. J’aime les matchs propres et l’ambiance respectueuse.",
      commune: 'Ratoma',
      quartier: user?.quartier || 'Kipé',
      sports: ['Football', 'Running'],
      avatar:
        user?.photo_profil ||
        'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=240&h=240&q=80&crop=faces',
    }),
    [user],
  )

  const [avatarUrl, setAvatarUrl] = useState(initial.avatar)
  const [avatarFile, setAvatarFile] = useState(null)
  const [available, setAvailable] = useState(initial.available)
  const [bio, setBio] = useState(initial.bio)
  const [commune, setCommune] = useState(user?.ville || initial.commune)
  const [quartier, setQuartier] = useState(initial.quartier)
  const [sports, setSports] = useState(initial.sports)
  const [toastOpen, setToastOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dangerOpen, setDangerOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [saveError, setSaveError] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    // Si le user change (refreshMe), on resynchronise l’avatar affiché.
    setAvatarUrl(initial.avatar)
  }, [initial.avatar])

  const toggleSport = (s) => {
    setSports((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  const onPickPhoto = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaveError('')
    setSaving(true)
    try {
      const form = new FormData()
      form.append('bio', bio ?? '')
      form.append('quartier', quartier ?? '')
      // On mappe "commune" -> "ville" (champ backend) pour l’instant (MVP)
      form.append('ville', commune ?? '')
      if (avatarFile) form.append('photo_profil', avatarFile)

      await api.patch('users/me/', form)
      await refreshMe()
      setAvatarFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setToastOpen(true)
    } catch (err) {
      setSaveError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onDeleteAccount = async () => {
    setDeleteError('')
    setDeleteLoading(true)
    try {
      await api.delete('users/me/')
      logout()
      navigate('/')
    } catch (e) {
      setDeleteError(getApiErrorMessage(e))
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <Toast
        open={toastOpen}
        message="Profil mis à jour avec succès."
        onClose={() => setToastOpen(false)}
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Mon Profil
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Gère tes infos et ton statut pour trouver un match plus vite.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* A. Carte d'identité */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-white shadow-xl"
                />
                <button
                  type="button"
                  onClick={onPickPhoto}
                  className="absolute -bottom-2 -right-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-950/70 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800"
                >
                  Changer
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                  <div className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {initial.fullName}
                  </div>
                </div>
                <div className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                  @{initial.username}
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                  {levelLabel(initial.level)}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Switch
                checked={available}
                onChange={setAvailable}
                label="Dispo pour un match"
              />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-semibold">{commune}</span>
                  <span className="mx-2 text-slate-300 dark:text-white/20">•</span>
                  {quartier || 'Quartier'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* B. Formulaire d'édition */}
        <div className="lg:col-span-2">
          <form
            onSubmit={onSave}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Bio
                  </span>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-1 min-h-[120px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                    placeholder="Présente-toi en quelques lignes…"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Commune
                  </span>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                  >
                    {COMMUNES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Quartier
                  </span>
                  <input
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                    placeholder="Ex: Kipé, Lambanyi…"
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Sports préférés
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPORTS.map((s) => {
                    const selected = sports.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSport(s)}
                        className={[
                          'rounded-full px-4 py-2 text-sm font-semibold ring-1 transition',
                          selected
                            ? 'bg-emerald-600 text-white ring-emerald-600 shadow-xl shadow-emerald-500/20'
                            : 'bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-slate-950/40 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800',
                        ].join(' ')}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Astuce: plus ton profil est complet, plus tu matches vite.
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </button>
            </div>

            {saveError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 whitespace-pre-line">
                {saveError}
              </div>
            ) : null}
          </form>

          {/* Zone dangereuse */}
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-500/20 dark:bg-red-500/10">
            <div className="text-sm font-extrabold text-red-900 dark:text-red-200">
              Zone dangereuse
            </div>
            <div className="mt-2 text-sm text-red-800 dark:text-red-200">
              Supprimer ton compte est irréversible. Tes données seront supprimées.
            </div>
            <button
              type="button"
              onClick={() => setDangerOpen(true)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-red-500/20 hover:-translate-y-0.5 transition-transform disabled:opacity-60"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      {/* Modal confirmation suppression */}
      {dangerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleteLoading && setDangerOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Confirmer la suppression
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Cette action est définitive. Es-tu sûr de vouloir supprimer ton compte
              ?
            </div>

            {deleteError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 whitespace-pre-line">
                {deleteError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDangerOpen(false)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={onDeleteAccount}
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-red-500/20 disabled:opacity-60"
              >
                {deleteLoading ? 'Suppression…' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

