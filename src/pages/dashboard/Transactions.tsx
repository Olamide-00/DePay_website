import { useState } from 'react'
import { Receipt as ReceiptIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import TransactionRow from '../../components/dashboard/TransactionRow'
import { useLedger } from '../../hooks/useWallet'
import type { LedgerCategory } from '../../types'

const PER_PAGE = 15

const CATEGORIES: { value: LedgerCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'BILL_PAYMENT', label: 'Bills' },
  { value: 'WALLET_FUNDING', label: 'Funding' },
  { value: 'BILL_REFUND', label: 'Refunds' },
  { value: 'REFERRAL_BONUS', label: 'Referrals' },
  { value: 'JTOKEN_CONVERSION', label: 'JTokens' },
]

export default function Transactions() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<LedgerCategory | 'all'>('all')

  const { data, isLoading } = useLedger({
    page,
    limit: PER_PAGE,
    category: category === 'all' ? undefined : category,
  })

  const totalPages = data?.pagination.totalPages ?? 1

  return (
    <div>
      <PageHeader icon={ReceiptIcon} title="Transactions" subtitle="Every wallet movement, in one place." />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setCategory(c.value)
              setPage(1)
            }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              category === c.value
                ? 'border-forest-800 bg-forest-900 text-cream-50'
                : 'border-line text-ink-700 hover:border-forest-800/30'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-cream-100" />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="card px-6 py-14 text-center text-sm text-ink-600">No transactions found.</div>
      ) : (
        <>
          <div className="space-y-2.5">
            {data.data.map((entry) => (
              <TransactionRow key={entry._id} entry={entry} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
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
  )
}
