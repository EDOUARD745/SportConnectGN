import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Home, Menu, MessageCircle, User, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Accueil', Icon: Home, end: true },
  { to: '/dashboard/matches', label: 'Mes Matchs', Icon: Activity },
  { to: '/dashboard/messages', label: 'Messages', Icon: MessageCircle },
  { to: '/dashboard/profile', label: 'Mon Profil', Icon: User },
]

function NavItem({ to, label, Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
        ].join(' ')
      }
    >
      <Icon className="h-5 w-5" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileNavOpen])

  return (
    <div className="relative w-full">
      {/* Sidebar desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block md:w-72">
        <div className="h-full border-r border-slate-200 bg-white/70 px-4 py-5 backdrop-blur dark:border-white/10 dark:bg-slate-950/50">
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-2xl bg-emerald-600 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xl shadow-emerald-500/20">
              SC
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                Dashboard
              </div>
              <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                SportConnectGN
              </div>
            </div>
          </div>

          <nav className="grid gap-2">
            {navItems.map((it) => (
              <NavItem key={it.to} {...it} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="w-full md:pl-72">
        {/* Mobile dashboard header + menu */}
        <div className="w-full px-4 pt-4 sm:px-6 lg:px-10 md:hidden">
          <div className="flex items-center justify-between rounded-3xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-950/50 dark:ring-white/10">
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Dashboard
              </div>
              <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                SportConnectGN
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Ouvrir le menu du dashboard"
              aria-expanded={mobileNavOpen}
              aria-controls="dashboard-mobile-menu"
              title="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="w-full pb-10">
          <Outlet />
        </div>
      </div>

      {/* Mobile dashboard menu overlay */}
      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            key="dashboard-mobile-menu"
            id="dashboard-mobile-menu"
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Fermer le menu du dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative mx-4 mt-4 overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-500/10 ring-1 ring-slate-200 dark:bg-slate-950/95 dark:ring-white/10"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-emerald-600 px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xl shadow-emerald-500/20">
                    SC
                  </span>
                  <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                    Dashboard
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <nav className="grid gap-2">
                  {navItems.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      end={it.end}
                      onClick={() => setMobileNavOpen(false)}
                      className={({ isActive }) =>
                        [
                          'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                          isActive
                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
                        ].join(' ')
                      }
                    >
                      <it.Icon className="h-5 w-5" />
                      <span className="truncate">{it.label}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-3">
                  <Link
                    to="/"
                    onClick={() => setMobileNavOpen(false)}
                    className="block rounded-2xl bg-slate-50 px-3 py-3 text-center text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
                  >
                    Retour au site
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

