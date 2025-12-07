"use client";

import * as React from "react";
import {
  connectSocketClient,
  disconnectSocketClient,
} from "@/lib/socket";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

const AUTH_STORAGE_KEY = "warmchat_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      console.log("Checking localStorage for auth:", stored ? "Found" : "Not found");
      
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("parsed user", parsed);
        
        if (parsed && parsed.id && parsed.name) {
          setUser(parsed);
          setIsAuthenticated(true);
          // Reconnect socket with stored user
          connectSocketClient({ userId: parsed.id, userName: parsed.name });
          console.log("userId connected to socketttttttttt", parsed.id, parsed.name);
        } else {
          console.warn("Invalid user data in localStorage:", parsed);
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } else {
        console.log("No stored auth data found");
      }
    } catch (error) {
      console.error("Error loading auth from localStorage:", error);
      setIsAuthenticated(false);
   
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      const response = await fetch(
        "https://insureverify.mya2zstock.com/api/v2/auth/login",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            isapp: "true",
          },
          body: JSON.stringify({
            email,
            password,
            device_name: "warmchat-web",
            revoke_other_tokens: false,
          }),
        }
      );

      if (!response.ok) {
        let message = "Login failed. Please check your credentials.";
        try {
          const errorData = await response.json();
          if (typeof errorData?.message === "string") {
            message = errorData.message;
          }
        } catch {
        
        }
        throw new Error(message);
      }

 
      const data = await response.json();
  
      
      const apiUser = data?.data?.user;

      if (!apiUser || apiUser.id == null) {
        console.error("User data not found in response:", data);
        throw new Error("Invalid response from server. User data not found.");
      }

      // Use actual user ID and name from API response
      const authUser: AuthUser = {
        id: String(apiUser.id),
        name: apiUser.name || apiUser.first_name || email.split("@")[0] || "User",
        email: apiUser.email || email,
      };

      setUser(authUser);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      }

      // Initialize socket connection for this user
      connectSocketClient({ userId: authUser.id, userName: authUser.name });
    },
    []
  );

  const logout = React.useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    disconnectSocketClient();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
