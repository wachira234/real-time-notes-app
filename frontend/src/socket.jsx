import { io } from 'socket.io-client';
export const socket = io('https://real-time-notes-app.onrender.com', { autoConnect: false });