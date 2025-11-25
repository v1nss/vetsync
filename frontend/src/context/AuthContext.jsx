// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../global/utils/api.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // Load user when app starts (backend checks tokens from cookies)
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setIsAuthenticated(true);
      setRole(res.data.user.user_type);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // Cookies are automatically saved by browser (httpOnly)
      setUser(res.data.user);
      setIsAuthenticated(true);
      setRole(res.data.user.user_type);
      return res.data.user;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Backend clears auth cookies
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
