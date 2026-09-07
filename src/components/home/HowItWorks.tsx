"use client";

import React, { useState } from "react";
import { FileEdit, Search, Users, ShieldCheck, DollarSign, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"client" | "freelancer">("client");

  return (
    <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Frictionless Marketplace Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1">
            How ApexLance Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered for security, clarity, and rapid execution from initial match to final payout.
          </p>

          {/* Toggle Button */}
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 mt-6">
            <button
              onClick={() => setActiveTab("client")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === "client" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              For Clients Hiring Talent
            </button>
            <button
              onClick={() => setActiveTab("freelancer")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === "freelancer" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              For Freelancers & Agencies
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        {activeTab === "client" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Post a Project or Buy Gig</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe your requirements, specify skill tags, budget parameters, and delivery milestones.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Evaluate Proposals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare bids, verified portfolios, client reviews, and chat with candidates in real time.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Fund Milestone Escrow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deposit project funds safely. Your money is held in escrow until you verify and approve the work.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Approve & Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review submitted deliverables, release payment, and leave a two-way verified reputation rating.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Build Your Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add case studies, verified credentials, hourly rates, and list predefined fixed-price services.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Pitch & Receive Invites</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Search high-budget opportunities, submit detailed proposals, or get hired directly from your catalog.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Deliver with Escrow Safety</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Begin work knowing milestone funds are already secured in platform escrow before you start.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Instant Wallet Earnings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get paid immediately upon client approval. Withdraw via bank transfer, Stripe, or local gateways.
              </p>
            </div>
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <Link
            href={activeTab === "client" ? "/dashboard/client/jobs/new" : "/register"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xl shadow-indigo-600/25 transition"
          >
            <span>{activeTab === "client" ? "Post a Project Now" : "Apply as a Freelancer"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
