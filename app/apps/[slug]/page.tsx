"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APPS } from "../../lib/data";
import { useStore } from "../../lib/store";

function getMockOutput(slug: string, input: string): string {
  if (slug === "marathi-helper") {
    return `मराठी अनुवाद:\n\n"${input}"\n\nरुग्णाला ताप आणि खोकला आहे. त्याला विश्रांती आणि भरपूर पाणी द्या.\n\n(Mock transliteration — real output uses NLP model)`;
  }
  if (slug === "letter-friends") {
    const letter = input.trim().charAt(0).toUpperCase();
    const words: Record<string, string> = {
      A: "Apple 🍎", B: "Ball ⚽", C: "Cat 🐱", D: "Dog 🐶", E: "Elephant 🐘",
      F: "Fish 🐟", G: "Goat 🐐", H: "Hat 🎩", I: "Ice cream 🍦", J: "Jar 🫙",
    };
    return `Letter ${letter}\n\nSays: "${letter.toLowerCase()}"\nAs in: ${words[letter] ?? `${letter} is for something Amazing! ✨`}\n\nTrace it:  ${letter}   ${letter}   ${letter}\n\nGreat job! You learned letter ${letter}! 🌟`;
  }
  if (slug === "story-spark") {
    return `Once in a small village, the community gathered to discuss "${input}".\n\nOld grandmother Kaveri spoke first. "We have faced harder times," she said. "Together, we will find a way."\n\nThe children helped collect resources. The elders shared wisdom. Within a week, every family worked together — and the challenge was solved.\n\nMoral: Communities that act together, thrive together. 🌱\n\n(Adapt this for your outreach — replace village details with local context.)`;
  }
  return "Processing complete.";
}

export default function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const app = APPS.find((a) => a.slug === slug);
  const { user, beans, deductBeans, openAuth } = useStore();
  const router = useRouter();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (!app) {
    router.push("/");
    return null;
  }

  const handleRun = async () => {
    if (!user) { openAuth(); return; }
    if (beans < app.costPerAction) { setShowPaywall(true); return; }
    setLoading(true);
    setOutput("");
    // ponytail: fake 1.5s latency simulating API call
    await new Promise((r) => setTimeout(r, 1500));
    deductBeans(app.costPerAction, app.title);
    setOutput(getMockOutput(slug, input));
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-8 transition-colors">
        ← Back to store
      </Link>

      {/* App header */}
      <div className="flex items-start gap-6 mb-10">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-lg`}
        >
          {app.icon}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-stone-900">{app.title}</h1>
            {app.status === "beta" && (
              <span className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded-full">beta</span>
            )}
          </div>
          <p className="text-stone-500 mb-3">{app.description}</p>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="text-amber-600 font-mono font-semibold">🫘 {app.costPerAction} beans / action</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">⭐ {app.rating}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500">{app.usageCount.toLocaleString()} uses</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 mb-3">About</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{app.longDescription}</p>
          </div>
          <div className="bg-amber-50 ring-1 ring-amber-200 rounded-2xl p-5">
            <h3 className="font-semibold text-amber-800 mb-2">Pricing</h3>
            <p className="text-amber-700 text-sm">
              <span className="font-mono font-bold text-lg">🫘 {app.costPerAction}</span> beans per action
            </p>
            <p className="text-amber-600 text-xs mt-1">Charged only on successful runs</p>
            {user && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-amber-700 text-xs font-medium">
                  Balance: <span className="font-mono font-bold">{beans}</span> beans
                </p>
                {beans < app.costPerAction * 3 && beans > 0 && (
                  <Link href="/wallet" className="text-xs text-amber-600 underline underline-offset-2">
                    Top up →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Runtime */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl ring-1 ring-stone-200 p-6">
            <h3 className="font-semibold text-stone-900 mb-4">Try it</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={app.inputPlaceholder}
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm mb-4"
            />
            <button
              onClick={handleRun}
              disabled={loading || (!!user && !input.trim())}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span> Processing…
                </>
              ) : user ? (
                input.trim()
                  ? `Run · 🫘 ${app.costPerAction} beans`
                  : "Type something above to run"
              ) : (
                input.trim()
                  ? `Sign in to run · 🫘 ${app.costPerAction} beans`
                  : "Sign in to use this app"
              )}
            </button>

            {output && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{app.outputLabel}</p>
                <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-700 whitespace-pre-wrap ring-1 ring-stone-200 leading-relaxed">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall modal */}
      {showPaywall && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowPaywall(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🫘</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">You&apos;re out of beans</h2>
            <p className="text-stone-500 text-sm mb-6">
              You need {app.costPerAction} beans to run this. Top up your wallet to continue.
            </p>
            <Link
              href="/wallet"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
            >
              Top up beans →
            </Link>
            <button
              onClick={() => setShowPaywall(false)}
              className="text-stone-500 hover:text-stone-700 text-sm py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
