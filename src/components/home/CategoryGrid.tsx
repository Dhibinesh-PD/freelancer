"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { 
  Code2, 
  Palette, 
  FileText, 
  TrendingUp, 
  Video, 
  Briefcase, 
  Calculator, 
  Scale, 
  Building2, 
  Languages, 
  GraduationCap, 
  MapPin, 
  ArrowRight 
} from "lucide-react";

// Icon mapping helper
const ICON_MAP: Record<string, any> = {
  Code2,
  Palette,
  FileText,
  TrendingUp,
  Video,
  Briefcase,
  Calculator,
  Scale,
  Building2,
  Languages,
  GraduationCap,
  MapPin
};

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Taxonomy & Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore Professional Categories
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              From mission-critical cloud software to enterprise branding, legal contracts, and financial modeling.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View all 100+ categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.slice(0, 9).map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Code2;
            return (
              <Link
                key={cat.id}
                href={`/services?categorySlug=${cat.slug}`}
                className="group glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {cat.subcategories.length} Specializations
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{cat.freelancerCount.toLocaleString()} Experts</span>
                  <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
