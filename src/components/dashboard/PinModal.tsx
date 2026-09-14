import { useEffect, useRef, useState } from 'react'
import { Lock, X, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { verifyPin as verifyPinApi } from '../../lib/api/pin'
import { apiErrorMessage } from '../../lib/api/client'

type Stage = 'idle' | 'verifying' | 'processing' | 'success'

const STAGE_LABEL: Record<Exclude<Stage, 'idle'>, string> = {
  verifying: 'Verifying your PIN',
  processing: 'Processing your payment',
  success: 'Payment successful',
}

export interface PayResult {
  success: boolean
  message?: string
  data?: unknown
}

export default function PinModal({
  open,
  amountLabel,
  onClose,
  onPay,
  onSuccess,
}: {
  open: boolean
  amountLabel: string
  onClose: () => void
  /** Performs the actual money-moving action, called only after the PIN verifies. */
  onPay: () => Promise<PayResult>
  onSuccess: (data: unknown) => void
}) {
  const { user } = useAuth()
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (open) {
      setDigits(['', '', '', ''])
      setError('')
      setStage('idle')
      setTimeout(() => inputs.current[0]?.focus(), 50)
    }
  }, [open])

  if (!open) return null

  const runPayment = async (pin: string) => {
    if (!user) return
    setStage('verifying')
    const pinOk = await verifyPinApi(user.email, pin)
    if (!pinOk) {
      setStage('idle')
      setError('Incorrect PIN. Please try again.')
      setDigits(['', '', '', ''])
      setTimeout(() => inputs.current[0]?.focus(), 50)
      return
    }

    setStage('processing')
    try {
      const result = await onPay()
      if (result.success) {
        setStage('success')
        setTimeout(() => {
          onSuccess(result.data)
        }, 650)
      } else {
        setStage('idle')
        setError(result.message || 'Payment failed. Please try again.')
        setDigits(['', '', '', ''])
        setTimeout(() => inputs.current[0]?.focus(), 50)
      }
    } catch (err) {
      setStage('idle')
      setError(apiErrorMessage(err, 'Payment failed. Please try again.'))
      setDigits(['', '', '', ''])
      setTimeout(() => inputs.current[0]?.focus(), 50)
    }
  }

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = v
    setDigits(next)
    setError('')
    if (v && idx < 3) inputs.current[idx + 1]?.focus()

    if (next.every((d) => d !== '')) {
      runPayment(next.join(''))
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  const isBusy = stage !== 'idle'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest-950/50 px-4">
      {isBusy ? (
        <div className="flex flex-col items-center gap-4 text-center">
          {stage === 'success' ? (
            <CheckCircle2 className="h-11 w-11 text-leaf-400" />
          ) : (
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-cream-50/25 border-t-cream-50" />
          )}
          <p className="font-display text-base font-medium text-cream-50">{STAGE_LABEL[stage]}</p>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-pop">
          <div className="flex items-start justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-600">
              <Lock className="h-5 w-5" />
            </div>
            <button onClick={onClose} aria-label="Close" className="text-ink-500 hover:text-ink-900">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-forest-950">Enter your transaction PIN</h3>
          <p className="mt-1 text-sm text-ink-700">Confirm {amountLabel} with your 4-digit PIN.</p>

          <div className="mt-6 flex justify-center gap-3">
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputs.current[idx] = el
                }}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                inputMode="numeric"
                maxLength={1}
                type="password"
                className="h-14 w-12 rounded-xl border border-line bg-cream-50 text-center font-mono text-2xl font-semibold text-forest-950 outline-none focus:border-leaf-500"
              />
            ))}
          </div>

          {error && <p className="mt-4 text-center text-xs font-medium text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}
