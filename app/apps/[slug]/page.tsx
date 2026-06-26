"use client";
import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APPS } from "../../lib/data";
import { AppIcon, Bean } from "../../components/icons";
import { Star } from "lucide-react";

export default function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const app = APPS.find((a) => a.slug === slug);
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!app) {
    router.push("/");
    return null;
  }

  // ponytail: 3 mock screenshots per app — gradient cards; swap for real PNGs when designs land
  const screenshots = [
    { caption: "Open the app", body: app.title },
    { caption: app.outputLabel, body: app.inputPlaceholder },
    { caption: "Get instant results", body: `${app.costPerAction} beans per action` },
  ];

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/" className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors">
        ← Back to store
      </Link>

      {/* Hero banner */}
      <section className={`rounded-3xl p-8 mb-8 bg-gradient-to-br ${app.color} text-white flex items-center gap-6`}>
        <div className="w-28 h-28 rounded-2xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center shrink-0 text-white">
          <AppIcon slug={slug} className="w-14 h-14" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{app.title}</h1>
            {app.status === "beta" && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">beta</span>
            )}
          </div>
          <p className="text-white/85 text-sm mb-1">{app.description}</p>
          <p className="text-white/70 text-sm mb-3">{app.longDescription}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-white/15 ring-1 ring-white/20 px-2.5 py-1 rounded-full">{app.category}</span>
            <span className="text-xs bg-white/15 ring-1 ring-white/20 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"><Bean className="w-3.5 h-3.5" />{app.costPerAction} / action</span>
            <span className="text-xs bg-white/15 ring-1 ring-white/20 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />{app.rating} · {app.usageCount.toLocaleString()} uses</span>
          </div>
        </div>
        <Link
          href={`/apps/${slug}/play`}
          className="bg-white text-stone-900 hover:bg-stone-100 font-semibold px-6 py-3 rounded-xl text-sm transition-colors shrink-0"
        >
          Play with it
        </Link>
      </section>

      {/* Carousel */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Screenshots</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="w-9 h-9 rounded-full ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-stone-600 flex items-center justify-center transition-colors"
            >
              <span className="-mt-0.5">‹</span>
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="w-9 h-9 rounded-full ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-stone-600 flex items-center justify-center transition-colors"
            >
              <span className="-mt-0.5">›</span>
            </button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {screenshots.map((s, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-full md:w-[calc(50%-0.5rem)] rounded-2xl bg-white ring-1 ring-stone-200 overflow-hidden"
            >
              <div className={`aspect-video bg-gradient-to-br ${app.color} flex items-center justify-center p-8 text-white`}>
                <div className="text-center">
                  <AppIcon slug={slug} className="w-14 h-14 mx-auto mb-3 opacity-90" />
                  <p className="text-white/90 font-medium text-sm">{s.body}</p>
                </div>
              </div>
              <p className="text-stone-600 text-sm px-4 py-3">{s.caption}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
