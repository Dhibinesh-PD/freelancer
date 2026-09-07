"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Sliders,
  Activity,
  Terminal
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFillDemo = () => {
    setEmail("admin@apexlance.io");
    setPassword("Admin@123456");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          requiredRole: "ADMIN"
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Failed to authenticate administrator credentials.");
        setLoading(false);
        return;
      }

      setSuccessMsg(`Administrator credentials verified. Launching Security Portal...`);
      setTimeout(() => {
        router.push(data.redirectUrl || "/admin");
      }, 750);
    } catch (err: any) {
      setErrorMsg("Network error during security handshake. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06080e] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 glass-panel p-8 sm:p-10 rounded-3xl max-w-lg w-full border border-rose-500/25 shadow-2xl shadow-rose-950/60 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Platform Governance & Security Layer</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrator <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400">Sign In</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Authorized personnel only. Access system audit logs, user moderation, commission controls, and dispute arbitration.
            </p>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>All login sessions are logged to immutable Postgres audit trails.</span>
          </div>

          {/* Quick Demo Autofill Box */}
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center">
                <KeyRound className="h-4 w-4 text-rose-300" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">Super Administrator</div>
                <div className="text-[11px] text-slate-400 font-mono">admin@apexlance.io</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition active:scale-95 whitespace-nowrap"
            >
              ⚡ Fill Demo Credentials
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{errorMsg}</p>
                <p className="text-[11px] text-rose-300/80 mt-1">
                  Non-admin users should sign in through the Client or Freelancer portal.
                </p>
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
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@apexlance.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Admin Master Password</label>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-600/30 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Authenticate & Launch Admin Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Features */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Auditing</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Real-Time</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ledger</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Dual-Entry</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">KYC Level</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">Enterprise</div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2 pt-2 text-center text-xs">
            <div className="text-slate-400">
              Platform Admin Provisioning?{" "}
              <Link href="/register/admin" className="font-semibold text-rose-400 hover:underline">
                Provision New Admin &rarr;
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-2">
              <Link href="/login/client" className="hover:text-indigo-400 transition">
                Client Portal
              </Link>
              <span>•</span>
              <Link href="/login/freelancer" className="hover:text-emerald-400 transition">
                Freelancer Portal
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
