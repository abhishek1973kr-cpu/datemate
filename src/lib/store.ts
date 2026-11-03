"use client";

import { Companion, Booking, Review, ChatMessage, SafetyReport, User, PartnerApplication } from "@/types";
import { INITIAL_COMPANIONS, DEMO_REVIEWS } from "./demo-data";

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

export const DEMO_CLIENT: User = {
  id: "user-client-1",
  name: "Karan Singhal",
  email: "karan.singhal@example.com",
  phone: "+91 98111 22334",
  role: "user",
  age: 26,
  city: "Delhi",
  state: "Delhi",
  isAgeVerified: true,
  authProvider: "google",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  createdAt: "2026-02-01T10:00:00Z"
};

export const DEMO_COMPANION_USER: User = {
  id: "user-comp-1",
  name: "Aanya Sharma",
  email: "aanya.sharma@example.com",
  phone: "+91 98222 33445",
  role: "partner",
  partnerId: "DM-PTR-10024",
  age: 24,
  city: "Maharashtra",
  state: "Maharashtra",
  isAgeVerified: true,
  authProvider: "google",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  createdAt: "2026-01-15T10:00:00Z"
};

export const INITIAL_PARTNERS: PartnerApplication[] = [
  {
    id: "DM-PTR-10024",
    userId: "user-comp-1",
    fullLegalName: "Aanya Sharma",
    dob: "2000-05-14",
    gender: "female",
    mobile: "+91 98222 33445",
    email: "aanya.sharma@example.com",
    residentialAddress: "Flat 402, Pali Hill, Bandra West",
    city: "Maharashtra",
    state: "Maharashtra",
    pincode: "400050",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    aadhaarNumber: "7849-3829-1920",
    maskedAadhaar: "XXXX-XXXX-1920",
    aadhaarDocumentUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    aadhaarConsent: true,
    feeAmount: 199,
    feePaid: true,
    feeTransactionId: "pay_rzp_ptr_10024",
    feePaidAt: "2026-01-15T10:05:00Z",
    status: "approved",
    submittedAt: "2026-01-15T10:00:00Z",
    approvedAt: "2026-01-15T12:00:00Z",
    headline: "Art curator, foodie & enthusiastic conversationalist",
    bio: "Passionate about world cinema, literature, and art exhibitions in Mumbai.",
    hourlyPrice: 1500,
    price30Min: 900,
    services: ["Fine Dining & Cafes", "Cinema & Theater", "Social & Family Events"],
    languages: ["English", "Hindi", "Marathi"],
    interests: ["Contemporary Art", "Cinema", "Italian Cuisine"],
    isAvailable: true,
    isActive: true,
    companionId: "comp-1"
  },
  {
    id: "DM-PTR-10492",
    fullLegalName: "Neha Chaurasia",
    dob: "2001-08-22",
    gender: "female",
    mobile: "+91 98350 49122",
    email: "neha.patna@example.com",
    residentialAddress: "House 12, Boring Canal Road, Near Maurya Lok",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    aadhaarNumber: "9123-4567-8901",
    maskedAadhaar: "XXXX-XXXX-8901",
    aadhaarDocumentUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    aadhaarConsent: true,
    feeAmount: 199,
    feePaid: true,
    feeTransactionId: "pay_rzp_ptr_10492",
    feePaidAt: "2026-11-02T18:30:00Z",
    status: "pending",
    submittedAt: "2026-11-02T18:25:00Z",
    headline: "Literature graduate & warm cafe conversationalist",
    bio: "Well-spoken and courteous companion available for cafe dates and dining in Patna.",
    hourlyPrice: 1200,
    price30Min: 700,
    services: ["Fine Dining & Cafes", "Coffee & Deep Conversation"],
    languages: ["Hindi", "English", "Bhojpuri"],
    interests: ["Poetry", "Cafes", "Music"],
    isAvailable: true,
    isActive: true
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-1001",
    clientId: "user-client-1",
    clientName: "Karan Singhal",
    clientPhone: "+91 98111 22334",
    companionId: "comp-1",
    companionName: "Aanya Sharma",
    companionPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    companionCity: "Mumbai",
    date: "2026-11-10",
    time: "19:00",
    durationHours: 3,
    activity: "Fine Dining & Cafes",
    meetingLocation: "Bastian, Bandra West, Mumbai",
    hourlyPrice: 1500,
    subtotal: 4500,
    platformFee: 450,
    tax: 225,
    totalAmount: 5175,
    status: "confirmed",
    paymentStatus: "paid",
    paymentId: "pay_rzp_demo_101",
    specialNotes: "Looking forward to great continental food and music conversation.",
    createdAt: "2026-11-01T14:30:00Z"
  },
  {
    id: "bk-1002",
    clientId: "user-client-1",
    clientName: "Karan Singhal",
    clientPhone: "+91 98111 22334",
    companionId: "comp-3",
    companionName: "Rhea Sen",
    companionPhoto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    companionCity: "Delhi NCR",
    date: "2026-11-15",
    time: "15:00",
    durationHours: 2,
    activity: "Shopping & Styling",
    meetingLocation: "Select CITYWALK Mall, Saket, New Delhi",
    hourlyPrice: 1600,
    subtotal: 3200,
    platformFee: 320,
    tax: 160,
    totalAmount: 3680,
    status: "pending",
    paymentStatus: "pending",
    specialNotes: "Need wardrobe advice for winter wear.",
    createdAt: "2026-11-02T16:00:00Z"
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    bookingId: "bk-1001",
    senderId: "user-client-1",
    senderName: "Karan Singhal",
    receiverId: "comp-1",
    text: "Hi Aanya! Really excited for our dinner at Bastian next Friday.",
    timestamp: "2026-11-01T15:00:00Z"
  },
  {
    id: "msg-2",
    bookingId: "bk-1001",
    senderId: "comp-1",
    senderName: "Aanya Sharma",
    receiverId: "user-client-1",
    text: "Hey Karan! Looking forward to it too. I have noted the reservation time. See you at the main reception entrance at 7:00 PM!",
    timestamp: "2026-11-01T15:15:00Z"
  }
];

const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: "rep-1",
    reporterId: "user-comp-1",
    reporterName: "Aanya Sharma",
    reportedId: "user-999",
    reportedName: "Ramesh K.",
    reason: "Offensive request in inquiry",
    description: "User asked for private home visit which violates DateMate public space policy. Inquiries blocked immediately.",
    status: "investigating",
    createdAt: "2026-11-01T18:00:00Z"
  }
];

// Helper methods with localStorage fallback
export function getStoredCompanions(): Companion[] {
  if (typeof window === "undefined") return INITIAL_COMPANIONS;
  try {
    const raw = localStorage.getItem(COMPANIONS_KEY);
    if (!raw) {
      localStorage.setItem(COMPANIONS_KEY, JSON.stringify(INITIAL_COMPANIONS));
      return INITIAL_COMPANIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPANIONS;
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
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
}

export function getStoredReviews(): Review[] {
  if (typeof window === "undefined") return DEMO_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(DEMO_REVIEWS));
      return DEMO_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_REVIEWS;
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
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESSAGES;
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
      localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
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
      localStorage.setItem(PARTNERS_KEY, JSON.stringify(INITIAL_PARTNERS));
      return INITIAL_PARTNERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PARTNERS;
  }
}

export function savePartnerApplications(apps: PartnerApplication[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNERS_KEY, JSON.stringify(apps));
  }
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

