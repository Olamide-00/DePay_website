import { Link } from 'react-router-dom'
import { Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react'
import logo from '../assets/logo.png'

const columns = [
  {
    title: 'Pay bills',
    links: [
      { label: 'Airtime top-up', to: '/services' },
      { label: 'Data bundles', to: '/services' },
      { label: 'TV subscriptions', to: '/services' },
      { label: 'Electricity tokens', to: '/services' },
      { label: 'Educational pins', to: '/services' },
    ],
  },
  {
    title: 'Depay',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Referrals & rewards', to: '/referrals' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', to: '/contact' },
      { label: 'Transaction status', to: '/contact' },
      { label: 'Report an issue', to: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100 mt-32">
      <div className="container-px py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-14">
          <div>
            <img src={logo} alt="Depay" className="h-10 w-auto object-contain brightness-0 invert opacity-95" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-100/60">
              Every bill, one login. Depay settles airtime, data, TV, electricity and school fees in seconds — with
              rewards for every naira you move.
            </p>
            <form className="mt-7 flex max-w-sm items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-100/40 outline-none focus:border-leaf-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-500 text-forest-950 hover:bg-leaf-400 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-leaf-400">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-cream-100/70 hover:text-cream-50 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
          <p className="text-xs text-cream-100/45">© {new Date().getFullYear()} Depay Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="text-cream-100/60 hover:text-leaf-400 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="text-cream-100/60 hover:text-leaf-400 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-cream-100/60 hover:text-leaf-400 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
