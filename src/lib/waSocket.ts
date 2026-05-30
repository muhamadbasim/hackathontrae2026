import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_WA_SOCKET_URL || 'http://localhost:3001'

export const waSocket = io(socketUrl, {
  autoConnect: false,
})
