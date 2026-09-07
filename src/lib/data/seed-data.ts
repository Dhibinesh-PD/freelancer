export interface SeedFreelancer {
  id: string;
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  title: string;
  headline: string;
  overview: string;
  hourlyRate: number;
  experienceLevel: "ENTRY" | "INTERMEDIATE" | "EXPERT";
  rating: number;
  reviewCount: number;
  totalEarnings: number;
  completedJobsCount: number;
  country: string;
  city: string;
  skills: string[];
  isTopRated: boolean;
  isVerified: boolean;
  isAvailable: boolean;
  portfolio: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
  }[];
}

export interface SeedClient {
  id: string;
  userId: string;
  username: string;
  name: string;
  companyName: string;
  avatarUrl: string;
  country: string;
  totalSpent: number;
  rating: number;
  reviewCount: number;
  jobsPostedCount: number;
}

export interface SeedService {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerRating: number;
  category: string;
  categorySlug: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  startingPrice: number;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  packages: {
    tier: "BASIC" | "STANDARD" | "PREMIUM";
    name: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features: string[];
  }[];
}

export interface SeedJob {
  id: string;
  clientProfileId: string;
  clientName: string;
  clientCompany: string;
  clientCountry: string;
  clientRating: number;
  clientTotalSpent: number;
  category: string;
  categorySlug: string;
  title: string;
  slug: string;
  description: string;
  budgetType: "FIXED" | "HOURLY";
  budgetMin: number;
  budgetMax: number;
  experienceLevel: "ENTRY" | "INTERMEDIATE" | "EXPERT";
  durationWeeks: number;
  status: "PUBLISHED" | "IN_PROGRESS" | "COMPLETED";
  proposalsCount: number;
  isRemote: boolean;
  skills: string[];
  postedAt: string;
}

