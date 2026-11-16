import express from "express";
import path from "path";
import fs from "fs";
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
  boostUserIdeaOptions,
  synthesizeCustomSimilarOutfitReelPack,
  type ReelGenerationResult,
  type EbookGenerationResult,
  type SearchTermItem,
  type UploadedGarmentPreview,
  type StylistVerdictHinglish,
} from "./src/data/playbookData.ts";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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
  timeoutMs = 15000
): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const isGptOss = model.includes("gpt-oss");
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.94,
        ...(isGptOss
          ? { reasoning_effort: "low", max_completion_tokens: 4200 }
          : { max_tokens: 4000 }),
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
    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      }
      throw new Error("Invalid JSON response");
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function callMultiModelLiveAI(
  systemPrompt: string,
  userPrompt: string,
  variationSeed = 0
): Promise<{ parsed: any; providerName: string } | null> {
  // Rotate across 4 independent Groq model TPM buckets so rapid-fire Generate/Regenerate clicks never hit 429 rate limits
  const modelRotation = [
    ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "openai/gpt-oss-120b", "llama-3.1-8b-instant"],
    ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"],
  ];
  const groqModels =
    modelRotation[Math.abs(Number(variationSeed)) % modelRotation.length];

  if (GROQ_FALLBACK_KEY) {
    for (const modelName of groqModels) {
      try {
        const parsed = await callOpenAICompatibleJSON(
          "https://api.groq.com/openai/v1/chat/completions",
          GROQ_FALLBACK_KEY,
          modelName,
          systemPrompt,
          userPrompt,
          14000
        );
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          return {
            parsed,
            providerName:
              modelName === "llama-3.3-70b-versatile"
                ? "Llama 3.3 70B Live Mastermind AI"
                : modelName === "openai/gpt-oss-20b"
                ? "GPT-OSS 20B Turbo Live AI"
                : modelName === "llama-3.1-8b-instant"
                ? "Llama 3.1 Instant Live AI"
                : "GPT-OSS 120B Live Mastermind AI",
          };
        }
      } catch {
        // Try next model in cascade
      }
    }
  }

  // Try Gemini 4 Hydrogen if configured
  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: `${systemPrompt}\n\n${userPrompt}`,
          config: {
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        }),
        10000,
        "Gemini 4 Hydrogen"
      );
      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed && typeof parsed === "object") {
          return {
            parsed,
            providerName: "Gemini 4 Hydrogen Live AI",
          };
        }
      }
    }
  } catch {
    // Try OpenRouter fallback
  }

  if (OPENROUTER_FALLBACK_KEY) {
    try {
      const parsed = await callOpenAICompatibleJSON(
        "https://openrouter.ai/api/v1/chat/completions",
        OPENROUTER_FALLBACK_KEY,
        "google/gemini-2.0-flash-001",
        systemPrompt,
        userPrompt,
        11000
      );
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return {
          parsed,
          providerName: "OpenRouter Live Mastermind AI",
        };
      }
    } catch {
      // Handled
    }
  }

  return null;
}

const DYNAMIC_REEL_CREATIVE_ANGLES: {
  category: string;
  angleTitle: string;
  silhouetteFormula: string;
  colorStory: string;
}[] = [
  {
    category: "Body Proportion & Color Hacks",
    angleTitle: "Royal Kashmiri Aari Embroidered V-Neck Short Kurti + Dark Indigo Flared Bootcut Jeans + Oxidized Kamarbandh + Braided Kolhapuri Wedges",
    silhouetteFormula: "30:70 Petite Height Illusion (19-inch V-neck short kurti + 39-inch high-waist bootcut flare hiding 2.5-inch wedges)",
    colorStory: "Deep Rust Terracotta + Dark Indigo Blue + Antique Oxidized Silver + Tan Brown",
  },
  {
    category: "Aesthetics & Situations",
    angleTitle: "Old-Money Korean Layered Combo: Crisp White Oversized Poplin Shirt + Espresso Brown Ribbed Knit Vest + Cream Pleated Wide-Leg Trousers + Retro Clear Glasses",
    silhouetteFormula: "Cropped Vest Waistline Elevation over Relaxed Shirt + Front-Pleated Tummy-Flat Wide-Leg Trousers",
    colorStory: "Espresso Coffee Brown + Crisp White + Warm Cream Beige + Tortoiseshell Gold",
  },
  {
    category: "Body Proportion & Color Hacks",
    angleTitle: "Chubby & Mid-Size Tummy-Hide Hourglass: Midnight Navy Angrakha Diagonal-Wrap Peplum Kurti + Ivory Straight Cigarette Pants + Gold Link Watch + Tan Baguette Bag",
    silhouetteFormula: "Empire-Waist Diagonal Angrakha Wrap that skims over the lower tummy without clinging + Vertical Straight Ankle Pants",
    colorStory: "Midnight Navy Blue + Warm Ivory Cream + Champagne Gold + Tan Leather",
  },
  {
    category: "Scroll-Stopping Interactive",
    angleTitle: "Underrated High-Contrast Color Theory: Olive Sage Ruched Square-Neck Top + Chocolate Brown High-Waist Wide-Leg Cargo Pants + Dainty Gold Layered Chain + Cream Dumpling Bag",
    silhouetteFormula: "60-30-10 Earthy Luxury Contrast (Fitted Ruched Bodice + High-Rise Relaxed Wide-Leg Silhouette)",
    colorStory: "Olive Sage Green + Rich Chocolate Brown + Cream White + Brushed Gold",
  },
  {
    category: "Identity & Personality",
    angleTitle: "Dark Feminine Desi Baddie: Plum Wine Velvet Sweetheart-Neck Short Kurta + Jet Black High-Waist Flared Palazzo + Heavy Afghan Silver Choker & Jhumkas + Black Shoulder Bag",
    silhouetteFormula: "Monochrome Dark Lower Base + Jewel-Tone Collarbone-Framing Sweetheart Neckline",
    colorStory: "Deep Mulberry Wine + Carbon Jet Black + Matte Oxidized Silver + Charcoal",
  },
  {
    category: "Aesthetics & Situations",
    angleTitle: "Strict-Mom Approved Pinterest Coquette: Dusty Mauve Schiffli Eyelet Puff-Sleeve Kurti + Milk White Embroidered Cotton Palazzo + Satin Pearl Bow Clip + Mary Jane Flats",
    silhouetteFormula: "Modest Square-Neck Puff Sleeve (Full Coverage) + Breezy A-Line Wide-Leg Palazzo",
    colorStory: "Dusty Rose Mauve + Milk White + Pearl Cream + Soft Rose Gold",
  },
  {
    category: "Body Proportion & Color Hacks",
    angleTitle: "Warm & Dusky Indian Skin Golden-Hour Glow: Peacock Teal Zari V-Neck Straight Kurta + Warm Beige Ankle Trousers + Sheer Organza Scallop Dupatta + Kundan Pearl Jhumkas",
    silhouetteFormula: "One-Shoulder Pinned Organza Drape + 2-Inch Ankle Reveal Straight Cigarette Fit",
    colorStory: "Peacock Teal Blue + Warm Sand Beige + Antique Zari Gold + Pearl White",
  },
  {
    category: "Scroll-Stopping Interactive",
    angleTitle: "Myntra ₹2,899 vs Meesho ₹389 Exact Designer Dupe: Mustard Haldi Mirror-Work Short Kurti + Deep Maroon Flared Sharara/Palazzo + Oxidized Ghungroo Bangles + Embroidered Potli",
    silhouetteFormula: "Festive High-Contrast Jewel Pairing (Zero Joker Look — Warm Mustard grounded with Deep Maroon)",
    colorStory: "Warm Marigold Mustard + Deep Royal Maroon + Antique Silver + Ivory",
  },
  {
    category: "Identity & Personality",
    angleTitle: "1 Kurti Styled 3 Unexpected Ways (College, Intern & Cafe Date): Jet Black Lucknowi Chikankari Short Kurti + Ice-Blue Baggy Boyfriend Jeans + Linen Beige Shrug Blazer + Silver Jhumkas",
    silhouetteFormula: "3-Piece Modular Layering (Structured Open Blazer over Fitted Chikankari Kurti + High-Waist Denim)",
    colorStory: "Jet Black + Ice Wash Denim Blue + Oatmeal Linen Beige + Silver",
  },
  {
    category: "Aesthetics & Situations",
    angleTitle: "Monsoon & Humid College Day Fresh Fit: Mulmul Cotton Lavender Block-Print Sleeveless Short Kurti + Charcoal Splash-Safe Culotte Pants + Waterproof Matte Jelly Flats + Nylon Tote",
    silhouetteFormula: "Breathable Sleeveless/Cap-Sleeve Empire Cut + Cropped Wide-Leg Ankle Culottes",
    colorStory: "Soft Lavender Lilac + Charcoal Grey + Crisp White + Silver",
  },
  {
    category: "Body Proportion & Color Hacks",
    angleTitle: "Broad-Shoulder & Heavy-Arm Slimming Formula: Deep Emerald Green V-Neck 3/4th Sleeve Wrap Top + High-Waist Black Tailored Korean Pants + Minimalist Gold Waist Belt + Structured Sling",
    silhouetteFormula: "Deep V-Neck to break shoulder width + 3/4th sleeves pushed to elbows + High-Waist Pleated Trousers",
    colorStory: "Emerald Bottle Green + Jet Black + Champagne Gold + Warm Cream",
  },
  {
    category: "Scroll-Stopping Interactive",
    angleTitle: "Zodiac & Birth-Month Signature Aesthetic: Cherry Burgundy Satin Button-Down Shirt (Half-Tucked) + Dark Grey Wide-Leg Jeans + Silver Layered Waist Chain + Vintage Oval Watch",
    silhouetteFormula: "Asymmetric French Front-Tuck + Diagonal Silver Waist Chain Drape",
    colorStory: "Cherry Burgundy Red + Charcoal Denim Grey + Liquid Silver + Black",
  },
];

