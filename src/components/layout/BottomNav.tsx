"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Home,
  Compass,
  MessageSquare,
  User as UserIcon,
  Briefcase
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Navigation items for the mobile bottom navigation bar
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Explore",
      href: "/browse",
      icon: Compass,
      isActive: pathname.startsWith("/browse") || pathname.startsWith("/companions"),
    },
    {
      label: "Messages",
      href: "/chat",
      icon: MessageSquare,
      isActive: pathname === "/chat",
    },
    {
      label: user ? "Panel" : "Sign In",
      href: user
        ? user.role === "partner"
          ? "/dashboard/partner"
          : "/dashboard/user"
        : "/auth/login",
      icon: user && user.role === "partner" ? Briefcase : UserIcon,
      isActive:
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/user-register"),
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101018]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-2xl"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 min-h-[44px] ${
                active ? "text-pink-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? "scale-110 stroke-[2.25]" : "stroke-[1.75]"
                  }`}
                />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse shadow-sm shadow-pink-500" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors duration-200 ${
                  active ? "text-pink-300 font-bold" : "text-zinc-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
