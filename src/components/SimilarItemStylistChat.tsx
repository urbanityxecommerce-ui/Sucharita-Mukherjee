import React, { useState, useRef } from "react";
import {
  Camera,
  Sparkles,
  Upload,
  X,
  CheckCircle2,
  Wand2,
  Palette,
  MessageSquareHeart,
  ArrowRight,
  ShieldAlert,
  Crown,
  Eye,
  Trash2,
} from "lucide-react";
import {
  ReelGenerationResult,
  UploadedGarmentPreview,
  StylistChatMessage,
  ROYAL_MEESHO_COLOR_CHIPS,
  BODY_GLOWUP_GOALS,
  synthesizeCustomSimilarOutfitReelPack,
} from "../data/playbookData";
import { CopyButton } from "./CopyButton";

interface SimilarItemStylistChatProps {
  currentReel: ReelGenerationResult;
  activeBackgroundDesc: string;
  onApplyUpdatedReel: (
    updatedReel: ReelGenerationResult,
    jumpToStep?: 1 | 2 | 3 | 4
  ) => void;
}

// Helper: compress image & detect closest royal fashion color from center pixels
async function processUploadedImageFile(
  file: File
): Promise<UploadedGarmentPreview> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawDataUrl = String(ev.target?.result || "");
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            dataUrl: rawDataUrl,
            mimeType: file.type || "image/jpeg",
            dominantColorName: "Deep Wine / Maroon",
            dominantHex: "#6B1D2F",
          });
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);

        // Sample center 40% region (where garment usually is in a Meesho screenshot)
        const sx = Math.floor(w * 0.3);
        const sy = Math.floor(h * 0.25);
        const sw = Math.max(1, Math.floor(w * 0.4));
        const sh = Math.max(1, Math.floor(h * 0.45));
        const imgData = ctx.getImageData(sx, sy, sw, sh).data;

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let count = 0;

        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          // Skip pure white background pixels common in e-commerce screenshots
          if (r > 240 && g > 240 && b > 240) continue;
          rSum += r;
          gSum += g;
          bSum += b;
          count++;
        }

        const avgR = count > 0 ? Math.round(rSum / count) : 110;
        const avgG = count > 0 ? Math.round(gSum / count) : 35;
        const avgB = count > 0 ? Math.round(bSum / count) : 55;

        const toHex = (n: number) =>
          Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
        const dominantHex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

        // Match to closest ROYAL_MEESHO_COLOR_CHIPS
        let bestChip = ROYAL_MEESHO_COLOR_CHIPS[0];
        let minDist = Infinity;
        for (const chip of ROYAL_MEESHO_COLOR_CHIPS) {
          const cr = parseInt(chip.hex.slice(1, 3), 16);
          const cg = parseInt(chip.hex.slice(3, 5), 16);
          const cb = parseInt(chip.hex.slice(5, 7), 16);
          const dist =
            Math.pow(avgR - cr, 2) +
            Math.pow(avgG - cg, 2) +
            Math.pow(avgB - cb, 2);
          if (dist < minDist) {
            minDist = dist;
            bestChip = chip;
          }
        }

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.78);
        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          dataUrl: compressedDataUrl,
          mimeType: "image/jpeg",
          dominantColorName: bestChip.name,
          dominantHex,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export const SimilarItemStylistChat: React.FC<SimilarItemStylistChatProps> = ({
  currentReel,
  activeBackgroundDesc,
  onApplyUpdatedReel,
}) => {
  const [uploadedImages, setUploadedImages] = useState<
    UploadedGarmentPreview[]
  >([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([
    "Deep Wine / Maroon",
    "Emerald / Bottle Green",
  ]);
  const [bodyGoal, setBodyGoal] = useState<string>("universal-100x");
  const [userMessage, setUserMessage] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [appliedBanner, setAppliedBanner] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pre-populate with 1 helpful example assistant response so the user sees immediately how powerful it is
  const [chatHistory, setChatHistory] = useState<StylistChatMessage[]>(() => {
    const initialDemo = synthesizeCustomSimilarOutfitReelPack(
      currentReel,
      "Mujhe exact same kurti nahi mili, Deep Wine aur Emerald Green mein V-neck short kurti aur Black wide-leg jeans mili hai—chubby/curvy ya kisi bhi ladki ko 100x royal aur slim dikhane wala best combination banao!",
      ["Deep Wine / Maroon", "Emerald / Bottle Green"],
      "chubby-curvy-slim",
      [],
      activeBackgroundDesc
    );
    return [
      {
        id: "initial-stylist-welcome",
        role: "assistant",
        createdAt: new Date().toISOString(),
        userText:
          "Ready! Agar Meesho par exact kapda ya color na mile aur similar options milein, toh unke Screenshots upload karo ya Colors select karo—main unme se 100x Royal & Slimming combination chunn kar aapka poora 4-Step Reel Pack (Prompts + Hooks + Keywords) turant naye kapdon ke hisab se rebuild kar dunga!",
        stylistVerdictHinglish: initialDemo.stylistVerdictHinglish,
        updatedReelPack: initialDemo.updatedReelPack,
        providerUsed: "100x Royal Glow-Up AI Stylist (Anti-Joker Mode Active)",
      },
    ];
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: UploadedGarmentPreview[] = [];
    for (let i = 0; i < Math.min(files.length, 6 - uploadedImages.length); i++) {
      try {
        const preview = await processUploadedImageFile(files[i]);
        newPreviews.push(preview);
      } catch {
        // Ignore broken image file
      }
    }

    if (newPreviews.length > 0) {
      setUploadedImages((prev) => [...prev, ...newPreviews].slice(0, 6));
      // Also auto-select detected colors so the user doesn't even have to click
      const detectedNames = newPreviews.map((p) => p.dominantColorName);
      setSelectedColors((prev) =>
        Array.from(new Set([...detectedNames, ...prev])).slice(0, 4)
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleColorChip = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleRunStylistRebuild = async (customQuickPrompt?: string) => {
    const effectiveMsg =
      customQuickPrompt !== undefined ? customQuickPrompt : userMessage;

    setIsAnalyzing(true);
    setAppliedBanner(null);

    const userMsgEntry: StylistChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      createdAt: new Date().toISOString(),
      userText:
        effectiveMsg ||
        `Meesho par mujhe ye colors/screenshots mile hain (${
          selectedColors.join(", ") || "Uploaded Photos"
        }). Inme se sabse best 100x Royal & Slimming outfit choose karke mera poora Reel Pack rebuild kar do!`,
      selectedColors: [...selectedColors],
      bodyGoal,
      uploadedImages: [...uploadedImages],
    };

    // Instant client-side synthesis first so it's 100% fail-proof
    const localFallback = synthesizeCustomSimilarOutfitReelPack(
      currentReel,
      userMsgEntry.userText || "",
      selectedColors,
      bodyGoal,
      uploadedImages,
      activeBackgroundDesc
    );

    try {
      const response = await fetch("/api/stylist-chat-rebuild", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsgEntry.userText,
          selectedColors,
          bodyGoal,
          uploadedImages,
          currentReel,
          backgroundDesc: activeBackgroundDesc,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const finalVerdict =
          data?.stylistVerdictHinglish || localFallback.stylistVerdictHinglish;
        const finalReel: ReelGenerationResult =
          data?.updatedReelPack || localFallback.updatedReelPack;

        const assistantEntry: StylistChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          createdAt: new Date().toISOString(),
          stylistVerdictHinglish: finalVerdict,
          updatedReelPack: finalReel,
          providerUsed:
            data?.providerUsed || "100x Royal Glow-Up Vision Stylist AI",
        };

        setChatHistory((prev) => [assistantEntry, userMsgEntry, ...prev]);
        onApplyUpdatedReel(finalReel);
        setAppliedBanner(
          `✅ 100% Updated! "${finalReel.concept.title}" ab aapke Step 1, Step 2, Step 3 (AI Prompts) aur Step 4 (Hooks & Caption) mein lag chuka hai!`
        );
      } else {
        throw new Error("Fallback to local stylist");
      }
    } catch {
      const assistantEntry: StylistChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        createdAt: new Date().toISOString(),
        stylistVerdictHinglish: localFallback.stylistVerdictHinglish,
        updatedReelPack: localFallback.updatedReelPack,
        providerUsed: "100x Royal Glow-Up AI Stylist",
      };
      setChatHistory((prev) => [assistantEntry, userMsgEntry, ...prev]);
      onApplyUpdatedReel(localFallback.updatedReelPack);
      setAppliedBanner(
        `✅ 100% Updated! "${localFallback.updatedReelPack.concept.title}" ab aapke charon Steps mein apply ho gaya hai!`
      );
    } finally {
      setIsAnalyzing(false);
      if (!customQuickPrompt) {
        setUserMessage("");
      }
    }
  };

  const quickScenarios = [
    {
      label: "👗 Exact Kurti Nahi Mili (Similar Color/Print Mila Hai)",
      prompt:
        "Mujhe Meesho par exact wahi kurti nahi mili, par jo colors/screenshots maine select kiye hain unme V-neck aur square-neck short kurti mili hai. Inme se best choose karke 100x royal combination bana do!",
    },
    {
      label: "🔥 Chubby / Moti Body & Tummy Hide (100x Slimming Look)",
      prompt:
        "Meri body thodi heavy/chubby hai aur lower tummy hide karna hai. Inme se aisi styling aur color combination chuno jisse koi bhi moti ya ordinary ladki ekdum slim hourglass aur 100x gorgeous lage!",
    },
    {
      label: "💎 Dusky / Dark Skin → 100x Radiant Royal Glow",
      prompt:
        "Dusky/wheatish Indian skin tone par bina heavy makeup ke 100x chamak aur royal model look laane ke liye in colors mein se best combination banao (joker ya kiddy look bilkul na ho)!",
    },
    {
      label: "📏 5'0\" Short Height → 5'5\" Tall Model Proportion",
      prompt:
        "Height 5'0\" hai—in similar kapdon aur colors ko use karke 30:70 proportion wala 4-piece outfit banao jisse height 5'5\" lambi lage aur poora Reel Pack update kar do!",
    },
  ];

  return (
    <div className="p-5 md:p-7 rounded-2xl bg-gradient-to-br from-[#241038] via-[#160C28] to-[#1E0E2F] border-2 border-pink-400/60 shadow-2xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-pink-500/25 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-pink-200">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>
              NEW · 100x ROYAL GLOW-UP & SIMILAR-ITEM AI STYLIST CHAT (ANTI-JOKER / ANTI-KIDDY MODE)
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-editorial">
            Meesho Par Similar Kapda Ya Alag Color Mila? Screenshots & Colors Bhejo → AI Best Chunn Kar Naya Reel Pack Banayega!
          </h3>
          <p className="text-xs md:text-sm text-pink-100/85 leading-relaxed">
            Agar AI ka bataya exact piece Meesho par na mile aur <strong>milta-julta (similar) kapda ya alag colors</strong> milein, toh bilkul pareshan mat ho! Niche apne <strong>Meesho Screenshots upload karo</strong> ya <strong>jo Colors mile wo tick karo</strong>. AI unme se sabse royal combination chunega (jo chubby, short ya kisi bhi ladki ka look 100x beautiful & slim bana de—bina joker ya kiddy lage) aur aapka <strong>Step 1, 2, 3 (AI Prompts) & Step 4 turant naye kapde ke hisab se बदल dega!</strong>
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-start lg:items-end gap-1.5">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-400/50 text-xs font-bold text-emerald-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>60-30-10 Royal Color Harmony Active</span>
          </span>
          <span className="text-[11px] text-pink-200/75">
            Hinglish Styling Advice + 100% Pure English Prompts & Hooks
          </span>
        </div>
      </div>

      {appliedBanner && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>{appliedBanner}</span>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                chatHistory[0]?.updatedReelPack &&
                onApplyUpdatedReel(chatHistory[0].updatedReelPack, 3)
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              Go to Updated AI Prompts (Step 3) →
            </button>
            <button
              type="button"
              onClick={() =>
                chatHistory[0]?.updatedReelPack &&
                onApplyUpdatedReel(chatHistory[0].updatedReelPack, 4)
              }
              className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold cursor-pointer"
            >
              Go to Hooks & Caption (Step 4) →
            </button>
          </div>
        </div>
      )}

      {/* INPUT BUILDER GRID: 1. UPLOAD SCREENSHOTS | 2. PICK COLORS FOUND | 3. PICK 100x BODY GOAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT 5 COLS: UPLOAD MEESHO SCREENSHOTS */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#11081F] border border-pink-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-pink-300 uppercase flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-pink-400" />
              <span>
                1. Upload Meesho Screenshots (Jo-Jo Kapde Mile Unki Photo)
              </span>
            </label>
            {uploadedImages.length > 0 && (
              <button
                type="button"
                onClick={() => setUploadedImages([])}
                className="text-[11px] text-rose-300 hover:text-rose-200 inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-xl border-2 border-dashed border-pink-400/45 hover:border-pink-400 bg-[#1B0E30]/70 hover:bg-[#241340] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Upload className="w-6 h-6 text-pink-400" />
            <div className="text-xs md:text-sm font-bold text-white">
              + Click to Upload 1 to 6 Meesho Screenshots / Photos
            </div>
            <div className="text-[11px] text-pink-200/75">
              AI khud aapki photos ka color aur design dekh kar best piece select karega!
            </div>
          </button>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {uploadedImages.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative rounded-xl overflow-hidden bg-[#090511] border border-pink-500/35 p-1.5 space-y-1"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages((prev) =>
                        prev.filter((item) => item.id !== img.id)
                      )
                    }
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-rose-600 cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="flex items-center gap-1.5 px-1">
                    <span
                      className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                      style={{ backgroundColor: img.dominantHex }}
                    />
                    <span className="text-[10px] font-bold text-pink-100 truncate">
                      Option #{idx + 1}: {img.dominantColorName.split("/")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT 7 COLS: PICK COLORS FOUND + BODY TRANSFORMATION GOAL */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-[#11081F] border border-pink-500/30 space-y-4">
          {/* COLOR CHIPS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-pink-300 uppercase flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-pink-400" />
              <span>
                2. Jo-Jo Colors Meesho Par Mile Unhe Select Karo (AI Unme Se Best 60-30-10 Royal Match Banayega):
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ROYAL_MEESHO_COLOR_CHIPS.map((chip) => {
                const active = selectedColors.includes(chip.name);
                return (
                  <button
                    key={chip.name}
                    type="button"
                    onClick={() => toggleColorChip(chip.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all inline-flex items-center gap-2 cursor-pointer ${
                      active
                        ? "bg-pink-600 border-white text-white shadow-md scale-[1.02]"
                        : "bg-[#1A0E2E] hover:bg-[#261542] border-pink-500/25 text-pink-100/85"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                      style={{ backgroundColor: chip.hex }}
                    />
                    <span>{chip.name}</span>
                    {active && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BODY & BEAUTY TRANSFORMATION GOAL */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                3. 100x Look-Transformation Target (Kaisa Look Chahiye?):
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BODY_GLOWUP_GOALS.map((goal) => {
                const active = bodyGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setBodyGoal(goal.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-pink-600/35 to-purple-700/35 border-amber-300 text-white"
                        : "bg-[#180D2B] hover:bg-[#22133B] border-pink-500/20 text-pink-200/85"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">
                      {goal.label}
                    </div>
                    <div className="text-[11px] text-pink-200/80 mt-0.5">
                      {goal.hinglishTag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK 1-CLICK SCENARIO BUTTONS */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-pink-300">
          ⚡ 1-Click Fast Stylist Scenarios (Ya Niche Box Mein Apni Baat Likho):
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              disabled={isAnalyzing}
              onClick={() => {
                setUserMessage(sc.prompt);
                handleRunStylistRebuild(sc.prompt);
              }}
              className="p-2.5 rounded-xl bg-[#140A24] hover:bg-pink-600/25 border border-pink-500/30 text-left text-xs font-semibold text-pink-100 transition-colors cursor-pointer flex items-center justify-between gap-2"
            >
              <span className="truncate">{sc.label}</span>
              <span className="text-pink-400 font-bold shrink-0">
                Ask AI →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunStylistRebuild();
        }}
        className="flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Yahan Hinglish ya English mein likho: e.g. 'Wine kurti nahi mili, Bottle Green V-neck kurti aur Black ya Beige pant mili hai—inme se 100x royal slimming combo bana do!'"
          className="flex-1 px-4 py-3.5 rounded-xl bg-[#090511] border border-pink-400/45 text-white placeholder:text-pink-200/45 text-sm md:text-base focus:outline-none focus:border-pink-400"
        />
        <button
          type="submit"
          disabled={isAnalyzing}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-60 text-white font-bold text-sm md:text-base inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Wand2 className={`w-5 h-5 ${isAnalyzing ? "animate-spin" : ""}`} />
          <span>
            {isAnalyzing
              ? "AI Analyzing Photos & Styling 100x Look..."
              : "✨ Create 100x Royal Outfit & Rebuild Reel Pack"}
          </span>
        </button>
      </form>

      {/* STYLIST CHAT RESPONSE STREAM */}
      <div className="space-y-4 pt-2">
        {chatHistory.slice(0, 4).map((msg) => {
          if (msg.role === "user") {
            return (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-[#1A102E] border border-pink-500/30 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-pink-300 font-bold">
                  <span>👩‍🎨 Aapka Meesho Find / Sawaal:</span>
                  {msg.selectedColors && msg.selectedColors.length > 0 && (
                    <span>Colors: {msg.selectedColors.join(", ")}</span>
                  )}
                </div>
                <p className="text-sm text-white">{msg.userText}</p>
                {msg.uploadedImages && msg.uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.uploadedImages.map((im, idx) => (
                      <div
                        key={im.id}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#0D0718] border border-pink-500/25"
                      >
                        <img
                          src={im.dataUrl}
                          alt={im.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="text-[11px] font-semibold text-pink-200">
                          Photo #{idx + 1} ({im.dominantColorName.split("/")[0]})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const verdict = msg.stylistVerdictHinglish;
          const pack = msg.updatedReelPack;

          return (
            <div
              key={msg.id}
              className="p-5 rounded-2xl bg-[#11091F] border-2 border-emerald-400/45 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-pink-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300 uppercase">
                      {msg.providerUsed || "100x Royal Glow-Up AI Stylist"}
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-white">
                      {pack?.concept.title ||
                        "100x Royal & Slimming Custom Outfit Verdict"}
                    </h4>
                  </div>
                </div>

                {pack && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyUpdatedReel(pack, 1);
                        setAppliedBanner(
                          `✅ Applied "${pack.concept.title}" to all 4 Steps!`
                        );
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Use This Outfit in All 4 Steps</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyUpdatedReel(pack, 3);
                      }}
                      className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump to Step 3 (AI Prompts)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {verdict && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-[#1B0F30] border border-emerald-400/35 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 uppercase">
                      ✅ 1. Aapke Options Mein Se Best Choice (Hinglish)
                    </div>
                    <p className="text-xs md:text-sm text-white leading-relaxed">
                      {verdict.bestChoiceFromUploads}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1B0F30] border border-rose-400/35 space-y-1">
                    <div className="text-xs font-bold text-rose-300 uppercase flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        2. Joker / Kiddy Look Se Bachne Ka Rule (Hinglish)
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-white leading-relaxed">
                      {verdict.whatToAvoidAndWhy}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1B0F30] border border-amber-400/35 space-y-1">
                    <div className="text-xs font-bold text-amber-300 uppercase">
                      💎 3. Chubby / Short / Dusky → 100x Beautiful & Slimming Science (Hinglish)
                    </div>
                    <p className="text-xs md:text-sm text-white leading-relaxed">
                      {verdict.hundredXGlowUpScience}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1B0F30] border border-pink-400/35 space-y-1">
                    <div className="text-xs font-bold text-pink-300 uppercase">
                      ✨ 4. Exact Pehenne & Style Karne Ka Tarika (Hinglish)
                    </div>
                    <p className="text-xs md:text-sm text-white leading-relaxed">
                      {verdict.stepByStepDrapingTrick}
                    </p>
                  </div>
                </div>
              )}

              {/* SHOW THE 4 REBUILT MEESHO PIECES + INSTANT ENGLISH LOOK-PREVIEW PROMPT */}
              {pack && (
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-bold text-pink-300 uppercase">
                    🛍️ Aapke Naye Similar Finds Ke Hisab Se Updated 4-Piece Combination (Pure English Meesho Keywords):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {pack.searchTerms.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0B0614] border border-pink-500/25 flex flex-col justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-pink-400 uppercase">
                            {st.itemLabel}
                          </div>
                          <div className="text-xs font-bold text-white">
                            {st.exactKeyword}
                          </div>
                          <div className="text-[11px] text-pink-200/80">
                            {st.howToCombineAndStyle}
                          </div>
                        </div>
                        <CopyButton
                          text={st.exactKeyword}
                          label="Copy Meesho Name"
                        />
                      </div>
                    ))}
                  </div>

                  {/* INSTANT COPYABLE AI OUTFIT PREVIEW PROMPT FOR THIS NEW SIMILAR COMBO */}
                  <div className="p-3.5 rounded-xl bg-[#090512] border border-emerald-400/40 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>
                          Is Naye Combination Ka Exact Look Dekhne Ke Liye English AI Prompt (Copy & Paste in ChatGPT/Gemini):
                        </span>
                      </div>
                      <CopyButton
                        text={pack.prompts.exactOutfitLookPreviewPrompt}
                        label="Copy New Look-Preview Prompt"
                        variant="primary"
                      />
                    </div>
                    <pre className="p-2.5 rounded-lg bg-black/60 text-[11px] text-pink-100 font-mono whitespace-pre-wrap max-h-28 overflow-y-auto">
                      {pack.prompts.exactOutfitLookPreviewPrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
