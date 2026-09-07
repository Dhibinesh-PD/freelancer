"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_SERVICES } from "@/lib/data/seed-data";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { Search, Star, Clock, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(2500);

  const filteredServices = useMemo(() => {
    return SEED_SERVICES.filter((srv) => {
      const matchesSearch =
        searchTerm === "" ||
        srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || srv.categorySlug === selectedCategory;

      const matchesPrice = srv.startingPrice <= maxPrice;

      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [searchTerm, selectedCategory, maxPrice]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold text-sky-400">Predefined Service Packages</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Browse Fixed-Price Services (Gigs)</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose packaged solutions with predictable budgets, defined deliverables, and guaranteed timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Filter className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h2>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Search Services</label>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Next.js, Figma, Logo..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Select */}
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

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Max Starting Price</span>
                <span className="text-indigo-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>Showing <strong className="text-white">{filteredServices.length}</strong> active service packages</span>
              <span>Sorted by <strong className="text-white">Popularity & Rating</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={service.coverImageUrl}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={service.freelancerAvatar}
                          alt={service.freelancerName}
                          className="h-7 w-7 rounded-full object-cover border border-slate-700"
                        />
                        <span className="text-xs font-semibold text-slate-300">
                          {service.freelancerName}
                        </span>
                        <div className="flex items-center gap-1 ml-auto text-xs font-bold text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{service.rating.toFixed(1)}</span>
                          <span className="text-slate-500 font-normal">({service.reviewCount})</span>
                        </div>
                      </div>

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

                  <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{service.deliveryDays} Days Delivery</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">From</span>
                        <span className="text-base font-extrabold text-white">${service.startingPrice}</span>
                      </div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
