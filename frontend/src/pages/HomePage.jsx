import HeroSection from '../components/HeroSection.jsx'
import PartnerPromoSection from '../components/PartnerPromoSection.jsx'
import FeaturesSection from '../components/FeaturesSection.jsx'
import SportsSection from '../components/SportsSection.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="-mt-2">
      <HeroSection />
      <PartnerPromoSection />
      <SportsSection />
      <FeaturesSection />

      <section
        id="download"
        className="w-full px-4 pb-16 sm:px-6 lg:px-10"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Prêt à rejoindre la communauté ?
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                MVP en cours. Pour l’instant, connecte-toi et explore via le web.
                L’app mobile arrive bientôt.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                  ✅ Simple & rapide
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                  🤝 Rencontres sportives
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200 dark:bg-slate-950/40 dark:ring-white/10">
                  📍 Local (Conakry)
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
              >
                S’inscrire maintenant
              </Link>
              <Link
                to="/activities"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Voir les activités
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

