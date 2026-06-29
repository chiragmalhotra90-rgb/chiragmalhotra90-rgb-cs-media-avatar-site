// Central content/data file for the CS Media & Production marketing site.
// Source of truth: "CS Media — Client Capabilities Deck" (23 pages, 2026).

export type MoodKey = "pro" | "friendly" | "casual";

export const MOODS: Record<
  MoodKey,
  { label: string; accent: string; accent2: string; accent3: string; bg: string; description: string }
> = {
  pro: {
    label: "Professional",
    accent: "#00f0ff",
    accent2: "#ff0066",
    accent3: "#ffea00",
    bg: "#0a0b12",
    description: "Cyan-led, executive-grade tone.",
  },
  friendly: {
    label: "Friendly",
    accent: "#ffea00",
    accent2: "#ff7a00",
    accent3: "#00f0ff",
    bg: "#0c0c0a",
    description: "Warm yellow, human-led tone.",
  },
  casual: {
    label: "Casual",
    accent: "#ff0066",
    accent2: "#7a00ff",
    accent3: "#00f0ff",
    bg: "#0a0708",
    description: "Punchy magenta, editorial tone.",
  },
};

export const NAV_LINKS = [
  { label: "Engine", href: "#engine" },
  { label: "Services", href: "#services" },
  { label: "Workflow", href: "#workflow" },
  { label: "Proof", href: "#proof" },
  { label: "Onboarding", href: "#onboarding" },
  { label: "Pricing", href: "#pricing" },
  { label: "AI Presenter", href: "/ai-presenter-builder" },
];

// Tags that scroll behind the avatar face in the hero.
// Each tag maps to a section on the page so the visitor can click
// through to the relevant service detail.
export const MARQUEE_TAGS: { label: string; href: string; emphasis?: boolean }[] = [
  { label: "Photography", href: "#services", emphasis: true },
  { label: "Brand Films", href: "#services" },
  { label: "Short-form Reels", href: "#services", emphasis: true },
  { label: "SEO & Google Ads", href: "#services" },
  { label: "Social Media Mgmt", href: "#services" },
  { label: "Branding & Identity", href: "#services", emphasis: true },
  { label: "AI Avatar Videos", href: "#services", emphasis: true },
  { label: "HeyGen · ElevenLabs", href: "#services" },
  { label: "Website Development", href: "#services", emphasis: true },
  { label: "E-Commerce Stores", href: "#services" },
  { label: "Booking & CRM", href: "#services" },
  { label: "Influencer Marketing", href: "#services" },
  { label: "WhatsApp Automation", href: "#services", emphasis: true },
  { label: "AI Chatbots 24/7", href: "#services" },
  { label: "Sports & Event Media", href: "#services" },
  { label: "Legal Tech Content", href: "#services" },
  { label: "Voice Cloning", href: "#services" },
  { label: "Paid Discovery", href: "#pricing", emphasis: true },
];

export const HERO_STATS = [
  { value: 410, label: "Generation records", suffix: "" },
  { value: 69, label: "Day export window", suffix: "d" },
  { value: 8, label: "Case studies shipped", suffix: "" },
  { value: 6, label: "Verticals covered", suffix: "" },
];

export const PAIN_STATS = [
  {
    stat: "6 wks",
    label: "avg. brief-to-launch at typical agencies",
    description:
      "Strategy, design, content and CRM live with four different vendors. Six-week briefs. Zero accountability for outcomes.",
  },
  {
    stat: "4+",
    label: "vendors to coordinate",
    description:
      "Creative, dev, CRM, ads — each on their own clock. You become the project manager for vendors you pay.",
  },
  {
    stat: "0",
    label: "attribution loop on most client work",
    description:
      "Posts get published. Patients or leads still get lost in scattered WhatsApps. No CRM. No reminders. No proof.",
  },
];

