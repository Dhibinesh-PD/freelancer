export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  projectCount: number;
  freelancerCount: number;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    description: string;
    skills: string[];
  }[];
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "cat-it-software",
    name: "IT & Software Development",
    slug: "it-software",
    description: "Enterprise web apps, cloud infrastructure, AI models, mobile apps & cybersecurity.",
    icon: "Code2",
    projectCount: 4210,
    freelancerCount: 12500,
    subcategories: [
      { id: "sub-web-dev", name: "Web Development", slug: "web-development", description: "Full-stack, frontend, and backend web solutions.", skills: ["React", "Next.js", "Node.js", "TypeScript", "Python", "Tailwind CSS"] },
      { id: "sub-mobile-dev", name: "Mobile Development", slug: "mobile-development", description: "Native and cross-platform mobile apps.", skills: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"] },
      { id: "sub-backend-dev", name: "Backend Development", slug: "backend-development", description: "Scalable APIs, microservices, and databases.", skills: ["Go", "Node.js", "Django", "PostgreSQL", "GraphQL", "Docker"] },
      { id: "sub-devops-cloud", name: "DevOps & Cloud Computing", slug: "devops-cloud", description: "CI/CD pipelines, Kubernetes, and cloud management.", skills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "CI/CD"] },
      { id: "sub-ai-ml", name: "AI & Machine Learning", slug: "ai-machine-learning", description: "LLMs, predictive modeling, NLP, and computer vision.", skills: ["Python", "PyTorch", "OpenAI API", "Hugging Face", "LangChain", "TensorFlow"] },
      { id: "sub-cybersecurity", name: "Cybersecurity & Ethical Hacking", slug: "cybersecurity", description: "Vulnerability assessment, penetration testing, and audits.", skills: ["Penetration Testing", "OWASP", "SOC 2", "Network Security", "Cryptography"] },
      { id: "sub-blockchain", name: "Blockchain & Web3", slug: "blockchain-web3", description: "Smart contracts, DeFi protocols, and decentralized apps.", skills: ["Solidity", "Ethereum", "Smart Contracts", "Rust", "Web3.js"] },
      { id: "sub-qa-testing", name: "QA & Automation Testing", slug: "qa-testing", description: "Manual and automated QA suites for high reliability.", skills: ["Cypress", "Playwright", "Jest", "Selenium", "Performance Testing"] },
      { id: "sub-ecommerce-dev", name: "E-commerce Development", slug: "ecommerce-development", description: "Shopify, WooCommerce, and headless commerce builds.", skills: ["Shopify Liquid", "WooCommerce", "Magento", "Stripe API"] },
      { id: "sub-game-dev", name: "Game Development", slug: "game-development", description: "2D and 3D games, AR/VR experiences.", skills: ["Unity", "Unreal Engine", "C#", "C++", "3D Game Math"] }
    ]
  },
  {
    id: "cat-design-creative",
    name: "Design & Creative",
    slug: "design-creative",
    description: "Brand identity, UI/UX design, 3D modeling, illustrations & motion graphics.",
    icon: "Palette",
    projectCount: 3120,
    freelancerCount: 9840,
    subcategories: [
      { id: "sub-ui-ux", name: "UI/UX & Product Design", slug: "ui-ux-design", description: "User journey mapping, wireframing, and Figma design systems.", skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"] },
      { id: "sub-logo-brand", name: "Logo & Brand Identity", slug: "logo-brand-identity", description: "Memorable logos, style guides, and brand books.", skills: ["Logo Design", "Brand Guidelines", "Typography", "Color Theory", "Adobe Illustrator"] },
      { id: "sub-illustration", name: "Illustration & Art", slug: "illustration-art", description: "Custom digital illustrations, editorial art, and book covers.", skills: ["Digital Illustration", "Procreate", "Vector Art", "Concept Art"] },
      { id: "sub-3d-design", name: "3D Design & Modeling", slug: "3d-design-modeling", description: "Photorealistic 3D renders, product concepts, and CGI.", skills: ["Blender", "Cinema 4D", "3D Rendering", "Substance Painter"] },
      { id: "sub-motion-graphics", name: "Motion Graphics & Animation", slug: "motion-graphics", description: "Explainer videos, animated logos, and Lottie animations.", skills: ["After Effects", "Lottie", "2D Animation", "Kinetic Typography"] },
      { id: "sub-packaging", name: "Packaging & Print Design", slug: "packaging-print", description: "Consumer packaging, labels, brochures, and print collateral.", skills: ["Packaging Design", "Print Production", "Label Design"] }
    ]
  },
  {
    id: "cat-writing-content",
    name: "Writing & Content",
    slug: "writing-content",
    description: "Technical writing, SEO copywriting, editorial, grant writing & ghostwriting.",
    icon: "FileText",
    projectCount: 2450,
    freelancerCount: 7600,
    subcategories: [
      { id: "sub-tech-writing", name: "Technical Writing", slug: "technical-writing", description: "Developer documentation, API guides, and whitepapers.", skills: ["API Documentation", "Markdown", "Whitepapers", "Software Guides"] },
      { id: "sub-copywriting", name: "Copywriting & Sales Copy", slug: "copywriting", description: "High-converting landing pages, ads, and email sequences.", skills: ["Landing Page Copy", "Email Copywriting", "Direct Response", "Sales Pages"] },
      { id: "sub-seo-writing", name: "SEO Content & Articles", slug: "seo-writing", description: "Keyword-optimized blog posts that rank on search engines.", skills: ["SEO Optimization", "Keyword Research", "Blog Writing", "Long-form Articles"] },
      { id: "sub-ghostwriting", name: "Ghostwriting & Books", slug: "ghostwriting", description: "Executive ghostwriting, memoirs, and non-fiction books.", skills: ["Book Writing", "Executive Voice", "Storytelling", "Research"] },
      { id: "sub-editing-proof", name: "Editing & Proofreading", slug: "editing-proofreading", description: "Grammar polish, tone consistency, and structural editing.", skills: ["Proofreading", "Copy Editing", "Style Guides", "Fact Checking"] }
    ]
  },
  {
    id: "cat-marketing-sales",
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description: "Performance marketing, SEO, social media growth, lead generation & CRO.",
    icon: "TrendingUp",
    projectCount: 1980,
    freelancerCount: 6420,
    subcategories: [
      { id: "sub-seo-sem", name: "SEO & Search Engine Marketing", slug: "seo-sem", description: "On-page, off-page, technical SEO, and Google Search ads.", skills: ["Google Ads", "Technical SEO", "Ahrefs", "Semrush", "Link Building"] },
      { id: "sub-paid-social", name: "Paid Social & Ads", slug: "paid-social", description: "Meta Ads, TikTok Ads, LinkedIn B2B campaign management.", skills: ["Meta Ads", "LinkedIn Campaign Manager", "TikTok Ads", "Attribution"] },
      { id: "sub-social-media", name: "Social Media Strategy", slug: "social-media", description: "Organic community building and viral short-form content.", skills: ["Community Management", "Content Calendars", "Organic Growth"] },
      { id: "sub-lead-generation", name: "B2B Lead Generation", slug: "lead-generation", description: "Cold email pipelines, list enrichment, and outreach automation.", skills: ["Cold Outreach", "Apollo.io", "LinkedIn Sales Navigator", "HubSpot"] },
      { id: "sub-cro", name: "Conversion Rate Optimization", slug: "conversion-rate-optimization", description: "A/B testing, funnel optimization, and user heatmaps.", skills: ["Google Optimize", "Hotjar", "Funnel Analytics", "A/B Testing"] }
    ]
  },
  {
    id: "cat-video-audio",
    name: "Video & Audio Production",
    slug: "video-audio",
    description: "Video editing, podcast mixing, voice overs, color grading & sound design.",
    icon: "Video",
    projectCount: 1850,
    freelancerCount: 5120,
    subcategories: [
      { id: "sub-video-editing", name: "Video Editing", slug: "video-editing", description: "YouTube videos, commercials, and corporate documentaries.", skills: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading"] },
      { id: "sub-short-form", name: "Short-Form Video (Reels/TikTok)", slug: "short-form-video", description: "Hook-driven viral shorts, captions, and fast-paced editing.", skills: ["CapCut", "Reels Editing", "TikTok Trends", "Subtitle Styling"] },
      { id: "sub-voice-over", name: "Voice Over & Narration", slug: "voice-over", description: "Professional studio narration, character voices, and IVR.", skills: ["Studio Voice", "Commercial VO", "Audiobook Narration", "Accents"] },
      { id: "sub-audio-mixing", name: "Audio Editing & Podcasts", slug: "audio-podcasts", description: "Noise reduction, mastering, intro music, and podcast editing.", skills: ["Podcast Production", "Sound Design", "Audio Mastering", "Pro Tools"] }
    ]
  },
  {
    id: "cat-business-consulting",
    name: "Business & Consulting",
    slug: "business-consulting",
    description: "Management consulting, financial modeling, market research & virtual assistance.",
    icon: "Briefcase",
    projectCount: 1640,
    freelancerCount: 4890,
    subcategories: [
      { id: "sub-strategy", name: "Business Strategy & Consulting", slug: "business-strategy", description: "Go-to-market strategy, pitch decks, and competitive analysis.", skills: ["Pitch Decks", "GTM Strategy", "Market Analysis", "Business Plans"] },
      { id: "sub-financial-model", name: "Financial Modeling & Analysis", slug: "financial-modeling", description: "DCF valuation, 3-statement models, and SaaS metric dashboards.", skills: ["Financial Modeling", "Excel VBA", "Valuation", "SaaS Metrics"] },
      { id: "sub-project-management", name: "Agile Project Management", slug: "project-management", description: "Scrum masters, Jira administration, and sprint coordination.", skills: ["Scrum", "Jira", "Sprint Planning", "Risk Management"] },
      { id: "sub-virtual-assistant", name: "Virtual Assistance & Ops", slug: "virtual-assistance", description: "Executive support, inbox management, and data handling.", skills: ["Executive Assistance", "Data Entry", "Calendar Management", "Customer Care"] }
    ]
  },
  {
    id: "cat-finance-accounting",
    name: "Finance & Accounting",
    slug: "finance-accounting",
    description: "Bookkeeping, tax compliance, payroll management & fractional CFO services.",
    icon: "Calculator",
    projectCount: 1420,
    freelancerCount: 3950,
    subcategories: [
      { id: "sub-bookkeeping", name: "Bookkeeping & Reconciliations", slug: "bookkeeping", description: "QuickBooks, Xero, and monthly financial ledger reconciliations.", skills: ["QuickBooks", "Xero", "Bank Reconciliation", "Accounts Payable"] },
      { id: "sub-taxation", name: "Tax Services & Compliance", slug: "tax-services", description: "US/EU/Indian corporate and individual tax filings and VAT/GST.", skills: ["Tax Preparation", "VAT/GST Compliance", "1099 Filing", "Tax Planning"] },
      { id: "sub-fractional-cfo", name: "Fractional CFO Services", slug: "fractional-cfo", description: "Capital fundraising, board advisory, and burn rate management.", skills: ["Cashflow Management", "Fundraising Support", "Investor Reporting"] }
    ]
  },
  {
    id: "cat-legal-compliance",
    name: "Legal & Contracts",
    slug: "legal-contracts",
    description: "Commercial contracts, privacy policies, IP filings & corporate compliance.",
    icon: "Scale",
    projectCount: 980,
    freelancerCount: 2410,
    subcategories: [
      { id: "sub-contracts-review", name: "Contract Drafting & Review", slug: "contract-drafting", description: "NDAs, MSAs, SLA agreements, and employment agreements.", skills: ["Contract Law", "NDA Drafting", "Service Agreements", "Terms of Service"] },
      { id: "sub-ip-trademark", name: "IP & Trademarks", slug: "intellectual-property", description: "Trademark searches, copyright protection, and patent research.", skills: ["Trademark Registration", "Copyright Law", "IP Portfolio Management"] },
      { id: "sub-privacy-compliance", name: "Data Privacy & Compliance", slug: "privacy-compliance", description: "GDPR compliance, CCPA, and privacy policy formulation.", skills: ["GDPR", "CCPA", "Privacy Policy", "Compliance Auditing"] }
    ]
  },
  {
    id: "cat-engineering-architecture",
    name: "Engineering & Architecture",
    slug: "engineering-architecture",
    description: "CAD drafting, mechanical design, BIM models, structural & interior rendering.",
    icon: "Building2",
    projectCount: 1120,
    freelancerCount: 3180,
    subcategories: [
      { id: "sub-cad-drafting", name: "CAD & Mechanical Design", slug: "cad-mechanical", description: "SolidWorks, AutoCAD engineering drawings, and CNC files.", skills: ["SolidWorks", "AutoCAD", "Mechanical Engineering", "CNC Programming"] },
      { id: "sub-architectural-design", name: "Architectural Plans & BIM", slug: "architectural-plans", description: "Floor plans, Revit BIM models, and construction blueprints.", skills: ["Revit", "BIM Modeling", "Floor Plans", "Architectural Drawings"] },
      { id: "sub-interior-rendering", name: "Interior & Landscape 3D", slug: "interior-rendering", description: "Photorealistic arch-viz, lighting simulations, and interior tours.", skills: ["3ds Max", "V-Ray", "Interior Design", "Landscape Architecture"] }
    ]
  },
  {
    id: "cat-translation-languages",
    name: "Translation & Languages",
    slug: "translation-languages",
    description: "Certified translation, software localization, transcription & subtitling.",
    icon: "Languages",
    projectCount: 890,
    freelancerCount: 2980,
    subcategories: [
      { id: "sub-localization", name: "Software & Web Localization", slug: "software-localization", description: "i18n string translations, cultural adaptation, and proofing.", skills: ["Localization", "i18n", "Crowdin", "Multilingual QA"] },
      { id: "sub-doc-translation", name: "Document Translation", slug: "document-translation", description: "Spanish, German, French, Japanese, Hindi, Arabic translation.", skills: ["Certified Translation", "Legal Translation", "Technical Translation"] },
      { id: "sub-subtitling", name: "Subtitling & Transcription", slug: "subtitling-transcription", description: "SRT creation, audio-to-text, and timestamped transcripts.", skills: ["Subtitling", "Audio Transcription", "SRT Formatting"] }
    ]
  },
  {
    id: "cat-education-tutoring",
    name: "Education & Coaching",
    slug: "education-coaching",
    description: "Coding mentorship, language tutoring, executive coaching & curriculum design.",
    icon: "GraduationCap",
    projectCount: 760,
    freelancerCount: 2150,
    subcategories: [
      { id: "sub-coding-mentorship", name: "Coding & Tech Mentorship", slug: "coding-mentorship", description: "1-on-1 code reviews, interview prep, and technical tutoring.", skills: ["LeetCode Coaching", "System Design Prep", "Code Review"] },
      { id: "sub-career-coaching", name: "Career & Executive Coaching", slug: "career-coaching", description: "Resume rewrites, LinkedIn optimization, and leadership training.", skills: ["Resume Polish", "Interview Prep", "Executive Coaching"] }
    ]
  },
  {
    id: "cat-local-services",
    name: "Local & Specialized Services",
    slug: "local-specialized",
    description: "Event photography, commercial production, on-site IT setups & specialized consulting.",
    icon: "MapPin",
    projectCount: 650,
    freelancerCount: 1840,
    subcategories: [
      { id: "sub-photography", name: "Commercial Photography", slug: "commercial-photography", description: "Product photography, headshots, and corporate events.", skills: ["Product Photography", "Lightroom", "Studio Lighting", "Headshots"] },
      { id: "sub-event-services", name: "Event Production & Audio", slug: "event-production", description: "Stage setup, live streaming, and AV coordination.", skills: ["Live Streaming", "AV Management", "Event Planning"] }
    ]
  }
];
