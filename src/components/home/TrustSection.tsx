"use client";

import React from "react";
import { ShieldCheck, Lock, CheckCircle2, UserCheck, AlertCircle, Headphones } from "lucide-react";
import Link from "next/link";

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Institutional Safety Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
              A Platform Engineered for Trust, Transparency & Protection
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
              We eliminate marketplace fraud, payment disputes, and delivery ambiguity through immutable financial ledgers, strict KYC verification, and automated escrow release protocols.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full Milestone Escrow Guarantee</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Freelancers never work without guaranteed funds; clients never release money before inspecting deliverables.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Identity & Credentials Verification</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Profiles undergo government ID checks, business tax validation, and portfolio provenance auditing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Structured Dispute Mediation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    In the rare event of disagreement, neutral platform arbitrators examine contract scopes, chat transcripts, and files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 relative">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Escrow Engine</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Milestone Escrow Flow Demo</h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Step 1: Deposit</span>
                  <span className="text-white font-medium">Client deposits $3,500</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                  HELD IN ESCROW
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Step 2: Execution</span>
                  <span className="text-white font-medium">Freelancer submits code deliverable</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[11px] font-semibold">
                  SUBMITTED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Step 3: Verification</span>
                  <span className="text-white font-medium">Client inspects & approves milestone</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  APPROVED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-indigo-300 block text-[10px] uppercase font-semibold">Step 4: Payout</span>
                  <span className="text-white font-bold">$3,150 credited to Freelancer wallet</span>
                  <span className="text-slate-400 block text-[10px]">$350 platform fee deducted</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[11px]">
                  RELEASED
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-indigo-400" />
                PCI-DSS Level 1 Encrypted
              </span>
              <span className="text-emerald-400 font-semibold">0% Buyer Surcharge</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
