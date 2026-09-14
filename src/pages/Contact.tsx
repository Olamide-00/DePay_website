import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { SectionHeading, Eyebrow } from "../components/Section";

const info = [
  { icon: Mail, label: "Email", value: "support@depay.app" },
  { icon: Phone, label: "Phone & WhatsApp", value: "+234 800 337 2900" },
  { icon: MapPin, label: "Office", value: "Yaba, Lagos, Nigeria" },
  {
    icon: MessageCircle,
    label: "Live chat",
    value: "7 days a week, 8am – 10pm",
  },
];

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  topic: "General enquiry",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-noise">
        <div className="container-px pb-16 pt-16 sm:pb-20 sm:pt-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight text-forest-950 sm:text-5xl">
            Stuck transaction, partnership idea, or just a question — we're
            listening.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
            Most support messages get a first reply in under ten minutes during
            live chat hours.
          </p>
        </div>
      </section>

      <section id="contact" className="container-px pb-24 sm:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {info.map((i) => (
              <div
                key={i.label}
                className="card stub stub-onwhite flex items-center gap-4 p-5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
                  <i.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-ink-500">{i.label}</p>
                  <p className="text-sm font-semibold text-forest-950">
                    {i.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="card stub stub-onwhite p-7 sm:p-10">
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-10 w-10 text-leaf-500" />
                <h2 className="mt-5 font-display text-2xl font-semibold text-forest-950">
                  Message sent
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-700">
                  Thanks, {form.name.split(" ")[0] || "there"} — a member of the
                  Depay team will reply to {form.email || "your email"} shortly.
                </p>
                <button
                  onClick={() => {
                    setForm(initialForm);
                    setSubmitted(false);
                  }}
                  className="btn-ghost btn-sm mt-7"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      type="text"
                      placeholder="Olamide Oladele"
                      className="input"
                    />
                  </Field>
                  <Field label="Email address">
                    <input
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                      type="email"
                      placeholder="you@email.com"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="What's this about?">
                  <select
                    value={form.topic}
                    onChange={handleChange("topic")}
                    className="input"
                  >
                    <option>General enquiry</option>
                    <option>Stuck or failed transaction</option>
                    <option>Referral & rewards question</option>
                    <option>Partnership / biller request</option>
                    <option>Report a bug</option>
                  </select>
                </Field>

                <Field label="Message">
                  <textarea
                    required
                    value={form.message}
                    onChange={handleChange("message")}
                    rows={5}
                    placeholder="Tell us what's going on…"
                    className="input resize-none"
                  />
                </Field>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send message
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="container-px pb-24 sm:pb-28">
        <div className="rounded-3xl bg-forest-950 px-8 py-14 text-center sm:px-16">
          <SectionHeading
            eyebrow="Prefer to self-serve?"
            title={
              <span className="text-cream-50">
                Check the FAQ on referrals, vouchers and settlement times.
              </span>
            }
            align="center"
          />
          <a href="/referrals" className="btn-accent mt-8">
            Visit the help topics
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-700">
        {label}
      </span>
      {children}
    </label>
  );
}
