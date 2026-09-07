"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  Code2, 
  ShieldCheck,
  Layers,
  KeyRound
} from "lucide-react";
import Link from "next/link";

export default function RegisterHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join 65,000+ Verified Professionals & Enterprises</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How would you like to use{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              ApexLance?
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Select your account type to set up your dedicated workspace, escrow configuration, and profile.
          </p>
        </div>

        {/* 2 Main Account Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Pathway */}
          <div className="group relative rounded-3xl p-8 bg-slate-900/60 border border-indigo-500/30 hover:border-indigo-500/80 shadow-xl shadow-indigo-950/40 hover:shadow-indigo-900/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/30 transition" />

            <div className="space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                <Briefcase className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Hiring Account</span>
                <h2 className="text-2xl font-bold text-white mt-1">I'm a Client, Hiring for a Project</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  Post projects, browse pre-vetted engineers and agencies, fund milestones securely in escrow, and only release payments when deliverables meet your satisfaction.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  <span>Post unlimited fixed-price and hourly jobs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  <span>Dual-custody escrow milestone protection</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  <span>Zero upfront subscription or deposit fees</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register/client"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>Join as a Client</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Freelancer Pathway */}
          <div className="group relative rounded-3xl p-8 bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/80 shadow-xl shadow-emerald-950/40 hover:shadow-emerald-900/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-600/30 transition" />

            <div className="space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Sparkles className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Freelancer Account</span>
                <h2 className="text-2xl font-bold text-white mt-1">I'm a Freelancer, Looking for Work</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                  Offer technical or creative services, bid on enterprise client contracts, submit deliverables for milestone approval, and get paid directly to your wallet.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Publish customized service packages (gigs)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Guaranteed payment via escrow release</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant withdrawals with low platform rates</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register/freelancer"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>Join as a Freelancer</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Existing account and admin provisioning links */}
        <div className="max-w-md mx-auto text-center space-y-3 pt-4 text-xs">
          <div className="text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
              Sign In to Your Portal &rarr;
            </Link>
          </div>

          <div className="pt-2 text-slate-500 text-[11px] flex items-center justify-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-slate-500" />
            <span>Platform Governance?</span>
            <Link href="/register/admin" className="text-rose-400 hover:underline">
              Provision Admin User
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
