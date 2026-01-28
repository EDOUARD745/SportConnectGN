import { motion } from 'framer-motion'
import { Linkedin, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            À propos de SportConnectGN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-base text-slate-600 dark:text-slate-300"
          >
            SportConnectGN est une plateforme mobile-first qui aide les sportifs en Guinée à se
            retrouver facilement: activités, réservations, et coéquipiers au bon niveau.
          </motion.p>

          <div className="mt-6 grid gap-3">
            {[
              {
                i: '🤝',
                t: 'Communauté',
                d: 'On met l’humain au centre: proximité, respect, vibe sportive.',
              },
              {
                i: '📍',
                t: 'Local',
                d: 'Pensé pour Conakry (et extension Guinée), quartiers et lieux réels.',
              },
              {
                i: '⚡️',
                t: 'Rapide',
                d: 'Moins de friction qu’un groupe WhatsApp: tu trouves, tu proposes, tu joues.',
              },
            ].map((b) => (
              <div
                key={b.t}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                    {b.i}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {b.t}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{b.d}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Nos valeurs
                </h2>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                  Des principes simples qui guident le produit et la communauté.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  i: '🛡️',
                  t: 'Sécurité & respect',
                  d: 'Une vibe saine: respect, règles claires, tolérance zéro pour l’abus.',
                },
                {
                  i: '🤲',
                  t: 'Inclusivité',
                  d: 'Tous les niveaux, tous les profils. Le sport rassemble.',
                },
                {
                  i: '🧭',
                  t: 'Transparence',
                  d: 'Infos utiles: niveau, lieu, disponibilité. Moins de malentendus.',
                },
                {
                  i: '🏁',
                  t: 'Fiabilité',
                  d: 'On favorise les engagements tenus: moins d’annulations, plus de matchs joués.',
                },
              ].map((v) => (
                <motion.div
                  key={v.t}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                  className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-lg ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                      {v.i}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {v.t}
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{v.d}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                L’équipe
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                Conception
              </h2>
            </div>
            <div className="h-2 w-16 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <img
              src="/concepteur.png"
              alt="Photo du concepteur"
              className="h-28 w-28 rounded-full object-cover ring-2 ring-white shadow-xl"
              loading="lazy"
            />
            <div className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Edouard <span className="uppercase">Louamou</span>
            </div>
            <div className="mt-2 text-base font-semibold text-emerald-700 dark:text-emerald-300">
              Data analyst / Scientist
            </div>

            <div className="mt-6 w-full rounded-3xl bg-slate-50 p-5 text-left ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Formation
              </div>
              <ul className="mt-3 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
                <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-white/10">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Master en MIAGE specialiste Business Intelligence
                  </div>
                  <div className="mt-1 text-slate-600 dark:text-slate-300">
                    à l&apos;Université Paris Saclay
                  </div>
                </li>
                <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-white/10">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Master of science in IA for Business
                  </div>
                  <div className="mt-1 text-slate-600 dark:text-slate-300">à Aivancity</div>
                </li>
              </ul>

              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Localisation
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-white/10">
                <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                Paris - France
              </div>
            </div>

            <a
              href="https://www.linkedin.com/in/edouardlouamou/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

