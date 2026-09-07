import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-production-grade-cryptographic-jwt-key-minimum-32-chars";

export type RoleType = 
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "FINANCE"
  | "SUPPORT"
  | "CLIENT"
  | "FREELANCER"
  | "AGENCY_ADMIN"
  | "AGENCY_MEMBER";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: RoleType;
  roles: RoleType[];
  avatarUrl?: string;
}

// Preset Demo Accounts for Multi-Role Switching & Testing
export const DEMO_ACCOUNTS: Record<string, AuthUser> = {
  freelancer: {
    id: "user-fl-1",
    email: "alex.chen@apexlance.io",
    username: "alex-chen",
    name: "Alex Chen",
    role: "FREELANCER",
    roles: ["FREELANCER"],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  client: {
    id: "user-cl-1",
    email: "david.sterling@lumina.tech",
    username: "lumina-tech",
    name: "David Sterling (Lumina Tech)",
    role: "CLIENT",
    roles: ["CLIENT"],
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
  },
  admin: {
    id: "user-admin-1",
    email: "admin@apexlance.io",
    username: "admin",
    name: "Platform Administrator",
    role: "SUPER_ADMIN",
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
  }
};

// Permission Mapping Table
const ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "jobs:moderate", "services:moderate", "users:manage", "users:suspend",
    "disputes:resolve", "taxonomy:manage", "finance:view_ledger", "audit:read"
  ],
  MODERATOR: ["jobs:moderate", "services:moderate", "users:suspend"],
  FINANCE: ["finance:view_ledger", "payments:refund", "commissions:manage"],
  SUPPORT: ["tickets:manage", "disputes:read"],
  CLIENT: [
    "jobs:create", "jobs:manage_own", "proposals:view_own_jobs",
    "contracts:create", "milestones:fund", "milestones:approve", "reviews:create"
  ],
  FREELANCER: [
    "services:publish", "proposals:submit", "milestones:submit", "reviews:create", "wallet:withdraw"
  ],
  AGENCY_ADMIN: ["agency:manage", "services:publish", "proposals:submit"],
  AGENCY_MEMBER: ["services:publish", "proposals:submit"]
};

export function hasPermission(role: RoleType, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

export function signJwtToken(user: AuthUser): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      roles: user.roles
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyJwtToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      name: decoded.name,
      role: decoded.role,
      roles: decoded.roles || [decoded.role]
    };
  } catch {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 12);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}
