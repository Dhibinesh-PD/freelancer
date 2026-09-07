"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_FREELANCERS } from "@/lib/data/seed-data";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Search, Star, ShieldCheck, MapPin, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FreelancersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(200);
  const [onlyTopRated, setOnlyTopRated] = useState(false);

  const filteredFreelancers = useMemo(() => {
    return SEED_FREELANCERS.filter((f) => {
      const matchesSearch =
        searchTerm === "" ||
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRate = f.hourlyRate <= maxHourlyRate;
      const matchesTopRated = onlyTopRated ? f.isTopRated : true;

      return matchesSearch && matchesRate && matchesTopRated;
    });
  }, [searchTerm, maxHourlyRate, onlyTopRated]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-indigo-400">Discover Talent</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Hire Vetted Freelance Professionals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse top-rated independent experts with verified skills and escrow protection.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Filter className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h2>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Keyword / Skill</label>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Next.js, Figma, AWS..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Hourly Rate Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Max Hourly Rate</span>
                <span className="text-indigo-400">${maxHourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min={40}
                max={200}
                step={5}
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Checkbox: Top Rated */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyTopRated}
                  onChange={(e) => setOnlyTopRated(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-900"
                />
                <span>Only Top-Rated Talents (4.9+ ★)</span>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSearchTerm("");
                setMaxHourlyRate(200);
                setOnlyTopRated(false);
              }}
              className="w-full py-2 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-900 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Showing <strong className="text-white">{filteredFreelancers.length}</strong> verified professionals</span>
              <span>Sorted by <strong className="text-white">Relevance & Rating</strong></span>
            </div>

            {filteredFreelancers.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl">
                <p className="text-base text-slate-300 font-semibold">No freelancers matched your criteria</p>
                <p className="text-xs text-slate-500 mt-1">Try broadening your keyword search or rate filter.</p>
              </div>
            ) : (
              filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl transition"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img
                      src={freelancer.avatarUrl}
                      alt={freelancer.name}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-500/20 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white hover:text-indigo-300 transition">
                            <Link href={`/freelancers/${freelancer.username}`}>
                              {freelancer.name}
                            </Link>
                          </h3>
                          {freelancer.isVerified && (
                            <span title="Verified Identity">
                              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                            </span>
                          )}
                          {freelancer.isTopRated && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                              TOP RATED
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-extrabold text-white">${freelancer.hourlyRate}</span>
                          <span className="text-xs text-slate-400"> / hr</span>
                        </div>
                      </div>

                      <p className="text-xs text-indigo-300 font-medium mt-0.5">{freelancer.title}</p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{freelancer.rating.toFixed(2)}</span>
                        </div>
                        <span>({freelancer.reviewCount} reviews)</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {freelancer.city}, {freelancer.country}
                        </span>
                        <span>&bull;</span>
                        <span>${(freelancer.totalEarnings / 1000).toFixed(0)}k+ earned</span>
                      </div>

                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                        {freelancer.overview}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
                        <div className="flex flex-wrap gap-1.5">
                          {freelancer.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/freelancers/${freelancer.username}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition ml-auto"
                        >
                          <span>View Profile & Work</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
