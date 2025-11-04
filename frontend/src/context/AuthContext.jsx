import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // initialize from localStorage if present
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole || null);
      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const login = ({ token, role: r, user: u }) => {
    localStorage.setItem('token', token);
    if (r) localStorage.setItem('role', r);
    if (u) localStorage.setItem('user', JSON.stringify(u));
    setIsAuthenticated(true);
    setRole(r || null);
    setUser(u || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
