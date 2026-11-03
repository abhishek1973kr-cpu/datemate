import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, PhoneCall, AlertTriangle } from "lucide-react";
import { INDIAN_CITIES } from "@/lib/demo-data";

export function Footer() {
  return (
    <footer className="bg-[#07070A] border-t border-white/10 text-zinc-400 text-sm">
      {/* Platform Safety Mandate Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-white/5">
        <div className="rounded-2xl bg-gradient-to-r from-pink-950/30 via-purple-950/30 to-zinc-900/60 p-6 border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base flex items-center gap-2">
                Strict Platonic Policy & 18+ Mandatory Verification
                <span className="px-2 py-0.5 text-xs bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">
                  Zero Tolerance
                </span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                DateMate is strictly a social companionship and event plus-one platform in India. We categorically prohibit escort services, commercial sex work, prostitution, and illegal activities. All encounters must be public and mutually consensual. Violators are banned and reported to police authorities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/safety"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Read Safety Protocol
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Date<span className="text-pink-400">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              India’s first verified platonic companionship marketplace. Rent a girlfriend or rent a boyfriend for memorable dinners, movie dates, shopping, corporate galas, and city adventures.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 24/7 Safety Dispatch
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span> Razorpay Secured
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/browse" className="hover:text-pink-400 transition-colors">
                  Browse Companions
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-pink-400 transition-colors">
                  How DateMate Works
                </Link>
              </li>
              <li>
                <Link href="/partner/register" className="hover:text-pink-400 transition-colors">
                  Become a Partner (Companion)
                </Link>
              </li>
              <li>
                <Link href="/browse?gender=female" className="hover:text-pink-400 transition-colors">
                  Rent a Girlfriend
                </Link>
              </li>
              <li>
                <Link href="/browse?gender=male" className="hover:text-pink-400 transition-colors">
                  Rent a Boyfriend
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Cities */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Top Cities</h5>
            <ul className="space-y-2 text-xs">
              {INDIAN_CITIES.slice(0, 5).map((city) => (
                <li key={city}>
                  <Link href={`/browse?city=${encodeURIComponent(city)}`} className="hover:text-pink-400 transition-colors">
                    Companions in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Trust & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/safety" className="hover:text-pink-400 transition-colors">
                  Safety & Anti-Harassment
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-pink-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-pink-400 transition-colors">
                  Privacy Policy & DPDP Act
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} DateMate Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-zinc-400">
            Crafted with modern technology for safe, dignified social connections across India.
          </p>
        </div>
      </div>
    </footer>
  );
}

