import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch {
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res;
    }
    throw new Error(res.message || "Login failed");
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
