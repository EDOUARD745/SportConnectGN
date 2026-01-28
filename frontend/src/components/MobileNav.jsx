import { NavLink } from 'react-router-dom'
import { CalendarDays, Home, Search, Trophy, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

function linkWithNext(to, next) {
  return `${to}?next=${encodeURIComponent(next)}`
}

export default function MobileNav() {
  const { isAuthenticated } = useAuth()

  const nextMatches = '/dashboard/matches'
  const nextProfile = '/dashboard/profile'

  const items = [
    { to: '/', label: 'Accueil', Icon: Home },
    { to: '/activities', label: 'Recherche', Icon: Search },
    { to: '/trouver-partenaire', label: 'Coéquipiers', Icon: Trophy },
    {
      to: isAuthenticated ? '/dashboard/matches' : linkWithNext('/login', nextMatches),
      label: 'Matchs',
      Icon: CalendarDays,
    },
    {
      to: isAuthenticated ? '/dashboard/profile' : linkWithNext('/login', nextProfile),
      label: 'Profil',
      Icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
      <div className="border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/80">
        <div className="mx-auto grid max-w-[100vw] grid-cols-5 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={[
                      'h-5 w-5 transition-transform',
                      isActive ? 'scale-110' : 'scale-100',
                    ].join(' ')}
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

