import { useMemo, useState } from 'react'
import { Smartphone } from 'lucide-react'
import PageHeader from '../../components/dashboard/PageHeader'
import PinModal from '../../components/dashboard/PinModal'
import Receipt from '../../components/dashboard/Receipt'
import { useAuth } from '../../context/AuthContext'
import { useServices, usePayBill } from '../../hooks/useBills'
import { detectNetworkName } from '../../lib/networkDetect'
import { formatNaira } from '../../lib/utils'
import type { ReceiptData, VTPassService, PayBillResponseData } from '../../types'

const presets = [50, 100, 200, 500, 1000, 2000, 5000]

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

export default function Airtime() {
  const { user, refreshBalance } = useAuth()
  const { data: services, isLoading: servicesLoading } = useServices('airtime')
  const payBillMutation = usePayBill()

  const [service, setService] = useState<VTPassService | null>(null)
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [pinOpen, setPinOpen] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  const detectedName = useMemo(() => detectNetworkName(phone), [phone])
  const detectedService = useMemo(
    () => services?.find((s) => detectedName && s.name.toLowerCase().includes(detectedName.toLowerCase())),
    [services, detectedName]
  )
  const activeService = service ?? detectedService ?? null

  const finalAmount = amount ?? (customAmount ? Number(customAmount) : 0)
  const canSubmit = !!activeService && phone.replace(/\s+/g, '').length === 11 && finalAmount > 0

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
      setError('Choose a network, enter a valid 11-digit phone number and an amount.')
      return
    }
    setPinOpen(true)
  }

  const handlePay = async () => {
    const response = await payBillMutation.mutateAsync({
      serviceID: activeService!.serviceID,
      amount: finalAmount,
      phone: phone.trim(),
    })
    const delivered = response?.content?.transactions?.status === 'delivered'
    if (!delivered) {
      return { success: false, message: 'Transaction did not complete. Please try again.' }
    }
    return { success: true, data: response }
  }

  const handleSuccess = (data: unknown) => {
    const response = data as PayBillResponseData
    setReceipt({
      title: `${activeService!.name} Airtime`,
      subtitle: `to ${phone.trim()}`,
      amount: finalAmount,
      reference: response.paymentReference || response.content?.transactions?.transactionId?.toString() || 'N/A',
      date: new Date().toISOString(),
    })
    setPinOpen(false)
    refreshBalance()
  }

  const reset = () => {
    setReceipt(null)
    setPhone('')
    setAmount(null)
    setCustomAmount('')
    setService(null)
    setError('')
  }

  if (!user) return null
  if (receipt) return <Receipt receipt={receipt} onNewPayment={reset} />

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader icon={Smartphone} title="Buy airtime" subtitle="Top up any Nigerian line instantly." />

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
                  onClick={() => setService(s)}
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
          {detectedService && !service && (
            <p className="mt-2 text-[11px] text-leaf-600">Detected {detectedService.name} from this number.</p>
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

        <div>
          <p className="mb-2.5 text-xs font-medium text-ink-700">Amount</p>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePickPreset(p)}
                className={`rounded-xl border px-2 py-2.5 font-mono text-xs font-semibold transition-colors ${
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
          {`Pay ${finalAmount > 0 ? formatNaira(finalAmount) : ''}`}
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
