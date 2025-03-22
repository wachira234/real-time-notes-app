import { io } from 'socket.io-client';
export const socket = io('https://real-time-notes-backend-6qdj.onrender.com', { autoConnect: false });