var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");

// src/data/playbookData.ts
function buildMasterPrompts(outfits, backgroundDesc, conceptTitle, _howToCombineSummary) {
  const firstTop = outfits[0]?.exactKeyword || "Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti";
  const secondBottom = outfits[1]?.exactKeyword || "Women Black High Waist Stretchable Flared Bootcut Jeans";
  const thirdAccessory = outfits[2]?.exactKeyword || "Oxidized Silver Kamarbandh Waist Chain Belt & Jhumka Combo";
  const fourthCompleter = outfits[3]?.exactKeyword || "Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag";
  const outfitListText = `Piece 1: ${firstTop} | Piece 2: ${secondBottom} | Piece 3: ${thirdAccessory} | Piece 4: ${fourthCompleter}`;
  const styleStep1 = `Worn neatly fitted at the upper waist so the neckline, sleeve cut, and fabric texture of ${firstTop} stand out clearly.`;
  const styleStep2 = `High-waisted fit (${secondBottom}) worn right at the natural waistline to create a tall, elongated leg proportion.`;
  const styleStep3 = `Layered and styled cleanly (${thirdAccessory}) at the waist/neckline to lock the silhouette together.`;
  const styleStep4 = `Completed with ${fourthCompleter} worn naturally to finish the polished head-to-toe Pinterest look.`;
  const masterStyleFormula = `Pair ${firstTop} with ${secondBottom} worn high at the natural waist, add ${thirdAccessory} to define the waistline and proportion, and finish with ${fourthCompleter} for a cohesive head-to-toe editorial look.`;
  const exactOutfitLookPreviewPrompt = `NO REFERENCE IMAGE NEEDED \u2014 GENERATE DIRECTLY FROM THIS DESCRIPTION:
Create an ultra-realistic 4K vertical (9:16) 2-Panel Fashion Lookbook & Meesho Shopping Reference Board for the styling concept: "${conceptTitle}".

PANEL 1 (LEFT SIDE \u2014 60% WIDTH: COMPLETE STYLED OUTFIT WORN HEAD-TO-TOE):
Show a realistic young Indian woman (warm golden-olive skin tone, natural wavy dark hair, graceful posture) standing in a ${backgroundDesc}. She is wearing this exact 4-piece outfit combination styled together from head to toe so I can see exactly how the complete look turns out:
- PIECE 1 (TOP / KURTI): ${firstTop}. Styling detail: ${styleStep1} Show the exact neckline shape, sleeve cut, fabric weave, stitch detailing, and color saturation clearly.
- PIECE 2 (BOTTOM WEAR): ${secondBottom}. Styling detail: ${styleStep2} Show the exact high-waist rise, hip fit, leg flare/pleat drape, and hem length over the shoes.
- PIECE 3 (THIRD-PIECE LAYER / WAIST TRANSFORMER): ${thirdAccessory}. Styling detail: ${styleStep3} Show exactly how it sits on the waist/shoulders/neck over Piece 1 and Piece 2.
- PIECE 4 (BAG, JEWELRY & FOOTWEAR COMPLETER): ${fourthCompleter}. Styling detail: ${styleStep4}
OVERALL STYLING EXECUTION: ${masterStyleFormula}

PANEL 2 (RIGHT SIDE \u2014 40% WIDTH: 4 INDIVIDUAL PRODUCT CUTOUTS ON PURE WHITE BACKGROUND FOR MEESHO CAMERA SEARCH):
Display the same 4 individual pieces (${firstTop} | ${secondBottom} | ${thirdAccessory} | ${fourthCompleter}) neatly arranged vertically one below another as clean, flat-lay e-commerce catalog product photos on a pure white studio background with zero clutter. Each piece must be sharp, front-facing, and 100% clear so I can see the exact dress cut and even crop each item to search on Meesho's Image Search camera.
Photorealistic 4K editorial fashion photography, natural daylight, authentic Indian textile textures, zero text watermarks, zero distorted hands.`;
  const fullBodyStyledTryOnPrompt = `NO SCREENSHOT UPLOAD REQUIRED \u2014 GENERATE DIRECTLY:
Create a hyper-realistic 4K vertical 9:16 full-body Pinterest mirror-style fashion photograph of a stylish young Indian woman (warm Indian skin tone, effortless Aesthetic college/date-night vibe) wearing this exact complete 4-piece outfit combination inside a ${backgroundDesc}:
1. Upper Body: ${firstTop} (${styleStep1})
2. Lower Body: ${secondBottom} (${styleStep2})
3. Styling Accent / Layer: ${thirdAccessory} (${styleStep3})
4. Accessories & Completer: ${fourthCompleter} (${styleStep4})
How the outfit is styled together: ${masterStyleFormula}
Camera & Lighting: Full-body head-to-toe framing so the kurti/top length, waistline proportion, pant flare, and footwear are 100% visible. Soft natural afternoon sunlight hitting the fabric texture, realistic cotton/denim/silk folds, crisp stitching details, high-end Indian Pinterest aesthetic, 4K ultra-HD, no text or watermarks.`;
  const adityaKnightHandheldBundlePrompt = `FIRST, ASK THE USER:
1. Background Selection: Before generating the image, ask the user which realistic background they want: Realistic wall background with a plant in background / Realistic door background / Any other realistic background / Custom background provided/described by the user. [PRE-SELECTED BACKGROUND: ${backgroundDesc}]. Use the selected background exactly as requested.
2. Reference Revision / Activity Reference: After the background is selected, ask the user to provide the reference image for the desired hand/clothing-holding activity or presentation style. Use this reference specifically to understand the hand position, clothing-holding action, arrangement, angle and presentation style, while keeping the provided outfits ([${outfitListText}]) exactly as they are.
---
Create a highly realistic photorealistic faceless fashion product image inspired specifically by the FIRST reference image. Show one realistic female hand with a small partial forearm holding multiple provided outfits together (${outfitListText}) from their upper edges, exactly like a person casually holding a bundle of kurtis/clothes in one hand.
IMPORTANT: Replicate the CLOTHING PRESENTATION STYLE of the first reference, NOT the second reference.
The outfits must hang vertically downward from the hand, naturally layered and overlapping one another. Each garment should appear as a separate hanging piece, with portions of each outfit clearly visible. Arrange them in a slightly fanned/clustered formation, similar to the first reference.
ABSOLUTELY NO HANGERS, NO METAL WIRES, NO CLOTHING RACK, NO HOOKS, NO CLOSET DISPLAY, NO FULLY SPREAD-OUT DRESSES.
Use the uploaded outfit images (${outfitListText}) exactly as provided. Preserve their exact colors, prints, patterns, fabric appearance, stitching, sleeves, neckline, design and proportions. Do not redesign, merge, simplify, or transform the outfits.
The garments should have realistic fabric folds, natural weight, overlapping layers and gravity-based draping. Show only the hand and partial forearm. No face, head, hair, torso, mannequin, avatar or person. Use the background selected by the user (${backgroundDesc}), completely different from the first reference if requested. Natural realistic lighting, authentic shadows, realistic skin texture, detailed fabric texture, professional fashion-product photography, highly photorealistic. Composition: hand near the upper portion of the frame, outfits extending downward and occupying most of the frame, just like the first reference. 9:16 vertical Reel format, 4K ultra-detailed, realistic human photography, no text, no logos, no stickers, no extra objects. The key correction is: "hanging bundle held directly by hand", not "clothes displayed on hangers."`;
  const facelessMirrorAvatarPrompt = `REFERENCE ORDER: Image 1 = Background Reference ONLY (${backgroundDesc}). Image 2 onward = Outfit References ONLY (${outfitListText}).
Create a photorealistic, premium fashion image in vertical 9:16 Reel format, 4K ultra quality for the concept "${conceptTitle}".
BACKGROUND: Use Image 1 ONLY for the background (${backgroundDesc}). Recreate its environment, wall, floor, lighting, shadows, plants and overall atmosphere as closely as possible. DO NOT create, replace or choose any other background.
OUTFIT: Use Images 2 onward (${outfitListText}) to create the complete outfit on the model. Preserve every outfit piece exactly as shown \u2014 color, fabric, texture, pattern, design, fit, length and details. Combine all supplied outfit pieces naturally (${masterStyleFormula}). DO NOT add, remove or redesign any clothing.
MODEL: Use a realistic young adult female fashion model with natural proportions and realistic skin/hair. Her face must NOT be visible. She holds an iPhone/smartphone in one hand directly in front of her face, completely covering it.
POSE & COMPOSITION: Natural stylish fashion pose, full-body view, outfit clearly visible from top to bottom. No unnecessary accessories unless present in the outfit references. Vertical 9:16, premium editorial photography, realistic lighting, sharp fabric details, natural hands and fingers.
STRICTLY DO NOT: Change the outfit, add extra clothing, change colors/textures, reveal the face, add a different background, add unnecessary accessories, text, logos or watermark.
REFERENCE PRIORITY: Image 1 = Background. Image 2 onward = Outfit. Do not mix these roles.`;
  return {
    selectedBackground: backgroundDesc,
    outfitSummaryList: outfitListText,
    exactOutfitLookPreviewPrompt,
    fullBodyStyledTryOnPrompt,
    adityaKnightHandheldBundlePrompt,
    facelessMirrorAvatarPrompt,
    singleItemReplacementPrompts: {
      topReplacement: `Replace the 1st image outfit (top) with 2nd image avatar top (${firstTop}). Reel size ratio, 4k ultra quality. Only top should be there in hands of 1st image, not pant ok. Hold with both hands. use 3rd image background (${backgroundDesc}) to generate this image background. Don't generate any other background with you choice.`,
      pantReplacement: `Replace the 1st image outfit (bottom) with 2nd image avatar bottom (${secondBottom}). Reel size ratio, 4k ultra quality. Only bottom wear should be there in hands of 1st image, not anything okay. Hold with both hands. use 3rd image background (${backgroundDesc}) to generate this image background. Don't generate any other background with you choice.`,
      accessoryHandPrompt: `Maintain same 1st image background (${backgroundDesc}) & hands. Just remove the outfit, it should hold the 2nd image product (${thirdAccessory}) with one hand in a stylish way. Image size will be 9:16 always.`
    },
    ugcVideoMotionPrompts: {
      handheldClothesMotion: `No voice. Just add a slow movement like showing/shaking the hanging bundle of clothes (${outfitListText}). No face. No text. No music. It should look like UGC style, maintain everything same, it must look very real, 4K quality.`,
      mirrorAvatarMotion: `It is for ugc style, so just add slow movements to it like stepping back, styling, posing, side angle pose, touching the outfit/adjusting the outfit (${firstTop}). Aim is showing the overall look. Face should be hidden behind the iPhone as it is. Maintain same outfit, avatar, background (${backgroundDesc}). It must look real. 4k quality.`
    }
  };
}
function boostUserIdeaOptions(rawInput, category) {
  const clean = rawInput.trim();
  const catLower = (category || "").toLowerCase();
  if (catLower.includes("cert") || catLower.includes("career") || clean.toLowerCase().includes("cert") || clean.toLowerCase().includes("job") || clean.toLowerCase().includes("resume")) {
    const base = clean || "Free Verified Certifications & Remote Career";
    return [
      `12 Verified Free Certificates for ${base} (Harvard CS50x Direct Link cs50.harvard.edu/x, Tata/JPMorgan on TheForage.com & Google Skillshop)`,
      `The LinkedIn 'Past 24 Hours Posts' Boolean Filter: How to Message Hiring Managers Directly for ${base} Without Waiting in 5,000-Applicant Queues`,
      `How to Legally List Free Fortune-500 Virtual Job Simulations (Deloitte, BCG, Tata on TheForage.com) as Project Experience on Your Resume`,
      `Stop Paying \u20B925,000 for Coaching! The Complete Free ${base} Portal Map (SWAYAM IIT Modules + GitHub Student Pack) + Cold DM Scripts`
    ];
  }
  if (catLower.includes("client") || catLower.includes("traffic") || clean.toLowerCase().includes("client") || clean.toLowerCase().includes("buyer") || clean.toLowerCase().includes("indiamart")) {
    const base = clean || "Finding High-Paying B2B Clients (Zero Competition)";
    return [
      `The IndiaMART Real Filter Secret for ${base}: Use dir.indiamart.com (City: Surat/Jaipur + Business Type: Manufacturer + TrustSEAL) & Close \u20B92,999 Deals`,
      `The '1 Watermarked Photo + 50% UPI Advance' Rule for ${base}: How to Close Wholesale Manufacturers Without Ever Working for Free`,
      `Google Maps '20+ Reviews + No Website' Filter for ${base}: Exact Click-by-Click Path to Close Local Clinics & Showrooms on WhatsApp`,
      `Meta Ad Library Active-Spender Filter (facebook.com/ads/library): Find Indian Brands Already Spending Money Today & Pitch a Watermarked Sample`
    ];
  }
  if (catLower.includes("cashflow") || catLower.includes("income") || catLower.includes("earning") || catLower.includes("royalties") || clean.toLowerCase().includes("earn") || clean.toLowerCase().includes("money") || clean.toLowerCase().includes("usd")) {
    const base = clean || "Fact-Checked USD & B2B Income Systems";
    return [
      `5 Fact-Checked 2026\u20132027 Income Systems (${base}): IndiaMART 50%-Advance Catalogs, UserTesting $10 Tests, Voquent Free Voice Demos & Adobe 4MP Vectors`,
      `How to Pass the UserTesting.com & Prolific.com Screener ($10 Per 15-Minute Speak-Out-Loud Test Paid via KYC Indian PayPal)`,
      `Honest Voiceover & AI Voice Cloning Guide (${base}): Free Voquent.com Demos vs ElevenLabs Paid Creator PVC ($0.03/1,000 Chars Stripe Payout)`,
      `The IndiaMART B2B 1-Photo Watermark Arbitrage (${base}): Real UI Filters & 50% UPI Advance Scripts That Work With 0 Followers`
    ];
  }
  if (catLower.includes("hack") || catLower.includes("secret") || catLower.includes("study") || catLower.includes("skincare") || catLower.includes("glow") || catLower.includes("ebook")) {
    const base = clean || "Underrated 1% Life, Pharmacy Skincare & AI Shortcuts";
    return [
      `The \u20B9150 Indian Pharmacy Generic Salt Bible (${base}): Exact Chemist Dupes (Aziderm, Glyco-6, Hyalugel) for \u20B93,500 Luxury Brands`,
      `15 Underrated Free AI Websites & Student Perks (${base}): GitHub Student Pack, NotebookLM Audio Podcasts & Perplexity Deep Research`,
      `Speak High-Status Corporate English in 21 Days (${base}): Exact Free Voice AI Roleplay Prompts & 50 Interview Power Sentences`,
      `The Zero-Fluff 2026\u20132027 Insider Vault for ${base}: Exact Verified Websites, Search Filters & 24-Hour Action Checklist`
    ];
  }
  const fashionBase = clean || "Short Kurti";
  return [
    `${fashionBase} 30:70 Body-Math Combo: 19-Inch Fitted ${fashionBase} + 39-Inch High-Waist Bootcut Jeans + Hip-Drop Silver Kamarbandh (Makes 5'0" Look 5'5")`,
    `The \u20B91,199 Complete 4-Piece Head-to-Toe Challenge: ${fashionBase} + Wide-Leg Trousers + Statement Accessory + Bag (Review-Photo Verified)`,
    `${fashionBase} Warm Indian Skin-Glow Formula: Why Jewel-Tone Maroon/Emerald ${fashionBase} + Ivory Cream Pants Act Like a Ring-Light on Camera`,
    `1 ${fashionBase} Styled 3 Unexpected Ways: Strict-Mom Family Look vs Boss-Intern Look vs Cafe Date-Night Look (Exact Meesho Catalog Names)`
  ];
}
var UNIQUE_STYLING_COMBINATION_MATRIX = [
  {
    id: "combo-1-indo-western-bootcut",
    comboName: "Indo-Western Look Transformer: Wine Square-Neck Short Kurti + Black Flared Bootcut Jeans + Silver Waist Chain + Vintage Bag",
    category: "Body Proportion & Color Hacks",
    simpleVibeSummary: `Normal boring Kurti + Leggings pehenne ke bajaye ye 4-piece Indo-Western combination aapki waist ko slim dikhata hai aur 5'0" se 5'3" ki ladkiyon ko 4 inch lamba dikhata hai.`,
    beforeVsAfterLook: "Pehle (Basic Look): Loose kurti ko straight jeans ke saath pehenne se body boxy aur height choti lagti hai. Ab (New Styled Look): Fitted Square-Neck Wine Short Kurti + High-Waist Black Flared Bootcut Jeans + Kamar par Silver Waist Chain pehenne se kamar slim aur legs super long lagte hain.",
    howToCombineAllFourPieces: "Sabse pehle Wine Maroon Square-Neck Short Kurti (Piece 1) ko Black High-Waist Flared Bootcut Jeans (Piece 2) ke saath pehno (kurti bilkul kamar/waistband par aani chahiye). Ab Oxidized Silver Waist Chain (Piece 3) ko kamar ke side mein hook karo taaki wo kurti aur jeans ke border par halka sa drape ho. Last mein Vintage Brown Shoulder Baguette Bag aur Jhumkas (Piece 4) pehno aur baalon mein half-up claw clip lagao.",
    threeWaysToRestyleCombo: [
      "1. College Regular Look: Piece 1 (Wine Kurti) + Piece 2 (Bootcut Jeans) ko White Sneakers aur Tote Bag ke saath pehno (waist chain skip kar sakte ho).",
      "2. Evening Cafe / Date Look: Piece 3 (Silver Waist Chain) + Piece 4 (Brown Baguette Bag) add karo aur baalon ko soft waves mein khula rakho.",
      "3. Family / Festive Look: Wine Short Kurti ko Black Flared Skirt, Heavy Oxidized Jhumkas aur Punjabi Juttis ke saath pehno."
    ],
    colorPalette: ["Wine Maroon", "Jet Black", "Antique Silver", "Espresso Brown"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Upper-Body Hero Top (Collarbone & Waist Focus)",
        exactKeyword: "Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti",
        backupSearchKeywords: [
          "Maroon square neck embroidered short kurti women",
          "Burgundy puff sleeve fitted cotton short kurta"
        ],
        howToCombineAndStyle: "Chest aur waist par exact fitting wala size chuno taaki square neck aapke collarbone ko clean aur \u0938\u0941\u0902\u0926\u0930 dikhaye.",
        priceFilter: "Under \u20B9349 \xB7 4.1\u2605+ \xB7 Check Real Buyer Photos",
        fabricAndFitCheck: "Meesho customer photo review mein check karo ki cotton-rayon kapda thick ho (bilkul transparent na ho).",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Leg-Lengthening Bottom (Height Illusion Base)",
        exactKeyword: "Women Black High Waist Stretchable Flared Bootcut Jeans",
        backupSearchKeywords: [
          "High waist black bell bottom flared denim jeans women",
          "Black high rise wide leg stretchable jeans"
        ],
        howToCombineAndStyle: "Jeans ka neeche ka flare aapke footwear ke upar tak aana chahiye\u2014isse heels chup jati hain aur legs bohot lambe lagte hain.",
        priceFilter: "Under \u20B9449 \xB7 Free Delivery \xB7 Easy Return",
        fabricAndFitCheck: "Size chart mein 38 se 39 inch length check karo aur dekho ki kamar par stretchable grip achi ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Secret Styling Transformer (Waist & Fusion Detail)",
        exactKeyword: "Oxidized Silver Kamarbandh Belly Waist Chain Belt Women",
        backupSearchKeywords: [
          "Silver oxidized coin waist chain for kurti jeans",
          "Boho oxidized silver layered waist belt women"
        ],
        howToCombineAndStyle: "Is silver chain ko jeans ke button se 1 inch neeche kamar par clip karo\u2014ye simple kurti-jeans ko turant Pinterest look deta hai.",
        priceFilter: "Under \u20B9179 \xB7 High Save Value",
        fabricAndFitCheck: "Review photos mein check karo ki hook lock strong ho aur silver polish matte (non-plastic) dikhe.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Look-Finishing Bag & Jewelry Combo",
        exactKeyword: "Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag",
        backupSearchKeywords: [
          "Dark brown retro underarm shoulder bag women",
          "Oxidized silver afghani jhumka earrings combo"
        ],
        howToCombineAndStyle: "Short-strap baguette bag ko ek kandhe (shoulder) par carry karo\u2014isse upper body posture ekdum modern aur classy lagta hai.",
        priceFilter: "Under \u20B9289 \xB7 Rating 4.2\u2605+",
        fabricAndFitCheck: "Customer review video mein bag ki zip aur leather ki stitching check kar lo.",
        platform: "Meesho"
      }
    ]
  },
  {
    id: "combo-2-chocolate-pink-korean",
    comboName: "High-Contrast Color Combo: Chocolate Brown Fitted Polo Top + Baby Pink Wide-Leg Trousers + Cropped Vest + Cream Tote",
    category: "Scroll-Stopping Interactive",
    simpleVibeSummary: "Har koi roz basic Black & White pehenta hai. Rich Chocolate Brown ke saath Soft Baby Pink combine karne se \u20B9399 ka Meesho outfit bhi \u20B93,000 Zara/Myntra jaisa mehenga lagta hai.",
    beforeVsAfterLook: "Pehle (Basic Look): Simple T-shirt aur blue jeans photo mein bohot aam lagte hain. Ab (New Styled Look): Upar Chocolate Brown Ribbed Top + Neeche Baby Pink Wide-Leg Trousers pehenne se Indian skin tone par ekdum rich, soft Pinterest glow aata hai.",
    howToCombineAllFourPieces: "Chocolate Brown Ribbed Polo Top (Piece 1) ko High-Waist Baby Pink Wide-Leg Trousers (Piece 2) ke andar \u092A\u0942\u0930\u093E tuck karke pehno. Kamar par Thin Gold Buckle Brown Belt (Piece 3) lagao taaki waistline lock ho jaye. Sath mein Structured Cream Canvas Tote Bag (Piece 4) aur chote gold hoop earrings pehno.",
    threeWaysToRestyleCombo: [
      "1. College Presentation Look: Piece 1 + Piece 2 ko Gold Belt aur flat loafers ke saath pehno.",
      "2. Sunday Cafe Brunch Look: Collar ka upar wala button khula rakho, \u092A\u0924\u0932\u0940 gold chain pehno aur white sneakers lagao.",
      "3. Travel / Airport Look: Brown top aur pink pant ke upar ek Oversized White Cotton Shirt open karke layer karo."
    ],
    colorPalette: ["Chocolate Brown", "Soft Baby Pink", "Warm Cream", "Champagne Gold"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Rich Contrast Top (Warm Skin Glow)",
        exactKeyword: "Women Chocolate Brown Ribbed Knit Collar Polo Half Sleeve Top",
        backupSearchKeywords: [
          "Coffee brown fitted ribbed v neck knitted top women",
          "Dark brown sweetheart neck full sleeve ribbed top"
        ],
        howToCombineAndStyle: "Top ko high-waist pant ke andar neatly tuck karo taaki aapke legs body ka 60% hissa dikhein aur height lambi lage.",
        priceFilter: "Under \u20B9329 \xB7 4.1\u2605+ \xB7 200+ Reviews",
        fabricAndFitCheck: "Review mein check karo ki ribbed knit fabric stretchy aur soft ho (chubhne wala kapda na ho).",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Statement Pastel Bottom (Wide-Leg Drape)",
        exactKeyword: "Women Dusty Baby Pink High Waist Pleated Wide Leg Korean Trousers",
        backupSearchKeywords: [
          "Pastel pink high waist formal wide leg pants women",
          "Soft pink loose fit pleated palazzo trousers"
        ],
        howToCombineAndStyle: "Trouser ko bilkul belly-button (naabhi) ke paas high-waist pehno taaki front pleats se tummy flat dikhe.",
        priceFilter: "Under \u20B9429 \xB7 Free Delivery",
        fabricAndFitCheck: "Check karo ki kapda thick poly-cotton blend ho taaki andar ki pockets bahar se transparent na dikhein.",
        platform: "Both"
      },
      {
        itemLabel: "Piece 3 \xB7 Proportion Lock Accessory (Gold Waist Accent)",
        exactKeyword: "Women Minimal Black Brown Faux Leather Gold Buckle Skinny Waist Belt",
        backupSearchKeywords: [
          "Thin brown waist belt with gold buckle women trousers",
          "Minimal gold hoop earrings combo for women"
        ],
        howToCombineAndStyle: "Brown belt ko chocolate brown top ke saath match karke lagao\u2014ye gold buckle poore outfit ko instant rich look deta hai.",
        priceFilter: "Under \u20B9169 \xB7 Combo Deal",
        fabricAndFitCheck: "Buyer photos mein belt ke holes aur gold buckle ki finishing check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Aesthetic Everyday Completer",
        exactKeyword: "Women Cream White Structured Canvas Aesthetic Tote Handbag With Zip",
        backupSearchKeywords: [
          "Beige aesthetic korean canvas shoulder tote bag",
          "White chunky sole casual sneakers for women"
        ],
        howToCombineAndStyle: "Cream tote bag brown aur pink combination ko bright banata hai aur college registers/\u0938\u093E\u092E\u093E\u0928 ke liye bhi best hai.",
        priceFilter: "Under \u20B9269 \xB7 Rating 4.2\u2605+",
        fabricAndFitCheck: "Check karo ki tote bag ke upar zip closure ho aur canvas kapda \u092E\u094B\u091F\u093E ho.",
        platform: "Meesho"
      }
    ]
  },
  {
    id: "combo-3-one-black-kurti-3-ways",
    comboName: "3-in-1 Capsule Styling: Jet Black Chikankari Short Kurti + Baggy Ice-Blue Cargo Jeans + Beige Blazer Layer + Oxidized Choker",
    category: "Aesthetics & Situations",
    simpleVibeSummary: "Sirf 1 \u20B9299 ki Black Chikankari Short Kurti se 3 bilkul alag looks (Desi Baddie, Boss Intern, aur College Streetwear) banata hai\u2014bas neeche ka bottom aur layer badal kar!",
    beforeVsAfterLook: "Pehle (Basic Look): Black kurti ko har hafte ek hi tarah se pehenna boring lagta hai. Ab (New Styled Look): Usi Black Kurti ko Ice-Blue Baggy Jeans, Heavy Oxidized Choker aur Beige Shrug/Blazer ke saath mix karne se 1 wishlist mein 3 naye outfits ban jate hain.",
    howToCombineAllFourPieces: "Jet Black Cotton Chikankari Short Kurti (Piece 1) ko Light Ice-Blue High-Waist Baggy Jeans (Piece 2) ke saath pehno aur jeans ko neeche ankle par 1 inch fold karo. Gale mein Heavy Oxidized Silver Afghani Choker & Jhumka Set (Piece 3) pehno. Agar smart/boss look chahiye toh upar se Beige Casual Blazer/Shrug (Piece 4) layer kar lo.",
    threeWaysToRestyleCombo: [
      "1. Desi Streetwear Look: Black Kurti + Baggy Ice-Blue Jeans + Oxidized Choker + Kolhapuri Flats.",
      "2. Smart Intern / Presentation Look: Black Kurti + Upar se Beige Blazer Layer + Straight Pants + Small Studs.",
      "3. Evening Monochrome Look: Black Kurti + Black Flared Pants + Heavy Silver Jhumkas + Kajal Eyes."
    ],
    colorPalette: ["Jet Black", "Ice Wash Blue", "Warm Beige", "Oxidized Silver"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 The All-Rounder Base Top",
        exactKeyword: "Women Jet Black Pure Cotton Lucknowi Chikankari Short Kurti",
        backupSearchKeywords: [
          "Black white thread embroidered cotton short kurta women",
          "Black V neck Kashmiri embroidered short kurti"
        ],
        howToCombineAndStyle: "Kurti ki sleeves ko kohni (elbows) tak fold karke pehno taaki haath mein silver bangles ya watch saaf dikhe.",
        priceFilter: "Under \u20B9299 \xB7 Best Seller \xB7 4.2\u2605+",
        fabricAndFitCheck: "Review mein check karo ki pure cotton kapda ho (garmi wala synthetic crepe na ho) aur white dhage ki \u0915\u0922\u093C\u093E\u0908 saaf ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Streetwear Contrast Bottom",
        exactKeyword: "Women Ice Blue High Waist Baggy Wide Leg Straight Fit Boyfriend Jeans",
        backupSearchKeywords: [
          "Light blue high waist loose fit korean cargo jeans women",
          "Ice blue wide leg denim jeans for girls"
        ],
        howToCombineAndStyle: "Jet black kurti ke saath light ice-blue denim ka contrast camera aur Reel mein sabse zyada u\u092D\u0930 kar dikhta hai.",
        priceFilter: "Under \u20B9469 \xB7 Free Delivery",
        fabricAndFitCheck: "Customer review mein denim ki thickness aur waist button ki fitting check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Neckline Statement Transformer",
        exactKeyword: "Oxidized Silver Afghani Choker Necklace With Jhumka Earrings Bangle Set",
        backupSearchKeywords: [
          "Heavy oxidized silver tribal necklace earrings combo",
          "Silver oxidized ghungroo bangle cuff bracelet set"
        ],
        howToCombineAndStyle: "Oxidized choker ko black kurti ke neck ke bilkul upar set karo\u2014ye chehre ko instant sharp frame deta hai.",
        priceFilter: "Under \u20B9199 \xB7 Complete 3-Piece Jewellery Set",
        fabricAndFitCheck: "Review photos mein check karo ki silver polish kali (blackish) na pade aur ghungroo poore hon.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Smart Third-Piece Layer & Footwear",
        exactKeyword: "Women Beige Open Front Cotton Linen Casual Shrug Blazer Jacket",
        backupSearchKeywords: [
          "Women tan embroidered Punjabi jutti flat mojari",
          "Black structured sling crossbody bag women"
        ],
        howToCombineAndStyle: "Black kurti ke upar beige shrug/blazer daalte hi normal college look turant Boss-Girl look mein badal jata hai.",
        priceFilter: "Under \u20B9399 \xB7 Multi-Use Layer",
        fabricAndFitCheck: "Shoulder ki silai (stitching) aur wrinkle-free fabric review mein check karo.",
        platform: "Both"
      }
    ]
  },
  {
    id: "combo-4-warm-indian-skin-glow",
    comboName: "Warm Indian Skin-Glow Combo: Emerald Green Modal Kurta + Cream Palazzo Pants + Organza Scallop Dupatta + Pearl Juttis",
    category: "Body Proportion & Color Hacks",
    simpleVibeSummary: "Dull grey ya neon colors jo Indian skin ko dark/tired dikhate hain, unki jagah Emerald Green + Warm Cream ka combo jo bina makeup ke chehre par glow laata hai.",
    beforeVsAfterLook: "Pehle (Basic Look): Halka \u092A\u0940\u0932\u093E (neon yellow) ya dull grey pehenne se camera par skin dull lagti hai. Ab (New Styled Look): Deep Emerald Green Kurta ke saath Warm Cream Pants aur Pearl Jewellery pehenne se chehra naturally bright aur glowing dikhta hai.",
    howToCombineAllFourPieces: "Emerald Green V-Neck Straight Kurta (Piece 1) ko Off-White/Cream Straight Ankle-Length Pants (Piece 2) ke saath pehno. Sheer Cream Organza Floral Scallop Dupatta (Piece 3) ko gale mein lapetne ke bajaye sirf ek kandhe (one-shoulder) par pin karo taaki V-neck dikhta rahe. Kaano mein Pearl Chandbali Jhumkas aur pairon mein Juttis (Piece 4) pehno.",
    threeWaysToRestyleCombo: [
      "1. Festive / Puja Look: Charon pieces ek saath pehno aur organza dupatta ek shoulder par neatly pin karo.",
      "2. College / Office Ethnic Day: Dupatta hata kar sirf Emerald Kurta + Cream Pants + Watch aur Flat Sandals pehno.",
      "3. Shaadi / Function Mix: Emerald Kurta ko Golden Skirt aur heavy Chandbali ke saath pair karo."
    ],
    colorPalette: ["Emerald Bottle Green", "Warm Ivory Cream", "Soft Gold", "Pearl White"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Skin-Brightening Jewel-Tone Top",
        exactKeyword: "Women Emerald Bottle Green V Neck Zari Embroidered Straight Kurta",
        backupSearchKeywords: [
          "Dark green chanderi silk embroidered kurta women",
          "Bottle green rayon sequence neck straight kurti"
        ],
        howToCombineAndStyle: "V-neck cut gale ko lamba dikhata hai aur dark bottle-green color Indian warm skin tone ko turant bright banata hai.",
        priceFilter: "Under \u20B9389 \xB7 Rating 4.2\u2605+",
        fabricAndFitCheck: "Meesho review mein check karo ki soft rayon/modal kapda ho aur neck ki zari \u0915\u0922\u093C\u093E\u0908 (embroidery) clean ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Clean Contrast Bottom",
        exactKeyword: "Women Off White Cream Cotton Lycra Straight Ankle Length Cigarette Pant",
        backupSearchKeywords: [
          "Cream chikankari embroidered bottom palazzo trouser women",
          "Off white stretchable cotton straight trouser pant"
        ],
        howToCombineAndStyle: "Ankle-length pant pehenne se neeche 2 inch ankle dikhta hai, jisse \u092A\u0942\u0930\u093E kurta set tailored aur slim lagta hai.",
        priceFilter: "Under \u20B9289 \xB7 Everyday Staple",
        fabricAndFitCheck: "Customer photos mein verify karo ki white/cream pant ka cotton \u092E\u094B\u091F\u093E (non-transparent) ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Ethereal Texture Layer (Dupatta)",
        exactKeyword: "Women White Cream Organza Floral Printed Scallop Cutwork Border Dupatta",
        backupSearchKeywords: [
          "Ivory gold zari border chanderi silk dupatta",
          "Pastel floral organza dupatta with pearl border"
        ],
        howToCombineAndStyle: "Dupatte ko ek shoulder par safety pin se set karo aur dusra hissa hath (wrist) par khula chhod do\u2014video mein bohot royal lagega.",
        priceFilter: "Under \u20B9229 \xB7 Instant Festive Upgrade",
        fabricAndFitCheck: "Check karo ki organza kapda soft drape wala ho, kandhe par fula-fula (stiff) na khada rahe.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Pearl & Ethnic Footwear Finisher",
        exactKeyword: "Women Gold Pearl Kundan Chandbali Jhumka Earrings Set",
        backupSearchKeywords: [
          "Women cream pearl work flat Punjabi mojari jutti",
          "Gold pearl potli clutch bag for women festive"
        ],
        howToCombineAndStyle: "Gale mein koi necklace mat pehno taaki kurta ka V-neck clean dikhe, sirf bade Pearl Chandbali Jhumkas pehno.",
        priceFilter: "Under \u20B9249 \xB7 High Save Value",
        fabricAndFitCheck: "Check karo ki earrings ka weight halka ho aur piche ka stopper tight ho.",
        platform: "Meesho"
      }
    ]
  },
  {
    id: "combo-5-korean-layered-shirt-vest",
    comboName: "Korean Layered Pinterest Combo: Oversized White Cotton Shirt + Cinnamon Knitted Vest + Charcoal Wide-Leg Pants + Retro Glasses",
    category: "Identity & Personality",
    simpleVibeSummary: "Simple white shirt ko school uniform jaisa dikhne se bachata hai aur Korean Cafe / Bookshop CEO jaisa trendy layered look deta hai.",
    beforeVsAfterLook: "Pehle (Basic Look): Sirf white shirt aur formal pant pehenne se boring office/school uniform jaisa lagta hai. Ab (New Styled Look): White Shirt ke upar Cinnamon Brown Cropped Knitted Vest aur Charcoal Wide-Leg Pants layer karne se instant Pinterest aesthetic ban jata hai.",
    howToCombineAllFourPieces: "Pehle White Oversized Button-Down Cotton Shirt (Piece 1) pehno aur uske upar Cinnamon Brown V-Neck Sleeveless Knitted Vest (Piece 2) layer karo. Dono ko Charcoal Grey High-Waist Pleated Wide-Leg Trousers (Piece 3) ke saath pair karo (shirt ka thoda sa hem neeche dikhne do ya andar tuck karo). Sath mein Vintage Clear Frame Glasses aur Brown Bag (Piece 4) lagao.",
    threeWaysToRestyleCombo: [
      "1. Aesthetic Cafe / Study Look: White Shirt + Brown Knitted Vest + Charcoal Pants + Clear Glasses.",
      "2. Summer College Look: Vest hata kar White Shirt ke buttons khule rakho aur andar Black Tank Top + Charcoal Pants pehno.",
      "3. Solo Vest Look: Garmiyon mein Knitted Vest ko akele sleeveless top ki tarah Blue Jeans ke saath pehno."
    ],
    colorPalette: ["Cinnamon Brown", "Crisp White", "Charcoal Grey", "Espresso Leather"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Crisp Base Layer Shirt",
        exactKeyword: "Women White Oversized Drop Shoulder Cotton Button Down Casual Shirt",
        backupSearchKeywords: [
          "White poplin collared full sleeve formal casual shirt women",
          "Cream oversized boyfriend cotton shirt for girls"
        ],
        howToCombineAndStyle: "Shirt ke cuffs ko wrist par ek baar fold karo aur collar ko knitted vest ke bahar neatly nikalo.",
        priceFilter: "Under \u20B9349 \xB7 Wardrobe Essential",
        fabricAndFitCheck: "Review mein check karo ki cotton blend thick ho taaki white shirt zyada see-through na ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 The Look-Changing Layer (Knitted Vest)",
        exactKeyword: "Women Brown V Neck Sleeveless Ribbed Knitted Sweater Vest Crop Top",
        backupSearchKeywords: [
          "Beige argyle pattern sleeveless knitted vest women",
          "Coffee brown houndstooth sweater vest crop top"
        ],
        howToCombineAndStyle: "Cropped V-neck vest aapke waist proportion ko upar uthata hai aur simple shirt ko turant stylish banata hai.",
        priceFilter: "Under \u20B9319 \xB7 4.1\u2605+ Rating",
        fabricAndFitCheck: "Check karo ki knit fabric soft ho aur dhone ke baad roye (lint) na niklein.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Tailored Silhouette Bottom",
        exactKeyword: "Women Charcoal Dark Grey High Waist Front Pleated Wide Leg Formal Trousers",
        backupSearchKeywords: [
          "Black high waist Korean loose wide leg formal pants women",
          "Dark grey tailored straight fit office trousers women"
        ],
        howToCombineAndStyle: "Front pleats tummy ko flat dikhati hain aur upar se neeche tak ek lambi straight line banati hain.",
        priceFilter: "Under \u20B9439 \xB7 Free Delivery",
        fabricAndFitCheck: "Review mein back elastic waist stretch aur front hook ki quality check karo.",
        platform: "Both"
      },
      {
        itemLabel: "Piece 4 \xB7 Bookshop Aesthetic Completer",
        exactKeyword: "Women Vintage Rectangular Black Brown Frame Clear Lens Fashion Glasses",
        backupSearchKeywords: [
          "Women brown faux leather vintage crossbody messenger bag",
          "Minimal brown strap vintage oval dial watch women"
        ],
        howToCombineAndStyle: "Clear glasses ko pehno ya \u0938\u093F\u0930 (head) ke upar hairband ki tarah lagao\u2014dono tarike se super trendy lagta hai.",
        priceFilter: "Under \u20B9199 \xB7 Instant Vibe Upgrade",
        fabricAndFitCheck: "Buyer photos mein frame ke screws aur clean glass lens check karo.",
        platform: "Meesho"
      }
    ]
  },
  {
    id: "combo-6-strict-mom-coquette",
    comboName: "Strict-Mom Approved Coquette Combo: Dusty Rose Tie-Back Puff-Sleeve Kurti + White Flared Palazzo + Pearl Bow Clip + Mary Jane Flats",
    category: "Aesthetics & Situations",
    simpleVibeSummary: "Pinterest ka cute Coquette Pink-and-White look deta hai par 100% modest aur comfortable coverage ke saath, jise strict Indian mummy bhi turant approve kar dengi.",
    beforeVsAfterLook: "Pehle (Basic Look): Pinterest ke zyada-tar cute pink tops bohot cropped ya deep-neck hote hain jo ghar walon ke saamne nahi pehen sakte. Ab (New Styled Look): Dusty Pink Puff-Sleeve Short Kurti + White Flared Cotton Palazzo + Satin Pearl Bow Clip se wahi dreamy cute look full coverage mein milta hai.",
    howToCombineAllFourPieces: "Dusty Pink Floral Puff-Sleeve Short Kurti (Piece 1) ko White Chikankari/Flared Cotton Palazzo (Piece 2) ke saath pehno. Baalon ko half-tie karke piche Satin Pearl Ribbon Bow Clip (Piece 3) lagao aur pairon mein Cream Mary Jane Strap Flat Bellies (Piece 4) pehno.",
    threeWaysToRestyleCombo: [
      "1. Soft Coquette Outing Look: Dusty Pink Kurti + White Palazzo + Satin Bow Hair Clip + Mary Jane Flats.",
      "2. College Regular Look: Dusty Pink Kurti + Light Blue Straight Jeans + Small Pearl Studs.",
      "3. Family Dinner Look: Sath mein ek White Lace Dupatta aur Silver Jhumkas add kar lo."
    ],
    colorPalette: ["Dusty Rose Pink", "Milk White", "Pearl Cream", "Soft Gold"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Modest Romantic Top",
        exactKeyword: "Women Dusty Pink Floral Printed Puff Sleeve Square Neck Cotton Short Kurti",
        backupSearchKeywords: [
          "Baby pink schiffli eyelet lace embroidered short kurti",
          "Peach pink gathered empire waist flared short top"
        ],
        howToCombineAndStyle: "Puff sleeves ko kandhe par set rakho\u2014ye modest coverage bhi deta hai aur collarbone ko sundar frame karta hai.",
        priceFilter: "Under \u20B9339 \xB7 4.2\u2605+ Rating",
        fabricAndFitCheck: "Review mein dekho ki soft mulmul/rayon cotton ho aur chest par double lining ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Breezy White Bottom",
        exactKeyword: "Women White Cotton Chicken Embroidered Wide Leg Flared Palazzo Pant",
        backupSearchKeywords: [
          "Off white high waist pleated wide leg culotte palazzo",
          "White schiffli lace border cotton straight pant"
        ],
        howToCombineAndStyle: "White embroidered palazzo pink floral kurti ko fresh aur bright banata hai aur garmi mein super comfortable rehta hai.",
        priceFilter: "Under \u20B9349 \xB7 Free Delivery",
        fabricAndFitCheck: "Check karo ki andar \u0918\u0941\u091F\u0928\u0947 (knee) tak cotton astar/lining lagi ho taaki bilkul see-through na ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Coquette Hair & Neck Accent",
        exactKeyword: "Women Cream Pink Satin Ribbon Bow Hair Clip With Pearl Pendant Necklace",
        backupSearchKeywords: [
          "Korean pearl bow hair claw clip set for girls",
          "Dainty gold pearl choker necklace earrings combo"
        ],
        howToCombineAndStyle: "Baalon ko half-tie karke piche satin bow clip lagao\u2014Reel ke starting shot mein back-angle se ye bow dikhana bohot viral jata hai.",
        priceFilter: "Under \u20B9149 \xB7 Combo Pack",
        fabricAndFitCheck: "Check karo ki clip ka metal grip tight ho taaki baalon se phisle nahi.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Comfortable Aesthetic Footwear",
        exactKeyword: "Women Cream White Buckle Strap Mary Jane Flat Ballet Bellies Shoes",
        backupSearchKeywords: [
          "White pearl strap flat sandals for women college",
          "Pastel pink quilted sling bag with pearl handle"
        ],
        howToCombineAndStyle: "Mary Jane flats poora din chalne ke liye comfortable hain aur outfit ko cute doll-like finish dete hain.",
        priceFilter: "Under \u20B9399 \xB7 Cushioned Sole",
        fabricAndFitCheck: "Review mein size chart (cm mein) aur piche heel ki cushioning check karke order karo.",
        platform: "Both"
      }
    ]
  },
  {
    id: "combo-7-under-1199-full-4piece-challenge",
    comboName: "The \u20B91,199 Complete 4-Piece Head-to-Toe Challenge: Kashmiri Aari Embroidered Short Kurti + Black Wide-Leg Jeans + Afghani Jhumka Choker + Kolhapuri Wedges",
    category: "Scroll-Stopping Interactive",
    simpleVibeSummary: "Lakho creators sirf mehenge kapde dikhate hain\u2014ye combo \u20B91,199 ke andar poora 4-piece Head-to-Toe Desi Baddie look ready karta hai jo \u20B94,500 boutique set jaisa lagta hai.",
    beforeVsAfterLook: "Pehle (Basic Look): Alag-alag bina soche kharide hue kapde pehenne se look adhoora lagta hai. Ab (New Styled Look): Kashmiri Aari Work Short Kurti + High-Waist Black Wide-Leg Jeans + Heavy Afghani Silver Choker + Tan Kolhapuri Wedges se \u20B91,199 mein pura celebrity-styled look milta hai.",
    howToCombineAllFourPieces: "Sabse pehle Rust/Maroon Kashmiri Aari Embroidered Short Kurti (Piece 1) ko Black High-Waist Wide-Leg Denim Jeans (Piece 2) ke upar pehno. Gale mein Oxidized Silver Afghani Choker & Jhumka Combo (Piece 3) pehno aur sleeves ko kohni tak fold karo. Pairon mein Tan Braided Kolhapuri Wedge Heels (Piece 4) pehno jo jeans ke flare ke neeche chup kar aapki height 3 inch badha dengi.",
    threeWaysToRestyleCombo: [
      "1. Full \u20B91,199 College Fest Look: Charon pieces ek saath pehno aur maang mein choti si black bindi lagao.",
      "2. Casual Everyday Class Look: Choker hata kar sirf Kashmiri Short Kurti + Black Wide-Leg Jeans + Small Jhumkas pehno.",
      "3. Family Puja / Outing Look: Black jeans ki jagah Cream Palazzo aur Kolhapuri Wedges pehno."
    ],
    colorPalette: ["Rust Kashmiri Maroon", "Carbon Black", "Antique Silver", "Tan Brown"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Artisanal Kashmiri Embroidered Top",
        exactKeyword: "Women Rust Maroon Kashmiri Aari Thread Embroidered Rayon Short Kurti",
        backupSearchKeywords: [
          "Women black Kashmiri embroidered V neck cotton short kurti",
          "Bottle green Kashmiri aari work full sleeve short kurta"
        ],
        howToCombineAndStyle: "V-neck Kashmiri embroidery chehre ki taraf dhyan khinchti hai; sleeves ko halka fold karke pehno.",
        priceFilter: "Under \u20B9299 \xB7 Rating 4.2\u2605+",
        fabricAndFitCheck: "Meesho customer review photos mein aari thread embroidery ki finishing aur rayon thickness check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Tall-Silhouette Wide-Leg Denim",
        exactKeyword: "Women Black High Waist Loose Fit Wide Leg Straight Denim Jeans",
        backupSearchKeywords: [
          "Charcoal black high rise baggy boyfriend jeans women",
          "Women dark black high waist flared bell bottom jeans"
        ],
        howToCombineAndStyle: "High-waist button ko bilkul navel (naabhi) par lock karo taaki 30:70 leg-lengthening proportion bane.",
        priceFilter: "Under \u20B9439 \xB7 Free Delivery",
        fabricAndFitCheck: "Size chart mein 39-inch full length aur waist measurement (inches mein) verify karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Instant Desi-Baddie Jewellery Set",
        exactKeyword: "Women Oxidized Silver Afghani Tribal Choker Necklace With Jhumka Set",
        backupSearchKeywords: [
          "Silver oxidized ghungroo choker and earrings combo women",
          "Boho oxidized silver layered necklace jhumka bangle set"
        ],
        howToCombineAndStyle: "V-neck kurti ke khule \u0939\u093F\u0938\u094D\u0938\u0947 mein ye oxidized choker baith kar ekdum rich boutique look deta hai.",
        priceFilter: "Under \u20B9169 \xB7 High Save Trigger",
        fabricAndFitCheck: "Review photos mein matte black-silver polish aur \u092A\u0940\u091B\u0947 ki adjustable dori check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Hidden Height-Boost Ethnic Footwear",
        exactKeyword: "Women Tan Brown Braided Ethnic Kolhapuri Wedge Heel Sandals",
        backupSearchKeywords: [
          "Women brown ethnic block heel kolhapuri chappal",
          "Tan faux leather ethnic sling bag for kurti"
        ],
        howToCombineAndStyle: "Wide-leg jeans ke neeche 2.5-inch Kolhapuri wedges pehenne se bina kisi ko pata chale height 3 inch lambi lagti hai.",
        priceFilter: "Under \u20B9289 \xB7 Cushioned Sole",
        fabricAndFitCheck: "Buyer reviews mein sole grip aur strap softness check karke apna exact size chuno.",
        platform: "Meesho"
      }
    ]
  },
  {
    id: "combo-8-pear-midsize-tummy-hide-illusion",
    comboName: "Mid-Size & Tummy-Hide Body-Math Combo: Navy Angrakha Wrap Peplum Short Kurti + Cream Straight Pants + Minimal Gold Watch + Structured Sling Bag",
    category: "Body Proportion & Color Hacks",
    simpleVibeSummary: "70% Indian girls ko bloated tummy ya heavy hips ka issue hota hai\u2014ye Angrakha Diagonal-Wrap + Straight Pant combo tummy ko 100% hide karke instant hourglass shape banata hai.",
    beforeVsAfterLook: "Pehle (Basic Look): Body-hugging t-shirt ya side-slit straight kurti hips aur tummy par chipakti hai. Ab (New Styled Look): Diagonal Angrakha Wrap Peplum Kurti kamar ke sabse patle hisse par tie hoti hai aur neeche se tummy/hips par bina chipke skim karti hai.",
    howToCombineAllFourPieces: "Navy Blue Floral Angrakha Wrap Tie-Waist Peplum Kurti (Piece 1) ko High-Waist Off-White/Cream Straight Cigarette Pants (Piece 2) ke saath pehno (side dori ko chest ke bilkul neeche empire-waist par tie karo). Ek haath mein Minimal Gold Link Strap Watch & Hoops (Piece 3) aur kandhe par Cream/Tan Structured Crossbody Sling Bag (Piece 4) carry karo.",
    threeWaysToRestyleCombo: [
      "1. Smart College / Office Look: Navy Angrakha Kurti + Cream Straight Pants + Gold Watch + Structured Bag.",
      "2. Weekend Outing Look: Navy Angrakha Kurti ko Blue Flared Bootcut Jeans aur White Sneakers ke saath pehno.",
      "3. Family Get-Together Look: Sath mein Silver Jhumkas aur Cream Punjabi Juttis pehno."
    ],
    colorPalette: ["Midnight Navy Blue", "Warm Ivory Cream", "Champagne Gold", "Tan Leather"],
    pieces: [
      {
        itemLabel: "Piece 1 \xB7 Tummy-Concealing Diagonal Wrap Top",
        exactKeyword: "Women Navy Blue Jaipuri Printed Angrakha Wrap Peplum Cotton Short Kurti",
        backupSearchKeywords: [
          "Indigo blue V neck empire waist gathered flared short kurti",
          "Dark blue cotton angrakha side tie flared top women"
        ],
        howToCombineAndStyle: "Angrakha ki tirchi (diagonal) line aankhon ko upar chest aur collarbone ki taraf le jati hai aur peplum flare tummy ko bilkul chhupa deta hai.",
        priceFilter: "Under \u20B9339 \xB7 4.2\u2605+ Rating",
        fabricAndFitCheck: "Review mein 100% pure Jaipuri cotton kapda check karo jo dhone par shrink na ho.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 2 \xB7 Vertical Line Straight Bottom",
        exactKeyword: "Women Cream Off White High Waist Stretchable Straight Fit Trouser Pant",
        backupSearchKeywords: [
          "White cotton lycra ankle length cigarette pant women",
          "Beige high waist formal straight trouser pant women"
        ],
        howToCombineAndStyle: "Upar flared peplum kurti hai isliye neeche straight-fit ankle pant pehno\u2014isse body balanced aur tall dikhti hai.",
        priceFilter: "Under \u20B9299 \xB7 Free Delivery",
        fabricAndFitCheck: "Customer review photos mein fabric thickness aur elastic waistband comfort check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 3 \xB7 Classy Wrist & Ear Completer",
        exactKeyword: "Women Vintage Gold Rectangular Dial Metal Strap Analog Wrist Watch",
        backupSearchKeywords: [
          "Gold plated minimal hoop earrings and dainty chain combo",
          "Rose gold bracelet watch for girls office wear"
        ],
        howToCombineAndStyle: "3/4th sleeves ke saath haath mein gold rectangular watch pehenne se look turant rich aur polished lagta hai.",
        priceFilter: "Under \u20B9199 \xB7 Bestseller",
        fabricAndFitCheck: "Review photos mein dial size aur clasp lock check karo.",
        platform: "Meesho"
      },
      {
        itemLabel: "Piece 4 \xB7 Structured Posture Enhancer Bag",
        exactKeyword: "Women Tan Cream Colorblock Structured Box Crossbody Sling Handbag",
        backupSearchKeywords: [
          "Beige brown structured mini tote sling bag women",
          "Women tan flat mule loafers sandals"
        ],
        howToCombineAndStyle: "Soft jhola bag ki jagah stiff structured box bag carry karne se body silhouette zyada slim aur sharp dikhta hai.",
        priceFilter: "Under \u20B9319 \xB7 4.1\u2605+ Rating",
        fabricAndFitCheck: "Check karo ki bag ka base stiff ho aur strap adjustable ho.",
        platform: "Both"
      }
    ]
  }
];
function sanitizeMeeshoSearchTerm(rawKeyword, fallbackIndex = 0) {
  const defaultCatalogTerms = [
    "Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti",
    "Women Black High Waist Stretchable Flared Bootcut Jeans",
    "Oxidized Silver Kamarbandh Waist Chain Belt & Jhumka Combo",
    "Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag"
  ];
  if (!rawKeyword || typeof rawKeyword !== "string") {
    return defaultCatalogTerms[fallbackIndex % defaultCatalogTerms.length];
  }
  const cleaned = rawKeyword.replace(
    /\b(zodiac sign|date-night edition|date night edition|birth month|initial letter|overthinker|hopeless romantic|ambitious ceo|spotify playlist|villain era|soft heart|cold aura|height illusion hacks|strict desi mom approved|myntra vs meesho|dupe|2026|viral|edition|look \d|piece \d|outfit \d|under rs \d+|under ₹\d+)\b/gi,
    ""
  ).replace(/[:()[\]"'—–-]/g, " ").replace(/\s+/g, " ").trim();
  if (cleaned.split(" ").length < 3) {
    return defaultCatalogTerms[fallbackIndex % defaultCatalogTerms.length];
  }
  return cleaned;
}
function getRealTimeDailyStylingContext(variationOffset = 0) {
  const now = /* @__PURE__ */ new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum = now.getDate();
  const yearNum = now.getFullYear();
  const startOfYear = new Date(yearNum, 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1e3 * 60 * 60 * 24));
  const dailyMoodByDayOfWeek = {
    Monday: "Smart College & Boss-Intern Layering (Effortless Morning Combinations)",
    Tuesday: `5'0" Height-Illusion & Body-Proportion Mix-and-Match Hacks`,
    Wednesday: "Unexpected High-Contrast Color Combinations for Warm Indian Skin",
    Thursday: "Indo-Western Kurti + Denim Fusion (Desi Baddie & Strict-Mom Approved)",
    Friday: "Date-Night & Cafe Hopping Look-Transformation Combinations",
    Saturday: "Myntra \u20B92,499 vs Meesho \u20B9389 Weekend Dupe Combinations",
    Sunday: "1 Capsule Piece Styled 3 Ways (Weekly Wishlist Reset)"
  };
  const totalCombos = UNIQUE_STYLING_COMBINATION_MATRIX.length;
  const activeComboIndex = (dayOfYear + Math.abs(Number(variationOffset) || 0)) % totalCombos;
  const primaryDailyCombo = UNIQUE_STYLING_COMBINATION_MATRIX[activeComboIndex];
  const todaysFourLiveCombos = [0, 1, 2, 3].map(
    (offset) => UNIQUE_STYLING_COMBINATION_MATRIX[(dayOfYear + offset + Math.abs(Number(variationOffset) || 0)) % totalCombos]
  );
  return {
    formattedDate: `${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    dayName,
    monthName,
    dayOfYear,
    todaysStylingFocus: dailyMoodByDayOfWeek[dayName] || "Indo-Western Proportion & Color Contrast Styling",
    liveDailyTrendTag: `Live Daily Styling Radar \xB7 ${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    primaryDailyCombo,
    todaysFourLiveCombos
  };
}
var BANNED_SLOP_HOOK_REGEX = /\b(feel the|own the|swipe up|wardrobe switch|match your mood|elevate your|unleash|step into|discover the|embrace your|shine bright|two vibes, one|upgrade your style|fashion statement|redefine your|unlock your|effortless elegance|radiate confidence|level up your wardrobe)\b/i;
var VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS = [
  "#meeshofinds",
  "#shortkurtistyling",
  "#indianoutfitideas",
  "#collegeoutfitideas",
  "#meeshohaul",
  "#kurtijeanscombo",
  "#petitefashionindia",
  "#myntrafinds",
  "#desiaesthetic",
  "#affordablestyling",
  "#meeshokurtiset",
  "#indoWesternoutfits"
];
function isSlopHook(hook) {
  if (!hook || typeof hook !== "string") return true;
  const trimmed = hook.trim();
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 8) return true;
  if (BANNED_SLOP_HOOK_REGEX.test(trimmed)) return true;
  return false;
}
function enforceMastermindViralReelPack(searchTerms, conceptTitle, howToCombineSummary, rawReelPack, variationSeed = 0) {
  const p1 = searchTerms[0]?.exactKeyword || "Women Wine Maroon Square Neck Short Kurti";
  const p2 = searchTerms[1]?.exactKeyword || "Women Black High Waist Flared Bootcut Jeans";
  const p3 = searchTerms[2]?.exactKeyword || "Oxidized Silver Kamarbandh Waist Chain";
  const p4 = searchTerms[3]?.exactKeyword || "Vintage Faux Leather Shoulder Bag";
  const shortP1 = p1.replace(/^Women\s+/i, "").split(" ").slice(0, 4).join(" ");
  const shortP2 = p2.replace(/^Women\s+/i, "").split(" ").slice(0, 4).join(" ");
  const shortP3 = p3.replace(/^Women\s+/i, "").split(" ").slice(0, 4).join(" ");
  const priceTag = (searchTerms[0]?.priceFilter || "Under \u20B9349").split("\xB7")[0].trim();
  const mastermindHooksPool = [
    `Stop wearing ${shortP1} with skinny jeans\u2014pair it with ${shortP2} instead (${priceTag}) \u{1F62D}`,
    `I gatekept this ${priceTag} Meesho 4-piece outfit combo for months because it makes 5'0" girls look 5'5" \u{1F440}`,
    `How 4 budget Meesho pieces (${priceTag}) look like a \u20B94,500 Pinterest outfit\u2014wait till you see Piece 3 \u2728`,
    `Send this to that best friend who always says "I have nothing to wear" 10 minutes before leaving \u{1F480}`,
    `POV: You stopped buying random kurtis and started using this 4-piece body-proportion styling trick \u{1F525}`,
    `Why is nobody talking about how ${shortP1} + ${shortP3} completely changes your waist proportion?!`
  ];
  const offset = Math.abs(Number(variationSeed) || 0);
  const defaultThreeMastermindHooks = [
    mastermindHooksPool[offset % mastermindHooksPool.length],
    mastermindHooksPool[(offset + 1) % mastermindHooksPool.length],
    mastermindHooksPool[(offset + 2) % mastermindHooksPool.length]
  ];
  const rawHooks = Array.isArray(rawReelPack?.onScreenHooks) ? rawReelPack.onScreenHooks : [];
  const finalHooks = [0, 1, 2].map((idx) => {
    const candidate = String(rawHooks[idx] || "").trim();
    if (!candidate || isSlopHook(candidate)) {
      return defaultThreeMastermindHooks[idx];
    }
    return candidate;
  });
  const p1Lower = `${p1} ${p2} ${conceptTitle}`.toLowerCase();
  const dynamicRealHashtags = ["#meeshofinds"];
  if (p1Lower.includes("kurti")) {
    dynamicRealHashtags.push("#shortkurtistyling", "#kurtijeanscombo");
  } else if (p1Lower.includes("shirt") || p1Lower.includes("vest") || p1Lower.includes("korean")) {
    dynamicRealHashtags.push("#collegeoutfitideas", "#pintrestoutfitsindia");
  } else {
    dynamicRealHashtags.push("#indianoutfitideas", "#meeshohaul");
  }
  if (p1Lower.includes("5'0") || p1Lower.includes("height") || p1Lower.includes("bootcut") || p1Lower.includes("high waist")) {
    dynamicRealHashtags.push("#petitefashionindia");
  } else {
    dynamicRealHashtags.push("#collegeoutfitideas");
  }
  dynamicRealHashtags.push("#meeshohaul", "#indianoutfitideas", "#affordablestyling");
  const uniqueRealHashtags = Array.from(new Set(dynamicRealHashtags)).slice(0, 5);
  while (uniqueRealHashtags.length < 5) {
    const nextTag = VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS[uniqueRealHashtags.length % VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS.length];
    if (!uniqueRealHashtags.includes(nextTag)) {
      uniqueRealHashtags.push(nextTag);
    } else {
      break;
    }
  }
  const BANNED_SEO_REGEX = /\b(neoprene|winter coat|parka|trench coat|snow|cyberpunk|futuristic|dual mood)\b/i;
  const defaultBuyerSeoKeywords = [
    p1.toLowerCase(),
    p2.toLowerCase(),
    p3.toLowerCase(),
    "meesho short kurti with bootcut jeans combo",
    "best meesho outfit combination under 399",
    "height illusion outfit ideas for 5ft girls india",
    "college outfit ideas meesho haul 2026",
    "how to style short kurti to look taller and slimmer",
    "warm indian skin tone kurti color combinations",
    "meesho hidden gems wishlist links"
  ];
  const rawSeo = Array.isArray(rawReelPack?.seoKeywords) ? rawReelPack.seoKeywords.map((k) => String(k).trim()).filter((k) => k && !BANNED_SEO_REGEX.test(k)) : [];
  const mergedSeo = Array.from(/* @__PURE__ */ new Set([...defaultBuyerSeoKeywords.slice(0, 4), ...rawSeo, ...defaultBuyerSeoKeywords])).slice(0, 10);
  const triggerWord = rawReelPack?.autoDmTriggerWord || "LINK";
  const rawCaption = String(rawReelPack?.hinglishCaption || "").trim();
  const isCaptionTooShortOrSlop = rawCaption.length < 140 || BANNED_SLOP_HOOK_REGEX.test(rawCaption);
  const englishCaptionStylingSummary = `Pair ${p1} with ${p2} worn high at the natural waist, add ${p3} to cinch and define your silhouette, and finish with ${p4} for a complete head-to-toe look!`;
  const mastermindCaption = isCaptionTooShortOrSlop ? `Be honest\u2014which piece from this 4-piece combo are you adding to your Meesho wishlist first: 1, 2, 3, or all 4? \u{1F62D}\u2728

Most girls buy good clothes on Meesho but wear them in a basic way. Here is the exact 4-Piece Look-Transformation Formula so you look taller, snatched, and put-together:

1\uFE0F\u20E3 Piece 1 (Top): ${p1} (${priceTag})
2\uFE0F\u20E3 Piece 2 (Bottom): ${p2}
3\uFE0F\u20E3 Piece 3 (The Secret Proportion Trick): ${p3}
4\uFE0F\u20E3 Piece 4 (Completer): ${p4}

\u{1F4A1} How to Style It Together: ${englishCaptionStylingSummary}

\u{1F449} Comment "${triggerWord}" below and I will Auto-DM you all 4 review-checked Meesho product links in 5 seconds! (Make sure you are following me so my DM doesn't get hidden in your message requests \u{1F495})

\u{1F4CC} Save this Reel right now before your next shopping haul & send it to your bestie!` : rawCaption;
  return {
    onScreenHooks: finalHooks,
    autoDmTriggerWord: triggerWord,
    hinglishCaption: mastermindCaption,
    seoKeywords: mergedSeo,
    trendingHashtags: uniqueRealHashtags.slice(0, 5)
  };
}
var ROYAL_MEESHO_COLOR_CHIPS = [
  {
    name: "Deep Wine / Maroon",
    hex: "#6B1D2F",
    bestPairingBottom: "Jet Black High Waist Flared Bootcut Jeans",
    bestMetallicAccent: "Oxidized Silver Kamarbandh & Jhumka",
    skinGlowEffectHinglish: "Deep Wine shade har Indian skin tone (fair, wheatish, dusky) par royal contrast banata hai aur body ko turant 2 size slim dikhata hai."
  },
  {
    name: "Emerald / Bottle Green",
    hex: "#0F5238",
    bestPairingBottom: "Warm Ivory Cream High Waist Wide Leg Trousers",
    bestMetallicAccent: "Antique Gold Layered Waist Chain & Statement Studs",
    skinGlowEffectHinglish: "Bottle Green + Cream combination sasti nahi balki \u20B95,000+ Sabyasachi/Pinterest royal vibe deta hai aur chehre par instant glow lata hai."
  },
  {
    name: "Jet Black",
    hex: "#18181B",
    bestPairingBottom: "Dark Indigo High Waist Wide Leg Denim Jeans",
    bestMetallicAccent: "Chunky Oxidized Silver Afghan Waist Belt & Jhumkas",
    skinGlowEffectHinglish: "Jet Black tummy aur heavy arms ko 100% hide karta hai aur oxidized silver ke saath milkar jaw-dropping Desi Baddie look banata hai."
  },
  {
    name: "Rust / Terracotta Orange",
    hex: "#B84A27",
    bestPairingBottom: "Jet Black High Waist Flared Palazzo Trousers",
    bestMetallicAccent: "Oxidized Silver Coin Choker & Kamarbandh",
    skinGlowEffectHinglish: "Rust Terracotta warm Indian skin par golden-hour filter jaisa kaam karta hai\u2014bina makeup ke bhi chehra bright aur fresh lagta hai."
  },
  {
    name: "Royal Navy Blue",
    hex: "#1E2952",
    bestPairingBottom: "Crisp White or Beige High Waist Straight Fit Jeans",
    bestMetallicAccent: "Silver Layered Waist Chain & Minimal Hoop Earrings",
    skinGlowEffectHinglish: "Navy Blue heavy upper body ko slim structure deta hai aur Beige/White bottom ke saath Old-Money luxury look deta hai."
  },
  {
    name: "Ivory / Off-White Cream",
    hex: "#F5EFE6",
    bestPairingBottom: "Dark Espresso Brown or Black High Waist Wide Leg Pants",
    bestMetallicAccent: "Gold Pearl Drop Jhumkas & Structured Sling Bag",
    skinGlowEffectHinglish: "Ivory Cream chehre ke niche natural reflector ka kaam karta hai jisse dark circles kam dikhte hain aur face 100x radiant lagta hai."
  },
  {
    name: "Dusty Rose / Mauve Pink",
    hex: "#B56576",
    bestPairingBottom: "Charcoal Black or Dark Blue High Waist Bootcut Jeans",
    bestMetallicAccent: "Oxidized Silver Delicate Waist Chain & Bangles",
    skinGlowEffectHinglish: "Baby pink kiddy lag sakta hai, par Dusty Rose/Mauve dark bottom ke saath mature, soft-romantic aur super classy lagta hai."
  },
  {
    name: "Mustard / Haldi Gold",
    hex: "#D99B26",
    bestPairingBottom: "Deep Maroon or Jet Black High Waist Flared Palazzo",
    bestMetallicAccent: "Antique Oxidized Ghungroo Jhumkas & Potli Bag",
    skinGlowEffectHinglish: "Mustard ko kabhi bright red/blue ke saath mat pehno (joker look aata hai)\u2014ise Jet Black ya Deep Maroon ke saath pair karne se 100x royal festive look aata hai."
  },
  {
    name: "Coffee / Espresso Brown",
    hex: "#4A2C2A",
    bestPairingBottom: "Cream Beige High Waist Pleated Korean Trousers",
    bestMetallicAccent: "Minimalist Gold Buckle Belt & Vintage Baguette Bag",
    skinGlowEffectHinglish: "Espresso Brown + Beige 2026-2027 ka sabse bada Old-Money aesthetic hai jo chubby aur petite dono body types ko rich aur tall dikhata hai."
  },
  {
    name: "Teal / Peacock Blue",
    hex: "#0D5C63",
    bestPairingBottom: "Jet Black High Waist Stretchable Flared Jeans",
    bestMetallicAccent: "Oxidized Silver Temple Jhumkas & Kamarbandh",
    skinGlowEffectHinglish: "Peacock Teal aankhon aur jawline ko highlight karta hai aur har body shape ko hourglass structure deta hai."
  }
];
var BODY_GLOWUP_GOALS = [
  {
    id: "universal-100x",
    label: "\u2728 100x Royal Glow-Up (Any Face & Body)",
    hinglishTag: "Har ladki ko 100x royal, slim aur model-jaisa dikhane wala formula",
    neckAndCutRule: "Square Neck Fitted Empire-Waist Short Kurti Top",
    hinglishTransformationPromise: "Square neckline collarbone dikha kar chehre ko patla aur sharp dikhati hai, aur 30:70 high-waist proportion kisi bhi normal ya sadharan look ko 100x expensive model look mein badal deta hai."
  },
  {
    id: "chubby-curvy-slim",
    label: "\u{1F525} Chubby / Plus-Size \u2192 Instant Slim Hourglass",
    hinglishTag: "Moti / Heavy Body & Lower Tummy ko 100% slim hourglass dikhane wala trick",
    neckAndCutRule: "V-Neck Peplum Empire-Waist A-Line Short Kurti",
    hinglishTransformationPromise: "V-Neck gardan ko lamba aur double-chin/round face ko slim dikhata hai. Empire-waist A-line flare pet (lower tummy) par bilkul chipakta nahi, aur diagonal waist-chain kamar ko 3 inch patli dikhati hai!"
  },
  {
    id: "short-height-tall",
    label: `\u{1F4CF} 5'0" Short Height \u2192 5'5" Tall Model Illusion`,
    hinglishTag: "Choti height wali ladkiyon ko 4-5 inch lamba dikhane wala 30:70 math",
    neckAndCutRule: "19-Inch Cropped Square-Neck Fitted Kurti Top",
    hinglishTransformationPromise: `19-inch short kurti kamar par khatam hoti hai aur 39-inch high-waist bootcut ankle tak vertical line banati hai\u2014bina heels ke bhi height 5'5" lagti hai.`
  },
  {
    id: "dusky-skin-radiance",
    label: "\u{1F48E} Dusky / Dark Skin \u2192 100x Golden-Hour Glow",
    hinglishTag: "Dusky ya dull skin ko bina heavy makeup 100x bright aur royal dikhane wala shade",
    neckAndCutRule: "Sweetheart Neck Kashmiri Embroidered Cotton Short Kurti",
    hinglishTransformationPromise: "Rich jewel tones (Wine, Emerald, Rust, Ivory) aur \u091A\u0947\u0939\u0930\u0947 ke paas oxidized/gold jhumke natural light reflect karte hain jisse dusky skin sone (gold) jaisi chamakti hai."
  }
];
function synthesizeCustomSimilarOutfitReelPack(currentReel, userMessage, selectedColors, bodyGoalId, uploadedImages, backgroundDesc) {
  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);
  const allCandidateColors = [
    ...selectedColors,
    ...uploadedImages.map((img) => img.dominantColorName).filter(Boolean)
  ];
  const matchedColorObj = ROYAL_MEESHO_COLOR_CHIPS.find(
    (chip) => allCandidateColors.some(
      (c) => chip.name.toLowerCase().includes(c.toLowerCase().split(" ")[0])
    )
  ) || ROYAL_MEESHO_COLOR_CHIPS.find(
    (chip) => userMessage.toLowerCase().includes(chip.name.toLowerCase().split(" ")[0])
  ) || ROYAL_MEESHO_COLOR_CHIPS[0];
  const primaryColorClean = matchedColorObj.name.split("/")[0].trim();
  const chosenGoal = BODY_GLOWUP_GOALS.find((g) => g.id === bodyGoalId) || BODY_GLOWUP_GOALS[0];
  const msgLower = (userMessage || "").toLowerCase();
  let customTopDescriptor = `${primaryColorClean} ${chosenGoal.neckAndCutRule}`;
  if (msgLower.includes("shirt") || msgLower.includes("korean")) {
    customTopDescriptor = `${primaryColorClean} V-Neck Cropped Poplin Shirt Top`;
  } else if (msgLower.includes("peplum") || msgLower.includes("frock")) {
    customTopDescriptor = `${primaryColorClean} V-Neck Empire Waist Peplum Short Kurti`;
  } else if (msgLower.includes("chikankari")) {
    customTopDescriptor = `${primaryColorClean} Modal Cotton Chikankari Short Kurti`;
  } else if (msgLower.includes("kashmiri") || msgLower.includes("embroider")) {
    customTopDescriptor = `${primaryColorClean} Kashmiri Aari Embroidered V-Neck Short Kurti`;
  } else if (msgLower.includes("corset") || msgLower.includes("crop top")) {
    customTopDescriptor = `${primaryColorClean} Square Neck Ruched Bodice Fitted Crop Top`;
  }
  let customBottomDescriptor = matchedColorObj.bestPairingBottom;
  if (msgLower.includes("white jeans") || msgLower.includes("cream trouser")) {
    customBottomDescriptor = "Women Cream Beige High Waist Wide Leg Pleated Korean Trousers";
  } else if (msgLower.includes("blue jeans") || msgLower.includes("denim")) {
    customBottomDescriptor = "Women Dark Indigo Blue High Waist Flared Bootcut Stretchable Jeans";
  } else if (msgLower.includes("palazzo") || msgLower.includes("plazo")) {
    customBottomDescriptor = "Women Jet Black High Waist Flared Rayon Palazzo Trousers";
  } else if (msgLower.includes("skirt")) {
    customBottomDescriptor = "Women Jet Black High Waist A-Line Midi Slit Skirt";
  }
  const piece1Keyword = sanitizeMeeshoSearchTerm(
    `Women ${customTopDescriptor}`,
    0
  );
  const piece2Keyword = sanitizeMeeshoSearchTerm(customBottomDescriptor, 1);
  const piece3Keyword = sanitizeMeeshoSearchTerm(
    matchedColorObj.bestMetallicAccent.includes("Gold") ? "Women Antique Gold Layered Kamarbandh Belly Waist Chain" : "Women Oxidized Silver Layered Kamarbandh Belly Waist Chain",
    2
  );
  const piece4Keyword = sanitizeMeeshoSearchTerm(
    matchedColorObj.bestMetallicAccent.includes("Gold") ? "Women Tan Brown Structured Vintage Shoulder Baguette Bag and Gold Jhumka" : "Women Black Retro Mini Shoulder Baguette Bag and Oxidized Jhumka",
    3
  );
  const searchTerms = [
    {
      itemLabel: `Piece 1 \xB7 100x Face-Framing & Slimming Top (${primaryColorClean})`,
      exactKeyword: piece1Keyword,
      backupSearchKeywords: [
        `${primaryColorClean.toLowerCase()} v neck short kurti women cotton`,
        `${primaryColorClean.toLowerCase()} square neck peplum top women`
      ],
      howToCombineAndStyle: `Easy Hinglish: Aapko jo ${primaryColorClean} piece mila hai, uski sleeves ko kohni (elbows) tak push karo taaki kalai (wrists) patli dikhe aur neckline khuli rahe\u2014isse chehra aur gardan turant slim aur royal lagte hain.`,
      priceFilter: "Under \u20B9329 \xB7 4.2\u2605+ Rated",
      fabricAndFitCheck: "Meesho customer review photos mein check karo ki \u0915\u092A\u0921\u093C\u093E \u092E\u094B\u091F\u093E (non-see-through matte cotton/rayon) ho\u2014shiny polyester mat lena kyunki shiny kapda tummy ko bada dikhata hai.",
      platform: "Meesho"
    },
    {
      itemLabel: "Piece 2 \xB7 Tummy-Control & Height-Elongating Bottom",
      exactKeyword: piece2Keyword,
      backupSearchKeywords: [
        "high waist flared bootcut jeans women black",
        "high waist wide leg pleated trousers women"
      ],
      howToCombineAndStyle: "Easy Hinglish: Ise nabhi (belly button) se 1 inch upar high-waist pehno. Iska dark/structured high-rise waistband lower tummy ko 100% flat hold karta hai aur legs ko 4 inch lamba dikhata hai.",
      priceFilter: "Under \u20B9449 \xB7 Free Delivery",
      fabricAndFitCheck: "Reviews mein 'High Rise' aur '38-39 inch length' zaroor check karo taaki neeche ankle par clean flare aaye.",
      platform: "Meesho"
    },
    {
      itemLabel: "Piece 3 \xB7 Secret Hourglass Waist-cinching Transformer",
      exactKeyword: piece3Keyword,
      backupSearchKeywords: [
        "oxidized silver waist chain kamarbandh women",
        "slim gold waist belt for kurti jeans"
      ],
      howToCombineAndStyle: "Easy Hinglish: Is waist chain ko bilkul seedha (tight horizontal) mat bandho\u2014ise kamar par halka V-shape (diagonal drop) mein lagao. Ye optical illusion sabse heavy/chubby kamar ko bhi turant 3 inch slim hourglass dikhata hai!",
      priceFilter: "Under \u20B9179 \xB7 High Save Trigger",
      fabricAndFitCheck: "Review photo mein matte oxidized ya antique gold finish check karo (zyada chamakne wala plastic/yellow metal avoid karo).",
      platform: "Meesho"
    },
    {
      itemLabel: "Piece 4 \xB7 100x Facial Glow & Rich-Vibe Finisher",
      exactKeyword: piece4Keyword,
      backupSearchKeywords: [
        "black retro shoulder baguette bag women",
        "oxidized silver dome jhumka earrings women"
      ],
      howToCombineAndStyle: "Easy Hinglish: Baguette bag ko underarm (kandhe ke bilkul niche) carry karo\u2014lamba latakta hua sling bag hips ko choda dikhata hai, jabki underarm bag height ko lamba aur look ko \u20B95,000+ model jaisa banata hai!",
      priceFilter: "Under \u20B9269",
      fabricAndFitCheck: "Check customer photos for stiff structured faux leather that holds its shape.",
      platform: "Meesho"
    }
  ];
  const uploadedSummaryText = uploadedImages.length > 0 ? `Aapke upload kiye hue ${uploadedImages.length} Meesho screenshots (${uploadedImages.map((u, i) => `Photo #${i + 1}: ${u.dominantColorName}`).join(", ")})` : `Aapke bataye hue similar kapde aur colors (${primaryColorClean})`;
  const stylistVerdictHinglish = {
    bestChoiceFromUploads: `${uploadedSummaryText} mein se sabse BEST aur 100x Royal choice hai: **${primaryColorClean} Top/Kurti** ko **${piece2Keyword.replace(/^Women\s+/i, "")}** ke saath pair karna! Agar aapke screenshots mein koi bahut bada print ya shiny/neon \u0915\u092A\u0921\u093C\u093E hai, toh use chhod kar sabse solid/small-motif matte **${primaryColorClean}** wala piece select karo.`,
    whatToAvoidAndWhy: `\u274C **Joker / Kiddy Look Se Kaise Bachein:** Kabhi bhi 2 loud colors ek saath mat pehno (jaise ${primaryColorClean} ke niche bright red, yellow ya light sky-blue legging/jeans) aur na hi bade cartoon/plastic accessories lagao\u2014usse look childish aur sasta lagta hai. Humne **60-30-10 Royal Color Law** lagaya hai: 60% ${primaryColorClean} + 30% Deep Slimming Contrast Bottom + 10% Matte Metallic Accent.`,
    hundredXGlowUpScience: `\u{1F48E} **Kisi Bhi Ladki (Chubby, Short ya Dusky) Ko 100x Beautiful Dikhane Ka Secret:** ${chosenGoal.hinglishTransformationPromise} Saath hi ${matchedColorObj.skinGlowEffectHinglish}`,
    stepByStepDrapingTrick: `\u2728 **Exact Pehenne Ka Mastermind Tarika:** (1) Piece 1 (${primaryColorClean}) ki neckline khuli rakho aur sleeves kohni tak fold karo. (2) Piece 2 ko high-waist pehno taaki pet (tummy) poori tarah tuck-in ho jaye. (3) Piece 3 (Waist Chain) ko kamar par V-drop mein lagao. (4) Piece 4 (Underarm Bag + Jhumke) pehno\u2014chehra aur body structure 100x model jaisa lagega!`,
    colorHarmonyFormula: `60% ${primaryColorClean} (Face Glow) + 30% ${piece2Keyword.includes("Cream") || piece2Keyword.includes("Beige") ? "Warm Ivory/Beige" : "Deep Slimming Black/Indigo"} (Body Structure) + 10% ${matchedColorObj.bestMetallicAccent.includes("Gold") ? "Antique Gold" : "Matte Oxidized Silver"} (Royal Highlight)`
  };
  const displayTitle = `Custom 100x Royal Glow-Up Combo: ${primaryColorClean} ${chosenGoal.neckAndCutRule.replace(
    /^19-Inch\s+/i,
    ""
  )} + ${piece2Keyword.replace(/^Women\s+/i, "")}`;
  const howToCombineAllFourHinglish = `Sabse pehle aapka chuna hua Piece 1 (${primaryColorClean}) aur Piece 2 (${piece2Keyword.replace(
    /^Women\s+/i,
    ""
  )}) 30:70 high-waist proportion mein pehno\u2014ye tummy ko hide karke legs ko 4 inch lamba dikhata hai. Ab kamar par Piece 3 (Waist Chain) ko V-drop mein lagao aur Piece 4 (Underarm Bag + Jhumke) ke saath look complete karo!`;
  const prompts = buildMasterPrompts(
    searchTerms,
    backgroundDesc,
    displayTitle,
    howToCombineAllFourHinglish
  );
  const reelPack = enforceMastermindViralReelPack(
    searchTerms,
    displayTitle,
    howToCombineAllFourHinglish,
    void 0,
    Date.now() % 100
  );
  const updatedReelPack = {
    id: `reel-custom-stylist-${Date.now()}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    themeInput: userMessage || `${primaryColorClean} Similar Meesho Match`,
    providerUsed: `100x Royal Glow-Up AI Stylist (${dailyCtx.formattedDate})`,
    concept: {
      title: displayTitle,
      category: "Body Proportion & Color Hacks",
      liveDailyTrendTag: `100x Custom Similar-Item Match \xB7 ${stylistVerdictHinglish.colorHarmonyFormula}`,
      curiosityIdentityAngle: `${stylistVerdictHinglish.bestChoiceFromUploads} ${stylistVerdictHinglish.hundredXGlowUpScience}`,
      firstTwoSecondVisual: "0.0s\u20131.5s: Ek realistic faceless female hand aapke chune hue charon matching kapdon ko bina hanger ke ek saath pakad kar dikha raha hai.",
      whyItTriggersSharesAndSaves: "Ladkiyan is Reel ko turant Save aur apni bestie ko DM karengi kyunki ye koi joker/kiddy outfit nahi, balki har body type (chubby, petite, dusky) ko 100x slim, lamba aur royal dikhane wala 60-30-10 color combination hai!",
      lookTransformationFormula: {
        beforeVsAfterLook: `Pehle (Confusing / Mismatched Look): Jab Meesho par exact same piece nahi milta toh galat color/fit lene se look bulky, sasta ya joker jaisa lagne ka darr rehta hai. -> Ab (100x Royal Glow-Up Look): ${stylistVerdictHinglish.hundredXGlowUpScience}`,
        howToCombineAllFourPieces: howToCombineAllFourHinglish,
        threeWaysToRestyleCombo: [
          `1. Everyday Slimming College/Office Look (Hinglish): Piece 1 (${primaryColorClean}) + Piece 2 ko underarm bag aur stud earrings ke saath clean minimal style mein pehno.`,
          `2. 100x Hourglass Date/Cafe Look (Hinglish): Kamar par Piece 3 (Waist Chain) V-drop mein add karo aur sleeves kohni tak push karo\u2014instant hourglass silhouette!`,
          `3. Festive / Family Function Look (Hinglish): Statement jhumke, gajra/bangles aur block heels add karke isi outfit ko \u20B94,000+ designer look bana do.`
        ]
      },
      colorPalette: [
        primaryColorClean,
        piece2Keyword.includes("Cream") ? "Warm Ivory Cream" : "Jet Black",
        matchedColorObj.bestMetallicAccent.includes("Gold") ? "Antique Gold" : "Oxidized Silver",
        "Warm Skin-Glow Neutral"
      ],
      shotByShotPlan: [
        {
          timeRange: "0.0s \u2013 1.5s",
          visualAction: "Haath mein pakde hue aapke naye chune hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke dikhao.",
          onScreenText: reelPack.onScreenHooks[0]
        },
        {
          timeRange: "1.5s \u2013 3.0s",
          visualAction: "Full-Body Look ya Mirror Try-On (Prompt 0A/0B): 60-30-10 Color Harmony aur 30:70 Slimming Proportion saaf dikhao.",
          onScreenText: `100x Slimming & Glow Formula: ${primaryColorClean} + High-Rise Fit`
        },
        {
          timeRange: "3.0s \u2013 4.5s",
          visualAction: "Piece 3 (V-Drop Waist Chain) ka close-up + 1 second ke liye aapka Meesho screenshot / customer review photo flash karo.",
          onScreenText: `The Secret 3rd Piece That Creates an Instant Hourglass Waist`
        },
        {
          timeRange: "4.5s \u2013 6.0s",
          visualAction: "Piece 4 (Underarm Bag & Jhumka) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText: "Comment 'LINK' below & check your DM in 5s before this color sells out! \u{1F62D}"
        }
      ]
    },
    searchTerms,
    prompts,
    reelPack
  };
  return {
    stylistVerdictHinglish,
    updatedReelPack
  };
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
var GROQ_FALLBACK_KEY = process.env.GROQ_API_KEY || "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";
var OPENROUTER_FALLBACK_KEY = process.env.OPENROUTER_API_KEY || "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";
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then((val) => {
      clearTimeout(timer);
      resolve(val);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
async function callOpenAICompatibleJSON(endpoint, apiKey, model, systemPrompt, userPrompt, timeoutMs = 14e3) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.88,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Provider ${model} status ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "{}";
    const cleaned = content.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
    return JSON.parse(cleaned);
  } finally {
    clearTimeout(timeout);
  }
}
function synthesizeExpertReelFallback(themeInput, categoryFilter, backgroundDesc, variationIndex = 0) {
  const dailyCtx = getRealTimeDailyStylingContext(variationIndex);
  const comboPool = categoryFilter && categoryFilter !== "All" ? UNIQUE_STYLING_COMBINATION_MATRIX.filter(
    (item) => item.category === categoryFilter
  ) : UNIQUE_STYLING_COMBINATION_MATRIX;
  const activePool = comboPool.length > 0 ? comboPool : UNIQUE_STYLING_COMBINATION_MATRIX;
  const chosenCombo = activePool[(dailyCtx.dayOfYear + Math.abs(Number(variationIndex) || 0)) % activePool.length] || UNIQUE_STYLING_COMBINATION_MATRIX[0];
  const hasCustomInput = themeInput && themeInput.trim().length > 0;
  const baseTopic = hasCustomInput ? themeInput.trim() : chosenCombo.comboName;
  const cleanUserProductWord = hasCustomInput ? sanitizeMeeshoSearchTerm(baseTopic, 0) : "";
  const isShortProductKeyword = hasCustomInput && baseTopic.split(" ").length <= 5 && !/zodiac|birth month|personality|playlist|fictional|choose a number/i.test(
    baseTopic
  );
  const searchTerms = chosenCombo.pieces.map((piece, idx) => {
    if (idx === 0 && isShortProductKeyword && cleanUserProductWord) {
      return {
        ...piece,
        itemLabel: `Piece 1 \xB7 Hero Statement Top (${baseTopic})`,
        exactKeyword: `Women ${cleanUserProductWord} Square Neck Fitted Short Kurti Top`,
        backupSearchKeywords: [
          `${cleanUserProductWord} embroidered cotton women`,
          ...(piece.backupSearchKeywords || []).slice(0, 1)
        ]
      };
    }
    return {
      ...piece,
      exactKeyword: sanitizeMeeshoSearchTerm(piece.exactKeyword, idx)
    };
  });
  const displayTitle = hasCustomInput ? `${baseTopic} \u2014 4-Piece Look-Transformation Styling Combo` : chosenCombo.comboName;
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
    void 0,
    variationIndex
  );
  return {
    id: `reel-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    themeInput: baseTopic,
    providerUsed: `2026 Live Daily Styling AI (${dailyCtx.formattedDate})`,
    concept: {
      title: displayTitle,
      category: chosenCombo.category,
      liveDailyTrendTag: `${dailyCtx.liveDailyTrendTag} \xB7 ${dailyCtx.todaysStylingFocus}`,
      curiosityIdentityAngle: chosenCombo.simpleVibeSummary,
      firstTwoSecondVisual: "0.0s\u20131.5s: Ek realistic faceless female hand charon matching kapdon ko upar se ek saath pakad kar dikha raha hai (bina hanger ke), piche aapka chuna hua room background hai.",
      whyItTriggersSharesAndSaves: "Ladkiyan is Reel ko turant Save aur apni bestie ko Share karti hain kyunki isme random kapde nahi, balki 4-piece Mix & Match styling formula aur exact Meesho search names diye gaye hain.",
      lookTransformationFormula: {
        beforeVsAfterLook: chosenCombo.beforeVsAfterLook,
        howToCombineAllFourPieces: chosenCombo.howToCombineAllFourPieces,
        threeWaysToRestyleCombo: chosenCombo.threeWaysToRestyleCombo
      },
      colorPalette: chosenCombo.colorPalette,
      shotByShotPlan: [
        {
          timeRange: "0.0s \u2013 1.5s",
          visualAction: "Haath mein pakde hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke halka sa move karte hue dikhao.",
          onScreenText: reelPack.onScreenHooks[0]
        },
        {
          timeRange: "1.5s \u2013 3.0s",
          visualAction: "Full-Body Look ya Faceless Mirror Model (Prompt 0A/0B ya Prompt 5): Model ne Piece 1 + Piece 2 ek saath pehna hua hai.",
          onScreenText: `Piece 1 + 2: ${searchTerms[0].exactKeyword.replace(/^Women\s+/i, "").slice(0, 30)} + High-Waist Fit`
        },
        {
          timeRange: "3.0s \u2013 4.5s",
          visualAction: "Piece 3 (Waist Chain / Layer Detail) ka close-up shot aur Meesho search bar ka screenshot dikhao.",
          onScreenText: `The Secret 3rd Piece That Fixes Your Waistline: ${searchTerms[2].exactKeyword.replace(/^Women\s+/i, "").slice(0, 26)}`
        },
        {
          timeRange: "4.5s \u2013 6.0s",
          visualAction: "Ek haath mein Piece 4 (Bag & Jewelry Completer) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText: "Comment 'LINK' below & check your DM in 5s before Piece 1 goes out of stock! \u{1F62D}"
        }
      ]
    },
    searchTerms,
    prompts,
    reelPack
  };
}
function stripBrandFromEbookText(input) {
  return String(input || "").replace(/GlowCash AI Studio/gi, "2026 Insider Vault").replace(/GlowCash Edition/gi, "2026 Private Insider Edition").replace(/GlowCash/gi, "Insider").replace(/1\.5[x×]\s*royalty(\s*rate|\s*batch)?/gi, "clean < -60dB noise floor (required to pass moderation)").replace(/low[-‑\s]traffic\s*batch/gi, "zero-background-noise recording window").replace(/sort\s*by\s*["“']?No\s*Instagram\s*DM["”']?/gi, "tick Left Sidebar -> Business Type: Manufacturer + TrustSEAL Verified").replace(/["“']?No\s*Instagram\s*DM["”']?\s*filter/gi, "Left Sidebar 'Business Type: Manufacturer' filter").replace(/set\s*["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "select City: Surat/Jaipur + Left Sidebar: Business Type -> Manufacturer").replace(/["“']?Stock\s*Value["”']?\s*>\s*["“']?₹?50\s*Lakh["”']?/gi, "Business Type: Manufacturer + TrustSEAL Verified");
}
app.post("/api/boost-idea", async (req, res) => {
  const { rawInput = "", category = "All", mode = "reel" } = req.body || {};
  const boostedOptions = boostUserIdeaOptions(rawInput, category);
  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);
  const isEbookMode = mode === "ebook" || String(category).toLowerCase().includes("ebook") || String(category).toLowerCase().includes("certif") || String(category).toLowerCase().includes("secret") || String(category).toLowerCase().includes("client") || String(category).toLowerCase().includes("skincare") || String(category).toLowerCase().includes("income");
  if (GROQ_FALLBACK_KEY) {
    try {
      const systemPrompt = isEbookMode ? `You are a Late-2026 / 2027 Underground Digital Guide & Insider Knowledge Strategist in India.
Turn the user's raw topic and category ("${category}") into 4 completely different, extreme-FOMO, zero-fluff Ebook Playbook titles in SUPER-SIMPLE ENGLISH.
RULES:
1. NO generic "hawa-hawa" titles like "How to Make Money Online", "Start Affiliate Marketing", or "Resell PDFs".
2. Use 100% verified, jaw-dropping 2026\u20132027 underground systems: ElevenLabs Voice Library Passive USD Royalties (elevenlabs.io), IndiaMART TrustSEAL Wholesale Factory AI Catalog Arbitrage (dir.indiamart.com), $10/15-Min Speak-Out-Loud Software Testing (usertesting.com / trymata.com / dscout.com), Adobe Stock AI Copy-Space Vectors (contributor.stock.adobe.com), Free Verified Certificates (Harvard CS50x, Tata/JPMorgan Forage), or \u20B9150 Indian Pharmacy Generic Salt Dupes (Aziderm, Glyco-6, Hyalugel).
3. Never use the word "GlowCash".
Return strictly compact JSON: {"boostedIdeas": ["title 1", "title 2", "title 3", "title 4"]}` : `You are a "Lakho Mein Ek" Real-Time Personal Stylist & Meesho Mix-and-Match Outfit Combination Expert in India (Live Date: ${dailyCtx.formattedDate} | Today's Daily Focus: ${dailyCtx.todaysStylingFocus}).
Turn the user's raw fashion keyword into 4 completely different, unique, non-generic 4-Piece Outfit Combination & Look-Transformation ideas in SUPER-SIMPLE, EASY-TO-UNDERSTAND ENGLISH.
RULES:
1. NEVER suggest generic "Top 5 Kurtis". Instead, combine 4 specific pieces with Exact-Inch Body-Proportion Math (e.g., "19-Inch Wine Square-Neck Short Kurti + 39-Inch High-Rise Flared Bootcut Jeans + Oxidized Kamarbandh + Vintage Baguette Bag").
2. Focus on how the combination transforms the person's look (makes 5'0" girls look 5'5", hides lower tummy on Pear/Mid-Size bodies, glows on warm Indian skin, or builds a complete 4-piece look under \u20B91,199).
3. Use simple, everyday English words.
Return strictly compact JSON: {"boostedIdeas": ["combo idea 1", "combo idea 2", "combo idea 3", "combo idea 4"]}`;
      const parsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        systemPrompt,
        `Raw Input: "${rawInput || (isEbookMode ? "2026-2027 Underground Insider Guide" : "Unique 4-Piece Kurti & Jeans Body-Proportion Styling Combination")}" | Category: "${category}" | Live Date: ${dailyCtx.formattedDate} | Seed: ${Date.now()}`,
        8e3
      );
      if (Array.isArray(parsed?.boostedIdeas) && parsed.boostedIdeas.length > 0) {
        return res.json({
          boostedIdeas: parsed.boostedIdeas.slice(0, 4).map((t) => stripBrandFromEbookText(String(t)))
        });
      }
    } catch {
    }
  }
  return res.json({ boostedIdeas: boostedOptions });
});
app.post("/api/generate-reel", async (req, res) => {
  const {
    themeInput = "",
    categoryFilter = "All",
    backgroundDesc = "Realistic warm cream plaster wall with a lush indoor plant in soft afternoon sunlight",
    variationIndex = 0
  } = req.body || {};
  const dailyCtx = getRealTimeDailyStylingContext(Number(variationIndex));
  const comboPool = categoryFilter && categoryFilter !== "All" ? UNIQUE_STYLING_COMBINATION_MATRIX.filter(
    (item) => item.category === categoryFilter
  ) : UNIQUE_STYLING_COMBINATION_MATRIX;
  const activePool = comboPool.length > 0 ? comboPool : UNIQUE_STYLING_COMBINATION_MATRIX;
  const randomCombo = activePool[(dailyCtx.dayOfYear + Math.floor(Math.random() * activePool.length) + Number(variationIndex)) % activePool.length] || UNIQUE_STYLING_COMBINATION_MATRIX[0];
  const effectiveTheme = themeInput && themeInput.trim().length > 0 ? themeInput.trim() : `${randomCombo.comboName} (${randomCombo.simpleVibeSummary})`;
  const jsonSchemaPrompt = `You are a Late-2026 / 2027 "Lakho Mein Ek" (1-in-100,000) Instagram Reels Algorithm Mastermind, Celebrity Indian Gen-Z Stylist & Meesho/Myntra Catalog Search Engineer in India.
LIVE REAL-TIME DATE CONTEXT: Today is ${dailyCtx.formattedDate}. Today's Live Daily Styling Focus is: "${dailyCtx.todaysStylingFocus}".
Your job is to create a 100% UNIQUE, NON-GENERIC 4-Piece Mix-and-Match Outfit Combination & Viral Reel Pack for: "${effectiveTheme}".

HOW TO MAKE THIS REEL "LAKHO MEIN EK" (STAND OUT FROM LAKHS OF NORMAL MEESHO CREATORS):
- Normal creators just show random kurtis. YOU must include:
  1. Exact-Inch 30:70 Body-Proportion Math (e.g., 19-inch Short Top/Kurti + 39-inch High-Waist Flared Bottom + Waist-Defining 3rd Piece) OR Tummy-Hide / Height Illusion math.
  2. The 1-Second Real Customer Review Reality Check (tell the creator in Shot 3 to flash a real Meesho customer review photo for 1 second to build instant 100% buyer trust).

CRITICAL TWO-LAYER LANGUAGE RULE (VIOLATION IS STRICTLY FORBIDDEN):
1. LAYER 1 \u2014 EASY HINGLISH FOR USER UNDERSTANDING ("Jo creator ko samajhne ke liye hai"):
   - Write ALL styling explanations, how to wear/combine the clothes, review checks, and video shooting instructions in SUPER-SIMPLE, FRIENDLY HINGLISH (Roman Hindi + simple English words) so the user can understand how to style the outfit effortlessly!
   - Specifically, these fields MUST be in EASY HINGLISH:
     * "curiosityIdentityAngle" (e.g., "Normal kurti-leggings pehenne ke bajaye ye 4-piece 30:70 proportion combo aapki height 4 inch lambi aur waist slim dikhata hai.")
     * "firstTwoSecondVisual" (e.g., "0.0s\u20131.5s: Ek realistic faceless female hand charon matching kapdon ko bina hanger ke ek saath pakad kar dikha raha hai.")
     * "whyItTriggersSharesAndSaves" (e.g., "Ladkiyan is Reel ko turant Save aur bestie ko Share karengi kyunki isme exact-inch body math, 1-second real review proof aur exact Meesho search names hain.")
     * "lookTransformationFormula.beforeVsAfterLook" (e.g., "Pehle (Basic Look): ... Ab (New Styled Look): ...")
     * "lookTransformationFormula.howToCombineAllFourPieces" (e.g., "Sabse pehle Piece 1 ko Piece 2 ke saath high-waist pehno, phir kamar par Piece 3 lagao aur Piece 4 carry karo...")
     * "lookTransformationFormula.threeWaysToRestyleCombo" (3 easy Hinglish ways to wear the combo)
     * "shotByShotPlan[].visualAction" (Easy Hinglish instruction on what to show in that 1.5s clip)
     * "searchTerms[].howToCombineAndStyle" (Easy Hinglish tip on how to wear/style that specific item)
     * "searchTerms[].fabricAndFitCheck" (Easy Hinglish tip on what to check in Meesho customer review photos)

2. LAYER 2 \u2014 100% CLEAN ENGLISH FOR EXTERNAL USE / COPY-PASTE ("Jo copy karke use karne ke liye hai"):
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
    "liveDailyTrendTag": "${dailyCtx.liveDailyTrendTag} \xB7 ${dailyCtx.todaysStylingFocus}",
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
      {"timeRange": "0.0s \u2013 1.5s", "visualAction": "Easy Hinglish shooting instruction", "onScreenText": "100% Clean English relatable 10-14 word stop-scroll hook"},
      {"timeRange": "1.5s \u2013 3.0s", "visualAction": "Easy Hinglish shooting instruction showing 30:70 proportion", "onScreenText": "100% Clean English Piece 1 + Piece 2 proportion secret"},
      {"timeRange": "3.0s \u2013 4.5s", "visualAction": "Easy Hinglish shooting instruction including 1-second Meesho customer review photo proof", "onScreenText": "100% Clean English Secret 3rd Piece reveal"},
      {"timeRange": "4.5s \u2013 6.0s", "visualAction": "Easy Hinglish shooting instruction", "onScreenText": "Comment LINK below & check your DM in 5s before Piece 1 sells out! \u{1F62D}"}
    ]
  },
  "searchTerms": [
    {
      "itemLabel": "Piece 1 \xB7 Upper-Body Hero Top",
      "exactKeyword": "Women [Color] [Neck/Sleeve] [Fabric] [Top/Kurti Name] (100% Pure English)",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how to tuck/wear Piece 1 with Piece 2",
      "priceFilter": "Under \u20B9349 \xB7 4.1\u2605+",
      "fabricAndFitCheck": "Easy Hinglish tip on what to check in Meesho customer review photos",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 2 \xB7 Leg-Lengthening Bottom",
      "exactKeyword": "Women [Color] High Waist [Fit/Style] [Jeans/Trousers/Palazzo] (100% Pure English)",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how this bottom changes body proportions",
      "priceFilter": "Under \u20B9449 \xB7 Free Delivery",
      "fabricAndFitCheck": "Easy Hinglish length and waist check in reviews",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 3 \xB7 Secret Third-Piece Layer / Waist Transformer",
      "exactKeyword": "Exact Pure English Meesho catalog search for Waist Chain / Vest / Shrug / Belt / Dupatta",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on how Piece 3 upgrades the whole outfit",
      "priceFilter": "Under \u20B9249 \xB7 High Save Value",
      "fabricAndFitCheck": "Easy Hinglish review check",
      "platform": "Meesho"
    },
    {
      "itemLabel": "Piece 4 \xB7 Look-Finishing Bag, Footwear & Jewelry",
      "exactKeyword": "Exact Pure English Meesho catalog search for Bag / Jhumka / Footwear",
      "backupSearchKeywords": ["Pure English Meesho search 1", "Pure English Meesho search 2"],
      "howToCombineAndStyle": "Easy Hinglish 1-sentence tip on finishing the look",
      "priceFilter": "Under \u20B9299",
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
  let aiParsed = null;
  let providerUsed = `2026 Live Daily Styling AI (${dailyCtx.formattedDate})`;
  if (GROQ_FALLBACK_KEY) {
    try {
      aiParsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        jsonSchemaPrompt,
        userPrompt,
        12e3
      );
      providerUsed = `GPT-OSS 120B Mastermind Stylist (${dailyCtx.formattedDate})`;
    } catch {
    }
  }
  if (!aiParsed) {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `${jsonSchemaPrompt}

${userPrompt}`,
            config: {
              responseMimeType: "application/json",
              thinkingConfig: { thinkingLevel: import_genai.ThinkingLevel.LOW }
            }
          }),
          1e4,
          "Gemini 4 Hydrogen"
        );
        if (response.text) {
          aiParsed = JSON.parse(response.text.trim());
          providerUsed = `Gemini 4 Hydrogen Mastermind Stylist (${dailyCtx.formattedDate})`;
        }
      }
    } catch {
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
  const validSearchTerms = aiParsed.searchTerms.length >= 4 ? aiParsed.searchTerms.slice(0, 4).map((s, i) => ({
    itemLabel: s.itemLabel || fallbackData.searchTerms[i]?.itemLabel || `Piece ${i + 1}`,
    exactKeyword: sanitizeMeeshoSearchTerm(
      s.exactKeyword || fallbackData.searchTerms[i].exactKeyword,
      i
    ),
    backupSearchKeywords: Array.isArray(s.backupSearchKeywords) && s.backupSearchKeywords.length > 0 ? s.backupSearchKeywords.slice(0, 2).map((b) => sanitizeMeeshoSearchTerm(String(b), i)) : fallbackData.searchTerms[i].backupSearchKeywords,
    howToCombineAndStyle: s.howToCombineAndStyle || fallbackData.searchTerms[i].howToCombineAndStyle,
    priceFilter: s.priceFilter || "Under \u20B9399 \xB7 4.1\u2605+",
    fabricAndFitCheck: s.fabricAndFitCheck || fallbackData.searchTerms[i].fabricAndFitCheck,
    platform: s.platform === "Myntra" || s.platform === "Both" ? s.platform : "Meesho"
  })) : fallbackData.searchTerms;
  const conceptTitle = aiParsed.concept.title || fallbackData.concept.title;
  const rawFormula = aiParsed.concept.lookTransformationFormula;
  const normalizedFormula = {
    beforeVsAfterLook: rawFormula?.beforeVsAfterLook || fallbackData.concept.lookTransformationFormula?.beforeVsAfterLook || "Transforms a basic everyday outfit into a structured, height-elongating Pinterest look.",
    howToCombineAllFourPieces: rawFormula?.howToCombineAllFourPieces || fallbackData.concept.lookTransformationFormula?.howToCombineAllFourPieces || "Combine Piece 1 (Fitted Top) with Piece 2 (High-Waist Bottom), add Piece 3 at the waist/neck, and finish with Piece 4.",
    threeWaysToRestyleCombo: Array.isArray(rawFormula?.threeWaysToRestyleCombo) && rawFormula.threeWaysToRestyleCombo.length > 0 ? rawFormula.threeWaysToRestyleCombo.map((r) => String(r)) : fallbackData.concept.lookTransformationFormula?.threeWaysToRestyleCombo || []
  };
  const masterPrompts = buildMasterPrompts(
    validSearchTerms,
    backgroundDesc,
    conceptTitle,
    normalizedFormula.howToCombineAllFourPieces
  );
  const mastermindReelPack = enforceMastermindViralReelPack(
    validSearchTerms,
    conceptTitle,
    normalizedFormula.howToCombineAllFourPieces,
    aiParsed.reelPack,
    Number(variationIndex) + Date.now()
  );
  const finalResult = {
    id: `reel-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    themeInput: effectiveTheme,
    providerUsed,
    concept: {
      title: conceptTitle,
      category: aiParsed.concept.category || fallbackData.concept.category,
      liveDailyTrendTag: aiParsed.concept.liveDailyTrendTag || fallbackData.concept.liveDailyTrendTag,
      curiosityIdentityAngle: aiParsed.concept.curiosityIdentityAngle || fallbackData.concept.curiosityIdentityAngle,
      firstTwoSecondVisual: aiParsed.concept.firstTwoSecondVisual || fallbackData.concept.firstTwoSecondVisual,
      whyItTriggersSharesAndSaves: aiParsed.concept.whyItTriggersSharesAndSaves || fallbackData.concept.whyItTriggersSharesAndSaves,
      lookTransformationFormula: normalizedFormula,
      colorPalette: Array.isArray(aiParsed.concept.colorPalette) && aiParsed.concept.colorPalette.length > 0 ? aiParsed.concept.colorPalette : fallbackData.concept.colorPalette,
      shotByShotPlan: Array.isArray(aiParsed.concept.shotByShotPlan) && aiParsed.concept.shotByShotPlan.length > 0 ? aiParsed.concept.shotByShotPlan.slice(0, 4).map((shot, idx) => {
        const rawOverlay = typeof shot === "object" && shot?.onScreenText ? String(shot.onScreenText) : "";
        const safeOverlay = !rawOverlay || isSlopHook(rawOverlay) ? fallbackData.concept.shotByShotPlan[idx]?.onScreenText || mastermindReelPack.onScreenHooks[0] : rawOverlay;
        return {
          timeRange: typeof shot === "object" && shot?.timeRange ? String(shot.timeRange) : `${(idx * 1.5).toFixed(1)}s \u2013 ${((idx + 1) * 1.5).toFixed(1)}s`,
          visualAction: typeof shot === "object" && shot?.visualAction ? String(shot.visualAction) : typeof shot === "string" ? shot : fallbackData.concept.shotByShotPlan[idx]?.visualAction || "Show outfit combination transition",
          onScreenText: safeOverlay
        };
      }) : fallbackData.concept.shotByShotPlan
    },
    searchTerms: validSearchTerms,
    prompts: masterPrompts,
    reelPack: mastermindReelPack
  };
  return res.json(finalResult);
});
app.post("/api/generate-ebook", async (req, res) => {
  const {
    topicInput = "",
    category = "All",
    priceDisplay = "\u20B919",
    anchorPriceDisplay = "\u20B91,999",
    autoDmTrigger = "SECRET",
    variationIndex = 0
  } = req.body || {};
  const defaultTopicsByCategory = {
    "2026\u20132027 Hidden USD & B2B Income Systems": "The 2026\u20132027 Underground USD & B2B Vault: ElevenLabs Voice Library Passive Royalties, IndiaMART Wholesale Factory AI Catalog Arbitrage (\u20B92,999/Deal) & $10/15-Min UserTesting Secrets",
    "Free Certifications & Career Shortcuts": "7 Free Verifiable 2026\u20132027 Certificates (Harvard CS50x, Tata/JPMorgan/BCG Forage, Google Skillshop & GitHub Student Pack) + LinkedIn 'Past 24 Hours' Direct HR Filter",
    "Underrated 1% Life, Study & AI Hacks": "The 2026\u20132027 Zero-Follower Global Marketplace Vault: Adobe Stock AI Indian Festive Vectors, PromptBase USD Assets & Google NotebookLM 10-Min Mastery",
    "Client Hunting & Zero-Follower Traffic": "The IndiaMART Factory & Google Maps 'No-Website' Hunting Bible: How to Close \u20B92,999 B2B Catalog Deals in Surat, Jaipur & Moradabad With 0 Followers",
    "Skincare, Glow-Up & Styling Science": "The \u20B9150 Indian Pharmacy Generic Salt Bible: Exact Chemist Equivalents (Aziderm, Glyco-6, Hyalugel) for \u20B92,500 Luxury Serums + 1mg Salt Filter Trick",
    "2026 Real Pocket Cashflow & Micro-Business": "The 2026\u20132027 Underground USD & B2B Vault: ElevenLabs Voice Library Passive Royalties, IndiaMART Wholesale Factory AI Catalog Arbitrage & $10/15-Min UserTesting"
  };
  const effectiveTopic = topicInput && topicInput.trim().length > 0 ? topicInput.trim() : defaultTopicsByCategory[category] || "The 2026\u20132027 Underground Vault: ElevenLabs Voice Royalties, IndiaMART B2B Factory AI Catalogs, $10/15-Min UserTesting & Verified Free Portals";
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
   - FORBIDDEN FAKE FILTERS: IndiaMART does NOT have filters called "Stock Value > \u20B950 Lakh", "Advanced Filters", or "Sort by No Instagram DM". NEVER invent those filter names!
   - MANDATORY ANTI-SCAM 50% ADVANCE RULE: NEVER tell the reader to ask suppliers for photos first or create a full 15-page PDF catalog before getting paid! Instead, teach the 100% safe method:
     * Step A: Save 1 single ugly mannequin/floor product photo directly from the supplier's public IndiaMART listing.
     * Step B: Turn that 1 photo into a 4K studio model image and place a big diagonal watermark ("SAMPLE PREVIEW \u2014 DO NOT COPY") across the center in Canva.
     * Step C: Send that 1 watermarked Before/After photo to the manufacturer's public phone/WhatsApp number.
     * Step D: Offer a \u20B9250 1-Page Unwatermarked Trial OR collect 50% UPI Advance (\u20B91,500 out of \u20B92,999) BEFORE creating the remaining 14 pages.
3. EXACT VERIFIED FACTS FOR VOICEOVER & VOICE CLONING (voquent.com vs elevenlabs.io):
   - Always state both the 100% FREE (\u20B90) path and the Paid Creator path honestly:
     * Path A (100% Free / \u20B90 Investment): Register as a voice talent on https://www.voquent.com/voice-actors/ or Fiverr (Indian English / Hindi Conversational) and upload 3 clean 30-second audio demos edited in free Audacity (Noise Reduction + Normalize to -3dB).
     * Path B (Paid Creator Tier Required): ElevenLabs Professional Voice Cloning (PVC) on https://elevenlabs.io/app/voice-library requires an active Creator subscription ($11 first month / $22/mo), 30+ minutes of clean audio, and passing a live microphone Voice Captcha. Once approved in the Voice Library, it pays ~$0.03 per 1,000 generated characters via Stripe.
   - FORBIDDEN MYTH: Recording at 11:30 PM with the ceiling fan off is ONLY to achieve a clean < -60dB acoustic noise floor so your audio passes quality review\u2014there is NO "1.5x night-time royalty batch multiplier" on ElevenLabs. NEVER claim a 1.5x night bonus!
4. EXACT VERIFIED FACTS FOR USERTESTING, PROLIFIC & ADOBE STOCK:
   - https://www.usertesting.com/get-paid-to-test & https://www.prolific.com: 100% Free (\u20B90) signup. Requires a KYC-verified Indian PayPal account (linked to PAN + Indian bank account). Pays $10 per approved 15\u201320 minute speak-out-loud usability test exactly 14 days after completion. Realistic Indian demographic match rate is 1 to 4 tests per week ($40\u2013$120/month extra pocket cash) when keeping a browser tab open with constant speaking during screeners.
   - https://contributor.stock.adobe.com: 100% Free (\u20B90) signup. You MUST upscale AI images to at least 4 Megapixels (e.g., 4000\xD72500 px), check the mandatory "Created using generative AI tools" box, and never use brand logos or real faces. Pays 33% royalty ($0.33\u2013$3.30/download) with a $25 PayPal/Payoneer withdrawal threshold.
5. EXACT VERIFIED FACTS FOR FREE CERTIFICATES, LINKEDIN & INDIAN PHARMACY SALTS:
   - https://cs50.harvard.edu/x (100% free official Harvard CS50x certificate\u2014never pay the edX upgrade fee), https://www.theforage.com (Free Tata, JPMorgan, BCG virtual job simulations with instant Credential IDs), https://education.github.com/pack, and LinkedIn Boolean search: "Hiring" AND ("Intern" OR "Fresher" OR "Remote") -> click "Posts" tab -> set "Date Posted" = "Past 24 hours".
   - https://www.1mg.com Generic Salt Composition check: Regulated Indian pharmacy formulations (Aziderm 10%/20% Cream ~\u20B9240 for Azelaic Acid, Glyco-6 Cream ~\u20B9190 for 6% Glycolic Acid, Hyalugel ~\u20B9250 for Hyaluronic Acid, Sebogel ~\u20B9240 for Salicylic + Niacinamide). Always include the nighttime-only + SPF 50 sunscreen rule.
6. 100% WHITE-LABEL EBOOK (NO "GLOWCASH" NAME ALLOWED) & 5-HASHTAG RULE:
   - Never mention "GlowCash" anywhere. Use "2026\u20132027 FACT-CHECKED INSIDER EDITION \xB7 ZERO FLUFF" for editionTag. Return EXACTLY 5 hashtags.

Return strictly valid JSON with this exact structure:
{
  "ebook": {
    "editionTag": "2026\u20132027 FACT-CHECKED INSIDER EDITION \xB7 ZERO FLUFF",
    "title": "High-FOMO specific fact-checked title for ${effectiveTopic}",
    "subtitle": "Clear simple-English subtitle explaining the exact verified portals, real UI filters & honest Free vs Paid requirements",
    "targetReaderPromise": "1-sentence concrete, realistic promise (zero fake filters, zero affiliate fluff)",
    "goldenRuleTitle": "The #1 Anti-Scam & Fact-Checked Rule for ${effectiveTopic}",
    "goldenRuleBody": "2-3 sentences explaining the exact real UI filter and why you must always use the 1-Photo Watermark + 50% UPI Advance rule (or honest Free vs Paid path)",
    "hardestPartSolvedBox": {
      "title": "\u{1F525} THE HARDEST PART SOLVED: 4 Fact-Checked 2026\u20132027 Portals, Real UI Filters & Anti-Scam Rules",
      "exactWhereToFindMap": [
        "1. REAL UI FILTER #1: Exact website URL + real clickable filter path + honest \u20B90 vs Paid requirement...",
        "2. REAL UI FILTER #2: Exact website URL + real clickable filter path + anti-scam protection...",
        "3. REAL UI FILTER #3: Exact website URL + real clickable filter path + realistic payout timeline...",
        "4. REAL UI FILTER #4: Exact website URL + real clickable filter path..."
      ],
      "zeroFollowerTrafficTrick": "The exact 100% real ground-truth mechanism (e.g., 1 Watermarked Before/After photo + 50% UPI Advance rule) that works with 0 followers"
    },
    "quickValueBreakdown": [
      {"metric": "1. Upfront Capital Truth", "detail": "Clear breakdown of 100% Free (\u20B90) portals vs optional Paid tiers"},
      {"metric": "2. Real UI Click-Paths", "detail": "Zero invented filter names\u2014every button exists on the live website today"},
      {"metric": "3. Anti-Scam Payment Rule", "detail": "Never deliver full work upfront; use 1 watermarked sample + 50% UPI advance"},
      {"metric": "4. Realistic Monthly Math", "detail": "Honest Indian payout timelines (UPI, Stripe, KYC PayPal)"}
    ],
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "Chapter 1 Title",
        "subtitle": "Chapter 1 Subtitle (State clearly if \u20B90 Free or Paid Plan needed)",
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
      "shotByShot": ["0.0s\u20132.0s: ...", "2.0s\u20134.0s: ...", "4.0s\u20136.0s: ..."],
      "lightingAndAudioTip": "2026 Instagram Edits & Trial Reel tip"
    },
    "psychologicalPriceOverlays": [
      {"triggerType": "1. Snack Price / FOMO Comparison", "overlayText": "Comparing ${priceDisplay} to daily snack or missing out", "whyItConverts": "string"},
      {"triggerType": "2. 1% Fact-Checked Filter", "overlayText": "Why this ${anchorPriceDisplay} verified guide is behind a ${priceDisplay} link", "whyItConverts": "string"},
      {"triggerType": "3. Hardest-Part Solved Hook", "overlayText": "No fake filters \u2014 shows real UI click-paths & 50% advance scripts", "whyItConverts": "string"}
    ],
    "autoDmCaption": "100% Clean, High-Converting Simple English caption asking viewers to comment ${autoDmTrigger}",
    "seoKeywords": ["10 high-search 2026 keywords in clean English"],
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  }
} (Include 5 complete, deeply detailed, 100% fact-checked chapters in simple English in "chapters").`;
  const userPrompt = `Topic: "${effectiveTopic}" | Category: "${category}" | Price: "${priceDisplay}" | Anchor: "${anchorPriceDisplay}" | Trigger: "${autoDmTrigger}" | Seed: ${variationIndex}-${Date.now()}
Write a 100% fact-checked, zero-hallucination 5-chapter Ebook + 6s Reel Kit. Never invent fake IndiaMART filters (use real City + Left Sidebar Business Type: Manufacturer + TrustSEAL Verified), always include the 1-Photo Watermark + 50% UPI Advance rule, and state Free vs Paid requirements honestly.`;
  let aiParsed = null;
  let providerUsed = "2026 Mastermind AI";
  if (GROQ_FALLBACK_KEY) {
    try {
      aiParsed = await callOpenAICompatibleJSON(
        "https://api.groq.com/openai/v1/chat/completions",
        GROQ_FALLBACK_KEY,
        "openai/gpt-oss-120b",
        jsonSchemaPrompt,
        userPrompt,
        15e3
      );
      providerUsed = "GPT-OSS 120B Mastermind AI (2026)";
    } catch {
    }
  }
  if (!aiParsed) {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `${jsonSchemaPrompt}

${userPrompt}`,
            config: {
              responseMimeType: "application/json",
              thinkingConfig: { thinkingLevel: import_genai.ThinkingLevel.LOW }
            }
          }),
          12e3,
          "Gemini 4 Hydrogen Ebook"
        );
        if (response.text) {
          aiParsed = JSON.parse(response.text.trim());
          providerUsed = "Gemini 4 Hydrogen Mastermind AI (2026)";
        }
      }
    } catch {
    }
  }
  if (!aiParsed || !aiParsed.ebook || !Array.isArray(aiParsed.ebook.chapters) || aiParsed.ebook.chapters.length === 0) {
    return res.status(200).json({
      errorFallback: true,
      topicInput: effectiveTopic,
      category,
      priceDisplay,
      anchorPriceDisplay,
      autoDmTrigger
    });
  }
  const rawHardestBox = aiParsed.ebook.hardestPartSolvedBox;
  const rawMapList = Array.isArray(rawHardestBox?.exactWhereToFindMap) ? rawHardestBox.exactWhereToFindMap : Array.isArray(rawHardestBox?.whereToFindFirst10BuyersOrLinks) ? rawHardestBox.whereToFindFirst10BuyersOrLinks : [];
  const normalizedHardestBox = {
    title: stripBrandFromEbookText(
      rawHardestBox?.title || "\u{1F525} THE HARDEST PART SOLVED: Exact Mastermind Map \u2014 Where to Find Buyers, Clients & Direct Links With 0 Followers"
    ),
    exactWhereToFindMap: rawMapList.length > 0 ? rawMapList.map((item) => stripBrandFromEbookText(String(item))) : [
      `1. Direct Portal / Search Filter #1: Use Google Search operator site:linkedin.com/in OR Google Maps "No-Website" filter for "${effectiveTopic}" to find direct contacts in 5 minutes.`,
      `2. Active Spender Filter #2: Open facebook.com/ads/library -> Select India -> Search your niche keyword -> Filter by "Active Ads" to find businesses spending money right now.`,
      `3. Instagram 24-Hr Active Story Filter #3: Search city/niche tags in Instagram "Places" -> tap the circular Story ring to find owners/buyers active in the last 24 hours.`,
      `4. Trial Reel + Auto-DM Funnel #4: Post a 6-second proof video with "Trial Reel" ON and trigger word "${autoDmTrigger}" so non-followers receive your link automatically.`
    ],
    zeroFollowerTrafficTrick: stripBrandFromEbookText(
      rawHardestBox?.zeroFollowerTrafficTrick || rawHardestBox?.exactMastermindSolution || "Turn ON Instagram's 2026 'Trial Reel' toggle before posting so 100% of views come from non-followers, and connect Auto-DM so every comment receives your link in 5 seconds."
    )
  };
  const result = {
    id: `ebook-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    topicInput: effectiveTopic,
    category,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    providerUsed,
    ebook: {
      editionTag: stripBrandFromEbookText(aiParsed.ebook.editionTag) || "2026 PRIVATE INSIDER EDITION \xB7 ZERO FLUFF",
      title: stripBrandFromEbookText(
        aiParsed.ebook.title || `The 1% Insider Playbook: ${effectiveTopic}`
      ),
      subtitle: stripBrandFromEbookText(
        aiParsed.ebook.subtitle || "Step-by-Step Simple English Execution Guide (With Exact Links, Search Filters & Scripts)"
      ),
      targetReaderPromise: stripBrandFromEbookText(
        aiParsed.ebook.targetReaderPromise || `Actionable 2026 ground-truth system for ${effectiveTopic}`
      ),
      goldenRuleTitle: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleTitle || "The #1 Anti-Fluff Rule for Fast Execution"
      ),
      goldenRuleBody: stripBrandFromEbookText(
        aiParsed.ebook.goldenRuleBody || "Never waste time on generic theory. Use the exact search filters, verified portals, and copy-paste scripts in this guide for 14 straight days."
      ),
      hardestPartSolvedBox: normalizedHardestBox,
      quickValueBreakdown: Array.isArray(aiParsed.ebook.quickValueBreakdown) && aiParsed.ebook.quickValueBreakdown.length > 0 ? aiParsed.ebook.quickValueBreakdown.map((q, idx) => ({
        metric: stripBrandFromEbookText(
          typeof q === "object" && q?.metric ? String(q.metric) : `Pillar ${idx + 1}`
        ),
        detail: stripBrandFromEbookText(
          typeof q === "object" && q?.detail ? String(q.detail) : String(q || `Actionable step for ${effectiveTopic}`)
        )
      })) : [
        {
          metric: "1. Daily Time Needed",
          detail: "45 to 60 minutes from phone or laptop (Zero coding)"
        },
        {
          metric: "2. Cost to Start",
          detail: "\u20B90 \u2014 Uses 100% free 2026 portals, search filters & AI tools"
        },
        {
          metric: "3. Hardest Part Solved",
          detail: "Includes exact search queries, filters & direct portals"
        },
        {
          metric: "4. Core Outcome",
          detail: `Master ${effectiveTopic} or sell at ${priceDisplay} (Value ${anchorPriceDisplay})`
        }
      ],
      chapters: aiParsed.ebook.chapters.map((ch, idx) => ({
        chapterNumber: Number(ch.chapterNumber) || idx + 1,
        title: stripBrandFromEbookText(
          ch.title || `Chapter ${idx + 1}: Core Execution Step`
        ),
        subtitle: stripBrandFromEbookText(
          ch.subtitle || `The 1% Insider System for ${effectiveTopic} (Part ${idx + 1})`
        ),
        coreSecretSummary: stripBrandFromEbookText(
          ch.coreSecretSummary || ch.explanation || ch.secretPrinciple || `Most people fail at ${effectiveTopic} because nobody shows them the exact search filter or portal. Here is the exact 2026 step-by-step method.`
        ),
        whereToFindOrHiddenTrick: stripBrandFromEbookText(
          ch.whereToFindOrHiddenTrick || `EXACT FILTER & CLICK-PATH: Open the tool listed below -> type the exact keyword from the Copy-Paste box -> filter by "Active / Verified" so you skip 99% of dead ends.`
        ),
        stepByStepExecution: Array.isArray(ch.stepByStepExecution) && ch.stepByStepExecution.length > 0 ? ch.stepByStepExecution.map(
          (s) => stripBrandFromEbookText(String(s))
        ) : Array.isArray(ch.actionSteps) && ch.actionSteps.length > 0 ? ch.actionSteps.map(
          (s) => stripBrandFromEbookText(String(s))
        ) : [
          `Step 1: Open the exact website/portal listed below for ${effectiveTopic}.`,
          `Step 2: Apply the Mastermind Search Filter shown above.`,
          `Step 3: Use the copy-paste script/template below and execute today.`
        ],
        exactToolsOrWebsites: Array.isArray(ch.exactToolsOrWebsites) && ch.exactToolsOrWebsites.length > 0 ? ch.exactToolsOrWebsites.map((t) => ({
          name: stripBrandFromEbookText(
            typeof t === "object" && t?.name ? String(t.name) : String(t || "2026 Verified Portal")
          ),
          role: stripBrandFromEbookText(
            typeof t === "object" && t?.role ? String(t.role) : "Core Execution Portal"
          ),
          insiderTip: stripBrandFromEbookText(
            typeof t === "object" && t?.insiderTip ? String(t.insiderTip) : "Use the exact search filter above for instant results."
          )
        })) : [
          {
            name: "Google Search Operators / NotebookLM / Perplexity",
            role: "Direct Discovery & Verification",
            insiderTip: "Use exact-match quotes and site: filters to find direct links in 10 seconds."
          },
          {
            name: "SuperProfile.bio / ManyChat / Instagram Trial Reels",
            role: "Automated Delivery & Reach",
            insiderTip: `Set trigger keyword to "${autoDmTrigger}" for instant DM delivery.`
          }
        ],
        copyPasteTemplateOrScript: typeof ch.copyPasteTemplateOrScript === "object" && ch.copyPasteTemplateOrScript?.content ? {
          label: stripBrandFromEbookText(
            ch.copyPasteTemplateOrScript.label || "Copy-Paste Action Script / Search Formula"
          ),
          content: stripBrandFromEbookText(
            String(ch.copyPasteTemplateOrScript.content)
          )
        } : {
          label: "Copy-Paste Action Script / Search Formula",
          content: stripBrandFromEbookText(
            typeof ch.copyPasteTemplateOrScript === "string" ? ch.copyPasteTemplateOrScript : ch.copyPasteTemplate || `Comment "${autoDmTrigger}" below and I will DM you the complete ${effectiveTopic} step-by-step link in 5 seconds!`
          )
        },
        incomeMathOrProof: stripBrandFromEbookText(
          ch.incomeMathOrProof || `Saves 6+ hours of trial-and-error per week or generates 20+ daily leads/buyers at ${priceDisplay}.`
        )
      })),
      twentyFourHourChecklist: Array.isArray(aiParsed.ebook.twentyFourHourChecklist) && aiParsed.ebook.twentyFourHourChecklist.length > 0 ? aiParsed.ebook.twentyFourHourChecklist.map(
        (c) => stripBrandFromEbookText(String(c))
      ) : [
        `Apply Filter #1 from the "Hardest Part Solved" Mastermind box today.`,
        `Test the Chapter 1 & Chapter 2 copy-paste scripts/formulas.`,
        `Download this 100% white-label 12pt PDF using the Download PDF button.`,
        `Optional: Upload the PDF to SuperProfile.bio at ${priceDisplay} (Value ${anchorPriceDisplay}) with Auto-DM trigger "${autoDmTrigger}".`
      ]
    },
    reelBlueprint: {
      sixSecondVideoIdea: {
        visualStyle: typeof aiParsed.reelBlueprint?.sixSecondVideoIdea === "object" && aiParsed.reelBlueprint?.sixSecondVideoIdea?.visualStyle ? String(aiParsed.reelBlueprint.sixSecondVideoIdea.visualStyle) : typeof aiParsed.reelBlueprint?.sixSecondVideoIdea === "string" ? aiParsed.reelBlueprint.sixSecondVideoIdea : "6-Second Dark Aesthetic B-Roll / Laptop & Phone PDF Scroll",
        shotByShot: Array.isArray(
          aiParsed.reelBlueprint?.sixSecondVideoIdea?.shotByShot
        ) && aiParsed.reelBlueprint.sixSecondVideoIdea.shotByShot.length > 0 ? aiParsed.reelBlueprint.sixSecondVideoIdea.shotByShot.map(
          (s) => String(s)
        ) : [
          `0.0s\u20132.0s: Slow-motion scroll through the 12pt "${effectiveTopic}" Ebook on phone screen.`,
          `2.0s\u20134.0s: Cut to FOMO / snack price-comparison text overlay (${priceDisplay} vs daily Momos/Maggi).`,
          `4.0s\u20136.0s: Show Comment "${autoDmTrigger}" CTA box for instant Auto-DM delivery.`
        ],
        lightingAndAudioTip: aiParsed.reelBlueprint?.sixSecondVideoIdea?.lightingAndAudioTip || "Lower video brightness by -20% in Instagram Edits app so white text pops; enable 2026 Trial Reels."
      },
      psychologicalPriceOverlays: Array.isArray(aiParsed.reelBlueprint?.psychologicalPriceOverlays) && aiParsed.reelBlueprint.psychologicalPriceOverlays.length > 0 ? aiParsed.reelBlueprint.psychologicalPriceOverlays.slice(0, 3).map(
        (ov, idx) => typeof ov === "object" && ov !== null ? {
          triggerType: ov.triggerType || `Psychological Hook #${idx + 1}`,
          overlayText: ov.overlayText || `You spend ${priceDisplay} on snacks in 5 minutes, but this ${priceDisplay} guide gives you the exact 1% links & filters.`,
          whyItConverts: ov.whyItConverts || "Makes the price feel smaller than a daily impulse snack."
        } : {
          triggerType: `Psychological Hook #${idx + 1}`,
          overlayText: String(ov),
          whyItConverts: "Triggers instant curiosity + impulse micro-purchase."
        }
      ) : [
        {
          triggerType: "1. Extreme FOMO / Gatekeeping Hook",
          overlayText: `99% of people struggle with ${effectiveTopic} because nobody shares the exact search filters & links. I put all 5 inside this ${priceDisplay} guide.`,
          whyItConverts: "Triggers intense fear of missing out on hidden insider links."
        },
        {
          triggerType: "2. Snack Price Comparison",
          overlayText: `You spend \u20B9100 on Momos in 10 minutes, but won't invest ${priceDisplay} (Value ${anchorPriceDisplay}) to get the exact step-by-step roadmap?`,
          whyItConverts: "Reframes the price as smaller than daily junk food."
        },
        {
          triggerType: "3. Hardest-Part Solved Hook",
          overlayText: `Zero "hawa-hawa" theory. Includes the exact websites, filters & copy-paste scripts. Comment "${autoDmTrigger}".`,
          whyItConverts: "Directly addresses skepticism and drives comment velocity."
        }
      ],
      autoDmCaption: aiParsed.reelBlueprint?.autoDmCaption || `Stop wasting time on generic videos that only give surface-level advice and hide the real links. \u{1F6D1}

I put the complete, zero-fluff "${effectiveTopic}" blueprint\u2014including the exact websites, search filters, and copy-paste scripts\u2014into a clean 12pt guide for just ${priceDisplay} (Value ${anchorPriceDisplay}).

\u{1F449} Comment "${autoDmTrigger}" below and my Auto-DM will send the direct link to your inbox in 5 seconds!`,
      seoKeywords: Array.isArray(aiParsed.reelBlueprint?.seoKeywords) && aiParsed.reelBlueprint.seoKeywords.length > 0 ? aiParsed.reelBlueprint.seoKeywords.slice(0, 10) : [
        effectiveTopic.toLowerCase().slice(0, 28),
        "free verified certificates 2026",
        "how to find clients without followers",
        "secret ai tools india 2026",
        "digital products india",
        "career shortcuts india"
      ],
      // Strictly enforce the 2026 5-Hashtag Limit!
      hashtags: Array.isArray(aiParsed.reelBlueprint?.hashtags) && aiParsed.reelBlueprint.hashtags.length > 0 ? aiParsed.reelBlueprint.hashtags.slice(0, 5) : [
        "#secretwebsites",
        "#careergrowth2026",
        "#freecertificates",
        "#clienthunting",
        "#digitalproductsindia"
      ]
    }
  };
  return res.json(result);
});
app.post("/api/stylist-chat-rebuild", async (req, res) => {
  const {
    userMessage = "",
    selectedColors = [],
    bodyGoal = "universal-100x",
    uploadedImages = [],
    currentReel,
    backgroundDesc = "Realistic warm cream plaster wall with a lush indoor plant in soft afternoon sunlight"
  } = req.body || {};
  const safeImages = Array.isArray(uploadedImages) ? uploadedImages.slice(0, 6) : [];
  const safeColors = Array.isArray(selectedColors) ? selectedColors : [];
  const baseline = synthesizeCustomSimilarOutfitReelPack(
    currentReel,
    String(userMessage || ""),
    safeColors,
    String(bodyGoal || "universal-100x"),
    safeImages,
    String(backgroundDesc)
  );
  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);
  const imageDescriptions = safeImages.map(
    (img, idx) => `Uploaded Screenshot #${idx + 1} ("${img.name}"): Dominant detected color is ${img.dominantColorName} (${img.dominantHex})`
  ).join(" | ");
  const stylistSystemPrompt = `You are India's #1 Celebrity Personal Stylist, Optical Body-Proportion Scientist & Meesho Catalog Engineer (${dailyCtx.formattedDate}).
The user searched Meesho for an outfit, but found SIMILAR items or DIFFERENT colors/cuts instead of the exact original item.
She has shared what she found:
- User Message / Found Items Description: "${userMessage || "I found similar pieces in these colors on Meesho\u2014pick the best combination and rebuild my complete outfit and reel pack!"}"
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
      "itemLabel": "Piece 1 \xB7 100x Face-Framing & Slimming Top (Matched to User's Find)",
      "exactKeyword": "Women [Exact Color & Cut Matched to User's Find] (100% Pure English Meesho Keyword)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish styling trick for Piece 1",
      "priceFilter": "Under \u20B9349 \xB7 4.2\u2605+",
      "fabricAndFitCheck": "Easy Hinglish review check for Piece 1"
    },
    {
      "itemLabel": "Piece 2 \xB7 Tummy-Control & Leg-Lengthening Bottom",
      "exactKeyword": "Women [Color] High Waist [Flared Bootcut Jeans / Wide Leg Trousers / Palazzo] (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish styling trick for Piece 2",
      "priceFilter": "Under \u20B9449 \xB7 Free Delivery",
      "fabricAndFitCheck": "Easy Hinglish review check for Piece 2"
    },
    {
      "itemLabel": "Piece 3 \xB7 Secret Hourglass Waist-Cinching Transformer",
      "exactKeyword": "Women [Oxidized Silver / Antique Gold] Layered Kamarbandh Belly Waist Chain (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish V-drop waist chain trick",
      "priceFilter": "Under \u20B9179",
      "fabricAndFitCheck": "Easy Hinglish review check"
    },
    {
      "itemLabel": "Piece 4 \xB7 100x Facial Glow & Rich-Vibe Finisher",
      "exactKeyword": "Women [Color] Structured Shoulder Baguette Bag and [Oxidized / Gold] Jhumka (100% Pure English)",
      "backupSearchKeywords": ["English backup search 1", "English backup search 2"],
      "howToCombineAndStyle": "Easy Hinglish underarm bag + jhumka face-framing trick",
      "priceFilter": "Under \u20B9269",
      "fabricAndFitCheck": "Easy Hinglish review check"
    }
  ],
  "onScreenHooks": [
    "10-16 word 100% Clean English human-toned proportion/glow-up hook",
    "10-16 word 100% Clean English price/tummy-hide + wait for Piece 3 hook",
    "10-16 word 100% Clean English bestie share hook"
  ]
}`;
  let aiParsed = null;
  let providerUsed = `100x Royal Glow-Up AI Stylist (${dailyCtx.formattedDate})`;
  try {
    const ai = getGeminiClient();
    if (ai) {
      const parts = [];
      for (const img of safeImages.slice(0, 4)) {
        const base64Clean = String(img.dataUrl || "").includes(",") ? String(img.dataUrl).split(",")[1] : "";
        if (base64Clean) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType || "image/jpeg",
              data: base64Clean
            }
          });
        }
      }
      parts.push({
        text: `${stylistSystemPrompt}

Analyze the user's found items/colors/screenshots and return the JSON response now.`
      });
      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: import_genai.ThinkingLevel.LOW }
          }
        }),
        12e3,
        "Gemini 4 Hydrogen Multimodal Stylist"
      );
      if (response.text) {
        aiParsed = JSON.parse(response.text.trim());
        providerUsed = `Gemini 4 Hydrogen Vision Stylist (${dailyCtx.formattedDate})`;
      }
    }
  } catch {
  }
  if (!aiParsed && GROQ_FALLBACK_KEY) {
    if (safeImages.length > 0) {
      try {
        const userContentParts = [
          {
            type: "text",
            text: `${stylistSystemPrompt}

Inspect the attached Meesho clothing screenshots and return strictly valid JSON.`
          }
        ];
        for (const img of safeImages.slice(0, 3)) {
          if (img.dataUrl && img.dataUrl.startsWith("data:image/")) {
            userContentParts.push({
              type: "image_url",
              image_url: { url: img.dataUrl }
            });
          }
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12e3);
        try {
          const visionRes = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_FALLBACK_KEY}`
              },
              body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.75,
                messages: [{ role: "user", content: userContentParts }],
                response_format: { type: "json_object" }
              }),
              signal: controller.signal
            }
          );
          if (visionRes.ok) {
            const visionData = await visionRes.json();
            const rawContent = visionData?.choices?.[0]?.message?.content || "{}";
            const cleaned = rawContent.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
            aiParsed = JSON.parse(cleaned);
            providerUsed = `Llama-4 Vision + 100x Royal Stylist AI (${dailyCtx.formattedDate})`;
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch {
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
          11e3
        );
        providerUsed = `GPT-OSS 120B Royal Stylist AI (${dailyCtx.formattedDate})`;
      } catch {
      }
    }
  }
  if (!aiParsed) {
    return res.json({
      stylistVerdictHinglish: baseline.stylistVerdictHinglish,
      updatedReelPack: baseline.updatedReelPack,
      providerUsed: baseline.updatedReelPack.providerUsed
    });
  }
  const mergedVerdict = {
    bestChoiceFromUploads: aiParsed.stylistVerdictHinglish?.bestChoiceFromUploads || baseline.stylistVerdictHinglish.bestChoiceFromUploads,
    whatToAvoidAndWhy: aiParsed.stylistVerdictHinglish?.whatToAvoidAndWhy || baseline.stylistVerdictHinglish.whatToAvoidAndWhy,
    hundredXGlowUpScience: aiParsed.stylistVerdictHinglish?.hundredXGlowUpScience || baseline.stylistVerdictHinglish.hundredXGlowUpScience,
    stepByStepDrapingTrick: aiParsed.stylistVerdictHinglish?.stepByStepDrapingTrick || baseline.stylistVerdictHinglish.stepByStepDrapingTrick,
    colorHarmonyFormula: aiParsed.stylistVerdictHinglish?.colorHarmonyFormula || baseline.stylistVerdictHinglish.colorHarmonyFormula
  };
  const mergedSearchTerms = Array.isArray(aiParsed.searchTerms) && aiParsed.searchTerms.length >= 4 ? aiParsed.searchTerms.slice(0, 4).map((s, idx) => ({
    itemLabel: s.itemLabel || baseline.updatedReelPack.searchTerms[idx]?.itemLabel || `Piece ${idx + 1}`,
    exactKeyword: sanitizeMeeshoSearchTerm(
      s.exactKeyword || baseline.updatedReelPack.searchTerms[idx].exactKeyword,
      idx
    ),
    backupSearchKeywords: Array.isArray(s.backupSearchKeywords) && s.backupSearchKeywords.length > 0 ? s.backupSearchKeywords.slice(0, 2).map((b) => sanitizeMeeshoSearchTerm(String(b), idx)) : baseline.updatedReelPack.searchTerms[idx].backupSearchKeywords,
    howToCombineAndStyle: s.howToCombineAndStyle || baseline.updatedReelPack.searchTerms[idx].howToCombineAndStyle,
    priceFilter: s.priceFilter || baseline.updatedReelPack.searchTerms[idx].priceFilter,
    fabricAndFitCheck: s.fabricAndFitCheck || baseline.updatedReelPack.searchTerms[idx].fabricAndFitCheck,
    platform: "Meesho"
  })) : baseline.updatedReelPack.searchTerms;
  const finalTitle = aiParsed.conceptTitle || baseline.updatedReelPack.concept.title;
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
      onScreenHooks: Array.isArray(aiParsed.onScreenHooks) ? aiParsed.onScreenHooks : void 0
    },
    Date.now() % 100
  );
  const finalUpdatedReel = {
    ...baseline.updatedReelPack,
    id: `reel-stylist-${Date.now()}`,
    providerUsed,
    concept: {
      ...baseline.updatedReelPack.concept,
      title: finalTitle,
      liveDailyTrendTag: `100x Custom Similar-Item Match \xB7 ${mergedVerdict.colorHarmonyFormula}`,
      curiosityIdentityAngle: `${mergedVerdict.bestChoiceFromUploads} ${mergedVerdict.hundredXGlowUpScience}`,
      lookTransformationFormula: {
        beforeVsAfterLook: `Pehle (Mismatched / Confusing Options): ${mergedVerdict.whatToAvoidAndWhy} -> Ab (100x Royal Glow-Up Look): ${mergedVerdict.hundredXGlowUpScience}`,
        howToCombineAllFourPieces: mergedVerdict.stepByStepDrapingTrick,
        threeWaysToRestyleCombo: baseline.updatedReelPack.concept.lookTransformationFormula?.threeWaysToRestyleCombo || []
      },
      shotByShotPlan: [
        {
          timeRange: "0.0s \u2013 1.5s",
          visualAction: "Haath mein pakde hue aapke chune hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke dikhao.",
          onScreenText: finalReelPack.onScreenHooks[0]
        },
        {
          timeRange: "1.5s \u2013 3.0s",
          visualAction: "Full-Body Look ya Mirror Try-On (Prompt 0A/0B): 60-30-10 Royal Color Harmony aur 30:70 Slimming Proportion saaf dikhao.",
          onScreenText: `100x Slimming & Glow Formula: ${mergedSearchTerms[0].exactKeyword.replace(/^Women\s+/i, "").slice(0, 28)}`
        },
        {
          timeRange: "3.0s \u2013 4.5s",
          visualAction: "Piece 3 (V-Drop Waist Chain) ka close-up + 1 second ke liye aapka Meesho screenshot / customer review photo flash karo.",
          onScreenText: `Secret 3rd Piece That Creates an Instant Hourglass Waist`
        },
        {
          timeRange: "4.5s \u2013 6.0s",
          visualAction: "Piece 4 (Underarm Bag & Jhumka) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText: "Comment 'LINK' below & check your DM in 5s before Piece 1 sells out! \u{1F62D}"
        }
      ]
    },
    searchTerms: mergedSearchTerms,
    prompts: finalPrompts,
    reelPack: finalReelPack
  };
  return res.json({
    stylistVerdictHinglish: mergedVerdict,
    updatedReelPack: finalUpdatedReel,
    providerUsed
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GlowCash AI Studio Server running on http://localhost:${PORT}`);
  });
}
startServer();
