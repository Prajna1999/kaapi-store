"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";

export default function Header() {
  const { user, beans, openAuth, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-900 text-lg">
          <span className="text-2xl">☕</span>
          <span>
            kaapi <span className="text-amber-600">store</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/wallet"
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-full text-sm transition-colors ring-1 ring-amber-200"
              >
                <span>🫘</span>
                <span className="font-mono">{beans}</span>
                <span className="hidden sm:inline">beans</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 bg-stone-100 rounded-full text-stone-700 text-sm font-bold flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg ring-1 ring-stone-200 py-2 min-w-44">
                    <p className="text-xs text-stone-400 px-4 py-1 truncate">{user.email}</p>
                    <hr className="my-1 border-stone-100" />
                    <Link
                      href="/wallet"
                      onClick={() => setMenuOpen(false)}
                      className="block text-sm text-stone-700 hover:bg-stone-50 px-4 py-2 transition-colors"
                    >
                      Wallet
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-4 py-2 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={openAuth}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
