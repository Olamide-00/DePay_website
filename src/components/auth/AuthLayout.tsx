import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Gift } from 'lucide-react'
import logo from '../../assets/logo.png'
import PhoneMockup from '../PhoneMockup'

const highlights = [
  { icon: Zap, text: 'Airtime, data, TV and electricity settle in seconds.' },
  { icon: ShieldCheck, text: 'Bank-partnered wallet, encrypted end-to-end.' },
  { icon: Gift, text: 'Earn a bonus on every referral and first top-up.' },
]

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-forest-950 lg:flex lg:flex-col lg:justify-between">
        <div className="bg-noise absolute inset-0 opacity-40" />
        <div className="container-px relative pt-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="Depay" className="h-9 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-10">
          <PhoneMockup />
        </div>

        <div className="container-px relative space-y-4 pb-12">
          {highlights.map((h) => (
            <div key={h.text} className="flex items-center gap-3 text-cream-100/80">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10">
                <h.icon className="h-4 w-4 text-leaf-400" />
              </div>
              <p className="text-sm">{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-cream-50 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <img src={logo} alt="Depay" className="h-8 w-auto object-contain" />
          </Link>

          <h1 className="font-display text-2xl font-semibold text-forest-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-700">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-center text-sm text-ink-700">{footer}</div>
        </div>
      </div>
    </div>
  )
}
