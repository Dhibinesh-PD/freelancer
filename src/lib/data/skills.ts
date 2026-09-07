export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export const ALL_SKILLS: SkillItem[] = [
  // Web & Frontend
  { id: "sk-react", name: "React", slug: "react", category: "Web Development" },
  { id: "sk-nextjs", name: "Next.js", slug: "nextjs", category: "Web Development" },
  { id: "sk-vue", name: "Vue.js", slug: "vuejs", category: "Web Development" },
  { id: "sk-nuxt", name: "Nuxt.js", slug: "nuxtjs", category: "Web Development" },
  { id: "sk-angular", name: "Angular", slug: "angular", category: "Web Development" },
  { id: "sk-svelte", name: "Svelte", slug: "svelte", category: "Web Development" },
  { id: "sk-typescript", name: "TypeScript", slug: "typescript", category: "Web Development" },
  { id: "sk-javascript", name: "JavaScript", slug: "javascript", category: "Web Development" },
  { id: "sk-html5", name: "HTML5", slug: "html5", category: "Web Development" },
  { id: "sk-css3", name: "CSS3", slug: "css3", category: "Web Development" },
  { id: "sk-tailwind", name: "Tailwind CSS", slug: "tailwind-css", category: "Web Development" },
  { id: "sk-sass", name: "SASS/SCSS", slug: "sass-scss", category: "Web Development" },
  { id: "sk-bootstrap", name: "Bootstrap", slug: "bootstrap", category: "Web Development" },
  { id: "sk-webgl", name: "WebGL", slug: "webgl", category: "Web Development" },
  { id: "sk-threejs", name: "Three.js", slug: "threejs", category: "Web Development" },
  { id: "sk-redux", name: "Redux", slug: "redux", category: "Web Development" },
  { id: "sk-zustand", name: "Zustand", slug: "zustand", category: "Web Development" },
  { id: "sk-graphql", name: "GraphQL", slug: "graphql", category: "Web Development" },
  { id: "sk-rest-api", name: "REST API Design", slug: "rest-api-design", category: "Web Development" },
  { id: "sk-webpack", name: "Webpack", slug: "webpack", category: "Web Development" },
  { id: "sk-vite", name: "Vite", slug: "vite", category: "Web Development" },

  // Backend & Databases
  { id: "sk-nodejs", name: "Node.js", slug: "nodejs", category: "Backend" },
  { id: "sk-express", name: "Express.js", slug: "expressjs", category: "Backend" },
  { id: "sk-nestjs", name: "NestJS", slug: "nestjs", category: "Backend" },
  { id: "sk-python", name: "Python", slug: "python", category: "Backend" },
  { id: "sk-django", name: "Django", slug: "django", category: "Backend" },
  { id: "sk-fastapi", name: "FastAPI", slug: "fastapi", category: "Backend" },
  { id: "sk-flask", name: "Flask", slug: "flask", category: "Backend" },
  { id: "sk-golang", name: "Go (Golang)", slug: "golang", category: "Backend" },
  { id: "sk-rust", name: "Rust", slug: "rust", category: "Backend" },
  { id: "sk-java", name: "Java", slug: "java", category: "Backend" },
  { id: "sk-spring", name: "Spring Boot", slug: "spring-boot", category: "Backend" },
  { id: "sk-csharp", name: "C#", slug: "csharp", category: "Backend" },
  { id: "sk-dotnet", name: ".NET Core", slug: "dotnet-core", category: "Backend" },
  { id: "sk-php", name: "PHP", slug: "php", category: "Backend" },
  { id: "sk-laravel", name: "Laravel", slug: "laravel", category: "Backend" },
  { id: "sk-ruby", name: "Ruby", slug: "ruby", category: "Backend" },
  { id: "sk-rails", name: "Ruby on Rails", slug: "ruby-on-rails", category: "Backend" },
  { id: "sk-postgres", name: "PostgreSQL", slug: "postgresql", category: "Databases" },
  { id: "sk-mysql", name: "MySQL", slug: "mysql", category: "Databases" },
  { id: "sk-mongodb", name: "MongoDB", slug: "mongodb", category: "Databases" },
  { id: "sk-redis", name: "Redis", slug: "redis", category: "Databases" },
  { id: "sk-elasticsearch", name: "Elasticsearch", slug: "elasticsearch", category: "Databases" },
  { id: "sk-dynamodb", name: "DynamoDB", slug: "dynamodb", category: "Databases" },
  { id: "sk-prisma", name: "Prisma ORM", slug: "prisma-orm", category: "Databases" },

  // Mobile
  { id: "sk-react-native", name: "React Native", slug: "react-native", category: "Mobile" },
  { id: "sk-flutter", name: "Flutter", slug: "flutter", category: "Mobile" },
  { id: "sk-swift", name: "Swift", slug: "swift", category: "Mobile" },
  { id: "sk-swiftui", name: "SwiftUI", slug: "swiftui", category: "Mobile" },
  { id: "sk-kotlin", name: "Kotlin", slug: "kotlin", category: "Mobile" },
  { id: "sk-android-sdk", name: "Android SDK", slug: "android-sdk", category: "Mobile" },
  { id: "sk-ios", name: "iOS Development", slug: "ios-development", category: "Mobile" },

  // Cloud & DevOps
  { id: "sk-aws", name: "AWS", slug: "aws", category: "DevOps" },
  { id: "sk-azure", name: "Microsoft Azure", slug: "azure", category: "DevOps" },
  { id: "sk-gcp", name: "Google Cloud (GCP)", slug: "google-cloud", category: "DevOps" },
  { id: "sk-docker", name: "Docker", slug: "docker", category: "DevOps" },
  { id: "sk-kubernetes", name: "Kubernetes", slug: "kubernetes", category: "DevOps" },
  { id: "sk-terraform", name: "Terraform", slug: "terraform", category: "DevOps" },
  { id: "sk-ansible", name: "Ansible", slug: "ansible", category: "DevOps" },
  { id: "sk-github-actions", name: "GitHub Actions", slug: "github-actions", category: "DevOps" },
  { id: "sk-jenkins", name: "Jenkins", slug: "jenkins", category: "DevOps" },
  { id: "sk-nginx", name: "NGINX", slug: "nginx", category: "DevOps" },
  { id: "sk-linux", name: "Linux Administration", slug: "linux-admin", category: "DevOps" },

  // AI & Data Science
  { id: "sk-pytorch", name: "PyTorch", slug: "pytorch", category: "AI & ML" },
  { id: "sk-tensorflow", name: "TensorFlow", slug: "tensorflow", category: "AI & ML" },
  { id: "sk-openai", name: "OpenAI API", slug: "openai-api", category: "AI & ML" },
  { id: "sk-langchain", name: "LangChain", slug: "langchain", category: "AI & ML" },
  { id: "sk-huggingface", name: "Hugging Face", slug: "hugging-face", category: "AI & ML" },
  { id: "sk-nlp", name: "Natural Language Processing (NLP)", slug: "nlp", category: "AI & ML" },
  { id: "sk-computer-vision", name: "Computer Vision", slug: "computer-vision", category: "AI & ML" },
  { id: "sk-pandas", name: "Pandas", slug: "pandas", category: "Data Science" },
  { id: "sk-numpy", name: "NumPy", slug: "numpy", category: "Data Science" },
  { id: "sk-scikit", name: "Scikit-Learn", slug: "scikit-learn", category: "AI & ML" },
  { id: "sk-data-engineering", name: "Data Engineering", slug: "data-engineering", category: "Data Science" },
  { id: "sk-spark", name: "Apache Spark", slug: "apache-spark", category: "Data Science" },
  { id: "sk-tableau", name: "Tableau", slug: "tableau", category: "Data Science" },
  { id: "sk-powerbi", name: "Power BI", slug: "power-bi", category: "Data Science" },

  // Cybersecurity
  { id: "sk-pen-testing", name: "Penetration Testing", slug: "penetration-testing", category: "Cybersecurity" },
  { id: "sk-owasp", name: "OWASP Top 10 Auditing", slug: "owasp-auditing", category: "Cybersecurity" },
  { id: "sk-soc2", name: "SOC 2 Compliance", slug: "soc-2-compliance", category: "Cybersecurity" },
  { id: "sk-cryptography", name: "Cryptography", slug: "cryptography", category: "Cybersecurity" },
  { id: "sk-network-sec", name: "Network Security", slug: "network-security", category: "Cybersecurity" },

  // Design & Creative
  { id: "sk-figma", name: "Figma", slug: "figma", category: "Design" },
  { id: "sk-ui-design", name: "UI Design", slug: "ui-design", category: "Design" },
  { id: "sk-ux-research", name: "UX Research", slug: "ux-research", category: "Design" },
  { id: "sk-design-systems", name: "Design Systems", slug: "design-systems", category: "Design" },
  { id: "sk-wireframing", name: "Wireframing", slug: "wireframing", category: "Design" },
  { id: "sk-illustrator", name: "Adobe Illustrator", slug: "adobe-illustrator", category: "Design" },
  { id: "sk-photoshop", name: "Adobe Photoshop", slug: "adobe-photoshop", category: "Design" },
  { id: "sk-blender", name: "Blender 3D", slug: "blender-3d", category: "Design" },
  { id: "sk-cinema4d", name: "Cinema 4D", slug: "cinema-4d", category: "Design" },
  { id: "sk-after-effects", name: "Adobe After Effects", slug: "after-effects", category: "Video & Audio" },
  { id: "sk-premiere", name: "Adobe Premiere Pro", slug: "premiere-pro", category: "Video & Audio" },
  { id: "sk-davinci", name: "DaVinci Resolve", slug: "davinci-resolve", category: "Video & Audio" },

  // Writing & Marketing
  { id: "sk-copywriting", name: "Copywriting", slug: "copywriting", category: "Writing" },
  { id: "sk-tech-writing", name: "Technical Writing", slug: "technical-writing", category: "Writing" },
  { id: "sk-seo-writing", name: "SEO Content Writing", slug: "seo-content-writing", category: "Writing" },
  { id: "sk-seo", name: "Search Engine Optimization (SEO)", slug: "seo", category: "Marketing" },
  { id: "sk-google-ads", name: "Google Ads", slug: "google-ads", category: "Marketing" },
  { id: "sk-meta-ads", name: "Meta Ads (Facebook & Instagram)", slug: "meta-ads", category: "Marketing" },
  { id: "sk-email-marketing", name: "Email Marketing & Klaviyo", slug: "email-marketing", category: "Marketing" },
  { id: "sk-b2b-lead-gen", name: "B2B Lead Generation", slug: "b2b-lead-gen", category: "Marketing" },

  // Business, Finance & Legal
  { id: "sk-financial-modeling", name: "Financial Modeling", slug: "financial-modeling", category: "Finance" },
  { id: "sk-quickbooks", name: "QuickBooks Online", slug: "quickbooks-online", category: "Finance" },
  { id: "sk-xero", name: "Xero Accounting", slug: "xero-accounting", category: "Finance" },
  { id: "sk-tax-compliance", name: "Tax Planning & Compliance", slug: "tax-compliance", category: "Finance" },
  { id: "sk-contract-drafting", name: "Contract Law & Drafting", slug: "contract-law", category: "Legal" },
  { id: "sk-gdpr", name: "GDPR & Privacy Compliance", slug: "gdpr-compliance", category: "Legal" },
  { id: "sk-pitch-decks", name: "Pitch Deck Design", slug: "pitch-deck-design", category: "Business" },
  { id: "sk-agile-scrum", name: "Agile & Scrum Management", slug: "agile-scrum", category: "Business" },
  { id: "sk-solidworks", name: "SolidWorks CAD", slug: "solidworks-cad", category: "Engineering" },
  { id: "sk-revit", name: "Autodesk Revit BIM", slug: "revit-bim", category: "Architecture" },
  { id: "sk-autocad", name: "AutoCAD", slug: "autocad", category: "Architecture" }
];
