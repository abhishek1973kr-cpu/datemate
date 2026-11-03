"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Briefcase, ArrowRight } from "lucide-react";

export default function BecomeCompanionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the genuine 5-step Partner Registration workflow
    router.replace("/partner/register");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090D] flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-[#12121A] border border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Redirecting to Partner Registration...</h2>
        <p className="text-xs text-zinc-400">
          Taking you to DateMate&apos;s verified partner onboarding portal.
        </p>
        <div className="pt-2">
          <Link
            href="/partner/register"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-btn text-xs font-bold"
          >
            <span>Continue to Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
