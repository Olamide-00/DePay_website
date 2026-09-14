import { useEffect, useState } from 'react'
import { Zap, CheckCircle2, Loader2 } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import PinModal from '../../components/dashboard/PinModal'
import Receipt from '../../components/dashboard/Receipt'
import { useAuth } from '../../context/AuthContext'
import { useServices, useVerifyBillersCode, usePayBill } from '../../hooks/useBills'
import { formatNaira } from '../../lib/utils'
import type { ReceiptData, VTPassService, PayBillResponseData } from '../../types'

const presets = [1000, 2000, 5000, 10000, 20000]

export default function Electricity() {
  const { user, refreshBalance } = useAuth()
  const { data: services, isLoading: servicesLoading } = useServices('electricity-bill')

  const [service, setService] = useState<VTPassService | null>(null)
  const [paymentType, setPaymentType] = useState<'prepaid' | 'postpaid'>('prepaid')
  const [meterNumber, setMeterNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [pinOpen, setPinOpen] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const verifyMutation = useVerifyBillersCode()
  const payBillMutation = usePayBill()

  const meterValid = meterNumber.length === 11 || meterNumber.length === 12 || meterNumber.length === 13

  useEffect(() => {
    setCustomerName('')
    if (!service || !meterValid) return
    const t = setTimeout(() => {
      verifyMutation.mutate(
        { serviceID: service.serviceID, billersCode: meterNumber },
        {
          onSuccess: (res) => setCustomerName(res?.content?.Customer_Name || ''),
          onError: () => setCustomerName(''),
        }
      )
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, meterNumber, paymentType])

  const finalAmount = amount ?? (customAmount ? Number(customAmount) : 0)
  const canSubmit = !!service && meterValid && !!customerName && finalAmount >= 500

  const handlePickPreset = (v: number) => {
    setAmount(v)
    setCustomAmount('')
  }
  const handleCustomAmount = (v: string) => {
    setCustomAmount(v.replace(/[^\d]/g, ''))
    setAmount(null)
  }

  const openPin = () => {
    setError('')
    if (!canSubmit) {
      setError('Select a provider, enter a valid meter number, and an amount of at least ₦500.')
      return
    }
    setPinOpen(true)
  }

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: service!.serviceID,
      billersCode: meterNumber,
      variation_code: paymentType,
      phone: user!.phoneNumber,
      amount: finalAmount,
    })
    const delivered = response?.content?.transactions?.status === 'delivered'
    if (!delivered) return { success: false, message: 'Transaction did not complete. Please try again.' }
    return { success: true, data: response }
  }

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData
    setReceipt({
      title: `${service!.name} — ${paymentType === 'prepaid' ? 'Prepaid' : 'Postpaid'}`,
      subtitle: customerName || meterNumber,
      amount: finalAmount,
      reference: response.paymentReference || 'N/A',
      date: new Date().toISOString(),
      token: response.token ? response.token.replace('Token : ', '') : null,
      units: response.units,
    })
    setPinOpen(false)
    refreshBalance()
  }

  const reset = () => {
    setReceipt(null)
    setMeterNumber('')
    setAmount(null)
    setCustomAmount('')
    setService(null)
    setCustomerName('')
    setError('')
  }

  if (!user) return null
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader icon={Zap} title="Electricity" subtitle="Prepaid and postpaid, all major DisCos." />

      <div className="card space-y-6 p-6 sm:p-7">
        <div className="flex rounded-xl bg-cream-100 p-1">
          {(['prepaid', 'postpaid'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPaymentType(t)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors ${
                paymentType === t ? 'bg-white text-forest-950 shadow-sm' : 'text-ink-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Provider</p>
          {servicesLoading ? (
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-cream-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {(services ?? []).map((s: VTPassService) => (
                <button
                  key={s.serviceID}
                  type="button"
                  onClick={() => setService(s)}
                  className={`rounded-xl border px-2.5 py-3.5 text-center text-[11px] font-semibold leading-tight transition-colors ${
                    service?.serviceID === s.serviceID
                      ? 'border-forest-800 bg-forest-900/5 text-forest-950'
                      : 'border-line text-ink-700 hover:border-forest-800/30'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-700">Meter number</span>
          <div className="relative">
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 13))}
              placeholder="Enter meter number"
              className="input pr-9"
            />
            {verifyMutation.isPending && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-500" />
            )}
            {!verifyMutation.isPending && customerName && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-leaf-600" />
            )}
          </div>
          {customerName && <p className="mt-1.5 text-xs font-medium text-leaf-600">{customerName}</p>}
          {!customerName && meterValid && !verifyMutation.isPending && service && (
            <p className="mt-1.5 text-xs text-red-500">Could not verify this meter number.</p>
          )}
        </label>

        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Amount</p>
          <div className="grid grid-cols-5 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePickPreset(p)}
                className={`rounded-xl border px-1 py-2.5 font-mono text-[11px] font-semibold transition-colors ${
                  amount === p
                    ? 'border-forest-800 bg-forest-900 text-cream-50'
                    : 'border-line text-forest-950 hover:border-forest-800/30'
                }`}
              >
                {formatNaira(p).replace('.00', '')}
              </button>
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="Or enter a custom amount"
            className="input mt-2.5"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

        <button onClick={openPin} className="btn-primary w-full">
          {finalAmount > 0 ? `Pay ${formatNaira(finalAmount)}` : 'Continue'}
        </button>
      </div>

      <PinModal
        open={pinOpen}
        amountLabel={formatNaira(finalAmount)}
        onClose={() => setPinOpen(false)}
        onPay={handlePay}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
