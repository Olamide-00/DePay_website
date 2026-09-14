import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  Tv,
  Zap,
  Gift,
  Users,
  Percent,
  Wallet,
  Lock,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { SectionHeading, Eyebrow, Stat } from "../components/Section";
import PhoneMockup from "../components/PhoneMockup";
import BillReceipt from "../components/BillReceipt";
import { services, stats, steps, testimonials, faqs } from "../data";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-noise">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 82% 10%, rgba(47,158,91,0.14) 0%, rgba(251,249,244,0) 70%)",
          }}
        />
        <div className="container-px grid grid-cols-1 items-center gap-16 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <div>
            <Eyebrow>Airtime · Data · TV · Electricity · Exam pins</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-[2.6rem] font-semibold leading-[1.06] text-forest-950 sm:text-6xl">
              Every bill you owe,{" "}
              <span className="text-leaf-600">settled before</span> the excuse
              forms.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700">
              Depay is the one wallet for airtime, data, TV, electricity and
              school fees — with cashback, referral bonuses and coupons on every
              transaction. Fund once, pay anything.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="/register" className="btn-primary">
                Download
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link to="/services" className="btn-ghost">
                See all bills we cover
              </Link>
            </div>

            <div className="mt-14 grid max-w-lg grid-cols-2 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
              {stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>

          <div className="relative flex justify-center py-6 lg:py-0">
            <BillReceipt
              icon={Smartphone}
              title="MTN Airtime"
              sub="0803 ••• 214"
              amount="₦1,000"
              className="absolute left-0 top-2 hidden -rotate-6 sm:block sm:left-4 lg:-left-8"
            />
            <PhoneMockup />
            <BillReceipt
              icon={Tv}
              title="DStv Compact"
              sub="Card ••• 9931"
              amount="₦19,000"
              className="absolute right-0 bottom-4 hidden rotate-6 sm:block sm:right-2 lg:-right-10"
            />
          </div>
        </div>

        {/* trust bar */}
        <div className="border-y border-line bg-white/60">
          <div className="container-px flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 text-xs font-mono uppercase tracking-wider text-ink-500 sm:justify-between">
            <span className="text-ink-500/70">Works with</span>
            {[
              "MTN",
              "Airtel",
              "Glo",
              "9mobile",
              "DStv",
              "GOtv",
              "IKEDC",
              "JAMB",
            ].map((b) => (
              <span key={b} className="text-ink-700">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-px py-24 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What you can pay"
            title="Six bills. One balance. Zero forgotten due dates."
            body="Every category runs on the same wallet, the same receipt trail, and the same rewards — so switching between them costs nothing but a tap."
          />
          <Link
            to="/services"
            className="hidden shrink-0 items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wide text-forest-800 hover:text-leaf-600 sm:flex"
          >
            View full price list <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card stub stub-onwhite p-6">
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest-900 text-leaf-400">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] text-ink-500">
                  from{" "}
                  <span className="font-semibold text-forest-800">
                    {s.from}
                  </span>
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-forest-950">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {s.blurb}
              </p>
              <div className="perf my-4" />
              <div className="flex flex-wrap gap-1.5">
                {s.providers.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-medium text-ink-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/services"
          className="mt-8 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-forest-800 sm:hidden"
        >
          View full price list <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-forest-950 py-24 text-cream-50 sm:py-28">
        <div className="container-px">
          <SectionHeading
            eyebrow="How it works"
            title={
              <span className="text-cream-50">
                Three steps, most people finish before the kettle boils.
              </span>
            }
            body="No branch visits, no reference numbers to hunt down — the same flow whether you're topping up ₦100 or clearing a term's tuition."
          />
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
                <span className="font-mono text-sm text-leaf-400">
                  {step.n}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream-100/65">
                  {step.body}
                </p>
                {i < steps.length - 1 && (
                  <span className="absolute right-[-1.25rem] top-2 hidden h-px w-8 bg-white/15 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERRALS TEASER */}
      <section className="container-px py-24 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Referrals, vouchers & coupons"
              title="Get paid for being the friend who always has data."
              body="Share one referral code and earn a bonus every time someone you invite completes their first bill. Stack it with vouchers and coupons for even more off your own bills."
            />
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: Users,
                  text: "Unlimited referrals — earn on every friend who signs up and pays a bill.",
                },
                {
                  icon: Gift,
                  text: "Vouchers you can gift, redeem or convert straight into wallet balance.",
                },
                {
                  icon: Percent,
                  text: "Coupon codes for seasonal discounts on data, TV and electricity.",
                },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-leaf-100 text-leaf-600">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-relaxed text-ink-700">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
            <Link to="/referrals" className="btn-primary mt-9">
              See how much you could earn
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="stub stub-oncream mx-auto w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-card">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Your referral code
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-leaf-500/50 bg-leaf-100/50 px-4 py-3">
              <span className="font-mono text-lg font-semibold tracking-widest text-forest-900">
                OLAMIDE25
              </span>
              <span className="rounded-full bg-leaf-500 px-3 py-1 text-[10px] font-semibold text-forest-950">
                COPY
              </span>
            </div>
            <div className="perf my-6" />
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Friends invited</span>
                <span className="font-mono font-semibold text-forest-950">
                  14
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Bonus earned</span>
                <span className="font-mono font-semibold text-leaf-600">
                  ₦7,000
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Active coupon</span>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-amber-500">
                  DATA10
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="bg-cream-100 py-24 sm:py-28">
        <div className="container-px">
          <SectionHeading
            eyebrow="Built to be trusted"
            title="The boring parts, handled properly."
            align="center"
          />
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { icon: Lock, label: "Bank-level encryption" },
              { icon: ShieldCheck, label: "Licensed settlement partner" },
              { icon: RotateCcw, label: "Auto-reversal on failed bills" },
              { icon: Headphones, label: "Human support, 7 days a week" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center text-center"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-forest-800 shadow-card">
                  <f.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-ink-700">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-px py-24 sm:py-28">
        <SectionHeading
          eyebrow="Trusted daily"
          title="What the wallet replaces: forgetting, queueing, apologising."
          align="center"
        />
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="stub stub-oncream card p-6">
              <blockquote className="text-sm leading-relaxed text-ink-700">
                “{t.quote}”
              </blockquote>
              <div className="perf my-4" />
              <figcaption className="flex items-center justify-between">
                <span className="text-sm font-semibold text-forest-950">
                  {t.name}
                </span>
                <span className="text-xs text-ink-500">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-px py-24 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Questions"
            title="Before you fund your wallet."
          />
          <div className="divide-y divide-line border-t border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base font-medium text-forest-950">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-ink-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container-px pb-24 sm:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 80% at 50% 0%, rgba(61,181,108,0.25) 0%, rgba(18,52,26,0) 70%)",
            }}
          />
          <div className="relative">
            <Wallet className="mx-auto h-10 w-10 text-leaf-400" />
            <h2 className="mx-auto mt-6 max-w-xl text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              Fund your wallet once. Never queue for a bill again.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/register" className="btn-accent">
                Download Depay
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/contact"
                className="btn-ghost border-white/25 text-cream-50 hover:bg-white/5"
              >
                Talk to us first
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
