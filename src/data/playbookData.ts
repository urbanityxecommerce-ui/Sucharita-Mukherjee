export interface SearchTermItem {
  itemLabel: string;
  exactKeyword: string;
  backupSearchKeywords?: string[];
  howToCombineAndStyle?: string;
  priceFilter: string;
  fabricAndFitCheck: string;
  platform: 'Meesho' | 'Myntra' | 'Both';
}

export interface ReelGenerationResult {
  id: string;
  createdAt: string;
  themeInput: string;
  providerUsed?: string;
  concept: {
    title: string;
    category: string;
    liveDailyTrendTag?: string;
    curiosityIdentityAngle: string;
    firstTwoSecondVisual: string;
    whyItTriggersSharesAndSaves: string;
    lookTransformationFormula?: {
      beforeVsAfterLook: string;
      howToCombineAllFourPieces: string;
      threeWaysToRestyleCombo: string[];
    };
    colorPalette: string[];
    shotByShotPlan: {
      timeRange: string;
      visualAction: string;
      onScreenText: string;
    }[];
  };
  searchTerms: SearchTermItem[];
  prompts: {
    selectedBackground: string;
    outfitSummaryList: string;
    exactOutfitLookPreviewPrompt: string;
    fullBodyStyledTryOnPrompt: string;
    adityaKnightHandheldBundlePrompt: string;
    facelessMirrorAvatarPrompt: string;
    singleItemReplacementPrompts: {
      topReplacement: string;
      pantReplacement: string;
      accessoryHandPrompt: string;
    };
    ugcVideoMotionPrompts: {
      handheldClothesMotion: string;
      mirrorAvatarMotion: string;
    };
  };
  reelPack: {
    onScreenHooks: string[];
    autoDmTriggerWord: string;
    hinglishCaption: string;
    seoKeywords: string[];
    trendingHashtags: string[];
  };
}

export interface EbookChapter {
  chapterNumber: number;
  title: string;
  subtitle: string;
  coreSecretSummary: string;
  whereToFindOrHiddenTrick?: string;
  stepByStepExecution: string[];
  exactToolsOrWebsites: {
    name: string;
    role: string;
    insiderTip: string;
  }[];
  copyPasteTemplateOrScript: {
    label: string;
    content: string;
  };
  incomeMathOrProof: string;
}

export interface EbookAntiSlopVideoPrompts {
  rawPhoneFirstFramePrompt: string;
  zeroSlopVideoMotionPrompt: string;
  relatablePovBrollPrompt: string;
  algorithmTriggerNote: string;
}

export type EbookReelSectionKey =
  | 'all'
  | 'prompts'
  | 'videoPlan'
  | 'overlays'
  | 'caption'
  | 'tags';

export interface EbookGenerationResult {
  id: string;
  createdAt: string;
  topicInput: string;
  category?: string;
  priceDisplay: string;
  anchorPriceDisplay: string;
  autoDmTrigger: string;
  providerUsed?: string;
  ebook: {
    editionTag: string;
    title: string;
    subtitle: string;
    targetReaderPromise: string;
    goldenRuleTitle: string;
    goldenRuleBody: string;
    hardestPartSolvedBox?: {
      title: string;
      exactWhereToFindMap: string[];
      zeroFollowerTrafficTrick: string;
    };
    quickValueBreakdown: {
      metric: string;
      detail: string;
    }[];
    chapters: EbookChapter[];
    twentyFourHourChecklist: string[];
  };
  reelBlueprint: {
    aiVideoPrompts?: EbookAntiSlopVideoPrompts;
    sixSecondVideoIdea: {
      visualStyle: string;
      shotByShot: string[];
      lightingAndAudioTip: string;
    };
    psychologicalPriceOverlays: {
      triggerType: string;
      overlayText: string;
      whyItConverts: string;
    }[];
    autoDmCaption: string;
    seoKeywords: string[];
    hashtags: string[];
  };
}

export interface HistoryRecord {
  id: string;
  type: 'reel' | 'ebook';
  title: string;
  subtitle: string;
  createdAt: string;
  isSaved: boolean;
  reelData?: ReelGenerationResult;
  ebookData?: EbookGenerationResult;
}

export const EBOOK_CATEGORIES = [
  {
    id: 'All',
    label: 'All 2026–2027 Classified 1% Dossiers',
    shortDesc: 'Dark psychology, backdoor portals & zero-fluff insider systems',
  },
  {
    id: '2026 Real Pocket Cashflow & Micro-Business',
    label: '💸 6-Second Trial-Reel Funnels, Digital Planners & USD Bounties',
    shortDesc: 'Snack-Price Auto-DM Funnels, Pinterest-to-Gumroad, Faceless YouTube & $10 UX Tests',
  },
  {
    id: 'Client Hunting & Zero-Follower Traffic',
    label: '🎯 Dark Psychology WhatsApp Closing & Google Maps Takeover',
    shortDesc: 'Close ₹2,999–₹4,999 deals via Google Maps No-Website clinics & Meta Ad Library',
  },
  {
    id: 'Free Certifications & Career Shortcuts',
    label: '🎓 Free Harvard, Tata Forage & Google Credentials + Direct HR Backdoor',
    shortDesc: 'CS50x free link, Tata/JPMorgan Forage simulations & LinkedIn 24hr post filter',
  },
  {
    id: 'Underrated 1% Life, Study & AI Hacks',
    label: '🧠 15 Zero-Cost AI Portals, Exam Hacks & Salary Negotiation Psychology',
    shortDesc: 'NotebookLM Audio, Perplexity Academic, Anki Automation & +₹3L CTC Scripts',
  },
  {
    id: 'Skincare, Glow-Up & Styling Science',
    label: '✨ ₹150 Indian Pharmacy Generic Salt Bible & 30:70 Proportion Science',
    shortDesc: 'Chemist generic dupes (Aziderm, Glyco-6, Hyalugel) for ₹3,500 luxury serums',
  },
];

export const BACKGROUND_PRESETS = [
  {
    id: 'warm-cream-plant',
    label: 'Warm Cream Indian Wall + Indoor Plant',
    description: 'Realistic warm cream plaster wall with a lush indoor monstera/areca palm plant in soft afternoon sunlight',
  },
  {
    id: 'wooden-door-mirror',
    label: 'Aesthetic Wooden Door & Mirror Corner',
    description: 'Realistic warm teak wooden door background with soft golden bedroom ambient lighting and clean floor',
  },
  {
    id: 'pinterest-linen-curtain',
    label: 'Sunlit Sheer Linen Curtain Corner',
    description: 'Realistic sunlit sheer white linen curtain background with warm golden hour shadows on a neutral wall',
  },
  {
    id: 'dark-plum-luxury',
    label: 'Moody Dark Feminine Studio Corner',
    description: 'Realistic muted charcoal-plum editorial bedroom corner with warm tungsten lamp glow and minimal mirror frame',
  },
];

