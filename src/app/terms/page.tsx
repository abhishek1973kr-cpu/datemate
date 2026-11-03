import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090D] py-12 sm:py-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white">Terms of Service & Code of Conduct</h1>
          <p className="text-xs text-zinc-400 mt-1">Last Updated: November 2026</p>
        </div>

        <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Nature of the Platform</h2>
            <p>
              DateMate operates exclusively as an online marketplace connecting consenting adults for platonic social companionship (such as dining, theater, shopping, cultural sightseeing, and formal event accompaniment). DateMate is not an employment agency, dating agency, or provider of adult entertainment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Absolute Prohibition of Sexual Services</h2>
            <p>
              Any form of prostitution, escorting, soliciting sexual favors, commercial sexual activity, or non-consensual physical contact is categorically prohibited. Any user or companion violating this term will have their account immediately terminated, will be permanently blacklisted, and will be reported to Indian law enforcement authorities under applicable provisions of the Immoral Traffic (Prevention) Act and the Indian Penal Code.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. 18+ Age Requirement & Verification</h2>
            <p>
              All users and companions must be at least 18 years of age. Providing false date of birth or fraudulent identification is a punishable offense. Companions undergo mandatory photo ID verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Public Location Requirement</h2>
            <p>
              All bookings, meetups, and activities must take place solely in publicly accessible commercial establishments (e.g., licensed restaurants, cafes, shopping centers, cinemas, public parks). Meeting in private residences, hotel rooms, or secluded locations is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Payments, Escrow & Cancellations</h2>
            <p>
              All transactions must be conducted through the platform's authorized payment gateway (Razorpay). Paying companions directly in cash off-platform voids all safety guarantees, dispute resolution, and insurance coverage. Cancellations made with at least 12 hours notice receive a 100% refund.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

