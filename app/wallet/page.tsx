"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BEAN_PACKS } from "../lib/data";
import { useStore } from "../lib/store";

export default function WalletPage() {
  const { user, beans, transactions, addBeans, openAuth } = useStore();
  const [justBought, setJustBought] = useState<string | null>(null);

  useEffect(() => {
    if (!user) openAuth();
  }, [user, openAuth]);

  if (!user) return null;

  const handleTopUp = (packId: string, packBeans: number, packLabel: string) => {
    addBeans(packBeans, `${packLabel} Pack`);
    setJustBought(packId);
    setTimeout(() => setJustBought(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-8 transition-colors">
        ← Back to store
      </Link>

      {/* Balance card */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 mb-8 text-center">
        <p className="text-stone-400 text-sm mb-3 uppercase tracking-widest font-medium">Your balance</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl">🫘</span>
          <span className="text-7xl font-bold font-mono leading-none">{beans}</span>
        </div>
        <p className="text-stone-500 text-sm mt-3">beans · {user.email}</p>
      </div>

      {/* Low balance nudge */}
      {beans < 20 && beans > 0 && (
        <div className="bg-amber-50 ring-1 ring-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Running low on beans</p>
            <p className="text-amber-600 text-xs mt-0.5">Top up below to keep using your apps without interruption.</p>
          </div>
        </div>
      )}
      {beans === 0 && (
        <div className="bg-red-50 ring-1 ring-red-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🚫</span>
          <div>
            <p className="font-semibold text-red-800 text-sm">Out of beans</p>
            <p className="text-red-600 text-xs mt-0.5">Pick a pack below to continue using your apps.</p>
          </div>
        </div>
      )}

      {/* Top-up packs */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-900 mb-5">Top up</h2>
        <div className="grid grid-cols-3 gap-4">
          {BEAN_PACKS.map((pack) => {
            const bought = justBought === pack.id;
            return (
              <div
                key={pack.id}
                className={`bg-white rounded-2xl p-5 text-center relative transition-all ${
                  bought
                    ? "ring-2 ring-emerald-400 scale-[1.02]"
                    : pack.badge
                    ? "ring-2 ring-amber-400"
                    : "ring-1 ring-stone-200"
                }`}
              >
                {pack.badge && !bought && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {pack.badge}
                  </div>
                )}
                {bought && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    ✓ Added!
                  </div>
                )}
                <p className="font-semibold text-stone-600 text-sm mb-2">{pack.label}</p>
                <p className="text-3xl font-bold font-mono text-stone-900">{pack.beans}</p>
                <p className="text-stone-400 text-xs mb-4">beans</p>
                <button
                  onClick={() => handleTopUp(pack.id, pack.beans, pack.label)}
                  className={`w-full font-semibold py-2 rounded-xl text-sm transition-all ${
                    bought
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  {bought ? "✓ Done" : `₹${pack.price}`}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 text-center mt-4">
          Demo mode — no real payment. Beans are added instantly.
        </p>
      </section>

      {/* Transaction history */}
      <section>
        <h2 className="text-xl font-bold text-stone-900 mb-5">History</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🫘</p>
            <p className="text-stone-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl ring-1 ring-stone-200 divide-y divide-stone-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {tx.type === "debit" ? "📤" : tx.type === "topup" ? "💳" : "🎁"}
                  </span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{tx.label}</p>
                    <p className="text-stone-400 text-xs mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <span
                  className={`font-mono font-semibold text-sm ${
                    tx.type === "debit" ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {tx.type === "debit" ? "−" : "+"}
                  {tx.beans} 🫘
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
