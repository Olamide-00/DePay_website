import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Copy, Check, LogOut, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { verifyPin, updatePin } from '../../lib/api/pin'
import { apiErrorMessage } from '../../lib/api/client'
import { formatDate } from '../../lib/utils'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinSuccess, setPinSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const copyTag = () => {
    if (!user.tag) return
    navigator.clipboard?.writeText(user.tag)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError('')
    setPinSuccess('')

    if (!/^\d{4,6}$/.test(newPin)) {
      setPinError('New PIN must be 4–6 digits.')
      return
    }
    if (newPin !== confirmPin) {
      setPinError("New PIN and confirmation don't match.")
      return
    }

    setSaving(true)
    try {
      const ok = await verifyPin(user.email, currentPin)
      if (!ok) {
        setPinError('Current PIN is incorrect.')
        return
      }
      await updatePin(user.email, newPin)
      setPinSuccess('PIN updated successfully.')
      setCurrentPin('')
      setNewPin('')
      setConfirmPin('')
    } catch (err) {
      setPinError(apiErrorMessage(err, 'Could not update your PIN.'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader icon={User} title="Profile" subtitle="Your account details and security." />

      <div className="space-y-6">
        <div className="card p-6 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-forest-900 text-lg font-semibold text-leaf-400">
              {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-forest-950">{user.name}</p>
              <p className="text-sm text-ink-600">{user.email}</p>
            </div>
          </div>

          <div className="perf my-5" />

          <dl className="space-y-3 text-sm">
            <Row label="Phone number" value={user.phoneNumber || '—'} />
            {user.dateOfBirth && <Row label="Date of birth" value={formatDate(user.dateOfBirth)} />}
            {user.gender && <Row label="Gender" value={user.gender} capitalize />}
          </dl>
        </div>

        {user.tag && (
          <div className="card p-6 sm:p-7">
            <p className="text-xs font-medium text-ink-700">Your referral code</p>
            <div className="mt-2.5 flex items-center justify-between rounded-xl border border-line bg-cream-50 px-4 py-3">
              <span className="font-mono text-sm font-semibold text-forest-950">{user.tag}</span>
              <button onClick={copyTag} className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-900">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleChangePin} className="card p-6 sm:p-7">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-leaf-600" />
            <p className="font-display text-base font-semibold text-forest-950">Change transaction PIN</p>
          </div>
          <div className="mt-4 space-y-3">
            <input
              type="password"
              inputMode="numeric"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Current PIN"
              className="input"
            />
            <input
              type="password"
              inputMode="numeric"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="New PIN (4–6 digits)"
              className="input"
            />
            <input
              type="password"
              inputMode="numeric"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Confirm new PIN"
              className="input"
            />
          </div>
          {pinError && <p className="mt-3 text-xs font-medium text-red-600">{pinError}</p>}
          {pinSuccess && <p className="mt-3 text-xs font-medium text-leaf-600">{pinSuccess}</p>}
          <button type="submit" disabled={saving} className="btn-primary mt-4 w-full">
            {saving ? 'Updating…' : 'Update PIN'}
          </button>
        </form>

        <button onClick={handleLogout} className="btn-ghost w-full text-red-600 hover:border-red-300 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className={`font-medium text-forest-950 ${capitalize ? 'capitalize' : ''}`}>{value}</dd>
    </div>
  )
}
