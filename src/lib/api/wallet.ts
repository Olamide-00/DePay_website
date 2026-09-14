import { api } from './client'
import type { ReservedAccount, LedgerStatement, LedgerCategory } from '../../types'

export interface CreateReservedAccountInput {
  email: string
  phone: string
  first_name: string
  last_name: string
}

/**
 * Creates (or, if one already exists, returns) the user's dedicated
 * Paystack NUBAN for wallet funding. The backend responds 201 on
 * first creation and 400 with the same account data if one already
 * exists for this user — both cases are handled the same way here,
 * since either way the caller just wants the account details.
 */
export async function getOrCreateReservedAccount(input: CreateReservedAccountInput): Promise<ReservedAccount> {
  try {
    const { data } = await api.post('/wallet/create-account', input)
    return data.data
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { data?: ReservedAccount } } }
    if (err.response?.status === 400 && err.response.data?.data) {
      return err.response.data.data
    }
    throw error
  }
}

export interface GetLedgerParams {
  page?: number
  limit?: number
  category?: LedgerCategory
}

export async function getLedger(params: GetLedgerParams = {}): Promise<LedgerStatement> {
  const { data } = await api.get<LedgerStatement>('/wallet/ledger', { params })
  return data
}