const DYNAMIC_EBOOK_BLUEPRINTS: {
  category: string;
  topicTitle: string;
  distinctChaptersFocus: string;
}[] = [
  {
    category: "Client Hunting & Zero-Follower Traffic",
    topicTitle: "The Dark Psychology of WhatsApp DM Closing & High-Ticket Freelance Deals (5 Behavioral Triggers That Close ₹4,999 Clients in 15 Minutes)",
    distinctChaptersFocus: "Focus the 5 chapters on behavioral sales psychology & client closing (NO ElevenLabs, NO Outlier!): (1) The 'Visual Loss-Aversion' Audit: Finding cash-rich businesses on google.com/maps or facebook.com/ads/library and sending a 1-screen watermarked Before/After screenshot showing the exact leak costing them customers today (Math: 2 audits closed/week × ₹2,500 = ₹5,000/week × 4 weeks = ₹20,000/month), (2) The 'Micro-Yes' ₹299 Foot-in-the-Door Psychological Trigger (1 trial deliverable) before pitching a ₹4,999 monthly retainer (Math: 4 trial closes/week × ₹299 = ₹1,196/week + 1 upsell at ₹4,999 = ₹6,195/week × 4 weeks = ₹24,780/month), (3) Meta Ad Library (facebook.com/ads/library -> Country: India -> All Ads -> Active) Active-Spender Hijack: Finding D2C brands running the same ad creative for 14+ days (Math: 2 ad-refresh packs/week × ₹3,000 = ₹6,000/week × 4 weeks = ₹24,000/month), (4) The 3-Option Price-Anchoring Matrix (Decoy Pricing: ₹1,999 Basic vs ₹3,999 Growth vs ₹8,999 Pro) on WhatsApp that makes your ₹3,999 middle package irresistible (Math: 2 middle packages/week × ₹3,999 = ₹7,998/week × 4 weeks = ₹31,992/month), and (5) The 'Takeaway Close' & 50% UPI Advance Safety Lock (never deliver unwatermarked files before 50% UPI advance).",
  },
  {
    category: "2026 Real Pocket Cashflow & Micro-Business",
    topicTitle: "The 6-Second Instagram Trial-Reel & Auto-DM Micro-Dossier Funnel (Turning ₹29–₹99 Impulse PDFs Into Automated Daily UPI Cashflow With 0 Followers)",
    distinctChaptersFocus: "Focus the 5 chapters on anonymous micro-product funnels (NO ElevenLabs, NO Outlier!): (1) Why Instagram's built-in 'Trial Reel' toggle pushes 6-second dark-screen loops to 100% non-followers and forces a 2.5x read-loop (Math: 10 sales/day × ₹29 = ₹290/day × 30 days = ₹8,700/month from 1 trial reel loop), (2) The 'Snack-Price Anchoring' Psychology: Comparing a ₹49 classified PDF to a ₹60 plate of street momos so impulse conversion hits 10%+ (Math: 12 sales/day × ₹49 = ₹588/day × 30 days = ₹17,640/month), (3) Designing high-status 12pt Classified Dossiers using Google Docs (docs.google.com -> File -> Download -> PDF) & Canva Free (canva.com -> Create a design -> A4 Document) in 20 minutes, (4) Setting up automated Keyword DM triggers on superprofile.bio, cosmofeed.com, or manychat.com with instant UPI checkout, and (5) Adding a ₹99 Bundle Order-Bump on checkout (Math: 10 base sales/day × ₹29 = ₹290 + 3 order-bumps/day × ₹99 = ₹297 -> ₹587/day × 30 days = ₹17,610/month).",
  },
  {
    category: "Client Hunting & Zero-Follower Traffic",
    topicTitle: "The Google Maps 'High-Review, No-Website' Local Clinic, Salon & Gym Digital Takeover (Closing ₹3,999 Deals in 48 Hours)",
    distinctChaptersFocus: "Focus the 5 chapters on local business arbitrage using google.com/maps (NO ElevenLabs, NO Outlier!): (1) Searching 'Dental Clinic', 'Skin Clinic', or 'Luxury Salon' on google.com/maps in Tier-1/Tier-2 cities to spot businesses with 40+ reviews (proving cashflow) but NO website button (Math: 2 clinics closed/week × ₹2,500 = ₹5,000/week × 4 weeks = ₹20,000/month), (2) Building a 1-page WhatsApp Appointment & Price-Menu Mini-Site on carrd.co (free/$19/yr) or canva.com (Canva Free Websites) in 20 minutes, (3) The QR-Code Table-Standee & Google Review Booster Upsell for local cafes and salons (Math: 3 standee + review link setups/week × ₹1,500 = ₹4,500/week × 4 weeks = ₹18,000/month), (4) The 40-Second WhatsApp Voice-Note + Watermarked Preview Script that gets replies from busy clinic owners, and (5) Collecting a ₹2,999 setup fee (50% UPI advance) + ₹999/month maintenance retainer (Math: 6 active retainer clients × ₹999/month = ₹5,994/month passive + 4 new setups/month × ₹2,999 = ₹11,996 -> ₹17,990/month).",
  },
  {
    category: "Free Certifications & Career Shortcuts",
    topicTitle: "12 Verified Free Harvard, Tata, JPMorgan & Google Credentials + The LinkedIn 'Past 24 Hours' Direct Founder Backdoor",
    distinctChaptersFocus: "Focus the 5 chapters on 100% real, free career & certification shortcuts: (1) Harvard CS50x direct portal (cs50.harvard.edu/x — 100% ₹0 free official Harvard certificate link via CS50 Gradebook without paying edX's $199 fee; saves ₹16,900), (2) TheForage.com (theforage.com — 100% free 4-hour Tata Group, JPMorgan Chase, BCG & Deloitte virtual job simulations with verifiable Credential IDs for your resume), (3) Google Skillshop (skillshop.withgoogle.com) & Cloud Skills Boost (cloudskillsboost.google) free badges + SWAYAM NPTEL (swayam.gov.in — free video lectures, optional ₹1,000 proctored exam), (4) GitHub Student Developer Pack (education.github.com/pack using a valid .edu/.ac.in email or college ID card for free JetBrains, Namecheap domain & GitHub Copilot), and (5) The LinkedIn Boolean Search ('\"hiring\" AND \"intern\"' -> Click 'Posts' tab -> 'Date posted: Past 24 hours') to DM founders within 2 hours of posting (Math: Sending 5 targeted founder DMs/day × 6 days = 30 direct pitches/week -> 3 to 4 interview calls/week for ₹25,000–₹45,000/month remote roles).",
  },
  {
    category: "Skincare, Glow-Up & Styling Science",
    topicTitle: "The ₹150 Indian Pharmacy Generic Salt Bible (Decoding ₹3,500 Luxury Serums Into ₹200 Chemist Tubes Using the 1mg Salt Trick)",
    distinctChaptersFocus: "Focus the 5 chapters on real, regulated Indian pharmacy skincare & glow science (always include mandatory 24-hour inner-forearm patch test & dermatologist safety disclaimer!): (1) How to use the clickable 'Salt Composition' line right under any product title on 1mg.com to compare ₹3,500 influencer serums against ₹200 regulated pharma tubes (Math: Replacing 3 overpriced ₹2,500 serums = ₹7,500 with 3 pharmacy tubes = ₹690 saves ₹6,810 every 3 months = ₹27,240/year saved), (2) Hyperpigmentation & Post-Acne Marks: Aziderm 10% Cream (~₹245, Micro Labs — Azelaic Acid 10% w/w, pea-sized amount on dry skin at night), (3) Oil-Free Glass-Skin Hydration & Barrier Repair: Hyalugel (~₹250, Ethicare — Hyaluronic Acid gel applied on damp skin) + Emolene / Ceramide moisturizer seal, (4) Safe Night Exfoliation Rule: Glyco-6 Cream (~₹200, Micro Labs — Glycolic Acid 6% w/w) strictly max 2 nights/week, NEVER mixed with retinol/azelaic acid in the same night, + mandatory SPF 50 (UV Doux or Photostable Gold) next morning, and (5) Warm Indian Skin Undertone Jewel-Tone Color Science & 30:70 Outfit Proportion Math.",
  },
  {
    category: "Underrated 1% Life, Study & AI Hacks",
    topicTitle: "15 Underrated Zero-Cost AI Study, Research & Exam-Crushing Portals (Finish 6 Hours of Syllabus or Deep Work in 30 Minutes)",
    distinctChaptersFocus: "Focus the 5 chapters on 100% real, free AI & cognitive study systems: (1) Google NotebookLM (notebooklm.google.com — 100% free with Google account: upload up to 50 PDFs/YouTube links -> click 'Audio Overview' for a 2-host podcast summary + exact source citations with zero external hallucination; saves 4 hours/day × 6 days = 24 hours/week saved), (2) Perplexity.ai (Focus: 'Academic' filter) + SciSpace (typeset.io) & Consensus.app for instant peer-reviewed paper breakdowns, (3) Anki (apps.ankiweb.net — 100% free on Desktop & AnkiDroid on Android) + AI CSV Flashcard prompt to generate 100 active-recall cards in 3 minutes for UPSC/NEET/CA/Semester exams, (4) Free voice-to-structured-notes workflow using AudioPen.ai or ChatGPT Voice Mode to turn messy spoken revision into crisp bullet tables, and (5) The 48-Hour Exam Cramming & Feynman 3-Pass Protocol (Math: 25-min study block + 5-min active recall × 4 cycles = 2 hours/day covering 120 flashcards = 3,600 concepts mastered/month).",
  },
  {
    category: "2026 Real Pocket Cashflow & Micro-Business",
    topicTitle: "Pinterest-to-Gumroad & SuperProfile Digital Planner Arbitrage (Creating Aesthetic Notion & Printable Trackers With Free Organic Search Traffic)",
    distinctChaptersFocus: "Focus the 5 chapters on digital printable/Notion templates with free Pinterest search traffic (NO ElevenLabs, NO Outlier!): (1) Finding high-demand digital tracker niches on trends.pinterest.com & Etsy search bar autocomplete (e.g., Indian Wedding Budget Tracker, ADHD Study OS, PCOS Meal & Habit Log, UPSC Revision Tracker), (2) Building 1 clean master template in Notion.so (free) or Canva Free (canva.com -> Create a design -> A4 Document -> Share -> Template link), (3) Listing on gumroad.com (free to list, 10% fee only when you make a sale) for global USD buyers and superprofile.bio / cosmofeed.com for instant Indian UPI buyers, (4) The Pinterest SEO Pin-Title & Vertical 1000×1500 px Pin Formula (posting 3 fresh vertical pins/day linking directly to your checkout page with 0 followers), and (5) The 'Complete Bundle' Pricing Math (Math: 2 sales/day at ₹199 = ₹398/day × 30 days = ₹11,940/month + 8 international Gumroad sales/month at $9 [₹765] = ₹6,120 -> ₹18,060/month).",
  },
  {
    category: "Underrated 1% Life, Study & AI Hacks",
    topicTitle: "Dark Psychology of Magnetic Communication, Executive Confidence & High-Stakes HR Salary Negotiation (+₹1.5L–₹4L CTC Exploit)",
    distinctChaptersFocus: "Focus the 5 chapters on spoken authority, behavioral psychology & interview mastery: (1) The '3-Second Tactical Pause' & Downward Inflection Tonality Rule that commands authority in any interview or Zoom meeting, (2) Turning ChatGPT Mobile Voice Mode (100% free) into a ruthless 24/7 Bar-Raiser Mock Interviewer with a custom roleplay prompt, (3) The 25 High-Status Corporate English Replacement Phrases (replacing weak apologetic words like 'Sorry to bother' or 'I think' with executive framing), (4) Psychological Framing to flip 'Career Gaps, Non-Tech Background, or Low CGPA' into proof of practical execution, and (5) The Word-for-Word HR Salary Negotiation Script ('Anchor Range + Quantified Proof') before signing an offer letter (Math: Negotiating a 15% bump on a ₹6,00,000 CTC offer = +₹90,000/year = +₹7,500/month extra every single month from one 10-minute conversation).",
  },
  {
    category: "2026 Real Pocket Cashflow & Micro-Business",
    topicTitle: "YouTube Faceless 'Search-Gap' & Product Comparison Channels (Day-1 Amazon Affiliate & Digital Funnel Engine Without Showing Your Face)",
    distinctChaptersFocus: "Focus the 5 chapters on 100% honest, technically accurate faceless YouTube search arbitrage: (1) Finding 'High-Buyer-Intent Search Gaps' using YouTube Search Autocomplete (typing 'Best [Product] under ₹...' with an underscore _) & trends.google.com (Filter: YouTube Search, Past 90 days) where small channels rank via exact keyword titles, (2) Honest YouTube Monetization Math: State clearly that YouTube AdSense requires 1,000 subscribers + 4,000 watch hours (and Indian AdSense RPM is ₹50–₹200 per 1,000 views), so the 1% shortcut monetizes from Day 1 (even with 0 subscribers!) using Amazon Associates India (affiliate-program.amazon.in — real commission: 1%–4% on electronics/laptops, 5%–9% on home/kitchen/books) + a ₹99 Comparison PDF in the pinned comment, (3) Recording crisp screen walkthroughs using free OBS Studio (obsproject.com) and combining with free 4K B-roll downloaded from pexels.com/videos inside free CapCut or DaVinci Resolve, (4) The 'Verdict in First 20 Seconds' retention script that stops viewers from clicking away, and (5) Thumbnail Contrast & Exact Math (Math: 1 buyer-intent video getting 5,000 targeted views -> 150 affiliate clicks -> 15 Amazon sales of a ₹15,000 item at 3% commission = ₹6,750/video; 3 videos/month × ₹6,750 = ₹20,250/month before AdSense even starts).",
  },
  {
    category: "Client Hunting & Zero-Follower Traffic",
    topicTitle: "D2C E-Commerce Virtual Photoshoot & UGC Studio Arbitrage (Selling ₹2,499 4K Product Launch Packs to New Indian Brands)",
    distinctChaptersFocus: "Focus the 5 chapters on D2C brand visual arbitrage (NO ElevenLabs, NO Outlier!): (1) Spotting newly launched Indian jewellery, perfume, skincare, and ethnic-wear brands on facebook.com/ads/library & Instagram Sponsored feeds that use plain flat product photos, (2) Transforming 1 flat product photo into a 4K studio campaign shot (marble podiums, warm golden-hour lighting) using Photoroom.com (free tier), Canva Free (canva.com -> Create a design -> Custom size 1080×1350 px), and free upscayl.org while keeping the real product label 100% untouched, (3) The '1-Photo Watermarked Sample' DM Pitch on Instagram & WhatsApp that proves your skill in 3 seconds, (4) Packaging a '5-Image Launch Pack' for ₹2,500 with mandatory 50% UPI advance (₹1,250 upfront, ₹1,250 on delivery), and (5) Exact Monthly Math (Math: 2 D2C brand packs/week × ₹2,500 = ₹5,000/week × 4 weeks = ₹20,000/month).",
  },
  {
    category: "2026 Real Pocket Cashflow & Micro-Business",
    topicTitle: "5 Fact-Checked Global UX Testing & Academic Research Bounties (UserTesting, Prolific, Dscout, Trymata & Respondent — Zero Selling)",
    distinctChaptersFocus: "Focus the 5 chapters on 5 DIFFERENT 100% real usability & academic research portals with honest Indian payout math (NO ElevenLabs, NO Outlier!): (1) usertesting.com/get-paid-to-test ($10 USD [≈₹850] per 15–20 min speak-out-loud website test, paid exactly 14 days later via KYC-verified Indian PayPal + the 3-second continuous speaking rule to pass the 7-min unpaid practice test; Math: 1 test/week × $10 = $10/week × 4 weeks = $40/month [≈₹3,400/month]), (2) prolific.com academic & university studies (£6–£9/hr GBP payouts via PayPal + free 'Prolific Assistant' browser extension; Math: 2 hours/week × £7.50 = £15/week × 4 weeks = £60/month [≈₹6,480/month]), (3) dscout.com/scouts mobile video diary missions ($25–$50 USD consumer research studies on Android/iOS; Math: 1 accepted diary mission/month = $35 [≈₹2,975/month]), (4) trymata.com/get-paid-to-test ($10 usability tests) & respondent.io ($20–$50 B2B/software research calls), and (5) Setting up a KYC-verified Indian PayPal account (PAN card + Indian bank account linked + Purpose Code P0802) so all 5 portals combined yield ₹12,000–₹18,000/month in verified side income.",
  },
  {
    category: "Skincare, Glow-Up & Styling Science",
    topicTitle: "The 30:70 Visual Proportion & Color-Undertone Bible (How to Look 5 Inches Taller, Slimmer & Camera-Ready on a ₹999 Budget)",
    distinctChaptersFocus: "Focus the 5 chapters on scientific styling, proportion math & budget shopping: (1) The 30:70 Rule of Thirds: Why a 18–19 inch cropped/tucked top (30% upper torso) + 38–40 inch high-rise flared bottom (70% lower leg line) visually adds 4–5 inches of height to 5'0\"–5'3\" Indian frames, (2) Neckline & Sleeve Geometry: How Square, Sweetheart & V-necklines elongate the collarbone and balance broad shoulders or heavy busts, (3) The 'Third-Piece Waist Lock' (Diagonal Kamarbandh, Cropped Structured Shrug, or French Tuck) that conceals lower-tummy volume without wearing boxy oversized tents, (4) Warm Indian Skin Undertone Color Science: Why Emerald Green, Mulberry Wine, Rust Terracotta & Espresso Brown act like a natural ring-light while washed-out neon pastels make warm skin look grey, and (5) The 5-Minute Meesho 'Customer Photo Review + GSM Fabric Filter' (Rayon Slub, Cotton Cambric, Georgette with crepe lining) to buy ₹2,999 boutique looks for ₹450 (Math: Building a 4-piece mix-and-match capsule for ₹1,400 instead of 4 boutique outfits at ₹2,500 [₹10,000] saves ₹8,600).",
  },
  {
    category: "Client Hunting & Zero-Follower Traffic",
    topicTitle: "The Micro-Creator Brand Barter & Paid UGC Loophole (How to Get Free PR Boxes & ₹2,500/Video Deals With Under 1,000 Followers)",
    distinctChaptersFocus: "Focus the 5 chapters on UGC (User Generated Content) where brands pay for raw vertical videos they run as ads on their own page—even if you have 0 followers: (1) Why D2C skincare, jewellery, and tech brands in 2026 pay ₹1,500–₹3,000 per raw 15-second UGC video for their Meta Ads (0 follower count required because the brand runs it on THEIR ad account), (2) Building a 4-video 'Faceless Hand-Demo & Mirror Aesthetic' UGC Portfolio on Canva Free Website (canva.com) in 1 afternoon using 4 products already on your desk, (3) Finding active D2C ad spenders using facebook.com/ads/library (Country: India -> Active Ads) & Instagram Sponsored feed, (4) The '1 Base Video + 3 Hook Variations' Pitch that makes D2C ad managers say yes immediately, and (5) Exact UGC Pricing & 50% UPI Advance Math (Math: 2 UGC ad packs/week × ₹2,500 = ₹5,000/week × 4 weeks = ₹20,000/month with 0 followers).",
  },
];

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

  const p1Clean =
    searchTerms[0]?.exactKeyword?.replace(/^Women\s+/i, "") ||
    "Statement Fitted Kurti";
  const p2Clean =
    searchTerms[1]?.exactKeyword?.replace(/^Women\s+/i, "") ||
    "High-Waist Flared Jeans";

  const displayTitle = hasCustomInput
    ? sanitizeAndPolishReelTitle("", baseTopic, searchTerms)
    : chosenCombo.comboName || `${p1Clean} + ${p2Clean}: 4-Piece Styling Combo`;

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

