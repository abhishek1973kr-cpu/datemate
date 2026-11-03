"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { PartnerApplication, Booking, Companion } from "@/types";
import {
  getStoredPartnerApplications,
  savePartnerApplications,
  getStoredBookings,
  getStoredCompanions,
  saveCompanions
} from "@/lib/store";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Power,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  Edit3,
  Sparkles,
  MessageSquare
} from "lucide-react";

export default function PartnerDashboardPage() {
  const { user } = useAuth();
  const [partnerApp, setPartnerApp] = useState<PartnerApplication | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "earnings" | "photos">("overview");

  useEffect(() => {
    const apps = getStoredPartnerApplications();
    const storedPartnerId = typeof window !== "undefined" ? localStorage.getItem("datemate_active_partner_id") : null;

    // Match with current partner or default to first partner
    const current =
      apps.find((a) => a.id === storedPartnerId) ||
      apps.find((a) => a.email === user?.email || a.fullLegalName === user?.name) ||
      apps[0];

    if (current) {
      setPartnerApp(current);
      setIsAvailable(current.isAvailable ?? true);

      const allBookings = getStoredBookings();
      const myBookings = allBookings.filter(
        (b) => b.companionName === current.fullLegalName || b.companionId === current.companionId
      );
      setBookings(myBookings.length > 0 ? myBookings : allBookings.slice(0, 2));
    }
  }, [user]);

  const handleToggleAvailability = () => {
    if (!partnerApp) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    const apps = getStoredPartnerApplications();
    const updatedApps = apps.map((a) => (a.id === partnerApp.id ? { ...a, isAvailable: newStatus } : a));
    savePartnerApplications(updatedApps);

    if (partnerApp.companionId) {
      const comps = getStoredCompanions();
      const updatedComps = comps.map((c) =>
        c.id === partnerApp.companionId ? { ...c, isAvailable: newStatus } : c
      );
      saveCompanions(updatedComps);
    }
  };

  if (!partnerApp) {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-white p-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-zinc-400 text-sm">No active partner application found.</p>
          <Link
            href="/partner/register"
            className="inline-block px-5 py-2.5 rounded-xl gradient-btn text-white font-bold text-xs"
          >
            Register as a Partner Now
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = partnerApp.status === "approved";
  const isPending = partnerApp.status === "pending";
  const isRejected = partnerApp.status === "rejected";

  return (
    <div className="min-h-screen bg-[#09090D] py-8 sm:py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Partner Header Card */}
        <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-purple-500/40">
              <Image
                src={partnerApp.photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                alt={partnerApp.fullLegalName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{partnerApp.fullLegalName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  Registered Partner
                </span>
                {isApproved && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved & Public</span>
                  </span>
                )}
                {isPending && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Verification</span>
                  </span>
                )}
                {isRejected && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    Application Rejected
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {partnerApp.city}, {partnerApp.state} • ₹{partnerApp.hourlyPrice || 1500}/hr • Registration Fee:{" "}
                <strong className="text-emerald-400">₹199 Paid (Verified)</strong>
              </p>
            </div>
          </div>

          {/* Quick Availability & Link */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                isAvailable
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>Status: {isAvailable ? "Available" : "Offline"}</span>
            </button>

            {isApproved && partnerApp.companionId && (
              <Link
                href={`/companions/${partnerApp.companionId}`}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold"
              >
                View Public Profile
              </Link>
            )}
          </div>
        </div>

        {/* Verification Status Alert Banner */}
        {isPending && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
              <Clock className="w-4 h-4" />
              <span>Application Under Review</span>
            </div>
            <p className="text-zinc-300">
              Your ₹199 verification fee has been confirmed. Our trust & compliance team is currently verifying your Aadhaar credentials. You will be notified once your profile becomes publicly visible to clients.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
              <AlertCircle className="w-4 h-4" />
              <span>Application Requires Revision</span>
            </div>
            <p className="text-zinc-300">
              Reason: <strong>{partnerApp.rejectionReason || "Documentation did not meet verification criteria."}</strong> Please contact support to re-submit updated documents.
            </p>
          </div>
        )}

        {/* KPI Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Total Bookings</span>
            <div className="text-2xl font-black text-white">{bookings.length}</div>
            <span className="text-[10px] text-zinc-500">Reserved appointments</span>
          </div>

          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Net Earnings</span>
            <div className="text-2xl font-black text-emerald-400">
              ₹{(bookings.length * (partnerApp.hourlyPrice || 1500) * 0.85).toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-zinc-500">Direct bank payout ready</span>
          </div>

          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Hourly Rate</span>
            <div className="text-2xl font-black text-pink-400">₹{partnerApp.hourlyPrice || 1500}/hr</div>
            <span className="text-[10px] text-zinc-500">30m: ₹{partnerApp.price30Min || 900}</span>
          </div>

          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Identity Status</span>
            <div className="text-lg font-bold text-white flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{partnerApp.maskedAadhaar}</span>
            </div>
            <span className="text-[10px] text-zinc-500">Aadhaar Verified</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Profile & Documents
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "bookings" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "photos" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Uploaded Photographs ({partnerApp.photos.length})
          </button>
        </div>

        {/* Tab 1: Profile & Documents */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Registration Details
              </h3>
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Account Type:</span>
                  <span className="font-bold text-pink-300">Registered Partner</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Full Legal Name:</span>
                  <span className="font-semibold text-white">{partnerApp.fullLegalName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Gender & DOB:</span>
                  <span>{partnerApp.gender}, {partnerApp.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Mobile & Email:</span>
                  <span>{partnerApp.mobile} • {partnerApp.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Residential Address:</span>
                  <span className="text-right max-w-xs">{partnerApp.residentialAddress}, {partnerApp.pincode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Enrollment Fee (₹199):</span>
                  <span className="text-emerald-400 font-bold">PAID (Verified)</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Identity & Compliance
              </h3>
              <div className="space-y-3 text-xs text-zinc-300">
                <div>
                  <span className="text-zinc-400 block mb-1">Aadhaar Number (Masked):</span>
                  <span className="font-mono text-sm font-bold text-pink-300">{partnerApp.maskedAadhaar}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Aadhaar Document Status:</span>
                  <span className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-emerald-400 font-semibold">
                    Encrypted on File (Verified by Compliance Desk)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 pt-2 leading-relaxed">
                  Your identity documents are stored under AES-256 encryption. In accordance with Indian DPDP Act regulations, documents are only accessible to authorized internal administrators.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === "bookings" && (
          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Client Booking Requests</h3>
            {bookings.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No incoming bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">{b.activity} with {b.clientName}</span>
                      <span className="text-xs text-zinc-400">{b.date} at {b.time} ({b.durationHours} hrs) • Venue: {b.meetingLocation}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-pink-400 block text-sm">₹{b.totalAmount.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Photos */}
        {activeTab === "photos" && (
          <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Uploaded Profile Photographs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {partnerApp.photos.map((url, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/20">
                  <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    Photo {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

