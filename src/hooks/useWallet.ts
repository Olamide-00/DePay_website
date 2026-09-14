import { useQuery } from '@tanstack/react-query'
import * as walletApi from '../lib/api/wallet'
import type { GetLedgerParams } from '../lib/api/wallet'

export function useReservedAccount(input: walletApi.CreateReservedAccountInput | null) {
  return useQuery({
    queryKey: ['reserved-account', input?.email],
    queryFn: () => walletApi.getOrCreateReservedAccount(input as walletApi.CreateReservedAccountInput),
    enabled: !!input,
    staleTime: Infinity, // the account number never changes once created
    retry: 1,
  })
}

export function useLedger(params: GetLedgerParams) {
  return useQuery({
    queryKey: ['ledger', params],
    queryFn: () => walletApi.getLedger(params),
  })
}
