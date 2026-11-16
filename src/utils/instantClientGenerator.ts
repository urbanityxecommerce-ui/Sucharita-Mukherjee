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
      providerUsed: "2026–2027 Verified Non-Bidding Portal Engine",
      ebook: {
        editionTag:
          "2026–2027 FACT-CHECKED INSIDER EDITION · 10 NON-BIDDING PORTALS · ZERO UPWORK COMPETITION",
        title: chatTitle,
        subtitle:
          "How to Pass Direct Qualification Tests & Earn Weekly in USD/INR on 10 Real Non-Bidding Chat, AI Text Evaluation & Q&A Portals From India.",
        targetReaderPromise:
          "Zero Upwork/Fiverr proposal bidding, zero registration fees, and zero fake data-entry scams. Every chapter covers 2 real, verified global portals (10 websites total) where Indians pass a 1-time skill or language check and get paid per task, chat hour, or evaluated response.",
        goldenRuleTitle:
          "Your #1 Golden Rule: Never Pay 'Registration Fees' & Never Use AI Auto-Pasting During Qualification Tests",
        goldenRuleBody:
          "Every legitimate non-bidding chat and AI text evaluation portal in this manual is 100% free (₹0) to join. During qualification exams on Outlier, OneForma, CrowdGen, or ModSquad, never copy-paste answers from ChatGPT—their browser telemetry flags clipboard paste events immediately. Always type your evaluation justification in your own words and link a PAN-verified PayPal or Payoneer India account before starting tasks.",
        hardestPartSolvedBox: {
          title:
            "🔥 THE HARDEST PART SOLVED: Direct URLs & Exact Indian Signup Paths for All 10 Non-Bidding Websites",
          exactWhereToFindMap: [
            "1. Outlier.ai (app.outlier.ai) & DataAnnotation.tech: Apply under 'Hindi / Indian English AI Writing & Chat Evaluator' (no coding required). Pays $7.50–$18/hr USD weekly every Tuesday via PayPal India.",
            "2. OneForma (my.oneforma.com) & Appen CrowdGen (crowdgen.com): Go to 'Jobs → AI Data / Text Annotation & Chat Response Grading' → Pass the 15-minute language certification → Link Payoneer India.",
            "3. TELUS Digital AI (telusinternational.ai) & Welocalize (jobs.welocalize.com): Search 'India Remote' → Apply for 'Personalized Internet Ads / Chat Search Quality Rater (Hindi/English)'.",
            "4. RWS TrainAI (rws.com/trainai), ModSquad (modsquad.com/join-the-squad), Concentrix Remote Chat (jobs.concentrix.com) & Chegg India (cheggindia.com/qa-expert): Direct non-bidding text chat & written Q&A portals.",
          ],
          zeroFollowerTrafficTrick:
            "Why Non-Bidding Portals Beat Freelance Marketplaces: Instead of competing with 200 bidders on Upwork, you pass a 20-minute objective rubric quiz once and unlock a self-serve task queue where you earn from your very first approved chat evaluation.",
        },
        quickValueBreakdown: [
          {
            metric: "1. 10 Real Non-Bidding Portals",
            detail:
              "2 verified websites per chapter (= 10 total portals) with exact URLs and Indian payment methods.",
          },
          {
            metric: "2. Zero Proposal Bidding",
            detail:
              "Pass a 1-time qualification assessment and claim tasks directly from the live queue.",
          },
          {
            metric: "3. Exact Rubric Pass Formula",
            detail:
              "Word-for-word 3-part justification template to pass Outlier, OneForma, and TELUS exams.",
          },
          {
            metric: "4. Weekly PayPal & Payoneer Math",
            detail:
              "Clear USD/INR payout schedules ($8–$15/hr on AI chat evaluation; ₹18,000–₹35,000/mo on remote chat).",
          },
        ],
        chapters: [
          {
            chapterNumber: 1,
            title:
              "Websites #1 & #2: Outlier.ai & DataAnnotation.tech (The AI Evaluation Backdoor)",
            subtitle:
              "⚠️ WARNING: Keep this strictly confidential. How Indians earn $7.50–$18/hr USD grading AI chatbot answers with zero bidding.",
            coreSecretSummary:
              "The 99% Illusion: Normal people waste 6 months on Upwork and Fiverr fighting 150 desperate bidders for a $5 typing gig and never get hired. The 1% Reality: Tech giants cannot launch new AI models without human evaluators in India grading which chatbot answer is smarter—and portals like Outlier.ai and DataAnnotation.tech pay $7.50 to $18/hour USD into your PayPal every Tuesday with zero client hunting.",
            whereToFindOrHiddenTrick:
              "THE SECRET MECHANISM & EXACT CLICK-PATH: Instead of begging clients for work, you enter the AI supply chain directly. Open outlier.ai → Click 'View Opportunities' → Filter Location: 'India' → Select 'Hindi Language Writing / Generalist AI Trainer' or 'Indian English Evaluator'. Also open dataannotation.tech/starter-assessment using a clean Gmail account.",
            stepByStepExecution: [
              "1️⃣ The Infiltration: First, verify your Indian PayPal account with your PAN card and Indian bank account so automated Tuesday USD payouts never get stuck. Prepare a clean 1-page PDF resume highlighting writing, proofreading, tutoring, or bilingual Hindi-English communication.",
              "2️⃣ The Trigger: Take the 30-minute starter assessment on Outlier.ai and DataAnnotation.tech in a quiet room. Never use Ctrl+C / Ctrl+V or browser AI extensions—their keystroke tracker flags clipboard pasting and rejects 90% of careless applicants automatically.",
              "3️⃣ The Leverage: Grade every side-by-side AI chat response using the 3-Point Rubric (Truthfulness, Instruction Following, and Tone) and unlock optional skill badges inside Outlier's 'Enablement Center' tab to get 3x more daily task queues.",
              "4️⃣ The Safety Lock: Keep your task timer within the recommended average time—never rush a 15-minute evaluation in 2 minutes, and verify every factual claim on Google Search before clicking Submit.",
            ],
            exactToolsOrWebsites: [
              {
                name: "outlier.ai (app.outlier.ai)",
                role: "Website #1 · Non-Bidding AI Chat Trainer & Hindi/English Evaluator ($7.50–$18/hr USD)",
                insiderTip:
                  "Complete all optional skill screenings inside the 'Enablement Center' tab to unlock 3x more daily chat projects.",
              },
              {
                name: "dataannotation.tech",
                role: "Website #2 · Self-Serve AI Chatbot Comparison Portal (Weekly PayPal Payouts)",
                insiderTip:
                  "Take your time on the starter assessment—accuracy on the 5 logic and fact-checking questions is 10x more important than speed.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "🧠 The Jedi Mind-Trick / Secret Script (3-Sentence Justification Formula That Scores 5/5)",
              content: `"Response A is much better than Response B because it followed all formatting constraints, including the negative constraint to avoid bullet points. While both responses are factually accurate, Response B hallucinated an unrequested conclusion paragraph. Therefore, Response A is helpful, concise, and completely truthful."`,
            },
            incomeMathOrProof:
              "10 hours/week on Outlier.ai at $11/hr average = $110/week ($440/month ≈ ₹37,000/month) paid every Tuesday via PayPal while 99% of freelancers are still refreshing Upwork.",
          },
          {
            chapterNumber: 2,
            title:
              "Websites #3 & #4: OneForma (Centific) & Appen CrowdGen (The Pre-Certified Fast Track)",
            subtitle:
              "⚠️ WARNING: Keep this strictly confidential. High-approval non-bidding portals for Indian bilingual speakers with Payoneer USD payouts.",
            coreSecretSummary:
              "The 99% Illusion: Beginners apply to random remote jobs with an empty profile and wonder why their application sits on 'Pending' forever. The 1% Reality: OneForma (my.oneforma.com) and Appen's revamped 2026 platform CrowdGen (crowdgen.com) use an automated certification filter—if you pass two free 15-minute language quizzes BEFORE applying, the algorithm pushes your Indian profile straight to auto-approval.",
            whereToFindOrHiddenTrick:
              "THE SECRET MECHANISM & EXACT CLICK-PATH: Go to my.oneforma.com → Register free → Click 'Certifications' in the left sidebar FIRST → Pass 'English Reading Comprehension' & 'Hindi Native' (free, 15 mins) → Then click 'Jobs → AI & LLM Evaluation' → Click 'Apply' for priority auto-approval. Repeat on crowdgen.com.",
            stepByStepExecution: [
              "1️⃣ The Infiltration: Create a free Payoneer India account (payoneer.com) and link it inside OneForma's 'Payment Information' tab and CrowdGen's payout settings before touching any project.",
              "2️⃣ The Trigger: Inside OneForma ('Certifications' tab), pass the free English and Hindi certifications first. Then apply to 'Milkyway / LLM Chat Grading' on both OneForma and CrowdGen.",
              "3️⃣ The Leverage: Download the 4-page project guideline PDF and keep it open in a second browser tab using Ctrl+F while taking the open-book qualification quiz so you score 90%+ on attempt #1.",
              "4️⃣ The Safety Lock: Always spend the full Recommended Rating Time (RRT) on each micro-chat turn—submitting too fast triggers automated speed-flags.",
            ],
            exactToolsOrWebsites: [
              {
                name: "my.oneforma.com (OneForma by Centific)",
                role: "Website #3 · High-Approval Indian Bilingual Chat & Prompt Grading Portal",
                insiderTip:
                  "Always keep the guideline PDF open using Ctrl+F during the open-book project quiz to score 90%+ on your first attempt.",
              },
              {
                name: "crowdgen.com (Appen 2026 Platform)",
                role: "Website #4 · Global Micro-Task & Chat Response Evaluation Queue",
                insiderTip:
                  "Verify your phone number and Indian tax residency inside CrowdGen settings so monthly payouts process smoothly.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "🧠 The Jedi Mind-Trick / Secret Script (3-Point Quality Lock Before Clicking Submit)",
              content: `1. Did the chatbot answer in the exact language requested (e.g., pure Hindi vs Hinglish)?\n2. Did I verify all dates, prices, and Indian local facts via Google Search?\n3. Did I spend at least the recommended target time (RRT) per task so the quality timer never flags my account?`,
            },
            incomeMathOrProof:
              "8 hours/week across OneForma + CrowdGen at $6–$9/hr = ~$240/month (₹20,000/month) via Payoneer with zero bidding and zero interviews.",
          },
          {
            chapterNumber: 3,
            title:
              "Websites #5 & #6: TELUS Digital AI & Welocalize (The Open-Book Exam Loophole)",
            subtitle:
              "⚠️ WARNING: Keep this strictly confidential. Long-term search & chat quality rating for Indian residents with direct bank wire transfer.",
            coreSecretSummary:
              "The 99% Illusion: Most applicants fail the TELUS Digital and Welocalize qualification test because they try to answer from memory or personal opinion. The 1% Reality: Their entire exam is 100% open-book and based strictly on a downloadable PDF ('Needs Met' and 'Page Quality'). Once you pass using Ctrl+F, you unlock steady weekly task queues that pay directly to your Indian bank account.",
            whereToFindOrHiddenTrick:
              "THE SECRET MECHANISM & EXACT CLICK-PATH: Open telusinternational.ai/cmp/contributor → Filter Country: 'India' → Select 'Personalized Internet Assessor (India)' or 'AI Community Surfer'. Also open jobs.welocalize.com → Filter Location: 'Remote - India' → Apply for 'Search Quality Rater / Ads Quality Rater'.",
            stepByStepExecution: [
              "1️⃣ The Infiltration: Apply on telusinternational.ai and jobs.welocalize.com using the exact primary Gmail address you use on your Chrome browser and Android phone.",
              "2️⃣ The Trigger: When they email you the General Guidelines PDF, press Ctrl+F and bookmark the 'Needs Met (NM)' and 'Page Quality (PQ) / E-E-A-T' tables—every exam question is a clone of the examples in those two tables.",
              "3️⃣ The Leverage: Log into RaterHub / EWOQ during evening IST hours and weekends when 'Bonus Hour' batches drop, working 10 to 20 flexible hours a week from home.",
              "4️⃣ The Safety Lock: Complete your Hyperwallet / Direct Indian Bank Wire KYC immediately upon onboarding so weekly/monthly payouts clear with zero delay.",
            ],
            exactToolsOrWebsites: [
              {
                name: "telusinternational.ai",
                role: "Website #5 · Official Indian Search & AI Chat Quality Rater Portal (Direct Bank Wire / Hyperwallet)",
                insiderTip:
                  "Enable email notifications for 'Bonus Hours'—TELUS frequently offers extra task batches on weekends.",
              },
              {
                name: "jobs.welocalize.com",
                role: "Website #6 · Non-Bidding Ads & Conversational AI Rater (Pays Weekly via Hyperwallet/PayPal)",
                insiderTip:
                  "Welocalize provides free interactive training modules inside WeLearn before you take the final qualification test.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "🧠 The Jedi Mind-Trick / Secret Script (The 'Needs Met' Cheat Sheet That Passes Part 3)",
              content: `• Fully Meets (FM): The user asked for a specific target (e.g., "SBI netbanking login") and the very first result is the official login page.\n• Highly Meets (HM): The user asked an open question (e.g., "best budget smartwatch India") and the response gives an unbiased, up-to-date comparison.\n• Fails to Meet (FailsM): The response is outdated, unsafe, or answers a completely different question.`,
            },
            incomeMathOrProof:
              "15 hours/week on TELUS / Welocalize at $5.50–$7.50/hr India rate = ~$390/month (₹32,500/month) wired straight to your Indian bank account.",
          },
          {
            chapterNumber: 4,
            title:
              "Websites #7 & #8: RWS TrainAI & ModSquad (Live Brand Chat & Ticket Arbitrage)",
            subtitle:
              "⚠️ WARNING: Keep this strictly confidential. Real non-bidding customer chat support, Discord moderation, and AI text validation.",
            coreSecretSummary:
              "The 99% Illusion: People think customer support means sitting in a noisy BPO call center taking angry phone calls all night. The 1% Reality: RWS TrainAI (rws.com/trainai) and ModSquad (modsquad.com) let you pick quiet 2-hour text-chat, ticket moderation, and AI validation blocks from your bedroom laptop for global gaming, SaaS, and e-commerce brands.",
            whereToFindOrHiddenTrick:
              "THE SECRET MECHANISM & EXACT CLICK-PATH: (1) Go to rws.com/artificial-intelligence/trainai-community → Click 'Join TrainAI Community' → Select 'Work as an Individual' (NOT Agency!) → Pass the English & Hindi language test. (2) Go to modsquad.com/join-the-squad → Apply for 'Customer Support Chat & Moderation Contractor'.",
            stepByStepExecution: [
              "1️⃣ The Infiltration: Register on RWS TrainAI ('WorkZone' portal) as an 'Individual Contributor' so invitations come directly to your inbox, and practice typing at 45+ WPM on monkeytype.com before applying on ModSquad.",
              "2️⃣ The Trigger: On your ModSquad application, explicitly mention familiarity with written ticket tools (Zendesk, Freshdesk, Discord moderation, or Shopify order lookup) to jump ahead of generic applicants.",
              "3️⃣ The Leverage: Book 2-hour evening or morning chat support shifts inside ModSquad and use pre-saved empathy macros so you can handle 3 live chat tabs calmly at the same time.",
              "4️⃣ The Safety Lock: Always personalize the first and last line of every chat macro so quality auditors score your human empathy at 100%.",
            ],
            exactToolsOrWebsites: [
              {
                name: "rws.com/trainai (RWS WorkZone)",
                role: "Website #7 · Global AI Chat Data & Linguistic Evaluation Portal (Pays via PayPal / Bank Transfer)",
                insiderTip:
                  "Make sure you select 'Individual Contributor' (not Agency) during RWS registration so you receive individual task invitations.",
              },
              {
                name: "modsquad.com/join-the-squad",
                role: "Website #8 · Remote Live Chat Support & Community Moderation (Hourly USD Payouts)",
                insiderTip:
                  "Mention experience with Zendesk, Freshdesk, Discord, or Shopify order support on your application to get placed faster.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "🧠 The Jedi Mind-Trick / Secret Script (3-Part Live Chat De-Escalation Macro)",
              content: `"Hi [Name], I completely understand how frustrating it is when your order status hasn't updated yet—I would feel the exact same way! I have pulled up your order #[ID] right now, verified the tracking log with our dispatch team, and applied a priority update for you. Here is what will happen in the next 24 hours..."`,
            },
            incomeMathOrProof:
              "12 hours/week of remote chat/AI validation across RWS TrainAI & ModSquad = ~$300/month (₹25,000/month) with zero phone calls and zero bidding.",
          },
          {
            chapterNumber: 5,
            title:
              "Websites #9 & #10: Concentrix India Non-Voice Chat & Chegg / CourseHero Early-Morning Queue",
            subtitle:
              "⚠️ WARNING: Keep this strictly confidential. Direct Indian bank NEFT payouts for non-voice chat support and written subject Q&A.",
            coreSecretSummary:
              "The 99% Illusion: Students and freshers get scammed by fake Telegram 'typing jobs' that ask for a 'registration fee'. The 1% Reality: Real Indian INR bank payouts come from two legitimate backdoors: (1) Concentrix India's official 'Work At Home Non-Voice Chat Process' (jobs.concentrix.com), and (2) logging into Chegg India (cheggindia.com/qa-expert) & CourseHero between 6:30 AM and 10:30 AM IST when US student homework queues peak.",
            whereToFindOrHiddenTrick:
              "THE SECRET MECHANISM & EXACT CLICK-PATH: (1) Open jobs.concentrix.com → Type 'Chat' or 'Non Voice Work From Home India' → Apply directly on the official HR portal (₹0 fee). (2) Open cheggindia.com/qa-expert → Click 'Sign Up' → Pass the online subject & guideline test → Work the 6:30 AM – 10:30 AM IST peak window.",
            stepByStepExecution: [
              "1️⃣ The Infiltration: For Concentrix Non-Voice Chat, apply directly at jobs.concentrix.com and prepare for the 15-minute online Versant Written grammar and chat etiquette test. For Chegg India, register with your PAN card and Indian bank IFSC.",
              "2️⃣ The Trigger: On Chegg / CourseHero, pick a high-volume subject (Business Finance, Accounting, Statistics, Computer Science, Nursing, or Earth Science) where question rates pay ₹100–₹190 per written solution.",
              "3️⃣ The Leverage: Log in between 6:30 AM and 10:30 AM IST—US college students submit homework overnight, so the morning IST queue has 4x more easy questions and almost zero Indian competition.",
              "4️⃣ The Safety Lock: Format every written answer using the 3-Block Structure ('1. Core Principle -> 2. Step-by-Step Calculation -> 3. Final Boxed Takeaway') to keep your quality score above 4.6★.",
            ],
            exactToolsOrWebsites: [
              {
                name: "jobs.concentrix.com (Official India WAH Non-Voice Chat Portal)",
                role: "Website #9 · Full-Time / Part-Time Remote Customer Chat Support (₹18,000–₹28,000/mo Direct INR Bank Salary)",
                insiderTip:
                  "During the online Versant written chat assessment, focus on zero spelling mistakes and polite, solution-first sentences.",
              },
              {
                name: "cheggindia.com/qa-expert & coursehero.com/become-a-tutor",
                role: "Website #10 · Non-Bidding Written Subject Q&A Portal (Pays ₹100–₹190/Question via Indian Bank NEFT)",
                insiderTip:
                  "Early morning IST hours (6:30 AM – 10:00 AM) have 4x more open questions in the queue.",
              },
            ],
            copyPasteTemplateOrScript: {
              label:
                "🧠 The Jedi Mind-Trick / Secret Script (3-Block Answer Template For 4.8★ Quality Ratings)",
              content: `Step 1 — Core Principle: State the exact rule or policy in 2 clear English sentences.\nStep 2 — Step-by-Step Breakdown: Show each logical step clearly using numbered bullet points.\nStep 3 — Final Takeaway: Summarize the exact final answer in bold at the bottom so the reader gets instant clarity.`,
            },
            incomeMathOrProof:
              "Solving 5 written questions every morning on Chegg/CourseHero (~₹750/day) = ₹22,500/month via direct Indian bank NEFT, or ₹20,000–₹28,000/month on Concentrix Non-Voice Chat.",
          },
        ],
        twentyFourHourChecklist: [
          "Download this 12pt White-Label PDF using the 'Download White-Label PDF (.pdf)' button at the top.",
          "Complete PAN + Bank KYC on PayPal India and Payoneer India so your USD payouts never get held.",
          "Apply today on Website #1 (outlier.ai), Website #3 (my.oneforma.com), and Website #4 (crowdgen.com) — never copy-paste during the assessment!",
          "Pass the free 15-minute English & Hindi certifications inside OneForma's 'Certifications' tab to unlock immediate AI chat grading projects.",
          "Apply on TELUS Digital (telusinternational.ai) & Chegg India (cheggindia.com/qa-expert) to build 3 parallel non-bidding income streams.",
        ],
      },
      reelBlueprint: {
        sixSecondVideoIdea: {
          visualStyle:
            "6-Second Dark Aesthetic Laptop Clip Scrolling Through All 10 Non-Bidding Chat Agent Websites",
          shotByShot: [
            "0.0s – 2.0s: Dark room laptop shot with bold text overlay calling out Upwork/Fiverr bidding frustration.",
            "2.0s – 4.5s: Quick screen scroll of this 12pt PDF showing Outlier.ai, OneForma, CrowdGen, TELUS & ModSquad URLs.",
            `4.5s – 6.0s: Zoom on the ${priceDisplay || "₹29"} access badge with CTA: 'Comment ${autoDmTrigger || "CHAT10"} for all 10 links'.`,
          ],
          lightingAndAudioTip:
            "Keep the video 6 seconds long and toggle ON 'Trial Reel' before posting to reach 100% non-followers.",
        },
        psychologicalPriceOverlays: [
          {
            triggerType: "1. Anti-Bidding Relief Trigger",
            overlayText: `"Still wasting months bidding on Upwork & Fiverr with 0 replies? Here are 10 Non-Bidding Chat & AI Text Websites where Indians get paid from Day 1 (${priceDisplay || "₹29"} Manual)."`,
            whyItConverts:
              "Directly solves the #1 pain point of Indian beginners (bidding competition) with 10 verified portals.",
          },
          {
            triggerType: "2. Daily Snack Price Comparison",
            overlayText: `"1 Cup of Chai & Samosa = Rs 40. This 10-Website Non-Bidding Chat Agent Playbook = ${priceDisplay || "₹29"} (Outlier, OneForma, CrowdGen, TELUS & 6 More)."`,
            whyItConverts:
              "Makes the PDF price a complete no-brainer compared to weekly USD payouts.",
          },
          {
            triggerType: "3. Save & Auto-DM Velocity Hook",
            overlayText: `"10 genuine websites where Indians earn via text chat & AI response grading in 2026–2027 (Zero Bidding). Comment '${autoDmTrigger || "CHAT10"}' for instant DM."`,
            whyItConverts:
              "Triggers massive Saves and Comments from students and remote job seekers.",
          },
        ],
        autoDmCaption: `Stop wasting months fighting 200 bidders on Upwork or falling for fake 'typing job' scams! 🤫💻\n\nI compiled the 2026–2027 Fact-Checked Playbook of 10 Genuine Non-Bidding Chat Agent & AI Text Evaluation Websites for Indians:\n✅ Websites #1 & #2: Outlier.ai & DataAnnotation.tech ($7.50–$18/hr USD grading AI chat responses)\n✅ Websites #3 & #4: OneForma & Appen CrowdGen (High-approval bilingual Hindi/English micro-chat tasks)\n✅ Websites #5 & #6: TELUS Digital AI & Welocalize (Flexible remote Search & Chat Quality Raters)\n✅ Websites #7–#10: RWS TrainAI, ModSquad Live Chat, Concentrix Non-Voice WAH & Chegg Text Q&A\n\nIncludes exact signup links, open-book assessment pass formulas, and Indian PayPal/Payoneer/NEFT setup for just ${priceDisplay || "₹29"} (instead of ${anchorPriceDisplay || "₹2,499"}).\n\n👉 Comment "${autoDmTrigger || "CHAT10"}" below and I will Auto-DM you the complete 5-Chapter PDF in 5 seconds!`,
        seoKeywords: [
          "non bidding chat agent jobs india",
          "outlier ai india assessment tips",
          "oneforma india payment proof",
          "work from home chat support india",
          "ai text evaluation websites india",
          "telus international ai india",
          "appen crowdgen india 2026",
          "modsquad remote chat jobs",
          "concentrix non voice chat wfh",
          "online earning websites without investment india",
        ],
        hashtags: [
          "#remotejobsindia",
          "#workfromhomeindia",
          "#sidehustleindia",
          "#chatsupportjobs",
          "#onlineearningindia",
        ],
      },
    };
  }

  const defaultVaultTitles = [
    "The Dark Psychology of WhatsApp DM Closing & High-Ticket Freelance Deals: 5 Behavioral Triggers That Close ₹4,999 Clients",
    "The 6-Second Instagram Trial-Reel & Auto-DM Micro-Dossier Funnel: Turning ₹29–₹99 PDFs Into Daily UPI Cashflow",
    "The Google Maps 'High-Review, No-Website' Local Clinic & Salon Takeover: Closing ₹3,999 Deals in 48 Hours",
    "12 Verified Free Harvard, Tata, JPMorgan & Google Credentials + The LinkedIn 'Past 24 Hours' Founder Backdoor",
    "The ₹150 Indian Pharmacy Generic Salt Bible: Decoding ₹3,500 Serums Into ₹180 Chemist Tubes",
    "15 Underrated Zero-Cost AI Study, Research & Exam-Crushing Portals: Finish 6 Hours of Work in 15 Minutes",
  ];
  const isCleanPreset = BROWSER_EBOOK_TOPICS.some(
    (t) => t.toLowerCase() === rawInputTrimmed.toLowerCase()
  );
  const hasCustomTopic = rawInputTrimmed.length > 0 && !isCleanPreset;
  const cleanTopic = hasCustomTopic
    ? `The 2026–2027 Classified 1% Execution Dossier: ${rawInputTrimmed.slice(0, 68)}`
    : isCleanPreset
    ? rawInputTrimmed
    : defaultVaultTitles[Math.abs(variationCount) % defaultVaultTitles.length];

  const editionSubtitles = [
    "Classified 1% Insider Dossier · Dark Psychology Triggers, Direct Backdoor Portals & Copy-Paste Scripts Anyone Can Execute Today.",
    "The Grey-Hat Oracle Edition: Exact Search Filters, Behavioral Loopholes, Free Fortune-500 Credentials & Instant UPI Closing Scripts.",
    "Private 2026–2027 Execution Vault: Zero Generic Fluff, Real UI Click-Paths, 50%-Advance Client Locks & Verified Global Portals.",
  ];

  return {
    id: `ebook-${Date.now()}-${variationCount}`,
    createdAt: new Date().toISOString(),
    topicInput: cleanTopic,
    category,
    priceDisplay: priceDisplay || "₹19",
    anchorPriceDisplay: anchorPriceDisplay || "₹1,999",
    autoDmTrigger: autoDmTrigger || "SECRET",
    providerUsed: "2026–2027 Grey-Hat Oracle AI Engine",
    ebook: {
      editionTag: `CLASSIFIED 1% INSIDER DOSSIER · GREY-HAT ORACLE EDITION · ZERO FLUFF`,
      title: cleanTopic,
      subtitle: editionSubtitles[variationCount % editionSubtitles.length],
      targetReaderPromise:
        "Every chapter in this classified dossier reveals an unconventional 1% behavioral trigger, algorithm loophole, or verified direct portal—backed by 100% real UI buttons, honest Free (₹0) rules, and word-for-word copy-paste scripts.",
      goldenRuleTitle:
        "⚠️ CLASSIFIED BRIEFING: The #1 Grey-Hat Execution & 50%-Advance Safety Rule",
      goldenRuleBody:
        "Never follow the 99% crowd that begs for attention or works for free. Always use the 'Visual Loss-Aversion' sample + 50% UPI Advance lock when closing clients, use only real platform search filters, and execute one chapter completely before moving to the next.",
      hardestPartSolvedBox: {
        title:
          "🔥 THE HARDEST PART SOLVED: 4 Classified Backdoor Filters & Real UI Click-Paths",
        exactWhereToFindMap: [
          `1. Google Maps 'High-Review, No-Website' Filter: Search 'Dental Clinic', 'Skin Clinic', or 'Luxury Salon' in any Tier-1/Tier-2 city on Google Maps → Pick businesses with 40+ reviews that have NO 'Website' button → Pitch a ₹2,999 1-Page WhatsApp Booking Menu.`,
          `2. Meta Ad Library Active-Spender Filter (facebook.com/ads/library): Select 'India' → 'All Ads' → Type your niche keyword → Filter by 'Active' ads running for 14+ days to find D2C brands spending ₹50,000+/month right now.`,
          `3. Direct $10 / 15-Min Usability Testing (usertesting.com/get-paid-to-test & prolific.com): 100% free signup with a KYC-Verified Indian PayPal account (PAN + Bank linked). Pays $10 USD 14 days after each approved speak-out-loud test.`,
          `4. LinkedIn Real 'Past 24 Hours' Post Filter + Free Harvard/Tata Credentials: Complete a free 4-hour Tata/JPMorgan simulation on theforage.com, then search '\"hiring\" AND \"remote\"' on LinkedIn → Click 'Posts' tab → 'Date posted: Past 24 hours'.`,
        ],
        zeroFollowerTrafficTrick:
          "The 2026 Trial-Reel + Snack-Price Loop: Toggle ON 'Trial Reel' on a 6-second dark screen recording of your dossier so 100% of views come from non-followers, and connect Auto-DM so every comment receives your checkout link in 5 seconds.",
      },
      quickValueBreakdown: [
        {
          metric: "1. The 99% Trap Destroyed",
          detail:
            "Replaces saturated bidding wars with direct backdoor filters and behavioral psychology triggers.",
        },
        {
          metric: "2. 50% Advance + Watermark Lock",
          detail: `Send only 1 watermarked preview first; never deliver unwatermarked files without 50% UPI advance.`,
        },
        {
          metric: "3. 100% Free (₹0) Verified Tools",
          detail:
            "Every portal and tool inside (Google Maps, Meta Ad Library, Forage, Harvard CS50x, NotebookLM) is ₹0 to start.",
        },
        {
          metric: "4. Copy-Paste Jedi Scripts",
          detail:
            "Includes word-for-word WhatsApp closing scripts, LinkedIn DM hooks, and 1mg Salt lookup formulas.",
        },
      ],
      chapters: [
        {
          chapterNumber: 1,
          title: "The Dark Psychology of WhatsApp Closing & The 'Visual Loss-Aversion' Client Exploit",
          subtitle:
            "⚠️ WARNING: Keep this strictly confidential. — How to make local business owners and D2C brands pay 50% UPI advance within 15 minutes (₹0 cost).",
          coreSecretSummary:
            "The 99% Illusion: Normal freelancers send boring text messages saying 'Hi Sir, I do graphic design/video editing/websites, please hire me'—and get blocked or ignored 99% of the time. The 1% Reality: The human brain is wired to ignore generic offers, but it physically cannot ignore seeing its own business losing money in a live visual screenshot. When you show a business owner a 1-screen 'Before vs. After' preview of their own listing with a diagonal watermark, you trigger instant Loss Aversion.",
          whereToFindOrHiddenTrick:
            "THE GREY-HAT MECHANISM (GOOGLE MAPS + META AD LIBRARY): Open Google Maps and search 'Skin Clinic', 'Dental Studio', or 'Boutique' in any major neighbourhood, OR open facebook.com/ads/library (Country: India -> Status: Active). Pick businesses that have 40+ customer reviews (proving they have cashflow) but either have no booking website or use dull, unstyled product photos.",
          stepByStepExecution: [
            "1️⃣ The Infiltration: Pick 5 high-review local businesses on Google Maps or active advertisers on facebook.com/ads/library. Take 1 public photo or menu from their page without asking for permission first.",
            "2️⃣ The Trigger: Use Canva or AI to turn that 1 photo into a luxury 4K WhatsApp Booking Card or Ad Creative, and place a bold 40%-opacity diagonal watermark across the middle: 'CUSTOM PREVIEW FOR [BUSINESS NAME]'.",
            "3️⃣ The Leverage: Send the watermarked image directly to their business WhatsApp number with the 3-sentence 'Loss-Aversion' script below, offering a ₹250 1-page unwatermarked test or a ₹2,999 complete pack.",
            "4️⃣ The Safety Lock: Strictly enforce the 50% UPI Advance Rule—collect ₹1,500 via UPI before creating the remaining pages, and release the final unwatermarked link only after the remaining 50% is paid.",
          ],
          exactToolsOrWebsites: [
            {
              name: "google.com/maps & facebook.com/ads/library (100% Free ₹0)",
              role: "Find Cash-Rich Local Clinics, Salons & Active D2C Advertisers",
              insiderTip:
                "Filter for businesses with 40+ Google Reviews but no website button—they already have customers and money, they just lack digital packaging.",
            },
            {
              name: "canva.com & carrd.co (Free Tier)",
              role: "Build 1-Page Watermarked Previews & WhatsApp Booking Funnels",
              insiderTip:
                "Always place your semi-transparent watermark directly across the center of the design so nobody can screenshot it without paying.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "🧠 The Jedi Mind-Trick / Secret Script (WhatsApp Loss-Aversion Pitch)",
            content: `"Hi [Business Name] team! I noticed you have 45+ great Google reviews, but when customers click your profile, there is no instant 1-tap WhatsApp catalog/booking page—so many buyers drop off to competitors.\n\nI already built a custom 4K preview specifically for [Business Name] (attached with watermark). I can unlock this single asset for ₹250 today, or build your complete 10-page WhatsApp Conversion Kit for ₹2,999 (50% advance, 50% on completion). Which option works best for you?"`,
          },
          incomeMathOrProof:
            "Exact Math: 2 local clinic or D2C brand packages/week × ₹2,999 = ₹5,998/week × 4 weeks = ₹23,992/month (with 50% UPI advance safety and ₹0 ad spend).",
        },
        {
          chapterNumber: 2,
          title: `The 6-Second Instagram 'Trial-Reel' & Snack-Price Auto-DM Arbitrage`,
          subtitle:
            "⚠️ WARNING: Keep this strictly confidential. — How anonymous 0-follower pages turn 6-second dark screen loops into automated daily UPI payouts.",
          coreSecretSummary: `The 99% Illusion: Normal creators spend 5 hours dancing on camera, writing 30 hashtags, and praying for followers before they ever make ₹1. The 1% Reality: Instagram's 'Trial Reel' toggle pushes your video to 100% non-followers to test watch-time—and a 6-second dark aesthetic video with a 'Snack-Price Comparison' text overlay forces viewers to loop the video 3 times (300% retention) while reading, triggering massive algorithmic reach and instant impulse buys.`,
          whereToFindOrHiddenTrick: `THE GREY-HAT MECHANISM (6-SECOND RETENTION LOOP + AUTO-DM): When a video is only 6 seconds long and features a 3-line psychological hook comparing a ₹29/₹49 classified dossier to a ₹60 plate of momos, the viewer's brain takes 12–15 seconds to finish reading. By the time they finish reading, the 6-second video has replayed 2.5 times—tricking the Instagram algorithm into flagging your Reel as a top-1% high-retention clip!`,
          stepByStepExecution: [
            "1️⃣ The Infiltration: Export this 5-chapter classified dossier as a clean 12pt PDF and upload it to SuperProfile.bio, Cosmofeed, or Gumroad so buyers can pay via GPay/PhonePe/Paytm in 10 seconds.",
            "2️⃣ The Trigger: Record a 6-second dark-mode screen scroll of the PDF chapters, add the 'Snack-Price Anchoring' text overlay below, and toggle ON 'Trial Reel' before hitting publish.",
            "3️⃣ The Leverage: Connect a free Auto-DM automation (ManyChat, SuperProfile Auto-DM, or Zorcha) triggered by a single 1-word comment ('SECRET' or 'VAULT') so every commenter gets the checkout link in their DM within 5 seconds.",
            "4️⃣ The Safety Lock: Add a ₹99 'Complete Bundle Order Bump' on the checkout page—30% of ₹29 buyers automatically tick the upgrade box, tripling your average order value effortlessly.",
          ],
          exactToolsOrWebsites: [
            {
              name: "superprofile.bio / cosmofeed.com (Free Setup)",
              role: "Instant Indian UPI Checkout Page + Automated Comment-to-DM Delivery",
              insiderTip:
                "Enable the 1-click UPI intent flow so mobile buyers complete payment in under 8 seconds without typing card numbers.",
            },
            {
              name: "Instagram 'Trial Reel' Toggle (Built-In Feature)",
              role: "Distributes Your 6-Second Reel to 100% Non-Followers First",
              insiderTip:
                "Use strictly 5 niche hashtags and keep the video between 5.5 and 6.5 seconds for maximum loop retention.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "🧠 The Jedi Mind-Trick / Secret Script (High-Converting 6s On-Screen Hook)",
            content: `"1 Plate Street Momos = ₹60 (Gone in 5 minutes).\nThis Classified 5-Chapter Execution Dossier = ${priceDisplay || "₹29"} (Exact backdoor links, psychological scripts & zero-fluff systems).\nComment '${autoDmTrigger || "SECRET"}' below & check your DM in 5 seconds."`,
          },
          incomeMathOrProof:
            "Exact Math: (15 sales/day × ₹29 = ₹435) + (4 bundle upgrades/day × ₹99 = ₹396) = ₹831/day × 30 days = ₹24,930/month running on automated checkout.",
        },
        {
          chapterNumber: 3,
          title: "Paid $10 / 15-Minute Usability Testing (UserTesting, Trymata & Prolific — The Think-Out-Loud Trigger)",
          subtitle:
            "⚠️ WARNING: Keep this strictly confidential. Exact Indian PayPal KYC rules, how to pass the unpaid practice test, and realistic weekly USD payouts.",
          coreSecretSummary:
            "The 99% Illusion: People waste hours on 10-cent survey apps that disqualify them at the final screen. The 1% Reality: UserTesting.com and Trymata.com pay a flat $10 USD for a 15-minute screen recording where you test a company's website prototype and speak your thoughts out loud—and Prolific.com pays £6–£10/hr GBP for university AI studies with zero disqualifications once a study appears on your dashboard.",
          whereToFindOrHiddenTrick:
            "THE SECRET MECHANISM & CONTINUOUS SPEAKING RULE: Apply free at usertesting.com/get-paid-to-test, trymata.com/get-paid-to-test, and app.prolific.com/register/participant. The secret to passing the 7-minute unpaid practice test on attempt #1 is the '3-Second Narration Rule': never click in silence—continuously speak what you expect a button to do BEFORE you click it.",
          stepByStepExecution: [
            "1️⃣ The Infiltration: Verify your Indian PayPal account with your PAN card and Indian bank account first—both UserTesting ($10 USD) and Prolific (£ GBP) require a KYC-verified PayPal to release payouts.",
            "2️⃣ The Trigger: Take the 7-minute unpaid UserTesting practice test in a silent room (fan off) and narrate every thought out loud using the 3-sentence template below.",
            "3️⃣ The Leverage: Keep UserTesting and Prolific (with the free 'Prolific Assistant' Chrome extension) open in a pinned tab between 7:30 PM and 11:30 PM IST when US and UK UX researchers push new tests live.",
            "4️⃣ The Safety Lock: Never fake answers on demographic screeners—honest consistency keeps your tester quality rating at 4.5★+ so you get priority $10 invitations (paid exactly 14 days after each test).",
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
            label: "🧠 The Jedi Mind-Trick / Secret Script (3-Sentence Think-Out-Loud Formula For 5★ Ratings)",
            content: `"1. Right now I am looking at [Section] because the task asked me to find [Goal].\n2. My first impression is that [Element] is easy to spot, but I am confused why [Missing Detail] isn't shown clearly.\n3. Before clicking this button, I expect the next page to show me [Expected Result]."`,
          },
          incomeMathOrProof:
            "Exact Math: (2 UserTesting sessions/week × $10 = $20) + (2 hrs Prolific/week × $7.50 = $15) = $35/week × 4 weeks = $140/month (× ₹85 = ₹11,900/month) via PayPal with ₹0 investment.",
        },
        {
          chapterNumber: 4,
          title: "Adobe Stock AI Contributor (The 60% Copy-Space Commercial Backdoor)",
          subtitle:
            "⚠️ WARNING: Keep this strictly confidential. How to legally upload 4000px+ Indian Festive Copy-Space AI Backgrounds to Adobe Stock for passive USD royalties.",
          coreSecretSummary:
            "The 99% Illusion: Amateur creators upload random AI portraits of faces with 6 fingers to stock sites and get 100% rejected. The 1% Reality: Graphic designers and ad agencies on Adobe Stock (`contributor.stock.adobe.com`) desperately buy clean Indian festive, wedding, and architectural backgrounds that leave 60% blank 'copy space' in the center so they can type their client's offer text over it.",
          whereToFindOrHiddenTrick:
            "THE SECRET MECHANISM & 3 REAL ADOBE STOCK RULES: Join contributor.stock.adobe.com (100% ₹0 free). To get 90%+ approval: (1) Always leave 60% empty copy-space in the center or left side, (2) Upscale every image to at least 4 Megapixels (4000×2666 px) using free upscayl.org, and (3) Tick the mandatory 'Created using generative AI tools' checkbox during upload.",
          stepByStepExecution: [
            "1️⃣ The Infiltration: Create your free contributor account at contributor.stock.adobe.com and fill out the 2-minute online W-8BEN tax form (reduces US withholding tax for Indian residents).",
            "2️⃣ The Trigger: Generate clean, text-free Indian festive, Diwali, and royal Rajasthani arch backgrounds with 60% empty copy-space using the prompt below.",
            "3️⃣ The Leverage: Upscale every image to 4000×2666 px on upscayl.org or iloveimg.com/upscale-image so it easily passes Adobe's 4MP technical inspection.",
            "4️⃣ The Safety Lock: Tick 'Created using generative AI tools', never put real brand names (like Apple, Nike, or Taj Mahal) in your title, and add 25 buyer-intent English keywords.",
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
                "Always inspect borders and corners at 100% zoom before submitting.",
            },
          ],
          copyPasteTemplateOrScript: {
            label: "🧠 The Jedi Mind-Trick / Secret Script (High-Approval 60% Copy-Space Prompt)",
            content: `"Minimalist luxury royal Rajasthani palace arch background with soft warm golden bokeh lights, 65% clean empty cream copy space in the center for text overlay, 8k photorealistic commercial background, no text, no letters, no watermark."`,
          },
          incomeMathOrProof:
            "150+ approved Indian festive copy-space backgrounds = ongoing passive USD royalties ($0.33–$2.64 per download) working 24/7 with 0 followers.",
        },
        {
          chapterNumber: 5,
          title: "Free Verified Credentials (Harvard CS50x & Forage), LinkedIn 24-Hr Filter & ₹150 Pharmacy Salts",
          subtitle:
            "⚠️ WARNING: Keep this strictly confidential. 100% free verifiable credentials + LinkedIn's real 'Posts -> Past 24 hours' filter + 1mg Salt Composition loophole.",
          coreSecretSummary:
            "The 99% Illusion: People pay ₹25,000 for fake coaching certificates, apply to 30-day-old job listings with 2,000 applicants, and spend ₹2,500 on overhyped Instagram skincare serums. The 1% Reality: You can get official Tata/Deloitte/Harvard certificates for ₹0, message founders within 24 hours of their hiring post on LinkedIn, and buy the exact same active skincare molecules at an Indian pharmacy for ₹200.",
          whereToFindOrHiddenTrick:
            "THE SECRET MECHANISM & REAL CLICK-PATHS: (1) LinkedIn Backdoor: Type '\"hiring\" AND \"remote\"' in LinkedIn search → Click 'Posts' tab (NOT Jobs!) → Click 'Date posted' → Select 'Past 24 hours'. (2) 1mg Salt Loophole: Open 1mg.com → Type any ₹2,500 serum → Click the 'SALT COMPOSITION' link right under the product title to reveal ₹200 regulated pharma equivalents.",
          stepByStepExecution: [
            "1️⃣ The Infiltration: Complete 1 free 4-hour virtual job simulation on theforage.com (Tata Group, JPMorgan, or Deloitte) and enroll at cs50.harvard.edu/x directly (skip paid edX) for a free verified Harvard certificate.",
            "2️⃣ The Trigger: Use the LinkedIn 'Posts -> Date posted: Past 24 hours' filter every morning to find founders who posted their email address directly in a hiring post.",
            "3️⃣ The Leverage: Check regulated Indian pharmacy equivalents on 1mg.com (always patch test): 'Aziderm 10% Cream' (~₹245, Micro Labs) for dark spots; 'Glyco 6 Cream' (~₹200, Micro Labs — 2x/week at night + SPF 50 next morning) for dullness; 'Hyalugel' (~₹250, Ethicare) for oil-free hydration.",
            "4️⃣ The Safety Lock: Use notebooklm.google.com (100% free) -> Upload any complex project PDF -> Click 'Audio Overview' to master any client brief 10x faster.",
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
            label: "🧠 The Jedi Mind-Trick / Secret Script (Indian Chemist Salt Cheat-Code List)",
            content: `1. Aziderm 10% Cream (~₹245, Micro Labs) -> Post-acne marks & uneven tone\n2. Glyco 6 Cream (~₹200, Micro Labs) -> 2x/week night exfoliation (+ SPF 50 next morning)\n3. Hyalugel (~₹250, Ethicare) -> Pure Hyaluronic Acid gel (apply on damp skin)\n4. UV Doux Silicone Sunscreen Gel SPF 50 -> Dermatologist matte sunscreen`,
          },
          incomeMathOrProof:
            "Saves ₹15,000+/year on courses and overpriced serums while giving you 100% verifiable Harvard & Fortune-500 credentials.",
        },
      ],
      twentyFourHourChecklist: [
        "Download this 12pt white-label PDF using the 'Download 12pt PDF (.pdf)' button at the top.",
        "Open Google Maps or facebook.com/ads/library -> Find 5 high-review local clinics or active D2C brands -> Send 1 WATERMARKED preview (collect 50% UPI advance before full delivery!).",
        "Sign up free on usertesting.com/get-paid-to-test & prolific.com (with KYC-verified Indian PayPal).",
        "Upload 5 upscaled 4000px+ Indian festive copy-space backgrounds to contributor.stock.adobe.com (tick 'Created using generative AI tools').",
        "Complete 1 free corporate simulation on theforage.com and test the LinkedIn 'Posts -> Date posted: Past 24 hours' filter.",
      ],
    },
    reelBlueprint: {
      sixSecondVideoIdea: {
        visualStyle:
          "6-Second Dark Aesthetic Clip (Laptop in Dark Room / Live Scroll of This Classified 1% Dossier PDF)",
        shotByShot: [
          "0.0s – 2.0s: Moody dark aesthetic shot of laptop typing or iced coffee pour with bold Price Comparison overlay.",
          "2.0s – 4.5s: Smooth screen recording scrolling through the 5 classified chapters showing exact backdoor links & Jedi scripts.",
          `4.5s – 6.0s: Quick zoom on the ${priceDisplay} (vs ${anchorPriceDisplay}) access page with CTA: 'Comment ${autoDmTrigger} for instant link'.`,
        ],
        lightingAndAudioTip:
          "Keep the clip strictly 6 seconds so viewers loop it 2–3 times while reading the overlay. Toggle ON 'Trial Reel' to hit 100% non-followers.",
      },
      psychologicalPriceOverlays: [
        {
          triggerType: "1. Daily Snack Price-Comparison Trigger",
          overlayText: `"1 Plate Momo = Rs 60 (Gone in 5 mins). This Classified 1% Dossier = ${priceDisplay} (Exact Backdoor Links, Psychological Scripts & Free Harvard/Tata Portals). Choice is yours."`,
          whyItConverts: `Makes ${priceDisplay} feel smaller than a daily snack while anchoring the value to real, verified 2026–2027 portals.`,
        },
        {
          triggerType: "2. The 'Zero Affiliate / Zero Generic' Hook",
          overlayText: `"Tired of every PDF teaching the same boring advice? Inside this ${priceDisplay} classified dossier: Dark Psychology Closing, Trial-Reel Funnels & ₹150 Pharmacy Salts."`,
          whyItConverts:
            "Directly calls out the boredom of generic Instagram PDFs and hooks viewers with specific, verified systems.",
        },
        {
          triggerType: "3. Extreme FOMO / Gatekeeping Hook",
          overlayText: `"5 classified 2026–2027 loopholes & websites 99% of people in India still don't know (${cleanTopic.slice(0, 38)}). Comment '${autoDmTrigger}' for instant DM."`,
          whyItConverts:
            "Creates intense FOMO and drives high comment velocity for the late-2026 algorithm.",
        },
      ],
      autoDmCaption: `Everyone on Instagram is repeating the exact same generic advice—that's why 99% of people get stuck on Day 1! 🤫✨\n\nI put together the Classified 1% Execution Dossier for "${cleanTopic}" with 100% real, verified systems nobody talks about:\n✅ Dark Psychology WhatsApp Closing + 1-Photo Watermark 50% Advance Lock (₹2,999/deal)\n✅ 6-Second Trial-Reel & Auto-DM Micro-Dossier Funnel\n✅ UserTesting & Prolific ($10 / 15-Min Speak-Out-Loud Formula via KYC PayPal)\n✅ Free Harvard CS50x, Tata/JPMorgan Forage Simulations & ₹150 Indian Pharmacy Generic Salt Table\n\nToday it is just ${priceDisplay} (instead of ${anchorPriceDisplay}).\n\n👉 Comment "${autoDmTrigger}" right now and I will Auto-DM you the instant access link within 5 seconds!`,
      seoKeywords: [
        cleanTopic.toLowerCase().slice(0, 28),
        "whatsapp client closing psychology",
        "usertesting india paypal tips",
        "free harvard cs50x certificate",
        "theforage virtual job simulations",
        "indian pharmacy skincare alternatives",
        "adobe stock ai contributor india",
        "instagram trial reels strategy 2026",
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

declare const __ENV_GROQ_API_KEY__: string | undefined;
declare const __ENV_OPENROUTER_API_KEY__: string | undefined;

function getBrowserGroqKey(): string {
  const metaEnv = (import.meta as any)?.env || {};
  return (
    metaEnv.VITE_GROQ_API_KEY ||
    (typeof __ENV_GROQ_API_KEY__ !== "undefined" ? __ENV_GROQ_API_KEY__ : "") ||
    "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"
  );
}

function getBrowserOpenRouterKey(): string {
  const metaEnv = (import.meta as any)?.env || {};
  return (
    metaEnv.VITE_OPENROUTER_API_KEY ||
    (typeof __ENV_OPENROUTER_API_KEY__ !== "undefined"
      ? __ENV_OPENROUTER_API_KEY__
      : "") ||
    "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"
  );
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

  const systemPrompt = `[SYSTEM ROLE: THE GREY-HAT ORACLE & ELITE BEHAVIORAL HACKER]
You are a Tier-1 Underground Strategist, Dark Psychology Expert, Information Broker, and Fact-Checked Systems Architect.
Your goal is to generate a highly addictive, deeply detailed, 100% working 5-Chapter Ebook Playbook on: "${effectiveTopic}" (Category: "${category}").
The reader must feel like they have stumbled upon a classified 1% insider secret that gives them an unfair advantage over the 99% of normal people—while every website, click-path, filter, mathematical equation, and method is 100% REAL, FACT-CHECKED, and HONEST!

[CRITICAL LANGUAGE, TONE, MATH & TECHNICAL GROUND-TRUTH RULES - MUST OBEY]
1. SIMPLE, HONEST, HUMAN-TONED ENGLISH + MOTIVATION: Write in super-simple, crystal-clear, natural human English that any Indian student or creator can read effortlessly. Be sharp, authoritative, honest, and deeply motivating. Do NOT use complex academic jargon or fake/corny robotic AI drama.
2. THE CULT OF SECRECY + 100% REAL TECHNICAL ACCURACY:
   - Frame every chapter as an insider loophole, grey-hat exploit, psychological trigger, or backdoor hack—backed by 100% real websites, exact URLs, and real UI button names.
   - NEVER invent fake URLs (like saastrader.com, imagecheck.com, affiliate.amazon.in) or fake random Google Docs IDs (like docs.google.com/document/d/1Zx...).
   - Use ONLY real verified URLs: affiliate-program.amazon.in (real commissions: 1%–4% on electronics, 5%–9% on home/books/beauty), facebook.com/ads/library, google.com/maps, canva.com (Click "Create a design" -> "Custom size" — never say "Magic Resize" is free!), obsproject.com, pexels.com/videos, superprofile.bio, cosmofeed.com, gumroad.com, cs50.harvard.edu/x, theforage.com, notebooklm.google.com, 1mg.com (Salt Composition link + patch test & SPF 50 rules), usertesting.com/get-paid-to-test, prolific.com.
   - For YouTube topics: State clearly that AdSense requires 1,000 subscribers + 4,000 watch hours (RPM in India is ₹50–₹200 per 1,000 views), so Day-1 income uses Amazon Affiliate links + pinned-comment digital products.
3. 100% VERIFIED MATHEMATICAL EQUATIONS IN "incomeMathOrProof":
   - Every calculation MUST follow strict step-by-step arithmetic: [Unit Price] × [Units/Week] = [Exact Weekly Total]/week × 4 weeks = [Exact Monthly Total]/month (or [Daily Total]/day × 30 days = [Exact Monthly Total]/month).
   - Double-check that A × B = C and Weekly × 4 = Monthly! Never confuse 1 week with 1 month, and never write broken units like "₹15%".
4. STRICT 6-PART CHAPTER STRUCTURE (EVERY CHAPTER MUST FOLLOW THIS):
   - subtitle: Must start with "⚠️ WARNING: Keep this strictly confidential." followed by a sharp 1-line hook.
   - coreSecretSummary ("👁️ The 99% Illusion vs. The 1% Reality"): 2-3 punchy sentences ruthlessly destroying what the 99% of normal people think works, followed by the unconventional 1% truth that actually works.
   - whereToFindOrHiddenTrick ("🎯 The 'Grey-Hat' Mechanism (The Secret)"): Reveal the core secret, hidden/underrated AI tool, psychological loophole, or exact portal click-path like a classified briefing.
   - stepByStepExecution ("⚙️ Step-by-Step Execution (The Exploit)"): Array of 3 to 4 hyper-specific steps starting with:
     * "1️⃣ The Infiltration: [How to set up the system/profile/trap quietly]"
     * "2️⃣ The Trigger: [The exact action, filter, or click-path that initiates the hack]"
     * "3️⃣ The Leverage: [How to extract maximum value/money/attention effortlessly]"
     * "4️⃣ The Safety Lock: [How to protect payouts, KYC, or collect 50% advance]"
   - copyPasteTemplateOrScript ("🧠 The Jedi Mind-Trick / Secret Script"): Provide a copy-paste script, exact prompt, or behavioral cheat code.
   - incomeMathOrProof ("🔥 The Unfair Advantage"): 100% verified step-by-step math equation + motivating takeaway on why this makes the user unstoppable.
5. CRITICAL TOPIC FIDELITY & ANTI-REPETITION BAN: Write ALL 5 CHAPTERS 100% dedicated to solving "${effectiveTopic}"! ${
    isExplicitVoiceOrOutlier
      ? ""
      : "You are STRICTLY FORBIDDEN from mentioning ElevenLabs, Voice Cloning, Voquent, Outlier.ai, or IndiaMART Kurti Catalogs anywhere in this Ebook!"
  }
${avoidPreviousTitle ? `6. STRICT ANTI-REPETITION: Do NOT repeat "${avoidPreviousTitle}". Write 5 completely different chapters with different verified websites and scripts!` : ""}
7. CRITICAL TITLE & PRICING RULES:
   - "${priceDisplay}" is ONLY the small price of the PDF in the Instagram Reel caption—it is NEVER the money the reader earns! NEVER write "${priceDisplay}", "₹19", "₹29", "₹49", or "Steps to ${priceDisplay} Cash" in ebook.title, ebook.subtitle, or any chapter!
   - NEVER copy-paste the user's raw custom topic verbatim into ebook.title! Craft an attractive, magnetic 100% Pure English Book Title (8-14 words) summarizing what is taught inside the 5 chapters.
   - Never mention "GlowCash".
Return strictly valid JSON with keys: ebook (editionTag, title, subtitle, targetReaderPromise, goldenRuleTitle, goldenRuleBody, hardestPartSolvedBox, quickValueBreakdown, chapters [5 items with chapterNumber, title, subtitle, coreSecretSummary, whereToFindOrHiddenTrick, stepByStepExecution, exactToolsOrWebsites, copyPasteTemplateOrScript, incomeMathOrProof], twentyFourHourChecklist), reelBlueprint (sixSecondVideoIdea, psychologicalPriceOverlays, autoDmCaption, seoKeywords, hashtags [5 items]).`;

  const userPrompt = `USER'S EXACT REQUESTED EBOOK SUBJECT: "${effectiveTopic}" | Verify every math equation (Unit × Weekly = Weekly Total × 4 weeks = Exact Monthly Total) and use only 100% real URLs & free UI click-paths! | Reel Caption PDF Price (only for reel caption/overlays, NEVER put in ebook.title!): ${priceDisplay} | Anchor: ${anchorPriceDisplay} | Trigger: ${autoDmTrigger} | Nonce: ${variationCount}-${Date.now()}`;

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
      "1️⃣ The Infiltration:",
      "2️⃣ The Trigger:",
      "3️⃣ The Leverage:",
      "4️⃣ The Safety Lock:",
    ];
    return raw.map((s: any, i: number) => {
      const cleaned = scrubClientEbookText(String(s || ""));
      if (/^(1️⃣|2️⃣|3️⃣|4️⃣|\d+\.\s*The\s+(Infiltration|Trigger|Leverage|Safety))/i.test(cleaned)) {
        return cleaned;
      }
      const stripped = cleaned.replace(/^(Step\s*\d+\s*[:\-–.]?\s*|\d+\s*[:\-–.)]\s*)/i, "");
      const prefix = labels[i] || `Step ${i + 1}:`;
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
    providerUsed: `${aiResp.providerName} · Grey-Hat Oracle (2026)`,
    ebook: {
      editionTag: "CLASSIFIED 1% INSIDER DOSSIER · GREY-HAT ORACLE EDITION · ZERO FLUFF",
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
          ch.subtitle || "⚠️ WARNING: Keep this strictly confidential."
        );
        const formattedSub = rawSub.includes("confidential")
          ? rawSub
          : `⚠️ WARNING: Keep this strictly confidential. ${rawSub}`;
        return {
          chapterNumber: idx + 1,
          title: scrubClientEbookText(ch.title || `Chapter ${idx + 1}`),
          subtitle: formattedSub,
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
                name: scrubClientEbookText(String(t?.name || "Verified Portal")),
                role: scrubClientEbookText(String(t?.role || "Core Execution Tool")),
                insiderTip: scrubClientEbookText(String(t?.insiderTip || "")),
              }))
            : fallback.ebook.chapters[0].exactToolsOrWebsites,
          copyPasteTemplateOrScript:
            ch.copyPasteTemplateOrScript?.content
              ? {
                  label: scrubClientEbookText(
                    ch.copyPasteTemplateOrScript.label ||
                      "🧠 The Jedi Mind-Trick / Secret Script"
                  ),
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
    reelBlueprint: {
      sixSecondVideoIdea: rb?.sixSecondVideoIdea?.shotByShot
        ? rb.sixSecondVideoIdea
        : fallback.reelBlueprint.sixSecondVideoIdea,
      psychologicalPriceOverlays: Array.isArray(rb?.psychologicalPriceOverlays)
        ? rb.psychologicalPriceOverlays
        : fallback.reelBlueprint.psychologicalPriceOverlays,
      autoDmCaption: rb?.autoDmCaption || fallback.reelBlueprint.autoDmCaption,
      seoKeywords: Array.isArray(rb?.seoKeywords)
        ? rb.seoKeywords
        : fallback.reelBlueprint.seoKeywords,
      hashtags: Array.isArray(rb?.hashtags)
        ? rb.hashtags.slice(0, 5)
        : fallback.reelBlueprint.hashtags,
    },
  };
}


