"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ChatMessage, Companion } from "@/types";
import { getStoredMessages, saveMessages, getStoredCompanions } from "@/lib/store";
import {
  Send,
  ShieldAlert,
  ShieldCheck,
  User,
  MoreVertical,
  AlertTriangle,
  Lock,
  PhoneOff,
  CheckCheck
} from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [activeCompanion, setActiveCompanion] = useState<Companion | null>(null);
  const [companionsList, setCompanionsList] = useState<Companion[]>([]);
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const comps = getStoredCompanions();
    setCompanionsList(comps);
    if (comps.length > 0) {
      setActiveCompanion(comps[0]);
    }
    setMessages(getStoredMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeCompanion) return;

    // Check for phone numbers or off-platform keyword attempts
    const phonePattern = /\b\d{10}\b|\b\d{5}\s\d{5}\b/;
    if (phonePattern.test(inputText)) {
      setShowSafetyWarning(true);
    } else {
      setShowSafetyWarning(false);
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "user-client-1",
      senderName: user?.name || "Karan Singhal",
      receiverId: activeCompanion.id,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    setInputText("");

    // Simulate smart friendly companion reply after 1.5 seconds
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeCompanion.id,
        senderName: activeCompanion.fullName,
        receiverId: user?.id || "user-client-1",
        text: `Got your message! I'm looking forward to our meetup. Let me know if you'd like me to wear anything specific for the occasion.`,
        timestamp: new Date().toISOString(),
      };
      const withReply = [...updated, replyMsg];
      setMessages(withReply);
      saveMessages(withReply);
    }, 1500);
  };

  const handleBlockUser = () => {
    if (confirm("Are you sure you want to block this user and report conversation to DateMate Trust & Safety?")) {
      setIsBlocked(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#09090D] py-6 sm:py-8 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Safety Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-purple-950/40 border border-pink-500/20 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-zinc-300">
              <strong>Secure Privacy Shield:</strong> Never share sensitive bank details or private residential addresses. All dates must be in public venues.
            </span>
          </div>
          <button
            onClick={handleBlockUser}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold whitespace-nowrap"
          >
            Block & Report
          </button>
        </div>

        {/* Chat UI Box */}
        <div className="rounded-3xl bg-[#12121A] border border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px] shadow-2xl">
          {/* Left Companion List */}
          <div className="border-r border-white/10 flex flex-col bg-[#0F0F17]">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-sm font-bold text-white">Active Conversations</h2>
              <span className="text-[10px] text-zinc-400">Booking-related messages</span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-white/5">
              {companionsList.slice(0, 5).map((comp) => {
                const isSelected = activeCompanion?.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveCompanion(comp)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      isSelected ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={comp.photos[0]} alt={comp.fullName} fill className="object-cover" />
                      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F0F17]"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{comp.fullName}</h4>
                        <span className="text-[10px] text-zinc-500">Online</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{comp.city} • ₹{comp.hourlyPrice}/hr</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="md:col-span-2 flex flex-col bg-[#12121A]">
            {/* Header */}
            {activeCompanion && (
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151520]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <Image src={activeCompanion.photos[0]} alt={activeCompanion.fullName} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {activeCompanion.fullName}
                      <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                    </h3>
                    <p className="text-[10px] text-emerald-400">Verified Companion • Responds within 10 mins</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/companions/${activeCompanion.id}`}
                    className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 font-bold text-[11px] hover:bg-pink-500/30"
                  >
                    View / Book
                  </Link>
                </div>
              </div>
            )}

            {/* Warning if phone number detected */}
            {showSafetyWarning && (
              <div className="m-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Safety Notice: We recommend keeping all arrangements on DateMate to preserve your 24/7 emergency dispatch coverage and escrow guarantees.
                </span>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id || msg.senderName === user?.name || msg.senderId.includes("client");
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                        isMe
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none"
                          : "bg-white/10 text-zinc-100 rounded-bl-none border border-white/5"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-white/60">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-white/80" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <div className="p-3 border-t border-white/10 bg-[#0F0F17]">
              {isBlocked ? (
                <div className="p-3 text-center text-xs text-rose-400">
                  This conversation has been blocked.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message to companion..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl gradient-btn text-white hover:scale-105 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
