"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { hashPassword, resetPassword } from "@/lib/store";
import {
  Heart,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await loginWithCredentials(identifier, password, "user");
      if (!user.hasPaidRegistrationFee) {
        // Redirect to complete payment if pending
        router.push("/auth/user-register?step=payment");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setError((err as Error).message || "Invalid credentials. Please check your username/email and password.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const user = await loginWithGoogle();
      if (!user.hasPaidRegistrationFee) {
        router.push("/auth/user-register?step=profile");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setError((err as Error).message || "Google Authentication failed.");
      setIsGoogleLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotIdentifier.trim() || newPassword.length < 8) {
      setForgotError("Please enter your registered email/username and a new password with at least 8 characters.");
      return;
    }

    const hashed = await hashPassword(newPassword);
    const success = resetPassword("user", forgotIdentifier, hashed);
    if (success) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setShowForgotModal(false);
        setPassword(newPassword);
      }, 2000);
    } else {
      setForgotError("No registered user account found with that email or username.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative">
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

          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            User Sign In
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in to discover, chat, and book verified companions across India.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleUserLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. karan or karan.singhal@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-pink-400 hover:text-pink-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 tracking-wide transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[11px] text-zinc-400 block mb-1">Demo Client Testing:</span>
            <button
              type="button"
              onClick={() => {
                setIdentifier("karan.singhal@example.com");
                setPassword("user123");
              }}
              className="text-xs text-pink-300 hover:underline font-semibold"
            >
              Autofill Demo Client (Karan Singhal)
            </button>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#12121A] px-3 text-[11px] uppercase tracking-wider text-zinc-500 absolute">
              Or
            </span>
          </div>

          {/* Google Sign In Option */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md shadow-white/5 disabled:opacity-50"
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Sign Up Option */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/user-register"
              className="text-pink-400 font-bold hover:text-pink-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-2 text-center text-[11px] text-zinc-500">
            Are you a companion partner?{" "}
            <Link href="/partner/login" className="text-purple-400 font-semibold hover:underline">
              Partner Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12121A] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset User Password</h3>
            <p className="text-xs text-zinc-400">
              Enter your registered user email or username and enter a new password.
            </p>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password reset successfully! You can now log in.</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Registered Email or Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. karan.singhal@example.com"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  New Password (Min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-btn shadow-md"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
