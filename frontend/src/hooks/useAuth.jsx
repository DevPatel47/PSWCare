import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const raw = localStorage.getItem('pswcares_auth');
  if (!raw) {
    return { token: null, role: null, name: null, email: null };
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return { token: null, role: null, name: null, email: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = ({ token, user }) => {
    const nextAuth = {
      token,
      role: user?.role || null,
      name: user?.name || null,
      email: user?.email || null
    };
    setAuth(nextAuth);
    localStorage.setItem('pswcares_auth', JSON.stringify(nextAuth));
  };

  const logout = () => {
    const nextAuth = { token: null, role: null, name: null, email: null };
    setAuth(nextAuth);
    localStorage.removeItem('pswcares_auth');
  };

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
      isAuthenticated: Boolean(auth.token)
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