export const SEED_FREELANCERS: SeedFreelancer[] = [
  {
    id: "fl-1",
    userId: "user-fl-1",
    username: "alex-chen",
    name: "Alex Chen",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    title: "Senior Full-Stack & Next.js Architect",
    headline: "Ex-Stripe engineer specializing in scalable React, Next.js, and TypeScript architectures.",
    overview: "With over 9 years of engineering experience, I build high-throughput, enterprise-grade web applications. I specialize in Next.js App Router, Tailwind CSS, PostgreSQL, and high-performance serverless backends.",
    hourlyRate: 110,
    experienceLevel: "EXPERT",
    rating: 4.98,
    reviewCount: 47,
    totalEarnings: 184500,
    completedJobsCount: 52,
    country: "United States",
    city: "San Francisco, CA",
    skills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS"],
    isTopRated: true,
    isVerified: true,
    isAvailable: true,
    portfolio: [
      {
        id: "p1",
        title: "Fintech SaaS Platform Dashboard",
        description: "Architected a real-time trading dashboard handling 50k+ daily transactions with sub-100ms API responses.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Prisma"]
      },
      {
        id: "p2",
        title: "Enterprise Design System & UI Library",
        description: "Built an accessible, token-driven component library used across 14 internal product teams.",
        imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        technologies: ["React", "Storybook", "Tailwind CSS", "Radix UI"]
      }
    ]
  },
  {
    id: "fl-2",
    userId: "user-fl-2",
    username: "elena-rostova",
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    title: "Lead UI/UX & Product Designer",
    headline: "Award-winning product designer creating high-converting web & mobile design systems.",
    overview: "I design intuitive, beautiful, and accessible software interfaces that drive conversions. Having designed 60+ products from zero to scale, my process marries rigorous user research with world-class visual polish.",
    hourlyRate: 95,
    experienceLevel: "EXPERT",
    rating: 5.0,
    reviewCount: 39,
    totalEarnings: 132000,
    completedJobsCount: 44,
    country: "Germany",
    city: "Berlin",
    skills: ["Figma", "UI Design", "UX Research", "Design Systems", "Prototyping", "Wireframing"],
    isTopRated: true,
    isVerified: true,
    isAvailable: true,
    portfolio: [
      {
        id: "p3",
        title: "B2B AI Productivity Suite Interface",
        description: "End-to-end design system, user testing, and interactive prototypes for an AI workflow application.",
        imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
        technologies: ["Figma", "Protopie", "Design Tokens", "Accessibility WCAG"]
      }
    ]
  },
  {
    id: "fl-3",
    userId: "user-fl-3",
    username: "devon-vance",
    name: "Devon Vance",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    title: "DevOps & Cloud Infrastructure Architect",
    headline: "AWS Certified Solutions Architect & Kubernetes DevOps Engineer.",
    overview: "Specialized in cloud migration, Terraform infrastructure-as-code, Docker containerization, and zero-downtime CI/CD pipelines.",
    hourlyRate: 125,
    experienceLevel: "EXPERT",
    rating: 4.96,
    reviewCount: 31,
    totalEarnings: 145000,
    completedJobsCount: 36,
    country: "Canada",
    city: "Toronto",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux Admin", "PostgreSQL"],
    isTopRated: true,
    isVerified: true,
    isAvailable: false,
    portfolio: [
      {
        id: "p4",
        title: "Multi-Region Kubernetes Cluster Migration",
        description: "Migrated high-traffic microservices to AWS EKS with 99.99% SLA and 35% cloud cost reduction.",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        technologies: ["Kubernetes", "AWS EKS", "Terraform", "Helm", "Prometheus"]
      }
    ]
  },
  {
    id: "fl-4",
    userId: "user-fl-4",
    username: "priya-sharma",
    name: "Priya Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    title: "AI & Machine Learning Engineer",
    headline: "LLM fine-tuning, RAG pipelines, and generative AI application development.",
    overview: "I build enterprise AI solutions integrating LLMs, LangChain, vector databases, and custom PyTorch deep learning models for NLP and automation.",
    hourlyRate: 115,
    experienceLevel: "EXPERT",
    rating: 4.97,
    reviewCount: 28,
    totalEarnings: 98000,
    completedJobsCount: 30,
    country: "India",
    city: "Bengaluru",
    skills: ["Python", "PyTorch", "OpenAI API", "LangChain", "Vector Databases", "FastAPI"],
    isTopRated: true,
    isVerified: true,
    isAvailable: true,
    portfolio: [
      {
        id: "p5",
        title: "Intelligent Document Analysis RAG System",
        description: "Automated extraction and analysis of financial filings using embedding search and fine-tuned LLMs.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        technologies: ["Python", "LangChain", "Pinecone", "OpenAI", "FastAPI"]
      }
    ]
  },
  {
    id: "fl-5",
    userId: "user-fl-5",
    username: "marcus-thorne",
    name: "Marcus Thorne",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    title: "Fractional CFO & Financial Modeling Consultant",
    headline: "Former Goldman Sachs analyst providing 3-statement models, valuation, and capital raising support.",
    overview: "I help startups and growth companies prepare institutional-grade financial models, investor pitch decks, and cashflow optimization plans.",
    hourlyRate: 140,
    experienceLevel: "EXPERT",
    rating: 5.0,
    reviewCount: 24,
    totalEarnings: 112000,
    completedJobsCount: 25,
    country: "United Kingdom",
    city: "London",
    skills: ["Financial Modeling", "Valuation", "Excel VBA", "SaaS Metrics", "Pitch Decks", "Cashflow Management"],
    isTopRated: true,
    isVerified: true,
    isAvailable: true,
    portfolio: [
      {
        id: "p6",
        title: "Series A SaaS Financial Model & Valuation",
        description: "Built comprehensive dynamic financial forecasting model that helped a client secure $8.5M Series A funding.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        technologies: ["Financial Modeling", "Scenario Analysis", "Excel", "KPI Dashboard"]
      }
    ]
  },
  {
    id: "fl-6",
    userId: "user-fl-6",
    username: "sarah-jenkins",
    name: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    title: "B2B SaaS Copywriter & Content Strategist",
    headline: "Direct-response copywriting that drives conversions for high-growth tech companies.",
    overview: "I write landing pages, case studies, and email sequences that explain complex software clearly and compel enterprise decision-makers to act.",
    hourlyRate: 85,
    experienceLevel: "EXPERT",
    rating: 4.95,
    reviewCount: 42,
    totalEarnings: 88000,
    completedJobsCount: 49,
    country: "United States",
    city: "Austin, TX",
    skills: ["Copywriting", "Landing Page Copy", "Email Copywriting", "SEO Optimization", "Technical Writing"],
    isTopRated: true,
    isVerified: true,
    isAvailable: true,
    portfolio: [
      {
        id: "p7",
        title: "Cloud Security Landing Page Redesign Copy",
        description: "Rewrote marketing copy and positioning, boosting inbound demo booking conversion rate by 42%.",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
        technologies: ["Copywriting", "A/B Testing", "GTM Messaging"]
      }
    ]
  }
];

