// lib/socket.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket'],
      secure: process.env.NODE_ENV === 'production'
    });
  }
  return socket;
};
