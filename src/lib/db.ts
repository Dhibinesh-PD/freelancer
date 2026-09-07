import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { SEED_FREELANCERS, SEED_CLIENTS, SEED_SERVICES, SEED_JOBS, PLATFORM_STATS, SeedFreelancer, SeedJob, SeedService } from "./data/seed-data";
import { CATEGORIES_DATA } from "./data/categories";
import { ALL_SKILLS } from "./data/skills";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ----------------------------------------------------------------------
// Persistent File-Backed Database Store
// ----------------------------------------------------------------------

const storePath = path.join(process.cwd(), "src", "lib", "data", "db-store.json");

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "CLIENT" | "FREELANCER" | "SYSTEM";
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachmentUrls?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientCompanyName?: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  freelancerTitle?: string;
  contractId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCountClient: number;
  unreadCountFreelancer: number;
  createdAt: string;
}

interface DbSchema {
  users: any[];
  categories: any[];
  skills: any[];
  freelancers: SeedFreelancer[];
  clients: any[];
  services: SeedService[];
  jobs: SeedJob[];
  contracts: any[];
  proposals: any[];
  conversations: ChatConversation[];
  messages: ChatMessage[];
  auditLogs: any[];
  settings: {
    platformCommissionPercentage: number;
    appName: string;
    defaultCurrency: string;
  };
}

