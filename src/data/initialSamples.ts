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
  id: "sample-ebook-genz-playbook-2026",
  createdAt: new Date().toISOString(),
  topicInput:
    "WhatsApp Client Closing, 6-Second Trial-Reel PDFs, $10 Website Testing & Free Harvard/Tata Credentials (Zero Followers Needed)",
  category: "All",
  priceDisplay: "₹29",
  anchorPriceDisplay: "₹2,499",
  autoDmTrigger: "SECRET",
  ebook: {
    editionTag: "PRIVATE 2026 PLAYBOOK · NO GATEKEEPING · ZERO FLUFF",
    title:
      "The Zero-Gatekeeping 2026 Playbook: WhatsApp Closing, Trial-Reel PDFs & Real Free Portals",
    subtitle:
      "5 real shortcuts, exact clickable filters & copy-paste messages you can actually use from your phone tonight.",
    targetReaderPromise:
      "Every link, search filter, and copy-paste message inside this playbook is 100% real and checked—written in plain everyday English so you can start today with ₹0 and zero followers.",
    goldenRuleTitle: "Real Talk Before You Start (The #1 Rule)",
    goldenRuleBody:
      "Skip the crowded generic advice everyone repeats on YouTube. Pick just ONE play from this guide, follow the 4 exact steps cleanly, and always protect your time with the 1-photo watermarked preview + 50% UPI advance rule.",
    hardestPartSolvedBox: {
      title:
        "The Hardest Part Solved: 4 Exact Links & Hidden Filters (Save Hours)",
      exactWhereToFindMap: [
        "1. Google Maps '40+ Reviews, No Website' Filter: Search 'Dental Clinic', 'Skin Studio', or 'Salon' in any city on Google Maps → Pick places with 40+ reviews and NO 'Website' button → Pitch a ₹2,999 1-Page WhatsApp Booking Menu.",
        "2. Meta Ad Library Active-Brand Filter (facebook.com/ads/library): Select 'India' → 'All Ads' → Type your niche keyword → Filter by 'Active' ads running 14+ days to find brands already spending money right now.",
        "3. UserTesting & Prolific ($10 / 15-Min Website Testing): Sign up free at usertesting.com/get-paid-to-test and app.prolific.com with a KYC-verified Indian PayPal (PAN + Bank linked). Pays $10 USD via PayPal 14 days after each approved test.",
        "4. LinkedIn 'Past 24 Hours' Post Filter + TheForage.com: Finish a free 4-hour Tata or JPMorgan simulation on theforage.com. Then on LinkedIn search '\"hiring\" AND \"remote\"' → Click 'Posts' tab → 'Date posted' → 'Past 24 hours'.",
      ],
      zeroFollowerTrafficTrick:
        "Never send free unwatermarked work! Take 1 public photo from a local clinic or brand, send 1 watermarked Before/After preview ('CUSTOM PREVIEW'), and take 50% UPI advance before making the full pack.",
    },
    quickValueBreakdown: [
      {
        metric: "1. What You Skip",
        detail:
          "No bidding against 500 people on crowded freelance apps—go straight to direct Google Maps, Meta & LinkedIn filters.",
      },
      {
        metric: "2. Anti-Scam 50% Rule",
        detail:
          "Send only 1 watermarked sample first; never send final files before a 50% UPI advance hits your account.",
      },
      {
        metric: "3. 100% Free (₹0) Sites",
        detail:
          "Every site inside (Google Maps, Meta Ad Library, UserTesting, Prolific, Forage, Harvard CS50x) is ₹0 to start.",
      },
      {
        metric: "4. Copy-Paste Messages",
        detail:
          "Ready-to-send WhatsApp messages, 6s Reel text hooks, and exact 1mg pharmacy salt names.",
      },
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: "WhatsApp Client Closing With the 1-Photo Watermarked Preview",
        subtitle:
          "₹0 to start · how to get local clinics, salons & brands to pay 50% UPI advance without begging",
        coreSecretSummary:
          "Most beginners send 100 boring DMs saying 'Hi Sir, I make websites/designs, please hire me'—and get left on seen every time. Nobody replies to text pitches anymore, but a business owner will ALWAYS open a Before/After image of their own shop looking 10x cleaner. Showing them what they're missing works way faster than explaining it.",
        whereToFindOrHiddenTrick:
          "Open Google Maps and search 'Dental Clinic', 'Skin Clinic', or 'Boutique' in any busy neighbourhood—or open facebook.com/ads/library (Country: India -> Active Ads). Pick places with 40+ real Google reviews (so you know they already make money) that either have NO website button or super dull photos.",
        stepByStepExecution: [
          "1. Setup: Pick 5 high-review local shops on Google Maps or active brands on facebook.com/ads/library. Save 1 public photo or price list from their profile.",
          "2. The Move: Redesign that 1 photo in free Canva into a crisp WhatsApp Booking Card or Ad Post, and put a big 40%-opacity diagonal watermark across the middle: 'PREVIEW FOR [SHOP NAME]'.",
          "3. Scale It: WhatsApp that watermarked image straight to their business number with the short copy-paste message below, offering a ₹250 single unlock or a ₹2,999 complete pack.",
          "4. Stay Safe: Always stick to the 50% UPI Advance rule—take ₹1,500 via UPI before building the rest, and send the clean unwatermarked files only after the remaining 50% is paid.",
        ],
        exactToolsOrWebsites: [
          {
            name: "google.com/maps & facebook.com/ads/library (Free ₹0)",
            role: "Find Busy Local Clinics, Salons & Active Indian Brands",
            insiderTip:
              "Places with 40+ reviews already have daily customers—they immediately get why a clean WhatsApp booking card helps.",
          },
          {
            name: "canva.com & carrd.co (Free Tier)",
            role: "Make the 1-Page Watermarked Preview & Simple Booking Page",
            insiderTip:
              "Put your light watermark right across the center so nobody can crop and use your unpaid sample.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste WhatsApp Message",
          content:
            "Attach your 1 Watermarked Before/After image and send:\n\n\"Hey [Business Name] team! Saw your 45+ awesome Google reviews, and noticed there's no quick 1-tap WhatsApp menu/booking page on your listing yet.\n\nMade a quick custom preview specifically for [Business Name] (attached with watermark). Happy to unlock this single graphic for ₹250 today, or build your full 10-page WhatsApp Kit for ₹2,999 (50% advance, 50% on delivery). Let me know which works better!\"",
        },
        incomeMathOrProof:
          "Real Math: 2 local clinic or brand packs/week × ₹2,999 = ₹5,998/week × 4 weeks = ₹23,992/month (with 50% UPI advance safety and 0 followers).",
      },
      {
        chapterNumber: 2,
        title: "The 6-Second Trial-Reel & Snack-Price Auto-DM PDF Setup",
        subtitle:
          "works at 0 followers · turn short casual phone clips into automatic daily UPI sales",
        coreSecretSummary:
          "Most people spend 5 hours filming complicated videos and wait months to hit 10K followers before earning ₹1. On 2026 Instagram, the built-in 'Trial Reel' toggle shows your clip to 100% non-followers first—so a super simple 6-second casual clip with a relatable 2-line text gets replayed 2.5x while people read and comment for the link.",
        whereToFindOrHiddenTrick:
          "Keep the video strictly around 6 seconds with a chill, natural text hook comparing a ₹29 PDF to a ₹60 plate of momos. People take 12 seconds to read it—so the clip loops twice automatically, Instagram pushes it to thousands of non-followers, and Auto-DM sends your UPI checkout link in 5 seconds.",
        stepByStepExecution: [
          "1. Setup: Download your clean 5-part playbook as a PDF and upload it to SuperProfile.bio, Cosmofeed, or Gumroad so buyers can pay via GPay/PhonePe in 8 seconds.",
          "2. The Move: Film a raw 6-second everyday clip (making chai, tying hair, messy bed phone scroll), add a casual lowercase text hook, and switch ON 'Trial Reel' before posting.",
          "3. Scale It: Connect free Auto-DM (SuperProfile Auto-DM or ManyChat) to a 1-word comment ('SECRET') so everyone who comments gets your link in their DM automatically.",
          "4. Stay Safe: Add a ₹99 'Full 3-Guide Bundle' checkbox on checkout—around 30% of ₹29 buyers tick it, boosting your daily payout without extra effort.",
        ],
        exactToolsOrWebsites: [
          {
            name: "superprofile.bio / cosmofeed.com (Free Setup)",
            role: "Instant Indian UPI Checkout + Auto Comment-to-DM Delivery",
            insiderTip:
              "Turn on 1-tap UPI checkout so people on mobile finish paying in under 8 seconds.",
          },
          {
            name: "Instagram 'Trial Reel' Toggle (Built-In Free)",
            role: "Tests Your 6s Clip on 100% Non-Followers First",
            insiderTip:
              "Use max 5 niche lowercase hashtags and keep the clip between 5.5 and 6.5 seconds.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste 6s Reel Overlay Text",
          content:
            "\"we spend ₹60 on momos in 5 mins without thinking 😭 kept this full 5-part cheat-sheet at ₹29 (real links + copy-paste scripts inside) — comment 'SECRET' & check your DM in 5 sec\"",
        },
        incomeMathOrProof:
          "Real Math: 15 PDF sales/day × ₹29 = ₹435/day × 30 days = ₹13,050/month (plus optional ₹99 bundle upgrades) running automatically while you sleep.",
      },
      {
        chapterNumber: 3,
        title: "Paid $10 / 15-Min Website Testing (UserTesting & Prolific)",
        subtitle:
          "₹0 signup · how to pass the practice test on try #1 using the non-stop talking rule",
        coreSecretSummary:
          "Most people waste evenings on 10-cent survey apps that kick them out on the last question. Real usability sites like UserTesting.com and Trymata.com pay a flat $10 USD for a 15-minute screen recording where you test a normal website and talk out loud—and Prolific.com pays £6–£10/hr GBP for university studies with zero mid-study disqualifications.",
        whereToFindOrHiddenTrick:
          "Sign up free at usertesting.com/get-paid-to-test, trymata.com/get-paid-to-test, and app.prolific.com/register/participant. 80% of people fail the 7-minute practice test because they stay quiet while clicking. The real trick: talk every 2–3 seconds saying what you expect a button to do BEFORE you click it.",
        stepByStepExecution: [
          "1. Setup: Verify your Indian PayPal account with your PAN card and Indian bank account first so international USD/GBP payouts land smoothly.",
          "2. The Move: Record the 7-minute unpaid UserTesting practice test in a quiet room (turn off the ceiling fan) using the simple 3-line speaking rhythm below.",
          "3. Scale It: Keep UserTesting and Prolific (with the free 'Prolific Assistant' browser extension) open between 7:30 PM and 11:30 PM IST when US/UK teams post fresh tests.",
          "4. Stay Safe: Answer every quick screener question honestly—consistent answers keep your rating at 4.8★+ so you keep getting $10 invites (paid automatically 14 days after each test).",
        ],
        exactToolsOrWebsites: [
          {
            name: "usertesting.com/get-paid-to-test (Free ₹0)",
            role: "$10 USD per 15–20 Min Recorded Website Test",
            insiderTip:
              "Every $10 lands automatically in PayPal exactly 14 days down to the hour after you finish a test.",
          },
          {
            name: "prolific.com (Free ₹0)",
            role: "University & AI Research Studies (Pays GBP £ via PayPal)",
            insiderTip:
              "Install the official 'Prolific Assistant' Chrome extension so it pings you the second a new spot opens.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste Speaking Rhythm (Pass Practice Test #1)",
          content:
            "Follow this simple rhythm during your practice test:\n1. Read the task out loud word-for-word first.\n2. Narrate before clicking: \"I'm scanning the top menu to find [Target]... I see [Button A] and [Button B], I'll click [Button A] because I expect it to open...\"\n3. Give honest feedback: \"This page loaded fast and looks clean, though the filter button on the left was a bit hard to spot.\"",
        },
        incomeMathOrProof:
          "Real Math: 3 UserTesting sessions/week × $10 = $30/week × 4 weeks = $120/month (× ₹85 = ₹10,200/month) via PayPal with ₹0 upfront cost.",
      },
      {
        chapterNumber: 4,
        title: "Adobe Stock AI Backgrounds (The 60% Empty-Space Trick)",
        subtitle:
          "₹0 to join · upload clean Indian festive & wedding backgrounds for passive USD royalties",
        coreSecretSummary:
          "Beginners upload random AI portraits of people and get rejected immediately. Graphic designers and wedding invite makers on Adobe Stock (contributor.stock.adobe.com) actually search for clean Indian festive and silk backgrounds that leave 60% blank empty space in the middle so they can type their own text over it.",
        whereToFindOrHiddenTrick:
          "Search Adobe Stock for 'Indian wedding invitation background copy space' or 'Diwali background empty center' to see what actually sells. Leave 60% smooth blank space in the center, upscale to 4000px+, and Adobe pays you 33% USD royalty every time someone downloads it.",
        stepByStepExecution: [
          "1. Setup: Create a free contributor account at contributor.stock.adobe.com and fill out the 2-minute online W-8BEN tax form (lowers US tax withholding for India).",
          "2. The Move: Generate super clean Indian festive, arch, silk, and minimalist marble backgrounds with 60% empty center space and zero text inside the image.",
          "3. Scale It: Upscale every image to 4000×2666 px (10+ MP) using free upscayl.org or iloveimg.com/upscale-image so it easily passes Adobe's 4MP minimum rule.",
          "4. Stay Safe: Tick the required 'Created using generative AI tools' box, avoid brand names in titles, and add 25 clean English search keywords.",
        ],
        exactToolsOrWebsites: [
          {
            name: "contributor.stock.adobe.com (Free ₹0)",
            role: "Global Stock Portal (Pays 33% Royalty in USD)",
            insiderTip:
              "Withdrawals unlock at $25 USD directly to Payoneer or PayPal.",
          },
          {
            name: "upscayl.org / iloveimg.com/upscale-image (Free)",
            role: "Free Image Upscaler to Pass Adobe's 4MP Rule",
            insiderTip:
              "Zoom to 100% before submitting to make sure the corners look clean.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste Empty-Space Image Prompt",
          content:
            "Ultra-clean 8k commercial background of a royal emerald green and warm ivory silk backdrop framed with subtle antique gold floral corners, 65% completely blank smooth empty space in the center for text, soft even studio lighting, no text, no letters, no watermark.",
        },
        incomeMathOrProof:
          "Once you upload 150–200 clean Indian festive & wedding empty-space backgrounds, downloads earn passive USD ($0.33 to $2.64 each) all year round.",
      },
      {
        chapterNumber: 5,
        title: "Free Harvard/Tata Certificates, LinkedIn 24-Hr Filter & ₹150 Pharmacy Skincare",
        subtitle:
          "₹0 resume upgrades + the 1mg.com Salt Composition trick for ₹200 chemist dupes",
        coreSecretSummary:
          "Most students pay ₹25,000 for random coaching certificates, apply to month-old job listings with 2,000 applicants, and spend ₹3,000 on hyped Instagram serums. You can actually grab official Tata/JPMorgan/Harvard credentials for ₹0, DM hiring founders within 24 hours on LinkedIn, and buy the exact same active skincare ingredients at a local Indian medical store for ₹200.",
        whereToFindOrHiddenTrick:
          "Two quick real click-paths: (1) On LinkedIn type '\"hiring\" AND (\"remote\" OR \"intern\")' → Click 'Posts' tab (NOT Jobs!) → Click 'Date posted' → Select 'Past 24 hours'. (2) On 1mg.com search any expensive cream/serum → Click the 'SALT COMPOSITION' link right under the name to see ₹150–₹250 regulated pharma equivalents.",
        stepByStepExecution: [
          "1. Setup: Go to theforage.com and finish a free 4-hour 'Tata Group' or 'JPMorgan' virtual job simulation, or go straight to cs50.harvard.edu/x (skip paid edX!) for a free verifiable Harvard CS50x certificate.",
          "2. The Move: Check the LinkedIn 'Posts -> Date posted: Past 24 hours' filter every morning to message founders who just posted their hiring email live.",
          "3. Scale It: Look up Indian pharmacy skincare salts on 1mg.com (always do a 24-hr inner-forearm patch test): Dark spots -> 'Aziderm 10% Cream' (~₹245, Micro Labs); Tan/dullness (max 2 nights/week + SPF 50 next morning) -> 'Glyco 6 Cream' (~₹200, Micro Labs); Hydration on damp skin -> 'Hyalugel' (~₹250, Ethicare).",
          "4. Stay Safe: Upload your study or interview PDFs to notebooklm.google.com (100% free) → Click 'Audio Overview' to turn boring notes into a 2-host audio summary in 3 minutes.",
        ],
        exactToolsOrWebsites: [
          {
            name: "theforage.com & cs50.harvard.edu/x (Free ₹0)",
            role: "Free Verifiable Corporate & Harvard Credentials",
            insiderTip:
              "Forage even gives you pre-written resume bullet points approved by the company once you finish.",
          },
          {
            name: "1mg.com (Salt Composition) & notebooklm.google.com",
            role: "Indian Pharma Ingredient Lookup & Free AI Study Audio",
            insiderTip:
              "Never layer Glycolic Acid (Glyco 6) and Azelaic Acid (Aziderm) on the same night, and always wear SPF 50 the next morning.",
          },
        ],
        copyPasteTemplateOrScript: {
          label: "Copy-Paste LinkedIn Founder DM",
          content:
            "\"Hey [Name], saw your post a few hours ago about the [Role Name] opening! Instead of just dropping a generic CV, I put together a quick 1-page sample for [Company Name] (attached) along with my recent [Tata Group Forage / Harvard CS50x] project. Would love to do a short trial task if you're shortlisting this week!\"",
        },
        incomeMathOrProof:
          "Easily saves ₹20,000+ on unnecessary courses and ₹12,000+/year on overpriced skincare while getting way faster interview replies on LinkedIn.",
      },
    ],
    twentyFourHourChecklist: [
      "Download this clean White-Label PDF using the 'Download PDF' button.",
      "Open Google Maps or facebook.com/ads/library → Pick 5 busy local clinics or active brands → Send 1 watermarked preview (take 50% UPI advance before doing full work!).",
      "Sign up free on usertesting.com/get-paid-to-test & prolific.com (with KYC-verified Indian PayPal).",
      "Upload 5 upscaled 4000px+ Indian festive empty-space backgrounds to contributor.stock.adobe.com.",
      "Finish 1 free Tata/JPMorgan simulation on theforage.com and test the LinkedIn 'Posts → Past 24 hours' filter.",
    ],
  },
  reelBlueprint: {
    aiVideoPrompts: {
      rawPhoneFirstFramePrompt:
        "Vertical 9:16 candid real-life smartphone photo (iPhone 15 Pro, 24mm f/1.8, natural everyday phone grain). Scene: a real slightly messy Indian hostel/bedroom bed at 1 AM with a crumpled cotton bedsheet, warm yellow fairy lights on the wall behind, a phone charger cable draped over the pillow, and a smartphone held casually in one hand. Feels like a genuine 1am real-talk story from a friend. Leave the upper-middle 35% of the frame clean and uncluttered so short white lowercase Instagram text reads easily. STRICT ZERO-AI-SLOP: NO neon purple/blue cyber lights, NO glossy plastic skin, NO generic corporate 'clean organized workspace + coffee cup' stock look, NO CGI 3D renders, NO garbled text on screens.",
      zeroSlopVideoMotionPrompt:
        "6-second vertical 9:16 raw handheld phone video (Kling / Veo / Runway / Flow AI). Visual: messy Indian bedroom bed at 1 AM under soft warm fairy lights with a real brown-skinned hand casually scrolling clean dark-mode notes on a smartphone. Camera & Motion: subtle natural handheld breathing sway, authentic 30fps phone grain, calm casual friend-sharing-a-shortcut vibe, zero dramatic swoops, zero morphing, seamless 6-second loop. NO neon glow, NO plastic skin, NO clean corporate workspace clichés.",
      relatablePovBrollPrompt:
        "6-second relatable everyday 9:16 Indian Gen-Z POV clip: sitting cross-legged on a cotton bedsheet at night closing 10 confusing browser tabs, taking a quiet sip of chai, and opening one clean 5-part cheat-sheet on a phone. Vibe: honest relief after finally figuring out what actually works—zero commercial ad look, zero corporate polish. Clean upper-center space for short text ('₹29' / comment 'SECRET').",
      algorithmTriggerNote:
        "Looks 100% like an unedited late-night friend's story—not an ad. Viewers recognize their own 1 AM room vibe, pause to read your 2-line lowercase text twice (2.5x loop), save it, and comment 'SECRET'.",
    },
    sixSecondVideoIdea: {
      visualStyle:
        "Casual Getting-Ready / Tying Hair Up Drop (Looks 100% Like a Bestie's Story — Zero Ad Feel)",
      shotByShot: [
        "0.0s – 2.0s: Raw front-camera clip of you tying your hair up / putting on lip balm in normal room light; short lowercase text sits center-top: \"honestly mad nobody told me these 5 sites 6 months ago 😭\"",
        "2.0s – 4.3s: Quick raw phone screen scroll showing your clean 5-part PDF notes (Google Maps filter, $10 UX testing, free Harvard CS50x, ₹150 chemist salts) with most lines blurred so viewers lean in.",
        "4.3s – 6.0s: Cut back to a chill half-smile grabbing your bag: \"put all 5 exact links + copy-paste messages in a ₹29 pdf so you don't waste months — comment 'SECRET'\"",
      ],
      lightingAndAudioTip:
        "Keep it strictly 5.8–6.2 seconds with a soft trending chill track at 10% volume. Use small clean white Instagram Sans text (NOT giant yellow ad banners!) and switch ON 'Trial Reel' to hit 100% non-followers.",
    },
    psychologicalPriceOverlays: [
      {
        triggerType: "1. Relatable Real-Talk Hook",
        overlayText:
          "honestly mad nobody told me this earlier 😭 wasted months saving motivation reels when the actual 5 links take 15 mins to read",
        whyItConverts:
          "Sounds 100% like a real friend venting—zero ad tone, stops the scroll immediately.",
      },
      {
        triggerType: "2. No-Gatekeeping Curiosity Hook",
        overlayText:
          "people literally charge ₹4,999 in webinars to gatekeep the Google Maps client trick, $10 website testing, free Harvard cert & ₹150 pharmacy salts. put all 5 in a ₹29 pdf — comment 'SECRET'",
        whyItConverts:
          "Calls out overpriced gurus and teases exact real things inside so curious viewers comment fast.",
      },
      {
        triggerType: "3. Chill Snack-Price Drop",
        overlayText:
          "we spend ₹60 on momos or ₹120 on iced coffee without blinking, so I kept this whole guide at ₹29 (instead of ₹2,499) so you don't overthink it",
        whyItConverts:
          "Natural, warm comparison that makes grabbing the PDF feel totally effortless.",
      },
      {
        triggerType: "4. Bestie-Send & Zero-Doubt Hook",
        overlayText:
          "zero boring gyaan, zero random motivation quotes — literally just the real links, exact filters & copy-paste scripts. save this or comment 'SECRET' 🤍",
        whyItConverts:
          "Kills 'is this just generic AI fluff?' doubt instantly while stacking both Saves and Comments.",
      },
    ],
    autoDmCaption: `honestly felt weird letting these 5 links just sit in my laptop folder while everyone on Instagram repeats the same tired "do surveys or affiliate marketing" advice 🤍\n\nI cleaned everything up into one super-easy 5-part PDF with exact links & button clicks:\n• 01: WhatsApp Client Closing + Google Maps No-Website Filter (50% UPI advance rule)\n• 02: 6-Second Trial-Reel & Auto-DM PDF Setup (works at 0 followers)\n• 03: $10 / 15-Min Speak-Out-Loud Website Testing (UserTesting & Prolific)\n• 04: Adobe Stock Empty-Space AI Backgrounds (passive USD)\n• 05: Free Harvard CS50x & Tata Forage Credentials + ₹150 Pharmacy Skincare Salt List\n\nzero boring textbook talk — literally takes 15 mins to read on your phone tonight.\n\nkept it at ₹29 (cheaper than a plate of momos, normally ₹2,499) so any student or beginner can grab it easily.\n\ncomment "SECRET" below and my Auto-DM will send the link straight to your inbox in 5 seconds (and save this reel so you don't lose it!).`,
    seoKeywords: [
      "useful websites nobody talks about 2026",
      "whatsapp client closing scripts india",
      "usertesting india paypal tips 2026",
      "free certificates harvard tata forage",
      "google maps local client trick india",
      "adobe stock ai backgrounds guide",
      "indian pharmacy skincare salt dupes",
      "real online skills india no scam",
      "instagram trial reels auto dm setup",
      "gatekept websites for indian students",
    ],
    hashtags: [
      "#gatekeptwebsites",
      "#smartstudentindia",
      "#realhacks2026",
      "#nogatekeeping",
      "#lockin2026",
    ],
  },
};



