// src/context/AuthContext.tsx
"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { axiosPublic } from "@/utils/axios";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/signup" && pathname !== "/signin") {
      refreshSession();
    }
  }, [pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosPublic.post("/auth/login", {
        email,
        password,
      });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      router.push("/protected");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  const refreshSession = async () => {
    try {
      const response = await axiosPublic.get("/auth/session", {
        withCredentials: true,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        setAccessToken(accessToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to refresh session", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        setAccessToken,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
