import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import {
  buildMasterPrompts,
  CURATED_REEL_IDEA_BANK,
  UNIQUE_STYLING_COMBINATION_MATRIX,
  getRealTimeDailyStylingContext,
  sanitizeMeeshoSearchTerm,
  enforceMastermindViralReelPack,
  isSlopHook,
  ReelGenerationResult,
  EbookGenerationResult,
  SearchTermItem,
  boostUserIdeaOptions,
  synthesizeCustomSimilarOutfitReelPack,
  UploadedGarmentPreview,
  StylistVerdictHinglish,
} from "./src/data/playbookData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

const GROQ_FALLBACK_KEY =
  process.env.GROQ_API_KEY ||
  "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";
const OPENROUTER_FALLBACK_KEY =
  process.env.OPENROUTER_API_KEY ||
  "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";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function callOpenAICompatibleJSON(
  endpoint: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = 14000
): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.88,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Provider ${model} status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    return JSON.parse(cleaned);
  } finally {
    clearTimeout(timeout);
  }
}

function synthesizeExpertReelFallback(
  themeInput: string,
  categoryFilter: string,
  backgroundDesc: string,
  variationIndex = 0
): ReelGenerationResult {
  const dailyCtx = getRealTimeDailyStylingContext(variationIndex);
  const comboPool =
    categoryFilter && categoryFilter !== "All"
      ? UNIQUE_STYLING_COMBINATION_MATRIX.filter(
          (item) => item.category === categoryFilter
        )
      : UNIQUE_STYLING_COMBINATION_MATRIX;
  const activePool =
    comboPool.length > 0 ? comboPool : UNIQUE_STYLING_COMBINATION_MATRIX;

  const chosenCombo =
    activePool[
      (dailyCtx.dayOfYear + Math.abs(Number(variationIndex) || 0)) %
        activePool.length
    ] || UNIQUE_STYLING_COMBINATION_MATRIX[0];

  const hasCustomInput = themeInput && themeInput.trim().length > 0;
  const baseTopic = hasCustomInput ? themeInput.trim() : chosenCombo.comboName;

  const cleanUserProductWord = hasCustomInput
    ? sanitizeMeeshoSearchTerm(baseTopic, 0)
    : "";
  const isShortProductKeyword =
    hasCustomInput &&
    baseTopic.split(" ").length <= 5 &&
    !/zodiac|birth month|personality|playlist|fictional|choose a number/i.test(
      baseTopic
    );

  const searchTerms: SearchTermItem[] = chosenCombo.pieces.map((piece, idx) => {
    if (idx === 0 && isShortProductKeyword && cleanUserProductWord) {
      return {
        ...piece,
        itemLabel: `Piece 1 · Hero Statement Top (${baseTopic})`,
        exactKeyword: `Women ${cleanUserProductWord} Square Neck Fitted Short Kurti Top`,
        backupSearchKeywords: [
          `${cleanUserProductWord} embroidered cotton women`,
          ...(piece.backupSearchKeywords || []).slice(0, 1),
        ],
      };
    }
    return {
      ...piece,
      exactKeyword: sanitizeMeeshoSearchTerm(piece.exactKeyword, idx),
    };
  });

  const displayTitle = hasCustomInput
    ? `${baseTopic} — 4-Piece Look-Transformation Styling Combo`
    : chosenCombo.comboName;

  const prompts = buildMasterPrompts(
    searchTerms,
    backgroundDesc,
    displayTitle,
    chosenCombo.howToCombineAllFourPieces
  );

  const reelPack = enforceMastermindViralReelPack(
    searchTerms,
    displayTitle,
    chosenCombo.howToCombineAllFourPieces,
    undefined,
    variationIndex
  );

  return {
    id: `reel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    themeInput: baseTopic,
    providerUsed: `2026 Live Daily Styling AI (${dailyCtx.formattedDate})`,
    concept: {
      title: displayTitle,
      category: chosenCombo.category,
      liveDailyTrendTag: `${dailyCtx.liveDailyTrendTag} · ${dailyCtx.todaysStylingFocus}`,
      curiosityIdentityAngle: chosenCombo.simpleVibeSummary,
      firstTwoSecondVisual:
        "0.0s–1.5s: Ek realistic faceless female hand charon matching kapdon ko upar se ek saath pakad kar dikha raha hai (bina hanger ke), piche aapka chuna hua room background hai.",
      whyItTriggersSharesAndSaves:
        "Ladkiyan is Reel ko turant Save aur apni bestie ko Share karti hain kyunki isme random kapde nahi, balki 4-piece Mix & Match styling formula aur exact Meesho search names diye gaye hain.",
      lookTransformationFormula: {
        beforeVsAfterLook: chosenCombo.beforeVsAfterLook,
        howToCombineAllFourPieces: chosenCombo.howToCombineAllFourPieces,
        threeWaysToRestyleCombo: chosenCombo.threeWaysToRestyleCombo,
      },
      colorPalette: chosenCombo.colorPalette,
      shotByShotPlan: [
        {
          timeRange: "0.0s – 1.5s",
          visualAction:
            "Haath mein pakde hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke halka sa move karte hue dikhao.",
          onScreenText: reelPack.onScreenHooks[0],
        },
        {
          timeRange: "1.5s – 3.0s",
          visualAction:
            "Full-Body Look ya Faceless Mirror Model (Prompt 0A/0B ya Prompt 5): Model ne Piece 1 + Piece 2 ek saath pehna hua hai.",
          onScreenText: `Piece 1 + 2: ${searchTerms[0].exactKeyword.replace(/^Women\s+/i, "").slice(0, 30)} + High-Waist Fit`,
        },
        {
          timeRange: "3.0s – 4.5s",
          visualAction:
            "Piece 3 (Waist Chain / Layer Detail) ka close-up shot aur Meesho search bar ka screenshot dikhao.",
          onScreenText: `The Secret 3rd Piece That Fixes Your Waistline: ${searchTerms[2].exactKeyword.replace(/^Women\s+/i, "").slice(0, 26)}`,
        },
        {
          timeRange: "4.5s – 6.0s",
          visualAction:
            "Ek haath mein Piece 4 (Bag & Jewelry Completer) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText:
            "Comment 'LINK' below & check your DM in 5s before Piece 1 goes out of stock! 😭",
        },
      ],
    },
    searchTerms,
    prompts,
    reelPack,
  };
}

// Helper to scrub any accidental "GlowCash" mention AND any AI-hallucinated UI filters/myths from white-label Ebook strings
function stripBrandFromEbookText(input: string): string {
  return String(input || "")
    .replace(/GlowCash AI Studio/gi, "2026 Insider Vault")
    .replace(/GlowCash Edition/gi, "2026 Private Insider Edition")
    .replace(/GlowCash/gi, "Insider")
    .replace(/1\.5[x×]\s*royalty(\s*rate|\s*batch)?/gi, "clean < -60dB noise floor (required to pass moderation)")
    .replace(/low[-‑\s]traffic\s*batch/gi, "zero-background-noise recording window")
    .replace(/sort\s*by\s*["“']?No\s*Instagram\s*DM["”']?/gi, "tick Left Sidebar -> Business Type: Manufacturer + TrustSEAL Verified")
    .replace(/["“']?No\s*Instagram\s*DM["”']?\s*filter/gi, "Left Sidebar 'Business Type: Manufacturer' filter")
    .replace(/set\s*["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "select City: Surat/Jaipur + Left Sidebar: Business Type -> Manufacturer")
    .replace(/["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "Business Type: Manufacturer + TrustSEAL Verified");
}

// POST /api/boost-idea — Instant 2026 Idea Booster (Supports Both Tab 1 Fashion Combinations & Tab 2 High-FOMO Ebooks)
app.post("/api/boost-idea", async (req, res) => {
  const { rawInput = "", category = "All", mode = "reel" } = req.body || {};
  const boostedOptions = boostUserIdeaOptions(rawInput, category);
  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);

  const isEbookMode =
    mode === "ebook" ||
    String(category).toLowerCase().includes("ebook") ||
    String(category).toLowerCase().includes("certif") ||
    String(category).toLowerCase().includes("secret") ||
    String(category).toLowerCase().includes("client") ||
    String(category).toLowerCase().includes("skincare") ||
    String(category).toLowerCase().includes("income");

  if (GROQ_FALLBACK_KEY) {
    try {
      const systemPrompt = isEbookMode
        ? `You are a Late-2026 / 2027 Underground Digital Guide & Insider Knowledge Strategist in India.
Turn the user's raw topic and category ("${category}") into 4 completely different, extreme-FOMO, zero-fluff Ebook Playbook titles in SUPER-SIMPLE ENGLISH.
RULES:
1. NO generic "hawa-hawa" titles like "How to Make Money Online", "Start Affiliate Marketing", or "Resell PDFs".
2. Use 100% verified, jaw-dropping 2026–2027 underground systems: ElevenLabs Voice Library Passive USD Royalties (elevenlabs.io), IndiaMART TrustSEAL Wholesale Factory AI Catalog Arbitrage (dir.indiamart.com), $10/15-Min Speak-Out-Loud Software Testing (usertesting.com / trymata.com / dscout.com), Adobe Stock AI Copy-Space Vectors (contributor.stock.adobe.com), Free Verified Certificates (Harvard CS50x, Tata/JPMorgan Forage), or ₹150 Indian Pharmacy Generic Salt Dupes (Aziderm, Glyco-6, Hyalugel).
3. Never use the word "GlowCash".
Return strictly compact JSON: {"boostedIdeas": ["title 1", "title 2", "title 3", "title 4"]}`
        : `You are a "Lakho Mein Ek" Real-Time Personal Stylist & Meesho Mix-and-Match Outfit Combination Expert in India (Live Date: ${dailyCtx.formattedDate} | Today's Daily Focus: ${dailyCtx.todaysStylingFocus}).
Turn the user's raw fashion keyword into 4 completely different, unique, non-generic 4-Piece Outfit Combination & Look-Transformation ideas in SUPER-SIMPLE, EASY-TO-UNDERSTAND ENGLISH.
RULES:
1. NEVER suggest generic "Top 5 Kurtis". Instead, combine 4 specific pieces with Exact-Inch Body-Proportion Math (e.g., "19-Inch Wine Square-Neck Short Kurti + 39-Inch High-Rise Flared Bootcut Jeans + Oxidized Kamarbandh + Vintage Baguette Bag").
2. Focus on how the combination transforms the person's look (makes 5'0" girls look 5'5", hides lower tummy on Pear/Mid-Size bodies, glows on warm Indian skin, or builds a complete 4-piece look under ₹1,199).
3. Use simple, everyday English words.
Return strictly compact JSON: {"boostedIdeas": ["combo idea 1", "combo idea 2", "combo idea 3", "combo idea 4"]}`;

      const parsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        systemPrompt,
        `Raw Input: "${rawInput || (isEbookMode ? "2026-2027 Underground Insider Guide" : "Unique 4-Piece Kurti & Jeans Body-Proportion Styling Combination")}" | Category: "${category}" | Live Date: ${dailyCtx.formattedDate} | Seed: ${Date.now()}`,
        8000
      );
      if (Array.isArray(parsed?.boostedIdeas) && parsed.boostedIdeas.length > 0) {
        return res.json({
          boostedIdeas: parsed.boostedIdeas
            .slice(0, 4)
            .map((t: any) => stripBrandFromEbookText(String(t))),
        });
      }
    } catch {
      // Fall through to local booster
    }
  }

  return res.json({ boostedIdeas: boostedOptions });
});

// POST /api/generate-reel
app.post("/api/generate-reel", async (req, res) => {
  const {
    themeInput = "",
    categoryFilter = "All",
    backgroundDesc = "Realistic warm cream plaster wall with a lush indoor plant in soft afternoon sunlight",
    variationIndex = 0,
  } = req.body || {};

  const dailyCtx = getRealTimeDailyStylingContext(Number(variationIndex));

  const comboPool =
    categoryFilter && categoryFilter !== "All"
      ? UNIQUE_STYLING_COMBINATION_MATRIX.filter(
          (item) => item.category === categoryFilter
        )
      : UNIQUE_STYLING_COMBINATION_MATRIX;
  const activePool =
    comboPool.length > 0 ? comboPool : UNIQUE_STYLING_COMBINATION_MATRIX;
  const randomCombo =
    activePool[
      (dailyCtx.dayOfYear +
        Math.floor(Math.random() * activePool.length) +
        Number(variationIndex)) %
        activePool.length
    ] || UNIQUE_STYLING_COMBINATION_MATRIX[0];

  const effectiveTheme =
    themeInput && themeInput.trim().length > 0
      ? themeInput.trim()
      : `${randomCombo.comboName} (${randomCombo.simpleVibeSummary})`;

  const jsonSchemaPrompt = `You are a Late-2026 / 2027 "Lakho Mein Ek" (1-in-100,000) Instagram Reels Algorithm Mastermind, Celebrity Indian Gen-Z Stylist & Meesho/Myntra Catalog Search Engineer in India.
LIVE REAL-TIME DATE CONTEXT: Today is ${dailyCtx.formattedDate}. Today's Live Daily Styling Focus is: "${dailyCtx.todaysStylingFocus}".
Your job is to create a 100% UNIQUE, NON-GENERIC 4-Piece Mix-and-Match Outfit Combination & Viral Reel Pack for: "${effectiveTheme}".

HOW TO MAKE THIS REEL "LAKHO MEIN EK" (STAND OUT FROM LAKHS OF NORMAL MEESHO CREATORS):
- Normal creators just show random kurtis. YOU must include:
  1. Exact-Inch 30:70 Body-Proportion Math (e.g., 19-inch Short Top/Kurti + 39-inch High-Waist Flared Bottom + Waist-Defining 3rd Piece) OR Tummy-Hide / Height Illusion math.
  2. The 1-Second Real Customer Review Reality Check (tell the creator in Shot 3 to flash a real Meesho customer review photo for 1 second to build instant 100% buyer trust).

CRITICAL TWO-LAYER LANGUAGE RULE (VIOLATION IS STRICTLY FORBIDDEN):
1. LAYER 1 — EASY HINGLISH FOR USER UNDERSTANDING ("Jo creator ko samajhne ke liye hai"):
   - Write ALL styling explanations, how to wear/combine the clothes, review checks, and video shooting instructions in SUPER-SIMPLE, FRIENDLY HINGLISH (Roman Hindi + simple English words) so the user can understand how to style the outfit effortlessly!
   - Specifically, these fields MUST be in EASY HINGLISH:
     * "curiosityIdentityAngle" (e.g., "Normal kurti-leggings pehenne ke bajaye ye 4-piece 30:70 proportion combo aapki height 4 inch lambi aur waist slim dikhata hai.")
     * "firstTwoSecondVisual" (e.g., "0.0s–1.5s: Ek realistic faceless female hand charon matching kapdon ko bina hanger ke ek saath pakad kar dikha raha hai.")
     * "whyItTriggersSharesAndSaves" (e.g., "Ladkiyan is Reel ko turant Save aur bestie ko Share karengi kyunki isme exact-inch body math, 1-second real review proof aur exact Meesho search names hain.")
     * "lookTransformationFormula.beforeVsAfterLook" (e.g., "Pehle (Basic Look): ... Ab (New Styled Look): ...")
     * "lookTransformationFormula.howToCombineAllFourPieces" (e.g., "Sabse pehle Piece 1 ko Piece 2 ke saath high-waist pehno, phir kamar par Piece 3 lagao aur Piece 4 carry karo...")
     * "lookTransformationFormula.threeWaysToRestyleCombo" (3 easy Hinglish ways to wear the combo)
     * "shotByShotPlan[].visualAction" (Easy Hinglish instruction on what to show in that 1.5s clip)
     * "searchTerms[].howToCombineAndStyle" (Easy Hinglish tip on how to wear/style that specific item)
     * "searchTerms[].fabricAndFitCheck" (Easy Hinglish tip on what to check in Meesho customer review photos)

2. LAYER 2 — 100% CLEAN ENGLISH FOR EXTERNAL USE / COPY-PASTE ("Jo copy karke use karne ke liye hai"):
   - Everything the user copies to paste into Meesho, ChatGPT/AI, or Instagram MUST be in 100% PURE, CLEAN ENGLISH:
     * "concept.title" -> 100% Clean English
     * "shotByShotPlan[].onScreenText" -> 100% Clean, Viral Human-Toned English
     * "searchTerms[].exactKeyword" & "searchTerms[].backupSearchKeywords" -> 100% Pure English Meesho Catalog Keywords (5 to 8 simple product words: "Women + [Color] + [Neck/Sleeve/Fit] + [Fabric] + [Item Name]")
     * "reelPack.onScreenHooks" -> 3 Human-Toned Viral English Hooks (10 to 16 words each, ZERO commercial AI slop!)
     * "reelPack.hinglishCaption" -> 100% Clean, Relatable Viral English Caption (with "Comment LINK" Auto-DM trigger)
     * "reelPack.seoKeywords" -> 10 Real English Meesho/Instagram Search Phrases
     * "reelPack.trendingHashtags" -> Strictly 5 lowercase English Indian fashion hashtags (e.g., ["#meeshofinds", "#shortkurtistyling", "#kurtijeanscombo", "#petitefashionindia", "#meeshohaul"])

CRITICAL ANTI-AI-SLOP & VIRAL PSYCHOLOGY RULES:
- NEVER write cheesy corporate ad slogans like "Feel the softness, own the chill", "Two vibes, one wardrobe switch", or "Swipe up, match your mood today".
- Write 3 hyper-relatable 10-to-16-word English hooks in "onScreenHooks" (Mistake/Proportion hook, Price-Shock + Wait-for-Piece-3 hook, and Bestie DM-Share hook).
- NEVER invent fake camelCase hashtags like "#SoftHeartStyle" or "#ColdAuraVibe".

Return strictly valid JSON with this exact structure:
{
  "concept": {
    "title": "100% Clean English Title showing the 4-Piece Combination & Look Transformation",
    "category": "${categoryFilter === "All" ? "2026 Look-Transformer Combo" : categoryFilter}",
    "liveDailyTrendTag": "${dailyCtx.liveDailyTrendTag} · ${dailyCtx.todaysStylingFocus}",
    "curiosityIdentityAngle": "Easy Hinglish 2-sentence explanation of why this 4-piece combination transforms anyone's look",
    "firstTwoSecondVisual": "Easy Hinglish visual description for 0.0s to 1.5s",
    "whyItTriggersSharesAndSaves": "Easy Hinglish explanation of why girls will immediately save and share this reel",
    "lookTransformationFormula": {
      "beforeVsAfterLook": "Easy Hinglish: Pehle (Basic Look): [...] -> Ab (New Styled Look): [...]",
      "howToCombineAllFourPieces": "Easy Hinglish step-by-step guide on how to wear and combine Piece 1 + Piece 2 + Piece 3 + Piece 4 together",
      "threeWaysToRestyleCombo": [
        "1. College / Everyday Look (Easy Hinglish): ...",
        "2. Cafe / Date Night Look (Easy Hinglish): ...",
        "3. Family / Festive Look (Easy Hinglish): ..."
      ]
    },
    "colorPalette": ["Color 1", "Color 2", "Color 3", "Color 4"],
    "shotByShotPlan": [
      {"timeRange": "0.0s – 1.5s", "visualAction": "Easy Hinglish shooting instruction", "onScreenText": "100% Clean English relatable 10-14 word stop-scroll hook"},
      {"timeRange": "1.5s – 3.0s", "visualAction": "Easy Hinglish shooting instruction showing 30:70 proportion", "onScreenText": "100% Clean English Piece 1 + Piece 2 proportion secret"},
      {"timeRange": "3.0s – 4.5s", "visualAction": "Easy Hinglish shooting instruction including 1-second Meesho customer review photo proof", "onScreenText": "100% Clean English Secret 3rd Piece reveal"},
      {"timeRange": "4.5s – 6.0s", "visualAction": "Easy Hinglish shooting instruction", "onScreenText": "Comment LINK below & check your DM in 5s before Piece 1 sells out! 😭"}
    ]
  },
  "searchTerms": [
    {
      "itemLabel": "Piece 1 · Upper-Body Hero Top",
      "exactKeyword": "Women [Color] [Neck/Sleeve] [Fabric] [Top/Kurti Name] (100% Pure English)",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how to tuck/wear Piece 1 with Piece 2",
      "priceFilter": "Under ₹349 · 4.1★+",
      "fabricAndFitCheck": "Easy Hinglish tip on what to check in Meesho customer review photos",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 2 · Leg-Lengthening Bottom",
      "exactKeyword": "Women [Color] High Waist [Fit/Style] [Jeans/Trousers/Palazzo] (100% Pure English)",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how this bottom changes body proportions",
      "priceFilter": "Under ₹449 · Free Delivery",
      "fabricAndFitCheck": "Easy Hinglish length and waist check in reviews",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 3 · Secret Third-Piece Layer / Waist Transformer",
      "exactKeyword": "Exact Pure English Meesho catalog search for Waist Chain / Vest / Shrug / Belt / Dupatta",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how Piece 3 upgrades the whole outfit",
      "priceFilter": "Under ₹249 · High Save Value",
      "fabricAndFitCheck": "Easy Hinglish review check",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 4 · Look-Finishing Bag, Footwear & Jewelry",
      "exactKeyword": "Exact Pure English Meesho catalog search for Bag / Jhumka / Footwear",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on finishing the look",
      "priceFilter": "Under ₹299",
      "fabricAndFitCheck": "Easy Hinglish review check",
      "platform": "Meesho"
    }
  ],
  "reelPack": {
    "onScreenHooks": [
      "10-16 word 100% Clean English human-toned Mistake/Gatekeeping/Body-Proportion hook",
      "10-16 word 100% Clean English Price-Shock + Wait-for-Piece-3 watch-time loop hook",
      "10-16 word 100% Clean English Bestie DM-Share relatable hook"
    ],
    "autoDmTriggerWord": "LINK",
    "hinglishCaption": "100% Clean, Relatable Viral English Caption listing all 4 pieces, how to style them together, and telling viewers to comment LINK for instant DM",
    "seoKeywords": ["10 real English Indian Meesho & Instagram search phrases"],
    "trendingHashtags": ["#meeshofinds", "#shortkurtistyling", "#kurtijeanscombo", "#petitefashionindia", "#meeshohaul"]
  }
}`;

  const userPrompt = `Requested Topic / Vibe: "${effectiveTheme}"
Live Date: ${dailyCtx.formattedDate} | Daily Rotation Seed: ${variationIndex}-${Date.now()}
Follow the Two-Layer Language Rule strictly: Easy Hinglish for styling explanations & review checks, and 100% Pure Clean English for Meesho search terms, on-screen hooks, caption, SEO keywords, and 5 hashtags!`;

  let aiParsed: any = null;
  let providerUsed = `2026 Live Daily Styling AI (${dailyCtx.formattedDate})`;

  if (GROQ_FALLBACK_KEY) {
    try {
      aiParsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        jsonSchemaPrompt,
        userPrompt,
        12000
      );
      providerUsed = `GPT-OSS 120B Mastermind Stylist (${dailyCtx.formattedDate})`;
    } catch {
      // Handled fallback
    }
  }

  if (!aiParsed) {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `${jsonSchemaPrompt}\n\n${userPrompt}`,
            config: {
              responseMimeType: "application/json",
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          10000,
          "Gemini 4 Hydrogen"
        );
        if (response.text) {
          aiParsed = JSON.parse(response.text.trim());
          providerUsed = `Gemini 4 Hydrogen Mastermind Stylist (${dailyCtx.formattedDate})`;
        }
      }
    } catch {
      // Handled fallback
    }
  }

  const fallbackData = synthesizeExpertReelFallback(
    effectiveTheme,
    categoryFilter,
    backgroundDesc,
    Number(variationIndex)
  );

  if (!aiParsed || !aiParsed.concept || !Array.isArray(aiParsed.searchTerms)) {
    return res.json(fallbackData);
  }

  const validSearchTerms: SearchTermItem[] =
    aiParsed.searchTerms.length >= 4
      ? aiParsed.searchTerms.slice(0, 4).map((s: any, i: number) => ({
          itemLabel:
            s.itemLabel ||
            fallbackData.searchTerms[i]?.itemLabel ||
            `Piece ${i + 1}`,
          exactKeyword: sanitizeMeeshoSearchTerm(
            s.exactKeyword || fallbackData.searchTerms[i].exactKeyword,
            i
          ),
          backupSearchKeywords:
            Array.isArray(s.backupSearchKeywords) &&
            s.backupSearchKeywords.length > 0
              ? s.backupSearchKeywords
                  .slice(0, 2)
                  .map((b: any) => sanitizeMeeshoSearchTerm(String(b), i))
              : fallbackData.searchTerms[i].backupSearchKeywords,
          howToCombineAndStyle:
            s.howToCombineAndStyle ||
            fallbackData.searchTerms[i].howToCombineAndStyle,
          priceFilter: s.priceFilter || "Under ₹399 · 4.1★+",
          fabricAndFitCheck:
            s.fabricAndFitCheck ||
            fallbackData.searchTerms[i].fabricAndFitCheck,
          platform:
            s.platform === "Myntra" || s.platform === "Both"
              ? s.platform
              : "Meesho",
        }))
      : fallbackData.searchTerms;

  const conceptTitle = aiParsed.concept.title || fallbackData.concept.title;

  const rawFormula = aiParsed.concept.lookTransformationFormula;
  const normalizedFormula = {
    beforeVsAfterLook:
      rawFormula?.beforeVsAfterLook ||
      fallbackData.concept.lookTransformationFormula?.beforeVsAfterLook ||
      "Transforms a basic everyday outfit into a structured, height-elongating Pinterest look.",
    howToCombineAllFourPieces:
      rawFormula?.howToCombineAllFourPieces ||
      fallbackData.concept.lookTransformationFormula
        ?.howToCombineAllFourPieces ||
      "Combine Piece 1 (Fitted Top) with Piece 2 (High-Waist Bottom), add Piece 3 at the waist/neck, and finish with Piece 4.",
    threeWaysToRestyleCombo:
      Array.isArray(rawFormula?.threeWaysToRestyleCombo) &&
      rawFormula.threeWaysToRestyleCombo.length > 0
        ? rawFormula.threeWaysToRestyleCombo.map((r: any) => String(r))
        : fallbackData.concept.lookTransformationFormula
            ?.threeWaysToRestyleCombo || [],
  };

  const masterPrompts = buildMasterPrompts(
    validSearchTerms,
    backgroundDesc,
    conceptTitle,
    normalizedFormula.howToCombineAllFourPieces
  );

  // Enforce 100% Anti-AI-Slop & Viral Psychology on Hooks, Caption, SEO Keywords, and 5 Hashtags!
  const mastermindReelPack = enforceMastermindViralReelPack(
    validSearchTerms,
    conceptTitle,
    normalizedFormula.howToCombineAllFourPieces,
    aiParsed.reelPack,
    Number(variationIndex) + Date.now()
  );

  const finalResult: ReelGenerationResult = {
    id: `reel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    themeInput: effectiveTheme,
    providerUsed,
    concept: {
      title: conceptTitle,
      category: aiParsed.concept.category || fallbackData.concept.category,
      liveDailyTrendTag:
        aiParsed.concept.liveDailyTrendTag ||
        fallbackData.concept.liveDailyTrendTag,
      curiosityIdentityAngle:
        aiParsed.concept.curiosityIdentityAngle ||
        fallbackData.concept.curiosityIdentityAngle,
      firstTwoSecondVisual:
        aiParsed.concept.firstTwoSecondVisual ||
        fallbackData.concept.firstTwoSecondVisual,
      whyItTriggersSharesAndSaves:
        aiParsed.concept.whyItTriggersSharesAndSaves ||
        fallbackData.concept.whyItTriggersSharesAndSaves,
      lookTransformationFormula: normalizedFormula,
      colorPalette:
        Array.isArray(aiParsed.concept.colorPalette) &&
        aiParsed.concept.colorPalette.length > 0
          ? aiParsed.concept.colorPalette
          : fallbackData.concept.colorPalette,
      shotByShotPlan:
        Array.isArray(aiParsed.concept.shotByShotPlan) &&
        aiParsed.concept.shotByShotPlan.length > 0
          ? aiParsed.concept.shotByShotPlan
              .slice(0, 4)
              .map((shot: any, idx: number) => {
                const rawOverlay =
                  typeof shot === "object" && shot?.onScreenText
                    ? String(shot.onScreenText)
                    : "";
                const safeOverlay =
                  !rawOverlay || isSlopHook(rawOverlay)
                    ? fallbackData.concept.shotByShotPlan[idx]?.onScreenText ||
                      mastermindReelPack.onScreenHooks[0]
                    : rawOverlay;
                return {
                  timeRange:
                    typeof shot === "object" && shot?.timeRange
                      ? String(shot.timeRange)
                      : `${(idx * 1.5).toFixed(1)}s – ${(
                          (idx + 1) *
                          1.5
                        ).toFixed(1)}s`,
                  visualAction:
                    typeof shot === "object" && shot?.visualAction
                      ? String(shot.visualAction)
                      : typeof shot === "string"
                      ? shot
                      : fallbackData.concept.shotByShotPlan[idx]?.visualAction ||
                        "Show outfit combination transition",
                  onScreenText: safeOverlay,
                };
              })
          : fallbackData.concept.shotByShotPlan,
    },
    searchTerms: validSearchTerms,
    prompts: masterPrompts,
    reelPack: mastermindReelPack,
  };

  return res.json(finalResult);
});

