"use client";

import { Companion, Booking, Review, ChatMessage, SafetyReport, User, PartnerApplication } from "@/types";
import { INITIAL_COMPANIONS, DEMO_REVIEWS } from "./demo-data";
import { firestoreSyncUser, firestoreSyncPartner, firestoreSaveBooking } from "./firebase";

const COMPANIONS_KEY = "datemate_companions_v2";
const BOOKINGS_KEY = "datemate_bookings_v2";
const REVIEWS_KEY = "datemate_reviews_v2";
const MESSAGES_KEY = "datemate_messages_v2";
const REPORTS_KEY = "datemate_reports_v2";
const USERS_KEY = "datemate_users_v2";
const PARTNERS_KEY = "datemate_partners_v1";

export const DEMO_ADMIN: User = {
  id: "user-admin",
  name: "Aditi Rao (Super Admin)",
  email: "admin@datemate.in",
  phone: "+91 98765 00000",
  role: "admin",
  age: 32,
  isAgeVerified: true,
  authProvider: "admin",
  createdAt: "2026-01-01T00:00:00Z"
};

// No AI-generated or mock partner applications
export const INITIAL_PARTNERS: PartnerApplication[] = [];

// No fake demo bookings
const INITIAL_BOOKINGS: Booking[] = [];

// No fake demo chat messages
const INITIAL_MESSAGES: ChatMessage[] = [];

// No fake safety reports
const INITIAL_REPORTS: SafetyReport[] = [];

