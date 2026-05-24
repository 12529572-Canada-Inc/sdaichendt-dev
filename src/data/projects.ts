export type ProjectCategory = "all" | "apps" | "games" | "creative" | "shop";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Exclude<ProjectCategory, "all">;
  tech: string[];
  links: {
    live?: string;
    store?: string;
  };
  status: "live" | "beta" | "early-signup" | "in-progress" | "shipped";
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "adeso",
    name: "Adeso",
    tagline: "AI for the rest of us.",
    description:
      "A plug-and-play AI appliance built on a Mac Mini — your own private AI assistant that runs locally, speaks your language, and doesn't phone home. No cloud required.",
    category: "apps",
    tech: ["Node.js", "OpenClaw", "Ollama", "Vue/Nuxt", "macOS"],
    links: {
      live: "https://adeso.ai",
    },
    status: "early-signup",
    featured: true,
  },
  {
    slug: "questify",
    name: "Questify",
    tagline: "Turn content into quests.",
    description:
      "A platform that gamifies learning through quests and challenges. Built from co-founder to solo maintainer — it's had a journey and keeps going.",
    category: "apps",
    tech: ["Nuxt 4", "TypeScript", "Prisma", "Fly.io", "PostgreSQL"],
    links: {
      live: "https://questify.co",
    },
    status: "beta",
    featured: true,
  },
  {
    slug: "farsi-flash",
    name: "Farsi Flash",
    tagline: "English ↔ Farsi, the fun way.",
    description:
      "A language learning app for English speakers tackling Farsi. Flashcards, quiz rounds, XP/levels/streaks, RTL rendering, and audio pronunciation — built with love and a lot of Unicode.",
    category: "apps",
    tech: ["Next.js 14", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
    links: {
      live: "https://farsi-flash.vercel.app/",
    },
    status: "beta",
    featured: true,
  },
  {
    slug: "edge-ledger",
    name: "EdgeLedger",
    tagline: "Prediction market analytics.",
    description:
      "Portfolio tracker and analytics platform for prediction market traders. Covers Kalshi & Manifold — with arbitrage scanning, price alerts, shareable cards, and a Pro tier.",
    category: "apps",
    tech: ["Next.js 14", "Fastify", "Expo", "Supabase", "Stripe", "Railway"],
    links: {
      live: "https://edge-ledger-app.vercel.app/",
    },
    status: "beta",
  },
  {
    slug: "dink",
    name: "Dink",
    tagline: "Pickleball, organised.",
    description:
      "Meetup scheduling and skill tracking for pickleball players. Because the sport deserves better than group texts and Google Sheets.",
    category: "apps",
    tech: ["Next.js 14", "TypeScript", "Supabase", "Tailwind CSS", "Turborepo"],
    links: {},
    status: "in-progress",
  },
  {
    slug: "threshold",
    name: "Threshold",
    tagline: "A deckbuilder at the edge of reason.",
    description:
      "A cosmic horror roguelite deckbuilder where sanity isn't just a stat — it warps the cards you can play. 131 cards, 21 relics, and a full run loop that will make you question your choices.",
    category: "games",
    tech: ["Godot 4", "GDScript"],
    links: {},
    status: "in-progress",
    featured: true,
  },
  {
    slug: "hollow-castle",
    name: "Hollow Castle",
    tagline: "A game in development.",
    description:
      "A new game project currently in development, with the shape and details still being carved out through prototyping.",
    category: "games",
    tech: ["Game Design", "Prototyping"],
    links: {},
    status: "in-progress",
  },
  {
    slug: "piano-ar",
    name: "Piano AR",
    tagline: "See the music, play the piano.",
    description:
      "A mixed-reality piano teacher for Meta Quest 3. Virtual keys overlay your real piano, hand tracking guides your fingers, and Guitar Hero-style gameplay makes practice actually fun.",
    category: "games",
    tech: ["Unity 6", "C#", "Meta XR SDK", "YOLOv8", "ONNX/Sentis", "URP"],
    links: {},
    status: "in-progress",
  },
  {
    slug: "player-piano",
    name: "Player Piano",
    tagline: "Vonnegut for the algorithm age.",
    description:
      "An animated adaptation of Kurt Vonnegut's *Player Piano* — darkly funny shorts about automation, dignity, and what happens when the machines get really good. BoJack meets Black Mirror.",
    category: "creative",
    tech: ["Writing", "Storyboarding", "Animation"],
    links: {},
    status: "in-progress",
    featured: true,
  },
  {
    slug: "3d-print-shop",
    name: "3D Print Boutique",
    tagline: "Printed with care, shipped with love.",
    description:
      "Custom 3D-printed products on Etsy. Currently featuring a custom car vent phone mount — with more designs in the works. First 5-star review earned May 2026. 🌟",
    category: "shop",
    tech: ["3D Printing", "Fusion 360", "Etsy"],
    links: {
      store: "https://www.etsy.com/ca/shop/3DShopPrintBoutique",
    },
    status: "live",
  },
];

export const categories: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "apps", label: "Apps" },
  { id: "games", label: "Games" },
  { id: "creative", label: "Creative" },
  { id: "shop", label: "Shop" },
];
