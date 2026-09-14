import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/referrals", label: "Referrals & Rewards" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-cream-50/90 shadow-sm backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between h-20">
        <NavLink
          to="/"
          className="flex items-center gap-2 shrink-0 transition-transform hover:scale-[1.02]"
          onClick={() => setOpen(false)}
        >
          <img src={logo} alt="Depay" className="h-9 w-auto object-contain" />
        </NavLink>

        <ul className="hidden lg:flex items-center gap-9 font-body text-sm font-medium text-ink-700">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `group relative py-2 transition-colors hover:text-forest-800 ${
                    isActive ? "text-forest-900" : "text-ink-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-leaf-500 transition-all duration-300 ${
                        isActive ? "right-0" : "right-full group-hover:right-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className="btn-accent btn-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-500/25"
            >
              Go to dashboard
              <ArrowUpRight className="h-4 w-4" />
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost btn-sm">
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="btn-accent btn-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-500/25"
              >
                Get started
                <ArrowUpRight className="h-4 w-4" />
              </NavLink>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 -mr-2 rounded-lg text-forest-900 transition-colors hover:bg-forest-900/5"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-line bg-cream-50 shadow-sm">
          <ul className="container-px flex flex-col py-4 gap-1 font-body text-base">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 border-b border-line/70 ${
                      isActive
                        ? "text-forest-900 font-semibold"
                        : "text-ink-700"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="container-px flex gap-3 pb-6 pt-1">
            {isAuthenticated ? (
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-accent btn-sm flex-1"
              >
                Go to dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-ghost btn-sm flex-1"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-accent btn-sm flex-1"
                >
                  Create account
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
