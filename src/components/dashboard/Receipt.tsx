import { CheckCircle2, Download, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReceiptData } from '../../types'
import { formatDateTime, formatNaira } from '../../lib/utils'

export default function Receipt({
  receipt,
  onNewPayment,
}: {
  receipt: ReceiptData
  onNewPayment: () => void
}) {
  return (
    <div className="mx-auto max-w-md">
      <div className="stub stub-oncream rounded-2xl border border-line bg-white p-7 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-leaf-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-forest-950">Payment successful</h2>
          <p className="mt-1 text-sm text-ink-700">{receipt.title}</p>
          <p className="mt-4 font-mono text-3xl font-semibold text-forest-950">
            {formatNaira(receipt.amount)}
          </p>
        </div>

        <div className="perf my-6" />

        <dl className="space-y-3 text-sm">
          <Row label="Reference" value={receipt.reference} mono />
          <Row label="Recipient" value={receipt.subtitle} />
          <Row label="Date" value={formatDateTime(receipt.date)} />
          <Row label="Status" value="Success" success />
          {receipt.token && <Row label="Token" value={receipt.token} mono />}
          {receipt.pin && <Row label="PIN" value={receipt.pin} mono />}
          {receipt.units && <Row label="Units" value={receipt.units} mono />}
        </dl>

        <div className="perf my-6" />

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button onClick={onNewPayment} className="btn-ghost btn-sm flex-1">
            <RotateCcw className="h-3.5 w-3.5" />
            Make another
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary btn-sm flex-1"
          >
            <Download className="h-3.5 w-3.5" />
            Save receipt
          </button>
        </div>
      </div>

      <Link
        to="/dashboard"
        className="mt-5 block text-center text-sm font-medium text-forest-800 hover:text-forest-900"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
  success,
}: {
  label: string
  value: string
  mono?: boolean
  success?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-xs uppercase tracking-wide text-ink-500">{label}</dt>
      <dd
        className={`text-right text-sm font-medium ${mono ? 'font-mono' : ''} ${
          success ? 'text-leaf-600' : 'text-forest-950'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
