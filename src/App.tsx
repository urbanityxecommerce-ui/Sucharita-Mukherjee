/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  Search,
  CheckSquare,
  History,
  Shuffle,
  Printer,
} from "lucide-react";
import {
  ReelGenerationResult,
  EbookGenerationResult,
  HistoryRecord,
  INITIAL_CHECKLIST_ITEMS,
  BACKGROUND_PRESETS,
  CuratedReelSeed,
  buildMasterPrompts,
  enforceMastermindViralReelPack,
} from "./data/playbookData";
import {
  INITIAL_REEL_RESULT,
  INITIAL_EBOOK_RESULT,
} from "./data/initialSamples";
import {
  generateInstantReelClientSide,
  generateInstantEbookClientSide,
  generateLiveReelFromBrowserAI,
  generateLiveEbookFromBrowserAI,
} from "./utils/instantClientGenerator";
import { ReelEngineTab } from "./components/ReelEngineTab";
import { EbookGeneratorTab } from "./components/EbookGeneratorTab";
import { PlaybookVaultTab } from "./components/PlaybookVaultTab";
import {
  RoutineAndFilterTab,
  HistoryAndSavedTab,
} from "./components/RoutineAndHistoryTab";
import {
  PWAInstallButton,
  AndroidIframeInstallNotice,
  OfflineIndicator,
} from "./components/PWAInstallButton";
import { downloadEbookAsPDF } from "./utils/pdfExporter";

