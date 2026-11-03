import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090D",
};

export const metadata: Metadata = {
  title: "DateMate India | Rent a Girlfriend & Rent a Boyfriend Platform",
  description:
    "India's premier verified social companionship platform. Rent a girlfriend or rent a boyfriend for dinner dates, movies, shopping, and memorable public experiences. 100% Platonic & 18+ verified.",
  keywords: [
    "Rent a Girlfriend India",
    "Rent a Boyfriend India",
    "DateMate",
    "Social Companion India",
    "Event Plus One Mumbai",
    "Dinner Date Companion Bangalore",
    "Delhi NCR Companions",
  ],
  openGraph: {
    title: "DateMate India – Premium Social Companionship Platform",
    description:
      "Find your perfect companion for movies, dinners, shopping, and public events across India. 100% Platonic & ID Verified.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#09090D] text-slate-100 antialiased overflow-x-hidden selection:bg-pink-500 selection:text-white`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
