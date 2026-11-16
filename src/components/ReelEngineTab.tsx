import React, { useState } from "react";
import {
  Wand2,
  Shuffle,
  RefreshCw,
  Sparkles,
  Search,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  Calendar,
  Layers,
  Eye,
} from "lucide-react";
import {
  ReelGenerationResult,
  BACKGROUND_PRESETS,
  CURATED_REEL_IDEA_BANK,
  buildMasterPrompts,
  boostUserIdeaOptions,
  getRealTimeDailyStylingContext,
  enforceMastermindViralReelPack,
} from "../data/playbookData";
import { CopyButton } from "./CopyButton";
import { downloadReelPackAsPDF } from "../utils/pdfExporter";
import { SimilarItemStylistChat } from "./SimilarItemStylistChat";

interface ReelEngineTabProps {
  result: ReelGenerationResult;
  isGenerating: boolean;
  generationCount: number;
  lastUpdatedMsg: string;
  onGenerate: (
    themeInput: string,
    categoryFilter: string,
    backgroundDesc: string,
    isRetry?: boolean
  ) => void;
  onUpdatePromptsBackground: (newBackgroundDesc: string) => void;
  onUpdateReelResult: (updatedReel: ReelGenerationResult) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const CATEGORIES = [
  "All",
  "Identity & Personality",
  "Body Proportion & Color Hacks",
  "Aesthetics & Situations",
  "Scroll-Stopping Interactive",
];

const HOOK_PSYCHOLOGY_LABELS = [
  "HOOK 01 · MISTAKE / BODY-PROPORTION / GATEKEEPING TRIGGER (Stops Scroll in 0.8s)",
  "HOOK 02 · PRICE-SHOCK + 'WAIT FOR PIECE 3' WATCH-TIME LOOP TRIGGER",
  "HOOK 03 · RELATABLE BESTIE DM-SHARE & SAVE TRIGGER",
];

export const ReelEngineTab: React.FC<ReelEngineTabProps> = ({
  result,
  isGenerating,
  generationCount,
  lastUpdatedMsg,
  onGenerate,
  onUpdatePromptsBackground,
  onUpdateReelResult,
  isSaved,
  onToggleSave,
}) => {
  const [themeInput, setThemeInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedBgId, setSelectedBgId] = useState(BACKGROUND_PRESETS[0].id);

  // Shows ONLY 1 clean step at a time so the screen is NEVER messy!
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [activePromptTab, setActivePromptTab] = useState<
    "preview" | "bundle" | "mirror" | "motion" | "single"
  >("preview");

  const [boostedSuggestions, setBoostedSuggestions] = useState<string[]>([]);
  const [isBoosting, setIsBoosting] = useState(false);
  const [pdfToast, setPdfToast] = useState<string | null>(null);

  const liveDailyContext = getRealTimeDailyStylingContext(generationCount);

  const activeBackgroundDesc =
    BACKGROUND_PRESETS.find((b) => b.id === selectedBgId)?.description ||
    BACKGROUND_PRESETS[0].description;

  const howToCombineSummary =
    result.concept.lookTransformationFormula?.howToCombineAllFourPieces ||
    "Wear Piece 1 fitted at the waist with Piece 2 high-waisted bottom, layer Piece 3 at the waist/neck, and finish with Piece 4.";

  const dynamicPrompts = buildMasterPrompts(
    result.searchTerms,
    activeBackgroundDesc,
    result.concept.title,
    howToCombineSummary
  );

  // Enforce 100% Anti-AI-Slop human psychology on hooks, caption, SEO keywords & 5 hashtags
  const safeReelPack = enforceMastermindViralReelPack(
    result.searchTerms,
    result.concept.title,
    howToCombineSummary,
    result.reelPack,
    generationCount
  );

  const fiveHashtags = safeReelPack.trendingHashtags.slice(0, 5);

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(1);
    onGenerate(themeInput, categoryFilter, activeBackgroundDesc, false);
  };

  const handleRetryClick = () => {
    setThemeInput("");
    setCurrentStep(1);
    onGenerate("", categoryFilter, activeBackgroundDesc, true);
  };

  const handleSurpriseMe = () => {
    const candidateBank = CURATED_REEL_IDEA_BANK.filter(
      (item) => item.title !== result.concept.title && item.title !== themeInput
    );
    const randomSeed =
      candidateBank[Math.floor(Math.random() * candidateBank.length)] ||
      CURATED_REEL_IDEA_BANK[generationCount % CURATED_REEL_IDEA_BANK.length];
    const surpriseTopic = `${randomSeed.title} (${randomSeed.hook})`;
    setThemeInput(surpriseTopic);
    setBoostedSuggestions([]);
    setCurrentStep(1);
    onGenerate(surpriseTopic, categoryFilter, activeBackgroundDesc, false);
  };

