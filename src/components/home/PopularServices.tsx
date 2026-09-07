"use client";

import React from "react";
import Link from "next/link";
import { SEED_SERVICES } from "@/lib/data/seed-data";
import { Star, Clock, ArrowRight, Check } from "lucide-react";

export function PopularServices() {
  return (
    <section className="py-16 md:py-24 border-b border-slate-800 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Instant Engagement Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Popular Fixed-Price Services
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Predefined packages with clear timelines, transparent pricing, and guaranteed deliverables.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Explore all services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_SERVICES.map((service) => (
            <div
              key={service.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={service.coverImageUrl}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={service.freelancerAvatar}
                      alt={service.freelancerName}
                      className="h-7 w-7 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-300 truncate">
                      {service.freelancerName}
                    </span>
                    <div className="flex items-center gap-1 ml-auto text-xs font-bold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{service.rating.toFixed(1)}</span>
                      <span className="text-slate-500 font-normal">({service.reviewCount})</span>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-base font-bold text-white line-clamp-2 hover:text-indigo-300 transition">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Service Footer */}
              <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{service.deliveryDays} Days Delivery</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting at</span>
                  <span className="text-base font-extrabold text-white">${service.startingPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
