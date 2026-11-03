import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User as FirebaseUser,
  Auth
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Firestore
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { User, PartnerApplication, Booking } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("your_") &&
  !firebaseConfig.projectId.includes("your-")
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase initialization warning (safe fallback active):", error);
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ============================================================================
// FIREBASE AUTH HELPERS (with safe fallbacks)
// ============================================================================

export async function firebaseSignInWithGoogle(): Promise<{
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
} | null> {
  if (!auth || !isFirebaseConfigured) {
    console.info("Firebase Auth not configured yet. Using simulated Google OAuth profile.");
    return null;
  }
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
  };
}

export async function firebaseSignInWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
  if (!auth || !isFirebaseConfigured) {
    return null;
  }
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
}

export async function firebaseSignUpWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
  if (!auth || !isFirebaseConfigured) {
    return null;
  }
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  return credential.user;
}

export async function firebaseSendPasswordReset(email: string): Promise<boolean> {
  if (!auth || !isFirebaseConfigured) {
    return false;
  }
  await sendPasswordResetEmail(auth, email);
  return true;
}

export async function firebaseSignOut(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }
}

// ============================================================================
// FIRESTORE CLOUD DATABASE HELPERS
// ============================================================================

export async function firestoreSyncUser(user: User): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore syncUser notice:", e);
  }
}

export async function firestoreSyncPartner(partner: PartnerApplication): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const partnerRef = doc(db, "partners", partner.id);
    await setDoc(partnerRef, {
      ...partner,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore syncPartner notice:", e);
  }
}

export async function firestoreGetUser(userId: string): Promise<User | null> {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
  } catch (e) {
    console.warn("Firestore getUser notice:", e);
  }
  return null;
}

export async function firestoreGetPartner(partnerId: string): Promise<PartnerApplication | null> {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const partnerRef = doc(db, "partners", partnerId);
    const snap = await getDoc(partnerRef);
    if (snap.exists()) {
      return snap.data() as PartnerApplication;
    }
  } catch (e) {
    console.warn("Firestore getPartner notice:", e);
  }
  return null;
}

export async function firestoreSaveBooking(booking: Booking): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const bookingRef = doc(db, "bookings", booking.id);
    await setDoc(bookingRef, {
      ...booking,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.warn("Firestore saveBooking notice:", e);
  }
}

/**
 * Real-time companion subscriber for live Admin Panel sync
 */
export function firestoreSubscribeCompanions(callback: (companions: any[]) => void) {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const q = collection(db, "companions");
    const { onSnapshot } = require("firebase/firestore");
    return onSnapshot(q, (snapshot: any) => {
      const list: any[] = [];
      snapshot.forEach((d: any) => {
        list.push({ ...d.data(), id: d.id });
      });
      callback(list);
    });
  } catch (e) {
    console.warn("firestoreSubscribeCompanions notice:", e);
    return null;
  }
}

/**
 * Real-time location availability subscriber for live Admin Panel sync
 */
export function firestoreSubscribeLocations(callback: (locations: any[]) => void) {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const q = collection(db, "locations");
    const { onSnapshot } = require("firebase/firestore");
    return onSnapshot(q, (snapshot: any) => {
      const list: any[] = [];
      snapshot.forEach((d: any) => {
        list.push({ ...d.data(), id: d.id });
      });
      callback(list);
    });
  } catch (e) {
    console.warn("firestoreSubscribeLocations notice:", e);
    return null;
  }
}

export { app, auth, db, storage };

