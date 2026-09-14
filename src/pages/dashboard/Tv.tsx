import { useEffect, useState } from 'react'
import { Tv as TvIcon, CheckCircle2, Loader2 } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import PinModal from '../../components/dashboard/PinModal'
import Receipt from '../../components/dashboard/Receipt'
import { useAuth } from '../../context/AuthContext'
import { useServices, useServiceVariations, useVerifyBillersCode, usePayBill } from '../../hooks/useBills'
import { formatNaira } from '../../lib/utils'
import type { ReceiptData, VTPassService, VTPassVariation, PayBillResponseData } from '../../types'

export default function Tv() {
  const { user, refreshBalance } = useAuth()
  const { data: services, isLoading: servicesLoading } = useServices('tv-subscription')

  const [service, setService] = useState<VTPassService | null>(null)
  const [smartcard, setSmartcard] = useState('')
  const [plan, setPlan] = useState<VTPassVariation | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [pinOpen, setPinOpen] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const { data: plans, isLoading: plansLoading } = useServiceVariations(service?.serviceID ?? null)
  const verifyMutation = useVerifyBillersCode()
  const payBillMutation = usePayBill()

  const smartcardValid = smartcard.length >= 10 && smartcard.length <= 12

  useEffect(() => {
    setCustomerName('')
    if (!service || !smartcardValid) return
    const t = setTimeout(() => {
      verifyMutation.mutate(
        { serviceID: service.serviceID, billersCode: smartcard },
        {
          onSuccess: (res) => setCustomerName(res?.content?.Customer_Name || ''),
          onError: () => setCustomerName(''),
        }
      )
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, smartcard])

  const canSubmit = !!service && smartcardValid && !!customerName && !!plan

  const openPin = () => {
    setError('')
    if (!canSubmit) {
      setError('Select a provider, enter a valid smartcard number, and choose a bouquet.')
      return
    }
    setPinOpen(true)
  }

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: service!.serviceID,
      billersCode: smartcard,
      variation_code: plan!.variation_code,
      phone: user!.phoneNumber,
      amount: Number(plan!.variation_amount),
    })
    const delivered = response?.content?.transactions?.status === 'delivered'
    if (!delivered) return { success: false, message: 'Transaction did not complete. Please try again.' }
    return { success: true, data: response }
  }

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData
    setReceipt({
      title: `${service!.name} — ${plan!.name}`,
      subtitle: customerName || smartcard,
      amount: Number(plan!.variation_amount),
      reference: response.paymentReference || 'N/A',
      date: new Date().toISOString(),
    })
    setPinOpen(false)
    refreshBalance()
  }

  const reset = () => {
    setReceipt(null)
    setSmartcard('')
    setPlan(null)
    setService(null)
    setCustomerName('')
    setError('')
  }

  if (!user) return null
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader icon={TvIcon} title="TV subscription" subtitle="DStv, GOtv, and StarTimes." />

      <div className="card space-y-6 p-6 sm:p-7">
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
              {(services ?? []).map((s) => (
                <button
                  key={s.serviceID}
                  type="button"
                  onClick={() => {
                    setService(s)
                    setPlan(null)
                  }}
                  className={`rounded-xl border px-3 py-3.5 text-center text-xs font-semibold transition-colors ${
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
          <span className="mb-1.5 block text-xs font-medium text-ink-700">Smartcard / IUC number</span>
          <div className="relative">
            <input
              type="text"
              value={smartcard}
              onChange={(e) => setSmartcard(e.target.value.replace(/[^\d]/g, '').slice(0, 12))}
              placeholder="1234567890"
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
          {!customerName && smartcardValid && !verifyMutation.isPending && service && (
            <p className="mt-1.5 text-xs text-red-500">Could not verify this smartcard number.</p>
          )}
        </label>

        {service && (
          <div>
            <p className="mb-2.5 text-xs font-medium text-ink-700">Bouquet</p>
            {plansLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-cream-100" />
                ))}
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {(plans ?? []).map((p) => (
                  <button
                    key={p.variation_code}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
                      plan?.variation_code === p.variation_code
                        ? 'border-forest-800 bg-forest-900/5'
                        : 'border-line hover:border-forest-800/30'
                    }`}
                  >
                    <p className="text-xs font-semibold text-forest-950">{p.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-ink-600">{formatNaira(Number(p.variation_amount))}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

        <button onClick={openPin} className="btn-primary w-full">
          {plan ? `Pay ${formatNaira(Number(plan.variation_amount))}` : 'Continue'}
        </button>
      </div>

      <PinModal
        open={pinOpen}
        amountLabel={plan ? formatNaira(Number(plan.variation_amount)) : ''}
        onClose={() => setPinOpen(false)}
        onPay={handlePay}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
