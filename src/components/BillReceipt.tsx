import type { LucideIcon } from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'

export default function BillReceipt({
  icon: Icon,
  title,
  sub,
  amount,
  className = '',
}: {
  icon: LucideIcon
  title: string
  sub: string
  amount: string
  className?: string
}) {
  return (
    <div className={`stub stub-oncream w-52 rounded-2xl border border-line bg-white p-4 shadow-card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-leaf-100 text-leaf-600">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-900">{title}</p>
            <p className="text-[10px] text-ink-500">{sub}</p>
          </div>
        </div>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf-500" />
      </div>
      <div className="perf my-3" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-ink-500">Amount</span>
        <span className="font-mono text-sm font-semibold text-forest-950">{amount}</span>
      </div>
    </div>
  )
}
