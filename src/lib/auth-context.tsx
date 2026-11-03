"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { DEMO_CLIENT, DEMO_ADMIN, DEMO_COMPANION_USER } from "./store";

interface GoogleProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | "guest";
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  loginWithGoogle: (profile?: GoogleProfile) => Promise<User>;
  completeUserProfile: (userData: {
    name: string;
    city: string;
    state: string;
    phone: string;
    age: number;
  }) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  verifyAge: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "datemate_current_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to logged-in user for preview
        setUser(DEMO_CLIENT);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_CLIENT));
      }
    } catch {
      setUser(DEMO_CLIENT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async (profile?: GoogleProfile): Promise<User> => {
    // Default simulated Google profile if not provided
    const googleData: GoogleProfile = profile || {
      name: "Rohit Malhotra",
      email: "rohit.malhotra.google@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };

    // Check if user already exists
    const existingUser: User = {
      id: `user-google-${Date.now()}`,
      name: googleData.name,
      email: googleData.email,
      phone: "",
      city: "",
      state: "",
      avatarUrl: googleData.avatarUrl,
      role: "user",
      age: 24,
      isAgeVerified: false,
      authProvider: "google",
      createdAt: new Date().toISOString()
    };

    // Notify backend session
    try {
      await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleData.email, name: googleData.name })
      });
    } catch (e) {
      console.warn("Server-side session notice:", e);
    }

    setUser(existingUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser));
    return existingUser;
  };

  const completeUserProfile = async (userData: {
    name: string;
    city: string;
    state: string;
    phone: string;
    age: number;
  }): Promise<User> => {
    if (userData.age < 18) {
      throw new Error("Must be at least 18 years of age to register.");
    }

    const updatedUser: User = {
      ...(user || DEMO_CLIENT),
      name: userData.name,
      city: userData.city,
      state: userData.state,
      phone: userData.phone,
      age: userData.age,
      isAgeVerified: true,
      role: "user"
    };

    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  };

  const login = async (email: string, role: UserRole = "client"): Promise<boolean> => {
    let matchedUser: User;
    if (role === "companion" || role === "partner" || email.includes("companion") || email.includes("aanya")) {
      matchedUser = DEMO_COMPANION_USER;
    } else {
      matchedUser = {
        ...DEMO_CLIENT,
        email: email || DEMO_CLIENT.email,
      };
    }

    setUser(matchedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const switchRole = (role: UserRole) => {
    if (role === "companion" || role === "partner") {
      setUser(DEMO_COMPANION_USER);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_COMPANION_USER));
    } else {
      setUser(DEMO_CLIENT);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_CLIENT));
    }
  };

  const verifyAge = () => {
    if (user) {
      const updated = { ...user, isAgeVerified: true };
      setUser(updated);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : "guest",
        isLoading,
        login,
        loginWithGoogle,
        completeUserProfile,
        logout,
        switchRole,
        verifyAge,
      }}
    >
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
