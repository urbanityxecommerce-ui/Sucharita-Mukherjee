import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Printer,
  Film,
  Hash,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Bookmark,
  RefreshCw,
  Wand2,
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Globe,
  X,
  Video,
  Camera,
  Flame,
  Search,
} from "lucide-react";
import {
  EbookGenerationResult,
  EbookReelSectionKey,
  HIGH_VALUE_EBOOK_PRESETS,
  EBOOK_CATEGORIES,
  boostUserIdeaOptions,
  buildAntiSlopEbookVideoPrompts,
} from "../data/playbookData";
import { regenerateEbookReelSectionLive } from "../utils/instantClientGenerator";
import { CopyButton } from "./CopyButton";
import {
  downloadEbookAsPDF,
  downloadEbookAsHtml,
  downloadEbookAsWordDoc,
} from "../utils/pdfExporter";

interface EbookGeneratorTabProps {
  result: EbookGenerationResult;
  isGenerating: boolean;
  generationCount: number;
  lastUpdatedMsg: string;
  onGenerate: (
    topicInput: string,
    priceDisplay: string,
    anchorPriceDisplay: string,
    autoDmTrigger: string,
    isRetry?: boolean,
    category?: string
  ) => void;
  onUpdateReelBlueprint?: (
    updatedBlueprint: EbookGenerationResult["reelBlueprint"]
  ) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const PRICE_PRESETS = ["₹19", "₹29", "₹49", "₹99", "₹199", "₹499", "$9"];
const ANCHOR_PRESETS = ["₹999", "₹1,999", "₹2,999", "₹4,999", "$99"];

export const EbookGeneratorTab: React.FC<EbookGeneratorTabProps> = ({
  result,
  isGenerating,
  generationCount,
  lastUpdatedMsg,
  onGenerate,
  onUpdateReelBlueprint,
  isSaved,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    result.category || "All"
  );
  const [topicInput, setTopicInput] = useState("");
  const [isPresetTopic, setIsPresetTopic] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState(result.priceDisplay || "₹19");
  const [anchorPriceDisplay, setAnchorPriceDisplay] = useState(
    result.anchorPriceDisplay || "₹1,999"
  );
  const [autoDmTrigger, setAutoDmTrigger] = useState(
    result.autoDmTrigger || "SECRET"
  );
  const [ebookThemeMode, setEbookThemeMode] = useState<"dark" | "ivory">(
    "dark"
  );
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [activeChapterTab, setActiveChapterTab] = useState<
    "all" | "overview" | 0 | 1 | 2 | 3 | 4 | "checklist"
  >("all");
  const [boostSuggestions, setBoostSuggestions] = useState<string[]>([]);
  const [downloadStatusToast, setDownloadStatusToast] = useState<string | null>(
    null
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [activePromptTab, setActivePromptTab] = useState<
    "firstFrame" | "videoMotion" | "relatableBroll"
  >("firstFrame");
  const [regeneratingSection, setRegeneratingSection] =
    useState<EbookReelSectionKey | null>(null);
  const [sectionVariationCounts, setSectionVariationCounts] = useState<
    Record<EbookReelSectionKey, number>
  >({
    all: 1,
    prompts: 1,
    videoPlan: 1,
    overlays: 1,
    caption: 1,
    tags: 1,
  });

  // Sync local inputs when result changes (e.g. loaded from History)
  useEffect(() => {
    if (result.priceDisplay) setPriceDisplay(result.priceDisplay);
    if (result.anchorPriceDisplay)
      setAnchorPriceDisplay(result.anchorPriceDisplay);
    if (result.autoDmTrigger) setAutoDmTrigger(result.autoDmTrigger);
    if (result.category) setSelectedCategory(result.category);
  }, [
    result.id,
    result.priceDisplay,
    result.anchorPriceDisplay,
    result.autoDmTrigger,
    result.category,
  ]);

  const showToast = (msg: string) => {
    setDownloadStatusToast(msg);
    setTimeout(() => {
      setDownloadStatusToast(null);
    }, 4000);
  };

  const handleTriggerGenerate = (
    isRetry = false,
    customCat?: string,
    forceRandomNewTopic = false
  ) => {
    setActiveStep(1);
    setActiveChapterTab("all");
    const catToUse = customCat ?? selectedCategory;

    // If user clicked "Surprise Me" OR clicked "Retry / Fresh Version" after selecting a preset chip, rotate to a 100% brand-new topic!
    if (forceRandomNewTopic || (isRetry && isPresetTopic)) {
      setTopicInput("");
      setIsPresetTopic(false);
      onGenerate(
        "",
        priceDisplay.trim() || "₹19",
        anchorPriceDisplay.trim() || "₹1,999",
        autoDmTrigger.trim() || "SECRET",
        true,
        catToUse
      );
      return;
    }

    onGenerate(
      topicInput.trim(),
      priceDisplay.trim() || "₹19",
      anchorPriceDisplay.trim() || "₹1,999",
      autoDmTrigger.trim() || "SECRET",
      isRetry,
      catToUse
    );
  };

  const [isBoosting, setIsBoosting] = useState(false);

  const handleBoostTopic = async () => {
    setIsBoosting(true);
    const catForBoost =
      selectedCategory === "All" ? "ebook" : selectedCategory;
    const localOptions = boostUserIdeaOptions(topicInput, catForBoost);
    setBoostSuggestions(localOptions);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 18000);
      const res = await fetch("/api/boost-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: topicInput,
          category: selectedCategory === "All" ? "High-FOMO Ebook" : selectedCategory,
          mode: "ebook",
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.boostedIdeas) && data.boostedIdeas.length > 0) {
          setBoostSuggestions(data.boostedIdeas);
        }
      }
    } catch {
      // Keep local boost suggestions
    } finally {
      setIsBoosting(false);
    }
  };

  const handleDirectPdfDownload = () => {
    downloadEbookAsPDF(result);
    showToast("✓ Downloaded 100% White-Label 12pt PDF (.pdf) to your device!");
  };

  const handleDirectWordDownload = () => {
    downloadEbookAsWordDoc(result);
    showToast("✓ Downloaded White-Label Editable Word Ebook (.doc)!");
  };

  const handleDirectHtmlDownload = () => {
    downloadEbookAsHtml(result);
    showToast("✓ Downloaded White-Label Printable HTML Ebook (.html)!");
  };

  const handlePrintOrOpenModal = () => {
    setActiveStep(1);
    setActiveChapterTab("all");
    setShowExportModal(true);
    setTimeout(() => {
      try {
        window.print();
      } catch {
        // Sandboxed iframe fallback handled by Export Modal + Direct PDF
      }
    }, 150);
  };

  const handleRegenerateReelSection = async (section: EbookReelSectionKey) => {
    if (regeneratingSection) return;
    setRegeneratingSection(section);
    const nextVariation = (sectionVariationCounts[section] || 1) + 1;
    setSectionVariationCounts((prev) => ({
      ...prev,
      [section]: nextVariation,
    }));

    try {
      const { updatedReelBlueprint } = await regenerateEbookReelSectionLive(
        result,
        section,
        nextVariation
      );
      if (onUpdateReelBlueprint) {
        onUpdateReelBlueprint(updatedReelBlueprint);
      }
      const labelMap: Record<EbookReelSectionKey, string> = {
        all: "Full Viral Reel Kit",
        prompts: "Anti-Slop AI Video & Image Prompts",
        videoPlan: "6-Second Algorithm Video Plan",
        overlays: "Psychological Reel Overlay Texts",
        caption: "Viral SEO Auto-DM Caption",
        tags: "5 Trending Hashtags & SEO Keywords",
      };
      showToast(`✓ Regenerated fresh ${labelMap[section]}!`);
    } catch {
      showToast("Could not refresh section right now. Please try again.");
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Enforce 2026 Instagram 5-Hashtag Limit & guarantee Anti-Slop AI Video Prompts even on older saved history items
  const fiveHashtags = result.reelBlueprint.hashtags.slice(0, 5);
  const resolvedAiVideoPrompts =
    result.reelBlueprint.aiVideoPrompts ||
    buildAntiSlopEbookVideoPrompts(
      result.ebook.title,
      result.ebook.chapters[0]?.title || "Step-by-Step Insider System",
      result.priceDisplay,
      result.autoDmTrigger,
      0
    );

  const filteredPresets =
    selectedCategory === "All"
      ? HIGH_VALUE_EBOOK_PRESETS
      : HIGH_VALUE_EBOOK_PRESETS.filter(
          (p) => p.category === selectedCategory
        );

  const hardestBoxText = result.ebook.hardestPartSolvedBox
    ? `\n=========================================
${result.ebook.hardestPartSolvedBox.title}
Exact Search Filters & Direct Portals:
${result.ebook.hardestPartSolvedBox.exactWhereToFindMap
  .map((item: string) => `- ${item}`)
  .join("\n")}
0-Follower Traffic & Buyer Trick: ${result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick}\n`
    : "";

  const fullEbookPlainText = `${result.ebook.editionTag}
TITLE: ${result.ebook.title}
SUBTITLE: ${result.ebook.subtitle}
PRICE ANCHOR: ${result.priceDisplay} (Normal Value: ${result.anchorPriceDisplay})

${result.ebook.goldenRuleTitle}:
${result.ebook.goldenRuleBody}
${hardestBoxText}
QUICK OVERVIEW:
${result.ebook.quickValueBreakdown
  .map((item, idx) => `${idx + 1}. ${item.metric}: ${item.detail}`)
  .join("\n")}

${result.ebook.chapters
  .map(
    (ch) => `=========================================
0${ch.chapterNumber} · ${ch.title}
${ch.subtitle ? `real talk: ${ch.subtitle.replace(/^⚠️?\s*WARNING:\s*Keep this strictly confidential\.?\s*[—–-]?\s*/i, "")}` : ""}

What Everyone Gets Wrong (vs. What Actually Works):
${ch.coreSecretSummary}

The Actual Shortcut (Zero Gatekeeping):
${ch.whereToFindOrHiddenTrick || "Use the exact search filter and link below."}

Do This Step-by-Step:
${ch.stepByStepExecution.map((s) => `${s}`).join("\n")}

Exact Links & Free Tools:
${(ch.exactToolsOrWebsites || [])
  .map((t) => `- ${t.name} (${t.role}): ${t.insiderTip}`)
  .join("\n")}

${ch.copyPasteTemplateOrScript.label}:
${ch.copyPasteTemplateOrScript.content}

Real Numbers & Why This Hits Different:
${ch.incomeMathOrProof}
`
  )
  .join("\n")}
=========================================
24-HOUR ACTION CHECKLIST:
${result.ebook.twentyFourHourChecklist.map((c) => `[ ] ${c}`).join("\n")}`;

  const allThreeAntiSlopPromptsText = `1. RAW iPHONE POV FIRST-FRAME IMAGE PROMPT (ChatGPT Image / Midjourney / Ideogram):
${resolvedAiVideoPrompts.rawPhoneFirstFramePrompt}

2. 6-SECOND ZERO-SLOP AI VIDEO MOTION PROMPT (Kling / Veo / Runway / Flow AI):
${resolvedAiVideoPrompts.zeroSlopVideoMotionPrompt}

3. RELATABLE LATE-NIGHT / CHAI POV B-ROLL PROMPT:
${resolvedAiVideoPrompts.relatablePovBrollPrompt}

ALGORITHM & ZERO-SLOP NOTE:
${resolvedAiVideoPrompts.algorithmTriggerNote}`;

  const fullTriggerReelPackText = `VIRAL EBOOK REEL STUDIO (${result.priceDisplay} PDF — "${result.ebook.title}")

=== 1. ANTI-SLOP AI VIDEO & IMAGE PROMPTS ===
${allThreeAntiSlopPromptsText}

=== 2. 6-SECOND ALGORITHM VIDEO PLAN ===
Visual Aesthetic: ${result.reelBlueprint.sixSecondVideoIdea.visualStyle}
Shot-by-Shot Plan:
${result.reelBlueprint.sixSecondVideoIdea.shotByShot
  .map((s, i) => `${i + 1}. ${s}`)
  .join("\n")}
Audio & Trial-Reel Tip: ${result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}

=== 3. PSYCHOLOGICAL REEL OVERLAY TEXTS ===
${result.reelBlueprint.psychologicalPriceOverlays
  .map((o, i) => `${i + 1}. [${o.triggerType}] "${o.overlayText}" (${o.whyItConverts})`)
  .join("\n")}

=== 4. VIRAL SEO AUTO-DM CAPTION (Trigger: "${result.autoDmTrigger}") ===
${result.reelBlueprint.autoDmCaption}

=== 5. INSTAGRAM SEARCH SEO KEYWORDS ===
${result.reelBlueprint.seoKeywords.join(", ")}

=== 6. 5 TRENDING HASHTAGS (2026 INSTAGRAM LIMIT) ===
${fiveHashtags.join(" ")}`;

  return (
    <div className="space-y-6">
      {/* Floating Download Confirmation Banner */}
      {downloadStatusToast && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-100 text-sm font-bold flex items-center justify-between shadow-lg no-print">
          <span>{downloadStatusToast}</span>
          <button
            type="button"
            onClick={() => setDownloadStatusToast(null)}
            className="text-xs text-emerald-300 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PRINT & EXPORT STUDIO MODAL (100% White-Label — Zero App Branding Inside Exported Files!) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-xl rounded-2xl bg-[#160F24] border-2 border-pink-500/50 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-pink-500/20 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  100% WHITE-LABEL 12PT EBOOK DOWNLOAD CENTER
                </span>
                <h3 className="text-xl font-bold text-white font-editorial mt-0.5">
                  Download Your {result.priceDisplay} Ebook (No App Watermark)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-pink-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-pink-100/85 leading-relaxed">
              Every exported file is <strong>100% White-Label</strong> (no "GlowCash" name anywhere inside the PDF, Word, or HTML file) so you can sell or share it directly under your own name:
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleDirectPdfDownload();
                  setShowExportModal(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-left flex items-center justify-between gap-3 cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">
                      1. Download White-Label 12pt PDF File (.pdf)
                    </div>
                    <div className="text-xs opacity-90">
                      Multi-page A4 PDF with Cover, Mastermind Map, 5 Chapters & Scripts
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-bold shrink-0">
                  Instant PDF
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDirectWordDownload();
                  setShowExportModal(false);
                }}
                className="w-full p-4 rounded-xl bg-[#0D0816] hover:bg-pink-500/15 border border-pink-500/30 text-white text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-pink-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">
                      2. Download Editable MS Word / Google Docs File (.doc)
                    </div>
                    <div className="text-xs text-pink-200/75">
                      Open in Word or Google Docs to add your own creator name or links
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-pink-500/20 text-pink-200 text-xs font-bold shrink-0">
                  .DOC
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDirectHtmlDownload();
                  setShowExportModal(false);
                }}
                className="w-full p-4 rounded-xl bg-[#0D0816] hover:bg-pink-500/15 border border-pink-500/30 text-white text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Printer className="w-5 h-5 text-pink-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">
                      3. Download Printable Web Ebook (.html)
                    </div>
                    <div className="text-xs text-pink-200/75">
                      Opens in any browser tab with a 1-click Print button
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-pink-500/20 text-pink-200 text-xs font-bold shrink-0">
                  .HTML
                </span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-pink-200 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP CONTROL BOX: Category + Topic + Custom Price + Generate / Retry / Boost (Hidden on Print) */}
      <section className="p-5 md:p-6 rounded-2xl bg-[#160F24] border border-pink-500/30 shadow-xl no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-pink-500/15">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                TAB 2 · White-Label High-FOMO Ebook + Mastermind Client/Link Finder
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-editorial">
              Generate Zero-Fluff 1% Ebooks (Certificates, AI Hacks, Clients, Skincare & Income)
            </h1>
          </div>

          {/* 1-CLICK WHITE-LABEL DOWNLOAD & PRINT ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? "bg-pink-500/20 border-pink-400 text-pink-200"
                  : "bg-white/5 border-white/10 text-pink-200/80 hover:bg-white/10"
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isSaved ? "fill-pink-400" : ""}`}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPdfDownload}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download White-Label PDF (.pdf)</span>
            </button>

            <button
              type="button"
              onClick={handleDirectWordDownload}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#0D0816] hover:bg-white/10 text-pink-200 border border-pink-500/30 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span>Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintOrOpenModal}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#0D0816] hover:bg-white/10 text-pink-200 border border-pink-500/30 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-pink-400" />
              <span>Print / Export All</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 0: High-FOMO Ebook Category Selector (Not Just Earning!) */}
          <div>
            <label className="block text-xs font-semibold text-pink-200/90 mb-2">
              1. Choose High-FOMO Ebook Category (Free Certificates, Secret Hacks, Client Hunting, Skincare, or Income):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {EBOOK_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-400 text-white shadow-sm"
                        : "bg-[#0D0816] hover:bg-white/5 border-pink-500/20 text-pink-200/80"
                    }`}
                  >
                    <div className="text-xs font-bold">{cat.label}</div>
                    <div className="text-[10px] text-pink-200/70 truncate mt-0.5">
                      {cat.shortDesc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 1: Topic Input + Boost Button */}
          <div>
            <label className="block text-xs font-semibold text-pink-200/90 mb-1.5">
              2. Enter Your Specific Topic in English or Hinglish (100% Custom AI Generation — Or Leave Blank for Category Vault):
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => {
                    setTopicInput(e.target.value);
                    setIsPresetTopic(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTriggerGenerate(false);
                  }}
                  placeholder="Type ANY custom topic in English or Hinglish (e.g., Dark Psychology Closing, Free Harvard Certificates, ₹150 Pharmacy Skincare, YouTube Automation)..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0D0816] border border-pink-500/30 text-sm text-white placeholder-pink-300/40 focus:outline-none focus:border-pink-400"
                />
                {topicInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTopicInput("");
                      setIsPresetTopic(false);
                    }}
                    title="Clear custom topic"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-pink-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                disabled={isBoosting}
                onClick={handleBoostTopic}
                className="px-4 py-3 rounded-xl bg-purple-950/90 hover:bg-purple-900 disabled:opacity-60 text-pink-200 border border-pink-500/30 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Wand2 className={`w-4 h-4 text-pink-400 ${isBoosting ? "animate-spin" : ""}`} />
                <span>{isBoosting ? "AI Boosting Angles..." : "Auto-Boost High-FOMO Topic"}</span>
              </button>
            </div>
          </div>

          {/* Boosted Topic Suggestions */}
          {boostSuggestions.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#0D0816] border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300">
                  ✨ Auto-Boosted Extreme-FOMO Ebook Angles (Click any to generate immediately):
                </span>
                <button
                  type="button"
                  onClick={() => setBoostSuggestions([])}
                  className="text-[11px] text-pink-300/60 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {boostSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopicInput(suggestion);
                      setBoostSuggestions([]);
                      setActiveStep(1);
                      onGenerate(
                        suggestion,
                        priceDisplay,
                        anchorPriceDisplay,
                        autoDmTrigger,
                        false,
                        selectedCategory
                      );
                    }}
                    className="text-left p-2.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 text-xs text-pink-100 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Custom Ebook Price + Anchor Value + Auto-DM Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Custom Price */}
            <div className="md:col-span-4 p-3 rounded-xl bg-[#0D0816] border border-pink-500/20">
              <label className="block text-[11px] font-semibold text-pink-300 mb-1.5">
                3. Your Ebook Price (Any Price Allowed):
              </label>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-pink-400 shrink-0" />
                <input
                  type="text"
                  value={priceDisplay}
                  onChange={(e) => setPriceDisplay(e.target.value)}
                  placeholder="₹19, ₹49, ₹99, ₹199..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-sm font-bold text-white focus:outline-none focus:border-pink-400"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {PRICE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceDisplay(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      priceDisplay === p
                        ? "bg-pink-600 text-white"
                        : "bg-white/5 text-pink-200/75 hover:bg-white/10"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Perceived Anchor Value */}
            <div className="md:col-span-4 p-3 rounded-xl bg-[#0D0816] border border-pink-500/20">
              <label className="block text-[11px] font-semibold text-pink-300 mb-1.5">
                4. Strike-Through Value (Perceived Worth):
              </label>
              <input
                type="text"
                value={anchorPriceDisplay}
                onChange={(e) => setAnchorPriceDisplay(e.target.value)}
                placeholder="₹1,999"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-sm font-bold text-pink-200 focus:outline-none focus:border-pink-400 mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {ANCHOR_PRESETS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAnchorPriceDisplay(a)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      anchorPriceDisplay === a
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 text-pink-200/75 hover:bg-white/10"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-DM Comment Word */}
            <div className="md:col-span-4 p-3 rounded-xl bg-[#0D0816] border border-pink-500/20">
              <label className="block text-[11px] font-semibold text-pink-300 mb-1.5">
                5. Instagram Auto-DM Trigger Word:
              </label>
              <input
                type="text"
                value={autoDmTrigger}
                onChange={(e) => setAutoDmTrigger(e.target.value.toUpperCase())}
                placeholder="SECRET or CERT"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#160F24] border border-pink-500/30 text-sm font-mono font-bold text-pink-300 focus:outline-none focus:border-pink-400 mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {["SECRET", "CERT", "CLIENTS", "GLOW", "19", "LINK"].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setAutoDmTrigger(w)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                      autoDmTrigger === w
                        ? "bg-pink-600 text-white"
                        : "bg-white/5 text-pink-200/70 hover:bg-white/10"
                    }`}
                  >
                    "{w}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Generate + Retry + Surprise New Topic */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleTriggerGenerate(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-60 text-white font-bold text-sm shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating
                  ? "AI Writing Your 5-Part Gen-Z Playbook..."
                  : `Generate ${priceDisplay} Gen-Z Playbook + 6s Reel`}
              </span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleTriggerGenerate(true)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-60 text-white font-semibold text-xs border border-white/15 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              <span>Regenerate Fresh Angle</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleTriggerGenerate(true, undefined, true)}
              className="px-4 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-60 text-amber-200 font-semibold text-xs border border-amber-500/35 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>🎲 Surprise New Topic</span>
            </button>

            <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>
                Edition #{generationCount} · {lastUpdatedMsg}
              </span>
            </div>
          </div>

          {/* Quick 1-Click Ebook Presets Filtered by Selected Category */}
          <div className="pt-2 border-t border-pink-500/15">
            <div className="text-[11px] font-semibold text-pink-300/85 mb-1.5">
              Or Click Any Ready-Made 2026 Playbook Topic ({selectedCategory === "All" ? "All Categories" : selectedCategory}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    setSelectedCategory(preset.category);
                    setTopicInput(preset.topic);
                    setIsPresetTopic(true);
                    setPriceDisplay(preset.recommendedPrice);
                    setAnchorPriceDisplay(preset.anchorPrice);
                    setAutoDmTrigger(preset.triggerWord);
                    setActiveStep(1);
                    onGenerate(
                      preset.topic,
                      preset.recommendedPrice,
                      preset.anchorPrice,
                      preset.triggerWord,
                      false,
                      preset.category
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0D0816] hover:bg-pink-500/20 border border-pink-500/25 text-xs text-pink-100 transition-all cursor-pointer"
                >
                  {preset.title} ({preset.recommendedPrice})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOADING BANNER WHEN AI IS WRITING */}
      {isGenerating && (
        <div className="p-8 rounded-2xl bg-[#160F24] border-2 border-pink-500/50 text-center space-y-3 animate-pulse no-print">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">
            AI is Writing Your 5-Part Gen-Z {priceDisplay} Playbook & Zero-Slop Reel...
          </h3>
          <p className="text-xs text-pink-200/80 max-w-md mx-auto">
            Writing simple human English plays, real links, copy-paste scripts, and trendy 0% AI-slop Reel hooks...
          </p>
        </div>
      )}

      {/* CLEAN 2-STEP SWITCHER (One View at a Time so the page is NEVER cluttered!) */}
      <div className="p-2 rounded-2xl bg-[#160F24] border border-pink-500/30 grid grid-cols-1 sm:grid-cols-2 gap-2 no-print">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeStep === 1
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
              : "bg-[#0D0816] hover:bg-white/5 text-pink-200/80"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
              activeStep === 1
                ? "bg-white text-pink-700"
                : "bg-pink-500/15 text-pink-300"
            }`}
          >
            1
          </span>
          <div>
            <div className="text-xs md:text-sm font-bold">
              Step 1: Read & Download Gen-Z Playbook PDF
            </div>
            <div className="text-[11px] opacity-80">
              Link Map + 5 Modern Plays (No Boring Chapters) + Direct PDF
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeStep === 2
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
              : "bg-[#0D0816] hover:bg-white/5 text-pink-200/80"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
              activeStep === 2
                ? "bg-white text-pink-700"
                : "bg-pink-500/15 text-pink-300"
            }`}
          >
            2
          </span>
          <div>
            <div className="text-xs md:text-sm font-bold">
              Step 2: Viral Ebook Reel Studio & Anti-Slop Video Prompts
            </div>
            <div className="text-[11px] opacity-80">
              0% AI-Slop Prompts + Psychological Overlays + SEO Caption + Tags
            </div>
          </div>
        </button>
      </div>

      {/* ===================================================================
          STEP 1: 12PT READABLE EBOOK DRAFT (With Chapter Selector Bar)
      =================================================================== */}
      {activeStep === 1 && (
        <div className="space-y-4">
          {/* Chapter Filter Bar + Theme Toggle + Direct PDF Download (Hidden on Print) */}
          <div className="p-4 rounded-2xl bg-[#160F24] border border-pink-500/25 flex flex-col gap-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-pink-200">
                📖 100% White-Label Ebook Preview (Zero "GlowCash" Watermark Inside PDF):
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-xl bg-[#0D0816] p-1 border border-pink-500/25">
                  <button
                    type="button"
                    onClick={() => setEbookThemeMode("dark")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      ebookThemeMode === "dark"
                        ? "bg-pink-600 text-white"
                        : "text-pink-200/70 hover:text-white"
                    }`}
                  >
                    Dark Luxury
                  </button>
                  <button
                    type="button"
                    onClick={() => setEbookThemeMode("ivory")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      ebookThemeMode === "ivory"
                        ? "bg-pink-600 text-white"
                        : "text-pink-200/70 hover:text-white"
                    }`}
                  >
                    Ivory Paper
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleDirectPdfDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <CopyButton
                  text={fullEbookPlainText}
                  label="Copy Entire Ebook"
                />
              </div>
            </div>

            {/* Playbook Part Tabs (Modern Gen-Z Notion Style — No Boring "Chapter 1 / Chapter 2") */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setActiveChapterTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeChapterTab === "all"
                    ? "bg-pink-600 text-white"
                    : "bg-[#0D0816] text-pink-200/80 hover:bg-white/10"
                }`}
              >
                Full Playbook
              </button>
              <button
                type="button"
                onClick={() => setActiveChapterTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeChapterTab === "overview"
                    ? "bg-pink-600 text-white"
                    : "bg-[#0D0816] text-pink-200/80 hover:bg-white/10"
                }`}
              >
                Cover & Link Map
              </button>
              {result.ebook.chapters.map((ch, idx) => (
                <button
                  key={ch.chapterNumber || idx}
                  type="button"
                  onClick={() =>
                    setActiveChapterTab(idx as 0 | 1 | 2 | 3 | 4)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeChapterTab === idx
                      ? "bg-pink-600 text-white"
                      : "bg-[#0D0816] text-pink-200/80 hover:bg-white/10"
                  }`}
                >
                  Play 0{ch.chapterNumber || idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActiveChapterTab("checklist")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeChapterTab === "checklist"
                    ? "bg-pink-600 text-white"
                    : "bg-[#0D0816] text-pink-200/80 hover:bg-white/10"
                }`}
              >
                24-Hr Checklist
              </button>
            </div>
          </div>

          {/* PRINTABLE 12PT WHITE-LABEL EBOOK CONTAINER */}
          <article
            className={`ebook-print-container rounded-2xl p-6 md:p-10 border transition-all ${
              ebookThemeMode === "dark"
                ? "bg-[#150C24] border-pink-500/35 text-[#F9F5FF]"
                : "bg-[#FFFDF9] border-pink-300 text-[#180920]"
            }`}
          >
            {/* Cover Header (Shown in "all" or "overview") */}
            {(activeChapterTab === "all" ||
              activeChapterTab === "overview") && (
              <>
                <div
                  className={`pb-6 mb-6 border-b ${
                    ebookThemeMode === "dark"
                      ? "border-pink-500/25"
                      : "border-pink-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md ${
                        ebookThemeMode === "dark"
                          ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                          : "bg-pink-100 text-pink-900 border border-pink-300"
                      }`}
                    >
                      {result.ebook.editionTag}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs line-through opacity-65 ${
                          ebookThemeMode === "dark"
                            ? "text-pink-200"
                            : "text-gray-600"
                        }`}
                      >
                        Value {result.anchorPriceDisplay}
                      </span>
                      <span className="px-3 py-1 rounded-md bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-extrabold">
                        Offer Price: {result.priceDisplay}
                      </span>
                    </div>
                  </div>

                  <h2
                    className={`text-2xl md:text-3xl font-bold font-editorial leading-tight mb-3 ${
                      ebookThemeMode === "dark"
                        ? "text-white"
                        : "text-[#180920]"
                    }`}
                  >
                    {result.ebook.title}
                  </h2>

                  <p
                    className={`ebook-12pt-body mb-4 ${
                      ebookThemeMode === "dark"
                        ? "text-pink-100/90"
                        : "text-gray-800"
                    }`}
                  >
                    {result.ebook.subtitle}
                  </p>

                  {/* Golden Rule Callout */}
                  <div
                    className={`p-4 rounded-xl border mb-5 ${
                      ebookThemeMode === "dark"
                        ? "bg-pink-950/40 border-pink-500/30 text-pink-100"
                        : "bg-pink-50 border-pink-200 text-pink-950"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
                      {result.ebook.goldenRuleTitle}:
                    </div>
                    <p className="ebook-12pt-body font-medium">
                      {result.ebook.goldenRuleBody}
                    </p>
                  </div>

                  {/* 🔥 THE HARDEST PART SOLVED: MASTERMIND CLIENT / BUYER / LINK FINDER BOX */}
                  {result.ebook.hardestPartSolvedBox && (
                    <div
                      className={`p-5 rounded-2xl border-2 ${
                        ebookThemeMode === "dark"
                          ? "bg-[#1A0D2E] border-pink-500/60 text-pink-50"
                          : "bg-purple-50/90 border-pink-400 text-[#180920]"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-pink-400">
                          {result.ebook.hardestPartSolvedBox.title}
                        </span>
                        <div className="no-print">
                          <CopyButton
                            text={`${result.ebook.hardestPartSolvedBox.title}\n\nExact Search Filters & Direct Portals:\n${result.ebook.hardestPartSolvedBox.exactWhereToFindMap.join("\n")}\n\n0-Follower Traffic & Buyer Trick:\n${result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick}`}
                            label="Copy Mastermind Map"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-2 mb-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-pink-400">
                          Exact Search Queries, Filters & Direct Portals (Zero Followers Needed):
                        </div>
                        {result.ebook.hardestPartSolvedBox.exactWhereToFindMap.map(
                          (item: string, fIdx: number) => (
                            <div
                              key={fIdx}
                              className={`p-3 rounded-xl border ebook-12pt-body ${
                                ebookThemeMode === "dark"
                                  ? "bg-[#0D0816] border-pink-500/30 text-pink-100"
                                  : "bg-white border-pink-200 text-gray-900"
                              }`}
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>

                      <p className="ebook-12pt-body">
                        <strong>0-Follower Traffic & Buyer Shortcut:</strong>{" "}
                        {
                          result.ebook.hardestPartSolvedBox
                            .zeroFollowerTrafficTrick
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick-Start 4-Pillar Overview */}
                <div className="mb-8">
                  <h3
                    className={`text-lg font-bold font-editorial mb-3 ${
                      ebookThemeMode === "dark"
                        ? "text-pink-200"
                        : "text-pink-950"
                    }`}
                  >
                    Quick-Start 4-Pillar Execution Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.ebook.quickValueBreakdown.map((pillar, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                          ebookThemeMode === "dark"
                            ? "bg-[#0D0816] border-pink-500/20"
                            : "bg-white border-pink-200"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-md bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="ebook-12pt-body">
                          <strong>{pillar.metric}:</strong> {pillar.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 5 Modern Gen-Z Playbook Cards (Zero Boring "Chapter 1 / Chapter 2" Vibe) */}
            <div className="space-y-8">
              {result.ebook.chapters.map((chapter, idx) => {
                if (
                  activeChapterTab !== "all" &&
                  activeChapterTab !== idx
                ) {
                  return null;
                }
                const cleanSubtitleNote = (chapter.subtitle || "")
                  .replace(/^⚠️?\s*WARNING:\s*Keep this strictly confidential\.?\s*[—–-]?\s*/i, "")
                  .trim();
                const cleanScriptLabel = (
                  chapter.copyPasteTemplateOrScript.label || "Copy-Paste Cheat Sheet"
                )
                  .replace(/^🧠\s*/i, "")
                  .replace(/The\s+Jedi\s+Mind-?Trick\s*\/?\s*(?:Secret\s*)?/i, "Copy-Paste ");
                const chapterCopyText = `0${chapter.chapterNumber || idx + 1} · ${chapter.title}\n${cleanSubtitleNote ? `real talk: ${cleanSubtitleNote}\n` : ""}\nWhat Everyone Gets Wrong (vs. What Actually Works):\n${chapter.coreSecretSummary}\n\nThe Actual Shortcut (Zero Gatekeeping):\n${chapter.whereToFindOrHiddenTrick || ""}\n\nDo This Step-by-Step:\n${chapter.stepByStepExecution.join("\n")}\n\nExact Links & Free Tools:\n${(chapter.exactToolsOrWebsites || []).map((t) => `- ${t.name} (${t.role}): ${t.insiderTip}`).join("\n")}\n\n${cleanScriptLabel}:\n${chapter.copyPasteTemplateOrScript.content}\n\nReal Numbers & Why This Hits Different:\n${chapter.incomeMathOrProof}`;

                return (
                  <section
                    key={chapter.chapterNumber || idx}
                    className={`ebook-chapter-card p-5 md:p-6 rounded-2xl border shadow-xl ${
                      ebookThemeMode === "dark"
                        ? "bg-gradient-to-b from-[#120921] to-[#0B0614] border-pink-500/30"
                        : "bg-white border-pink-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-pink-500/15 border border-pink-500/30 text-pink-400">
                        PLAY 0{chapter.chapterNumber || idx + 1} · PRIVATE NOTES
                      </span>
                      <div className="no-print">
                        <CopyButton
                          text={chapterCopyText}
                          label={`Copy Play 0${chapter.chapterNumber || idx + 1}`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-xl md:text-2xl font-bold font-editorial mb-3 ${
                        ebookThemeMode === "dark"
                          ? "text-white"
                          : "text-[#180920]"
                      }`}
                    >
                      0{chapter.chapterNumber || idx + 1} · {chapter.title}
                    </h3>

                    {/* Real Talk Quick Vibe Check Strip */}
                    {cleanSubtitleNote && (
                      <div
                        className={`text-xs font-medium px-3.5 py-2.5 rounded-xl border mb-4 flex items-center gap-2 ${
                          ebookThemeMode === "dark"
                            ? "bg-amber-950/35 text-amber-100 border-amber-500/35"
                            : "bg-amber-50 text-amber-950 border-amber-300"
                        }`}
                      >
                        <span className="uppercase tracking-wider text-amber-400 font-extrabold shrink-0">
                          real talk:
                        </span>
                        <span>{cleanSubtitleNote}</span>
                      </div>
                    )}

                    {/* What Everyone Gets Wrong vs What Actually Works */}
                    <div
                      className={`p-4 rounded-xl border mb-4 ${
                        ebookThemeMode === "dark"
                          ? "bg-[#160B28] border-purple-500/30 text-pink-100/95"
                          : "bg-purple-50/70 border-purple-200 text-gray-900"
                      }`}
                    >
                      <div className="text-xs font-extrabold uppercase tracking-wider text-purple-300 mb-1.5">
                        What Everyone Gets Wrong (vs. What Actually Works)
                      </div>
                      <p className="ebook-12pt-body leading-relaxed">
                        {chapter.coreSecretSummary}
                      </p>
                    </div>

                    {/* The Actual Shortcut */}
                    {chapter.whereToFindOrHiddenTrick && (
                      <div
                        className={`p-4 rounded-xl border mb-4 ${
                          ebookThemeMode === "dark"
                            ? "bg-pink-950/35 border-pink-500/40 text-pink-100"
                            : "bg-pink-50 border-pink-300 text-pink-950"
                        }`}
                      >
                        <div className="text-xs font-extrabold uppercase tracking-wider text-pink-400 mb-1.5">
                          The Actual Shortcut (Zero Gatekeeping)
                        </div>
                        <p className="ebook-12pt-body font-medium leading-relaxed">
                          {chapter.whereToFindOrHiddenTrick}
                        </p>
                      </div>
                    )}

                    {/* Do This Step-by-Step */}
                    <div className="mb-4">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-pink-400 mb-2.5">
                        Do This Step-by-Step
                      </div>
                      <ol className="space-y-2.5">
                        {chapter.stepByStepExecution.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            className={`ebook-12pt-body p-3 rounded-xl border flex items-start gap-2.5 ${
                              ebookThemeMode === "dark"
                                ? "bg-[#120A20] border-pink-500/20 text-pink-100"
                                : "bg-gray-50 border-pink-100 text-gray-900"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Exact Links & Free Tools */}
                    {Array.isArray(chapter.exactToolsOrWebsites) &&
                      chapter.exactToolsOrWebsites.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-extrabold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Exact Links & Free Tools</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {chapter.exactToolsOrWebsites.map((tool, tIdx) => (
                              <div
                                key={tIdx}
                                className={`p-3 rounded-xl border text-xs ${
                                  ebookThemeMode === "dark"
                                    ? "bg-[#150D26] border-pink-500/20 text-pink-100"
                                    : "bg-purple-50/60 border-purple-200 text-gray-800"
                                }`}
                              >
                                <div className="font-bold text-pink-400">
                                  {tool.name}{" "}
                                  <span className="opacity-75 font-normal">
                                    ({tool.role})
                                  </span>
                                </div>
                                <div className="mt-1 opacity-90">
                                  Quick Tip: {tool.insiderTip}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Copy-Paste Script / Cheat Sheet */}
                    <div
                      className={`p-4 rounded-xl border mb-4 ${
                        ebookThemeMode === "dark"
                          ? "bg-[#170E29] border-pink-500/35"
                          : "bg-pink-50/70 border-pink-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">
                          {cleanScriptLabel}
                        </span>
                        <div className="no-print">
                          <CopyButton
                            text={chapter.copyPasteTemplateOrScript.content}
                            label="Copy Script"
                          />
                        </div>
                      </div>
                      <pre
                        className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                          ebookThemeMode === "dark"
                            ? "text-pink-100"
                            : "text-gray-900"
                        }`}
                      >
                        {chapter.copyPasteTemplateOrScript.content}
                      </pre>
                    </div>

                    {/* Real Numbers & Why This Hits Different */}
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
                        ebookThemeMode === "dark"
                          ? "bg-emerald-950/35 border-emerald-500/35 text-emerald-300"
                          : "bg-emerald-50 border-emerald-200 text-emerald-900"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <span className="font-extrabold uppercase tracking-wider text-emerald-400 mr-1.5">
                          Real Numbers & Takeaway:
                        </span>
                        <span>{chapter.incomeMathOrProof}</span>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Final 24-Hour Execution Checklist */}
            {(activeChapterTab === "all" ||
              activeChapterTab === "checklist") && (
              <div
                className={`mt-8 pt-6 border-t ${
                  ebookThemeMode === "dark"
                    ? "border-pink-500/25"
                    : "border-pink-200"
                }`}
              >
                <h3
                  className={`text-lg font-bold font-editorial mb-3 ${
                    ebookThemeMode === "dark" ? "text-white" : "text-[#180920]"
                  }`}
                >
                  24-Hour Fast-Action Implementation Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {result.ebook.twentyFourHourChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        ebookThemeMode === "dark"
                          ? "bg-[#0D0816] border-pink-500/20"
                          : "bg-white border-pink-200"
                      }`}
                    >
                      <span className="w-5 h-5 rounded border border-pink-400 flex items-center justify-center text-pink-400 text-xs shrink-0">
                        ✓
                      </span>
                      <span className="ebook-12pt-body">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Bottom Bar: Download PDF + Next Step */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={handleDirectPdfDownload}
              className="px-5 py-2.5 rounded-xl bg-[#221638] hover:bg-[#2E1E4C] border border-pink-500/35 text-pink-100 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-pink-400" />
              <span>Download Ready-to-Sell 12pt PDF (.pdf)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Step 2 (Anti-Slop AI Video Prompts, Overlays & Tags)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          STEP 2: VIRAL EBOOK REEL STUDIO & ANTI-SLOP AI VIDEO PROMPTS
      =================================================================== */}
      {activeStep === 2 && (
        <div className="p-5 md:p-6 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6 no-print">
          {/* Clean Studio Header with Full-Kit Regenerate + Copy */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-500/15">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                STEP 2 OF 2 · VIRAL EBOOK REEL STUDIO (0% AI SLOP · 2026 ALGORITHM)
              </span>
              <h2 className="text-xl font-bold text-white font-editorial mt-0.5">
                Trigger Impulse PDF Requests for Your {result.priceDisplay} Ebook
              </h2>
              <p className="text-xs text-pink-200/75 mt-1">
                Don&apos;t like any prompt, overlay, caption, or tag? Click the{" "}
                <strong className="text-pink-200">Regenerate</strong> button beside that section to refresh only that part instantly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={regeneratingSection !== null}
                onClick={() => handleRegenerateReelSection("all")}
                className="px-3.5 py-2 rounded-xl bg-[#24163D] hover:bg-[#311E54] border border-pink-500/35 text-pink-100 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-pink-400 ${
                    regeneratingSection === "all" ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {regeneratingSection === "all"
                    ? "Refreshing Full Kit..."
                    : "Regenerate Full Reel Kit"}
                </span>
              </button>
              <CopyButton
                text={fullTriggerReelPackText}
                label="Copy Full Reel Kit"
              />
            </div>
          </div>

          {/* ===============================================================
              BLOCK 1: ANTI-SLOP AI VIDEO & FIRST-FRAME PROMPTS (0% AI LOOK)
          =============================================================== */}
          <section className="p-5 rounded-2xl bg-[#0D0816] border border-pink-500/25 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>
                    1. Zero-Slop AI Video & First-Frame Prompts (100% Real iPhone POV)
                  </span>
                </span>
                <p className="text-[11px] text-pink-200/70 mt-0.5">
                  Engineered for Kling, Veo, Runway, Flow AI &amp; ChatGPT Image — zero glossy plastic CGI, zero fake neon slop.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={regeneratingSection !== null}
                  onClick={() => handleRegenerateReelSection("prompts")}
                  className="px-3 py-1.5 rounded-lg bg-[#1F1435] hover:bg-[#2C1C4B] border border-pink-500/30 text-pink-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-pink-400 ${
                      regeneratingSection === "prompts" ||
                      regeneratingSection === "all"
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  <span>
                    {regeneratingSection === "prompts"
                      ? "Regenerating..."
                      : "Regenerate"}
                  </span>
                </button>
                <CopyButton
                  text={allThreeAntiSlopPromptsText}
                  label="Copy All 3"
                />
              </div>
            </div>

            {/* Clean 3-Tab Switcher so prompts stay airy & readable */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActivePromptTab("firstFrame")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activePromptTab === "firstFrame"
                    ? "bg-pink-600 text-white shadow-sm"
                    : "bg-[#160F24] text-pink-200/80 hover:bg-[#211636] border border-pink-500/20"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>1. Raw iPhone First-Frame (Image)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePromptTab("videoMotion")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activePromptTab === "videoMotion"
                    ? "bg-pink-600 text-white shadow-sm"
                    : "bg-[#160F24] text-pink-200/80 hover:bg-[#211636] border border-pink-500/20"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>2. 6s Handheld Motion (AI Video)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePromptTab("relatableBroll")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activePromptTab === "relatableBroll"
                    ? "bg-pink-600 text-white shadow-sm"
                    : "bg-[#160F24] text-pink-200/80 hover:bg-[#211636] border border-pink-500/20"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>3. Relatable POV B-Roll Clip</span>
              </button>
            </div>

            {/* Active Prompt Display Card */}
            {activePromptTab === "firstFrame" && (
              <div className="p-4 rounded-xl bg-[#160F24] border border-pink-500/20 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-pink-300">
                    ChatGPT Image / Midjourney / Ideogram · 9:16 Candid First-Frame Prompt
                  </span>
                  <CopyButton
                    text={resolvedAiVideoPrompts.rawPhoneFirstFramePrompt}
                    label="Copy Image Prompt"
                  />
                </div>
                <p className="text-xs md:text-sm text-pink-50/95 leading-relaxed whitespace-pre-wrap">
                  {resolvedAiVideoPrompts.rawPhoneFirstFramePrompt}
                </p>
              </div>
            )}

            {activePromptTab === "videoMotion" && (
              <div className="p-4 rounded-xl bg-[#160F24] border border-pink-500/20 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-pink-300">
                    Kling / Veo / Runway / Flow AI · 6-Second Zero-Slop Video Motion Prompt
                  </span>
                  <CopyButton
                    text={resolvedAiVideoPrompts.zeroSlopVideoMotionPrompt}
                    label="Copy Video Prompt"
                  />
                </div>
                <p className="text-xs md:text-sm text-pink-50/95 leading-relaxed whitespace-pre-wrap">
                  {resolvedAiVideoPrompts.zeroSlopVideoMotionPrompt}
                </p>
              </div>
            )}

            {activePromptTab === "relatableBroll" && (
              <div className="p-4 rounded-xl bg-[#160F24] border border-pink-500/20 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-pink-300">
                    Emotional / Relatable Indian Creator POV B-Roll Prompt (Stops Scroll)
                  </span>
                  <CopyButton
                    text={resolvedAiVideoPrompts.relatablePovBrollPrompt}
                    label="Copy B-Roll Prompt"
                  />
                </div>
                <p className="text-xs md:text-sm text-pink-50/95 leading-relaxed whitespace-pre-wrap">
                  {resolvedAiVideoPrompts.relatablePovBrollPrompt}
                </p>
              </div>
            )}

            {/* Concise Algorithm & Anti-Slop Psychology Note */}
            <div className="p-3.5 rounded-xl bg-emerald-950/35 border border-emerald-500/25 text-xs text-emerald-100/90 leading-relaxed">
              <strong className="text-emerald-300">
                2026 Algorithm &amp; Zero-Slop Edge:{" "}
              </strong>
              {resolvedAiVideoPrompts.algorithmTriggerNote}
            </div>
          </section>

          {/* ===============================================================
              BLOCK 2 & 3: 6s ALGORITHM VIDEO PLAN + 4 PSYCHOLOGICAL OVERLAYS
          =============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 6-Second Video Idea & Shot Timeline */}
            <section className="p-5 rounded-2xl bg-[#0D0816] border border-pink-500/20 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-pink-400" />
                  <span>2. 6-Second Algorithm-Loop Video Plan</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={regeneratingSection !== null}
                    onClick={() => handleRegenerateReelSection("videoPlan")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F1435] hover:bg-[#2C1C4B] border border-pink-500/30 text-pink-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3 h-3 text-pink-400 ${
                        regeneratingSection === "videoPlan" ||
                        regeneratingSection === "all"
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    <span>
                      {regeneratingSection === "videoPlan"
                        ? "Refreshing..."
                        : "Regenerate"}
                    </span>
                  </button>
                  <CopyButton
                    text={`${result.reelBlueprint.sixSecondVideoIdea.visualStyle}\n${result.reelBlueprint.sixSecondVideoIdea.shotByShot.join("\n")}\n${result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}`}
                    label="Copy"
                  />
                </div>
              </div>

              <p className="text-sm text-white font-semibold leading-relaxed">
                {result.reelBlueprint.sixSecondVideoIdea.visualStyle}
              </p>

              <div className="space-y-2">
                {result.reelBlueprint.sixSecondVideoIdea.shotByShot.map(
                  (shot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#160F24] border border-pink-500/15 text-xs text-pink-100 leading-relaxed"
                    >
                      {shot}
                    </div>
                  )
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#160F24]/70 border border-pink-500/15 text-xs text-pink-200/85 leading-relaxed">
                <strong className="text-pink-300">
                  Audio, Lighting &amp; Trial-Reel Tip:{" "}
                </strong>
                {result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}
              </div>
            </section>

            {/* 4 Psychological Non-Commercial Reel Overlay Texts */}
            <section className="p-5 rounded-2xl bg-[#0D0816] border border-pink-500/20 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    3. Psychological Reel Overlay Texts ({result.priceDisplay})
                  </span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={regeneratingSection !== null}
                    onClick={() => handleRegenerateReelSection("overlays")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F1435] hover:bg-[#2C1C4B] border border-pink-500/30 text-pink-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3 h-3 text-pink-400 ${
                        regeneratingSection === "overlays" ||
                        regeneratingSection === "all"
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    <span>
                      {regeneratingSection === "overlays"
                        ? "Refreshing..."
                        : "Regenerate"}
                    </span>
                  </button>
                  <CopyButton
                    text={result.reelBlueprint.psychologicalPriceOverlays
                      .map((o) => o.overlayText)
                      .join("\n\n")}
                    label="Copy All"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {result.reelBlueprint.psychologicalPriceOverlays.map(
                  (overlay, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#160F24] border border-pink-500/20 flex items-start justify-between gap-3"
                    >
                      <div className="text-xs text-white leading-relaxed space-y-1">
                        <div className="text-[11px] font-bold text-pink-400">
                          {overlay.triggerType}
                        </div>
                        <div className="text-pink-50 font-medium">
                          &ldquo;{overlay.overlayText}&rdquo;
                        </div>
                        <div className="text-[11px] text-pink-200/70">
                          Why it triggers PDF requests: {overlay.whyItConverts}
                        </div>
                      </div>
                      <CopyButton text={overlay.overlayText} label="Copy" />
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* ===============================================================
              BLOCK 4 & 5: VIRAL SEO CAPTION + 5 TRENDING HASHTAGS & SEO
          =============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Viral SEO-Optimized Human Auto-DM Caption */}
            <section className="p-5 rounded-2xl bg-[#0D0816] border border-pink-500/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    4. Viral SEO Auto-DM Caption (Trigger: &ldquo;
                    {result.autoDmTrigger}&rdquo;)
                  </span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={regeneratingSection !== null}
                    onClick={() => handleRegenerateReelSection("caption")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F1435] hover:bg-[#2C1C4B] border border-pink-500/30 text-pink-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3 h-3 text-pink-400 ${
                        regeneratingSection === "caption" ||
                        regeneratingSection === "all"
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    <span>
                      {regeneratingSection === "caption"
                        ? "Refreshing..."
                        : "Regenerate"}
                    </span>
                  </button>
                  <CopyButton
                    text={result.reelBlueprint.autoDmCaption}
                    label="Copy Caption"
                  />
                </div>
              </div>
              <pre className="text-xs md:text-[13px] text-pink-50/95 whitespace-pre-wrap font-sans leading-relaxed bg-[#160F24] p-4 rounded-xl border border-pink-500/15">
                {result.reelBlueprint.autoDmCaption}
              </pre>
            </section>

            {/* 5 Trending Hashtags (2026 Limit) + 10 High-Intent Search SEO Keywords */}
            <section className="p-5 rounded-2xl bg-[#0D0816] border border-pink-500/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-pink-500/15">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-pink-400" />
                  <span>5. Trending Hashtags &amp; Instagram SEO Keywords</span>
                </span>
                <button
                  type="button"
                  disabled={regeneratingSection !== null}
                  onClick={() => handleRegenerateReelSection("tags")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1F1435] hover:bg-[#2C1C4B] border border-pink-500/30 text-pink-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-3 h-3 text-pink-400 ${
                      regeneratingSection === "tags" ||
                      regeneratingSection === "all"
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  <span>
                    {regeneratingSection === "tags"
                      ? "Refreshing..."
                      : "Regenerate Tags & SEO"}
                  </span>
                </button>
              </div>

              {/* Strictly 5 Hashtags per 2026 Rule */}
              <div className="p-3.5 rounded-xl bg-[#160F24] border border-pink-500/20 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-pink-200">
                      5 Trending Hashtags (2026 Instagram Limit)
                    </span>
                    <p className="text-[11px] text-pink-200/65">
                      Max 5 hyper-targeted tags for maximum non-follower discovery:
                    </p>
                  </div>
                  <CopyButton
                    text={fiveHashtags.join(" ")}
                    label="Copy 5 Tags"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {fiveHashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-pink-500/15 text-pink-100 border border-pink-500/30 font-mono font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instagram Search SEO Keywords */}
              <div className="p-3.5 rounded-xl bg-[#160F24] border border-pink-500/20 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-pink-200 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-pink-400" />
                    <span>High-Intent Instagram Search SEO Keywords</span>
                  </span>
                  <CopyButton
                    text={result.reelBlueprint.seoKeywords.join(", ")}
                    label="Copy SEO"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.reelBlueprint.seoKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-[#0D0816] text-pink-200/90 border border-pink-500/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-pink-500/15">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 1 (Read &amp; Download 12pt Ebook)</span>
            </button>
            <CopyButton
              text={fullTriggerReelPackText}
              label="Copy Complete Reel Studio Pack"
            />
          </div>
        </div>
      )}
    </div>
  );
};
