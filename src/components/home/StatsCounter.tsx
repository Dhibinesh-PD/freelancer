"use client";

import React from "react";
import { PLATFORM_STATS } from "@/lib/data/seed-data";
import { Users, CheckCircle, Globe2, Star, TrendingUp } from "lucide-react";

export function StatsCounter() {
  return (
    <section className="py-12 border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="glass-panel p-4 rounded-xl">
            <Users className="h-5 w-5 text-indigo-400 mx-auto mb-2" />
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {PLATFORM_STATS.activeFreelancers}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Active Freelancers</p>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {PLATFORM_STATS.completedProjects}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Completed Projects</p>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <Globe2 className="h-5 w-5 text-sky-400 mx-auto mb-2" />
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {PLATFORM_STATS.globalCountries}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Countries Represented</p>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <Star className="h-5 w-5 text-amber-400 mx-auto mb-2" />
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {PLATFORM_STATS.clientSatisfaction}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Satisfaction Rate</p>
          </div>

          <div className="glass-panel p-4 rounded-xl col-span-2 md:col-span-1">
            <TrendingUp className="h-5 w-5 text-violet-400 mx-auto mb-2" />
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {PLATFORM_STATS.totalVolume}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Total Work Value</p>
          </div>
        </div>
      </div>
    </section>
  );
}