  const handleAutoBoostIdea = async () => {
    setIsBoosting(true);
    const localBoosts = boostUserIdeaOptions(themeInput, categoryFilter);
    setBoostedSuggestions(localBoosts);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("/api/boost-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: themeInput || "Look-Transforming 4-Piece Meesho Styling",
          category: categoryFilter,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.boostedIdeas) && data.boostedIdeas.length > 0) {
          setBoostedSuggestions(data.boostedIdeas);
        }
      }
    } catch {
      // Keep local boosts
    } finally {
      setIsBoosting(false);
    }
  };

  const handleBgChange = (bgId: string) => {
    setSelectedBgId(bgId);
    const found = BACKGROUND_PRESETS.find((b) => b.id === bgId);
    if (found) {
      onUpdatePromptsBackground(found.description);
    }
  };

  const handleDownloadReelPdf = () => {
    downloadReelPackAsPDF({
      ...result,
      prompts: dynamicPrompts,
      reelPack: safeReelPack,
    });
    setPdfToast("✓ Downloaded Complete Reel & Look-Transformation PDF (.pdf)!");
    setTimeout(() => setPdfToast(null), 4000);
  };

  const fullReelPackText = [
    `2026 VIRAL LOOK-TRANSFORMATION CONCEPT: ${result.concept.title}`,
    result.concept.liveDailyTrendTag
      ? `LIVE DAILY RADAR: ${result.concept.liveDailyTrendTag}`
      : ``,
    `WHY IT GOES VIRAL: ${result.concept.whyItTriggersSharesAndSaves}`,
    result.concept.lookTransformationFormula
      ? [
          ``,
          `--- COMPLETE 4-PIECE LOOK-TRANSFORMATION FORMULA ---`,
          `Before vs After: ${result.concept.lookTransformationFormula.beforeVsAfterLook}`,
          `How All 4 Pieces Combine: ${result.concept.lookTransformationFormula.howToCombineAllFourPieces}`,
          ...result.concept.lookTransformationFormula.threeWaysToRestyleCombo.map(
            (w, i) => `Restyle Way ${i + 1}: ${w}`
          ),
        ].join("\n")
      : ``,
    ``,
    `--- ZERO-UPLOAD AI PROMPT TO SEE COMPLETE STYLED OUTFIT FIRST ---`,
    dynamicPrompts.exactOutfitLookPreviewPrompt,
    ``,
    `--- 4 EXACT WISHLIST-READY MEESHO CATALOG SEARCH TERMS ---`,
    ...result.searchTerms.map(
      (s, i) =>
        `${i + 1}. ${s.itemLabel}: "${s.exactKeyword}" (${s.priceFilter})${
          s.howToCombineAndStyle ? `\n   Style Tip: ${s.howToCombineAndStyle}` : ""
        }${
          Array.isArray(s.backupSearchKeywords) && s.backupSearchKeywords.length > 0
            ? `\n   Backup Searches: ${s.backupSearchKeywords.join(" | ")}`
            : ""
        }`
    ),
    ``,
    `--- 3 PSYCHOLOGICAL ON-SCREEN HOOKS (HUMAN TONE) ---`,
    ...safeReelPack.onScreenHooks.map((h, i) => `${i + 1}. ${h}`),
    ``,
    `--- SIMPLE ENGLISH AUTO-DM CAPTION (Trigger: ${safeReelPack.autoDmTriggerWord}) ---`,
    safeReelPack.hinglishCaption,
    ``,
    `--- INSTAGRAM SEO KEYWORDS ---`,
    safeReelPack.seoKeywords.join(", "),
    ``,
    `--- 5 TRENDING HASHTAGS (2026 MAX 5 RULE) ---`,
    fiveHashtags.join(" "),
  ]
    .filter(Boolean)
    .join("\n");

  const allSearchTermsText = result.searchTerms
    .map(
      (s, i) =>
        `${i + 1}. [${s.platform}] ${s.itemLabel}:\n   Exact Meesho Search: "${
          s.exactKeyword
        }" (${s.priceFilter})\n   Backup Searches: ${(
          s.backupSearchKeywords || []
        ).join(" | ")}\n   How to Style: ${
          s.howToCombineAndStyle || ""
        }\n   Review Check: ${s.fabricAndFitCheck}`
    )
    .join("\n\n");

  const quickSeedPool =
    categoryFilter === "All"
      ? CURATED_REEL_IDEA_BANK.slice(0, 6)
      : CURATED_REEL_IDEA_BANK.filter(
          (item) => item.category === categoryFilter
        ).slice(0, 6);

  return (
    <div className="space-y-6">
      {pdfToast && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-100 text-sm font-bold flex items-center justify-between shadow-lg">
          <span>{pdfToast}</span>
          <button
            type="button"
            onClick={() => setPdfToast(null)}
            className="text-xs text-emerald-300 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP GENERATOR CARD — SIMPLE & CLEAN */}
      <section className="p-6 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-pink-400">
              TAB 1 · 2026 Mastermind Look-Transformation & Meesho Wishlist AI Engine
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white font-editorial">
              Generate Unique 4-Piece Outfit Combos, Visual Preview Prompts & Viral Hooks
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleSave}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? "bg-pink-600/25 border-pink-400 text-pink-100"
                  : "bg-[#221638] hover:bg-[#2D1E4A] border-pink-500/25 text-pink-100"
              }`}
            >
              <Bookmark
                className="w-4 h-4"
                fill={isSaved ? "currentColor" : "none"}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReelPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-600 text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <CopyButton
              text={fullReelPackText}
              label="Copy All 4 Steps"
              variant="primary"
            />
          </div>
        </div>

        {/* LIVE REAL-TIME DAY-BY-DAY STYLING RADAR BANNER */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#221138] via-[#1C1030] to-[#281236] border border-pink-400/35 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-pink-300">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>
                LIVE DAILY STYLING RADAR ({liveDailyContext.formattedDate} · Auto-Trained Day #{liveDailyContext.dayOfYear})
              </span>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-400/40 text-emerald-300">
              ● Real-Time Algorithm & Meesho Catalog Sync Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-pink-100/90 leading-relaxed">
            <strong className="text-white">Today's Look-Transformation Focus:</strong>{" "}
            {liveDailyContext.todaysStylingFocus}
          </p>
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-pink-300/90">
              Click Any of Today's 4 Rotating Mix-&-Match Look-Transformations to Generate Instantly:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {liveDailyContext.todaysFourLiveCombos.map((combo) => (
                <button
                  key={combo.id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    const topic = `${combo.comboName} — ${combo.simpleVibeSummary}`;
                    setThemeInput(topic);
                    setCurrentStep(1);
                    onGenerate(topic, categoryFilter, activeBackgroundDesc, true);
                  }}
                  className="p-2.5 rounded-xl bg-[#11091D] hover:bg-pink-600/25 border border-pink-500/30 text-left transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      ✨ {combo.comboName}
                    </div>
                    <div className="text-[11px] text-pink-200/75 truncate">
                      {combo.simpleVibeSummary}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-pink-400 shrink-0">
                    Style Now →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-pink-300/80 mr-1">
            Viral Style:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? "bg-pink-600 border-pink-400 text-white"
                  : "bg-[#0D0816] border-pink-500/20 text-pink-200/80 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Simple Input + 4 Clear Action Buttons */}
        <form onSubmit={handleGenerateSubmit} className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-2.5">
            <input
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="Type any look or piece (e.g. Short Kurti + Bootcut Jeans, Korean Crop Shirt Combo, 5'0 Height Hack, Date Night Look)..."
              className="flex-1 px-4 py-3.5 text-base bg-[#0B0711] border border-pink-500/40 rounded-xl text-white placeholder:text-pink-200/40 focus:outline-none focus:border-pink-400"
            />

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-3.5 text-sm font-bold bg-pink-600 hover:bg-pink-500 disabled:opacity-60 text-white rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Wand2
                  className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                />
                <span>
                  {isGenerating ? "AI Styling..." : "Generate Unique Combo"}
                </span>
              </button>

              <button
                type="button"
                disabled={isBoosting || isGenerating}
                onClick={handleAutoBoostIdea}
                className="px-4 py-3.5 text-sm font-bold bg-[#271745] hover:bg-[#351F5E] text-pink-100 border border-pink-400/35 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{isBoosting ? "Boosting..." : "Auto-Boost Combo"}</span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleSurpriseMe}
                className="px-4 py-3.5 text-sm font-bold bg-purple-700 hover:bg-purple-600 text-white rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                <span>Surprise Me</span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleRetryClick}
                className="px-4 py-3.5 text-sm font-bold bg-[#1F1433] hover:bg-[#2C1D47] text-pink-200 border border-pink-500/25 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                />
                <span>New Combo</span>
              </button>
            </div>
          </div>
        </form>

        {/* Auto-Boosted Options */}
        {boostedSuggestions.length > 0 && (
          <div className="p-4 rounded-xl bg-[#1F1235] border border-pink-400/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300">
                Click any AI-Boosted Look-Transformation Idea below to generate it right now:
              </span>
              <button
                type="button"
                onClick={() => setBoostedSuggestions([])}
                className="text-xs text-pink-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {boostedSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setThemeInput(suggestion);
                    setBoostedSuggestions([]);
                    setCurrentStep(1);
                    onGenerate(
                      suggestion,
                      categoryFilter,
                      activeBackgroundDesc,
                      true
                    );
                  }}
                  className="p-3 text-left text-xs md:text-sm font-semibold bg-[#120A20] hover:bg-pink-600/30 text-white border border-pink-500/30 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{suggestion}</span>
                  <span className="text-xs font-bold text-pink-400 shrink-0">
                    Generate →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick 1-Click Playbook Concept Chips */}
        <div className="pt-2 border-t border-pink-500/15 space-y-1.5">
          <div className="text-[11px] font-semibold text-pink-300/75">
            Or Click Any Viral Playbook Concept to Generate a 4-Piece Styling Combo:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickSeedPool.map((seed) => (
              <button
                key={seed.id}
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setThemeInput(seed.title);
                  setCurrentStep(1);
                  onGenerate(
                    seed.title,
                    seed.category,
                    activeBackgroundDesc,
                    false
                  );
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0D0816] hover:bg-pink-500/20 border border-pink-500/25 text-xs text-pink-100 transition-colors cursor-pointer"
              >
                {seed.title}
              </button>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <span className="text-emerald-300 font-mono-tabular font-semibold">
            ✓ Combo #{generationCount} · {lastUpdatedMsg} (
            {result.providerUsed || "2026 Look-Transformer AI"})
          </span>
          <span className="text-pink-200/70">
            Active Combination:{" "}
            <strong className="text-white">{result.concept.title}</strong>
          </span>
        </div>
      </section>

      {/* LOADING OVERLAY WHEN GENERATING */}
      {isGenerating && (
        <div className="p-10 rounded-2xl bg-[#160F24] border border-pink-500/40 text-center space-y-3">
          <Wand2 className="w-8 h-8 text-pink-400 animate-spin mx-auto" />
          <div className="text-lg font-bold text-white">
            AI Mastermind Is Building Your 4-Piece Look-Transformation Combo...
          </div>
          <p className="text-sm text-pink-200/80">
            Combining Top + Bottom + Layer + Accessories with Exact Look-Preview AI Prompts, Wishlist Keywords & Human Viral Hooks...
          </p>
        </div>
      )}

      {/* 5-STEP WIZARD BAR — SHOWS ONLY 1 CLEAN STEP AT A TIME! */}
      {!isGenerating && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
            {[
              {
                step: 1 as const,
                title: "Step 1: Look Plan & AI Preview",
                sub: "4-Piece Styling + See Exact Look",
              },
              {
                step: 2 as const,
                title: "Step 2: 4 Meesho Wishlist Searches",
                sub: "Exact Names + Similar Item Fixer",
              },
              {
                step: 5 as const,
                title: "✨ Similar Mila? AI Stylist Chat",
                sub: "Upload Photos/Colors → 100x Look",
              },
              {
                step: 3 as const,
                title: "Step 3: AI Image & Video Prompts",
                sub: "Look-Preview + Handheld + Motion",
              },
              {
                step: 4 as const,
                title: "Step 4: Viral Hooks & 5 Hashtags",
                sub: "100% Human Psychology (Zero Slop)",
              },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`p-3.5 md:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  currentStep === item.step
                    ? item.step === 5
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 border-amber-300 text-white shadow-lg"
                      : "bg-pink-600 border-pink-400 text-white shadow-lg"
                    : item.step === 5
                    ? "bg-[#24123E] hover:bg-[#311854] border-amber-400/45 text-amber-200"
                    : "bg-[#160F24] hover:bg-[#211636] border-pink-500/20 text-pink-200"
                }`}
              >
                <div className="text-sm md:text-base font-bold">
                  {item.title}
                </div>
                <div className="text-xs opacity-85 mt-0.5">{item.sub}</div>
              </button>
            ))}
          </div>

          {/* STEP 1 VIEW ONLY */}
          {currentStep === 1 && (
            <section className="p-6 md:p-8 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-pink-500/15 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-pink-400">
                      STEP 1 OF 4 · UNIQUE 4-PIECE LOOK-TRANSFORMATION CONCEPT
                    </span>
                    {result.concept.liveDailyTrendTag && (
                      <span className="px-2.5 py-0.5 rounded-md bg-pink-500/20 border border-pink-400/30 text-[11px] font-bold text-pink-200">
                        {result.concept.liveDailyTrendTag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-snug">
                    {result.concept.title}
                  </h3>
                </div>
                <CopyButton
                  text={`${result.concept.title}\n\nCuriosity Angle: ${
                    result.concept.curiosityIdentityAngle
                  }\nFirst 2s Visual: ${
                    result.concept.firstTwoSecondVisual
                  }\nWhy It Triggers Shares: ${
                    result.concept.whyItTriggersSharesAndSaves
                  }${
                    result.concept.lookTransformationFormula
                      ? `\n\nBefore vs After Look: ${result.concept.lookTransformationFormula.beforeVsAfterLook}\nHow All 4 Pieces Combine: ${result.concept.lookTransformationFormula.howToCombineAllFourPieces}`
                      : ""
                  }`}
                  label="Copy Step 1"
                  variant="primary"
                />
              </div>

              {/* COMPLETE 4-PIECE LOOK-TRANSFORMATION STYLING FORMULA */}
              {result.concept.lookTransformationFormula && (
                <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#23123A] to-[#140B23] border border-pink-400/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-pink-400 shrink-0" />
                      <h4 className="text-base md:text-lg font-bold text-white">
                        Complete 4-Piece Styling Formula (Hinglish Mein — Aapko Samajhne Ke Liye ki Kaise Style Karna Hai)
                      </h4>
                    </div>
                    <CopyButton
                      text={`Before vs After Look: ${
                        result.concept.lookTransformationFormula.beforeVsAfterLook
                      }\n\nHow All 4 Pieces Work Together: ${
                        result.concept.lookTransformationFormula
                          .howToCombineAllFourPieces
                      }\n\n3 Ways to Restyle This Combo:\n${(
                        result.concept.lookTransformationFormula
                          .threeWaysToRestyleCombo || []
                      )
                        .map((w, i) => `${i + 1}. ${w}`)
                        .join("\n")}`}
                      label="Copy Styling Formula"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-1.5">
                      <div className="text-xs font-bold text-pink-400 uppercase">
                        Pehle vs Ab (Ye Look Kaise Badlega — Hinglish Guide)
                      </div>
                      <p className="text-sm md:text-base text-white leading-relaxed">
                        {
                          result.concept.lookTransformationFormula
                            .beforeVsAfterLook
                        }
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-400 uppercase">
                        Charon Kapdon Ko Ek Saath Kaise Pehne & Combine Karein (Hinglish Guide)
                      </div>
                      <p className="text-sm md:text-base text-white leading-relaxed">
                        {
                          result.concept.lookTransformationFormula
                            .howToCombineAllFourPieces
                        }
                      </p>
                    </div>
                  </div>

                  {/* LAKHO MEIN EK (TOP 0.01% CREATOR DIFFERENCE) CALLOUT */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#1A0E2E] to-pink-950/50 border border-amber-400/40 space-y-1.5">
                    <div className="text-xs font-bold text-amber-300 uppercase">
                      🏆 "Lakho Mein Ek" Secret (2026–2027 Top 0.01% Formula — Hinglish Guide)
                    </div>
                    <p className="text-xs md:text-sm text-amber-50/95 leading-relaxed">
                      Instagram par lakho creators sirf normal kurti dikhate hain. Aapki Reel un sabse alag (Lakho Mein Ek) isliye lagegi kyunki aap <strong>(1) Exact-Inch 30:70 Body-Proportion Math</strong> (19-inch Short Top + 39-inch High-Waist Bottom), <strong>(2) Secret 3rd Piece Waist/Tummy Illusion</strong>, aur <strong>(3) 3.0s par 1-Second Real Customer Review Photo Proof</strong> dikha rahi ho—jisse ladkiyan turant Save karti hain aur aankh band karke "LINK" comment karti hain!
                    </p>
                  </div>

                  {Array.isArray(
                    result.concept.lookTransformationFormula
                      .threeWaysToRestyleCombo
                  ) &&
                    result.concept.lookTransformationFormula
                      .threeWaysToRestyleCombo.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-pink-300 uppercase">
                          Inhi 4 Kapdon Ko 3 Alag Tarike Se Kaise Style Karein (Hinglish Guide):
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {result.concept.lookTransformationFormula.threeWaysToRestyleCombo.map(
                            (way, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-[#0D0816] border border-pink-500/20 text-sm text-pink-50 leading-relaxed"
                              >
                                <span className="text-xs font-bold text-pink-400 block mb-1">
                                  STYLE VARIATION 0{idx + 1}
                                </span>
                                {way}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* NEW: INSTANT ZERO-UPLOAD COMPLETE OUTFIT LOOK-PREVIEW PROMPT BOX */}
                  <div className="p-4 md:p-5 rounded-xl bg-[#0E071B] border-2 border-emerald-400/45 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span>
                            Pehle Dekho Ye Outfit Dikhne Mein Kaisa Lagega! (100% Pure English AI Prompt — Ready to Copy)
                          </span>
                        </div>
                        <p className="text-xs text-pink-100/85">
                          Is English prompt ko copy karke ChatGPT ya Gemini mein bhejo (koi photo upload nahi karni!). AI aapko poora outfit pehna kar + charon kapde white background par alag-alag dikha dega taaki aap exact look dekh sako aur Meesho mein aasani se dhund sako!
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <CopyButton
                          text={dynamicPrompts.exactOutfitLookPreviewPrompt}
                          label="Copy 2-Panel Look + Catalog Prompt"
                          variant="primary"
                        />
                        <CopyButton
                          text={dynamicPrompts.fullBodyStyledTryOnPrompt}
                          label="Copy Full-Body Wearing Prompt"
                        />
                      </div>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-[#07040C] border border-pink-500/20 text-xs text-pink-50 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {dynamicPrompts.exactOutfitLookPreviewPrompt}
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-2">
                  <div className="text-xs font-bold text-pink-400">
                    1. Ye Combination Kyu Khaas Hai (Hinglish)
                  </div>
                  <p className="text-base text-white leading-relaxed">
                    {result.concept.curiosityIdentityAngle}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-2">
                  <div className="text-xs font-bold text-pink-400">
                    2. Pehle 2 Second Mein Kya Dikhana Hai (Hinglish)
                  </div>
                  <p className="text-base text-white leading-relaxed">
                    {result.concept.firstTwoSecondVisual}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-2">
                  <div className="text-xs font-bold text-pink-400">
                    3. Ladkiyan Save & Share Kyu Karengi (Hinglish)
                  </div>
                  <p className="text-base text-white leading-relaxed">
                    {result.concept.whyItTriggersSharesAndSaves}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold text-pink-200">
                  6-Second Reel Plan (Kya Shoot Karna Hai = Hinglish Mein | Video Ke Upar Kya Likhna Hai = 100% Pure English Mein):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.concept.shotByShotPlan.map((shot, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-2"
                    >
                      <div className="text-xs font-mono-tabular font-bold text-pink-400">
                        CLIP {idx + 1} ({shot.timeRange}) · Kya Dikhana Hai (Hinglish):
                      </div>
                      <p className="text-sm md:text-base text-pink-50 leading-relaxed">
                        {shot.visualAction}
                      </p>
                      <div className="p-3 rounded-lg bg-[#1A102B] border border-pink-500/25 text-sm font-bold text-white flex items-center justify-between gap-2">
                        <span>English On-Screen Text: "{shot.onScreenText}"</span>
                        <CopyButton text={shot.onScreenText} label="Copy" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-pink-500/15 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3.5 text-sm font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Step 2: 4 Meesho Wishlist Searches</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 VIEW ONLY */}
          {currentStep === 2 && (
            <section className="p-6 md:p-8 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-pink-400">
                    STEP 2 OF 4 · 4 EXACT MEESHO WISHLIST SEARCH KEYWORDS + VISUAL OUTFIT PREVIEW
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    See Your Complete Outfit Look First & Search the Exact Pieces on Meesho
                  </h3>
                  <p className="text-xs md:text-sm text-pink-200/80">
                    Neeche har Piece ka <strong>Search Keyword 100% Pure English</strong> mein hai taaki Meesho par turant kapde mil jayein, aur <strong>Styling Tip Hinglish</strong> mein hai taaki aapko samajhne mein aasani ho!
                  </p>
                </div>
                <CopyButton
                  text={allSearchTermsText}
                  label="Copy All 4 Searches"
                  variant="primary"
                />
              </div>

              {/* STEP 2A: VISUALIZE COMPLETE OUTFIT FIRST TO SPOT THE RIGHT CLOTHES ON MEESHO */}
              <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#1D1033] to-[#27123B] border border-emerald-400/45 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>
                        PRO TRICK: MEESHO MEIN DHUNDNE SE PEHLE AI SE PURA LOOK BANWA KAR DEKHO!
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-pink-100/90 leading-relaxed">
                      Ye 100% English prompt copy karke <strong>ChatGPT ya Gemini</strong> ko bhejo. AI aapko exact kapde pehna kar pura styled look dikha dega + charon kapde white background par alag se bana dega jise crop karke aap <strong>Meesho Camera Image Search</strong> se turant dhund sakti ho!
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <CopyButton
                      text={dynamicPrompts.exactOutfitLookPreviewPrompt}
                      label="Copy Complete Outfit Visual Prompt"
                      variant="primary"
                    />
                    <CopyButton
                      text={dynamicPrompts.fullBodyStyledTryOnPrompt}
                      label="Copy Full-Body Wearing Prompt"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.searchTerms.map((item, idx) => {
                  const meeshoUrl = `https://www.meesho.com/search?q=${encodeURIComponent(
                    item.exactKeyword
                  )}`;
                  const myntraUrl = `https://www.myntra.com/${encodeURIComponent(
                    item.exactKeyword.toLowerCase().replace(/\s+/g, "-")
                  )}`;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono-tabular font-bold text-pink-400">
                            PIECE {idx + 1} OF 4 · {item.priceFilter}
                          </span>
                          <CopyButton
                            text={item.exactKeyword}
                            label="Copy Exact Name"
                            variant="primary"
                          />
                        </div>
                        <div className="text-sm font-bold text-pink-100">
                          {item.itemLabel}
                        </div>

                        {/* Exact Primary Meesho Catalog Search Box */}
                        <div className="p-3.5 rounded-xl bg-[#181028] border border-pink-500/40 font-mono text-sm md:text-base text-white select-all flex items-center gap-2.5">
                          <Search className="w-4 h-4 text-pink-400 shrink-0" />
                          <span>{item.exactKeyword}</span>
                        </div>

                        {/* Backup Meesho Catalog Searches */}
                        {Array.isArray(item.backupSearchKeywords) &&
                          item.backupSearchKeywords.length > 0 && (
                            <div className="p-3 rounded-xl bg-[#130C20] border border-pink-500/20 space-y-2">
                              <div className="text-[11px] font-bold text-pink-300">
                                Backup Meesho Catalog Searches (Click to Copy or Open):
                              </div>
                              <div className="space-y-1.5">
                                {item.backupSearchKeywords.map((bkw, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-[#090510] border border-pink-500/15 text-xs text-pink-100"
                                  >
                                    <span className="font-mono select-all">
                                      "{bkw}"
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <CopyButton text={bkw} label="Copy" />
                                      <a
                                        href={`https://www.meesho.com/search?q=${encodeURIComponent(
                                          bkw
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 rounded bg-pink-600/30 hover:bg-pink-600 text-white text-[11px] font-bold transition-colors"
                                      >
                                        Meesho ↗
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* How to Combine & Style This Piece */}
                        {item.howToCombineAndStyle && (
                          <div className="p-3 rounded-xl bg-[#1B102E] border border-pink-400/25 text-xs md:text-sm text-pink-100 leading-relaxed">
                            <strong className="text-pink-300">
                              ✨ Isko Kaise Style Karein (Hinglish Tip):
                            </strong>{" "}
                            {item.howToCombineAndStyle}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs md:text-sm text-pink-100/90 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-pink-200">
                              Meesho Review Mein Kya Check Karein (Hinglish):
                            </strong>{" "}
                            {item.fabricAndFitCheck}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pink-500/15">
                          <a
                            href={meeshoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>Search & Wishlist on Meesho</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={myntraUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>Search on Myntra</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EMBEDDED 100x ROYAL GLOW-UP & SIMILAR-ITEM AI STYLIST CHAT RIGHT INSIDE STEP 2 */}
              <div className="pt-2">
                <SimilarItemStylistChat
                  currentReel={result}
                  activeBackgroundDesc={activeBackgroundDesc}
                  onApplyUpdatedReel={(updatedReel, jumpStep) => {
                    onUpdateReelResult(updatedReel);
                    if (jumpStep) {
                      setCurrentStep(jumpStep);
                    }
                  }}
                />
              </div>

              <div className="pt-4 border-t border-pink-500/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 text-sm font-bold bg-[#221638] hover:bg-[#2E1E4C] text-pink-100 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3.5 text-sm font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Step 3: Copy AI Prompts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 5 VIEW ONLY — FULL-SCREEN DEDICATED SIMILAR-ITEM & PHOTO AI STYLIST CHAT */}
          {currentStep === 5 && (
            <section className="space-y-4">
              <SimilarItemStylistChat
                currentReel={result}
                activeBackgroundDesc={activeBackgroundDesc}
                onApplyUpdatedReel={(updatedReel, jumpStep) => {
                  onUpdateReelResult(updatedReel);
                  if (jumpStep) {
                    setCurrentStep(jumpStep);
                  }
                }}
              />
            </section>
          )}

          {/* STEP 3 VIEW ONLY */}
          {currentStep === 3 && (
            <section className="p-6 md:p-8 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6">
              <div className="space-y-1 border-b border-pink-500/15 pb-4">
                <span className="text-xs font-bold text-pink-400">
                  STEP 3 OF 4 · ZERO-UPLOAD OUTFIT LOOK-PREVIEW PROMPT + ADITYA KNIGHT REEL PROMPTS
                </span>
                <h3 className="text-2xl font-bold text-white">
                  First See Your Exact Styled Outfit With AI, Then Create Your Handheld & Mirror Reel
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-2.5">
                <label className="text-sm font-bold text-pink-200 block">
                  Choose Your Room Background Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {BACKGROUND_PRESETS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleBgChange(bg.id)}
                      className={`p-3 text-left rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        selectedBgId === bg.id
                          ? "bg-pink-600 border-pink-400 text-white"
                          : "bg-[#160F26] border-pink-500/15 text-pink-200 hover:text-white"
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setActivePromptTab("preview")}
                  className={`p-3.5 text-xs md:text-sm font-bold rounded-xl border transition-colors cursor-pointer text-left ${
                    activePromptTab === "preview"
                      ? "bg-emerald-600 border-emerald-400 text-white shadow-lg"
                      : "bg-[#0D0816] border-emerald-500/35 text-emerald-300 hover:text-white"
                  }`}
                >
                  ★ 0. See Exact Outfit Look First (No Screenshot Needed!)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab("bundle")}
                  className={`p-3.5 text-xs md:text-sm font-bold rounded-xl border transition-colors cursor-pointer text-left ${
                    activePromptTab === "bundle"
                      ? "bg-pink-600 border-pink-400 text-white"
                      : "bg-[#0D0816] border-pink-500/20 text-pink-200 hover:text-white"
                  }`}
                >
                  1. Handheld Bundle Prompt (With Screenshots)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab("mirror")}
                  className={`p-3.5 text-xs md:text-sm font-bold rounded-xl border transition-colors cursor-pointer text-left ${
                    activePromptTab === "mirror"
                      ? "bg-pink-600 border-pink-400 text-white"
                      : "bg-[#0D0816] border-pink-500/20 text-pink-200 hover:text-white"
                  }`}
                >
                  2. Faceless Mirror Model Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab("motion")}
                  className={`p-3.5 text-xs md:text-sm font-bold rounded-xl border transition-colors cursor-pointer text-left ${
                    activePromptTab === "motion"
                      ? "bg-pink-600 border-pink-400 text-white"
                      : "bg-[#0D0816] border-pink-500/20 text-pink-200 hover:text-white"
                  }`}
                >
                  3. 4K Video Motion (Flow AI / Kling)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab("single")}
                  className={`p-3.5 text-xs md:text-sm font-bold rounded-xl border transition-colors cursor-pointer text-left ${
                    activePromptTab === "single"
                      ? "bg-pink-600 border-pink-400 text-white"
                      : "bg-[#0D0816] border-pink-500/20 text-pink-200 hover:text-white"
                  }`}
                >
                  4. Single Item Replacement
                </button>
              </div>

              {activePromptTab === "preview" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#0D0816] border-2 border-emerald-400/45 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase">
                          PROMPT 0A · ZERO-UPLOAD 2-PANEL COMPLETE STYLED OUTFIT + MEESHO CAMERA SEARCH BOARD
                        </span>
                        <h4 className="text-base md:text-lg font-bold text-white mt-0.5">
                          See How the Exact 4 Clothes Look Worn Together + Individual White-Background Cutouts
                        </h4>
                        <p className="text-xs md:text-sm text-pink-200/80">
                          Paste this directly into ChatGPT, Gemini, or Bing Image Creator (NO screenshots needed!). Left side shows an Indian girl wearing all 4 pieces styled together; Right side shows the 4 separate pieces on a white background so you can crop and search them on Meesho!
                        </p>
                      </div>
                      <CopyButton
                        text={dynamicPrompts.exactOutfitLookPreviewPrompt}
                        label="Copy Prompt 0A (2-Panel Lookbook)"
                        variant="primary"
                      />
                    </div>
                    <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {dynamicPrompts.exactOutfitLookPreviewPrompt}
                    </pre>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-pink-400 uppercase">
                          PROMPT 0B · FULL-BODY HEAD-TO-TOE STYLED OUTFIT PREVIEW (NO SCREENSHOT NEEDED)
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          Single Full-Screen 4K Photo of the Complete Styled Outfit Worn Head-to-Toe
                        </h4>
                      </div>
                      <CopyButton
                        text={dynamicPrompts.fullBodyStyledTryOnPrompt}
                        label="Copy Prompt 0B (Full-Body Look)"
                        variant="primary"
                      />
                    </div>
                    <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                      {dynamicPrompts.fullBodyStyledTryOnPrompt}
                    </pre>
                  </div>
                </div>
              )}

              {activePromptTab === "bundle" && (
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        PROMPT 1: Realistic Handheld Hanging Bundle (Use in
                        ChatGPT / Gemini After Taking Meesho Screenshots)
                      </h4>
                      <p className="text-sm text-pink-200/80">
                        Upload Reference Hand Photo + Your 4 Meesho Outfit
                        Screenshots, then paste this:
                      </p>
                    </div>
                    <CopyButton
                      text={dynamicPrompts.adityaKnightHandheldBundlePrompt}
                      label="Copy Prompt 1"
                      variant="primary"
                    />
                  </div>
                  <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {dynamicPrompts.adityaKnightHandheldBundlePrompt}
                  </pre>
                </div>
              )}

              {activePromptTab === "mirror" && (
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        PROMPT 5: "Avatar Ko Outfit Pehnao" (Faceless iPhone
                        Mirror Model)
                      </h4>
                      <p className="text-sm text-pink-200/80">
                        Upload Image 1 = Room Background ONLY + Image 2 onward =
                        Meesho Outfit Screenshots:
                      </p>
                    </div>
                    <CopyButton
                      text={dynamicPrompts.facelessMirrorAvatarPrompt}
                      label="Copy Prompt 5"
                      variant="primary"
                    />
                  </div>
                  <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {dynamicPrompts.facelessMirrorAvatarPrompt}
                  </pre>
                </div>
              )}

              {activePromptTab === "motion" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white">
                        PROMPT 6A · Handheld Bundle Video Motion
                      </h4>
                      <CopyButton
                        text={
                          dynamicPrompts.ugcVideoMotionPrompts
                            .handheldClothesMotion
                        }
                        label="Copy Motion"
                        variant="primary"
                      />
                    </div>
                    <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed">
                      {
                        dynamicPrompts.ugcVideoMotionPrompts
                          .handheldClothesMotion
                      }
                    </pre>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-white">
                        PROMPT 6B · Mirror Model Video Motion
                      </h4>
                      <CopyButton
                        text={
                          dynamicPrompts.ugcVideoMotionPrompts
                            .mirrorAvatarMotion
                        }
                        label="Copy Motion"
                        variant="primary"
                      />
                    </div>
                    <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/15 text-sm text-pink-50 font-mono whitespace-pre-wrap leading-relaxed">
                      {dynamicPrompts.ugcVideoMotionPrompts.mirrorAvatarMotion}
                    </pre>
                  </div>
                </div>
              )}

              {activePromptTab === "single" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300">
                        Top Only Prompt
                      </span>
                      <CopyButton
                        text={
                          dynamicPrompts.singleItemReplacementPrompts
                            .topReplacement
                        }
                        label="Copy"
                      />
                    </div>
                    <p className="text-sm text-pink-100 font-mono leading-relaxed">
                      {
                        dynamicPrompts.singleItemReplacementPrompts
                          .topReplacement
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300">
                        Pant Only Prompt
                      </span>
                      <CopyButton
                        text={
                          dynamicPrompts.singleItemReplacementPrompts
                            .pantReplacement
                        }
                        label="Copy"
                      />
                    </div>
                    <p className="text-sm text-pink-100 font-mono leading-relaxed">
                      {
                        dynamicPrompts.singleItemReplacementPrompts
                          .pantReplacement
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300">
                        Bag / Shoes Prompt
                      </span>
                      <CopyButton
                        text={
                          dynamicPrompts.singleItemReplacementPrompts
                            .accessoryHandPrompt
                        }
                        label="Copy"
                      />
                    </div>
                    <p className="text-sm text-pink-100 font-mono leading-relaxed">
                      {
                        dynamicPrompts.singleItemReplacementPrompts
                          .accessoryHandPrompt
                      }
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-pink-500/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 text-sm font-bold bg-[#221638] hover:bg-[#2E1E4C] text-pink-100 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3.5 text-sm font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Step 4: Hooks, Caption & 5 Hashtags</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 4 VIEW ONLY */}
          {currentStep === 4 && (
            <section className="p-6 md:p-8 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-pink-400">
                    STEP 4 OF 4 · 2026 ALGORITHM-TRIGGERING HUMAN HOOKS, AUTO-DM CAPTION & 5 REAL HASHTAGS
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    100% Human-Toned Psychological Hooks + High-Volume Buyer Hashtags (Zero Commercial AI Slop)
                  </h3>
                </div>
                <CopyButton
                  text={`${safeReelPack.hinglishCaption}\n\nKeywords: ${safeReelPack.seoKeywords.join(
                    ", "
                  )}\n\n${fiveHashtags.join(" ")}`}
                  label="Copy Complete Post Pack"
                  variant="primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-pink-200">
                    3 Psychological On-Screen Hooks (Human Creator Tone · Triggers 3s Hold, Save & Bestie Share):
                  </h4>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 rounded-md">
                    ✓ Anti-AI-Slop Psychology Filter Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {safeReelPack.onScreenHooks.map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono-tabular font-bold text-pink-400 block">
                          {HOOK_PSYCHOLOGY_LABELS[idx] || `HOOK 0${idx + 1}`}
                        </span>
                        <p className="text-base font-bold text-white leading-snug">
                          "{hook}"
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <CopyButton text={hook} label="Copy Hook" variant="primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-300">
                      Human-Toned Auto-DM Caption (Trigger Word: "
                      {safeReelPack.autoDmTriggerWord}")
                    </span>
                    <CopyButton
                      text={safeReelPack.hinglishCaption}
                      label="Copy Caption"
                      variant="primary"
                    />
                  </div>
                  <pre className="p-4 rounded-xl bg-[#08050D] border border-pink-500/10 text-base text-pink-50 font-sans whitespace-pre-wrap leading-relaxed">
                    {safeReelPack.hinglishCaption}
                  </pre>
                </div>

                <div className="space-y-4">
                  {/* Strictly 5 Real High-Volume Hashtags per 2026 Instagram Rule */}
                  <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-pink-300">
                        5 Real High-Volume Buyer Hashtags (2026 Max-5 Rule)
                      </span>
                      <CopyButton
                        text={fiveHashtags.join(" ")}
                        label="Copy 5 Hashtags"
                        variant="primary"
                      />
                    </div>
                    <p className="text-base text-pink-200 font-mono font-bold leading-relaxed">
                      {fiveHashtags.join("  ")}
                    </p>
                    <p className="text-xs text-pink-200/70">
                      2026 Algorithm Rule: Zero fake invented hashtags! Uses strictly 5 lowercase, high-search-volume Indian fashion & Meesho buyer-intent tags.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0D0816] border border-pink-500/25 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-pink-300">
                        2026 Instagram & Meesho Buyer Search SEO Keywords
                      </span>
                      <CopyButton
                        text={safeReelPack.seoKeywords.join(", ")}
                        label="Copy Keywords"
                      />
                    </div>
                    <p className="text-sm text-pink-100/90 leading-relaxed font-mono">
                      {safeReelPack.seoKeywords.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-pink-500/15 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-3 text-sm font-bold bg-[#221638] hover:bg-[#2E1E4C] text-pink-100 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 3</span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadReelPdf}
                    className="px-5 py-3.5 text-sm font-bold bg-purple-700 hover:bg-purple-600 text-white rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Reel Pack PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetryClick}
                    className="px-6 py-3.5 text-sm font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-xl inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate Another Fresh Reel Pack</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