export const SEED_CLIENTS: SeedClient[] = [
  {
    id: "cl-1",
    userId: "user-cl-1",
    username: "lumina-tech",
    name: "David Sterling",
    companyName: "Lumina Technologies Inc.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    country: "United States",
    totalSpent: 128000,
    rating: 4.96,
    reviewCount: 38,
    jobsPostedCount: 26
  },
  {
    id: "cl-2",
    userId: "user-cl-2",
    username: "nexus-health",
    name: "Claire Beauchamp",
    companyName: "Nexus Health Systems",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    country: "Canada",
    totalSpent: 74500,
    rating: 5.0,
    reviewCount: 19,
    jobsPostedCount: 14
  }
];

export const SEED_SERVICES: SeedService[] = [
  {
    id: "srv-1",
    freelancerId: "fl-1",
    freelancerName: "Alex Chen",
    freelancerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    freelancerRating: 4.98,
    category: "IT & Software Development",
    categorySlug: "it-software",
    title: "I will build a production-ready Next.js 15 full-stack application",
    slug: "build-production-nextjs-app",
    description: "Get a modern, blazing-fast web application built with Next.js 15 App Router, TypeScript, Tailwind CSS, and PostgreSQL. Clean code, SEO-optimized, and fully responsive.",
    coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    startingPrice: 450,
    deliveryDays: 5,
    rating: 5.0,
    reviewCount: 28,
    salesCount: 34,
    packages: [
      {
        tier: "BASIC",
        name: "MVP Starter",
        price: 450,
        deliveryDays: 4,
        revisions: 2,
        features: ["3 Responsive Pages", "Tailwind CSS Styling", "TypeScript Setup", "SEO Metadata"]
      },
      {
        tier: "STANDARD",
        name: "Full Stack Pro",
        price: 950,
        deliveryDays: 7,
        revisions: 3,
        features: ["7 Responsive Pages", "Database Integration (PostgreSQL/Prisma)", "Authentication System", "API Route Handlers", "Speed Optimization"]
      },
      {
        tier: "PREMIUM",
        name: "Enterprise Architecture",
        price: 1800,
        deliveryDays: 14,
        revisions: 5,
        features: ["Complete Web App", "Payments / Stripe Escrow Integration", "Admin Dashboard", "CI/CD Setup", "Testing & 30-Day Support"]
      }
    ]
  },
  {
    id: "srv-2",
    freelancerId: "fl-2",
    freelancerName: "Elena Rostova",
    freelancerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    freelancerRating: 5.0,
    category: "Design & Creative",
    categorySlug: "design-creative",
    title: "I will design an enterprise UI/UX design system in Figma",
    slug: "enterprise-ui-ux-figma-system",
    description: "Modern, pixel-perfect user interface design tailored for web and mobile apps. Complete with reusable Figma component tokens, responsive auto-layout, and interactive prototypes.",
    coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80",
    startingPrice: 350,
    deliveryDays: 4,
    rating: 5.0,
    reviewCount: 31,
    salesCount: 42,
    packages: [
      {
        tier: "BASIC",
        name: "Key Screen Concept",
        price: 350,
        deliveryDays: 3,
        revisions: 2,
        features: ["2 High-fidelity Screens", "Mobile & Desktop Variants", "Figma Source File"]
      },
      {
        tier: "STANDARD",
        name: "Product Core Pack",
        price: 750,
        deliveryDays: 6,
        revisions: 3,
        features: ["6 High-fidelity Screens", "Interactive Prototype", "Design System Tokens", "Export Assets"]
      },
      {
        tier: "PREMIUM",
        name: "Complete SaaS Suite",
        price: 1500,
        deliveryDays: 12,
        revisions: 5,
        features: ["15+ Complete App Screens", "Design System & UI Kit", "Developer Hand-off Specs", "Clickable Prototype", "User Testing Report"]
      }
    ]
  },
  {
    id: "srv-3",
    freelancerId: "fl-4",
    freelancerName: "Priya Sharma",
    freelancerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    freelancerRating: 4.97,
    category: "IT & Software Development",
    categorySlug: "it-software",
    title: "I will build a custom AI agent & RAG pipeline with LangChain",
    slug: "build-custom-ai-agent-rag-pipeline",
    description: "Integrate generative AI into your business. Custom RAG vector retrieval, LLM agents, and FastAPI microservices for document parsing and intelligent search.",
    coverImageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    startingPrice: 600,
    deliveryDays: 5,
    rating: 4.98,
    reviewCount: 19,
    salesCount: 23,
    packages: [
      {
        tier: "BASIC",
        name: "LLM Wrapper API",
        price: 600,
        deliveryDays: 4,
        revisions: 2,
        features: ["OpenAI API Integration", "Prompt Engineering", "FastAPI Endpoint", "Basic Error Handling"]
      },
      {
        tier: "STANDARD",
        name: "RAG Vector Pipeline",
        price: 1200,
        deliveryDays: 8,
        revisions: 3,
        features: ["Document Ingestion (PDF/CSV)", "Vector Database Setup (Pinecone/pgvector)", "LangChain Retrieval", "Evaluation Suite"]
      },
      {
        tier: "PREMIUM",
        name: "Autonomous AI Agent",
        price: 2400,
        deliveryDays: 16,
        revisions: 5,
        features: ["Multi-tool Calling Agent", "Custom Memory & Session Store", "Streaming UI Integration", "Docker Containerization", "Full Production Deployment"]
      }
    ]
  }
];

