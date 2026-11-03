"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Booking, Companion, Review } from "@/types";
import { getStoredBookings, saveBookings, getStoredCompanions, saveCompanions, getStoredReviews } from "@/lib/store";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Star,
  ShieldCheck,
  Power,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Send
} from "lucide-react";

export default function CompanionDashboardPage() {
  const { user } = useAuth();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);

  useEffect(() => {
    const companions = getStoredCompanions();
    // Match with current companion or default to first companion
    const current = companions.find((c) => c.fullName.includes("Aanya") || c.userId === user?.id) || companions[0];
    if (current) {
      setCompanion(current);
      setIsAvailable(current.isAvailable);

      const allBookings = getStoredBookings();
      const myBookings = allBookings.filter((b) => b.companionId === current.id || b.companionName === current.fullName);
      setBookings(myBookings.length > 0 ? myBookings : allBookings);

      const allReviews = getStoredReviews();
      const myReviews = allReviews.filter((r) => r.companionId === current.id);
      setReviews(myReviews.length > 0 ? myReviews : allReviews.slice(0, 2));
    }
  }, [user]);

  const handleToggleAvailability = () => {
    if (!companion) return;
    const updatedStatus = !isAvailable;
    setIsAvailable(updatedStatus);

    const all = getStoredCompanions();
    const updated = all.map((c) => (c.id === companion.id ? { ...c, isAvailable: updatedStatus } : c));
    saveCompanions(updated);
  };

  const handleAcceptBooking = (id: string) => {
    const all = getStoredBookings();
    const updated = all.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b));
    setBookings(updated.filter((b) => b.companionId === companion?.id || b.companionName === companion?.fullName));
    saveBookings(updated);
  };

  const handleRejectBooking = (id: string) => {
    const all = getStoredBookings();
    const updated = all.map((b) => (b.id === id ? { ...b, status: "rejected" as const } : b));
    setBookings(updated.filter((b) => b.companionId === companion?.id || b.companionName === companion?.fullName));
    saveBookings(updated);
  };

  if (!companion) {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-white">
        <p className="text-sm text-zinc-400">Loading companion dashboard...</p>
      </div>
    );
  }

  // Calculate earnings
  const completedOrConfirmed = bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const grossEarnings = completedOrConfirmed.reduce((sum, b) => sum + b.subtotal, 0);
  const platformCommission = Math.round(grossEarnings * 0.15); // 15% platform take
  const netEarnings = grossEarnings - platformCommission;

  return (
    <div className="min-h-screen bg-[#09090D] py-8 sm:py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Summary */}
        <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-pink-500/40">
              <Image src={companion.photos[0]} alt={companion.fullName} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{companion.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Approved Companion</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {companion.city} • ₹{companion.hourlyPrice}/hr • {companion.gender === "female" ? "Girlfriend Listing" : "Boyfriend Listing"}
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                isAvailable
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>Status: {isAvailable ? "Accepting Bookings" : "Paused / Offline"}</span>
            </button>
            <Link
              href={`/companions/${companion.id}`}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white"
            >
              View Public Page
            </Link>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Net Earnings
            </span>
            <div className="text-2xl font-extrabold text-white flex items-center justify-between">
              <span>₹{netEarnings.toLocaleString("en-IN")}</span>
              <DollarSign className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-[11px] text-zinc-500 block">Gross: ₹{grossEarnings.toLocaleString("en-IN")}</span>
          </div>

          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Total Bookings
            </span>
            <div className="text-2xl font-extrabold text-white flex items-center justify-between">
              <span>{bookings.length}</span>
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[11px] text-zinc-500 block">Confirmed: {completedOrConfirmed.length}</span>
          </div>

          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Client Rating
            </span>
            <div className="text-2xl font-extrabold text-white flex items-center justify-between">
              <span>{companion.rating.toFixed(2)} ★</span>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-[11px] text-zinc-500 block">{companion.reviewCount} verified reviews</span>
          </div>

          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Payout Balance
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 flex items-center justify-between">
              <span>₹{netEarnings.toLocaleString("en-IN")}</span>
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <button
              onClick={() => {
                setWithdrawalRequested(true);
                alert("Withdrawal request of ₹" + netEarnings + " initiated to your linked bank account via IMPS/NEFT.");
              }}
              disabled={withdrawalRequested || netEarnings <= 0}
              className="text-[11px] font-bold text-pink-400 hover:text-pink-300 disabled:opacity-50"
            >
              {withdrawalRequested ? "Payout Processing" : "Request Instant Withdrawal →"}
            </button>
          </div>
        </div>

        {/* Incoming Booking Requests */}
        <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Incoming & Active Booking Requests</h2>
              <p className="text-xs text-zinc-400">Manage client companionship requests, schedule dates, and accept/reject.</p>
            </div>
            <span className="text-xs text-pink-400 font-semibold">{bookings.length} Requests Total</span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">No incoming booking requests right now.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Client: {booking.clientName} ({booking.clientPhone})
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{booking.activity}</h4>
                      <p className="text-xs text-zinc-300">
                        Date: <strong>{booking.date}</strong> at <strong>{booking.time}</strong> ({booking.durationHours} hours)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-pink-400 block">
                        ₹{booking.subtotal.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          booking.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : booking.status === "pending"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 text-xs text-zinc-300 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>Public Venue: <strong>{booking.meetingLocation}</strong></span>
                  </div>

                  {booking.specialNotes && (
                    <p className="text-xs text-zinc-400 italic">
                      Client Notes: "{booking.specialNotes}"
                    </p>
                  )}

                  {/* Accept or Reject Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <Link
                      href="/chat"
                      className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Client</span>
                    </Link>

                    {booking.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                        >
                          Accept Booking
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-600/30 text-rose-400 text-xs font-semibold transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

