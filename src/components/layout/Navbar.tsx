"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Heart,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Briefcase,
  Compass,
  MessageSquare
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Explore Companions" },
    { href: "/#about", label: "About Us" },
    {
      href: user && user.hasPaidRegistrationFee ? "/dashboard/user" : "/auth/login",
      label: "Become a User"
    },
    {
      href: user && (user.role === "partner" || user.role === "companion") ? "/dashboard/partner" : "/partner/login",
      label: "Become a Partner"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090D]/95 backdrop-blur-xl">
      {/* Top 18+ and Platonic Notice Bar */}
      <div className="bg-gradient-to-r from-pink-950/60 via-purple-950/60 to-pink-950/60 border-b border-pink-500/20 px-3 py-1 text-center text-[10px] sm:text-xs text-pink-200">
        <span className="inline-flex items-center justify-center gap-1.5 font-medium max-w-full truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="truncate">Strictly 18+ Platonic Companionship. No adult services allowed.</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-h-[44px] items-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                Date<span className="text-pink-400">Mate</span>
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              </span>
              <span className="hidden sm:block text-[9px] text-zinc-400 tracking-wider uppercase font-semibold">
                Verified Companionship
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs lg:text-sm font-semibold transition-colors hover:text-pink-400 min-h-[44px] flex items-center ${
                    isActive ? "text-pink-400 font-bold" : "text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Account Area (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-pink-500/40 text-sm font-medium text-white transition-all min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[140px] truncate text-xs font-semibold">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userMenuOpen && (
                  <div
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 py-2 bg-[#12121A] border border-white/15 rounded-2xl shadow-2xl z-50 text-sm animate-slide-up"
                  >
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="font-semibold text-white truncate text-xs">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    {(role === "client" || role === "user" || !role || role === "guest") && (
                      <Link
                        href="/dashboard/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-200 hover:bg-white/5 hover:text-pink-400 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-pink-400" />
                        <span>User Dashboard</span>
                      </Link>
                    )}

                    {(role === "companion" || role === "partner") && (
                      <Link
                        href="/dashboard/partner"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-200 hover:bg-white/5 hover:text-purple-400 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <span>Partner Dashboard</span>
                      </Link>
                    )}

                    <Link
                      href="/chat"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-200 hover:bg-white/5 hover:text-pink-400 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-pink-400" />
                      <span>Messages</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 border-t border-white/10 mt-1 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl gradient-btn transition-all shadow-md shadow-pink-500/20 min-h-[44px] flex items-center"
                >
                  Become a User
                </Link>
                <Link
                  href="/partner/login"
                  className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors min-h-[44px] flex items-center"
                >
                  Become a Partner
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Avatar/User if logged in, and Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                href={user.role === "partner" ? "/dashboard/partner" : "/dashboard/user"}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-md"
                aria-label="User Account"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center text-zinc-300 hover:text-white rounded-xl active:scale-95 bg-white/5 border border-white/10 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0C0C14]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-slide-up shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-3 text-xs font-semibold rounded-xl flex items-center justify-between min-h-[44px] transition-colors ${
                  pathname === link.href
                    ? "bg-pink-500/15 text-pink-300 border border-pink-500/20"
                    : "text-zinc-200 hover:bg-white/5 active:bg-white/10"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-zinc-500 text-xs">→</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                  Signed in as <strong className="text-white font-bold">{user.name}</strong>
                </div>
                <Link
                  href="/dashboard/user"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-3 text-xs text-zinc-200 hover:bg-white/5 rounded-xl flex items-center gap-2.5 min-h-[44px]"
                >
                  <LayoutDashboard className="w-4 h-4 text-pink-400" />
                  <span>User Dashboard</span>
                </Link>
                {(role === "companion" || role === "partner") && (
                  <Link
                    href="/dashboard/partner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-3 text-xs text-zinc-200 hover:bg-white/5 rounded-xl flex items-center gap-2.5 min-h-[44px]"
                  >
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <span>Partner Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-3 text-xs text-zinc-200 hover:bg-white/5 rounded-xl flex items-center gap-2.5 min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span>Messages</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3.5 py-3 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2.5 min-h-[44px] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center justify-center text-center text-xs font-bold text-white rounded-xl gradient-btn shadow-md active:scale-95"
                >
                  Become a User
                </Link>
                <Link
                  href="/partner/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center justify-center text-center text-xs font-semibold text-zinc-200 bg-white/5 rounded-xl border border-white/10 active:scale-95"
                >
                  Become a Partner
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
