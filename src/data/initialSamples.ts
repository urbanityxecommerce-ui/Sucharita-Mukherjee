import {
  ReelGenerationResult,
  EbookGenerationResult,
  buildMasterPrompts,
  SearchTermItem,
  BACKGROUND_PRESETS,
  getRealTimeDailyStylingContext,
} from "./playbookData";

const dailyContext = getRealTimeDailyStylingContext(0);

const INITIAL_OUTFITS: SearchTermItem[] = [
  {
    itemLabel: "Piece 1 · Upper-Body Hero Top (Collarbone & Waist Focus)",
    exactKeyword:
      "Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti",
    backupSearchKeywords: [
      "Maroon square neck embroidered short kurti women",
      "Burgundy puff sleeve fitted cotton short kurta",
    ],
    howToCombineAndStyle:
      "Chest aur waist par exact fitting wala size pehno taaki square neck aapke collarbone ko clean dikhaye. Flared jeans ke saath loose kurti mat pehenna.",
    priceFilter: "Under ₹349 · Rating 4.2★ · 240+ Real Customer Photos",
    fabricAndFitCheck:
      "Meesho customer review photos mein check karo ki cotton-rayon kapda thick ho (bilkul see-through na ho).",
    platform: "Meesho",
  },
  {
    itemLabel: "Piece 2 · Leg-Lengthening Bottom (5'0\" Height Illusion Base)",
    exactKeyword: "Women Black High Waist Stretchable Flared Bootcut Jeans",
    backupSearchKeywords: [
      "High waist black bell bottom flared denim jeans women",
      "Black high rise wide leg stretchable trousers women",
    ],
    howToCombineAndStyle:
      "Isko bilkul belly-button (naabhi) ke paas high-waist pehno aur neeche ka flare jooton ke upar tak aane do—isse turant 4 inch lambi height lagti hai.",
    priceFilter: "Under ₹449 · Free Delivery · Easy Return Verified",
    fabricAndFitCheck:
      "Size chart mein 38–39 inch length aur high-rise waistband verify kar lo taaki legs lambe dikhein.",
    platform: "Meesho",
  },
  {
    itemLabel: "Piece 3 · Secret Styling Transformer (Waist & Fusion Detail)",
    exactKeyword: "Oxidized Silver Kamarbandh Belly Waist Chain Belt Women",
    backupSearchKeywords: [
      "Silver oxidized coin waist chain for kurti jeans",
      "Oxidized silver afghani choker necklace jhumka set",
    ],
    howToCombineAndStyle:
      "Is silver waist chain ko kamar par wahan hook karo jahan maroon kurti aur black bootcut jeans milte hain—isse kamar ekdum slim (snatched) dikhti hai.",
    priceFilter: "Under ₹179 · High Save Trigger",
    fabricAndFitCheck:
      "Buyer review photos mein check karo ki hook मजबूत ho aur matte antique silver finish ho.",
    platform: "Meesho",
  },
  {
    itemLabel: "Piece 4 · Look-Finishing Bag & Footwear Completer",
    exactKeyword:
      "Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag",
    backupSearchKeywords: [
      "Cherry burgundy retro underarm shoulder bag women",
      "Women black pointed toe kitten heel mules sandals",
    ],
    howToCombineAndStyle:
      "Short-strap baguette bag ko ek kandhe (shoulder) par rakho aur baalon mein half-up claw clip lagao—poora Pinterest look ready ho jayega.",
    priceFilter: "Under ₹279 · High Wishlist Value",
    fabricAndFitCheck:
      "Customer video review mein smooth zip aur bag ki finishing check kar lo.",
    platform: "Meesho",
  },
];