export const ENGINE_STEPS = [
  {
    no: "01",
    title: "Strategy becomes market position",
    body: "Client brief, competitor context, offer framing, script direction, campaign angle and proof hierarchy are translated into a clear positioning system before any production starts.",
    tags: ["Positioning", "Scripts", "Campaign angle"],
  },
  {
    no: "02",
    title: "Production becomes owned assets",
    body: "Short-form video, AI avatars, branded visuals, proof decks, product imagery, training scripts and cinematic campaign pieces — all created from the same strategic direction.",
    tags: ["Video avatars", "Product visuals", "Campaign pieces"],
  },
  {
    no: "03",
    title: "Infrastructure captures demand",
    body: "Websites, booking forms, CRM pipelines, staff upload panels, WhatsApp-ready follow-up and reporting dashboards turn attention into trackable conversations.",
    tags: ["Website", "CRM", "Automation"],
  },
];

export type Service = {
  no: string;
  title: string;
  category: "craft" | "growth" | "ai";
  tagline: string;
  body: string;
  bullets: string[];
  icon: string; // lucide name
};

// 12 services from CS-Media-Services-Description.md, grouped into
// 3 categories for display:
//   craft  — traditional media (photography, video, branding)
//   growth — marketing & distribution
//   ai     — AI-powered production & automation (the "new era" stack)
export const SERVICES: Service[] = [
  {
    no: "01",
    title: "Photography & Visual Storytelling",
    category: "craft",
    tagline: "Commercial-grade frames for every channel",
    body: "Food, real-estate, portrait, spa/wellness, product, influencer and floral photography — composed and color-graded for print, web, social and out-of-home. Shot for Kailash Parbat, Royal Tulip, Arihant Aura, Knockdown Fitness, Majestic Perfumes, Gloriosa and more.",
    bullets: ["Food & restaurant", "Architecture & real estate", "Portrait & product", "Spa & hospitality"],
    icon: "Camera",
  },
  {
    no: "02",
    title: "Videography & Film Production",
    category: "craft",
    tagline: "Cinematic quality regardless of scale",
    body: "Brand films, product demos, event coverage, testimonial stories, training videos and real-estate walkthroughs — from pre-production planning to color-graded final deliverables.",
    bullets: ["Brand & corporate films", "Product demo videos", "Event & recap coverage", "Testimonials & case studies"],
    icon: "Clapperboard",
  },
  {
    no: "03",
    title: "Short-form Video & Reels",
    category: "craft",
    tagline: "Hook in the first second, every time",
    body: "Scripts, on-location filming, motion-graphics editing, sound design, captions, content calendar planning (10+ videos per month cadence) and performance-based iteration. Platform-specific formatting for Reels, Shorts, TikTok and LinkedIn.",
    bullets: ["Scripting & concepting", "Motion graphics & captions", "10+ videos / month", "Performance iteration"],
    icon: "Film",
  },
  {
    no: "04",
    title: "Digital Marketing & SEO",
    category: "growth",
    tagline: "The full client engine, not just ads",
    body: "SEO (on-page, technical, off-page), SEM & Google Ads, email marketing, Meta Ads, WhatsApp marketing automation, local SEO & Google Business Profile, and content marketing. Every rupee tracked to a conversion.",
    bullets: ["SEO & local SEO", "Google Ads & Meta Ads", "WhatsApp marketing automation", "Email & content marketing"],
    icon: "TrendingUp",
  },
  {
    no: "05",
    title: "Social Media Management",
    category: "growth",
    tagline: "Full operational layer so you can run your business",
    body: "Platform strategy across Instagram, Facebook, LinkedIn, YouTube and X. Monthly content calendars, community management, Reels & Stories production, competitor analysis and monthly analytics with actionable next steps.",
    bullets: ["Monthly content calendars", "Community management", "Reels & Stories integrated", "Analytics with next steps"],
    icon: "Share2",
  },
  {
    no: "06",
    title: "Branding & Brand Identity",
    category: "craft",
    tagline: "From ground-up to refresh",
    body: "Brand strategy, logo & visual identity (Pantone + HEX + typography), brand guidelines document, stationery & collateral, brand refresh / rebranding, and pitch decks & investor presentations.",
    bullets: ["Brand strategy & voice", "Logo & visual identity", "Brand guidelines doc", "Pitch & investor decks"],
    icon: "Palette",
  },
  {
    no: "07",
    title: "AI-Powered Video Production",
    category: "ai",
    tagline: "New-era stack: HeyGen · ElevenLabs · Sora · Veo · Kling",
    body: "AI avatar spokesperson videos, AI-generated brand videos (text-to-video & image-to-video), voice cloning & localization into 6+ Indian languages, animated explainer videos, AI presenter reels at scale, and mass personalized video campaigns.",
    bullets: ["AI avatar spokesperson videos", "Voice cloning & localization", "AI-generated brand videos", "Mass personalized campaigns"],
    icon: "Bot",
  },
  {
    no: "08",
    title: "Website Design & Development",
    category: "growth",
    tagline: "Websites that work, not just look good",
    body: "Business & portfolio websites, landing pages & sales funnels, e-commerce stores (Razorpay/Stripe), booking & appointment systems, CRM & lead capture integration, and app prototype / MVP development on Next.js, React, Supabase.",
    bullets: ["Business & portfolio sites", "E-commerce (Razorpay/Stripe)", "Booking & appointment systems", "CRM & lead capture"],
    icon: "LayoutDashboard",
  },
  {
    no: "09",
    title: "Influencer Marketing",
    category: "growth",
    tagline: "Right creators, not just biggest follower counts",
    body: "Influencer discovery & vetting (nano / micro / macro), campaign strategy & brief writing, content direction & review, on-location influencer shoots, and performance tracking & ROI reporting.",
    bullets: ["Discovery & vetting", "Campaign strategy & briefs", "On-location shoots", "Performance & ROI reporting"],
    icon: "Users",
  },
  {
    no: "10",
    title: "AI Business Systems & Automation",
    category: "ai",
    tagline: "The back-end intelligence layer",
    body: "Lead capture & CRM pipelines (WhatsApp API + website forms + booking), content automation systems, AI chatbots & virtual assistants for WhatsApp / web / Instagram DMs, performance dashboards, and bulk AI video generation workflows.",
    bullets: ["CRM pipelines & lead capture", "AI chatbots 24/7", "Performance dashboards", "Bulk AI video automation"],
    icon: "Workflow",
  },
  {
    no: "11",
    title: "Sports & Event Media Production",
    category: "craft",
    tagline: "Sports as a media property, not just a game",
    body: "Cricket & sports videography (matchday, highlights, interviews, sponsor activation), community storytelling, sponsorship activation packages (pitch decks, brand placement, merchandise mockups), live event social coverage, and sports documentary mini-series.",
    bullets: ["Matchday & highlights", "Sponsorship activation packages", "Live event social coverage", "Documentary mini-series"],
    icon: "Trophy",
  },
  {
    no: "12",
    title: "Legal Tech & Platform Content",
    category: "ai",
    tagline: "Factual, precise, trust-building content",
    body: "For legal, medical and compliance-heavy industries: platform explainer videos (attorney-reviewed), AI avatar legal presenters in multiple Indian languages, website & app UI content, and investor deck production for legal-tech & SaaS pitches.",
    bullets: ["Attorney-reviewed explainers", "AI avatar legal presenters", "UI content & onboarding flows", "Investor deck production"],
    icon: "Scale",
  },
];

