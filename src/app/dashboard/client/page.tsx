"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Briefcase, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Building2,
  Globe,
  Star,
  Layers,
  FileText,
  Send,
  Sliders,
  Sparkles,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Activity,
  Check,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "proposals" | "contracts" | "settings">("overview");
  const [actionMessage, setActionMessage] = useState<string>("");
  const [actionType, setActionType] = useState<"success" | "error">("success");

  // Profile Edit State
  const [editCompany, setEditCompany] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const loadClientOverview = async (clientId?: string) => {
    try {
      setLoading(true);
      const url = clientId 
        ? `/api/v1/client/overview?clientId=${encodeURIComponent(clientId)}`
        : `/api/v1/client/overview`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && json.data) {
        setOverviewData(json.data);
        if (!selectedClientId && json.data.client?.id) {
          setSelectedClientId(json.data.client.id);
        }
        setEditCompany(json.data.client?.companyName || "");
        setEditIndustry(json.data.client?.industry || "");
        setEditCountry(json.data.client?.country || "United States");
      }
    } catch (err) {
      console.error("Failed to load client overview", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientOverview();
  }, []);

  const handleSwitchClient = (newClientId: string) => {
    setSelectedClientId(newClientId);
    loadClientOverview(newClientId);
    setActionMessage("");
  };

  const handleFundMilestone = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/v1/contracts/${contractId}/milestones/${milestoneId}/fund`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        setActionType("success");
        loadClientOverview(selectedClientId);
      } else {
        setActionMessage(data.error?.message || "Failed to fund milestone");
        setActionType("error");
      }
    } catch {
      setActionMessage("Network error funding milestone");
      setActionType("error");
    }
  };

  const handleApproveMilestone = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/v1/contracts/${contractId}/milestones/${milestoneId}/approve`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        setActionType("success");
        loadClientOverview(selectedClientId);
      } else {
        setActionMessage(data.error?.message || "Failed to approve milestone");
        setActionType("error");
      }
    } catch {
      setActionMessage("Network error approving milestone");
      setActionType("error");
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/v1/client/proposals/${proposalId}/accept?clientId=${selectedClientId}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Proposal accepted! A new contract has been initialized with funded escrow.");
        setActionType("success");
        loadClientOverview(selectedClientId);
      } else {
        setActionMessage(data.error?.message || "Failed to accept proposal");
        setActionType("error");
      }
    } catch {
      setActionMessage("Network error accepting proposal");
      setActionType("error");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch(`/api/v1/client/profile?clientId=${selectedClientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: editCompany,
          industry: editIndustry,
          country: editCountry
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Company profile updated successfully!");
        setActionType("success");
        loadClientOverview(selectedClientId);
      } else {
        setActionMessage("Failed to update profile");
        setActionType("error");
      }
    } catch {
      setActionMessage("Network error updating profile");
      setActionType("error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const client = overviewData?.client;
  const user = overviewData?.user;
  const stats = overviewData?.stats || {
    totalSpent: 0,
    totalEscrowHeld: 0,
    activeContractsCount: 0,
    jobsPostedCount: 0,
    proposalsReceivedCount: 0,
    rating: 5.0
  };
  const jobs = overviewData?.jobs || [];
  const proposals = overviewData?.proposals || [];
  const contracts = overviewData?.contracts || [];
  const recentActivity = overviewData?.recentActivity || [];
  const allClients = overviewData?.allClients || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Switcher & Persona Bar */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Active Client Account:</span>
            <span className="font-bold text-white bg-indigo-600/20 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
              {client?.name} ({client?.companyName})
            </span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Private & Isolated Enterprise Workspace
            </span>
          </div>

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && allClients && allClients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 hidden sm:inline flex items-center gap-1 font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Admin Client Inspector:
              </span>
              <select
                value={selectedClientId}
                onChange={(e) => handleSwitchClient(e.target.value)}
                className="bg-slate-950 text-indigo-300 text-xs font-semibold py-1 px-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              >
                {allClients.map((cl: any) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} — {cl.companyName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            actionType === "success" 
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}>
            <div className="flex items-center gap-2.5">
              {actionType === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400" />
              )}
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage("")} className="text-slate-400 hover:text-white text-base">
              &times;
            </button>
          </div>
        )}

        {/* Personalized Header & Company Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5 shadow-xl shadow-indigo-600/30 flex-shrink-0">
                <img
                  src={client?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
                  alt={client?.name}
                  className="h-full w-full object-cover rounded-[14px]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {client?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Enterprise
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1 text-indigo-300 font-medium">
                    <Building2 className="h-3.5 w-3.5" />
                    {client?.companyName}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">{client?.industry || "Technology & Software"}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                    {client?.country || "United States"}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {stats.rating.toFixed(2)} Client Score
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/client/messages"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-indigo-500/30 text-xs sm:text-sm font-semibold transition"
              >
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span>Live Chat</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </Link>
              <Link
                href="/dashboard/client/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-indigo-600/30 transition active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post New Job</span>
              </Link>
              <Link
                href="/freelancers"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
              >
                <Search className="h-4 w-4 text-indigo-400" />
                <span>Find Talent</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Individual KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Total Capital Invested</span>
              <DollarSign className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ${stats.totalSpent.toLocaleString()}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1">Verified payouts & milestones</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Escrow Held In-Flight</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ${stats.totalEscrowHeld.toLocaleString()}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1">100% smart escrow guarantee</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>My Posted Projects</span>
              <Briefcase className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {stats.jobsPostedCount}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Projects published by {client?.name}</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Proposals Received</span>
              <FileText className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {stats.proposalsReceivedCount}
            </span>
            <p className="text-[11px] text-amber-400 mt-1">Awaiting your evaluation</p>
          </div>
        </div>

        {/* Sub-Navigation Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Overview & Milestones
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === "jobs"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>My Posted Jobs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {jobs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === "proposals"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>Candidate Proposals</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              {proposals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("contracts")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === "contracts"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>Active Contracts & Escrow</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              {contracts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 ${
              activeTab === "settings"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Company Profile & Settings
          </button>
          <Link
            href="/dashboard/client/messages"
            className="pb-3 px-3 text-xs sm:text-sm font-bold transition whitespace-nowrap border-b-2 border-transparent text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Real-Time Messages</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </Link>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Active Milestone Escrow Workspaces */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>Live Milestone Escrow Workspace</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Contracts and milestones specifically active for {client?.companyName}.
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Total Active: <span className="text-white font-bold">{contracts.length}</span>
                </div>
              </div>

              {contracts.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                  <Briefcase className="h-10 w-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-white">No Active Contracts Yet</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When you accept proposals from top freelancers, milestone escrow contracts will appear here for funding and deliverable approvals.
                  </p>
                  <Link
                    href="/dashboard/client/jobs/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
                  >
                    Post a Project Now &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((ctr: any) => (
                    <div key={ctr.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{ctr.id}</span>
                          <h3 className="text-sm sm:text-base font-bold text-white">{ctr.jobTitle}</h3>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Freelancer: <span className="text-indigo-400 font-semibold">{ctr.freelancerName}</span> • Total Value: <span className="text-emerald-400 font-bold">${ctr.totalAmount}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-center">
                          {ctr.status}
                        </span>
                      </div>

                      {/* Milestones list */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Contract Milestones:
                        </span>
                        {ctr.milestones.map((m: any) => (
                          <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{m.title}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                                  m.status === "FUNDED" ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"
                                }`}>
                                  {m.status}
                                </span>
                              </div>
                              {m.deliverableNote && (
                                <p className="text-[11px] text-slate-400 italic">
                                  Deliverable: "{m.deliverableNote}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-200">${m.amount}</span>
                              {m.status === "PENDING" && (
                                <button
                                  onClick={() => handleFundMilestone(ctr.id, m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-sm"
                                >
                                  Fund Escrow
                                </button>
                              )}
                              {m.status === "FUNDED" && (
                                <button
                                  onClick={() => handleApproveMilestone(ctr.id, m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-sm"
                                >
                                  Approve & Release
                                </button>
                              )}
                              {m.status === "APPROVED" && (
                                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" />
                                  Funds Released
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" />
                <span>Enterprise Audit Stream</span>
              </h2>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-slate-400">No activity logged for this client yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((log: any) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase block">
                          {log.action}
                        </span>
                        <p className="text-slate-300 text-xs">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY POSTED JOBS */}
        {activeTab === "jobs" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Jobs Posted by {client?.companyName}</h2>
                <p className="text-xs text-slate-400">Manage listings, edit budgets, and inspect received proposals.</p>
              </div>
              <Link
                href="/dashboard/client/jobs/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md self-start sm:self-center"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post New Job</span>
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center space-y-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <Briefcase className="h-10 w-10 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-white">You haven't posted any jobs yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Create your first project listing to receive proposals from world-class developers and designers.
                </p>
                <Link
                  href="/dashboard/client/jobs/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Post a Job &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <div key={job.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                            {job.category}
                          </span>
                          <span className="text-[10px] text-slate-400">Posted {job.postedAt}</span>
                        </div>
                        <h3 className="text-base font-bold text-white hover:text-indigo-300 transition">
                          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>
                      </div>

                      <div className="sm:text-right flex-shrink-0">
                        <div className="text-sm font-black text-emerald-400">
                          {job.budgetType === "FIXED" ? `$${job.budgetMin} - $${job.budgetMax}` : `$${job.budgetMin}/hr - $${job.budgetMax}/hr`}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{job.budgetType} Budget</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((sk: string) => (
                          <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab("proposals")}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                        >
                          Review Proposals ({proposals.filter((p: any) => p.jobId === job.id).length})
                        </button>
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="View public job posting"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CANDIDATE PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Proposals Submitted to Your Projects</h2>
              <p className="text-xs text-slate-400">Review candidate bids, cover letters, and accept proposals to initialize escrow.</p>
            </div>

            {proposals.length === 0 ? (
              <div className="p-12 text-center space-y-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-white">No proposals received yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Freelancers will submit competitive proposals and bids for your open project listings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((prop: any) => {
                  const matchingJob = jobs.find((j: any) => j.id === prop.jobId);
                  return (
                    <div key={prop.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.freelancerAvatar}
                            alt={prop.freelancerName}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                              <span>{prop.freelancerName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                Top Specialist
                              </span>
                            </h3>
                            <div className="text-xs text-slate-400">
                              Applied for: <span className="text-indigo-300 font-medium">{matchingJob?.title || prop.jobId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <div className="text-lg font-black text-emerald-400">
                            ${prop.bidAmount.toLocaleString()}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Timeline: {prop.deliveryDays} Days
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Cover Letter:
                        </span>
                        {prop.coverLetter}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2">
                        <span className="text-[11px] text-slate-500">Submitted {prop.createdAt}</span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/client/messages?freelancerId=${prop.freelancerId}`}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700/80"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Chat</span>
                          </Link>

                          {prop.status === "ACCEPTED" ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5" />
                              Contract Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAcceptProposal(prop.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/25 active:scale-95"
                            >
                              Accept & Fund (${prop.bidAmount})
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTRACTS & ESCROW */}
        {activeTab === "contracts" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Contracts & Escrow Ledger</h2>
              <p className="text-xs text-slate-400">Full audit breakdown of locked escrow capital, released payouts, and milestone status.</p>
            </div>

            {contracts.length === 0 ? (
              <div className="p-12 text-center space-y-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck className="h-10 w-10 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-white">No contracts created yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Accepting a proposal creates an institutional milestone contract holding funds in dual-custody escrow.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {contracts.map((ctr: any) => (
                  <div key={ctr.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-400 font-bold">{ctr.id}</span>
                        <h3 className="text-base font-bold text-white">{ctr.jobTitle}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-400">Assigned Engineer: <strong className="text-white">{ctr.freelancerName}</strong></p>
                          <Link
                            href={`/dashboard/client/messages?freelancerId=${ctr.freelancerId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-[11px] font-semibold border border-indigo-500/30 transition"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Chat Live</span>
                          </Link>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-lg font-black text-white">${ctr.totalAmount}</span>
                        <span className="text-xs text-emerald-400 block font-semibold">Dual-Custody Escrow</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">Milestones & Approvals</span>
                      {ctr.milestones.map((m: any, idx: number) => (
                        <div key={m.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-white">
                              Milestone {idx + 1}: {m.title}
                            </div>
                            {m.deliverableNote && (
                              <p className="text-[11px] text-slate-400 mt-0.5 italic">{m.deliverableNote}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-200">${m.amount}</span>
                            {m.status === "PENDING" && (
                              <button
                                onClick={() => handleFundMilestone(ctr.id, m.id)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                              >
                                Fund Escrow
                              </button>
                            )}
                            {m.status === "FUNDED" && (
                              <button
                                onClick={() => handleApproveMilestone(ctr.id, m.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                              >
                                Approve & Release Funds
                              </button>
                            )}
                            {m.status === "APPROVED" && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="h-4 w-4" /> Released
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: COMPANY PROFILE & SETTINGS */}
        {activeTab === "settings" && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Enterprise Profile Settings</h2>
              <p className="text-xs text-slate-400">Update company details visible to freelancers and on project listings.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Industry</label>
                <input
                  type="text"
                  required
                  value={editIndustry}
                  onChange={(e) => setEditIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Country / Headquarters</label>
                <input
                  type="text"
                  required
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {isUpdatingProfile ? "Saving..." : "Save Company Profile"}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
