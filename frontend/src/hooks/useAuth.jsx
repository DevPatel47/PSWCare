import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getAccessToken } from "../services/api";
import {
  adminLoginRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  registerRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await meRequest();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = async (credentials) => {
    const currentUser = await loginRequest(credentials);
    setUser(currentUser);
    return currentUser;
  };

  const loginAdmin = async (credentials) => {
    const currentUser = await adminLoginRequest(credentials);
    setUser(currentUser);
    return currentUser;
  };

  const register = async (payload) => {
    const currentUser = await registerRequest(payload);
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginAdmin,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
