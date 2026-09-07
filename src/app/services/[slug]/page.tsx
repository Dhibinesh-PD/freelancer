"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_SERVICES } from "@/lib/data/seed-data";
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Lock,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const service = SEED_SERVICES.find(s => s.slug === slug || s.id === slug) || SEED_SERVICES[0];

  const [selectedTier, setSelectedTier] = useState<"BASIC" | "STANDARD" | "PREMIUM">("STANDARD");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const currentPkg = service.packages.find(p => p.tier === selectedTier) || service.packages[0];

  const handleOrder = async () => {
    try {
      await fetch("/api/v1/client/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: service.freelancerId,
          projectTitle: `${service.title} (${selectedTier} Tier)`,
          description: `Ordered gig: ${currentPkg.name}. Deliverables: ${currentPkg.features.join(", ")}`,
          totalAmount: currentPkg.price,
          deliveryWeeks: Math.max(1, Math.ceil(currentPkg.deliveryDays / 7))
        })
      });
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderModalOpen(false);
        setOrderSuccess(false);
        router.push("/dashboard/client");
      }, 1500);
    } catch {
      setOrderSuccess(true);
      router.push("/dashboard/client");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Service Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {service.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                {service.title}
              </h1>

              {/* Seller info bar */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800 flex-wrap">
                <img
                  src={service.freelancerAvatar}
                  alt={service.freelancerName}
                  className="h-10 w-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{service.freelancerName}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{service.rating.toFixed(2)}</span>
                    </div>
                    <span>({service.reviewCount} reviews)</span>
                    <span>&bull;</span>
                    <span>{service.salesCount} orders completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={service.coverImageUrl}
                alt={service.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>

            {/* Description */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">About This Service Package</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every order is protected by our guaranteed milestone escrow protocol. The seller does not receive payment until you verify that all package features have been delivered to your satisfaction.
              </p>
            </div>

            {/* FAQs */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-white">How does payment protection work?</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    When you order, the total amount is charged and securely held by the platform escrow. Only after you test and approve the delivered files is the payment released.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-white">Can I request revisions?</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Yes! Each package tier includes dedicated revision rounds to make sure the final result meets your exact specifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Sidebar */}
          <div>
            <div className="glass-panel p-6 rounded-3xl sticky top-24 border border-indigo-500/30 shadow-2xl space-y-6">
              {/* Package Tiers Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                {(["BASIC", "STANDARD", "PREMIUM"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      selectedTier === tier
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* Active Tier Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{currentPkg.name}</h3>
                  <span className="text-[11px] text-slate-400">{selectedTier} Tier Package</span>
                </div>
                <span className="text-2xl font-black text-white">${currentPkg.price}</span>
              </div>

              {/* Delivery Meta */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>{currentPkg.deliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-emerald-400" />
                  <span>{currentPkg.revisions} Revisions Included</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  What's Included:
                </span>
                {currentPkg.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA Order Button */}
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Continue (${currentPkg.price})</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href={`/dashboard/client/messages?freelancerId=${service.freelancerId}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact {service.freelancerName}</span>
              </Link>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  Escrow Protected &bull; 100% Satisfaction Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-800 space-y-4">
            {orderSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Escrow Payment Locked & Order Dispatched!</h3>
                <p className="text-xs text-slate-400">Opening your Client Workspace...</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">Confirm Service Order</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are purchasing <strong className="text-white">"{service.title}"</strong> ({selectedTier} Package).
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Package Price:</span>
                    <span className="font-bold text-white">${currentPkg.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Escrow Protection Fee:</span>
                    <span className="text-emerald-400 font-bold">$0.00 (FREE)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Deposit:</span>
                    <span className="text-indigo-400">${currentPkg.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setOrderModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrder}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                  >
                    Authorize Escrow Deposit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
