import { useState } from "react";
import {
  Receipt as ReceiptIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import TransactionRow from "../../components/dashboard/TransactionRow";
import { useLedger } from "../../hooks/useWallet";
import type { LedgerCategory } from "../../types";

const PER_PAGE = 15;

const CATEGORIES: { value: LedgerCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "BILL_PAYMENT", label: "Bills" },
  { value: "WALLET_FUNDING", label: "Funding" },
  { value: "BILL_REFUND", label: "Refunds" },
  { value: "REFERRAL_BONUS", label: "Referrals" },
  { value: "JTOKEN_CONVERSION", label: "JTokens" },
];

function TransactionRowSkeleton() {
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

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<LedgerCategory | "all">("all");

  const { data, isLoading } = useLedger({
    page,
    limit: PER_PAGE,
    category: category === "all" ? undefined : category,
  });

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div>
      <PageHeader
        icon={ReceiptIcon}
        title="Transactions"
        subtitle="Every wallet movement, in one place."
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setCategory(c.value);
              setPage(1);
            }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              category === c.value
                ? "border-forest-900 bg-forest-900 text-cream-50 shadow-sm shadow-forest-900/20"
                : "border-line text-ink-700 hover:-translate-y-0.5 hover:border-forest-800/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <TransactionRowSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-900/5 text-forest-800">
            <ReceiptIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">
              No transactions yet
            </p>
            <p className="mt-1 text-sm text-ink-600">
              Your wallet movements will show up here once you make one.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {data.data.map((entry) => (
              <TransactionRow key={entry._id} entry={entry} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost btn-sm px-3 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-ink-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost btn-sm px-3 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
