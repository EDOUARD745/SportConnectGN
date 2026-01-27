import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function SportsSection() {
  const sports = useMemo(
    () => [
      {
        name: 'Football',
        emoji: '⚽️',
        img: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Running',
        emoji: '🏃‍♂️',
        img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fitness',
        emoji: '💪',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Basket',
        emoji: '🏀',
        img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
      },
    ],
    [],
  )

  const item = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 520, damping: 28 },
    },
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Les sports les plus vivants
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Choisis ton vibe. On s’occupe de te connecter au bon groupe.
          </p>
        </div>
        <div className="hidden rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20 md:inline-flex">
          🇬🇳 Conakry • Ratoma • Dixinn • Matam…
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sports.map((s) => (
          <motion.div
            key={s.name}
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
          >
            <img
              src={s.img}
              alt={s.name}
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-slate-950/70" />
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {s.name}
                </div>
                <div className="text-xl">{s.emoji}</div>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Trouve des partenaires au bon niveau, près de toi.
              </p>
              <Link
                to={`/activities?q=${encodeURIComponent(s.name)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20"
              >
                Explorer
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

