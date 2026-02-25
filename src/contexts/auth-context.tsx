"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { LoginResponse } from "@/apis/interfaces/login.interface";
import { apiClient } from "@/apis/client";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Función helper para restaurar sesión desde localStorage
const restoreSession = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);

  if (storedToken && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser) as AuthUser;
      // Sincronizar cookie y header
      document.cookie = `auth_token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      return { token: storedToken, user: parsedUser };
    } catch (error) {
      console.error("Failed to restore auth session:", error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = "auth_token=; path=/; max-age=0";
    }
  }

  return { token: null, user: null };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const restored = restoreSession();
  const [user, setUser] = useState<AuthUser | null>(restored.user);
  const [token, setToken] = useState<string | null>(restored.token);
  // isLoading podría usarse para validación inicial async en el futuro
  const isLoading = false;

  const login = useCallback((response: LoginResponse) => {
    const { token: newToken, user: newUser } = response;

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    // Configurar cookie para middleware (expira en 7 días)
    document.cookie = `auth_token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

    apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Eliminar cookie
    document.cookie = "auth_token=; path=/; max-age=0";

    delete apiClient.defaults.headers.common["Authorization"];

    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
