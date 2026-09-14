import { useEffect, useState } from "react";
import { Landmark, Copy, Check, PartyPopper, AlertCircle } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { useReservedAccount } from "../../hooks/useWallet";
import { getSocket } from "../../lib/socket";
import { formatNaira } from "../../lib/utils";

const STEPS = [
  "Open your bank app and transfer any amount to the account above.",
  "Your DePay wallet credits automatically within seconds of the transfer clearing.",
  "No need to refresh — you'll see it land right here.",
];

export default function FundWallet() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [justFunded, setJustFunded] = useState<number | null>(null);

  const {
    data: account,
    isLoading,
    isError,
    refetch,
  } = useReservedAccount(
    user
      ? {
          email: user.email,
          phone: user.phoneNumber,
          first_name: user.name.split(" ")[0] || user.name,
          last_name: user.name.split(" ").slice(1).join(" ") || user.name,
        }
      : null,
  );

  // Live "money just landed" moment — the backend's webhook pushes
  // this the instant a transfer to the dedicated account clears, so
  // there's nothing to poll or a "confirm" button to fake.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (payload: { amountAdded: number }) =>
      setJustFunded(payload.amountAdded);
    socket.on("balance_updated", handler);
    return () => {
      socket.off("balance_updated", handler);
    };
  }, []);

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!user) return null;

  if (justFunded !== null) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="card relative overflow-hidden p-8 shadow-lg shadow-leaf-500/10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-leaf-500/15 blur-3xl"
          />
          <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-leaf-100 to-leaf-100/50 text-leaf-600 ring-1 ring-leaf-500/20">
            <PartyPopper className="h-7 w-7" />
          </div>
          <h2 className="relative mt-4 font-display text-xl font-semibold text-forest-950">
            Wallet funded!
          </h2>
          <p className="relative mt-2 font-mono text-2xl font-semibold text-forest-950">
            +{formatNaira(justFunded)}
          </p>
          <p className="relative mt-2 text-sm text-ink-700">
            Your new balance reflects across the dashboard already.
          </p>
          <button
            onClick={() => setJustFunded(null)}
            className="btn-primary relative mt-6 w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-500/20"
          >
            Fund again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        icon={Landmark}
        title="Fund wallet"
        subtitle="Transfer to your dedicated account — credited automatically."
      />

      <div className="card p-6 sm:p-7">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-40 animate-pulse rounded-2xl bg-cream-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-cream-100" />
            <div className="h-4 w-full animate-pulse rounded bg-cream-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-cream-100" />
          </div>
        ) : isError || !account ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-900">
              Couldn't load your account
            </p>
            <p className="mt-1 text-sm text-ink-600">
              Check your connection and try again.
            </p>
            <button onClick={() => refetch()} className="btn-ghost btn-sm mt-4">
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="stub stub-onforest relative overflow-hidden rounded-2xl bg-forest-950 px-6 py-7 text-cream-50">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-leaf-500/20 blur-3xl"
              />
              <p className="relative text-xs uppercase tracking-wide text-leaf-400">
                Your dedicated account
              </p>
              <p className="relative mt-3 font-mono text-3xl font-semibold tracking-wide">
                {account.accountNumber}
              </p>
              <div className="relative mt-3 flex items-center justify-between text-sm">
                <span className="text-cream-50/80">{account.bankName}</span>
                <button
                  onClick={() => copy(account.accountNumber)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/15"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="relative mt-2 text-xs text-cream-50/70">
                {account.accountName}
              </p>
            </div>

            <div className="perf my-6" />

            <ol className="space-y-5 text-sm text-ink-700">
              {STEPS.map((step, i) => (
                <li key={step} className="relative flex gap-3">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-2.5 top-5 h-[calc(100%+0.75rem)] w-px bg-leaf-500/20"
                    />
                  )}
                  <span className="relative z-10 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-[11px] font-bold text-leaf-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-center text-xs text-ink-500">
              This account is uniquely yours — reuse it any time you want to
              fund your wallet.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
