// ══════════════════════════════════════════════════════════════════
// Types mirrored from DEPAY_BACKEND — kept intentionally close to
// the backend's actual field names (rather than renamed to "nicer"
// frontend names) so there's one obvious source of truth to check
// against when something doesn't match at runtime.
// ══════════════════════════════════════════════════════════════════

export interface AccountDetail {
  bankCode?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  isDefault: boolean
}

export interface AuthUser {
  name: string
  isWalletCreated: boolean
  email: string
  phoneNumber: string
  profilePicture: string
  balance: number
  gender?: string
  dateOfBirth?: string
  bankName?: string | null
  accountNumber?: string | null
  jTokens: number
  accountDetails: AccountDetail[]
  tag?: string
}

export interface LoginResponse {
  message: string
  token: string
  refreshToken: string
  user: AuthUser
}

// ── VTPass services / variations ────────────────────────────────
export interface VTPassService {
  serviceID: string
  name: string
  minimum_amount?: string | number
  maximum_amount?: string | number
  convenience_fee?: string | number
  product_type?: string
  image?: string
}

export interface VTPassVariation {
  variation_code: string
  name: string
  variation_amount: string
  fixedPrice?: string
}

// ── Reserved (dedicated) account for wallet funding ─────────────
export interface ReservedAccount {
  accountId?: string | number
  accountNumber: string
  accountName: string
  bankName: string
}

// ── Ledger (unified transaction history) ────────────────────────
export type LedgerDirection = 'CREDIT' | 'DEBIT'

export type LedgerCategory =
  | 'WALLET_FUNDING'
  | 'ADMIN_CREDIT'
  | 'ADMIN_DEBIT'
  | 'ADMIN_REVERSAL'
  | 'BILL_PAYMENT'
  | 'BILL_REFUND'
  | 'VOUCHER_PURCHASE'
  | 'VOUCHER_REDEMPTION'
  | 'JTOKEN_CONVERSION'
  | 'REFERRAL_BONUS'

export interface LedgerEntry {
  _id: string
  userId: string
  direction: LedgerDirection
  category: LedgerCategory
  amount: number
  balanceBefore: number
  balanceAfter: number
  reference: string
  description?: string
  performedBy: 'USER' | 'ADMIN' | 'SYSTEM'
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface LedgerStatement {
  data: LedgerEntry[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  currentBalance: number
}

// ── Bill payment (VTPass pay response) ──────────────────────────
export interface VTPassTransactionInfo {
  status?: string
  type?: string
  [key: string]: unknown
}

export interface PayBillResponseData {
  code?: string
  response_description?: string
  paymentReference?: string
  token?: string
  units?: string
  purchased_code?: string
  Pin?: string
  cards?: Array<{ Serial?: string; Pin?: string }>
  content?: {
    transactions?: VTPassTransactionInfo
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Normalized shape the Receipt component actually renders — built
// from a successful PayBillResponseData right after payment, since
// that response has fields (token, pin, units) the ledger never
// carries.
export interface ReceiptData {
  title: string
  subtitle: string
  amount: number
  reference: string
  date: string
  token?: string | null
  pin?: string | null
  units?: string | null
}

// ── Bills history (per-user, from GET /bills/get-bills-history) ──
export interface BillHistoryItem {
  service?: string
  amount: number
  transactionReference: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED'
  serviceID?: string
  variation_code?: string
  billersCode?: string
  phone?: string | null
  date: string
  token?: string | null
  units?: string | null
  jambPin?: string | null
  serialNumber?: string | null
  pin?: string | null
}
