import { useMemo, useState } from "react";
import { Wifi, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import PinModal from "../../components/dashboard/PinModal";
import Receipt from "../../components/dashboard/Receipt";
import { useAuth } from "../../context/AuthContext";
import {
  useServices,
  useServiceVariations,
  usePayBill,
} from "../../hooks/useBills";
import { detectNetworkName } from "../../lib/networkDetect";
import { formatNaira } from "../../lib/utils";
import type {
  ReceiptData,
  VTPassService,
  VTPassVariation,
  PayBillResponseData,
} from "../../types";

// The 4 networks we show, in display order. `match` covers the name
// variants VTPass uses (9mobile is sometimes still labelled "Etisalat").
const NETWORKS = [
  { match: ["mtn"], label: "MTN", badge: "bg-amber-500 text-forest-950" },
  { match: ["airtel"], label: "Airtel", badge: "bg-red-600 text-white" },
  { match: ["glo"], label: "Glo", badge: "bg-leaf-500 text-forest-950" },
  {
    match: ["9mobile", "etisalat"],
    label: "9mobile",
    badge: "bg-forest-700 text-cream-50",
  },
];

function networkFor(name: string) {
  const lower = name.toLowerCase();
  return NETWORKS.find((n) => n.match.some((m) => lower.includes(m)));
}

// Providers often return several service IDs per network (SME, gifting,
// corporate, "share" bundles, etc). We only want the one normal/direct
// data service per network — filter to the 4 networks and, within each,
// prefer the plain variant over anything flagged as a special bundle.
function pickNormalServices(
  services: VTPassService[] | undefined,
): VTPassService[] {
  if (!services) return [];
  return NETWORKS.map((net) => {
    const matches = services.filter((s) =>
      net.match.some((m) => s.name.toLowerCase().includes(m)),
    );
    if (matches.length === 0) return null;
    const plain = matches.find(
      (s) => !/sme|share|gifting|corporate|awoof/i.test(s.name),
    );
    return plain ?? matches[0];
  }).filter((s): s is VTPassService => s !== null);
}

export default function Data() {
  const { user, refreshBalance } = useAuth();
  const { data: services, isLoading: servicesLoading } = useServices("data");
  const visibleServices = useMemo(
    () => pickNormalServices(services),
    [services],
  );

  const [service, setService] = useState<VTPassService | null>(null);
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<VTPassVariation | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const detectedName = useMemo(() => detectNetworkName(phone), [phone]);
  const detectedService = useMemo(
    () =>
      visibleServices.find(
        (s) =>
          detectedName &&
          s.name.toLowerCase().includes(detectedName.toLowerCase()),
      ),
    [visibleServices, detectedName],
  );
  const activeService = service ?? detectedService ?? null;

  const { data: plans, isLoading: plansLoading } = useServiceVariations(
    activeService?.serviceID ?? null,
  );
  const payBillMutation = usePayBill();

  const canSubmit =
    !!activeService && phone.replace(/\s+/g, "").length === 11 && !!plan;

  const openPin = () => {
    setError("");
    if (!canSubmit) {
      setError(
        "Choose a network, a plan, and enter a valid 11-digit phone number.",
      );
      return;
    }
    setPinOpen(true);
  };

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: activeService!.serviceID,
      billersCode: phone.trim(),
      variation_code: plan!.variation_code,
      phone: phone.trim(),
      amount: Number(plan!.variation_amount),
    });
    const delivered = response?.content?.transactions?.status === "delivered";
    if (!delivered)
      return {
        success: false,
        message: "Transaction did not complete. Please try again.",
      };
    return { success: true, data: response };
  };

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData;
    setReceipt({
      title: `${activeService!.name} — ${plan!.name}`,
      subtitle: `to ${phone.trim()}`,
      amount: Number(plan!.variation_amount),
      reference: response.paymentReference || "N/A",
      date: new Date().toISOString(),
    });
    setPinOpen(false);
    refreshBalance();
  };

  const reset = () => {
    setReceipt(null);
    setPhone("");
    setPlan(null);
    setService(null);
    setError("");
  };

  if (!user) return null;
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        icon={Wifi}
        title="Buy data"
        subtitle="SME and direct data bundles, all networks."
      />

      <div className="card space-y-6 p-6 sm:p-7">
        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Network</p>
          {servicesLoading ? (
            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[74px] animate-pulse rounded-xl bg-cream-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {visibleServices.map((s) => {
                const net = networkFor(s.name);
                const isActive = activeService?.serviceID === s.serviceID;
                return (
                  <button
                    key={s.serviceID}
                    type="button"
                    onClick={() => {
                      setService(s);
                      setPlan(null);
                    }}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-all duration-200 ${
                      isActive
                        ? "border-forest-800 bg-forest-900/5 shadow-sm"
                        : "border-line hover:-translate-y-0.5 hover:border-forest-800/30 hover:shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-leaf-500 text-white">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    )}
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold ring-2 ring-white ${
                        net?.badge ?? "bg-ink-500 text-cream-50"
                      }`}
                    >
                      {(net?.label ?? s.name).slice(0, 2).toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium text-ink-700">
                      {net?.label ?? s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-700">
            Phone number
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))
            }
            placeholder="0803 000 0000"
            className="input"
          />
          {!service && detectedService && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-leaf-600">
              <span
                className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[7px] font-bold ${
                  networkFor(detectedService.name)?.badge ??
                  "bg-ink-500 text-cream-50"
                }`}
              >
                {(
                  networkFor(detectedService.name)?.label ??
                  detectedService.name
                ).slice(0, 1)}
              </span>
              Detected{" "}
              {networkFor(detectedService.name)?.label ?? detectedService.name}
            </p>
          )}
        </label>

        {activeService && (
          <div>
            <p className="mb-2.5 text-xs font-medium text-ink-700">
              Choose a plan
            </p>
            {plansLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-xl bg-cream-100"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {(plans ?? []).map((p) => {
                  const isActive = plan?.variation_code === p.variation_code;
                  return (
                    <button
                      key={p.variation_code}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`relative rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? "border-forest-800 bg-forest-900/5 shadow-sm"
                          : "border-line hover:-translate-y-0.5 hover:border-forest-800/30 hover:shadow-sm"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-leaf-500 text-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                      )}
                      <p className="text-xs font-semibold text-forest-950">
                        {p.name}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-ink-600">
                        {formatNaira(Number(p.variation_amount))}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        <button
          onClick={openPin}
          className="btn-primary w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf-500/20"
        >
          {plan
            ? `Pay ${formatNaira(Number(plan.variation_amount))}`
            : "Continue"}
        </button>
      </div>

      <PinModal
        open={pinOpen}
        amountLabel={plan ? formatNaira(Number(plan.variation_amount)) : ""}
        onClose={() => setPinOpen(false)}
        onPay={handlePay}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
