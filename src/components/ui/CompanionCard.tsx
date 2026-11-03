"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Companion } from "@/types";
import { Star, MapPin, CheckCircle2, Sparkles, Languages, Calendar } from "lucide-react";
import { BookingModal } from "@/components/booking/BookingModal";

interface CompanionCardProps {
  companion: Companion;
  onBookNow?: (companion: Companion) => void;
}

export function CompanionCard({ companion, onBookNow }: CompanionCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const primaryPhoto =
    companion.photos && companion.photos.length > 0
      ? companion.photos[0]
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const startingPrice = companion.price30Min
    ? `₹${companion.price30Min.toLocaleString("en-IN")}`
    : `₹${Math.round(companion.hourlyPrice * 0.6).toLocaleString("en-IN")}`;

  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow(companion);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <>
      <BookingModal
        companion={companion}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <div className="group rounded-2xl bg-[#13131C] border border-white/10 hover:border-pink-500/40 transition-all duration-300 overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:shadow-pink-500/10">
        {/* Photo Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
          <Image
            src={primaryPhoto}
            alt={companion.fullName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges Overlay */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-medium capitalize">{companion.gender}</span>
              <span className="text-zinc-400">•</span>
              <span>{companion.age} yrs</span>
            </div>

            {companion.verificationStatus === "approved" && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/80 backdrop-blur-md text-xs font-semibold text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 fill-white text-pink-600" />
                <span>Verified ID</span>
              </div>
            )}
          </div>

          {/* Multiple Photos indicator */}
          {companion.photos && companion.photos.length > 1 && (
            <div className="absolute top-12 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-zinc-300">
              📸 {companion.photos.length} Photos
            </div>
          )}

          {/* Gradient Bottom Fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#13131C] via-[#13131C]/60 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          <div>
            {/* Header Row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                  {companion.fullName}
                </h3>
                <p className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="font-medium text-zinc-300">{companion.city}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-white">{companion.rating.toFixed(1)}</span>
                <span className="text-[10px] text-zinc-400">({companion.reviewCount})</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
              {companion.headline || companion.bio}
            </p>

            {/* Languages */}
            {companion.languages && companion.languages.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-zinc-400">
                <Languages className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{companion.languages.slice(0, 3).join(", ")}</span>
              </div>
            )}

            {/* Services Tag Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {companion.services.slice(0, 2).map((srv, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 border border-white/10 text-zinc-300"
                >
                  {srv}
                </span>
              ))}
              {companion.services.length > 2 && (
                <span className="px-1.5 py-0.5 text-[11px] rounded-md bg-pink-500/10 text-pink-300 font-medium">
                  +{companion.services.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Double Action Buttons */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 tracking-wider block">Starting Price</span>
                <div className="text-base font-extrabold text-white">
                  {startingPrice}
                  <span className="text-[11px] font-normal text-zinc-400"> / 30m</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-zinc-400 tracking-wider block">Hourly</span>
                <div className="text-sm font-bold text-pink-300">
                  ₹{companion.hourlyPrice.toLocaleString("en-IN")}/hr
                </div>
              </div>
            </div>

            {/* View Profile & Book Now Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/companions/${companion.id}`}
                className="py-2 text-center text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/10 transition-all hover:text-white"
              >
                View Profile
              </Link>
              <button
                type="button"
                onClick={handleBookClick}
                className="py-2 text-center text-xs font-bold text-white rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all shadow-md shadow-pink-500/20"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