export const WORKFLOW_STEPS = [
  {
    no: "01",
    title: "Understand the client",
    body: "Audit the business, niche, offer, audience, proof assets, existing website, communication gaps and staff workflow.",
  },
  {
    no: "02",
    title: "Build the story",
    body: "Create scripts, visual direction, messaging, offer hierarchy, content and campaign angle before any random asset generation.",
  },
  {
    no: "03",
    title: "Produce the proof",
    body: "Generate or edit videos, avatar content, social creatives, product visuals, deck pages, treatment explainers and campaign stills.",
  },
  {
    no: "04",
    title: "Install the system",
    body: "Set up website sections, booking flows, CRM pipeline, staff upload panel, WhatsApp-ready messages, reminders and analytics.",
  },
  {
    no: "05",
    title: "Improve the loop",
    body: "Track inquiries, patient/client actions, content performance, follow-up gaps and the next round of content or automation priorities.",
  },
];

export const PROOF_STATS = [
  { value: 410, label: "Generation records", note: "Apr 5 – Jun 12, 2026" },
  { value: 4397, label: "Tracked platform credits", note: "Credits, not currency spend" },
  { value: 69, label: "Days, idea → portfolio", note: "Under-90-day story" },
  { value: 8, label: "Case studies shipped", note: "Across 6 verticals" },
];

