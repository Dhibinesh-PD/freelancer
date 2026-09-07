"use client";

import React from "react";
import Link from "next/link";
import { SEED_JOBS } from "@/lib/data/seed-data";
import { DollarSign, Clock, MapPin, Star, ArrowRight, ShieldCheck } from "lucide-react";

export function RecentJobs() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Open Client Projects
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Latest High-Budget Opportunities
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Postings from enterprise clients looking for specialized engineers, designers, and consultants.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Link
              href="/dashboard/client/jobs/new"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              Post a Project
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>View all jobs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {SEED_JOBS.map((job) => (
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
                    <span className="text-xs text-slate-400">Posted {job.postedAt}</span>
                    <span className="text-xs text-slate-500">&bull;</span>
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Payment Verified
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

                  {/* Skills tags */}
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

                {/* Right side: Budget & Client Metadata */}
                <div className="lg:text-right shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800 flex lg:flex-col items-center lg:items-end justify-between gap-3">
                  <div>
                    <span className="text-lg font-extrabold text-white">
                      ${job.budgetMin} - ${job.budgetMax}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {job.budgetType === "FIXED" ? "Fixed Budget" : "Hourly Rate"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{job.clientRating.toFixed(1)}</span>
                    </div>
                    <span>&bull;</span>
                    <span>${(job.clientTotalSpent / 1000).toFixed(0)}k+ spent</span>
                  </div>

                  <Link
                    href={`/jobs/${job.slug}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                  >
                    Submit Proposal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