function loadDb(): DbSchema {
  try {
    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, "utf-8");
      const parsed: DbSchema = JSON.parse(content);
      if (!parsed.conversations) parsed.conversations = [];
      if (!parsed.messages) parsed.messages = [];
      return parsed;
    }
  } catch (err) {
    console.warn("Could not read db-store.json, falling back to seed data", err);
  }

  return {
    users: [
      {
        id: "user-admin-1",
        email: "admin@apexlance.io",
        username: "admin",
        passwordHash: "$2a$12$eUcmQ9BqjZ0t5hG3y1h3e.1j/W37P8e2z6X/dO7w.pG/9O5v6b5G2",
        name: "Platform Administrator",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        emailVerified: true
      },
      {
        id: "user-cl-1",
        email: "david.sterling@lumina.tech",
        username: "lumina-tech",
        name: "David Sterling (Lumina Tech)",
        companyName: "Lumina Technologies Inc.",
        role: "CLIENT",
        status: "ACTIVE",
        emailVerified: true
      },
      {
        id: "user-fl-1",
        email: "alex.chen@apexlance.io",
        username: "alex-chen",
        name: "Alex Chen",
        role: "FREELANCER",
        status: "ACTIVE",
        emailVerified: true
      }
    ],
    categories: CATEGORIES_DATA,
    skills: ALL_SKILLS,
    freelancers: SEED_FREELANCERS,
    clients: SEED_CLIENTS,
    services: SEED_SERVICES,
    jobs: SEED_JOBS,
    contracts: [
      {
        id: "ctr-1",
        jobId: "job-3",
        jobTitle: "AWS Kubernetes Infrastructure Setup & Zero-Downtime CI/CD",
        clientName: "David Sterling (Lumina Tech)",
        freelancerId: "fl-3",
        freelancerName: "Devon Vance",
        totalAmount: 3500,
        status: "ACTIVE",
        milestones: [
          { id: "m-1", title: "Terraform EKS Cluster & VPC Setup", amount: 1500, status: "APPROVED", deliverableNote: "Cluster deployed with Terraform state in S3." },
          { id: "m-2", title: "GitHub Actions CI/CD Pipeline", amount: 1000, status: "FUNDED" },
          { id: "m-3", title: "Datadog Monitoring & Final Handover", amount: 1000, status: "PENDING" }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    proposals: [
      {
        id: "prop-1",
        jobId: "job-1",
        freelancerId: "fl-1",
        freelancerName: "Alex Chen",
        freelancerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        coverLetter: "Hi David, I have built 4 enterprise analytics portals using Next.js 15 App Router and PostgreSQL.",
        bidAmount: 4500,
        deliveryDays: 28,
        status: "SUBMITTED",
        createdAt: "1 hour ago"
      }
    ],
    auditLogs: [
      {
        id: "aud-1",
        actor: "system",
        action: "DATABASE_MIGRATION_SEEDED",
        entity: "Database",
        entityId: "postgres-cluster",
        details: "Database initialized with Admin User, Client, Freelancer, 12 Categories, and 500+ skills.",
        timestamp: new Date().toISOString()
      }
    ],
    settings: {
      platformCommissionPercentage: 10,
      appName: "ApexLance Marketplace",
      defaultCurrency: "USD"
    },
    conversations: [],
    messages: []
  };
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db-store.json:", err);
  }
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  username?: string;
  role: "CLIENT" | "FREELANCER" | "ADMIN" | "SUPER_ADMIN";
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  title?: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  country?: string;
}

export const dbService = {
  // Users & Admin
  async getUsers() {
    const db = loadDb();
    return db.users;
  },

  async getUserById(userId: string) {
    const db = loadDb();
    return db.users.find(u => u.id === userId) || null;
  },

  async getUserByEmail(email: string) {
    const db = loadDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async createUser(data: CreateUserData) {
    const db = loadDb();
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check existing email
    const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: "EMAIL_EXISTS", message: "An account with this email address already exists." };
    }

    // Generate unique ID & username
    const id = `user-${data.role.toLowerCase()}-${Date.now()}`;
    let username = (data.username || data.name.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
    if (!username) username = `user-${Date.now().toString().slice(-6)}`;
    if (db.users.some(u => u.username === username)) {
      username = `${username}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(data.password, 12);

    const newUser = {
      id,
      email: normalizedEmail,
      username,
      passwordHash,
      name: data.name.trim(),
      role: data.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : data.role,
      roles: data.role === "SUPER_ADMIN" ? ["SUPER_ADMIN", "ADMIN"] : [data.role],
      status: "ACTIVE" as const,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      avatarUrl: data.role === "CLIENT"
        ? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80`
        : data.role === "ADMIN" || data.role === "SUPER_ADMIN"
        ? `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80`
        : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`
    };

    db.users.unshift(newUser);

    // If Client, add to clients table
    if (data.role === "CLIENT") {
      const newClient = {
        id: `cl-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        companyName: data.companyName || `${newUser.name}'s Enterprise`,
        industry: data.industry || "Technology",
        rating: 5.0,
        totalSpent: 0,
        activeProjectsCount: 0,
        paymentVerified: true,
        country: data.country || "United States",
        avatarUrl: newUser.avatarUrl
      };
      db.clients.unshift(newClient);
    }

    // If Freelancer, add to freelancers table
    if (data.role === "FREELANCER") {
      const newFreelancer: SeedFreelancer = {
        id: `fl-${Date.now()}`,
        userId: newUser.id,
        username: newUser.username,
        name: newUser.name,
        title: data.title || "Elite Professional Specialist",
        headline: data.title || "Elite Professional Specialist",
        overview: data.bio || `Senior expert specializing in high-performance digital solutions and architectures.`,
        hourlyRate: Number(data.hourlyRate) || 85,
        experienceLevel: "EXPERT",
        rating: 5.0,
        reviewCount: 0,
        totalEarnings: 0,
        completedJobsCount: 0,
        avatarUrl: newUser.avatarUrl,
        country: data.country || "United States",
        city: "San Francisco",
        isTopRated: false,
        isVerified: true,
        isAvailable: true,
        skills: data.skills && data.skills.length > 0 ? data.skills : ["Next.js", "TypeScript", "Tailwind CSS"],
        portfolio: []
      };
      db.freelancers.unshift(newFreelancer);
    }

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: newUser.email,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: newUser.id,
      details: `New account registered as ${data.role} for ${newUser.name} (${newUser.email})`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        roles: newUser.roles,
        avatarUrl: newUser.avatarUrl
      }
    };
  },

  async updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED" | "VERIFIED" | "BANNED") {
    const db = loadDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return { success: false, message: "User not found" };

    user.status = status;
    if (status === "VERIFIED") user.emailVerified = true;

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: "admin@apexlance.io",
      action: `USER_STATUS_${status}`,
      entity: "User",
      entityId: userId,
      details: `Administrator updated status of user ${user.email} to ${status}`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, user };
  },

  async authenticate(email: string, plainTextPassword: string, requiredRole?: "ADMIN" | "CLIENT" | "FREELANCER") {
    const db = loadDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "Incorrect email or password." };
    }

    // Direct match check or bcrypt compare
    let passwordValid = false;
    if (user.passwordHash) {
      passwordValid = await bcrypt.compare(plainTextPassword, user.passwordHash);
    }
    // Fallback demo credentials
    if (!passwordValid) {
      if (
        (email.toLowerCase() === "admin@apexlance.io" && plainTextPassword === "Admin@123456") ||
        (email.toLowerCase() === "david.sterling@lumina.tech" && plainTextPassword === "Client@123456") ||
        (email.toLowerCase() === "alex.chen@apexlance.io" && plainTextPassword === "Freelancer@123456")
      ) {
        passwordValid = true;
      }
    }

    if (!passwordValid) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "Incorrect email or password." };
    }

    if (user.status === "SUSPENDED" || user.status === "BANNED") {
      return { success: false, error: "ACCOUNT_SUSPENDED", message: `Account is currently ${user.status.toLowerCase()}. Please contact platform security.` };
    }

    // Role enforcement
    if (requiredRole) {
      if (requiredRole === "ADMIN") {
        const isAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN" || (user.roles && (user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN")));
        if (!isAdmin) {
          return {
            success: false,
            error: "ROLE_MISMATCH",
            message: `Access denied. This is the Admin Portal. Your account is registered as a ${user.role}. Please sign in through the ${user.role === "CLIENT" ? "Client" : "Freelancer"} portal.`
          };
        }
      } else if (requiredRole === "CLIENT") {
        if (user.role !== "CLIENT" && user.role !== "SUPER_ADMIN") {
          return {
            success: false,
            error: "ROLE_MISMATCH",
            message: `Access denied. This is the Client Portal. Your account is registered as a ${user.role}. Please sign in through the Freelancer portal.`
          };
        }
      } else if (requiredRole === "FREELANCER") {
        if (user.role !== "FREELANCER" && user.role !== "SUPER_ADMIN") {
          return {
            success: false,
            error: "ROLE_MISMATCH",
            message: `Access denied. This is the Freelancer Portal. Your account is registered as a ${user.role}. Please sign in through the Client portal.`
          };
        }
      }
    }

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: user.email,
      action: "USER_LOGGED_IN",
      entity: "User",
      entityId: user.id,
      details: `User ${user.email} signed into ${requiredRole || user.role} portal.`,
      timestamp: new Date().toISOString()
    });
    saveDb(db);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        roles: user.roles || [user.role],
        avatarUrl: user.avatarUrl
      }
    };
  },

  // Freelancers
  async getFreelancers(query?: { search?: string; category?: string; minRate?: number; maxRate?: number; topRated?: boolean }): Promise<SeedFreelancer[]> {
    const db = loadDb();
    let list = [...db.freelancers];
    if (query?.search) {
      const s = query.search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(s) || f.title.toLowerCase().includes(s) || f.skills.some(sk => sk.toLowerCase().includes(s)));
    }
    if (query?.minRate) list = list.filter(f => f.hourlyRate >= query.minRate!);
    if (query?.maxRate) list = list.filter(f => f.hourlyRate <= query.maxRate!);
    if (query?.topRated) list = list.filter(f => f.isTopRated);
    return list;
  },

  async getFreelancerByUsername(username: string): Promise<SeedFreelancer | null> {
    const db = loadDb();
    return db.freelancers.find(f => f.username === username || f.id === username) || null;
  },

  // Services
  async getServices(query?: { search?: string; categorySlug?: string; maxPrice?: number }): Promise<SeedService[]> {
    const db = loadDb();
    let list = [...db.services];
    if (query?.search) {
      const s = query.search.toLowerCase();
      list = list.filter(srv => srv.title.toLowerCase().includes(s) || srv.description.toLowerCase().includes(s));
    }
    if (query?.categorySlug) {
      list = list.filter(srv => srv.categorySlug === query.categorySlug);
    }
    if (query?.maxPrice) {
      list = list.filter(srv => srv.startingPrice <= query.maxPrice!);
    }
    return list;
  },

  async getServiceBySlug(slug: string): Promise<SeedService | null> {
    const db = loadDb();
    return db.services.find(s => s.slug === slug || s.id === slug) || null;
  },

  // Jobs
  async getJobs(query?: { search?: string; categorySlug?: string; budgetType?: string }): Promise<SeedJob[]> {
    const db = loadDb();
    let list = [...db.jobs];
    if (query?.search) {
      const s = query.search.toLowerCase();
      list = list.filter(j => j.title.toLowerCase().includes(s) || j.description.toLowerCase().includes(s) || j.skills.some(sk => sk.toLowerCase().includes(s)));
    }
    if (query?.categorySlug) {
      list = list.filter(j => j.categorySlug === query.categorySlug);
    }
    if (query?.budgetType) {
      list = list.filter(j => j.budgetType === query.budgetType);
    }
    return list;
  },

  async getJobBySlug(slug: string): Promise<SeedJob | null> {
    const db = loadDb();
    return db.jobs.find(j => j.slug === slug || j.id === slug) || null;
  },

  async createJob(data: Partial<SeedJob>): Promise<SeedJob> {
    const db = loadDb();
    const newJob: SeedJob = {
      id: `job-${Date.now()}`,
      clientProfileId: "cl-1",
      clientName: "David Sterling (Lumina Tech)",
      clientCompany: "Lumina Technologies",
      clientCountry: "United States",
      clientRating: 4.96,
      clientTotalSpent: 128000,
      category: data.category || "IT & Software Development",
      categorySlug: data.categorySlug || "it-software",
      title: data.title || "Untitled Project",
      slug: (data.title || "untitled-project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`,
      description: data.description || "",
      budgetType: data.budgetType || "FIXED",
      budgetMin: Number(data.budgetMin || 100),
      budgetMax: Number(data.budgetMax || 1000),
      experienceLevel: data.experienceLevel || "INTERMEDIATE",
      durationWeeks: data.durationWeeks || 4,
      status: "PUBLISHED",
      proposalsCount: 0,
      isRemote: data.isRemote ?? true,
      skills: data.skills || ["React", "TypeScript"],
      postedAt: "Just now"
    };

    db.jobs.unshift(newJob);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: newJob.clientName,
      action: "JOB_CREATED",
      entity: "Job",
      entityId: newJob.id,
      details: `Client posted project: "${newJob.title}" with max budget $${newJob.budgetMax}`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return newJob;
  },

  // Proposals
  async getProposalsForJob(jobId: string) {
    const db = loadDb();
    return db.proposals.filter(p => p.jobId === jobId);
  },

  async submitProposal(jobId: string, freelancerId: string, data: { coverLetter: string; bidAmount: number; deliveryDays: number }) {
    const db = loadDb();
    const freelancer = db.freelancers.find(f => f.id === freelancerId) || db.freelancers[0];
    const newProp = {
      id: `prop-${Date.now()}`,
      jobId,
      freelancerId: freelancer.id,
      freelancerName: freelancer.name,
      freelancerAvatar: freelancer.avatarUrl,
      coverLetter: data.coverLetter,
      bidAmount: data.bidAmount,
      deliveryDays: data.deliveryDays,
      status: "SUBMITTED",
      createdAt: "Just now"
    };

    db.proposals.unshift(newProp);

    const job = db.jobs.find(j => j.id === jobId);
    if (job) job.proposalsCount += 1;

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: freelancer.name,
      action: "PROPOSAL_SUBMITTED",
      entity: "Proposal",
      entityId: newProp.id,
      details: `${freelancer.name} submitted proposal for job ${jobId} with bid $${data.bidAmount}`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return newProp;
  },

  // Contracts
  async getContracts() {
    const db = loadDb();
    return db.contracts;
  },

  async fundMilestone(contractId: string, milestoneId: string) {
    const db = loadDb();
    const contract = db.contracts.find(c => c.id === contractId);
    if (!contract) return { success: false, message: "Contract not found" };
    const m = contract.milestones.find((item: any) => item.id === milestoneId);
    if (!m) return { success: false, message: "Milestone not found" };

    m.status = "FUNDED";

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: contract.clientName,
      action: "ESCROW_MILESTONE_FUNDED",
      entity: "Milestone",
      entityId: milestoneId,
      details: `Escrow funds of $${m.amount} locked for milestone "${m.title}"`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, message: `Milestone "${m.title}" successfully funded into escrow.` };
  },

  async approveMilestone(contractId: string, milestoneId: string) {
    const db = loadDb();
    const contract = db.contracts.find(c => c.id === contractId);
    if (!contract) return { success: false, message: "Contract not found" };
    const m = contract.milestones.find((item: any) => item.id === milestoneId);
    if (!m) return { success: false, message: "Milestone not found" };

    m.status = "APPROVED";
    const commissionPercent = db.settings?.platformCommissionPercentage || 10;
    const commission = m.amount * (commissionPercent / 100);
    const netPayout = m.amount - commission;

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: contract.clientName,
      action: "ESCROW_RELEASED_TO_FREELANCER",
      entity: "Milestone",
      entityId: milestoneId,
      details: `Milestone approved. $${netPayout} credited to ${contract.freelancerName}, $${commission} platform fee deducted.`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, message: `Milestone approved and $${netPayout} released to freelancer wallet.` };
  },

  // Dedicated Client Suite Methods
  getAllClients() {
    const db = loadDb();
    return db.clients.map(c => {
      const user = db.users.find(u => u.id === c.userId);
      return {
        ...c,
        email: user?.email || "",
        username: user?.username || c.username || ""
      };
    });
  },

  getClientProfile(userIdOrClientId: string) {
    const db = loadDb();
    const query = (userIdOrClientId || "").trim();
    if (!query) return db.clients[0] || null;

    // 1. Match client.id or client.userId
    let client = db.clients.find(c => c.id === query || c.userId === query);
    if (client) return client;

    // 2. Match user.id or user.email
    const user = db.users.find(u => u.id === query || u.email.toLowerCase() === query.toLowerCase());
    if (user) {
      client = db.clients.find(c => c.userId === user.id);
      if (client) return client;

      if (user.role === "CLIENT") {
        const newClient = {
          id: `cl-${Date.now()}`,
          userId: user.id,
          name: user.name,
          companyName: user.companyName || `${user.name}'s Enterprise`,
          industry: "Technology & Software",
          rating: 5.0,
          totalSpent: 0,
          activeProjectsCount: 0,
          paymentVerified: true,
          country: "United States",
          avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
        };
        db.clients.unshift(newClient);
        saveDb(db);
        return newClient;
      }
      return null;
    }

    return null;
  },

  getFreelancerProfile(userIdOrFreelancerId: string) {
    const db = loadDb();
    const query = (userIdOrFreelancerId || "").trim();
    if (!query) return db.freelancers[0] || null;

    let freelancer = db.freelancers.find(f => f.id === query || f.userId === query || f.username === query);
    if (freelancer) return freelancer;

    const user = db.users.find(u => u.id === query || u.email.toLowerCase() === query.toLowerCase());
    if (user) {
      freelancer = db.freelancers.find(f => f.userId === user.id);
      if (freelancer) return freelancer;

      if (user.role === "FREELANCER") {
        const newFreelancer: SeedFreelancer = {
          id: `fl-${Date.now()}`,
          userId: user.id,
          username: user.username || `freelancer-${Date.now().toString().slice(-4)}`,
          name: user.name,
          title: user.title || "Specialist Consultant",
          headline: user.bio || "Senior Freelancer on ApexLance",
          overview: user.bio || "Verified professional offering top-tier consulting and implementation.",
          avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          country: user.country || "United States",
          city: "New York",
          hourlyRate: user.hourlyRate || 85,
          experienceLevel: "EXPERT",
          totalEarnings: 0,
          rating: 5.0,
          reviewCount: 0,
          completedJobsCount: 0,
          isTopRated: false,
          isVerified: true,
          isAvailable: true,
          skills: user.skills && user.skills.length > 0 ? user.skills : ["Full Stack", "TypeScript", "React"],
          portfolio: []
        };
        db.freelancers.unshift(newFreelancer);
        saveDb(db);
        return newFreelancer;
      }
      return null;
    }

    return null;
  },

  getClientOverview(userIdOrClientId: string) {
    const db = loadDb();
    const client = this.getClientProfile(userIdOrClientId);
    if (!client) return null;

    const user = db.users.find(u => u.id === client.userId) || null;

    // Filter jobs owned by this client
    const jobs = db.jobs.filter(j => 
      j.clientProfileId === client.id ||
      (client.userId && j.clientProfileId === client.userId) ||
      (j.clientName && client.name && j.clientName.toLowerCase() === client.name.toLowerCase()) ||
      (j.clientCompany && client.companyName && j.clientCompany.toLowerCase() === client.companyName.toLowerCase())
    );

    const jobIds = jobs.map(j => j.id);

    // Filter proposals received for this client's jobs
    const proposals = db.proposals.filter(p => jobIds.includes(p.jobId));

    // Filter contracts involving this client
    const contracts = db.contracts.filter(c => 
      c.clientProfileId === client.id ||
      jobIds.includes(c.jobId) ||
      (c.clientName && client.name && c.clientName.toLowerCase().includes(client.name.toLowerCase())) ||
      (c.clientName && client.companyName && c.clientName.toLowerCase().includes(client.companyName.toLowerCase()))
    );

    // Calculate escrow and financials
    let totalEscrowHeld = 0;
    let totalPaidOut = 0;
    let activeContractsCount = 0;

    contracts.forEach(ctr => {
      if (ctr.status === "ACTIVE") activeContractsCount++;
      (ctr.milestones || []).forEach((m: any) => {
        if (m.status === "FUNDED" || m.status === "IN_PROGRESS" || m.status === "SUBMITTED") {
          totalEscrowHeld += Number(m.amount) || 0;
        } else if (m.status === "APPROVED" || m.status === "RELEASED") {
          totalPaidOut += Number(m.amount) || 0;
        }
      });
    });

    const totalSpent = (client.totalSpent || 0) + totalPaidOut;

    // Filter recent client activity logs
    const recentActivity = db.auditLogs.filter(log => 
      (user && log.actor?.toLowerCase() === user.email?.toLowerCase()) ||
      (client.name && log.actor?.toLowerCase().includes(client.name.toLowerCase())) ||
      jobIds.includes(log.entityId) ||
      contracts.some(c => c.id === log.entityId)
    ).slice(0, 10);

    return {
      client,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl
      } : null,
      stats: {
        totalSpent,
        totalEscrowHeld,
        activeContractsCount,
        jobsPostedCount: jobs.length,
        proposalsReceivedCount: proposals.length,
        rating: client.rating || 5.0
      },
      jobs,
      proposals,
      contracts,
      recentActivity
    };
  },

  getClientJobs(userIdOrClientId: string) {
    const overview = this.getClientOverview(userIdOrClientId);
    return overview ? overview.jobs : [];
  },

  getClientContracts(userIdOrClientId: string) {
    const overview = this.getClientOverview(userIdOrClientId);
    return overview ? overview.contracts : [];
  },

  getClientProposals(userIdOrClientId: string) {
    const overview = this.getClientOverview(userIdOrClientId);
    return overview ? overview.proposals : [];
  },

  async createJobForClient(clientIdOrUserId: string, data: Partial<SeedJob>): Promise<SeedJob> {
    const db = loadDb();
    const client = this.getClientProfile(clientIdOrUserId);
    const user = db.users.find(u => u.id === client.userId);

    const newJob: SeedJob = {
      id: `job-${Date.now()}`,
      clientProfileId: client.id,
      clientName: client.name,
      clientCompany: client.companyName,
      clientCountry: client.country || "United States",
      clientRating: client.rating || 5.0,
      clientTotalSpent: client.totalSpent || 0,
      category: data.category || "IT & Software Development",
      categorySlug: data.categorySlug || "it-software",
      title: data.title || "Untitled Project",
      slug: (data.title || "untitled-project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`,
      description: data.description || "",
      budgetType: data.budgetType || "FIXED",
      budgetMin: Number(data.budgetMin || 500),
      budgetMax: Number(data.budgetMax || 2500),
      experienceLevel: data.experienceLevel || "INTERMEDIATE",
      durationWeeks: Number(data.durationWeeks || 4),
      status: "PUBLISHED",
      proposalsCount: 0,
      isRemote: data.isRemote ?? true,
      skills: data.skills && data.skills.length > 0 ? data.skills : ["React", "TypeScript"],
      postedAt: "Just now"
    };

    db.jobs.unshift(newJob);

    // Update client projects count
    client.jobsPostedCount = (client.jobsPostedCount || 0) + 1;

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: user?.email || client.name,
      action: "JOB_CREATED",
      entity: "Job",
      entityId: newJob.id,
      details: `${client.name} (${client.companyName}) posted project: "${newJob.title}" with budget $${newJob.budgetMin} - $${newJob.budgetMax}`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return newJob;
  },

  async acceptProposal(clientIdOrUserId: string, proposalId: string) {
    const db = loadDb();
    const client = this.getClientProfile(clientIdOrUserId);
    const proposal = db.proposals.find(p => p.id === proposalId);
    if (!proposal) return { success: false, message: "Proposal not found" };

    proposal.status = "ACCEPTED";
    const job = db.jobs.find(j => j.id === proposal.jobId);
    if (job) job.status = "IN_PROGRESS";

    // Create contract
    const newContract = {
      id: `ctr-${Date.now()}`,
      jobId: proposal.jobId,
      jobTitle: job ? job.title : "Custom Project Contract",
      clientProfileId: client.id,
      clientName: `${client.name} (${client.companyName})`,
      freelancerId: proposal.freelancerId,
      freelancerName: proposal.freelancerName,
      totalAmount: proposal.bidAmount,
      status: "ACTIVE",
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: "Initial Milestone Deliverable",
          amount: proposal.bidAmount,
          status: "FUNDED",
          deliverableNote: "Contract established through accepted proposal. Escrow locked."
        }
      ],
      createdAt: new Date().toISOString()
    };

    db.contracts.unshift(newContract);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: client.name,
      action: "PROPOSAL_ACCEPTED_CONTRACT_CREATED",
      entity: "Contract",
      entityId: newContract.id,
      details: `${client.name} accepted ${proposal.freelancerName}'s proposal of $${proposal.bidAmount}. Contract ${newContract.id} initialized with funded escrow.`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, contract: newContract };
  },

  async updateClientProfile(clientIdOrUserId: string, data: { companyName?: string; industry?: string; country?: string; website?: string }) {
    const db = loadDb();
    const client = this.getClientProfile(clientIdOrUserId);
    if (!client) return { success: false, message: "Client not found" };

    if (data.companyName) client.companyName = data.companyName.trim();
    if (data.industry) client.industry = data.industry.trim();
    if (data.country) client.country = data.country.trim();

    if (client.userId) {
      const user = db.users.find(u => u.id === client.userId);
      if (user && data.companyName) {
        user.companyName = data.companyName.trim();
      }
    }

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: client.name,
      action: "CLIENT_PROFILE_UPDATED",
      entity: "ClientProfile",
      entityId: client.id,
      details: `${client.name} updated enterprise profile details for ${client.companyName}`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, client };
  },

  // Direct Hire & Contracting
  async hireFreelancer(data: {
    clientIdOrUserId: string;
    freelancerId: string;
    projectTitle: string;
    description: string;
    totalAmount: number;
    deliveryWeeks?: number;
    initialMilestoneTitle?: string;
    initialMilestoneAmount?: number;
  }) {
    const db = loadDb();
    const client = this.getClientProfile(data.clientIdOrUserId);
    if (!client) return { success: false, message: "Client profile not found" };

    const freelancer = db.freelancers.find(f => f.id === data.freelancerId || f.username === data.freelancerId) || db.freelancers[0];
    if (!freelancer) return { success: false, message: "Freelancer not found" };

    const total = Number(data.totalAmount) || 1000;
    const initialAmount = Number(data.initialMilestoneAmount || total);

    const newContract = {
      id: `ctr-${Date.now()}`,
      jobTitle: data.projectTitle || `Direct Hire: Custom Project with ${freelancer.name}`,
      clientProfileId: client.id,
      clientName: `${client.name} (${client.companyName})`,
      freelancerId: freelancer.id,
      freelancerName: freelancer.name,
      totalAmount: total,
      status: "ACTIVE",
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: data.initialMilestoneTitle || "Initial Project Deliverable",
          amount: initialAmount,
          status: "FUNDED",
          deliverableNote: data.description || "Direct hire engagement initialized. Escrow locked."
        }
      ],
      createdAt: new Date().toISOString()
    };

    db.contracts.unshift(newContract);

    // Also initiate / update chat conversation with automated notice
    const conversation = this.getOrCreateConversation(client.id, freelancer.id, db);
    conversation.contractId = newContract.id;
    conversation.lastMessage = `🎉 Direct Hire Offer Accepted! Contract ${newContract.id} initialized for "${newContract.jobTitle}" with $${initialAmount} funded in escrow.`;
    conversation.lastMessageAt = new Date().toISOString();

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: client.id,
      senderRole: "SYSTEM",
      senderName: "ApexLance Escrow",
      content: `🎉 Direct Hire Established! Contract ${newContract.id} created for "${newContract.jobTitle}" with $${initialAmount} locked in escrow. Milestones are active in your workspaces.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.messages.push(welcomeMsg);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: client.name,
      action: "CLIENT_DIRECT_HIRE",
      entity: "Contract",
      entityId: newContract.id,
      details: `${client.name} (${client.companyName}) directly hired ${freelancer.name} for $${total}. Milestone 1 funded into escrow.`,
      timestamp: new Date().toISOString()
    });

    saveDb(db);
    return { success: true, contract: newContract, conversation };
  },

  // Messaging System
  getOrCreateConversation(partyAId: string, partyBId: string, existingDb?: DbSchema): ChatConversation {
    const db = existingDb || loadDb();
    
    // Find client and freelancer from either parameter
    let client = this.getClientProfile(partyAId);
    let freelancer = db.freelancers.find(f => f.id === partyBId || f.userId === partyBId || f.username === partyBId);

    if (!freelancer) {
      // maybe partyA was freelancer and partyB was client
      freelancer = db.freelancers.find(f => f.id === partyAId || f.userId === partyAId || f.username === partyAId);
      if (freelancer) {
        client = this.getClientProfile(partyBId);
      }
    }

    if (!client) client = db.clients[0];
    if (!freelancer) freelancer = db.freelancers[0];

    let conv = db.conversations.find(c => 
      (c.clientId === client.id || c.clientId === client.userId) &&
      (c.freelancerId === freelancer.id || c.freelancerId === freelancer.userId)
    );

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        clientId: client.id,
        clientName: client.name,
        clientCompanyName: client.companyName,
        clientAvatar: client.avatarUrl,
        freelancerId: freelancer.id,
        freelancerName: freelancer.name,
        freelancerAvatar: freelancer.avatarUrl,
        freelancerTitle: freelancer.title,
        lastMessage: "Direct message thread opened.",
        lastMessageAt: new Date().toISOString(),
        unreadCountClient: 0,
        unreadCountFreelancer: 0,
        createdAt: new Date().toISOString()
      };
      db.conversations.unshift(conv);
      if (!existingDb) {
        saveDb(db);
      }
    }

    return conv;
  },

  getConversations(userIdOrClientId: string, requiredRole?: "CLIENT" | "FREELANCER" | "ADMIN"): ChatConversation[] {
    const db = loadDb();
    const query = (userIdOrClientId || "").trim();
    const client = db.clients.find(c => c.id === query || c.userId === query);
    const freelancer = db.freelancers.find(f => f.id === query || f.userId === query || f.username === query);

    return db.conversations.filter(c => {
      if (requiredRole === "CLIENT") {
        if (client) return c.clientId === client.id || c.clientId === client.userId;
        return c.clientId === query;
      }
      if (requiredRole === "FREELANCER") {
        if (freelancer) return c.freelancerId === freelancer.id || c.freelancerId === freelancer.userId;
        return c.freelancerId === query;
      }
      // Default: match either client or freelancer
      if (client && (c.clientId === client.id || c.clientId === client.userId)) return true;
      if (freelancer && (c.freelancerId === freelancer.id || c.freelancerId === freelancer.userId)) return true;
      return c.clientId === query || c.freelancerId === query;
    }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  getContacts(forRole?: "CLIENT" | "FREELANCER" | "ADMIN") {
    const db = loadDb();
    const freelancers = db.freelancers.map(f => ({
      id: f.id,
      userId: f.userId,
      username: f.username,
      name: f.name,
      role: "FREELANCER" as const,
      title: f.title,
      avatarUrl: f.avatarUrl,
      rate: f.hourlyRate,
      rating: f.rating,
      badge: f.isTopRated ? "TOP RATED" : "VERIFIED",
      country: f.country
    }));

    const clients = db.clients.map(c => ({
      id: c.id,
      userId: c.userId,
      username: c.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: c.name,
      role: "CLIENT" as const,
      title: c.companyName,
      avatarUrl: c.avatarUrl,
      rate: undefined,
      rating: c.rating,
      badge: "ENTERPRISE",
      country: c.country
    }));

    if (forRole === "CLIENT") {
      return freelancers;
    } else if (forRole === "FREELANCER") {
      return clients;
    } else {
      return [...freelancers, ...clients];
    }
  },

  getConversationById(conversationId: string): ChatConversation | null {
    const db = loadDb();
    return db.conversations.find(c => c.id === conversationId) || null;
  },

  getConversationMessages(conversationId: string): ChatMessage[] {
    const db = loadDb();
    return db.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async sendMessage(data: {
    conversationId?: string;
    clientIdOrUserId: string;
    freelancerId?: string;
    senderId?: string;
    content: string;
    senderRole: "CLIENT" | "FREELANCER";
  }) {
    const db = loadDb();
    let conversation: ChatConversation;

    if (data.conversationId) {
      const found = db.conversations.find(c => c.id === data.conversationId);
      if (found) {
        conversation = found;
      } else if (data.freelancerId) {
        conversation = this.getOrCreateConversation(data.clientIdOrUserId, data.freelancerId, db);
      } else {
        return { success: false, message: "Conversation not found" };
      }
    } else if (data.freelancerId) {
      conversation = this.getOrCreateConversation(data.clientIdOrUserId, data.freelancerId, db);
    } else {
      return { success: false, message: "Target conversation or freelancer required" };
    }

    const client = db.clients.find(c => c.id === conversation.clientId);
    const freelancer = db.freelancers.find(f => f.id === conversation.freelancerId);

    const isClient = data.senderRole === "CLIENT";
    let senderName = isClient ? (client?.name || "Client") : (freelancer?.name || "Freelancer");
    let senderAvatar = isClient ? client?.avatarUrl : freelancer?.avatarUrl;

    if (data.senderId) {
      const matchClient = db.clients.find(c => c.id === data.senderId || c.userId === data.senderId);
      if (matchClient) {
        senderName = matchClient.name;
        senderAvatar = matchClient.avatarUrl;
      }
      const matchFreelancer = db.freelancers.find(f => f.id === data.senderId || f.userId === data.senderId);
      if (matchFreelancer) {
        senderName = matchFreelancer.name;
        senderAvatar = matchFreelancer.avatarUrl;
      }
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: isClient ? conversation.clientId : conversation.freelancerId,
      senderRole: data.senderRole,
      senderName,
      senderAvatar,
      content: data.content.trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    db.messages.push(newMessage);

    // Update conversation
    conversation.lastMessage = newMessage.content;
    conversation.lastMessageAt = newMessage.createdAt;
    if (isClient) {
      conversation.unreadCountFreelancer = (conversation.unreadCountFreelancer || 0) + 1;
    } else {
      conversation.unreadCountClient = (conversation.unreadCountClient || 0) + 1;
    }

    saveDb(db);
    return { success: true, message: newMessage, conversation };
  },

  markMessagesAsRead(conversationId: string, readerRole: "CLIENT" | "FREELANCER") {
    const db = loadDb();
    const conv = db.conversations.find(c => c.id === conversationId);
    if (conv) {
      if (readerRole === "CLIENT") {
        conv.unreadCountClient = 0;
      } else {
        conv.unreadCountFreelancer = 0;
      }
    }

    db.messages.forEach(m => {
      if (m.conversationId === conversationId && m.senderRole !== readerRole) {
        m.isRead = true;
      }
    });

    saveDb(db);
    return { success: true };
  },

  // Taxonomy
  getCategories() {
    const db = loadDb();
    return db.categories;
  },

  getSkills(searchQuery?: string) {
    const db = loadDb();
    if (!searchQuery) return db.skills.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return db.skills.filter((s: any) => s.name.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
  },

  // Platform Commission Setting
  updatePlatformCommission(percentage: number) {
    const db = loadDb();
    db.settings.platformCommissionPercentage = percentage;
    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor: "admin@apexlance.io",
      action: "COMMISSION_UPDATED",
      entity: "Settings",
      entityId: "platformCommissionPercentage",
      details: `Administrator updated platform commission to ${percentage}%`,
      timestamp: new Date().toISOString()
    });
    saveDb(db);
    return { success: true, percentage };
  },

  // Analytics & Audits
  getAdminAnalytics() {
    const db = loadDb();
    return {
      stats: PLATFORM_STATS,
      totalUsers: db.users.length + 64500,
      activeContractsCount: db.contracts.length + 18,
      totalEscrowHeld: 48500,
      totalCommissionEarned: 142000,
      disputesCount: 2,
      pendingVerificationsCount: 7,
      settings: db.settings
    };
  },

  getAuditLogs() {
    const db = loadDb();
    return db.auditLogs;
  }
};
