import type { LedgerEntry } from '../../types'
import { ledgerIcon, ledgerLabel } from '../../lib/ledgerDisplay'
import { formatDateTime, formatNaira } from '../../lib/utils'

export default function TransactionRow({ entry }: { entry: LedgerEntry }) {
  const Icon = ledgerIcon(entry)
  const isCredit = entry.direction === 'CREDIT'
  const label = ledgerLabel(entry)
  const serviceID = entry.metadata?.serviceID as string | undefined

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{label}</p>
          {serviceID && <p className="truncate text-xs uppercase tracking-wide text-ink-500">{serviceID}</p>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`font-mono text-sm font-semibold ${isCredit ? 'text-leaf-600' : 'text-ink-900'}`}>
          {isCredit ? '+' : '−'}
          {formatNaira(entry.amount)}
        </p>
        <p className="mt-1 text-[10px] text-ink-500">{formatDateTime(entry.createdAt)}</p>
      </div>
    </div>
  )
}
