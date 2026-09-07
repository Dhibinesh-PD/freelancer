"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_JOBS } from "@/lib/data/seed-data";
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Send,
  Building,
  User,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const job = SEED_JOBS.find(j => j.slug === slug || j.id === slug) || SEED_JOBS[0];

  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState(job.budgetMax.toString());
  const [deliveryDays, setDeliveryDays] = useState("21");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/jobs/${job.id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: "fl-1",
          coverLetter,
          bidAmount: Number(bidAmount),
          deliveryDays: Number(deliveryDays)
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Your proposal has been submitted successfully to the client!");
        setTimeout(() => {
          router.push("/dashboard/freelancer");
        }, 2000);
      } else {
        alert(data.error?.message || "Failed to submit proposal");
      }
    } catch {
      alert("Error submitting proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Description & Bid Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {job.category}
                </span>
                <span className="text-xs text-slate-400">Posted {job.postedAt}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {job.title}
              </h1>

              {/* Budget Badge Bar */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Budget Range</span>
                  <span className="text-base font-extrabold text-white">${job.budgetMin} - ${job.budgetMax}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contract Type</span>
                  <span className="text-base font-extrabold text-indigo-400">
                    {job.budgetType === "FIXED" ? "Fixed Escrow" : "Hourly"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                  <span className="text-base font-extrabold text-white">{job.durationWeeks} Weeks</span>
                </div>
              </div>

              {/* Scope */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-white">Project Scope & Deliverables</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Skills */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Skills & Expertise Required
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proposal Submission Form */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-400" />
                <span>Submit Your Proposal</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demonstrate your expertise, outline your milestone breakdown, and submit a competitive bid. Milestone funds will be deposited into escrow before you begin work.
              </p>

              {successMessage ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-emerald-300">Proposal Submitted!</h4>
                  <p className="text-xs text-slate-300">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitProposal} className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Your Proposed Total Bid ($ USD)
                      </label>
                      <input
                        type="number"
                        required
                        min={100}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        You'll receive ~${(Number(bidAmount) * 0.9).toFixed(0)} after 10% platform fee
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Estimated Delivery (Days)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Cover Letter / Technical Pitch
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Explain your approach, link relevant past portfolio case studies, and suggest milestone phases..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Send Proposal to Client"}</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Client Reputation Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                About the Client
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-bold text-white">{job.clientCompany}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-300">{job.clientName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-slate-300">{job.clientCountry}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400 fill-current shrink-0" />
                  <span className="text-white font-semibold">{job.clientRating.toFixed(2)} Client Rating</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-semibold">${(job.clientTotalSpent / 1000).toFixed(0)}k+ Total Spent</span>
                </div>

                <Link
                  href={`/dashboard/freelancer/messages?clientId=${job.clientProfileId || "cl-1"}`}
                  className="w-full mt-3 py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message Client Directly</span>
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Escrow Guarantee
              </h3>
              <p className="leading-relaxed text-slate-400">
                Upon proposal acceptance, the client funds milestone escrow before you begin work. If work meets agreed specifications, funds are guaranteed to be released.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
