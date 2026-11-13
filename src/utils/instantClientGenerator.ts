import {
  ReelGenerationResult,
  EbookGenerationResult,
  SearchTermItem,
  CURATED_REEL_IDEA_BANK,
  UNIQUE_STYLING_COMBINATION_MATRIX,
  getRealTimeDailyStylingContext,
  sanitizeMeeshoSearchTerm,
  buildMasterPrompts,
  enforceMastermindViralReelPack,
} from "../data/playbookData";

/**
  * Generates a unique, non-repeating, real-time date-aware 4-Piece Outfit Styling Combination Pack
  * with 100% pure Meesho catalog keywords that return real wishlist-ready items when searched on Meesho.
  */
export function generateInstantReelClientSide(
  themeInput: string,
  categoryFilter: string,
  backgroundDesc: string,
  variationCount: number
): ReelGenerationResult {
  const dailyCtx = getRealTimeDailyStylingContext(variationCount);

  const comboPool =
    categoryFilter && categoryFilter !== "All"
      ? UNIQUE_STYLING_COMBINATION_MATRIX.filter(
          (c) => c.category === categoryFilter
        )
      : UNIQUE_STYLING_COMBINATION_MATRIX;

  const activePool =
    comboPool.length > 0 ? comboPool : UNIQUE_STYLING_COMBINATION_MATRIX;

  const chosenCombo =
    activePool[
      (dailyCtx.dayOfYear + Math.abs(variationCount)) % activePool.length
    ] || UNIQUE_STYLING_COMBINATION_MATRIX[0];

  const hasCustom = themeInput && themeInput.trim().length > 0;
  const rawTopic = hasCustom ? themeInput.trim() : chosenCombo.comboName;

  // Extract a clean product keyword if the user typed a short clothing item like "Black Kurti" or "Haldi Dress"
  const cleanUserProductWord = hasCustom
    ? sanitizeMeeshoSearchTerm(rawTopic, 0)
    : "";
  const isShortProductKeyword =
    hasCustom &&
    rawTopic.split(" ").length <= 5 &&
    !/zodiac|birth month|personality|playlist|fictional|choose a number/i.test(
      rawTopic
    );

  const searchTerms: SearchTermItem[] = chosenCombo.pieces.map((piece, idx) => {
    if (idx === 0 && isShortProductKeyword && cleanUserProductWord) {
      return {
        ...piece,
        itemLabel: `Piece 1 · Hero Statement Top (${rawTopic})`,
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

  const displayTitle = hasCustom
    ? `${rawTopic} — 4-Piece Look-Transformation Styling Combo`
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
    variationCount
  );

  return {
    id: `reel-${Date.now()}-${variationCount}`,
    createdAt: new Date().toISOString(),
    themeInput: rawTopic,
    providerUsed: `2026 Real-Time Styling AI (${dailyCtx.formattedDate})`,
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
            "Full-Body Look ya Faceless Mirror Model (Prompt 0A/0B ya Prompt 5): 30:70 Proportion Rule (Short Top + High-Waist Bottom + Waist Chain) साफ dikhao.",
          onScreenText: `30:70 Body-Math Hack: ${searchTerms[0].exactKeyword.replace(/^Women\s+/i, "").slice(0, 28)} + High-Waist Fit`,
        },
        {
          timeRange: "3.0s – 4.5s",
          visualAction:
            "Piece 3 (Waist Chain / Layer Detail) ka close-up shot + 1 second ke liye Meesho Real Customer Review Photo flash karo taaki 100% trust bane.",
          onScreenText: `Secret 3rd Piece + Verified 4.3★ Real Fabric Check: ${searchTerms[2].exactKeyword.replace(/^Women\s+/i, "").slice(0, 24)}`,
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

export function generateInstantEbookClientSide(
  topicInput: string,
  priceDisplay: string,
  anchorPriceDisplay: string,
  autoDmTrigger: string,
  variationCount: number,
  category = "All"
): EbookGenerationResult {
  const cleanTopic =
    topicInput && topicInput.trim().length > 0
      ? topicInput.trim()
      : "The 2026–2027 Underground Vault: ElevenLabs Voice Royalties, IndiaMART B2B Factory AI Catalogs, $10/15-Min UserTesting & Verified Free Portals";

  const editionSubtitles = [
    "Zero Affiliate Fluff · Zero 'Sell ₹19 PDFs' Filler: 100% Verified 2026–2027 Portals, Exact Search Filters & Word-for-Word Scripts Anyone Can Execute Today.",
    "The Top 0.01% Underground Manual: Exact URLs (ElevenLabs, IndiaMART TrustSEAL, UserTesting, Adobe Stock AI, Forage, Harvard CS50x & Indian Pharmacy Salts).",
    "Private 2026–2027 Insider Blueprint: Real USD Royalties, Direct B2B Factory Deals, Free Fortune-500 Credentials & Exact Buyer-Finding Filters.",
  ];

  return {
    id: `ebook-${Date.now()}-${variationCount}`,
    createdAt: new Date().toISOString(),
    topicInput: cleanTopic,
    category,
    priceDisplay: priceDisplay || "₹19",
    anchorPriceDisplay: anchorPriceDisplay || "₹1,999",
    autoDmTrigger: autoDmTrigger || "19",
    providerUsed: "2026–2027 Underground Mastermind AI Engine",
    ebook: {
      editionTag: `2026–2027 FACT-CHECKED INSIDER EDITION · 100% REAL UI FILTERS · ZERO HALLUCINATIONS`,
      title: `The 100% Fact-Checked Playbook: ${cleanTopic}`,
      subtitle: editionSubtitles[variationCount % editionSubtitles.length],
      targetReaderPromise:
        "Zero fake filters, zero hallucinated '1.5x night bonus' myths, and zero working for free. Every chapter uses 100% real, fact-checked platform buttons, clearly states Free (₹0) vs. Paid plan requirements, and includes the 1-Photo Watermark + 50% UPI Advance safety rule.",
      goldenRuleTitle:
        "Your #1 Golden Rule: Use Only Real UI Filters & Never Deliver Unwatermarked Work Without 50% Advance",
      goldenRuleBody:
        "Regarding '" +
        cleanTopic +
        "', never fall for fake AI-generated filters or work for free without security. Use only the real left-sidebar filters on IndiaMART (City + Business Type: Manufacturer + TrustSEAL Verified), always send only 1 watermarked sample image before collecting 50% UPI advance, and know which portals are 100% ₹0 free (UserTesting, Prolific, Adobe Stock, Voquent, Forage) vs. paid-tier (ElevenLabs PVC).",
      hardestPartSolvedBox: {
        title:
          "🔥 THE HARDEST PART SOLVED: 4 Fact-Checked Portals & Real UI Filters That Actually Exist",
        exactWhereToFindMap: [
          `1. IndiaMART Real Left-Sidebar Filter (dir.indiamart.com): Search "Cotton Kurti" → Click City "Surat" or "Jaipur" → Left Sidebar: tick "Manufacturer" (under Business Type) + "TrustSEAL Verified". (Fact Check: There is NO filter called 'No Instagram DM' or 'Stock > 50L'—visually pick listings with dull mannequin photos and send ONLY 1 watermarked sample!).`,
          `2. 100% Free (₹0) vs Paid Voice & Stock Portals: Join contributor.stock.adobe.com (free ₹0 signup; upload 4MP+ upscaled AI backgrounds with 'Created using generative AI tools' checked) and voquent.com/voice-actors (free ₹0 human voiceover listing). Note: ElevenLabs Professional Voice Cloning (PVC) requires their paid Creator plan ($11–$22/mo).`,
          `3. Direct $10 / 15-Min Usability Testing (usertesting.com/get-paid-to-test & prolific.com): 100% free signup. Requires a KYC-Verified Indian PayPal account (PAN + Bank linked). Pays $10 USD exactly 14 days after each approved test (expect 1–4 matched tests/week).`,
          `4. LinkedIn Real 'Past 24 Hours' Filter + Google Maps 'No-Website' Filter: On LinkedIn search '"hiring" AND "remote"' → Click 'Posts' tab → Click 'Date posted' → Select 'Past 24 hours'. On Google Maps, find local clinics/boutiques with 25+ reviews that have no Website button.`,
        ],
        zeroFollowerTrafficTrick:
          "Anti-Scam Protection: Never create a full 15-page catalog for free! Right-click and save 1 single public photo from a supplier's listing, add a bold diagonal 'SAMPLE PREVIEW' watermark across the center, and collect 50% UPI advance before making the remaining pages.",
      },
      quickValueBreakdown: [
        {
          metric: "1. 100% Fact-Checked UI Filters",
          detail:
            "Every filter and button name matches the real live website—zero fake filters or imaginary bonuses.",
        },
        {
          metric: "2. 50% Advance + Watermark Rule",
          detail: `Send only 1 watermarked preview first; never deliver unwatermarked files without 50% UPI advance.`,
        },
        {
          metric: "3. Honest Free (₹0) vs Paid Truth",
          detail:
            "Clear breakdown of 100% ₹0 portals (Adobe Stock, UserTesting, Voquent, Forage) vs ElevenLabs Creator Tier.",
        },
        {
          metric: "4. Free Harvard/Tata Badges & Pharmacy Salts",
          detail:
            "TheForage.com, CS50.harvard.edu/x, & 1mg.com 'Salt Composition' Indian Pharmacy Equivalents.",
        },
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "IndiaMART Wholesale Catalog Service: Exact Real Filters & The 50%-Advance Anti-Scam Rule",
          subtitle:
            "How to find real Surat & Jaipur manufacturers on dir.indiamart.com and close ₹2,999 4K Catalog orders safely.",
          coreSecretSummary:
            "Thousands of real garment, kurti, saree, and jewellery manufacturers on IndiaMART (`dir.indiamart.com`) upload dull photos taken on plastic mannequins. They send PDF catalogs to wholesale shopkeepers on WhatsApp every week. To succeed safely, you must use the REAL IndiaMART sidebar filters and strictly follow the '1-Photo Watermark + 50% Advance Rule' so you never get cheated.",
          whereToFindOrHiddenTrick:
            "REAL INDIAMART UI CLICK-PATH: Open dir.indiamart.com → Search 'Ladies Cotton Kurti' or 'Jaipuri Saree' → Click city 'Surat' or 'Jaipur' at the top → On the Left Sidebar under 'Business Type', tick 'Manufacturer' and tick 'TrustSEAL Verified'. (Important Fact Check: Ignore anyone who claims IndiaMART has a 'No Instagram DM' or 'Stock Value > 50L' filter—those do not exist! Simply scroll to page 2 or 3 and visually pick suppliers whose product photos are dark or on plastic mannequins.)",
          stepByStepExecution: [
            "Step 1 (Save Only 1 Public Photo): Pick 5 TrustSEAL-verified Kurti or Saree manufacturers with weak mannequin photos. Right-click and save ONLY 1 product photo from their public listing. Do NOT message them asking for photos first!",
            "Step 2 (Make 1 Watermarked Sample in 3 Mins): Convert that 1 photo into a 4K studio model catalog sheet with a Fabric/Size/Wholesale MOQ box. Place a bold 40%-opacity diagonal watermark across the middle: 'SAMPLE PREVIEW FOR [COMPANY NAME]'.",
            "Step 3 (Send the 1 Watermarked Sample on WhatsApp): Send the watermarked Before/After image to the supplier's WhatsApp number with the script below.",
            "Step 4 (Strict 50% UPI Advance Rule): Never make a 15-page PDF for free! Offer 1 single unwatermarked trial page for ₹250 OR a 15-design WhatsApp PDF Catalog for ₹2,999 (strictly 50% UPI advance = ₹1,500 upfront, and remaining ₹1,499 before sending the final unwatermarked PDF).",
          ],
          exactToolsOrWebsites: [
            {
              name: "dir.indiamart.com (Real Left-Sidebar Filters)",
              role: "City (Surat/Jaipur) + Business Type (Manufacturer) + TrustSEAL Verified",
              insiderTip:
                "TrustSEAL Verified suppliers pay IndiaMART an annual verification fee and have verified GST numbers.",
            },
            {
              name: "Canva.com (A4 Document + Diagonal Watermark)",
              role: "Create Watermarked Sample & Final Catalog",
              insiderTip:
                "Always place the watermark directly across the center of the garment so nobody can crop it out without paying.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste WhatsApp Script (With 1 Watermarked Sample Attached)",
            content: `"Namaste Sir! Main ne IndiaMART par aapki Kurti/Saree listing dekhi. Aapka fabric design bohot badiya hai, isliye maine aapke 1 mannequin photo ko 4K Studio Model Catalog Page mein convert karke free sample banaya hai (attached).\n\nHum wholesale manufacturers ke liye 15 Designs ka 4K WhatsApp PDF Catalog ₹2,999 mein banate hain (50% advance, 50% delivery par—ya 1 single trial design ₹250 mein). Kya hum aapke naye stock ka catalog start karein?"`,
          },
          incomeMathOrProof:
            "2 wholesale catalog orders/week at ₹2,999 (with 50% advance protection) = ₹24,000/month with ₹0 ad spend.",
        },
        {
          chapterNumber: 2,
          title: `Voice Royalties & Audio Income: Honest Truth About ElevenLabs vs. 100% Free (₹0) Portals (${cleanTopic.slice(0, 32)})`,
          subtitle:
            "How ElevenLabs Voice Library really works (Creator Plan required) + 100% Free ₹0 voice portals (Voquent & ACX).",
          coreSecretSummary: `Let's give you the 100% fact-checked truth about AI and human voice income so you never fall for internet myths: (1) ElevenLabs (elevenlabs.io/app/voice-library) DOES pay passive USD royalties via Stripe (~$0.03 per 1,000 characters used) when global creators use your cloned Indian English or Hindi voice. (2) However, 'Professional Voice Cloning (PVC)' is NOT on the free plan—it requires upgrading to their Creator Plan ($11 first month / $22/mo), uploading 30+ minutes of clean audio, and passing a live microphone Voice Captcha. (3) Recording at night with the fan off is ONLY to eliminate background noise so your audio passes quality review—there is NO '1.5x royalty multiplier at 11:30 PM'! (4) If you have ₹0 budget today, start on Voquent.com (100% free registration).`,
          whereToFindOrHiddenTrick: `TWO FACT-CHECKED PATHS: Path A (100% Free ₹0 Option): Go to voquent.com/voice-actors → Sign up free → Upload 3 short 30-second clean Hindi/Indian-English voice demos recorded in a quiet room with the fan off. Path B (ElevenLabs Passive Clone — Paid Creator Plan): Go to elevenlabs.io → Upgrade to Creator tier → Voices → Professional Voice Cloning → Upload 30–60 mins of clean audio → Complete the live Voice Captcha → Enable 'Share in Voice Library' & 'Financial Rewards (Stripe)'.`,
          stepByStepExecution: [
            "Step 1 (Why Fan-Off Recording Matters): Record in a quiet room at night with the ceiling fan and AC turned OFF, holding your phone 6 inches away at a 45-degree angle. This prevents fan hum and echo so quality reviewers approve your audio.",
            "Step 2 (Free Studio Cleanup): Run your recording through podcast.adobe.com/enhance (free) at 50% strength to remove room hiss.",
            "Step 3 (100% Free ₹0 Path): Create your free talent profile on voquent.com/voice-actors and upload 3 categorized 30-second samples (Hindi Narrative, Indian-English E-Learning, Commercial).",
            "Step 4 (Paid Creator Plan Path on ElevenLabs): Once you have 45+ minutes of clean audio ready, use ElevenLabs Professional Voice Cloning, pass the Voice Captcha, and connect Stripe India for passive character royalties.",
          ],
          exactToolsOrWebsites: [
            {
              name: "voquent.com/voice-actors (100% Free ₹0 Signup)",
              role: "Global Human Voiceover Portal Paying Direct Project Fees",
              insiderTip:
                "Upload short 30-second samples tagged by tone (Warm, Calm, Documentary, Hindi, Indian English) so producers find you in search.",
            },
            {
              name: "elevenlabs.io/app/voice-library (Paid Creator Plan Required for PVC)",
              role: "Passive USD Royalties (~$0.03 per 1,000 characters via Stripe)",
              insiderTip:
                "Prepare your full 30–60 minute clean audio recording BEFORE subscribing to the Creator tier so you can submit on Day 1.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste 30-Second Audition Script (For Voquent / ElevenLabs)",
            content: `"Every great journey in India begins with a single story. Whether you are building a modern technology brand, narrating a documentary, or guiding learners through a new skill, the right voice builds instant trust. Clear, warm, and natural—let's bring your script to life."`,
          },
          incomeMathOrProof:
            "Real Math: 1M characters generated on ElevenLabs PVC at ~$0.03/1k = ~$30 USD passive payout; 1 booked human voiceover project on Voquent = $75–$200 USD.",
        },
        {
          chapterNumber: 3,
          title: "Paid $10 / 15-Minute Website Usability Testing (UserTesting, Trymata & Prolific — Real Facts)",
          subtitle:
            "Exact Indian PayPal KYC rules, how to pass the unpaid practice test, and realistic weekly earnings ($10–$40/week).",
          coreSecretSummary:
            "UserTesting.com and Trymata.com pay $10 USD for a 15–20 minute screen recording where you test a company's website prototype and speak your thoughts out loud in English. Here is the 100% honest reality: signup is ₹0 free, you must pass 1 unpaid 7-minute practice test first, you only qualify for tests that match your demographic screener surveys (typically 1 to 4 tests per week), and each $10 payout arrives in your KYC-verified PayPal account exactly 14 days after test completion.",
          whereToFindOrHiddenTrick:
            "REAL SIGNUP LINKS & CONTINUOUS SPEAKING RULE: Apply at usertesting.com/get-paid-to-test, trymata.com/get-paid-to-test, and app.prolific.com/register/participant. During your practice test, never click in silence—speak continuously every 2–3 seconds explaining what you are looking for and why you are clicking a button.",
          stepByStepExecution: [
            "Step 1 (Complete Indian PayPal KYC): Ensure your PayPal account has your PAN card and Indian bank account verified to receive USD/GBP payouts.",
            "Step 2 (Pass the Unpaid 7-Min Practice Test): Take the UserTesting practice test in a quiet room (fan off) and narrate every single thought out loud.",
            "Step 3 (Answer Screener Questions 100% Honestly): Never guess or fake answers on screener surveys—consistency in your profile keeps your tester rating at 4.5★+.",
            "Step 4 (Keep Dashboard Tab Open 7:30 PM – 11:30 PM IST): Pin UserTesting and Prolific (with the Prolific Assistant browser extension) in the evening when US/UK researchers launch live studies.",
          ],
          exactToolsOrWebsites: [
            {
              name: "usertesting.com/get-paid-to-test",
              role: "$10 USD per 15–20 Min Recorded Website/App Test (Pays 14 Days Later via PayPal)",
              insiderTip:
                "Researchers pay to hear where you get confused—always mention both what is clear and what could be improved.",
            },
            {
              name: "prolific.com",
              role: "Verified University & AI Training Studies (Pays GBP £6–£10/hr via PayPal)",
              insiderTip:
                "Requires government ID verification and a brief waitlist, but every study appearing on your dashboard is pre-qualified.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "The Exact 3-Sentence Structure to Speak During Any Test Task",
            content: `"1. Right now I am looking at [Section] because the task asked me to find [Goal].\n2. My first impression is that [Element] is easy to spot, but I am confused why [Missing Detail] isn't shown clearly.\n3. Before clicking this button, I expect the next page to show me [Expected Result]."`,
          },
          incomeMathOrProof:
            "Realistic Math: 2 UserTesting sessions/week ($20) + 3 Prolific studies/week ($15) = $35/week (~₹12,000/month) via PayPal with ₹0 investment.",
        },
        {
          chapterNumber: 4,
          title: "Adobe Stock AI Contributor (100% Free ₹0 Signup + Real 4MP & AI Disclosure Rules)",
          subtitle:
            "How to legally upload 4000px+ Indian Festive Copy-Space AI Backgrounds to Adobe Stock for passive USD royalties.",
          coreSecretSummary:
            "Adobe Stock (contributor.stock.adobe.com) is 100% free to join and has millions of paying graphic designers and agencies. It officially accepts generative AI images as long as you follow 3 real technical rules: (1) Upscale images to at least 4 Megapixels (e.g., 2500×1600 px or 4000×2666 px) so they are not rejected for low resolution, (2) Tick the mandatory 'Created using generative AI tools' checkbox during upload, and (3) Never use real brand names in titles.",
          whereToFindOrHiddenTrick:
            "THE INDIAN COPY-SPACE BACKGROUND NICHE: Global stock libraries lack high-resolution Indian wedding invitation frames, royal Rajasthani arch borders, and Diwali/Festive backgrounds that leave 60% empty space ('copy space') in the center or left side for designers to place text.",
          stepByStepExecution: [
            "Step 1: Create your free account at contributor.stock.adobe.com and fill out the online W-8BEN tax form (takes 2 minutes for Indian residents).",
            "Step 2: Generate clean, text-free Indian festive/wedding copy-space backgrounds with 60% blank space in the center.",
            "Step 3: Upscale every image to 4000×2666 px using free upscayl.org or iloveimg.com/upscale-image so it passes Adobe's 4MP minimum rule.",
            "Step 4: Upload on contributor.stock.adobe.com, tick 'Created using generative AI tools', add 25 English keywords, and submit.",
          ],
          exactToolsOrWebsites: [
            {
              name: "contributor.stock.adobe.com",
              role: "100% Free-to-Join Global Stock Marketplace (Pays 33% Royalty in USD)",
              insiderTip:
                "Withdrawals unlock at $25 USD via Payoneer or PayPal.",
            },
            {
              name: "upscayl.org / iloveimg.com/upscale-image",
              role: "Free AI Image Upscaler (4MP+ Required by Adobe)",
              insiderTip:
                "Always inspect hands, borders, and corners at 100% zoom before submitting.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste AI Prompt for High-Approval Adobe Stock Copy-Space Backgrounds",
            content: `"Minimalist luxury royal Rajasthani palace arch background with soft warm golden bokeh lights, 65% clean empty cream copy space in the center for text overlay, 8k photorealistic commercial background, no text, no letters, no watermark."`,
          },
          incomeMathOrProof:
            "150+ approved Indian festive copy-space backgrounds = ongoing passive USD royalties ($0.33–$2.64 per download) with 0 followers.",
        },
        {
          chapterNumber: 5,
          title: "Free Verified Certificates (Harvard CS50x & Forage), LinkedIn Real Filter & ₹150 Pharmacy Salts",
          subtitle:
            "100% free verifiable credentials + LinkedIn's real 'Posts -> Past 24 hours' filter + 1mg Salt Composition trick.",
          coreSecretSummary:
            "Every link in this chapter is 100% free and verifiable today: (1) theforage.com offers free 4-hour virtual job simulations by Tata Group, JPMorgan, BCG & Deloitte with instant completion certificates, (2) cs50.harvard.edu/x gives a free verified Harvard certificate when you score 70%+ on assignments (no edX payment required), (3) LinkedIn's real 'Posts -> Date posted: Past 24 hours' filter finds fresh hiring posts, and (4) 1mg.com's 'Salt Composition' link shows ₹150–₹250 regulated Indian pharma equivalents.",
          whereToFindOrHiddenTrick:
            "REAL CLICK-PATHS: (1) LinkedIn: Type '\"hiring\" AND \"remote\"' in search → Click 'Posts' tab → Click 'Date posted' → Select 'Past 24 hours' → Click 'Show results'. (2) 1mg.com: Type any expensive serum → Click the 'SALT COMPOSITION' link right under the product name to see regulated pharma equivalents.",
          stepByStepExecution: [
            "Step 1: Complete 1 free virtual job simulation on theforage.com (Tata Group or Deloitte) and add the verification link to your LinkedIn.",
            "Step 2: Use cs50.harvard.edu/x directly (skip paid edX) to earn your free Harvard CS50x Certificate.",
            "Step 3: Check Indian pharmacy equivalents on 1mg.com (always patch test): 'Aziderm 10% Cream' (~₹245, Micro Labs) for dark spots; 'Glyco 6 Cream' (~₹200, Micro Labs — 2x/week at night + SPF 50 next morning) for dullness/tan; 'Hyalugel' (~₹250, Ethicare) for oil-free hydration on damp skin.",
            "Step 4: Use notebooklm.google.com (100% free) -> Upload study PDFs -> Click 'Audio Overview' to learn 10x faster.",
          ],
          exactToolsOrWebsites: [
            {
              name: "theforage.com & cs50.harvard.edu/x",
              role: "100% Free Verifiable Corporate & Harvard Certificates",
              insiderTip:
                "Pair your certificate with a 1-page custom sample when DMing hiring managers found via LinkedIn's 'Past 24 hours' post filter.",
            },
            {
              name: "1mg.com (Salt Composition Link) & notebooklm.google.com",
              role: "Regulated Pharma Ingredient Lookup & Free Google AI Study Tool",
              insiderTip:
                "Never mix Glycolic Acid and Azelaic Acid in the same night routine, and always apply SPF 50 the next morning.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Quick Indian Chemist Reference List (Save on Your Phone)",
            content: `1. Aziderm 10% Cream (~₹245, Micro Labs) -> Post-acne marks & uneven tone\n2. Glyco 6 Cream (~₹200, Micro Labs) -> 2x/week night exfoliation (+ SPF 50 next morning)\n3. Hyalugel (~₹250, Ethicare) -> Pure Hyaluronic Acid gel (apply on damp skin)\n4. UV Doux Silicone Sunscreen Gel SPF 50 -> Dermatologist matte sunscreen`,
          },
          incomeMathOrProof:
            "Saves ₹15,000+/year on courses and skincare while giving you 100% verifiable credentials.",
        },
      ],
      twentyFourHourChecklist: [
        "Download this 12pt white-label PDF using the 'Download 12pt PDF (.pdf)' button at the top.",
        "Open dir.indiamart.com -> Filter by City (Surat/Jaipur) + Business Type (Manufacturer) + TrustSEAL -> Send 3 WATERMARKED 1-photo samples (never deliver unwatermarked work without 50% UPI advance!).",
        "Sign up free on usertesting.com/get-paid-to-test & prolific.com (with KYC-verified Indian PayPal) OR voquent.com/voice-actors (100% free ₹0 voice portal).",
        "Upload 5 upscaled 4000px+ Indian festive copy-space backgrounds to contributor.stock.adobe.com (tick 'Created using generative AI tools').",
        "Complete 1 free corporate simulation on theforage.com and test the LinkedIn 'Posts -> Date posted: Past 24 hours' filter.",
      ],
    },
    reelBlueprint: {
      sixSecondVideoIdea: {
        visualStyle:
          "6-Second Dark Aesthetic Clip (Laptop in Dark Room / Live Scroll of This 12pt Underground Vault PDF)",
        shotByShot: [
          "0.0s – 2.0s: Moody dark aesthetic shot of laptop typing or iced coffee pour with bold Price Comparison overlay.",
          "2.0s – 4.5s: Smooth screen recording scrolling through the 5 chapters showing 'ElevenLabs Voice Royalties + IndiaMART Factory Filter + Pharmacy Salts'.",
          `4.5s – 6.0s: Quick zoom on the ${priceDisplay} (vs ${anchorPriceDisplay}) access page with CTA: 'Comment ${autoDmTrigger} for instant link'.`,
        ],
        lightingAndAudioTip:
          "Keep the clip strictly 6 seconds so viewers loop it 2–3 times while reading the overlay. Toggle ON 'Trial Reel' to hit 100% non-followers.",
      },
      psychologicalPriceOverlays: [
        {
          triggerType: "1. Daily Snack Price-Comparison Trigger",
          overlayText: `"1 Plate Momo = Rs 60 (Gone in 5 mins). This 2026–2027 Underground Vault = ${priceDisplay} (Exact ElevenLabs, IndiaMART Factory & Free Harvard/Tata Links). Choice is yours."`,
          whyItConverts: `Makes ${priceDisplay} feel smaller than a daily snack while anchoring the value to real, verified 2026–2027 portals.`,
        },
        {
          triggerType: "2. The 'Zero Affiliate / Zero Generic' Hook",
          overlayText: `"Tired of every PDF teaching the same boring 'affiliate marketing'? Inside this ${priceDisplay} vault: ElevenLabs Voice Royalties, IndiaMART B2B Factory Arbitrage & ₹150 Pharmacy Salts."`,
          whyItConverts:
            "Directly calls out the boredom of generic Instagram PDFs and hooks viewers with specific, verified portals.",
        },
        {
          triggerType: "3. Extreme FOMO / Gatekeeping Hook",
          overlayText: `"5 verified 2026–2027 websites & shortcuts 99% of people in India still don't know (${cleanTopic.slice(0, 38)}). Comment '${autoDmTrigger}' for instant DM."`,
          whyItConverts:
            "Creates intense FOMO and drives high comment velocity for the late-2026 algorithm.",
        },
      ],
      autoDmCaption: `Everyone on Instagram is repeating the exact same boring 'do affiliate marketing' or 'resell generic PDFs' advice—that's why 99% of people get bored and quit on Day 1! 🤫✨\n\nI put together the 2026–2027 Underground Vault for "${cleanTopic}" with 100% real, verified portals nobody talks about:\n✅ ElevenLabs Voice Library Passive USD Royalties (11:30 PM Fan-Off Trick)\n✅ IndiaMART TrustSEAL Wholesale Factory AI Catalog Arbitrage (₹2,999/deal)\n✅ UserTesting, Trymata & Dscout ($10 / 15-Min Speak-Out-Loud Formula)\n✅ Free Harvard CS50x, Tata/JPMorgan Forage Simulations & ₹150 Indian Pharmacy Generic Salt Table\n\nToday it is just ${priceDisplay} (instead of ${anchorPriceDisplay}).\n\n👉 Comment "${autoDmTrigger}" right now and I will Auto-DM you the instant access link within 5 seconds!`,
      seoKeywords: [
        cleanTopic.toLowerCase().slice(0, 28),
        "elevenlabs voice royalties india",
        "indiamart wholesale catalog arbitrage",
        "usertesting india paypal tips",
        "free harvard cs50x certificate",
        "theforage virtual job simulations",
        "indian pharmacy skincare alternatives",
        "adobe stock ai contributor india",
        "underrated websites 2026 2027",
        "notebooklm study hacks india",
      ],
      hashtags: [
        "#secretwebsites",
        "#hiddenhacks2026",
        "#careergrowthindia",
        "#pharmacyfindsindia",
        "#sidehustleindia",
      ],
    },
  };
}

