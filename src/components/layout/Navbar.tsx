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
  User as UserIcon,
  MessageSquare
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090D]/90 backdrop-blur-xl">
      {/* Top 18+ and Platonic Notice Bar */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-pink-900/40 border-b border-pink-500/20 px-4 py-1 text-center text-xs text-pink-200">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
          <span>Strictly 18+ Platonic Companionship Platform. No adult or sexual services allowed.</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Date<span className="text-pink-400">Mate</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              </span>
              <span className="hidden sm:block text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">
                Companionship Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-pink-400 ${
                    isActive ? "text-pink-400 font-semibold" : "text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Account Area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-pink-500/40 text-sm font-medium text-white transition-all"
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
                    className="absolute right-0 mt-2 w-56 py-2 bg-[#12121A] border border-white/15 rounded-2xl shadow-2xl z-50 text-sm"
                  >
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="font-semibold text-white truncate text-xs">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    {/* User Panel only for client/user role */}
                    {(role === "client" || role === "user" || !role || role === "guest") && (
                      <Link
                        href="/dashboard/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-200 hover:bg-white/5 hover:text-pink-400 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-pink-400" />
                        <span>User Panel</span>
                      </Link>
                    )}

                    {/* Partner Dashboard only for partner/companion role */}
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
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl gradient-btn transition-all shadow-md shadow-pink-500/20"
                >
                  Become a User
                </Link>
                <Link
                  href="/partner/login"
                  className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Become a Partner
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0B0B12] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-1 text-xs text-zinc-400">
                  Signed in as <strong className="text-white">{user.name}</strong>
                </div>
                <Link
                  href="/dashboard/user"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-pink-400" />
                  <span>User Panel</span>
                </Link>
                {(role === "companion" || role === "partner") && (
                  <Link
                    href="/dashboard/partner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <span>Partner Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white rounded-xl gradient-btn"
                >
                  Become a User
                </Link>
                <Link
                  href="/partner/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold text-zinc-200 bg-white/5 rounded-xl border border-white/10"
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
