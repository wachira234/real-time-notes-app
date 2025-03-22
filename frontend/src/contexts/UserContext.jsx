import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username] = useState('User' + Math.floor(Math.random() * 1000));
  return <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

export default UserContext;