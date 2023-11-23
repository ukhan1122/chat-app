import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './Signup/Firebas';
import { onAuthStateChanged } from 'firebase/auth'; 

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginuser, setloginUser] = useState(null);
 console.log(loginuser)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      setloginUser(authUser);
      console.log(authUser);
    });
    return () => {
      unsub();
    }
  }, []);

  // You should return the JSX content wrapped by the AuthContext.Provider
  return (
    <AuthContext.Provider value={{ loginuser }}>
      {children}
    </AuthContext.Provider>
  );
};
