"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RealtimeMessagingCenter } from "@/components/messaging/RealtimeMessagingCenter";
import { RefreshCw } from "lucide-react";

export default function FreelancerMessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        <Suspense fallback={
          <div className="min-h-[500px] flex items-center justify-center text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
              <span>Loading Freelancer Messaging Workspace...</span>
            </div>
          </div>
        }>
          <RealtimeMessagingCenter mode="FREELANCER_ONLY" initialFreelancerId="fl-1" />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
