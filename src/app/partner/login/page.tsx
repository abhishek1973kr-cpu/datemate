"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { hashPassword, resetPassword } from "@/lib/store";
import {
  Heart,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Briefcase
} from "lucide-react";

export default function PartnerLoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginWithCredentials(identifier, password, "partner");
      router.push("/dashboard/partner");
    } catch (err) {
      setError((err as Error).message || "Invalid partner credentials. Please check and try again.");
      setIsLoading(false);
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
    const success = resetPassword("partner", forgotIdentifier, hashed);
    if (success) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setShowForgotModal(false);
        setPassword(newPassword);
      }, 2000);
    } else {
      setForgotError("No registered partner account found with that email or username.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/15 via-pink-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Partner Portal</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in to manage your companion bookings, availability, and earnings.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePartnerLogin} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. aanya or aanya.sharma@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
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
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 tracking-wide transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Partner Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login to Partner Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Companion Quick Fill */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[11px] text-zinc-400 block mb-1.5">Demo Partner Testing:</span>
            <button
              type="button"
              onClick={() => {
                setIdentifier("aanya.sharma@example.com");
                setPassword("partner123");
              }}
              className="text-xs text-purple-300 hover:underline font-semibold"
            >
              Autofill Demo Partner (Aanya Sharma)
            </button>
          </div>

          {/* Don't have an account? Sign Up */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/partner/register"
              className="text-purple-400 font-bold hover:text-purple-300 hover:underline inline-flex items-center gap-1"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12121A] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset Partner Password</h3>
            <p className="text-xs text-zinc-400">
              Enter your registered partner email or username and choose a new password.
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
                  placeholder="e.g. aanya.sharma@example.com"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
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
