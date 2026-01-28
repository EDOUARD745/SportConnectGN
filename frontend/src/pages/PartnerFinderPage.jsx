import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BadgeCheck, ChevronDown, Handshake, MapPin, X } from 'lucide-react'
import Toast from '../components/Toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import AuthModal from '../components/AuthModal.jsx'

const COMMUNES = ['Kaloum', 'Dixinn', 'Ratoma', 'Matoto', 'Matam']
const SPORTS = ['Football', 'Running', 'Basketball', 'Fitness']
const LEVELS = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
]

function levelLabel(value) {
  return LEVELS.find((l) => l.value === value)?.label ?? 'Débutant'
}

function safeNextPath(input) {
  if (!input) return null
  if (!input.startsWith('/')) return null
  if (input.startsWith('//')) return null
  return input
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:text-slate-200 dark:ring-white/10">
      {children}
    </span>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
        {label}
      </span>
      <div className="relative mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm font-semibold text-slate-900 shadow-sm outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
      </div>
    </label>
  )
}

function ProposalModal({ open, partner, onClose, onSend }) {
  const [activity, setActivity] = useState('Football')
  const [place, setPlace] = useState('')
  const [when, setWhen] = useState('')
  const [message, setMessage] = useState('')

  if (!open || !partner) return null

  const canSend = activity && place.trim() && when

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-label="Proposer une session"
      >
        <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          Proposer une session à {partner.firstName}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Donne un contexte clair (activité, lieu, horaire). Simple et utilitaire.
        </p>

        <div className="mt-5 grid gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Activité
            </span>
            <div className="relative mt-1">
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Lieu
            </span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Ex: Stade de Nongo"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Date / Heure
            </span>
            <input
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              type="datetime-local"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Message (optionnel)
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Salut, ça te dit un 5vs5 ?"
              className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={() => onSend({ activity, place: place.trim(), when, message: message.trim() })}
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 disabled:opacity-60"
          >
            Envoyer l’invitation
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function PartnerFinderPage() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Mock data réaliste (Guinée) — à brancher à l’API plus tard
  const partners = useMemo(
    () => [
      {
        id: 'p1',
        firstName: 'Moussa',
        lastName: 'Camara',
        sport: 'Football',
        level: 'intermediaire',
        commune: 'Ratoma',
        quartier: 'Nongo',
        reliability: 95,
        availability: 'Soir & Week-end',
        objective: 'Cherche gardien pour five à Nongo (20h).',
        photo:
          'https://images.unsplash.com/photo-1688120320082-f23f0c1425be?auto=format&fit=crop&w=500&q=80&crop=faces',
      },
      {
        id: 'p2',
        firstName: 'Aïssatou',
        lastName: 'Bah',
        sport: 'Running',
        level: 'debutant',
        commune: 'Dixinn',
        quartier: 'Kipé',
        reliability: 92,
        availability: 'Matin (6h-8h)',
        objective: 'Je veux courir 5–7km le dimanche matin à Kipé.',
        photo:
          'https://images.unsplash.com/photo-1615891081220-9116de3e1afd?auto=format&fit=crop&w=500&q=80&crop=faces',
      },
      {
        id: 'p3',
        firstName: 'Ibrahima',
        lastName: 'Diallo',
        sport: 'Fitness',
        level: 'avance',
        commune: 'Matoto',
        quartier: 'Enta',
        reliability: 88,
        availability: 'Soir (18h-21h)',
        objective: 'Cherche partenaire salle: HIIT + renfo 3x/semaine.',
        photo:
          'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=500&q=80&crop=faces',
      },
      {
        id: 'p4',
        firstName: 'Fatou',
        lastName: 'Sylla',
        sport: 'Basketball',
        level: 'expert',
        commune: 'Kaloum',
        quartier: 'Tombo',
        reliability: 90,
        availability: 'Mercredi & Samedi',
        objective: 'Cherche 1 coéquipier pour drill + 3x3 (niveau élevé).',
        photo:
          'https://images.unsplash.com/photo-1754774674834-d3fde3387e4d?auto=format&fit=crop&w=500&q=80&crop=faces',
      },
    ],
    [],
  )

  const [sport, setSport] = useState('all')
  const [level, setLevel] = useState('all')
  const [commune, setCommune] = useState('all')

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const [authOpen, setAuthOpen] = useState(false)
  const [proposalOpen, setProposalOpen] = useState(false)
  const [activePartner, setActivePartner] = useState(null)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('Invitation envoyée.')

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (sport !== 'all' && p.sport !== sport) return false
      if (level !== 'all' && p.level !== level) return false
      if (commune !== 'all' && p.commune !== commune) return false
      return true
    })
  }, [commune, level, partners, sport])

  const current = filtered[index] ?? null
  const next = filtered[index + 1] ?? null

  const resetStack = () => {
    setIndex(0)
    setDirection(0)
  }

  const advance = (dir) => {
    setDirection(dir)
    setIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
  }

  const onPass = () => {
    if (!current) return
    if (index >= filtered.length - 1) return
    advance(-1)
  }

  const onInviteAttempt = (partner) => {
    if (!partner) return
    setActivePartner(partner)
    if (!isAuthenticated) {
      setAuthOpen(true)
      return
    }
    setProposalOpen(true)
  }

  const onSendProposal = (payload) => {
    setProposalOpen(false)
    const partner = activePartner ?? current
    const label = payload?.activity ? `${payload.activity} • ${payload.place}` : 'invitation'
    setToastMsg(`Invitation envoyée à ${partner?.firstName ?? ''} — ${label}.`)
    setToastOpen(true)
    if (index < filtered.length - 1) advance(1)
  }

  const cardVariants = {
    enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 80 : -80, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -240 : 240, scale: 0.98 }),
  }

  const nextPath = safeNextPath(new URLSearchParams(location.search).get('next')) ?? location.pathname

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Live • Conakry
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Ils cherchent des coéquipiers à Conakry en ce moment…
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Parcours les profils librement. Pour proposer une séance, on te demandera de te connecter.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-3 dark:bg-slate-900/70 dark:ring-white/10">
        <Select
          label="Sport"
          value={sport}
          onChange={(v) => {
            setSport(v)
            resetStack()
          }}
          options={[{ value: 'all', label: 'Tous' }, ...SPORTS.map((s) => ({ value: s, label: s }))]}
        />
        <Select
          label="Niveau"
          value={level}
          onChange={(v) => {
            setLevel(v)
            resetStack()
          }}
          options={[{ value: 'all', label: 'Tous' }, ...LEVELS]}
        />
        <Select
          label="Commune"
          value={commune}
          onChange={(v) => {
            setCommune(v)
            resetStack()
          }}
          options={[{ value: 'all', label: 'Toutes' }, ...COMMUNES.map((c) => ({ value: c, label: c }))]}
        />
      </div>

      {/* Stack */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative min-h-[440px]">
            {/* carte suivante (fond) */}
            {next ? (
              <div className="absolute inset-0 translate-y-2 scale-[0.98]">
                <div className="h-full rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-white/10" />
              </div>
            ) : null}

            <AnimatePresence initial={false} custom={direction}>
              {current ? (
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.08}
                  onDragEnd={(_, info) => {
                    if (authOpen || proposalOpen) return
                    if (info.offset.x < -90) onPass()
                    if (info.offset.x > 110) onInviteAttempt(current)
                  }}
                >
                  <div className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
                    {/* header */}
                    <div className="flex items-start gap-4">
                      <img
                        src={current.photo}
                        alt={`${current.firstName} ${current.lastName}`}
                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">
                            {current.firstName} {current.lastName}
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                            <BadgeCheck className="h-4 w-4" />
                            Fiabilité {current.reliability}%
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Chip>👟 {current.sport}</Chip>
                          <Chip>🎯 {levelLabel(current.level)}</Chip>
                          <Chip>
                            <MapPin className="mr-1 h-3.5 w-3.5" />
                            {current.commune} • {current.quartier}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    {/* body */}
                    <div className="mt-5 grid gap-4">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                          Disponibilités
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {current.availability}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                          Mon objectif
                        </div>
                        <div className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                          “{current.objective}”
                        </div>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={onPass}
                        disabled={index >= filtered.length - 1}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        <X className="h-4 w-4" />
                        Passer
                      </button>
                      <button
                        type="button"
                        onClick={() => onInviteAttempt(current)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 transition-transform hover:-translate-y-0.5"
                      >
                        <Handshake className="h-4 w-4" />
                        Go
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Aucun profil ne correspond à ces filtres.
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Ajuste tes critères ou réinitialise.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSport('all')
                      setLevel('all')
                      setCommune('all')
                      resetStack()
                    }}
                    className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* panneau “scout tips” */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Scout Notes
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              🤝 Ici on recrute un coéquipier. Regarde surtout le niveau, le lieu et l’objectif.
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                <div className="font-semibold text-slate-900 dark:text-slate-100">👋 Astuce</div>
                <div className="mt-1 text-slate-600 dark:text-slate-300">
                  Clique sur “Go” pour envoyer une invitation contextualisée.
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                <div className="font-semibold text-slate-900 dark:text-slate-100">👟 Swipe sobre</div>
                <div className="mt-1 text-slate-600 dark:text-slate-300">
                  Glisse à gauche pour passer. À droite pour proposer (connexion requise).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {authOpen ? (
          <AuthModal
            open={authOpen}
            nextPath={safeNextPath(nextPath) ?? '/trouver-partenaire'}
            onClose={() => setAuthOpen(false)}
            title="Tu as trouvé le partenaire idéal ?"
          >
            Pour contacter{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {activePartner?.firstName ?? 'ce sportif'}
            </span>{' '}
            et organiser une séance, tu dois créer un compte gratuit.
          </AuthModal>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {proposalOpen ? (
          <ProposalModal
            open={proposalOpen}
            partner={activePartner}
            onClose={() => setProposalOpen(false)}
            onSend={onSendProposal}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

