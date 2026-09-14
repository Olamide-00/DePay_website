import { Link } from "react-router-dom";
import {
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Landmark,
  ArrowRight,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLedger } from "../../hooks/useWallet";
import TransactionRow from "../../components/dashboard/TransactionRow";
import { formatNaira } from "../../lib/utils";

const quickActions = [
  { to: "/dashboard/airtime", icon: Smartphone, label: "Airtime" },
  { to: "/dashboard/data", icon: Wifi, label: "Data" },
  { to: "/dashboard/tv", icon: Tv, label: "TV" },
  { to: "/dashboard/electricity", icon: Zap, label: "Electricity" },
];

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-2xl bg-cream-100" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 animate-pulse rounded bg-cream-100" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-cream-100" />
        </div>
      </div>
      <div className="shrink-0 space-y-2 text-right">
        <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-cream-100" />
        <div className="ml-auto h-2.5 w-12 animate-pulse rounded bg-cream-100" />
      </div>
    </div>
  );
}

export default function Overview() {
  const { user, balance } = useAuth();
  const { data: ledger, isLoading } = useLedger({ page: 1, limit: 6 });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-700">Welcome back,</p>
        <h1 className="font-display text-2xl font-semibold text-forest-950">
          {user.name.split(" ")[0]}
        </h1>
      </div>

      <div className="stub stub-onforest relative overflow-hidden rounded-2xl bg-forest-950 px-6 py-7 text-cream-50 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-leaf-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-forest-700/40 blur-3xl"
        />

        <p className="relative text-xs uppercase tracking-wide text-leaf-400">
          Wallet balance
        </p>
        <p className="relative mt-2 font-mono text-4xl font-semibold tracking-tight">
          {formatNaira(balance)}
        </p>
        <Link
          to="/dashboard/fund-wallet"
          className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-forest-950 shadow-lg shadow-forest-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-leaf-500/30"
        >
          <Landmark className="h-4 w-4" />
          Fund wallet
        </Link>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-ink-700">Quick actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card flex flex-col items-center gap-2.5 px-3 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-leaf-500/30 hover:shadow-md"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-forest-950">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-ink-700">Recent activity</p>
          <Link
            to="/dashboard/transactions"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-900"
          >
            View all
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <ActivityRowSkeleton key={i} />
            ))}
          </div>
        ) : !ledger || ledger.data.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-900/5 text-forest-800">
              <ReceiptIcon className="h-5 w-5" />
            </div>
            <p className="text-sm text-ink-600">
              No activity yet — your transactions will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {ledger.data.map((entry) => (
              <TransactionRow key={entry._id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