export const INITIAL_REEL_RESULT: ReelGenerationResult = {
  id: "sample-reel-look-transformer",
  createdAt: new Date().toISOString(),
  themeInput:
    "Indo-Western Look Transformer: Wine Short Kurti + Black Bootcut Jeans + Silver Waist Chain + Baguette Bag",
  providerUsed: "2026 Live Daily Styling AI",
  concept: {
    title:
      "Indo-Western Look Transformer: Wine Square-Neck Short Kurti + Black Bootcut Jeans + Silver Waist Chain (Under ₹399)",
    category: "Body Proportion & Color Hacks",
    liveDailyTrendTag: dailyContext.liveDailyTrendTag,
    curiosityIdentityAngle:
      "Zyada-tar ladkiyan simple kurti ke saath normal leggings ya skinny jeans pehenti hain jo bohot basic lagta hai. Ye 4-piece combination (Wine Square-Neck Short Kurti + High-Waist Black Flared Bootcut Jeans + Silver Waist Chain) kisi bhi 5'0\"–5'4\" ladki ki height ko lamba aur waist ko slim dikhata hai.",
    firstTwoSecondVisual:
      "0.0s–1.5s: Ek realistic faceless female hand charon matching kapdon ko upar se ek saath pakad kar dikha raha hai (bina hanger ke), piche warm cream wall aur indoor plant hai.",
    whyItTriggersSharesAndSaves:
      "Ladkiyan is Reel ko turant Save aur apni bestie ko Share karti hain kyunki isme sirf kapde nahi, balki 4-piece styling trick aur exact Meesho search names diye gaye hain.",
    lookTransformationFormula: {
      beforeVsAfterLook:
        "Pehle (Basic Look): Loose kurti ko straight jeans ke saath pehenne se body boxy lagti hai aur height choti dikhti hai. Ab (New Styled Look): Fitted Wine Square-Neck Short Kurti + High-Waist Black Flared Bootcut Jeans + Kamar par Silver Waist Chain pehenne se kamar slim aur legs super long lagte hain.",
      howToCombineAllFourPieces:
        "Step 1: Wine Square-Neck Short Kurti (Piece 1) ko Black High-Waist Flared Bootcut Jeans (Piece 2) ke saath pehno. Step 2: Kamar ke border par Oxidized Silver Waist Chain (Piece 3) clip karo taaki wo halka sa aage drape ho. Step 3: Kandhe par Vintage Brown Shoulder Baguette Bag (Piece 4) lo aur baalon mein claw clip lagao.",
      threeWaysToRestyleCombo: [
        "1. Everyday College Look: Piece 1 (Wine Kurti) + Piece 2 (Bootcut Jeans) ko White Sneakers aur Canvas Tote Bag ke saath pehno.",
        "2. Cafe / Date Night Look: Sath mein Piece 3 (Silver Waist Chain) + Piece 4 (Baguette Bag) add karo aur baalon ko soft waves mein khula rakho.",
        "3. Festive / Family Look: Wine Short Kurti ko Black Flared Skirt, Heavy Oxidized Jhumkas aur Punjabi Juttis ke saath pehno.",
      ],
    },
    colorPalette: [
      "Wine Maroon",
      "Jet Black",
      "Antique Oxidized Silver",
      "Espresso Brown",
    ],
    shotByShotPlan: [
      {
        timeRange: "0.0s – 1.5s",
        visualAction:
          "Haath mein pakde hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke halka sa hilate hue dikhao.",
        onScreenText:
          "Stop Wearing Basic Kurtis! Try This 4-Piece Meesho Look Transformer",
      },
      {
        timeRange: "1.5s – 3.0s",
        visualAction:
          "Faceless iPhone Mirror Model (Prompt 0B ya Prompt 5): Model ne Wine Short Kurti + Black Bootcut Jeans pehna hua hai.",
        onScreenText:
          "Piece 1 + 2: Wine Short Kurti + Black Bootcut Jeans = Instant 5'5\" Height",
      },
      {
        timeRange: "3.0s – 4.5s",
        visualAction:
          "Kamar par lagi Oxidized Silver Waist Chain ka close-up shot aur Meesho search bar ka screenshot dikhao.",
        onScreenText:
          "Piece 3: Add a ₹179 Silver Waist Chain to Transform the Whole Waistline",
      },
      {
        timeRange: "4.5s – 6.0s",
        visualAction:
          "Ek haath mein Vintage Baguette Bag (Prompt 4) dikhao taaki video wapas 1st clip se smooth loop ho.",
        onScreenText:
          "Want all 4 exact Meesho wishlist links? Comment 'LINK' for instant DM!",
      },
    ],
  },
  searchTerms: INITIAL_OUTFITS,
  prompts: buildMasterPrompts(
    INITIAL_OUTFITS,
    BACKGROUND_PRESETS[0].description,
    "Indo-Western Look Transformer: Wine Short Kurti + Black Flared Bootcut Jeans + Silver Waist Chain",
    "Step 1: Wear the Wine Square-Neck Short Kurti (Piece 1) with the Black High-Waist Flared Bootcut Jeans (Piece 2). Step 2: Clip the Oxidized Silver Waist Chain (Piece 3) around the waist seam so it dips slightly in front. Step 3: Add the Vintage Shoulder Baguette Bag (Piece 4) and pointed footwear."
  ),
  reelPack: {
    onScreenHooks: [
      "Stop wearing short kurtis with skinny jeans—pair this ₹349 Wine Kurti with Black Bootcut Jeans instead 😭",
      "I gatekept this ₹349 Meesho 4-piece outfit combo for months because it makes 5'0\" girls look 5'5\" tall 👀",
      "How 4 budget Meesho pieces look like a ₹4,500 Pinterest outfit (Wait till you see Piece 3 ✨)",
    ],
    autoDmTriggerWord: "LINK",
    hinglishCaption: `Be honest—which piece from this 4-piece combo are you adding to your Meesho wishlist first: 1, 2, 3, or all 4? 😭✨\n\nMost girls buy good clothes on Meesho but wear them in a basic way. Here is the exact 4-Piece Look-Transformation Formula so you look taller, snatched, and put-together:\n\n1️⃣ Piece 1 (Top): Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti (Under ₹349)\n2️⃣ Piece 2 (Bottom): Women Black High Waist Stretchable Flared Bootcut Jeans\n3️⃣ Piece 3 (The Secret Proportion Trick): Oxidized Silver Kamarbandh Waist Chain Belt & Jhumka Combo\n4️⃣ Piece 4 (Completer): Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag\n\n💡 How to Style It Together: Wear the fitted square-neck kurti over high-waist bootcut jeans, clip the oxidized waist chain at the waist seam, and add the shoulder baguette bag.\n\n👉 Comment "LINK" below and I will Auto-DM you all 4 review-checked Meesho product links in 5 seconds! (Make sure you are following me so my DM doesn't get hidden in your message requests 💕)\n\n📌 Save this Reel right now before your next shopping haul & send it to your bestie!`,
    seoKeywords: [
      "women wine maroon square neck puff sleeve cotton short kurti",
      "women black high waist stretchable flared bootcut jeans",
      "oxidized silver kamarbandh waist chain belt",
      "meesho short kurti with bootcut jeans combo",
      "best meesho outfit combination under 399",
      "height illusion outfit ideas for 5ft girls india",
      "college outfit ideas meesho haul 2026",
      "how to style short kurti to look taller and slimmer",
      "warm indian skin tone kurti color combinations",
      "meesho hidden gems wishlist links",
    ],
    trendingHashtags: [
      "#meeshofinds",
      "#shortkurtistyling",
      "#kurtijeanscombo",
      "#petitefashionindia",
      "#meeshohaul",
    ],
  },
};

