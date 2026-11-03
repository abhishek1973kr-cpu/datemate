"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Companion, SUPPORTED_LOCATIONS } from "@/types";
import { getStoredCompanions } from "@/lib/store";
import { firestoreSubscribeCompanions, firestoreSubscribeLocations } from "@/lib/firebase";
import { ACTIVITY_OPTIONS } from "@/lib/demo-data";
import { CompanionCard } from "@/components/ui/CompanionCard";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Building,
  BellRing
} from "lucide-react";

function isSupportedLocation(city: string) {
  if (city === "all" || city === "All Cities") return true;
  const c = city.toLowerCase();
  return (
    c.includes("kolkata") ||
    c.includes("patna") ||
    c.includes("delhi") ||
    c.includes("hyderabad") ||
    c.includes("bangalore") ||
    c.includes("bengaluru") ||
    c.includes("maharashtra") ||
    c.includes("mumbai") ||
    c.includes("pune") ||
    c.includes("jharkhand") ||
    c.includes("ranchi")
  );
}

function matchesLocationFilter(compCity: string, filterCity: string) {
  if (filterCity === "all" || filterCity === "All Cities") return true;
  const c = compCity.toLowerCase().trim();
  const f = filterCity.toLowerCase().trim();
  if (c === f) return true;
  if (f === "delhi" && (c.includes("delhi") || c.includes("ncr"))) return true;
  if (f === "bangalore" && (c.includes("bangalore") || c.includes("bengaluru"))) return true;
  if (f === "maharashtra" && (c.includes("maharashtra") || c.includes("mumbai") || c.includes("pune"))) return true;
  if (f.includes("jharkhand") && (c.includes("jharkhand") || c.includes("ranchi"))) return true;
  if (f === "patna" && c.includes("patna")) return true;
  if (f === "kolkata" && c.includes("kolkata")) return true;
  if (f === "hyderabad" && c.includes("hyderabad")) return true;
  return false;
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "all";
  const initialGender = searchParams.get("gender") || "all";

  const [companions, setCompanions] = useState<Companion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [disabledLocations, setDisabledLocations] = useState<string[]>([]);

  useEffect(() => {
    // Only approved and active profiles should appear publicly
    const list = getStoredCompanions().filter(
      (c) => c.verificationStatus === "approved" && (c.isActive !== false)
    );
    setCompanions(list);

    // Live Real-Time Firestore Synchronization with Admin Panel
    const unsubC = firestoreSubscribeCompanions((firestoreList) => {
      if (firestoreList && firestoreList.length > 0) {
        const approved = firestoreList.filter(
          (c: any) => c.verificationStatus === "approved" && (c.isActive !== false)
        );
        setCompanions(approved);
      }
    });

    const unsubL = firestoreSubscribeLocations((locList) => {
      if (locList && locList.length > 0) {
        const disabled = locList
          .filter((l: any) => l.isAvailable === false)
          .map((l: any) => (l.cityFilter || l.name).toLowerCase());
        setDisabledLocations(disabled);
      }
    });

    return () => {
      if (unsubC) unsubC();
      if (unsubL) unsubL();
    };
  }, []);

  const isLocationSupported = useMemo(() => {
    if (!isSupportedLocation(selectedCity)) return false;
    if (selectedCity !== "all") {
      const c = selectedCity.toLowerCase();
      if (disabledLocations.some((d) => c.includes(d) || d.includes(c))) {
        return false;
      }
    }
    return true;
  }, [selectedCity, disabledLocations]);

  // Filtered & sorted companion list
  const filteredCompanions = useMemo(() => {
    if (!isLocationSupported) return [];

    return companions
      .filter((c) => {
        // Location Filter
        if (!matchesLocationFilter(c.city, selectedCity)) {
          return false;
        }
        // Gender Filter
        if (selectedGender !== "all" && c.gender !== selectedGender) {
          return false;
        }
        // Price Filter
        if (c.hourlyPrice > maxPrice) {
          return false;
        }
        // Activity Filter
        if (selectedActivity !== "all") {
          const hasService = c.services?.some((s) =>
            s.toLowerCase().includes(selectedActivity.toLowerCase())
          );
          if (!hasService) return false;
        }
        // Search Filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = c.fullName.toLowerCase().includes(q);
          const matchBio = c.bio.toLowerCase().includes(q);
          const matchCity = c.city.toLowerCase().includes(q);
          const matchInterest = c.interests?.some((i) => i.toLowerCase().includes(q));
          if (!matchName && !matchBio && !matchCity && !matchInterest) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "price_asc") return (a.price30Min || a.hourlyPrice) - (b.price30Min || b.hourlyPrice);
        if (sortBy === "price_desc") return b.hourlyPrice - a.hourlyPrice;
        return 0;
      });
  }, [companions, selectedCity, selectedGender, maxPrice, selectedActivity, searchTerm, sortBy, isLocationSupported]);

  const handleResetFilters = () => {
    setSelectedCity("all");
    setSelectedGender("all");
    setMaxPrice(3000);
    setSelectedActivity("all");
    setSearchTerm("");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-[#09090D] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>State-Wise Verified Companions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Companion Discovery
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Find and book verified male and female companions across Kolkata, Patna, Delhi, Hyderabad, Bangalore, Maharashtra, and Jharkhand (Ranchi).
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, city, hobbies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] text-xs rounded-xl bg-[#12121A] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* State Selection Quick Tabs */}
        <div className="mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-2 min-w-max px-0.5">
            <button
              onClick={() => setSelectedCity("all")}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                selectedCity === "all"
                  ? "gradient-btn text-white shadow-md shadow-pink-500/25"
                  : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
              }`}
            >
              <span>All Locations</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                {companions.length}
              </span>
            </button>

            {SUPPORTED_LOCATIONS.map((loc) => {
              const count = companions.filter((c) => matchesLocationFilter(c.city, loc)).length;
              const isSelected = selectedCity === loc;

              return (
                <button
                  key={loc}
                  onClick={() => setSelectedCity(loc)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? "gradient-btn text-white shadow-md shadow-pink-500/25"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                  }`}
                >
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span>{loc}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-5">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white active:scale-95 transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
            <span>Filter & Sort ({filteredCompanions.length})</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 min-h-[44px] flex items-center active:scale-95"
          >
            Reset Filters
          </button>
        </div>

        {/* Main Grid: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? "block" : "hidden"
            } lg:col-span-1 rounded-3xl bg-[#12121A] border border-white/10 p-6 space-y-6 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-pink-400" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-zinc-400 hover:text-pink-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Location Selector */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>Location / City</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 font-medium"
              >
                <option value="all">All Locations</option>
                <optgroup label="Supported States & Cities">
                  {SUPPORTED_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Cities">
                  <option value="Goa">Goa (Coming Soon)</option>
                  <option value="Chennai">Chennai (Coming Soon)</option>
                  <option value="Ahmedabad">Ahmedabad (Coming Soon)</option>
                  <option value="Jaipur">Jaipur (Coming Soon)</option>
                  <option value="Chandigarh">Chandigarh (Coming Soon)</option>
                </optgroup>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                Companion Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedGender("all")}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    selectedGender === "all"
                      ? "bg-pink-500/20 border-pink-500 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedGender("female")}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    selectedGender === "female"
                      ? "bg-pink-500/20 border-pink-500 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Girlfriend
                </button>
                <button
                  onClick={() => setSelectedGender("male")}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    selectedGender === "male"
                      ? "bg-pink-500/20 border-pink-500 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Boyfriend
                </button>
              </div>
            </div>

            {/* Max Hourly Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Max Hourly Price</span>
                <span className="text-pink-400 font-bold">₹{maxPrice.toLocaleString("en-IN")}/hr</span>
              </div>
              <input
                type="range"
                min={800}
                max={3000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>₹800/hr</span>
                <span>₹3,000/hr</span>
              </div>
            </div>

            {/* Activity Preference */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                Available Service / Activity
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
              >
                <option value="all">Any Activity</option>
                {ACTIVITY_OPTIONS.map((a) => (
                  <option key={a.id} value={a.label}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                Sort Companions
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "price_asc" | "price_desc")}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Safety Notice */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Only approved and active profiles appear publicly. 18+ Mandatory.</span>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-3">
            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-zinc-400">
                {selectedCity !== "all" ? (
                  <span>
                    Companions in <strong className="text-white">{selectedCity}</strong>: {filteredCompanions.length} available
                  </span>
                ) : (
                  <span>
                    Showing <strong className="text-white">{filteredCompanions.length}</strong> verified companions
                  </span>
                )}
              </span>
            </div>

            {/* 5. LOCATION FILTERING LOGIC */}
            {!isLocationSupported ? (
              /* Case A: Unsupported Location */
              <div className="rounded-3xl bg-[#12121A] border border-white/10 p-10 sm:p-14 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Our Service Is Coming Soon to Your City
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  DateMate is currently operational in <strong className="text-pink-300">Kolkata, Patna, Delhi, Hyderabad, Bangalore, Maharashtra, and Jharkhand (Ranchi)</strong>. We will be expanding to {selectedCity} very soon!
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedCity("all")}
                    className="px-5 py-2.5 rounded-xl gradient-btn text-white font-bold text-xs"
                  >
                    Explore Available Locations
                  </button>
                  <button
                    onClick={() => alert(`Thank you! You will be notified as soon as DateMate launches in ${selectedCity}.`)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <BellRing className="w-3.5 h-3.5 text-pink-400" />
                    <span>Notify Me on Launch</span>
                  </button>
                </div>
              </div>
            ) : filteredCompanions.length === 0 ? (
              /* Case B: Supported Location but 0 companions available */
              <div className="rounded-3xl bg-[#12121A] border border-white/10 p-10 sm:p-14 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  No Companions Available in This Location
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  There are currently no approved and active companions matching your filter in <strong>{selectedCity}</strong>. Try resetting filters or browsing other active states.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl gradient-btn text-white font-bold text-xs"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setSelectedCity("all")}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold"
                  >
                    View All States
                  </button>
                </div>
              </div>
            ) : (
              /* Case C: Available Companions Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCompanions.map((companion) => (
                  <CompanionCard key={companion.id} companion={companion} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090D] flex items-center justify-center text-white">Loading companions...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
