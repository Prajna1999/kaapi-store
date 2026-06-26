"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APPS } from "../../../lib/data";
import { useStore } from "../../../lib/store";
import { AppIcon, Bean } from "../../../components/icons";
import { Loader2 } from "lucide-react";

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

export default function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
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
    <div className="p-8 max-w-4xl">
      <Link href={`/apps/${slug}`} className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700 text-sm mb-6 transition-colors">
        ← Back to {app.title}
      </Link>

      {/* Compact app header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shrink-0`}>
          <AppIcon slug={slug} className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-900">{app.title}</h1>
          <p className="text-stone-500 text-sm inline-flex items-center gap-1.5">
            <Bean className="w-4 h-4" /> {app.costPerAction} beans / action
            {user && <> · Balance: <span className="font-mono font-semibold tabular-nums">{beans}</span></>}
          </p>
        </div>
      </div>

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
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : user ? (
            input.trim() ? <>Run · <Bean className="w-4 h-4" /> {app.costPerAction} beans</> : "Type something above to run"
          ) : (
            input.trim() ? <>Sign in to run · <Bean className="w-4 h-4" /> {app.costPerAction} beans</> : "Sign in to use this app"
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

      {showPaywall && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowPaywall(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 ring-1 ring-amber-200 text-amber-600 flex items-center justify-center">
              <Bean className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">You&apos;re out of beans</h2>
            <p className="text-stone-500 text-sm mb-6">
              You need {app.costPerAction} beans to run this. Top up your wallet to continue.
            </p>
            <Link
              href="/wallet"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
            >
              Top up beans
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
