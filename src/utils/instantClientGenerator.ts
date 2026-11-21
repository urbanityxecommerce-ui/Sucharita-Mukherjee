import {
  ReelGenerationResult,
  EbookGenerationResult,
  EbookReelSectionKey,
  SearchTermItem,
  CURATED_REEL_IDEA_BANK,
  UNIQUE_STYLING_COMBINATION_MATRIX,
  getRealTimeDailyStylingContext,
  sanitizeMeeshoSearchTerm,
  buildMasterPrompts,
  enforceMastermindViralReelPack,
  buildAntiSlopEbookVideoPrompts,
  buildRotatingEbookReelSectionFallback,
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
    ? sanitizeClientReelTitle("", rawTopic, searchTerms)
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
  const rawInputTrimmed = topicInput ? topicInput.trim() : "";
  const isChatAgentOrWebsitesQuery =
    /\b(chat\s*agent|chat\s*support|bidding\s*type\s*nhi|non[- ]?bidding\s*chat|outlier|oneforma|dataannotation)\b/i.test(
      rawInputTrimmed
    );

  if (isChatAgentOrWebsitesQuery) {
    const chatTitle =
      "10 Verified Non-Bidding Chat Agent & AI Text Evaluation Websites for Indians (2026–2027 Direct-Approval Edition)";
    return {
      id: `ebook-${Date.now()}-${variationCount}`,
      createdAt: new Date().toISOString(),
      topicInput: chatTitle,
      category,
      priceDisplay: priceDisplay || "₹29",
      anchorPriceDisplay: anchorPriceDisplay || "₹2,499",
      autoDmTrigger: autoDmTrigger || "CHAT10",
      providerUsed: "2026 Private Playbook Engine",
      ebook: {
        editionTag:
          "2026 PRIVATE PLAYBOOK · 10 NON-BIDDING WEBSITES · ZERO UPWORK HASSLE",
        title: chatTitle,
        subtitle:
          "How to pass direct skill checks and get paid weekly in USD/INR on 10 real chat, AI rating & Q&A websites from India.",
        targetReaderPromise:
          "No Upwork bidding wars, no registration fees, and no fake typing scams. Every play gives you 2 real global websites (10 total) where you pass a quick check once and get paid per task or chat hour.",
        goldenRuleTitle:
          "real talk: never pay any 'registration fee' & don't copy-paste ChatGPT on signup tests",
        goldenRuleBody:
          "Every real website in this playbook is ₹0 free to join. When you take the starter test on Outlier, OneForma, CrowdGen, or ModSquad, don't paste answers from ChatGPT—their test page catches clipboard paste instantly. Just type short, clear answers in your own simple words and link a PAN-verified PayPal or Payoneer India account first.",
        hardestPartSolvedBox: {
          title:
            "Every Direct Link & Indian Signup Path (All 10 Websites in One Place)",
          exactWhereToFindMap: [
            "1. Outlier.ai (app.outlier.ai) & DataAnnotation.tech: Apply for 'Hindi / Indian English AI Writing & Chat Evaluator' (no coding needed). Pays $7.50–$18/hr USD weekly every Tuesday via PayPal India.",
            "2. OneForma (my.oneforma.com) & Appen CrowdGen (crowdgen.com): Open 'Jobs → AI Data / Text Rating' → Pass the free 15-min language check → Link Payoneer India.",
            "3. TELUS Digital AI (telusinternational.ai) & Welocalize (jobs.welocalize.com): Search 'India Remote' → Apply for 'Personalized Internet Ads / Search Quality Rater (Hindi/English)'.",
            "4. RWS TrainAI (rws.com/trainai), ModSquad (modsquad.com/join-the-squad), Concentrix Remote Chat (jobs.concentrix.com) & Chegg India (cheggindia.com/qa-expert): Direct text chat & written Q&A work.",
          ],
          zeroFollowerTrafficTrick:
            "Why this beats freelance apps: instead of begging clients on Upwork against 200 bidders, you pass one short open-book quiz and pick tasks straight from the dashboard.",
        },
        quickValueBreakdown: [
          {
            metric: "1. 10 Real Non-Bidding Sites",
            detail:
              "2 verified sites per play (= 10 total) with exact URLs and Indian payout apps.",
          },
          {
            metric: "2. Zero Client Begging",
            detail:
              "Pass a 1-time skill check and claim tasks directly whenever you're free.",
          },
          {
            metric: "3. Copy-Paste Pass Formula",
            detail:
              "Simple 3-line answer format that passes Outlier, OneForma, and TELUS checks.",
          },
          {
            metric: "4. Real Weekly Payouts",
            detail:
              "Clear USD/INR payout math ($8–$15/hr on AI rating; ₹18,000–₹35,000/mo on remote chat).",
          },
        ],
        chapters: [
          {
            chapterNumber: 1,
            title:
              "Sites #1 & #2: Outlier.ai & DataAnnotation.tech (Get Paid to Grade AI Chats)",
            subtitle:
              "real talk: how Indians earn $7.50–$18/hr USD checking chatbot replies with zero bidding.",
            coreSecretSummary:
              "Most people spend months on Upwork fighting 150 bidders for a $5 typing gig and never hear back. Meanwhile, AI companies literally pay regular people in India $7.50–$18/hour to read two chatbot replies side-by-side and explain which one is better—paid every Tuesday to PayPal.",
            whereToFindOrHiddenTrick:
              "Open outlier.ai → Click 'View Opportunities' → Filter Location: 'India' → Pick 'Hindi Language Writing / Generalist AI Trainer' or 'Indian English Evaluator'. Also open dataannotation.tech/starter-assessment with a fresh Gmail.",
            stepByStepExecution: [
              "1. Setup: Verify your Indian PayPal account with your PAN card and Indian bank first so Tuesday payouts don't get stuck. Keep a clean 1-page resume highlighting writing, tutoring, or Hindi-English fluency.",
              "2. The Move: Take the 30-min starter test on Outlier.ai and DataAnnotation.tech in a quiet room. Never use Ctrl+C / Ctrl+V—their test page detects pasted text and rejects careless signups automatically.",
              "3. Scale It: Grade every side-by-side reply on 3 simple checks (is it true, did it follow rules, does it sound natural), and unlock extra free skill badges inside Outlier's 'Enablement Center' tab for more daily tasks.",
              "4. Stay Safe: Don't rush a 15-minute task in 2 minutes, and quick-check facts on Google before hitting Submit so your account stays in good standing.",
            ],
            exactToolsOrWebsites: [
              {
                name: "outlier.ai (app.outlier.ai)",
                role: "Site #1 · Non-Bidding AI Chat Trainer & Hindi/English Rater ($7.50–$18/hr USD)",
                insiderTip:
                  "Complete the free optional skill checks inside 'Enablement Center' to unlock more daily projects.",
              },
              {
                name: "dataannotation.tech",
                role: "Site #2 · Self-Serve AI Chatbot Comparison Dashboard (Weekly PayPal)",
                insiderTip:
                  "Take your time on the starter test—being accurate matters 10x more than finishing fast.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "Copy-Paste 3-Line Rating Answer That Passes Quality Checks",
              content: `"Response A is better than Response B because it followed every instruction, including the rule to avoid bullet points. While both answers are mostly right, Response B added extra made-up details at the end. Response A is clearer, accurate, and directly answers the prompt."`,
            },
            incomeMathOrProof:
              "10 hours/week on Outlier.ai at $11/hr = $110/week × 4 weeks = $440/month (× ₹85 = ₹37,400/month) paid weekly to PayPal.",
          },
          {
            chapterNumber: 2,
            title:
              "Sites #3 & #4: OneForma & Appen CrowdGen (The Free Quiz Fast-Track)",
            subtitle:
              "real talk: bilingual Hindi/English tasks that pay in USD via Payoneer.",
            coreSecretSummary:
              "Most beginners apply with a blank profile and stay stuck on 'Pending' forever. On OneForma (my.oneforma.com) and Appen's CrowdGen (crowdgen.com), passing two free 15-minute language quizzes BEFORE applying pushes your profile straight to the front of the approval list.",
            whereToFindOrHiddenTrick:
              "Go to my.oneforma.com → Sign up free → Click 'Certifications' on the left FIRST → Pass 'English Reading Comprehension' & 'Hindi Native' (free, 15 mins) → Then open 'Jobs → AI & LLM Evaluation' and apply. Do the same on crowdgen.com.",
            stepByStepExecution: [
              "1. Setup: Make a free Payoneer India account (payoneer.com) and link it inside OneForma's 'Payment Information' tab and CrowdGen settings before starting.",
              "2. The Move: Pass the free English and Hindi certifications inside OneForma first, then apply to open LLM chat rating projects on both OneForma and CrowdGen.",
              "3. Scale It: Download the short project PDF and keep it open in another tab with Ctrl+F during the open-book quiz so you pass on attempt #1.",
              "4. Stay Safe: Spend the full recommended time shown on each task timer—clicking submit too fast gets accounts flagged.",
            ],
            exactToolsOrWebsites: [
              {
                name: "my.oneforma.com (OneForma by Centific)",
                role: "Site #3 · Bilingual Hindi/English Chat & Prompt Rating",
                insiderTip:
                  "Keep the guideline PDF open with Ctrl+F during the open-book quiz.",
              },
              {
                name: "crowdgen.com (Appen Platform)",
                role: "Site #4 · Global Micro-Task & Chat Response Grading",
                insiderTip:
                  "Verify your phone number and Indian tax details inside settings so monthly payouts clear smoothly.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "Quick 3-Check Quality List Before Clicking Submit",
              content: `1. Did the chatbot reply in the exact language asked (pure Hindi vs Hinglish)?\n2. Did I double-check any prices, dates, or Indian local facts on Google?\n3. Did I spend the normal target time on this task instead of rushing?`,
            },
            incomeMathOrProof:
              "8 hours/week across OneForma + CrowdGen at $7.50/hr = $60/week × 4 weeks = $240/month (× ₹85 = ₹20,400/month) via Payoneer.",
          },
          {
            chapterNumber: 3,
            title:
              "Sites #5 & #6: TELUS Digital AI & Welocalize (Open-Book Search Rating)",
            subtitle:
              "real talk: steady part-time search & chat rating paid straight to your Indian bank.",
            coreSecretSummary:
              "Most people fail the TELUS Digital and Welocalize test because they guess from memory. The entire test is 100% open-book based on their free PDF ('Needs Met' and 'Page Quality')—once you pass using Ctrl+F, you unlock steady flexible weekly hours.",
            whereToFindOrHiddenTrick:
              "Open telusinternational.ai/cmp/contributor → Filter Country: 'India' → Pick 'Personalized Internet Assessor (India)'. Also open jobs.welocalize.com → Filter 'Remote - India' → Apply for 'Search Quality Rater'.",
            stepByStepExecution: [
              "1. Setup: Apply on telusinternational.ai and jobs.welocalize.com using the main Gmail signed into your Chrome browser and phone.",
              "2. The Move: When they email the Guidelines PDF, use Ctrl+F on the 'Needs Met' and 'Page Quality' tables—almost every exam question matches those exact examples.",
              "3. Scale It: Log into RaterHub during evening IST hours and weekends when extra bonus batches drop, working 10–15 flexible hours a week.",
              "4. Stay Safe: Finish your Hyperwallet / Direct Indian Bank KYC right after onboarding so payouts clear without holds.",
            ],
            exactToolsOrWebsites: [
              {
                name: "telusinternational.ai",
                role: "Site #5 · Search & Chat Quality Rater (Direct Bank / Hyperwallet)",
                insiderTip:
                  "Turn on email alerts for 'Bonus Hours'—extra tasks often drop on weekends.",
              },
              {
                name: "jobs.welocalize.com",
                role: "Site #6 · Non-Bidding Ads & Search Quality Rater (Weekly Payouts)",
                insiderTip:
                  "Complete the free WeLearn practice modules before taking the final test.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "Quick 'Needs Met' Cheat Sheet for the Open-Book Exam",
              content: `• Fully Meets (FM): The person searched for one exact thing (like "SBI netbanking login") and the top result is the exact official page.\n• Highly Meets (HM): The person asked an open question (like "best budget earbuds India") and the page gives a clear, helpful comparison.\n• Fails to Meet (FailsM): The result is broken, outdated, or totally off-topic.`,
            },
            incomeMathOrProof:
              "15 hours/week at $6.50/hr = $97.50/week × 4 weeks = $390/month (× ₹85 = ₹33,150/month) wired to your Indian bank.",
          },
          {
            chapterNumber: 4,
            title:
              "Sites #7 & #8: RWS TrainAI & ModSquad (Quiet Text Chat & Ticket Shifts)",
            subtitle:
              "real talk: zero phone calls—just text chat support, Discord mod shifts, and AI text checks.",
            coreSecretSummary:
              "People hear 'customer support' and picture a noisy call center taking angry phone calls all night. RWS TrainAI (rws.com/trainai) and ModSquad (modsquad.com) let you pick quiet 2-hour text-chat and moderation shifts from your laptop for global brands.",
            whereToFindOrHiddenTrick:
              "Go to rws.com/artificial-intelligence/trainai-community → Click 'Join TrainAI Community' → Pick 'Work as an Individual' (NOT Agency). Also apply at modsquad.com/join-the-squad for remote chat & moderation.",
            stepByStepExecution: [
              "1. Setup: Register on RWS TrainAI as an 'Individual Contributor' so tasks come directly to you, and warm up your typing speed to 45+ WPM on monkeytype.com before applying on ModSquad.",
              "2. The Move: On your ModSquad form, mention comfort with written ticket apps (Zendesk, Freshdesk, Discord, or Shopify order lookup).",
              "3. Scale It: Pick 2-hour evening or morning chat shifts and keep short friendly reply templates ready so you can answer smoothly without stress.",
              "4. Stay Safe: Always tweak the first line of any saved reply to mention the customer's actual issue so it sounds genuinely human.",
            ],
            exactToolsOrWebsites: [
              {
                name: "rws.com/trainai (RWS WorkZone)",
                role: "Site #7 · Global AI Text & Language Tasks (PayPal / Bank)",
                insiderTip:
                  "Pick 'Individual Contributor' during signup—not Agency.",
              },
              {
                name: "modsquad.com/join-the-squad",
                role: "Site #8 · Remote Live Chat & Community Moderation (Hourly USD)",
                insiderTip:
                  "Mentioning Discord or Shopify support experience helps your form stand out.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "Copy-Paste Calm Customer Chat Reply",
              content: `"Hey [Name], totally get how annoying it is waiting on an order update—I'd feel the same way. I just checked order #[ID] on our end and flagged it for a priority status update. Here's what happens next over the next 24 hours..."`,
            },
            incomeMathOrProof:
              "12 hours/week across RWS TrainAI & ModSquad at $6.25/hr = $75/week × 4 weeks = $300/month (× ₹85 = ₹25,500/month).",
          },
          {
            chapterNumber: 5,
            title:
              "Sites #9 & #10: Concentrix India Non-Voice Chat & Chegg Early-Morning Q&A",
            subtitle:
              "real talk: direct INR bank payouts for non-voice chat and written subject answers.",
            coreSecretSummary:
              "Students get burned by fake Telegram 'typing jobs' asking for registration money. Real INR payouts come straight from Concentrix India's official 'Work At Home Non-Voice Chat' portal (jobs.concentrix.com) and Chegg India (cheggindia.com/qa-expert) during the 6:30 AM – 10:30 AM IST peak window.",
            whereToFindOrHiddenTrick:
              "Open jobs.concentrix.com → Search 'Chat' or 'Non Voice Work From Home India' → Apply free on their official portal. Also sign up at cheggindia.com/qa-expert and log in early morning IST when US homework queues pile up.",
            stepByStepExecution: [
              "1. Setup: Apply directly at jobs.concentrix.com (₹0 fee) and practice clean written English for the 15-min online Versant chat test. For Chegg India, keep your PAN card and bank IFSC ready.",
              "2. The Move: On Chegg / CourseHero, pick a high-demand subject you actually know (Accounting, Stats, CS, Business, or Science) paying ₹100–₹190 per written answer.",
              "3. Scale It: Log in between 6:30 AM and 10:30 AM IST—US students post questions overnight, so morning IST has way more open questions and way less rush.",
              "4. Stay Safe: Write every solution in 3 clean parts (Rule → Steps → Final Answer) to keep your rating above 4.6★.",
            ],
            exactToolsOrWebsites: [
              {
                name: "jobs.concentrix.com (Official India Portal)",
                role: "Site #9 · Remote Non-Voice Chat Support (₹18,000–₹28,000/mo INR Bank)",
                insiderTip:
                  "Focus on clear spelling and polite, direct replies during the online written chat check.",
              },
              {
                name: "cheggindia.com/qa-expert & coursehero.com/become-a-tutor",
                role: "Site #10 · Written Subject Q&A (₹100–₹190/Question via NEFT)",
                insiderTip:
                  "6:30 AM – 10:00 AM IST is the easiest window to grab open questions.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "3-Part Written Answer Format for High Ratings",
              content: `1. Main Idea: Explain the exact rule or formula in 2 simple lines.\n2. Step-by-Step Math/Logic: Show every step clearly on its own line.\n3. Final Answer: Bold the exact final result at the bottom so it's effortless to read.`,
            },
            incomeMathOrProof:
              "5 written answers/morning × ₹150 = ₹750/day × 30 days = ₹22,500/month via direct Indian bank NEFT (or ₹20,000–₹28,000/mo on Concentrix Chat).",
          },
        ],
        twentyFourHourChecklist: [
          "Download this clean PDF using the 'Download 12pt PDF (.pdf)' button at the top.",
          "Finish PAN + Bank KYC on PayPal India and Payoneer India so USD payouts don't get stuck.",
          "Apply today on Site #1 (outlier.ai), Site #3 (my.oneforma.com), and Site #4 (crowdgen.com) — never paste AI text on tests.",
          "Pass the free 15-min English & Hindi checks inside OneForma's 'Certifications' tab.",
          "Apply on TELUS Digital (telusinternational.ai) & Chegg India (cheggindia.com/qa-expert) to build multiple income backups.",
        ],
      },
      reelBlueprint: buildRotatingEbookReelSectionFallback({
        ebookTitle: chatTitle,
        chapterTitles: [
          "Outlier.ai & DataAnnotation.tech (Get Paid to Grade AI Chats)",
          "OneForma & Appen CrowdGen (The Free Quiz Fast-Track)",
          "TELUS Digital AI & Welocalize (Open-Book Search Rating)",
          "RWS TrainAI & ModSquad (Quiet Text Chat & Ticket Shifts)",
          "Concentrix Non-Voice Chat & Chegg Early-Morning Q&A",
        ],
        priceDisplay: priceDisplay || "₹29",
        anchorPriceDisplay: anchorPriceDisplay || "₹2,499",
        autoDmTrigger: autoDmTrigger || "CHAT10",
        section: "all",
        variationIndex: variationCount,
      }) as EbookGenerationResult["reelBlueprint"],
    };
  }

  const defaultVaultTitles = [
    "How to Close ₹2,999 Local Business Deals on WhatsApp Without Begging or Cold Calling",
    "The 6-Second Faceless Reel + ₹29 Mini-Guide System (Zero Followers Needed)",
    "How to Spot High-Review Local Clinics With No Website on Google Maps & Charge ₹2,999",
    "Free Harvard, Tata & Google Certificates + The LinkedIn 'Past 24 Hours' Hiring Filter",
    "₹200 Indian Pharmacy Skincare Salts vs ₹2,500 Viral Serums (The Real 1mg Ingredient List)",
    "Free AI Study & Research Tools That Cut 6 Hours of College Work Into 15 Minutes",
  ];
  const isCleanPreset = BROWSER_EBOOK_TOPICS.some(
    (t) => t.toLowerCase() === rawInputTrimmed.toLowerCase()
  );
  const hasCustomTopic = rawInputTrimmed.length > 0 && !isCleanPreset;
  const cleanTopic = hasCustomTopic
    ? `The 2026 No-Gatekeeping Playbook: ${rawInputTrimmed.slice(0, 68)}`
    : isCleanPreset
    ? rawInputTrimmed
    : defaultVaultTitles[Math.abs(variationCount) % defaultVaultTitles.length];

  const editionSubtitles = [
    "2026 Private Playbook · Real free websites, exact search filters, and copy-paste messages you can actually use today.",
    "Zero gatekeeping · Simple step-by-step moves, free Indian-friendly tools, and honest numbers that actually add up.",
    "Straight to the point · Real buttons to click, exact scripts to send, and zero boring textbook lectures.",
  ];

  return {
    id: `ebook-${Date.now()}-${variationCount}`,
    createdAt: new Date().toISOString(),
    topicInput: cleanTopic,
    category,
    priceDisplay: priceDisplay || "₹19",
    anchorPriceDisplay: anchorPriceDisplay || "₹1,999",
    autoDmTrigger: autoDmTrigger || "GUIDE",
    providerUsed: "2026 Private Playbook Engine",
    ebook: {
      editionTag: `2026 PRIVATE PLAYBOOK · REAL LINKS & COPY-PASTE SCRIPTS · ZERO FLUFF`,
      title: cleanTopic,
      subtitle: editionSubtitles[variationCount % editionSubtitles.length],
      targetReaderPromise:
        "No boring textbook theory and no fake hype. Every play inside gives you real free websites, exact buttons to click, honest numbers, and ready-to-send scripts.",
      goldenRuleTitle:
        "real talk: always watermark your preview & take 50% UPI advance before doing full work",
      goldenRuleBody:
        "Never waste hours doing free unpaid work for strangers hoping they'll pay later. Send 1 clean preview with a bold watermark first, collect 50% advance on UPI before finishing the rest, and test one play properly before jumping to the next.",
      hardestPartSolvedBox: {
        title:
          "The 4 Exact Links & Search Filters Most People Never Notice",
        exactWhereToFindMap: [
          `1. Google Maps 'High Reviews, No Website' Filter: Search 'Dental Clinic', 'Skin Clinic', or 'Salon' in your city on Google Maps → Pick places with 40+ reviews and NO 'Website' button → Pitch a ₹2,999 1-page WhatsApp booking menu.`,
          `2. Meta Ad Library Active Spenders (facebook.com/ads/library): Pick 'India' → 'All Ads' → Type your niche → Look for active ads running 14+ days to spot brands already spending money online.`,
          `3. Paid $10 / 15-Min Website Testing (usertesting.com/get-paid-to-test & prolific.com): Free signup with a PAN-verified Indian PayPal account. Pays $10 USD 14 days after each approved speak-out-loud test.`,
          `4. LinkedIn 'Past 24 Hours' Post Filter + Free Harvard/Tata Certs: Finish a free 4-hr Tata/JPMorgan project on theforage.com, then search '\"hiring\" AND \"remote\"' on LinkedIn → Click 'Posts' tab → 'Date posted: Past 24 hours'.`,
        ],
        zeroFollowerTrafficTrick:
          "How to get reach from 0 followers: post a chill 6-second everyday clip with a short relatable on-screen text and turn ON Instagram's 'Trial Reel' toggle so it tests on non-followers first.",
      },
      quickValueBreakdown: [
        {
          metric: "1. Zero Boring Theory",
          detail:
            "Skips generic gyaan and goes straight to real free tools and exact steps.",
        },
        {
          metric: "2. 50% UPI Safety Rule",
          detail: `Send 1 watermarked preview first; never send final files without 50% UPI advance.`,
        },
        {
          metric: "3. 100% Free (₹0) Tools",
          detail:
            "Every website inside (Google Maps, Meta Ad Library, Forage, Harvard CS50x, NotebookLM) is ₹0 to start.",
        },
        {
          metric: "4. Copy-Paste Messages",
          detail:
            "Includes ready-to-send WhatsApp pitches, LinkedIn DMs, and the 1mg salt lookup list.",
        },
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "Close ₹2,999 Local Clinic & Salon Deals on WhatsApp With 1 Watermarked Preview",
          subtitle:
            "real talk: how to get local businesses to reply fast and pay 50% UPI advance (₹0 cost).",
          coreSecretSummary:
            "Most beginners send boring messages like 'Hi Sir, I make websites/designs, please hire me' and get left on seen. Business owners ignore pitches, but they stop instantly when they see a finished preview made specifically for THEIR shop with a watermark across it.",
          whereToFindOrHiddenTrick:
            "Open Google Maps and search 'Skin Clinic', 'Dental Clinic', or 'Boutique' in any busy area, OR check facebook.com/ads/library (India → Active Ads). Pick places that already have 40+ Google reviews (meaning they have paying customers) but no website button or weak photos.",
          stepByStepExecution: [
            "1. Setup: Pick 5 high-review local shops on Google Maps that have no website link. Save 1 public photo or price list from their Maps listing.",
            "2. The Move: Use free Canva or Carrd to turn that into a clean 1-page WhatsApp booking card, and slap a bold diagonal watermark across the middle: 'SAMPLE PREVIEW FOR [SHOP NAME]'.",
            "3. Scale It: WhatsApp that watermarked screenshot to their business number with the short 3-line message below, offering the single preview for ₹250 or the full booking setup for ₹2,999.",
            "4. Stay Safe: Always collect 50% UPI advance (₹1,500) before making the full version, and remove the watermark only after the remaining ₹1,499 hits your UPI.",
          ],
          exactToolsOrWebsites: [
            {
              name: "google.com/maps & facebook.com/ads/library (Free ₹0)",
              role: "Spot Busy Local Clinics, Salons & Active Indian Brands",
              insiderTip:
                "Look for 40+ Google reviews with no website button—they already have customers, just messy online links.",
            },
            {
              name: "canva.com & carrd.co (Free Tier)",
              role: "Build Clean 1-Page Previews & WhatsApp Booking Pages",
              insiderTip:
                "Put the watermark right across the middle so nobody can just crop and steal your sample.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste WhatsApp Message That Actually Gets Replies",
            content: `"Hey [Business Name] team! Saw you have 45+ great reviews on Google Maps, but there's no quick 1-tap WhatsApp booking/menu link on your profile yet.\n\nI quickly mocked up a sample preview just for [Business Name] (attached with watermark). I can unlock this single page for ₹250 today, or set up your full WhatsApp booking kit for ₹2,999 (50% advance, 50% when done). Want me to send the clean version?"`,
          },
          incomeMathOrProof:
            "2 local shop setups/week × ₹2,999 = ₹5,998/week × 4 weeks = ₹23,992/month with ₹0 ad spend.",
        },
        {
          chapterNumber: 2,
          title: `Turn 6-Second Faceless Reels Into Daily ${priceDisplay || "₹29"} Mini-Guide UPI Sales`,
          subtitle:
            "real talk: how tiny 0-follower pages sell simple mini-guides using Trial Reels & Auto-DM.",
          coreSecretSummary: `Most people think you need 50K followers, ring lights, and loud dancing reels to earn online. In reality, a calm 6-second everyday clip with a short 2-line relatable text replays twice while people read it—pushing the Reel to thousands of non-followers and triggering instant comment-to-DM requests.`,
          whereToFindOrHiddenTrick: `When your Reel is only 6 seconds long and the on-screen text takes 8–10 seconds to read, viewers naturally let it loop once or twice. Turn ON Instagram's built-in 'Trial Reel' toggle before posting so Instagram shows it to non-followers first, and let free Auto-DM send your ${priceDisplay || "₹29"} link automatically.`,
          stepByStepExecution: [
            "1. Setup: Download this clean PDF and upload it to SuperProfile.bio, Cosmofeed, or Gumroad so buyers can pay via GPay/PhonePe in 10 seconds.",
            "2. The Move: Film a casual 6-second real-life clip (chai boiling, rainy balcony, notebook flip, late-night scroll), put one short non-salesy line on screen, and toggle ON 'Trial Reel'.",
            "3. Scale It: Connect free Auto-DM (SuperProfile Auto-DM or ManyChat) on one easy comment word ('GUIDE' or 'SEND') so every commenter gets your checkout link in 5 seconds.",
            "4. Stay Safe: Add a ₹99 'Bonus Bundle' tick-box on checkout—roughly 1 in 3 buyers adds it automatically, bumping up your daily total with zero extra work.",
          ],
          exactToolsOrWebsites: [
            {
              name: "superprofile.bio / cosmofeed.com (Free Setup)",
              role: "Instant Indian UPI Checkout + Auto-DM Delivery",
              insiderTip:
                "Turn on 1-tap UPI checkout so mobile buyers finish paying in under 10 seconds.",
            },
            {
              name: "Instagram 'Trial Reel' Toggle (Built-In)",
              role: "Tests Your 6-Second Reel on Non-Followers First",
              insiderTip:
                "Keep clips around 6 seconds and stick to 4–5 normal niche hashtags—skip spammy tags.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste 6-Second Reel Text (Zero Salesy Vibe)",
            content: `"spent 3 days putting all the real free links & scripts into one tiny doc so my friends don't waste months googling\n\nkept it at ${priceDisplay || "₹29"} (literally less than cold coffee) — drop '${autoDmTrigger || "GUIDE"}' and i'll send it over"`,
          },
          incomeMathOrProof:
            "(15 guides/day × ₹29 = ₹435) + (4 bundle add-ons/day × ₹99 = ₹396) = ₹831/day × 30 days = ₹24,930/month.",
        },
        {
          chapterNumber: 3,
          title: "Get Paid $10 for 15-Min Website Feedback (UserTesting, Trymata & Prolific)",
          subtitle:
            "real talk: exact Indian PayPal setup, passing the practice test, and realistic weekly USD math.",
          coreSecretSummary:
            "Most people waste hours on 10-cent survey apps that kick them out at the end. UserTesting.com and Trymata.com pay a flat $10 USD for a 15-minute screen recording where you test a website and talk out loud—and Prolific.com pays £6–£10/hr GBP for short university studies with zero sudden disqualifications.",
          whereToFindOrHiddenTrick:
            "Sign up free at usertesting.com/get-paid-to-test, trymata.com/get-paid-to-test, and app.prolific.com/register/participant. The whole trick to passing the 7-min practice test on try #1 is simple: never go silent—say what you expect a button to do right before you click it.",
          stepByStepExecution: [
            "1. Setup: Verify your Indian PayPal account with your PAN card and Indian bank account first—both UserTesting ($10 USD) and Prolific (£ GBP) pay out through KYC-verified PayPal.",
            "2. The Move: Record the 7-min unpaid practice test in a quiet room (switch off the ceiling fan!) and talk naturally using the 3-line formula below.",
            "3. Scale It: Keep UserTesting and Prolific (with the free 'Prolific Assistant' Chrome extension) open between 7:30 PM and 11:30 PM IST when US/UK tests go live.",
            "4. Stay Safe: Never lie on profile screeners—honest answers keep your rating at 4.5★+ so you keep getting $10 invites (paid 14 days after each test).",
          ],
          exactToolsOrWebsites: [
            {
              name: "usertesting.com/get-paid-to-test",
              role: "$10 USD per 15–20 Min Website Test (Paid 14 Days Later via PayPal)",
              insiderTip:
                "Teams actually want to hear where you got confused—don't pretend everything looks perfect.",
            },
            {
              name: "prolific.com",
              role: "University & AI Studies (£6–£10/hr via PayPal)",
              insiderTip:
                "Has a short waitlist and ID check, but every study on your dashboard is already matched to you.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste 3-Line Speak-Out-Loud Formula (Passes Test #1)",
            content: `"1. Right now I'm looking at [Section] to find [Task Goal].\n2. First impression: [Part] is super clear, though I'm slightly confused why [Detail] isn't shown upfront.\n3. Before I click this button, I'm expecting it to take me to [Expected Page]."`,
          },
          incomeMathOrProof:
            "(2 UserTesting clips/week × $10 = $20) + (2 hrs Prolific/week × $7.50 = $15) = $35/week × 4 weeks = $140/month (× ₹85 = ₹11,900/month) via PayPal.",
        },
        {
          chapterNumber: 4,
          title: "Upload Clean Indian Festive Backgrounds to Adobe Stock for Passive USD Royalties",
          subtitle:
            "real talk: why 60% empty space backgrounds get approved while random AI portraits get rejected.",
          coreSecretSummary:
            "Beginners upload random AI faces with weird hands to stock sites and get rejected every single time. Designers and ad agencies on Adobe Stock (contributor.stock.adobe.com) actually buy clean Indian wedding, festive, and minimal backgrounds that leave 60% blank space so they can put their own text on top.",
          whereToFindOrHiddenTrick:
            "Join contributor.stock.adobe.com (free ₹0). Three simple rules for high approval: (1) leave 60% clean empty space in the middle or side, (2) upscale every image to 4000×2666 px using free upscayl.org, and (3) always tick the 'Created using generative AI tools' checkbox.",
          stepByStepExecution: [
            "1. Setup: Create a free account on contributor.stock.adobe.com and fill out the 2-minute online W-8BEN tax form (lowers US tax cut for Indian residents).",
            "2. The Move: Generate clean, text-free Indian festive, marigold, or minimal warm backgrounds with 60% blank space using the prompt below.",
            "3. Scale It: Upscale every image to 4000×2666 px on upscayl.org or iloveimg.com/upscale-image so it clears Adobe's 4MP size check.",
            "4. Stay Safe: Always tick 'Created using generative AI tools', skip brand names (like Apple, Nike, or Taj Mahal) in titles, and add 20–25 normal search keywords.",
          ],
          exactToolsOrWebsites: [
            {
              name: "contributor.stock.adobe.com",
              role: "Free Global Stock Site (Pays 33% Royalty in USD)",
              insiderTip:
                "Cash out starts at $25 USD via Payoneer or PayPal.",
            },
            {
              name: "upscayl.org / iloveimg.com/upscale-image",
              role: "Free Image Upscaler (Gets You Past 4MP Check)",
              insiderTip:
                "Zoom in on the corners before uploading to make sure there are no messy artifacts.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Copy-Paste 60% Empty-Space Background Prompt",
            content: `"Minimal warm cream Indian festive arch background with soft marigold petals along the bottom edge and gentle warm daylight, 65% clean empty space in the center for text, crisp natural photo look, no text, no letters, no watermark."`,
          },
          incomeMathOrProof:
            "150+ approved festive backgrounds earn $0.33–$2.64 per download on autopilot—passive USD royalties with 0 followers.",
        },
        {
          chapterNumber: 5,
          title: "Free Harvard & Tata Certs + LinkedIn 'Past 24 Hours' Filter + ₹200 Pharmacy Salts",
          subtitle:
            "real talk: stop paying ₹25,000 for weak courses or ₹2,500 for hyped serums.",
          coreSecretSummary:
            "People pay ₹25,000 for random coaching certificates, apply to 30-day-old job posts with 2,000 applicants, and spend ₹2,500 on Instagram serums. You can get real Tata/Deloitte/Harvard certificates for ₹0, DM founders within 24 hours of their LinkedIn hiring post, and find the exact same skincare ingredients at an Indian chemist for ₹200.",
          whereToFindOrHiddenTrick:
            "(1) LinkedIn Trick: Search '\"hiring\" AND \"remote\"' → Click 'Posts' tab (NOT Jobs!) → Click 'Date posted' → Pick 'Past 24 hours'. (2) 1mg Trick: Open 1mg.com → Type any pricey serum → Click the 'SALT COMPOSITION' link right under the name to see ₹200 pharma tubes.",
          stepByStepExecution: [
            "1. Setup: Finish 1 free 4-hr project on theforage.com (Tata, JPMorgan, or Deloitte) and sign up at cs50.harvard.edu/x directly (skip paid edX) for a free verified Harvard certificate.",
            "2. The Move: Check LinkedIn's 'Posts → Past 24 hours' filter every morning to spot founders who dropped their direct email in a fresh hiring post.",
            "3. Scale It: Look up regulated Indian pharmacy basics on 1mg.com (always patch test first): Aziderm 10% Cream (~₹245) for marks, Glyco 6 Cream (~₹200, 2x/week at night + SPF 50 morning) for glow, Hyalugel (~₹250) for light hydration.",
            "4. Stay Safe: Drop long PDFs into free notebooklm.google.com → Click 'Audio Overview' to turn boring study notes into a quick 10-min podcast.",
          ],
          exactToolsOrWebsites: [
            {
              name: "theforage.com & cs50.harvard.edu/x",
              role: "Free Verified Corporate & Harvard Certificates",
              insiderTip:
                "Attach a 1-page sample when messaging founders found via LinkedIn's 24-hour filter.",
            },
            {
              name: "1mg.com & notebooklm.google.com",
              role: "Chemist Salt Lookup & Free Google AI Study Buddy",
              insiderTip:
                "Never layer Glycolic Acid and Azelaic Acid on the same night, and always wear SPF 50 next morning.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "Indian Pharmacy Skincare Salt Cheat Sheet",
            content: `1. Aziderm 10% Cream (~₹245, Micro Labs) → Post-acne marks & uneven tone\n2. Glyco 6 Cream (~₹200, Micro Labs) → 2x/week night exfoliation (+ SPF 50 morning)\n3. Hyalugel (~₹250, Ethicare) → Pure Hyaluronic Acid gel (apply on damp skin)\n4. UV Doux Silicone Sunscreen Gel SPF 50 → Matte dermatologist sunscreen`,
          },
          incomeMathOrProof:
            "Saves ₹15,000+/year on overhyped courses & skincare while giving you real verifiable Harvard & Tata credentials.",
        },
      ],
      twentyFourHourChecklist: [
        "Download this clean PDF using the 'Download 12pt PDF (.pdf)' button at the top.",
        "Open Google Maps → Pick 5 high-review local shops with no website → Send 1 WATERMARKED preview (always take 50% UPI advance before finishing!).",
        "Sign up free on usertesting.com/get-paid-to-test & prolific.com (with PAN-verified PayPal).",
        "Upload 5 upscaled 4000px+ Indian festive backgrounds to contributor.stock.adobe.com (tick the AI checkbox).",
        "Finish 1 free project on theforage.com and test LinkedIn's 'Posts → Past 24 hours' filter.",
      ],
    },
    reelBlueprint: buildRotatingEbookReelSectionFallback({
      ebookTitle: cleanTopic,
      chapterTitles: [
        `Close ₹2,999 Local Clinic & Salon Deals on WhatsApp`,
        `Turn 6-Second Faceless Reels Into Daily Mini-Guide UPI Sales`,
        `Get Paid $10 for 15-Min Website Feedback (UserTesting & Prolific)`,
        `Upload Clean Indian Festive Backgrounds to Adobe Stock`,
        `Free Harvard & Tata Certs + LinkedIn 24-Hr Filter + ₹200 Pharmacy Salts`,
      ],
      priceDisplay,
      anchorPriceDisplay,
      autoDmTrigger,
      section: "all",
      variationIndex: variationCount,
    }) as EbookGenerationResult["reelBlueprint"],
  };
}

function getBrowserGroqKey(): string {
  const metaEnv = (import.meta as any)?.env || {};
  return metaEnv.VITE_GROQ_API_KEY || "";
}

function getBrowserOpenRouterKey(): string {
  const metaEnv = (import.meta as any)?.env || {};
  return metaEnv.VITE_OPENROUTER_API_KEY || "";
}

async function callBrowserMultiModelAI(
  systemPrompt: string,
  userPrompt: string,
  variationSeed = 0
): Promise<{ parsed: any; providerName: string } | null> {
  const groqKey = getBrowserGroqKey();
  const modelRotation = [
    ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "openai/gpt-oss-120b", "llama-3.1-8b-instant"],
    ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"],
  ];
  const models =
    modelRotation[Math.abs(Number(variationSeed)) % modelRotation.length];

  if (groqKey) {
    for (const model of models) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 14000);
      const isGptOss = model.includes("gpt-oss");
      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
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
          }
        );
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          const raw = data?.choices?.[0]?.message?.content || "{}";
          const cleaned = raw
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
          let parsed: any = null;
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace > firstBrace) {
              parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
            }
          }
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            return {
              parsed,
              providerName:
                model === "qwen/qwen3.8-27b"
                  ? "Qwen 3.8 27B Live AI"
                  : model === "openai/gpt-oss-20b"
                  ? "GPT-OSS 20B Turbo Live AI"
                  : "GPT-OSS 120B Live AI",
            };
          }
        }
      } catch {
        clearTimeout(timer);
      }
    }
  }

  const orKey = getBrowserOpenRouterKey();
  if (orKey) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 11000);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${orKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct",
          temperature: 0.92,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content || "{}";
        const cleaned = raw
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          return {
            parsed,
            providerName: "OpenRouter Live Mastermind AI",
          };
        }
      }
    } catch {
      clearTimeout(timer);
    }
  }

  return null;
}

