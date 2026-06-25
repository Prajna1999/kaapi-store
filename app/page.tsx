"use client";
import { useState } from "react";
import Link from "next/link";
import { APPS, CATEGORIES } from "./lib/data";
import { useStore } from "./lib/store";

export default function Home() {
  const [category, setCategory] = useState("All");
  const { user, openAuth } = useStore();
  const filtered = category === "All" ? APPS : APPS.filter((a) => a.category === category);
  const featured = APPS[0];

  return (
    <div>
      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
              <span>🫘</span>
              <span>Pay per use · Start with 100 free beans</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              AI tools built for
              <br />
              <span className="text-amber-400">social sector</span> work
            </h1>
            <p className="text-stone-400 text-lg mb-8 max-w-md">
              Narrow, high-impact tools for NGO workers, educators, and community health workers. No subscriptions.
              No contracts.
            </p>
            {!user && (
              <button
                onClick={openAuth}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-lg"
              >
                Get 100 free beans →
              </button>
            )}
          </div>

          {/* Featured app card */}
          <div className="flex-shrink-0">
            <Link
              href={`/apps/${featured.slug}`}
              className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 w-72 transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${featured.color} flex items-center justify-center text-3xl mb-4`}
              >
                {featured.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">{featured.title}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  {featured.status}
                </span>
              </div>
              <p className="text-stone-400 text-sm mb-4 leading-relaxed">{featured.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-sm font-mono font-semibold">
                  🫘 {featured.costPerAction} / action
                </span>
                <span className="text-stone-500 text-xs">⭐ {featured.rating}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* App grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <h2 className="text-xl font-bold text-stone-900 mr-2">Browse apps</h2>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-amber-500 text-white"
                  : "bg-white ring-1 ring-stone-200 text-stone-600 hover:ring-amber-300 hover:text-amber-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((app) => (
            <Link
              key={app.slug}
              href={`/apps/${app.slug}`}
              className="bg-white rounded-2xl ring-1 ring-stone-200 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-stone-900 truncate">{app.title}</h3>
                    {app.status === "beta" && (
                      <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full flex-shrink-0">
                        beta
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                </div>
              </div>
              <p className="text-stone-600 text-sm flex-1 mb-4 leading-relaxed">{app.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 font-mono font-semibold text-sm">
                  🫘 {app.costPerAction} / action
                </span>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>⭐ {app.rating}</span>
                  <span>{app.usageCount.toLocaleString()} uses</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
