"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  DollarSign,
  Briefcase,
  Code2,
  Globe
} from "lucide-react";
import Link from "next/link";

const POPULAR_SKILLS = [
  "Next.js", "React", "TypeScript", "Node.js", "Python", "AWS", "UI/UX Design", "PostgreSQL", "Docker", "Kubernetes"
];

export default function FreelancerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [hourlyRate, setHourlyRate] = useState("85");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Next.js", "TypeScript"]);
  const [country, setCountry] = useState("United States");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

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
          role: "FREELANCER",
          name,
          email,
          title: title || "Full-Stack Specialist",
          hourlyRate: Number(hourlyRate) || 85,
          skills: selectedSkills.length > 0 ? selectedSkills : ["Web Development"],
          country,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Failed to create freelancer profile. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessMsg(`Welcome to ApexLance, ${data.data.name}! Your freelancer profile and wallet are active.`);
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard/freelancer");
      }, 900);
    } catch (err: any) {
      setErrorMsg("Network error during registration. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070d12] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 glass-panel p-8 sm:p-10 rounded-3xl max-w-xl w-full border border-emerald-500/25 shadow-2xl shadow-emerald-950/60 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Talent & Freelancer Registration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Join as an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Elite Freelancer</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Unlock direct access to global client contracts, receive guaranteed escrow payments, and showcase your services.
            </p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="elena@coder.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Title</label>
                <div className="relative">
                  <Briefcase className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Hourly Rate (USD)</label>
                <div className="relative">
                  <DollarSign className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    required
                    min={15}
                    max={500}
                    placeholder="85"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Skills Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Primary Technical Skills (Click to select)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {sk} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Country / Region</label>
                <div className="relative">
                  <Globe className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Canada"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Freelancer Profile & Activate Wallet</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center space-y-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="text-slate-400">
              Already registered as Freelancer?{" "}
              <Link href="/login/freelancer" className="font-semibold text-emerald-400 hover:underline">
                Sign In to Freelancer Portal &rarr;
              </Link>
            </div>
            <div className="text-slate-500 text-[11px]">
              Want to hire talent?{" "}
              <Link href="/register/client" className="text-indigo-400 hover:underline">
                Sign up as Client
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
