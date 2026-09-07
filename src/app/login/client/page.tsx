"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Briefcase, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Users
} from "lucide-react";
import Link from "next/link";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isRoleMismatch, setIsRoleMismatch] = useState(false);

  const handleFillDemo = () => {
    setEmail("david.sterling@lumina.tech");
    setPassword("Client@123456");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setIsRoleMismatch(false);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          requiredRole: "CLIENT"
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error?.code === "ROLE_MISMATCH") {
          setIsRoleMismatch(true);
        }
        setErrorMsg(data.error?.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      setSuccessMsg(`Welcome back, ${data.data.name}! Redirecting to Client Workspace...`);
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard/client");
      }, 750);
    } catch (err: any) {
      setErrorMsg("Network error occurred. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 glass-panel p-8 sm:p-10 rounded-3xl max-w-lg w-full border border-indigo-500/25 shadow-2xl shadow-indigo-950/60 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Enterprise & Client Portal</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In as <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Client</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Manage your engineering contracts, inspect deliverables, and release escrow-secured milestones.
            </p>
          </div>

          {/* Quick Demo Autofill Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-indigo-300" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">Demo Enterprise Client</div>
                <div className="text-[11px] text-slate-400 font-mono">david.sterling@lumina.tech</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition active:scale-95 whitespace-nowrap"
            >
              ⚡ Fill Demo Credentials
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p>{errorMsg}</p>
                {isRoleMismatch && (
                  <div className="pt-1">
                    <Link
                      href="/login/freelancer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:underline"
                    >
                      Go to Freelancer Login Portal &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Signin Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Client / Company Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Client Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Security</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Escrow Held</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Talent</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Top 1% Vetted</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Contracts</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Milestone SLA</div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2 pt-2 text-center text-xs">
            <div className="text-slate-400">
              Need a Client account?{" "}
              <Link href="/register/client" className="font-semibold text-indigo-400 hover:underline">
                Register company &rarr;
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-2">
              <Link href="/login/freelancer" className="hover:text-emerald-400 transition">
                Freelancer Portal
              </Link>
              <span>•</span>
              <Link href="/login/admin" className="hover:text-rose-400 transition">
                Admin Portal
              </Link>
              <span>•</span>
              <Link href="/login" className="hover:text-slate-300 transition">
                All Portals
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
