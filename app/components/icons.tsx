import { Coins, Languages, BookOpenText, Sparkles, Coffee, type LucideIcon } from "lucide-react";

export const Bean = ({ className = "w-4 h-4 inline" }: { className?: string }) => (
  <Coins className={className} strokeWidth={2} />
);

export const Brand = ({ className = "w-6 h-6" }: { className?: string }) => (
  <Coffee className={className} strokeWidth={2} />
);

const APP_ICONS: Record<string, LucideIcon> = {
  "marathi-helper": Languages,
  "letter-friends": BookOpenText,
  "story-spark": Sparkles,
};

export const AppIcon = ({ slug, className = "w-8 h-8" }: { slug: string; className?: string }) => {
  const I = APP_ICONS[slug] ?? Sparkles;
  return <I className={className} strokeWidth={1.75} />;
};