export function buildMasterPrompts(
  outfits: SearchTermItem[],
  backgroundDesc: string,
  conceptTitle: string,
  _howToCombineSummary?: string
): ReelGenerationResult['prompts'] {
  // STRICT 100% PURE ENGLISH FOR ALL AI PROMPTS (So ChatGPT / Gemini / Flow AI generates accurate images & videos)
  const firstTop = outfits[0]?.exactKeyword || 'Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti';
  const secondBottom = outfits[1]?.exactKeyword || 'Women Black High Waist Stretchable Flared Bootcut Jeans';
  const thirdAccessory = outfits[2]?.exactKeyword || 'Oxidized Silver Kamarbandh Waist Chain Belt & Jhumka Combo';
  const fourthCompleter = outfits[3]?.exactKeyword || 'Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag';

  const outfitListText = `Piece 1: ${firstTop} | Piece 2: ${secondBottom} | Piece 3: ${thirdAccessory} | Piece 4: ${fourthCompleter}`;

  const styleStep1 = `Worn neatly fitted at the upper waist so the neckline, sleeve cut, and fabric texture of ${firstTop} stand out clearly.`;
  const styleStep2 = `High-waisted fit (${secondBottom}) worn right at the natural waistline to create a tall, elongated leg proportion.`;
  const styleStep3 = `Layered and styled cleanly (${thirdAccessory}) at the waist/neckline to lock the silhouette together.`;
  const styleStep4 = `Completed with ${fourthCompleter} worn naturally to finish the polished head-to-toe Pinterest look.`;
  const masterStyleFormula = `Pair ${firstTop} with ${secondBottom} worn high at the natural waist, add ${thirdAccessory} to define the waistline and proportion, and finish with ${fourthCompleter} for a cohesive head-to-toe editorial look.`;

  const exactOutfitLookPreviewPrompt = `NO REFERENCE IMAGE NEEDED — GENERATE DIRECTLY FROM THIS DESCRIPTION:
Create an ultra-realistic 4K vertical (9:16) 2-Panel Fashion Lookbook & Meesho Shopping Reference Board for the styling concept: "${conceptTitle}".

PANEL 1 (LEFT SIDE — 60% WIDTH: COMPLETE STYLED OUTFIT WORN HEAD-TO-TOE):
Show a realistic young Indian woman (warm golden-olive skin tone, natural wavy dark hair, graceful posture) standing in a ${backgroundDesc}. She is wearing this exact 4-piece outfit combination styled together from head to toe so I can see exactly how the complete look turns out:
- PIECE 1 (TOP / KURTI): ${firstTop}. Styling detail: ${styleStep1} Show the exact neckline shape, sleeve cut, fabric weave, stitch detailing, and color saturation clearly.
- PIECE 2 (BOTTOM WEAR): ${secondBottom}. Styling detail: ${styleStep2} Show the exact high-waist rise, hip fit, leg flare/pleat drape, and hem length over the shoes.
- PIECE 3 (THIRD-PIECE LAYER / WAIST TRANSFORMER): ${thirdAccessory}. Styling detail: ${styleStep3} Show exactly how it sits on the waist/shoulders/neck over Piece 1 and Piece 2.
- PIECE 4 (BAG, JEWELRY & FOOTWEAR COMPLETER): ${fourthCompleter}. Styling detail: ${styleStep4}
OVERALL STYLING EXECUTION: ${masterStyleFormula}

PANEL 2 (RIGHT SIDE — 40% WIDTH: 4 INDIVIDUAL PRODUCT CUTOUTS ON PURE WHITE BACKGROUND FOR MEESHO CAMERA SEARCH):
Display the same 4 individual pieces (${firstTop} | ${secondBottom} | ${thirdAccessory} | ${fourthCompleter}) neatly arranged vertically one below another as clean, flat-lay e-commerce catalog product photos on a pure white studio background with zero clutter. Each piece must be sharp, front-facing, and 100% clear so I can see the exact dress cut and even crop each item to search on Meesho's Image Search camera.
Photorealistic 4K editorial fashion photography, natural daylight, authentic Indian textile textures, zero text watermarks, zero distorted hands.`;

  const fullBodyStyledTryOnPrompt = `NO SCREENSHOT UPLOAD REQUIRED — GENERATE DIRECTLY:
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
OUTFIT: Use Images 2 onward (${outfitListText}) to create the complete outfit on the model. Preserve every outfit piece exactly as shown — color, fabric, texture, pattern, design, fit, length and details. Combine all supplied outfit pieces naturally (${masterStyleFormula}). DO NOT add, remove or redesign any clothing.
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
      accessoryHandPrompt: `Maintain same 1st image background (${backgroundDesc}) & hands. Just remove the outfit, it should hold the 2nd image product (${thirdAccessory}) with one hand in a stylish way. Image size will be 9:16 always.`,
    },
    ugcVideoMotionPrompts: {
      handheldClothesMotion: `No voice. Just add a slow movement like showing/shaking the hanging bundle of clothes (${outfitListText}). No face. No text. No music. It should look like UGC style, maintain everything same, it must look very real, 4K quality.`,
      mirrorAvatarMotion: `It is for ugc style, so just add slow movements to it like stepping back, styling, posing, side angle pose, touching the outfit/adjusting the outfit (${firstTop}). Aim is showing the overall look. Face should be hidden behind the iPhone as it is. Maintain same outfit, avatar, background (${backgroundDesc}). It must look real. 4k quality.`,
    },
  };
}

export interface CuratedReelSeed {
  id: string;
  category: 'Identity & Personality' | 'Aesthetics & Situations' | 'Scroll-Stopping Interactive' | 'Body Proportion & Color Hacks';
  title: string;
  hook: string;
  executionAngle: string;
  sampleKeywords: string[];
}

export const CURATED_REEL_IDEA_BANK: CuratedReelSeed[] = [
  {
    id: 'zodiac-date-night',
    category: 'Identity & Personality',
    title: 'Zodiac Sign Outfits: Date-Night Edition (Scorpio, Leo, Pisces, Libra)',
    hook: 'Your zodiac sign, but make it a Meesho date-night outfit Under Rs 449',
    executionAngle: 'Split 4 magnetic signs with contrasting textures: Scorpio (deep maroon velvet/satin), Leo (structured gold-accent black), Pisces (dreamy pastel chiffon), Libra (soft coquette rose). Viewers immediately look for their sign and tag best friends.',
    sampleKeywords: [
      'Deep maroon velvet square-neck short kurti',
      'Black satin cowl-neck sleeveless party top',
      'Pastel lilac chiffon flared sleeves midi dress',
      'Dusty rose organza tie-back coquette top',
    ],
  },
  {
    id: 'birth-month-aesthetic',
    category: 'Identity & Personality',
    title: 'Birth Month = Your Signature Kurti Aesthetic (Jan–Dec Series)',
    hook: "Don't skip your birth month: Your month just picked your next kurti look",
    executionAngle: 'Assign each birth month a distinct Pinterest color palette and neckline silhouette so viewers pause, screenshot their month, and comment if it matches their vibe.',
    sampleKeywords: [
      'Kashmiri aari embroidered emerald green short kurti',
      'Mulmul cotton chikankari pastel blue kurta set',
      'Rust orange block print Angrakha V-neck kurti',
      'Plum wine mirror-work festive straight kurta',
    ],
  },
  {
    id: 'first-letter-picker',
    category: 'Identity & Personality',
    title: 'Initial Letter Outfit Picker (A, S, K, R, P, M Edition)',
    hook: "Your name's first letter chooses your college outfit this week",
    executionAngle: 'Group the most common Indian girl name initials (S, A, K, P, R, N) with 4 wearable aesthetic bundles under Rs 399.',
    sampleKeywords: [
      'White eyelet lace puff-sleeve crop shirt',
      'High-waist baggy ice blue korean cargo jeans',
      'Kalamkari printed cotton square-neck short kurti',
      'Canvas tote bag with minimal typography',
    ],
  },
  {
    id: 'personality-archetype',
    category: 'Identity & Personality',
    title: 'Personality Type Outfits: Overthinker vs Hopeless Romantic vs Ambitious CEO',
    hook: 'Which version of you is showing up today? Pick your personality fit',
    executionAngle: 'Match 4 relatable inner personalities with complete head-to-toe Meesho finds so girls share it to their close friends story.',
    sampleKeywords: [
      'Oversized beige linen shirt for soft overthinker aesthetic',
      'Floral ruched bust chiffon dress for hopeless romantic',
      'Tailored charcoal waistcoat & wide-leg trouser co-ord for CEO',
      'Minimal gold hoop earrings & structured micro bag combo',
    ],
  },
  {
    id: 'playlist-as-outfit',
    category: 'Identity & Personality',
    title: 'If Your Spotify Playlist Was a Meesho Outfit (2000s Bollywood vs Villain Era)',
    hook: 'Your late-night playlist called. It wants this outfit under Rs 499.',
    executionAngle: 'Translate music moods (2000s Bollywood romance, dark villain pop, rainy acoustic indie) into exact wearable fabrics and colors.',
    sampleKeywords: [
      'Ombre georgette flared sleeves 2000s Bollywood kurti',
      'Burgundy faux-leather shoulder bag + black ribbed top',
      'Soft sage green knitted cardigan top',
      'Oxidized silver ghungroo jhumka & bangle set',
    ],
  },
  {
    id: 'soft-heart-cold-aura',
    category: 'Identity & Personality',
    title: 'Soft Heart vs Cold Aura Outfits: Two Contrasting Energies',
    hook: 'Soft pastel heart or structured dark aura—which side are you?',
    executionAngle: 'Show 2 soft romantic lace/pastel looks vs 2 sharp tailored black/burgundy looks for the exact same outing.',
    sampleKeywords: [
      'Baby pink bow-detail coquette ribbed knit top',
      'Jet black asymmetric neckline fitted full-sleeve top',
      'Cream pleated tennis skirt / flared palazzo',
      'High-waist charcoal tailored wide-leg formal pants',
    ],
  },
  {
    id: 'height-illusion-5ft',
    category: 'Body Proportion & Color Hacks',
    title: 'Height Illusion Hacks: 4 Meesho Kurtis That Make 5\'0" Girls Look 5\'5" Tall',
    hook: '4 Meesho Kurtis Under Rs 399 That Make 5\'0" Short Girls Look 5\'5" Tall',
    executionAngle: 'Solves a specific styling insecurity using vertical micro-stripes, empire waist cuts, V-necklines, and monochrome straight pants. Triggers massive Saves.',
    sampleKeywords: [
      'Vertical pin-stripe V-neck straight cotton kurti under 349',
      'Monochrome deep navy empire-waist Anarkali short kurta',
      'High-waist ankle-length straight cigarette pants',
      'Pointed-toe neutral tan mule flats for leg elongation',
    ],
  },
  {
    id: 'warm-undertone-glow',
    category: 'Body Proportion & Color Hacks',
    title: 'Skin Undertone Glow: Kurti Shades That Make Warm Indian Skin Glow',
    hook: 'Stop wearing dull colors! 4 Meesho shades that make warm Indian skin glow',
    executionAngle: 'Replace washed-out neon pastels with rich jewel tones: emerald green, burnt rust, deep berry plum, and warm mustard gold.',
    sampleKeywords: [
      'Emerald bottle-green modal silk V-neck kurta',
      'Burnt terracotta rust handblock printed cotton kurti',
      'Deep mulberry wine chanderi festive kurta set',
      'Warm marigold mustard embroidered short kurti',
    ],
  },
  {
    id: 'curvy-flattering-fits',
    category: 'Body Proportion & Color Hacks',
    title: 'Mid-Size & Curvy-Friendly A-Line Kurtis That Never Cling at the Waist',
    hook: '3 breathable cotton-rayon fits with actual size-chart accuracy for curvy girls',
    executionAngle: 'Focus on side-slit placement, empire gathers, non-see-through lining, and honest Meesho review verification.',
    sampleKeywords: [
      'Empire-line gathered cotton A-line midi kurti XXL-4XL',
      'V-neck wrap-style floral peplum top for curvy waist',
      'Stretchable cotton lycra wide-leg comfort palazzo',
      'Structured statement tote bag to balance proportions',
    ],
  },
  {
    id: 'strict-desi-mom',
    category: 'Aesthetics & Situations',
    title: 'Pinteresty Backless-Vibe Yet Strict Desi Mom Approved Fits Under Rs 349',
    hook: 'Pinterest aesthetic on the outside, 100% Strict Indian Mom approved in real life',
    executionAngle: 'Square necklines, tie-back dori details with modest coverage, and puff-sleeve short kurtis that look editorial without getting rejected at home.',
    sampleKeywords: [
      'Square-neck puff-sleeve floral cotton short kurti with upper back dori',
      'Modest boat-neck mirror work festive crop top + skirt',
      'High-waist wide-leg denim jeans with clean hem',
      'Traditional silver oxidized jhumkas + jutti combo',
    ],
  },
  {
    id: 'myntra-vs-meesho-dupe',
    category: 'Aesthetics & Situations',
    title: 'Myntra Rs 2,499 vs Meesho Rs 389 Exact Same Dress—Price-Shock Dupe',
    hook: 'Myntra Rs 2,499 vs Meesho Rs 389 Exact Same Aesthetic—Why Pay Extra?',
    executionAngle: 'Side-by-side comparison of high-street embroidered co-ord sets and Georgette midi dresses with identical print and fabric review checks.',
    sampleKeywords: [
      'Embroidered off-white linen-blend co-ord set (Myntra Dupe)',
      'Floral georgette tiered midi dress with crape lining',
      'Korean style pleated collar shirt dress under 429',
      'Quilted chain-strap crossbody bag under 299',
    ],
  },
  {
    id: 'dark-feminine-wearable',
    category: 'Aesthetics & Situations',
    title: 'Dark Feminine Energy, But Wearable for Indian College & Cafe Days',
    hook: 'For the girl who loves a little mystery: 4 Dark Feminine fits under Rs 450',
    executionAngle: 'Black ribbed square-neck tops, tailored charcoal wide-leg trousers, cherry burgundy tote bags, and oxidized silver accents.',
    sampleKeywords: [
      'Black sweetheart-neck ribbed full-sleeve fitted top',
      'Deep wine satin-finish button-down formal shirt',
      'Charcoal black high-waist pleated tailored trousers',
      'Cherry maroon vintage shoulder bag + claw clip',
    ],
  },
  {
    id: 'pinterest-coquette-budget',
    category: 'Aesthetics & Situations',
    title: 'Pinterest Coquette Aesthetic Under a Rs 399 Student Budget',
    hook: 'POV: You want a Pinterest coquette wardrobe on a real Indian college budget',
    executionAngle: 'Soft dusty pink bow-detail tops, eyelet lace cotton kurtis, pearl hair clips, and ballet flats.',
    sampleKeywords: [
      'Soft pink ribbon-bow front-tie pointelle knit top',
      'White schiffli eyelet lace cotton short kurti',
      'Pearl-strap Mary Jane ballet flats under 449',
      'Satin bow hair clip & dainty pearl pendant set',
    ],
  },
  {
    id: 'one-kurti-three-aesthetics',
    category: 'Aesthetics & Situations',
    title: 'One Black Short Kurti, 3 Completely Different Energies (College, Festive, Boss)',
    hook: '1 Rs 299 Black Kurti → 3 completely different aesthetics. Save for busy mornings!',
    executionAngle: 'Demonstrate high repeat-wear value by switching oxidized jhumkas, denim wide-leg jeans, and a structured blazer.',
    sampleKeywords: [
      'Jet black pure cotton chikankari short kurti under 299',
      'Light-wash baggy boyfriend denim jeans',
      'Heavy afghani oxidized silver choker & jhumka set',
      'Structured beige linen blazer layer for intern look',
    ],
  },
  {
    id: 'underrated-color-combo',
    category: 'Scroll-Stopping Interactive',
    title: 'Underrated Pinterest Color Combos Nobody Wears in College Yet',
    hook: 'Stop wearing only black & white: Try Chocolate Brown + Baby Pink under Rs 499',
    executionAngle: 'Pair unexpected high-fashion color combinations (Chocolate Brown + Baby Pink, Burgundy + Heather Grey, Lavender + Espresso) using affordable Meesho basics.',
    sampleKeywords: [
      'Chocolate brown fitted polo knit top',
      'Baby pink wide-leg linen-blend trousers',
      'Burgundy V-neck vest sweater + grey pleated pants',
      'Espresso brown faux-leather structured tote bag',
    ],
  },
  {
    id: 'pick-a-number-vibe',
    category: 'Scroll-Stopping Interactive',
    title: 'Choose a Number (1 to 4), Reveal Your Weekend Outfit Aesthetic',
    hook: 'Pick a number 1, 2, 3, or 4 before the beat drops—that is your next weekend look',
    executionAngle: 'Interactive gamified format that forces comments ("Which number did you pick?") and boosts completion rate.',
    sampleKeywords: [
      'Look 1 (Cafe Hopper): Sage green cropped cardigan + white jeans',
      'Look 2 (Bookstore Girl): Brown plaid skirt + cream turtleneck',
      'Look 3 (Night Drive): All-black cargo pants + halter neck top',
      'Look 4 (Sunday Brunch): Floral organza puff-sleeve midi dress',
    ],
  },
  {
    id: 'fictional-job-outfits',
    category: 'Scroll-Stopping Interactive',
    title: 'Outfits for Your Secret Fictional Job (Art Gallery Owner, Bookshop Girl, CEO)',
    hook: 'Dressing for the life you are manifesting: Bookshop Owner vs Young CEO Edition',
    executionAngle: 'Playful, highly shareable Pinterest moodboard-to-cart format with exact affordable Meesho pieces.',
    sampleKeywords: [
      'Art Gallery Owner: Asymmetric drape olive satin kurta set',
      'Bookshop Girl: Cinnamon brown knitted vest + cotton shirt',
      'Young CEO: Pinstripe navy waistcoat + wide-leg trouser co-ord',
      'Vintage rectangular tortoise-shell glasses + leather bag',
    ],
  },
  {
    id: 'rainy-day-aesthetic',
    category: 'Aesthetics & Situations',
    title: 'Monsoon & Humid Weather College Outfits That Dry Fast & Still Look Pinteresty',
    hook: 'What to wear in Indian humidity when you still want to look aesthetic',
    executionAngle: 'Quick-dry fabrics, dark bottoms that hide splashes, and waterproof footwear that still looks cute.',
    sampleKeywords: [
      'Breathable mulmul cotton sleeveless short kurti',
      'Dark charcoal ankle-length culotte pants (splash-safe)',
      'Waterproof matte jelly Mary Jane flats',
      'Nylon waterproof aesthetic crossbody dumpling bag',
    ],
  },
];

export const HIGH_VALUE_EBOOK_PRESETS = [
  {
    id: 'dark-psychology-whatsapp-closing-2026',
    category: 'Client Hunting & Zero-Follower Traffic',
    title: '🕵️‍♂️ Dark Psychology of WhatsApp DM Closing (5 Triggers for ₹4,999 Deals)',
    topic: 'The Dark Psychology of WhatsApp DM Closing & High-Ticket Freelance Deals: 5 Behavioral Triggers (Visual Loss-Aversion Audit, ₹250 Micro-Yes Foot-in-the-Door, Meta Ad Library Active-Spender Hijack & 3-Tier Decoy Pricing) That Make Clients Pay 50% UPI Advance in 15 Minutes',
    recommendedPrice: '₹49',
    anchorPrice: '₹2,999',
    triggerWord: 'CLOSE',
  },
  {
    id: 'trial-reel-micro-dossier-funnel-2026',
    category: '2026 Real Pocket Cashflow & Micro-Business',
    title: '⚡ The 6-Second Trial-Reel & Auto-DM Micro-Dossier Funnel (0 Followers)',
    topic: 'The 6-Second Instagram Trial-Reel & Auto-DM Micro-Dossier Funnel: How Anonymous 0-Follower Pages Use Snack-Price Psychology, 300% Loop Retention & SuperProfile/Cosmofeed Instant UPI Checkout to Generate Automated Daily Sales',
    recommendedPrice: '₹29',
    anchorPrice: '₹2,499',
    triggerWord: 'FUNNEL',
  },
  {
    id: 'google-maps-local-clinic-takeover-2026',
    category: 'Client Hunting & Zero-Follower Traffic',
    title: '📍 Google Maps "40+ Reviews, No-Website" Local Clinic & Salon Takeover',
    topic: 'The Google Maps High-Review No-Website Local Business Exploit: Exact Click-by-Click System to Find Cash-Rich Dental Clinics, Skin Studios & Salons and Close ₹3,999 WhatsApp Appointment Mini-Sites in 48 Hours',
    recommendedPrice: '₹49',
    anchorPrice: '₹2,999',
    triggerWord: 'MAPS',
  },
  {
    id: 'pinterest-gumroad-digital-planners-2026',
    category: '2026 Real Pocket Cashflow & Micro-Business',
    title: '📌 Pinterest-to-Gumroad & Notion Digital Planner Arbitrage (Canva Bulk-Create)',
    topic: 'Pinterest-to-Gumroad & Etsy Digital Planner Arbitrage: Creating 50 Aesthetic Notion & Printable Trackers in 20 Minutes Using Canva Bulk-Create + Free Pinterest Search Traffic for Passive USD & UPI Sales',
    recommendedPrice: '₹29',
    anchorPrice: '₹1,999',
    triggerWord: 'PLANNER',
  },
  {
    id: 'free-certifications-vault-2026',
    category: 'Free Certifications & Career Shortcuts',
    title: '🎓 12 Verified Free Harvard, Google, Tata & JPMorgan Credentials + HR Backdoor',
    topic: '12 Verified 100% Free Certificates & Virtual Job Simulations (Harvard CS50x Direct Portal cs50.harvard.edu/x, Tata/JPMorgan/Deloitte on TheForage.com, Google Skillshop & Govt SWAYAM) + The LinkedIn "Past 24 Hours Posts" Filter to Message Founders Directly',
    recommendedPrice: '₹19',
    anchorPrice: '₹1,999',
    triggerWord: 'CERT',
  },
  {
    id: 'pharmacy-skincare-glowup',
    category: 'Skincare, Glow-Up & Styling Science',
    title: '✨ The ₹150 Indian Pharmacy Generic Salt Bible (Chemist Dupes for ₹3,500 Serums)',
    topic: 'Exact ₹120–₹250 Indian Medical Store Regulated Generic Salt Formulations (Aziderm 10%/20% Azelaic Acid, Glyco-6, Hyalugel, Sebogel + 1mg.com Salt Filter & Nighttime SPF Rules) for ₹3,500 Luxury Serums + Warm Indian Skin Undertone Science',
    recommendedPrice: '₹19',
    anchorPrice: '₹1,499',
    triggerWord: 'GLOW',
  },
  {
    id: 'secret-ai-life-hacks-2026',
    category: 'Underrated 1% Life, Study & AI Hacks',
    title: '🧠 15 Zero-Cost AI Research Portals & 48-Hour Exam-Crushing Protocol',
    topic: '15 Verified Free AI Websites & Secret Portals (Google NotebookLM Audio Exam Podcasts, Perplexity Academic Research, SciSpace, Consensus, Anki CSV Automation & GitHub Education Pack) That Do 6 Hours of Work in 15 Minutes',
    recommendedPrice: '₹29',
    anchorPrice: '₹1,999',
    triggerWord: 'SECRET',
  },
  {
    id: 'english-fluency-interview-2026',
    category: 'Underrated 1% Life, Study & AI Hacks',
    title: '🗣️ Dark Psychology of Executive Communication & +₹3L HR Salary Negotiation',
    topic: 'Dark Psychology of Magnetic Communication, Executive Confidence & High-Stakes HR Salary Negotiation: 3-Second Tactical Silence, 50 High-Status Corporate Phrases, and Word-for-Word Scripts That Add ₹2L–₹4L to Your CTC Offer',
    recommendedPrice: '₹29',
    anchorPrice: '₹1,999',
    triggerWord: 'FLUENT',
  },
];

export const INITIAL_CHECKLIST_ITEMS = [
  {
    id: 'block-1-morning',
    blockLabel: 'Block 1 · Morning (60 Mins)',
    taskTitle: 'Generate & Post 1 "Lakho Mein Ek" Body-Math Meesho Reel',
    detail: 'Pick 1 4-piece combination in Tab 1 → Run Prompt 0A to preview exact look (or use the Similar-Item AI Stylist Chat if you found a similar dress/color) → Take 4 clean product screenshots → Connect Auto-DM.',
    completed: false,
  },
  {
    id: 'block-2-afternoon',
    blockLabel: 'Block 2 · Afternoon (60 Mins)',
    taskTitle: 'Post 1 6-Second Trial Reel for Your Classified 1% Dossier',
    detail: 'Record a 6-second dark aesthetic screen scroll of your White-Label 12pt PDF → Add the Snack Price Comparison overlay → Toggle ON Trial Reel → Connect Auto-DM.',
    completed: false,
  },
  {
    id: 'block-3-evening-ai',
    blockLabel: 'Block 3A · Evening (40 Mins)',
    taskTitle: 'Execute 1 Verified Portal Task (UserTesting / Prolific / Forage / Canva Bulk)',
    detail: 'Spend 40 minutes on UserTesting/Prolific screeners, Pinterest-to-Gumroad digital trackers, Adobe Stock 4MP AI vectors, or a free Tata/Harvard certification module.',
    completed: false,
  },
  {
    id: 'block-3-evening-dm',
    blockLabel: 'Block 3B · Evening (20 Mins)',
    taskTitle: 'Send 5 Watermarked Loss-Aversion Previews (50% UPI Advance Lock)',
    detail: 'Use Google Maps (40+ Reviews + No Website) or Meta Ad Library (Active Ads) → Save 1 public photo → Send 1 diagonal-watermarked 4K preview on WhatsApp → Collect 50% UPI advance before full delivery.',
    completed: false,
  },
];

/**
 * Category-Aware & Custom-Topic-Aware Idea Booster: Turns any raw keyword into 4 Extreme-FOMO Fact-Checked Angles
 * NEVER overwrites custom user queries with unrelated presets!
 */
export function boostUserIdeaOptions(rawInput: string, category: string): string[] {
  const clean = rawInput.trim();
  const cleanLower = clean.toLowerCase();
  const catLower = (category || '').toLowerCase();

  // 1. Check ONLY if the user explicitly typed chat agent / outlier / oneforma
  if (
    /\b(chat\s*agent|chat\s*support|non[- ]?bidding\s*chat|outlier|oneforma|dataannotation)\b/i.test(
      cleanLower
    )
  ) {
    return [
      '10 Verified Non-Bidding Chat Agent & AI Text Evaluation Websites for Indians in 2026–2027 (Direct Skill Assessment & Weekly Payouts)',
      'Zero-Bidding Remote Chat & Community Moderation Playbook: ModSquad, Concentrix Remote Chat, Chegg Q&A & TELUS Digital',
      'The 2026–2027 Anti-Upwork Blueprint: 10 Direct-Approval Portals Where Indians Earn From Day 1 Without Proposal Bidding',
      'How to Pass Remote Chat & Bilingual Evaluation Assessments on Your First Attempt (With Word-for-Word Rubric Templates)',
    ];
  }

  // 2. If the user entered any specific custom query (2+ words), keep 100% fidelity to their custom topic!
  if (clean.split(/\s+/).length >= 2) {
    return [
      `The Classified 1% Grey-Hat Dossier for: ${clean} (5 Unconventional Loopholes, Direct Links & Copy-Paste Scripts)`,
      `The 99% Illusion vs. 1% Reality of "${clean}": Exact Step-by-Step Execution & Behavioral Triggers That Actually Work`,
      `Zero-Competition 2026–2027 Blueprint for: ${clean} (Verified Portals, Real UI Click-Paths & Daily Action System)`,
      `How to Master & Monetize "${clean}" in 14 Days (With Word-for-Word Jedi Mind-Trick Scripts & Safety Locks)`,
    ];
  }

  if (
    catLower.includes('cert') ||
    catLower.includes('career') ||
    cleanLower.includes('cert') ||
    cleanLower.includes('job') ||
    cleanLower.includes('resume')
  ) {
    const base = clean || 'Free Verified Certifications & Remote Career';
    return [
      `12 Verified Free Credentials for ${base} (Harvard CS50x Direct Link cs50.harvard.edu/x, Tata/JPMorgan on TheForage.com & Google Skillshop)`,
      `The LinkedIn 'Past 24 Hours Posts' Boolean Backdoor: How to Message Founders Directly for ${base} & Bypass 2,000-Applicant Queues`,
      `How to Legally List Free Fortune-500 Virtual Job Simulations (Deloitte, BCG, Tata on TheForage.com) as Work Experience on Your CV`,
      `The +₹3 Lakh CTC Salary Negotiation Mind-Trick for ${base}: Word-for-Word HR Scripts & Cold DM Templates`,
    ];
  }

  if (
    catLower.includes('client') ||
    catLower.includes('traffic') ||
    cleanLower.includes('client') ||
    cleanLower.includes('buyer')
  ) {
    const base = clean || 'Closing High-Paying Clients With 0 Followers';
    return [
      `The Dark Psychology of WhatsApp DM Closing for ${base}: 5 Behavioral Triggers That Make Clients Pay 50% Advance in 15 Minutes`,
      `The Google Maps '40+ Reviews, No-Website' Exploit for ${base}: Closing ₹3,999 Local Clinic & Salon Deals on WhatsApp`,
      `Meta Ad Library Active-Spender Hijack (facebook.com/ads/library): Find Indian Brands Spending ₹50,000+/Mo & Pitch a Watermarked Sample`,
      `The Micro-Creator Paid UGC & Brand Barter Backdoor: How to Land ₹3,000/Video Ad Deals With Under 1,000 Followers`,
    ];
  }

  if (
    catLower.includes('cashflow') ||
    catLower.includes('income') ||
    catLower.includes('earning') ||
    catLower.includes('royalties') ||
    cleanLower.includes('earn') ||
    cleanLower.includes('money') ||
    cleanLower.includes('usd')
  ) {
    return [
      `The 6-Second Instagram Trial-Reel & Auto-DM Micro-Dossier Funnel: Turning ₹29–₹99 Impulse PDFs Into Automated Daily UPI Sales`,
      `Pinterest-to-Gumroad & Etsy Digital Planner Arbitrage: Creating 50 Aesthetic Notion & Canva Trackers in 20 Minutes`,
      `YouTube Faceless 'Search-Gap' & Software Comparison Channels: High-CPM AdSense + Affiliate Engine Without Showing Your Face`,
      `5 Fact-Checked Global UX Testing & Academic Research Portals (UserTesting, Prolific, Dscout, Trymata & Respondent — $10/15-Min Tests)`,
    ];
  }

  if (
    catLower.includes('hack') ||
    catLower.includes('secret') ||
    catLower.includes('study') ||
    catLower.includes('skincare') ||
    catLower.includes('glow') ||
    catLower.includes('ebook')
  ) {
    const base = clean || '1% Cognitive, Skincare & Career Shortcuts';
    return [
      `15 Underrated Zero-Cost AI Study & Research Portals (${base}): Google NotebookLM Audio Podcasts, Perplexity Academic & Anki Automation`,
      `The ₹150 Indian Pharmacy Generic Salt Bible (${base}): Exact Chemist Dupes (Aziderm, Glyco-6, Hyalugel) for ₹3,500 Luxury Serums`,
      `Dark Psychology of Magnetic Communication & Executive Confidence (${base}): 3-Second Tactical Silence & 50 Power Phrases`,
      `The 30:70 Visual Proportion & Warm Indian Undertone Styling Bible (${base}): Look 5 Inches Taller & Camera-Ready Under ₹999`,
    ];
  }

  const fashionBase = clean || 'Short Kurti';
  return [
    `${fashionBase} 30:70 Body-Math Combo: 19-Inch Fitted ${fashionBase} + 39-Inch High-Waist Bootcut Jeans + Hip-Drop Silver Kamarbandh (Makes 5'0" Look 5'5")`,
    `The ₹1,199 Complete 4-Piece Head-to-Toe Challenge: ${fashionBase} + Wide-Leg Trousers + Statement Accessory + Bag (Review-Photo Verified)`,
    `${fashionBase} Warm Indian Skin-Glow Formula: Why Jewel-Tone Maroon/Emerald ${fashionBase} + Ivory Cream Pants Act Like a Ring-Light on Camera`,
    `1 ${fashionBase} Styled 3 Unexpected Ways: Strict-Mom Family Look vs Boss-Intern Look vs Cafe Date-Night Look (Exact Meesho Catalog Names)`,
  ];
}

