import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state globally.
 * Persists user and token in localStorage across page reloads.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('et_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('et_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('et_token', token);
    } else {
      localStorage.removeItem('et_token');
    }
  }, [token]);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('et_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('et_user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser({ id: data.userId, name: data.name, email: data.email, role: data.role });
      toast.success(`Welcome back, ${data.name}! 👋`);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const result = await authService.register(data);
      setToken(result.token);
      setUser({ id: result.userId, name: result.name, email: result.email, role: result.role });
      toast.success(`Account created! Welcome, ${result.name}! 🎉`);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('et_token');
    localStorage.removeItem('et_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully 👋');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