export const SEED_JOBS: SeedJob[] = [
  {
    id: "job-1",
    clientProfileId: "cl-1",
    clientName: "David Sterling",
    clientCompany: "Lumina Technologies",
    clientCountry: "United States",
    clientRating: 4.96,
    clientTotalSpent: 128000,
    category: "IT & Software Development",
    categorySlug: "it-software",
    title: "Build Real-Time Collaboration & Analytics Portal for B2B Clients",
    slug: "build-real-time-collaboration-analytics-portal",
    description: "We are seeking a senior full-stack engineer to architect a high-performance analytics portal. Must be proficient in Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, and scalable API design. Deliverables include client dashboard, role permissions, and export capabilities.",
    budgetType: "FIXED",
    budgetMin: 3500,
    budgetMax: 5000,
    experienceLevel: "EXPERT",
    durationWeeks: 6,
    status: "PUBLISHED",
    proposalsCount: 14,
    isRemote: true,
    skills: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    postedAt: "2 hours ago"
  },
  {
    id: "job-2",
    clientProfileId: "cl-2",
    clientName: "Claire Beauchamp",
    clientCompany: "Nexus Health",
    clientCountry: "Canada",
    clientRating: 5.0,
    clientTotalSpent: 74500,
    category: "Design & Creative",
    categorySlug: "design-creative",
    title: "Complete Mobile & Web App Redesign for Patient Telehealth Platform",
    slug: "telehealth-patient-app-redesign",
    description: "Looking for an exceptional product designer to redesign our patient-facing telehealth experience. Requires comprehensive Figma design system, accessible components (WCAG AA), and interactive prototypes for iOS, Android, and web.",
    budgetType: "HOURLY",
    budgetMin: 80,
    budgetMax: 110,
    experienceLevel: "EXPERT",
    durationWeeks: 8,
    status: "PUBLISHED",
    proposalsCount: 9,
    isRemote: true,
    skills: ["Figma", "UI Design", "UX Research", "Design Systems", "Prototyping"],
    postedAt: "5 hours ago"
  },
  {
    id: "job-3",
    clientProfileId: "cl-1",
    clientName: "David Sterling",
    clientCompany: "Lumina Technologies",
    clientCountry: "United States",
    clientRating: 4.96,
    clientTotalSpent: 128000,
    category: "IT & Software Development",
    categorySlug: "it-software",
    title: "AWS Kubernetes Infrastructure Setup & Zero-Downtime CI/CD Pipeline",
    slug: "aws-kubernetes-infrastructure-setup-cicd",
    description: "We need an AWS DevOps expert to migrate our Dockerized microservices to AWS EKS with Terraform IaC, automated GitHub Actions CI/CD, SSL termination, and Datadog monitoring integration.",
    budgetType: "FIXED",
    budgetMin: 2500,
    budgetMax: 4000,
    experienceLevel: "EXPERT",
    durationWeeks: 4,
    status: "PUBLISHED",
    proposalsCount: 7,
    isRemote: true,
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux Admin"],
    postedAt: "1 day ago"
  }
];

export const PLATFORM_STATS = {
  activeFreelancers: "45,000+",
  completedProjects: "128,000+",
  globalCountries: "135+",
  clientSatisfaction: "99.4%",
  totalVolume: "$42M+"
};
