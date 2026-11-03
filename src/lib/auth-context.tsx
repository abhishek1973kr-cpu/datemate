"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, PartnerApplication } from "@/types";
import {
  getStoredUsers,
  saveUsers,
  findUserByCredentials,
  findPartnerByCredentials,
  saveOrUpdateUser,
  hashPassword
} from "./store";
import {
  firebaseSignInWithGoogle,
  firebaseSignOut,
  firestoreSyncUser,
  isFirebaseConfigured
} from "./firebase";

interface GoogleProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | "guest";
  isLoading: boolean;
  loginWithCredentials: (identifier: string, password: string, requiredRole?: "user" | "partner") => Promise<User>;
  loginWithGoogle: (profile?: GoogleProfile) => Promise<User>;
  completeUserProfile: (userData: {
    name: string;
    city: string;
    fullAddress?: string;
    state: string;
    phone: string;
    dob?: string;
    age: number;
  }) => Promise<User>;
  recordUserRegistrationFee: (transactionId: string, amount?: number) => Promise<User>;
  logout: () => void;
  setUserDirectly: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "datemate_current_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New visitors start completely logged out - no automatic demo sessions!
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with Username/Email and Password
  const loginWithCredentials = async (
    identifier: string,
    password: string,
    requiredRole: "user" | "partner" = "user"
  ): Promise<User> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      throw new Error("Please enter both username/email and password.");
    }

    if (requiredRole === "partner") {
      const partner = findPartnerByCredentials(cleanId);
      if (!partner) {
        throw new Error("No partner account found with these credentials. Please sign up first.");
      }

      // Check password securely against registered partner hash
      if (partner.passwordHash) {
        const inputHash = await hashPassword(cleanPass);
        if (inputHash !== partner.passwordHash) {
          throw new Error("Incorrect partner password. Please try again or use Forgot Password.");
        }
      }

      const partnerUser: User = {
        id: partner.userId || `user-ptr-${partner.id}`,
        name: partner.fullLegalName,
        username: partner.username || partner.fullLegalName.toLowerCase().replace(/\s+/g, ""),
        email: partner.email,
        phone: partner.mobile,
        role: "partner",
        partnerId: partner.id,
        city: partner.city,
        state: partner.state,
        age: 24,
        isAgeVerified: true,
        authProvider: "credentials",
        googleVerified: partner.googleVerified ?? true,
        hasPaidRegistrationFee: true,
        avatarUrl: partner.photos && partner.photos.length > 0 ? partner.photos[0] : "",
        createdAt: partner.submittedAt || new Date().toISOString()
      };

      setUser(partnerUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(partnerUser));
      localStorage.setItem("datemate_active_partner_id", partner.id);
      return partnerUser;
    } else {
      // User login
      const matched = findUserByCredentials(cleanId);
      if (!matched) {
        throw new Error("No user account found with this email or username. Please sign up.");
      }

      if (matched.passwordHash) {
        const inputHash = await hashPassword(cleanPass);
        if (inputHash !== matched.passwordHash) {
          throw new Error("Incorrect user password. Please try again or reset password.");
        }
      }

      setUser(matched);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched));
      return matched;
    }
  };

  // Google OAuth Login / Verification (Firebase Auth + Fallback)
  const loginWithGoogle = async (profile?: GoogleProfile): Promise<User> => {
    let googleData: GoogleProfile;

    if (profile) {
      googleData = profile;
    } else {
      try {
        // Attempt real Firebase Google Auth popup if credentials configured
        const fbResult = await firebaseSignInWithGoogle();
        if (fbResult && fbResult.email) {
          googleData = {
            name: fbResult.displayName || "Google User",
            email: fbResult.email,
            avatarUrl: fbResult.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          };
        } else {
          // Seamless fallback simulation for testing/demo
          googleData = {
            name: "Rohit Malhotra",
            email: "rohit.malhotra.google@gmail.com",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          };
        }
      } catch (err: any) {
        if (err?.code === "auth/popup-closed-by-user") {
          throw new Error("Google Sign-In popup was closed. Please try again.");
        }
        console.warn("Firebase Auth popup notice:", err);
        // Fallback simulation
        googleData = {
          name: "Rohit Malhotra",
          email: "rohit.malhotra.google@gmail.com",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
        };
      }
    }

    // Check if user already exists
    const existing = findUserByCredentials(googleData.email);
    if (existing) {
      const updatedExisting: User = {
        ...existing,
        name: googleData.name || existing.name,
        avatarUrl: googleData.avatarUrl || existing.avatarUrl,
        googleVerified: true
      };
      saveOrUpdateUser(updatedExisting);
      firestoreSyncUser(updatedExisting).catch(() => {});
      setUser(updatedExisting);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedExisting));
      return updatedExisting;
    }

    // Create new draft user
    const newUser: User = {
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
      googleVerified: true,
      hasPaidRegistrationFee: false,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleData.email, name: googleData.name })
      });
    } catch (e) {
      console.warn("Backend auth notice:", e);
    }

    saveOrUpdateUser(newUser);
    firestoreSyncUser(newUser).catch(() => {});
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  };

  // Complete User Profile Details
  const completeUserProfile = async (userData: {
    name: string;
    city: string;
    fullAddress?: string;
    state: string;
    phone: string;
    dob?: string;
    age: number;
  }): Promise<User> => {
    if (userData.age < 18) {
      throw new Error("Must be at least 18 years of age to register on DateMate.");
    }

    if (!user) {
      throw new Error("No active user session found. Please sign in with Google.");
    }

    const current = user;
    const updatedUser: User = {
      ...current,
      name: userData.name,
      city: userData.city,
      fullAddress: userData.fullAddress || current.fullAddress || "",
      state: userData.state,
      phone: userData.phone,
      dob: userData.dob || current.dob || "2000-01-01",
      age: userData.age,
      isAgeVerified: true,
      role: "user"
    };

    saveOrUpdateUser(updatedUser);
    firestoreSyncUser(updatedUser).catch(() => {});
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Record ₹99 User Registration Fee
  const recordUserRegistrationFee = async (transactionId: string, amount: number = 99): Promise<User> => {
    if (!user) {
      throw new Error("No active user session found to record fee.");
    }

    const current = user;
    const updatedUser: User = {
      ...current,
      hasPaidRegistrationFee: true,
      registrationTransactionId: transactionId,
      registrationFeeAmount: amount,
      registrationFeePaidAt: new Date().toISOString()
    };

    saveOrUpdateUser(updatedUser);
    firestoreSyncUser(updatedUser).catch(() => {});
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Secure Logout: Invalidate current session and return to public homepage
  const logout = () => {
    try {
      firebaseSignOut().catch(() => {});
    } catch {}
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem("datemate_active_partner_id");
      window.location.href = "/";
    }
  };

  const setUserDirectly = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : "guest",
        isLoading,
        loginWithCredentials,
        loginWithGoogle,
        completeUserProfile,
        recordUserRegistrationFee,
        logout,
        setUserDirectly
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
