"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { INITIAL_TRANSACTIONS, type Transaction } from "./data";

type User = { email: string };

type StoreCtx = {
  user: User | null;
  beans: number;
  transactions: Transaction[];
  login: (email: string) => void;
  logout: () => void;
  deductBeans: (n: number, label: string) => boolean;
  addBeans: (n: number, label: string) => void;
  showAuth: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

const Ctx = createContext<StoreCtx>(null!);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [beans, setBeans] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);

  const showToast = (msg: string) => {
    const key = Date.now();
    setToast({ msg, key });
    setTimeout(() => setToast((t) => (t?.key === key ? null : t)), 3000);
  };

  const addTx = (tx: Omit<Transaction, "id" | "date">) =>
    setTransactions((prev) => [
      { ...tx, id: String(Date.now()), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);

  const login = (email: string) => {
    setUser({ email });
    // ponytail: free grant hardcoded to 100; make configurable when admin panel exists
    setBeans(100);
    setTransactions([...INITIAL_TRANSACTIONS]);
    setShowAuth(false);
    setEmailInput("");
    showToast("🎉 100 free beans added to your wallet!");
  };

  const logout = () => {
    setUser(null);
    setBeans(0);
    setTransactions([]);
  };

  const deductBeans = (n: number, label: string) => {
    if (beans < n) return false;
    setBeans((b) => b - n);
    addTx({ type: "debit", beans: n, label });
    return true;
  };

  const addBeans = (n: number, label: string) => {
    setBeans((b) => b + n);
    addTx({ type: "topup", beans: n, label });
    showToast(`🫘 +${n} beans added to your wallet`);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        beans,
        transactions,
        login,
        logout,
        deductBeans,
        addBeans,
        showAuth,
        openAuth: () => setShowAuth(true),
        closeAuth: () => setShowAuth(false),
      }}
    >
      {children}

      {/* Auth modal */}
      {showAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header strip */}
            <div className="bg-stone-900 px-8 py-6 text-center">
              <div className="text-4xl mb-2">☕</div>
              <h2 className="text-xl font-bold text-white">Welcome to Kaapi</h2>
              <p className="text-stone-400 text-sm mt-1">
                Sign in and get{" "}
                <span className="text-amber-400 font-semibold">100 beans free</span>
              </p>
            </div>

            <div className="px-8 py-6 space-y-3">
              {/* Demo CTA — prominent */}
              <button
                onClick={() => login("demo@kaapi.in")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
              >
                <span>🚀</span> Try demo account instantly
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-stone-400 text-xs">or continue with email</span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <input
                type="email"
                placeholder="your@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && emailInput && login(emailInput)}
                autoFocus
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
              <button
                disabled={!emailInput}
                onClick={() => login(emailInput)}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Get started →
              </button>

              <p className="text-xs text-stone-400 text-center pt-1">
                No password. No credit card. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          key={toast.key}
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-medium"
        >
          {toast.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
