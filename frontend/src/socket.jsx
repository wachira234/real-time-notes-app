import { io } from 'socket.io-client';
export const socket = io('https://real-time-communication-with-socket-io.vercel.app', { autoConnect: false });