const BROWSER_REEL_ANGLES = [
  "Royal Kashmiri Aari Embroidered V-Neck Short Kurti + Dark Indigo Flared Bootcut Jeans + Oxidized Kamarbandh + Braided Kolhapuri Wedges",
  "Old-Money Korean Layered Combo: Crisp White Oversized Poplin Shirt + Espresso Brown Ribbed Knit Vest + Cream Pleated Wide-Leg Trousers + Retro Clear Glasses",
  "Chubby & Mid-Size Tummy-Hide Hourglass: Midnight Navy Angrakha Diagonal-Wrap Peplum Kurti + Ivory Straight Cigarette Pants + Gold Link Watch + Tan Baguette Bag",
  "Underrated High-Contrast Color Theory: Olive Sage Ruched Square-Neck Top + Chocolate Brown High-Waist Wide-Leg Cargo Pants + Dainty Gold Layered Chain + Cream Dumpling Bag",
  "Dark Feminine Desi Baddie: Plum Wine Velvet Sweetheart-Neck Short Kurta + Jet Black High-Waist Flared Palazzo + Heavy Afghan Silver Choker & Jhumkas + Black Shoulder Bag",
  "Strict-Mom Approved Pinterest Coquette: Dusty Mauve Schiffli Eyelet Puff-Sleeve Kurti + Milk White Embroidered Cotton Palazzo + Satin Pearl Bow Clip + Mary Jane Flats",
  "Warm & Dusky Indian Skin Golden-Hour Glow: Peacock Teal Zari V-Neck Straight Kurta + Warm Beige Ankle Trousers + Sheer Organza Scallop Dupatta + Kundan Pearl Jhumkas",
  "Myntra ₹2,899 vs Meesho ₹389 Exact Designer Dupe: Mustard Haldi Mirror-Work Short Kurti + Deep Maroon Flared Sharara/Palazzo + Oxidized Ghungroo Bangles + Embroidered Potli",
  "Broad-Shoulder & Heavy-Arm Slimming Formula: Deep Emerald Green V-Neck 3/4th Sleeve Wrap Top + High-Waist Black Tailored Korean Pants + Minimalist Gold Waist Belt + Structured Sling",
  "Zodiac & Birth-Month Signature Aesthetic: Cherry Burgundy Satin Button-Down Shirt (Half-Tucked) + Dark Grey Wide-Leg Jeans + Silver Layered Waist Chain + Vintage Oval Watch",
];

