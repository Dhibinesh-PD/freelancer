"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ShieldCheck, Users, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const router = useRouter();
  const [searchTab, setSearchTab] = useState<"freelancers" | "services" | "jobs">("freelancers");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTab === "freelancers") {
      router.push(`/freelancers?search=${encodeURIComponent(query)}`);
    } else if (searchTab === "services") {
      router.push(`/services?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/jobs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-32 right-10 w-72 h-72 bg-sky-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
            <span>Over 100+ Enterprise IT & Professional Service Specialties</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Find the right talent <br className="hidden sm:inline" />
            <span className="gradient-text">for every project.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with vetted software architects, product designers, growth specialists, and domain consultants. Escrow-secured milestone payments with zero upfront risk.
          </p>

          {/* Search Box with Tabs */}
          <div className="mt-8 max-w-2xl mx-auto glass-panel p-2 rounded-2xl shadow-2xl shadow-indigo-950/40">
            {/* Search Type Selector Tabs */}
            <div className="flex items-center gap-2 mb-2 px-2 pt-1 border-b border-slate-800/80 pb-2">
              <button
                type="button"
                onClick={() => setSearchTab("freelancers")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  searchTab === "freelancers"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Find Freelancers
              </button>
              <button
                type="button"
                onClick={() => setSearchTab("services")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  searchTab === "services"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Browse Services (Gigs)
              </button>
              <button
                type="button"
                onClick={() => setSearchTab("jobs")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  searchTab === "jobs"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Find Jobs
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    searchTab === "freelancers"
                      ? "Search by title, skills (e.g. Next.js, Figma, Python)..."
                      : searchTab === "services"
                      ? "Search fixed-price services (e.g. Full-stack app, Logo design)..."
                      : "Search posted jobs and client projects..."
                  }
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none py-2"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="text-slate-500 font-medium">Trending:</span>
            {["Next.js 15", "Figma UI/UX", "AI RAG Pipeline", "Kubernetes", "Financial Model", "Copywriting"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  router.push(`/${searchTab}?search=${encodeURIComponent(tag)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Value Props Row */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Escrow milestone payments</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Identity-verified experts</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Zero client platform fee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
