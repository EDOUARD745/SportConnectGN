import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

export default function HeroSection() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const imageUrl = useMemo(
    () =>
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80',
    [],
  )

  const avatars = useMemo(
    () => [
      // Avatars "jeunes noirs" (placeholders réalistes)
      // NOTE: on évite source.unsplash.com (souvent 503). On utilise images.unsplash.com direct.
      'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=120&h=120&q=80&crop=faces',
      'https://images.unsplash.com/photo-1688120320082-f23f0c1425be?auto=format&fit=crop&w=120&h=120&q=80&crop=faces',
      'https://images.unsplash.com/photo-1615891081220-9116de3e1afd?auto=format&fit=crop&w=120&h=120&q=80&crop=faces',
      'https://images.unsplash.com/photo-1754774674834-d3fde3387e4d?auto=format&fit=crop&w=120&h=120&q=80&crop=faces',
    ],
    [],
  )

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/activities?q=${encodeURIComponent(q)}` : '/activities')
  }

  return (
    <section
      className="w-full min-h-[100vh] flex flex-col items-center justify-center px-4 py-16 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="w-full max-w-3xl"
      >
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/15">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Communauté sportive — Conakry & Guinée
        </div>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Ne cours plus jamais seul à Conakry.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Trouve ton binôme de foot, de running ou de fitness en 2 clics. Des
          activités près de chez toi, une ambiance safe, et des gens motivés.
        </p>

        {/* Barre de recherche (style Planity: centrale, premium) */}
        <form
          onSubmit={onSearch}
          className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-3xl bg-white/10 p-3 backdrop-blur-md ring-1 ring-white/15 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
            <span className="text-white/80">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cherche un sport, un quartier (Nongo, Kipé…), un lieu…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-500/25"
          >
            Trouver une activité
          </motion.button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href="#download"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20"
          >
            <motion.span
              aria-hidden
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-base"
            >
              ⬇️
            </motion.span>
            Télécharger l’app
          </motion.a>

          <Link
            to="/activities"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md ring-1 ring-white/15 hover:bg-white/15"
          >
            Voir les activités
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {avatars.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                className="h-10 w-10 rounded-2xl object-cover ring-2 ring-white/80"
                loading="lazy"
                style={{ zIndex: 10 - idx }}
              />
            ))}
          </div>
          <div className="text-sm text-white/85">
            <span className="font-semibold text-white">Des gens réels</span>{' '}
            trouvent des partenaires chaque jour.
          </div>
        </div>
      </motion.div>
    </section>
  )
}

