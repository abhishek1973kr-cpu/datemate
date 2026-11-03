export type UserRole = 'client' | 'companion' | 'admin' | 'user' | 'partner';

export const SUPPORTED_LOCATIONS = [
  "Kolkata",
  "Patna",
  "Delhi",
  "Hyderabad",
  "Bangalore",
  "Maharashtra",
  "Jharkhand (Ranchi)"
] as const;

export type SupportedLocation = (typeof SUPPORTED_LOCATIONS)[number];

export interface ServiceState {
  id: string;
  name: string;
  cityFilter: string;
  isAvailable: boolean;
}

export const SERVICE_STATES_CONFIG: ServiceState[] = [
  { id: "wb", name: "West Bengal – Kolkata", cityFilter: "Kolkata", isAvailable: true },
  { id: "br", name: "Bihar – Patna", cityFilter: "Patna", isAvailable: true },
  { id: "dl", name: "Delhi", cityFilter: "Delhi", isAvailable: true },
  { id: "ts", name: "Telangana – Hyderabad", cityFilter: "Hyderabad", isAvailable: true },
  { id: "ka", name: "Karnataka – Bangalore", cityFilter: "Bangalore", isAvailable: true },
  { id: "mh", name: "Maharashtra – Entire State", cityFilter: "Maharashtra", isAvailable: true },
  { id: "jh", name: "Jharkhand – Ranchi", cityFilter: "Jharkhand (Ranchi)", isAvailable: true },
  // Unavailable locations (Future configurable)
  { id: "up", name: "Uttar Pradesh", cityFilter: "Uttar Pradesh", isAvailable: false },
  { id: "tn", name: "Tamil Nadu", cityFilter: "Tamil Nadu", isAvailable: false },
  { id: "gj", name: "Gujarat", cityFilter: "Gujarat", isAvailable: false },
  { id: "rj", name: "Rajasthan", cityFilter: "Rajasthan", isAvailable: false },
  { id: "pb", name: "Punjab", cityFilter: "Punjab", isAvailable: false },
  { id: "kl", name: "Kerala", cityFilter: "Kerala", isAvailable: false },
  { id: "mp", name: "Madhya Pradesh", cityFilter: "Madhya Pradesh", isAvailable: false },
  { id: "hr", name: "Haryana", cityFilter: "Haryana", isAvailable: false },
  { id: "ap", name: "Andhra Pradesh", cityFilter: "Andhra Pradesh", isAvailable: false },
  { id: "or", name: "Odisha", cityFilter: "Odisha", isAvailable: false },
  { id: "as", name: "Assam", cityFilter: "Assam", isAvailable: false },
  { id: "ga", name: "Goa", cityFilter: "Goa", isAvailable: false },
  { id: "hp", name: "Himachal Pradesh", cityFilter: "Himachal Pradesh", isAvailable: false },
  { id: "uk", name: "Uttarakhand", cityFilter: "Uttarakhand", isAvailable: false },
  { id: "ct", name: "Chhattisgarh", cityFilter: "Chhattisgarh", isAvailable: false },
  { id: "other", name: "Other States / Union Territories", cityFilter: "Other", isAvailable: false }
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  age: number;
  city?: string;
  state?: string;
  avatarUrl?: string;
  isAgeVerified: boolean;
  authProvider?: 'google' | 'admin' | 'demo';
  partnerId?: string;
  createdAt: string;
}

export type Gender = 'female' | 'male' | 'other';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface PartnerApplication {
  id: string; // e.g. "DM-PTR-83921"
  userId?: string;
  // Step 1: Personal Details
  fullLegalName: string;
  dob: string;
  gender: Gender;
  mobile: string;
  email: string;
  residentialAddress: string;
  city: string;
  state: string;
  pincode: string;
  // Step 2: Profile Photos (2 to 5)
  photos: string[];
  // Step 3: Identity Verification (Aadhaar)
  aadhaarNumber: string; // full number (private)
  maskedAadhaar: string; // "XXXX-XXXX-1234"
  aadhaarDocumentUrl: string; // private storage url or document data
  aadhaarConsent: boolean;
  // Step 4: Partner Registration Fee (₹199)
  feeAmount: number; // 199
  feePaid: boolean;
  feeTransactionId?: string;
  feePaidAt?: string;
  // Step 5: Application Status & Profile Info
  status: PartnerStatus;
  rejectionReason?: string;
  submittedAt: string;
  approvedAt?: string;
  headline?: string;
  bio?: string;
  hourlyPrice?: number;
  price30Min?: number;
  services?: string[];
  languages?: string[];
  interests?: string[];
  isAvailable?: boolean;
  isActive?: boolean;
  companionId?: string;
}

export interface Companion {
  id: string;
  userId?: string;
  partnerId?: string; // Links back to Partner Application if created via partner registration
  fullName: string;
  gender: Gender;
  age: number;
  city: string; // SupportedLocation or custom
  locationId?: string;
  headline: string;
  bio: string;
  price30Min?: number;
  hourlyPrice: number;
  rating: number;
  reviewCount: number;
  photos: string[];
  languages: string[];
  interests: string[];
  services: string[];
  verificationStatus: VerificationStatus;
  isAvailable: boolean;
  isActive?: boolean; // Admin activation/deactivation toggle
  idProofType?: string;
  idProofNumber?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  companionId: string;
  companionName: string;
  companionPhoto: string;
  companionCity: string;
  date: string;
  time: string;
  durationHours: number;
  activity: string;
  meetingLocation: string;
  hourlyPrice: number;
  subtotal: number;
  platformFee: number;
  tax: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  specialNotes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  companionId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  activity: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  bookingId?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedId: string;
  reportedName: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
}
