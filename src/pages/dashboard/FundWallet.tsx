import { useEffect, useState } from 'react'
import { Landmark, Copy, Check, PartyPopper } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useReservedAccount } from '../../hooks/useWallet'
import { getSocket } from '../../lib/socket'
import { formatNaira } from '../../lib/utils'

export default function FundWallet() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [justFunded, setJustFunded] = useState<number | null>(null)

  const { data: account, isLoading, isError, refetch } = useReservedAccount(
    user
      ? {
          email: user.email,
          phone: user.phoneNumber,
          first_name: user.name.split(' ')[0] || user.name,
          last_name: user.name.split(' ').slice(1).join(' ') || user.name,
        }
      : null
  )

  // Live "money just landed" moment — the backend's webhook pushes
  // this the instant a transfer to the dedicated account clears, so
  // there's nothing to poll or a "confirm" button to fake.
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = (payload: { amountAdded: number }) => setJustFunded(payload.amountAdded)
    socket.on('balance_updated', handler)
    return () => {
      socket.off('balance_updated', handler)
    }
  }, [])

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (!user) return null

  if (justFunded !== null) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="card p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-leaf-600">
            <PartyPopper className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-forest-950">Wallet funded!</h2>
          <p className="mt-2 font-mono text-2xl font-semibold text-forest-950">
            +{formatNaira(justFunded)}
          </p>
          <p className="mt-2 text-sm text-ink-700">Your new balance reflects across the dashboard already.</p>
          <button onClick={() => setJustFunded(null)} className="btn-primary mt-6 w-full">
            Fund again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader icon={Landmark} title="Fund wallet" subtitle="Transfer to your dedicated account — credited automatically." />

      <div className="card p-6 sm:p-7">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-xl bg-cream-100" />
            <div className="h-14 animate-pulse rounded-xl bg-cream-100" />
          </div>
        ) : isError || !account ? (
          <div className="py-6 text-center">
            <p className="text-sm text-ink-700">Couldn't load your account details.</p>
            <button onClick={() => refetch()} className="btn-ghost btn-sm mt-4">
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="stub stub-onforest rounded-2xl bg-forest-950 px-6 py-7 text-cream-50">
              <p className="text-xs uppercase tracking-wide text-leaf-400">Your dedicated account</p>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-wide">{account.accountNumber}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-cream-50/80">{account.bankName}</span>
                <button
                  onClick={() => copy(account.accountNumber)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 text-xs text-cream-50/70">{account.accountName}</p>
            </div>

            <div className="perf my-6" />

            <ol className="space-y-3 text-sm text-ink-700">
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-[11px] font-bold text-leaf-700">1</span>
                Open your bank app and transfer any amount to the account above.
              </li>
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-[11px] font-bold text-leaf-700">2</span>
                Your DePay wallet credits automatically within seconds of the transfer clearing.
              </li>
              <li className="flex gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-100 text-[11px] font-bold text-leaf-700">3</span>
                No need to refresh — you'll see it land right here.
              </li>
            </ol>

            <p className="mt-6 text-center text-xs text-ink-500">
              This account is uniquely yours — reuse it any time you want to fund your wallet.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