export interface StylingComboBlueprint {
  id: string;
  comboName: string;
  category:
    | 'Identity & Personality'
    | 'Body Proportion & Color Hacks'
    | 'Aesthetics & Situations'
    | 'Scroll-Stopping Interactive';
  simpleVibeSummary: string;
  beforeVsAfterLook: string;
  howToCombineAllFourPieces: string;
  threeWaysToRestyleCombo: string[];
  colorPalette: string[];
  pieces: SearchTermItem[];
}

/**
 * 8 Unique, Non-Generic Mix-&-Match 4-Piece Look-Transformation Combinations
 * Every piece uses 100% pure, simple Meesho catalog search words that return real wishlist-ready items!
 */
export const UNIQUE_STYLING_COMBINATION_MATRIX: StylingComboBlueprint[] = [
  {
    id: 'combo-1-indo-western-bootcut',
    comboName:
      'Indo-Western Look Transformer: Wine Square-Neck Short Kurti + Black Flared Bootcut Jeans + Silver Waist Chain + Vintage Bag',
    category: 'Body Proportion & Color Hacks',
    simpleVibeSummary:
      'Normal boring Kurti + Leggings pehenne ke bajaye ye 4-piece Indo-Western combination aapki waist ko slim dikhata hai aur 5\'0" se 5\'3" ki ladkiyon ko 4 inch lamba dikhata hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Loose kurti ko straight jeans ke saath pehenne se body boxy aur height choti lagti hai. Ab (New Styled Look): Fitted Square-Neck Wine Short Kurti + High-Waist Black Flared Bootcut Jeans + Kamar par Silver Waist Chain pehenne se kamar slim aur legs super long lagte hain.',
    howToCombineAllFourPieces:
      'Sabse pehle Wine Maroon Square-Neck Short Kurti (Piece 1) ko Black High-Waist Flared Bootcut Jeans (Piece 2) ke saath pehno (kurti bilkul kamar/waistband par aani chahiye). Ab Oxidized Silver Waist Chain (Piece 3) ko kamar ke side mein hook karo taaki wo kurti aur jeans ke border par halka sa drape ho. Last mein Vintage Brown Shoulder Baguette Bag aur Jhumkas (Piece 4) pehno aur baalon mein half-up claw clip lagao.',
    threeWaysToRestyleCombo: [
      '1. College Regular Look: Piece 1 (Wine Kurti) + Piece 2 (Bootcut Jeans) ko White Sneakers aur Tote Bag ke saath pehno (waist chain skip kar sakte ho).',
      '2. Evening Cafe / Date Look: Piece 3 (Silver Waist Chain) + Piece 4 (Brown Baguette Bag) add karo aur baalon ko soft waves mein khula rakho.',
      '3. Family / Festive Look: Wine Short Kurti ko Black Flared Skirt, Heavy Oxidized Jhumkas aur Punjabi Juttis ke saath pehno.',
    ],
    colorPalette: ['Wine Maroon', 'Jet Black', 'Antique Silver', 'Espresso Brown'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Upper-Body Hero Top (Collarbone & Waist Focus)',
        exactKeyword: 'Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti',
        backupSearchKeywords: [
          'Maroon square neck embroidered short kurti women',
          'Burgundy puff sleeve fitted cotton short kurta',
        ],
        howToCombineAndStyle:
          'Chest aur waist par exact fitting wala size chuno taaki square neck aapke collarbone ko clean aur सुंदर dikhaye.',
        priceFilter: 'Under ₹349 · 4.1★+ · Check Real Buyer Photos',
        fabricAndFitCheck:
          'Meesho customer photo review mein check karo ki cotton-rayon kapda thick ho (bilkul transparent na ho).',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Leg-Lengthening Bottom (Height Illusion Base)',
        exactKeyword: 'Women Black High Waist Stretchable Flared Bootcut Jeans',
        backupSearchKeywords: [
          'High waist black bell bottom flared denim jeans women',
          'Black high rise wide leg stretchable jeans',
        ],
        howToCombineAndStyle:
          'Jeans ka neeche ka flare aapke footwear ke upar tak aana chahiye—isse heels chup jati hain aur legs bohot lambe lagte hain.',
        priceFilter: 'Under ₹449 · Free Delivery · Easy Return',
        fabricAndFitCheck:
          'Size chart mein 38 se 39 inch length check karo aur dekho ki kamar par stretchable grip achi ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Secret Styling Transformer (Waist & Fusion Detail)',
        exactKeyword: 'Oxidized Silver Kamarbandh Belly Waist Chain Belt Women',
        backupSearchKeywords: [
          'Silver oxidized coin waist chain for kurti jeans',
          'Boho oxidized silver layered waist belt women',
        ],
        howToCombineAndStyle:
          'Is silver chain ko jeans ke button se 1 inch neeche kamar par clip karo—ye simple kurti-jeans ko turant Pinterest look deta hai.',
        priceFilter: 'Under ₹179 · High Save Value',
        fabricAndFitCheck:
          'Review photos mein check karo ki hook lock strong ho aur silver polish matte (non-plastic) dikhe.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Look-Finishing Bag & Jewelry Combo',
        exactKeyword: 'Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag',
        backupSearchKeywords: [
          'Dark brown retro underarm shoulder bag women',
          'Oxidized silver afghani jhumka earrings combo',
        ],
        howToCombineAndStyle:
          'Short-strap baguette bag ko ek kandhe (shoulder) par carry karo—isse upper body posture ekdum modern aur classy lagta hai.',
        priceFilter: 'Under ₹289 · Rating 4.2★+',
        fabricAndFitCheck:
          'Customer review video mein bag ki zip aur leather ki stitching check kar lo.',
        platform: 'Meesho',
      },
    ],
  },
  {
    id: 'combo-2-chocolate-pink-korean',
    comboName:
      'High-Contrast Color Combo: Chocolate Brown Fitted Polo Top + Baby Pink Wide-Leg Trousers + Cropped Vest + Cream Tote',
    category: 'Scroll-Stopping Interactive',
    simpleVibeSummary:
      'Har koi roz basic Black & White pehenta hai. Rich Chocolate Brown ke saath Soft Baby Pink combine karne se ₹399 ka Meesho outfit bhi ₹3,000 Zara/Myntra jaisa mehenga lagta hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Simple T-shirt aur blue jeans photo mein bohot aam lagte hain. Ab (New Styled Look): Upar Chocolate Brown Ribbed Top + Neeche Baby Pink Wide-Leg Trousers pehenne se Indian skin tone par ekdum rich, soft Pinterest glow aata hai.',
    howToCombineAllFourPieces:
      'Chocolate Brown Ribbed Polo Top (Piece 1) ko High-Waist Baby Pink Wide-Leg Trousers (Piece 2) ke andar पूरा tuck karke pehno. Kamar par Thin Gold Buckle Brown Belt (Piece 3) lagao taaki waistline lock ho jaye. Sath mein Structured Cream Canvas Tote Bag (Piece 4) aur chote gold hoop earrings pehno.',
    threeWaysToRestyleCombo: [
      '1. College Presentation Look: Piece 1 + Piece 2 ko Gold Belt aur flat loafers ke saath pehno.',
      '2. Sunday Cafe Brunch Look: Collar ka upar wala button khula rakho, पतली gold chain pehno aur white sneakers lagao.',
      '3. Travel / Airport Look: Brown top aur pink pant ke upar ek Oversized White Cotton Shirt open karke layer karo.',
    ],
    colorPalette: ['Chocolate Brown', 'Soft Baby Pink', 'Warm Cream', 'Champagne Gold'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Rich Contrast Top (Warm Skin Glow)',
        exactKeyword: 'Women Chocolate Brown Ribbed Knit Collar Polo Half Sleeve Top',
        backupSearchKeywords: [
          'Coffee brown fitted ribbed v neck knitted top women',
          'Dark brown sweetheart neck full sleeve ribbed top',
        ],
        howToCombineAndStyle:
          'Top ko high-waist pant ke andar neatly tuck karo taaki aapke legs body ka 60% hissa dikhein aur height lambi lage.',
        priceFilter: 'Under ₹329 · 4.1★+ · 200+ Reviews',
        fabricAndFitCheck:
          'Review mein check karo ki ribbed knit fabric stretchy aur soft ho (chubhne wala kapda na ho).',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Statement Pastel Bottom (Wide-Leg Drape)',
        exactKeyword: 'Women Dusty Baby Pink High Waist Pleated Wide Leg Korean Trousers',
        backupSearchKeywords: [
          'Pastel pink high waist formal wide leg pants women',
          'Soft pink loose fit pleated palazzo trousers',
        ],
        howToCombineAndStyle:
          'Trouser ko bilkul belly-button (naabhi) ke paas high-waist pehno taaki front pleats se tummy flat dikhe.',
        priceFilter: 'Under ₹429 · Free Delivery',
        fabricAndFitCheck:
          'Check karo ki kapda thick poly-cotton blend ho taaki andar ki pockets bahar se transparent na dikhein.',
        platform: 'Both',
      },
      {
        itemLabel: 'Piece 3 · Proportion Lock Accessory (Gold Waist Accent)',
        exactKeyword: 'Women Minimal Black Brown Faux Leather Gold Buckle Skinny Waist Belt',
        backupSearchKeywords: [
          'Thin brown waist belt with gold buckle women trousers',
          'Minimal gold hoop earrings combo for women',
        ],
        howToCombineAndStyle:
          'Brown belt ko chocolate brown top ke saath match karke lagao—ye gold buckle poore outfit ko instant rich look deta hai.',
        priceFilter: 'Under ₹169 · Combo Deal',
        fabricAndFitCheck:
          'Buyer photos mein belt ke holes aur gold buckle ki finishing check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Aesthetic Everyday Completer',
        exactKeyword: 'Women Cream White Structured Canvas Aesthetic Tote Handbag With Zip',
        backupSearchKeywords: [
          'Beige aesthetic korean canvas shoulder tote bag',
          'White chunky sole casual sneakers for women',
        ],
        howToCombineAndStyle:
          'Cream tote bag brown aur pink combination ko bright banata hai aur college registers/सामान ke liye bhi best hai.',
        priceFilter: 'Under ₹269 · Rating 4.2★+',
        fabricAndFitCheck:
          'Check karo ki tote bag ke upar zip closure ho aur canvas kapda मोटा ho.',
        platform: 'Meesho',
      },
    ],
  },
  {
    id: 'combo-3-one-black-kurti-3-ways',
    comboName:
      '3-in-1 Capsule Styling: Jet Black Chikankari Short Kurti + Baggy Ice-Blue Cargo Jeans + Beige Blazer Layer + Oxidized Choker',
    category: 'Aesthetics & Situations',
    simpleVibeSummary:
      'Sirf 1 ₹299 ki Black Chikankari Short Kurti se 3 bilkul alag looks (Desi Baddie, Boss Intern, aur College Streetwear) banata hai—bas neeche ka bottom aur layer badal kar!',
    beforeVsAfterLook:
      'Pehle (Basic Look): Black kurti ko har hafte ek hi tarah se pehenna boring lagta hai. Ab (New Styled Look): Usi Black Kurti ko Ice-Blue Baggy Jeans, Heavy Oxidized Choker aur Beige Shrug/Blazer ke saath mix karne se 1 wishlist mein 3 naye outfits ban jate hain.',
    howToCombineAllFourPieces:
      'Jet Black Cotton Chikankari Short Kurti (Piece 1) ko Light Ice-Blue High-Waist Baggy Jeans (Piece 2) ke saath pehno aur jeans ko neeche ankle par 1 inch fold karo. Gale mein Heavy Oxidized Silver Afghani Choker & Jhumka Set (Piece 3) pehno. Agar smart/boss look chahiye toh upar se Beige Casual Blazer/Shrug (Piece 4) layer kar lo.',
    threeWaysToRestyleCombo: [
      '1. Desi Streetwear Look: Black Kurti + Baggy Ice-Blue Jeans + Oxidized Choker + Kolhapuri Flats.',
      '2. Smart Intern / Presentation Look: Black Kurti + Upar se Beige Blazer Layer + Straight Pants + Small Studs.',
      '3. Evening Monochrome Look: Black Kurti + Black Flared Pants + Heavy Silver Jhumkas + Kajal Eyes.',
    ],
    colorPalette: ['Jet Black', 'Ice Wash Blue', 'Warm Beige', 'Oxidized Silver'],
    pieces: [
      {
        itemLabel: 'Piece 1 · The All-Rounder Base Top',
        exactKeyword: 'Women Jet Black Pure Cotton Lucknowi Chikankari Short Kurti',
        backupSearchKeywords: [
          'Black white thread embroidered cotton short kurta women',
          'Black V neck Kashmiri embroidered short kurti',
        ],
        howToCombineAndStyle:
          'Kurti ki sleeves ko kohni (elbows) tak fold karke pehno taaki haath mein silver bangles ya watch saaf dikhe.',
        priceFilter: 'Under ₹299 · Best Seller · 4.2★+',
        fabricAndFitCheck:
          'Review mein check karo ki pure cotton kapda ho (garmi wala synthetic crepe na ho) aur white dhage ki कढ़ाई saaf ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Streetwear Contrast Bottom',
        exactKeyword: 'Women Ice Blue High Waist Baggy Wide Leg Straight Fit Boyfriend Jeans',
        backupSearchKeywords: [
          'Light blue high waist loose fit korean cargo jeans women',
          'Ice blue wide leg denim jeans for girls',
        ],
        howToCombineAndStyle:
          'Jet black kurti ke saath light ice-blue denim ka contrast camera aur Reel mein sabse zyada uभर kar dikhta hai.',
        priceFilter: 'Under ₹469 · Free Delivery',
        fabricAndFitCheck:
          'Customer review mein denim ki thickness aur waist button ki fitting check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Neckline Statement Transformer',
        exactKeyword: 'Oxidized Silver Afghani Choker Necklace With Jhumka Earrings Bangle Set',
        backupSearchKeywords: [
          'Heavy oxidized silver tribal necklace earrings combo',
          'Silver oxidized ghungroo bangle cuff bracelet set',
        ],
        howToCombineAndStyle:
          'Oxidized choker ko black kurti ke neck ke bilkul upar set karo—ye chehre ko instant sharp frame deta hai.',
        priceFilter: 'Under ₹199 · Complete 3-Piece Jewellery Set',
        fabricAndFitCheck:
          'Review photos mein check karo ki silver polish kali (blackish) na pade aur ghungroo poore hon.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Smart Third-Piece Layer & Footwear',
        exactKeyword: 'Women Beige Open Front Cotton Linen Casual Shrug Blazer Jacket',
        backupSearchKeywords: [
          'Women tan embroidered Punjabi jutti flat mojari',
          'Black structured sling crossbody bag women',
        ],
        howToCombineAndStyle:
          'Black kurti ke upar beige shrug/blazer daalte hi normal college look turant Boss-Girl look mein badal jata hai.',
        priceFilter: 'Under ₹399 · Multi-Use Layer',
        fabricAndFitCheck:
          'Shoulder ki silai (stitching) aur wrinkle-free fabric review mein check karo.',
        platform: 'Both',
      },
    ],
  },
  {
    id: 'combo-4-warm-indian-skin-glow',
    comboName:
      'Warm Indian Skin-Glow Combo: Emerald Green Modal Kurta + Cream Palazzo Pants + Organza Scallop Dupatta + Pearl Juttis',
    category: 'Body Proportion & Color Hacks',
    simpleVibeSummary:
      'Dull grey ya neon colors jo Indian skin ko dark/tired dikhate hain, unki jagah Emerald Green + Warm Cream ka combo jo bina makeup ke chehre par glow laata hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Halka पीला (neon yellow) ya dull grey pehenne se camera par skin dull lagti hai. Ab (New Styled Look): Deep Emerald Green Kurta ke saath Warm Cream Pants aur Pearl Jewellery pehenne se chehra naturally bright aur glowing dikhta hai.',
    howToCombineAllFourPieces:
      'Emerald Green V-Neck Straight Kurta (Piece 1) ko Off-White/Cream Straight Ankle-Length Pants (Piece 2) ke saath pehno. Sheer Cream Organza Floral Scallop Dupatta (Piece 3) ko gale mein lapetne ke bajaye sirf ek kandhe (one-shoulder) par pin karo taaki V-neck dikhta rahe. Kaano mein Pearl Chandbali Jhumkas aur pairon mein Juttis (Piece 4) pehno.',
    threeWaysToRestyleCombo: [
      '1. Festive / Puja Look: Charon pieces ek saath pehno aur organza dupatta ek shoulder par neatly pin karo.',
      '2. College / Office Ethnic Day: Dupatta hata kar sirf Emerald Kurta + Cream Pants + Watch aur Flat Sandals pehno.',
      '3. Shaadi / Function Mix: Emerald Kurta ko Golden Skirt aur heavy Chandbali ke saath pair karo.',
    ],
    colorPalette: ['Emerald Bottle Green', 'Warm Ivory Cream', 'Soft Gold', 'Pearl White'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Skin-Brightening Jewel-Tone Top',
        exactKeyword: 'Women Emerald Bottle Green V Neck Zari Embroidered Straight Kurta',
        backupSearchKeywords: [
          'Dark green chanderi silk embroidered kurta women',
          'Bottle green rayon sequence neck straight kurti',
        ],
        howToCombineAndStyle:
          'V-neck cut gale ko lamba dikhata hai aur dark bottle-green color Indian warm skin tone ko turant bright banata hai.',
        priceFilter: 'Under ₹389 · Rating 4.2★+',
        fabricAndFitCheck:
          'Meesho review mein check karo ki soft rayon/modal kapda ho aur neck ki zari कढ़ाई (embroidery) clean ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Clean Contrast Bottom',
        exactKeyword: 'Women Off White Cream Cotton Lycra Straight Ankle Length Cigarette Pant',
        backupSearchKeywords: [
          'Cream chikankari embroidered bottom palazzo trouser women',
          'Off white stretchable cotton straight trouser pant',
        ],
        howToCombineAndStyle:
          'Ankle-length pant pehenne se neeche 2 inch ankle dikhta hai, jisse पूरा kurta set tailored aur slim lagta hai.',
        priceFilter: 'Under ₹289 · Everyday Staple',
        fabricAndFitCheck:
          'Customer photos mein verify karo ki white/cream pant ka cotton मोटा (non-transparent) ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Ethereal Texture Layer (Dupatta)',
        exactKeyword: 'Women White Cream Organza Floral Printed Scallop Cutwork Border Dupatta',
        backupSearchKeywords: [
          'Ivory gold zari border chanderi silk dupatta',
          'Pastel floral organza dupatta with pearl border',
        ],
        howToCombineAndStyle:
          'Dupatte ko ek shoulder par safety pin se set karo aur dusra hissa hath (wrist) par khula chhod do—video mein bohot royal lagega.',
        priceFilter: 'Under ₹229 · Instant Festive Upgrade',
        fabricAndFitCheck:
          'Check karo ki organza kapda soft drape wala ho, kandhe par fula-fula (stiff) na khada rahe.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Pearl & Ethnic Footwear Finisher',
        exactKeyword: 'Women Gold Pearl Kundan Chandbali Jhumka Earrings Set',
        backupSearchKeywords: [
          'Women cream pearl work flat Punjabi mojari jutti',
          'Gold pearl potli clutch bag for women festive',
        ],
        howToCombineAndStyle:
          'Gale mein koi necklace mat pehno taaki kurta ka V-neck clean dikhe, sirf bade Pearl Chandbali Jhumkas pehno.',
        priceFilter: 'Under ₹249 · High Save Value',
        fabricAndFitCheck:
          'Check karo ki earrings ka weight halka ho aur piche ka stopper tight ho.',
        platform: 'Meesho',
      },
    ],
  },
  {
    id: 'combo-5-korean-layered-shirt-vest',
    comboName:
      'Korean Layered Pinterest Combo: Oversized White Cotton Shirt + Cinnamon Knitted Vest + Charcoal Wide-Leg Pants + Retro Glasses',
    category: 'Identity & Personality',
    simpleVibeSummary:
      'Simple white shirt ko school uniform jaisa dikhne se bachata hai aur Korean Cafe / Bookshop CEO jaisa trendy layered look deta hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Sirf white shirt aur formal pant pehenne se boring office/school uniform jaisa lagta hai. Ab (New Styled Look): White Shirt ke upar Cinnamon Brown Cropped Knitted Vest aur Charcoal Wide-Leg Pants layer karne se instant Pinterest aesthetic ban jata hai.',
    howToCombineAllFourPieces:
      'Pehle White Oversized Button-Down Cotton Shirt (Piece 1) pehno aur uske upar Cinnamon Brown V-Neck Sleeveless Knitted Vest (Piece 2) layer karo. Dono ko Charcoal Grey High-Waist Pleated Wide-Leg Trousers (Piece 3) ke saath pair karo (shirt ka thoda sa hem neeche dikhne do ya andar tuck karo). Sath mein Vintage Clear Frame Glasses aur Brown Bag (Piece 4) lagao.',
    threeWaysToRestyleCombo: [
      '1. Aesthetic Cafe / Study Look: White Shirt + Brown Knitted Vest + Charcoal Pants + Clear Glasses.',
      '2. Summer College Look: Vest hata kar White Shirt ke buttons khule rakho aur andar Black Tank Top + Charcoal Pants pehno.',
      '3. Solo Vest Look: Garmiyon mein Knitted Vest ko akele sleeveless top ki tarah Blue Jeans ke saath pehno.',
    ],
    colorPalette: ['Cinnamon Brown', 'Crisp White', 'Charcoal Grey', 'Espresso Leather'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Crisp Base Layer Shirt',
        exactKeyword: 'Women White Oversized Drop Shoulder Cotton Button Down Casual Shirt',
        backupSearchKeywords: [
          'White poplin collared full sleeve formal casual shirt women',
          'Cream oversized boyfriend cotton shirt for girls',
        ],
        howToCombineAndStyle:
          'Shirt ke cuffs ko wrist par ek baar fold karo aur collar ko knitted vest ke bahar neatly nikalo.',
        priceFilter: 'Under ₹349 · Wardrobe Essential',
        fabricAndFitCheck:
          'Review mein check karo ki cotton blend thick ho taaki white shirt zyada see-through na ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · The Look-Changing Layer (Knitted Vest)',
        exactKeyword: 'Women Brown V Neck Sleeveless Ribbed Knitted Sweater Vest Crop Top',
        backupSearchKeywords: [
          'Beige argyle pattern sleeveless knitted vest women',
          'Coffee brown houndstooth sweater vest crop top',
        ],
        howToCombineAndStyle:
          'Cropped V-neck vest aapke waist proportion ko upar uthata hai aur simple shirt ko turant stylish banata hai.',
        priceFilter: 'Under ₹319 · 4.1★+ Rating',
        fabricAndFitCheck:
          'Check karo ki knit fabric soft ho aur dhone ke baad roye (lint) na niklein.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Tailored Silhouette Bottom',
        exactKeyword: 'Women Charcoal Dark Grey High Waist Front Pleated Wide Leg Formal Trousers',
        backupSearchKeywords: [
          'Black high waist Korean loose wide leg formal pants women',
          'Dark grey tailored straight fit office trousers women',
        ],
        howToCombineAndStyle:
          'Front pleats tummy ko flat dikhati hain aur upar se neeche tak ek lambi straight line banati hain.',
        priceFilter: 'Under ₹439 · Free Delivery',
        fabricAndFitCheck:
          'Review mein back elastic waist stretch aur front hook ki quality check karo.',
        platform: 'Both',
      },
      {
        itemLabel: 'Piece 4 · Bookshop Aesthetic Completer',
        exactKeyword: 'Women Vintage Rectangular Black Brown Frame Clear Lens Fashion Glasses',
        backupSearchKeywords: [
          'Women brown faux leather vintage crossbody messenger bag',
          'Minimal brown strap vintage oval dial watch women',
        ],
        howToCombineAndStyle:
          'Clear glasses ko pehno ya सिर (head) ke upar hairband ki tarah lagao—dono tarike se super trendy lagta hai.',
        priceFilter: 'Under ₹199 · Instant Vibe Upgrade',
        fabricAndFitCheck:
          'Buyer photos mein frame ke screws aur clean glass lens check karo.',
        platform: 'Meesho',
      },
    ],
  },
  {
    id: 'combo-6-strict-mom-coquette',
    comboName:
      'Strict-Mom Approved Coquette Combo: Dusty Rose Tie-Back Puff-Sleeve Kurti + White Flared Palazzo + Pearl Bow Clip + Mary Jane Flats',
    category: 'Aesthetics & Situations',
    simpleVibeSummary:
      'Pinterest ka cute Coquette Pink-and-White look deta hai par 100% modest aur comfortable coverage ke saath, jise strict Indian mummy bhi turant approve kar dengi.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Pinterest ke zyada-tar cute pink tops bohot cropped ya deep-neck hote hain jo ghar walon ke saamne nahi pehen sakte. Ab (New Styled Look): Dusty Pink Puff-Sleeve Short Kurti + White Flared Cotton Palazzo + Satin Pearl Bow Clip se wahi dreamy cute look full coverage mein milta hai.',
    howToCombineAllFourPieces:
      'Dusty Pink Floral Puff-Sleeve Short Kurti (Piece 1) ko White Chikankari/Flared Cotton Palazzo (Piece 2) ke saath pehno. Baalon ko half-tie karke piche Satin Pearl Ribbon Bow Clip (Piece 3) lagao aur pairon mein Cream Mary Jane Strap Flat Bellies (Piece 4) pehno.',
    threeWaysToRestyleCombo: [
      '1. Soft Coquette Outing Look: Dusty Pink Kurti + White Palazzo + Satin Bow Hair Clip + Mary Jane Flats.',
      '2. College Regular Look: Dusty Pink Kurti + Light Blue Straight Jeans + Small Pearl Studs.',
      '3. Family Dinner Look: Sath mein ek White Lace Dupatta aur Silver Jhumkas add kar lo.',
    ],
    colorPalette: ['Dusty Rose Pink', 'Milk White', 'Pearl Cream', 'Soft Gold'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Modest Romantic Top',
        exactKeyword: 'Women Dusty Pink Floral Printed Puff Sleeve Square Neck Cotton Short Kurti',
        backupSearchKeywords: [
          'Baby pink schiffli eyelet lace embroidered short kurti',
          'Peach pink gathered empire waist flared short top',
        ],
        howToCombineAndStyle:
          'Puff sleeves ko kandhe par set rakho—ye modest coverage bhi deta hai aur collarbone ko sundar frame karta hai.',
        priceFilter: 'Under ₹339 · 4.2★+ Rating',
        fabricAndFitCheck:
          'Review mein dekho ki soft mulmul/rayon cotton ho aur chest par double lining ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Breezy White Bottom',
        exactKeyword: 'Women White Cotton Chicken Embroidered Wide Leg Flared Palazzo Pant',
        backupSearchKeywords: [
          'Off white high waist pleated wide leg culotte palazzo',
          'White schiffli lace border cotton straight pant',
        ],
        howToCombineAndStyle:
          'White embroidered palazzo pink floral kurti ko fresh aur bright banata hai aur garmi mein super comfortable rehta hai.',
        priceFilter: 'Under ₹349 · Free Delivery',
        fabricAndFitCheck:
          'Check karo ki andar घुटने (knee) tak cotton astar/lining lagi ho taaki bilkul see-through na ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Coquette Hair & Neck Accent',
        exactKeyword: 'Women Cream Pink Satin Ribbon Bow Hair Clip With Pearl Pendant Necklace',
        backupSearchKeywords: [
          'Korean pearl bow hair claw clip set for girls',
          'Dainty gold pearl choker necklace earrings combo',
        ],
        howToCombineAndStyle:
          'Baalon ko half-tie karke piche satin bow clip lagao—Reel ke starting shot mein back-angle se ye bow dikhana bohot viral jata hai.',
        priceFilter: 'Under ₹149 · Combo Pack',
        fabricAndFitCheck:
          'Check karo ki clip ka metal grip tight ho taaki baalon se phisle nahi.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Comfortable Aesthetic Footwear',
        exactKeyword: 'Women Cream White Buckle Strap Mary Jane Flat Ballet Bellies Shoes',
        backupSearchKeywords: [
          'White pearl strap flat sandals for women college',
          'Pastel pink quilted sling bag with pearl handle',
        ],
        howToCombineAndStyle:
          'Mary Jane flats poora din chalne ke liye comfortable hain aur outfit ko cute doll-like finish dete hain.',
        priceFilter: 'Under ₹399 · Cushioned Sole',
        fabricAndFitCheck:
          'Review mein size chart (cm mein) aur piche heel ki cushioning check karke order karo.',
        platform: 'Both',
      },
    ],
  },
  {
    id: 'combo-7-under-1199-full-4piece-challenge',
    comboName:
      'The ₹1,199 Complete 4-Piece Head-to-Toe Challenge: Kashmiri Aari Embroidered Short Kurti + Black Wide-Leg Jeans + Afghani Jhumka Choker + Kolhapuri Wedges',
    category: 'Scroll-Stopping Interactive',
    simpleVibeSummary:
      'Lakho creators sirf mehenge kapde dikhate hain—ye combo ₹1,199 ke andar poora 4-piece Head-to-Toe Desi Baddie look ready karta hai jo ₹4,500 boutique set jaisa lagta hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Alag-alag bina soche kharide hue kapde pehenne se look adhoora lagta hai. Ab (New Styled Look): Kashmiri Aari Work Short Kurti + High-Waist Black Wide-Leg Jeans + Heavy Afghani Silver Choker + Tan Kolhapuri Wedges se ₹1,199 mein pura celebrity-styled look milta hai.',
    howToCombineAllFourPieces:
      'Sabse pehle Rust/Maroon Kashmiri Aari Embroidered Short Kurti (Piece 1) ko Black High-Waist Wide-Leg Denim Jeans (Piece 2) ke upar pehno. Gale mein Oxidized Silver Afghani Choker & Jhumka Combo (Piece 3) pehno aur sleeves ko kohni tak fold karo. Pairon mein Tan Braided Kolhapuri Wedge Heels (Piece 4) pehno jo jeans ke flare ke neeche chup kar aapki height 3 inch badha dengi.',
    threeWaysToRestyleCombo: [
      '1. Full ₹1,199 College Fest Look: Charon pieces ek saath pehno aur maang mein choti si black bindi lagao.',
      '2. Casual Everyday Class Look: Choker hata kar sirf Kashmiri Short Kurti + Black Wide-Leg Jeans + Small Jhumkas pehno.',
      '3. Family Puja / Outing Look: Black jeans ki jagah Cream Palazzo aur Kolhapuri Wedges pehno.',
    ],
    colorPalette: ['Rust Kashmiri Maroon', 'Carbon Black', 'Antique Silver', 'Tan Brown'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Artisanal Kashmiri Embroidered Top',
        exactKeyword: 'Women Rust Maroon Kashmiri Aari Thread Embroidered Rayon Short Kurti',
        backupSearchKeywords: [
          'Women black Kashmiri embroidered V neck cotton short kurti',
          'Bottle green Kashmiri aari work full sleeve short kurta',
        ],
        howToCombineAndStyle:
          'V-neck Kashmiri embroidery chehre ki taraf dhyan khinchti hai; sleeves ko halka fold karke pehno.',
        priceFilter: 'Under ₹299 · Rating 4.2★+',
        fabricAndFitCheck:
          'Meesho customer review photos mein aari thread embroidery ki finishing aur rayon thickness check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Tall-Silhouette Wide-Leg Denim',
        exactKeyword: 'Women Black High Waist Loose Fit Wide Leg Straight Denim Jeans',
        backupSearchKeywords: [
          'Charcoal black high rise baggy boyfriend jeans women',
          'Women dark black high waist flared bell bottom jeans',
        ],
        howToCombineAndStyle:
          'High-waist button ko bilkul navel (naabhi) par lock karo taaki 30:70 leg-lengthening proportion bane.',
        priceFilter: 'Under ₹439 · Free Delivery',
        fabricAndFitCheck:
          'Size chart mein 39-inch full length aur waist measurement (inches mein) verify karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Instant Desi-Baddie Jewellery Set',
        exactKeyword: 'Women Oxidized Silver Afghani Tribal Choker Necklace With Jhumka Set',
        backupSearchKeywords: [
          'Silver oxidized ghungroo choker and earrings combo women',
          'Boho oxidized silver layered necklace jhumka bangle set',
        ],
        howToCombineAndStyle:
          'V-neck kurti ke khule हिस्से mein ye oxidized choker baith kar ekdum rich boutique look deta hai.',
        priceFilter: 'Under ₹169 · High Save Trigger',
        fabricAndFitCheck:
          'Review photos mein matte black-silver polish aur पीछे ki adjustable dori check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Hidden Height-Boost Ethnic Footwear',
        exactKeyword: 'Women Tan Brown Braided Ethnic Kolhapuri Wedge Heel Sandals',
        backupSearchKeywords: [
          'Women brown ethnic block heel kolhapuri chappal',
          'Tan faux leather ethnic sling bag for kurti',
        ],
        howToCombineAndStyle:
          'Wide-leg jeans ke neeche 2.5-inch Kolhapuri wedges pehenne se bina kisi ko pata chale height 3 inch lambi lagti hai.',
        priceFilter: 'Under ₹289 · Cushioned Sole',
        fabricAndFitCheck:
          'Buyer reviews mein sole grip aur strap softness check karke apna exact size chuno.',
        platform: 'Meesho',
      },
    ],
  },
  {
    id: 'combo-8-pear-midsize-tummy-hide-illusion',
    comboName:
      'Mid-Size & Tummy-Hide Body-Math Combo: Navy Angrakha Wrap Peplum Short Kurti + Cream Straight Pants + Minimal Gold Watch + Structured Sling Bag',
    category: 'Body Proportion & Color Hacks',
    simpleVibeSummary:
      '70% Indian girls ko bloated tummy ya heavy hips ka issue hota hai—ye Angrakha Diagonal-Wrap + Straight Pant combo tummy ko 100% hide karke instant hourglass shape banata hai.',
    beforeVsAfterLook:
      'Pehle (Basic Look): Body-hugging t-shirt ya side-slit straight kurti hips aur tummy par chipakti hai. Ab (New Styled Look): Diagonal Angrakha Wrap Peplum Kurti kamar ke sabse patle hisse par tie hoti hai aur neeche se tummy/hips par bina chipke skim karti hai.',
    howToCombineAllFourPieces:
      'Navy Blue Floral Angrakha Wrap Tie-Waist Peplum Kurti (Piece 1) ko High-Waist Off-White/Cream Straight Cigarette Pants (Piece 2) ke saath pehno (side dori ko chest ke bilkul neeche empire-waist par tie karo). Ek haath mein Minimal Gold Link Strap Watch & Hoops (Piece 3) aur kandhe par Cream/Tan Structured Crossbody Sling Bag (Piece 4) carry karo.',
    threeWaysToRestyleCombo: [
      '1. Smart College / Office Look: Navy Angrakha Kurti + Cream Straight Pants + Gold Watch + Structured Bag.',
      '2. Weekend Outing Look: Navy Angrakha Kurti ko Blue Flared Bootcut Jeans aur White Sneakers ke saath pehno.',
      '3. Family Get-Together Look: Sath mein Silver Jhumkas aur Cream Punjabi Juttis pehno.',
    ],
    colorPalette: ['Midnight Navy Blue', 'Warm Ivory Cream', 'Champagne Gold', 'Tan Leather'],
    pieces: [
      {
        itemLabel: 'Piece 1 · Tummy-Concealing Diagonal Wrap Top',
        exactKeyword: 'Women Navy Blue Jaipuri Printed Angrakha Wrap Peplum Cotton Short Kurti',
        backupSearchKeywords: [
          'Indigo blue V neck empire waist gathered flared short kurti',
          'Dark blue cotton angrakha side tie flared top women',
        ],
        howToCombineAndStyle:
          'Angrakha ki tirchi (diagonal) line aankhon ko upar chest aur collarbone ki taraf le jati hai aur peplum flare tummy ko bilkul chhupa deta hai.',
        priceFilter: 'Under ₹339 · 4.2★+ Rating',
        fabricAndFitCheck:
          'Review mein 100% pure Jaipuri cotton kapda check karo jo dhone par shrink na ho.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 2 · Vertical Line Straight Bottom',
        exactKeyword: 'Women Cream Off White High Waist Stretchable Straight Fit Trouser Pant',
        backupSearchKeywords: [
          'White cotton lycra ankle length cigarette pant women',
          'Beige high waist formal straight trouser pant women',
        ],
        howToCombineAndStyle:
          'Upar flared peplum kurti hai isliye neeche straight-fit ankle pant pehno—isse body balanced aur tall dikhti hai.',
        priceFilter: 'Under ₹299 · Free Delivery',
        fabricAndFitCheck:
          'Customer review photos mein fabric thickness aur elastic waistband comfort check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 3 · Classy Wrist & Ear Completer',
        exactKeyword: 'Women Vintage Gold Rectangular Dial Metal Strap Analog Wrist Watch',
        backupSearchKeywords: [
          'Gold plated minimal hoop earrings and dainty chain combo',
          'Rose gold bracelet watch for girls office wear',
        ],
        howToCombineAndStyle:
          '3/4th sleeves ke saath haath mein gold rectangular watch pehenne se look turant rich aur polished lagta hai.',
        priceFilter: 'Under ₹199 · Bestseller',
        fabricAndFitCheck:
          'Review photos mein dial size aur clasp lock check karo.',
        platform: 'Meesho',
      },
      {
        itemLabel: 'Piece 4 · Structured Posture Enhancer Bag',
        exactKeyword: 'Women Tan Cream Colorblock Structured Box Crossbody Sling Handbag',
        backupSearchKeywords: [
          'Beige brown structured mini tote sling bag women',
          'Women tan flat mule loafers sandals',
        ],
        howToCombineAndStyle:
          'Soft jhola bag ki jagah stiff structured box bag carry karne se body silhouette zyada slim aur sharp dikhta hai.',
        priceFilter: 'Under ₹319 · 4.1★+ Rating',
        fabricAndFitCheck:
          'Check karo ki bag ka base stiff ho aur strap adjustable ho.',
        platform: 'Both',
      },
    ],
  },
];

