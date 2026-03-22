import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, KeyRound, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/keys', label: 'API Keys', icon: KeyRound },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex h-screen bg-void overflow-hidden">
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-stroke bg-surface">
        <div className="px-5 py-4 border-b border-stroke">
          <span className="text-lg font-bold text-ink tracking-tight">
            Cache<span className="text-teal">x</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-subtle text-teal font-medium'
                    : 'text-ink-muted hover:text-ink hover:bg-elevated'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-stroke">
          <div className="px-3 py-1.5 mb-1">
            <p className="text-xs text-ink-faint truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-danger hover:bg-danger-subtle transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
