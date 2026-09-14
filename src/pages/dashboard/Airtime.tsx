import { useMemo, useState } from "react";
import { Smartphone, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import PinModal from "../../components/dashboard/PinModal";
import Receipt from "../../components/dashboard/Receipt";
import { useAuth } from "../../context/AuthContext";
import { useServices, usePayBill } from "../../hooks/useBills";
import { detectNetworkName } from "../../lib/networkDetect";
import { networkFor, pickNormalServices } from "../../lib/networkStyle";
import { formatNaira } from "../../lib/utils";
import type {
  ReceiptData,
  VTPassService,
  PayBillResponseData,
} from "../../types";

const presets = [50, 100, 200, 500, 1000, 2000, 5000];

export default function Airtime() {
  const { user, refreshBalance } = useAuth();
  const { data: services, isLoading: servicesLoading } = useServices("airtime");
  const visibleServices = useMemo(
    () => pickNormalServices(services),
    [services],
  );
  const payBillMutation = usePayBill();

  const [service, setService] = useState<VTPassService | null>(null);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
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

  const finalAmount = amount ?? (customAmount ? Number(customAmount) : 0);
  const canSubmit =
    !!activeService &&
    phone.replace(/\s+/g, "").length === 11 &&
    finalAmount > 0;

  const handlePickPreset = (v: number) => {
    setAmount(v);
    setCustomAmount("");
  };
  const handleCustomAmount = (v: string) => {
    setCustomAmount(v.replace(/[^\d]/g, ""));
    setAmount(null);
  };

  const openPin = () => {
    setError("");
    if (!canSubmit) {
      setError(
        "Choose a network, enter a valid 11-digit phone number and an amount.",
      );
      return;
    }
    setPinOpen(true);
  };

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: activeService!.serviceID,
      amount: finalAmount,
      phone: phone.trim(),
    });
    const delivered = response?.content?.transactions?.status === "delivered";
    if (!delivered) {
      return {
        success: false,
        message: "Transaction did not complete. Please try again.",
      };
    }
    return { success: true, data: response };
  };

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData;
    setReceipt({
      title: `${activeService!.name} Airtime`,
      subtitle: `to ${phone.trim()}`,
      amount: finalAmount,
      reference:
        response.paymentReference ||
        response.content?.transactions?.transactionId?.toString() ||
        "N/A",
      date: new Date().toISOString(),
    });
    setPinOpen(false);
    refreshBalance();
  };

  const reset = () => {
    setReceipt(null);
    setPhone("");
    setAmount(null);
    setCustomAmount("");
    setService(null);
    setError("");
  };

  if (!user) return null;
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        icon={Smartphone}
        title="Buy airtime"
        subtitle="Top up any Nigerian line instantly."
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
                    onClick={() => setService(s)}
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
          {detectedService && !service && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-leaf-600">
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
              {networkFor(detectedService.name)?.label ?? detectedService.name}{" "}
              from this number
            </p>
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
        </label>

        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Amount</p>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePickPreset(p)}
                className={`rounded-xl border px-2 py-2.5 font-mono text-xs font-semibold transition-all duration-200 ${
                  amount === p
                    ? "border-forest-800 bg-forest-900 text-cream-50 shadow-sm shadow-forest-900/20"
                    : "border-line text-forest-950 hover:-translate-y-0.5 hover:border-forest-800/30"
                }`}
              >
                {formatNaira(p).replace(".00", "")}
              </button>
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="Or enter a custom amount"
            className="input mt-2.5"
          />
        </div>

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
          {finalAmount > 0 ? `Pay ${formatNaira(finalAmount)}` : "Continue"}
        </button>
      </div>

      <PinModal
        open={pinOpen}
        amountLabel={formatNaira(finalAmount)}
        onClose={() => setPinOpen(false)}
        onPay={handlePay}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
