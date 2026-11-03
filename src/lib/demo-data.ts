import { Companion, Review, SUPPORTED_LOCATIONS } from "@/types";

export const INDIAN_CITIES = [
  ...SUPPORTED_LOCATIONS,
  "Goa",
  "Chennai",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh"
];

export const ACTIVITY_OPTIONS = [
  { id: "dinner", label: "Fine Dining & Cafes", icon: "Utensils", desc: "Enjoy upscale dinners, cafe hopping or foodie adventures" },
  { id: "movie", label: "Cinema & Theater", icon: "Film", desc: "Watch the latest blockbusters, IMAX films or cultural plays" },
  { id: "shopping", label: "Shopping & Styling", icon: "ShoppingBag", desc: "Fashion styling consultation, mall browsing & shopping assistance" },
  { id: "events", label: "Social & Family Events", icon: "Sparkles", desc: "Plus-one for corporate parties, art galleries, or weddings" },
  { id: "city_tour", label: "City Tour & Exploration", icon: "Compass", desc: "Discover historic monuments, scenic spots, nightlife or hidden gems" },
  { id: "coffee", label: "Coffee & Deep Conversation", icon: "Coffee", desc: "Relaxed conversations, emotional support and friendly listening" },
];

// No AI-generated or mock companion profiles - only verified real registered companions
export const INITIAL_COMPANIONS: Companion[] = [];

// No fake reviews
export const DEMO_REVIEWS: Review[] = [];

export const FAQ_ITEMS = [
  {
    question: "What is DateMate and how does it work?",
    answer: "DateMate is India's premier social companionship booking platform. We connect verified male and female companions with clients looking for someone to accompany them to dinners, movies, family events, shopping trips, city tours, or simple coffee conversations. You browse verified profiles, choose your date and activity, and book securely on our platform."
  },
  {
    question: "Which locations are currently supported?",
    answer: "We currently provide verified companion management in 7 key locations: Kolkata, Patna, Delhi, Hyderabad, Bangalore, Maharashtra, and Jharkhand (Ranchi). If your city is not yet on the list, our service is coming soon to your area!"
  },
  {
    question: "Is DateMate strictly platonic?",
    answer: "YES, 100% STRICTLY PLATONIC. DateMate is NOT an escort, adult entertainment, or dating agency. Any request for sexual favors, prostitution, commercial adult services, or harassment is strictly illegal, violates our terms of service, and leads to immediate account ban, forfeiture of booking fees, and reporting to law enforcement."
  },
  {
    question: "Where do DateMate bookings take place?",
    answer: "All DateMate bookings MUST take place in public, well-lit spaces such as licensed restaurants, cafes, shopping malls, movie theaters, cultural centers, or public event grounds. Private hotel rooms or private residential visits are strictly forbidden for the safety of both companions and clients."
  },
  {
    question: "How are companions verified?",
    answer: "Every companion undergoes mandatory 18+ age verification, government photo ID check (Aadhaar / Passport / Voter ID), phone verification, and manual screening by our compliance team before their profile is approved and made publicly visible."
  },
  {
    question: "How do payments work in India?",
    answer: "We support all major Indian payment methods through Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, and Credit/Debit Cards. Payment is held securely in escrow and released to the companion only after the booking successfully concludes."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel up to 12 hours before the scheduled booking time for a full refund. Cancellations made within 12 hours are subject to a standard cancellation fee to compensate the companion for their reserved time."
  }
];
