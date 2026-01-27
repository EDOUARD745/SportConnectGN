import { NavLink, Outlet } from 'react-router-dom'
import { Activity, Home, MessageCircle, User } from 'lucide-react'

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
        <div className="w-full pb-24 md:pb-10">
          <Outlet />
        </div>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid grid-cols-4 px-2 py-2">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

