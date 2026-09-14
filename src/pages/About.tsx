import {
  ArrowUpRight,
  Target,
  HeartHandshake,
  Gauge,
  Users2,
} from "lucide-react";
import { SectionHeading, Eyebrow, Stat } from "../components/Section";
import { stats } from "../data";

const values = [
  {
    icon: Target,
    title: "Every kobo, accounted for",
    body: "A receipt exists for every transaction before we ask you to trust the outcome.",
  },
  {
    icon: Gauge,
    title: "Speed is a feature",
    body: "We measure settlement in seconds, and treat anything slower as a bug to fix.",
  },
  {
    icon: HeartHandshake,
    title: "Reward the network",
    body: "The people who bring Depay to their community should feel it in their wallet.",
  },
  {
    icon: Users2,
    title: "Support that answers",
    body: "A real person picks up stuck transactions — no ticket disappears into a queue.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "Depay founded",
    body: "Started as a two-person team settling airtime for a university hostel.",
  },
  {
    year: "2023",
    title: "Electricity & TV added",
    body: "Expanded past airtime and data into token and subscription payments.",
  },
  {
    year: "2024",
    title: "Referral programme launched",
    body: "Turned word-of-mouth growth into a structured, tiered rewards system.",
  },
  {
    year: "2025",
    title: "2 million bills settled",
    body: "Crossed 2M+ transactions with 99.9% uptime across all billers.",
  },
];

const team = [
  { initials: "AO", name: "Ada Okonkwo", role: "Co-founder & CEO" },
  { initials: "IE", name: "Ifeanyi Eze", role: "Co-founder & CTO" },
  { initials: "BF", name: "Bisi Fashola", role: "Head of Payments" },
  { initials: "KM", name: "Kemi Musa", role: "Head of Support" },
];

export default function About() {
  return (
    <>
      <section className="bg-noise">
        <div className="container-px pb-16 pt-16 sm:pb-20 sm:pt-20">
          <Eyebrow>About Depay</Eyebrow>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight text-forest-950 sm:text-5xl">
            We built the bill payment app we were tired of not having.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
            Depay started with one frustration: too many apps for too few bills.
            Today it's a single wallet for airtime, data, TV, electricity and
            school fees — trusted by tens of thousands of users across Nigeria.
          </p>
        </div>

        <div className="border-y border-line bg-white/60">
          <div className="container-px grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-px py-24 sm:py-28">
        <SectionHeading
          eyebrow="What we optimise for"
          title="Four things that don't change as we grow."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card stub stub-onwhite p-7">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest-900 text-leaf-400">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-forest-950">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px pb-24 sm:pb-28">
        <div className="rounded-3xl bg-cream-100 px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-xl text-balance font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
            Come pay bills with us. It's free to start.
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
