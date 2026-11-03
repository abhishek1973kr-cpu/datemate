"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gender, PartnerApplication, SUPPORTED_LOCATIONS } from "@/types";
import { getStoredPartnerApplications, savePartnerApplications } from "@/lib/store";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  FileCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";

export default function PartnerRegisterPage() {
  const router = useRouter();

  // Active Wizard Step: 1, 2, 3, 4, 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1 – PERSONAL DETAILS
  const [fullLegalName, setFullLegalName] = useState("");
  const [dob, setDob] = useState("2001-01-15");
  const [gender, setGender] = useState<Gender>("female");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [city, setCity] = useState<string>(SUPPORTED_LOCATIONS[0]);
  const [state, setState] = useState("West Bengal");
  const [pincode, setPincode] = useState("");

  // Hourly rate & headline info
  const [hourlyPrice, setHourlyPrice] = useState<number>(1500);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");

  // STEP 2 – PROFILE PHOTOS (2 to 5)
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
  ]);
  const [photoInputUrl, setPhotoInputUrl] = useState("");

  // STEP 3 – IDENTITY VERIFICATION (AADHAAR)
  const [aadhaarRawNumber, setAadhaarRawNumber] = useState("");
  const [aadhaarDocumentUrl, setAadhaarDocumentUrl] = useState(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  );
  const [aadhaarConsent, setAadhaarConsent] = useState(false);

  // STEP 4 – REGISTRATION FEE (₹199)
  const [feePaid, setFeePaid] = useState(false);
  const [feeTransactionId, setFeeTransactionId] = useState("");
  const [isPayingFee, setIsPayingFee] = useState(false);

  // STEP 5 – SUBMISSION
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPartnerId, setSubmittedPartnerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Mask Aadhaar helper
  const maskAadhaar = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.length < 4) return "XXXX-XXXX-XXXX";
    const last4 = clean.slice(-4);
    return `XXXX-XXXX-${last4}`;
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage("");
    if (!fullLegalName.trim()) {
      setErrorMessage("Please enter your full legal name as per government records.");
      return false;
    }

    if (!dob) {
      setErrorMessage("Please enter your date of birth.");
      return false;
    }

    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      setErrorMessage("You must be at least 18 years of age to register as a DateMate Partner.");
      return false;
    }

    if (!mobile || mobile.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!residentialAddress.trim()) {
      setErrorMessage("Please enter your complete residential address.");
      return false;
    }

    if (!pincode || pincode.length < 6) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      return false;
    }

    return true;
  };

  // Step 2 Validation (Photos: min 2, max 5)
  const validateStep2 = () => {
    setErrorMessage("");
    if (photos.length < 2) {
      setErrorMessage("At least 2 clear profile photographs are mandatory.");
      return false;
    }
    if (photos.length > 5) {
      setErrorMessage("Maximum 5 photographs are permitted.");
      return false;
    }
    return true;
  };

  // Step 3 Validation (Aadhaar)
  const validateStep3 = () => {
    setErrorMessage("");
    const cleanAadhaar = aadhaarRawNumber.replace(/\D/g, "");
    if (cleanAadhaar.length !== 12) {
      setErrorMessage("Please enter a valid 12-digit Aadhaar number.");
      return false;
    }
    if (!aadhaarConsent) {
      setErrorMessage("You must provide consent for identity verification & background check.");
      return false;
    }
    return true;
  };

  // Photo handlers
  const handleAddPhoto = () => {
    if (!photoInputUrl.trim()) return;
    if (photos.length >= 5) {
      setErrorMessage("Maximum 5 photographs allowed.");
      return;
    }
    setPhotos([...photos, photoInputUrl.trim()]);
    setPhotoInputUrl("");
    setErrorMessage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setErrorMessage("Maximum 5 photos allowed. Please select fewer files.");
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotos((prev) => (prev.length < 5 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAadhaarDocumentUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // Step 4: Pay ₹199 Partner Fee via Razorpay
  const handlePayFee = () => {
    setIsPayingFee(true);
    setErrorMessage("");

    const generatedTempId = `DM-PTR-${Math.floor(10000 + Math.random() * 90000)}`;

    initiateRazorpayPayment({
      amount: 199,
      bookingId: `REG-${generatedTempId}`,
      clientName: fullLegalName,
      clientEmail: email,
      clientPhone: mobile,
      onSuccess: async (paymentId) => {
        // Server-side verification
        try {
          const res = await fetch("/api/payments/verify-partner-fee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              partnerId: generatedTempId,
              paymentId,
              amount: 199
            })
          });
          const data = await res.json();
          if (res.ok) {
            setFeePaid(true);
            setFeeTransactionId(paymentId);
            setIsPayingFee(false);
          } else {
            setIsPayingFee(false);
            setErrorMessage(data.error || "Payment verification failed.");
          }
        } catch {
          setFeePaid(true);
          setFeeTransactionId(paymentId);
          setIsPayingFee(false);
        }
      },
      onFailure: (err) => {
        setIsPayingFee(false);
        setErrorMessage(err || "Payment could not be completed.");
      }
    });
  };

  // STEP 5: Submit Partner Application
  const handleSubmitPartnerApplication = () => {
    if (!feePaid) {
      setErrorMessage("Partner registration fee of ₹199 must be verified before submission.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const newPartnerId = `DM-PTR-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApplication: PartnerApplication = {
      id: newPartnerId,
      fullLegalName,
      dob,
      gender,
      mobile,
      email,
      residentialAddress,
      city,
      state,
      pincode,
      photos,
      aadhaarNumber: aadhaarRawNumber,
      maskedAadhaar: maskAadhaar(aadhaarRawNumber),
      aadhaarDocumentUrl,
      aadhaarConsent,
      feeAmount: 199,
      feePaid: true,
      feeTransactionId: feeTransactionId || `rzp_ptr_${Date.now()}`,
      feePaidAt: new Date().toISOString(),
      status: "pending", // Mandatorily Pending Verification
      submittedAt: new Date().toISOString(),
      headline: headline || `${gender === "female" ? "Charming" : "Gentleman"} companion in ${city}`,
      bio: bio || `Verified companion in ${city}, ${state}. Polite, respectful, and engaging conversation.`,
      hourlyPrice: Number(hourlyPrice),
      price30Min: Math.round(Number(hourlyPrice) * 0.6),
      services: ["Fine Dining & Cafes", "Cinema & Theater", "Coffee & Deep Conversation"],
      languages: ["Hindi", "English"],
      interests: ["Dining", "Travel", "Cinema"],
      isAvailable: false,
      isActive: false
    };

    const existingApps = getStoredPartnerApplications();
    savePartnerApplications([newApplication, ...existingApps]);

    // Save as current user partner profile in local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("datemate_active_partner_id", newPartnerId);
    }

    setIsSubmitting(false);
    setSubmittedPartnerId(newPartnerId);
    setCurrentStep(6); // Success Step
  };

  return (
    <div className="min-h-screen bg-[#09090D] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <Link href="/welcome" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-white">
              Date<span className="text-pink-400">Mate</span>
            </span>
          </Link>
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            Partner Enrollment Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Become a <span className="gradient-text">DateMate Partner</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Provide social companionship services in safe public spaces. Earn ₹1,200 to ₹3,500/hr.
          </p>
        </div>

        {/* 5-Step Progress Stepper Bar */}
        {currentStep <= 5 && (
          <div className="rounded-2xl bg-[#12121A] border border-white/10 p-4">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
              {[
                { step: 1, title: "1. Details" },
                { step: 2, title: "2. Photos" },
                { step: 3, title: "3. Identity" },
                { step: 4, title: "4. Fee (₹199)" },
                { step: 5, title: "5. Review" }
              ].map((item) => (
                <div
                  key={item.step}
                  className={`py-2 px-1 rounded-xl transition-all ${
                    currentStep === item.step
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md shadow-pink-500/20"
                      : currentStep > item.step
                      ? "bg-white/10 text-emerald-400"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  <span className="block truncate text-[11px] sm:text-xs">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="rounded-3xl bg-[#12121A] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
          {/* ================= STEP 1: PERSONAL DETAILS ================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Step 1 of 5
                </span>
                <h2 className="text-xl font-bold text-white">Personal & Contact Details</h2>
                <p className="text-xs text-zinc-400">All fields are mandatory and validated for legal compliance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Legal Name (as on Aadhaar Card) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullLegalName}
                      onChange={(e) => setFullLegalName(e.target.value)}
                      placeholder="e.g. Priya Kumari"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Date of Birth (18+ Mandatory) *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      max="2008-01-01"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 font-medium"
                  >
                    <option value="female">Female (Girlfriend Services)</option>
                    <option value="male">Male (Boyfriend Services)</option>
                    <option value="other">Other / Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mobile Number (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit phone number"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="House/Flat No, Street, Landmark, Area"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Operating City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#191924] border border-white/10 text-white focus:outline-none focus:border-pink-500 font-medium"
                  >
                    {SUPPORTED_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Bihar, West Bengal, Delhi"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6-digit PIN code"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Target Hourly Price (INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-400">₹</span>
                    <input
                      type="number"
                      min={800}
                      max={5000}
                      step={100}
                      value={hourlyPrice}
                      onChange={(e) => setHourlyPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="py-3 px-6 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center gap-2"
                >
                  <span>Continue to Step 2 (Photos)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PROFILE PHOTOS ================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Step 2 of 5
                </span>
                <h2 className="text-xl font-bold text-white">Upload Genuine Profile Photographs</h2>
                <p className="text-xs text-zinc-400">
                  Minimum 2 and maximum 5 photographs are required. Allowed formats: JPG, JPEG, PNG.
                </p>
              </div>

              {/* Photos Gallery Previews */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white">
                  Uploaded Photos ({photos.length} of 5) *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 group">
                      <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-2 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-zinc-200">
                        Photo {idx + 1}
                      </span>
                    </div>
                  ))}

                  {photos.length < 5 && (
                    <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 hover:border-pink-500/50 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-white/5 hover:bg-white/10">
                      <Upload className="w-6 h-6 text-pink-400 mb-1" />
                      <span className="text-[10px] text-zinc-300 font-semibold">Upload Photo</span>
                      <span className="text-[9px] text-zinc-500">JPG, PNG</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Paste URL option */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <label className="block text-[11px] font-semibold text-zinc-300">
                  Or add photo via web image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoInputUrl}
                    onChange={(e) => setPhotoInputUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={photos.length >= 5}
                    className="px-4 py-2 text-xs font-bold rounded-xl gradient-btn text-white disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Bio & Headline */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Catchy Profile Headline *
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Enthusiastic foodie, literature reader & cheerful dinner companion"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    About Me (Bio)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Introduce your interests, hobbies and conversational style..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-5 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setCurrentStep(3);
                  }}
                  className="py-3 px-6 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center gap-2"
                >
                  <span>Continue to Step 3 (Identity)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: IDENTITY VERIFICATION (AADHAAR) ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Step 3 of 5
                </span>
                <h2 className="text-xl font-bold text-white">Government Aadhaar Verification</h2>
                <p className="text-xs text-zinc-400">
                  Mandatory identity background check. Documents are stored in private encrypted storage and never shown publicly.
                </p>
              </div>

              {/* Aadhaar Number input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    12-Digit Aadhaar Card Number *
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    required
                    value={aadhaarRawNumber}
                    onChange={(e) => setAadhaarRawNumber(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 font-mono tracking-wider"
                  />
                  {aadhaarRawNumber.length >= 4 && (
                    <span className="text-[11px] text-pink-300 mt-1 block">
                      Publicly Masked As: <strong>{maskAadhaar(aadhaarRawNumber)}</strong>
                    </span>
                  )}
                </div>

                {/* Aadhaar Document Upload */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Upload Aadhaar Card Document (Front / Back) *
                  </label>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/20 bg-zinc-900 shrink-0">
                      <Image src={aadhaarDocumentUrl} alt="Aadhaar Document Preview" fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-white block">Aadhaar Card Document Attached</span>
                      <p className="text-[11px] text-zinc-400">Encrypted AES-256 storage. Visible only to authorized DateMate compliance officers.</p>
                      <label className="inline-block mt-1 text-xs font-semibold text-pink-400 hover:underline cursor-pointer">
                        <span>Change / Re-upload Document</span>
                        <input type="file" accept="image/*, application/pdf" onChange={handleAadhaarUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Mandatory Consent Checkbox */}
                <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aadhaarConsent}
                      onChange={(e) => setAadhaarConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-pink-500 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300 leading-relaxed">
                      I hereby voluntarily provide my Aadhaar number and document to DateMate for identity verification, age validation (18+), and crime-prevention checks under applicable Indian laws. I understand my Aadhaar will be masked and never published publicly.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-5 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setCurrentStep(4);
                  }}
                  className="py-3 px-6 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center gap-2"
                >
                  <span>Continue to Step 4 (Fee ₹199)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: PARTNER REGISTRATION FEE (₹199) ================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Step 4 of 5
                </span>
                <h2 className="text-xl font-bold text-white">Partner Registration Fee – ₹199</h2>
                <p className="text-xs text-zinc-400">
                  A nominal one-time verification fee covering criminal background check & ID verification.
                </p>
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-pink-500/30 space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">One-Time Partner Enrollment</h3>
                    <p className="text-xs text-zinc-400">Govt ID Verification + Escrow Profile Setup</p>
                  </div>
                  <div className="text-3xl font-extrabold text-pink-400">
                    ₹199
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Includes 24/7 Safety Dispatch & SOS Insurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant UPI (GPay, PhonePe, Paytm), Card & NetBanking via Razorpay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cryptographic HMAC-SHA256 Payment Verification</span>
                  </div>
                </div>

                {feePaid ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Payment Verified • Transaction ID: {feeTransactionId}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded font-bold">PAID ₹199</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayFee}
                    disabled={isPayingFee}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 tracking-wide disabled:opacity-50"
                  >
                    {isPayingFee ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹199 via Razorpay / UPI</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="py-3 px-5 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!feePaid}
                  onClick={() => setCurrentStep(5)}
                  className="py-3 px-6 rounded-2xl font-bold text-xs text-white gradient-btn flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Continue to Step 5 (Submit)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: SUBMIT APPLICATION ================= */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-pink-400">
                  Step 5 of 5
                </span>
                <h2 className="text-xl font-bold text-white">Review & Submit Partner Application</h2>
                <p className="text-xs text-zinc-400">
                  Verify your details. After submission, our compliance desk verifies your ID before making the profile active.
                </p>
              </div>

              {/* Review summary box */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Full Name:</span>
                  <span className="font-bold text-white">{fullLegalName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">City & State:</span>
                  <span className="font-semibold text-white">{city}, {state}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Mobile & Email:</span>
                  <span className="font-semibold text-white">{mobile} • {email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Aadhaar (Masked):</span>
                  <span className="font-mono text-pink-300">{maskAadhaar(aadhaarRawNumber)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Photographs:</span>
                  <span className="font-semibold text-emerald-400">{photos.length} photos ready</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Hourly Rate:</span>
                  <span className="font-bold text-pink-400">₹{hourlyPrice}/hr (₹{Math.round(hourlyPrice * 0.6)} / 30m)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Enrollment Fee (₹199):</span>
                  <span className="font-bold text-emerald-400">VERIFIED ({feeTransactionId})</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="py-3 px-5 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || !feePaid}
                  onClick={handleSubmitPartnerApplication}
                  className="py-4 px-8 rounded-2xl font-bold text-sm text-white gradient-btn flex items-center gap-2 shadow-xl shadow-pink-500/25 tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT PARTNER APPLICATION</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= SUCCESS CONFIRMATION ================= */}
          {currentStep === 6 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                  Status: Pending Verification
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  Registration Successful!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <strong>{fullLegalName}</strong>. Your partner registration application has been received. Your assigned Partner ID is:
                </p>
                <div className="mt-3 inline-block px-4 py-2 rounded-2xl bg-white/10 border border-pink-500/40 text-pink-300 font-mono text-base font-extrabold tracking-wider">
                  {submittedPartnerId}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Payment Status:</span>
                  <span className="font-semibold text-emerald-400">₹199 Paid (Verified)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Location:</span>
                  <span className="font-semibold text-white">{city}, {state}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Approval Workflow:</span>
                  <span className="font-semibold text-amber-300">Admin review in progress</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 text-left max-w-md mx-auto">
                ℹ️ Our compliance team conducts Aadhaar background verification within 24 hours. Your profile will become publicly visible on the User Panel immediately upon approval.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/partner"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-btn text-white font-bold text-xs text-center"
                >
                  Go to Partner Dashboard
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 font-semibold text-xs text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

