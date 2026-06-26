"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES } from "../lib/data";
import { Brand } from "./icons";

export default function Sidebar() {
  const params = useSearchParams();
  const pathname = usePathname();
  const active = params.get("cat") ?? "All";
  const onHome = pathname === "/";

  return (
    <aside className="w-60 shrink-0 border-r border-stone-200 bg-white sticky top-0 h-screen flex flex-col">
      <Link href="/" className="flex items-center gap-2 px-6 pt-6 pb-8 font-bold text-stone-900 text-lg">
        <span className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center"><Brand className="w-4 h-4" /></span>
        <span>App Store</span>
      </Link>

      <nav className="flex-1 px-3 space-y-1">
        {CATEGORIES.map((cat) => {
          const isActive = onHome && active === cat;
          const href = cat === "All" ? "/" : `/?cat=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
