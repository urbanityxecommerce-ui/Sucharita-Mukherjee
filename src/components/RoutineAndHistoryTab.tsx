import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  RotateCcw,
  Bookmark,
  History,
  Trash2,
  SlidersHorizontal,
  ArrowUpRight,
  Search,
  Download,
} from "lucide-react";
import { HistoryRecord } from "../data/playbookData";
import {
  downloadEbookAsPDF,
  downloadReelPackAsPDF,
} from "../utils/pdfExporter";

interface ChecklistItem {
  id: string;
  blockLabel: string;
  taskTitle: string;
  detail: string;
  completed: boolean;
}

interface RoutineTabProps {
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onResetChecklist: () => void;
  phaseDay: number;
  onIncrementDay: () => void;
  onResetDay: () => void;
}

export const RoutineAndFilterTab: React.FC<RoutineTabProps> = ({
  checklist,
  onToggleChecklist,
  onResetChecklist,
  phaseDay,
  onIncrementDay,
  onResetDay,
}) => {
  const [scores, setScores] = useState({
    visual: 2,
    reviews: 2,
    styling: 2,
    price: 2,
    availability: 1,
  });

  const totalScore =
    scores.visual +
    scores.reviews +
    scores.styling +
    scores.price +
    scores.availability;

  const completedCount = checklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily 3-Block Time Table & 14-Day Lock */}
        <section className="lg:col-span-7 p-6 md:p-7 rounded-2xl bg-[#160F24] border border-pink-500/25 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-500/15 pb-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-pink-300">
                TAB 4 · Daily Anti-Mess Routine & 14-Day Lock Tracker
              </div>
              <h2 className="text-2xl font-bold text-white font-editorial">
                Daily 3-Block Time Table ({completedCount} of {checklist.length} Done)
              </h2>
            </div>
            <button
              type="button"
              onClick={onResetChecklist}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-pink-200 hover:text-white bg-[#221638] rounded-xl border border-pink-500/25 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Today's Tasks</span>
            </button>
          </div>

          {/* 14-Day Lock Progress */}
          <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-pink-200">
                The 14-Day 2-Phase Lock Streak
              </span>
              <span className="text-sm font-mono-tabular font-bold text-pink-300">
                Day {phaseDay} / 14
              </span>
            </div>
            <div className="w-full h-3 bg-[#1B112C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200"
                style={{ width: `${Math.min(100, (phaseDay / 14) * 100)}%` }}
              />
            </div>
            <p className="text-xs md:text-sm text-pink-100/80 leading-relaxed">
              Golden Rule: Pehle 14 din sirf Meesho AI Reels + Ebook Funnel par focus karo. Ek time slot me sirf ek kaam!
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onIncrementDay}
                className="px-4 py-2 text-xs md:text-sm font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-colors cursor-pointer"
              >
                Mark Today Completed (+1 Day)
              </button>
              <button
                type="button"
                onClick={onResetDay}
                className="px-3 py-2 text-xs text-pink-300/80 hover:text-white transition-colors cursor-pointer"
              >
                Reset Streak
              </button>
            </div>
          </div>

          {/* Checklist Cards */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`p-5 rounded-xl border transition-colors cursor-pointer select-none ${
                  item.completed
                    ? "bg-emerald-950/30 border-emerald-500/40 text-pink-100/70"
                    : "bg-[#0D0816] hover:bg-[#19112B] border-pink-500/20 text-white"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-pink-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono-tabular font-bold text-pink-300">
                      {item.blockLabel}
                    </div>
                    <div
                      className={`text-base font-bold leading-snug ${
                        item.completed ? "line-through text-pink-100/50" : "text-white"
                      }`}
                    >
                      {item.taskTitle}
                    </div>
                    <p className="text-xs md:text-sm text-pink-100/80 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: 10-Point Meesho Listing Filter Scorer */}
        <section className="lg:col-span-5 p-6 md:p-7 rounded-2xl bg-[#160F24] border border-pink-500/25 space-y-5">
          <div className="space-y-1 border-b border-pink-500/15 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-300">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Playbook Section 05 · Quality Check</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-editorial">
              10-Point Meesho Product Filter
            </h2>
            <p className="text-xs md:text-sm text-pink-200/80">
              Random listing mat uthao! Score any Meesho outfit before taking screenshots:
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "visual" as const,
                label: "1. Clear Photo & True Color",
                hint: "Consistent lighting, good styling potential, no fake edits",
              },
              {
                key: "reviews" as const,
                label: "2. Customer Reviews & Buyer Photos",
                hint: "4.0+ rating, real customer photos, no fabric complaints",
              },
              {
                key: "styling" as const,
                label: "3. Fits a Viral Styling Hook",
                hint: "Matches Zodiac, 5'0\" height hack, or Mom Approved angle",
              },
              {
                key: "price" as const,
                label: "4. Impulse Price-to-Value Ratio",
                hint: "Looks ₹1,999+ while priced under ₹399–₹499",
              },
              {
                key: "availability" as const,
                label: "5. Sizes & Stock Available",
                hint: "All sizes S–XXL in stock right now",
              },
            ].map((criterion) => (
              <div
                key={criterion.key}
                className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/15 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {criterion.label}
                  </span>
                  <span className="text-xs font-mono-tabular font-bold text-pink-300">
                    {scores[criterion.key]} / 2 pts
                  </span>
                </div>
                <p className="text-xs text-pink-200/70">{criterion.hint}</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[0, 1, 2].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setScores((prev) => ({ ...prev, [criterion.key]: val }))
                      }
                      className={`py-1.5 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer ${
                        scores[criterion.key] === val
                          ? "bg-pink-600 border-pink-400 text-white font-bold"
                          : "bg-[#160F24] border-pink-500/20 text-pink-200 hover:text-white"
                      }`}
                    >
                      {val} pt{val !== 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[#211238] border border-pink-400/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-pink-200">
                Total Listing Score:
              </span>
              <span className="text-xl font-bold font-mono-tabular text-white">
                {totalScore} / 10
              </span>
            </div>
            <div className="text-sm font-bold text-pink-300">
              {totalScore >= 8
                ? "Verdict: 8–10 = SHORTLIST (Take Screenshot Now!)"
                : totalScore >= 6
                ? "Verdict: 6–7 = BACKUP ITEM (Use as 3rd/4th piece only)"
                : "Verdict: 0–5 = SKIP LISTING (Do not feature this product)"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface HistoryVaultTabProps {
  history: HistoryRecord[];
  onSelectHistory: (record: HistoryRecord) => void;
  onToggleSaveHistory: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryAndSavedTab: React.FC<HistoryVaultTabProps> = ({
  history,
  onSelectHistory,
  onToggleSaveHistory,
  onDeleteHistory,
  onClearHistory,
}) => {
  const [filterMode, setFilterMode] = useState<
    "all" | "saved" | "reel" | "ebook"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = history.filter((item) => {
    if (filterMode === "saved" && !item.isSaved) return false;
    if (filterMode === "reel" && item.type !== "reel") return false;
    if (filterMode === "ebook" && item.type !== "ebook") return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q)
    );
  });

  return (
    <section className="p-6 md:p-7 rounded-2xl bg-[#160F24] border border-pink-500/25 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-pink-300">
            TAB 5 · Auto-Saved Generation History & Bookmarked Vault
          </div>
          <h2 className="text-2xl font-bold text-white font-editorial">
            Every Reel Pack & Ebook You Generate Is Saved Here Automatically
          </h2>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-600 rounded-xl border border-rose-500/30 transition-colors cursor-pointer shrink-0"
          >
            Clear Unsaved History
          </button>
        )}
      </div>

      {/* Search + Filter Buttons */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your generated Reels & Ebooks..."
            className="w-full pl-11 pr-4 py-3 text-sm md:text-base bg-[#0B0711] border border-pink-500/35 rounded-xl text-white placeholder:text-pink-200/40 focus:outline-none focus:border-pink-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {[
            { id: "all" as const, label: `All (${history.length})` },
            {
              id: "saved" as const,
              label: `Saved (${history.filter((h) => h.isSaved).length})`,
            },
            {
              id: "reel" as const,
              label: `Reels (${history.filter((h) => h.type === "reel").length})`,
            },
            {
              id: "ebook" as const,
              label: `Ebooks (${history.filter((h) => h.type === "ebook").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                filterMode === tab.id
                  ? "bg-pink-600 border-pink-400 text-white"
                  : "bg-[#0D0816] border-pink-500/20 text-pink-200 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 rounded-xl bg-[#0D0816] border border-pink-500/15 text-center space-y-2">
          <History className="w-8 h-8 text-pink-400/60 mx-auto" />
          <p className="text-base font-bold text-white">
            No matching items found
          </p>
          <p className="text-xs md:text-sm text-pink-200/70">
            Generate a Reel Pack in Tab 1 or an Ebook in Tab 2 and it will automatically save here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="p-5 rounded-xl bg-[#0D0816] hover:bg-[#19112B] border border-pink-500/20 hover:border-pink-400/40 transition-colors cursor-pointer group flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-pink-300 font-mono-tabular">
                  <span>
                    {item.type === "reel"
                      ? "Tab 1 · Viral Reel Pack"
                      : "Tab 2 · 1% Ebook + Reel"}{" "}
                    ·{" "}
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveHistory(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-xs inline-flex items-center gap-1 cursor-pointer ${
                        item.isSaved
                          ? "bg-pink-600/25 border-pink-400 text-pink-200"
                          : "bg-[#181028] border-pink-500/20 text-pink-200/70 hover:text-white"
                      }`}
                    >
                      <Bookmark
                        className="w-3.5 h-3.5"
                        fill={item.isSaved ? "currentColor" : "none"}
                      />
                      <span>{item.isSaved ? "Saved" : "Save"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistory(item.id);
                      }}
                      className="p-1.5 rounded-lg text-pink-200/50 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base md:text-lg font-bold text-white group-hover:text-pink-200 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-pink-200/75">
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-pink-400 group-hover:underline inline-flex items-center gap-1">
                  <span>Click to Open Full Result</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.type === "ebook" && item.ebookData) {
                      downloadEbookAsPDF(item.ebookData);
                    } else if (item.type === "reel" && item.reelData) {
                      downloadReelPackAsPDF(item.reelData);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-200 hover:text-white border border-pink-500/30 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
