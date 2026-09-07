"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Code2,
  KeyRound,
  Layers,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"CLIENT" | "FREELANCER" | "ADMIN">("CLIENT");
  const [email, setEmail] = useState("david.sterling@lumina.tech");
  const [password, setPassword] = useState("Client@123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleTabChange = (role: "CLIENT" | "FREELANCER" | "ADMIN") => {
    setActiveTab(role);
    setErrorMsg("");
    setSuccessMsg("");
    if (role === "CLIENT") {
      setEmail("david.sterling@lumina.tech");
      setPassword("Client@123456");
    } else if (role === "FREELANCER") {
      setEmail("alex.chen@apexlance.io");
      setPassword("Freelancer@123456");
    } else {
      setEmail("admin@apexlance.io");
      setPassword("Admin@123456");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          requiredRole: activeTab
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      setSuccessMsg(`Welcome, ${data.data.name}! Redirecting to ${activeTab.toLowerCase()} workspace...`);
      setTimeout(() => {
        router.push(data.redirectUrl || "/");
      }, 750);
    } catch (err: any) {
      setErrorMsg("Network error occurred. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>ApexLance Multi-Role Authentication Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Dedicated{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Portal
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            ApexLance offers separate security-hardened authentication portals for Clients, Freelancers, and Platform Administrators.
          </p>
        </div>

        {/* 3 Dedicated Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Client Portal */}
          <div className="group relative rounded-3xl p-7 bg-slate-900/60 border border-indigo-500/25 hover:border-indigo-500/60 shadow-xl shadow-indigo-950/40 hover:shadow-indigo-900/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-600/20 transition" />

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                <Briefcase className="h-7 w-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Hiring & Enterprise</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Client Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Post high-priority projects, review verified engineer proposals, fund escrow milestones, and manage ongoing deliverables.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Escrow-guaranteed milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Direct team & freelancer chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Verified invoices & timesheets</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <Link
                href="/login/client"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>Open Dedicated Client Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="text-center text-[11px] text-slate-500">
                Demo: <span className="text-indigo-400 font-mono">david.sterling@lumina.tech</span>
              </div>
            </div>
          </div>

          {/* Card 2: Freelancer Portal */}
          <div className="group relative rounded-3xl p-7 bg-slate-900/60 border border-emerald-500/25 hover:border-emerald-500/60 shadow-xl shadow-emerald-950/40 hover:shadow-emerald-900/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-600/20 transition" />

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Sparkles className="h-7 w-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Talent & Agencies</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Freelancer Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Browse enterprise IT & creative contracts, submit competitive proposals, showcase service packages, and receive instant payouts.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Direct escrow fund releases</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Publish customized gig packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Global payments in USD & crypto</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <Link
                href="/login/freelancer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>Open Dedicated Freelancer Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="text-center text-[11px] text-slate-500">
                Demo: <span className="text-emerald-400 font-mono">alex.chen@apexlance.io</span>
              </div>
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div className="group relative rounded-3xl p-7 bg-slate-900/60 border border-rose-500/25 hover:border-rose-500/60 shadow-xl shadow-rose-950/40 hover:shadow-rose-900/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/20 transition" />

            <div className="space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Security & Governance</span>
                <h3 className="text-xl font-bold text-white mt-0.5">Administrator Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Platform oversight, dispute arbitration, user suspension/verification, financial ledger monitoring, and platform fee configurations.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>Real-time Postgres audit logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>User moderation & KYC approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>Financial commission controls</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <Link
                href="/login/admin"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 group-hover:gap-3"
              >
                <span>Open Dedicated Admin Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="text-center text-[11px] text-slate-500">
                Demo: <span className="text-rose-400 font-mono">admin@apexlance.io</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Multi-Role Instant Login Form Section */}
        <div className="max-w-xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">Instant Multi-Role Sign In</h2>
            <p className="text-xs text-slate-400">
              Select your role tab below to authenticate immediately from this gateway.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => handleTabChange("CLIENT")}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "CLIENT"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("FREELANCER")}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "FREELANCER"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Freelancer</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("ADMIN")}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === "ADMIN"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {activeTab === "CLIENT" ? "Client Email" : activeTab === "FREELANCER" ? "Freelancer Email" : "Admin Email"}
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                activeTab === "CLIENT"
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                  : activeTab === "FREELANCER"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
              }`}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as {activeTab}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
