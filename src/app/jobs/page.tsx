"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_JOBS } from "@/lib/data/seed-data";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Search, DollarSign, Clock, Star, ShieldCheck, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBudgetType, setSelectedBudgetType] = useState<string>("all");

  const filteredJobs = useMemo(() => {
    return SEED_JOBS.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" || job.categorySlug === selectedCategory;

      const matchesBudget =
        selectedBudgetType === "all" || job.budgetType === selectedBudgetType;

      return matchesSearch && matchesCat && matchesBudget;
    });
  }, [searchTerm, selectedCategory, selectedBudgetType]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-400">Client Project Marketplace</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Browse Freelance Projects & Contracts</h1>
            <p className="text-sm text-slate-400 mt-1">
              Find high-value project postings from funded startups and global enterprises.
            </p>
          </div>

          <Link
            href="/dashboard/client/jobs/new"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            + Post a New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Filter className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h2>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Search Jobs / Skills</label>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Next.js, Figma, Cloud..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Contract Type</label>
              <select
                value={selectedBudgetType}
                onChange={(e) => setSelectedBudgetType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Contract Types</option>
                <option value="FIXED">Fixed Price Milestones</option>
                <option value="HOURLY">Hourly Billing</option>
              </select>
            </div>
          </div>

          {/* Job Postings Feed */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Showing <strong className="text-white">{filteredJobs.length}</strong> open client projects</span>
              <span>Sorted by <strong className="text-white">Most Recent</strong></span>
            </div>

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {job.category}
                      </span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-xs text-slate-400">{job.postedAt}</span>
                      <span className="text-xs text-slate-500">&bull;</span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified Client
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-indigo-300 transition">
                      <Link href={`/jobs/${job.slug}`}>
                        {job.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-4">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:text-right shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800 flex lg:flex-col items-center lg:items-end justify-between gap-3">
                    <div>
                      <span className="text-lg font-extrabold text-white">
                        ${job.budgetMin} - ${job.budgetMax}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {job.budgetType === "FIXED" ? "Fixed Budget" : "Hourly Rate"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span>Proposals: <strong>{job.proposalsCount}</strong></span>
                    </div>

                    <Link
                      href={`/jobs/${job.slug}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                    >
                      View & Bid &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
