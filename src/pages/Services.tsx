import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { SectionHeading, Eyebrow } from '../components/Section'
import { services } from '../data'

const sampleAmounts: Record<string, string[]> = {
  'Airtime top-up': ['₦50', '₦100', '₦200', '₦500', '₦1,000', '₦2,000'],
  'Data bundles': ['1GB', '2GB', '5GB', '10GB', '20GB', '40GB'],
  'TV subscriptions': ['DStv Padi', 'DStv Compact', 'GOtv Max', 'StarTimes Nova'],
  'Electricity tokens': ['₦500', '₦1,000', '₦2,500', '₦5,000', '₦10,000', 'Custom'],
  'Educational pins': ['WAEC result', 'NECO result', 'NABTEB result', 'JAMB e-pin'],
  'Vouchers & gift cards': ['₦1,000 voucher', '₦2,500 voucher', '₦5,000 voucher', 'Gift card trade-in'],
}

export default function Services() {
  return (
    <>
      <section className="bg-noise">
        <div className="container-px pb-16 pt-16 sm:pb-20 sm:pt-20">
          <Eyebrow>Full catalogue</Eyebrow>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight text-forest-950 sm:text-5xl">
            Every bill Depay settles, and what it costs to start.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
            Prices below are floor rates — your exact cost depends on network, provider and denomination, shown
            before you confirm any payment. No hidden charges added at checkout.
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {services.map((s) => (
              <a
                key={s.title}
                href={`#${slug(s.title)}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-xs font-medium text-ink-700 hover:border-forest-800/40 hover:text-forest-900"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px space-y-6 pb-24 sm:pb-28">
        {services.map((s, i) => (
          <div
            key={s.title}
            id={slug(s.title)}
            className="card stub stub-onwhite scroll-mt-24 grid grid-cols-1 gap-8 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div>
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-forest-900 text-leaf-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-ink-500">
                  0{i + 1} / 0{services.length}
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-forest-950">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{s.blurb}</p>
              <p className="mt-5 font-mono text-sm text-ink-500">
                Starts from <span className="font-semibold text-forest-800">{s.from}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.providers.map((p) => (
                  <span key={p} className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-medium text-ink-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-500">Popular options</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {sampleAmounts[s.title]?.map((amt) => (
                  <div
                    key={amt}
                    className="flex items-center justify-between gap-2 rounded-xl border border-line bg-cream-50 px-3.5 py-3"
                  >
                    <span className="font-mono text-xs font-medium text-forest-950">{amt}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-leaf-500" />
                  </div>
                ))}
              </div>
              <a href="/register" className="btn-primary btn-sm mt-6">
                Pay {s.title.toLowerCase()}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className="container-px pb-24 sm:pb-28">
        <div className="rounded-3xl bg-forest-950 px-8 py-14 text-center sm:px-16">
          <SectionHeading
            eyebrow="Didn't find your provider?"
            title={<span className="text-cream-50">We're adding new billers every month.</span>}
            align="center"
          />
          <a href="#contact" className="btn-accent mt-8">
            Request a biller
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  )
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}
