import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Copy,
  Check,
  LogOut,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { verifyPin, updatePin } from "../../lib/api/pin";
import { apiErrorMessage } from "../../lib/api/client";
import { formatDate } from "../../lib/utils";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const copyTag = () => {
    if (!user.tag) return;
    navigator.clipboard?.writeText(user.tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!/^\d{4,6}$/.test(newPin)) {
      setPinError("New PIN must be 4–6 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("New PIN and confirmation don't match.");
      return;
    }

    setSaving(true);
    try {
      const ok = await verifyPin(user.email, currentPin);
      if (!ok) {
        setPinError("Current PIN is incorrect.");
        return;
      }
      await updatePin(user.email, newPin);
      setPinSuccess("PIN updated successfully.");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (err) {
      setPinError(apiErrorMessage(err, "Could not update your PIN."));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        icon={User}
        title="Profile"
        subtitle="Your account details and security."
      />

      <div className="space-y-6">
        <div className="card overflow-hidden p-0">
          <div className="relative h-20 bg-gradient-to-br from-forest-900 to-forest-950">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-leaf-500/20 blur-3xl"
            />
          </div>

          <div className="px-6 pb-6 sm:px-7 sm:pb-7">
            <div className="-mt-8 flex items-end gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-forest-900 to-forest-950 text-lg font-semibold text-leaf-400 ring-4 ring-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="pb-1">
                <p className="font-display text-lg font-semibold text-forest-950">
                  {user.name}
                </p>
                <p className="text-sm text-ink-600">{user.email}</p>
              </div>
            </div>

            <div className="perf my-5" />

            <dl className="space-y-3 text-sm">
              <Row label="Phone number" value={user.phoneNumber || "—"} />
              {user.dateOfBirth && (
                <Row
                  label="Date of birth"
                  value={formatDate(user.dateOfBirth)}
                />
              )}
              {user.gender && (
                <Row label="Gender" value={user.gender} capitalize />
              )}
            </dl>
          </div>
        </div>

        {user.tag && (
          <div className="card p-6 sm:p-7">
            <p className="text-xs font-medium text-ink-700">
              Your referral code
            </p>
            <div className="mt-2.5 flex items-center justify-between rounded-xl border border-dashed border-leaf-500/40 bg-leaf-500/5 px-4 py-3">
              <span className="font-mono text-sm font-semibold text-forest-950">
                {user.tag}
              </span>
              <button
                onClick={copyTag}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  copied
                    ? "bg-leaf-100 text-leaf-600"
                    : "text-forest-800 hover:bg-forest-900/5"
                }`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleChangePin} className="card p-6 sm:p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="font-display text-base font-semibold text-forest-950">
              Change transaction PIN
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                Current PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) =>
                  setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Current PIN"
                className="input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                New PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) =>
                  setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="New PIN (4–6 digits)"
                className="input"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                Confirm new PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Confirm new PIN"
                className="input"
              />
            </div>
          </div>
          {pinError && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {pinError}
            </p>
          )}
          {pinSuccess && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-leaf-100 px-3 py-2 text-xs font-medium text-leaf-600">
              <Check className="h-3.5 w-3.5 shrink-0" />
              {pinSuccess}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-4 w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-500/20"
          >
            {saving ? "Updating…" : "Update PIN"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="btn-ghost w-full text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd
        className={`font-medium text-forest-950 ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
