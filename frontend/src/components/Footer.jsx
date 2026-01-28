import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-2xl bg-emerald-600 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xl shadow-emerald-500/20">
                SC
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                SportConnectGN
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              La plateforme qui connecte les sportifs en Guinée. Plus de
              motivation, plus de rencontres, plus de matchs.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-12 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">
                Made for community
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Produit</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Link className="hover:text-slate-900 dark:hover:text-white" to="/activities">
                Activités
              </Link>
              <Link className="hover:text-slate-900 dark:hover:text-white" to="/#download">
                Télécharger l’app
              </Link>
              <Link className="hover:text-slate-900 dark:hover:text-white" to="/contact">
                Contact
              </Link>
              <Link className="hover:text-slate-900 dark:hover:text-white" to="/a-propos">
                À propos
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contact</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Besoin d’un partenariat (clubs, universités, entreprises) ?
              Écris-nous.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold !text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 dark:bg-emerald-500 dark:!text-slate-950"
                to="/contact"
              >
                Formulaire
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                href="mailto:contact@sportconnectgn.com"
              >
                Email direct
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between dark:border-white/10">
          <span>© {new Date().getFullYear()} SportConnectGN - Tous droits réservés.</span>
          <span>Développé par Edouard</span>
        </div>
      </div>
    </footer>
  )
}

