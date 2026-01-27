import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function TestimonialsSection() {
  const testimonials = useMemo(
    () => [
      {
        name: 'Aïssatou',
        role: 'Running • Kipé',
        quote:
          'En 2 minutes j’ai trouvé un groupe pour courir le matin. Ambiance bienveillante et régulière.',
        avatar:
          'https://images.unsplash.com/photo-1615891081220-9116de3e1afd?auto=format&fit=crop&w=200&h=200&q=80&crop=faces',
      },
      {
        name: 'Moussa',
        role: 'Futsal • Nongo',
        quote:
          'On remplit un match en quelques heures. Plus besoin de spammer des groupes WhatsApp.',
        avatar:
          'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=200&h=200&q=80&crop=faces',
      },
      {
        name: 'Fatou',
        role: 'Fitness • Ratoma',
        quote:
          'Je rejoins des séances à mon niveau, et je rencontre des gens motivés. Ça change tout.',
        avatar:
          'https://images.unsplash.com/photo-1754774674834-d3fde3387e4d?auto=format&fit=crop&w=200&h=200&q=80&crop=faces',
      },
    ],
    [],
  )

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }

  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 520, damping: 26 },
    },
  }

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-10">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Une vibe communautaire, pour de vrai
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Des gens, des lieux, des sports. SportConnectGN met de l’humain dans
            l’organisation.
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20">
          ★★★★★ 4.8 (bêta)
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {testimonials.map((t) => (
          <motion.figure
            key={t.name}
            variants={item}
            className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
          >
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                loading="lazy"
              />
              <div className="min-w-0">
                <figcaption className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t.name}
                </figcaption>
                <p className="truncate text-xs text-slate-600 dark:text-slate-300">{t.role}</p>
              </div>
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              “{t.quote}”
            </blockquote>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  )
}

