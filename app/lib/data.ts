export type App = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  costPerAction: number;
  rating: number;
  usageCount: number;
  status: "live" | "beta";
  icon: string;
  color: string;
  inputPlaceholder: string;
  outputLabel: string;
};

export type Transaction = {
  id: string;
  type: "credit" | "debit" | "topup";
  beans: number;
  label: string;
  date: string;
};

export type BeanPack = {
  id: string;
  beans: number;
  price: number;
  label: string;
  badge?: string;
};

export const APPS: App[] = [
  {
    slug: "marathi-helper",
    title: "ASHA Marathi Helper",
    description: "Transliterate field notes between English and Marathi instantly.",
    longDescription:
      "Designed for ASHA workers in rural Maharashtra, this tool converts your field notes from English script to Marathi and back — instantly. No copy-paste into Google Translate. No connectivity needed beyond the initial load.",
    category: "Health",
    costPerAction: 4,
    rating: 4.6,
    usageCount: 1847,
    status: "live",
    icon: "",
    color: "from-blue-500 to-indigo-600",
    inputPlaceholder: "Type in English (e.g. 'Patient has fever and cough')",
    outputLabel: "Marathi transliteration",
  },
  {
    slug: "letter-friends",
    title: "Letter Friends",
    description: "Interactive alphabet learning for differently-abled children.",
    longDescription:
      "Letter Friends makes alphabet learning joyful and accessible. Each letter comes alive with animations, sounds, and relatable words. Built for children with learning differences, with support for dyslexia-friendly fonts.",
    category: "Education",
    costPerAction: 2,
    rating: 4.7,
    usageCount: 2316,
    status: "live",
    icon: "",
    color: "from-emerald-500 to-teal-600",
    inputPlaceholder: "Enter a letter (e.g. 'A' or 'b')",
    outputLabel: "Learning guide",
  },
  {
    slug: "story-spark",
    title: "Story Spark",
    description: "Generate culturally resonant outreach stories for NGO campaigns.",
    longDescription:
      "Story Spark helps NGO communication teams create compelling narratives for field outreach. Feed it a topic or theme and get a story that resonates with rural Indian communities — ready to adapt for WhatsApp messages or pamphlets.",
    category: "Law & Justice",
    costPerAction: 7,
    rating: 4.3,
    usageCount: 403,
    status: "beta",
    icon: "",
    color: "from-amber-500 to-orange-600",
    inputPlaceholder: "Enter a theme (e.g. 'water conservation in summer')",
    outputLabel: "Generated story",
  },
];

export const BEAN_PACKS: BeanPack[] = [
  { id: "starter", beans: 120, price: 49, label: "Starter" },
  { id: "popular", beans: 550, price: 199, label: "Popular", badge: "Best value" },
  { id: "pro", beans: 1600, price: 499, label: "Pro" },
];

export const CATEGORIES = ["All", "Education", "Health", "Law & Justice"];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "credit", beans: 100, label: "Welcome bonus", date: "2026-06-20" },
];
