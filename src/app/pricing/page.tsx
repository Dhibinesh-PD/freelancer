import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Transparent Economics
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Fair, Predictable Platform Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Zero hidden fees. We believe in aligned incentives: we only earn when projects are successfully completed and approved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Plan */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                FOR CLIENTS
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-4">Free to Hire</h2>
              <p className="text-xs text-slate-400 mt-1">
                Post unlimited jobs, interview talent, and collaborate with zero client commission.
              </p>

              <div className="my-6">
                <span className="text-4xl font-black text-white">0%</span>
                <span className="text-xs text-slate-400 ml-2">Client Platform Fee</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Unlimited public & private job postings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Full milestone escrow payment protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Complimentary dispute mediation & support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Automated tax-compliant invoicing (VAT/GST)</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/client/jobs/new"
              className="w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition block"
            >
              Post a Project for Free
            </Link>
          </div>

          {/* Freelancer Plan */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FOR FREELANCERS
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-4">Performance Sliding Fee</h2>
              <p className="text-xs text-slate-400 mt-1">
                Only pay a fee when your deliverable is approved and money clears to your wallet.
              </p>

              <div className="my-6">
                <span className="text-4xl font-black text-white">10% &rarr; 7%</span>
                <span className="text-xs text-slate-400 ml-2">Sliding Take-Rate</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>10% standard fee (drops to 7% on contracts over $5k)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Guaranteed payment via funded milestone escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>List unlimited fixed-price service packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Direct bank transfer & Stripe payouts</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full text-center py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition block"
            >
              Join as a Specialist
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
