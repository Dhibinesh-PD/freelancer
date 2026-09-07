"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Send, 
  Search, 
  CheckCheck, 
  ShieldCheck, 
  Clock, 
  User, 
  Sparkles, 
  Briefcase, 
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ArrowLeft,
  Filter,
  Check,
  Calendar,
  Smile,
  RefreshCw,
  Info,
  Paperclip,
  Lock,
  FileText
} from "lucide-react";
import Link from "next/link";
import { SEED_CLIENTS, SEED_FREELANCERS } from "@/lib/data/seed-data";

function formatDateLabel(dateString: string) {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "Earlier";
  }
}

export interface MessagingCenterProps {
  mode?: "CLIENT_ONLY" | "FREELANCER_ONLY" | "UNIVERSAL";
  initialClientId?: string;
  initialFreelancerId?: string;
}

export function RealtimeMessagingCenter({
  mode = "UNIVERSAL",
  initialClientId = "cl-1",
  initialFreelancerId = "fl-1"
}: MessagingCenterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlConvId = searchParams.get("conversationId");
  const urlFreelancerId = searchParams.get("freelancerId");
  const urlClientId = searchParams.get("clientId");
  const urlRole = searchParams.get("role");

  // Determine role based on mode or query
  const defaultRole: "CLIENT" | "FREELANCER" = 
    mode === "CLIENT_ONLY" ? "CLIENT" :
    mode === "FREELANCER_ONLY" ? "FREELANCER" :
    urlRole?.toUpperCase() === "FREELANCER" ? "FREELANCER" : "CLIENT";

  const [activeRole, setActiveRole] = useState<"CLIENT" | "FREELANCER">(defaultRole);
  const [activeClientId, setActiveClientId] = useState(urlClientId || initialClientId);
  const [activeFreelancerId, setActiveFreelancerId] = useState(urlFreelancerId || initialFreelancerId);

  // Messaging State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "contracts">("all");

  // Auto-scroll Down State & Ref
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);

  // Chat UI Experience Enhancements
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

  // Auto-detect Authenticated User on Mount
  useEffect(() => {
    async function checkAuthUser() {
      try {
        const res = await fetch("/api/v1/auth/me");
        const json = await res.json();
        if (json.success && json.data) {
          const user = json.data;
          setCurrentUser(user);
          if (user.role === "FREELANCER" && mode !== "CLIENT_ONLY") {
            setActiveRole("FREELANCER");
            if (user.id) {
              setActiveFreelancerId(user.id);
              loadConversations("FREELANCER", user.id, urlClientId || undefined);
            }
          } else if (user.role === "CLIENT" && mode !== "FREELANCER_ONLY") {
            setActiveRole("CLIENT");
            if (user.id) {
              setActiveClientId(user.id);
              loadConversations("CLIENT", user.id, urlFreelancerId || undefined);
            }
          }
        }
      } catch (err) {
        console.warn("Auth verify silent check", err);
      }
    }
    checkAuthUser();
  }, [mode]);

  // Mobile View Toggle: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  // Compose / New Message Modal State
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);

  // In-Chat Direct Hire Modal State
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireProjectTitle, setHireProjectTitle] = useState("");
  const [hireProjectDesc, setHireProjectDesc] = useState("");
  const [hireBudget, setHireBudget] = useState("1500");
  const [hireSubmitting, setHireSubmitting] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);

  // RECTIFIED AUTO-SCROLL DOWN METHOD (Dual Container + Sentinel Approach)
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight + 5000,
        behavior
      });
    }
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
      } catch {
        // Fallback for older browser engines
      }
    }
    setShowScrollDownBtn(false);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // If scrolled up more than 80px from bottom, show floating scroll down button
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollDownBtn(distanceFromBottom > 80);
  };

  // 1. Fetch Conversations strictly bounded by role
  const loadConversations = async (role: "CLIENT" | "FREELANCER", personaId: string, ensureWith?: string) => {
    try {
      setLoadingConv(true);
      const effectiveId = (currentUser && currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")
        ? currentUser.id
        : personaId;
      const param = role === "CLIENT" ? `clientId=${effectiveId}&role=CLIENT` : `freelancerId=${effectiveId}&role=FREELANCER`;
      const ensureParam = ensureWith ? `&ensureWithId=${encodeURIComponent(ensureWith)}` : "";
      const res = await fetch(`/api/v1/messages/conversations?${param}${ensureParam}`);
      const json = await res.json();
      if (json.success) {
        const convList = json.data || [];
        setConversations(convList);

        if (urlConvId && convList.some((c: any) => c.id === urlConvId)) {
          setSelectedConvId(urlConvId);
          setMobileView("chat");
        } else if (ensureWith) {
          const match = convList.find((c: any) => 
            c.freelancerId === ensureWith || 
            c.clientId === ensureWith ||
            c.freelancerId === `fl-${ensureWith}` ||
            c.clientId === `cl-${ensureWith}`
          );
          if (match) {
            setSelectedConvId(match.id);
            setMobileView("chat");
          } else if (convList.length > 0) {
            setSelectedConvId(convList[0].id);
          }
        } else if (convList.length > 0 && (!selectedConvId || !convList.some((c: any) => c.id === selectedConvId))) {
          setSelectedConvId(convList[0].id);
        } else if (convList.length === 0) {
          setSelectedConvId("");
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Error loading conversations", err);
    } finally {
      setLoadingConv(false);
    }
  };

  // Trigger conversation load when role or persona changes
  useEffect(() => {
    const currentId = activeRole === "CLIENT" ? activeClientId : activeFreelancerId;
    const ensureRecipient = activeRole === "CLIENT" ? urlFreelancerId : urlClientId;
    loadConversations(activeRole, currentId, ensureRecipient || undefined);
  }, [activeRole, activeClientId, activeFreelancerId]);

  // 2. Fetch Active Messages & Polling
  useEffect(() => {
    if (!selectedConvId) return;

    let isInitialFetch = true;

    const fetchMessages = async () => {
      try {
        const effectiveId = (currentUser && currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")
          ? currentUser.id
          : (activeRole === "CLIENT" ? activeClientId : activeFreelancerId);
        const personaParam = activeRole === "CLIENT" ? `&clientId=${effectiveId}` : `&freelancerId=${effectiveId}`;
        const res = await fetch(`/api/v1/messages/${selectedConvId}?markRead=true&role=${activeRole}${personaParam}`);
        if (res.status === 403 || res.status === 404) {
          setSelectedConvId("");
          setMessages([]);
          return;
        }
        const json = await res.json();
        if (json.success) {
          const newMsgs = json.data.messages || [];
          setMessages(prev => {
            // Check if length increased or changed
            const changed = newMsgs.length !== prev.length;
            if (changed && !showScrollDownBtn) {
              setTimeout(() => scrollToBottom("smooth"), 50);
            }
            return newMsgs;
          });

          if (isInitialFetch) {
            isInitialFetch = false;
            setTimeout(() => scrollToBottom("auto"), 50);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [selectedConvId, activeRole]);

  // Dedicated auto-scroll effect whenever messages count changes
  useEffect(() => {
    if (messages.length > 0 && !showScrollDownBtn) {
      scrollToBottom("smooth");
      const t1 = setTimeout(() => scrollToBottom("smooth"), 40);
      const t2 = setTimeout(() => scrollToBottom("smooth"), 120);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [messages.length]);

  // When selected conversation changes, scroll immediately to bottom
  useEffect(() => {
    scrollToBottom("auto");
    const t1 = setTimeout(() => scrollToBottom("auto"), 30);
    const t2 = setTimeout(() => scrollToBottom("auto"), 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedConvId]);

  // 3. Load Directory Contacts for Compose Modal
  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await fetch(`/api/v1/messages/contacts?role=${activeRole}`);
      const json = await res.json();
      if (json.success) {
        setContacts(json.data || []);
      }
    } catch (err) {
      console.error("Error loading contacts", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleOpenCompose = () => {
    setComposeModalOpen(true);
    loadContacts();
  };

  const handleSelectContact = async (contact: any) => {
    setComposeModalOpen(false);
    const myId = (currentUser && !isAdmin) ? currentUser.id : (activeRole === "CLIENT" ? activeClientId : activeFreelancerId);
    const theirId = contact.id;

    try {
      const res = await fetch("/api/v1/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyAId: myId,
          partyBId: theirId
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        await loadConversations(activeRole, myId);
        setSelectedConvId(json.data.id);
        setMobileView("chat");
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    } catch (err) {
      console.error("Error creating conversation with contact", err);
    }
  };

  // 4. Send Message (with Optimistic Local Update & Instant Auto-Scroll)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputContent.trim() && !attachedFile) || !selectedConvId) return;

    let content = inputContent.trim();
    if (attachedFile) {
      content = content ? `${content}\n\n📎 Attached File: ${attachedFile}` : `📎 Attached File: ${attachedFile}`;
      setAttachedFile(null);
    }
    setInputContent("");
    setSending(true);

    const senderId = (currentUser && !isAdmin) ? currentUser.id : (activeRole === "CLIENT" ? activeClientId : activeFreelancerId);
    const currentPersona = currentUser?.name ? {
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl || (activeRole === "CLIENT" ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80")
    } : (activeRole === "CLIENT" 
      ? (SEED_CLIENTS.find(c => c.id === activeClientId) || { name: "Client", avatarUrl: "" })
      : (SEED_FREELANCERS.find(f => f.id === activeFreelancerId) || { name: "Freelancer", avatarUrl: "" }));

    // Instant local optimistic append
    const tempMsg = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConvId,
      senderId,
      senderRole: activeRole,
      senderName: currentPersona.name,
      senderAvatar: currentPersona.avatarUrl,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    // Force instant scroll to bottom on send
    scrollToBottom("smooth");
    setTimeout(() => scrollToBottom("smooth"), 30);
    setTimeout(() => scrollToBottom("smooth"), 100);

    try {
      const res = await fetch("/api/v1/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConvId,
          senderId,
          senderRole: activeRole,
          content
        })
      });

      const json = await res.json();
      if (json.success) {
        const currentId = activeRole === "CLIENT" ? activeClientId : activeFreelancerId;
        loadConversations(activeRole, currentId);
      }
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setSending(false);
    }
  };

  // Quick Emoji Click
  const handleSendEmoji = (emoji: string) => {
    setInputContent(prev => prev ? `${prev} ${emoji}` : emoji);
  };

  // 5. In-Chat Direct Hire Handler
  const handleExecuteDirectHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    setHireSubmitting(true);

    try {
      const res = await fetch("/api/v1/client/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: activeClientId,
          freelancerId: activeConv.freelancerId,
          projectTitle: hireProjectTitle || `Direct Hire Contract with ${activeConv.freelancerName}`,
          description: hireProjectDesc || "Direct engagement established via ApexLance Real-time Messaging.",
          totalAmount: Number(hireBudget),
          deliveryWeeks: 4
        })
      });
      const data = await res.json();
      if (data.success) {
        setHireSuccess(true);
        setTimeout(() => {
          setHireModalOpen(false);
          setHireSuccess(false);
          loadConversations(activeRole, activeClientId);
        }, 2000);
      } else {
        alert(data.error?.message || "Failed to process hire");
      }
    } catch {
      alert("Error sending direct hire offer");
    } finally {
      setHireSubmitting(false);
    }
  };

  // Active conversation & counterpart determination
  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const counterpartName = activeConv
    ? (activeRole === "CLIENT" ? activeConv.freelancerName : activeConv.clientName)
    : "";
  const counterpartTitle = activeConv
    ? (activeRole === "CLIENT" ? activeConv.freelancerTitle : activeConv.clientCompanyName)
    : "";
  const counterpartAvatar = activeConv
    ? (activeRole === "CLIENT" ? activeConv.freelancerAvatar : activeConv.clientAvatar)
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

  // Filtered Conversations
  const filteredConversations = conversations.filter(c => {
    const nameMatch = activeRole === "CLIENT" ? c.freelancerName : c.clientName;
    const matchesSearch = 
      (nameMatch || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === "unread") {
      const unreadCount = activeRole === "CLIENT" ? c.unreadCountClient : c.unreadCountFreelancer;
      return (unreadCount || 0) > 0;
    }
    if (filterTab === "contracts") {
      return Boolean(c.contractId);
    }
    return true;
  });

  // Filtered contacts in Compose modal
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    (c.title || "").toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col space-y-4">
      {/* Top Banner: Strictly Role-Separated Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>
                {activeRole === "CLIENT" ? "Client Messaging Portal" : "Freelancer Messaging Workspace"}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {activeRole === "CLIENT" ? "ENTERPRISE CLIENT" : "VERIFIED FREELANCER"}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {activeRole === "CLIENT"
                ? "Manage discussions with hired specialists and incoming candidate proposals"
                : "Communicate with enterprise clients, discuss project specs, and track escrow milestones"}
            </p>
          </div>
        </div>

        {/* Strictly Isolated Identity & Privacy Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {mode === "UNIVERSAL" && isAdmin && (
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mr-1">
              <button
                onClick={() => setActiveRole("CLIENT")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeRole === "CLIENT" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Client Inbox
              </button>
              <button
                onClick={() => setActiveRole("FREELANCER")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeRole === "FREELANCER" 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Freelancer Inbox
              </button>
            </div>
          )}

          {/* Authenticated Identity Badge (Private & Isolated) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">
              {currentUser?.name || (activeRole === "CLIENT" ? "Verified Client" : "Verified Freelancer")}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
              activeRole === "CLIENT"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {currentUser?.role || activeRole}
            </span>
            <div className="border-l border-slate-800 pl-2 hidden sm:flex items-center gap-1 text-slate-400">
              <Lock className="h-3 w-3 text-emerald-400/80" />
              <span className="text-[11px]">Private Session &bull; Strictly Isolated</span>
            </div>
          </div>

          {/* Admin Audit Switcher ONLY for Admin / Super Admin */}
          {isAdmin && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="text-[11px] text-amber-400 font-medium hidden sm:inline flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Admin Audit Perspective:
              </span>
              {activeRole === "CLIENT" ? (
                <select
                  value={activeClientId}
                  onChange={(e) => {
                    setActiveClientId(e.target.value);
                    loadConversations("CLIENT", e.target.value);
                  }}
                  className="bg-slate-950 text-indigo-300 text-xs font-semibold py-1.5 px-3 rounded-xl border border-indigo-500/40 focus:outline-none focus:border-indigo-500"
                >
                  {SEED_CLIENTS.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.name} ({cl.companyName})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={activeFreelancerId}
                  onChange={(e) => {
                    setActiveFreelancerId(e.target.value);
                    loadConversations("FREELANCER", e.target.value);
                  }}
                  className="bg-slate-950 text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded-xl border border-emerald-500/40 focus:outline-none focus:border-emerald-500"
                >
                  {SEED_FREELANCERS.map((fl) => (
                    <option key={fl.id} value={fl.id}>
                      {fl.name} — {fl.title.split("&")[0].trim()}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Messaging Container with Fixed Height for Clean Internal Scrolling */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[720px] max-h-[85vh] shadow-2xl relative">
        
        {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
        <div className={`lg:col-span-4 border-r border-slate-800 bg-slate-950/70 flex flex-col h-full ${
          mobileView === "chat" ? "hidden lg:flex" : "flex"
        }`}>
          {/* Header Actions: New Message & Search */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span>Conversations</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
                  {conversations.length}
                </span>
              </h2>

              <button
                onClick={handleOpenCompose}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 active:scale-95"
                title={activeRole === "CLIENT" ? "Message a Freelancer" : "Message a Client"}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeRole === "CLIENT" ? "Filter freelancers..." : "Filter clients..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-slate-500 hover:text-white text-xs"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 pt-1 text-[11px] font-semibold text-slate-400">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterTab === "all" ? "bg-slate-800 text-white" : "hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("unread")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterTab === "unread" ? "bg-slate-800 text-indigo-400" : "hover:text-white"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilterTab("contracts")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterTab === "contracts" ? "bg-slate-800 text-emerald-400" : "hover:text-white"
                }`}
              >
                Contracts
              </button>
            </div>
          </div>

          {/* Conversation Thread Items with Independent Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
            {loadingConv ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="h-5 w-5 mx-auto animate-spin text-indigo-400" />
                <p>Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3 text-slate-500">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-700" />
                <div className="text-xs font-semibold text-slate-400">
                  {searchQuery ? "No matches found" : "No conversations yet"}
                </div>
                <p className="text-[11px] max-w-xs mx-auto text-slate-500">
                  {activeRole === "CLIENT"
                    ? "Reach out to a top-rated engineer or hire directly from their profile."
                    : "Reach out to enterprise clients or apply to open project listings."}
                </p>
                <button
                  onClick={handleOpenCompose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold transition border border-indigo-500/30"
                >
                  <Plus className="h-3 w-3" />
                  <span>{activeRole === "CLIENT" ? "Find Freelancers" : "Contact Clients"}</span>
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const name = activeRole === "CLIENT" ? conv.freelancerName : conv.clientName;
                const title = activeRole === "CLIENT" ? conv.freelancerTitle : conv.clientCompanyName;
                const avatar = activeRole === "CLIENT" ? conv.freelancerAvatar : conv.clientAvatar;
                const unread = activeRole === "CLIENT" ? conv.unreadCountClient : conv.unreadCountFreelancer;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setMobileView("chat");
                    }}
                    className={`w-full p-4 text-left transition flex items-start gap-3 hover:bg-slate-900/60 border-l-4 ${
                      isSelected ? "bg-indigo-600/10 border-indigo-500" : "border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                        alt={name}
                        className="h-11 w-11 rounded-xl object-cover border border-slate-700/80 shadow"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold text-white truncate">{name}</h3>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>

                      <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">{title}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">{conv.lastMessage}</p>

                      {conv.contractId && (
                        <span className="inline-block mt-1 px-2 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                          ACTIVE CONTRACT
                        </span>
                      )}
                    </div>

                    {unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-sm">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CHAT FEED & DETAILS ================= */}
        <div className={`lg:col-span-8 flex flex-col bg-[#070c16] h-full relative overflow-hidden ${
          mobileView === "list" ? "hidden lg:flex" : "flex"
        }`}>
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Chat Top Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/70 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileView("list")}
                    className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Back to conversations"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <div className="relative flex-shrink-0">
                    <img
                      src={counterpartAvatar}
                      alt={counterpartName}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover border border-indigo-500/40 shadow"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">{counterpartName}</h3>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                      {activeConv.contractId && (
                        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          <Lock className="h-2.5 w-2.5" />
                          Active Escrow
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-indigo-300 truncate max-w-[180px] sm:max-w-[260px]">{counterpartTitle}</span>
                      <span className="text-slate-600 hidden sm:inline">&bull;</span>
                      <span className="text-[11px] text-emerald-400 hidden sm:flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Counterpart Actions & Details Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeRole === "CLIENT" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setHireProjectTitle(`Direct Project with ${activeConv.freelancerName}`);
                          setHireModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 active:scale-95"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Direct Hire</span>
                      </button>

                      <Link
                        href={`/freelancers/${activeConv.freelancerId}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <span className="hidden sm:inline">Profile</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/jobs"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">Client Jobs</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                    className={`p-2 rounded-xl border transition ${
                      showDetailsPanel 
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30" 
                        : "bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700"
                    }`}
                    title={showDetailsPanel ? "Hide Details" : "Show Chat & Security Details"}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Body & Collapsible Side Panel */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* Message Stream */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <div 
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 relative overscroll-y-contain scroll-smooth"
                  >
                    {messages.length === 0 ? (
                      <div className="max-w-md mx-auto py-10 px-4 text-center space-y-5">
                        <div className="relative inline-block">
                          <img
                            src={counterpartAvatar}
                            alt={counterpartName}
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl mx-auto"
                          />
                          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                        </div>

                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                            <Sparkles className="h-3 w-3" />
                            <span>Direct Secure Discussion</span>
                          </div>
                          <h3 className="text-base font-bold text-white">
                            Connect with {counterpartName}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                            {counterpartTitle} &bull; Protected by Escrow guarantee
                          </p>
                        </div>

                        <div className="space-y-2 text-left pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                            Recommended Conversation Starters:
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {(activeRole === "CLIENT" ? [
                              `Hi ${counterpartName.split(" ")[0]}, I reviewed your profile and would like to discuss a project scope.`,
                              `Are you available for a contract engagement starting this week?`,
                              `Could you share a few examples of your past work with similar requirements?`
                            ] : [
                              `Hi ${counterpartName.split(" ")[0]}, thank you for reaching out! I'd be excited to learn more about your project goals.`,
                              `I am available to start immediately and dedicate bandwidth to this milestone.`,
                              `Would you be open to a quick 10-minute sync to align on the technical specifications?`
                            ]).map((prompt, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => {
                                  setInputContent(prompt);
                                }}
                                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition text-left flex items-center justify-between group cursor-pointer"
                              >
                                <span className="line-clamp-1">{prompt}</span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isSender = 
                          msg.senderRole === activeRole || 
                          (msg.senderId && (msg.senderId === activeClientId || msg.senderId === activeFreelancerId));
                        const isSystem = msg.senderRole === "SYSTEM";

                        // Date divider logic
                        const msgDate = new Date(msg.createdAt).toDateString();
                        const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                        const showDateDivider = msgDate !== prevMsgDate;

                        // Consecutive message sender grouping
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const isSameSenderAsPrev = prevMsg && prevMsg.senderId === msg.senderId && !showDateDivider;

                        return (
                          <React.Fragment key={msg.id || index}>
                            {showDateDivider && (
                              <div className="flex items-center justify-center my-4 select-none">
                                <div className="h-[1px] bg-slate-800 flex-1 max-w-[80px]" />
                                <span className="mx-3 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-semibold text-slate-400 shadow-sm">
                                  {formatDateLabel(msg.createdAt)}
                                </span>
                                <div className="h-[1px] bg-slate-800 flex-1 max-w-[80px]" />
                              </div>
                            )}

                            {isSystem ? (
                              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center text-xs space-y-1.5 my-3 max-w-lg mx-auto shadow-md">
                                <span className="font-bold text-indigo-300 flex items-center justify-center gap-1.5">
                                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                                  {msg.senderName}
                                </span>
                                <p className="text-slate-200 leading-relaxed whitespace-pre-line">{msg.content}</p>
                                <span className="text-[10px] text-slate-400 block">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ) : (
                              <div
                                className={`flex items-end gap-2.5 ${isSender ? "justify-end" : "justify-start"} ${
                                  isSameSenderAsPrev ? "mt-1" : "mt-3"
                                }`}
                              >
                                {!isSender && (
                                  <div className="w-8 h-8 flex-shrink-0">
                                    {!isSameSenderAsPrev && (
                                      <img
                                        src={msg.senderAvatar || counterpartAvatar}
                                        alt={msg.senderName}
                                        className="h-8 w-8 rounded-xl object-cover border border-slate-700 shadow"
                                      />
                                    )}
                                  </div>
                                )}

                                <div className={`max-w-md sm:max-w-lg rounded-2xl p-3.5 space-y-1 ${
                                  isSender
                                    ? "bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-600/20"
                                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm"
                                }`}>
                                  {!isSameSenderAsPrev && (
                                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-0.5">
                                      <span className="font-bold">{isSender ? "You" : msg.senderName}</span>
                                    </div>
                                  )}
                                  <p className="text-xs leading-relaxed whitespace-pre-line">{msg.content}</p>
                                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-75 pt-0.5">
                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isSender && (
                                      <span title={msg.isRead ? "Read by recipient" : "Delivered"}>
                                        <CheckCheck className={`h-3 w-3 ${msg.isRead ? "text-emerald-300" : "text-slate-300"}`} />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}

                    <div ref={messagesEndRef} className="h-0 w-full" />
                  </div>

                  {/* Scroll to bottom button */}
                  {showScrollDownBtn && (
                    <div className="absolute bottom-28 right-6 z-30 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => scrollToBottom("smooth")}
                        className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-2xl border border-indigo-400/40 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 animate-bounce cursor-pointer"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                        <span>Scroll to Latest</span>
                      </button>
                    </div>
                  )}

                  {/* Chat Input Bar */}
                  <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 space-y-2.5 shrink-0">
                    {/* Attachment preview if selected */}
                    {attachedFile && (
                      <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-xs text-indigo-300 w-fit animate-in fade-in">
                        <Paperclip className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="font-semibold truncate max-w-xs">{attachedFile}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Emoji Reactions */}
                    <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 pb-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Reaction:</span>
                      {["👍", "🚀", "💡", "❤️", "🤝", "🔥"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleSendEmoji(emoji)}
                          className="p-1 hover:bg-slate-800 rounded-lg transition text-sm cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAttachedFile(e.target.files[0].name);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600 transition"
                          title="Attach Project Document or Spec"
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>

                        <input
                          type="text"
                          placeholder={`Message ${counterpartName}... (Press Enter to send)`}
                          value={inputContent}
                          onChange={(e) => setInputContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />

                        <button
                          type="submit"
                          disabled={sending || (!inputContent.trim() && !attachedFile)}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer"
                        >
                          {sending ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <span>Send</span>
                              <Send className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Role-Specific Quick Prompts */}
                      <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400 pt-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Prompts:</span>
                        {activeRole === "CLIENT" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setInputContent("Hi! Are you available to start on an engineering project this week?")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Available this week?"
                            </button>
                            <button
                              type="button"
                              onClick={() => setInputContent("Could you share your GitHub or code examples of similar scalable systems?")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Share code samples"
                            </button>
                            <button
                              type="button"
                              onClick={() => setInputContent("I just funded the initial escrow milestone. Looking forward to reviewing the deliverables!")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Escrow funded update"
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setInputContent("Hi! Yes, I am available to start immediately and dedicate full bandwidth to this.")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Available immediately"
                            </button>
                            <button
                              type="button"
                              onClick={() => setInputContent("I have completed Milestone 1 deliverables. Please review and let me know your thoughts!")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Deliverables ready for review"
                            </button>
                            <button
                              type="button"
                              onClick={() => setInputContent("Would you be open to a quick 10-minute kickoff sync to align on the technical specs?")}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition whitespace-nowrap cursor-pointer"
                            >
                              "Schedule kickoff sync"
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Collapsible Details & Security Side Drawer */}
                {showDetailsPanel && (
                  <div className="w-80 border-l border-slate-800 bg-slate-950/95 p-4 overflow-y-auto space-y-4 shrink-0 animate-in slide-in-from-right duration-200 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-indigo-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Chat Details</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDetailsPanel(false)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Profile Snapshot */}
                    <div className="text-center space-y-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <img
                        src={counterpartAvatar}
                        alt={counterpartName}
                        className="h-16 w-16 rounded-2xl object-cover mx-auto border-2 border-indigo-500/40"
                      />
                      <div>
                        <div className="font-bold text-sm text-white">{counterpartName}</div>
                        <div className="text-xs text-indigo-300">{counterpartTitle}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Identity & Payment Verified</span>
                      </div>
                    </div>

                    {/* Escrow Status Card */}
                    <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-indigo-300">
                        <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span>Escrow Protected Conversation</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        All contract scopes and chat discussions here are recorded and protected under platform dispute arbitration.
                      </p>
                    </div>

                    {/* Contract Details if any */}
                    {activeConv.contractId ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">Active Contract</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {activeConv.contractId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Milestones funded in escrow. Payouts release upon client inspection.
                        </p>
                        <Link
                          href={activeRole === "CLIENT" ? "/dashboard/client" : "/dashboard/freelancer"}
                          className="block text-center py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                        >
                          View Contract Workroom
                        </Link>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <div className="font-bold text-white">Direct Consultation</div>
                        <p className="text-[11px] text-slate-400">
                          No active contract attached yet. Ready to start?
                        </p>
                        {activeRole === "CLIENT" && (
                          <button
                            type="button"
                            onClick={() => {
                              setHireProjectTitle(`Direct Project with ${activeConv.freelancerName}`);
                              setHireModalOpen(true);
                            }}
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition shadow"
                          >
                            Create Direct Hire Offer
                          </button>
                        )}
                      </div>
                    )}

                    {/* Safety Guidelines */}
                    <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <div className="font-bold text-slate-300">Safety Tip</div>
                      <p>
                        Never accept off-platform wire transfers or share private banking credentials. Keep all transactions within ApexLance to maintain 100% escrow protection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-xl">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No conversation selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a message thread from the sidebar, or start a new direct communication with any {activeRole === "CLIENT" ? "freelancer" : "client"}.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenCompose}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start New Conversation</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-md w-full text-left text-xs space-y-2 mt-4">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  <span>Dual-Custody Escrow Protection</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All messages and milestones initiated in ApexLance are encrypted and backed by platform dispute arbitration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= COMPOSE / NEW MESSAGE MODAL ================= */}
      {composeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {activeRole === "CLIENT" ? "Message a Freelancer" : "Message an Enterprise Client"}
                </h3>
              </div>
              <button
                onClick={() => setComposeModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-mono p-1"
              >
                &times;
              </button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeRole === "CLIENT" ? "Search freelancers by name or skills..." : "Search clients by company or name..."}
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {loadingContacts ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <RefreshCw className="h-5 w-5 mx-auto animate-spin text-indigo-400 mb-2" />
                  Loading directory...
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching contacts found.
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={contact.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                        alt={contact.name}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
                            {contact.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {contact.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{contact.title}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {contact.rate && (
                        <div className="text-xs font-black text-emerald-400">${contact.rate}/hr</div>
                      )}
                      <span className="text-[10px] text-indigo-400 font-semibold group-hover:translate-x-0.5 transition inline-block">
                        Chat &rarr;
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= IN-CHAT DIRECT HIRE MODAL ================= */}
      {hireModalOpen && activeConv && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {hireSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-white">Direct Hire Offer Dispatched!</h3>
                <p className="text-xs text-slate-300">
                  Escrow contract created with ${hireBudget} deposited. The freelancer has been notified right in this chat channel!
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteDirectHire} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Direct Hire {activeConv.freelancerName}</h3>
                    <p className="text-xs text-slate-400">Lock escrow funds to start this engagement immediately.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHireModalOpen(false)}
                    className="text-slate-400 hover:text-white text-lg font-mono p-1"
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contract Title</label>
                  <input
                    type="text"
                    required
                    value={hireProjectTitle}
                    onChange={(e) => setHireProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Deliverable Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Milestone deliverables, scope, and target criteria..."
                    value={hireProjectDesc}
                    onChange={(e) => setHireProjectDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Escrow Deposit ($)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={hireBudget}
                      onChange={(e) => setHireBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Timeline</label>
                    <div className="px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-between">
                      <span>4 Weeks</span>
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>ApexLance Dual-Custody Escrow guarantees milestone funds remain safe until deliverables are approved.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setHireModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={hireSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {hireSubmitting ? "Funding Escrow..." : "Confirm & Fund Contract"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
