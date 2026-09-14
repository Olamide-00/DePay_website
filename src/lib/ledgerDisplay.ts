import {
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Wallet,
  Gift,
  ShieldCheck,
  Ticket,
  Coins,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import type { LedgerCategory, LedgerEntry } from '../types'

// BILL_PAYMENT entries all share one category — the actual bill type
// (airtime/data/tv/electricity) only shows up in `metadata.serviceID`
// (set in DEPAY_BACKEND's payBill()). This mirrors the same
// classification the admin dashboard uses to group services.
const BILL_TYPE_PATTERNS: { icon: LucideIcon; pattern: RegExp }[] = [
  { icon: Smartphone, pattern: /airtime/i },
  { icon: Wifi, pattern: /data/i },
  { icon: Tv, pattern: /tv|cable|dstv|gotv|startimes/i },
  { icon: Zap, pattern: /electric|disco|prepaid|postpaid|ikedc|ekedc|aedc|phed|kedco|ibedc/i },
]

const CATEGORY_ICON: Record<LedgerCategory, LucideIcon> = {
  WALLET_FUNDING: Wallet,
  ADMIN_CREDIT: ShieldCheck,
  ADMIN_DEBIT: ShieldCheck,
  ADMIN_REVERSAL: RotateCcw,
  BILL_PAYMENT: Smartphone,
  BILL_REFUND: RotateCcw,
  VOUCHER_PURCHASE: Ticket,
  VOUCHER_REDEMPTION: Ticket,
  JTOKEN_CONVERSION: Coins,
  REFERRAL_BONUS: Gift,
}

const CATEGORY_LABEL: Record<LedgerCategory, string> = {
  WALLET_FUNDING: 'Wallet funding',
  ADMIN_CREDIT: 'Account credit',
  ADMIN_DEBIT: 'Account debit',
  ADMIN_REVERSAL: 'Reversal',
  BILL_PAYMENT: 'Bill payment',
  BILL_REFUND: 'Refund',
  VOUCHER_PURCHASE: 'Voucher purchase',
  VOUCHER_REDEMPTION: 'Voucher redeemed',
  JTOKEN_CONVERSION: 'JToken conversion',
  REFERRAL_BONUS: 'Referral bonus',
}

export function ledgerIcon(entry: Pick<LedgerEntry, 'category' | 'metadata'>): LucideIcon {
  if (entry.category === 'BILL_PAYMENT' || entry.category === 'BILL_REFUND') {
    const serviceID = (entry.metadata?.serviceID as string | undefined) ?? ''
    const match = BILL_TYPE_PATTERNS.find((p) => p.pattern.test(serviceID))
    if (match) return match.icon
  }
  return CATEGORY_ICON[entry.category] ?? Wallet
}

export function ledgerLabel(entry: Pick<LedgerEntry, 'category' | 'description'>): string {
  return entry.description || CATEGORY_LABEL[entry.category] || 'Transaction'
}
