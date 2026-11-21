import { jsPDF } from "jspdf";
import {
  EbookGenerationResult,
  ReelGenerationResult,
} from "../data/playbookData";

/**
 * Standard PDF fonts (Helvetica/Times) in jsPDF only support WinAnsiEncoding (ASCII + Latin-1).
 * Replacing ₹ with "Rs. " and normalizing smart quotes/dashes guarantees 100% clean,
 * readable text in every PDF reader without garbled characters.
 */
function cleanPdfText(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/glowcash(\s+ai\s+studio)?/gi, "Private Studio")
    .replace(/1️⃣/g, "[1]")
    .replace(/2️⃣/g, "[2]")
    .replace(/3️⃣/g, "[3]")
    .replace(/4️⃣/g, "[4]")
    .replace(/⚠️/g, "[!]")
    .replace(/👁️/g, "")
    .replace(/🎯/g, "")
    .replace(/⚙️/g, "")
    .replace(/🧠/g, "")
    .replace(/🔥/g, "")
    .replace(/₹\s*/g, "Rs. ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, " - ")
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/★/g, "*")
    .replace(/✓|✔/g, "[x]")
    .replace(/→/g, "->")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function makeSafeFilename(title: string, suffix: string, ext: string): string {
  const base = cleanPdfText(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "insider-playbook-2026"}-${suffix}.${ext}`;
}

export function downloadEbookAsPDF(result: EbookGenerationResult): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 40;

  const drawPageTopAccent = () => {
    doc.setFillColor(24, 9, 44);
    doc.rect(0, 0, pageWidth, 8, "F");
    doc.setFillColor(236, 72, 153);
    doc.rect(0, 8, pageWidth, 2.5, "F");
  };

  drawPageTopAccent();

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      doc.addPage();
      drawPageTopAccent();
      y = 42;
    }
  };

  const writeWrappedText = (
    text: string,
    fontSize: number,
    fontStyle: "normal" | "bold" | "italic" = "normal",
    color: [number, number, number] = [28, 12, 38],
    indent = 0,
    lineSpacing = 1.42
  ) => {
    const cleaned = cleanPdfText(text);
    if (!cleaned) return;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines: string[] = doc.splitTextToSize(
      cleaned,
      contentWidth - indent
    );
    const lineHeight = fontSize * lineSpacing;

    for (const line of lines) {
      ensureSpace(lineHeight + 4);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    }
  };

  const drawStyledBox = (
    headerLabel: string,
    bodyText: string,
    bgRGB: [number, number, number],
    borderRGB: [number, number, number],
    accentRGB: [number, number, number],
    headerRGB: [number, number, number],
    bodyRGB: [number, number, number] = [28, 15, 38],
    useMonospace = false
  ) => {
    const cleanHeader = cleanPdfText(headerLabel);
    const cleanBody = cleanPdfText(bodyText);
    if (!cleanBody) return;

    doc.setFont(useMonospace ? "courier" : "helvetica", "normal");
    doc.setFontSize(useMonospace ? 10.2 : 11.2);
    const bodyLines: string[] = doc.splitTextToSize(
      cleanBody,
      contentWidth - 30
    );
    const lineH = useMonospace ? 14.2 : 15.5;
    const boxH = 30 + bodyLines.length * lineH;

    ensureSpace(boxH + 10);

    doc.setFillColor(bgRGB[0], bgRGB[1], bgRGB[2]);
    doc.setDrawColor(borderRGB[0], borderRGB[1], borderRGB[2]);
    doc.roundedRect(margin, y, contentWidth, boxH, 7, 7, "FD");

    // Left vertical accent stripe
    doc.setFillColor(accentRGB[0], accentRGB[1], accentRGB[2]);
    doc.roundedRect(margin, y, 5, boxH, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.8);
    doc.setTextColor(headerRGB[0], headerRGB[1], headerRGB[2]);
    doc.text(cleanHeader.toUpperCase(), margin + 14, y + 16);

    doc.setFont(useMonospace ? "courier" : "helvetica", "normal");
    doc.setFontSize(useMonospace ? 10.2 : 11.2);
    doc.setTextColor(bodyRGB[0], bodyRGB[1], bodyRGB[2]);
    let by = y + 32;
    for (const bLine of bodyLines) {
      doc.text(bLine, margin + 14, by);
      by += lineH;
    }

    y += boxH + 10;
  };

  // =========================================================================
  // 100% WHITE-LABEL CLASSIFIED 1% INSIDER DOSSIER COVER BANNER
  // =========================================================================
  const titleLines: string[] = doc.splitTextToSize(
    cleanPdfText(result.ebook.title),
    contentWidth - 36
  );
  const subLines: string[] = doc.splitTextToSize(
    cleanPdfText(result.ebook.subtitle),
    contentWidth - 36
  );
  const coverHeight =
    66 +
    Math.min(titleLines.length, 3) * 19 +
    Math.min(subLines.length, 2) * 14;

  doc.setFillColor(22, 9, 38); // Deep underground obsidian-plum
  doc.setDrawColor(236, 72, 153);
  doc.roundedRect(margin, y, contentWidth, coverHeight, 10, 10, "FD");

  // Top modern playbook badge inside banner
  doc.setFillColor(131, 24, 67);
  doc.roundedRect(margin + 16, y + 14, contentWidth - 32, 20, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(253, 224, 71); // Warm gold
  doc.text(
    cleanPdfText(
      `PRIVATE 2026 PLAYBOOK  |  NO GATEKEEPING EDITION  |  ACCESS: ${result.priceDisplay} (VALUE ${result.anchorPriceDisplay})`
    ).toUpperCase(),
    margin + 24,
    y + 27
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15.5);
  doc.setTextColor(255, 255, 255);
  let bannerY = y + 54;
  for (const tLine of titleLines.slice(0, 3)) {
    doc.text(tLine, margin + 18, bannerY);
    bannerY += 19;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.2);
  doc.setTextColor(249, 208, 234);
  for (const sLine of subLines.slice(0, 2)) {
    doc.text(sLine, margin + 18, bannerY + 2);
    bannerY += 14;
  }

  y += coverHeight + 14;

  // Target Reader Promise
  if (result.ebook.targetReaderPromise) {
    drawStyledBox(
      "WHAT YOU'LL ACTUALLY GET OUT OF THIS",
      result.ebook.targetReaderPromise,
      [250, 245, 255],
      [216, 180, 254],
      [126, 34, 206],
      [107, 33, 168],
      [35, 15, 50]
    );
  }

  // =========================================================================
  // GOLDEN RULE CALLOUT BOX
  // =========================================================================
  if (result.ebook.goldenRuleBody) {
    drawStyledBox(
      result.ebook.goldenRuleTitle || "REAL TALK BEFORE YOU START",
      result.ebook.goldenRuleBody,
      [255, 251, 235],
      [252, 211, 77],
      [217, 119, 6],
      [146, 64, 14],
      [45, 25, 10]
    );
  }

  // =========================================================================
  // THE HARDEST PART SOLVED (MASTERMIND MAP: WHERE TO FIND CLIENTS / LINKS)
  // =========================================================================
  if (result.ebook.hardestPartSolvedBox) {
    const mapItems = (
      result.ebook.hardestPartSolvedBox.exactWhereToFindMap || []
    )
      .map((item, idx) => `${idx + 1}. ${item}`)
      .join("\n");
    const trickNote = result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick
      ? `\nZero-Follower Leverage Rule: ${result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick}`
      : "";
    drawStyledBox(
      result.ebook.hardestPartSolvedBox.title ||
        "THE HARDEST PART SOLVED: EXACT PORTALS, FILTERS & CLICK-PATHS",
      `${mapItems}${trickNote}`,
      [253, 242, 248],
      [244, 114, 182],
      [219, 39, 119],
      [157, 23, 77],
      [35, 12, 42]
    );
  }

  // =========================================================================
  // QUICK-START 4-PILLAR OVERVIEW
  // =========================================================================
  if (
    Array.isArray(result.ebook.quickValueBreakdown) &&
    result.ebook.quickValueBreakdown.length > 0
  ) {
    const pillarsText = result.ebook.quickValueBreakdown
      .map((p, i) => `[${i + 1}] ${p.metric}: ${p.detail}`)
      .join("\n");
    drawStyledBox(
      "QUICK-START 4-PILLAR INSIDER OVERVIEW",
      pillarsText,
      [245, 243, 255],
      [196, 181, 253],
      [109, 40, 217],
      [91, 33, 182],
      [30, 18, 48]
    );
  }

  // =========================================================================
  // 5 MODERN GEN-Z PLAYBOOK PARTS (NO BORING "CHAPTER 1 / CHAPTER 2")
  // =========================================================================
  result.ebook.chapters.forEach((ch, idx) => {
    ensureSpace(110);

    // Modern Play Header Banner (01 · Title)
    const chTitleClean = cleanPdfText(
      `0${ch.chapterNumber || idx + 1}  ·  ${ch.title}`
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.2);
    const chHeaderLines: string[] = doc.splitTextToSize(
      chTitleClean,
      contentWidth - 28
    );
    const chBannerH = 18 + chHeaderLines.length * 16;

    doc.setFillColor(30, 12, 52);
    doc.roundedRect(margin, y, contentWidth, chBannerH, 7, 7, "F");
    doc.setFillColor(236, 72, 153);
    doc.roundedRect(margin, y, 6, chBannerH, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    let chy = y + 19;
    for (const hl of chHeaderLines) {
      doc.text(hl, margin + 14, chy);
      chy += 16;
    }
    y += chBannerH + 6;

    // Quick Vibe Check / Real Talk Strip
    const rawSub = cleanPdfText(ch.subtitle || "");
    const cleanSubHook = rawSub
      .replace(/^\[!\]\s*WARNING:\s*Keep this strictly confidential\.?\s*[-:]?\s*/i, "")
      .trim();
    if (cleanSubHook) {
      drawStyledBox(
        "REAL TALK · QUICK VIBE CHECK",
        cleanSubHook,
        [255, 251, 235],
        [251, 191, 36],
        [217, 119, 6],
        [146, 64, 14],
        [60, 30, 5]
      );
    }

    // 1. What Everyone Gets Wrong (vs. What Actually Works)
    if (ch.coreSecretSummary) {
      drawStyledBox(
        "WHAT EVERYONE GETS WRONG (VS. WHAT ACTUALLY WORKS)",
        ch.coreSecretSummary,
        [248, 245, 255],
        [192, 132, 252],
        [126, 34, 206],
        [88, 28, 135],
        [24, 14, 38]
      );
    }

    // 2. The Actual Shortcut (Zero Gatekeeping)
    if (ch.whereToFindOrHiddenTrick) {
      drawStyledBox(
        "THE ACTUAL SHORTCUT (ZERO GATEKEEPING)",
        ch.whereToFindOrHiddenTrick,
        [253, 242, 248],
        [244, 114, 182],
        [219, 39, 119],
        [157, 23, 77],
        [35, 12, 42]
      );
    }

    // 3. Do This Step-by-Step
    if (
      Array.isArray(ch.stepByStepExecution) &&
      ch.stepByStepExecution.length > 0
    ) {
      ensureSpace(45);
      writeWrappedText(
        "DO THIS STEP-BY-STEP:",
        11,
        "bold",
        [131, 24, 67]
      );
      y += 3;
      ch.stepByStepExecution.forEach((step, sIdx) => {
        const cleanedStep = cleanPdfText(step);
        const formattedStep = /^(\[\d+\]|\d+\.)/.test(cleanedStep)
          ? cleanedStep
          : `${sIdx + 1}. ${cleanedStep}`;
        writeWrappedText(
          formattedStep,
          11.4,
          "normal",
          [28, 18, 38],
          8,
          1.44
        );
        y += 4;
      });
      y += 4;
    }

    // 4. Exact Links & Free Tools
    if (
      Array.isArray(ch.exactToolsOrWebsites) &&
      ch.exactToolsOrWebsites.length > 0
    ) {
      const toolsText = ch.exactToolsOrWebsites
        .map((t) => `- ${t.name} (${t.role}): ${t.insiderTip}`)
        .join("\n");
      drawStyledBox(
        "EXACT LINKS & FREE TOOLS",
        toolsText,
        [243, 244, 246],
        [209, 213, 219],
        [75, 85, 99],
        [31, 41, 55],
        [25, 30, 40]
      );
    }

    // 5. Copy-Paste Script / Cheat Sheet
    if (ch.copyPasteTemplateOrScript?.content) {
      const rawLabel = cleanPdfText(
        ch.copyPasteTemplateOrScript.label || "COPY-PASTE CHEAT SHEET"
      ).replace(/The\s+Jedi\s+Mind-?Trick\s*\/?\s*(?:Secret\s*)?/i, "Copy-Paste ");
      drawStyledBox(
        rawLabel || "COPY-PASTE CHEAT SHEET",
        ch.copyPasteTemplateOrScript.content,
        [250, 245, 255],
        [192, 132, 252],
        [147, 51, 234],
        [107, 33, 168],
        [25, 12, 42],
        true
      );
    }

    // 6. Real Numbers & Takeaway
    if (ch.incomeMathOrProof) {
      drawStyledBox(
        "REAL NUMBERS & WHY THIS HITS DIFFERENT",
        ch.incomeMathOrProof,
        [236, 253, 245],
        [110, 231, 183],
        [5, 150, 105],
        [6, 95, 70],
        [6, 78, 59]
      );
    }

    y += 8;
  });

  // =========================================================================
  // 24-HOUR ACTION CHECKLIST
  // =========================================================================
  if (
    Array.isArray(result.ebook.twentyFourHourChecklist) &&
    result.ebook.twentyFourHourChecklist.length > 0
  ) {
    const checklistText = result.ebook.twentyFourHourChecklist
      .map((item) => `[ ]  ${item}`)
      .join("\n");
    drawStyledBox(
      "24-HOUR ACTION CHECKLIST",
      checklistText,
      [253, 242, 248],
      [244, 114, 182],
      [219, 39, 119],
      [131, 24, 67],
      [28, 14, 38]
    );
  }

  // Add 100% White-Label Footer Page Numbers on every page (NO GlowCash branding!)
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 95, 145);
    doc.text(
      cleanPdfText(
        `PRIVATE 2026 PLAYBOOK  |  ${result.ebook.title.slice(0, 52)}  |  Page ${p} of ${totalPages}`
      ),
      margin,
      pageHeight - 20
    );
  }

  doc.save(makeSafeFilename(result.ebook.title, "private-playbook-2026", "pdf"));
}

export function downloadReelPackAsPDF(result: ReelGenerationResult): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;
  let y = 44;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 52) {
      doc.addPage();
      y = 46;
    }
  };

  const writeWrappedText = (
    text: string,
    fontSize: number,
    fontStyle: "normal" | "bold" = "normal",
    color: [number, number, number] = [28, 12, 38],
    indent = 0
  ) => {
    const cleaned = cleanPdfText(text);
    if (!cleaned) return;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines: string[] = doc.splitTextToSize(
      cleaned,
      contentWidth - indent
    );
    const lineHeight = fontSize * 1.42;

    for (const line of lines) {
      ensureSpace(lineHeight + 4);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    }
  };

  // Header
  doc.setFillColor(34, 13, 56);
  doc.roundedRect(margin, y, contentWidth, 88, 10, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(244, 114, 182);
  doc.text(
    "2026 VIRAL MEESHO & MYNTRA REEL PRODUCTION PACK",
    margin + 16,
    y + 24
  );

  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  const titleLines: string[] = doc.splitTextToSize(
    cleanPdfText(result.concept.title),
    contentWidth - 32
  );
  doc.text(titleLines.slice(0, 2), margin + 16, y + 48);
  y += 106;

  // Step 1: Concept
  writeWrappedText("STEP 1: UNIQUE VIRAL CONCEPT & LOOK TRANSFORMATION", 13, "bold", [131, 24, 67]);
  y += 2;
  if (result.concept.liveDailyTrendTag) {
    writeWrappedText(
      `Live Daily Styling Radar: ${result.concept.liveDailyTrendTag}`,
      11,
      "bold",
      [88, 28, 135]
    );
  }
  writeWrappedText(
    `Curiosity Angle: ${result.concept.curiosityIdentityAngle}`,
    11.5
  );
  writeWrappedText(
    `First 2s Visual: ${result.concept.firstTwoSecondVisual}`,
    11.5
  );
  writeWrappedText(
    `Why It Triggers Shares & Saves: ${result.concept.whyItTriggersSharesAndSaves}`,
    11.5
  );
  y += 6;

  if (result.concept.lookTransformationFormula) {
    writeWrappedText(
      "Complete 4-Piece Look-Transformation Styling Formula:",
      12,
      "bold",
      [157, 23, 77]
    );
    writeWrappedText(
      `Before vs After Look: ${result.concept.lookTransformationFormula.beforeVsAfterLook}`,
      11,
      "normal",
      [30, 20, 40],
      8
    );
    writeWrappedText(
      `How All 4 Pieces Combine Together: ${result.concept.lookTransformationFormula.howToCombineAllFourPieces}`,
      11,
      "normal",
      [30, 20, 40],
      8
    );
    (result.concept.lookTransformationFormula.threeWaysToRestyleCombo || []).forEach(
      (way, wIdx) => {
        writeWrappedText(
          `Restyle Way ${wIdx + 1}: ${way}`,
          11,
          "normal",
          [60, 30, 80],
          12
        );
      }
    );
    y += 6;
  }

  writeWrappedText("6-Second Shot-by-Shot Plan:", 12, "bold", [88, 28, 135]);
  result.concept.shotByShotPlan.forEach((shot, i) => {
    writeWrappedText(
      `Clip ${i + 1} (${shot.timeRange}): ${shot.visualAction} | On-Screen: "${shot.onScreenText}"`,
      11,
      "normal",
      [30, 20, 40],
      8
    );
  });
  y += 12;

  // Step 2: 4 Meesho/Myntra Searches
  writeWrappedText(
    "STEP 2: 4 WISHLIST-READY MEESHO CATALOG SEARCHES & STYLING",
    13,
    "bold",
    [131, 24, 67]
  );
  y += 2;
  result.searchTerms.forEach((s, idx) => {
    writeWrappedText(
      `${idx + 1}. [${s.platform}] ${s.itemLabel}: "${s.exactKeyword}" (${s.priceFilter})`,
      11.5,
      "bold",
      [30, 15, 45],
      6
    );
    if (Array.isArray(s.backupSearchKeywords) && s.backupSearchKeywords.length > 0) {
      writeWrappedText(
        `   Backup Meesho Searches: ${s.backupSearchKeywords.map((b) => `"${b}"`).join("  |  ")}`,
        10.5,
        "normal",
        [88, 28, 135],
        12
      );
    }
    if (s.howToCombineAndStyle) {
      writeWrappedText(
        `   How to Combine & Style: ${s.howToCombineAndStyle}`,
        11,
        "normal",
        [131, 24, 67],
        12
      );
    }
    writeWrappedText(
      `   Review & Fabric Check: ${s.fabricAndFitCheck}`,
      11,
      "normal",
      [60, 40, 75],
      12
    );
    y += 4;
  });
  y += 10;

  // Step 3: Zero-Upload Outfit Look-Preview + Aditya Knight Prompts
  writeWrappedText(
    "STEP 3: ZERO-UPLOAD OUTFIT LOOK-PREVIEW + ADITYA KNIGHT PROMPTS",
    13,
    "bold",
    [131, 24, 67]
  );
  y += 4;
  if (result.prompts.exactOutfitLookPreviewPrompt) {
    writeWrappedText(
      "Prompt 0A (Zero-Upload Complete Outfit Look-Preview + Meesho Camera Search Board):",
      11.5,
      "bold",
      [6, 95, 70]
    );
    writeWrappedText(
      result.prompts.exactOutfitLookPreviewPrompt,
      10.5,
      "normal",
      [35, 25, 45],
      8
    );
    y += 8;
  }

  writeWrappedText(
    "Prompt 1 (Handheld Hanging Bundle):",
    11.5,
    "bold",
    [88, 28, 135]
  );
  writeWrappedText(
    result.prompts.adityaKnightHandheldBundlePrompt,
    10.5,
    "normal",
    [35, 25, 45],
    8
  );
  y += 8;

  writeWrappedText(
    "Prompt 5 (Faceless iPhone Mirror Avatar):",
    11.5,
    "bold",
    [88, 28, 135]
  );
  writeWrappedText(
    result.prompts.facelessMirrorAvatarPrompt,
    10.5,
    "normal",
    [35, 25, 45],
    8
  );
  y += 8;

  writeWrappedText(
    "Prompt 6 (4K UGC Video Motion):",
    11.5,
    "bold",
    [88, 28, 135]
  );
  writeWrappedText(
    result.prompts.ugcVideoMotionPrompts.handheldClothesMotion,
    10.5,
    "normal",
    [35, 25, 45],
    8
  );
  y += 10;

  // Step 4: Hooks, Caption & 5 Hashtags
  writeWrappedText(
    "STEP 4: 3 HOOKS, AUTO-DM CAPTION & 5 HASHTAGS (2026 RULE)",
    13,
    "bold",
    [131, 24, 67]
  );
  result.reelPack.onScreenHooks.forEach((h, idx) => {
    writeWrappedText(`Hook ${idx + 1}: "${h}"`, 11.5, "bold", [30, 15, 45], 6);
  });
  y += 6;
  writeWrappedText("Auto-DM Caption:", 11.5, "bold", [88, 28, 135]);
  writeWrappedText(result.reelPack.hinglishCaption, 11, "normal", [30, 20, 40], 6);
  y += 6;
  writeWrappedText(
    `5 Hashtags (2026 Max-5 Rule): ${result.reelPack.trendingHashtags
      .slice(0, 5)
      .join(" ")}`,
    11.5,
    "bold",
    [131, 24, 67]
  );

  doc.save(makeSafeFilename(result.concept.title, "reel-pack", "pdf"));
}

export function buildPrintableEbookHtml(result: EbookGenerationResult): string {
  const safeEditionTag = (
    result.ebook.editionTag ||
    "PRIVATE 2026 PLAYBOOK · NO GATEKEEPING EDITION"
  )
    .replace(/glowcash(\s+ai\s+studio)?/gi, "PRIVATE PLAYBOOK")
    .replace(/CLASSIFIED\s*1%\s*INSIDER\s*DOSSIER/gi, "PRIVATE 2026 PLAYBOOK")
    .replace(/GREY-HAT\s*ORACLE\s*EDITION/gi, "NO GATEKEEPING");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${result.ebook.title}</title>
<style>
  @page { size: A4; margin: 16mm; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11.5pt; line-height: 1.68; color: #180920; background: #FAF7FF; max-width: 800px; margin: 24px auto; padding: 32px; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; background: #160926; color: #fff; padding: 14px 20px; border-radius: 12px; margin-bottom: 24px; font-family: sans-serif; border: 1px solid #EC4899; }
  .print-btn { background: linear-gradient(90deg, #EC4899, #9333EA); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 11pt; }
  .cover-box { background: linear-gradient(135deg, #160828 0%, #2A0E46 100%); color: #FFFFFF; padding: 28px; border-radius: 16px; border-left: 6px solid #EC4899; margin-bottom: 24px; }
  .badge { display: inline-block; background: #831843; color: #FDE047; padding: 5px 12px; border-radius: 6px; font-weight: bold; font-size: 9pt; letter-spacing: 0.5px; text-transform: uppercase; }
  .cover-box h1 { font-size: 21pt; color: #FFFFFF; margin: 14px 0 8px 0; line-height: 1.25; }
  .cover-box p { color: #FBCFE8; margin: 0; font-size: 11.2pt; }
  h2 { font-size: 14.5pt; color: #3B0764; margin-top: 24px; border-bottom: 2px solid #E9D5FF; padding-bottom: 6px; }
  .warning-strip { background: #FFFBEB; border: 1px solid #F59E0B; border-left: 5px solid #D97706; color: #78350F; padding: 12px 16px; border-radius: 10px; margin: 12px 0; font-size: 10.5pt; }
  .illusion-box { background: #FAF5FF; border: 1px solid #D8B4FE; border-left: 5px solid #9333EA; padding: 15px 18px; border-radius: 10px; margin: 14px 0; page-break-inside: avoid; }
  .secret-box { background: #FDF2F8; border: 1px solid #F472B6; border-left: 5px solid #DB2777; padding: 15px 18px; border-radius: 10px; margin: 14px 0; page-break-inside: avoid; }
  .script-box { background: #1E1030; color: #FCE7F3; border: 1px solid #A855F7; padding: 16px 18px; border-radius: 10px; margin: 14px 0; page-break-inside: avoid; }
  .advantage-box { background: #ECFDF5; border: 1px solid #6EE7B7; border-left: 5px solid #059669; color: #064E3B; padding: 14px 18px; border-radius: 10px; margin: 14px 0; font-weight: 600; page-break-inside: avoid; }
  .chapter-card { border: 1px solid #E9D5FF; background: #FFFFFF; padding: 24px; border-radius: 16px; margin-bottom: 28px; box-shadow: 0 4px 16px rgba(59, 7, 100, 0.06); page-break-inside: avoid; }
  .chapter-header { background: #1E0B36; color: #FFFFFF; padding: 12px 18px; border-radius: 10px; font-size: 13pt; font-weight: bold; border-left: 5px solid #EC4899; margin-bottom: 12px; }
  .section-label { font-size: 9.2pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; display: block; margin-bottom: 6px; }
  ul, ol { padding-left: 22px; }
  li { margin-bottom: 8px; }
  @media print { .no-print { display: none !important; } body { margin: 0; padding: 0; background: #FFFFFF; } .script-box { background: #F5F3FF !important; color: #1E1030 !important; } }
</style>
</head>
<body>
  <div class="top-bar no-print">
    <div><strong>Private 2026 Playbook · Clean Printable Edition</strong></div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="cover-box">
    <div class="badge">${safeEditionTag} · Access: ${result.priceDisplay} (Value ${result.anchorPriceDisplay})</div>
    <h1>${result.ebook.title}</h1>
    <p>${result.ebook.subtitle}</p>
  </div>
  <p><em>${result.ebook.targetReaderPromise}</em></p>
  <div class="warning-strip"><strong>${result.ebook.goldenRuleTitle}:</strong><br/>${result.ebook.goldenRuleBody}</div>
  ${
    result.ebook.hardestPartSolvedBox
      ? `<div class="secret-box"><span class="section-label" style="color:#9D174D;">${result.ebook.hardestPartSolvedBox.title}</span><ul>${(
          result.ebook.hardestPartSolvedBox.exactWhereToFindMap || []
        )
          .map((m) => `<li>${m}</li>`)
          .join("")}</ul><p><strong>Starting From Zero Shortcut:</strong> ${
          result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick
        }</p></div>`
      : ""
  }
  <h2>Quick Overview</h2>
  <ul>${result.ebook.quickValueBreakdown
    .map((i) => `<li><strong>${i.metric}:</strong> ${i.detail}</li>`)
    .join("")}</ul>
  ${result.ebook.chapters
    .map((c) => {
      const cleanSub = (c.subtitle || "")
        .replace(/^⚠️?\s*WARNING:\s*Keep this strictly confidential\.?\s*[—–-]?\s*/i, "")
        .trim();
      const cleanScriptLabel = (c.copyPasteTemplateOrScript.label || "Copy-Paste Cheat Sheet")
        .replace(/^🧠\s*/i, "")
        .replace(/The\s+Jedi\s+Mind-?Trick\s*\/?\s*(?:Secret\s*)?/i, "Copy-Paste ");
      return `
    <div class="chapter-card">
      <div class="chapter-header">0${c.chapterNumber} · ${c.title}</div>
      ${cleanSub ? `<div class="warning-strip"><strong>real talk:</strong> ${cleanSub}</div>` : ""}
      <div class="illusion-box">
        <span class="section-label" style="color:#6B21A8;">What Everyone Gets Wrong (vs. What Actually Works)</span>
        <div>${c.coreSecretSummary}</div>
      </div>
      ${
        c.whereToFindOrHiddenTrick
          ? `<div class="secret-box">
              <span class="section-label" style="color:#9D174D;">The Actual Shortcut (Zero Gatekeeping)</span>
              <div>${c.whereToFindOrHiddenTrick}</div>
            </div>`
          : ""
      }
      <p><strong style="text-transform:uppercase;font-size:10pt;color:#831843;">Do This Step-by-Step:</strong></p>
      <ol>${c.stepByStepExecution.map((s) => `<li>${s}</li>`).join("")}</ol>
      ${
        Array.isArray(c.exactToolsOrWebsites) &&
        c.exactToolsOrWebsites.length > 0
          ? `<p><strong style="text-transform:uppercase;font-size:10pt;color:#4B5563;">Exact Links & Free Tools:</strong></p><ul>${c.exactToolsOrWebsites
              .map(
                (t) =>
                  `<li><strong>${t.name}</strong> (${t.role}): ${t.insiderTip}</li>`
              )
              .join("")}</ul>`
          : ""
      }
      <div class="script-box">
        <span class="section-label" style="color:#F472B6;">${cleanScriptLabel}:</span>
        <pre style="white-space:pre-wrap;font-family:monospace;font-size:10.5pt;margin:0;">${c.copyPasteTemplateOrScript.content}</pre>
      </div>
      <div class="advantage-box">
        Real Numbers & Takeaway: ${c.incomeMathOrProof}
      </div>
    </div>
  `;
    })
    .join("")}
  <h2>24-Hour Action Checklist</h2>
  <ul>${result.ebook.twentyFourHourChecklist
    .map((i) => `<li>[ ] ${i}</li>`)
    .join("")}</ul>
</body>
</html>`;
}

export function downloadEbookAsHtml(result: EbookGenerationResult): void {
  const htmlContent = buildPrintableEbookHtml(result);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = makeSafeFilename(result.ebook.title, "printable-ebook", "html");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadEbookAsWordDoc(result: EbookGenerationResult): void {
  const htmlContent = buildPrintableEbookHtml(result);
  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = makeSafeFilename(result.ebook.title, "editable-ebook", "doc");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
