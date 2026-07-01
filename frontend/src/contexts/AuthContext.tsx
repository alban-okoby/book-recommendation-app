"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth as authApi } from "@/lib/api";
import { clearToken } from "@/lib/auth-token";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isOwner: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isOwner: user?.role === "restaurant_owner" || user?.role === "admin",
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
