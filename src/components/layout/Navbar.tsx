"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Briefcase, 
  Layers, 
  Users, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  UserCheck,
  MessageSquare,
  LogOut,
  User
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"client" | "freelancer" | "admin">("client");
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
    avatarUrl?: string;
  } | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/v1/auth/me");
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentUser(json.data);
          if (json.data.role === "FREELANCER") setActiveRole("freelancer");
          else if (json.data.role === "ADMIN" || json.data.role === "SUPER_ADMIN") setActiveRole("admin");
          else setActiveRole("client");
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthLoaded(true);
      }
    }
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      setCurrentUser(null);
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top Announcement & Role Demo Bar */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-400">Escrow Protected</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">Separate Dedicated Portals for Clients, Freelancers & Admins</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Signed in as:</span>
                <span className="font-semibold text-white">{currentUser.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px]">
                  {currentUser.role}
                </span>
                <Link
                  href={
                    currentUser.role === "FREELANCER"
                      ? "/dashboard/freelancer"
                      : currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN"
                      ? "/admin"
                      : "/dashboard/client"
                  }
                  className="font-semibold text-indigo-400 hover:text-indigo-300 underline ml-1"
                >
                  My Portal &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden sm:inline">Dual-Custody Escrow Protection</span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <Link href="/how-it-works" className="text-indigo-400 hover:text-indigo-300 underline font-medium">
                  How Escrow Works &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Apex<span className="text-indigo-400">Lance</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Global Talent & Service Marketplace</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              href="/freelancers" 
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              Find Talent
            </Link>
            <Link 
              href="/services" 
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              Browse Services
            </Link>
            <Link 
              href="/jobs" 
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              Find Jobs
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              How It Works
            </Link>
            <Link 
              href="/pricing" 
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              Pricing
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Messages Option: ONLY APPEARS AFTER LOGIN */}
            {currentUser && (
              <Link
                href={
                  currentUser.role === "FREELANCER"
                    ? "/dashboard/freelancer/messages"
                    : "/dashboard/client/messages"
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition shadow-sm"
                title={`${currentUser.role === "FREELANCER" ? "Freelancer" : "Client"} Messages & Chat`}
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>Messages</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </Link>
            )}

            {/* If Client or Visitor: Post a Job. If Freelancer: Browse Jobs */}
            {(!currentUser || currentUser.role === "CLIENT") && (
              <Link
                href="/dashboard/client/jobs/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition"
              >
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                Post a Job
              </Link>
            )}

            {/* Authenticated User Profile & Sign Out OR Public Sign In / Register Dropdowns */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    currentUser.role === "FREELANCER"
                      ? "/dashboard/freelancer"
                      : currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN"
                      ? "/admin"
                      : "/dashboard/client"
                  }
                  className="flex items-center gap-2 p-1 pl-2.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs text-white transition group"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-full w-full object-cover" />
                    ) : (
                      currentUser.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs group-hover:text-indigo-300 transition truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {currentUser.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Sign In Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setLoginDropdownOpen(true)}
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition rounded-lg hover:bg-slate-900"
                  >
                    <span>Sign In</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  {loginDropdownOpen && (
                    <div className="absolute right-0 top-full pt-1.5 w-52 z-50 animate-fadeIn">
                      <div className="glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl bg-slate-950/95 space-y-1">
                        <Link
                          href="/login/client"
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-600/20 hover:text-white text-slate-300 text-xs transition"
                        >
                          <Briefcase className="h-4 w-4 text-indigo-400" />
                          <div>
                            <div className="font-bold">Client Login</div>
                            <div className="text-[10px] text-slate-400">Hire & Manage</div>
                          </div>
                        </Link>

                        <Link
                          href="/login/freelancer"
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-600/20 hover:text-white text-slate-300 text-xs transition"
                        >
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <div>
                            <div className="font-bold">Freelancer Login</div>
                            <div className="text-[10px] text-slate-400">Proposals & Earnings</div>
                          </div>
                        </Link>

                        <Link
                          href="/login/admin"
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-600/20 hover:text-white text-slate-300 text-xs transition"
                        >
                          <ShieldCheck className="h-4 w-4 text-rose-400" />
                          <div>
                            <div className="font-bold">Admin Portal</div>
                            <div className="text-[10px] text-slate-400">Governance & Security</div>
                          </div>
                        </Link>

                        <div className="pt-1 border-t border-slate-800">
                          <Link
                            href="/login"
                            className="block text-center py-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            All Portals Gateway &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Register / Get Started Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setRegisterDropdownOpen(true)}
                  onMouseLeave={() => setRegisterDropdownOpen(false)}
                >
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition"
                  >
                    <span>Get Started</span>
                    <ChevronDown className="h-3.5 w-3.5 text-indigo-200" />
                  </Link>

                  {registerDropdownOpen && (
                    <div className="absolute right-0 top-full pt-1.5 w-52 z-50 animate-fadeIn">
                      <div className="glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl bg-slate-950/95 space-y-1">
                        <Link
                          href="/register/client"
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-600/20 hover:text-white text-slate-300 text-xs transition"
                        >
                          <Briefcase className="h-4 w-4 text-indigo-400" />
                          <div>
                            <div className="font-bold">Join as Client</div>
                            <div className="text-[10px] text-slate-400">Post jobs & hire talent</div>
                          </div>
                        </Link>

                        <Link
                          href="/register/freelancer"
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-600/20 hover:text-white text-slate-300 text-xs transition"
                        >
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                          <div>
                            <div className="font-bold">Join as Freelancer</div>
                            <div className="text-[10px] text-slate-400">Work & earn globally</div>
                          </div>
                        </Link>

                        <div className="pt-1 border-t border-slate-800">
                          <Link
                            href="/register"
                            className="block text-center py-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            Account Selection Hub &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link href="/freelancers" className="px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
              Find Talent
            </Link>
            <Link href="/services" className="px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
              Browse Services (Gigs)
            </Link>
            <Link href="/jobs" className="px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
              Find Jobs
            </Link>
            <Link href="/how-it-works" className="px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
              How It Works
            </Link>
            <Link href="/pricing" className="px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
              Pricing
            </Link>

            {/* Mobile Drawer Message Option: ONLY APPEARS AFTER LOGIN */}
            {currentUser && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <Link
                  href={currentUser.role === "FREELANCER" ? "/dashboard/freelancer/messages" : "/dashboard/client/messages"}
                  className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">
                        {currentUser.role === "FREELANCER" ? "Freelancer Messages" : "Client Messages"}
                      </div>
                      <div className="text-[9px] text-indigo-300">Open Real-Time Chat</div>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </Link>
              </div>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Dedicated Logins
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <Link
                href="/login/client"
                className="text-center py-2 px-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
              >
                Client Login
              </Link>
              <Link
                href="/login/freelancer"
                className="text-center py-2 px-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
              >
                Freelancer
              </Link>
              <Link
                href="/login/admin"
                className="text-center py-2 px-1 rounded-lg bg-rose-600/20 text-rose-300 border border-red-500/30 text-xs font-semibold"
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/register/client"
              className="w-full text-center py-2.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-md"
            >
              Sign Up as Client
            </Link>
            <Link
              href="/register/freelancer"
              className="w-full text-center py-2.5 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-md"
            >
              Sign Up as Freelancer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
