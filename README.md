# ApexLance — World-Class Freelancer Marketplace Platform

An enterprise-grade, scalable, and secure freelancer marketplace platform (spanning IT and non-IT service sectors) built with Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

---

## 🌟 Key Architecture & Capabilities

1. **Dual Marketplace Business Models**:
   - **Client Project Marketplace (Upwork Model)**: Clients post jobs, receive bids, interview candidates, award contracts, fund milestone escrow, approve deliverables, and release payments.
   - **Fixed-Price Service Catalog (Fiverr Model)**: Freelancers list packaged gigs with 3 tiers (Basic, Standard, Premium), clear delivery days, and revision limits.
2. **Institutional Escrow & Financial Invariants**:
   - Milestone funds are held in platform escrow before work starts.
   - Zero floating point financial math; all amounts use reproducible decimal and integer precision.
   - 10% standard platform take-rate with volume sliding fee (drops to 7% on $5,000+ contracts).
   - Instant wallet withdrawals with audit logging.
3. **Multi-Role RBAC Authentication**:
   - Granular permission matrix (`jobs:create`, `proposals:submit`, `milestones:approve`, `disputes:resolve`, `audit:read`, etc.).
   - Password hashing with **bcryptjs (12 rounds)**.
   - JWT session management with secure HTTP-only cookies.
4. **Hierarchical Service Taxonomy**:
   - 12 top categories and 100+ subcategories across IT & Software, Creative Design, Technical Writing, Growth Marketing, Video/Audio, Finance & Accounting, Legal & Contracts, Architecture, and Specialized Local Services.
   - 500+ verified skills indexed.
5. **Tamper-Proof Audit Logging**:
   - Every sensitive mutation (user suspensions, commission changes, job postings, escrow fundings, and milestone approvals) is recorded in an immutable audit stream.

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@apexlance.io` | `Admin@123456` | [`/admin`](http://localhost:3000/admin) |
| **Client** | `david.sterling@lumina.tech` | `Client@123456` | [`/dashboard/client`](http://localhost:3000/dashboard/client) |
| **Freelancer** | `alex.chen@apexlance.io` | `Freelancer@123456` | [`/dashboard/freelancer`](http://localhost:3000/dashboard/freelancer) |

> 💡 **Quick Switcher**: Use the instant 1-click role switcher bar on top of the navbar or on the [`/login`](http://localhost:3000/login) page to switch roles effortlessly.

---

## 🗄️ Database Architecture & Migrations

- **Prisma Schema**: Located in [`prisma/schema.prisma`](./prisma/schema.prisma) with UUID primary keys, relational constraints, foreign keys, and indexes.
- **Production PostgreSQL Migration SQL**: Fully generated in [`prisma/migrations/0_init/migration.sql`](./prisma/migrations/0_init/migration.sql) (924 lines of PostgreSQL DDL).
- **Persistent Data Store**: [`src/lib/data/db-store.json`](./src/lib/data/db-store.json) guarantees full mutation persistence across restarts.

### Running Database Migrations & Seeds

```bash
# Generate Prisma Client
npx prisma generate

# Run Database Seeding (Seeds Admin User, Client, Freelancer, 100+ Categories, and 500+ Skills)
npm run db:seed
```

---

## 🚀 Running the Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run full TypeScript validation
npx tsc --noEmit

# Production build bundle check
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗺️ Portal & Route Directory

### Public Experience
- `/`: Premium Homepage (Hero search bar, categories, vetted talent, gigs, open jobs, escrow trust section).
- `/freelancers`: Talent Search Directory with hourly rate slider and top-rated filter.
- `/freelancers/[username]`: Public Freelancer Profile, portfolio case studies, reviews, and Direct Hire modal.
- `/services`: Fixed-price service catalog with category and price filters.
- `/services/[slug]`: 3-Tier package comparison (Basic, Standard, Premium) with escrow checkout.
- `/jobs`: Open client project listings feed.
- `/jobs/[slug]`: Project details with client verification credentials and functional proposal submission form.
- `/how-it-works`: Complete buyer & seller workflow guide.
- `/pricing`: Transparent platform economics and sliding fee schedule.

### Client Management Suite
- `/dashboard/client`: Active contracts overview, milestone escrow funding, deliverable inspection, and payment release.
- `/dashboard/client/jobs/new`: Multi-step job posting wizard that publishes projects live into the marketplace.

### Freelancer Workroom
- `/dashboard/freelancer`: Wallet balance, instant ACH/Stripe withdrawals, deliverable submission, and contract tracking.

### Super Administrator Console
- `/admin`: Platform GMV, escrow deposits, active contracts, user management table (suspend / verify actions), real-time immutable audit log stream, and dynamic commission percentage configuration.

---

## 📡 REST API Architecture (`/api/v1/...`)

- `POST /api/v1/auth/login`: Authenticate with email & password, sets JWT cookie.
- `GET /api/v1/auth/me`: Verifies active session token.
- `POST /api/v1/auth/logout`: Clears authentication cookie.
- `GET /api/v1/categories`: Lists 12 category trees and subcategories.
- `GET /api/v1/skills`: Search 500+ verified skills.
- `GET /api/v1/freelancers`: Search and filter freelancers.
- `GET /api/v1/services`: Search and filter service packages.
- `GET /api/v1/jobs`: List open client opportunities.
- `POST /api/v1/jobs`: Create new job listing (Zod validated).
- `POST /api/v1/jobs/[id]/proposals`: Submit proposal bid.
- `GET /api/v1/contracts`: Retrieve active contracts and milestones.
- `POST /api/v1/contracts/[id]/milestones/[mId]/fund`: Lock milestone funds in escrow.
- `POST /api/v1/contracts/[id]/milestones/[mId]/approve`: Release escrow funds to freelancer minus platform take-rate.
- `GET /api/v1/admin/users`: User management list.
- `PATCH /api/v1/admin/users`: Moderate user status (ACTIVE, SUSPENDED, VERIFIED).
- `POST /api/v1/admin/commission`: Update platform commission percentage.
- `GET /api/v1/admin/analytics`: Platform KPIs and audit logs.
