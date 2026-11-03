"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Companion, Booking } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { ACTIVITY_OPTIONS } from "@/lib/demo-data";
import { getStoredBookings, saveBookings } from "@/lib/store";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2
} from "lucide-react";

interface BookingModalProps {
  companion: Companion;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (booking: Booking) => void;
}

export function BookingModal({ companion, isOpen, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth();

  // Form states
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(3);
  const [activity, setActivity] = useState(ACTIVITY_OPTIONS[0].label);
  const [meetingLocation, setMeetingLocation] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Price calculations
  const hourlyRate = companion.hourlyPrice;
  const subtotal = hourlyRate * duration;
  const platformFee = Math.round(subtotal * 0.10);
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + platformFee + tax;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Please log in to complete your booking.");
      return;
    }

    if (!meetingLocation.trim()) {
      setErrorMessage("Please specify a verified public meeting location (e.g. restaurant or cafe).");
      return;
    }

    setIsProcessing(true);

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone || "+91 98000 00000",
      companionId: companion.id,
      companionName: companion.fullName,
      companionPhoto: companion.photos[0] || "",
      companionCity: companion.city,
      date,
      time,
      durationHours: duration,
      activity,
      meetingLocation,
      hourlyPrice: hourlyRate,
      subtotal,
      platformFee,
      tax,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      specialNotes,
      createdAt: new Date().toISOString(),
    };

    // Initiate Razorpay flow
    initiateRazorpayPayment({
      amount: totalAmount,
      bookingId: newBooking.id,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone || "+91 98000 00000",
      onSuccess: (paymentId) => {
        const finalizedBooking: Booking = {
          ...newBooking,
          paymentId,
          paymentStatus: "paid",
          status: "confirmed",
        };

        const existingBookings = getStoredBookings();
        saveBookings([finalizedBooking, ...existingBookings]);

        setIsProcessing(false);
        setBookingConfirmed(finalizedBooking);
        if (onSuccess) onSuccess(finalizedBooking);
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setErrorMessage(err || "Payment could not be completed.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingConfirmed ? (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
              <p className="text-sm text-zinc-300 mt-1">
                Your date with <strong className="text-pink-400">{companion.fullName}</strong> is successfully scheduled.
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                Booking ID: #{bookingConfirmed.id} • Razorpay ID: {bookingConfirmed.paymentId}
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 text-left border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Date & Time:</span>
                <span className="font-semibold text-white">{bookingConfirmed.date} at {bookingConfirmed.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Duration:</span>
                <span className="font-semibold text-white">{bookingConfirmed.durationHours} hours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Activity:</span>
                <span className="font-semibold text-white">{bookingConfirmed.activity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Meeting Location:</span>
                <span className="font-semibold text-white">{bookingConfirmed.meetingLocation}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-pink-300">
                <span>Total Paid:</span>
                <span>₹{bookingConfirmed.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 text-left flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                You can now message {companion.fullName} directly from your dashboard to coordinate your meetup specifics!
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href="/dashboard/user"
                className="flex-1 py-3 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Go to My Dashboard
              </a>
              <button
                onClick={onClose}
                className="px-5 py-3 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-pink-500/40">
                <Image
                  src={companion.photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={companion.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-pink-400 font-semibold">Reserve Companion</span>
                <h3 className="text-xl font-bold text-white">{companion.fullName}</h3>
                <p className="text-xs text-zinc-400">
                  {companion.city} • ₹{companion.hourlyPrice.toLocaleString("en-IN")}/hr
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="mt-6 space-y-5">
              {/* Activity Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Select Activity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACTIVITY_OPTIONS.map((act) => (
                    <button
                      type="button"
                      key={act.id}
                      onClick={() => setActivity(act.label)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        activity === act.label
                          ? "bg-pink-500/20 border-pink-500 text-white shadow-md shadow-pink-500/10"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-semibold block">{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Booking Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours (Recommended)</option>
                    <option value={4}>4 hours (Half Day)</option>
                    <option value={6}>6 hours</option>
                    <option value={8}>8 hours (Full Day)</option>
                  </select>
                </div>
              </div>

              {/* Meeting Location */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Public Meeting Location (Cafe / Restaurant / Mall)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-pink-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    placeholder="e.g. Starbucks, Bandra West or Social CyberHub"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  * For the safety of both parties, private apartments or hotel rooms are strictly forbidden.
                </p>
              </div>

              {/* Special notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Special Notes or Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Dress code preferences, movie selection, dietary preferences..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Companion Fee ({duration} hrs × ₹{hourlyRate.toLocaleString("en-IN")})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Platform & Safety Escrow (10%)</span>
                  <span>₹{platformFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>GST (5%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-pink-400">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment via Razorpay...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Razorpay / UPI • ₹{totalAmount.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Escrow Protected: Funds released only after date completion.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

