import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy & DPDP Compliance</h1>
          <p className="text-xs text-zinc-400 mt-1">
            In compliance with the Digital Personal Data Protection (DPDP) Act of India
          </p>
        </div>

        <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>
              We collect user registration details (legal name, verified email, mobile phone number, date of birth) and companion verification documents (government-issued photo IDs). All sensitive ID data is encrypted at rest using AES-256 encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Privacy of Personal Contact Details</h2>
            <p>
              DateMate protects your personal contact numbers and private social media handles. Client telephone numbers are never published publicly. All pre-booking communication occurs through our secured, monitored messaging system.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Payment Information</h2>
            <p>
              All card details, UPI IDs, and bank transactions are processed directly by RBI-licensed payment aggregators (Razorpay). DateMate does not store raw credit/debit card numbers or CVVs on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. User Rights & Data Deletion</h2>
            <p>
              Under the DPDP Act, users may request access, rectification, or complete deletion of their account profile and identification data by submitting a request through the User Dashboard or emailing privacy@datemate.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

