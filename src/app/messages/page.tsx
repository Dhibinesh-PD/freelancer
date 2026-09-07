"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RealtimeMessagingCenter } from "@/components/messaging/RealtimeMessagingCenter";
import { 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  Sparkles
} from "lucide-react";
import Link from "next/link";

function MessagesContent() {
  const searchParams = useSearchParams();
  const urlRole = searchParams.get("role")?.toLowerCase();
  const urlFreelancerId = searchParams.get("freelancerId");
  const urlClientId = searchParams.get("clientId");

  const [authUser, setAuthUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [adminSelectedRole, setAdminSelectedRole] = useState<"client" | "freelancer">("client");

  // Verify authentication on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/v1/auth/me");
        const json = await res.json();
        if (json.success && json.data) {
          setAuthUser(json.data);
          if (json.data.role === "FREELANCER" || urlRole === "freelancer") {
            setAdminSelectedRole("freelancer");
          } else {
            setAdminSelectedRole("client");
          }
        } else {
          setAuthUser(null);
        }
      } catch (err) {
        console.warn("Auth check error", err);
        setAuthUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    verifyAuth();
  }, [urlRole]);

  // Loading state while checking authentication
  if (loadingAuth) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-slate-400 text-xs space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
        <span>Authenticating your messaging session...</span>
      </div>
    );
  }

  // GATED AUTHENTICATION: If not signed in, do NOT show messaging options
  if (!authUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
          <Lock className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Encrypted & Role-Isolated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In Required to Access Messages
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Direct chats, proposals, and escrow contract communications are private. Please sign in to your dedicated account to access your inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <Link
            href="/login/client?redirect=/messages"
            className="p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex flex-col items-center gap-2 group text-center"
          >
            <Briefcase className="h-5 w-5 group-hover:scale-110 transition text-indigo-200" />
            <span className="text-sm font-extrabold">Sign In as Client</span>
            <span className="text-[11px] text-indigo-200 font-normal">Manage hires, contractors & escrow</span>
          </Link>

          <Link
            href="/login/freelancer?redirect=/messages"
            className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex flex-col items-center gap-2 group text-center"
          >
            <UserCheck className="h-5 w-5 group-hover:scale-110 transition text-emerald-200" />
            <span className="text-sm font-extrabold">Sign In as Freelancer</span>
            <span className="text-[11px] text-emerald-200 font-normal">Chat with employers & review jobs</span>
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>New to ApexLance?</span>
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            <span>Create an Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // FREELANCER AUTHENTICATED: Display Freelancer Workspace
  if (authUser.role === "FREELANCER") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <UserCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-bold">Freelancer Inbox &bull; {authUser.name}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Encrypted Client Discussions</span>
          </div>
          <Link
            href="/dashboard/freelancer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1"
          >
            <span>My Workroom &rarr;</span>
          </Link>
        </div>

        <RealtimeMessagingCenter 
          mode="FREELANCER_ONLY" 
          initialFreelancerId={authUser.id} 
        />
      </div>
    );
  }

  // CLIENT AUTHENTICATED: Display Client Workspace
  if (authUser.role === "CLIENT") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <Briefcase className="h-4 w-4 text-indigo-400" />
            <span className="font-bold">Client Inbox &bull; {authUser.name}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Talent & Contractor Communications</span>
          </div>
          <Link
            href="/dashboard/client"
            className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs flex items-center gap-1"
          >
            <span>Client Dashboard &rarr;</span>
          </Link>
        </div>

        <RealtimeMessagingCenter 
          mode="CLIENT_ONLY" 
          initialClientId={authUser.id} 
        />
      </div>
    );
  }

  // ADMIN / SUPER_ADMIN: Portal Switcher
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="font-bold">Administrator Dual-Perspective Messaging</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Signed in as {authUser.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminSelectedRole("client")}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              adminSelectedRole === "client"
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Client Perspective
          </button>
          <button
            onClick={() => setAdminSelectedRole("freelancer")}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              adminSelectedRole === "freelancer"
                ? "bg-emerald-600 text-white shadow"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Freelancer Perspective
          </button>
        </div>
      </div>

      <RealtimeMessagingCenter 
        mode={adminSelectedRole === "client" ? "CLIENT_ONLY" : "FREELANCER_ONLY"}
        initialClientId={urlClientId || "cl-1"}
        initialFreelancerId={urlFreelancerId || "fl-1"}
      />
    </div>
  );
}

export default function UniversalMessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        <Suspense fallback={
          <div className="min-h-[500px] flex items-center justify-center text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
              <span>Loading Messaging Center...</span>
            </div>
          </div>
        }>
          <MessagesContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