const CLIENT_HINGLISH_REGEX =
  /\b(kaise|kese|krna|kare|keliye|wala|wali|wale|mujhe|bina|paisa|paise|kamaye|kamana|tarika|chahiye|btao|batao|dikhao|ghar|baithe|sasta|accha|ldki|ladki|moti|patli|kapda|kpda|pehne|pehnna|achha|kuch)\b/i;

function scrubClientEbookText(input: string): string {
  return String(input || "")
    .replace(/GlowCash/gi, "Insider")
    .replace(
      /https?:\/\/docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/[a-zA-Z0-9_-]{6,}(?:\/[^\s)"',]*)?/gi,
      "https://docs.google.com (Click 'Blank Document' -> File -> Share -> Anyone with link)"
    )
    .replace(
      /https?:\/\/drive\.google\.com\/(?:file\/d\/|drive\/folders\/)[a-zA-Z0-9_-]{6,}(?:\/[^\s)"',]*)?/gi,
      "https://drive.google.com (Upload PDF -> Right-Click -> Share -> Anyone with the link)"
    )
    .replace(/https?:\/\/(?:www\.)?affiliate\.amazon\.in\/?/gi, "https://affiliate-program.amazon.in/")
    .replace(/\baffiliate\.amazon\.in\b/gi, "affiliate-program.amazon.in")
    .replace(/(?:₹|Rs\.?\s*)(\d+(?:\.\d+)?\s*%)/gi, "$1")
    .replace(/\b1[2-9]%\s*(?:Amazon\s*)?(?:affiliate\s*)?commission/gi, "3%–9% Amazon Associates commission")
    .replace(
      /\bMagic\s*Resize\b(\s*\(free\))?/gi,
      "Create a design -> Custom size (100% Free on Canva)"
    )
    .replace(
      /\b(?:export|upload)(?:ing)?\s+(?:OBS\s+)?(?:clips?|videos?|recordings?)\s+to\s+Pexels\b/gi,
      "downloading free 4K B-roll from pexels.com/videos and combining it with your OBS recording in CapCut"
    )
    .replace(/https?:\/\/(?:www\.)?saastrader\.com(?:\/[^\s)"',]*)?/gi, "https://partnerstack.com/marketplace")
    .replace(/\bsaastrader\.com\b/gi, "partnerstack.com/marketplace")
    .replace(/https?:\/\/(?:www\.)?imagecheck\.com(?:\/[^\s)"',]*)?/gi, "https://images.google.com (Google Lens)")
    .replace(/\bimagecheck\.com\b/gi, "images.google.com (Google Lens)")
    .replace(
      /₹\s*[1-9],?000\s*(?:AdSense\s*)?per\s*1,?000\s*views/gi,
      "₹60–₹180 AdSense RPM per 1,000 views (after 1,000 subscribers + 4,000 watch hours) plus Day-1 Affiliate sales"
    )
    .replace(
      /\b(\d+\s+(?:simple|easy|fast|proven|real|verified)\s+)?steps\s+to\s+(?:earn\s+|make\s+|get\s+)?(?:₹|rs\.?\s*|inr\s*)?(?:9|19|29|39|49|59|79|99)\s*(?:rs|rupees|cash|income|daily|per\s+day|profit|payouts?)?(\s+in\s+202[67])?/gi,
      "5 Fact-Checked Steps to Real Verified Income in 2026"
    )
    .replace(
      /\b(?:to|for|earn|make|get|into)\s+(?:₹|rs\.?\s*|inr\s*)(?:9|19|29|39|49|59|79|99)\s*(?:rs|rupees|cash|income|daily|profit|payouts?)\b/gi,
      "for Real Verified Income"
    );
}

function parseClientIndianNum(raw: string): number {
  const cleaned = String(raw || "").replace(/[,₹$\s]/g, "").toLowerCase();
  if (cleaned.endsWith("k")) return parseFloat(cleaned.slice(0, -1)) * 1000;
  return parseFloat(cleaned);
}

function formatClientRupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function auditAndFixClientIncomeMath(rawText: string): string {
  let text = scrubClientEbookText(rawText)
    .replace(/^🔥?\s*(the\s*unfair\s*advantage\s*[:.-]?)\s*/i, "")
    .trim();

  text = text.replace(/₹\s*(\d+(?:\.\d+)?)\s*k\b/gi, (_, num) =>
    formatClientRupees(Math.round(parseFloat(num) * 1000))
  );

  text = text.replace(
    /₹([\d,]+)\s*(?:[A-Za-z\s]{0,18})\+\s*₹([\d,]+)\s*(?:[A-Za-z\s]{0,18})=\s*₹([\d,]+)/g,
    (fullMatch, aStr, bStr, cStr) => {
      const a = parseClientIndianNum(aStr);
      const b = parseClientIndianNum(bStr);
      const c = parseClientIndianNum(cStr);
      if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a + b !== c) {
        return fullMatch.replace(`= ₹${cStr}`, `= ${formatClientRupees(a + b)}`);
      }
      return fullMatch;
    }
  );

  const weeklyToMonthlyRegex =
    /₹([\d,]+)(?:\s*(?:per|\/|a)\s*[a-zA-Z]+)?[^₹\n]{0,65}?(\d+)\s*([a-zA-Z-]+(?:\s+[a-zA-Z-]+)?)\s*(?:a|per|\/)\s*week[^₹\n]{0,45}?₹([\d,]+)\s*(?:\/|\s*per\s*|\s*a\s*)month/i;
  const wmMatch = text.match(weeklyToMonthlyRegex);
  if (wmMatch) {
    const unitVal = parseClientIndianNum(wmMatch[1]);
    const weeklyCount = parseClientIndianNum(wmMatch[2]);
    const claimedMonthly = parseClientIndianNum(wmMatch[4]);
    if (!isNaN(unitVal) && !isNaN(weeklyCount) && !isNaN(claimedMonthly) && unitVal >= 50) {
      const trueWeekly = unitVal * weeklyCount;
      const trueMonthly = trueWeekly * 4;
      if (claimedMonthly !== trueMonthly) {
        text = text.replace(
          new RegExp(`₹${wmMatch[4]}\\s*(?:\\/|\\s*per\\s*|\\s*a\\s*)month`, "i"),
          `${formatClientRupees(trueWeekly)}/week (× 4 weeks = ${formatClientRupees(trueMonthly)}/month)`
        );
      }
    }
  }

  return text;
}

function sanitizeClientReelTitle(
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

  const synthesizedTitle = `${p1} + ${p2}: The 30:70 Proportion & ${p3
    .split(" ")
    .slice(0, 3)
    .join(" ")} Styling Formula`;

  const cleaned = String(rawTitle || "").trim();
  if (!cleaned || cleaned.length < 12) return synthesizedTitle;

  const userTrimmed = String(rawUserTheme || "").trim();
  const isVerbatimEcho =
    userTrimmed.length > 0 &&
    userTrimmed.length < 70 &&
    (cleaned.toLowerCase() === userTrimmed.toLowerCase() ||
      cleaned.toLowerCase().includes(userTrimmed.toLowerCase()));

  if (isVerbatimEcho || CLIENT_HINGLISH_REGEX.test(cleaned)) {
    return synthesizedTitle;
  }
  return cleaned;
}

function sanitizeClientEbookTitle(
  rawTitle: string,
  rawUserTopic: string,
  chapters: any[],
  priceDisplay: string
): string {
  let cleaned = scrubClientEbookText(String(rawTitle || "").trim());
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

  const ch1Raw = scrubClientEbookText(String(chapters?.[0]?.title || "")).replace(
    /^Chapter\s*\d+\s*[:\-–—.]?\s*/i,
    ""
  );
  const ch2Raw = scrubClientEbookText(String(chapters?.[1]?.title || "")).replace(
    /^Chapter\s*\d+\s*[:\-–—.]?\s*/i,
    ""
  );
  const ch1Short = ch1Raw.split(/[:(—–]/)[0].trim().slice(0, 48);
  const ch2Short = ch2Raw.split(/[:(—–]/)[0].trim().slice(0, 44);

  const chapterDerivedTitle =
    ch1Short && ch2Short && !CLIENT_HINGLISH_REGEX.test(ch1Short + " " + ch2Short)
      ? `The 2026–2027 Fact-Checked Playbook: ${ch1Short} & ${ch2Short} System`
      : "The 2026–2027 Fact-Checked Execution Vault: Verified Global Portals, Real UI Filters & Copy-Paste Scripts";

  if (!cleaned || cleaned.length < 15) return chapterDerivedTitle;

  const userTrimmed = String(rawUserTopic || "").trim();
  const isCustomTopic =
    userTrimmed.length > 0 &&
    !BROWSER_EBOOK_TOPICS.some(
      (t) => t.toLowerCase() === userTrimmed.toLowerCase()
    );

  if (
    (isCustomTopic && cleaned.toLowerCase().includes(userTrimmed.toLowerCase())) ||
    CLIENT_HINGLISH_REGEX.test(cleaned)
  ) {
    return chapterDerivedTitle;
  }

  return cleaned;
}

export async function generateLiveReelFromBrowserAI(
  themeInput: string,
  categoryFilter: string,
  backgroundDesc: string,
  variationCount: number,
  avoidPreviousTitle = ""
): Promise<ReelGenerationResult> {
  const dailyCtx = getRealTimeDailyStylingContext(variationCount);
  const randomAngle =
    BROWSER_REEL_ANGLES[
      (Math.abs(variationCount) + Math.floor(Math.random() * BROWSER_REEL_ANGLES.length)) %
        BROWSER_REEL_ANGLES.length
    ];

  const hasCustom =
    themeInput &&
    themeInput.trim().length > 0 &&
    themeInput.trim() !== avoidPreviousTitle.trim();
  const effectiveTheme = hasCustom ? themeInput.trim() : randomAngle;

  const systemPrompt = `You are a Late-2026 / 2027 "Lakho Mein Ek" Instagram Reels Algorithm Mastermind & Celebrity Indian Gen-Z Stylist.
Create a 100% BRAND-NEW, NON-GENERIC 4-Piece Mix-and-Match Outfit Combination & Viral Reel Pack for: "${effectiveTheme}".
${hasCustom ? `CRITICAL CUSTOM REQUEST FIDELITY: The user specifically requested "${themeInput.trim()}". Design all 4 pieces, colors, Meesho search keywords, and styling tips 100% around "${themeInput.trim()}"!` : ""}
${avoidPreviousTitle ? `STRICT ANTI-REPETITION: Do NOT repeat "${avoidPreviousTitle}". Invent a 100% different 4-piece outfit, different colors, different Meesho keywords, and different viral hooks!` : ""}
CRITICAL TITLE RULE: NEVER copy-paste the user's raw custom input verbatim into concept.title! Write an attractive 100% Pure English Outfit Title describing the 4 pieces.
TWO-LAYER LANGUAGE RULE:
- Layer 1 (Easy Hinglish): curiosityIdentityAngle, firstTwoSecondVisual, whyItTriggersSharesAndSaves, lookTransformationFormula, shotByShotPlan[].visualAction, searchTerms[].howToCombineAndStyle, searchTerms[].fabricAndFitCheck.
- Layer 2 (100% Pure Clean English): concept.title, shotByShotPlan[].onScreenText, searchTerms[].exactKeyword, searchTerms[].backupSearchKeywords, reelPack.onScreenHooks (3 hooks, 8-15 words each), reelPack.hinglishCaption, reelPack.seoKeywords (10 phrases), reelPack.trendingHashtags (5 lowercase tags).
Return strictly valid JSON with keys: concept, searchTerms (4 items), reelPack.`;

  const userPrompt = `Generate 4-Piece Outfit Combo & Reel Pack for: "${effectiveTheme}". Category: "${categoryFilter}". Nonce: ${variationCount}-${Date.now()}`;

  const aiResp = await callBrowserMultiModelAI(systemPrompt, userPrompt, variationCount);
  const fallback = generateInstantReelClientSide(
    effectiveTheme,
    categoryFilter,
    backgroundDesc,
    variationCount + Math.floor(Math.random() * 8)
  );

  if (!aiResp?.parsed?.concept || !Array.isArray(aiResp?.parsed?.searchTerms)) {
    return fallback;
  }

  const aiParsed = aiResp.parsed;
  const validSearchTerms: SearchTermItem[] =
    aiParsed.searchTerms.length >= 4
      ? aiParsed.searchTerms.slice(0, 4).map((s: any, i: number) => ({
          itemLabel: s.itemLabel || fallback.searchTerms[i]?.itemLabel || `Piece ${i + 1}`,
          exactKeyword: sanitizeMeeshoSearchTerm(
            s.exactKeyword || fallback.searchTerms[i].exactKeyword,
            i
          ),
          backupSearchKeywords: Array.isArray(s.backupSearchKeywords)
            ? s.backupSearchKeywords.slice(0, 2).map((b: any) => sanitizeMeeshoSearchTerm(String(b), i))
            : fallback.searchTerms[i].backupSearchKeywords,
          howToCombineAndStyle: s.howToCombineAndStyle || fallback.searchTerms[i].howToCombineAndStyle,
          priceFilter: s.priceFilter || "Under ₹399 · 4.1★+",
          fabricAndFitCheck: s.fabricAndFitCheck || fallback.searchTerms[i].fabricAndFitCheck,
          platform: "Meesho",
        }))
      : fallback.searchTerms;

  const title = sanitizeClientReelTitle(
    aiParsed.concept.title || fallback.concept.title,
    themeInput,
    validSearchTerms
  );
  const howToCombine =
    aiParsed.concept?.lookTransformationFormula?.howToCombineAllFourPieces ||
    fallback.concept.lookTransformationFormula?.howToCombineAllFourPieces ||
    "";

  return {
    id: `reel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    themeInput: title,
    providerUsed: `${aiResp.providerName} (${dailyCtx.formattedDate})`,
    concept: {
      title,
      category: aiParsed.concept.category || fallback.concept.category,
      liveDailyTrendTag: `${dailyCtx.liveDailyTrendTag} · Variation #${variationCount}`,
      curiosityIdentityAngle:
        aiParsed.concept.curiosityIdentityAngle || fallback.concept.curiosityIdentityAngle,
      firstTwoSecondVisual:
        aiParsed.concept.firstTwoSecondVisual || fallback.concept.firstTwoSecondVisual,
      whyItTriggersSharesAndSaves:
        aiParsed.concept.whyItTriggersSharesAndSaves || fallback.concept.whyItTriggersSharesAndSaves,
      lookTransformationFormula: {
        beforeVsAfterLook:
          aiParsed.concept?.lookTransformationFormula?.beforeVsAfterLook ||
          fallback.concept.lookTransformationFormula?.beforeVsAfterLook ||
          "",
        howToCombineAllFourPieces: howToCombine,
        threeWaysToRestyleCombo:
          Array.isArray(aiParsed.concept?.lookTransformationFormula?.threeWaysToRestyleCombo)
            ? aiParsed.concept.lookTransformationFormula.threeWaysToRestyleCombo.map(String)
            : fallback.concept.lookTransformationFormula?.threeWaysToRestyleCombo || [],
      },
      colorPalette:
        Array.isArray(aiParsed.concept.colorPalette) && aiParsed.concept.colorPalette.length > 0
          ? aiParsed.concept.colorPalette
          : fallback.concept.colorPalette,
      shotByShotPlan: fallback.concept.shotByShotPlan,
    },
    searchTerms: validSearchTerms,
    prompts: buildMasterPrompts(validSearchTerms, backgroundDesc, title, howToCombine),
    reelPack: enforceMastermindViralReelPack(
      validSearchTerms,
      title,
      howToCombine,
      aiParsed.reelPack,
      variationCount
    ),
  };
}

const BROWSER_EBOOK_TOPICS = [
  "The Dark Psychology of WhatsApp DM Closing & High-Ticket Freelance Deals (5 Behavioral Triggers That Close ₹4,999 Clients in 15 Minutes)",
  "The 6-Second Instagram Trial-Reel & Auto-DM Micro-Dossier Funnel (Turning ₹29–₹99 Impulse PDFs Into Automated Daily UPI Cashflow With 0 Followers)",
  "The Google Maps 'High-Review, No-Website' Local Clinic, Salon & Gym Digital Takeover (Closing ₹3,999 Deals in 48 Hours)",
  "12 Verified Free Harvard CS50x, Tata/JPMorgan Forage & Google Credentials + LinkedIn 'Past 24 Hours' Direct Founder Backdoor",
  "The ₹150 Indian Pharmacy Generic Salt Bible: Exact Chemist Equivalents (Aziderm, Glyco-6, Hyalugel) for ₹3,500 Luxury Serums",
  "15 Underrated Zero-Cost AI Study, Research & Exam-Crushing Portals (NotebookLM Audio Podcasts, Perplexity, SciSpace & Anki)",
  "Pinterest-to-Gumroad & Etsy Digital Planner Arbitrage (Creating 50 Aesthetic Notion & Printable Trackers in 20 Minutes)",
  "Dark Psychology of Magnetic Communication, Executive Confidence & High-Stakes HR Salary Negotiation (+₹2L–₹5L CTC Exploit)",
  "YouTube Faceless 'Search-Gap' & Software Comparison Channels (High-CPM Affiliate & AdSense Engine Without Recording Your Face)",
  "D2C E-Commerce Virtual Photoshoot & UGC Studio Arbitrage (Selling ₹2,499 4K Product Launch Packs to New Indian Brands)",
  "5 Fact-Checked Global UX Testing & Academic Research Bounties (UserTesting, Prolific, Dscout, Trymata & Respondent — Zero Selling)",
  "The Micro-Creator Brand Barter & Paid UGC Loophole (How to Get Free PR Boxes & ₹3,000/Video Deals With Under 1,000 Followers)",
];

export async function generateLiveEbookFromBrowserAI(
  topicInput: string,
  priceDisplay: string,
  anchorPriceDisplay: string,
  autoDmTrigger: string,
  variationCount: number,
  category = "All",
  avoidPreviousTitle = ""
): Promise<EbookGenerationResult> {
  const nonRepeatingTopics = BROWSER_EBOOK_TOPICS.filter(
    (t) =>
      !avoidPreviousTitle ||
      (!avoidPreviousTitle.toLowerCase().includes(t.slice(0, 16).toLowerCase()) &&
        !t.toLowerCase().includes(avoidPreviousTitle.slice(0, 16).toLowerCase()))
  );
  const pool =
    nonRepeatingTopics.length > 0 ? nonRepeatingTopics : BROWSER_EBOOK_TOPICS;
  const randomTopic =
    pool[
      (Math.abs(variationCount) * 3 + Math.floor(Math.random() * pool.length)) %
        pool.length
    ];

  const hasCustom =
    topicInput &&
    topicInput.trim().length > 0 &&
    !BROWSER_EBOOK_TOPICS.some(
      (t) => t.toLowerCase() === topicInput.trim().toLowerCase()
    );
  const effectiveTopic =
    topicInput && topicInput.trim().length > 0
      ? topicInput.trim()
      : randomTopic;

  const isExplicitVoiceOrOutlier =
    hasCustom &&
    /\b(eleven\s*labs|elevenlabs|voice\s*clon|outlier|oneforma|chat\s*agent)\b/i.test(
      effectiveTopic
    );

  const systemPrompt = `[ROLE: YOUR SMARTEST GEN-Z INSIDER FRIEND — ZERO GATEKEEPING, ZERO AI SLOP, 100% REAL TALK]
You are a sharp, brutally honest 2026 Gen-Z creator & researcher writing a sleek 5-part private Notion-style playbook on: "${effectiveTopic}" (Category: "${category}").

[CRITICAL TONE, ZERO-JARGON & GROUND-TRUTH RULES]
1. SIMPLE EVERYDAY GEN-Z ENGLISH: Write at an 8th-grade spoken English level—casual, motivating, honest, and super easy to read. NO boring "Chapter 1 / Chapter 2" textbook vibe and NO cheesy AI drama!
2. BANNED WORDS & AI SLOP: NEVER use "geographic nodes", "strategic time", "workspace", "networking hubs", "ecosystem", "infiltration", "leverage", "paradigm", "synergy", "unlock", "elevate", "game-changer", "classified dossier", "loaded weapon", "elites", "jedi mind-trick", "Tired of wasting time...", "Stop X, start Y", or "coffee cup on clean organized workspace".
3. 100% REAL VERIFIED LINKS & MATH: Only use real URLs (affiliate-program.amazon.in, facebook.com/ads/library, google.com/maps, canva.com, obsproject.com, pexels.com/videos, superprofile.bio, cosmofeed.com, gumroad.com, cs50.harvard.edu/x, theforage.com, notebooklm.google.com, 1mg.com, usertesting.com/get-paid-to-test, prolific.com). Verify all math cleanly ([Unit] × [Weekly] = [Weekly Total]/week × 4 weeks = [Exact Monthly Total]/month).
4. 5-PART PLAYBOOK STRUCTURE (each item in "chapters"):
   - title: Catchy pure English title (NO "Chapter X" prefix)
   - subtitle: Crisp 1-line vibe check (e.g., "₹0 to start · takes 20 mins on your phone" — NEVER write "WARNING: Keep this strictly confidential"!)
   - coreSecretSummary: 3–4 simple sentences on what everyone gets wrong vs what actually works today.
   - whereToFindOrHiddenTrick: Exact real link, hidden filter, or shortcut explained simply.
   - stepByStepExecution: 4 steps starting with "1. Setup:", "2. The Move:", "3. Scale It:", "4. Stay Safe:".
   - copyPasteTemplateOrScript: label "Copy-Paste Cheat Sheet" + natural human-sounding word-for-word message/script.
   - incomeMathOrProof: Verified math or real time/money saved.
5. TOPIC FIDELITY: Write ALL 5 parts 100% about "${effectiveTopic}"! ${
    isExplicitVoiceOrOutlier
      ? ""
      : "NEVER mention ElevenLabs, Voice Cloning, Voquent, Outlier.ai, or IndiaMART Kurti Catalogs!"
  }
${avoidPreviousTitle ? `6. ANTI-REPETITION: Do NOT repeat "${avoidPreviousTitle}".` : ""}
7. NEVER put "${priceDisplay}" in ebook.title or playbook parts (it's ONLY for the Reel caption/overlays). Never mention "GlowCash".
Return strictly valid JSON with keys: ebook (editionTag, title, subtitle, targetReaderPromise, goldenRuleTitle, goldenRuleBody, hardestPartSolvedBox, quickValueBreakdown, chapters [5 items], twentyFourHourChecklist), reelBlueprint (aiVideoPrompts { rawPhoneFirstFramePrompt, zeroSlopVideoMotionPrompt, relatablePovBrollPrompt, algorithmTriggerNote — 100% raw candid everyday Gen-Z phone clip, NEVER clean corporate workspace }, sixSecondVideoIdea, psychologicalPriceOverlays [4 short casual human Gen-Z hooks], autoDmCaption [natural friend-sharing-notes SEO caption], seoKeywords [10 phrases], hashtags [5 lowercase tags]).`;

  const userPrompt = `USER'S EXACT REQUESTED TOPIC: "${effectiveTopic}" | Verify all math & real URLs | ZERO AI slop, ZERO jargon, ZERO ad copy | Reel Price (ONLY for reel caption/overlays!): ${priceDisplay} | Value: ${anchorPriceDisplay} | Trigger: ${autoDmTrigger} | Nonce: ${variationCount}-${Date.now()}`;

  const aiResp = await callBrowserMultiModelAI(systemPrompt, userPrompt, variationCount);
  const fallback = generateInstantEbookClientSide(
    effectiveTopic,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    variationCount,
    category
  );

  if (
    !aiResp?.parsed?.ebook?.chapters ||
    !Array.isArray(aiResp.parsed.ebook.chapters) ||
    aiResp.parsed.ebook.chapters.length === 0
  ) {
    return fallback;
  }

  const eb = aiResp.parsed.ebook;
  const rb = aiResp.parsed.reelBlueprint;
  const polishedTitle = sanitizeClientEbookTitle(
    eb.title || fallback.ebook.title,
    topicInput,
    eb.chapters,
    priceDisplay
  );

  const normalizeClientSteps = (steps: any[], fallbackSteps: string[]): string[] => {
    const raw = Array.isArray(steps) && steps.length > 0 ? steps : fallbackSteps;
    const labels = [
      "1. Setup:",
      "2. The Move:",
      "3. Scale It:",
      "4. Stay Safe:",
    ];
    return raw.map((s: any, i: number) => {
      const cleaned = scrubClientEbookText(String(s || ""))
        .replace(
          /^(?:1️⃣|2️⃣|3️⃣|4️⃣|5️⃣)?\s*(?:The\s+)?(?:Infiltration|Trigger|Leverage|Safety\s*Lock)\s*[:.-]?\s*/i,
          ""
        )
        .trim();
      if (/^\d+\.\s*(Setup|The Move|Scale It|Stay Safe)\s*:/i.test(cleaned)) {
        return cleaned;
      }
      const stripped = cleaned.replace(/^(Step\s*\d+\s*[:\-–.]?\s*|\d+\s*[:\-–.)]\s*)/i, "");
      const prefix = labels[i] || `${i + 1}.`;
      return `${prefix} ${stripped}`;
    });
  };

  return {
    id: `ebook-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    topicInput: polishedTitle,
    category,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    providerUsed: `${aiResp.providerName} · Gen-Z Playbook AI`,
    ebook: {
      editionTag: "PRIVATE 2026 PLAYBOOK · NO GATEKEEPING · ZERO FLUFF",
      title: polishedTitle,
      subtitle: scrubClientEbookText(eb.subtitle || fallback.ebook.subtitle),
      targetReaderPromise: scrubClientEbookText(
        eb.targetReaderPromise || fallback.ebook.targetReaderPromise
      ),
      goldenRuleTitle: scrubClientEbookText(
        eb.goldenRuleTitle || fallback.ebook.goldenRuleTitle
      ),
      goldenRuleBody: scrubClientEbookText(
        eb.goldenRuleBody || fallback.ebook.goldenRuleBody
      ),
      hardestPartSolvedBox: eb.hardestPartSolvedBox?.exactWhereToFindMap
        ? eb.hardestPartSolvedBox
        : fallback.ebook.hardestPartSolvedBox,
      quickValueBreakdown: Array.isArray(eb.quickValueBreakdown)
        ? eb.quickValueBreakdown
        : fallback.ebook.quickValueBreakdown,
      chapters: eb.chapters.slice(0, 5).map((ch: any, idx: number) => {
        const rawSub = scrubClientEbookText(
          ch.subtitle || "₹0 to start · takes 20 mins on your phone"
        )
          .replace(/^⚠️?\s*WARNING:\s*Keep this strictly confidential\.?\s*[—–-]?\s*/i, "")
          .trim();
        return {
          chapterNumber: idx + 1,
          title: scrubClientEbookText(
            String(ch.title || `Play 0${idx + 1}`).replace(
              /^(?:chapter|part|play)\s*0?\d+\s*[:·.-]\s*/i,
              ""
            )
          ),
          subtitle: rawSub || "₹0 to start · simple step-by-step play",
          coreSecretSummary: scrubClientEbookText(ch.coreSecretSummary || ""),
          whereToFindOrHiddenTrick: scrubClientEbookText(
            ch.whereToFindOrHiddenTrick || ""
          ),
          stepByStepExecution: normalizeClientSteps(
            ch.stepByStepExecution,
            fallback.ebook.chapters[0].stepByStepExecution
          ),
          exactToolsOrWebsites: Array.isArray(ch.exactToolsOrWebsites)
            ? ch.exactToolsOrWebsites.map((t: any) => ({
                name: scrubClientEbookText(String(t?.name || "Verified Site")),
                role: scrubClientEbookText(String(t?.role || "Main Free Tool")),
                insiderTip: scrubClientEbookText(String(t?.insiderTip || "")),
              }))
            : fallback.ebook.chapters[0].exactToolsOrWebsites,
          copyPasteTemplateOrScript:
            ch.copyPasteTemplateOrScript?.content
              ? {
                  label: scrubClientEbookText(
                    ch.copyPasteTemplateOrScript.label || "Copy-Paste Cheat Sheet"
                  )
                    .replace(/^🧠\s*/i, "")
                    .replace(/The\s+Jedi\s+Mind-?Trick\s*\/?\s*(?:Secret\s*)?/i, "Copy-Paste "),
                  content: scrubClientEbookText(
                    ch.copyPasteTemplateOrScript.content
                  ),
                }
              : fallback.ebook.chapters[0].copyPasteTemplateOrScript,
          incomeMathOrProof: auditAndFixClientIncomeMath(ch.incomeMathOrProof || ""),
        };
      }),
      twentyFourHourChecklist: Array.isArray(eb.twentyFourHourChecklist)
        ? eb.twentyFourHourChecklist.map((s: any) => scrubClientEbookText(String(s)))
        : fallback.ebook.twentyFourHourChecklist,
    },
    reelBlueprint: (() => {
      const chTitles = eb.chapters
        .slice(0, 5)
        .map((c: any) => scrubClientEbookText(String(c?.title || "")));
      const fallbackPrompts = buildAntiSlopEbookVideoPrompts(
        polishedTitle,
        chTitles[0] || "Step-by-Step Insider System",
        priceDisplay,
        autoDmTrigger,
        variationCount
      );
      return {
        aiVideoPrompts: {
          rawPhoneFirstFramePrompt:
            rb?.aiVideoPrompts?.rawPhoneFirstFramePrompt ||
            fallbackPrompts.rawPhoneFirstFramePrompt,
          zeroSlopVideoMotionPrompt:
            rb?.aiVideoPrompts?.zeroSlopVideoMotionPrompt ||
            fallbackPrompts.zeroSlopVideoMotionPrompt,
          relatablePovBrollPrompt:
            rb?.aiVideoPrompts?.relatablePovBrollPrompt ||
            fallbackPrompts.relatablePovBrollPrompt,
          algorithmTriggerNote:
            rb?.aiVideoPrompts?.algorithmTriggerNote ||
            fallbackPrompts.algorithmTriggerNote,
        },
        sixSecondVideoIdea: rb?.sixSecondVideoIdea?.shotByShot
          ? rb.sixSecondVideoIdea
          : fallback.reelBlueprint.sixSecondVideoIdea,
        psychologicalPriceOverlays: Array.isArray(rb?.psychologicalPriceOverlays)
          ? rb.psychologicalPriceOverlays.slice(0, 4)
          : fallback.reelBlueprint.psychologicalPriceOverlays,
        autoDmCaption: rb?.autoDmCaption || fallback.reelBlueprint.autoDmCaption,
        seoKeywords: Array.isArray(rb?.seoKeywords)
          ? rb.seoKeywords.slice(0, 10)
          : fallback.reelBlueprint.seoKeywords,
        hashtags: Array.isArray(rb?.hashtags)
          ? rb.hashtags.slice(0, 5)
          : fallback.reelBlueprint.hashtags,
      };
    })(),
  };
}

export async function regenerateEbookReelSectionLive(
  result: EbookGenerationResult,
  section: EbookReelSectionKey,
  variationIndex: number
): Promise<{
  updatedReelBlueprint: EbookGenerationResult["reelBlueprint"];
  providerUsed: string;
}> {
  const chapterTitles = result.ebook.chapters.map((c) => c.title);

  const previousContentMap: Record<EbookReelSectionKey, string> = {
    prompts: JSON.stringify(result.reelBlueprint.aiVideoPrompts || {}),
    videoPlan: JSON.stringify(result.reelBlueprint.sixSecondVideoIdea || {}),
    overlays: JSON.stringify(
      result.reelBlueprint.psychologicalPriceOverlays || []
    ),
    caption: result.reelBlueprint.autoDmCaption || "",
    tags: JSON.stringify({
      seoKeywords: result.reelBlueprint.seoKeywords,
      hashtags: result.reelBlueprint.hashtags,
    }),
    all: JSON.stringify({
      visualStyle: result.reelBlueprint.sixSecondVideoIdea.visualStyle,
      firstOverlay:
        result.reelBlueprint.psychologicalPriceOverlays[0]?.overlayText || "",
      captionStart: (result.reelBlueprint.autoDmCaption || "").slice(0, 180),
    }),
  };

  const mergePartial = (
    partial: Partial<EbookGenerationResult["reelBlueprint"]>
  ): EbookGenerationResult["reelBlueprint"] => ({
    ...result.reelBlueprint,
    ...(partial.aiVideoPrompts ? { aiVideoPrompts: partial.aiVideoPrompts } : {}),
    ...(partial.sixSecondVideoIdea
      ? { sixSecondVideoIdea: partial.sixSecondVideoIdea }
      : {}),
    ...(Array.isArray(partial.psychologicalPriceOverlays) &&
    partial.psychologicalPriceOverlays.length > 0
      ? {
          psychologicalPriceOverlays: partial.psychologicalPriceOverlays.slice(
            0,
            4
          ),
        }
      : {}),
    ...(partial.autoDmCaption ? { autoDmCaption: partial.autoDmCaption } : {}),
    ...(Array.isArray(partial.seoKeywords) && partial.seoKeywords.length > 0
      ? { seoKeywords: partial.seoKeywords.slice(0, 10) }
      : {}),
    ...(Array.isArray(partial.hashtags) && partial.hashtags.length > 0
      ? { hashtags: partial.hashtags.slice(0, 5) }
      : {}),
  });

  // 1. Try local Express backend first (Server-Side Gemini 4 Hydrogen)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const res = await fetch("/api/regenerate-ebook-reel-section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ebookTitle: result.ebook.title,
        ebookSubtitle: result.ebook.subtitle,
        chapterTitles,
        priceDisplay: result.priceDisplay,
        anchorPriceDisplay: result.anchorPriceDisplay,
        autoDmTrigger: result.autoDmTrigger,
        section,
        previousContent: previousContentMap[section],
        variationIndex,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && typeof json.data === "object") {
        return {
          updatedReelBlueprint: mergePartial(json.data),
          providerUsed: json.providerUsed || "Live Anti-Slop Reel AI",
        };
      }
    }
  } catch {
    // Fall through to browser live AI (for Netlify static deploy)
  }

  // 2. Direct Browser Multi-Model AI Fallback (Netlify-safe)
  const fallbackPartial = buildRotatingEbookReelSectionFallback({
    ebookTitle: result.ebook.title,
    chapterTitles,
    priceDisplay: result.priceDisplay,
    anchorPriceDisplay: result.anchorPriceDisplay,
    autoDmTrigger: result.autoDmTrigger,
    section,
    variationIndex,
  });

  try {
    const schemaHint =
      section === "prompts"
        ? `Return STRICT JSON with key "aiVideoPrompts": { "rawPhoneFirstFramePrompt", "zeroSlopVideoMotionPrompt", "relatablePovBrollPrompt", "algorithmTriggerNote" }.`
        : section === "videoPlan"
        ? `Return STRICT JSON with key "sixSecondVideoIdea": { "visualStyle", "shotByShot": [3 items], "lightingAndAudioTip" }.`
        : section === "overlays"
        ? `Return STRICT JSON with key "psychologicalPriceOverlays": [4 objects with triggerType, overlayText, whyItConverts].`
        : section === "caption"
        ? `Return STRICT JSON with key "autoDmCaption": "string".`
        : section === "tags"
        ? `Return STRICT JSON with keys "seoKeywords" (10 strings) and "hashtags" (strictly 5 lowercase tags).`
        : `Return STRICT JSON with keys "aiVideoPrompts", "sixSecondVideoIdea", "psychologicalPriceOverlays" (4 items), "autoDmCaption", "seoKeywords" (10 items), "hashtags" (5 items).`;

    const sysPrompt = `You are a real 22-year-old viral Indian Gen-Z Instagram Reels creator.
STRICT RULES:
- ZERO AI SLOP (0%): Prompts must look 100% like candid unedited phone clips (messy hostel bed, making chai/Maggi, tying hair / lip balm mirror frame, auto/metro window sunset, balcony breeze). NEVER write "clean organized workspace", "coffee cup next to laptop", "Close up of computer screen showing [topic]", neon glow, or CGI skin.
- ZERO JARGON & ZERO AD COPY: BANNED phrases: "geographic nodes", "strategic time", "workspace", "networking hubs", "Stop X, start Y", "Tired of wasting time...", "No fluff, just...", "insider-leak aesthetic", "No AI robot voices".
- Write in super-simple everyday Gen-Z English—casual, relatable, friend-spilling-tea vibe so viewers comment "${result.autoDmTrigger}" for the ${result.priceDisplay} PDF effortlessly.
- NEVER repeat the previous output. Never mention "GlowCash".
${schemaHint}`;

    const usrPrompt = `Ebook: "${result.ebook.title}" | Chapters: ${chapterTitles.join(" | ")} | Price: ${result.priceDisplay} (Value ${result.anchorPriceDisplay}) | Comment Trigger: "${result.autoDmTrigger}" | Avoid repeating: ${previousContentMap[section].slice(0, 600)} | Nonce: ${variationIndex}-${Date.now()}`;

    const aiResp = await callBrowserMultiModelAI(
      sysPrompt,
      usrPrompt,
      variationIndex
    );
    if (aiResp?.parsed && typeof aiResp.parsed === "object") {
      return {
        updatedReelBlueprint: mergePartial({
          ...fallbackPartial,
          ...aiResp.parsed,
        }),
        providerUsed: `${aiResp.providerName} · Anti-Slop Reel AI`,
      };
    }
  } catch {
    // Use rotating fallback
  }

  // 3. Guaranteed Instant Rotating Fallback
  return {
    updatedReelBlueprint: mergePartial(fallbackPartial),
    providerUsed: "2026 Anti-Slop Viral Reel Engine",
  };
}



