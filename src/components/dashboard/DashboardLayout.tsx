import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Wallet,
  Receipt as ReceiptIcon,
  UserRound,
  LogOut,
  Menu,
  X,
  Eye,
  EyeOff,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'
import { formatNaira, initials } from '../../lib/utils'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/dashboard/airtime', label: 'Airtime', icon: Smartphone },
  { to: '/dashboard/data', label: 'Data', icon: Wifi },
  { to: '/dashboard/tv', label: 'TV subscription', icon: Tv },
  { to: '/dashboard/electricity', label: 'Electricity', icon: Zap },
  { to: '/dashboard/fund-wallet', label: 'Fund wallet', icon: Wallet },
  { to: '/dashboard/transactions', label: 'Transactions', icon: ReceiptIcon },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, balance, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream-50/90 backdrop-blur">
        <div className="container-px flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              className="-ml-2 p-2 text-forest-900 lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <NavLink to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Depay" className="h-7 w-auto object-contain" />
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 sm:flex"
            >
              <span className="font-mono text-xs text-ink-500">Balance</span>
              <span className="font-mono text-sm font-semibold text-forest-950">
                {showBalance ? formatNaira(balance) : '••••••'}
              </span>
              {showBalance ? (
                <Eye className="h-3.5 w-3.5 text-ink-500" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-ink-500" />
              )}
            </button>

            <div className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-xs font-semibold text-cream-50">
              {user ? initials(user.name) : ''}
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-700 hover:border-forest-800/40 hover:text-forest-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container-px flex gap-8 py-8">
        {/* Sidebar - desktop */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-900 text-cream-50'
                      : 'text-ink-700 hover:bg-forest-900/5 hover:text-forest-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Sidebar - mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div className="absolute inset-0 bg-forest-950/40" onClick={() => setOpen(false)} />
            <nav className="absolute left-0 top-16 h-[calc(100%-4rem)] w-72 space-y-1 overflow-y-auto border-r border-line bg-cream-50 p-4">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-900 text-cream-50'
                        : 'text-ink-700 hover:bg-forest-900/5 hover:text-forest-900'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-sm font-medium text-ink-700"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </nav>
          </div>
        )}

        <main className="min-w-0 flex-1 pb-20">{children}</main>
      </div>
    </div>
  )
}
