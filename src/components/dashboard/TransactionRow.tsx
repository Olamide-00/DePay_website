import type { LedgerEntry } from "../../types";
import { ledgerIcon, ledgerLabel } from "../../lib/ledgerDisplay";
import { formatDateTime, formatNaira } from "../../lib/utils";

export default function TransactionRow({ entry }: { entry: LedgerEntry }) {
  const Icon = ledgerIcon(entry);
  const isCredit = entry.direction === "CREDIT";
  const label = ledgerLabel(entry);
  const serviceID = entry.metadata?.serviceID as string | undefined;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-leaf-500/30 hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${
            isCredit
              ? "bg-gradient-to-br from-leaf-100 to-leaf-100/50 text-leaf-600 ring-leaf-500/10"
              : "bg-forest-900/5 text-forest-800 ring-forest-900/5"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{label}</p>
          {serviceID && (
            <p className="mt-1 inline-block truncate rounded-md bg-forest-900/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-500">
              {serviceID}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`font-mono text-sm font-semibold ${isCredit ? "text-leaf-600" : "text-ink-900"}`}
        >
          {isCredit ? "+" : "−"}
          {formatNaira(entry.amount)}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {formatDateTime(entry.createdAt)}
        </p>
      </div>
    </div>
  );
}