export const INITIAL_EBOOK_RESULT: EbookGenerationResult = {
  id: "sample-ebook-greyhat-oracle-2027-dossier",
  createdAt: new Date().toISOString(),
  topicInput:
    "The Dark Psychology of WhatsApp DM Closing, 6-Second Trial-Reel Funnels & Classified 1% Portals (Zero Followers Needed)",
  category: "All",
  priceDisplay: "₹29",
  anchorPriceDisplay: "₹2,499",
  autoDmTrigger: "SECRET",
  ebook: {
    editionTag:
      "CLASSIFIED 1% INSIDER DOSSIER · GREY-HAT ORACLE EDITION · ZERO FLUFF",
    title:
      "The Classified 1% Execution Dossier: Dark Psychology WhatsApp Closing, Trial-Reel Funnels & Verified Global Portals",
    subtitle:
      "5 Unconventional Behavioural Triggers, Direct Backdoor Search Filters & Copy-Paste Scripts That Give You an Unfair Advantage in 2026–2027.",
    targetReaderPromise:
      "Every single website, search filter, psychological trigger, and 50%-advance protection step in this dossier is 100% real, fact-checked, and written in simple, direct English so you can execute today without followers or guesswork.",
    goldenRuleTitle:
      "⚠️ CLASSIFIED BRIEFING: The #1 Grey-Hat Execution & 50%-Advance Safety Rule",
    goldenRuleBody:
      "Never follow the 99% crowd that begs for work or relies on fake shortcuts. In this dossier, every chapter uses real platform filters, clearly separates 100% Free (₹0) tools from paid options, and protects your time with the '1-Photo Watermarked Sample + 50% UPI Advance' lock.",
    hardestPartSolvedBox: {
      title:
        "🔥 THE HARDEST PART SOLVED: 4 Classified Backdoor Filters & Real UI Click-Paths",
      exactWhereToFindMap: [
        "1. Google Maps '40+ Reviews, No-Website' Local Clinic Filter: Search 'Dental Clinic', 'Skin Studio', or 'Luxury Salon' in any Tier-1/Tier-2 city on Google Maps → Pick businesses with 40+ reviews that have NO 'Website' button → Pitch a ₹2,999 1-Page WhatsApp Booking Menu.",
        "2. Meta Ad Library Active-Spender Filter (facebook.com/ads/library): Select 'India' → 'All Ads' → Type your niche keyword → Filter by 'Active' ads running for 14+ days to find D2C brands spending ₹50,000+/month right now.",
        "3. UserTesting & Prolific ($10 / 15-Min Real Usability Portals): Apply at usertesting.com/get-paid-to-test and app.prolific.com with a KYC-Verified Indian PayPal account (PAN + Bank linked). Pays $10 USD via PayPal 14 days after each approved test.",
        "4. LinkedIn Real 24-Hour Post Filter & TheForage.com: Complete a 100% free Tata Group or JPMorgan job simulation on theforage.com. Then on LinkedIn search '\"hiring\" AND \"remote\"' → Click 'Posts' tab → Click 'Date posted' → Select 'Past 24 hours'.",
      ],
      zeroFollowerTrafficTrick:
        "Never deliver unwatermarked work upfront! Download 1 public photo from a local clinic or D2C brand, create 1 watermarked Before/After sample ('CUSTOM PREVIEW'), and collect 50% UPI advance before building the full package.",
    },
    quickValueBreakdown: [
      {
        metric: "1. The 99% Trap Destroyed",
        detail:
          "Replaces saturated freelance bidding wars with direct Google Maps, Meta Ad Library & LinkedIn 24-hr filters.",
      },
      {
        metric: "2. Anti-Scam 50% Advance Lock",
        detail:
          "Send only 1 watermarked preview image first; never deliver final files without a 50% UPI advance.",
      },
      {
        metric: "3. 100% Free (₹0) Verified Portals",
        detail:
          "Every portal inside (Google Maps, Meta Ad Library, UserTesting, Prolific, Forage, Harvard CS50x) is ₹0 to start.",
      },
      {
        metric: "4. Copy-Paste Jedi Scripts",
        detail:
          "Word-for-word WhatsApp Loss-Aversion closing scripts, 6s Trial-Reel hooks & 1mg Salt lookup formulas.",
      },
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: "The Dark Psychology of WhatsApp DM Closing & The 'Visual Loss-Aversion' Client Exploit",
        subtitle:
          "⚠️ WARNING: Keep this strictly confidential. — How to make local clinics, salons & D2C brands pay 50% UPI advance within 15 minutes (₹0 cost).",
        coreSecretSummary:
          "The 99% Illusion: Normal freelancers send 100 boring cold messages saying 'Hi Sir, I do graphic design/websites, please hire me'—and get ignored 99% of the time. The 1% Reality: The human brain is wired to ignore generic pitches, but it physically cannot ignore seeing its own business losing customers in a live visual screenshot. When you send a business owner 1 watermarked 'Before vs. After' preview of their own page on WhatsApp, you trigger instant Loss Aversion.",
        whereToFindOrHiddenTrick:
          "THE GREY-HAT MECHANISM (GOOGLE MAPS + META AD LIBRARY): Open Google Maps and search 'Dental Clinic', 'Skin Clinic', or 'Boutique' in any major city neighbourhood, OR open facebook.com/ads/library (Country: India -> Status: Active). Pick businesses that have 40+ customer reviews (proving they have real cashflow) but either have no booking website button or use dull, unstyled product photos.",
        stepByStepExecution: [
          "1️⃣ The Infiltration: Pick 5 high-review local businesses on Google Maps or active advertisers on facebook.com/ads/library. Save 1 public photo or menu from their listing without asking for permission first.",
          "2️⃣ The Trigger: Use Canva or AI to transform that 1 photo into a luxury 4K WhatsApp Booking Card or Ad Creative, and place a bold 40%-opacity diagonal watermark across the center: 'CUSTOM PREVIEW FOR [BUSINESS NAME]'.",
          "3️⃣ The Leverage: Send the watermarked Before/After image directly to their WhatsApp number with the Loss-Aversion script below, offering a ₹250 1-page unwatermarked test or a ₹2,999 complete pack.",
          "4️⃣ The Safety Lock: Strictly enforce the 50% UPI Advance Rule—collect ₹1,500 via UPI before creating the remaining pages, and send the final unwatermarked link only after the remaining 50% is paid.",
        ],
        exactToolsOrWebsites: [
          {
            name: "google.com/maps & facebook.com/ads/library (100% Free ₹0)",
            role: "Find Cash-Rich Local Clinics, Salons & Active D2C Advertisers",
            insiderTip:
              "Businesses with 40+ Google Reviews already have paying customers every day—they immediately see the value of a WhatsApp booking menu.",
          },
          {
            name: "canva.com & carrd.co (Free Tier)",
            role: "Create the 1-Page Watermarked Sample & WhatsApp Booking Funnel",
            insiderTip:
              "Always place a 40%-opacity text watermark directly over the center of your sample so nobody can screenshot and use your unpaid preview.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "🧠 The Jedi Mind-Trick / Secret Script (WhatsApp Loss-Aversion Pitch)",
          content:
            "Attach your 1 Watermarked Before/After image and send:\n\n\"Hi [Business Name] team! I noticed you have 45+ great Google reviews, but when customers check your profile, there is no 1-tap WhatsApp catalog/booking page—so many buyers drop off.\n\nI already designed a custom 4K preview specifically for [Business Name] (attached with watermark). I can unlock this single asset for ₹250 today, or build your complete 10-page WhatsApp Conversion Kit for ₹2,999 (50% advance, 50% on delivery). Which option works best for you?\"",
        },
        incomeMathOrProof:
          "Exact Math: 5 watermarked previews/day × 7 days = 35 pitches/week → closing 2 packages/week × ₹2,999 = ₹5,998/week × 4 weeks = ₹23,992/month (with 50% UPI advance safety and 0 followers).",
      },
      {
        chapterNumber: 2,
        title: "The 6-Second Instagram 'Trial-Reel' & Snack-Price Auto-DM Arbitrage",
        subtitle:
          "⚠️ WARNING: Keep this strictly confidential. — How anonymous 0-follower pages turn 6-second dark screen loops into automated daily UPI payouts.",
        coreSecretSummary:
          "The 99% Illusion: Normal creators spend 5 hours filming their face, dancing to trending audio, and waiting months for followers before they ever earn ₹1. The 1% Reality: Instagram's 'Trial Reel' toggle pushes your video to 100% non-followers to test retention—and a 6-second dark aesthetic video with a 'Snack-Price Comparison' overlay forces viewers to loop the clip 3 times (300% watch-time) while reading, triggering algorithmic reach and instant impulse sales.",
        whereToFindOrHiddenTrick:
          "THE GREY-HAT MECHANISM (6-SECOND RETENTION LOOP + AUTO-DM): When a video is strictly 6 seconds long and has a 3-line psychological hook comparing a ₹29/₹49 classified dossier to a ₹60 plate of street momos, the human brain takes 12–14 seconds to read it. By the time the viewer finishes reading, the 6-second video has replayed 2.5 times—signalling the algorithm to push your Reel to thousands of non-followers!",
        stepByStepExecution: [
          "1️⃣ The Infiltration: Export your 5-chapter classified dossier as a clean 12pt PDF and list it on SuperProfile.bio, Cosmofeed, or Gumroad so Indian buyers can pay via GPay/PhonePe/Paytm in 8 seconds.",
          "2️⃣ The Trigger: Record a 6-second dark-mode screen scroll of the PDF chapters, add the 'Snack-Price Anchoring' text overlay below, and toggle ON 'Trial Reel' before posting.",
          "3️⃣ The Leverage: Connect a free Auto-DM tool (ManyChat, SuperProfile Auto-DM, or Zorcha) triggered by a 1-word comment ('SECRET') so every commenter receives your checkout link in their DM within 5 seconds.",
          "4️⃣ The Safety Lock: Add a ₹99 'Complete 3-Dossier Bundle Order Bump' on the checkout screen—30% of buyers tick the upgrade box, tripling your daily revenue automatically.",
        ],
        exactToolsOrWebsites: [
          {
            name: "superprofile.bio / cosmofeed.com (100% Free Setup)",
            role: "Instant Indian UPI Checkout Page + Automated Comment-to-DM Delivery",
            insiderTip:
              "Enable 1-tap UPI intent so mobile buyers complete payment in under 8 seconds without typing card details.",
          },
          {
            name: "Instagram 'Trial Reel' Toggle (Built-In Feature)",
            role: "Pushes Your 6-Second Reel to 100% Non-Followers First",
            insiderTip:
              "Use strictly 5 niche hashtags and keep the video between 5.5 and 6.5 seconds for maximum loop retention.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "🧠 The Jedi Mind-Trick / Secret Script (6-Second Snack-Price On-Screen Hook)",
          content:
            "\"1 Plate Street Momos = ₹60 (Gone in 5 minutes).\nThis Classified 5-Chapter Execution Dossier = ₹29 (Exact backdoor links, psychological scripts & zero-fluff systems).\nComment 'SECRET' below & check your DM in 5 seconds.\"",
        },
        incomeMathOrProof:
          "Exact Math: (15 sales/day × ₹29 = ₹435) + (4 bundle upgrades/day × ₹99 = ₹396) = ₹831/day × 30 days = ₹24,930/month running on automated checkout with a faceless page.",
      },
      {
        chapterNumber: 3,
        title: "Paid $10 / 15-Minute Website Usability Testing (UserTesting, Trymata & Prolific — The Narration Trigger)",
        subtitle:
          "⚠️ WARNING: Keep this strictly confidential. — Exact KYC requirements, how to pass the unpaid practice test on attempt #1, and realistic weekly USD payouts.",
        coreSecretSummary:
          "The 99% Illusion: People waste hours on 10-cent survey apps that disqualify them on the final screen. The 1% Reality: Usability testing on UserTesting.com and Trymata.com pays a flat $10 USD for a 15-minute screen recording where you test a company's website prototype and speak your thoughts out loud—and Prolific.com pays £6–£10/hr GBP for university AI studies with zero disqualifications once a study appears on your dashboard.",
        whereToFindOrHiddenTrick:
          "THE GREY-HAT MECHANISM (THE 3-SECOND CONTINUOUS NARRATION RULE): Apply free at usertesting.com/get-paid-to-test, trymata.com/get-paid-to-test, and app.prolific.com/register/participant. Human reviewers reject 80% of beginners on the 7-minute practice test because they click silently. To pass on attempt #1, speak continuously every 2–3 seconds explaining what you expect a button to do BEFORE you click it.",
        stepByStepExecution: [
          "1️⃣ The Infiltration: Verify your Indian PayPal account with your PAN card and Indian bank account first so it can receive international USD/GBP payouts without holds.",
          "2️⃣ The Trigger: Complete the 7-minute unpaid practice test on UserTesting in a quiet room (fan off) while speaking continuously using the 3-step narration script below.",
          "3️⃣ The Leverage: Keep the UserTesting and Prolific (with the free 'Prolific Assistant' browser extension) tabs open between 7:30 PM – 11:30 PM IST when US/UK companies launch new tests.",
          "4️⃣ The Safety Lock: Always answer 3-question demographic screeners 100% honestly—consistency keeps your tester rating at 4.8★+ so you receive priority $10 invitations (paid automatically 14 days after each test).",
        ],
        exactToolsOrWebsites: [
          {
            name: "usertesting.com/get-paid-to-test (100% Free ₹0 Signup)",
            role: "$10 USD per 15–20 Minute Recorded Website/App Test",
            insiderTip:
              "Every $10 payout is sent automatically to your PayPal account exactly 14 days down to the hour after you submit the test.",
          },
          {
            name: "prolific.com (100% Free ₹0 Signup)",
            role: "Verified University & AI Research Studies (Pays in GBP £ via PayPal)",
            insiderTip:
              "Install the official 'Prolific Assistant' Chrome/Firefox extension—it alerts you the second a new study with open spots goes live.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "🧠 The Jedi Mind-Trick / Secret Script (The 'Think-Out-Loud' Practice Pass Formula)",
          content:
            "Use this exact speaking rhythm during your practice test:\n1. Read the task prompt out loud word-for-word first.\n2. Narrate your search: \"I am scanning the top navigation bar to find [Target]... I see [Button A] and [Button B], so I am going to click [Button A] because I expect it to show...\"\n3. Give constructive feedback: \"This page loaded quickly and the heading is clear, but I wish the filter button on the left was more visible.\"",
        },
        incomeMathOrProof:
          "Exact Math: (2 UserTesting sessions/week × $10 = $20) + (2 hrs Prolific/week × $7.50 = $15) = $35/week × 4 weeks = $140/month (× ₹85 = ₹11,900/month) in verified PayPal payouts with ₹0 investment.",
      },
      {
        chapterNumber: 4,
        title: "Adobe Stock AI Contributor (The 60% Copy-Space Commercial Backdoor)",
        subtitle:
          "⚠️ WARNING: Keep this strictly confidential. — How to legally upload 4MP+ Indian Festive & Copy-Space AI Backgrounds to Adobe Stock for passive USD royalties.",
        coreSecretSummary:
          "The 99% Illusion: Beginners generate random AI portraits of people and get rejected by stock marketplaces. The 1% Reality: Adobe Stock (contributor.stock.adobe.com) is a search engine where graphic designers, wedding invitation printers, and ad agencies buy clean Indian festive and luxury backgrounds that leave 60% empty 'copy space' in the middle so they can type their client's text over it.",
        whereToFindOrHiddenTrick:
          "THE GREY-HAT MECHANISM (THE 60% EMPTY COPY-SPACE NICHE): Search Adobe Stock for 'Indian wedding invitation background copy space' or 'Diwali luxury background empty center'. Designers across India, the UAE, UK, and USA buy horizontal and vertical backgrounds that have 60% smooth empty space in the center or left side—and Adobe pays you 33% USD royalty on every download!",
        stepByStepExecution: [
          "1️⃣ The Infiltration: Create a free contributor account at contributor.stock.adobe.com and complete the 2-minute online W-8BEN tax form (reduces US withholding tax for Indian residents).",
          "2️⃣ The Trigger: Generate ultra-clean Indian festive, royal arch, mandala, and minimalist marble/silk backgrounds with 60% empty copy-space and zero text inside the image.",
          "3️⃣ The Leverage: Upscale every image to 4000×2666 px (10+ Megapixels) using free Upscayl.org or iloveimg.com/upscale-image so it passes Adobe's 4MP minimum requirement effortlessly.",
          "4️⃣ The Safety Lock: Tick the mandatory 'Created using generative AI tools' checkbox, never use trademarked brand names in titles, and add 25 descriptive English buyer keywords.",
        ],
        exactToolsOrWebsites: [
          {
            name: "contributor.stock.adobe.com (100% Free ₹0 Signup)",
            role: "Official Free-to-Join Global Stock Portal (Pays 33% Royalty in USD)",
            insiderTip:
              "Once your earnings reach $25 USD, you can withdraw directly to Payoneer or PayPal.",
          },
          {
            name: "upscayl.org / iloveimg.com/upscale-image (Free)",
            role: "Free Image Upscaler to Pass Adobe's 4MP–100MP Requirement",
            insiderTip:
              "Zoom in to 100% before uploading to make sure there are no weird AI artifacts in the corners.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "🧠 The Jedi Mind-Trick / Secret Script (High-Approval 60% Copy-Space Prompt)",
          content:
            "Ultra-clean 8k commercial background of a royal Indian emerald green and warm ivory silk backdrop framed with subtle antique gold zari floral corners, 65% completely blank smooth empty copy space in the center for text overlay, soft even studio lighting, no text, no letters, no watermark, photorealistic graphic design resource.",
        },
        incomeMathOrProof:
          "Building a portfolio of 150–200 high-utility Indian festive & corporate copy-space backgrounds generates ongoing passive USD royalties ($0.33 to $2.64 per download) year-round.",
      },
      {
        chapterNumber: 5,
        title: "100% Free Verified Credentials (Harvard CS50x & Forage), LinkedIn 24-Hr Filter & ₹150 Pharmacy Salts",
        subtitle:
          "⚠️ WARNING: Keep this strictly confidential. — Exact verified free portals for your CV + the real 1mg.com 'Salt Composition' loophole for dermatologist-grade skincare.",
        coreSecretSummary:
          "The 99% Illusion: People pay ₹25,000 for generic coaching certificates, apply to 30-day-old job listings with 2,000 applicants, and spend ₹3,000 on influencer skincare serums. The 1% Reality: You can get official Tata/JPMorgan/Harvard credentials for ₹0, DM founders within 24 hours of their hiring post on LinkedIn, and buy the exact same regulated active skincare molecules at an Indian chemist for ₹190.",
        whereToFindOrHiddenTrick:
          "THE GREY-HAT MECHANISM (EXACT REAL CLICK-PATHS): (1) LinkedIn Backdoor: Type '\"hiring\" AND (\"remote\" OR \"intern\")' in top search bar → Click 'Posts' tab (NOT Jobs!) → Click 'Date posted' dropdown → Select 'Past 24 hours'. (2) 1mg.com Salt Loophole: Search any ₹3,000 cream/serum on 1mg.com → Click the clickable 'SALT COMPOSITION' link right below the product title to view ₹150–₹250 regulated pharma equivalents.",
        stepByStepExecution: [
          "1️⃣ The Infiltration: Go to theforage.com → Complete a free 4-hour 'Tata Group' or 'JPMorgan' virtual job simulation, and go to cs50.harvard.edu/x directly (skip paid edX!) to earn your free verifiable Harvard CS50x Certificate.",
          "2️⃣ The Trigger: Use the LinkedIn 'Posts -> Date posted: Past 24 hours' filter every morning to message founders who just posted their hiring email in a live post.",
          "3️⃣ The Leverage: Check regulated Indian pharmacy equivalents on 1mg.com (always patch test): For Post-Acne Dark Spots -> 'Aziderm 10% Cream' (Micro Labs, ~₹245). For Dullness/Tan (2 nights/week + SPF 50 next morning) -> 'Glyco 6 Cream' (Micro Labs, ~₹200). For Oil-Free Hydration on damp skin -> 'Hyalugel' (Ethicare, ~₹250).",
          "4️⃣ The Safety Lock: Open notebooklm.google.com (100% free) → Upload your course PDFs or interview notes → Click 'Audio Overview' to generate a 2-host podcast summary in 3 minutes.",
        ],
        exactToolsOrWebsites: [
          {
            name: "theforage.com & cs50.harvard.edu/x (100% Free ₹0)",
            role: "100% Free Verifiable Corporate & Harvard Credentials",
            insiderTip:
              "Forage provides exact resume bullet points at the end of each simulation that are pre-approved by the sponsoring company.",
          },
          {
            name: "1mg.com (Salt Composition Link) & notebooklm.google.com",
            role: "Regulated Indian Pharma Ingredient Verification & Free AI Study Studio",
            insiderTip:
              "Never combine Glycolic Acid (Glyco 6) and Azelaic Acid (Aziderm) in the same night, and always wear SPF 50 sunscreen the next morning.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "🧠 The Jedi Mind-Trick / Secret Script (LinkedIn 'Past 24 Hours' Direct Founder DM)",
          content:
            "\"Hi [Name], saw your post from a few hours ago regarding the [Role Name] opening! Instead of just sending a standard resume, I put together a 1-page sample specifically for [Company Name] (attached), along with my recent [Tata Group Forage / Harvard CS50x] project credential. Happy to complete a short trial task if you are shortlisting this week!\"",
        },
        incomeMathOrProof:
          "Saves ₹20,000+ in unnecessary course fees and ₹12,000+/year in overpriced skincare while getting 5x higher interview replies on LinkedIn.",
      },
    ],
    twentyFourHourChecklist: [
      "Download this 12pt White-Label PDF using the 'Download White-Label PDF (.pdf)' button.",
      "Open Google Maps or facebook.com/ads/library → Pick 5 high-review local clinics or active D2C brands → Send 1 WATERMARKED Before/After preview (collect 50% UPI advance before full delivery!).",
      "Create your free profile on usertesting.com/get-paid-to-test & prolific.com (with KYC-verified Indian PayPal).",
      "Upload 5 upscaled 4000px+ Indian festive copy-space backgrounds to contributor.stock.adobe.com (tick 'Created using generative AI tools').",
      "Complete 1 free corporate simulation on theforage.com and test the LinkedIn 'Posts → Date posted: Past 24 hours' filter.",
    ],
  },
  reelBlueprint: {
    sixSecondVideoIdea: {
      visualStyle:
        "6-Second Dark Aesthetic Clip (Laptop Screen in Dark Room / Coffee Pour / Smooth Scroll of This 12pt Classified Dossier PDF)",
      shotByShot: [
        "0.0s – 2.0s: Dark moody aesthetic shot of laptop glowing or iced coffee pour with bold Price-Comparison text overlay.",
        "2.0s – 4.5s: Smooth screen recording scrolling through this 12pt PDF showing 'Dark Psychology WhatsApp Closing, Trial-Reel Funnels & $10/15-Min Testing'.",
        "4.5s – 6.0s: Quick flash of the ₹29 (vs ₹2,499) instant download page with text: 'Comment SECRET for the direct link before I archive this'.",
      ],
      lightingAndAudioTip:
        "Keep the video strictly 6 seconds so viewers loop it 2–3 times while reading the text overlay. Toggle ON 'Trial Reel' before posting so Instagram pushes it to non-followers!",
    },
    psychologicalPriceOverlays: [
      {
        triggerType: "1. Daily Snack Price-Comparison Trigger (Zero-Resistance Impulse)",
        overlayText:
          "\"1 Plate Momos = Rs 60 (Gone in 5 mins). This Classified 1% Dossier = Rs 29 (Gives you 5 verified backdoor portals & psychological scripts nobody shares for free). Choice is yours.\"",
        whyItConverts:
          "Makes ₹29 feel smaller than street food while promising rare, non-generic systems.",
      },
      {
        triggerType: "2. The 'No Affiliate / No Generic Fluff' Hook",
        overlayText:
          "\"Tired of everyone telling you to do affiliate marketing or surveys? Here are 5 classified client-closing, Trial-Reel & USD testing loopholes that actually work in 2026–2027.\"",
        whyItConverts:
          "Immediately stands out from 99% of Instagram reels by calling out how tired people are of generic advice.",
      },
      {
        triggerType: "3. Extreme FOMO / Gatekeeping Hook",
        overlayText:
          "\"From the Dark Psychology WhatsApp closing script to Google Maps clinic takeovers, free Harvard credentials & ₹150 pharmacy salts—comment 'SECRET' before I archive this.\"",
        whyItConverts:
          "Names specific, intriguing mechanisms that force curious viewers to save the reel and comment immediately.",
      },
    ],
    autoDmCaption: `Everyone on Instagram repeats the same tired advice ("do affiliate marketing, do surveys, or beg for followers"). Nobody shares the real classified systems that actually work in 2026–2027! 🤫✨\n\nInside this 12pt Simple-English Classified Dossier, I have put the exact step-by-step map with 100% verified links:\n✅ System 1: Dark Psychology WhatsApp DM Closing & Google Maps Local Clinic Takeover (50% UPI advance lock)\n✅ System 2: The 6-Second Trial-Reel & Auto-DM Micro-Dossier Funnel (0 followers needed)\n✅ System 3: $10 Per 15-Minute Speak-Out-Loud Website Testing (UserTesting & Prolific Narration Formula)\n✅ System 4: Adobe Stock AI 60% Copy-Space Commercial Backgrounds\n✅ System 5: Free Verified Harvard CS50x & Tata/JPMorgan Forage Credentials + ₹150 Indian Pharmacy Generic Salt Bible\n\nToday you can get the complete 12pt PDF for just ₹29 (cheaper than a plate of momos—resets to ₹2,499 tonight).\n\n👉 Comment "SECRET" right now and my Auto-DM will send you the instant download link within 5 seconds!`,
    seoKeywords: [
      "underrated websites that feel illegal to know",
      "whatsapp client closing psychology india",
      "usertesting india review 2026",
      "free verified certificates harvard tata forage",
      "google maps local business client hunting",
      "adobe stock ai contributor india",
      "indian pharmacy skincare dupes list",
      "unique side hustles india no affiliate",
      "instagram trial reels auto dm funnel",
      "secret portals for students in india",
    ],
    hashtags: [
      "#secretwebsites",
      "#careergrowthindia",
      "#sidehustleindia",
      "#studenthacksindia",
      "#digitalassets2026",
    ],
  },
};


