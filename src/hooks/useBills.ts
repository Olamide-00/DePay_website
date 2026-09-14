import { useQuery, useMutation } from '@tanstack/react-query'
import * as billsApi from '../lib/api/bills'

export function useServices(identifier: string) {
  return useQuery({
    queryKey: ['services', identifier],
    queryFn: () => billsApi.getServices(identifier),
    staleTime: 5 * 60_000, // provider lists barely change — cache generously
  })
}

export function useServiceVariations(serviceID: string | null) {
  return useQuery({
    queryKey: ['variations', serviceID],
    queryFn: () => billsApi.getServiceVariations(serviceID as string),
    enabled: !!serviceID,
    staleTime: 5 * 60_000,
  })
}

export function useVerifyBillersCode() {
  return useMutation({
    mutationFn: billsApi.verifyBillersCode,
  })
}

export function usePayBill() {
  return useMutation({
    mutationFn: billsApi.payBill,
  })
}

export function useBillsHistory(email: string | undefined) {
  return useQuery({
    queryKey: ['bills-history', email],
    queryFn: () => billsApi.getBillsHistory(email as string),
    enabled: !!email,
  })
}
