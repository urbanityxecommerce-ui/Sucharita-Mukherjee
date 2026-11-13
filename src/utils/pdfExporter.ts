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

  // =========================================================================
  // 100% WHITE-LABEL COVER HEADER BANNER (Zero "GlowCash" Mention)
  // =========================================================================
  doc.setFillColor(34, 13, 56); // Deep luxury plum
  doc.roundedRect(margin, y, contentWidth, 118, 10, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(244, 114, 182); // Pink accent
  doc.text(
    cleanPdfText(
      `PRIVATE INSIDER EDITION  |  SPECIAL ACCESS: ${result.priceDisplay} (VALUE ${result.anchorPriceDisplay})`
    ).toUpperCase(),
    margin + 18,
    y + 24
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16.5);
  doc.setTextColor(255, 255, 255);
  const titleLines: string[] = doc.splitTextToSize(
    cleanPdfText(result.ebook.title),
    contentWidth - 36
  );
  let bannerY = y + 48;
  for (const tLine of titleLines.slice(0, 2)) {
    doc.text(tLine, margin + 18, bannerY);
    bannerY += 20;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(249, 208, 234);
  const subLines: string[] = doc.splitTextToSize(
    cleanPdfText(result.ebook.subtitle),
    contentWidth - 36
  );
  for (const sLine of subLines.slice(0, 2)) {
    doc.text(sLine, margin + 18, bannerY);
    bannerY += 14;
  }

  y += 136;

  // Target Reader Promise
  if (result.ebook.targetReaderPromise) {
    writeWrappedText(
      `Core Promise: ${result.ebook.targetReaderPromise}`,
      11.5,
      "italic",
      [88, 28, 135],
      0,
      1.45
    );
    y += 8;
  }

  // =========================================================================
  // GOLDEN RULE CALLOUT BOX
  // =========================================================================
  const goldenRuleText = cleanPdfText(result.ebook.goldenRuleBody);
  const goldenLines: string[] = doc.splitTextToSize(
    goldenRuleText,
    contentWidth - 28
  );
  const goldenBoxHeight = 34 + goldenLines.length * 16;
  ensureSpace(goldenBoxHeight + 12);

  doc.setFillColor(253, 242, 248);
  doc.setDrawColor(236, 72, 153);
  doc.roundedRect(margin, y, contentWidth, goldenBoxHeight, 8, 8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(157, 23, 77);
  doc.text(
    cleanPdfText(result.ebook.goldenRuleTitle || "The 1% Golden Rule"),
    margin + 14,
    y + 18
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(35, 15, 45);
  let gy = y + 36;
  for (const gLine of goldenLines) {
    doc.text(gLine, margin + 14, gy);
    gy += 16;
  }
  y += goldenBoxHeight + 16;

  // =========================================================================
  // THE HARDEST PART SOLVED (MASTERMIND MAP: WHERE TO FIND CLIENTS / LINKS)
  // =========================================================================
  if (result.ebook.hardestPartSolvedBox) {
    ensureSpace(80);
    writeWrappedText(
      result.ebook.hardestPartSolvedBox.title ||
        "THE HARDEST PART SOLVED: EXACT MASTERMIND SOURCE & CLIENT MAP",
      12.5,
      "bold",
      [157, 23, 77]
    );
    y += 4;
    (result.ebook.hardestPartSolvedBox.exactWhereToFindMap || []).forEach(
      (step, idx) => {
        writeWrappedText(
          `${idx + 1}. ${step}`,
          11.5,
          "normal",
          [28, 14, 38],
          8,
          1.45
        );
        y += 3;
      }
    );
    if (result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick) {
      writeWrappedText(
        `Zero-Follower Mastermind Trick: ${result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick}`,
        11.5,
        "bold",
        [88, 28, 135],
        8,
        1.45
      );
    }
    y += 12;
  }

  // =========================================================================
  // QUICK-START 4-PILLAR OVERVIEW
  // =========================================================================
  if (
    Array.isArray(result.ebook.quickValueBreakdown) &&
    result.ebook.quickValueBreakdown.length > 0
  ) {
    ensureSpace(40);
    writeWrappedText(
      "QUICK-START 4-PILLAR EXECUTION OVERVIEW",
      12.5,
      "bold",
      [131, 24, 67]
    );
    y += 4;

    result.ebook.quickValueBreakdown.forEach((pillar, idx) => {
      writeWrappedText(
        `${idx + 1}. ${pillar.metric}: ${pillar.detail}`,
        11.5,
        "normal",
        [30, 20, 40],
        8,
        1.45
      );
      y += 4;
    });
    y += 10;
  }

  // =========================================================================
  // 5 SIMPLE-ENGLISH CHAPTERS (12PT READABLE FONT)
  // =========================================================================
  result.ebook.chapters.forEach((ch, idx) => {
    ensureSpace(80);

    // Chapter Divider Header
    doc.setFillColor(245, 240, 255);
    doc.setDrawColor(192, 132, 252);
    doc.roundedRect(margin, y, contentWidth, 30, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(88, 28, 135);
    doc.text(
      cleanPdfText(
        `CHAPTER 0${ch.chapterNumber || idx + 1}: ${ch.title}`
      ).toUpperCase(),
      margin + 12,
      y + 19
    );
    y += 42;

    if (ch.subtitle) {
      writeWrappedText(
        `Focus: ${ch.subtitle}`,
        11.5,
        "bold",
        [157, 23, 77],
        0,
        1.4
      );
      y += 4;
    }

    // Core 1% Secret Summary (12pt body)
    writeWrappedText(
      ch.coreSecretSummary,
      12,
      "normal",
      [24, 15, 34],
      0,
      1.48
    );
    y += 8;

    // Mastermind "Where to Find It / Hidden Shortcut" Box
    if (ch.whereToFindOrHiddenTrick) {
      writeWrappedText(
        `Mastermind Shortcut (Where & How to Find It): ${ch.whereToFindOrHiddenTrick}`,
        11.5,
        "bold",
        [131, 24, 67],
        6,
        1.44
      );
      y += 6;
    }

    // Step-by-Step Execution
    if (
      Array.isArray(ch.stepByStepExecution) &&
      ch.stepByStepExecution.length > 0
    ) {
      writeWrappedText(
        "Step-by-Step Action Plan:",
        11.5,
        "bold",
        [88, 28, 135]
      );
      y += 2;
      ch.stepByStepExecution.forEach((step, sIdx) => {
        writeWrappedText(
          `${sIdx + 1}. ${step}`,
          12,
          "normal",
          [30, 20, 40],
          10,
          1.45
        );
        y += 3;
      });
      y += 6;
    }

    // Exact Websites / Tools
    if (
      Array.isArray(ch.exactToolsOrWebsites) &&
      ch.exactToolsOrWebsites.length > 0
    ) {
      writeWrappedText(
        "Exact Websites, Portals & Free Tools to Use:",
        11.5,
        "bold",
        [131, 24, 67]
      );
      y += 2;
      ch.exactToolsOrWebsites.forEach((tool) => {
        writeWrappedText(
          `- ${tool.name} (${tool.role}): ${tool.insiderTip}`,
          11.5,
          "normal",
          [45, 25, 60],
          10,
          1.42
        );
        y += 2;
      });
      y += 6;
    }

    // Copy-Paste Script / Prompt Box
    if (ch.copyPasteTemplateOrScript?.content) {
      const scriptLabel = cleanPdfText(
        ch.copyPasteTemplateOrScript.label || "Copy-Paste Template / Script"
      );
      const scriptLines: string[] = doc.splitTextToSize(
        cleanPdfText(ch.copyPasteTemplateOrScript.content),
        contentWidth - 24
      );
      const boxH = 30 + scriptLines.length * 14.5;
      ensureSpace(boxH + 10);

      doc.setFillColor(250, 245, 255);
      doc.setDrawColor(216, 180, 254);
      doc.roundedRect(margin, y, contentWidth, boxH, 6, 6, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(107, 33, 168);
      doc.text(scriptLabel, margin + 12, y + 16);

      doc.setFont("courier", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 15, 45);
      let sy = y + 32;
      for (const sLine of scriptLines) {
        doc.text(sLine, margin + 12, sy);
        sy += 14.5;
      }
      y += boxH + 10;
    }

    // Outcome / Proof
    if (ch.incomeMathOrProof) {
      writeWrappedText(
        `Real-World Proof / Outcome: ${ch.incomeMathOrProof}`,
        11.5,
        "bold",
        [6, 95, 70],
        0,
        1.4
      );
      y += 14;
    }
  });

  // =========================================================================
  // 24-HOUR EXECUTION CHECKLIST
  // =========================================================================
  if (
    Array.isArray(result.ebook.twentyFourHourChecklist) &&
    result.ebook.twentyFourHourChecklist.length > 0
  ) {
    ensureSpace(80);
    writeWrappedText(
      "24-HOUR FAST-ACTION IMPLEMENTATION CHECKLIST",
      13,
      "bold",
      [131, 24, 67]
    );
    y += 4;
    result.ebook.twentyFourHourChecklist.forEach((item) => {
      writeWrappedText(
        `[ ]  ${item}`,
        12,
        "normal",
        [25, 15, 35],
        8,
        1.45
      );
      y += 4;
    });
    y += 14;
  }

  // Add 100% White-Label Footer Page Numbers on every page (NO GlowCash branding!)
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 100, 140);
    doc.text(
      cleanPdfText(
        `${result.ebook.title.slice(0, 58)}  |  Page ${p} of ${totalPages}`
      ),
      margin,
      pageHeight - 22
    );
  }

  doc.save(makeSafeFilename(result.ebook.title, "12pt-playbook", "pdf"));
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
  const safeEditionTag = (result.ebook.editionTag || "2026 PRIVATE INSIDER EDITION · ZERO FLUFF").replace(
    /glowcash(\s+ai\s+studio)?/gi,
    "PRIVATE INSIDER"
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${result.ebook.title}</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 12pt; line-height: 1.75; color: #180920; background: #FFFDF9; max-width: 780px; margin: 28px auto; padding: 32px; }
  .top-bar { display: flex; justify-content: space-between; align-items: center; background: #220D38; color: #fff; padding: 14px 20px; border-radius: 12px; margin-bottom: 24px; font-family: sans-serif; }
  .print-btn { background: #EC4899; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 11pt; }
  h1 { font-size: 24pt; color: #3B0764; margin-bottom: 8px; line-height: 1.25; }
  h2 { font-size: 15.5pt; color: #831843; margin-top: 28px; border-bottom: 2px solid #FBCFE8; padding-bottom: 6px; }
  .badge { display: inline-block; background: #FCE7F3; color: #9D174D; padding: 5px 12px; border-radius: 6px; font-weight: bold; font-size: 10pt; font-family: sans-serif; }
  .box { background: #FDF2F8; border: 1px solid #F9A8D4; padding: 16px; border-radius: 10px; margin: 16px 0; page-break-inside: avoid; }
  .trick-box { background: #F3E8FF; border: 1px solid #C084FC; padding: 14px; border-radius: 10px; margin: 12px 0; page-break-inside: avoid; }
  .chapter-card { border: 1px solid #F3E8FF; background: #FFFFFF; padding: 20px; border-radius: 12px; margin-bottom: 22px; page-break-inside: avoid; }
  ul, ol { padding-left: 22px; }
  li { margin-bottom: 8px; }
  @media print { .no-print { display: none !important; } body { margin: 0; padding: 0; background: #FFFFFF; } }
</style>
</head>
<body>
  <div class="top-bar no-print">
    <div><strong>12pt Printable Executive Playbook</strong></div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="badge">${safeEditionTag} · Offer Price: ${result.priceDisplay} (Value ${result.anchorPriceDisplay})</div>
  <h1>${result.ebook.title}</h1>
  <p><strong>${result.ebook.subtitle}</strong></p>
  <p><em>${result.ebook.targetReaderPromise}</em></p>
  <div class="box"><strong>${result.ebook.goldenRuleTitle}:</strong><br/>${result.ebook.goldenRuleBody}</div>
  ${
    result.ebook.hardestPartSolvedBox
      ? `<div class="trick-box"><strong>${result.ebook.hardestPartSolvedBox.title}:</strong><ul>${(
          result.ebook.hardestPartSolvedBox.exactWhereToFindMap || []
        )
          .map((m) => `<li>${m}</li>`)
          .join("")}</ul><p><strong>Zero-Follower Mastermind Trick:</strong> ${
          result.ebook.hardestPartSolvedBox.zeroFollowerTrafficTrick
        }</p></div>`
      : ""
  }
  <h2>Quick-Start 4-Pillar Overview</h2>
  <ul>${result.ebook.quickValueBreakdown
    .map((i) => `<li><strong>${i.metric}:</strong> ${i.detail}</li>`)
    .join("")}</ul>
  ${result.ebook.chapters
    .map(
      (c) => `
    <div class="chapter-card">
      <h2>Chapter 0${c.chapterNumber}: ${c.title}</h2>
      <p><em><strong>${c.subtitle}</strong></em></p>
      <p>${c.coreSecretSummary}</p>
      ${
        c.whereToFindOrHiddenTrick
          ? `<div class="trick-box"><strong>🎯 Mastermind Shortcut (Where & How to Find It):</strong><br/>${c.whereToFindOrHiddenTrick}</div>`
          : ""
      }
      <p><strong>Step-by-Step Action Plan:</strong></p>
      <ol>${c.stepByStepExecution.map((s) => `<li>${s}</li>`).join("")}</ol>
      ${
        Array.isArray(c.exactToolsOrWebsites) &&
        c.exactToolsOrWebsites.length > 0
          ? `<p><strong>Exact Websites & Tools:</strong></p><ul>${c.exactToolsOrWebsites
              .map(
                (t) =>
                  `<li><strong>${t.name}</strong> (${t.role}): ${t.insiderTip}</li>`
              )
              .join("")}</ul>`
          : ""
      }
      <div class="box"><strong>${c.copyPasteTemplateOrScript.label}:</strong><br/><pre style="white-space:pre-wrap;font-family:monospace;font-size:10.5pt;">${c.copyPasteTemplateOrScript.content}</pre></div>
      <p><strong>Real-World Proof / Outcome:</strong> ${c.incomeMathOrProof}</p>
    </div>
  `
    )
    .join("")}
  <h2>24-Hour Fast-Action Checklist</h2>
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
