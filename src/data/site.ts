// All site content lives here. Edit this file to update the portfolio.
// Lines marked TODO need your real details before you deploy.

export const profile = {
  name: "Shlok Upadhyay",
  role: "Software Engineer · GenAI & Full-stack",
  location: "Bangalore, India",
  summary:
    "SDE at Standard Chartered GBS and NIT Trichy '24 graduate. I build retrieval-augmented AI systems end to end, from data pipelines and vector search to FastAPI services and Next.js frontends, and I contribute to open source.",
  email: "deep.upu9@gmail.com",
  github: "https://github.com/oops-shlok",
  linkedin: "https://www.linkedin.com/in/shlok-upadhyay-521065104/",
  resume: "/resume.pdf", // TODO: replace public/resume.pdf with your current resume
  // TODO: set to your deployed URL (used for SEO / social cards)
  siteUrl: "https://oops-shlok.vercel.app",
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  image?: string;
  links: { label: string; href: string }[];
  featured: boolean;
  year?: string;
  art?: "graph" | "memory" | "chart";
  // Case-study page content (only for featured projects)
  problem?: string;
  role?: string;
  architecture?: string[];
  highlights?: string[];
  challenges?: string[];
  next?: string[];
};

export const projects: Project[] = [
  {
    slug: "smarix",
    year: "2025–26",
    art: "graph",
    name: "Smarix",
    tagline:
      "An AI teammate that knows your codebase: chat over repos, PRs, issues and commits, plus impact analysis and onboarding.",
    stack: ["Python", "FastAPI", "OpenAI / Claude", "NetworkX", "Redis", "Postgres", "S3", "Next.js 15", "Docker", "Prometheus"],
    links: [
      { label: "Code", href: "https://github.com/SmarixAI/smarix" },
    ],
    featured: true,
    problem:
      "Engineering knowledge is scattered across code, PRs, issues, commits and docs. New joiners take weeks to ramp up, and knowledge walks out the door when people leave.",
    role:
      "Co-built in a two-person team. I owned the chatbot and retrieval layer: GraphRAG retrieval, query routing and token-based index logic, chatbot multi-tenancy and performance, the storage migration to S3, user↔repo mapping, and faster data collection.", // TODO: confirm
    architecture: [
      "GitHub App ingests repositories, PRs, issues and commits; Python and JS analyzers extract structure.",
      "Processing chunks and enriches content and builds a NetworkX dependency graph per repo.",
      "OpenAI embeddings feed a multi-index store (code, PRs, commits, issues, docs) plus a keyword index.",
      "A query router classifies each question and picks the right indices, or splits it into a multi-query; results are reranked and assembled into context for GPT-4o-mini or Claude.",
      "FastAPI streams answers to a Next.js app; Redis holds sessions and an entity-aware semantic cache; Postgres stores tenants and history; Prometheus and Grafana monitor it all.",
    ],
    highlights: [
      "Graph retrieval adds dependent files and owners that pure vector search misses.",
      "Entity-aware semantic cache avoids wrong cache hits when two questions differ only by PR number or file name.",
      "TODO: add 1–2 measured results (latency, cache hit rate, data-collection speed-up).",
    ],
    challenges: [
      "Routing: one flat index gave poor answers for PR and commit questions, so we split indices by source and added a classifier-based router.",
      "Multi-tenancy: isolating each organisation's data, indices and chat history in one deployment.",
    ],
    next: ["Evaluation harness for answer quality", "Incremental re-indexing on push webhooks"],
  },
  {
    slug: "lifeos",
    year: "2025",
    art: "memory",
    name: "LifeOS",
    tagline:
      "A personal AI assistant with long-term memory: semantic search over your chats, notes and todos, plus Google Calendar.",
    stack: ["Python", "FastAPI", "PostgreSQL", "FAISS", "SentenceTransformers", "OpenRouter", "Next.js 15", "TypeScript"],
    links: [
      { label: "Code", href: "https://github.com/oops-shlok/lifeos" },
    ],
    featured: true,
    problem:
      "Chat assistants forget everything between sessions. I wanted one that remembers my decisions, notes and plans and can answer questions about them later.",
    role: "Solo project: designed and built the backend, the memory and search pipeline, and the frontend.",
    architecture: [
      "Every chat, note, todo and event is embedded with all-MiniLM-L6-v2 and indexed in FAISS.",
      "Before answering, the assistant retrieves the most relevant memories and adds them to the prompt.",
      "An LLM call via OpenRouter tags each entry with topic and intent, which powers filtered search.",
      "Async FastAPI + SQLAlchemy on PostgreSQL with Alembic migrations; Google OAuth for sign-in and Calendar access.",
    ],
    highlights: [
      "Hybrid search: semantic similarity combined with topic, intent, keyword and date filters.",
      "Timeline export of every interaction.",
    ],
    challenges: [
      "Keeping the FAISS index consistent with the database as memories are added.",
      "Prompt design for reliable topic and intent classification.",
    ],
    next: ["Knowledge-graph and timeline views", "Reminders and importance scoring"],
  },
  {
    slug: "charting-app",
    year: "2024",
    art: "chart",
    name: "ChartingApp",
    tagline:
      "A stock-charting web app with technical indicators and drawing tools, backed by a Go API for Indian market data.",
    stack: ["JavaScript", "React", "Go", "Vercel"],
    links: [
      { label: "Frontend", href: "https://github.com/manavagr1108/ChartingApp" },
      { label: "Backend", href: "https://github.com/oops-shlok/ChartingApp-Backend" },
    ],
    featured: true,
    problem:
      "Build a TradingView-style charting experience from scratch: candles, indicators and interactive drawing tools on top of historical market data.",
    role:
      "Team project. I built the Go backend (auth routes, interval handling, Vercel deployment) and, on the frontend, the SMA, EMA, Zig-Zag and Parabolic SAR indicators, the trend-angle, flat top/bottom and disjoint-channel tools, the Indian stocks history integration and login.",
    architecture: [
      "Go API serves authenticated historical OHLC data for Indian stocks at different intervals.",
      "React frontend renders charts and computes indicators client-side; drawing tools are interactive overlays.",
    ],
    highlights: ["8 merged feature PRs on the frontend and the full backend."],
    challenges: ["Hit-testing and dragging drawing tools precisely while the chart pans and zooms."],
  },
  {
    slug: "lynx-nitt",
    year: "2022",
    name: "LYNX — NIT Trichy app",
    tagline:
      "The official campus app for NIT Trichy, built with Spider R&D Club and published on the Play Store and App Store.",
    stack: ["Mobile", "TODO: React Native / Flutter"],
    image: "/images/lynx.jpg",
    links: [
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=org.spider.nittapp" },
      { label: "App Store", href: "https://apps.apple.com/in/app/lynx-nitt/id1624086590" },
    ],
    featured: false,
  },
  {
    slug: "orientation-22",
    year: "2022",
    name: "Orientation '22",
    tagline: "Orientation app for NIT Trichy's incoming 2022 batch, built with Spider R&D Club.",
    stack: ["Mobile"],
    image: "/images/OT21.png",
    links: [
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=org.spider.orientation2021" },
    ],
    featured: false,
  },
];

