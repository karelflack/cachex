import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, KeyRound, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/keys', label: 'API Keys', icon: KeyRound },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={() => setMobileOpen(false)}
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
    </>
  )

  return (
    <div className="flex h-screen bg-void overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-stroke bg-surface">
        <div className="px-5 py-4 border-b border-stroke">
          <span className="text-lg font-bold text-ink tracking-tight">
            Cache<span className="text-teal">x</span>
          </span>
        </div>
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 flex flex-col border-r border-stroke bg-surface transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-4 border-b border-stroke flex items-center justify-between">
          <span className="text-lg font-bold text-ink tracking-tight">
            Cache<span className="text-teal">x</span>
          </span>
          <button onClick={() => setMobileOpen(false)} className="text-ink-muted">
            <X size={18} />
          </button>
        </div>
        {navContent}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-stroke bg-surface">
          <button onClick={() => setMobileOpen(true)} className="text-ink-muted mr-3">
            <Menu size={20} />
          </button>
          <span className="text-base font-bold text-ink tracking-tight">
            Cache<span className="text-teal">x</span>
          </span>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
