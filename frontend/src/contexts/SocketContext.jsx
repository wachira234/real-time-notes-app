import React, { createContext } from 'react';
import { socket } from '../socket';

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);