// POST /api/generate-ebook
app.post("/api/generate-ebook", async (req, res) => {
  const {
    topicInput = "",
    category = "All",
    priceDisplay = "₹19",
    anchorPriceDisplay = "₹1,999",
    autoDmTrigger = "SECRET",
    variationIndex = 0,
  } = req.body || {};

  const defaultTopicsByCategory: Record<string, string> = {
    "2026–2027 Hidden USD & B2B Income Systems":
      "The 2026–2027 Underground USD & B2B Vault: ElevenLabs Voice Library Passive Royalties, IndiaMART Wholesale Factory AI Catalog Arbitrage (₹2,999/Deal) & $10/15-Min UserTesting Secrets",
    "Free Certifications & Career Shortcuts":
      "7 Free Verifiable 2026–2027 Certificates (Harvard CS50x, Tata/JPMorgan/BCG Forage, Google Skillshop & GitHub Student Pack) + LinkedIn 'Past 24 Hours' Direct HR Filter",
    "Underrated 1% Life, Study & AI Hacks":
      "The 2026–2027 Zero-Follower Global Marketplace Vault: Adobe Stock AI Indian Festive Vectors, PromptBase USD Assets & Google NotebookLM 10-Min Mastery",
    "Client Hunting & Zero-Follower Traffic":
      "The IndiaMART Factory & Google Maps 'No-Website' Hunting Bible: How to Close ₹2,999 B2B Catalog Deals in Surat, Jaipur & Moradabad With 0 Followers",
    "Skincare, Glow-Up & Styling Science":
      "The ₹150 Indian Pharmacy Generic Salt Bible: Exact Chemist Equivalents (Aziderm, Glyco-6, Hyalugel) for ₹2,500 Luxury Serums + 1mg Salt Filter Trick",
    "2026 Real Pocket Cashflow & Micro-Business":
      "The 2026–2027 Underground USD & B2B Vault: ElevenLabs Voice Library Passive Royalties, IndiaMART Wholesale Factory AI Catalog Arbitrage & $10/15-Min UserTesting",
  };

  const effectiveTopic =
    topicInput && topicInput.trim().length > 0
      ? topicInput.trim()
      : defaultTopicsByCategory[category] ||
        "The 2026–2027 Underground Vault: ElevenLabs Voice Royalties, IndiaMART B2B Factory AI Catalogs, $10/15-Min UserTesting & Verified Free Portals";

  const jsonSchemaPrompt = `You are a Late-2026 / 2027 Fact-Checked Ground-Truth Systems Architect & Consumer-Protection Researcher.
Write a 100% genuine, fact-checked, zero-hallucination '0.01% working knowledge' Ebook Playbook in SUPER-SIMPLE EVERYDAY ENGLISH specifically about:
Topic: "${effectiveTopic}"
Category: "${category}"
Offer Price: ${priceDisplay} (Perceived Value: ${anchorPriceDisplay}) | Auto-DM Trigger: "${autoDmTrigger}"

STRICT FACT-CHECKED GROUND-TRUTH RULES (ZERO FAKE UI BUTTONS OR MYTHS ALLOWED):
1. NEVER INVENT FAKE WEBSITE BUTTONS, FAKE FILTERS, OR FAKE BONUS MULTIPLIERS:
   - Everything you write MUST match the real live website UI in 2026. If a reader opens the URL and cannot find a button you named, trust is ruined.
2. EXACT VERIFIED FACTS FOR INDIAMART B2B CATALOG ARBITRAGE (dir.indiamart.com):
   - REAL FILTERS ON INDIAMART: Search "Cotton Kurti Wholesale" or "Kundan Jewellery Wholesale" on https://dir.indiamart.com -> click the Top City Bar ("Surat", "Jaipur", "Mumbai", or "Ahmedabad") -> on the Left Sidebar under "Business Type", tick "Manufacturer" or "Exporter" (and optionally "TrustSEAL Verified").
   - FORBIDDEN FAKE FILTERS: IndiaMART does NOT have filters called "Stock Value > ₹50 Lakh", "Advanced Filters", or "Sort by No Instagram DM". NEVER invent those filter names!
   - MANDATORY ANTI-SCAM 50% ADVANCE RULE: NEVER tell the reader to ask suppliers for photos first or create a full 15-page PDF catalog before getting paid! Instead, teach the 100% safe method:
     * Step A: Save 1 single ugly mannequin/floor product photo directly from the supplier's public IndiaMART listing.
     * Step B: Turn that 1 photo into a 4K studio model image and place a big diagonal watermark ("SAMPLE PREVIEW — DO NOT COPY") across the center in Canva.
     * Step C: Send that 1 watermarked Before/After photo to the manufacturer's public phone/WhatsApp number.
     * Step D: Offer a ₹250 1-Page Unwatermarked Trial OR collect 50% UPI Advance (₹1,500 out of ₹2,999) BEFORE creating the remaining 14 pages.
3. EXACT VERIFIED FACTS FOR VOICEOVER & VOICE CLONING (voquent.com vs elevenlabs.io):
   - Always state both the 100% FREE (₹0) path and the Paid Creator path honestly:
     * Path A (100% Free / ₹0 Investment): Register as a voice talent on https://www.voquent.com/voice-actors/ or Fiverr (Indian English / Hindi Conversational) and upload 3 clean 30-second audio demos edited in free Audacity (Noise Reduction + Normalize to -3dB).
     * Path B (Paid Creator Tier Required): ElevenLabs Professional Voice Cloning (PVC) on https://elevenlabs.io/app/voice-library requires an active Creator subscription ($11 first month / $22/mo), 30+ minutes of clean audio, and passing a live microphone Voice Captcha. Once approved in the Voice Library, it pays ~$0.03 per 1,000 generated characters via Stripe.
   - FORBIDDEN MYTH: Recording at 11:30 PM with the ceiling fan off is ONLY to achieve a clean < -60dB acoustic noise floor so your audio passes quality review—there is NO "1.5x night-time royalty batch multiplier" on ElevenLabs. NEVER claim a 1.5x night bonus!
4. EXACT VERIFIED FACTS FOR USERTESTING, PROLIFIC & ADOBE STOCK:
   - https://www.usertesting.com/get-paid-to-test & https://www.prolific.com: 100% Free (₹0) signup. Requires a KYC-verified Indian PayPal account (linked to PAN + Indian bank account). Pays $10 per approved 15–20 minute speak-out-loud usability test exactly 14 days after completion. Realistic Indian demographic match rate is 1 to 4 tests per week ($40–$120/month extra pocket cash) when keeping a browser tab open with constant speaking during screeners.
   - https://contributor.stock.adobe.com: 100% Free (₹0) signup. You MUST upscale AI images to at least 4 Megapixels (e.g., 4000×2500 px), check the mandatory "Created using generative AI tools" box, and never use brand logos or real faces. Pays 33% royalty ($0.33–$3.30/download) with a $25 PayPal/Payoneer withdrawal threshold.
5. EXACT VERIFIED FACTS FOR FREE CERTIFICATES, LINKEDIN & INDIAN PHARMACY SALTS:
   - https://cs50.harvard.edu/x (100% free official Harvard CS50x certificate—never pay the edX upgrade fee), https://www.theforage.com (Free Tata, JPMorgan, BCG virtual job simulations with instant Credential IDs), https://education.github.com/pack, and LinkedIn Boolean search: "Hiring" AND ("Intern" OR "Fresher" OR "Remote") -> click "Posts" tab -> set "Date Posted" = "Past 24 hours".
   - https://www.1mg.com Generic Salt Composition check: Regulated Indian pharmacy formulations (Aziderm 10%/20% Cream ~₹240 for Azelaic Acid, Glyco-6 Cream ~₹190 for 6% Glycolic Acid, Hyalugel ~₹250 for Hyaluronic Acid, Sebogel ~₹240 for Salicylic + Niacinamide). Always include the nighttime-only + SPF 50 sunscreen rule.
6. 100% WHITE-LABEL EBOOK (NO "GLOWCASH" NAME ALLOWED) & 5-HASHTAG RULE:
   - Never mention "GlowCash" anywhere. Use "2026–2027 FACT-CHECKED INSIDER EDITION · ZERO FLUFF" for editionTag. Return EXACTLY 5 hashtags.

Return strictly valid JSON with this exact structure:
{
  "ebook": {
    "editionTag": "2026–2027 FACT-CHECKED INSIDER EDITION · ZERO FLUFF",
    "title": "High-FOMO specific fact-checked title for ${effectiveTopic}",
    "subtitle": "Clear simple-English subtitle explaining the exact verified portals, real UI filters & honest Free vs Paid requirements",
    "targetReaderPromise": "1-sentence concrete, realistic promise (zero fake filters, zero affiliate fluff)",
    "goldenRuleTitle": "The #1 Anti-Scam & Fact-Checked Rule for ${effectiveTopic}",
    "goldenRuleBody": "2-3 sentences explaining the exact real UI filter and why you must always use the 1-Photo Watermark + 50% UPI Advance rule (or honest Free vs Paid path)",
    "hardestPartSolvedBox": {
      "title": "🔥 THE HARDEST PART SOLVED: 4 Fact-Checked 2026–2027 Portals, Real UI Filters & Anti-Scam Rules",
      "exactWhereToFindMap": [
        "1. REAL UI FILTER #1: Exact website URL + real clickable filter path + honest ₹0 vs Paid requirement...",
        "2. REAL UI FILTER #2: Exact website URL + real clickable filter path + anti-scam protection...",
        "3. REAL UI FILTER #3: Exact website URL + real clickable filter path + realistic payout timeline...",
        "4. REAL UI FILTER #4: Exact website URL + real clickable filter path..."
      ],
      "zeroFollowerTrafficTrick": "The exact 100% real ground-truth mechanism (e.g., 1 Watermarked Before/After photo + 50% UPI Advance rule) that works with 0 followers"
    },
    "quickValueBreakdown": [
      {"metric": "1. Upfront Capital Truth", "detail": "Clear breakdown of 100% Free (₹0) portals vs optional Paid tiers"},
      {"metric": "2. Real UI Click-Paths", "detail": "Zero invented filter names—every button exists on the live website today"},
      {"metric": "3. Anti-Scam Payment Rule", "detail": "Never deliver full work upfront; use 1 watermarked sample + 50% UPI advance"},
      {"metric": "4. Realistic Monthly Math", "detail": "Honest Indian payout timelines (UPI, Stripe, KYC PayPal)"}
    ],
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "Chapter 1 Title",
        "subtitle": "Chapter 1 Subtitle (State clearly if ₹0 Free or Paid Plan needed)",
        "coreSecretSummary": "The 100% verified ground-truth mechanism for this chapter",
        "whereToFindOrHiddenTrick": "EXACT REAL WEBSITE UI CLICK-PATH: Tell the reader the exact real buttons to click (zero fake filters!)",
        "stepByStepExecution": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5..."],
        "exactToolsOrWebsites": [
          {"name": "Exact Website URL", "role": "What it does (state Free vs Paid clearly)", "insiderTip": "100% real verified technical tip"}
        ],
        "copyPasteTemplateOrScript": {"label": "Copy-Paste Script / Formula / Checklist", "content": "Exact word-for-word template text (including 50% advance protection if pitching clients)"},
        "incomeMathOrProof": "Honest, realistic math and payout timeline"
      }
    ],
    "twentyFourHourChecklist": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
  },
  "reelBlueprint": {
    "sixSecondVideoIdea": {
      "visualStyle": "6-Second Dark Aesthetic B-Roll / Screen Recording",
      "shotByShot": ["0.0s–2.0s: ...", "2.0s–4.0s: ...", "4.0s–6.0s: ..."],
      "lightingAndAudioTip": "2026 Instagram Edits & Trial Reel tip"
    },
    "psychologicalPriceOverlays": [
      {"triggerType": "1. Snack Price / FOMO Comparison", "overlayText": "Comparing ${priceDisplay} to daily snack or missing out", "whyItConverts": "string"},
      {"triggerType": "2. 1% Fact-Checked Filter", "overlayText": "Why this ${anchorPriceDisplay} verified guide is behind a ${priceDisplay} link", "whyItConverts": "string"},
      {"triggerType": "3. Hardest-Part Solved Hook", "overlayText": "No fake filters — shows real UI click-paths & 50% advance scripts", "whyItConverts": "string"}
    ],
    "autoDmCaption": "100% Clean, High-Converting Simple English caption asking viewers to comment ${autoDmTrigger}",
    "seoKeywords": ["10 high-search 2026 keywords in clean English"],
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  }
} (Include 5 complete, deeply detailed, 100% fact-checked chapters in simple English in "chapters").`;

  const userPrompt = `Topic: "${effectiveTopic}" | Category: "${category}" | Price: "${priceDisplay}" | Anchor: "${anchorPriceDisplay}" | Trigger: "${autoDmTrigger}" | Seed: ${variationIndex}-${Date.now()}
Write a 100% fact-checked, zero-hallucination 5-chapter Ebook + 6s Reel Kit. Never invent fake IndiaMART filters (use real City + Left Sidebar Business Type: Manufacturer + TrustSEAL Verified), always include the 1-Photo Watermark + 50% UPI Advance rule, and state Free vs Paid requirements honestly.`;

  let aiParsed: any = null;
  let providerUsed = "2026 Mastermind AI";

  if (GROQ_FALLBACK_KEY) {
    try {
      aiParsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        jsonSchemaPrompt,
        userPrompt,
        15000
      );
      providerUsed = "GPT-OSS 120B Mastermind AI (2026)";
    } catch {
      // Handled fallback
    }
  }

  if (!aiParsed) {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `${jsonSchemaPrompt}\n\n${userPrompt}`,
            config: {
              responseMimeType: "application/json",
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          12000,
          "Gemini 4 Hydrogen Ebook"
        );
        if (response.text) {
          aiParsed = JSON.parse(response.text.trim());
          providerUsed = "Gemini 4 Hydrogen Mastermind AI (2026)";
        }
      }
    } catch {
      // Handled fallback
    }
  }

  if (
    !aiParsed ||
    !aiParsed.ebook ||
    !Array.isArray(aiParsed.ebook.chapters) ||
    aiParsed.ebook.chapters.length === 0
  ) {
    return res.status(200).json({
      errorFallback: true,
      topicInput: effectiveTopic,
      category,
      priceDisplay,
      anchorPriceDisplay,
      autoDmTrigger,
    });
  }

  const rawHardestBox = aiParsed.ebook.hardestPartSolvedBox;
  const rawMapList = Array.isArray(rawHardestBox?.exactWhereToFindMap)
    ? rawHardestBox.exactWhereToFindMap
    : Array.isArray(rawHardestBox?.whereToFindFirst10BuyersOrLinks)
    ? rawHardestBox.whereToFindFirst10BuyersOrLinks
    : [];

  const normalizedHardestBox = {
    title: stripBrandFromEbookText(
      rawHardestBox?.title ||
        "🔥 THE HARDEST PART SOLVED: Exact Mastermind Map — Where to Find Buyers, Clients & Direct Links With 0 Followers"
    ),
    exactWhereToFindMap:
      rawMapList.length > 0
        ? rawMapList.map((item: any) => stripBrandFromEbookText(String(item)))
        : [
            `1. Direct Portal / Search Filter #1: Use Google Search operator site:linkedin.com/in OR Google Maps "No-Website" filter for "${effectiveTopic}" to find direct contacts in 5 minutes.`,
            `2. Active Spender Filter #2: Open facebook.com/ads/library -> Select India -> Search your niche keyword -> Filter by "Active Ads" to find businesses spending money right now.`,
            `3. Instagram 24-Hr Active Story Filter #3: Search city/niche tags in Instagram "Places" -> tap the circular Story ring to find owners/buyers active in the last 24 hours.`,
            `4. Trial Reel + Auto-DM Funnel #4: Post a 6-second proof video with "Trial Reel" ON and trigger word "${autoDmTrigger}" so non-followers receive your link automatically.`,
          ],
    zeroFollowerTrafficTrick: stripBrandFromEbookText(
      rawHardestBox?.zeroFollowerTrafficTrick ||
        rawHardestBox?.exactMastermindSolution ||
        "Turn ON Instagram's 2026 'Trial Reel' toggle before posting so 100% of views come from non-followers, and connect Auto-DM so every comment receives your link in 5 seconds."
    ),
  };

  const result: EbookGenerationResult = {
    id: `ebook-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    topicInput: effectiveTopic,
    category,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    providerUsed,
    ebook: {
      editionTag:
        stripBrandFromEbookText(aiParsed.ebook.editionTag) ||
        "2026 PRIVATE INSIDER EDITION · ZERO FLUFF",
      title: stripBrandFromEbookText(
        aiParsed.ebook.title || `The 1% Insider Playbook: ${effectiveTopic}`
      ),
      subtitle: stripBrandFromEbookText(
        aiParsed.ebook.subtitle ||
          "Step-by-Step Simple English Execution Guide (With Exact Links, Search Filters & Scripts)"
      ),
      targetReaderPromise: stripBrandFromEbookText(
        aiParsed.ebook.targetReaderPromise ||
          `Actionable 2026 ground-truth system for ${effectiveTopic}`
      ),
      goldenRuleTitle: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleTitle ||
          "The #1 Anti-Fluff Rule for Fast Execution"
      ),
      goldenRuleBody: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleBody ||
          "Never waste time on generic theory. Use the exact search filters, verified portals, and copy-paste scripts in this guide for 14 straight days."
      ),
      hardestPartSolvedBox: normalizedHardestBox,
      quickValueBreakdown:
        Array.isArray(aiParsed.ebook.quickValueBreakdown) &&
        aiParsed.ebook.quickValueBreakdown.length > 0
          ? aiParsed.ebook.quickValueBreakdown.map((q: any, idx: number) => ({
              metric: stripBrandFromEbookText(
                typeof q === "object" && q?.metric
                  ? String(q.metric)
                  : `Pillar ${idx + 1}`
              ),
              detail: stripBrandFromEbookText(
                typeof q === "object" && q?.detail
                  ? String(q.detail)
                  : String(q || `Actionable step for ${effectiveTopic}`)
              ),
            }))
          : [
              {
                metric: "1. Daily Time Needed",
                detail: "45 to 60 minutes from phone or laptop (Zero coding)",
              },
              {
                metric: "2. Cost to Start",
                detail: "₹0 — Uses 100% free 2026 portals, search filters & AI tools",
              },
              {
                metric: "3. Hardest Part Solved",
                detail: "Includes exact search queries, filters & direct portals",
              },
              {
                metric: "4. Core Outcome",
                detail: `Master ${effectiveTopic} or sell at ${priceDisplay} (Value ${anchorPriceDisplay})`,
              },
            ],
      chapters: aiParsed.ebook.chapters.map((ch: any, idx: number) => ({
        chapterNumber: Number(ch.chapterNumber) || idx + 1,
        title: stripBrandFromEbookText(
          ch.title || `Chapter ${idx + 1}: Core Execution Step`
        ),
        subtitle: stripBrandFromEbookText(
          ch.subtitle ||
            `The 1% Insider System for ${effectiveTopic} (Part ${idx + 1})`
        ),
        coreSecretSummary: stripBrandFromEbookText(
          ch.coreSecretSummary ||
            ch.explanation ||
            ch.secretPrinciple ||
            `Most people fail at ${effectiveTopic} because nobody shows them the exact search filter or portal. Here is the exact 2026 step-by-step method.`
        ),
        whereToFindOrHiddenTrick: stripBrandFromEbookText(
          ch.whereToFindOrHiddenTrick ||
            `EXACT FILTER & CLICK-PATH: Open the tool listed below -> type the exact keyword from the Copy-Paste box -> filter by "Active / Verified" so you skip 99% of dead ends.`
        ),
        stepByStepExecution:
          Array.isArray(ch.stepByStepExecution) &&
          ch.stepByStepExecution.length > 0
            ? ch.stepByStepExecution.map((s: any) =>
                stripBrandFromEbookText(String(s))
              )
            : Array.isArray(ch.actionSteps) && ch.actionSteps.length > 0
            ? ch.actionSteps.map((s: any) =>
                stripBrandFromEbookText(String(s))
              )
            : [
                `Step 1: Open the exact website/portal listed below for ${effectiveTopic}.`,
                `Step 2: Apply the Mastermind Search Filter shown above.`,
                `Step 3: Use the copy-paste script/template below and execute today.`,
              ],
        exactToolsOrWebsites:
          Array.isArray(ch.exactToolsOrWebsites) &&
          ch.exactToolsOrWebsites.length > 0
            ? ch.exactToolsOrWebsites.map((t: any) => ({
                name: stripBrandFromEbookText(
                  typeof t === "object" && t?.name
                    ? String(t.name)
                    : String(t || "2026 Verified Portal")
                ),
                role: stripBrandFromEbookText(
                  typeof t === "object" && t?.role
                    ? String(t.role)
                    : "Core Execution Portal"
                ),
                insiderTip: stripBrandFromEbookText(
                  typeof t === "object" && t?.insiderTip
                    ? String(t.insiderTip)
                    : "Use the exact search filter above for instant results."
                ),
              }))
            : [
                {
                  name: "Google Search Operators / NotebookLM / Perplexity",
                  role: "Direct Discovery & Verification",
                  insiderTip:
                    "Use exact-match quotes and site: filters to find direct links in 10 seconds.",
                },
                {
                  name: "SuperProfile.bio / ManyChat / Instagram Trial Reels",
                  role: "Automated Delivery & Reach",
                  insiderTip: `Set trigger keyword to "${autoDmTrigger}" for instant DM delivery.`,
                },
              ],
        copyPasteTemplateOrScript:
          typeof ch.copyPasteTemplateOrScript === "object" &&
          ch.copyPasteTemplateOrScript?.content
            ? {
                label: stripBrandFromEbookText(
                  ch.copyPasteTemplateOrScript.label ||
                    "Copy-Paste Action Script / Search Formula"
                ),
                content: stripBrandFromEbookText(
                  String(ch.copyPasteTemplateOrScript.content)
                ),
              }
            : {
                label: "Copy-Paste Action Script / Search Formula",
                content: stripBrandFromEbookText(
                  typeof ch.copyPasteTemplateOrScript === "string"
                    ? ch.copyPasteTemplateOrScript
                    : ch.copyPasteTemplate ||
                        `Comment "${autoDmTrigger}" below and I will DM you the complete ${effectiveTopic} step-by-step link in 5 seconds!`
                ),
              },
        incomeMathOrProof: stripBrandFromEbookText(
          ch.incomeMathOrProof ||
            `Saves 6+ hours of trial-and-error per week or generates 20+ daily leads/buyers at ${priceDisplay}.`
        ),
      })),
      twentyFourHourChecklist:
        Array.isArray(aiParsed.ebook.twentyFourHourChecklist) &&
        aiParsed.ebook.twentyFourHourChecklist.length > 0
          ? aiParsed.ebook.twentyFourHourChecklist.map((c: any) =>
              stripBrandFromEbookText(String(c))
            )
          : [
              `Apply Filter #1 from the "Hardest Part Solved" Mastermind box today.`,
              `Test the Chapter 1 & Chapter 2 copy-paste scripts/formulas.`,
              `Download this 100% white-label 12pt PDF using the Download PDF button.`,
              `Optional: Upload the PDF to SuperProfile.bio at ${priceDisplay} (Value ${anchorPriceDisplay}) with Auto-DM trigger "${autoDmTrigger}".`,
            ],
    },
    reelBlueprint: {
      sixSecondVideoIdea: {
        visualStyle:
          typeof aiParsed.reelBlueprint?.sixSecondVideoIdea === "object" &&
          aiParsed.reelBlueprint?.sixSecondVideoIdea?.visualStyle
            ? String(aiParsed.reelBlueprint.sixSecondVideoIdea.visualStyle)
            : typeof aiParsed.reelBlueprint?.sixSecondVideoIdea === "string"
            ? aiParsed.reelBlueprint.sixSecondVideoIdea
            : "6-Second Dark Aesthetic B-Roll / Laptop & Phone PDF Scroll",
        shotByShot:
          Array.isArray(
            aiParsed.reelBlueprint?.sixSecondVideoIdea?.shotByShot
          ) &&
          aiParsed.reelBlueprint.sixSecondVideoIdea.shotByShot.length > 0
            ? aiParsed.reelBlueprint.sixSecondVideoIdea.shotByShot.map((s: any) =>
                String(s)
              )
            : [
                `0.0s–2.0s: Slow-motion scroll through the 12pt "${effectiveTopic}" Ebook on phone screen.`,
                `2.0s–4.0s: Cut to FOMO / snack price-comparison text overlay (${priceDisplay} vs daily Momos/Maggi).`,
                `4.0s–6.0s: Show Comment "${autoDmTrigger}" CTA box for instant Auto-DM delivery.`,
              ],
        lightingAndAudioTip:
          aiParsed.reelBlueprint?.sixSecondVideoIdea?.lightingAndAudioTip ||
          "Lower video brightness by -20% in Instagram Edits app so white text pops; enable 2026 Trial Reels.",
      },
      psychologicalPriceOverlays:
        Array.isArray(aiParsed.reelBlueprint?.psychologicalPriceOverlays) &&
        aiParsed.reelBlueprint.psychologicalPriceOverlays.length > 0
          ? aiParsed.reelBlueprint.psychologicalPriceOverlays
              .slice(0, 3)
              .map((ov: any, idx: number) =>
                typeof ov === "object" && ov !== null
                  ? {
                      triggerType:
                        ov.triggerType || `Psychological Hook #${idx + 1}`,
                      overlayText:
                        ov.overlayText ||
                        `You spend ${priceDisplay} on snacks in 5 minutes, but this ${priceDisplay} guide gives you the exact 1% links & filters.`,
                      whyItConverts:
                        ov.whyItConverts ||
                        "Makes the price feel smaller than a daily impulse snack.",
                    }
                  : {
                      triggerType: `Psychological Hook #${idx + 1}`,
                      overlayText: String(ov),
                      whyItConverts:
                        "Triggers instant curiosity + impulse micro-purchase.",
                    }
              )
          : [
              {
                triggerType: "1. Extreme FOMO / Gatekeeping Hook",
                overlayText: `99% of people struggle with ${effectiveTopic} because nobody shares the exact search filters & links. I put all 5 inside this ${priceDisplay} guide.`,
                whyItConverts:
                  "Triggers intense fear of missing out on hidden insider links.",
              },
              {
                triggerType: "2. Snack Price Comparison",
                overlayText: `You spend ₹100 on Momos in 10 minutes, but won't invest ${priceDisplay} (Value ${anchorPriceDisplay}) to get the exact step-by-step roadmap?`,
                whyItConverts:
                  "Reframes the price as smaller than daily junk food.",
              },
              {
                triggerType: "3. Hardest-Part Solved Hook",
                overlayText: `Zero "hawa-hawa" theory. Includes the exact websites, filters & copy-paste scripts. Comment "${autoDmTrigger}".`,
                whyItConverts:
                  "Directly addresses skepticism and drives comment velocity.",
              },
            ],
      autoDmCaption:
        aiParsed.reelBlueprint?.autoDmCaption ||
        `Stop wasting time on generic videos that only give surface-level advice and hide the real links. 🛑\n\nI put the complete, zero-fluff "${effectiveTopic}" blueprint—including the exact websites, search filters, and copy-paste scripts—into a clean 12pt guide for just ${priceDisplay} (Value ${anchorPriceDisplay}).\n\n👉 Comment "${autoDmTrigger}" below and my Auto-DM will send the direct link to your inbox in 5 seconds!`,
      seoKeywords:
        Array.isArray(aiParsed.reelBlueprint?.seoKeywords) &&
        aiParsed.reelBlueprint.seoKeywords.length > 0
          ? aiParsed.reelBlueprint.seoKeywords.slice(0, 10)
          : [
              effectiveTopic.toLowerCase().slice(0, 28),
              "free verified certificates 2026",
              "how to find clients without followers",
              "secret ai tools india 2026",
              "digital products india",
              "career shortcuts india",
            ],
      // Strictly enforce the 2026 5-Hashtag Limit!
      hashtags:
        Array.isArray(aiParsed.reelBlueprint?.hashtags) &&
        aiParsed.reelBlueprint.hashtags.length > 0
          ? aiParsed.reelBlueprint.hashtags.slice(0, 5)
          : [
              "#secretwebsites",
              "#careergrowth2026",
              "#freecertificates",
              "#clienthunting",
              "#digitalproductsindia",
            ],
    },
  };

  return res.json(result);
});

