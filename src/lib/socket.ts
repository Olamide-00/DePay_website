import { io, type Socket } from 'socket.io-client'

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.depay.com.ng').replace(/\/$/, '')

let socket: Socket | null = null

/**
 * Connects (if not already connected) and joins the room for this
 * user's email — the backend's Paystack webhook emits
 * "balance_updated" to that exact room the moment a dedicated NUBAN
 * deposit is credited. See DEPAY_BACKEND src/app.ts and
 * webhook/version2/funds.ts.
 */
export function connectSocket(email: string): Socket {
  if (!socket) {
    socket = io(BASE_URL, { transports: ['websocket', 'polling'] })
  }
  if (socket.connected) {
    socket.emit('join', email.toLowerCase().trim())
  } else {
    socket.once('connect', () => socket?.emit('join', email.toLowerCase().trim()))
  }
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}

export function getSocket(): Socket | null {
  return socket
}
