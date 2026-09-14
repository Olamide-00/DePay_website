import {
  Bell,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  ArrowUpRight,
  Eye,
} from "lucide-react";

const quick = [
  { icon: Smartphone, label: "Airtime" },
  { icon: Wifi, label: "Data" },
  { icon: Tv, label: "TV" },
  { icon: Zap, label: "Power" },
];

const history = [
  { label: "MTN Airtime", sub: "to 0803 ••• 214", amount: "−₦1,000" },
  { label: "IKEDC Token", sub: "Meter ••• 8827", amount: "−₦5,500" },
  { label: "Referral bonus", sub: "from Chiamaka N.", amount: "+₦500" },
];

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] select-none">
      <div className="relative rounded-[2.5rem] border-[6px] border-forest-950 bg-forest-950 shadow-pop">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-forest-950" />
        <div className="overflow-hidden rounded-[2rem] bg-cream-50">
          {/* status/header */}
          <div className="bg-forest-900 px-5 pb-7 pt-8 text-cream-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-cream-100/60">Good evening</p>
                <p className="font-display text-sm font-semibold">Olamide 👋</p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-[11px] text-cream-100/50">
                <Eye className="h-3 w-3" /> Wallet balance
              </div>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight">
                ₦84,250
              </p>
            </div>
          </div>

          {/* quick actions */}
          <div className="grid grid-cols-4 gap-2 px-4 pt-4">
            {quick.map((q) => (
              <div key={q.label} className="flex flex-col items-center gap-1.5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
                  <q.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-[10px] font-medium text-ink-700">
                  {q.label}
                </span>
              </div>
            ))}
          </div>

          {/* recent activity */}
          <div className="mt-5 px-4 pb-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-500">
              Recent activity
            </p>
            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-ink-900">
                      {h.label}
                    </p>
                    <p className="text-[10px] text-ink-500">{h.sub}</p>
                  </div>
                  <span
                    className={`font-mono text-xs font-medium ${
                      h.amount.startsWith("+")
                        ? "text-leaf-600"
                        : "text-ink-700"
                    }`}
                  >
                    {h.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating badge */}
      <div className="stub stub-oncream absolute -right-10 top-16 hidden w-40 rounded-xl border border-line bg-white p-3 shadow-card sm:block">
        <div className="perf mb-2" />
        <p className="text-[10px] text-ink-500">Referral bonus</p>
        <p className="flex items-center gap-1 font-mono text-sm font-semibold text-leaf-600">
          +₦500 <ArrowUpRight className="h-3 w-3" />
        </p>
      </div>
    </div>
  );
}