/**
 * Clean & sanitize any Meesho search keyword so it ONLY contains real product catalog search words
 * (strips out conceptual reel titles like "Zodiac Sign", "Overthinker", "2026 Edition", etc.)
 */
export function sanitizeMeeshoSearchTerm(
  rawKeyword: string,
  fallbackIndex = 0
): string {
  const defaultCatalogTerms = [
    'Women Wine Maroon Square Neck Puff Sleeve Cotton Short Kurti',
    'Women Black High Waist Stretchable Flared Bootcut Jeans',
    'Oxidized Silver Kamarbandh Waist Chain Belt & Jhumka Combo',
    'Women Vintage Brown Faux Leather Shoulder Baguette Sling Bag',
  ];

  if (!rawKeyword || typeof rawKeyword !== 'string') {
    return defaultCatalogTerms[fallbackIndex % defaultCatalogTerms.length];
  }

  const cleaned = rawKeyword
    .replace(
      /\b(100%\s*pure\s*english|pure\s*english|clean\s*english|exact\s*meesho\s*catalog\s*search\s*for|meesho\s*catalog\s*search|zodiac sign|date-night edition|date night edition|birth month|initial letter|overthinker|hopeless romantic|ambitious ceo|spotify playlist|villain era|soft heart|cold aura|height illusion hacks|strict desi mom approved|myntra vs meesho|dupe|2026|viral|edition|look \d|piece \d|outfit \d|under rs \d+|under ₹\d+)\b/gi,
      ''
    )
    .replace(/100%/g, '')
    .replace(/[:()[\]"'—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.split(' ').length < 3) {
    return defaultCatalogTerms[fallbackIndex % defaultCatalogTerms.length];
  }

  return cleaned;
}

/**
 * Real-Time Day-by-Day Dynamic Trend & Styling Combination Context
 * Automatically adapts to the current live date, day of the week, and season so the AI & UI evolve daily!
 */
export function getRealTimeDailyStylingContext(variationOffset = 0) {
  const now = new Date();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum = now.getDate();
  const yearNum = now.getFullYear();

  const startOfYear = new Date(yearNum, 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const dailyMoodByDayOfWeek: Record<string, string> = {
    Monday: 'Smart College & Boss-Intern Layering (Effortless Morning Combinations)',
    Tuesday: '5\'0" Height-Illusion & Body-Proportion Mix-and-Match Hacks',
    Wednesday: 'Unexpected High-Contrast Color Combinations for Warm Indian Skin',
    Thursday: 'Indo-Western Kurti + Denim Fusion (Desi Baddie & Strict-Mom Approved)',
    Friday: 'Date-Night & Cafe Hopping Look-Transformation Combinations',
    Saturday: 'Myntra ₹2,499 vs Meesho ₹389 Weekend Dupe Combinations',
    Sunday: '1 Capsule Piece Styled 3 Ways (Weekly Wishlist Reset)',
  };

  const totalCombos = UNIQUE_STYLING_COMBINATION_MATRIX.length;
  const activeComboIndex =
    (dayOfYear + Math.abs(Number(variationOffset) || 0)) % totalCombos;
  const primaryDailyCombo = UNIQUE_STYLING_COMBINATION_MATRIX[activeComboIndex];

  // Pick 4 rotating daily combinations for today's live radar
  const todaysFourLiveCombos = [0, 1, 2, 3].map(
    (offset) =>
      UNIQUE_STYLING_COMBINATION_MATRIX[
        (dayOfYear + offset + Math.abs(Number(variationOffset) || 0)) %
          totalCombos
      ]
  );

  return {
    formattedDate: `${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    dayName,
    monthName,
    dayOfYear,
    todaysStylingFocus:
      dailyMoodByDayOfWeek[dayName] ||
      'Indo-Western Proportion & Color Contrast Styling',
    liveDailyTrendTag: `Live Daily Styling Radar · ${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    primaryDailyCombo,
    todaysFourLiveCombos,
  };
}

/**
 * 2026 ANTI-AI-SLOP & INSTAGRAM ALGORITHM PSYCHOLOGY ENFORCER:
 * Guarantees 0% commercial/robotic ad-copy ("Feel the softness", "Swipe up", "#SoftHeartStyle", "neoprene coat")
 * and enforces real Indian Gen-Z human creator tone, psychological Save/Share triggers, and high-search-volume tags.
 */
const BANNED_SLOP_HOOK_REGEX =
  /\b(feel the softness|own the chill|swipe up, match your mood|wardrobe switch|two vibes, one|step into elegance|unleash your inner|embrace the magic)\b/i;

const BANNED_SLOP_HASHTAG_REGEX =
  /^#(softheartstyle|coldauravibe|mooddress2026|reelstyleswitch|shinebright|fashionmagic)$/i;

const VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS = [
  '#meeshofinds',
  '#shortkurtistyling',
  '#indianoutfitideas',
  '#collegeoutfitideas',
  '#meeshohaul',
  '#kurtijeanscombo',
  '#petitefashionindia',
  '#myntrafinds',
  '#desiaesthetic',
  '#affordablestyling',
  '#meeshokurtiset',
  '#indowesternoutfits',
];

export function isSlopHook(hook: string): boolean {
  if (!hook || typeof hook !== 'string') return true;
  const trimmed = hook.trim();
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 5) return true;
  if (BANNED_SLOP_HOOK_REGEX.test(trimmed)) return true;
  return false;
}

export function enforceMastermindViralReelPack(
  searchTerms: SearchTermItem[],
  conceptTitle: string,
  howToCombineSummary: string,
  rawReelPack?: Partial<ReelGenerationResult['reelPack']>,
  variationSeed = 0
): ReelGenerationResult['reelPack'] {
  const p1 = searchTerms[0]?.exactKeyword || 'Women Wine Maroon Square Neck Short Kurti';
  const p2 = searchTerms[1]?.exactKeyword || 'Women Black High Waist Flared Bootcut Jeans';
  const p3 = searchTerms[2]?.exactKeyword || 'Oxidized Silver Kamarbandh Waist Chain';
  const p4 = searchTerms[3]?.exactKeyword || 'Vintage Faux Leather Shoulder Bag';

  const shortP1 = p1.replace(/^Women\s+/i, '').split(' ').slice(0, 5).join(' ');
  const shortP2 = p2.replace(/^Women\s+/i, '').split(' ').slice(0, 5).join(' ');
  const shortP3 = p3.replace(/^Women\s+/i, '').split(' ').slice(0, 5).join(' ');
  const shortP4 = p4.replace(/^Women\s+/i, '').split(' ').slice(0, 4).join(' ');

  const priceTag = (searchTerms[0]?.priceFilter || 'Under ₹349').split('·')[0].trim();

  // Dynamic fallback hooks that directly use the current 4 pieces + variationSeed so even fallbacks are never identical
  const mastermindHooksPool = [
    `Stop wearing ${shortP1} with basic leggings—pair it with ${shortP2} instead (${priceTag}) 😭`,
    `I gatekept this ${priceTag} Meesho 4-piece combo (${shortP1} + ${shortP3}) because it makes 5'0" girls look 5'5" 👀`,
    `How ${shortP1} + ${shortP2} (${priceTag}) looks like a ₹4,500 Pinterest outfit—wait till you see Piece 3 ✨`,
    `Send this ${shortP1} + ${shortP4} combo to that bestie who says "I have nothing to wear" before every outing 💀`,
    `POV: You stopped buying random kurtis and started using this 30:70 ${shortP1} + ${shortP2} proportion trick 🔥`,
    `Why is nobody talking about how ${shortP1} + ${shortP3} completely transforms your waist & height proportion?!`,
    `Found the exact ${priceTag} ${shortP1} + ${shortP2} combination that flatters every Indian skin tone & body shape ✨`,
    `Never wear ${shortP1} untucked without ${shortP3}—here is the 4-piece styling math every girl needs to save 📌`,
  ];

  const offset = Math.abs(Number(variationSeed) || 0);
  const defaultThreeMastermindHooks = [
    mastermindHooksPool[offset % mastermindHooksPool.length],
    mastermindHooksPool[(offset + 1) % mastermindHooksPool.length],
    mastermindHooksPool[(offset + 2) % mastermindHooksPool.length],
  ];

  const rawHooks = Array.isArray(rawReelPack?.onScreenHooks)
    ? rawReelPack!.onScreenHooks
    : [];

  const finalHooks = [0, 1, 2].map((idx) => {
    const candidate = String(rawHooks[idx] || '').trim();
    if (!candidate || isSlopHook(candidate)) {
      return defaultThreeMastermindHooks[idx];
    }
    return candidate;
  });

  // Preserve AI's generated hashtags (cleaned to lowercase #tag), filtering only banned fake slop tags
  const aiHashtags = Array.isArray(rawReelPack?.trendingHashtags)
    ? rawReelPack!.trendingHashtags
        .map((t) => {
          const clean = String(t || '')
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase();
          return clean.startsWith('#') ? clean : clean ? `#${clean}` : '';
        })
        .filter((t) => t.length > 2 && !BANNED_SLOP_HASHTAG_REGEX.test(t))
    : [];

  const p1Lower = `${p1} ${p2} ${conceptTitle}`.toLowerCase();
  const dynamicBackupHashtags: string[] = [...aiHashtags];
  if (p1Lower.includes('kurti') || p1Lower.includes('kurta')) {
    dynamicBackupHashtags.push('#shortkurtistyling', '#kurtijeanscombo');
  } else if (p1Lower.includes('shirt') || p1Lower.includes('vest') || p1Lower.includes('korean')) {
    dynamicBackupHashtags.push('#collegeoutfitideas', '#koreanoutfitsindia');
  } else if (p1Lower.includes('saree') || p1Lower.includes('festive') || p1Lower.includes('lehenga')) {
    dynamicBackupHashtags.push('#festiveoutfitsindia', '#ethnicwearindia');
  }
  dynamicBackupHashtags.push('#meeshofinds', '#indianoutfitideas', '#meeshohaul', '#petitefashionindia', '#affordablestyling');

  const uniqueRealHashtags = Array.from(new Set(dynamicBackupHashtags)).slice(0, 5);
  while (uniqueRealHashtags.length < 5) {
    const nextTag =
      VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS[
        (uniqueRealHashtags.length + offset) % VERIFIED_HIGH_VOLUME_INDIAN_HASHTAGS.length
      ];
    if (!uniqueRealHashtags.includes(nextTag)) {
      uniqueRealHashtags.push(nextTag);
    } else {
      break;
    }
  }

  // Filter out western/irrelevant AI slop keywords like "neoprene coat", "winter coat sale", "dual mood"
  const BANNED_SEO_REGEX = /\b(neoprene|winter coat|parka|trench coat|snow|cyberpunk|futuristic|dual mood)\b/i;
  const defaultBuyerSeoKeywords = [
    p1.toLowerCase(),
    p2.toLowerCase(),
    p3.toLowerCase(),
    p4.toLowerCase(),
    `${shortP1.toLowerCase()} styling ideas india`,
    `meesho ${shortP1.toLowerCase()} under 399`,
    'height illusion outfit ideas for 5ft girls india',
    'college outfit ideas meesho haul 2026',
    'warm indian skin tone outfit color combinations',
    'meesho hidden gems wishlist links',
  ];

  const rawSeo = Array.isArray(rawReelPack?.seoKeywords)
    ? rawReelPack!.seoKeywords.map((k) => String(k).trim()).filter((k) => k && !BANNED_SEO_REGEX.test(k))
    : [];

  // Put AI's fresh SEO keywords FIRST, then piece-specific keywords
  const mergedSeo = Array.from(new Set([...rawSeo, ...defaultBuyerSeoKeywords])).slice(0, 10);

  const triggerWord = rawReelPack?.autoDmTriggerWord || 'LINK';

  const rawCaption = String(rawReelPack?.hinglishCaption || '').trim();
  const isCaptionTooShortOrSlop =
    rawCaption.length < 60 || BANNED_SLOP_HOOK_REGEX.test(rawCaption);

  const englishCaptionStylingSummary = `Pair ${p1} with ${p2} worn high at the natural waist, add ${p3} to cinch and define your silhouette, and finish with ${p4} for a complete head-to-toe look!`;

  const mastermindCaption = isCaptionTooShortOrSlop
    ? `Wait before you scroll—which piece from this "${conceptTitle}" combo are you adding to your Meesho wishlist first: Piece 1, 2, 3, or all 4? 😭✨\n\nHere is the exact 4-Piece Look-Transformation Formula:\n1️⃣ Piece 1 (Hero Top): ${p1} (${priceTag})\n2️⃣ Piece 2 (Proportion Bottom): ${p2}\n3️⃣ Piece 3 (Secret Styling Layer): ${p3}\n4️⃣ Piece 4 (Completer): ${p4}\n\n💡 Styling Secret: ${englishCaptionStylingSummary}\n\n👉 Comment "${triggerWord}" below and I will Auto-DM you all 4 review-checked Meesho links in 5 seconds! 📌 Save this Reel before your next haul!`
    : rawCaption;

  return {
    onScreenHooks: finalHooks,
    autoDmTriggerWord: triggerWord,
    hinglishCaption: mastermindCaption,
    seoKeywords: mergedSeo,
    trendingHashtags: uniqueRealHashtags.slice(0, 5),
  };
}

export interface UploadedGarmentPreview {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
  dominantColorName: string;
  dominantHex: string;
}

export interface StylistVerdictHinglish {
  bestChoiceFromUploads: string;
  whatToAvoidAndWhy: string;
  hundredXGlowUpScience: string;
  stepByStepDrapingTrick: string;
  colorHarmonyFormula: string;
}

export interface StylistChatMessage {
  id: string;
  role: "user" | "assistant";
  createdAt: string;
  userText?: string;
  selectedColors?: string[];
  bodyGoal?: string;
  uploadedImages?: UploadedGarmentPreview[];
  stylistVerdictHinglish?: StylistVerdictHinglish;
  updatedReelPack?: ReelGenerationResult;
  providerUsed?: string;
}

export const ROYAL_MEESHO_COLOR_CHIPS: {
  name: string;
  hex: string;
  bestPairingBottom: string;
  bestMetallicAccent: string;
  skinGlowEffectHinglish: string;
}[] = [
  {
    name: "Deep Wine / Maroon",
    hex: "#6B1D2F",
    bestPairingBottom: "Jet Black High Waist Flared Bootcut Jeans",
    bestMetallicAccent: "Oxidized Silver Kamarbandh & Jhumka",
    skinGlowEffectHinglish:
      "Deep Wine shade har Indian skin tone (fair, wheatish, dusky) par royal contrast banata hai aur body ko turant 2 size slim dikhata hai.",
  },
  {
    name: "Emerald / Bottle Green",
    hex: "#0F5238",
    bestPairingBottom: "Warm Ivory Cream High Waist Wide Leg Trousers",
    bestMetallicAccent: "Antique Gold Layered Waist Chain & Statement Studs",
    skinGlowEffectHinglish:
      "Bottle Green + Cream combination sasti nahi balki ₹5,000+ Sabyasachi/Pinterest royal vibe deta hai aur chehre par instant glow lata hai.",
  },
  {
    name: "Jet Black",
    hex: "#18181B",
    bestPairingBottom: "Dark Indigo High Waist Wide Leg Denim Jeans",
    bestMetallicAccent: "Chunky Oxidized Silver Afghan Waist Belt & Jhumkas",
    skinGlowEffectHinglish:
      "Jet Black tummy aur heavy arms ko 100% hide karta hai aur oxidized silver ke saath milkar jaw-dropping Desi Baddie look banata hai.",
  },
  {
    name: "Rust / Terracotta Orange",
    hex: "#B84A27",
    bestPairingBottom: "Jet Black High Waist Flared Palazzo Trousers",
    bestMetallicAccent: "Oxidized Silver Coin Choker & Kamarbandh",
    skinGlowEffectHinglish:
      "Rust Terracotta warm Indian skin par golden-hour filter jaisa kaam karta hai—bina makeup ke bhi chehra bright aur fresh lagta hai.",
  },
  {
    name: "Royal Navy Blue",
    hex: "#1E2952",
    bestPairingBottom: "Crisp White or Beige High Waist Straight Fit Jeans",
    bestMetallicAccent: "Silver Layered Waist Chain & Minimal Hoop Earrings",
    skinGlowEffectHinglish:
      "Navy Blue heavy upper body ko slim structure deta hai aur Beige/White bottom ke saath Old-Money luxury look deta hai.",
  },
  {
    name: "Ivory / Off-White Cream",
    hex: "#F5EFE6",
    bestPairingBottom: "Dark Espresso Brown or Black High Waist Wide Leg Pants",
    bestMetallicAccent: "Gold Pearl Drop Jhumkas & Structured Sling Bag",
    skinGlowEffectHinglish:
      "Ivory Cream chehre ke niche natural reflector ka kaam karta hai jisse dark circles kam dikhte hain aur face 100x radiant lagta hai.",
  },
  {
    name: "Dusty Rose / Mauve Pink",
    hex: "#B56576",
    bestPairingBottom: "Charcoal Black or Dark Blue High Waist Bootcut Jeans",
    bestMetallicAccent: "Oxidized Silver Delicate Waist Chain & Bangles",
    skinGlowEffectHinglish:
      "Baby pink kiddy lag sakta hai, par Dusty Rose/Mauve dark bottom ke saath mature, soft-romantic aur super classy lagta hai.",
  },
  {
    name: "Mustard / Haldi Gold",
    hex: "#D99B26",
    bestPairingBottom: "Deep Maroon or Jet Black High Waist Flared Palazzo",
    bestMetallicAccent: "Antique Oxidized Ghungroo Jhumkas & Potli Bag",
    skinGlowEffectHinglish:
      "Mustard ko kabhi bright red/blue ke saath mat pehno (joker look aata hai)—ise Jet Black ya Deep Maroon ke saath pair karne se 100x royal festive look aata hai.",
  },
  {
    name: "Coffee / Espresso Brown",
    hex: "#4A2C2A",
    bestPairingBottom: "Cream Beige High Waist Pleated Korean Trousers",
    bestMetallicAccent: "Minimalist Gold Buckle Belt & Vintage Baguette Bag",
    skinGlowEffectHinglish:
      "Espresso Brown + Beige 2026-2027 ka sabse bada Old-Money aesthetic hai jo chubby aur petite dono body types ko rich aur tall dikhata hai.",
  },
  {
    name: "Teal / Peacock Blue",
    hex: "#0D5C63",
    bestPairingBottom: "Jet Black High Waist Stretchable Flared Jeans",
    bestMetallicAccent: "Oxidized Silver Temple Jhumkas & Kamarbandh",
    skinGlowEffectHinglish:
      "Peacock Teal aankhon aur jawline ko highlight karta hai aur har body shape ko hourglass structure deta hai.",
  },
];

export const BODY_GLOWUP_GOALS: {
  id: string;
  label: string;
  hinglishTag: string;
  neckAndCutRule: string;
  hinglishTransformationPromise: string;
}[] = [
  {
    id: "universal-100x",
    label: "✨ 100x Royal Glow-Up (Any Face & Body)",
    hinglishTag: "Har ladki ko 100x royal, slim aur model-jaisa dikhane wala formula",
    neckAndCutRule: "Square Neck Fitted Empire-Waist Short Kurti Top",
    hinglishTransformationPromise:
      "Square neckline collarbone dikha kar chehre ko patla aur sharp dikhati hai, aur 30:70 high-waist proportion kisi bhi normal ya sadharan look ko 100x expensive model look mein badal deta hai.",
  },
  {
    id: "chubby-curvy-slim",
    label: "🔥 Chubby / Plus-Size → Instant Slim Hourglass",
    hinglishTag: "Moti / Heavy Body & Lower Tummy ko 100% slim hourglass dikhane wala trick",
    neckAndCutRule: "V-Neck Peplum Empire-Waist A-Line Short Kurti",
    hinglishTransformationPromise:
      "V-Neck gardan ko lamba aur double-chin/round face ko slim dikhata hai. Empire-waist A-line flare pet (lower tummy) par bilkul chipakta nahi, aur diagonal waist-chain kamar ko 3 inch patli dikhati hai!",
  },
  {
    id: "short-height-tall",
    label: "📏 5'0\" Short Height → 5'5\" Tall Model Illusion",
    hinglishTag: "Choti height wali ladkiyon ko 4-5 inch lamba dikhane wala 30:70 math",
    neckAndCutRule: "19-Inch Cropped Square-Neck Fitted Kurti Top",
    hinglishTransformationPromise:
      "19-inch short kurti kamar par khatam hoti hai aur 39-inch high-waist bootcut ankle tak vertical line banati hai—bina heels ke bhi height 5'5\" lagti hai.",
  },
  {
    id: "dusky-skin-radiance",
    label: "💎 Dusky / Dark Skin → 100x Golden-Hour Glow",
    hinglishTag: "Dusky ya dull skin ko bina heavy makeup 100x bright aur royal dikhane wala shade",
    neckAndCutRule: "Sweetheart Neck Kashmiri Embroidered Cotton Short Kurti",
    hinglishTransformationPromise:
      "Rich jewel tones (Wine, Emerald, Rust, Ivory) aur चेहरे ke paas oxidized/gold jhumke natural light reflect karte hain jisse dusky skin sone (gold) jaisi chamakti hai.",
  },
];

export function synthesizeCustomSimilarOutfitReelPack(
  currentReel: ReelGenerationResult,
  userMessage: string,
  selectedColors: string[],
  bodyGoalId: string,
  uploadedImages: UploadedGarmentPreview[],
  backgroundDesc: string
): {
  stylistVerdictHinglish: StylistVerdictHinglish;
  updatedReelPack: ReelGenerationResult;
} {
  const dailyCtx = getRealTimeDailyStylingContext(Date.now() % 100);

  // 1. Determine the primary hero color from user's selected colors, uploaded image dominant colors, or text
  const allCandidateColors = [
    ...selectedColors,
    ...uploadedImages.map((img) => img.dominantColorName).filter(Boolean),
  ];

  const matchedColorObj =
    ROYAL_MEESHO_COLOR_CHIPS.find((chip) =>
      allCandidateColors.some((c) =>
        chip.name.toLowerCase().includes(c.toLowerCase().split(" ")[0])
      )
    ) ||
    ROYAL_MEESHO_COLOR_CHIPS.find((chip) =>
      userMessage
        .toLowerCase()
        .includes(chip.name.toLowerCase().split(" ")[0])
    ) ||
    ROYAL_MEESHO_COLOR_CHIPS[0];

  const primaryColorClean = matchedColorObj.name.split("/")[0].trim();

  // 2. Determine body goal
  const chosenGoal =
    BODY_GLOWUP_GOALS.find((g) => g.id === bodyGoalId) || BODY_GLOWUP_GOALS[0];

  // 3. Detect if user mentioned a specific garment in their chat message (e.g., kurti, shirt, top, corset, saree, palazzo, jeans, trouser, skirt)
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
    customBottomDescriptor =
      "Women Cream Beige High Waist Wide Leg Pleated Korean Trousers";
  } else if (msgLower.includes("blue jeans") || msgLower.includes("denim")) {
    customBottomDescriptor =
      "Women Dark Indigo Blue High Waist Flared Bootcut Stretchable Jeans";
  } else if (msgLower.includes("palazzo") || msgLower.includes("plazo")) {
    customBottomDescriptor =
      "Women Jet Black High Waist Flared Rayon Palazzo Trousers";
  } else if (msgLower.includes("skirt")) {
    customBottomDescriptor =
      "Women Jet Black High Waist A-Line Midi Slit Skirt";
  }

  const piece1Keyword = sanitizeMeeshoSearchTerm(
    `Women ${customTopDescriptor}`,
    0
  );
  const piece2Keyword = sanitizeMeeshoSearchTerm(customBottomDescriptor, 1);
  const piece3Keyword = sanitizeMeeshoSearchTerm(
    matchedColorObj.bestMetallicAccent.includes("Gold")
      ? "Women Antique Gold Layered Kamarbandh Belly Waist Chain"
      : "Women Oxidized Silver Layered Kamarbandh Belly Waist Chain",
    2
  );
  const piece4Keyword = sanitizeMeeshoSearchTerm(
    matchedColorObj.bestMetallicAccent.includes("Gold")
      ? "Women Tan Brown Structured Vintage Shoulder Baguette Bag and Gold Jhumka"
      : "Women Black Retro Mini Shoulder Baguette Bag and Oxidized Jhumka",
    3
  );

  const searchTerms: SearchTermItem[] = [
    {
      itemLabel: `Piece 1 · 100x Face-Framing & Slimming Top (${primaryColorClean})`,
      exactKeyword: piece1Keyword,
      backupSearchKeywords: [
        `${primaryColorClean.toLowerCase()} v neck short kurti women cotton`,
        `${primaryColorClean.toLowerCase()} square neck peplum top women`,
      ],
      howToCombineAndStyle: `Easy Hinglish: Aapko jo ${primaryColorClean} piece mila hai, uski sleeves ko kohni (elbows) tak push karo taaki kalai (wrists) patli dikhe aur neckline khuli rahe—isse chehra aur gardan turant slim aur royal lagte hain.`,
      priceFilter: "Under ₹329 · 4.2★+ Rated",
      fabricAndFitCheck:
        "Meesho customer review photos mein check karo ki कपड़ा मोटा (non-see-through matte cotton/rayon) ho—shiny polyester mat lena kyunki shiny kapda tummy ko bada dikhata hai.",
      platform: "Meesho",
    },
    {
      itemLabel: "Piece 2 · Tummy-Control & Height-Elongating Bottom",
      exactKeyword: piece2Keyword,
      backupSearchKeywords: [
        "high waist flared bootcut jeans women black",
        "high waist wide leg pleated trousers women",
      ],
      howToCombineAndStyle:
        "Easy Hinglish: Ise nabhi (belly button) se 1 inch upar high-waist pehno. Iska dark/structured high-rise waistband lower tummy ko 100% flat hold karta hai aur legs ko 4 inch lamba dikhata hai.",
      priceFilter: "Under ₹449 · Free Delivery",
      fabricAndFitCheck:
        "Reviews mein 'High Rise' aur '38-39 inch length' zaroor check karo taaki neeche ankle par clean flare aaye.",
      platform: "Meesho",
    },
    {
      itemLabel: "Piece 3 · Secret Hourglass Waist-cinching Transformer",
      exactKeyword: piece3Keyword,
      backupSearchKeywords: [
        "oxidized silver waist chain kamarbandh women",
        "slim gold waist belt for kurti jeans",
      ],
      howToCombineAndStyle:
        "Easy Hinglish: Is waist chain ko bilkul seedha (tight horizontal) mat bandho—ise kamar par halka V-shape (diagonal drop) mein lagao. Ye optical illusion sabse heavy/chubby kamar ko bhi turant 3 inch slim hourglass dikhata hai!",
      priceFilter: "Under ₹179 · High Save Trigger",
      fabricAndFitCheck:
        "Review photo mein matte oxidized ya antique gold finish check karo (zyada chamakne wala plastic/yellow metal avoid karo).",
      platform: "Meesho",
    },
    {
      itemLabel: "Piece 4 · 100x Facial Glow & Rich-Vibe Finisher",
      exactKeyword: piece4Keyword,
      backupSearchKeywords: [
        "black retro shoulder baguette bag women",
        "oxidized silver dome jhumka earrings women",
      ],
      howToCombineAndStyle:
        "Easy Hinglish: Baguette bag ko underarm (kandhe ke bilkul niche) carry karo—lamba latakta hua sling bag hips ko choda dikhata hai, jabki underarm bag height ko lamba aur look ko ₹5,000+ model jaisa banata hai!",
      priceFilter: "Under ₹269",
      fabricAndFitCheck:
        "Check customer photos for stiff structured faux leather that holds its shape.",
      platform: "Meesho",
    },
  ];

  const uploadedSummaryText =
    uploadedImages.length > 0
      ? `Aapke upload kiye hue ${uploadedImages.length} Meesho screenshots (${uploadedImages
          .map((u, i) => `Photo #${i + 1}: ${u.dominantColorName}`)
          .join(", ")})`
      : `Aapke bataye hue similar kapde aur colors (${primaryColorClean})`;

  const stylistVerdictHinglish: StylistVerdictHinglish = {
    bestChoiceFromUploads: `${uploadedSummaryText} mein se sabse BEST aur 100x Royal choice hai: **${primaryColorClean} Top/Kurti** ko **${
      piece2Keyword.replace(/^Women\s+/i, "")
    }** ke saath pair karna! Agar aapke screenshots mein koi bahut bada print ya shiny/neon कपड़ा hai, toh use chhod kar sabse solid/small-motif matte **${primaryColorClean}** wala piece select karo.`,
    whatToAvoidAndWhy: `❌ **Joker / Kiddy Look Se Kaise Bachein:** Kabhi bhi 2 loud colors ek saath mat pehno (jaise ${primaryColorClean} ke niche bright red, yellow ya light sky-blue legging/jeans) aur na hi bade cartoon/plastic accessories lagao—usse look childish aur sasta lagta hai. Humne **60-30-10 Royal Color Law** lagaya hai: 60% ${primaryColorClean} + 30% Deep Slimming Contrast Bottom + 10% Matte Metallic Accent.`,
    hundredXGlowUpScience: `💎 **Kisi Bhi Ladki (Chubby, Short ya Dusky) Ko 100x Beautiful Dikhane Ka Secret:** ${chosenGoal.hinglishTransformationPromise} Saath hi ${matchedColorObj.skinGlowEffectHinglish}`,
    stepByStepDrapingTrick: `✨ **Exact Pehenne Ka Mastermind Tarika:** (1) Piece 1 (${primaryColorClean}) ki neckline khuli rakho aur sleeves kohni tak fold karo. (2) Piece 2 ko high-waist pehno taaki pet (tummy) poori tarah tuck-in ho jaye. (3) Piece 3 (Waist Chain) ko kamar par V-drop mein lagao. (4) Piece 4 (Underarm Bag + Jhumke) pehno—chehra aur body structure 100x model jaisa lagega!`,
    colorHarmonyFormula: `60% ${primaryColorClean} (Face Glow) + 30% ${
      piece2Keyword.includes("Cream") || piece2Keyword.includes("Beige")
        ? "Warm Ivory/Beige"
        : "Deep Slimming Black/Indigo"
    } (Body Structure) + 10% ${
      matchedColorObj.bestMetallicAccent.includes("Gold")
        ? "Antique Gold"
        : "Matte Oxidized Silver"
    } (Royal Highlight)`,
  };

  const displayTitle = `Custom 100x Royal Glow-Up Combo: ${primaryColorClean} ${chosenGoal.neckAndCutRule.replace(
    /^19-Inch\s+/i,
    ""
  )} + ${piece2Keyword.replace(/^Women\s+/i, "")}`;

  const howToCombineAllFourHinglish = `Sabse pehle aapka chuna hua Piece 1 (${primaryColorClean}) aur Piece 2 (${piece2Keyword.replace(
    /^Women\s+/i,
    ""
  )}) 30:70 high-waist proportion mein pehno—ye tummy ko hide karke legs ko 4 inch lamba dikhata hai. Ab kamar par Piece 3 (Waist Chain) ko V-drop mein lagao aur Piece 4 (Underarm Bag + Jhumke) ke saath look complete karo!`;

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
    undefined,
    Date.now() % 100
  );

  const updatedReelPack: ReelGenerationResult = {
    id: `reel-custom-stylist-${Date.now()}`,
    createdAt: new Date().toISOString(),
    themeInput: userMessage || `${primaryColorClean} Similar Meesho Match`,
    providerUsed: `100x Royal Glow-Up AI Stylist (${dailyCtx.formattedDate})`,
    concept: {
      title: displayTitle,
      category: "Body Proportion & Color Hacks",
      liveDailyTrendTag: `100x Custom Similar-Item Match · ${stylistVerdictHinglish.colorHarmonyFormula}`,
      curiosityIdentityAngle: `${stylistVerdictHinglish.bestChoiceFromUploads} ${stylistVerdictHinglish.hundredXGlowUpScience}`,
      firstTwoSecondVisual:
        "0.0s–1.5s: Ek realistic faceless female hand aapke chune hue charon matching kapdon ko bina hanger ke ek saath pakad kar dikha raha hai.",
      whyItTriggersSharesAndSaves:
        "Ladkiyan is Reel ko turant Save aur apni bestie ko DM karengi kyunki ye koi joker/kiddy outfit nahi, balki har body type (chubby, petite, dusky) ko 100x slim, lamba aur royal dikhane wala 60-30-10 color combination hai!",
      lookTransformationFormula: {
        beforeVsAfterLook: `Pehle (Confusing / Mismatched Look): Jab Meesho par exact same piece nahi milta toh galat color/fit lene se look bulky, sasta ya joker jaisa lagne ka darr rehta hai. -> Ab (100x Royal Glow-Up Look): ${stylistVerdictHinglish.hundredXGlowUpScience}`,
        howToCombineAllFourPieces: howToCombineAllFourHinglish,
        threeWaysToRestyleCombo: [
          `1. Everyday Slimming College/Office Look (Hinglish): Piece 1 (${primaryColorClean}) + Piece 2 ko underarm bag aur stud earrings ke saath clean minimal style mein pehno.`,
          `2. 100x Hourglass Date/Cafe Look (Hinglish): Kamar par Piece 3 (Waist Chain) V-drop mein add karo aur sleeves kohni tak push karo—instant hourglass silhouette!`,
          `3. Festive / Family Function Look (Hinglish): Statement jhumke, gajra/bangles aur block heels add karke isi outfit ko ₹4,000+ designer look bana do.`,
        ],
      },
      colorPalette: [
        primaryColorClean,
        piece2Keyword.includes("Cream") ? "Warm Ivory Cream" : "Jet Black",
        matchedColorObj.bestMetallicAccent.includes("Gold")
          ? "Antique Gold"
          : "Oxidized Silver",
        "Warm Skin-Glow Neutral",
      ],
      shotByShotPlan: [
        {
          timeRange: "0.0s – 1.5s",
          visualAction:
            "Haath mein pakde hue aapke naye chune hue charon kapdon ka bundle (Prompt 1 + Prompt 6): Bina hanger ke dikhao.",
          onScreenText: reelPack.onScreenHooks[0],
        },
        {
          timeRange: "1.5s – 3.0s",
          visualAction:
            "Full-Body Look ya Mirror Try-On (Prompt 0A/0B): 60-30-10 Color Harmony aur 30:70 Slimming Proportion saaf dikhao.",
          onScreenText: `100x Slimming & Glow Formula: ${primaryColorClean} + High-Rise Fit`,
        },
        {
          timeRange: "3.0s – 4.5s",
          visualAction:
            "Piece 3 (V-Drop Waist Chain) ka close-up + 1 second ke liye aapka Meesho screenshot / customer review photo flash karo.",
          onScreenText: `The Secret 3rd Piece That Creates an Instant Hourglass Waist`,
        },
        {
          timeRange: "4.5s – 6.0s",
          visualAction:
            "Piece 4 (Underarm Bag & Jhumka) dikhao taaki video wapas Frame 1 se smooth loop ho.",
          onScreenText:
            "Comment 'LINK' below & check your DM in 5s before this color sells out! 😭",
        },
      ],
    },
    searchTerms,
    prompts,
    reelPack,
  };

  return {
    stylistVerdictHinglish,
    updatedReelPack,
  };
}

// ============================================================================
// ZERO-SLOP GEN-Z EBOOK AI VIDEO PROMPTS & REAL-HUMAN REEL BUILDERS
// ============================================================================

const ANTI_SLOP_SCENES = [
  {
    name: "Messy Hostel Bed & 1 AM Phone Scroll POV",
    mood: "1am real-talk voice-note vibe",
    setting:
      "a real slightly messy Indian hostel/bedroom bed at 1 AM with a crumpled cotton bedsheet, warm yellow fairy lights on the wall behind, a phone charger cable draped over the pillow, and a matte smartphone held casually in one hand",
    camera:
      "raw unedited iPhone 15 Pro vertical 9:16 selfie-POV angle, authentic low-light ISO 800 phone grain, slight off-center handheld tilt, zero studio polish",
    motion:
      "subtle natural handheld phone sway as a real brown-skinned Indian hand scrolls casually through clean dark-mode notes on screen, soft warm wall light flickering slightly, seamless 6-second loop",
    brollAction:
      "relatable late-night POV sitting cross-legged on a cotton bedsheet closing 10 confusing browser tabs, sighing with quiet relief, and opening one clean private notes page on a phone under soft lamp light",
    algoNote:
      "Looks 100% like a real late-night story from a friend—not an ad. Viewers immediately recognize their own 1 AM room vibe, pause to read your short text twice (2.5x loop), save it, and comment your word.",
  },
  {
    name: "Evening Chai / Maggi Kitchen Casual Drop",
    mood: "bestie spilling tea mid-task",
    setting:
      "a normal Indian home kitchen counter at 6:30 PM with a steel saucepan of masala chai simmering gently on the gas stove, warm yellow overhead tubelight mixed with soft dusk window light, stainless steel cup waiting beside a phone leaned against a spice jar",
    camera:
      "candid 9:16 front-camera smartphone clip at 30fps, slightly imperfect everyday home lighting, natural handheld movement, real documentary creator feel",
    motion:
      "natural faceless hand pours hot chai into a simple ceramic cup while glancing casually down at a phone showing a clean softly blurred checklist, light steam rising naturally, zero synthetic gloss",
    brollAction:
      "everyday evening POV stirring boiling chai/Maggi with one hand while the other hand taps open a clean 5-part cheat-sheet on a phone screen—zero corporate energy, 100% real Indian home vibe",
    algoNote:
      "Mid-task everyday clips (making chai/Maggi) have the lowest skip rate on 2026 Instagram because viewers' brains never flag them as ads—they stay hooked to read the whole overlay and drop a comment.",
  },
  {
    name: "Auto / Metro Window Golden-Hour Reflection",
    mood: "quiet main-character commute thought",
    setting:
      "looking out the side window of a moving Indian metro or auto-rickshaw at 5:45 PM golden hour, warm orange sunlight catching wired earphones and a smartphone held casually in the lap, blurred city trees and streetlights passing outside",
    camera:
      "raw 9:16 handheld phone clip, natural window glare and warm lens flare, organic vehicle micro-vibration, authentic Kodak-like unedited phone colors",
    motion:
      "camera rests gently near the window as city lights drift past, then tilts naturally down to a thumb swiping through a clean mobile PDF page with softly blurred bullet points, zero AI morphing",
    brollAction:
      "quiet commute POV with wired earphones on, watching sunset clouds through a metro/auto window while opening a saved private guide on your phone—calm, nostalgic, super relatable Gen-Z energy",
    algoNote:
      "Golden-hour commute visuals trigger instant saves and bestie-sends ('literally us after college/work'), pushing your Reel straight into non-follower Trial Reel feeds.",
  },
  {
    name: "Terrace / Balcony Breeze Evening POV",
    mood: "chill sunset friend advice",
    setting:
      "an Indian apartment balcony or rooftop terrace right before sunset, soft pink-orange sky above neighboring rooftops, a steel railing with a small potted plant, a spiral notebook resting on the ledge beside a smartphone",
    camera:
      "candid 9:16 iPhone vertical framing, natural warm breeze moving notebook pages slightly, authentic outdoor evening dynamic range, zero artificial rim lighting",
    motion:
      "subtle handheld breeze sway as real fingers hold down a fluttering notebook page and tap a clean phone screen beside it, real paper texture and soft shadows, crisp 6-second loop",
    brollAction:
      "quiet evening terrace POV flipping through two handwritten cheat-sheet pages while city dusk lights turn on in the distance—feels like a smart older sibling giving honest advice",
    algoNote:
      "Terrace sunset clips feel warm, authentic, and completely unscripted—killing scam skepticism immediately so viewers feel comfortable commenting for your guide.",
  },
  {
    name: "Getting-Ready / Lip-Balm Casual Mirror Half-Frame",
    mood: "unbothered bestie sharing a shortcut",
    setting:
      "a casual everyday bedroom dressing-table mirror in natural afternoon window light (faceless/neck-down or side-profile crop), a hair claw clip, lip balm, and a college tote bag visible naturally on the cluttered shelf",
    camera:
      "unedited 9:16 front-camera phone propped against a mirror, realistic daylight shadows, slight natural lens grain, zero airbrushed beauty filter or studio glow",
    motion:
      "natural everyday motion of tying hair up with a claw clip or grabbing a tote bag and phone before heading out, relaxed unhurried body language, zero CGI stiffness",
    brollAction:
      "relatable 'getting ready in 5 mins' POV grabbing your phone and tucking a small printed cheat-sheet into your college bag—effortless, trendy 2026 creator aesthetic",
    algoNote:
      "The #1 highest-converting 2026 Gen-Z format: casual 'getting ready while dropping real advice' text-on-screen clips feel 100% organic, pulling massive watch-time loops and DMs.",
  },
  {
    name: "Rainy Window & College Notebook Flip POV",
    mood: "cozy rainy-day private notes",
    setting:
      "near a rain-streaked Indian balcony grill window during overcast blue hour, soft cool daylight mixing with warm room light, a well-used spiral notebook with blue pen highlights and sticky tabs on a simple wooden bed-table",
    camera:
      "raw iPhone 14 Pro 9:16 vertical clip, natural handheld micro-shake, authentic paper grain and skin texture on hands, slightly muted everyday color tone",
    motion:
      "real hands slowly flip one highlighted notebook page while rain droplets shimmer softly outside the blurred window, calm steady cadence with zero warped letters",
    brollAction:
      "rain tapping on the window while a hand underlines one short line in a notebook and taps open the matching clean guide on a phone—zero fluff, pure cozy focus",
    algoNote:
      "Rain + handwritten notes kills 100% of 'fake AI scam' doubt and triggers huge curiosity ('wait what is written there? let me comment!').",
  },
];

export function buildAntiSlopEbookVideoPrompts(
  ebookTitle: string,
  chapter1Title: string,
  priceDisplay: string,
  autoDmTrigger: string,
  variationIndex = 0
): EbookAntiSlopVideoPrompts {
  const scene =
    ANTI_SLOP_SCENES[Math.abs(Number(variationIndex)) % ANTI_SLOP_SCENES.length];
  const shortTopic = String(ebookTitle || "2026 Private Playbook")
    .replace(/^The\s+/i, "")
    .slice(0, 68);
  const shortCh1 = String(chapter1Title || "The Real Shortcut").slice(0, 58);

  const antiSlopGuardrails =
    "STRICT ZERO-AI-SLOP RULES: NO neon purple/blue cyber lights, NO glossy plastic airbrushed faces, NO generic corporate 'clean organized workspace + coffee cup' stock look, NO CGI 3D renders, NO floating holograms, NO readable garbled text on screens (keep screen blocks softly blurred so clean native Instagram text sits on top), NO fake luxury cars or cash fans. Must look 100% indistinguishable from a real unedited phone clip filmed by a normal Indian 20-something.";

  return {
    rawPhoneFirstFramePrompt: `Vertical 9:16 candid real-life smartphone photo (iPhone 15 Pro, 24mm f/1.8, natural everyday phone grain). Scene: ${scene.setting}. Feels like a genuine "${scene.mood}" moment for a reel about "${shortTopic}". Keep the upper-middle 35% of the frame clean and uncluttered so short white Instagram text reads easily. ${antiSlopGuardrails}`,
    zeroSlopVideoMotionPrompt: `6-second vertical 9:16 raw handheld phone video (Kling / Veo / Runway / Flow AI). Visual: ${scene.setting}. Camera & Motion: ${scene.camera}; ${scene.motion}. Keep the vibe super casual, unpolished, and real—like a friend casually dropping a shortcut about "${shortCh1}" on their story. Natural 30fps phone shutter feel, zero sudden morphing, zero dramatic camera swoops. ${antiSlopGuardrails}`,
    relatablePovBrollPrompt: `6-second relatable everyday 9:16 Indian Gen-Z POV B-roll clip: ${scene.brollAction}. Vibe: honest relief after finally figuring something out—zero ad feel, zero corporate polish. Natural shadows, slight handheld sway, clean center-top space for your short text ("${priceDisplay}" / comment "${autoDmTrigger}"). ${antiSlopGuardrails}`,
    algorithmTriggerNote: `${scene.algoNote} (Vibe: ${scene.name} · Keep the clip ~6 seconds with a 2-line casual text overlay so people replay it while reading!)`,
  };
}

export function buildRotatingEbookReelSectionFallback(params: {
  ebookTitle: string;
  chapterTitles: string[];
  priceDisplay: string;
  anchorPriceDisplay: string;
  autoDmTrigger: string;
  section: EbookReelSectionKey;
  variationIndex: number;
}): Partial<EbookGenerationResult['reelBlueprint']> {
  const {
    ebookTitle,
    chapterTitles,
    priceDisplay,
    anchorPriceDisplay,
    autoDmTrigger,
    section,
    variationIndex,
  } = params;

  const idx = Math.abs(Number(variationIndex) || 0);
  const shortTitle = String(ebookTitle || "2026 Private Playbook").slice(0, 62);
  const ch1 = (chapterTitles[0] || "The Actual Shortcut").slice(0, 56);
  const ch2 = (chapterTitles[1] || "The Step-by-Step Move").slice(0, 56);
  const ch3 = (chapterTitles[2] || "Exact Copy-Paste Scripts").slice(0, 56);
  const trigger = String(autoDmTrigger || "SECRET").toUpperCase();
  const price = priceDisplay || "₹29";
  const anchor = anchorPriceDisplay || "₹1,999";

  const prompts = buildAntiSlopEbookVideoPrompts(
    shortTitle,
    ch1,
    price,
    trigger,
    idx
  );

  const videoPlans = [
    {
      visualStyle:
        "Casual Getting-Ready / Tying Hair Up Drop (Looks 100% Like a Friend's Story, Zero Ad Vibe)",
      shotByShot: [
        `0.0s – 2.0s: Raw front-camera clip of you tying your hair up / putting on lip balm in normal room light; short lowercase text sits center-top: "honestly mad nobody told me this 6 months ago 😭"`,
        `2.0s – 4.3s: Quick raw screen recording scrolling your private PDF notes ("${ch1}" & "${ch2}") with most lines lightly blurred so viewers lean in to see what's inside.`,
        `4.3s – 6.0s: Cut back to a chill half-smile grabbing your bag: "put every exact link + copy-paste script in a ${price} pdf so you don't waste weeks — comment '${trigger}'"`,
      ],
      lightingAndAudioTip:
        "Use a quiet trending chill audio at 10% volume with native Instagram Sans font (small clean text, NOT giant yellow ad banners). Keep it 5.8–6.2s and toggle ON 'Trial Reel' so Instagram tests it on 100% non-followers.",
    },
    {
      visualStyle:
        "Boiling Chai / Maggi Evening Kitchen Clip (Zero Skip Rate — Everyday Indian Home Energy)",
      shotByShot: [
        `0.0s – 1.8s: Casual 1-hand phone shot pouring simmering chai into a regular mug; real-talk text pops up: "people really charge ₹4,999 in webinars just to gatekeep these 5 basic links lol"`,
        `1.8s – 4.2s: Quick raw phone-in-hand swipe showing the exact clickable filters & "${ch3}" copy-paste message inside your guide.`,
        `4.2s – 6.0s: Back to taking a chill sip of chai: "kept the whole 5-part guide at ${price} (cheaper than momos). drop '${trigger}' & check your DM in 5 sec"`,
      ],
      lightingAndAudioTip:
        "Keep the room lighting totally normal (don't over-edit or add flashy transitions—raw cuts get 3x higher trust). Pin one casual comment saying 'just sent the link to everyone who commented!'",
    },
    {
      visualStyle:
        "1 AM Messy Hostel Bed + Raw Notes App Scroll (High-Save Relatable Late-Night Vibe)",
      shotByShot: [
        `0.0s – 2.0s: Slightly shaky phone clip on a messy cotton bedsheet at night; relatable text hits right away: "pov: it's 1am and you're done watching 40-min videos that never show the actual websites"`,
        `2.0s – 4.4s: Real thumb scrolling through the clean 5-part cheat-sheet for "${shortTitle}" (zoom slightly close on the exact links & copy-paste box).`,
        `4.4s – 6.0s: Loop back to the cozy lamp frame: "save this for tomorrow or comment '${trigger}' and I'll auto-DM the ${price} pdf link right now"`,
      ],
      lightingAndAudioTip:
        "Lower clip brightness slightly (-12% in Instagram Edits) so clean white lowercase text pops effortlessly. Keep text in the middle safe zone away from the bottom caption.",
    },
    {
      visualStyle:
        "Auto / Metro Window Golden-Hour Ride (Main-Character Quiet Reflection — Bestie-Share Magnet)",
      shotByShot: [
        `0.0s – 2.2s: Sunset view outside a moving auto/metro window with wired earphones visible; soft text drops in: "the quiet little notes I genuinely wish someone sent me before I wasted half the year..."`,
        `2.2s – 4.5s: Smooth tilt down to your phone showing Part 01 (${ch1}) and the exact copy-paste scripts ready to use today.`,
        `4.5s – 6.0s: Chill closing frame back to the sunset sky: "kept it at ${price} (instead of ${anchor}) so anyone starting out can grab it. comment '${trigger}'"`,
      ],
      lightingAndAudioTip:
        "Pair with a soft viral acoustic/lo-fi reel sound at 12% volume. Reply to the first 8–10 comments casually yourself on top of Auto-DM—that early conversation boosts reach fast.",
    },
  ];

  const overlaySets = [
    [
      {
        triggerType: "1. Relatable Real-Talk Hook",
        overlayText: `honestly mad nobody told me this earlier 😭 wasted months doing "${shortTitle}" the hard way when the actual shortcut takes 20 mins on your phone`,
        whyItConverts:
          "Sounds 100% like a real friend venting—zero ad vibe, stops the scroll immediately.",
      },
      {
        triggerType: "2. No-Gatekeeping Curiosity Hook",
        overlayText: `people literally charge ₹4,999+ in webinars to gatekeep "${ch1}" and these exact links. put all 5 parts + scripts in a ${price} pdf — comment "${trigger}"`,
        whyItConverts:
          "Calls out overpriced gurus and names the real secret inside so curious viewers comment instantly.",
      },
      {
        triggerType: "3. Chill Snack-Price Drop",
        overlayText: `we spend ₹80 on random iced coffee or momos without even thinking, so I kept this whole guide at ${price} (instead of ${anchor}) so you don't overthink it`,
        whyItConverts:
          "Casual, warm price framing with zero pushy sales language.",
      },
      {
        triggerType: "4. Bestie-Send & Zero-Doubt Hook",
        overlayText: `zero boring gyaan, zero random motivation quotes — literally just the real links, button clicks & copy-paste scripts. save this or comment "${trigger}" 🤍`,
        whyItConverts:
          "Kills 'is this just generic AI fluff?' doubt while boosting both Saves and Comments.",
      },
    ],
    [
      {
        triggerType: "1. Relatable 1 AM Need Hook",
        overlayText: `if one more reel tells me "just stay consistent" without showing the actual websites and steps... put everything I actually use for "${shortTitle}" in one ${price} pdf`,
        whyItConverts:
          "Validates real frustration with fake-motivation reels—builds instant trust.",
      },
      {
        triggerType: "2. Specific Spoiler Tease",
        overlayText: `part 01 (${ch1}) alone saved me weeks, and part 03 literally has the word-for-word scripts I copy-paste. drop "${trigger}" if you want the link in your DM`,
        whyItConverts:
          "Concrete preview proves real value is inside the PDF, driving fast DM requests.",
      },
      {
        triggerType: "3. Friend-to-Friend Micro-Price",
        overlayText: `kept it at ${price} (literally less than one cold coffee, usually ${anchor}) for this batch so college students & beginners can actually use it tonight`,
        whyItConverts:
          "Feels generous and approachable—zero resistance to grabbing the PDF.",
      },
      {
        triggerType: "4. Best-Friend Share Trigger",
        overlayText: `send this to the 1 friend you always make 2am plans with & comment "${trigger}" so my auto-DM drops the exact ${price} pdf link in your inbox in 5 sec`,
        whyItConverts:
          "Directly triggers Instagram's #1 2026 growth signal: DM Sends to close friends.",
      },
    ],
    [
      {
        triggerType: "1. Quiet Confession Hook",
        overlayText: `felt weird keeping these notes sitting in my phone while everyone is still stuck on outdated advice about "${shortTitle}". not gatekeeping anymore 🤍`,
        whyItConverts:
          "Warm, non-salesy tone makes viewers feel like they stumbled onto private notes.",
      },
      {
        triggerType: "2. Real-Shortcut Curiosity Hook",
        overlayText: `everyone keeps doing the crowded obvious thing while a tiny group quietly uses "${ch1}" + "${ch2}". put the exact links in a ${price} guide — comment "${trigger}"`,
        whyItConverts:
          "Creates natural curiosity without any cheesy dramatic buzzwords.",
      },
      {
        triggerType: "3. Zero-Overthinking Price Hook",
        overlayText: `takes 15 mins to read tonight, costs ${price} (cheaper than a snack, real value ${anchor}), and saves you months of guessing on youtube`,
        whyItConverts:
          "Pairs tiny reading time + tiny snack price so saying yes feels effortless.",
      },
      {
        triggerType: "4. Save-For-Tonight Trigger",
        overlayText: `save this if you're busy right now — or drop "${trigger}" below so the direct pdf link stays sitting in your DMs whenever you're ready`,
        whyItConverts:
          "Low-pressure CTA gets way more comments than aggressive 'BUY NOW' lines.",
      },
    ],
  ];

  const captionSets = [
    `honestly felt weird letting these notes just sit in my laptop folder while so many people are still stuck watching 30-minute videos that never show the actual links 🤍\n\nI cleaned up everything I actually use for "${shortTitle}" into one short, super-easy 5-part PDF so you don't waste months guessing:\n• 01: ${ch1}\n• 02: ${ch2}\n• 03: ${ch3}\n• plus all the real websites, exact button clicks, honest numbers & word-for-word copy-paste scripts.\n\nzero boring textbook language, zero random motivation quotes — just simple plain English you can read in 15 mins tonight.\n\nkept it at ${price} (less than a plate of momos / iced coffee, instead of ${anchor}) so anyone can grab it without overthinking.\n\ncomment "${trigger}" below and my Auto-DM will send the link straight to your inbox in 5 seconds (and save this post so you don't lose it!).`,
    `read this twice if you have 200 saved reels and still don't know what actual step 1 is 🫠\n\nmost people talk in circles online just to drag out a 20-minute video. inside this quick 5-part playbook on "${shortTitle}", I skipped all the filler and only kept what actually works right now:\n1. the exact links & hidden filters for ${ch1}\n2. simple step-by-step moves for ${ch2}\n3. ready-to-paste scripts (${ch3}) so you don't stare at a blank screen\n\nliterally takes 15 minutes to read on your phone and saves you months of trial-and-error.\n\nopen today for ${price} (normally ${anchor}) — instant download right on your phone.\n\ndrop "${trigger}" in the comments and check your Message Requests in 5 seconds for the direct link!`,
    `not a flashy ad — just the private notes I wish someone handed me when I first started figuring out "${shortTitle}" ✨\n\ninstead of paying ₹3,000+ for recycled courses, everything is laid out cleanly in one mobile-friendly PDF:\n✓ ${ch1}\n✓ ${ch2}\n✓ ${ch3}\n✓ quick 24-hour checklist so you know what to do first\n\nkept it at ${price} (cheaper than a snack) for now before it goes back up to ${anchor}.\n\ncomment "${trigger}" right now & I'll send the link straight to your DM — and send this reel to the friend you're locking in with this year!`,
  ];

  const slugWords = shortTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        !/^\d+$/.test(w) &&
        ![
          "that",
          "this",
          "with",
          "from",
          "into",
          "your",
          "2026",
          "2027",
          "guide",
          "system",
          "playbook",
          "bible",
          "indian",
          "india",
          "free",
          "best",
          "exact",
        ].includes(w)
    )
    .slice(0, 4);

  const kwLead = slugWords.slice(0, 2).join(" ") || "real shortcuts";
  const cleanTitlePhrase = shortTitle
    .toLowerCase()
    .replace(/^the\s+/i, "")
    .replace(/[^a-z0-9₹\s-]/g, "")
    .split(/\s+/)
    .slice(0, 5)
    .join(" ");
  const nicheTagRoot = slugWords[0] || "genz";

  const tagPool = [
    [
      `#${nicheTagRoot}tips2026`,
      "#gatekeptwebsites",
      "#smartstudentindia",
      "#realhacks2026",
      "#lockin2026",
    ],
    [
      `#${nicheTagRoot}guide`,
      "#underratedwebsites",
      "#indianstudents",
      "#digitalnotes",
      "#nogatekeeping",
    ],
    [
      `#${nicheTagRoot}hacks`,
      "#usefulwebsites",
      "#collegehacksindia",
      "#glowup2026",
      "#actuallyworks",
    ],
  ];

  const seoPool = [
    [
      `${kwLead} step by step india`,
      cleanTitlePhrase || `${kwLead} guide 2026`,
      "useful websites nobody talks about 2026",
      "free tools for indian college students",
      "simple beginner pdf guide india",
      "real shortcuts no scam india",
      "exact websites and scripts cheat sheet",
      "2026 student growth hacks india",
      "copy paste dm templates india",
      "lock in routine 2026 india",
    ],
    [
      `how to start ${kwLead} from scratch`,
      `${kwLead} real links 2026`,
      "gatekept websites for students india",
      "easy step by step notes pdf",
      "zero investment skills india 2026",
      "real free portals for beginners",
      "honest online skills india",
      "instagram trial reels tips 2026",
      "micro pdf guides india",
      "no gatekeeping cheat sheet",
    ],
  ];

  const fullFallback: EbookGenerationResult['reelBlueprint'] = {
    aiVideoPrompts: prompts,
    sixSecondVideoIdea: videoPlans[idx % videoPlans.length],
    psychologicalPriceOverlays: overlaySets[idx % overlaySets.length],
    autoDmCaption: captionSets[idx % captionSets.length],
    seoKeywords: seoPool[idx % seoPool.length],
    hashtags: tagPool[idx % tagPool.length].slice(0, 5),
  };

  if (section === "all") return fullFallback;
  if (section === "prompts") return { aiVideoPrompts: fullFallback.aiVideoPrompts };
  if (section === "videoPlan")
    return { sixSecondVideoIdea: fullFallback.sixSecondVideoIdea };
  if (section === "overlays")
    return { psychologicalPriceOverlays: fullFallback.psychologicalPriceOverlays };
  if (section === "caption")
    return { autoDmCaption: fullFallback.autoDmCaption };
  return {
    seoKeywords: fullFallback.seoKeywords,
    hashtags: fullFallback.hashtags,
  };
}




