import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks as HowItWorksComponent } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { ShieldCheck, Lock, CheckCircle2, Award } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Platform Blueprint</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">
            How ApexLance Delivers Unmatched Security
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3">
            A comprehensive overview of our escrow mechanics, contract terms, dispute resolution, and verification protocols.
          </p>
        </div>

        <HowItWorksComponent />
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