// Helper methods with localStorage fallback and automated purge of any legacy AI profiles
export function getStoredCompanions(): Companion[] {
  if (typeof window === "undefined") return INITIAL_COMPANIONS;
  try {
    const raw = localStorage.getItem(COMPANIONS_KEY);
    if (!raw) {
      localStorage.setItem(COMPANIONS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Companion[] = JSON.parse(raw);
    // Delete every AI generated or mock profile
    const clean = parsed.filter(
      (c) =>
        !c.isDemo &&
        !c.id.startsWith("comp-1") &&
        !c.id.startsWith("comp-2") &&
        !c.id.startsWith("comp-3") &&
        !c.id.startsWith("comp-4") &&
        !c.id.startsWith("comp-5") &&
        !c.id.startsWith("comp-6") &&
        !c.id.startsWith("comp-7") &&
        !c.id.startsWith("comp-patna") &&
        !c.id.startsWith("comp-ranchi") &&
        !c.id.startsWith("comp-pending")
    );
    if (clean.length !== parsed.length) {
      localStorage.setItem(COMPANIONS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveCompanions(companions: Companion[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(COMPANIONS_KEY, JSON.stringify(companions));
  }
}

export function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Booking[] = JSON.parse(raw);
    const clean = parsed.filter((b) => !b.id.startsWith("bk-100"));
    if (clean.length !== parsed.length) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    // Asynchronously sync latest booking to Firestore if available
    if (bookings.length > 0) {
      firestoreSaveBooking(bookings[0]).catch(() => {});
    }
  }
}

export function getStoredReviews(): Review[] {
  if (typeof window === "undefined") return DEMO_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Review[] = JSON.parse(raw);
    const clean = parsed.filter((r) => !r.id.startsWith("rev-"));
    if (clean.length !== parsed.length) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveReviews(reviews: Review[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }
}

export function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: ChatMessage[] = JSON.parse(raw);
    const clean = parsed.filter((m) => !m.id.startsWith("msg-"));
    if (clean.length !== parsed.length) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function getStoredReports(): SafetyReport[] {
  if (typeof window === "undefined") return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: SafetyReport[] = JSON.parse(raw);
    const clean = parsed.filter((r) => !r.id.startsWith("rep-"));
    if (clean.length !== parsed.length) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveReports(reports: SafetyReport[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
}

export function getStoredPartnerApplications(): PartnerApplication[] {
  if (typeof window === "undefined") return INITIAL_PARTNERS;
  try {
    const raw = localStorage.getItem(PARTNERS_KEY);
    if (!raw) {
      localStorage.setItem(PARTNERS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: PartnerApplication[] = JSON.parse(raw);
    // Delete any AI generated / mock partner applications
    const clean = parsed.filter(
      (p) =>
        p.email &&
        !p.email.includes("example.com") &&
        !p.id.startsWith("DM-PTR-10024") &&
        !p.id.startsWith("DM-PTR-10492")
    );
    if (clean.length !== parsed.length) {
      localStorage.setItem(PARTNERS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function savePartnerApplications(apps: PartnerApplication[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNERS_KEY, JSON.stringify(apps));
  }
}

// User Persistence Helpers
export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: User[] = JSON.parse(raw);
    const clean = parsed.filter(
      (u) =>
        u.email &&
        !u.email.includes("example.com") &&
        u.id !== "user-client-1" &&
        u.id !== "user-comp-1"
    );
    if (clean.length !== parsed.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

// Secure SHA-256 password hash (Client & Server compatible)
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Simple fallback
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

export function findUserByCredentials(identifier: string): User | undefined {
  const users = getStoredUsers();
  const clean = identifier.trim().toLowerCase();
  return users.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      (u.username && u.username.toLowerCase() === clean)
  );
}

export function findPartnerByCredentials(identifier: string): PartnerApplication | undefined {
  const partners = getStoredPartnerApplications();
  const clean = identifier.trim().toLowerCase();
  return partners.find(
    (p) =>
      p.email.toLowerCase() === clean ||
      (p.username && p.username.toLowerCase() === clean) ||
      (p.mobile && p.mobile.replace(/\D/g, "") === clean.replace(/\D/g, ""))
  );
}

export function saveOrUpdateUser(user: User): User {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.unshift(user);
  }
  saveUsers(users);
  // Asynchronously sync user to Firestore
  firestoreSyncUser(user).catch(() => {});
  return user;
}

export function saveOrUpdatePartner(partner: PartnerApplication): PartnerApplication {
  const partners = getStoredPartnerApplications();
  const idx = partners.findIndex((p) => p.id === partner.id || p.email.toLowerCase() === partner.email.toLowerCase());
  if (idx !== -1) {
    partners[idx] = { ...partners[idx], ...partner };
  } else {
    partners.unshift(partner);
  }
  savePartnerApplications(partners);
  // Asynchronously sync partner to Firestore
  firestoreSyncPartner(partner).catch(() => {});
  return partner;
}

export function resetPassword(role: "user" | "partner", identifier: string, newPasswordHash: string): boolean {
  if (role === "user") {
    const users = getStoredUsers();
    const clean = identifier.trim().toLowerCase();
    const idx = users.findIndex((u) => u.email.toLowerCase() === clean || (u.username && u.username.toLowerCase() === clean));
    if (idx !== -1) {
      users[idx].passwordHash = newPasswordHash;
      saveUsers(users);
      return true;
    }
  } else {
    const partners = getStoredPartnerApplications();
    const clean = identifier.trim().toLowerCase();
    const idx = partners.findIndex((p) => p.email.toLowerCase() === clean || (p.username && p.username.toLowerCase() === clean));
    if (idx !== -1) {
      partners[idx].passwordHash = newPasswordHash;
      savePartnerApplications(partners);
      return true;
    }
  }
  return false;
}

export function approvePartnerApplication(appId: string): Companion | null {
  const apps = getStoredPartnerApplications();
  const appIndex = apps.findIndex((a) => a.id === appId);
  if (appIndex === -1) return null;

  const app = apps[appIndex];
  app.status = "approved";
  app.approvedAt = new Date().toISOString();

  // Create or update Companion profile in public directory
  const companions = getStoredCompanions();
  const companionId = app.companionId || `comp-${Date.now().toString().slice(-6)}`;
  app.companionId = companionId;

  // Calculate age from dob
  let computedAge = 23;
  if (app.dob) {
    const birthYear = new Date(app.dob).getFullYear();
    if (!isNaN(birthYear)) {
      computedAge = Math.max(18, new Date().getFullYear() - birthYear);
    }
  }

  const existingCompanionIndex = companions.findIndex((c) => c.id === companionId || (c.partnerId && c.partnerId === app.id));

  const newCompanion: Companion = {
    id: companionId,
    userId: app.userId,
    partnerId: app.id,
    fullName: app.fullLegalName,
    gender: app.gender,
    age: computedAge,
    city: app.city,
    headline: app.headline || `${app.gender === "female" ? "Charming" : "Gentleman"} companion in ${app.city}`,
    bio: app.bio || `Verified DateMate partner in ${app.city}, ${app.state}. Courteous, respectful, and engaging companion for dining, events, and conversation.`,
    hourlyPrice: app.hourlyPrice || 1500,
    price30Min: app.price30Min || Math.round((app.hourlyPrice || 1500) * 0.6),
    rating: 5.0,
    reviewCount: 0,
    photos: app.photos && app.photos.length > 0 ? app.photos : [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    languages: app.languages && app.languages.length > 0 ? app.languages : ["Hindi", "English"],
    interests: app.interests && app.interests.length > 0 ? app.interests : ["Dining", "Cinema", "Music"],
    services: app.services && app.services.length > 0 ? app.services : ["Fine Dining & Cafes", "Cinema & Theater"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    idProofType: "Aadhaar Card",
    idProofNumber: app.maskedAadhaar,
    isDemo: false,
    createdAt: app.submittedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingCompanionIndex !== -1) {
    companions[existingCompanionIndex] = newCompanion;
  } else {
    companions.unshift(newCompanion);
  }

  apps[appIndex] = app;
  savePartnerApplications(apps);
  saveCompanions(companions);

  return newCompanion;
}

export function rejectPartnerApplication(appId: string, reason: string): boolean {
  const apps = getStoredPartnerApplications();
  const appIndex = apps.findIndex((a) => a.id === appId);
  if (appIndex === -1) return false;

  apps[appIndex].status = "rejected";
  apps[appIndex].rejectionReason = reason || "Documentation requirements not satisfied.";

  // Deactivate any linked companion profile
  if (apps[appIndex].companionId) {
    const companions = getStoredCompanions();
    const updatedCompanions = companions.filter((c) => c.id !== apps[appIndex].companionId && c.partnerId !== appId);
    saveCompanions(updatedCompanions);
  }

  savePartnerApplications(apps);
  return true;
}

export function suspendPartnerApplication(appId: string): boolean {
  const apps = getStoredPartnerApplications();
  const appIndex = apps.findIndex((a) => a.id === appId);
  if (appIndex === -1) return false;

  apps[appIndex].status = "suspended";

  // Deactivate any linked companion profile
  if (apps[appIndex].companionId) {
    const companions = getStoredCompanions();
    const updatedCompanions = companions.map((c) => {
      if (c.id === apps[appIndex].companionId || c.partnerId === appId) {
        return { ...c, isActive: false, verificationStatus: "rejected" as const };
      }
      return c;
    });
    saveCompanions(updatedCompanions);
  }

  savePartnerApplications(apps);
  return true;
}

