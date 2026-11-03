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

export const INITIAL_COMPANIONS: Companion[] = [
  // 1. MAHARASHTRA
  {
    id: "comp-1",
    fullName: "Aanya Sharma",
    gender: "female",
    age: 24,
    city: "Maharashtra",
    headline: "Art curator, foodie & enthusiastic conversationalist",
    bio: "Hey there! I am a 24-year-old creative professional living in Mumbai, Maharashtra. Passionate about world cinema, literature, art exhibitions, and discovering boutique bistros. Whether you need a warm, charming companion for a dinner date, a gallery walk, or a classy plus-one for a weekend gathering, I ensure you have a fun, engaging, and memorable time. Strictly platonic & respectful.",
    price30Min: 900,
    hourlyPrice: 1500,
    rating: 4.9,
    reviewCount: 38,
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Marathi"],
    interests: ["Contemporary Art", "Cinema", "Italian Cuisine", "Travel", "Jazz Music"],
    services: ["Fine Dining & Cafes", "Cinema & Theater", "Social & Family Events", "City Tour & Exploration"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  // 2. BANGALORE
  {
    id: "comp-2",
    fullName: "Kabir Malhotra",
    gender: "male",
    age: 26,
    city: "Bangalore",
    headline: "Tech founder, fitness enthusiast & travel companion",
    bio: "Hi! I am Kabir, based in Koramangala, Bangalore. A warm, well-spoken listener and adventurous companion. I love exploring new cafes, running marathons, attend tech conferences or going to high-energy comedy gigs. Looking for a genuine, respectful companion for dinners, events, or city strolls? Let's make your day special!",
    price30Min: 1100,
    hourlyPrice: 1800,
    rating: 4.95,
    reviewCount: 42,
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Punjabi"],
    interests: ["Fitness", "Startups", "Stand-up Comedy", "Coffee Brewing", "Trekking"],
    services: ["Fine Dining & Cafes", "Shopping & Styling", "Social & Family Events", "Coffee & Deep Conversation"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-10T11:00:00Z"
  },
  // 3. DELHI
  {
    id: "comp-3",
    fullName: "Rhea Sen",
    gender: "female",
    age: 23,
    city: "Delhi",
    headline: "Fashion stylist, cinema lover & charismatic companion",
    bio: "Namaste! I am Rhea, a graduate from NIFT New Delhi. If you want someone with a sharp eye for fashion, great conversational energy, and a pleasant social presence for dinners or shopping trips in Khan Market or Connaught Place, I'm your go-to companion. Respectful, fun, and well-groomed.",
    price30Min: 950,
    hourlyPrice: 1600,
    rating: 4.88,
    reviewCount: 29,
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Bengali"],
    interests: ["Fashion Styling", "Photography", "Fine Dining", "Museums", "Indie Music"],
    services: ["Fine Dining & Cafes", "Shopping & Styling", "Cinema & Theater", "Coffee & Deep Conversation"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-01T09:30:00Z"
  },
  // 4. HYDERABAD
  {
    id: "comp-4",
    fullName: "Arjun Reddy",
    gender: "male",
    age: 27,
    city: "Hyderabad",
    headline: "Architect, heritage buff & courteous plus-one",
    bio: "Hello! I am an architect and photography enthusiast based in Jubilee Hills, Hyderabad. I enjoy meaningful discussions about architecture, history, food, and culture. I can accompany you to family weddings, corporate social events, gallery openings, or a tranquil dinner at Taj Falaknuma. Polite, punctual, and presentable.",
    price30Min: 1200,
    hourlyPrice: 2000,
    rating: 4.92,
    reviewCount: 31,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Telugu"],
    interests: ["Architecture", "Heritage Walks", "Gourmet Food", "Automobiles"],
    services: ["Fine Dining & Cafes", "Social & Family Events", "City Tour & Exploration"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-20T14:15:00Z"
  },
  // 5. KOLKATA
  {
    id: "comp-7",
    fullName: "Ananya Roy",
    gender: "female",
    age: 24,
    city: "Kolkata",
    headline: "Journalist, theater artist & culture enthusiast",
    bio: "Kolkata girl at heart, passionate about Rabindra Sangeet, English literature, and street food trails in Park Street and College Street. Looking for someone genuine to explore Kolkata's rich culture, watch experimental theater, or just talk about life over Darjeeling tea? Warm, dignified, and fun company guaranteed.",
    price30Min: 800,
    hourlyPrice: 1300,
    rating: 4.9,
    reviewCount: 27,
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Bengali"],
    interests: ["Theater", "Literature", "Coffee Houses", "Photography"],
    services: ["City Tour & Exploration", "Cinema & Theater", "Fine Dining & Cafes", "Coffee & Deep Conversation"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-01-28T12:00:00Z"
  },
  // 6. PATNA
  {
    id: "comp-patna-1",
    fullName: "Priya Kumari",
    gender: "female",
    age: 23,
    city: "Patna",
    headline: "Literature graduate, cafe lover & soulful listener",
    bio: "Namaste! I am Priya from Boring Road, Patna. I love literature, peaceful conversations in cafes near Maurya Lok, and attending cultural festivals in Patna. Whether you need a warm companion for dinner at a rooftop bistro or someone engaging to converse with, I bring positive and polite energy. Strictly platonic.",
    price30Min: 700,
    hourlyPrice: 1200,
    rating: 4.93,
    reviewCount: 19,
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["Hindi", "English", "Bhojpuri", "Maithili"],
    interests: ["Hindi Poetry", "Boutique Cafes", "Classical Music", "Food Trails"],
    services: ["Fine Dining & Cafes", "Coffee & Deep Conversation", "Cinema & Theater"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-10T10:00:00Z"
  },
  {
    id: "comp-patna-2",
    fullName: "Aman Verma",
    gender: "male",
    age: 25,
    city: "Patna",
    headline: "Fitness instructor & charismatic plus-one",
    bio: "Hello! Aman here from Kankarbagh, Patna. Well-groomed, polite, and great at conversations. Available for dining out, movies at Cinepolis, shopping accompaniment, and social gatherings.",
    price30Min: 750,
    hourlyPrice: 1300,
    rating: 4.88,
    reviewCount: 14,
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["Hindi", "English"],
    interests: ["Fitness", "Movies", "Cricket", "Biking"],
    services: ["Fine Dining & Cafes", "Cinema & Theater", "Social & Family Events"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-12T11:00:00Z"
  },
  // 7. JHARKHAND (RANCHI)
  {
    id: "comp-ranchi-1",
    fullName: "Shreya Pandey",
    gender: "female",
    age: 24,
    city: "Jharkhand (Ranchi)",
    headline: "Nature lover, psychologist & compassionate conversationalist",
    bio: "Hi! I am Shreya from Ranchi, Jharkhand. Passionate about nature walks near Patratu Valley, warm coffee, and deep mindful talks. Looking for someone genuine and respectful to spend quality social time with? I am here to make your day memorable and peaceful.",
    price30Min: 750,
    hourlyPrice: 1250,
    rating: 4.96,
    reviewCount: 23,
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["Hindi", "English"],
    interests: ["Psychology", "Nature Trips", "Cafes", "Photography"],
    services: ["Coffee & Deep Conversation", "City Tour & Exploration", "Fine Dining & Cafes"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-05T09:00:00Z"
  },
  {
    id: "comp-ranchi-2",
    fullName: "Harsh Raj",
    gender: "male",
    age: 26,
    city: "Jharkhand (Ranchi)",
    headline: "Engineer, guitarist & upbeat dinner date",
    bio: "Hey! Harsh here from Morabadi, Ranchi. Courteous, well-spoken, and love good music and great cuisine. Available as a respectful companion for dinner, movies, or city drives.",
    price30Min: 800,
    hourlyPrice: 1400,
    rating: 4.9,
    reviewCount: 16,
    photos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["Hindi", "English"],
    interests: ["Acoustic Music", "Rock Climbing", "Travel", "Dining"],
    services: ["Fine Dining & Cafes", "Cinema & Theater", "Coffee & Deep Conversation"],
    verificationStatus: "approved",
    isAvailable: true,
    isActive: true,
    isDemo: true,
    createdAt: "2026-02-14T15:00:00Z"
  },
  // PENDING FOR ADMIN APPROVAL
  {
    id: "comp-pending-1",
    fullName: "Simran Kaur",
    gender: "female",
    age: 23,
    city: "Delhi",
    headline: "Law student & fashion model seeking approved listing",
    bio: "Hi! Final year law student. Enthusiastic, polite, and interested in meeting respectful people for city tours, dinner dates, and shopping in Delhi.",
    price30Min: 850,
    hourlyPrice: 1500,
    rating: 5.0,
    reviewCount: 0,
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    languages: ["English", "Hindi", "Punjabi"],
    interests: ["Law", "Debating", "Fashion", "Boutique Cafes"],
    services: ["Fine Dining & Cafes", "Shopping & Styling", "Cinema & Theater"],
    verificationStatus: "pending",
    isAvailable: false,
    isActive: false,
    isDemo: true,
    createdAt: "2026-11-01T09:00:00Z"
  }
];

export const DEMO_REVIEWS: Review[] = [
  {
    id: "rev-1",
    companionId: "comp-1",
    authorName: "Vikrant M.",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Aanya was the absolute best companion for an art exhibition in Kala Ghoda followed by dinner. Incredibly knowledgeable, polite, and made me feel completely comfortable. 10/10 recommendation!",
    activity: "Fine Dining & Cafes",
    date: "2 weeks ago"
  },
  {
    id: "rev-2",
    companionId: "comp-2",
    authorName: "Sneha P.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Hired Kabir as my plus-one for a corporate alumni gala in Bangalore. He was impeccably dressed, courteous to everyone, and great to talk with. Very professional service by DateMate.",
    activity: "Social & Family Events",
    date: "1 month ago"
  },
  {
    id: "rev-3",
    companionId: "comp-patna-1",
    authorName: "Rohit K.",
    authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Priya made our cafe date in Patna so engaging and memorable. Such thoughtful conversation on literature and poetry. Truly a 5-star experience!",
    activity: "Fine Dining & Cafes",
    date: "1 week ago"
  },
  {
    id: "rev-4",
    companionId: "comp-ranchi-1",
    authorName: "Deepak S.",
    authorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Shreya was courteous, graceful, and a wonderful listener. We spent 2 hours talking over coffee in Morabadi, Ranchi. Highly recommended!",
    activity: "Coffee & Deep Conversation",
    date: "4 days ago"
  }
];

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
