"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Companion, Gender } from "@/types";
import { INDIAN_CITIES, ACTIVITY_OPTIONS } from "@/lib/demo-data";
import { getStoredCompanions, saveCompanions } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  ShieldCheck,
  Upload,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Clock,
  Languages,
  DollarSign,
  FileText,
  HeartHandshake,
  ArrowRight
} from "lucide-react";

export default function BecomeCompanionPage() {
  const { user, switchRole } = useAuth();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [age, setAge] = useState<number>(23);
  const [city, setCity] = useState<string>(INDIAN_CITIES[0]);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyPrice, setHourlyPrice] = useState<number>(1500);
  const [languages, setLanguages] = useState<string>("English, Hindi");
  const [interests, setInterests] = useState<string>("Cafes, Movies, Travel, Art");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Fine Dining & Cafes",
    "Cinema & Theater",
    "City Tour & Exploration"
  ]);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  );
  const [idType, setIdType] = useState("Aadhaar Card");
  const [idNumber, setIdNumber] = useState("");
  const [agreedToSafetyPolicy, setAgreedToSafetyPolicy] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdCompanionId, setCreatedCompanionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (age < 18) {
      setErrorMessage("Companions must be 18 years of age or older.");
      return;
    }

    if (!agreedToSafetyPolicy) {
      setErrorMessage("You must accept the strict platonic companionship & safety agreement.");
      return;
    }

    if (!idNumber.trim()) {
      setErrorMessage("Please enter a valid government identification number for background check.");
      return;
    }

    setIsSubmitting(true);

    const newCompanion: Companion = {
      id: `comp-${Date.now().toString().slice(-6)}`,
      userId: user?.id,
      fullName,
      gender,
      age: Number(age),
      city,
      headline,
      bio,
      price30Min: Math.round(Number(hourlyPrice) * 0.6),
      hourlyPrice: Number(hourlyPrice),
      rating: 5.0,
      reviewCount: 0,
      photos: [photoUrl],
      languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
      interests: interests.split(",").map((i) => i.trim()).filter(Boolean),
      services: selectedServices,
      verificationStatus: "pending", // ADMIN APPROVAL MANDATORY
      isAvailable: false,
      isActive: false,
      idProofType: idType,
      idProofNumber: idNumber,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    // Save to persistent companion list
    const existing = getStoredCompanions();
    saveCompanions([newCompanion, ...existing]);

    setCreatedCompanionId(newCompanion.id);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#09090D] py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Join India's Premier Companion Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Apply as a <span className="gradient-text">DateMate Companion</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            Earn ₹1,500 – ₹5,000/hr by accompanying clients to restaurants, cinema, social galas, and city tours in safe public venues.
          </p>
        </div>

        {isSubmitted ? (
          /* Submission success view */
          <div className="rounded-3xl bg-[#12121A] border border-white/15 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                Status: Pending Admin Approval
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Application Received!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your companion profile has been saved. To ensure platform safety, our compliance team reviews all IDs before making profiles publicly discoverable.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 text-left max-w-lg mx-auto space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Companion ID:</span>
                <span className="font-semibold text-white">{createdCompanionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Target City:</span>
                <span className="font-semibold text-white">{city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Hourly Rate:</span>
                <span className="font-semibold text-pink-400">₹{hourlyPrice}/hr</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">ID Verification:</span>
                <span className="font-semibold text-amber-300">{idType} submitted</span>
              </div>
            </div>

            {/* Post-Registration Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/companion"
                className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-btn text-white font-semibold text-xs text-center shadow-lg"
              >
                View Companion Dashboard
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 font-semibold text-xs text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-10 space-y-8 shadow-2xl"
          >
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-pink-400" />
                <span>1. Personal Information (18+ Mandatory)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Meera Kapoor"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="female">Female (Rent a Girlfriend)</option>
                    <option value="male">Male (Rent a Boyfriend)</option>
                    <option value="other">Other / Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Age (Must be 18+) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Primary City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Profile & Headline */}
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>2. Bio & Headline</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Profile Headline (Short Catchy Intro) *
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Architect, classical dancer & warm dinner conversationalist"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    About Me (Detailed Bio) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell prospective clients about your personality, favorite topics, what kind of activities you enjoy accompanying people to..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Languages Spoken (comma separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="English, Hindi, Marathi"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Interests & Hobbies (comma separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="Fine Dining, Museums, Indie Music, Tech"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Rates, Services & Photo */}
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-pink-400" />
                <span>3. Hourly Price & Services</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Hourly Booking Price (in INR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-400">₹</span>
                      <input
                        type="number"
                        min={500}
                        max={10000}
                        step={100}
                        required
                        value={hourlyPrice}
                        onChange={(e) => setHourlyPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <span className="text-[11px] text-zinc-400 mt-1 block">
                      Recommended: ₹1,200 to ₹2,500/hr for new companions.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Profile Photo URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Services You Are Willing to Offer (Select all that apply) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACTIVITY_OPTIONS.map((act) => {
                      const isSelected = selectedServices.includes(act.label);
                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => toggleService(act.label)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-pink-500/20 border-pink-500 text-white font-semibold"
                              : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span className="text-xs block">{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Mandatory ID Verification & Compliance */}
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>4. Mandatory Government ID Verification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Document Type *
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Indian Passport</option>
                    <option value="Voter ID">Voter ID Card</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Document / Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-1234"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Strict Disclaimer agreement */}
              <div className="mt-4 p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToSafetyPolicy}
                    onChange={(e) => setAgreedToSafetyPolicy(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-pink-500 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 leading-relaxed">
                    I solemnly certify that I am at least 18 years of age. I understand that DateMate is strictly a social, non-sexual, platonic companionship platform. I agree never to offer, solicit, or engage in any adult, escort, or sexual services, and to conduct all bookings in public venues only.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 tracking-wide disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Companion Application for Admin Review</span>
              </button>
              <p className="text-center text-[11px] text-zinc-400 mt-2">
                * Applications are reviewed within 24 hours. Admin approval is mandatory before public listing.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

