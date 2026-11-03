"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { SUPPORTED_LOCATIONS } from "@/types";
import {
  Heart,
  Sparkles,
  Users,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  MapPin,
  Compass,
  Star
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090D] text-white">
      {/* Hero Welcome Banner */}
      <section className="relative pt-10 sm:pt-16 pb-8 sm:pb-12 overflow-hidden text-center px-4">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[700px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* 18+ Mandatory Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 sm:mb-6 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
              India’s Verified Platonic Platform • 18+ Mandatory
            </span>
          </div>

          {/* Logo & Headline */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Date<span className="text-pink-400">Mate</span>
            </h1>
          </div>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed px-2">
            Connect safely for dinner dates, movies, shopping, events, and meaningful public companionship across India.
          </p>

          {/* Quick Location Pills Carousel (Mobile-friendly touch scroller) */}
          <div className="mt-6 max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">
              Available In Key Locations
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1 justify-start sm:justify-center">
              {SUPPORTED_LOCATIONS.map((loc) => (
                <Link
                  key={loc}
                  href={`/browse?city=${encodeURIComponent(loc)}`}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 text-xs text-zinc-300 hover:text-pink-300 font-medium whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 shrink-0"
                >
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span>{loc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THREE PRIMARY SECTIONS: OPTION 1, OPTION 2, & ABOUT US */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 space-y-8 sm:space-y-12">
        {/* OPTIONS 1 & 2: TWO PRIMARY GATEWAY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {/* OPTION 1: BECOME A USER */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#161622] to-[#101018] border border-white/15 hover:border-pink-500/50 p-6 sm:p-10 flex flex-col justify-between space-y-6 sm:space-y-8 shadow-2xl transition-all duration-300 hover:shadow-pink-500/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-pink-400">
                  Option 1
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  BECOME A USER
                </h2>
                <p className="text-sm sm:text-base font-semibold text-pink-200">
                  Find and book your perfect companion.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  Browse verified companions in your city for movies, dinner, shopping, and events. Book easily through secure Google sign-in with full safety protection.
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Authentication & secure profile screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>One-time ₹99 registration fee with 100% escrow protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Browse verified male & female companion profiles</span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4">
              <Link
                href={user && user.hasPaidRegistrationFee ? "/dashboard/user" : "/auth/login"}
                className="w-full min-h-[48px] py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 tracking-wide active:scale-95 transition-all"
              >
                <span>Continue as User</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* OPTION 2: BECOME A PARTNER */}
          <div className="group rounded-3xl bg-gradient-to-b from-[#181524] to-[#100e18] border border-white/15 hover:border-purple-500/50 p-6 sm:p-10 flex flex-col justify-between space-y-6 sm:space-y-8 shadow-2xl transition-all duration-300 hover:shadow-purple-500/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-purple-400">
                  Option 2
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  BECOME A PARTNER
                </h2>
                <p className="text-sm sm:text-base font-semibold text-purple-200">
                  Join DateMate and become a registered companion.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  Earn dignified income offering platonic social companionship for upscale social events, dining, and city outings on your own flexible schedule.
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Partner login & separate companion portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Google identity verification & secure login credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>₹199 one-time registration fee via Razorpay</span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4">
              <Link
                href={user && user.role === "partner" ? "/dashboard/partner" : "/partner/login"}
                className="w-full min-h-[48px] py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 tracking-wide active:scale-95 transition-all"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* OPTION 3: ABOUT US */}
        <section id="about" className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-12 space-y-6 sm:space-y-8 scroll-mt-24 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Option 3</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">About DateMate</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                India’s premier platform for safe, verified, and strictly platonic companionship.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-xs leading-relaxed text-zinc-300">
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>What is DateMate?</span>
              </h3>
              <p>
                DateMate was founded to provide a safe, respectful, and dignified solution for anyone looking for companionship. Whether you need a confident date for a wedding, a companion for dinner at a fine restaurant, a partner to explore city attractions, or someone to watch the latest movie premiere with, DateMate bridges that connection.
              </p>
              <p>
                Our platform operates across major Indian hubs including Kolkata, Patna, Delhi, Hyderabad, Bangalore, Maharashtra, and Jharkhand (Ranchi).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Platonic & 18+ Guarantee</span>
              </h3>
              <p>
                DateMate is strictly a social, event-based platonic companionship platform. All bookings must take place in public venues such as cafes, restaurants, movie theatres, malls, and public events.
              </p>
              <p>
                We maintain zero tolerance for non-platonic or unlawful activity. Every registered companion undergoes identity verification, and users are verified through Google OAuth and age confirmation.
              </p>
            </div>
          </div>

          {/* How It Works - 3 Step Flow */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4 sm:mb-6 text-center">
              How DateMate Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xs sm:text-sm">
                  1
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Select Your State & Companion</h4>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Choose your state to see verified companions available in your area. View photos, languages, and transparent pricing.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs sm:text-sm">
                  2
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Book Your Experience</h4>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Select your date, duration (30 mins or 1+ hours), and activity such as dinner, movies, shopping, or city tours.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs sm:text-sm">
                  3
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Meet in a Public Venue</h4>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Enjoy your companionship experience safely at your chosen public venue with complete peace of mind and support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
