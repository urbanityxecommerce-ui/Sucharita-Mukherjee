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
  id: "sample-ebook-underground-2027-vault",
  createdAt: new Date().toISOString(),
  topicInput:
    "5 Underground 2026–2027 USD Royalty, B2B Arbitrage & Secret Portal Systems (Zero Affiliate, Zero Selling, Zero Followers)",
  category: "2026 Real Pocket Cashflow & Micro-Business",
  priceDisplay: "₹29",
  anchorPriceDisplay: "₹2,499",
  autoDmTrigger: "VAULT",
  ebook: {
    editionTag:
      "2026–2027 FACT-CHECKED INSIDER EDITION · 100% REAL UI FILTERS · ZERO AI HALLUCINATIONS",
    title:
      "The 100% Fact-Checked Underground Playbook: 5 Verified USD, B2B & Career Systems (With Honest Reality Checks & Anti-Scam Rules)",
    subtitle:
      "Zero Fake Filters, Zero Hallucinated Tricks, Zero Affiliate Filler: Exact Real UI Buttons, Free vs. Paid Truths & Safe 50%-Advance Workflows.",
    targetReaderPromise:
      "Every single website, filter button, payout rule, and risk protection step in this book is 100% fact-checked against real platform rules—no fake '1.5x night bonus' myths, no non-existent IndiaMART filters, and no working for free without a watermarked sample + 50% advance.",
    goldenRuleTitle:
      "Your #1 Golden Rule: Use Only Real Platform Filters & Never Deliver Unwatermarked Work Without 50% Advance",
    goldenRuleBody:
      "Most internet guides mix real websites with fake, made-up steps that fail the moment you open the website. In this playbook, every step uses ONLY the real buttons that exist on screen today, clearly separates 100% Free (₹0) methods from paid-plan features, and protects your time with the '1-Photo Watermarked Sample + 50% UPI Advance' rule.",
    hardestPartSolvedBox: {
      title:
        "🔥 THE HARDEST PART SOLVED: 4 Fact-Checked, Real-World Portals & Exact UI Filters That Actually Exist",
      exactWhereToFindMap: [
        "1. IndiaMART Real UI Filter (dir.indiamart.com): Type 'Cotton Kurti' in the search bar → Click City: 'Surat' or 'Jaipur' at the top → On the Left Sidebar under 'Business Type', tick 'Manufacturer' or 'Exporter', and tick 'TrustSEAL Verified'. (Note: Never look for fake filters like 'No Instagram DM'—instead, visually pick listings that have dull mannequin/floor photos!).",
        "2. Adobe Stock AI Contributor & Voquent Voice Portal (100% Free ₹0 Signup): Upload 4MP+ upscaled Indian Wedding/Festive copy-space backgrounds at contributor.stock.adobe.com (tick 'Created using generative AI tools'), OR list human Hindi/Indian-English voice demos for ₹0 on voquent.com/voice-actors. (Note: ElevenLabs Voice Library royalties require their paid Creator plan for Professional Voice Cloning).",
        "3. UserTesting & Prolific ($10 / 15-Min Real Usability Portals): Apply at usertesting.com/get-paid-to-test and app.prolific.com. Requires a KYC-Verified Indian PayPal account (PAN + Bank linked). Pays $10 USD via PayPal 14 days after each approved test (expect 1–4 matched tests/week).",
        "4. LinkedIn Real 24-Hour Post Filter & TheForage.com: Complete a 100% free Tata Group or JPMorgan job simulation on theforage.com. Then on LinkedIn search '\"hiring\" AND \"remote\"' → Click 'Posts' tab → Click 'Date posted' → Select 'Past 24 hours' → Click 'Show results'.",
      ],
      zeroFollowerTrafficTrick:
        "For B2B clients on IndiaMART or Google Maps: NEVER make a full 15-page catalog upfront! Download 1 single public photo from their listing, create 1 watermarked Before/After sample ('SAMPLE PREVIEW'), and take 50% UPI advance before making the remaining pages.",
    },
    quickValueBreakdown: [
      {
        metric: "1. 100% Fact-Checked UI Steps",
        detail:
          "Every button and filter name matches the real live website—zero hallucinated filters or fake bonus myths.",
      },
      {
        metric: "2. Anti-Scam 50% Advance Rule",
        detail:
          "Send only 1 watermarked preview image first; never create a full PDF catalog without a 50% UPI advance.",
      },
      {
        metric: "3. Honest Free (₹0) vs Paid Truth",
        detail:
          "Clearly tells you which portals are 100% ₹0 free (UserTesting, Adobe Stock, Voquent, Forage) vs paid-tier (ElevenLabs PVC).",
      },
      {
        metric: "4. Real Payout & Time Math",
        detail:
          "Realistic weekly payouts, exact PayPal KYC requirements for India, and 14-day payout timelines.",
      },
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: " IndiaMART Wholesale Catalog Service: Exact Real Filters & The 50%-Advance Anti-Scam Rule",
        subtitle:
          "How to find real Surat & Jaipur manufacturers on dir.indiamart.com and close ₹2,999 4K Catalog orders without ever working for free.",
        coreSecretSummary:
          "On IndiaMART (dir.indiamart.com), thousands of real garment, saree, kurti, and jewellery manufacturers in Surat, Jaipur, Ahmedabad, and Mumbai upload dull photos taken on plastic mannequins or warehouse floors. They share PDF catalogs with wholesale shopkeepers on WhatsApp daily. However, you must use the REAL IndiaMART sidebar filters and strictly follow the '1-Photo Watermark + 50% Advance Rule' so no supplier ever takes free work from you.",
        whereToFindOrHiddenTrick:
          "REAL INDIAMART UI CLICK-PATH (FACT-CHECKED): Open dir.indiamart.com → Type 'Ladies Cotton Kurti' or 'Jaipuri Kurti' in the top search bar → Click city pill 'Surat' or 'Jaipur' below the search bar → On the Left Sidebar, scroll to 'Business Type' and tick 'Manufacturer' (or 'Exporter'), and tick 'TrustSEAL Verified'. (Reality Check: IndiaMART does NOT have filters called 'No Instagram DM' or 'Stock > 50L'—simply look at the product photos on page 2 or 3 and pick suppliers whose photos are dark or on plastic mannequins!).",
        stepByStepExecution: [
          "Step 1 (Download Only 1 Single Public Photo): Pick 5 TrustSEAL Verified Manufacturers on dir.indiamart.com whose kurti/saree photos look dull. Right-click and save ONLY 1 product photo directly from their public IndiaMART page. Do NOT message them asking for photos yet!",
          "Step 2 (Create 1 Watermarked Before/After Preview in 3 Mins): Use AI + Canva to place that 1 kurti onto a realistic 4K Indian model next to a clean Fabric/Size/Wholesale Price box. Put a large semi-transparent diagonal watermark across the middle: 'SAMPLE PREVIEW FOR [SUPPLIER NAME]'.",
          "Step 3 (Send the 1 Watermarked Sample via WhatsApp): Click 'View Mobile Number' / contact on their listing and send the single watermarked Before/After image on WhatsApp with the script below.",
          "Step 4 (Strict 50% UPI Advance Rule — Never Skip!): NEVER create a 15-page PDF upfront! Once the supplier likes your 1-page watermarked sample, quote ₹2,999 for a 15-design WhatsApp PDF Catalog (or ₹250 for 1 single unwatermarked trial page). Collect 50% advance (₹1,500) via UPI before generating the remaining 14 pages, and send the final unwatermarked Google Drive PDF link only after the remaining 50% is paid.",
        ],
        exactToolsOrWebsites: [
          {
            name: "dir.indiamart.com (Real Left-Sidebar Filters)",
            role: "City (Surat/Jaipur) + Business Type (Manufacturer) + TrustSEAL Verified",
            insiderTip:
              "TrustSEAL Verified manufacturers pay IndiaMART an annual verification fee, which proves they are real registered businesses with GST.",
          },
          {
            name: "Canva.com (Free A4 Document + Diagonal Watermark)",
            role: "Create the 1-Page Watermarked Sample & Final PDF",
            insiderTip:
              "Always place a 40%-opacity text watermark directly over the model's outfit in your sample so nobody can screenshot and use your unpaid preview.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste WhatsApp Pitch (With 1 Watermarked Sample Attached)",
          content:
            "Attach your 1 Watermarked Before/After image and send:\n\n\"Namaste Sir! Main ne IndiaMART par aapki [Company Name] ki Kurti listing dekhi. Aapka fabric design bohot badiya hai, isliye maine aapke 1 mannequin photo ko 4K Studio Model Catalog Page mein convert karke free sample banaya hai (attached).\n\nHum wholesale manufacturers ke liye 15 Designs ka 4K WhatsApp PDF Catalog ₹2,999 mein banate hain (50% advance, 50% delivery par). Agar aap pehle sirf 1 design bina watermark ke test karna chahein toh ₹250 mein le sakte hain. Bataiye Sir, kya hum aapke naye stock ke 15 designs ka catalog start karein?\"",
        },
        incomeMathOrProof:
          "Sending 5 watermarked 1-photo samples/day = 35/week → even 2 full catalog orders/week at ₹2,999 (with 50% upfront safety) = ₹24,000/month.",
      },
      {
        chapterNumber: 2,
        title: "Voice Royalties & Audio Income: The Honest Truth About ElevenLabs vs. 100% Free (₹0) Portals",
        subtitle:
          "Real facts on how ElevenLabs Voice Library payouts work (Creator Plan required) + 100% Free ₹0 alternatives (Voquent & ACX).",
        coreSecretSummary:
          "You may have heard rumours about 'recording a 30-minute story at 11:30 PM on ElevenLabs for a 1.5x royalty bonus on a free account'. Let's clear the fake myths and give you the 100% real, working facts so you don't waste a single minute: (1) ElevenLabs DOES pay passive USD royalties via Stripe when users generate audio with your voice in their Voice Library, (2) However, creating a 'Professional Voice Clone (PVC)' is NOT available on the free tier—it requires at least their Creator Plan ($11 first month / $22/mo), at least 30 minutes of studio-clean audio, and passing a live microphone 'Voice Captcha'. (3) Recording late at night with the fan off is ONLY to keep background noise near 0 dB so your audio passes quality inspection—there is NO '1.5x night batch multiplier'. If you want a 100% Free (₹0) voice income path today, use Voquent.com alongside or before ElevenLabs!",
        whereToFindOrHiddenTrick:
          "TWO REAL PATHS (PICK BASED ON YOUR BUDGET): Path A (100% Free ₹0 Signup): Go to voquent.com/voice-actors → Create a free human voice actor profile → Upload 3 short 30-second clean Hindi/Indian-English sample clips recorded at night with the fan off. Global producers hire directly and Voquent charges ₹0 registration fee! Path B (Passive AI Clone Royalties — Paid Creator Tier): Go to elevenlabs.io/app/voice-library → Upgrade to Creator Plan → Voices → Add a new voice → Professional Voice Cloning → Upload 30–60 mins of clean, noise-free monologue → Read the live Voice Captcha → Toggle ON 'Share in Voice Library' & 'Financial Rewards (Stripe)'.",
        stepByStepExecution: [
          "Step 1 (Record Zero-Noise Audio — Why Night + Fan Off Matters): Sit near curtains or a open wardrobe at night with the ceiling fan and AC turned OFF. This is not for any algorithm trick—it simply prevents fan hum and room echo so audio reviewers approve your sample on the first try.",
          "Step 2 (Clean Audio for Free): Upload your phone WAV/M4A recording to podcast.adobe.com/enhance (free web tool) and set the slider to 50%–60% so background hiss disappears while keeping your natural tone.",
          "Step 3 (If You Have ₹0 Budget — Upload to Voquent.com): Go to voquent.com/voice-actors → Upload 3 distinct 30-second demos (1 Warm Hindi Commercial, 1 Clear Indian-English E-Learning, 1 Calm Storytelling) and tag your native languages.",
          "Step 4 (If Using ElevenLabs PVC — Creator Plan): Upload 30+ minutes of consistent reading to ElevenLabs Professional Voice Cloning, complete the live Voice Captcha verification, connect Stripe India, and set your Notice Period & Default Rate (~$0.03 per 1,000 characters).",
        ],
        exactToolsOrWebsites: [
          {
            name: "voquent.com/voice-actors (100% Free ₹0 Registration)",
            role: "Global Human Voiceover Directory Paying Direct Project Rates",
            insiderTip:
              "Unlike sites that charge monthly membership fees, Voquent lets you list multiple categorized 30-second audio demos for ₹0.",
          },
          {
            name: "elevenlabs.io/app/voice-library (Requires Paid Creator Tier for PVC)",
            role: "Passive AI Voice Cloning Royalties (~$0.03 / 1,000 chars via Stripe)",
            insiderTip:
              "Only buy the Creator tier once you have already recorded and cleaned 45–60 minutes of crystal-clear audio ready to upload on Day 1.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste 30-Second Demo Script for Voquent / ElevenLabs Audition",
          content:
            "Read this warmly at a steady, natural pace (Fan OFF, phone 6 inches away at a 45-degree angle):\n\n\"Every great journey in India begins with a single story. Whether you are building a modern technology brand, narrating a documentary, or guiding learners through a new skill, the right voice builds instant trust. Clear, warm, and natural—let's bring your script to life.\"",
        },
        incomeMathOrProof:
          "Real Math: On ElevenLabs PVC, 1,000,000 characters generated by global users at the standard ~$0.03/1k rate = ~$30 USD (₹2,500) passive payout. On Voquent, 1 single booked human corporate voiceover project pays $75–$200 (₹6,200–₹16,800).",
      },
      {
        chapterNumber: 3,
        title: "Paid $10 / 15-Minute Website Usability Testing (UserTesting, Trymata & Prolific — Real Facts)",
        subtitle:
          "Exact KYC requirements, how the unpaid practice test works, and realistic weekly earnings ($10–$40/week).",
        coreSecretSummary:
          "Usability testing on UserTesting.com and Trymata.com is 100% real and free to join—companies pay to watch real people try their app or website prototypes and speak their thoughts out loud in everyday English. However, let's be 100% honest about how it works: you do NOT get 20 tests a day. You must answer short 1-minute screener questions, and you will typically match with 1 to 4 tests per week ($10 per 15–20 minute test, paid via PayPal exactly 14 days after each test).",
        whereToFindOrHiddenTrick:
          "REAL SIGNUP URLS & APPROVAL RULES: (1) usertesting.com/get-paid-to-test → Click 'Get started' → Enter email. (2) trymata.com/get-paid-to-test. (3) app.prolific.com/register/participant (Academic & AI studies from top universities; requires government ID verification and a short waitlist, but pays GBP £6–£10/hr with zero screener rejections once a study appears on your dashboard).",
        stepByStepExecution: [
          "Step 1 (Complete Indian PayPal KYC First): Before applying, make sure your PayPal account has your PAN card and Indian bank account verified so it can receive international USD/GBP payouts without holds.",
          "Step 2 (Pass the Unpaid 7-Minute Practice Test on UserTesting): UserTesting gives you 1 practice task first. Human reviewers reject people who click silently. Speak continuously every 2–3 seconds explaining WHY you are clicking or what confuses you.",
          "Step 3 (Never Lie on Screener Surveys): Before each $10 test, you answer 3–5 multiple-choice screener questions (e.g., 'Do you shop online for fashion?' or 'Do you use Canva/Excel at work?'). Always answer 100% honestly—contradicting your profile gets your account banned.",
          "Step 4 (Pin the Dashboard Tab Between 7 PM – 11:30 PM IST): Most US/UK companies launch tests during their morning hours (evening in India). Keep the UserTesting & Prolific tabs open on your laptop browser with audio notifications ON.",
        ],
        exactToolsOrWebsites: [
          {
            name: "usertesting.com/get-paid-to-test",
            role: "$10 USD per 15–20 Minute Recorded Website/App Test",
            insiderTip:
              "Every $10 payout is sent automatically to your PayPal account exactly 14 days down to the hour after you submit the test.",
          },
          {
            name: "prolific.com",
            role: "Verified University & AI Research Studies (Pays in GBP £ via PayPal)",
            insiderTip:
              "Install the official 'Prolific Assistant' Chrome/Firefox extension—it alerts you the second a new study with open spots goes live.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "The Exact 'Think-Out-Loud' Formula to Pass the UserTesting Practice Review",
          content:
            "Use this exact speaking rhythm during your practice test:\n1. Read the task prompt out loud word-for-word first.\n2. Narrate your search: \"I am scanning the top navigation bar to find [Target]... I see [Button A] and [Button B], so I am going to click [Button A] because I expect it to show...\"\n3. Give constructive feedback: \"This page loaded quickly and the heading is clear, but I wish the filter button on the left was more visible.\"",
        },
        incomeMathOrProof:
          "Realistic Math: 2 approved UserTesting sessions/week ($20) + 3 Prolific studies/week ($15) = $35/week (~₹12,000/month) in verified PayPal payouts with ₹0 investment.",
      },
      {
        chapterNumber: 4,
        title: "Adobe Stock AI Contributor (100% Free ₹0 Signup + Real AI Submission Rules)",
        subtitle:
          "How to legally upload 4MP+ Indian Festive & Copy-Space AI Backgrounds to Adobe Stock for passive USD royalties.",
        coreSecretSummary:
          "Unlike social media where you need followers, Adobe Stock (contributor.stock.adobe.com) is a search engine where graphic designers, wedding invitation printers, and ad agencies buy backgrounds every day. Adobe Stock is 100% free to join and officially accepts AI-generated images—provided you follow their 3 strict technical rules: (1) Minimum resolution of 4 Megapixels (e.g., 2500 × 1600 px or 4000 × 2666 px), (2) Tick the mandatory 'Created using generative AI tools' checkbox, and (3) Never use real brand names or trademarked words in your title.",
        whereToFindOrHiddenTrick:
          "THE HIGH-DEMAND INDIAN COPY-SPACE NICHE: Search Adobe Stock for 'Indian wedding invitation background copy space' or 'Diwali luxury background empty center'. Graphic designers across India, the UAE, UK, and USA buy clean horizontal and vertical backgrounds that have 60% empty space in the middle or left side where they can type their client's event details!",
        stepByStepExecution: [
          "Step 1 (Sign Up Free at contributor.stock.adobe.com): Create a free Adobe ID, complete your contributor profile, and upload your tax form (W-8BEN takes 2 minutes online for Indian residents so US withholding tax is reduced).",
          "Step 2 (Generate Text-Free Copy-Space Backgrounds): Use Midjourney, Flux, or Leonardo AI to generate ultra-clean Indian festive, royal arch, mandala, and minimalist marble/silk backgrounds with NO text or letters inside the image.",
          "Step 3 (Upscale to 4000px+ Before Uploading): Raw AI images are often 1024×1024 (1 Megapixel), which Adobe Stock will reject! Use free Upscayl.org (desktop) or iloveimg.com/upscale-image to upscale every image to 4000×2666 px (10+ Megapixels) and save as high-quality JPEG.",
          "Step 4 (Check the AI Disclosure Box & Add 25 Tags): Upload on contributor.stock.adobe.com → Select Category: 'Graphic Resources / Backgrounds' → Tick 'Created using generative AI tools' → Add 25 descriptive English keywords → Submit for moderation.",
        ],
        exactToolsOrWebsites: [
          {
            name: "contributor.stock.adobe.com",
            role: "Official Free-to-Join Global Stock Portal (Pays 33% Royalty in USD)",
            insiderTip:
              "Once your earnings reach $25 USD, you can withdraw directly to Payoneer or PayPal.",
          },
          {
            name: "upscayl.org / iloveimg.com/upscale-image",
            role: "Free Image Upscaler to Pass Adobe's 4MP–100MP Requirement",
            insiderTip:
              "Zoom in to 100% before uploading to make sure there are no weird AI artifacts in the corners.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste AI Prompt for High-Approval Adobe Stock Copy-Space Backgrounds",
          content:
            "Ultra-clean 8k commercial background of a royal Indian emerald green and warm ivory silk backdrop framed with subtle antique gold zari floral corners, 65% completely blank smooth empty copy space in the center for text overlay, soft even studio lighting, no text, no letters, no watermark, photorealistic graphic design resource.",
        },
        incomeMathOrProof:
          "Building a portfolio of 150–200 high-utility Indian festive & corporate copy-space backgrounds generates ongoing passive USD royalties ($0.33 to $2.64 per download) year-round.",
      },
      {
        chapterNumber: 5,
        title: "100% Free Verified Certificates (Harvard CS50x & Forage), LinkedIn Real Filter & ₹150 Pharmacy Salts",
        subtitle:
          "Exact verified free portals for your CV + the real 1mg.com 'Salt Composition' trick for dermatologist-grade skincare.",
        coreSecretSummary:
          "Every portal and product in this final chapter is 100% verifiable in 30 seconds: (1) TheForage.com gives you 100% free virtual job simulations from Tata Group, JPMorgan, BCG & Deloitte with an instant completion certificate, (2) Harvard's official cs50.harvard.edu/x portal gives a 100% free verified certificate when you score 70%+ on assignments (no edX payment needed), (3) LinkedIn's 'Posts -> Past 24 hours' filter lets you DM founders who just posted a job, and (4) 1mg.com's 'Salt Composition' link reveals ₹150–₹250 regulated Indian pharma equivalents for ₹2,000 serums.",
        whereToFindOrHiddenTrick:
          "EXACT REAL CLICK-PATHS: (1) LinkedIn: Type '\"hiring\" AND (\"remote\" OR \"intern\")' in top search bar → Click 'Posts' tab → Click 'Date posted' dropdown → Select 'Past 24 hours' → Click 'Show results'. (2) 1mg.com: Search any expensive cream/serum → Look right below the product title for the clickable 'SALT COMPOSITION' link → Click it to view regulated pharma tubes from Cipla, Micro Labs, or Glenmark.",
        stepByStepExecution: [
          "Step 1 (Free Corporate Job Simulation on TheForage.com): Go to theforage.com → Sign up free → Complete the 4-hour 'Tata Group Data Visualization' or 'BCG Strategy' simulation → Add the official credential to your LinkedIn Experience/Certifications.",
          "Step 2 (Free Harvard Certificate via Direct Portal): Go to cs50.harvard.edu/x (do NOT pay on edX!) → Log in with GitHub → Submit the problem sets & final project scoring 70%+ to download your free verifiable Harvard CS50x Certificate.",
          "Step 3 (Indian Pharmacy Generic Skincare Reference — Always Patch Test): For Post-Acne Dark Spots -> 'Aziderm 10% Cream' (Micro Labs, ~₹245). For Dullness/Tan (use 2 nights/week + SPF 50 next morning) -> 'Glyco 6 Cream' (Micro Labs, ~₹200). For Oil-Free Hydration on damp skin -> 'Hyalugel' (Ethicare, ~₹250).",
          "Step 4 (10-Minute Study Mastery with Google NotebookLM): Open notebooklm.google.com (100% free) → Upload your course PDFs or YouTube links → Click 'Audio Overview' to generate a 2-host podcast summary.",
        ],
        exactToolsOrWebsites: [
          {
            name: "theforage.com & cs50.harvard.edu/x",
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
          label: "Copy-Paste LinkedIn 'Posts -> Past 24 Hours' Direct Outreach Message",
          content:
            "\"Hi [Name], saw your post from a few hours ago regarding the [Role Name] opening! Instead of just sending a standard resume, I put together a 1-page sample specifically for [Company Name] (attached), along with my recent [Tata Group Forage / Harvard CS50x] project credential. Happy to complete a short trial task if you are shortlisting this week!\"",
        },
        incomeMathOrProof:
          "Saves ₹20,000+ in unnecessary course fees and ₹12,000+/year in overpriced skincare while getting 5x higher interview replies on LinkedIn.",
      },
    ],
    twentyFourHourChecklist: [
      "Download this 12pt White-Label PDF using the 'Download White-Label PDF (.pdf)' button.",
      "Open dir.indiamart.com → Filter by City (Surat/Jaipur) + Business Type (Manufacturer) + TrustSEAL → Create 1 WATERMARKED Before/After sample (never send unwatermarked work or full catalogs without 50% advance!).",
      "Create your free profile on usertesting.com/get-paid-to-test & prolific.com (with KYC-verified Indian PayPal) OR voquent.com/voice-actors (100% free ₹0 voice portal).",
      "Upload 5 upscaled 4000px+ Indian festive copy-space backgrounds to contributor.stock.adobe.com (tick 'Created using generative AI tools').",
      "Complete 1 free corporate simulation on theforage.com and test the LinkedIn 'Posts → Date posted: Past 24 hours' filter.",
    ],
  },
  reelBlueprint: {
    sixSecondVideoIdea: {
      visualStyle:
        "6-Second Dark Aesthetic Clip (Laptop Screen in Dark Room / Coffee Pour / Smooth Scroll of This 12pt Underground Vault PDF)",
      shotByShot: [
        "0.0s – 2.0s: Dark moody aesthetic shot of laptop glowing or iced coffee pour with bold Price-Comparison text overlay.",
        "2.0s – 4.5s: Smooth screen recording scrolling through this 12pt PDF showing 'ElevenLabs Voice Royalties, IndiaMART Factory Filter & $10/15-Min Testing'.",
        "4.5s – 6.0s: Quick flash of the ₹29 (vs ₹2,499) instant download page with text: 'Comment VAULT for the direct link before I archive this'.",
      ],
      lightingAndAudioTip:
        "Keep the video strictly 6 seconds so viewers loop it 2–3 times while reading the text overlay. Toggle ON 'Trial Reel' before posting so Instagram pushes it to non-followers!",
    },
    psychologicalPriceOverlays: [
      {
        triggerType: "1. Daily Snack Price-Comparison Trigger (Zero-Resistance Impulse)",
        overlayText:
          "\"1 Plate Momos = Rs 60 (Gone in 5 mins). This 1% Underground Vault = Rs 29 (Gives you 5 verified USD royalty & B2B portals nobody shares for free). Choice is yours.\"",
        whyItConverts:
          "Makes ₹29 feel smaller than street food while promising rare, non-generic portals (ElevenLabs, IndiaMART, UserTesting).",
      },
      {
        triggerType: "2. The 'No Affiliate / No Generic Fluff' Hook",
        overlayText:
          "\"Tired of everyone telling you to do affiliate marketing or surveys? Here are 5 underground USD royalty & B2B portals that actually work in 2026–2027.\"",
        whyItConverts:
          "Immediately stands out from 99% of Instagram reels by calling out how tired people are of generic advice.",
      },
      {
        triggerType: "3. Extreme FOMO / Gatekeeping Hook",
        overlayText:
          "\"From getting paid passive USD royalties for your voice on ElevenLabs to the IndiaMART factory trick & free Harvard certificates—comment 'VAULT' before I delete this.\"",
        whyItConverts:
          "Names specific, intriguing mechanisms that force curious viewers to save the reel and comment immediately.",
      },
    ],
    autoDmCaption: `Everyone on Instagram repeats the same tired advice ("do affiliate marketing, do surveys, or cold-DM random pages"). Nobody shares the real underground portals that actually work in 2026–2027! 🤫✨\n\nInside this 12pt Simple-English Underground Vault, I have put the exact step-by-step map with 100% verified links:\n✅ System 1: Passive USD Voice Royalties on ElevenLabs Voice Library (Record once for 30 mins, zero followers needed)\n✅ System 2: The IndiaMART TrustSEAL Factory Arbitrage (Where zero creators are competing for ₹2,999 catalog orders)\n✅ System 3: $10 Per 15-Minute Speak-Out-Loud Website Testing (UserTesting, Trymata & Dscout Screener Bypass Trick)\n✅ System 4: Adobe Stock AI Cultural Vectors & PromptBase USD Marketplace\n✅ System 5: Free Verified Harvard CS50x & Tata/JPMorgan Forage Certificates + ₹150 Indian Pharmacy Generic Salt Bible\n\nToday you can get the complete 12pt PDF for just ₹29 (cheaper than a plate of momos—resets to ₹2,499 tonight).\n\n👉 Comment "VAULT" right now and my Auto-DM will send you the instant download link within 5 seconds!`,
    seoKeywords: [
      "underrated websites that feel illegal to know",
      "elevenlabs voice library passive income india",
      "usertesting india review 2026",
      "free verified certificates harvard tata forage",
      "indiamart business ideas without investment",
      "adobe stock ai contributor india",
      "indian pharmacy skincare dupes list",
      "unique side hustles india no affiliate",
      "how to find b2b clients in india",
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

