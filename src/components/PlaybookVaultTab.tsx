import React, { useState } from "react";
import {
  ArrowUpRight,
  Globe,
  Send,
  CreditCard,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CURATED_REEL_IDEA_BANK, CuratedReelSeed } from "../data/playbookData";
import { CopyButton } from "./CopyButton";

interface PlaybookVaultTabProps {
  onLaunchReelIdea: (idea: CuratedReelSeed) => void;
}

export const PlaybookVaultTab: React.FC<PlaybookVaultTabProps> = ({
  onLaunchReelIdea,
}) => {
  const [activeVaultSection, setActiveVaultSection] = useState<
    "ideas" | "cashflow"
  >("ideas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Interactive DM Script Customizer
  const [boutiqueName, setBoutiqueName] = useState("Ethnic Glow Boutique");
  const [boutiquePrice, setBoutiquePrice] = useState("₹2,999");
  const [coachName, setCoachName] = useState("Astro Neha");
  const [coachPrice, setCoachPrice] = useState("₹2,500");

  const boutiqueDmScript = `Hi ${
    boutiqueName || "[Boutique Name]"
  } team! Loved your latest kurti collection. I noticed you post flat product photos—so I used our realistic 2026 studio system to put your latest kurti on a faceless iPhone mirror model (attached photo!). Would you like 10 ultra-realistic 4K Reel videos of your outfits like this for just ${
    boutiquePrice || "₹2,999"
  } this week? You can post them daily with Trial Reels to double your order inquiries!`;

  const coachFunnelDmScript = `Hi ${
    coachName || "[Coach / Astrologer Name]"
  }! Love your daily reels. I noticed you don't have an automated ₹49 / ₹99 mini-guide checkout link in your bio yet. I can set up your complete SuperProfile / PayU UPI payment page + Comment Auto-DM funnel in 24 hours for a flat ${
    coachPrice || "₹2,500"
  } so your viewers turn into daily buyers automatically. Want me to send a quick 30-second demo?`;

  const filteredIdeas = CURATED_REEL_IDEA_BANK.filter((idea) => {
    const matchesCat =
      selectedCategory === "All" || idea.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (idea.title.toLowerCase().includes(q) ||
        idea.hook.toLowerCase().includes(q) ||
        idea.executionAngle.toLowerCase().includes(q) ||
        idea.sampleKeywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6">
      {/* Clean 2-View Switcher so Tab 3 is never a giant cluttered page */}
      <div className="p-2 rounded-2xl bg-[#160F24] border border-pink-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveVaultSection("ideas")}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeVaultSection === "ideas"
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
              : "bg-[#0D0816] hover:bg-white/5 text-pink-200/80"
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-xs md:text-sm font-bold">
              1. Searchable Viral Reel Idea Bank ({CURATED_REEL_IDEA_BANK.length}{" "}
              Concepts)
            </div>
            <div className="text-[11px] opacity-80">
              Click any non-generic concept to launch a full AI Reel Pack
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveVaultSection("cashflow")}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeVaultSection === "cashflow"
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
              : "bg-[#0D0816] hover:bg-white/5 text-pink-200/80"
          }`}
        >
          <Send className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-xs md:text-sm font-bold">
              2. Dropservicing DM Scripts & USD AI Rater Links
            </div>
            <div className="text-[11px] opacity-80">
              Boutique ₹2,999 Pitch + Coach ₹2,500 Pitch + Outlier/Alignerr
            </div>
          </div>
        </button>
      </div>

      {/* SECTION 1: Searchable Meesho Pinterest Reel Idea Bank */}
      {activeVaultSection === "ideas" && (
        <section className="p-6 md:p-7 rounded-2xl bg-[#160F24] border border-pink-500/25 space-y-6">
          <div className="space-y-1 border-b border-pink-500/15 pb-4">
            <div className="text-xs font-semibold text-pink-300">
              TAB 3 · Searchable Viral Idea Bank
            </div>
            <h2 className="text-2xl font-bold text-white font-editorial">
              Search All Non-Generic Playbook Ideas (Click Any Card to Generate
              in Tab 1)
            </h2>
          </div>

          {/* Live Search + Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas by keyword (e.g., Zodiac, Short Height, Mom, Myntra Dupe, Black Kurti, Coquette, Rainy)..."
                className="w-full pl-11 pr-4 py-3.5 text-base bg-[#0B0711] border border-pink-500/35 rounded-xl text-white placeholder:text-pink-200/40 focus:outline-none focus:border-pink-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Identity & Personality",
                "Body Proportion & Color Hacks",
                "Aesthetics & Situations",
                "Scroll-Stopping Interactive",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? "bg-pink-600 border-pink-400 text-white font-semibold"
                      : "bg-[#0D0816] border-pink-500/20 text-pink-200/80 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => onLaunchReelIdea(idea)}
                className="p-5 rounded-xl bg-[#0D0816] hover:bg-[#19112B] border border-pink-500/20 hover:border-pink-400/50 transition-colors cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-pink-300 font-mono-tabular">
                    <span>{idea.category}</span>
                    <ArrowUpRight className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-200 leading-snug">
                    {idea.title}
                  </h3>
                  <p className="text-xs md:text-sm text-pink-200 font-semibold bg-[#181028] p-2.5 rounded-lg border border-pink-500/15">
                    Hook: "{idea.hook}"
                  </p>
                  <p className="text-xs md:text-sm text-pink-100/80 leading-relaxed">
                    {idea.executionAngle}
                  </p>
                </div>
                <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 group-hover:underline">
                    Generate Full Reel Pack →
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CopyButton
                      text={`${idea.title}\nHook: ${idea.hook}\nExecution: ${idea.executionAngle}`}
                      label="Copy Idea"
                      variant="subtle"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: Stream 3 & 4 Dropservicing DM Scripts & USD Remote AI Rater Platforms */}
      {activeVaultSection === "cashflow" && (
        <section className="p-6 md:p-7 rounded-2xl bg-[#160F24] border border-pink-500/25 space-y-6">
          <div className="space-y-1 border-b border-pink-500/15 pb-4">
            <div className="text-xs font-semibold text-pink-300">
              Streams 3 & 4 · Evening 60-Minute Cashflow Engines
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-editorial">
              Customize & Copy Client DM Scripts + Verified USD AI Rater Links
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Boutique DM Pitch with Customizer */}
            <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
                    <Send className="w-4 h-4" />
                    <span>Service #1 · Boutique 4K AI Reel Pitch</span>
                  </div>
                  <CopyButton
                    text={boutiqueDmScript}
                    label="Copy DM Script"
                    variant="primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-pink-300/80 mb-1">
                      Boutique Name:
                    </label>
                    <input
                      type="text"
                      value={boutiqueName}
                      onChange={(e) => setBoutiqueName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-pink-300/80 mb-1">
                      Your Package Price:
                    </label>
                    <input
                      type="text"
                      value={boutiquePrice}
                      onChange={(e) => setBoutiquePrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-xs font-bold text-pink-300"
                    />
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-xs md:text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed">
                  {boutiqueDmScript}
                </pre>
              </div>
            </div>

            {/* Coach Funnel Pitch with Customizer */}
            <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
                    <CreditCard className="w-4 h-4" />
                    <span>Service #2 · Payment Page Setup Pitch</span>
                  </div>
                  <CopyButton
                    text={coachFunnelDmScript}
                    label="Copy Coach Script"
                    variant="primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-pink-300/80 mb-1">
                      Coach / Creator Name:
                    </label>
                    <input
                      type="text"
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-pink-300/80 mb-1">
                      Your Setup Fee:
                    </label>
                    <input
                      type="text"
                      value={coachPrice}
                      onChange={(e) => setCoachPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-xs font-bold text-pink-300"
                    />
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-xs md:text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed">
                  {coachFunnelDmScript}
                </pre>
              </div>
            </div>
          </div>

          {/* Stream 4: Remote USD AI Rater Platforms Table with Direct Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
              <Globe className="w-4 h-4" />
              <span>
                Stream 4 · Verified Zero-Coding AI Remote Platforms for Indians
                (Block 3A · 40 Mins/Evening)
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-pink-500/15">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1D1330] text-pink-200 text-xs md:text-sm border-b border-pink-500/15">
                    <th className="py-3 px-4 font-semibold">
                      Verified Platform
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      Exact Role to Apply For
                    </th>
                    <th className="py-3 px-4 font-semibold">
                      Why It Is Super Easy ("Baccho Wala Kaam")
                    </th>
                    <th className="py-3 px-4 font-semibold">Official Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/10 text-xs md:text-sm bg-[#0D0816]">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      1. Outlier AI
                    </td>
                    <td className="py-3.5 px-4 text-pink-200">
                      Hindi / Hinglish / English Generalist & Multimodal Rater
                    </td>
                    <td className="py-3.5 px-4 text-pink-100/90 leading-relaxed">
                      2 AI answers appear on screen (Response A vs Response B).
                      Read and tick which answer is more helpful and polite,
                      then write 2–3 simple sentences explaining why.
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href="https://outlier.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <span>Visit Outlier</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      2. Alignerr
                    </td>
                    <td className="py-3.5 px-4 text-pink-200">
                      Hindi / English Generalist & Audio/Visual Evaluator
                    </td>
                    <td className="py-3.5 px-4 text-pink-100/90 leading-relaxed">
                      Inspect an AI image or short paragraph to verify there are
                      no factual/visual mistakes and write a 2–3 line
                      explanation.
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href="https://www.alignerr.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <span>Visit Alignerr</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      3. Mindrift
                    </td>
                    <td className="py-3.5 px-4 text-pink-200">
                      AI Tutor — Generalist / Creative Writing Editor
                    </td>
                    <td className="py-3.5 px-4 text-pink-100/90 leading-relaxed">
                      Provide simple prompts and polish AI-written paragraphs so
                      they sound natural ($15+/hr flexible remote queues).
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href="https://mindrift.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <span>Visit Mindrift</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
