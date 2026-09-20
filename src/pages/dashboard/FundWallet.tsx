import { useEffect, useState } from "react";
import {
  Landmark,
  Copy,
  Check,
  PartyPopper,
  ShieldCheck,
  BadgeCheck,
  Lock,
  HelpCircle,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { useCreateWallet } from "../../hooks/useWallet";
import { getSocket } from "../../lib/socket";
import { formatNaira } from "../../lib/utils";

const STEPS = [
  "Open your bank app and transfer any amount to the account above.",
  "Your DePay wallet credits automatically within seconds of the transfer clearing.",
  "No need to refresh — you'll see it land right here.",
];

const BADGES = [
  { icon: ShieldCheck, label: "Encrypted" },
  { icon: BadgeCheck, label: "CBN Compliant" },
  { icon: Lock, label: "Protected" },
];

function splitFullName(name: string) {
  if (!name) return { first_name: "", last_name: "" };
  const parts = name.trim().split(" ");
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || parts[0] || "",
  };
}

export default function FundWallet() {
  const { user, setUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [justFunded, setJustFunded] = useState<number | null>(null);

  const [bvn, setBvn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate: createWallet, isPending } = useCreateWallet();

  useEffect(() => {
    if (user?.phoneNumber) setPhoneNumber(user.phoneNumber);
  }, [user?.phoneNumber]);

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

  const copy = (value: string, label: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    void label;
  };

  if (!user) return null;

  // Same source of truth the mobile app uses — whether a dedicated
  // account exists is read straight off the already-loaded profile,
  // never re-derived by calling create-account speculatively.
  const hasAccount = user.isWalletCreated && !!user.accountNumber;

  const isFormValid =
    agreedToTerms &&
    bvn.length === 11 &&
    phoneNumber.length >= 10 &&
    !isPending;

  const handleGenerateWallet = () => {
    if (!isFormValid) return;

    const { first_name, last_name } = splitFullName(user.name);

    createWallet(
      { email: user.email, first_name, last_name, phone: phoneNumber, bvn },
      {
        onSuccess: (account) => {
          setUser({
            ...user,
            isWalletCreated: true,
            accountNumber: account.accountNumber,
            bankName: account.bankName,
            accountDetails: [
              {
                accountName: account.accountName || user.name,
                accountNumber: account.accountNumber,
                bankName: account.bankName,
                bankCode: "",
                isDefault: true,
              },
            ],
          });
          setBvn("");
          setAgreedToTerms(false);
        },
      },
    );
  };

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
        subtitle={
          hasAccount
            ? "Transfer to your dedicated account — credited automatically."
            : "Get a dedicated Nigerian bank account to fund your wallet."
        }
      />

      <div className="card p-6 sm:p-7">
        {hasAccount ? (
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
                {user.accountNumber}
              </p>
              <div className="relative mt-3 flex items-center justify-between text-sm">
                <span className="text-cream-50/80">{user.bankName}</span>
                <button
                  onClick={() =>
                    copy(user.accountNumber as string, "Account number")
                  }
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
                {user.accountDetails?.[0]?.accountName || user.name}
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
        ) : (
          <>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-700">
                  Bank Verification Number (BVN)
                </span>
                <input
                  value={bvn}
                  onChange={(e) =>
                    setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  inputMode="numeric"
                  placeholder="Enter your 11-digit BVN"
                  className="input"
                />
                <span className="mt-1.5 flex items-center gap-1 text-xs text-ink-500">
                  <HelpCircle className="h-3 w-3" />
                  Dial *565*0# on your registered number to get your BVN
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-ink-700">
                  Phone number
                </span>
                <input
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  inputMode="tel"
                  placeholder="e.g. 09036018013"
                  className="input"
                />
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line text-forest-800 focus:ring-forest-800"
                />
                <span className="text-xs leading-relaxed text-ink-600">
                  I consent to the collection of my BVN, phone number, and
                  personal details in line with CBN requirements. Depay will
                  never share or sell my information.
                </span>
              </label>

              <div className="flex justify-center gap-2">
                {BADGES.map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-1 rounded-full border border-forest-900/10 bg-forest-900/5 px-2.5 py-1 text-[11px] font-medium text-forest-800"
                  >
                    <b.icon className="h-3 w-3" />
                    {b.label}
                  </span>
                ))}
              </div>

              <button
                onClick={handleGenerateWallet}
                disabled={!isFormValid}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? "Creating your account…" : "Generate bank account"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
