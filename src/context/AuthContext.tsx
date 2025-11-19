 

import React, { createContext, useState, useContext, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

interface AuthContextProps {
  token: string | null;
  user?: { username?: string; role?: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(t);
      return { username: decoded.sub, role: decoded.role };
    } catch {
      return null;
    }
  });

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      setUser({ username: decoded.sub, role: decoded.role });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user: user || undefined, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

