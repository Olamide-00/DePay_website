import { api } from './client'

export async function setPin(email: string, pin: string): Promise<{ message: string }> {
  const { data } = await api.post('/PIN/set-PIN', { email, pin })
  return data
}

export async function verifyPin(email: string, pin: string): Promise<boolean> {
  try {
    await api.post('/PIN/verify-PIN', { email, pin })
    return true
  } catch {
    return false
  }
}

/**
 * Sets a new transaction PIN. Note: the backend endpoint itself does
 * NOT verify the current PIN before overwriting it — the frontend is
 * responsible for calling verifyPin() with the current PIN first and
 * only calling this if that succeeds (see Profile.tsx).
 */
export async function updatePin(email: string, newPin: string): Promise<{ message: string }> {
  const { data } = await api.post('/PIN/update-pin', { email, newPin })
  return data
}
