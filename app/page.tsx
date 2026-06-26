"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { APPS } from "./lib/data";
import { useStore } from "./lib/store";
import { AppIcon, Brand } from "./components/icons";

function HomeInner() {
  const params = useSearchParams();
  const category = params.get("cat") ?? "All";
  const { user, openAuth } = useStore();
  const filtered = category === "All" ? APPS : APPS.filter((a) => a.category === category);

  return (
    <div className="p-8 max-w-6xl">
      {/* Hero card */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-10 mb-8 flex items-center gap-8 min-h-[280px]">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
            AI tools that <span className="text-amber-400">just work</span>
          </h1>
          <p className="text-stone-300 text-base mb-6 max-w-lg">
            Narrow, high-impact tools for NGO workers, educators, and community health workers. Pay per use, start with 75 free beans.
          </p>
          {!user && (
            <button
              onClick={openAuth}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Get 75 free beans
            </button>
          )}
        </div>
        <div className="hidden md:flex w-44 h-44 rounded-3xl bg-white/5 ring-1 ring-white/10 items-center justify-center shrink-0 text-amber-400">
          <Brand className="w-16 h-16" />
        </div>
      </section>

      {/* App grid */}
      <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-4">
        {category === "All" ? "All apps" : category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((app) => (
          <Link
            key={app.slug}
            href={`/apps/${app.slug}`}
            className="bg-white rounded-2xl ring-1 ring-stone-200 p-5 flex gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shrink-0`}
            >
              <AppIcon slug={app.slug} className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-900 truncate">{app.title}</h3>
              <p className="text-xs text-stone-400 mb-1">{app.category}</p>
              <p className="text-stone-600 text-sm leading-snug line-clamp-2">{app.description}</p>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-stone-400 text-sm col-span-full py-8">No apps in this category yet.</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