export const PROOF_MIX = [
  { label: "Campaign variations & supporting creative", count: 205, color: "var(--brand-accent)" },
  { label: "Avatar / digital human content", count: 153, color: "var(--brand-accent-2)" },
  { label: "Generative product assets", count: 30, color: "var(--brand-accent-3)" },
  { label: "Cinematic AI video", count: 16, color: "#9d7aff" },
  { label: "Localization / translation", count: 6, color: "#7affb0" },
];

export type CaseStudy = {
  id: string;
  no: string;
  client: string;
  vertical: string;
  verticalKey: string;
  title: string;
  blurb: string;
  deliverables: string[];
  result?: string;
  accent: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "dental",
    no: "01",
    client: "Dr. Nitesh Patil Dental Care",
    vertical: "Dental",
    verticalKey: "dental",
    title: "A dental website brief became a full patient growth system.",
    blurb:
      "Patient journey, website, appointment flow, CRM pipeline, staff controls, WhatsApp-ready communication and before/after proof content — all from one brief.",
    deliverables: ["Patient journey & booking", "Staff review & upload panel", "WhatsApp-ready automation", "In-clinic education library"],
    result: "3 days to live patient system · 8 channels · 1 brief",
    accent: "#00f0ff",
  },
  {
    id: "legal",
    no: "02",
    client: "Vakil AI",
    vertical: "Legal AI",
    verticalKey: "legal",
    title: "Legal-assistant work that proves product thinking, not just deck design.",
    blurb:
      "Packaged as a voice-first operating layer for lawyers. The story connected intake, verified legal references, matter memory, drafting, reminders and court-safe workflows into one platform narrative.",
    deliverables: ["Intake narrative", "Legal references", "Matter memory", "Drafting workflow", "Court-safe UX"],
    result: "Voice-first layer · matter memory · verified references",
    accent: "#ff0066",
  },
  {
    id: "wl100",
    no: "03",
    client: "World Legends 100",
    vertical: "Sports IP",
    verticalKey: "sports",
    title: "A sports idea packaged like a global cricket property.",
    blurb:
      "Investor proposal, pitch deck, scope deck, ticketing concept, launch strategy, AI presenter assets, cinematic reveal content and merchandise visuals — all under one commercial frame.",
    deliverables: ["Investor proposal", "Pitch deck", "Ticketing concept", "AI presenter system", "Cinematic reveal"],
    result: "5 deliverables packaged · investor-ready",
    accent: "#ffea00",
  },
  {
    id: "skyhawks",
    no: "04",
    client: "Mississauga Skyhawks",
    vertical: "Community Growth",
    verticalKey: "sports",
    title: "Community storytelling that creates academy demand.",
    blurb:
      "Moves beyond match announcements. Uses emotional community content around coaches, volunteers, women in cricket, local parks and player journeys to build an owned audience and recurring academy interest.",
    deliverables: ["Coaches & volunteers", "Women in cricket", "Local parks", "Player journeys"],
    result: "Owned audience · 4 pillars of community story",
    accent: "#7affb0",
  },
  {
    id: "gagan",
    no: "05",
    client: "FinanceWithGagan",
    vertical: "Finance",
    verticalKey: "finance",
    title: "Finance education becomes repeatable avatar content.",
    blurb:
      "English-first insurance education, source-preserving scripts, clear outro / CTA rules, avatar-video planning and social creatives that stay informative rather than hype-driven.",
    deliverables: ["Script templates", "Avatar planning", "CTA rules", "Source-preserving educational posts"],
    result: "Compliance-safe copy · repeatable avatar format",
    accent: "#9d7aff",
  },
  {
    id: "dennis",
    no: "06",
    client: "Dennis · Complete Athlete",
    vertical: "Creator IP",
    verticalKey: "creator",
    title: "Creator knowledge becomes a media and training product.",
    blurb:
      "Turns scattered expertise into a content system: YouTube scripts, training video scripts, coaching pillars and a 2026–2029 business plan for cricket academy growth.",
    deliverables: ["YouTube script system", "Training-video curriculum", "Business-plan packaging"],
    result: "Weekly cadence · license-ready · investor-ready",
    accent: "#ff7a00",
  },
  {
    id: "portcart",
    no: "07",
    client: "PortCart + Gamini",
    vertical: "Retail & Luxury",
    verticalKey: "retail",
    title: "Commercial strategy work that goes beyond content.",
    blurb:
      "PortCart required demand-engine positioning; Gamini required premium retail growth planning — both delivered as strategy + creative + automation in one engagement.",
    deliverables: ["Mall demand engine", "Tenant discovery search", "Premium website upgrade", "Wedding-season campaigns"],
    result: "Tenant discovery + bridal content engine",
    accent: "#ff4d4d",
  },
  {
    id: "gloriosa",
    no: "08",
    client: "Gloriosa",
    vertical: "Product Visuals",
    verticalKey: "retail",
    title: "Premium product imagery before a full shoot budget exists.",
    blurb:
      "AI-assisted product / lifestyle generation for floral and gifting brands. The same approach supports catalog tests, social posts, seasonal campaigns, product launches and e-commerce experiments.",
    deliverables: ["Floral", "Jewellery", "Apparel", "Food", "Merchandise"],
    result: "AI-assisted · catalog-grade · pre-shoot style validation",
    accent: "#ffd166",
  },
];

