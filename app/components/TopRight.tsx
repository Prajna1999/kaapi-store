"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";
import { Bean } from "./icons";

export default function TopRight() {
  const { user, beans, openAuth, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 right-6 z-30 flex items-center gap-3">
      {user ? (
        <>
          <Link
            href="/wallet"
            className="flex items-center gap-1.5 bg-white hover:bg-amber-50 ring-1 ring-amber-200 text-amber-700 font-semibold px-3.5 py-2 rounded-full text-sm transition-colors shadow-sm"
          >
            <Bean className="w-4 h-4" />
            <span className="font-mono tabular-nums">{beans}</span>
            <span className="hidden sm:inline font-normal text-amber-700/80">beans</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 bg-white ring-1 ring-stone-200 rounded-full text-stone-700 text-sm font-bold flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
            >
              {user.email.charAt(0).toUpperCase()}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg ring-1 ring-stone-200 py-2 min-w-48">
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
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
