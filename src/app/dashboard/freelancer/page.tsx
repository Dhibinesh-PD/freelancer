"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_FREELANCERS } from "@/lib/data/seed-data";
import { 
  Wallet, 
  TrendingUp, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Star, 
  PlusCircle, 
  Send,
  Upload,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function FreelancerDashboardPage() {
  const [freelancer, setFreelancer] = useState<any>(SEED_FREELANCERS[0]);

  const [availableBalance, setAvailableBalance] = useState(4250);
  const [withdrawnSuccess, setWithdrawnSuccess] = useState(false);
  const [deliverableModal, setDeliverableModal] = useState<string | null>(null);
  const [deliverableNote, setDeliverableNote] = useState("");
  const [deliverableSuccess, setDeliverableSuccess] = useState(false);

  useEffect(() => {
    async function loadFreelancer() {
      try {
        const res = await fetch("/api/v1/auth/me");
        const json = await res.json();
        if (json.success && json.data) {
          const user = json.data;
          setFreelancer((prev: any) => ({
            ...prev,
            name: user.name || prev.name,
            username: user.username || prev.username,
            avatarUrl: user.avatarUrl || prev.avatarUrl,
            title: user.title || prev.title || "Elite Professional Specialist"
          }));
        }
      } catch (err) {
        console.warn("Silent auth load error", err);
      }
    }
    loadFreelancer();
  }, []);

  const handleWithdraw = () => {
    if (availableBalance <= 0) return;
    setWithdrawnSuccess(true);
    setAvailableBalance(0);
    setTimeout(() => setWithdrawnSuccess(false), 3000);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliverableSuccess(true);
    setTimeout(() => {
      setDeliverableModal(null);
      setDeliverableSuccess(false);
      setDeliverableNote("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Top Session & Security Bar */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Active Freelancer Account:</span>
            <span className="font-bold text-white bg-emerald-600/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
              {freelancer.name}
            </span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Private & Isolated Freelancer Workspace
            </span>
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={freelancer.avatarUrl}
              alt={freelancer.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{freelancer.name}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  TOP RATED
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium">{freelancer.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/freelancer/messages"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>Messages</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </Link>
            <Link
              href="/jobs"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              Search Open Jobs
            </Link>
            <Link
              href={`/freelancers/${freelancer.username}`}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              Public Profile View
            </Link>
          </div>
        </div>

        {/* Withdrawal Success Notice */}
        {withdrawnSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Payout initiated! $4,250.00 transferred via Stripe Connect to your registered bank account.</span>
          </div>
        )}

        {/* Financial & Profile Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Available to Withdraw</span>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-white">${availableBalance.toLocaleString()}.00</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Direct ACH / Stripe</span>
              <button
                onClick={handleWithdraw}
                disabled={availableBalance === 0}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 underline"
              >
                Withdraw Now &rarr;
              </button>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Held in Client Escrow</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-white">$1,000.00</span>
            <p className="text-[11px] text-slate-400 mt-1">Pending deliverable approval</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Lifetime Earnings</span>
              <TrendingUp className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-black text-white">${freelancer.totalEarnings.toLocaleString()}</span>
            <p className="text-[11px] text-emerald-400 mt-1">52 completed contracts</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Profile Completeness</span>
              <Star className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-2xl font-black text-white">95%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full w-[95%]" />
            </div>
          </div>
        </div>

        {/* Active Workroom & Milestones */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Ongoing Contract Deliverables</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submit completed work files for client review and escrow release.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Escrow Guaranteed
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">AWS Kubernetes Infrastructure Setup</h3>
                <span className="text-xs text-indigo-300 font-medium">
                  Client: David Sterling (Lumina Tech) &bull; Contract Value: $3,500
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400">ACTIVE CONTRACT</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">Milestone 1: Terraform EKS Cluster & VPC setup</span>
                  <span className="text-emerald-400 font-semibold block text-[11px]">Paid & Cleared: $1,500</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  COMPLETED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">Milestone 2: GitHub Actions CI/CD pipeline</span>
                  <span className="text-amber-400 font-semibold block text-[11px]">Funded in Escrow: $1,000</span>
                </div>
                <button
                  onClick={() => setDeliverableModal("Milestone 2")}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Submit Deliverable</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">Milestone 3: Datadog Monitoring & Final Handover</span>
                  <span className="text-slate-400 block text-[11px]">Upcoming ($1,000)</span>
                </div>
                <span className="text-slate-500 font-medium">PENDING PREVIOUS MILESTONE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Deliverable Submission Modal */}
      {deliverableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-800 space-y-4">
            {deliverableSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Deliverable Sent to Client!</h3>
                <p className="text-xs text-slate-400">Client has been notified to review and release funds.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Submit Work for {deliverableModal}</h3>
                <p className="text-xs text-slate-400">
                  Provide deliverable links (GitHub repo, live preview, documents) and notes for client approval.
                </p>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Deliverable Notes / Repository Link</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. CI/CD workflow is merged and tested. Check the repository at github.com/lumina/infra..."
                    value={deliverableNote}
                    onChange={(e) => setDeliverableNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeliverableModal(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit for Approval</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
