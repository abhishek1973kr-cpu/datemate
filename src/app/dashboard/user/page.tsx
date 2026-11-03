"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Booking, Companion, SafetyReport, SERVICE_STATES_CONFIG, ServiceState } from "@/types";
import {
  getStoredBookings,
  saveBookings,
  getStoredCompanions,
  getStoredReports,
  saveReports
} from "@/lib/store";
import { CompanionCard } from "@/components/ui/CompanionCard";
import { BookingModal } from "@/components/booking/BookingModal";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  User,
  Heart,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Search,
  Sparkles,
  Phone,
  Send,
  Info,
  Building,
  Briefcase
} from "lucide-react";

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"companions" | "bookings" | "settings" | "about" | "support">("companions");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [companions, setCompanions] = useState<Companion[]>([]);

  // Companion Search & State Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStateId, setSelectedStateId] = useState<string>("all_available");
  const [selectedCompanionForBooking, setSelectedCompanionForBooking] = useState<Companion | null>(null);

  // Account Settings Form
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [phoneInput, setPhoneInput] = useState(user?.phone || "");
  const [cityInput, setCityInput] = useState(user?.city || "");
  const [stateInput, setStateInput] = useState(user?.state || "");
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Help & Support Ticket Form
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDetails, setTicketDetails] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    // Only approved and active companions appear publicly
    const allComps = getStoredCompanions().filter(
      (c) => c.verificationStatus === "approved" && c.isActive !== false
    );
    setCompanions(allComps);

    const allBookings = getStoredBookings();
    setBookings(allBookings);
  }, []);

  useEffect(() => {
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone || "");
      setCityInput(user.city || "");
      setStateInput(user.state || "");
    }
  }, [user]);

  // Determine current selected state config
  const currentStateConfig = useMemo(() => {
    if (selectedStateId === "all_available") return null;
    return SERVICE_STATES_CONFIG.find((s) => s.id === selectedStateId);
  }, [selectedStateId]);

  const isLocationAvailable = selectedStateId === "all_available" || (currentStateConfig ? currentStateConfig.isAvailable : false);

  // Filter companions
  const filteredCompanions = useMemo(() => {
    if (!isLocationAvailable) return [];

    return companions.filter((c) => {
      // State location filter
      if (selectedStateId !== "all_available" && currentStateConfig) {
        const compCity = c.city.toLowerCase();
        const filterKey = currentStateConfig.cityFilter.toLowerCase();
        const matchesLocation =
          compCity.includes(filterKey) ||
          filterKey.includes(compCity) ||
          (filterKey.includes("ranchi") && (compCity.includes("jharkhand") || compCity.includes("ranchi"))) ||
          (filterKey.includes("maharashtra") && (compCity.includes("mumbai") || compCity.includes("pune") || compCity.includes("maharashtra"))) ||
          (filterKey.includes("delhi") && (compCity.includes("delhi") || compCity.includes("ncr")));

        if (!matchesLocation) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = c.fullName.toLowerCase().includes(q);
        const matchBio = c.bio.toLowerCase().includes(q) || (c.headline && c.headline.toLowerCase().includes(q));
        const matchCity = c.city.toLowerCase().includes(q);
        const matchInterests = c.interests?.some((i) => i.toLowerCase().includes(q));
        const matchServices = c.services?.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchBio && !matchCity && !matchInterests && !matchServices) return false;
      }

      return true;
    });
  }, [companions, selectedStateId, currentStateConfig, isLocationAvailable, searchTerm]);

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking? A refund will be initiated to your original payment method.")) {
      const updated = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const, paymentStatus: "refunded" as const } : b
      );
      setBookings(updated);
      saveBookings(updated);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = {
        ...user,
        name: nameInput,
        phone: phoneInput,
        city: cityInput,
        state: stateInput
      };
      localStorage.setItem("datemate_current_user_v2", JSON.stringify(updatedUser));
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }
  };

  // Handle Support Ticket Submit
  const handleSupportTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDetails.trim()) return;

    const newReport: SafetyReport = {
      id: `ticket-${Date.now().toString().slice(-6)}`,
      reporterId: user?.id || "guest",
      reporterName: user?.name || "Client",
      reportedId: "general",
      reportedName: "Customer Support Desk",
      reason: ticketSubject,
      description: ticketDetails,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const existingReports = getStoredReports();
    saveReports([newReport, ...existingReports]);

    setTicketSuccess(true);
    setTicketSubject("");
    setTicketDetails("");
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  // Route protection
  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#12121A] border border-white/10 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please sign in to access your User Dashboard and manage bookings.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full py-3 rounded-xl font-bold text-xs text-white gradient-btn shadow-lg"
          >
            Sign In as User
          </Link>
        </div>
      </div>
    );
  }

  if (user.role === "partner") {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#12121A] border border-white/10 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Partner Account Detected</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You are currently signed in as a Partner. The User Panel is reserved for clients booking companionship.
          </p>
          <Link
            href="/dashboard/partner"
            className="inline-block w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
          >
            Go to Partner Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!user.hasPaidRegistrationFee) {
    return (
      <div className="min-h-screen bg-[#09090D] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full rounded-3xl bg-[#12121A] border border-white/10 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">One-Time Registration Fee Pending</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please complete the one-time ₹99 user registration fee to activate companion discovery and booking.
          </p>
          <Link
            href="/auth/user-register?step=payment"
            className="inline-block w-full py-3 rounded-xl font-bold text-xs text-white gradient-btn shadow-lg"
          >
            Pay ₹99 & Activate Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090D] py-8 sm:py-12 text-white">
      {/* Booking Modal */}
      {selectedCompanionForBooking && (
        <BookingModal
          companion={selectedCompanionForBooking}
          isOpen={true}
          onClose={() => setSelectedCompanionForBooking(null)}
          onSuccess={(newBooking) => {
            setBookings([newBooking, ...bookings]);
            setSelectedCompanionForBooking(null);
            setActiveTab("bookings");
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. WELCOME HEADER (No IDs displayed) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#14141E] via-[#101018] to-[#14141E] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-pink-500/25">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {user?.name || "Karan Singhal"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>18+ Verified</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Find and book safe, verified companionship for dinners, movies, events, and shopping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("companions")}
              className="px-4 py-2.5 text-xs font-bold rounded-xl gradient-btn text-white shadow-md shadow-pink-500/20"
            >
              Browse Companions
            </button>
            <Link
              href="/chat"
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              <span>Messages</span>
            </Link>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab("companions")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "companions"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Search className="w-4 h-4 text-pink-400" />
            <span>Find Companions</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "bookings"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Booking History</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px]">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "settings"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Account Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "about"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Info className="w-4 h-4 text-pink-400" />
            <span>About Us</span>
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "support"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}
        <div>
          {/* TAB 1: FIND COMPANIONS */}
          {activeTab === "companions" && (
            <div className="space-y-8">
              {/* SEARCH & STATE SELECTION DROPDOWN */}
              <div className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Search Input */}
                  <div className="md:col-span-7 relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search companions by name, interests, or activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>

                  {/* Simple State Dropdown with Arrow */}
                  <div className="md:col-span-5 relative">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 ml-1">
                      SELECT YOUR STATE
                    </label>
                    <div className="relative">
                      <select
                        value={selectedStateId}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-2xl bg-[#1A1A26] border border-white/15 text-xs font-semibold text-white focus:outline-none focus:border-pink-500 pr-10 cursor-pointer shadow-inner"
                      >
                        <option value="all_available">
                          All Available Locations (India)
                        </option>
                        <optgroup label="── Currently Available States ──">
                          {SERVICE_STATES_CONFIG.filter((s) => s.isAvailable).map((state) => (
                            <option key={state.id} value={state.id}>
                              ✓ {state.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="── Other States (Coming Soon) ──">
                          {SERVICE_STATES_CONFIG.filter((s) => !s.isAvailable).map((state) => (
                            <option key={state.id} value={state.id}>
                              ✕ {state.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown className="w-4 h-4 text-pink-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* State Availability Notice Banner */}
                {currentStateConfig && (
                  <div className="pt-2">
                    {currentStateConfig.isAvailable ? (
                      <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Service Active in <strong>{currentStateConfig.name}</strong></span>
                        </span>
                        <span className="text-[11px] text-zinc-400 hidden sm:inline">
                          Showing approved & verified companions
                        </span>
                      </div>
                    ) : (
                      <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/30 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1">
                          <Building className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-amber-200">
                          Sorry! Our Service Is Currently Not Available in Your Location.
                        </h4>
                        <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                          DateMate has not launched in <strong>{currentStateConfig.name}</strong> yet. We are actively expanding! Currently, our service is available in:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                          {SERVICE_STATES_CONFIG.filter((s) => s.isAvailable).map((avail) => (
                            <button
                              key={avail.id}
                              onClick={() => setSelectedStateId(avail.id)}
                              className="px-3 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 hover:border-pink-500/50 text-pink-300 transition-colors"
                            >
                              {avail.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COMPANION CARDS GRID */}
              {isLocationAvailable && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Available Companions</span>
                      <span className="text-xs font-normal text-zinc-400">
                        ({filteredCompanions.length} verified profile{filteredCompanions.length === 1 ? "" : "s"})
                      </span>
                    </h3>
                  </div>

                  {filteredCompanions.length === 0 ? (
                    <div className="rounded-3xl bg-[#12121A] border border-white/10 p-12 text-center space-y-3">
                      <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
                      <h4 className="text-base font-bold text-white">No companions found</h4>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        No companions match your current search query in this state. Try clearing filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedStateId("all_available");
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold gradient-btn text-white"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCompanions.map((comp) => (
                        <CompanionCard
                          key={comp.id}
                          companion={comp}
                          onBookNow={(companion) => setSelectedCompanionForBooking(companion)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOKING HISTORY */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">My Booking History</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    View and manage all your scheduled companionship appointments.
                  </p>
                </div>
                <span className="text-xs text-zinc-400">
                  Total Bookings: {bookings.length}
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="rounded-3xl bg-[#12121A] border border-white/10 p-12 text-center space-y-3">
                  <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No bookings yet</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Explore available companions in your city for dinners, movies, or events!
                  </p>
                  <button
                    onClick={() => setActiveTab("companions")}
                    className="mt-2 px-5 py-2.5 text-xs font-bold rounded-xl gradient-btn text-white"
                  >
                    Find a Companion
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-4 hover:border-pink-500/30 transition-all shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                            <Image
                              src={
                                booking.companionPhoto ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={booking.companionName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                              Booking #{index + 1}
                            </span>
                            <h3 className="text-base font-bold text-white">{booking.companionName}</h3>
                            <span className="text-xs text-pink-400 font-medium">{booking.activity}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              booking.status === "confirmed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : booking.status === "pending"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-zinc-400 block text-[10px] uppercase">Date & Time</span>
                          <span className="font-semibold text-white">
                            {booking.date} at {booking.time}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-zinc-400 block text-[10px] uppercase">Duration</span>
                          <span className="font-semibold text-white">{booking.durationHours} Hours</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-zinc-400 block text-[10px] uppercase">Total Paid</span>
                          <span className="font-bold text-pink-400">
                            ₹{booking.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                          <span className="text-zinc-400 block text-[10px] uppercase">Payment Status</span>
                          <span className="font-semibold capitalize text-emerald-300">
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-xs text-zinc-300 bg-white/5 p-3 rounded-xl">
                        <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                        <span>Public Venue: <strong>{booking.meetingLocation}</strong></span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <Link
                          href="/chat"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat with {booking.companionName.split(" ")[0]}</span>
                        </Link>

                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-xl mx-auto rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Basic Account Settings</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage your personal contact details and location preference.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address (Verified via Google)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "karan.singhal@example.com"}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/5 text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="e.g. Kolkata, Mumbai..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateInput}
                      onChange={(e) => setStateInput(e.target.value)}
                      placeholder="e.g. Maharashtra..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Phone Number (+91)
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white gradient-btn shadow-md shadow-pink-500/20"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: ABOUT US */}
          {activeTab === "about" && (
            <div className="max-w-3xl mx-auto rounded-3xl bg-[#12121A] border border-white/10 p-8 sm:p-10 space-y-6 shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400">
                  Platform Overview
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">About DateMate</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  India’s trusted marketplace for verified, platonic companionship.
                </p>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <p>
                  DateMate is designed to eliminate loneliness and provide confident, verified companions for social outings, dining experiences, movies, weddings, and events across India.
                </p>
                <p>
                  We operate with a strict platonic code of conduct. All companion meetings take place exclusively in public venues, and all bookings are secured through transparent Razorpay payments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white">Strict 18+ Verification</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    All users authenticate through Google OAuth with mandatory age confirmation. All companions complete government ID background verification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-white">Transparent Pricing</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Clear starting rates for 30 minutes and hourly bookings with safe, verified payment processing and instant receipts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === "support" && (
            <div className="max-w-2xl mx-auto rounded-3xl bg-[#12121A] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Help & Safety Support Desk</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  We are here to assist you 24/7. Submit any inquiry or safety concern below.
                </p>
              </div>

              {ticketSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Support request submitted! Our safety team will review it shortly.</span>
                </div>
              )}

              <form onSubmit={handleSupportTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Subject / Concern
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about booking, venue advice, or safety report"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Detailed Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your question or issue in detail..."
                    value={ticketDetails}
                    onChange={(e) => setTicketDetails(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white gradient-btn flex items-center justify-center gap-2 shadow-md shadow-pink-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Support Request</span>
                </button>
              </form>

              <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/20 text-xs text-pink-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-pink-400" />
                  <span>24/7 Safety Dispatch & Escrow Help</span>
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  For immediate assistance during a date, call our safety hotline or notify security at your public venue.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
