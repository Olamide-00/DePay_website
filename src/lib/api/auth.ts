import { api } from './client'
import type { LoginResponse, AuthUser } from '../../types'

export interface CompleteRegistrationInput {
  email: string
  fullName: string
  password: string
  transactionPIN: string
  phoneNumber: string
  gender?: string
  dateOfBirth?: string
}

// Step 1 — send a 6-digit OTP to the email
export async function sendRegistrationOtp(email: string): Promise<{ message: string; expiresIn: string }> {
  const { data } = await api.post('/user/send-registration-otp', { email })
  return data
}

// Step 2 — verify the OTP (marks email verified server-side, no
// account exists yet until step 3 completes)
export async function verifyRegistrationOtp(email: string, otp: string): Promise<{ message: string }> {
  const { data } = await api.post('/user/verify-otp', { email, otp })
  return data
}

export async function resendOtp(email: string): Promise<{ message: string }> {
  const { data } = await api.post('/user/resend-otp', { email })
  return data
}

// Step 3 — complete registration with the rest of the account details
export async function completeRegistration(input: CompleteRegistrationInput): Promise<{ message: string }> {
  const { data } = await api.post('/user/register', input)
  return data
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/user/login', { email, password })
  return data
}

export async function getUser(email: string): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>(`/user/user/${encodeURIComponent(email)}`)
  return data
}

export async function getWalletBalance(email: string): Promise<number> {
  const { data } = await api.get<{ data: number; currency: string }>(`/user/balance/${encodeURIComponent(email)}`)
  return data.data
}

export interface UpdateProfileInput {
  fullName?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  profilePicture?: string
}

export async function updateProfile(email: string, input: UpdateProfileInput): Promise<{ user: AuthUser }> {
  const { data } = await api.put(`/user/update-profile/${encodeURIComponent(email)}`, input)
  return data
}

// ── Forgot password (unrelated to the transaction PIN reset) ────
export async function sendPasswordResetOtp(email: string): Promise<{ message: string }> {
  const { data } = await api.post('/user/init-OTP', { email })
  return data
}

export async function resetPassword(email: string, otp: string, password: string): Promise<{ message: string }> {
  const { data } = await api.post('/user/verify-reset-OTP', { email, otp, password })
  return data
}