// POST /api/stylist-chat-rebuild — Multimodal AI Stylist Chat for Similar Meesho Finds & Colors (100x Royal Glow-Up, Zero Joker/Kiddy Look)
app.post("/api/stylist-chat-rebuild", async (req, res) => {
  const {
    userMessage = "",
    selectedColors = [],
    bodyGoal = "universal-100x",
    uploadedImages = [],
    currentReel,
    backgroundDesc = "Realistic warm cream plaster wall with a lush indoor plant in soft afternoon sunlight",
  } = req.body || {};

  const safeImages: UploadedGarmentPreview[] = Array.isArray(uploadedImages)
    ? uploadedImages.slice(0, 6)
    : [];
  const safeColors: string[] = Array.isArray(selectedColors)
    ? selectedColors
    : [];

  // 1. Always compute our deterministic 100x Royal Glow-Up baseline first so we have a guaranteed structure
  const baseline = synthesizeCustomSimilarOutfitReelPack(
    currentReel,
    String(userMessage || ""),
    safeColors,
    String(bodyGoal || "universal-100x"),
    safeImages,
    String(backgroundDesc)
  );

  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);

  const imageDescriptions = safeImages
    .map(
      (img, idx) =>
        `Uploaded Screenshot #${idx + 1} ("${img.name}"): Dominant detected color is ${img.dominantColorName} (${img.dominantHex})`
    )
    .join(" | ");

  const stylistSystemPrompt = `You are India's #1 Celebrity Personal Stylist, Optical Body-Proportion Scientist & Meesho Catalog Engineer (${dailyCtx.formattedDate}).
The user searched Meesho for an outfit, but found SIMILAR items or DIFFERENT colors/cuts instead of the exact original item.
She has shared what she found:
- User Message / Found Items Description: "${userMessage || "I found similar pieces in these colors on Meesho—pick the best combination and rebuild my complete outfit and reel pack!"}"
- Selected Colors Available on Meesho: ${safeColors.length > 0 ? safeColors.join(", ") : "Auto-detect from uploaded screenshots / message"}
- Uploaded Meesho Screenshots Info: ${imageDescriptions || "No screenshot attached (using text & color selection)"}
- Target Body & Glow-Up Goal: "${bodyGoal}"
- Original Concept Reference: "${currentReel?.concept?.title || "4-Piece Look-Transformation Combo"}"

CRITICAL 100x ROYAL GLOW-UP & ANTI-JOKER / ANTI-KIDDY RULES (STRICTLY ENFORCED):
1. ZERO JOKER / ZERO KIDDY / ZERO CARTOONISH STYLING:
   - NEVER combine 2 or 3 loud/clashing colors together (e.g., never pair bright yellow with bright red/blue, never suggest neon or childish plastic accessories).
   - Strictly apply the **60-30-10 Royal Color Harmony Law**:
     * 60% Primary Flattering Hero Shade (chosen from the best color/item the user actually found on Meesho)
     * 30% Deep Slimming or Old-Money Structure Neutral (Jet Black, Dark Indigo Denim, Warm Ivory Cream, or Espresso Brown high-waist bottom)
     * 10% Matte Metallic Accent (Oxidized Silver or Antique Gold Kamarbandh/Jhumkas + Underarm Baguette Bag)
2. 100x UNIVERSAL BEAUTY & SLIMMING SCIENCE (Works for Chubby/Plus-Size, Short 5'0", Dusky Skin, or Any Face/Body):
   - Explain how the chosen neckline (V-Neck / Square-Neck / Sweetheart Neck) opens the collarbone to make a round or heavy face look sharp and slim.
   - Explain how the 30:70 High-Waist Proportion + Empire/A-line flare + V-drop Waist Chain hides lower tummy fat and creates an instant hourglass waist.
   - Explain how the color + metallic jhumka reflects warm light onto Indian skin so even a tired, dusky, or plain face glows 100x like a royal Pinterest model.
3. STRICT TWO-LAYER LANGUAGE RULE:
   - EASY HINGLISH ("Jo creator ko samajhne ke liye hai"):
     * "stylistVerdictHinglish.bestChoiceFromUploads" (Tell her clearly which of her uploaded screenshots / colors to PICK and how to pair it)
     * "stylistVerdictHinglish.whatToAvoidAndWhy" (Tell her which clashing/bulky/joker color or cut to AVOID and why)
     * "stylistVerdictHinglish.hundredXGlowUpScience" (How this transforms chubby/short/dusky/any girl into a 100x royal beauty)
     * "stylistVerdictHinglish.stepByStepDrapingTrick" (Exact tuck, elbow sleeve push, and V-drop waist chain trick)
     * "searchTerms[].howToCombineAndStyle" & "searchTerms[].fabricAndFitCheck" (Easy Hinglish)
   - 100% PURE CLEAN ENGLISH ("Jo copy karke Meesho, AI Prompt aur Instagram mein use karna hai"):
     * "conceptTitle" (100% Clean English)
     * "searchTerms[].exactKeyword" & "backupSearchKeywords" (100% Pure English Meesho Catalog Search Keywords matching her found items/colors!)
     * "onScreenHooks" (3 Viral Human-Toned English Hooks, 10-16 words each, zero AI slop)
     * "hinglishCaption" (100% Clean Relatable English Caption with 'Comment LINK')

Return strictly valid JSON with this exact structure:
{
  "stylistVerdictHinglish": {
    "bestChoiceFromUploads": "Easy Hinglish: Which uploaded photo/color to pick and what bottom/accessory to pair with it",
    "whatToAvoidAndWhy": "Easy Hinglish: What clashing/joker/bulky thing to avoid from the options and why",
    "hundredXGlowUpScience": "Easy Hinglish: How this exact combination makes a chubby, short, dusky, or ordinary girl look 100x slim, tall, and royal",
    "stepByStepDrapingTrick": "Easy Hinglish: Exact step-by-step wearing trick (sleeves, high-waist tuck, V-drop waist chain, underarm bag)",
    "colorHarmonyFormula": "60% [Hero Color] + 30% [Slimming Bottom Color] + 10% [Metallic Accent]"
  },
  "conceptTitle": "100% Clean English Title for this new Custom 4-Piece Combination",
  "searchTerms": [
    {
      "itemLabel": "Piece 1 · 100x Face-Framing & Slimming Top (Matched to User's Find)",
      "exactKeyword": "Women [Exact Color & Cut Matched to User's Find] (100% Pure English Meesho Keyword)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish styling trick for Piece 1",
      "priceFilter": "Under ₹349 · 4.2★+",
      "fabricAndFitCheck": "Easy Hinglish review check for Piece 1"
    },
    {
      "itemLabel": "Piece 2 · Tummy-Control & Leg-Lengthening Bottom",
      "exactKeyword": "Women [Color] High Waist [Flared Bootcut Jeans / Wide Leg Trousers / Palazzo] (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish styling trick for Piece 2",
      "priceFilter": "Under ₹449 · Free Delivery",
      "fabricAndFitCheck": "Easy Hinglish review check for Piece 2"
    },
    {
      "itemLabel": "Piece 3 · Secret Hourglass Waist-Cinching Transformer",
      "exactKeyword": "Women [Oxidized Silver / Antique Gold] Layered Kamarbandh Belly Waist Chain (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish V-drop waist chain trick",
      "priceFilter": "Under ₹179",
      "fabricAndFitCheck": "Easy Hinglish review check"
    },
    {
      "itemLabel": "Piece 4 · 100x Facial Glow & Rich-Vibe Finisher",
      "exactKeyword": "Women [Color] Structured Shoulder Baguette Bag and [Oxidized / Gold] Jhumka (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish underarm bag + jhumka face-framing trick",
      "priceFilter": "Under ₹269",
      "fabricAndFitCheck": "Easy Hinglish review check"
    }
  ],
  "onScreenHooks": [
    "10-16 word 100% Clean English human-toned proportion/glow-up hook",
    "10-16 word 100% Clean English price/tummy-hide + wait for Piece 3 hook",
    "10-16 word 100% Clean English bestie share hook"
  ]
}`;

  let aiParsed: any = null;
  let providerUsed = `100x Royal Glow-Up AI Stylist (${dailyCtx.formattedDate})`;

  // 2. Try Multimodal Gemini (gemini-4-hydrogen) first if GEMINI_API_KEY is available
  try {
    const ai = getGeminiClient();
    if (ai) {
      const parts: any[] = [];
      for (const img of safeImages.slice(0, 4)) {
        const base64Clean = String(img.dataUrl || "").includes(",")
          ? String(img.dataUrl).split(",")[1]
          : "";
        if (base64Clean) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType || "image/jpeg",
              data: base64Clean,
            },
          });
        }
      }
      parts.push({
        text: `${stylistSystemPrompt}\n\nAnalyze the user's found items/colors/screenshots and return the JSON response now.`,
      });

      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        }),
        12000,
        "Gemini 4 Hydrogen Multimodal Stylist"
      );

      if (response.text) {
        aiParsed = JSON.parse(response.text.trim());
        providerUsed = `Gemini 4 Hydrogen Vision Stylist (${dailyCtx.formattedDate})`;
      }
    }
  } catch {
    // Fall through to Groq
  }

  // 3. Try Groq Vision (Llama 4 Scout) or GPT-OSS 120B if Gemini wasn't used
  if (!aiParsed && GROQ_FALLBACK_KEY) {
    if (safeImages.length > 0) {
      try {
        const userContentParts: any[] = [
          {
            type: "text",
            text: `${stylistSystemPrompt}\n\nInspect the attached Meesho clothing screenshots and return strictly valid JSON.`,
          },
        ];
        for (const img of safeImages.slice(0, 3)) {
          if (img.dataUrl && img.dataUrl.startsWith("data:image/")) {
            userContentParts.push({
              type: "image_url",
              image_url: { url: img.dataUrl },
            });
          }
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
          const visionRes = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_FALLBACK_KEY}`,
              },
              body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.75,
                messages: [{ role: "user", content: userContentParts }],
                response_format: { type: "json_object" },
              }),
              signal: controller.signal,
            }
          );
          if (visionRes.ok) {
            const visionData = await visionRes.json();
            const rawContent =
              visionData?.choices?.[0]?.message?.content || "{}";
            const cleaned = rawContent
              .replace(/^```json\s*/i, "")
              .replace(/^```\s*/i, "")
              .replace(/\s*```$/, "")
              .trim();
            aiParsed = JSON.parse(cleaned);
            providerUsed = `Llama-4 Vision + 100x Royal Stylist AI (${dailyCtx.formattedDate})`;
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch {
        // Fall through to GPT-OSS 120B
      }
    }

    if (!aiParsed) {
      try {
        aiParsed = await callOpenAICompatibleJSON(
          "https://api.groq.com/openai/v1/chat/completions",
          GROQ_FALLBACK_KEY,
          "openai/gpt-oss-120b",
          stylistSystemPrompt,
          `User Found Items/Colors: "${userMessage}" | Selected Colors: "${safeColors.join(", ")}" | Screenshot Colors: "${imageDescriptions}" | Goal: "${bodyGoal}"`,
          11000
        );
        providerUsed = `GPT-OSS 120B Royal Stylist AI (${dailyCtx.formattedDate})`;
      } catch {
        // Fall through to baseline
      }
    }
  }

  if (!aiParsed) {
    return res.json({
      stylistVerdictHinglish: baseline.stylistVerdictHinglish,
      updatedReelPack: baseline.updatedReelPack,
      providerUsed: baseline.updatedReelPack.providerUsed,
    });
  }

  // Merge AI output with our guaranteed 100x Royal Glow-Up baseline
  const mergedVerdict: StylistVerdictHinglish = {
    bestChoiceFromUploads:
      aiParsed.stylistVerdictHinglish?.bestChoiceFromUploads ||
      baseline.stylistVerdictHinglish.bestChoiceFromUploads,
    whatToAvoidAndWhy:
      aiParsed.stylistVerdictHinglish?.whatToAvoidAndWhy ||
      baseline.stylistVerdictHinglish.whatToAvoidAndWhy,
    hundredXGlowUpScience:
      aiParsed.stylistVerdictHinglish?.hundredXGlowUpScience ||
      baseline.stylistVerdictHinglish.hundredXGlowUpScience,
    stepByStepDrapingTrick:
      aiParsed.stylistVerdictHinglish?.stepByStepDrapingTrick ||
      baseline.stylistVerdictHinglish.stepByStepDrapingTrick,
    colorHarmonyFormula:
      aiParsed.stylistVerdictHinglish?.colorHarmonyFormula ||
      baseline.stylistVerdictHinglish.colorHarmonyFormula,
  };

  const mergedSearchTerms: SearchTermItem[] =
    Array.isArray(aiParsed.searchTerms) && aiParsed.searchTerms.length >= 4
      ? aiParsed.searchTerms.slice(0, 4).map((s: any, idx: number) => ({
          itemLabel:
            s.itemLabel ||
            baseline.updatedReelPack.searchTerms[idx]?.itemLabel ||
            `Piece ${idx + 1}`,
          exactKeyword: sanitizeMeeshoSearchTerm(
            s.exactKeyword ||
              baseline.updatedReelPack.searchTerms[idx].exactKeyword,
            idx
          ),
          backupSearchKeywords:
            Array.isArray(s.backupSearchKeywords) &&
            s.backupSearchKeywords.length > 0
              ? s.backupSearchKeywords
                  .slice(0, 2)
                  .map((b: any) => sanitizeMeeshoSearchTerm(String(b), idx))
              : baseline.updatedReelPack.searchTerms[idx].backupSearchKeywords,
          howToCombineAndStyle:
            s.howToCombineAndStyle ||
            baseline.updatedReelPack.searchTerms[idx].howToCombineAndStyle,
          priceFilter:
            s.priceFilter ||
            baseline.updatedReelPack.searchTerms[idx].priceFilter,
          fabricAndFitCheck:
            s.fabricAndFitCheck ||
            baseline.updatedReelPack.searchTerms[idx].fabricAndFitCheck,
          platform: "Meesho",
        }))
      : baseline.updatedReelPack.searchTerms;

  const finalTitle =
    aiParsed.conceptTitle || baseline.updatedReelPack.concept.title;

  const finalPrompts = buildMasterPrompts(
    mergedSearchTerms,
    String(backgroundDesc),
    finalTitle,
    mergedVerdict.stepByStepDrapingTrick
  );

  const finalReelPack = enforceMastermindViralReelPack(
    mergedSearchTerms,
    finalTitle,
    mergedVerdict.stepByStepDrapingTrick,
    {
      onScreenHooks: Array.isArray(aiParsed.onScreenHooks)
        ? aiParsed.onScreenHooks
        : undefined,
    },
    Date.now() % 100
  );

  const finalUpdatedReel: ReelGenerationResult = {
    ...baseline.updatedReelPack,
    id: `reel-stylist-${Date.now()}`,
    providerUsed,
    concept: {
      ...baseline.updatedReelPack.concept,
      title: finalTitle,
      liveDailyTrendTag: `100x Custom Similar-Item Match · ${mergedVerdict.colorHarmonyFormula}`,
      curiosityIdentityAngle: `${mergedVerdict.bestChoiceFromUploads} ${mergedVerdict.hundredXGlowUpScience}`,
      lookTransformationFormula: {
        beforeVsAfterLook: `Pehle (Mismatched / Confusing Options): ${mergedVerdict.whatToAvoidAndWhy} -> Ab (100x Royal Glow-Up Look): ${mergedVerdict.hundredXGlowUpScience}`,
        howToCombineAllFourPieces: mergedVerdict.stepByStepDrapingTrick,
        threeWaysToRestyleCombo:
          baseline.updatedReelPack.concept.lookTransformationFormula
            ?.threeWaysToRestyleCombo || [],
      },
      shotByShotPlan: [
        {
          timeRange: "0.0s – 1.5s",
          visualAction:
            "Haath mein pakde hue aapke chune hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke dikhao.",
          onScreenText: finalReelPack.onScreenHooks[0],
        },
        {
          timeRange: "1.5s – 3.0s",
          visualAction:
            "Full-Body Look ya Mirror Try-On (Prompt 0A/0B): 60-30-10 Royal Color Harmony aur 30:70 Slimming Proportion saaf dikhao.",
          onScreenText: `100x Slimming & Glow Formula: ${mergedSearchTerms[0].exactKeyword
            .replace(/^Women\s+/i, "")
            .slice(0, 28)}`,
        },
        {
          timeRange: "3.0s – 4.5s",
          visualAction:
            "Piece 3 (V-Drop Waist Chain) ka close-up + 1 second ke liye aapka Meesho screenshot / customer review photo flash karo.",
          onScreenText: `Secret 3rd Piece That Creates an Instant Hourglass Waist`,
        },
        {
          timeRange: "4.5s – 6.0s",
          visualAction:
            "Piece 4 (Underarm Bag & Jhumka) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText:
            "Comment 'LINK' below & check your DM in 5s before Piece 1 sells out! 😭",
        },
      ],
    },
    searchTerms: mergedSearchTerms,
    prompts: finalPrompts,
    reelPack: finalReelPack,
  };

  return res.json({
    stylistVerdictHinglish: mergedVerdict,
    updatedReelPack: finalUpdatedReel,
    providerUsed,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GlowCash AI Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