// Helper to scrub any accidental "GlowCash" mention, AI-hallucinated URLs/UI filters, AND technical inaccuracies from Ebook strings
function stripBrandFromEbookText(input: string): string {
  return String(input || "")
    .replace(/GlowCash AI Studio/gi, "2026 Insider Vault")
    .replace(/GlowCash Edition/gi, "2026 Private Insider Edition")
    .replace(/GlowCash/gi, "Insider")
    // Fix fake random Google Docs / Sheets / Drive links invented by LLMs
    .replace(
      /https?:\/\/docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/[a-zA-Z0-9_-]{6,}(?:\/[^\s)"',]*)?/gi,
      "https://docs.google.com (Click 'Blank Document' -> File -> Share -> Anyone with link)"
    )
    .replace(
      /https?:\/\/drive\.google\.com\/(?:file\/d\/|drive\/folders\/)[a-zA-Z0-9_-]{6,}(?:\/[^\s)"',]*)?/gi,
      "https://drive.google.com (Upload PDF -> Right-Click -> Share -> Anyone with the link)"
    )
    // Fix wrong Amazon India affiliate URL
    .replace(/https?:\/\/(?:www\.)?affiliate\.amazon\.in\/?/gi, "https://affiliate-program.amazon.in/")
    .replace(/\baffiliate\.amazon\.in\b/gi, "affiliate-program.amazon.in")
    // Fix broken currency + percentage hybrid like "₹15%" or "Rs 15%"
    .replace(/(?:₹|Rs\.?\s*)(\d+(?:\.\d+)?\s*%)/gi, "$1")
    // Fix unrealistic Amazon India 15% commission claim -> real 1%–9% range
    .replace(/\b1[2-9]%\s*(?:Amazon\s*)?(?:affiliate\s*)?commission/gi, "3%–9% Amazon Associates commission")
    // Fix Canva Pro 'Magic Resize' claimed as free -> real Canva Free custom size path
    .replace(
      /\bMagic\s*Resize\b(\s*\(free\))?/gi,
      "Create a design -> Custom size (100% Free on Canva)"
    )
    // Fix OBS / Pexels export confusion
    .replace(
      /\b(?:export|upload)(?:ing)?\s+(?:OBS\s+)?(?:clips?|videos?|recordings?)\s+to\s+Pexels\b/gi,
      "downloading free 4K B-roll from pexels.com/videos and combining it with your OBS recording in CapCut"
    )
    // Fix fake hallucinated domains
    .replace(/https?:\/\/(?:www\.)?saastrader\.com(?:\/[^\s)"',]*)?/gi, "https://partnerstack.com/marketplace")
    .replace(/\bsaastrader\.com\b/gi, "partnerstack.com/marketplace")
    .replace(/https?:\/\/(?:www\.)?imagecheck\.com(?:\/[^\s)"',]*)?/gi, "https://images.google.com (Google Lens)")
    .replace(/\bimagecheck\.com\b/gi, "images.google.com (Google Lens)")
    // Fix YouTube AdSense RPM hallucination (₹2,000 per 1,000 views)
    .replace(
      /₹\s*[1-9],?000\s*(?:AdSense\s*)?per\s*1,?000\s*views/gi,
      "₹60–₹180 AdSense RPM per 1,000 views (after 1,000 subscribers + 4,000 watch hours) plus Day-1 Affiliate sales"
    )
    // Fix fake TubeBuddy "Video Count < 10" filter button hallucination
    .replace(
      /Filter\s+by\s+['"‘’“”]?Video\s+Count['"‘’“”]?\s*<\s*\d+\s+and\s+['"‘’“”]?Search\s+Volume['"‘’“”]?\s*>\s*[\d,]+/gi,
      "Check the 'Overall Score' dial (aim for 'Very Good' or 'Excellent' > 60/100 where Search Volume is Green and Competition is Unweighted Green)"
    )
    .replace(
      /Click\s+the\s+['"‘’“”]?Filters['"‘’“”]?\s+button\s*(?:->|→)\s*set\s+['"‘’“”]?Video\s+Count['"‘’“”]?\s+to\s+0[-‑–]10\s*(?:->|→)\s*apply/gi,
      "Open TubeBuddy Keyword Explorer -> type your 'Best [Product] under ₹...' phrase -> check that the 'Overall Score' is 60+ (Green)"
    )
    // Fix fake YouTube "Add to Email List" card & fake Zapier Amazon Associates trigger
    .replace(
      /['"‘’“”]?Add\s+to\s+Email\s+List['"‘’“”]?\s+card\s+on\s+YouTube/gi,
      "pinned YouTube comment & top description line (clickable for all channels)"
    )
    .replace(
      /connect\s+YouTube,\s+Mailchimp,\s+and\s+Amazon\s+Associates/gi,
      "connect your YouTube RSS feed to Telegram and Mailchimp (while pasting your Amazon Associates SiteStripe link in the pinned comment)"
    )
    .replace(/1\.5[x×]\s*royalty(\s*rate|\s*batch)?/gi, "clean < -60dB noise floor (required to pass moderation)")
    .replace(/low[-‑\s]traffic\s*batch/gi, "zero-background-noise recording window")
    .replace(/sort\s*by\s*["“']?No\s*Instagram\s*DM["”']?/gi, "tick Left Sidebar -> Business Type: Manufacturer + TrustSEAL Verified")
    .replace(/["“']?No\s*Instagram\s*DM["”']?\s*filter/gi, "Left Sidebar 'Business Type: Manufacturer' filter")
    .replace(/set\s*["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "select City: Surat/Jaipur + Left Sidebar: Business Type -> Manufacturer")
    .replace(/["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "Business Type: Manufacturer + TrustSEAL Verified")
    .replace(
      /\b(\d+\s+(?:simple|easy|fast|proven|real|verified)\s+)?steps\s+to\s+(?:earn\s+|make\s+|get\s+)?(?:₹|rs\.?\s*|inr\s*)?(?:9|19|29|39|49|59|79|99)\s*(?:rs|rupees|cash|income|daily|per\s+day|profit|payouts?)?(\s+in\s+202[67])?/gi,
      "5 Fact-Checked Steps to Real Verified Income in 2026"
    )
    .replace(
      /\b(?:to|for|earn|make|get|into)\s+(?:₹|rs\.?\s*|inr\s*)(?:9|19|29|39|49|59|79|99)\s*(?:rs|rupees|cash|income|daily|profit|payouts?)\b/gi,
      "for Real Verified Income"
    );
}

function parseIndianNumberToken(raw: string): number {
  const cleaned = String(raw || "").replace(/[,₹$\s]/g, "").toLowerCase();
  if (cleaned.endsWith("k")) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }
  if (cleaned.endsWith("l") || cleaned.endsWith("lakh")) {
    return parseFloat(cleaned.replace(/lakh|l/g, "")) * 100000;
  }
  return parseFloat(cleaned);
}

function formatIndianRupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

// Programmatic Math Auditor: Repairs broken LLM arithmetic in "incomeMathOrProof"
function auditAndFixIncomeMathEquation(rawText: string): string {
  let text = stripBrandFromEbookText(rawText)
    .replace(/^🔥?\s*(the\s*unfair\s*advantage\s*[:.-]?)\s*/i, "")
    .trim();

  // Expand shorthand like ₹4k -> ₹4,000 so readers see crystal-clear numbers
  text = text.replace(/₹\s*(\d+(?:\.\d+)?)\s*k\b/gi, (_, num) => {
    const val = Math.round(parseFloat(num) * 1000);
    return formatIndianRupees(val);
  });

  // 1. Check for addition equations: ₹A + ₹B = ₹C (verify A + B === C)
  text = text.replace(
    /₹([\d,]+)\s*(?:[A-Za-z\s]{0,18})\+\s*₹([\d,]+)\s*(?:[A-Za-z\s]{0,18})=\s*₹([\d,]+)/g,
    (fullMatch, aStr, bStr, cStr) => {
      const a = parseIndianNumberToken(aStr);
      const b = parseIndianNumberToken(bStr);
      const c = parseIndianNumberToken(cStr);
      if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a + b !== c) {
        return fullMatch.replace(`= ₹${cStr}`, `= ${formatIndianRupees(a + b)}`);
      }
      return fullMatch;
    }
  );

  // 2. Check for "N [items]/week × ₹P [each] = ₹T/month" where N * P !== T * 4 (forgot × 4 weeks)
  text = text.replace(
    /(\d+)\s*([a-zA-Z-]+(?:\s+[a-zA-Z-]+)?)\s*(?:\/|per\s+|a\s+)week\s*[×x*]\s*₹([\d,]+)\s*([a-zA-Z\s]{0,20})=\s*₹([\d,]+)\s*\/month/gi,
    (fullMatch, nStr, itemLabel, pStr, midLabel, tStr) => {
      const n = parseIndianNumberToken(nStr);
      const p = parseIndianNumberToken(pStr);
      const t = parseIndianNumberToken(tStr);
      if (!isNaN(n) && !isNaN(p) && !isNaN(t)) {
        const weekly = n * p;
        const monthly = weekly * 4;
        if (t !== monthly) {
          return `${nStr} ${itemLabel}/week × ${formatIndianRupees(p)}${midLabel}= ${formatIndianRupees(weekly)}/week × 4 weeks = ${formatIndianRupees(monthly)}/month`;
        }
      }
      return fullMatch;
    }
  );

  // 3. Check for explicit multiplication: A [units] × ₹B = ₹C
  text = text.replace(
    /(\d+)\s*([a-zA-Z/-]{0,22})\s*[×x*]\s*₹([\d,]+)\s*=\s*₹([\d,]+)/g,
    (fullMatch, countStr, unitLabel, priceStr, totalStr) => {
      const count = parseIndianNumberToken(countStr);
      const price = parseIndianNumberToken(priceStr);
      const claimed = parseIndianNumberToken(totalStr);
      if (!isNaN(count) && !isNaN(price) && !isNaN(claimed) && count * price !== claimed) {
        return `${countStr} ${unitLabel} × ${formatIndianRupees(price)} = ${formatIndianRupees(count * price)}`.replace(/\s{2,}/g, " ");
      }
      return fullMatch;
    }
  );

  // 4. Catch the classic LLM "Weekly vs Monthly" confusion:
  const weeklyToMonthlyRegex =
    /₹([\d,]+)(?:\s*(?:per|\/|a)\s*[a-zA-Z]+)?[^₹\n]{0,65}?(\d+)\s*([a-zA-Z-]+(?:\s+[a-zA-Z-]+)?)\s*(?:a|per|\/)\s*week[^₹\n]{0,45}?₹([\d,]+)\s*(?:\/|\s*per\s*|\s*a\s*)month/i;
  const wmMatch = text.match(weeklyToMonthlyRegex);
  if (wmMatch) {
    const unitVal = parseIndianNumberToken(wmMatch[1]);
    const weeklyCount = parseIndianNumberToken(wmMatch[2]);
    const claimedMonthly = parseIndianNumberToken(wmMatch[4]);
    if (
      !isNaN(unitVal) &&
      !isNaN(weeklyCount) &&
      !isNaN(claimedMonthly) &&
      unitVal >= 50 &&
      weeklyCount >= 1 &&
      weeklyCount <= 50
    ) {
      const trueWeekly = unitVal * weeklyCount;
      const trueMonthly = trueWeekly * 4;
      if (claimedMonthly !== trueMonthly) {
        if (trueWeekly === claimedMonthly) {
          text = text.replace(
            wmMatch[0],
            wmMatch[0]
              .replace(
                `₹${wmMatch[4]}/month`,
                `${formatIndianRupees(trueWeekly)}/week × 4 weeks = ${formatIndianRupees(trueMonthly)}/month`
              )
              .replace(
                `₹${wmMatch[4]} per month`,
                `${formatIndianRupees(trueWeekly)}/week × 4 weeks = ${formatIndianRupees(trueMonthly)}/month`
              )
          );
        } else {
          text = text.replace(
            new RegExp(`₹${wmMatch[4]}\\s*(?:\\/|\\s*per\\s*|\\s*a\\s*)month`, "i"),
            `${formatIndianRupees(trueWeekly)}/week × 4 weeks = ${formatIndianRupees(trueMonthly)}/month`
          );
        }
      }
    }
  }

  // 5. Catch "₹X/week ... = ₹Y/month" where Y !== X * 4
  text = text.replace(
    /₹([\d,]+)\s*(?:\/|\s*per\s*)week\s*(?:×\s*4\s*weeks\s*)?(?:=|->|→|is|equals|or|~|≈)\s*₹([\d,]+)\s*(?:\/|\s*per\s*)month/gi,
    (fullMatch, weekStr, monthStr) => {
      const w = parseIndianNumberToken(weekStr);
      const m = parseIndianNumberToken(monthStr);
      if (!isNaN(w) && !isNaN(m) && w * 4 !== m) {
        return `${formatIndianRupees(w)}/week × 4 weeks = ${formatIndianRupees(w * 4)}/month`;
      }
      return fullMatch;
    }
  );

  // 6. Catch "₹X/day ... = ₹Y/month" where Y !== X * 30
  text = text.replace(
    /₹([\d,]+)\s*(?:\/|\s*per\s*)day\s*(?:×\s*30\s*days\s*)?(?:=|->|→|is|equals|or|~|≈)\s*₹([\d,]+)\s*(?:\/|\s*per\s*)month/gi,
    (fullMatch, dayStr, monthStr) => {
      const d = parseIndianNumberToken(dayStr);
      const m = parseIndianNumberToken(monthStr);
      if (!isNaN(d) && !isNaN(m) && d * 30 !== m) {
        return `${formatIndianRupees(d)}/day × 30 days = ${formatIndianRupees(d * 30)}/month`;
      }
      return fullMatch;
    }
  );

  // 7. Reconcile any final "Total ≈ ₹Z/month" or "Total = ₹Z/month" against preceding ₹X/month components!
  const totalEndingRegex = /Total\s*(?:=|≈|~|is)?\s*₹([\d,]+)\s*\/month/i;
  const totalMatch = text.match(totalEndingRegex);
  if (totalMatch && totalMatch.index !== undefined) {
    const beforeTotal = text.slice(0, totalMatch.index);
    const monthlyMatches = [...beforeTotal.matchAll(/₹([\d,]+)\s*\/month/gi)];
    if (monthlyMatches.length >= 2) {
      const streamTotals = monthlyMatches.map((m) => parseIndianNumberToken(m[1]));
      const lastTwoSum =
        streamTotals[streamTotals.length - 2] + streamTotals[streamTotals.length - 1];
      const claimedTotal = parseIndianNumberToken(totalMatch[1]);
      if (!isNaN(lastTwoSum) && !isNaN(claimedTotal) && lastTwoSum !== claimedTotal) {
        text =
          beforeTotal +
          text
            .slice(totalMatch.index)
            .replace(`₹${totalMatch[1]}/month`, `${formatIndianRupees(lastTwoSum)}/month`);
      }
    }
  }

  return text;
}

const HINGLISH_DETECTOR_REGEX =
  /\b(kaise|kese|krna|kare|keliye|wala|wali|wale|mujhe|bina|paisa|paise|kamaye|kamana|tarika|chahiye|btao|batao|dikhao|ghar|baithe|sasta|accha|ldki|ladki|moti|patli|kapda|kpda|pehne|pehnna|achha|kuch| نیا|नया)\b/i;

function sanitizeAndPolishReelTitle(
  rawTitle: string,
  rawUserTheme: string,
  searchTerms: SearchTermItem[]
): string {
  const p1 =
    searchTerms[0]?.exactKeyword?.replace(/^Women\s+/i, "").trim() ||
    "Fitted Statement Kurti";
  const p2 =
    searchTerms[1]?.exactKeyword?.replace(/^Women\s+/i, "").trim() ||
    "High-Waist Flared Jeans";
  const p3 =
    searchTerms[2]?.exactKeyword?.replace(/^Women\s+/i, "").trim() ||
    "Waist-Defining Layer";

  const synthesizedEnglishTitle = `${p1} + ${p2}: The 30:70 Proportion & ${p3
    .split(" ")
    .slice(0, 3)
    .join(" ")} Styling Formula`;

  const cleaned = String(rawTitle || "").trim();
  if (!cleaned || cleaned.length < 12) {
    return synthesizedEnglishTitle;
  }

  const userTrimmed = String(rawUserTheme || "").trim();
  const isVerbatimUserEcho =
    userTrimmed.length > 0 &&
    userTrimmed.length < 70 &&
    (cleaned.toLowerCase() === userTrimmed.toLowerCase() ||
      cleaned
        .toLowerCase()
        .startsWith(`${userTrimmed.toLowerCase()} — 4-piece`) ||
      cleaned.toLowerCase().includes(userTrimmed.toLowerCase()));

  if (isVerbatimUserEcho || HINGLISH_DETECTOR_REGEX.test(cleaned)) {
    return synthesizedEnglishTitle;
  }

  return cleaned;
}

function sanitizeAndPolishEbookTitle(
  rawTitle: string,
  rawUserTopic: string,
  chapters: any[],
  priceDisplay: string
): string {
  let cleaned = stripBrandFromEbookText(String(rawTitle || "").trim());

  // Strip any remaining low offer-price numbers (₹19, ₹29, ₹49, Rs 29, 29 rs, etc.) from the book title
  const rawPriceNum = String(priceDisplay || "29").replace(/[^0-9]/g, "");
  cleaned = cleaned
    .replace(
      /\b(?:₹|rs\.?\s*|inr\s*)?(?:9|19|29|39|49|59|79|99)\s*(?:rs\.?|rupees|cash|income|daily|per\s+day|profit|payouts?|guide|pdf|ebook|playbook)\b/gi,
      "Verified High-Value Execution"
    )
    .replace(
      new RegExp(
        `(?:₹|rs\\.?\\s*)?\\b${rawPriceNum || "29"}\\b\\s*(?:rs\\.?|rupees|cash|income|daily)?`,
        "gi"
      ),
      ""
    )
    .replace(/\s{2,}/g, " ")
    .replace(/[:\-–—]\s*$/, "")
    .trim();

  // Build a magnetic 100% Pure English title from the actual PDF chapters in case the title echoed raw user input or Hinglish
  const ch1Raw = stripBrandFromEbookText(
    String(chapters?.[0]?.title || "")
  ).replace(/^Chapter\s*\d+\s*[:\-–—.]?\s*/i, "");
  const ch2Raw = stripBrandFromEbookText(
    String(chapters?.[1]?.title || "")
  ).replace(/^Chapter\s*\d+\s*[:\-–—.]?\s*/i, "");

  const ch1Short = ch1Raw.split(/[:(—–]/)[0].trim().slice(0, 48);
  const ch2Short = ch2Raw.split(/[:(—–]/)[0].trim().slice(0, 44);

  const chapterDerivedEnglishTitle =
    ch1Short && ch2Short && !HINGLISH_DETECTOR_REGEX.test(ch1Short + " " + ch2Short)
      ? `The 2026–2027 Fact-Checked Playbook: ${ch1Short} & ${ch2Short} System`
      : "The 2026–2027 Fact-Checked Execution Vault: Verified Global Portals, Real UI Filters & Copy-Paste Scripts";

  if (!cleaned || cleaned.length < 15) {
    return chapterDerivedEnglishTitle;
  }

  const userTrimmed = String(rawUserTopic || "").trim();
  const isCustomUserTopic =
    userTrimmed.length > 0 &&
    !DYNAMIC_EBOOK_BLUEPRINTS.some(
      (b) => b.topicTitle.toLowerCase() === userTrimmed.toLowerCase()
    );

  const isLazyUserEcho =
    isCustomUserTopic &&
    (cleaned.toLowerCase() === userTrimmed.toLowerCase() ||
      cleaned.toLowerCase() ===
        `the 1% insider playbook: ${userTrimmed.toLowerCase()}` ||
      cleaned.toLowerCase() ===
        `the 100% fact-checked playbook: ${userTrimmed.toLowerCase()}` ||
      cleaned.toLowerCase().includes(userTrimmed.toLowerCase()));

  if (isLazyUserEcho || HINGLISH_DETECTOR_REGEX.test(cleaned)) {
    return chapterDerivedEnglishTitle;
  }

  return cleaned;
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

  const hasCustomRaw = rawInput && String(rawInput).trim().length > 0;

  if (GROQ_FALLBACK_KEY) {
    try {
      const systemPrompt = isEbookMode
        ? `You are a Tier-1 Grey-Hat Oracle & Fact-Checked 1% Insider Strategist in India.
${
  hasCustomRaw
    ? `The user typed this specific custom topic (may be in Hinglish, Hindi, or English): "${String(rawInput).trim()}".
Translate and upgrade the user's EXACT request into 4 completely different, magnetic, high-converting, 100% Pure English Ebook Dossier titles that directly fulfill every requirement in "${String(rawInput).trim()}".
CRITICAL RULE: Stay 100% faithful to the user's exact topic! Do NOT mention ElevenLabs, Voice Cloning, Outlier.ai, or IndiaMART unless the user explicitly asked for them!`
    : `Turn the category ("${category}") into 4 completely different, extreme-FOMO, zero-fluff Grey-Hat Oracle Ebook Dossier titles in SUPER-SIMPLE ENGLISH (covering dark psychology WhatsApp closing, Instagram Trial-Reel micro-funnels, Google Maps local clinic arbitrage, Pinterest-to-Gumroad digital planners, free Harvard/Tata credentials, or ₹150 Indian pharmacy generic salts—NEVER mention ElevenLabs or Voice Cloning!).`
}
Never use the word "GlowCash" and never put low PDF prices like "₹19" or "₹29" as the income in the title.
Return strictly compact JSON: {"boostedIdeas": ["title 1", "title 2", "title 3", "title 4"]}`
        : `You are a "Lakho Mein Ek" Real-Time Personal Stylist & Meesho Mix-and-Match Outfit Combination Expert in India (Live Date: ${dailyCtx.formattedDate} | Today's Daily Focus: ${dailyCtx.todaysStylingFocus}).
${
  hasCustomRaw
    ? `The user typed this specific fashion/styling request: "${String(rawInput).trim()}".
Turn the user's exact request into 4 completely different, unique, non-generic 4-Piece Outfit Combination & Look-Transformation ideas in SUPER-SIMPLE, EASY-TO-UNDERSTAND ENGLISH.`
    : `Generate 4 completely different, unique, non-generic 4-Piece Outfit Combination & Look-Transformation ideas in SUPER-SIMPLE ENGLISH for Category: "${category}".`
}
RULES:
1. Combine 4 specific pieces with Exact-Inch Body-Proportion Math (e.g., "19-Inch Fitted Short Kurti + 39-Inch High-Rise Flared Bootcut Jeans + Oxidized Kamarbandh + Vintage Baguette Bag").
2. Focus on how the combination transforms the person's look (makes 5'0" girls look 5'5", hides lower tummy on Pear/Mid-Size bodies, glows on warm Indian skin, or builds a complete 4-piece look under ₹1,199).
Return strictly compact JSON: {"boostedIdeas": ["combo idea 1", "combo idea 2", "combo idea 3", "combo idea 4"]}`;

      const parsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        systemPrompt,
        `User Request: "${rawInput || (isEbookMode ? "2026-2027 Verified Non-Bidding Remote Income & Secret Portals" : "Unique 4-Piece Kurti & Jeans Body-Proportion Styling Combination")}" | Category: "${category}" | Live Date: ${dailyCtx.formattedDate} | Seed: ${Date.now()}`,
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
    avoidPreviousTitle = "",
  } = req.body || {};

  const dailyCtx = getRealTimeDailyStylingContext(Number(variationIndex));

  // Filter creative angles by category if selected, otherwise use all diverse angles
  const matchingAngles =
    categoryFilter && categoryFilter !== "All"
      ? DYNAMIC_REEL_CREATIVE_ANGLES.filter(
          (a) => a.category === categoryFilter
        )
      : DYNAMIC_REEL_CREATIVE_ANGLES;
  const activeAngles =
    matchingAngles.length > 0 ? matchingAngles : DYNAMIC_REEL_CREATIVE_ANGLES;

  const angleIdx =
    (Math.abs(Number(variationIndex)) +
      Math.floor(Math.random() * activeAngles.length)) %
    activeAngles.length;
  const chosenCreativeAngle = activeAngles[angleIdx];

  const hasCustomUserTheme =
    themeInput &&
    themeInput.trim().length > 0 &&
    themeInput.trim() !== avoidPreviousTitle.trim();

  const effectiveTheme = hasCustomUserTheme
    ? themeInput.trim()
    : chosenCreativeAngle.angleTitle;

  const stylingDirectionBlock = hasCustomUserTheme
    ? `- USER'S EXACT CUSTOM STYLING REQUEST: "${themeInput.trim()}" (Variation Angle #${variationIndex})
- 100% CUSTOM REQUEST FIDELITY: The user typed "${themeInput.trim()}" (may be in Hinglish or English). You MUST design all 4 clothing pieces, colors, Meesho search keywords, and styling tips 100% around "${themeInput.trim()}"! Do NOT ignore their request or substitute unrelated outfits!`
    : `- Creative Styling Theme: "${chosenCreativeAngle.angleTitle}"
- Silhouette & Body-Proportion Formula: "${chosenCreativeAngle.silhouetteFormula}"
- Recommended Color Harmony: "${chosenCreativeAngle.colorStory}"`;

  const jsonSchemaPrompt = `You are a Late-2026 / 2027 "Lakho Mein Ek" (1-in-100,000) Instagram Reels Algorithm Mastermind, Celebrity Indian Gen-Z Stylist & Meesho/Myntra Catalog Search Engineer in India.
LIVE REAL-TIME DATE CONTEXT: Today is ${dailyCtx.formattedDate}.
Your job is to create a 100% BRAND-NEW, NEVER-REPEATED, NON-GENERIC 4-Piece Mix-and-Match Outfit Combination & Viral Reel Pack for:
${stylingDirectionBlock}
${avoidPreviousTitle ? `- STRICT ANTI-REPETITION RULE: The user just saw "${avoidPreviousTitle}". You MUST generate a 100% DIFFERENT outfit combination, different colors, different garments, different Meesho search keywords, different hooks, and different hashtags!` : ""}

CRITICAL TITLE RULE:
- NEVER copy-paste the user's raw custom input verbatim into "concept.title"! Even if the user typed rough keywords or Hinglish, you MUST craft an attractive, editorial 100% Pure English Outfit Title summarizing the exact 4 pieces in searchTerms (e.g., "Wine Square-Neck Short Kurti + High-Rise Flared Bootcut Jeans: The 30:70 Height & Waist Illusion Combo").

HOW TO MAKE THIS REEL "LAKHO MEIN EK" (STAND OUT FROM LAKHS OF NORMAL MEESHO CREATORS):
- Normal creators just show random kurtis. YOU must include:
  1. Exact-Inch 30:70 Body-Proportion Math OR Tummy-Hide / Height-Illusion / Skin-Glow Color Theory tailored specifically to this outfit.
  2. The 1-Second Real Customer Review Reality Check (tell the creator in Shot 3 to flash a real Meesho customer review photo for 1 second to build instant 100% buyer trust).

CRITICAL TWO-LAYER LANGUAGE RULE (VIOLATION IS STRICTLY FORBIDDEN):
1. LAYER 1 — EASY HINGLISH FOR USER UNDERSTANDING ("Jo creator ko samajhne ke liye hai"):
   - Write ALL styling explanations, how to wear/combine the clothes, review checks, and video shooting instructions in SUPER-SIMPLE, FRIENDLY HINGLISH (Roman Hindi + simple English words) so the user can understand how to style the outfit effortlessly!
   - Specifically, these fields MUST be in EASY HINGLISH:
     * "curiosityIdentityAngle"
     * "firstTwoSecondVisual"
     * "whyItTriggersSharesAndSaves"
     * "lookTransformationFormula.beforeVsAfterLook"
     * "lookTransformationFormula.howToCombineAllFourPieces"
     * "lookTransformationFormula.threeWaysToRestyleCombo" (3 easy Hinglish ways to wear the combo)
     * "shotByShotPlan[].visualAction"
     * "searchTerms[].howToCombineAndStyle"
     * "searchTerms[].fabricAndFitCheck"

2. LAYER 2 — 100% CLEAN ENGLISH FOR EXTERNAL USE / COPY-PASTE ("Jo copy karke use karne ke liye hai"):
   - Everything the user copies to paste into Meesho, ChatGPT/AI, or Instagram MUST be in 100% PURE, CLEAN ENGLISH:
     * "concept.title" -> 100% Clean, Attractive English Outfit Title describing the 4 pieces (NEVER echo raw Hinglish user input!)
     * "shotByShotPlan[].onScreenText" -> 100% Clean, Viral Human-Toned English
     * "searchTerms[].exactKeyword" & "searchTerms[].backupSearchKeywords" -> 100% Pure English Meesho Catalog Keywords (5 to 8 simple product words: "Women + [Color] + [Neck/Sleeve/Fit] + [Fabric] + [Item Name]")
     * "reelPack.onScreenHooks" -> 3 Fresh, Human-Toned Viral English Hooks (8 to 16 words each, specific to THIS outfit!)
     * "reelPack.hinglishCaption" -> 100% Clean, Relatable Viral English Caption specifically describing these 4 pieces, why this color/proportion works, and asking viewers to comment LINK for instant Auto-DM
     * "reelPack.seoKeywords" -> 10 Real English Meesho/Instagram Search Phrases specific to this outfit
     * "reelPack.trendingHashtags" -> Strictly 5 lowercase English Indian fashion hashtags specific to this outfit

Return strictly valid JSON with this exact structure:
{
  "concept": {
    "title": "Attractive 100% Clean English Outfit Title naming Piece 1 + Piece 2 & the Body-Proportion Effect",
    "category": "${categoryFilter === "All" ? chosenCreativeAngle.category : categoryFilter}",
    "liveDailyTrendTag": "${dailyCtx.liveDailyTrendTag} · Variation #${variationIndex}",
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
      "exactKeyword": "Women [Color] [Neck/Sleeve] [Fabric] [Top/Kurti Name]",
      "backupSearchKeywords": ["English Meesho search 1", "English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how to tuck/wear Piece 1 with Piece 2",
      "priceFilter": "Under ₹349 · 4.1★+",
      "fabricAndFitCheck": "Easy Hinglish tip on what to check in Meesho customer review photos",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 2 · Leg-Lengthening Bottom",
      "exactKeyword": "Women [Color] High Waist [Fit/Style] [Jeans/Trousers/Palazzo]",
      "backupSearchKeywords": ["English Meesho search 1", "English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how this bottom changes body proportions",
      "priceFilter": "Under ₹449 · Free Delivery",
      "fabricAndFitCheck": "Easy Hinglish length and waist check in reviews",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 3 · Secret Third-Piece Layer / Waist Transformer",
      "exactKeyword": "Women [Color/Metal] [Waist Chain / Vest / Shrug / Belt / Dupatta]",
      "backupSearchKeywords": ["English Meesho search 1", "English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how Piece 3 upgrades the whole outfit",
      "priceFilter": "Under ₹249 · High Save Value",
      "fabricAndFitCheck": "Easy Hinglish review check",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 4 · Look-Finishing Bag, Footwear & Jewelry",
      "exactKeyword": "Women [Color] [Bag / Jhumka / Footwear]",
      "backupSearchKeywords": ["English Meesho search 1", "English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on finishing the look",
      "priceFilter": "Under ₹299",
      "fabricAndFitCheck": "Easy Hinglish review check",
      "platform": "Meesho"
    }
  ],
  "reelPack": {
    "onScreenHooks": [
      "10-16 word 100% Clean English human-toned Mistake/Gatekeeping/Body-Proportion hook specific to this outfit",
      "10-16 word 100% Clean English Price-Shock + Wait-for-Piece-3 watch-time loop hook specific to this outfit",
      "10-16 word 100% Clean English Bestie DM-Share relatable hook specific to this outfit"
    ],
    "autoDmTriggerWord": "LINK",
    "hinglishCaption": "100% Clean, Relatable Viral English Caption listing all 4 pieces, how to style them together, and telling viewers to comment LINK for instant DM",
    "seoKeywords": ["10 real English Indian Meesho & Instagram search phrases specific to this outfit"],
    "trendingHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  }
}`;

  const userPrompt = `Requested Styling Vibe: "${effectiveTheme}"
${hasCustomUserTheme ? `IMPORTANT: Build this 4-piece outfit 100% around the user's custom request "${themeInput.trim()}"!` : `Color Harmony to Use: ${chosenCreativeAngle.colorStory}\nSilhouette Formula: ${chosenCreativeAngle.silhouetteFormula}`}
Unique Generation Nonce: ${variationIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}
Generate a 100% fresh, unique 4-piece outfit combination with an attractive 100% Pure English outfit title, brand-new Meesho keywords, hooks, caption, SEO keywords, and 5 hashtags!`;

  const aiResponse = await callMultiModelLiveAI(
    jsonSchemaPrompt,
    userPrompt,
    Number(variationIndex)
  );
  const aiParsed = aiResponse?.parsed || null;
  const providerUsed = aiResponse
    ? `${aiResponse.providerName} (${dailyCtx.formattedDate})`
    : `2026 Live Daily Styling AI (${dailyCtx.formattedDate})`;

  const fallbackData = synthesizeExpertReelFallback(
    effectiveTheme,
    categoryFilter,
    backgroundDesc,
    Number(variationIndex) + Math.floor(Math.random() * 8)
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

  const conceptTitle = sanitizeAndPolishReelTitle(
    aiParsed.concept.title || fallbackData.concept.title,
    themeInput,
    validSearchTerms
  );

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
    avoidPreviousTitle = "",
  } = req.body || {};

  const matchingBlueprints =
    category && category !== "All"
      ? DYNAMIC_EBOOK_BLUEPRINTS.filter((b) => b.category === category)
      : DYNAMIC_EBOOK_BLUEPRINTS;
  const categoryPool =
    matchingBlueprints.length > 0
      ? matchingBlueprints
      : DYNAMIC_EBOOK_BLUEPRINTS;

  const nonRepeatingPool = categoryPool.filter(
    (b) =>
      !avoidPreviousTitle ||
      (!avoidPreviousTitle
        .toLowerCase()
        .includes(b.topicTitle.slice(0, 16).toLowerCase()) &&
        !b.topicTitle
          .toLowerCase()
          .includes(avoidPreviousTitle.slice(0, 16).toLowerCase()))
  );
  const activeBlueprints =
    nonRepeatingPool.length > 0 ? nonRepeatingPool : categoryPool;

  const bpIdx =
    (Math.abs(Number(variationIndex)) * 3 +
      Math.floor(Math.random() * activeBlueprints.length)) %
    activeBlueprints.length;
  const chosenBlueprint = activeBlueprints[bpIdx];

  const hasCustomUserTopic =
    topicInput &&
    topicInput.trim().length > 0 &&
    !DYNAMIC_EBOOK_BLUEPRINTS.some(
      (b) => b.topicTitle.toLowerCase() === topicInput.trim().toLowerCase()
    );

  const effectiveTopic =
    topicInput && topicInput.trim().length > 0
      ? topicInput.trim()
      : chosenBlueprint.topicTitle;

  const isExplicitlyAskingForChatAgents =
    hasCustomUserTopic &&
    /\b(chat\s*agent|chat\s*support|text\s*support|bidding\s*type\s*nhi|non[- ]?bidding\s*chat|outlier|oneforma|dataannotation)\b/i.test(
      effectiveTopic
    );

  const isExplicitlyAskingForVoiceOrElevenLabs =
    hasCustomUserTopic &&
    /\b(eleven\s*labs|elevenlabs|voice\s*clon|voiceover|voquent)\b/i.test(
      effectiveTopic
    );

  const customTopicFocusBlock = hasCustomUserTopic
    ? `CRITICAL 100% CUSTOM TOPIC FIDELITY RULE (HIGHEST PRIORITY — DO NOT VIOLATE!):
- The user typed this specific custom request (may be in Hinglish, Hindi, or English): "${effectiveTopic}"
- You MUST write ALL 5 CHAPTERS 100% dedicated to answering, researching, and fulfilling "${effectiveTopic}"!
- STRICT BAN ON REPETITIVE TOPICS: ${
        isExplicitlyAskingForVoiceOrElevenLabs
          ? `The user specifically asked about voice/audio—give 100% honest facts.`
          : `You are STRICTLY FORBIDDEN from mentioning ElevenLabs, Voice Cloning, Voquent, or IndiaMART Kurti Catalogs anywhere in this Ebook!`
      } ${
        isExplicitlyAskingForChatAgents
          ? `Since the user specifically asked for non-bidding chat agent / remote chat websites for Indians, cover 10 verified portals across the 5 chapters (2 per chapter: e.g. Modsquad, Concentrix Remote Chat, Chegg/CourseHero Written Q&A, TELUS Digital, Welocalize, OneForma, DataAnnotation, Appen CrowdGen, RWS TrainAI, SupportNinja).`
          : `You are STRICTLY FORBIDDEN from mentioning Outlier.ai, DataAnnotation, or ElevenLabs! Focus 100% on real, verified tools, websites, psychological triggers, and step-by-step execution specifically for "${effectiveTopic}"!`
      }
- QUANTITY & COMPLETENESS RULE: If the user asked for a specific number of websites/portals/methods (e.g., "10 websites", "5 apps", "7 tricks"), cover ALL of them across the 5 chapters (2 verified websites/methods per chapter = 10 total across the 5 chapters!).`
    : `- Mandatory 5-Chapter Focus for THIS Generation: ${chosenBlueprint.distinctChaptersFocus}
- STRICT BAN ON OVERUSED TOPICS: Do NOT write about ElevenLabs, Voice Cloning, or Outlier.ai in this dossier! Stick 100% to the 5 distinct chapter topics specified above!`;

  const jsonSchemaPrompt = `[SYSTEM ROLE: THE GREY-HAT ORACLE & ELITE BEHAVIORAL HACKER]
You are a Tier-1 Underground Strategist, Behavioral Psychology Expert, and Fact-Checked Information Broker in Late-2026 / 2027.
Your goal is to generate highly addictive, deeply detailed "classified 1% insider" knowledge on:
- Requested Subject: "${effectiveTopic}"
- Category: "${category === "All" ? chosenBlueprint.category : category}"
${customTopicFocusBlock}
${avoidPreviousTitle ? `- STRICT ANTI-REPETITION RULE: The user already generated: "${avoidPreviousTitle}". You MUST write a 100% DIFFERENT Ebook title, 5 completely different chapters/angles, different websites/portals, and different copy-paste scripts!` : ""}

[CRITICAL PSYCHOLOGICAL & GROUND-TRUTH TRIGGERS — MUST OBEY]
1. THE CULT OF SECRECY: Never give standard, generic, or boring textbook advice. Frame every chapter as a "classified loophole," "grey-hat mechanism," "psychological trigger," or "backdoor shortcut" that gives the reader an unfair advantage over the 99% of normal people.
2. FOMO & URGENCY: Make the reader feel that this window of opportunity is open right now for action-takers before the masses flood it.
3. RUTHLESS PRACTICALITY & 100% HONEST GROUND-TRUTH (ZERO TECHNICAL HALLUCINATIONS):
   - Every step must be hyper-specific, deeply detailed, unconventional, and immediately actionable today.
   - ZERO FAKE URLS / ZERO RANDOM DOCUMENT IDs: NEVER invent fake URLs (like saastrader.com, imagecheck.com, affiliate.amazon.in) or fake random Google Docs IDs (like docs.google.com/document/d/1Zx...). Only use 100% real, verified root domains and official portals:
     * Amazon Associates India: affiliate-program.amazon.in (Real commissions: 1%–4% on electronics/laptops, 5%–9% on home, kitchen, books & beauty — NEVER write "₹15% commission"!)
     * Meta Ad Library: facebook.com/ads/library (Filter: Country = India -> All Ads -> Active Ads)
     * Google Maps Local Arbitrage: google.com/maps (Businesses with 40+ reviews but NO Website button)
     * Canva Free: canva.com (Click "Create a design" -> "Custom size" — NEVER claim "Magic Resize" is free; Magic Resize is a paid Canva Pro feature!)
     * Screen Recording & Free B-Roll: obsproject.com (free OBS Studio) + pexels.com/videos (download free 4K B-roll FROM Pexels and combine with your OBS recording inside CapCut or DaVinci Resolve — NEVER say "export OBS clips to Pexels"!)
     * YouTube Monetization Truth: State clearly that YouTube AdSense requires 1,000 subscribers + 4,000 public watch hours (and real Indian AdSense RPM is ₹50–₹200 per 1,000 views), so Day-1 monetization uses Amazon Affiliate links (affiliate-program.amazon.in) + a ₹99–₹199 Digital Product link in the pinned comment!
     * Indian Checkout & Auto-DM: superprofile.bio, cosmofeed.com, gumroad.com, manychat.com
     * Free Certifications & Study: cs50.harvard.edu/x (free official Harvard CS50x certificate without paying edX), theforage.com (free Tata, JPMorgan, BCG & Deloitte virtual job simulations), notebooklm.google.com (free Audio Overview & source tables), perplexity.ai, typeset.io, apps.ankiweb.net, education.github.com/pack
     * Indian Pharmacy Salt Lookup: 1mg.com (Click the "Salt Composition" link under the medicine name; always state mandatory 24-hour inner-forearm patch test, max 2x/week night rule + SPF 50 next morning for Glyco-6 6% cream, and dermatologist consultation for prescription actives)
     * Global UX & Research Portals: usertesting.com/get-paid-to-test ($10 USD per 15–20 min test paid 14 days later via KYC-verified Indian PayPal), prolific.com (£6–£9/hr GBP via PayPal), dscout.com/scouts, trymata.com/get-paid-to-test, respondent.io
4. 100% VERIFIED MATHEMATICAL CALCULATIONS (ZERO ARITHMETIC ERRORS):
   - Every calculation in "incomeMathOrProof" MUST be 100% mathematically accurate and written as ONE SINGLE, CLEAN MULTIPLICATION FORMULA (do NOT combine 2 or 3 different products in one math equation!).
   - STRICT FORMULA FOR WEEKLY MATH: [Units/Week] × [₹ Unit Rate] = [₹ Exact Weekly Total]/week × 4 weeks = [₹ Exact Monthly Total]/month (Example: "2 client packs/week × ₹2,500 = ₹5,000/week × 4 weeks = ₹20,000/month").
   - STRICT FORMULA FOR DAILY MATH: [Units/Day] × [₹ Unit Rate] = [₹ Exact Daily Total]/day × 30 days = [₹ Exact Monthly Total]/month (Example: "10 PDF sales/day × ₹49 = ₹490/day × 30 days = ₹14,700/month").
   - NEVER confuse 1 week with 1 month! Double-check that A × B = C and Weekly × 4 = Monthly!
   - Always write full Rupee numbers with commas (e.g. ₹2,500, ₹20,000) instead of "₹4k", and use 1 USD = ₹85 and 1 GBP = ₹108 consistently.
5. TONE (MOST IMPORTANT):
   - Authoritative, sharp, highly intelligent, and motivating—you are handing the reader a loaded unfair advantage.
   - CRITICAL: Write in SUPER-SIMPLE, EASY-TO-UNDERSTAND, HONEST, NATURAL HUMAN ENGLISH! Do NOT use overly complex vocabulary, robotic AI clichés, or cheesy over-dramatic sci-fi words that feel fake. It must read like a real, street-smart, top-1% human mentor speaking directly and honestly to the reader.

CRITICAL EBOOK TITLE & PRICING RULES (VIOLATION IS STRICTLY FORBIDDEN):
1. NEVER PUT THE PDF SELLING PRICE (${priceDisplay}, ₹19, ₹29, ₹49) IN THE EBOOK TITLE OR CHAPTERS:
   - "${priceDisplay}" is ONLY the small price of the PDF guide in the Instagram Reel caption—it is NEVER the money the reader earns!
   - NEVER write "${priceDisplay} Cash", "Steps to ${priceDisplay}", "₹19", "₹29", or "₹49" inside "ebook.title", "ebook.subtitle", or any chapter!
2. NEVER COPY-PASTE THE USER'S RAW CUSTOM TOPIC VERBATIM INTO "ebook.title":
   - Even if the user typed rough keywords or Hinglish in Requested Subject ("${effectiveTopic}"), craft a polished, attractive, magnetic 100% PURE ENGLISH Book Title (8–14 words) that summarizes the exact classified knowledge and outcomes taught inside the 5 chapters!
3. 100% WHITE-LABEL EBOOK: Never mention "GlowCash" anywhere. Return EXACTLY 5 hashtags.

[OUTPUT FORMAT — STRICTLY FOLLOW THIS EXACT STRUCTURE FOR ALL 5 CHAPTERS]:
Each of the 5 chapters in "chapters" MUST contain deep, comprehensive detail across these exact fields:
- "title": High-impact pure English chapter title (without "Chapter X" prefix, as the UI adds "Chapter 0X · ")
- "subtitle": "⚠️ WARNING: Keep this strictly confidential. — [1-sentence sharp promise & Free ₹0 / Paid clarity]"
- "coreSecretSummary": "👁️ The 99% Illusion vs. The 1% Reality:" Write 3–4 detailed, hard-hitting sentences in simple human English ruthlessly exposing why what 99% of normal people do fails, followed by the unconventional 1% truth that actually works and motivates the reader.
- "whereToFindOrHiddenTrick": "🎯 The 'Grey-Hat' Mechanism (The Secret):" Write a detailed 3–4 sentence classified briefing revealing the core secret—the exact underrated portal/tool, algorithm backdoor, or psychological loophole, including the exact URL and real clickable UI path.
- "stepByStepExecution": Must be an array of 3 to 4 deeply detailed, step-by-step strings starting with these exact labels:
  * "1️⃣ The Infiltration: [Detailed instructions on how to set up the account, profile, or positioning quietly so you bypass 99% of competition]"
  * "2️⃣ The Trigger: [The exact action, real UI click-path, search filter, assessment secret, or behavioral hook that initiates the exploit]"
  * "3️⃣ The Leverage: [How to scale, pass quality checks, and extract maximum money, approvals, clients, or results effortlessly]"
  * "4️⃣ The Safety Lock: [Exact payout setup—e.g. KYC PayPal/Payoneer/UPI 50% advance—or anti-rejection rule so your effort is 100% protected]"
- "exactToolsOrWebsites": Array of 2 real verified websites/tools per chapter with exact URL, role, and insiderTip.
- "copyPasteTemplateOrScript":
  * "label": "🧠 The Jedi Mind-Trick / Secret Copy-Paste Script"
  * "content": A complete, detailed word-for-word script, assessment answer rubric, search operator formula, or behavioral action that acts like a cheat code.
- "incomeMathOrProof": "🔥 The Unfair Advantage:" 2 punchy, motivating sentences with 100% verified step-by-step arithmetic ([Unit Rate] × [Weekly Volume] = [Weekly Total]/week × 4 weeks = [Exact Monthly Total]/month) explaining why this makes the reader unstoppable while the 99% don't even see it coming.

Return strictly valid JSON with this exact structure:
{
  "ebook": {
    "editionTag": "CLASSIFIED 1% INSIDER DOSSIER · GREY-HAT ORACLE EDITION · ZERO FLUFF",
    "title": "Attractive, Magnetic 100% Pure English Book Title Summarizing What Is Taught Inside the 5 Chapters (NEVER include ${priceDisplay} or raw Hinglish!)",
    "subtitle": "Clear, high-status simple-English subtitle explaining the exact classified portals, psychological triggers & realistic outcome",
    "targetReaderPromise": "1–2 sentences of honest, motivating human English explaining the unfair advantage the reader will unlock today",
    "goldenRuleTitle": "⚠️ CLASSIFIED BRIEFING: The #1 Grey-Hat Execution & Anti-Scam Rule",
    "goldenRuleBody": "2–3 sentences in simple, sharp English explaining the #1 non-negotiable rule for executing this dossier safely and profitably",
    "hardestPartSolvedBox": {
      "title": "🔥 THE HARDEST PART SOLVED: Direct Backdoor Links, High-Approval Assessment Rules & Real UI Click-Paths",
      "exactWhereToFindMap": [
        "1. CLASSIFIED PORTAL / CLICK-PATH #1: Exact website URL + real clickable path + insider approval secret...",
        "2. CLASSIFIED PORTAL / CLICK-PATH #2: Exact website URL + real clickable path + insider approval secret...",
        "3. CLASSIFIED PORTAL / CLICK-PATH #3: Exact website URL + real clickable path + insider approval secret...",
        "4. CLASSIFIED PORTAL / CLICK-PATH #4: Exact website URL + real clickable path + insider approval secret..."
      ],
      "zeroFollowerTrafficTrick": "The exact 100% real ground-truth mechanism to get approved or win buyers without bidding wars or followers"
    },
    "quickValueBreakdown": [
      {"metric": "1. The 99% Trap Destroyed", "detail": "Why normal methods fail and how this dossier bypasses the crowd"},
      {"metric": "2. Upfront Capital Truth", "detail": "Clear breakdown of 100% Free (₹0) portals vs optional Paid tiers"},
      {"metric": "3. Real UI Click-Paths", "detail": "Every URL, button, and psychological script is 100% real and verified"},
      {"metric": "4. The Unfair Advantage", "detail": "Honest timeline and measurable weekly/monthly outcome"}
    ],
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "Chapter 1 Title in Attractive Pure English (Directly covering the requested topic)",
        "subtitle": "⚠️ WARNING: Keep this strictly confidential. — [Specific chapter focus & Free ₹0 / Paid clarity]",
        "coreSecretSummary": "Detailed 3–4 sentences for '👁️ The 99% Illusion vs. The 1% Reality' in simple, honest, motivating human English",
        "whereToFindOrHiddenTrick": "Detailed 3–4 sentences for '🎯 The Grey-Hat Mechanism (The Secret)' with exact URLs and real UI click-paths",
        "stepByStepExecution": [
          "1️⃣ The Infiltration: Detailed step-by-step setup...",
          "2️⃣ The Trigger: Detailed exact click-path, filter, or action...",
          "3️⃣ The Leverage: Detailed scaling and extraction method...",
          "4️⃣ The Safety Lock: Detailed payment/verification or anti-rejection rule..."
        ],
        "exactToolsOrWebsites": [
          {"name": "Exact Website URL #1", "role": "What role/work it offers (state Free ₹0 vs Paid clearly)", "insiderTip": "Exact high-approval insider tip"},
          {"name": "Exact Website URL #2", "role": "What role/work it offers (state Free ₹0 vs Paid clearly)", "insiderTip": "Exact high-approval insider tip"}
        ],
        "copyPasteTemplateOrScript": {
          "label": "🧠 The Jedi Mind-Trick / Secret Script",
          "content": "Complete, detailed word-for-word copy-paste script, prompt, or rubric template"
        },
        "incomeMathOrProof": "Detailed 2 sentences for '🔥 The Unfair Advantage' with 100% verified step-by-step math ([Unit Rate] × [Weekly Volume] = [Weekly Total]/week × 4 weeks = [Exact Monthly Total]/month) and motivating takeaway"
      }
    ],
    "twentyFourHourChecklist": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"]
  },
  "reelBlueprint": {
    "sixSecondVideoIdea": {
      "visualStyle": "6-Second Dark Aesthetic B-Roll / Screen Recording of This Classified Dossier PDF",
      "shotByShot": ["0.0s–2.0s: ...", "2.0s–4.0s: ...", "4.0s–6.0s: ..."],
      "lightingAndAudioTip": "2026 Instagram Edits & Trial Reel tip"
    },
    "psychologicalPriceOverlays": [
      {"triggerType": "1. Snack Price / FOMO Comparison", "overlayText": "Comparing ${priceDisplay} PDF access to a daily snack", "whyItConverts": "string"},
      {"triggerType": "2. The 99% vs 1% Curiosity Hook", "overlayText": "Why 99% fail while this ${priceDisplay} classified dossier gives the exact links", "whyItConverts": "string"},
      {"triggerType": "3. Hardest-Part Solved Hook", "overlayText": "Shows exact direct links, approval tests & Jedi Mind-Trick scripts", "whyItConverts": "string"}
    ],
    "autoDmCaption": "100% Clean, High-Converting Simple English caption about this exact topic asking viewers to comment ${autoDmTrigger} to get the ${priceDisplay} PDF guide",
    "seoKeywords": ["10 high-search 2026 keywords in clean English specific to this topic"],
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  }
} (Include 5 complete, deeply detailed, 100% fact-checked chapters in simple human English in "chapters" that 100% fulfill "${effectiveTopic}"!).`;

  const userPrompt = `USER'S EXACT REQUESTED EBOOK SUBJECT: "${effectiveTopic}"
${hasCustomUserTopic ? `IMPORTANT: Write all 5 chapters 100% about "${effectiveTopic}" using the Grey-Hat Oracle 6-part chapter structure! Verify every math calculation (Unit Rate × Weekly Volume = Weekly Total × 4 weeks = Exact Monthly Total) and use only 100% real URLs and real free tool click-paths! Do NOT write about IndiaMART, kurtis, or voice cloning unless "${effectiveTopic}" asks for it!` : `5-Chapter Blueprint Focus (use these exact verified portals, rules, and pre-verified math formulas!): ${chosenBlueprint.distinctChaptersFocus}`}
Category: "${category}"
Reel Caption PDF Offer Price (ONLY for Reel Caption/Overlays, NEVER put this price inside ebook.title or chapters!): ${priceDisplay} (Perceived Value: ${anchorPriceDisplay}) | Auto-DM Trigger: "${autoDmTrigger}"
Unique Generation Nonce: ${variationIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}
Write a 100% fresh, deeply detailed, human-toned 5-chapter Classified Insider Dossier Ebook in simple English with a polished 100% Pure English Book Title and 100% verified math!`;

  const aiResponse = await callMultiModelLiveAI(
    jsonSchemaPrompt,
    userPrompt,
    Number(variationIndex)
  );
  const aiParsed = aiResponse?.parsed || null;
  const providerUsed = aiResponse
    ? `${aiResponse.providerName} · Grey-Hat Oracle (2026)`
    : "2026 Grey-Hat Oracle AI";

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

  const polishedEbookTitle = sanitizeAndPolishEbookTitle(
    aiParsed.ebook.title,
    topicInput,
    aiParsed.ebook.chapters,
    priceDisplay
  );

  const rawHardestBox = aiParsed.ebook.hardestPartSolvedBox;
  const rawMapList = Array.isArray(rawHardestBox?.exactWhereToFindMap)
    ? rawHardestBox.exactWhereToFindMap
    : Array.isArray(rawHardestBox?.whereToFindFirst10BuyersOrLinks)
    ? rawHardestBox.whereToFindFirst10BuyersOrLinks
    : [];

  const normalizedHardestBox = {
    title: stripBrandFromEbookText(
      rawHardestBox?.title ||
        "🔥 THE HARDEST PART SOLVED: Direct Backdoor Links, High-Approval Rules & Real UI Click-Paths"
    ),
    exactWhereToFindMap:
      rawMapList.length > 0
        ? rawMapList.map((item: any) => stripBrandFromEbookText(String(item)))
        : [
            `1. Direct Portal / Search Filter #1: Use Google Search operator site:linkedin.com/in OR Google Maps "No-Website" filter to find direct contacts in 5 minutes.`,
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

  const exploitStepLabels = [
    "1️⃣ The Infiltration: ",
    "2️⃣ The Trigger: ",
    "3️⃣ The Leverage: ",
    "4️⃣ The Safety Lock: ",
  ];

  const normalizeExploitSteps = (rawSteps: any[]): string[] => {
    return rawSteps.map((s, sIdx) => {
      const cleaned = stripBrandFromEbookText(String(s || "")).trim();
      if (
        /^(1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|\d+\.|step\s*\d+)/i.test(cleaned) &&
        /(infiltration|trigger|leverage|safety)/i.test(cleaned)
      ) {
        return cleaned;
      }
      const strippedNum = cleaned.replace(/^(1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|step\s*\d+\s*[:.-]?|\d+\s*[:.)-])\s*/i, "");
      const prefix = exploitStepLabels[sIdx] || `Step ${sIdx + 1}: `;
      return `${prefix}${strippedNum}`;
    });
  };

  const result: EbookGenerationResult = {
    id: `ebook-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    topicInput: polishedEbookTitle,
    category,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    providerUsed,
    ebook: {
      editionTag:
        stripBrandFromEbookText(aiParsed.ebook.editionTag) ||
        "CLASSIFIED 1% INSIDER DOSSIER · GREY-HAT ORACLE EDITION",
      title: polishedEbookTitle,
      subtitle: stripBrandFromEbookText(
        aiParsed.ebook.subtitle ||
          "Classified 1% Execution Dossier (With Direct Backdoor Links, Psychological Triggers & Copy-Paste Scripts)"
      ),
      targetReaderPromise: stripBrandFromEbookText(
        aiParsed.ebook.targetReaderPromise ||
          `Actionable 2026 1% insider system for ${polishedEbookTitle}`
      ),
      goldenRuleTitle: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleTitle ||
          "⚠️ CLASSIFIED BRIEFING: The #1 Grey-Hat Execution & Safety Rule"
      ),
      goldenRuleBody: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleBody ||
          "Never waste time on generic 99% advice. Follow the exact Infiltration, Trigger, and Leverage steps in this dossier for 14 straight days."
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
                  : String(q || `Actionable step for this playbook`)
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
                detail: `Master every verified portal in this playbook with step-by-step scripts`,
              },
            ],
      chapters: aiParsed.ebook.chapters.map((ch: any, idx: number) => {
        const rawSub = stripBrandFromEbookText(
          ch.subtitle || `Classified 1% Execution System (Part ${idx + 1})`
        );
        const formattedSub = rawSub.includes("WARNING")
          ? rawSub
          : `⚠️ WARNING: Keep this strictly confidential. — ${rawSub}`;
        const rawSteps =
          Array.isArray(ch.stepByStepExecution) &&
          ch.stepByStepExecution.length > 0
            ? ch.stepByStepExecution
            : Array.isArray(ch.actionSteps) && ch.actionSteps.length > 0
            ? ch.actionSteps
            : [
                `1️⃣ The Infiltration: Open the verified portal listed below for ${effectiveTopic} and set up your clean profile.`,
                `2️⃣ The Trigger: Apply the exact Grey-Hat search filter and click-path shown above.`,
                `3️⃣ The Leverage: Use the Jedi Mind-Trick script below to lock in approvals and daily cashflow.`,
              ];

        return {
          chapterNumber: Number(ch.chapterNumber) || idx + 1,
          title: stripBrandFromEbookText(
            (ch.title || `Core Insider System ${idx + 1}`).replace(
              /^chapter\s*0?\d+\s*[:·.-]\s*/i,
              ""
            )
          ),
          subtitle: formattedSub,
          coreSecretSummary: stripBrandFromEbookText(
            ch.coreSecretSummary ||
              ch.explanation ||
              ch.secretPrinciple ||
              `99% of people fail at ${effectiveTopic} because they follow crowded public advice. The 1% reality is using direct, uncrowded portals with exact verification filters.`
          ).replace(
            /^👁️?\s*(?:the\s*99%\s*illusion\s*vs\.?\s*the\s*1%\s*reality\s*[:.\-–—]?)\s*/i,
            ""
          ),
          whereToFindOrHiddenTrick: stripBrandFromEbookText(
            ch.whereToFindOrHiddenTrick ||
              `Open the verified portal listed below -> apply the exact filter and click-path -> use the Jedi Mind-Trick script to skip 99% of the queue.`
          ).replace(
            /^🎯?\s*(?:the\s*['"‘’“”]?grey[-‑–—\s]?hat['"‘’“”]?\s*mechanism\s*(?:\(the\s*secret\))?\s*[:.\-–—]?)\s*/i,
            ""
          ),
          stepByStepExecution: normalizeExploitSteps(rawSteps),
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
                    role: "Direct Discovery & Verification (100% Free)",
                    insiderTip:
                      "Use exact-match quotes and site: filters to find direct links in 10 seconds.",
                  },
                ],
          copyPasteTemplateOrScript:
            typeof ch.copyPasteTemplateOrScript === "object" &&
            ch.copyPasteTemplateOrScript?.content
              ? {
                  label: stripBrandFromEbookText(
                    ch.copyPasteTemplateOrScript.label ||
                      "🧠 The Jedi Mind-Trick / Secret Script"
                  ),
                  content: stripBrandFromEbookText(
                    String(ch.copyPasteTemplateOrScript.content)
                  ),
                }
              : {
                  label: "🧠 The Jedi Mind-Trick / Secret Script",
                  content: stripBrandFromEbookText(
                    typeof ch.copyPasteTemplateOrScript === "string"
                      ? ch.copyPasteTemplateOrScript
                      : ch.copyPasteTemplate ||
                          `Comment "${autoDmTrigger}" below and I will DM you the complete ${effectiveTopic} step-by-step link in 5 seconds!`
                  ),
                },
          incomeMathOrProof: auditAndFixIncomeMathEquation(
            ch.incomeMathOrProof ||
              `Gives you an immediate unfair advantage while 99% of your competitors are still stuck guessing.`
          ),
        };
      }),
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

// Explicitly serve /sw.js and /manifest.json with proper Android Chrome WebAPK headers
app.get("/sw.js", (_req, res) => {
  const swPath = fs.existsSync(path.join(process.cwd(), "public", "sw.js"))
    ? path.join(process.cwd(), "public", "sw.js")
    : path.join(process.cwd(), "dist", "sw.js");
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(swPath);
});

app.get(["/manifest.json", "/manifest.webmanifest"], (_req, res) => {
  const manifestPath = fs.existsSync(
    path.join(process.cwd(), "public", "manifest.json")
  )
    ? path.join(process.cwd(), "public", "manifest.json")
    : path.join(process.cwd(), "dist", "manifest.json");
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.sendFile(manifestPath);
});

async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasBuiltDist = fs.existsSync(path.join(distPath, "index.html"));
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (hasBuiltDist && process.env.npm_lifecycle_event === "start");

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
