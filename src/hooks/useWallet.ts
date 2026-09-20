import { useMutation, useQuery } from "@tanstack/react-query";
import * as walletApi from "../lib/api/wallet";
import type { GetLedgerParams } from "../lib/api/wallet";

export function useCreateWallet() {
  return useMutation({
    mutationFn: (input: walletApi.CreateReservedAccountInput) =>
      walletApi.getOrCreateReservedAccount(input),
  });
}

export function useLedger(params: GetLedgerParams) {
  return useQuery({
    queryKey: ["ledger", params],
    queryFn: () => walletApi.getLedger(params),
  });
}
