import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Lock,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  LifeBuoy
} from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#09090D] py-12 sm:py-20 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>DateMate Trust, Compliance & Safety Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Safety, Respect & <span className="gradient-text">Zero Tolerance</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            DateMate is dedicated to providing legitimate, platonic, and dignified social companionship in India. We enforce uncompromising safeguards to protect our companions and clients at every step.
          </p>
        </div>

        {/* Big Alert: Strict Platonic Mandate */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#181119] to-purple-950/40 border-2 border-rose-500/40 p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Strict Prohibition of Escort & Sexual Services
              </h2>
              <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                Non-Negotiable Legal Mandate
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            DateMate strictly disallows adult entertainment, prostitution, escort services, commercial sex work, and soliciting physical sexual relations under Section 370 of the Indian Penal Code and the Immoral Traffic (Prevention) Act. Any user or companion attempting to negotiate, offer, or request sexual favors will face immediate, permanent account termination, forfeiture of escrow payments, and immediate reporting to law enforcement authorities.
          </p>
        </div>

        {/* 6 Core Pillars of Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#12121A] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Strict 18+ & Mandatory ID Check</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every companion must submit government-issued photo identification (Aadhaar, Passport, or Voter ID) verified by our compliance team before their profile goes live. Minors are strictly prohibited.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#12121A] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Public-Only Venues Policy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All dates must occur in well-lit, public commercial establishments: cafes, restaurants, movie theaters, shopping malls, or cultural events. Private hotel rooms or residential flats are strictly forbidden.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#12121A] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Escrow Payment Security</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All transactions are processed through Razorpay. Funds remain safely in escrow during the date and are only released once the meetup is successfully completed without dispute.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#12121A] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. 24/7 Safety Dispatch & SOS</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Both companion and user dashboards feature an instant SOS emergency reporting tool. Our trust & safety team monitors active bookings and intervenes immediately if issues arise.
            </p>
          </div>
        </div>

        {/* Permitted vs Prohibited Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#12121A] border border-emerald-500/20 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Permitted & Encouraged</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Fine dining dinners, cafe hopping, and foodie tours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Attending movies, plays, comedy gigs, and cultural exhibitions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Personal shopping companion & fashion styling consultation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Accompanying clients to corporate galas or family weddings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Friendly, respectful conversation and emotional companionship</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-[#12121A] border border-rose-500/20 space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Strictly Prohibited (Zero Tolerance)</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>Any sexual intimacy, adult services, or physical solicitation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>Visiting private homes, apartments, or hotel bedrooms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>Harassment, verbal abuse, stalking, or non-consensual contact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>Illegal substance consumption, gambling, or illicit activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>Demanding off-platform cash transfers or extortion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white">Have questions about our security guidelines?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/faq"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
            >
              Read Frequently Asked Questions
            </Link>
            <Link
              href="/dashboard/user"
              className="px-5 py-2.5 rounded-xl gradient-btn text-white font-bold"
            >
              Contact Support Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

