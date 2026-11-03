"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/demo-data";
import { ChevronDown, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="min-h-screen bg-[#09090D] py-12 sm:py-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Clear answers about booking companions, safety protocols, payments, and becoming a companion on DateMate.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#12121A] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-pink-400 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-pink-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 border-t border-white/5 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-[#12121A] border border-white/10 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Still have questions?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Our 24/7 client support and trust team is ready to answer any questions or clarify our code of conduct.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/safety"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
            >
              Read Safety Guide
            </Link>
            <Link
              href="/browse"
              className="px-5 py-2.5 rounded-xl gradient-btn text-xs font-bold text-white flex items-center gap-1.5"
            >
              <span>Explore Companions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

