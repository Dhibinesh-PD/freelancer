"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Terminal,
  Sliders
} from "lucide-react";
import Link from "next/link";

export default function AdminProvisioningPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("ApexAdmin2026!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "ADMIN",
          name,
          email,
          password,
          adminSecret
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Failed to provision administrator account.");
        setLoading(false);
        return;
      }

      setSuccessMsg(`Administrator privileges provisioned for ${data.data.name}! Launching Security Portal...`);
      setTimeout(() => {
        router.push(data.redirectUrl || "/admin");
      }, 900);
    } catch (err: any) {
      setErrorMsg("Network error during provisioning. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06080e] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 glass-panel p-8 sm:p-10 rounded-3xl max-w-lg w-full border border-rose-500/25 shadow-2xl shadow-rose-950/60 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Platform Administration Provisioning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Provision <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400">Admin Account</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create an administrative user with governance rights, audit inspection, and user moderation capabilities.
            </p>
          </div>

          {/* Master Key Hint Box */}
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-200">Default Provisioning Secret Key</div>
              <div className="font-mono text-rose-300 text-[11px] mt-0.5">ApexAdmin2026!</div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Administrator Full Name</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Operations Manager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Administrator Work Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin.ops@apexlance.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Master Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Administrator Provisioning Secret</label>
              <div className="relative">
                <KeyRound className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter Secret Key"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-rose-500"
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
                  <span>Provision Administrator Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center pt-2 border-t border-slate-800/80 text-xs">
            <Link href="/login/admin" className="font-semibold text-rose-400 hover:underline">
              &larr; Return to Administrator Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
