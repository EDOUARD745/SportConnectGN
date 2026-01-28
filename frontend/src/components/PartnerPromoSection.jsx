import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BadgeCheck, Lock, MapPin } from 'lucide-react'

const PROFILES = [
  {
    id: 'hp-p1',
    firstName: 'Moussa',
    lastName: 'Camara',
    sport: 'Football',
    level: 'Intermédiaire',
    commune: 'Ratoma',
    quartier: 'Nongo',
    reliability: 95,
    photo:
      'https://images.unsplash.com/photo-1688120320082-f23f0c1425be?auto=format&fit=crop&w=500&q=80&crop=faces',
  },
  {
    id: 'hp-p2',
    firstName: 'Aïssatou',
    lastName: 'Bah',
    sport: 'Running',
    level: 'Débutant',
    commune: 'Dixinn',
    quartier: 'Kipé',
    reliability: 92,
    photo:
      'https://images.unsplash.com/photo-1615891081220-9116de3e1afd?auto=format&fit=crop&w=500&q=80&crop=faces',
  },
  {
    id: 'hp-p3',
    firstName: 'Ibrahima',
    lastName: 'Diallo',
    sport: 'Fitness',
    level: 'Avancé',
    commune: 'Matoto',
    quartier: 'Enta',
    reliability: 88,
    photo:
      'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=500&q=80&crop=faces',
  },
]

export default function PartnerPromoSection() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              Produit d’appel
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Trouver un partenaire, sans perdre de temps.
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Des profils “scout report” (sport, niveau, quartier). Tu peux explorer librement.
              Pour proposer une séance, il faut un compte gratuit.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:text-slate-200 dark:ring-white/10">
                <Lock className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                Invitation = connexion
              </span>
              <span className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                🤝 Utilitaire, pas dating
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                to="/trouver-partenaire"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
              >
                Voir les profils disponibles
              </Link>
              <Link
                to="/signup?next=%2Ftrouver-partenaire"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Créer un compte (rapide)
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1"
          >
            {PROFILES.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ type: 'spring', stiffness: 520, damping: 28, delay: 0.03 * idx }}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.photo}
                    alt={`${p.firstName} ${p.lastName}`}
                    className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {p.firstName}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {p.reliability}%
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      👟 {p.sport} • 🎯 {p.level}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.commune} • {p.quartier}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

