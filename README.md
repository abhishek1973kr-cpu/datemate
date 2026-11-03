# DateMate – Rent a Girlfriend & Rent a Boyfriend Platform (India)

**DateMate** is a modern, premium, responsive web platform built for booking verified male and female social companions across major Indian metropolitan cities (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Kolkata, Goa, etc.).

> **Important Legal Mandate:** DateMate strictly operates as a **100% platonic social companionship** marketplace. Commercial adult services, prostitution, and escorting are categorically prohibited. All bookings must take place in public venues.

---

## 🌟 Key Highlights & Features

### 1. Modern Luxury Aesthetic & Theme
- **Color Theme**: Deep luxe black background (`#09090D`), dark glassmorphic cards (`#12121A`), neon pink & violet accents (`#EC4899`, `#8B5CF6`).
- **Responsive**: Mobile-first architecture optimized for smartphones, tablets, and desktop displays.
- **Micro-interactions**: Smooth transitions, glowing badges, verified ID checks, dynamic price calculators.

### 2. Comprehensive Companion Discovery & State-Wise Management
- **Supported State & City Locations**:
  1. Kolkata
  2. Patna
  3. Delhi
  4. Hyderabad
  5. Bangalore
  6. Maharashtra (Mumbai & Pune)
  7. Jharkhand (Ranchi)
- **Location Filtering Rules**:
  - Selecting any supported city (e.g. Patna or Delhi) shows only approved & active companions in that location.
  - If 0 companions match an active location: displays *"No Companions Available in This Location"*.
  - For unsupported cities: displays *"Our Service Is Coming Soon to Your City"*.
- **Admin Location-Wise Cards**:
  - Dedicated cards for each location displaying Total Companions, Active, Pending, **Add Companion (+)** button (pre-selects that state), and **View All** filter button.
  - Full companion management: Add, Edit, Change Multiple Photos, Activate/Deactivate, Approve/Reject, and Location switching.
  - Multi-tier pricing: 30-minute starting price and 1-hour booking rate.

### 3. Booking & Razorpay Payment System
- Select companion, date, time, duration (1 to 8 hours), and activity.
- Enter designated public meeting venue (cafes, restaurants, malls).
- Real-time transparent price calculation:
  $$\text{Total} = (\text{Hourly Rate} \times \text{Duration}) + 10\% \text{ Platform Escrow} + 5\% \text{ GST}$$
- Integrated Razorpay checkout with support for **UPI (GPay, PhonePe, Paytm), Cards, and NetBanking**.
- Backend Razorpay Order API (`/api/payments/create-order`) and cryptographic HMAC-SHA256 verified Webhook route (`/api/payments/webhook`).

### 4. Separate Companion Registration with Admin Approval
- Full application form with legal name, age (18+ mandatory validation), city, bio, hourly rate, services offered, photo URL, and government ID document verification (Aadhaar / Passport / Voter ID).
- Mandatory **Admin Verification Queue**: Companion profiles remain hidden until approved by an administrator in the admin console.

### 5. Multi-Role Dashboards
- **User Dashboard** (`/dashboard/user`): Active bookings with status badges (Pending, Confirmed, Cancelled), payment receipts, favorite companions, account settings, and 24/7 Safety SOS / support ticket submission.
- **Companion Dashboard** (`/dashboard/companion`): Availability toggle (Online / Offline), incoming booking requests with 1-click Accept / Decline, earnings analytics (Gross volume, Platform fee, Net payout), and withdrawal requests.
- **Admin Dashboard** (`/admin`): Super admin command center with key metrics, 1-click Companion Verification & ID approval/rejection queue, user directory, booking management, and safety complaint resolution.

### 6. Interactive In-App Messaging & Safety Controls
- Real-time user-to-companion chat for coordinating meeting details.
- Privacy safeguards: automated warnings against sharing private bank credentials or sensitive phone numbers off-platform.
- In-chat block & report mechanism.

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism and gradient utilities
- **Icons**: Lucide React
- **Database & Auth**: PostgreSQL with Supabase (schema provided in `supabase/schema.sql`)
- **Payments**: Razorpay (UPI, Credit/Debit cards, NetBanking in India)
- **Deployment**: Vercel ready

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎭 Demo Personas & One-Click Switcher

For seamless evaluation, the top navigation bar includes an **Instant Demo Persona Switcher**:
1. **Client**: Logged in as *Karan Singhal* (explore companions, create bookings, view user dashboard, test chat).
2. **Companion**: Logged in as *Aanya Sharma* (review incoming requests, toggle availability, view earnings).
3. **Super Admin**: Logged in as *Aditi Rao* (access `/admin`, approve or reject pending companion registrations, resolve safety tickets).

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and execute the contents of `supabase/schema.sql`.
4. Copy your Supabase URL and Anon Key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
