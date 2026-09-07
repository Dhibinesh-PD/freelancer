import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { StatsCounter } from "@/components/home/StatsCounter";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedFreelancers } from "@/components/home/FeaturedFreelancers";
import { PopularServices } from "@/components/home/PopularServices";
import { RecentJobs } from "@/components/home/RecentJobs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsCounter />
        <CategoryGrid />
        <FeaturedFreelancers />
        <PopularServices />
        <RecentJobs />
        <HowItWorks />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
