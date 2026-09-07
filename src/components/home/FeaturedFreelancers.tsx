"use client";

import React from "react";
import Link from "next/link";
import { SEED_FREELANCERS } from "@/lib/data/seed-data";
import { Star, ShieldCheck, MapPin, ArrowRight, CheckCircle2, Award } from "lucide-react";

export function FeaturedFreelancers() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Award className="h-4 w-4" />
              <span>Top-Tier Vetted Talent</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Work with Top 1% Independent Professionals
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Engineers, designers, and financial leaders with proven track records and verified client reviews.
            </p>
          </div>
          <Link
            href="/freelancers"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Search all experts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_FREELANCERS.slice(0, 6).map((freelancer) => (
            <div
              key={freelancer.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header with Avatar and Badges */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={freelancer.avatarUrl}
                      alt={freelancer.name}
                      className="h-16 w-16 rounded-xl object-cover border-2 border-indigo-500/30"
                    />
                    {freelancer.isAvailable && (
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Available now" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-white truncate hover:text-indigo-300 transition">
                        <Link href={`/freelancers/${freelancer.username}`}>
                          {freelancer.name}
                        </Link>
                      </h3>
                      {freelancer.isVerified && (
                        <span title="Verified Identity">
                          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-indigo-300 font-medium truncate mt-0.5">
                      {freelancer.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{freelancer.rating.toFixed(2)}</span>
                      </div>
                      <span>({freelancer.reviewCount} reviews)</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {freelancer.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Headline Bio */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {freelancer.headline}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {freelancer.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {freelancer.skills.length > 4 && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-400">
                      +{freelancer.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer with Rates and Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-white">${freelancer.hourlyRate}</span>
                  <span className="text-xs text-slate-400"> / hr</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{freelancer.completedJobsCount} jobs completed</p>
                </div>

                <Link
                  href={`/freelancers/${freelancer.username}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
