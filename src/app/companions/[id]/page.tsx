"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Companion, Review } from "@/types";
import { getStoredCompanions, getStoredReviews } from "@/lib/store";
import { firestoreSubscribeCompanions } from "@/lib/firebase";
import { BookingModal } from "@/components/booking/BookingModal";
import {
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Languages,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  HelpCircle
} from "lucide-react";

export default function CompanionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companionId = params.id as string;

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const list = getStoredCompanions();
    const found = list.find((c) => c.id === companionId) || list[0];
    if (found) {
      setCompanion(found);
      const allReviews = getStoredReviews();
      const compReviews = allReviews.filter((r) => r.companionId === found.id);
      setReviews(compReviews.length > 0 ? compReviews : allReviews.slice(0, 2));
    }

    // Live Real-Time Firestore Sync with Admin Panel updates
    const unsub = firestoreSubscribeCompanions((firestoreList) => {
      if (firestoreList && firestoreList.length > 0) {
        const liveFound = firestoreList.find((c: any) => c.id === companionId);
        if (liveFound) {
          setCompanion(liveFound);
        }
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, [companionId]);

  if (!companion) {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-zinc-400">Loading companion profile...</p>
        </div>
      </div>
    );
  }

  const photos = companion.photos && companion.photos.length > 0
    ? companion.photos
    : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"];

  return (
    <div className="min-h-screen bg-[#09090D] py-8 sm:py-12 text-white">
      {/* Booking Modal */}
      <BookingModal
        companion={companion}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Companions</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? "bg-pink-500/20 border-pink-500 text-pink-400"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-pink-400" : ""}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `DateMate - ${companion.fullName}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Profile link copied to clipboard!");
                }
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Container */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                <Image
                  src={photos[activePhotoIndex]}
                  alt={companion.fullName}
                  fill
                  priority
                  className="object-cover"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Available Today</span>
                  </div>
                </div>

                {companion.verificationStatus === "approved" && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500/90 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 fill-white text-pink-600" />
                    <span>Government ID Verified</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {photos.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        activePhotoIndex === idx
                          ? "border-pink-500 scale-95"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Profile Info */}
            <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                    {companion.fullName}
                    <span className="text-lg font-medium text-zinc-400">
                      ({companion.age} yrs, {companion.gender})
                    </span>
                  </h1>
                  <p className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    <span>{companion.city}, India</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/5 border border-white/10">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{companion.rating.toFixed(2)}</span>
                  <span className="text-xs text-zinc-400">({companion.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Bio & Headline */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  About {companion.fullName.split(" ")[0]}
                </h3>
                <p className="text-base font-semibold text-pink-300 italic mb-2">
                  "{companion.headline}"
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {companion.bio}
                </p>
              </div>

              {/* Services Offered */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {companion.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Interests */}
              <div className="border-t border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-purple-400" />
                    <span>Languages Spoken</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {companion.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Interests & Passions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {companion.interests.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Client Reviews</h3>
                  <p className="text-xs text-zinc-400">Verified feedback from completed companionship bookings</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{companion.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                          {rev.authorName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">{rev.authorName}</span>
                          <span className="text-[10px] text-zinc-400 ml-2">Booked: {rev.activity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-zinc-500 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Report Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Notice an inappropriate profile or policy violation?</span>
              </div>
              <button
                onClick={() => {
                  setReported(true);
                  alert("Thank you. Our compliance & safety team has received your report.");
                }}
                disabled={reported}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-50 shrink-0"
              >
                {reported ? "Report Logged" : "Report Profile"}
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl bg-[#12121A] border border-white/15 p-6 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-1">
                  Booking Rates
                </span>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-white">
                    ₹{companion.hourlyPrice.toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-zinc-400"> / hour</span>
                  </div>
                  {companion.price30Min && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-pink-300">
                        ₹{companion.price30Min.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-zinc-400 block"> / 30 mins</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Available for booking in {companion.city}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instant confirmation via Razorpay</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Minimum booking: 1 hour</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escrow money-back guarantee</span>
                </div>
              </div>

              {/* Book CTA */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book {companion.fullName.split(" ")[0]} Now</span>
              </button>

              <Link
                href="/chat"
                className="w-full py-3 rounded-2xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-pink-400" />
                <span>Inquire / Chat with Companion</span>
              </Link>

              {/* Platform Code of Conduct Reminder */}
              <div className="p-3.5 rounded-2xl bg-pink-950/20 border border-pink-500/20 text-[11px] text-pink-200 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-pink-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Strictly Platonic</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Bookings must occur in licensed public venues. Adult services, physical intimacy requests, or harassment are forbidden by law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