export type Job = { company: string; title: string; period: string; points: string[] };

export const experience: Job[] = [
  {
    company: "Standard Chartered GBS",
    title: "Software Development Engineer",
    period: "TODO: 2024 – Present",
    points: [
      "TODO: what you build, for whom, and the stack",
      "TODO: one measurable impact",
    ],
  },
  {
    company: "Smarix AI",
    title: "Engineer",
    period: "2025 – 2026",
    points: [
      "Built the RAG chatbot and retrieval layer (GraphRAG, query routing, multi-tenancy).",
      "Migrated storage to S3 and containerised the stack with Docker Compose and Prometheus/Grafana monitoring.",
    ],
  },
  {
    company: "Spider R&D Club, NIT Trichy",
    title: "App Developer",
    period: "TODO: 2021 – 2024",
    points: ["Built and shipped LYNX, NIT Trichy's official app, on Android and iOS, plus the Orientation '22 app."],
  },
];

export const openSource = [
  { project: "JabRef", title: "Show a welcome screen if no database is open", href: "https://github.com/JabRef/jabref/pull/12461" },
  { project: "CCExtractor · taskwarrior-flutter", title: "Fix macOS build broken by the permission-handler plugin", href: "https://github.com/CCExtractor/taskwarrior-flutter/pull/336" },
  { project: "CCExtractor · ultimate_alarm_clock", title: "Fix timer when the app is backgrounded", href: "https://github.com/CCExtractor/ultimate_alarm_clock/pull/496" },
  { project: "CCExtractor · ultimate_alarm_clock", title: "Fix iOS Podfile version compatibility", href: "https://github.com/CCExtractor/ultimate_alarm_clock/pull/458" },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "AI / LLM", items: ["RAG", "GraphRAG", "Embeddings", "FAISS", "OpenAI & Anthropic APIs", "Hugging Face", "Semantic caching"] },
  { group: "Backend", items: ["Python", "FastAPI", "Go", "Node.js", "PostgreSQL", "Redis"] },
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { group: "Mobile", items: ["Flutter", "Android", "iOS builds"] },
  { group: "DevOps", items: ["Docker", "AWS S3", "Prometheus", "Grafana", "Vercel"] },
];
