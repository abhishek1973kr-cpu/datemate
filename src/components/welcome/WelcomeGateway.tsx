"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Heart,
  Sparkles,
  Users,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  MapPin
} from "lucide-react";

interface WelcomeGatewayProps {
  onContinueAsUser?: () => void;
}

export function WelcomeGateway({ onContinueAsUser }: WelcomeGatewayProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleUserClick = () => {
    if (onContinueAsUser) {
      onContinueAsUser();
    } else {
      if (!user || user.authProvider !== "google") {
        router.push("/auth/user-register");
      } else {
        router.push("/browse");
      }
    }
  };

  const handlePartnerClick = () => {
    router.push("/partner/register");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#09090D] text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-pink-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-10">
        {/* Brand Ribbon & Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200">
              India’s Premier Verified Companionship Platform • 18+ Mandatory
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Date<span className="text-pink-400">Mate</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Choose How You Want to Experience <span className="gradient-text">DateMate</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Safe, dignified, and 100% verified platonic social companionship across India.
          </p>
        </div>

        {/* The Two Large Gateway Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {/* OPTION 1: BECOME A USER */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#181824] to-[#111119] border border-white/15 hover:border-pink-500/50 p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 hover:shadow-pink-500/15 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Option 1
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  BECOME A USER
                </h2>
                <p className="text-sm font-medium text-pink-200">
                  Find and book your perfect companion.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                  Meet charming, verified companions for upscale dining, cinema, shopping, corporate galas, and city exploration. Quick Google Sign-In with 100% escrow protection.
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Google OAuth Registration Only</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Browse Kolkata, Patna, Delhi, Bangalore & more</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Secure Razorpay Escrow Payments</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={handleUserClick}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 tracking-wide group-hover:scale-[1.02] transition-transform"
              >
                <span>Continue as User</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* OPTION 2: BECOME A PARTNER */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#181824] to-[#111119] border border-white/15 hover:border-purple-500/50 p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 hover:shadow-purple-500/15 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                  Option 2
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  BECOME A PARTNER
                </h2>
                <p className="text-sm font-medium text-purple-200">
                  Join DateMate and earn by providing companionship services.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                  Earn ₹1,200 to ₹3,500/hr in safe, public venues. 5-step registration with secure Aadhaar verification, flexible scheduling, and direct bank payouts.
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>5-Step Secure Application Workflow</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Encrypted Aadhaar Document Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>₹199 Verification Fee via Razorpay</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={handlePartnerClick}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 tracking-wide group-hover:scale-[1.02] transition-transform"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strictly Platonic & 18+ Mandatory</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-pink-400" />
            <span>Private & Encrypted Identity Checks</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Razorpay Payment Escrow</span>
          </span>
        </div>
      </div>
    </div>
  );
}

