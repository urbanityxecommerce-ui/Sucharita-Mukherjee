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
} from "lucide-react";
import {
  EbookGenerationResult,
  HIGH_VALUE_EBOOK_PRESETS,
  EBOOK_CATEGORIES,
  boostUserIdeaOptions,
} from "../data/playbookData";
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
  isSaved,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    result.category || "All"
  );
  const [topicInput, setTopicInput] = useState("");
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

  const handleTriggerGenerate = (isRetry = false, customCat?: string) => {
    setActiveStep(1);
    setActiveChapterTab("all");
    const catToUse = customCat ?? selectedCategory;
    onGenerate(
      topicInput.trim(),
      priceDisplay.trim() || "₹19",
      anchorPriceDisplay.trim() || "₹1,999",
      autoDmTrigger.trim() || "SECRET",
      isRetry,
      catToUse
    );
  };

  const handleBoostTopic = async () => {
    const catForBoost =
      selectedCategory === "All" ? "ebook" : selectedCategory;
    const localOptions = boostUserIdeaOptions(topicInput, catForBoost);
    setBoostSuggestions(localOptions);
    setTopicInput(localOptions[0]);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
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

  // Enforce 2026 Instagram 5-Hashtag Limit
  const fiveHashtags = result.reelBlueprint.hashtags.slice(0, 5);

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
PRICE ANCHOR: ${result.priceDisplay} (Real Value: ${result.anchorPriceDisplay})

${result.ebook.goldenRuleTitle}:
${result.ebook.goldenRuleBody}
${hardestBoxText}
QUICK-START 4-PILLAR OVERVIEW:
${result.ebook.quickValueBreakdown
  .map((item, idx) => `${idx + 1}. ${item.metric}: ${item.detail}`)
  .join("\n")}

${result.ebook.chapters
  .map(
    (ch) => `=========================================
CHAPTER ${ch.chapterNumber}: ${ch.title}
Subtitle: ${ch.subtitle}

1% Secret Summary:
${ch.coreSecretSummary}

🎯 Mastermind Shortcut (Where & How to Find It):
${ch.whereToFindOrHiddenTrick || "Use the exact search query and verified filter below."}

Action Steps:
${ch.stepByStepExecution.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Exact Websites & Tools:
${(ch.exactToolsOrWebsites || [])
  .map((t) => `- ${t.name} (${t.role}): ${t.insiderTip}`)
  .join("\n")}

${ch.copyPasteTemplateOrScript.label}:
${ch.copyPasteTemplateOrScript.content}

Real-World Proof / Math:
${ch.incomeMathOrProof}
`
  )
  .join("\n")}
=========================================
24-HOUR EXECUTION CHECKLIST:
${result.ebook.twentyFourHourChecklist.map((c) => `[ ] ${c}`).join("\n")}`;

  const fullTriggerReelPackText = `6-SECOND PSYCHOLOGICAL REEL BLUEPRINT (${result.priceDisplay} EBOOK)
Visual Concept: ${result.reelBlueprint.sixSecondVideoIdea.visualStyle}
Shot-by-Shot Plan:
${result.reelBlueprint.sixSecondVideoIdea.shotByShot
  .map((s, i) => `${i + 1}. ${s}`)
  .join("\n")}
Lighting & Audio: ${result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}

3 PSYCHOLOGICAL PRICE-COMPARISON OVERLAYS:
${result.reelBlueprint.psychologicalPriceOverlays
  .map((o, i) => `${i + 1}. [${o.triggerType}] "${o.overlayText}" (${o.whyItConverts})`)
  .join("\n")}

AUTO-DM CAPTION (Trigger: "${result.autoDmTrigger}"):
${result.reelBlueprint.autoDmCaption}

SEO KEYWORDS:
${result.reelBlueprint.seoKeywords.join(", ")}

5 HASHTAGS (2026 INSTAGRAM 5-HASHTAG RULE):
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
              2. Enter Your Specific Topic (Or Leave Blank for Category Mastermind Topic):
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTriggerGenerate(false);
                }}
                placeholder="e.g., Free Google & Harvard Certificates, How to Find Clients with 0 Followers, ₹150 Pharmacy Skincare Dupes, Secret AI Study Websites..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0D0816] border border-pink-500/30 text-sm text-white placeholder-pink-300/40 focus:outline-none focus:border-pink-400"
              />
              <button
                type="button"
                onClick={handleBoostTopic}
                className="px-4 py-3 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-pink-200 border border-pink-500/30 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Wand2 className="w-4 h-4 text-pink-400" />
                <span>Auto-Boost High-FOMO Topic</span>
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

          {/* Action Buttons: Generate + Retry */}
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
                  ? "AI Writing Your Zero-Fluff 5-Chapter Ebook..."
                  : `Generate ${priceDisplay} Mastermind Ebook + 6s Reel`}
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
              <span>Retry / Fresh Mastermind Version</span>
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
              Or Click Any Ready-Made High-FOMO Mastermind Blueprint ({selectedCategory === "All" ? "All Categories" : selectedCategory}):
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
            AI is Writing Your Zero-Fluff 5-Chapter {priceDisplay} Ebook & Mastermind Filter Map...
          </h3>
          <p className="text-xs text-pink-200/80 max-w-md mx-auto">
            Building exact search bar queries, direct portals, client/buyer filters, copy-paste scripts, and white-label 12pt layout...
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
              Step 1: Read & Download White-Label 12pt Ebook
            </div>
            <div className="text-[11px] opacity-80">
              Hardest-Part Solved Map + 5 Chapters + Direct PDF Download
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
              Step 2: 6-Second Trigger Reel & 5 Hashtags
            </div>
            <div className="text-[11px] opacity-80">
              3 FOMO/Snack Price Hooks + Auto-DM Caption + 2026 5 Hashtags
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

            {/* Chapter Tabs so user can focus on 1 chapter at a time if desired */}
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
                All Chapters (Full View)
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
                Cover & Mastermind Map
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
                  Chapter {ch.chapterNumber || idx + 1}
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

            {/* 5 Simple-English Chapters */}
            <div className="space-y-8">
              {result.ebook.chapters.map((chapter, idx) => {
                if (
                  activeChapterTab !== "all" &&
                  activeChapterTab !== idx
                ) {
                  return null;
                }
                return (
                  <section
                    key={chapter.chapterNumber || idx}
                    className={`ebook-chapter-card p-5 md:p-6 rounded-2xl border ${
                      ebookThemeMode === "dark"
                        ? "bg-[#0E0818] border-pink-500/25"
                        : "bg-white border-pink-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                        Chapter 0{chapter.chapterNumber || idx + 1} · 1% Insider
                        Framework
                      </span>
                      <div className="no-print">
                        <CopyButton
                          text={`Chapter ${chapter.chapterNumber || idx + 1}: ${chapter.title}\n${chapter.subtitle}\n\n${chapter.coreSecretSummary}\n\nMastermind Shortcut:\n${chapter.whereToFindOrHiddenTrick || ""}\n\nAction Steps:\n${chapter.stepByStepExecution.join("\n")}\n\n${chapter.copyPasteTemplateOrScript.label}:\n${chapter.copyPasteTemplateOrScript.content}\n\nProof:\n${chapter.incomeMathOrProof}`}
                          label={`Copy Ch ${chapter.chapterNumber || idx + 1}`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold font-editorial mb-2 ${
                        ebookThemeMode === "dark"
                          ? "text-white"
                          : "text-[#180920]"
                      }`}
                    >
                      {chapter.title}
                    </h3>

                    <div
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-block mb-4 ${
                        ebookThemeMode === "dark"
                          ? "bg-purple-950/80 text-pink-200 border border-pink-500/25"
                          : "bg-purple-50 text-purple-900 border border-purple-200"
                      }`}
                    >
                      💡 {chapter.subtitle}
                    </div>

                    <p
                      className={`ebook-12pt-body mb-4 ${
                        ebookThemeMode === "dark"
                          ? "text-pink-100/90"
                          : "text-gray-800"
                      }`}
                    >
                      {chapter.coreSecretSummary}
                    </p>

                    {/* 🎯 Mastermind Where-To-Find / Exact Filter Callout Box */}
                    {chapter.whereToFindOrHiddenTrick && (
                      <div
                        className={`p-3.5 rounded-xl border mb-4 ${
                          ebookThemeMode === "dark"
                            ? "bg-pink-950/35 border-pink-500/40 text-pink-100"
                            : "bg-pink-50 border-pink-300 text-pink-950"
                        }`}
                      >
                        <div className="text-xs font-extrabold uppercase tracking-wider text-pink-400 mb-1">
                          🎯 Mastermind Shortcut (Exact Search Query, Filter & Click-Path):
                        </div>
                        <p className="ebook-12pt-body font-medium">
                          {chapter.whereToFindOrHiddenTrick}
                        </p>
                      </div>
                    )}

                    {/* Action Steps */}
                    <div className="mb-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                        Step-by-Step Execution Plan:
                      </div>
                      <ol className="space-y-2">
                        {chapter.stepByStepExecution.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            className="ebook-12pt-body flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Exact Websites & Tools Table */}
                    {Array.isArray(chapter.exactToolsOrWebsites) &&
                      chapter.exactToolsOrWebsites.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Exact Websites & Free Tools to Use:</span>
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
                                  Pro Tip: {tool.insiderTip}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Copy-Paste Script / Template Box */}
                    <div
                      className={`p-4 rounded-xl border mb-4 ${
                        ebookThemeMode === "dark"
                          ? "bg-[#170E29] border-pink-500/30"
                          : "bg-pink-50/70 border-pink-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                          {chapter.copyPasteTemplateOrScript.label}:
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

                    {/* Real-World Income Math */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{chapter.incomeMathOrProof}</span>
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
              <span>Next: Step 2 (6-Second Trigger Reel & 5 Hashtags)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          STEP 2: 6-SECOND PSYCHOLOGICAL TRIGGER REEL BLUEPRINT (2026 RULES)
      =================================================================== */}
      {activeStep === 2 && (
        <div className="p-6 rounded-2xl bg-[#160F24] border border-pink-500/30 space-y-6 no-print">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-pink-500/15">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                STEP 2 OF 2 · 6-SECOND PSYCHOLOGICAL REEL BLUEPRINT (2026
                EDITION)
              </span>
              <h2 className="text-xl font-bold text-white font-editorial mt-0.5">
                Sell Your {result.priceDisplay} Ebook on Autopilot
              </h2>
            </div>
            <CopyButton
              text={fullTriggerReelPackText}
              label="Copy Full Reel Kit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 6-Second Video Idea & Shot Timeline */}
            <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-pink-400" />
                  <span>Exact 6-Second Video Plan</span>
                </span>
                <CopyButton
                  text={`${result.reelBlueprint.sixSecondVideoIdea.visualStyle}\n${result.reelBlueprint.sixSecondVideoIdea.shotByShot.join("\n")}\n${result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}`}
                  label="Copy Plan"
                />
              </div>

              <p className="text-sm text-white font-medium leading-relaxed">
                {result.reelBlueprint.sixSecondVideoIdea.visualStyle}
              </p>

              <p className="text-xs text-pink-200/75 leading-relaxed">
                <strong>Lighting & Audio Guide:</strong>{" "}
                {result.reelBlueprint.sixSecondVideoIdea.lightingAndAudioTip}
              </p>

              <div className="space-y-2 pt-1">
                {result.reelBlueprint.sixSecondVideoIdea.shotByShot.map(
                  (shot, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#160F24] border border-pink-500/15 text-xs text-pink-100"
                    >
                      {shot}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 3 Psychological Snack Price-Comparison Text Overlays */}
            <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                  3 Psychological Price-Comparison Hooks ({result.priceDisplay}{" "}
                  vs Snacks)
                </span>
                <CopyButton
                  text={result.reelBlueprint.psychologicalPriceOverlays
                    .map((o) => o.overlayText)
                    .join("\n\n")}
                  label="Copy All 3"
                />
              </div>

              <div className="space-y-2.5">
                {result.reelBlueprint.psychologicalPriceOverlays.map(
                  (overlay, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#160F24] border border-pink-500/25 flex items-start justify-between gap-2"
                    >
                      <div className="text-xs text-white leading-relaxed space-y-1">
                        <div className="text-[11px] font-bold text-pink-400">
                          Hook #{idx + 1} · {overlay.triggerType}
                        </div>
                        <div>"{overlay.overlayText}"</div>
                        <div className="text-[11px] text-pink-200/70">
                          Why it works: {overlay.whyItConverts}
                        </div>
                      </div>
                      <CopyButton text={overlay.overlayText} label="Copy" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Viral Caption + 2026 5-Hashtag Pack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    Viral Auto-DM Caption (Trigger: "{result.autoDmTrigger}")
                  </span>
                </span>
                <CopyButton
                  text={result.reelBlueprint.autoDmCaption}
                  label="Copy Caption"
                />
              </div>
              <pre className="text-xs text-pink-100/90 whitespace-pre-wrap font-sans leading-relaxed bg-[#160F24] p-3.5 rounded-xl border border-pink-500/15">
                {result.reelBlueprint.autoDmCaption}
              </pre>
            </div>

            <div className="space-y-4">
              {/* Strictly 5 Hashtags per 2026 Rule */}
              <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/25">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-pink-400" />
                      <span>5 Trending Hashtags (2026 Instagram Limit)</span>
                    </span>
                    <p className="text-[11px] text-pink-200/70 mt-0.5">
                      Instagram 2026 rule allows max 5 hyper-targeted hashtags:
                    </p>
                  </div>
                  <CopyButton
                    text={fiveHashtags.join(" ")}
                    label="Copy 5 Hashtags"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {fiveHashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-pink-500/15 text-pink-200 border border-pink-500/30 font-mono font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Keywords */}
              <div className="p-4 rounded-xl bg-[#0D0816] border border-pink-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                    Instagram Search SEO Keywords
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
                      className="text-[11px] px-2.5 py-1 rounded-md bg-[#160F24] text-pink-200/90 border border-pink-500/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Step 1 (Read & Download 12pt Ebook)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
