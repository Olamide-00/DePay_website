import { api } from "./client";
import type {
  ReservedAccount,
  LedgerStatement,
  LedgerCategory,
} from "../../types";

export interface CreateReservedAccountInput {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  bvn: string;
}

export async function getOrCreateReservedAccount(
  input: CreateReservedAccountInput,
): Promise<ReservedAccount> {
  try {
    const { data } = await api.post("/wallet/create-account", input);
    return data.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { data?: ReservedAccount } };
    };
    if (err.response?.status === 400 && err.response.data?.data) {
      return err.response.data.data;
    }
    throw error;
  }
}

export interface GetLedgerParams {
  page?: number;
  limit?: number;
  category?: LedgerCategory;
}

export async function getLedger(
  params: GetLedgerParams = {},
): Promise<LedgerStatement> {
  const { data } = await api.get<LedgerStatement>("/wallet/ledger", { params });
  return data;
}
