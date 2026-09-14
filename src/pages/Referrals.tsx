import {
  ArrowUpRight,
  Share2,
  UserPlus,
  Wallet2,
  Gift,
  Percent,
  Ticket,
} from "lucide-react";
import { SectionHeading, Eyebrow } from "../components/Section";

const tiers = [
  {
    name: "Starter",
    range: "1 – 4 referrals",
    bonus: "₦500",
    perk: "per successful referral",
  },
  {
    name: "Connector",
    range: "5 – 19 referrals",
    bonus: "₦750",
    perk: "per successful referral",
  },
  {
    name: "Ambassador",
    range: "20+ referrals",
    bonus: "₦1,000",
    perk: "per referral + 1% lifetime cashback",
  },
];

const referralSteps = [
  {
    icon: Share2,
    title: "Share your code",
    body: "Send your unique referral link by chat, social media, or QR code.",
  },
  {
    icon: UserPlus,
    title: "They sign up",
    body: "Your friend creates a free Depay account using your code.",
  },
  {
    icon: Wallet2,
    title: "You both earn",
    body: "Once they complete their first paid bill, a bonus lands in each wallet.",
  },
];

export default function Referrals() {
  return (
    <>
      <section className="bg-noise">
        <div className="container-px grid grid-cols-1 items-center gap-14 pb-20 pt-16 sm:pt-20 lg:grid-cols-2">
          <div>
            <Eyebrow>Referrals · Vouchers · Coupons</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight text-forest-950 sm:text-5xl">
              Turn the group chat you're already on into extra wallet balance.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-700">
              Depay rewards the people who bring others in. Refer friends for
              cash bonuses, gift or redeem vouchers, and stack coupon codes for
              discounted bills.
            </p>
            <a href="/register" className="btn-primary mt-8">
              Get my referral code
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="stub stub-oncream mx-auto w-full max-w-sm rounded-2xl border border-line bg-white p-7 shadow-card">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Share this link
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-dashed border-leaf-500/50 bg-leaf-100/50 px-4 py-3">
              <span className="truncate font-mono text-sm font-medium text-forest-900">
                depay.app/r/olamide25
              </span>
              <span className="shrink-0 rounded-full bg-leaf-500 px-3 py-1 text-[10px] font-semibold text-forest-950">
                COPY
              </span>
            </div>
            <div className="perf my-6" />
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              This month
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">New referrals</span>
                <span className="font-mono font-semibold text-forest-950">
                  6
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Bonus earned</span>
                <span className="font-mono font-semibold text-leaf-600">
                  ₦3,000
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Current tier</span>
                <span className="rounded-full bg-forest-900 px-2.5 py-1 font-mono text-xs font-semibold text-leaf-400">
                  Connector
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How referrals work */}
      <section className="container-px py-24 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps between you and your next bonus."
          align="center"
        />
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {referralSteps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-leaf-100 text-leaf-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-forest-950 py-24 text-cream-50 sm:py-28">
        <div className="container-px">
          <SectionHeading
            eyebrow="Referral tiers"
            title={
              <span className="text-cream-50">
                The more people you bring, the more each one is worth.
              </span>
            }
            body="Tiers are calculated on a rolling 12-month count and update automatically — no forms, no waiting for approval."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="stub stub-onforest rounded-2xl border border-white/10 bg-forest-900 p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-leaf-400">
                  {t.name}
                </p>
                <p className="mt-2 text-sm text-cream-100/60">{t.range}</p>
                <div className="my-5 h-px bg-white/10" />
                <p className="font-mono text-3xl font-semibold text-cream-50">
                  {t.bonus}
                </p>
                <p className="mt-1 text-xs text-cream-100/55">{t.perk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vouchers & coupons */}
      <section className="container-px py-24 sm:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="card stub stub-onwhite p-8">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
              <Gift className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-forest-950">
              Vouchers
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Buy a Depay voucher for yourself or as a gift. Vouchers top up
              wallet balance directly and never expire — redeem the full amount
              or spread it across several bills.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-700">
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> Sold in ₦1,000 –
                ₦20,000 denominations
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> Redeemable by
                anyone with a Depay account
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> Trade in supported
                gift cards for wallet cash
              </li>
            </ul>
          </div>

          <div className="card stub stub-onwhite p-8">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-forest-950">
              Coupons
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Coupon codes apply a discount at checkout on a specific bill
              category — think 10% off your next data bundle, or a flat ₦200 off
              electricity tokens during a promo window.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-700">
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> Released monthly
                and around network promos
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> One coupon per
                transaction, stackable with vouchers
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-leaf-500" /> Sent straight to
                your notifications when active
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-px pb-24 sm:pb-28">
        <div className="rounded-3xl bg-cream-100 px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-xl text-balance font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Your first referral bonus is one link away.
          </h2>
          <a href="/register" className="btn-primary mt-8">
            Create your free account
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
