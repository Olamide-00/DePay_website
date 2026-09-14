import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import * as authApi from '../../lib/api/auth'
import { apiErrorMessage } from '../../lib/api/client'

type Step = 'email' | 'reset'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.sendPasswordResetOtp(email.trim().toLowerCase())
      setStep('reset')
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send the reset code.'))
    } finally {
      setLoading(false)
    }
  }

  const submitReset = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword(email, otp.trim(), password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not reset your password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={step === 'email' ? 'Reset your password' : 'Enter the code'}
      subtitle={
        step === 'email'
          ? "We'll email you a one-time code to reset your password."
          : `Enter the code sent to ${email} and choose a new password.`
      }
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-forest-800 hover:text-forest-900">
            Back to log in
          </Link>
        </>
      }
    >
      {step === 'email' ? (
        <form onSubmit={submitEmail} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">Email address</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input"
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending…' : 'Send reset code'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      ) : (
        <form onSubmit={submitReset} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">6-digit code</span>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              className="input text-center font-mono tracking-[0.4em]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">New password</span>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Resetting…' : 'Reset password'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
