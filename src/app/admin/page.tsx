"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Activity, 
  Sliders, 
  UserX,
  UserCheck,
  Search,
  Filter
} from "lucide-react";

export default function AdminPortalPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userFilter, setUserFilter] = useState("all");
  const [commissionRate, setCommissionRate] = useState("10");
  const [actionNotice, setActionNotice] = useState("");

  const loadData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        fetch("/api/v1/admin/analytics"),
        fetch("/api/v1/admin/users")
      ]);

      const aData = await analyticsRes.json();
      const uData = await usersRes.json();

      if (aData.success) {
        setAnalytics(aData.data);
        setAuditLogs(aData.data.recentAuditLogs || []);
        if (aData.data.settings?.platformCommissionPercentage) {
          setCommissionRate(aData.data.settings.platformCommissionPercentage.toString());
        }
      }

      if (uData.success) {
        setUsers(uData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserStatus = async (userId: string, newStatus: "ACTIVE" | "SUSPENDED" | "VERIFIED") => {
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        setActionNotice(`User status updated to ${newStatus}`);
        loadData();
        setTimeout(() => setActionNotice(""), 3000);
      }
    } catch {
      alert("Failed to update user status");
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/admin/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percentage: Number(commissionRate) })
      });

      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        loadData();
        setTimeout(() => setActionNotice(""), 3000);
      }
    } catch {
      alert("Failed to update commission rate");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userFilter === "all") return true;
    return u.role === userFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Super Administrator Governance Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Overview & Control Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time audit log, user identity verification queues, dispute moderation, and platform economics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold w-fit">
              ACTIVE ROLE: SUPER_ADMIN
            </span>
          </div>
        </div>

        {/* Global Notice Alert */}
        {actionNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Global KPIs */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Registered Accounts</span>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-2xl font-black text-white">{analytics.totalUsers.toLocaleString()}</span>
              <p className="text-[11px] text-emerald-400 mt-1">Super Admin & RBAC Active</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Current Escrow Deposits</span>
                <Lock className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-2xl font-black text-white">${analytics.totalEscrowHeld.toLocaleString()}.00</span>
              <p className="text-[11px] text-slate-400 mt-1">{analytics.activeContractsCount} active contracts</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Platform Commission Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-white">${analytics.totalCommissionEarned.toLocaleString()}.00</span>
              <p className="text-[11px] text-emerald-400 mt-1">{commissionRate}% standard platform take-rate</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Verification Queue</span>
                <AlertTriangle className="h-4 w-4 text-sky-400" />
              </div>
              <span className="text-2xl font-black text-white">{analytics.pendingVerificationsCount}</span>
              <p className="text-[11px] text-slate-400 mt-1">{analytics.disputesCount} open disputes</p>
            </div>
          </div>
        )}

        {/* User Management Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <span>User Management & Verification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage roles, verify identities, suspend accounts, and view security states.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              {["all", "CLIENT", "FREELANCER", "SUPER_ADMIN"].map((f) => (
                <button
                  key={f}
                  onClick={() => setUserFilter(f)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    userFilter === f ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {f === "all" ? "All Users" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-4 py-3 font-semibold text-white">
                      {u.name}
                      {u.companyName && <span className="block text-[10px] text-slate-500 font-normal">{u.companyName}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : u.role === "CLIENT"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : u.status === "SUSPENDED"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {u.status !== "SUSPENDED" ? (
                        <button
                          onClick={() => handleUserStatus(u.id, "SUSPENDED")}
                          className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-[11px] transition"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(u.id, "ACTIVE")}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-semibold text-[11px] transition"
                        >
                          Reactivate
                        </button>
                      )}

                      {!u.emailVerified && (
                        <button
                          onClick={() => handleUserStatus(u.id, "VERIFIED")}
                          className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white font-semibold text-[11px] transition"
                        >
                          Verify KYC
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" />
                <span>Immutable Security & Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every sensitive state mutation (job posting, escrow deposit, approval, dispute) is tamper-proof logged.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {auditLogs.length} Total Events
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-semibold text-white">{log.actor}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">{log.entity} #{log.entityId}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{log.details}</p>
                </div>

                <span className="text-[11px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Settings & Commission Controls */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <span>Platform Commission Rate Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure dynamic platform take rates across contracts and fixed-price gigs without code redeployments.
          </p>

          <form onSubmit={handleSaveCommission} className="flex flex-col sm:flex-row items-end gap-4 max-w-md pt-2">
            <div className="w-full">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Standard Platform Fee (%)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition shrink-0"
            >
              Update Take-Rate
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
