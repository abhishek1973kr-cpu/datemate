"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const user = await loginWithGoogle();
      if (!user.hasPaidRegistrationFee) {
        // New user or pending registration fee -> complete profile
        router.push("/auth/user-register?step=profile");
      } else {
        // Existing registered user -> direct to dashboard
        router.push("/dashboard/user");
      }
    } catch (err: any) {
      if (err?.message?.includes("closed")) {
        setError("Google authentication window was closed. Please try again.");
      } else {
        setError(err?.message || "Google authentication failed. Please try again.");
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-600/15 via-purple-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-6 relative z-10">
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

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            User Sign In
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Find and book verified companions for dining, movies, shopping, and events across India.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Value Highlights */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Google Identity verification (Firebase Auth)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Existing users go straight to dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>New users can sign up and verify instantly</span>
            </div>
          </div>

          {/* Option 1: Continue with Google */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-white/5 disabled:opacity-50 group hover:scale-[1.01]"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-800" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#12121A] px-3 text-[11px] uppercase tracking-wider text-zinc-500 absolute">
              Or
            </span>
          </div>

          {/* Option 2: Sign Up Button */}
          <div>
            <Link
              href="/auth/user-register"
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 tracking-wide transition-all hover:scale-[1.01]"
            >
              <span>Create New User Account (Sign Up)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Security & Verification Note */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>18+ Mandatory • Verified Platonic Platform</span>
          </div>

          {/* Partner Portal Shortcut */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
            Are you a companion partner?{" "}
            <Link href="/partner/login" className="text-purple-400 font-semibold hover:text-purple-300 hover:underline">
              Partner Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
