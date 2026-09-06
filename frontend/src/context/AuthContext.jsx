import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { TOKEN_KEY, getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOutLocally = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Restore the session on first load.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => signOutLocally())
      .finally(() => setLoading(false));
  }, [signOutLocally]);

  // The axios interceptor fires this when a token is rejected or expires.
  useEffect(() => {
    const handler = () => signOutLocally();
    window.addEventListener('daynote:unauthorized', handler);
    return () => window.removeEventListener('daynote:unauthorized', handler);
  }, [signOutLocally]);

  const persist = (res) => {
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setUser(res.data.user);
    return res;
  };

  const login = useCallback(async (payload) => {
    try {
      const res = await authService.login(payload);
      persist(res);
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await authService.register(payload);
      persist(res);
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout: signOutLocally,
      updateUser: (patch) => setUser((u) => ({ ...u, ...patch })),
    }),
    [user, loading, login, register, signOutLocally]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};
