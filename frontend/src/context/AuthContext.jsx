import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  saveToken,
  getRefreshToken,
  removeToken,
  removeRefreshToken,
} from '../global/utils/token.jsx';

import { fetchUserData } from '../global/api/user.jsx';

import { refreshAuthToken } from '../global/api/auth.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const initializeAuth = async () => {
        setLoading(true);
        try {
          const existingToken = getToken();
          const existingRefreshToken = getRefreshToken();

          if (!existingToken && !existingRefreshToken) {
            console.log("No existing token, returning early.");
            setLoading(false);
            return;
          }

          if (existingToken) {
            try {
              const storedUser = JSON.parse(atob(existingToken.split(".")[1]));
              const isExpired = storedUser.exp * 1000 < Date.now();
              if (isExpired) {
                if (existingRefreshToken) {
                  console.log("Token expired, attempting to refresh.");
                  const newToken = await refreshAuthToken();
                  const newUser = JSON.parse(atob(newToken.split(".")[1]));
                  const fullUserData = await fetchUserData(newUser.id, newToken);

                  setUser({
                    ...newUser, 
                    ...fullUserData 
                  });

                  setRole(fullUserData.user_type);
                  setIsAuthenticated(true);
                  setToken(newToken);
                } else {
                  console.log("No refresh token available, cannot refresh.");
                  logout(); 
                }
              } else {
                const fullUserData = await fetchUserData(storedUser.id, existingToken)
                setUser({
                  ...storedUser, 
                  ...fullUserData 
                });
                setRole(fullUserData.user_type);
                setIsAuthenticated(true);
                setToken(existingToken);
              } 
            } catch (err) {
              console.error("Invalid token:", err)
              logout(); 
            }
          } else if (existingRefreshToken) {
            try {
              const newToken = await refreshAuthToken();
              const newUser = JSON.parse(atob(newToken.split(".")[1]));
              const fullUserData = await fetchUserData(newUser.id, newToken);

              setUser({
                ...newUser, 
                ...fullUserData 
              });
              setRole(fullUserData.user_type);
              setIsAuthenticated(true);
              setToken(newToken);
            } catch (err) {
              console.error("Invalid token:", err)
              logout(); 
            }
          }

        } catch (err) {
          console.error("Auth Initialize error:", err)
          logout(); 
        } finally {
          setLoading(false);
        }
      };
      initializeAuth();
    },[]);

    const login = async (userData, authToken) => {
      try {
        setLoading(true);
        const fullUserData = await fetchUserData(userData.id, authToken);
        setUser({
          ...userData,
          ...fullUserData,
        });
        setToken(authToken);
        saveToken(authToken);
        setIsAuthenticated(true);
        setRole(fullUserData.user_type);
        console.log(userData)
      } catch (err) {
        console.error("Error fetching full user data:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      removeToken();
      removeRefreshToken();
      localStorage.clear();
      setIsAuthenticated(false);
      setRole(null);
      setLoading(false);
    };

    return (
      <AuthContext.Provider value={{ user, token, login, logout, role, isAuthenticated, loading }}>
        {children} 
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("context:", context);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};