const STORAGE_KEYS = {
  CHECKLIST: "glowcash_checklist_v4",
  PHASE_DAY: "glowcash_phase_day_v1",
  HISTORY: "glowcash_history_v9",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "tab1" | "tab2" | "vault" | "routine" | "history"
  >("tab1");

  const [reelResult, setReelResult] =
    useState<ReelGenerationResult>(INITIAL_REEL_RESULT);
  const [ebookResult, setEbookResult] =
    useState<EbookGenerationResult>(INITIAL_EBOOK_RESULT);

  const [isGeneratingReel, setIsGeneratingReel] = useState(false);
  const [isGeneratingEbook, setIsGeneratingEbook] = useState(false);

  const [reelGenCount, setReelGenCount] = useState(1);
  const [ebookGenCount, setEbookGenCount] = useState(1);
  const [recentEbookTitles, setRecentEbookTitles] = useState<string[]>([
    INITIAL_EBOOK_RESULT.ebook.title,
  ]);

  const [reelStatusMsg, setReelStatusMsg] = useState(
    "2026 Live AI Ready · Click Generate, Surprise Me, or Auto-Boost"
  );
  const [ebookStatusMsg, setEbookStatusMsg] = useState(
    "2026 Grey-Hat Oracle AI Ready · Choose Category, Topic, or Surprise Me"
  );

  // Daily Checklist state persisted in localStorage
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  // 14-Day 2-Phase Lock Streak persisted in localStorage
  const [phaseDay, setPhaseDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHASE_DAY);
      if (saved) return Number(saved) || 1;
    } catch {
      // ignore
    }
    return 1;
  });

  // Generation History & Saved Vault persisted in localStorage
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: INITIAL_REEL_RESULT.id,
        type: "reel",
        title: INITIAL_REEL_RESULT.concept.title,
        subtitle: `${INITIAL_REEL_RESULT.concept.category} · 4 Meesho Search Terms + Prompts`,
        createdAt: INITIAL_REEL_RESULT.createdAt,
        isSaved: true,
        reelData: INITIAL_REEL_RESULT,
      },
      {
        id: INITIAL_EBOOK_RESULT.id,
        type: "ebook",
        title: INITIAL_EBOOK_RESULT.ebook.title,
        subtitle: `${INITIAL_EBOOK_RESULT.priceDisplay} White-Label Mastermind Ebook + 6s Reel`,
        createdAt: INITIAL_EBOOK_RESULT.createdAt,
        isSaved: true,
        ebookData: INITIAL_EBOOK_RESULT,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHASE_DAY, String(phaseDay));
    } catch {
      // ignore
    }
  }, [phaseDay]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev: typeof INITIAL_CHECKLIST_ITEMS) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleResetChecklist = () => {
    setChecklist(
      INITIAL_CHECKLIST_ITEMS.map((item) => ({ ...item, completed: false }))
    );
  };

  const handleIncrementDay = () => {
    setPhaseDay((prev) => (prev < 60 ? prev + 1 : 60));
  };

  const handleResetDay = () => {
    setPhaseDay(1);
  };

  // Generate Viral Reel Pack (Tab 1) via Live 2026 AI Engine + Direct Browser AI fallback for Netlify
  const handleGenerateReel = async (
    themeInput: string,
    categoryFilter: string,
    backgroundDesc: string,
    isRetry = false
  ) => {
    setIsGeneratingReel(true);
    const nextVariation = reelGenCount + 1;
    setReelGenCount(nextVariation);
    setReelStatusMsg(
      isRetry
        ? "Live AI generating a 100% brand-new 2026 viral outfit & Meesho combo..."
        : "Live AI generating your custom 2026 Viral Reel Pack..."
    );

    let data: ReelGenerationResult | null = null;
    const previousTitle = reelResult?.concept?.title || "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch("/api/generate-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeInput,
          categoryFilter,
          backgroundDesc,
          variationIndex: nextVariation,
          avoidPreviousTitle: previousTitle,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const parsed = await response.json();
        if (parsed && !parsed.errorFallback && parsed.concept) {
          data = parsed;
        }
      }
    } catch {
      // Server route unreachable (e.g. static Netlify host) — run Live Browser AI next
    }

    if (!data || !data.concept) {
      try {
        data = await generateLiveReelFromBrowserAI(
          themeInput,
          categoryFilter,
          backgroundDesc,
          nextVariation,
          previousTitle
        );
      } catch {
        data = generateInstantReelClientSide(
          themeInput,
          categoryFilter,
          backgroundDesc,
          nextVariation
        );
      }
    }

    const howToCombine =
      data.concept.lookTransformationFormula?.howToCombineAllFourPieces ||
      "Wear Piece 1 fitted at the waist with Piece 2 high-waisted bottom, layer Piece 3, and finish with Piece 4.";
    data = {
      ...data,
      prompts: buildMasterPrompts(
        data.searchTerms,
        backgroundDesc,
        data.concept.title,
        howToCombine
      ),
      reelPack: enforceMastermindViralReelPack(
        data.searchTerms,
        data.concept.title,
        howToCombine,
        data.reelPack,
        nextVariation
      ),
    };

    setReelResult(data);
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setReelStatusMsg(
      `✓ ${data.providerUsed || "Live AI"} · Pack #${nextVariation} Ready (${timeStr})`
    );

    const newRecord: HistoryRecord = {
      id: data.id,
      type: "reel",
      title: data.concept.title,
      subtitle: `${data.concept.category} · 4 Meesho Searches + 5 Hashtags`,
      createdAt: data.createdAt,
      isSaved: false,
      reelData: data,
    };
    setHistory((prev) => [newRecord, ...prev.slice(0, 49)]);
    setIsGeneratingReel(false);
  };

  const handleUpdatePromptsBackground = (newBackgroundDesc: string) => {
    setReelResult((prev) => ({
      ...prev,
      prompts: buildMasterPrompts(
        prev.searchTerms,
        newBackgroundDesc,
        prev.concept.title,
        prev.concept.lookTransformationFormula?.howToCombineAllFourPieces
      ),
    }));
  };

  // Generate 1% Ebook + Psychological Trigger Reel (Tab 2) via Live 2026 Mastermind AI Engine + Direct Browser AI for Netlify
  const handleGenerateEbook = async (
    topicInput: string,
    priceDisplay: string,
    anchorPriceDisplay: string,
    autoDmTrigger: string,
    isRetry = false,
    category = "All"
  ) => {
    setIsGeneratingEbook(true);
    const nextVariation = ebookGenCount + 1;
    setEbookGenCount(nextVariation);
    setEbookStatusMsg(
      isRetry
        ? "Live AI writing a 100% brand-new 5-Chapter Ebook & Mastermind Map..."
        : `Live AI writing your ${priceDisplay} White-Label Ebook & 6s Reel Kit...`
    );

    let data: EbookGenerationResult | null = null;
    const previousEbookTitle = [
      ebookResult?.ebook?.title || "",
      ebookResult?.ebook?.chapters?.[0]?.title || "",
      ...recentEbookTitles.slice(0, 5),
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000);

      const response = await fetch("/api/generate-ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicInput,
          category,
          priceDisplay,
          anchorPriceDisplay,
          autoDmTrigger,
          variationIndex: nextVariation,
          avoidPreviousTitle: previousEbookTitle,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const parsed = await response.json();
        if (parsed && !parsed.errorFallback && parsed.ebook) {
          data = parsed;
        }
      }
    } catch {
      // Server route unreachable (e.g. static Netlify host) — run Live Browser AI next
    }

    if (!data || !data.ebook) {
      try {
        data = await generateLiveEbookFromBrowserAI(
          topicInput,
          priceDisplay,
          anchorPriceDisplay,
          autoDmTrigger,
          nextVariation,
          category,
          previousEbookTitle
        );
      } catch {
        data = generateInstantEbookClientSide(
          topicInput,
          priceDisplay,
          anchorPriceDisplay,
          autoDmTrigger,
          nextVariation,
          category
        );
      }
    }

    setEbookResult(data);
    setRecentEbookTitles((prev) => [
      data!.ebook.title,
      ...(data!.ebook.chapters?.[0]?.title ? [data!.ebook.chapters[0].title] : []),
      ...prev.slice(0, 6),
    ]);
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setEbookStatusMsg(
      `✓ ${data.providerUsed || "Live AI"} · Ebook #${nextVariation} Ready (${timeStr})`
    );

    const newRecord: HistoryRecord = {
      id: data.id,
      type: "ebook",
      title: data.ebook.title,
      subtitle: `${data.priceDisplay} White-Label Ebook · ${data.category || "Mastermind"} (${data.autoDmTrigger})`,
      createdAt: data.createdAt,
      isSaved: false,
      ebookData: data,
    };
    setHistory((prev) => [newRecord, ...prev.slice(0, 49)]);
    setIsGeneratingEbook(false);
  };

  const handleSelectHistory = (record: HistoryRecord) => {
    if (record.type === "reel" && record.reelData) {
      setReelResult(record.reelData);
      setActiveTab("tab1");
    } else if (record.type === "ebook" && record.ebookData) {
      setEbookResult(record.ebookData);
      setActiveTab("tab2");
    }
  };

  const handleToggleSaveHistory = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory((prev) => prev.filter((item) => item.isSaved));
  };

  const isCurrentReelSaved = history.some(
    (h) => h.id === reelResult.id && h.isSaved
  );
  const isCurrentEbookSaved = history.some(
    (h) => h.id === ebookResult.id && h.isSaved
  );

  const handleToggleSaveCurrentReel = () => {
    const exists = history.some((h) => h.id === reelResult.id);
    if (exists) {
      handleToggleSaveHistory(reelResult.id);
    } else {
      setHistory((prev) => [
        {
          id: reelResult.id,
          type: "reel",
          title: reelResult.concept.title,
          subtitle: `${reelResult.concept.category} · 4 Meesho Search Terms`,
          createdAt: reelResult.createdAt,
          isSaved: true,
          reelData: reelResult,
        },
        ...prev,
      ]);
    }
  };

  const handleToggleSaveCurrentEbook = () => {
    const exists = history.some((h) => h.id === ebookResult.id);
    if (exists) {
      handleToggleSaveHistory(ebookResult.id);
    } else {
      setHistory((prev) => [
        {
          id: ebookResult.id,
          type: "ebook",
          title: ebookResult.ebook.title,
          subtitle: `${ebookResult.priceDisplay} Ebook + Trigger Reel`,
          createdAt: ebookResult.createdAt,
          isSaved: true,
          ebookData: ebookResult,
        },
        ...prev,
      ]);
    }
  };

  const handleLaunchReelIdeaFromVault = (idea: CuratedReelSeed) => {
    setActiveTab("tab1");
    handleGenerateReel(
      idea.title,
      idea.category,
      BACKGROUND_PRESETS[0].description,
      false
    );
  };

  const completedRoutineCount = checklist.filter(
    (c: { completed: boolean }) => c.completed
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0711] text-[#F9F5FF] pb-20 sm:pb-0">
      <AndroidIframeInstallNotice />
      {/* Clean Single Top Header Bar */}
      <header className="bg-[#120B1D] border-b border-pink-500/25 no-print">
        <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("tab1")}
            className="text-left flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
              G
            </div>
            <div>
              <div className="text-base md:text-lg font-bold tracking-tight text-white font-editorial leading-none">
                GlowCash AI Studio
              </div>
              <div className="text-[11px] text-pink-300/80 mt-0.5">
                2026 Viral Meesho Reels & Custom-Price Ebook Command Center
              </div>
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <PWAInstallButton />
            {activeTab === "tab2" ? (
              <button
                type="button"
                onClick={() => downloadEbookAsPDF(ebookResult)}
                className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Download 12pt Ebook PDF</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isGeneratingReel}
                onClick={() => {
                  setActiveTab("tab1");
                  handleGenerateReel(
                    "",
                    "All",
                    BACKGROUND_PRESETS[0].description,
                    true
                  );
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-60 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Surprise Viral Reel</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <OfflineIndicator />

      {/* Main Centered Container — 5 Clear Main Tabs, One View at a Time */}
      <main className="flex-1 w-full max-w-[1160px] mx-auto px-4 md:px-6 py-5 space-y-5">
        {/* ONE Unmistakable 5-Tab Navigation Bar */}
        <nav
          aria-label="Main Navigation"
          className="p-2 rounded-2xl bg-[#160F24] border border-pink-500/30 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 no-print"
        >
          <button
            type="button"
            onClick={() => setActiveTab("tab1")}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === "tab1"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md"
                : "bg-[#0D0816] hover:bg-[#1D1230] text-pink-200"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                1. Meesho Reel AI
              </div>
              <div className="text-[10px] opacity-80 truncate">
                4 Steps · 5 Hashtags
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tab2")}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === "tab2"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md"
                : "bg-[#0D0816] hover:bg-[#1D1230] text-pink-200"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                2. ₹19 Ebook AI
              </div>
              <div className="text-[10px] opacity-80 truncate">
                12pt PDF + 6s Reel
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === "vault"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md"
                : "bg-[#0D0816] hover:bg-[#1D1230] text-pink-200"
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                3. Idea Bank
              </div>
              <div className="text-[10px] opacity-80 truncate">
                18 Seeds + DM Scripts
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("routine")}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === "routine"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md"
                : "bg-[#0D0816] hover:bg-[#1D1230] text-pink-200"
            }`}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                4. Daily Routine ({completedRoutineCount}/4)
              </div>
              <div className="text-[10px] opacity-80 truncate">
                Checklist + 10-Pt Filter
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md"
                : "bg-[#0D0816] hover:bg-[#1D1230] text-pink-200"
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                5. Saved History ({history.length})
              </div>
              <div className="text-[10px] opacity-80 truncate">
                All Past Generations
              </div>
            </div>
          </button>
        </nav>

        {/* Dedicated View for Each Main Tab */}
        {activeTab === "tab1" && (
          <ReelEngineTab
            result={reelResult}
            isGenerating={isGeneratingReel}
            generationCount={reelGenCount}
            lastUpdatedMsg={reelStatusMsg}
            onGenerate={handleGenerateReel}
            onUpdatePromptsBackground={handleUpdatePromptsBackground}
            onUpdateReelResult={(updatedReel) => {
              setReelResult(updatedReel);
              setReelGenCount((c) => c + 1);
              setReelStatusMsg(
                `✨ 100x Royal Stylist Updated: "${updatedReel.concept.title}"`
              );
              const newRecord: HistoryRecord = {
                id: updatedReel.id,
                type: "reel",
                title: updatedReel.concept.title,
                subtitle: `100x Custom Similar-Item Match · 4 Meesho Searches + Prompts`,
                createdAt: updatedReel.createdAt,
                isSaved: false,
                reelData: updatedReel,
              };
              setHistory((prev) => [newRecord, ...prev.slice(0, 49)]);
            }}
            isSaved={isCurrentReelSaved}
            onToggleSave={handleToggleSaveCurrentReel}
          />
        )}

        {activeTab === "tab2" && (
          <EbookGeneratorTab
            result={ebookResult}
            isGenerating={isGeneratingEbook}
            generationCount={ebookGenCount}
            lastUpdatedMsg={ebookStatusMsg}
            onGenerate={handleGenerateEbook}
            onUpdateReelBlueprint={(updatedBlueprint) => {
              setEbookResult((prev) => ({
                ...prev,
                reelBlueprint: updatedBlueprint,
              }));
              setHistory((prev) =>
                prev.map((item) =>
                  item.type === "ebook" &&
                  item.id === ebookResult.id &&
                  item.ebookData
                    ? {
                        ...item,
                        ebookData: {
                          ...item.ebookData,
                          reelBlueprint: updatedBlueprint,
                        },
                      }
                    : item
                )
              );
            }}
            isSaved={isCurrentEbookSaved}
            onToggleSave={handleToggleSaveCurrentEbook}
          />
        )}

        {activeTab === "vault" && (
          <PlaybookVaultTab
            onLaunchReelIdea={handleLaunchReelIdeaFromVault}
          />
        )}

        {activeTab === "routine" && (
          <RoutineAndFilterTab
            checklist={checklist}
            onToggleChecklist={handleToggleChecklist}
            onResetChecklist={handleResetChecklist}
            phaseDay={phaseDay}
            onIncrementDay={handleIncrementDay}
            onResetDay={handleResetDay}
          />
        )}

        {activeTab === "history" && (
          <HistoryAndSavedTab
            history={history}
            onSelectHistory={handleSelectHistory}
            onToggleSaveHistory={handleToggleSaveHistory}
            onDeleteHistory={handleDeleteHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Native Android Mobile Bottom Navigation Bar (Visible on Mobile Screens) */}
      <nav
        aria-label="Mobile Bottom App Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120B1D]/95 backdrop-blur-md border-t border-pink-500/30 grid grid-cols-5 px-1 py-1.5 no-print shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setActiveTab("tab1")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "tab1"
              ? "text-pink-400 font-bold bg-pink-500/15"
              : "text-pink-200/70"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Reel AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tab2")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "tab2"
              ? "text-pink-400 font-bold bg-pink-500/15"
              : "text-pink-200/70"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Ebook AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vault")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "vault"
              ? "text-pink-400 font-bold bg-pink-500/15"
              : "text-pink-200/70"
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Ideas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("routine")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "routine"
              ? "text-pink-400 font-bold bg-pink-500/15"
              : "text-pink-200/70"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">
            Routine ({completedRoutineCount}/4)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "history"
              ? "text-pink-400 font-bold bg-pink-500/15"
              : "text-pink-200/70"
          }`}
        >
          <History className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Saved ({history.length})</span>
        </button>
      </nav>
    </div>
  );
}
