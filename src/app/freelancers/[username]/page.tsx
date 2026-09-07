"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_FREELANCERS } from "@/lib/data/seed-data";
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Send,
  MessageSquare,
  DollarSign
} from "lucide-react";

export default function FreelancerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  const freelancer = SEED_FREELANCERS.find(f => f.username === username || f.id === username) || SEED_FREELANCERS[0];

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [offerBudget, setOfferBudget] = useState("1500");
  const [quickMsg, setQuickMsg] = useState("");
  const [hireSuccess, setHireSuccess] = useState(false);
  const [hiredContract, setHiredContract] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/client/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: freelancer.id,
          projectTitle: projectTitle || `Direct Hire Contract with ${freelancer.name}`,
          description: projectDesc || `Direct engagement established on ApexLance for ${freelancer.title}. Escrow funded.`,
          totalAmount: Number(offerBudget),
          deliveryWeeks: 4
        })
      });
      const data = await res.json();
      if (data.success) {
        setHireSuccess(true);
        setHiredContract(data.data.contract);
      } else {
        alert(data.error?.message || "Failed to complete direct hire");
      }
    } catch {
      alert("Error sending direct hire offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuickMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: freelancer.id,
          content: quickMsg.trim(),
          senderRole: "CLIENT"
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/client/messages?freelancerId=${freelancer.id}`);
      } else {
        alert(data.error?.message || "Failed to send message");
      }
    } catch {
      alert("Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Profile Card Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={freelancer.avatarUrl}
                alt={freelancer.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              />

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{freelancer.name}</h1>
                  {freelancer.isVerified && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      ID & Payment Verified
                    </span>
                  )}
                  {freelancer.isTopRated && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      TOP RATED EXPERT
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-indigo-400 mt-1">{freelancer.title}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">{freelancer.rating.toFixed(2)}</span>
                    <span className="text-slate-500 font-normal">({freelancer.reviewCount} reviews)</span>
                  </div>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {freelancer.city}, {freelancer.country}
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-semibold">{freelancer.completedJobsCount} jobs completed</span>
                  <span>&bull;</span>
                  <span>${(freelancer.totalEarnings / 1000).toFixed(0)}k+ total earnings</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <div>
                <span className="text-3xl font-black text-white">${freelancer.hourlyRate}</span>
                <span className="text-xs text-slate-400"> / hour</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto mt-2">
                <button
                  onClick={() => setHireModalOpen(true)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
                >
                  Direct Hire / Offer
                </button>
                <button
                  onClick={() => setMsgModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Direct Message"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-3">Overview & Experience</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {freelancer.overview}
              </p>
            </div>

            {/* Portfolio Projects */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-4">Featured Portfolio Case Studies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer.portfolio.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-800">
                        {item.technologies.map((tech) => (
                          <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-4">Client Feedback & Ratings</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">David Sterling (Lumina Tech)</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>5.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "Exceptional engineer! Delivered a high-throughput Next.js architecture with PostgreSQL and full automated tests ahead of schedule. Communication was flawless."
                  </p>
                  <span className="text-[10px] text-slate-500 mt-2 block">Completed 2 weeks ago &bull; $4,500 contract</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Claire Beauchamp (Nexus Health)</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>5.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "One of the best contractors we have ever worked with. Incredible attention to detail, proactive architectural suggestions, and pristine code."
                  </p>
                  <span className="text-[10px] text-slate-500 mt-2 block">Completed 1 month ago &bull; $3,200 contract</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Skills & Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Contract Invariants
              </h3>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Escrow Funded Before Work Starts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>IP Rights Transferred Upon Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>NDA & Confidentiality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Direct Hire Modal */}
      {hireModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {hireSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-white">Direct Hire Offer Dispatched!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Contract <span className="font-mono text-indigo-400 font-bold">{hiredContract?.id || "CTR-ACTIVE"}</span> has been created with ${offerBudget} deposited into platform escrow.
                </p>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Freelancer:</span>
                    <span className="text-white font-semibold">{freelancer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Project:</span>
                    <span className="text-white font-semibold">{projectTitle || `Direct Hire Contract with ${freelancer.name}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escrow Milestone 1:</span>
                    <span className="text-emerald-400 font-bold">${offerBudget} (Funded)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Real-time Channel:</span>
                    <span className="text-indigo-400 font-semibold">Active & Connected</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => router.push("/dashboard/client/messages")}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open Real-Time Chat
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/client")}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Client Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Direct Hire {freelancer.name}</h3>
                    <p className="text-xs text-slate-400">Hourly Rate: ${freelancer.hourlyRate}/hr &bull; Verified Expert</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHireModalOpen(false)}
                    className="text-slate-400 hover:text-white text-lg font-mono p-1"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contract / Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js SaaS MVP Platform Development"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Scope & Deliverables Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific milestones, core deliverables, and initial instructions for the freelancer..."
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Escrow Deposit ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        required
                        min={100}
                        step={50}
                        value={offerBudget}
                        onChange={(e) => setOfferBudget(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Delivery</label>
                    <div className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 flex items-center justify-between">
                      <span>4 Weeks</span>
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>ApexLance Escrow Protection: Funds remain locked safely until you review and explicitly authorize milestone completion.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setHireModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? "Processing Escrow..." : "Confirm & Deposit Escrow"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Direct Message Modal */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={freelancer.avatarUrl}
                  alt={freelancer.name}
                  className="h-10 w-10 rounded-xl object-cover border border-indigo-500/40"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Message with {freelancer.name}</h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online &bull; Replies within minutes
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMsgModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-mono p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendQuickMessage} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Hi ${freelancer.name}, I came across your profile and would love to discuss a project...`}
                  value={quickMsg}
                  onChange={(e) => setQuickMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                  Direct real-time delivery
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMsgModalOpen(false)}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !quickMsg.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