export const VERTICALS = [
  { key: "all", label: "All" },
  { key: "dental", label: "Dental" },
  { key: "legal", label: "Legal AI" },
  { key: "sports", label: "Sports" },
  { key: "finance", label: "Finance" },
  { key: "creator", label: "Creator" },
  { key: "retail", label: "Retail" },
];

export const ONBOARDING_DAYS = [
  {
    day: "Day 0",
    title: "Intake",
    body: "Collect clinic details, service list, contacts, timings, photos, brand kit, domain/email access, current workflow and approval roles.",
    deliverables: ["Brief", "Brand kit", "Approvals"],
  },
  {
    day: "Day 1",
    title: "Build",
    body: "Create website sections, inquiry form, appointment logic, pipeline stages, staff dashboard structure and the first WhatsApp-ready patient communication templates.",
    deliverables: ["Website", "CRM dashboard"],
  },
  {
    day: "Day 2",
    title: "Content",
    body: "Load proof images, before/after assets, treatment explainer videos, FAQs, review flows, patient messages, calendar reminders and pre/post-visit instruction flows.",
    deliverables: ["Proof videos", "WhatsApp flows"],
  },
  {
    day: "Day 3",
    title: "Review & Launch",
    body: "Test lead capture, staff upload, doctor review, reporting view and launch checklist with the clinic team.",
    deliverables: ["Test · Launch · Handoff"],
  },
];

export type Plan = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  badge?: string;
  featured?: boolean;
  includes: string[];
  cta: string;
};

export const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "For first projects & solo operators",
    price: "₹40K",
    unit: "/mo retainer",
    includes: [
      "Paid discovery sprint (1 week)",
      "8 short-form videos / month",
      "1 AI avatar explainer",
      "Social posting calendar",
      "Monthly performance report",
    ],
    cta: "Start with Discovery",
  },
  {
    name: "Growth",
    tagline: "For clinics, brands & scaling founders",
    price: "₹1.2L",
    unit: "/mo retainer",
    badge: "MOST POPULAR",
    featured: true,
    includes: [
      "Everything in Starter, plus:",
      "Website + CRM pipeline setup",
      "20 videos + 4 avatar assets / month",
      "WhatsApp-ready automation flows",
      "Bi-weekly strategy calls",
    ],
    cta: "Start Growing",
  },
  {
    name: "Partner",
    tagline: "For leagues, IPs & multi-location",
    price: "Custom",
    unit: "revenue-share available",
    includes: [
      "Everything in Growth, plus:",
      "Full AI stack ownership",
      "Investor & pitch deck packaging",
      "Campaign launches & creative direction",
      "Quarterly roadmap & reporting",
    ],
    cta: "Request Partner Call",
  },
];

export const DISCOVERY = {
  price: "₹25K",
  unit: "one-time",
  title: "Paid Discovery Sprint",
  body: "A 5-day audit + strategy engagement. You get a positioning brief, content map, CRM architecture and a 90-day roadmap you can act on — whether or not you continue with us.",
  bullets: [
    "Positioning brief",
    "Content map",
    "CRM architecture",
    "90-day roadmap",
  ],
};
