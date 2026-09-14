import { Link } from 'react-router-dom'
import { Smartphone, Wifi, Tv, Zap, Landmark, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLedger } from '../../hooks/useWallet'
import TransactionRow from '../../components/dashboard/TransactionRow'
import { formatNaira } from '../../lib/utils'

const quickActions = [
  { to: '/dashboard/airtime', icon: Smartphone, label: 'Airtime' },
  { to: '/dashboard/data', icon: Wifi, label: 'Data' },
  { to: '/dashboard/tv', icon: Tv, label: 'TV' },
  { to: '/dashboard/electricity', icon: Zap, label: 'Electricity' },
]

export default function Overview() {
  const { user, balance } = useAuth()
  const { data: ledger, isLoading } = useLedger({ page: 1, limit: 6 })

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-700">Welcome back,</p>
        <h1 className="font-display text-2xl font-semibold text-forest-950">{user.name.split(' ')[0]}</h1>
      </div>

      <div className="stub stub-onforest rounded-2xl bg-forest-950 px-6 py-7 text-cream-50 sm:px-8">
        <p className="text-xs uppercase tracking-wide text-leaf-400">Wallet balance</p>
        <p className="mt-2 font-mono text-4xl font-semibold tracking-tight">{formatNaira(balance)}</p>
        <Link
          to="/dashboard/fund-wallet"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-forest-950 transition-transform hover:-translate-y-0.5"
        >
          <Landmark className="h-4 w-4" />
          Fund wallet
        </Link>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-ink-700">Quick actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card flex flex-col items-center gap-2.5 px-3 py-5 transition-transform hover:-translate-y-0.5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-forest-950">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-ink-700">Recent activity</p>
          <Link to="/dashboard/transactions" className="inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-900">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-cream-100" />
            ))}
          </div>
        ) : !ledger || ledger.data.length === 0 ? (
          <div className="card px-6 py-10 text-center text-sm text-ink-600">No activity yet — your transactions will show up here.</div>
        ) : (
          <div className="space-y-2.5">
            {ledger.data.map((entry) => (
              <TransactionRow key={entry._id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
