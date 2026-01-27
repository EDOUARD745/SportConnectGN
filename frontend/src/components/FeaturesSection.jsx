import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import TestimonialsSection from './TestimonialsSection.jsx'

function LogoCloud() {
  const items = useMemo(
    () => ['Orange GN', 'Vivo Energy', 'Université Gamal', 'MTN', 'Canal+', 'UAG'],
    [],
  )

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
        <div className="px-5 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ils nous font confiance (bientôt)
          </p>
        </div>

        <div className="relative overflow-hidden px-5 pb-5 pt-3 mask-fade-x">
          <div className="marquee gap-3">
            {[...items, ...items].map((name, idx) => (
              <div
                key={`${name}-${idx}`}
                className="flex h-10 items-center rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-400 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:text-slate-300 dark:ring-white/10"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { label: 'Sportifs motivés', value: '1 200+' },
    { label: 'Quartiers couverts', value: '35+' },
    { label: 'Temps pour organiser', value: '2 min' },
    { label: 'Vibe', value: '100% humaine' },
  ]

  return (
    <section className="w-full px-4 pt-6 sm:px-6 lg:px-10">
      <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-5 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
            <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {s.value}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 500, damping: 26 },
    },
  }

  const cards = [
    {
      emoji: '👤',
      title: 'Crée ton profil',
      desc: 'Ville, quartier, niveau. On te match avec des gens compatibles.',
    },
    {
      emoji: '🗺️',
      title: 'Trouve une activité',
      desc: 'Foot, running, fitness… à côté de chez toi et au bon niveau.',
    },
    {
      emoji: '🔥',
      title: 'Transpire ensemble',
      desc: 'Rejoins, discute, et retrouve le groupe sur le terrain.',
    },
  ]

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Comment ça marche
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Une expérience simple, mobile-first, pensée pour aller vite: tu
            trouves des gens, tu rejoins, tu joues.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 gap-4"
        >
          {cards.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              className="rounded-3xl bg-white p-5 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 text-2xl ring-1 ring-slate-200 dark:from-emerald-500/10 dark:to-amber-500/10 dark:ring-white/10">
                  {c.emoji}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LiveActivity() {
  const [players, setPlayers] = useState(8)
  const capacity = 10

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlayers((p) => {
        if (p >= capacity) return 6 // loop démo
        return p + 1
      })
    }, 2200)
    return () => window.clearInterval(id)
  }, [])

  const pct = Math.round((players / capacity) * 100)

  return (
    <section className="w-full px-4 pb-14 pt-2 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Live Activity
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Une vue “temps réel” qui montre les matchs qui se remplissent.
            Rejoins avant que ce soit complet.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20">
            ⚡️ {players}/{capacity} joueurs — ça bouge maintenant
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="rounded-3xl bg-white p-5 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ce soir
              </p>
              <h3 className="mt-1 truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                Futsal ce soir — Nongo
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Niveau: Intermédiaire • Terrain: urbain
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
              Places limitées
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {players}/{capacity} joueurs
              </span>
              <span className="text-slate-600 dark:text-slate-300">{pct}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10">
              <motion.div
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="h-full rounded-full bg-emerald-600"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="text-xs text-slate-500 dark:text-slate-400">Heure</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">20:00</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="text-xs text-slate-500 dark:text-slate-400">Zone</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">Conakry</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function FeaturesSection() {
  return (
    <div>
      <Stats />
      <LogoCloud />
      <HowItWorks />
      <LiveActivity />
      <TestimonialsSection />
    </div>
  )
}

