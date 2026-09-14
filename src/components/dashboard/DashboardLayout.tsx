import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { formatNaira, initials } from "../../lib/utils";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/dashboard/airtime", label: "Airtime", icon: Smartphone },
  { to: "/dashboard/data", label: "Data", icon: Wifi },
  { to: "/dashboard/tv", label: "TV subscription", icon: Tv },
  { to: "/dashboard/electricity", label: "Electricity", icon: Zap },
  { to: "/dashboard/fund-wallet", label: "Fund wallet", icon: Wallet },
  { to: "/dashboard/transactions", label: "Transactions", icon: ReceiptIcon },
  { to: "/dashboard/profile", label: "Profile", icon: UserRound },
];

function navItemClass({ isActive }: { isActive: boolean }) {
  return `group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-leaf-500 text-forest-950 shadow-md shadow-leaf-500/30"
      : "text-cream-50/70 hover:bg-white/5 hover:text-cream-50"
  }`;
}

function navIconTileClass(isActive: boolean) {
  return `grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors ${
    isActive
      ? "bg-forest-950/15 text-forest-950"
      : "bg-white/5 text-cream-50/60 group-hover:bg-white/10 group-hover:text-cream-50"
  }`;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, balance, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream-50/90 shadow-sm backdrop-blur">
        <div className="container-px flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              className="-ml-2 rounded-lg p-2 text-forest-900 transition-colors hover:bg-forest-900/5 lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <NavLink to="/dashboard" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Depay"
                className="h-7 w-auto object-contain"
              />
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="hidden items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md sm:flex"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf-500/15 text-leaf-500">
                <Wallet className="h-3.5 w-3.5" />
              </span>
              <span className="flex flex-col leading-tight text-left">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-500">
                  Balance
                </span>
                <span className="font-mono text-sm font-semibold text-forest-950">
                  {showBalance ? formatNaira(balance) : "••••••"}
                </span>
              </span>
              {showBalance ? (
                <Eye className="h-3.5 w-3.5 text-ink-500" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-ink-500" />
              )}
            </button>

            <NavLink
              to="/dashboard/profile"
              aria-label="View profile"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-xs font-semibold text-cream-50 ring-2 ring-leaf-500/30 transition-transform hover:scale-105"
            >
              {user ? initials(user.name) : ""}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-leaf-500 ring-2 ring-cream-50" />
            </NavLink>
          </div>
        </div>
      </header>

      <div className="container-px flex gap-8 py-8">
        {/* Sidebar - desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-forest-950 to-forest-900 p-4 shadow-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-leaf-500/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-forest-700/40 blur-3xl"
            />

            <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto pr-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navItemClass}
                >
                  {({ isActive }) => (
                    <>
                      <span className={navIconTileClass(isActive)}>
                        <item.icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-500 text-sm font-semibold text-forest-950">
                {user ? initials(user.name) : ""}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-cream-50">
                  {user?.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-medium text-cream-50/60 transition-colors hover:text-cream-50"
                >
                  <LogOut className="h-3 w-3" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar - mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-forest-950/40"
              onClick={() => setOpen(false)}
            />
            <nav className="absolute left-0 top-16 flex h-[calc(100%-4rem)] w-72 flex-col overflow-hidden overflow-y-auto bg-gradient-to-b from-forest-950 to-forest-900 p-4 shadow-2xl">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-leaf-500/20 blur-3xl"
              />

              <div className="relative z-10 flex-1 space-y-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={navItemClass}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={navIconTileClass(isActive)}>
                          <item.icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="relative z-10 mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/10 px-3.5 py-2.5 text-sm font-medium text-cream-50/80 transition-colors hover:bg-white/5 hover:text-cream-50"
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
  );
}
