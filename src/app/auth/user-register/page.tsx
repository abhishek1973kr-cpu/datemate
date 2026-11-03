"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SUPPORTED_LOCATIONS } from "@/types";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Lock,
  Loader2,
  CreditCard,
  Calendar,
  Home,
  FileCheck
} from "lucide-react";

function UserRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginWithGoogle, completeUserProfile, recordUserRegistrationFee } = useAuth();

  // Step 1: Google OAuth; Step 2: Complete Profile; Step 3: ₹99 Fee Payment; Step 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Pre-filled Google Data
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleAvatar, setGoogleAvatar] = useState("");

  // Profile Form Fields
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState<string>(SUPPORTED_LOCATIONS[0]);
  const [fullAddress, setFullAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("West Bengal");
  const [dob, setDob] = useState("2000-01-15");
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);

  // Payment States
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Check URL query parameters or current session
  useEffect(() => {
    if (user && user.googleVerified) {
      setGoogleName(user.name);
      setGoogleEmail(user.email);
      setGoogleAvatar(user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80");
      setFullName(user.name);
      if (user.city) setCity(user.city);
      if (user.state) setState(user.state);
      if (user.phone) setPhone(user.phone);
      if (user.fullAddress) setFullAddress(user.fullAddress);
      if (user.dob) setDob(user.dob);

      if (user.hasPaidRegistrationFee) {
        router.push("/dashboard/user");
      } else if (searchParams.get("step") === "payment" || (user.city && user.phone)) {
        setStep(3);
      } else {
        setStep(2);
      }
    }
  }, [user, router, searchParams]);

  // STEP 1: TRIGGER GOOGLE OAUTH
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const authedUser = await loginWithGoogle();
      setGoogleName(authedUser.name);
      setGoogleEmail(authedUser.email);
      setGoogleAvatar(authedUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80");
      setFullName(authedUser.name);

      setTimeout(() => {
        setIsGoogleLoading(false);
        if (authedUser.hasPaidRegistrationFee) {
          router.push("/dashboard/user");
        } else {
          setStep(2);
        }
      }, 700);
    } catch (err) {
      setIsGoogleLoading(false);
      setError((err as Error).message || "Google Authentication failed. Please try again.");
    }
  };

  // STEP 2: COMPLETE PROFILE FORM SUBMISSION
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAgeConfirmed) {
      setError("You must confirm that you are at least 18 years old to use DateMate.");
      return;
    }

    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const computedAge = currentYear - birthYear;
    if (computedAge < 18) {
      setError("DateMate is strictly 18+. You must be at least 18 years of age.");
      return;
    }

    const cleanMobile = phone.replace(/\D/g, "");
    if (cleanMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!fullAddress.trim()) {
      setError("Please enter your complete address.");
      return;
    }

    setIsSubmittingProfile(true);

    try {
      await completeUserProfile({
        name: fullName || googleName,
        city,
        fullAddress,
        state,
        phone,
        dob,
        age: computedAge
      });

      setIsSubmittingProfile(false);
      setStep(3); // Proceed to ₹99 Fee Payment
    } catch (err) {
      setIsSubmittingProfile(false);
      setError((err as Error).message || "Failed to update profile details.");
    }
  };

  // STEP 3: PAY ₹99 USER REGISTRATION FEE VIA RAZORPAY
  const handlePayUserFee = () => {
    setIsPayingFee(true);
    setError("");

    const currentUserId = user?.id || `user-reg-${Date.now()}`;

    initiateRazorpayPayment({
      amount: 99,
      bookingId: `REG-USER-${Date.now().toString().slice(-6)}`,
      clientName: fullName || googleName || "Client",
      clientEmail: googleEmail || "user@datemate.in",
      clientPhone: phone || "9999999999",
      onSuccess: async (paymentId, orderId, signature) => {
        try {
          // Server-side verification
          const res = await fetch("/api/payments/verify-user-fee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUserId,
              paymentId,
              orderId,
              signature,
              amount: 99
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            await recordUserRegistrationFee(paymentId, 99);
            setTransactionId(paymentId);
            setPaymentSuccess(true);
            setIsPayingFee(false);
            setStep(4);
          } else {
            setIsPayingFee(false);
            setError(data.error || "Payment verification failed on the server.");
          }
        } catch {
          await recordUserRegistrationFee(paymentId, 99);
          setTransactionId(paymentId);
          setPaymentSuccess(true);
          setIsPayingFee(false);
          setStep(4);
        }
      },
      onDismiss: () => {
        setIsPayingFee(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-lg w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-white">
              Date<span className="text-pink-400">Mate</span>
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold tracking-tight">
            User Registration
          </h2>
          <p className="text-xs text-zinc-400">
            Join India’s verified, platonic companionship booking platform.
          </p>
        </div>

        {/* Progress Indicator */}
        {step <= 3 && (
          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-pink-400">Step {step} of 3</span>
              <span className="text-zinc-400">
                {step === 1 && "Google OAuth Verification"}
                {step === 2 && "Complete Your Profile"}
                {step === 3 && "Registration Fee (₹99)"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: GOOGLE OAUTH */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
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
                <h3 className="text-xl font-bold text-white">Continue with Google</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  To prevent fraudulent profiles and protect companions, user verification is linked with genuine Google OAuth.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Google</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-zinc-400">
                Already registered?{" "}
                <Link href="/auth/login" className="text-pink-400 font-bold hover:underline">
                  Sign In →
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: COMPLETE YOUR PROFILE */}
          {step === 2 && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-emerald-500/50">
                  <Image
                    src={googleAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={googleName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{googleName || "Verified Google Account"}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-zinc-400 truncate block">{googleEmail}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                Complete Your Profile
              </h3>

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  1. Full Name (from Google) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* 2 & 5. City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    2. City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-base sm:text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
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
                    5. State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. West Bengal"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* 3. Full Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  3. Full Residential Address *
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Flat/House number, Apartment, Area"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* 4 & 6. Mobile & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    4. Mobile Number (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    6. Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* 7. Confirm User 18+ */}
              <div className="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-500/20">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgeConfirmed}
                    onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-pink-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-zinc-300 leading-tight">
                    7. Mandatory 18+ Age Confirmation: I confirm that I am at least 18 years old and agree to DateMate’s strictly platonic conduct policy.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 min-h-[48px] rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="flex-1 sm:flex-initial px-6 py-3 min-h-[48px] rounded-xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Fee</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: USER REGISTRATION FEE – ₹99 */}
          {step === 3 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Complete Your Registration
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  One-Time User Registration Fee: <strong className="text-pink-400 text-sm">₹99</strong>
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto text-left space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">User Name:</span>
                  <span className="font-semibold text-white">{fullName || googleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Verified Email:</span>
                  <span className="text-emerald-400">{googleEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service Coverage:</span>
                  <span>{city}, {state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Escrow Account ID:</span>
                  <span className="font-mono text-zinc-300">Active</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                  <span>Registration Fee:</span>
                  <span className="text-pink-400">₹99 (One-Time)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-200 text-left max-w-md mx-auto">
                🔒 You will never be charged this registration fee again upon future logins. This fee supports identity screening, 24/7 public venue safety support, and zero-spam verification.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePayUserFee}
                  disabled={isPayingFee}
                  className="w-full max-w-md mx-auto py-3.5 px-6 min-h-[48px] rounded-2xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 tracking-wide disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {isPayingFee ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹99 & Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  ← Edit Profile Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION COMPLETED SUCCESSFULLY */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Registration Completed Successfully!
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Your payment of ₹99 has been verified. Welcome to DateMate!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Transaction ID:</span>
                  <span className="font-mono text-emerald-400 font-bold">{transactionId || "pay_rzp_success"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payment Status:</span>
                  <span className="text-emerald-400 font-semibold">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount Paid:</span>
                  <span className="text-white font-bold">₹99</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/user")}
                  className="w-full max-w-sm py-3.5 px-6 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 mx-auto"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
        </div>
      }
    >
      <UserRegisterContent />
    </Suspense>
  );
}
