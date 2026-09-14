import { api } from './client'
import type { VTPassService, VTPassVariation, PayBillResponseData, BillHistoryItem } from '../../types'

export async function getServices(identifier: string): Promise<VTPassService[]> {
  const { data } = await api.get('/bills/get-services', { params: { identifier } })
  return data.data?.content ?? []
}

export async function getServiceVariations(serviceID: string): Promise<VTPassVariation[]> {
  const { data } = await api.get('/bills/get-packages', { params: { serviceID } })
  return data.data?.content?.varations ?? data.data?.content?.variations ?? []
}

export interface PayBillInput {
  serviceID: string
  amount: number
  phone?: string
  billersCode?: string
  variation_code?: string
}

export async function payBill(input: PayBillInput): Promise<PayBillResponseData> {
  const { data } = await api.post('/bills/pay-bill', input)
  return data.data
}

export interface VerifyMeterOrSmartcardInput {
  serviceID: string
  billersCode: string
}

export interface VerificationResult {
  content?: {
    Customer_Name?: string
    Customer_Address?: string
    [key: string]: unknown
  }
}

export async function verifyBillersCode(input: VerifyMeterOrSmartcardInput): Promise<VerificationResult> {
  const { data } = await api.post('/verify', input)
  return data.data
}

export async function getBillsHistory(email: string): Promise<BillHistoryItem[]> {
  const { data } = await api.get(`/bills/get-bills-history/${encodeURIComponent(email)}`)
  return data
}
