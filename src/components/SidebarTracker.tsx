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
} from "lucide-react";
import { HistoryRecord, INITIAL_CHECKLIST_ITEMS } from "../data/playbookData";

interface ChecklistItem {
  id: string;
  blockLabel: string;
  taskTitle: string;
  detail: string;
  completed: boolean;
}

interface SidebarTrackerProps {
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onResetChecklist: () => void;
  phaseDay: number;
  onIncrementDay: () => void;
  onResetDay: () => void;
  history: HistoryRecord[];
  onSelectHistory: (record: HistoryRecord) => void;
  onToggleSaveHistory: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
}

export const SidebarTracker: React.FC<SidebarTrackerProps> = ({
  checklist,
  onToggleChecklist,
  onResetChecklist,
  phaseDay,
  onIncrementDay,
  onResetDay,
  history,
  onSelectHistory,
  onToggleSaveHistory,
  onDeleteHistory,
  onClearHistory,
}) => {
  const [sidebarMode, setSidebarMode] = useState<
    "checklist" | "history" | "saved" | "scorer"
  >("checklist");

  // 10-Point Meesho Product Listing Scorer state (Section 05 of user's Playbook)
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
  const savedItems = history.filter((h) => h.isSaved);
  const displayedHistory =
    sidebarMode === "saved" ? savedItems : history;

  return (
    <aside className="w-full lg:w-[310px] shrink-0 bg-[#120B1D] border-b lg:border-b-0 lg:border-r border-pink-500/15 flex flex-col no-print">
      {/* Segmented Control Switcher */}
      <div className="p-4 border-b border-pink-500/15">
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#0B0711] rounded-lg border border-pink-500/15">
          <button
            type="button"
            onClick={() => setSidebarMode("checklist")}
            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sidebarMode === "checklist"
                ? "bg-pink-600 text-white"
                : "text-pink-200/70 hover:text-pink-100"
            }`}
          >
            Routine
          </button>
          <button
            type="button"
            onClick={() => setSidebarMode("history")}
            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono-tabular ${
              sidebarMode === "history"
                ? "bg-pink-600 text-white"
                : "text-pink-200/70 hover:text-pink-100"
            }`}
          >
            History ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setSidebarMode("saved")}
            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono-tabular ${
              sidebarMode === "saved"
                ? "bg-pink-600 text-white"
                : "text-pink-200/70 hover:text-pink-100"
            }`}
          >
            Saved ({savedItems.length})
          </button>
          <button
            type="button"
            onClick={() => setSidebarMode("scorer")}
            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sidebarMode === "scorer"
                ? "bg-pink-600 text-white"
                : "text-pink-200/70 hover:text-pink-100"
            }`}
            title="10-Point Meesho Product Filter"
          >
            10-Pt Filter
          </button>
        </div>
      </div>

      {/* Mode 1: Daily Anti-Mess Checklist & 14-Day Lock Tracker */}
      {sidebarMode === "checklist" && (
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* 14-Day 2-Phase Lock Counter */}
          <div className="p-3.5 rounded-xl bg-[#181028] border border-pink-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-200">
                14-Day 2-Phase Lock Rule
              </span>
              <span className="text-xs font-mono-tabular text-pink-300">
                Day {phaseDay} / 14
              </span>
            </div>
            <div className="w-full h-2 bg-[#0B0711] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200"
                style={{ width: `${Math.min(100, (phaseDay / 14) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-pink-100/70 leading-relaxed">
              No jumping between random tasks. Lock 1 Affiliate Reel + 1 Ebook
              Reel daily for 14 days first.
            </p>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onIncrementDay}
                className="px-3 py-1.5 text-xs font-medium bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Mark Today Done (+1 Day)
              </button>
              <button
                type="button"
                onClick={onResetDay}
                className="px-2.5 py-1.5 text-xs text-pink-300/70 hover:text-pink-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Reset Streak
              </button>
            </div>
          </div>

          {/* Daily 3-Block Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Daily 3-Block Time Table
                </h3>
                <p className="text-xs text-pink-200/60 font-mono-tabular">
                  {completedCount} of {checklist.length} blocks completed today
                </p>
              </div>
              <button
                type="button"
                onClick={onResetChecklist}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-pink-300/80 hover:text-pink-100 bg-[#1B122B] rounded-md border border-pink-500/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Reset daily tasks for a new morning"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklist(item.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                    item.completed
                      ? "bg-[#141E24]/60 border-emerald-500/30 text-pink-100/60"
                      : "bg-[#181028] hover:bg-[#1E1433] border-pink-500/15 text-white"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-pink-400 shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-pink-400/80" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="text-[11px] text-pink-300/80 font-mono-tabular">
                        {item.blockLabel}
                      </div>
                      <div
                        className={`text-xs font-semibold leading-snug ${
                          item.completed ? "line-through text-pink-100/50" : "text-white"
                        }`}
                      >
                        {item.taskTitle}
                      </div>
                      <p className="text-[11px] text-pink-100/65 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Week Milestone Reference */}
          <div className="pt-3 border-t border-pink-500/15 space-y-2.5">
            <h4 className="text-xs font-semibold text-pink-200">
              60-Day Milestone Roadmap
            </h4>
            <div className="space-y-2 text-xs text-pink-100/75">
              <div className="p-2.5 rounded-lg bg-[#160F24] border border-pink-500/10">
                <span className="font-semibold text-pink-300">Weeks 1–2:</span>{" "}
                14 AI Outfit Reels + 14 Ebook Trigger Reels + Wishlink/SuperProfile live.
              </div>
              <div className="p-2.5 rounded-lg bg-[#160F24] border border-pink-500/10">
                <span className="font-semibold text-pink-300">Weeks 3–4:</span>{" "}
                Onboard Outlier AI, Alignerr & Mindrift for weekly USD payouts.
              </div>
              <div className="p-2.5 rounded-lg bg-[#160F24] border border-pink-500/10">
                <span className="font-semibold text-pink-300">Weeks 5–8:</span>{" "}
                Send 5 Boutique DMs/day pitching ₹2,999 4K AI Reel packs.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2 & 3: Generation History & Saved Vault */}
      {(sidebarMode === "history" || sidebarMode === "saved") && (
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {sidebarMode === "saved"
                ? "Saved Favorites Vault"
                : "Auto-Saved Generation History"}
            </h3>
            {sidebarMode === "history" && history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-pink-300/70 hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-xs text-pink-200/65 leading-relaxed">
            Every Reel Concept and Ebook you generate is automatically saved here. Click any item to reload it into the workspace.
          </p>

          {displayedHistory.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#181028] border border-pink-500/15 text-center space-y-2">
              <History className="w-6 h-6 text-pink-400/60 mx-auto" />
              <p className="text-xs font-medium text-pink-100">
                {sidebarMode === "saved"
                  ? "No bookmarked items yet"
                  : "No generations in history yet"}
              </p>
              <p className="text-[11px] text-pink-200/60">
                {sidebarMode === "saved"
                  ? "Click the Save bookmark button on any generated Reel or Ebook to pin it here."
                  : "Generate a Reel Pack in Tab 1 or an Ebook in Tab 2 and it will automatically appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="p-3 rounded-xl bg-[#181028] hover:bg-[#211636] border border-pink-500/20 transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-pink-300/80 font-mono-tabular">
                    <span>
                      {item.type === "reel" ? "Reel Engine" : "1% Ebook"} ·{" "}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveHistory(item.id);
                        }}
                        className={`p-1 rounded hover:bg-pink-500/20 cursor-pointer ${
                          item.isSaved ? "text-pink-400" : "text-pink-200/50"
                        }`}
                        title={
                          item.isSaved ? "Remove from Saved" : "Save to Favorites"
                        }
                      >
                        <Bookmark
                          className="w-3.5 h-3.5"
                          fill={item.isSaved ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(item.id);
                        }}
                        className="p-1 rounded text-pink-200/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-pink-200 line-clamp-2 leading-snug flex items-start justify-between gap-1">
                    <span>{item.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-pink-200/65 line-clamp-1">
                    {item.subtitle}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 4: 10-Point Meesho Product Listing Filter (Playbook Section 05) */}
      {sidebarMode === "scorer" && (
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Playbook Section 05 · Listing Filter</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              10-Point Meesho Product Scorer
            </h3>
            <p className="text-xs text-pink-200/65 leading-relaxed">
              Never pick a random Meesho listing just from a pretty cover photo. Score the listing before taking screenshots:
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "visual" as const,
                label: "1. Visual Appeal & Clear Lighting",
                hint: "Consistent color, high styling potential, no fake edits",
              },
              {
                key: "reviews" as const,
                label: "2. Customer Reviews & Real Photos",
                hint: "4.0+ rating, recent unedited buyer photos, low complaints",
              },
              {
                key: "styling" as const,
                label: "3. Useful Styling / Identity Angle",
                hint: "Fits Zodiac, 5'0\" height hack, or 1-kurti-3-ways",
              },
              {
                key: "price" as const,
                label: "4. Impulse Price-Value Ratio",
                hint: "Looks ₹1,999+ while priced under ₹399–₹499",
              },
              {
                key: "availability" as const,
                label: "5. Size & Stock Availability",
                hint: "XS to XXL in stock (never make an OOS item the hero)",
              },
            ].map((criterion) => (
              <div
                key={criterion.key}
                className="p-3 rounded-xl bg-[#181028] border border-pink-500/15 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {criterion.label}
                  </span>
                  <span className="text-xs font-mono-tabular text-pink-300">
                    {scores[criterion.key]} / 2
                  </span>
                </div>
                <p className="text-[11px] text-pink-200/60">{criterion.hint}</p>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[0, 1, 2].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setScores((prev) => ({ ...prev, [criterion.key]: val }))
                      }
                      className={`py-1 text-xs font-mono-tabular rounded-md border transition-colors cursor-pointer ${
                        scores[criterion.key] === val
                          ? "bg-pink-600 border-pink-400 text-white font-semibold"
                          : "bg-[#0B0711] border-pink-500/15 text-pink-200/70 hover:text-white"
                      }`}
                    >
                      {val} pt{val !== 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#1D1230] border border-pink-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-200">
                Total Listing Score
              </span>
              <span className="text-base font-bold font-mono-tabular text-white">
                {totalScore} / 10
              </span>
            </div>
            <div className="text-xs font-medium text-pink-300">
              {totalScore >= 8
                ? "Verdict: 8–10 = HERO SHORTLIST (Screenshot Now!)"
                : totalScore >= 6
                ? "Verdict: 6–7 = BACKUP ITEM (Use as 3rd/4th piece only)"
                : "Verdict: 0–5 = SKIP LISTING (High return/disappointment risk)"}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
