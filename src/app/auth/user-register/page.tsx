"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SUPPORTED_LOCATIONS } from "@/types";
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Lock,
  Loader2
} from "lucide-react";

export default function UserRegisterPage() {
  const router = useRouter();
  const { loginWithGoogle, completeUserProfile } = useAuth();

  // Step 1: Google OAuth; Step 2: Complete Profile details
  const [authStep, setAuthStep] = useState<"google_sign_in" | "complete_profile">("google_sign_in");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google pre-filled fields
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleAvatar, setGoogleAvatar] = useState("");

  // Additional completion fields
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState<string>(SUPPORTED_LOCATIONS[0]);
  const [state, setState] = useState("West Bengal");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<number>(23);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      // Simulate OAuth response with authentic Google payload
      const mockGoogleProfile = {
        name: "Rohit Malhotra",
        email: "rohit.malhotra.google@gmail.com",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
      };

      // In real browser environment, fetch Google user
      await loginWithGoogle(mockGoogleProfile);

      setGoogleName(mockGoogleProfile.name);
      setGoogleEmail(mockGoogleProfile.email);
      setGoogleAvatar(mockGoogleProfile.avatarUrl);
      setFullName(mockGoogleProfile.name);

      setTimeout(() => {
        setIsGoogleLoading(false);
        setAuthStep("complete_profile");
      }, 900);
    } catch (err) {
      setIsGoogleLoading(false);
      setError((err as Error).message || "Google Authentication failed. Please try again.");
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAgeConfirmed || age < 18) {
      setError("You must confirm you are at least 18 years of age to register on DateMate.");
      return;
    }

    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await completeUserProfile({
        name: fullName || googleName,
        city,
        state,
        phone,
        age: Number(age)
      });

      // Redirect to User Dashboard
      router.push("/dashboard/user");
    } catch (err) {
      setIsSubmitting(false);
      setError((err as Error).message || "Failed to complete profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link href="/welcome" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-white">
              Date<span className="text-pink-400">Mate</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight">User Registration</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Exclusive Google OAuth Authentication • No Passwords Needed
          </p>
        </div>

        {/* Security Alert */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict 18+ Verification & Secure OAuth</span>
          </span>
          <span className="text-pink-400 font-semibold">User Access</span>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authStep === "google_sign_in" ? (
            /* STEP 1: GOOGLE OAUTH ONLY */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                {/* Google Multi-Color SVG Icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Continue with Google</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  To ensure safety and prevent spam accounts, DateMate users authenticate exclusively through Google OAuth.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-white/10 disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-zinc-400">
                🔒 No passwords to remember. Your private contact details are never shared with companions without booking confirmation.
              </div>
            </div>
          ) : (
            /* STEP 2: COMPLETE USER PROFILE DETAILS */
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-500/50">
                  <Image src={googleAvatar} alt={googleName} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{googleName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-zinc-400 truncate block">{googleEmail}</span>
                </div>
              </div>

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  1. Full Name (Pre-filled from Google) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* 2 & 3. City and State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    2. City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 font-medium"
                  >
                    {SUPPORTED_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    3. State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Delhi..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* 4. Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  4. Mobile Number (+91) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number e.g. 9811122334"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* 5. Age confirmation (18+) */}
              <div className="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Your Age (Years):</span>
                  <input
                    type="number"
                    min={18}
                    max={99}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-xs rounded-lg bg-black/40 border border-white/10 text-white text-center font-bold"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAgeConfirmed}
                    onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-pink-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-zinc-300 leading-tight">
                    5. Mandatory Age Confirmation: I confirm that I am at least 18 years of age and agree to DateMate's strictly platonic code of conduct.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 tracking-wide disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating User Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Profile & Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-zinc-400 pt-2 border-t border-white/10">
            Want to earn as a companion instead?{" "}
            <Link href="/partner/register" className="text-pink-400 font-bold hover:underline">
              Become a Partner →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

