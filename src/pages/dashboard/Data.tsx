import { useMemo, useState } from 'react'
import { Wifi } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import PinModal from '../../components/dashboard/PinModal'
import Receipt from '../../components/dashboard/Receipt'
import { useAuth } from '../../context/AuthContext'
import { useServices, useServiceVariations, usePayBill } from '../../hooks/useBills'
import { detectNetworkName } from '../../lib/networkDetect'
import { formatNaira } from '../../lib/utils'
import type { ReceiptData, VTPassService, VTPassVariation, PayBillResponseData } from '../../types'

const NETWORK_STYLE: Record<string, string> = {
  mtn: 'bg-amber-500 text-forest-950',
  airtel: 'bg-red-600 text-white',
  glo: 'bg-leaf-500 text-forest-950',
  '9mobile': 'bg-forest-700 text-cream-50',
}
function styleFor(name: string): string {
  const key = Object.keys(NETWORK_STYLE).find((k) => name.toLowerCase().includes(k))
  return key ? NETWORK_STYLE[key] : 'bg-ink-500 text-cream-50'
}

export default function Data() {
  const { user, refreshBalance } = useAuth()
  const { data: services, isLoading: servicesLoading } = useServices('data')

  const [service, setService] = useState<VTPassService | null>(null)
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState<VTPassVariation | null>(null)
  const [pinOpen, setPinOpen] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const detectedName = useMemo(() => detectNetworkName(phone), [phone])
  const detectedService = useMemo(
    () => services?.find((s) => detectedName && s.name.toLowerCase().includes(detectedName.toLowerCase())),
    [services, detectedName]
  )
  const activeService = service ?? detectedService ?? null

  const { data: plans, isLoading: plansLoading } = useServiceVariations(activeService?.serviceID ?? null)
  const payBillMutation = usePayBill()

  const canSubmit = !!activeService && phone.replace(/\s+/g, '').length === 11 && !!plan

  const openPin = () => {
    setError('')
    if (!canSubmit) {
      setError('Choose a network, a plan, and enter a valid 11-digit phone number.')
      return
    }
    setPinOpen(true)
  }

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: activeService!.serviceID,
      billersCode: phone.trim(),
      variation_code: plan!.variation_code,
      phone: phone.trim(),
      amount: Number(plan!.variation_amount),
    })
    const delivered = response?.content?.transactions?.status === 'delivered'
    if (!delivered) return { success: false, message: 'Transaction did not complete. Please try again.' }
    return { success: true, data: response }
  }

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData
    setReceipt({
      title: `${activeService!.name} — ${plan!.name}`,
      subtitle: `to ${phone.trim()}`,
      amount: Number(plan!.variation_amount),
      reference: response.paymentReference || 'N/A',
      date: new Date().toISOString(),
    })
    setPinOpen(false)
    refreshBalance()
  }

  const reset = () => {
    setReceipt(null)
    setPhone('')
    setPlan(null)
    setService(null)
    setError('')
  }

  if (!user) return null
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader icon={Wifi} title="Buy data" subtitle="SME and direct data bundles, all networks." />

      <div className="card space-y-6 p-6 sm:p-7">
        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Network</p>
          {servicesLoading ? (
            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[74px] animate-pulse rounded-xl bg-cream-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {(services ?? []).map((s) => (
                <button
                  key={s.serviceID}
                  type="button"
                  onClick={() => {
                    setService(s)
                    setPlan(null)
                  }}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-colors ${
                    activeService?.serviceID === s.serviceID
                      ? 'border-forest-800 bg-forest-900/5'
                      : 'border-line hover:border-forest-800/30'
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold ${styleFor(s.name)}`}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium text-ink-700">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-700">Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
            placeholder="0803 000 0000"
            className="input"
          />
        </label>

        {activeService && (
          <div>
            <p className="mb-2.5 text-xs font-medium text-ink-700">Choose a plan</p>
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
