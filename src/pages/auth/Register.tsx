import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/AuthContext'
import * as authApi from '../../lib/api/auth'
import { apiErrorMessage } from '../../lib/api/client'

type Step = 'email' | 'otp' | 'details'

const STEP_ORDER: Step[] = ['email', 'otp', 'details']

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const otpInputs = useRef<Array<HTMLInputElement | null>>([])
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pin, setPin] = useState('')

  const stepIndex = STEP_ORDER.indexOf(step)

  // ── Step 1: send OTP ────────────────────────────────────────
  const submitEmail = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.sendRegistrationOtp(email.trim().toLowerCase())
      setStep('otp')
      setTimeout(() => otpInputs.current[0]?.focus(), 50)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send the OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────
  const handleOtpChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = v
    setOtp(next)
    setError('')
    if (v && idx < 5) otpInputs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpInputs.current[idx - 1]?.focus()
  }

  const submitOtp = async (e: FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Enter the 6-digit code sent to your email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.verifyRegistrationOtp(email, code)
      setStep('details')
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid or expired code.'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await authApi.resendOtp(email)
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not resend the code.'))
    } finally {
      setResending(false)
    }
  }

  // ── Step 3: complete registration, then auto-login ──────────
  const submitDetails = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setError('Transaction PIN must be 4–6 digits.')
      return
    }
    if (phoneNumber.replace(/\s+/g, '').length < 10) {
      setError('Please enter a valid phone number.')
      return
    }

    setLoading(true)
    try {
      await authApi.completeRegistration({
        email,
        fullName: fullName.trim(),
        password,
        transactionPIN: pin,
        phoneNumber: phoneNumber.trim(),
      })
      const result = await login(email, password)
      if (!result.success) {
        // Registration succeeded but auto-login failed for some
        // reason — send them to the login page instead of stranding
        // them on a dead-end form.
        navigate('/login')
        return
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create your account.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={step === 'email' ? 'Create your account' : step === 'otp' ? 'Check your email' : 'Almost there'}
      subtitle={
        step === 'email'
          ? 'Set up a Depay wallet in under a minute.'
          : step === 'otp'
            ? `We sent a 6-digit code to ${email}.`
            : 'A few last details to secure your wallet.'
      }
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-forest-800 hover:text-forest-900">
            Log in
          </Link>
        </>
      }
    >
      <div className="mb-6 flex justify-center gap-1.5">
        {STEP_ORDER.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 w-8 rounded-full transition-colors ${i <= stepIndex ? 'bg-forest-800' : 'bg-line'}`}
          />
        ))}
      </div>

      {step === 'email' && (
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
            {loading ? 'Sending code…' : 'Continue'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={submitOtp} className="space-y-5">
          <div className="flex justify-center gap-2">
            {otp.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpInputs.current[idx] = el
                }}
                value={d}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                inputMode="numeric"
                maxLength={1}
                className="h-12 w-11 rounded-xl border border-line bg-cream-50 text-center font-mono text-xl font-semibold text-forest-950 outline-none focus:border-leaf-500"
              />
            ))}
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying…' : 'Verify code'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-forest-800 hover:text-forest-900"
          >
            <Mail className="h-3.5 w-3.5" />
            {resending ? 'Resending…' : resent ? 'Code resent!' : "Didn't get it? Resend code"}
          </button>
        </form>
      )}

      {step === 'details' && (
        <form onSubmit={submitDetails} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">Full name</span>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Olamide Oladele"
              className="input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">Phone number</span>
            <input
              required
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
              placeholder="0903 601 8013"
              className="input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">Password</span>
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

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-700">Transaction PIN</span>
            <input
              required
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="4–6 digits — used to confirm payments"
              className="input"
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
