import React, { useState } from "react";
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  MoreVertical,
  Sparkles,
  WifiOff,
  ExternalLink,
  Package,
} from "lucide-react";
import { usePWAInstall, useOnlineStatus } from "../hooks/usePWAInstall";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } =
    usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const standaloneUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const pwaBuilderApkUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    standaloneUrl
  )}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(standaloneUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const handlePrimaryClick = async () => {
    if (isInstallable && !isInIframe) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePrimaryClick}
        className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/50 border border-emerald-400/30 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>
          {isInstallable && !isInIframe
            ? "📲 1-Click Install Android App"
            : "📲 Get Android App / .APK"}
        </span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#150D24] border border-pink-500/40 p-5 md:p-6 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Real Android App (WebAPK + .APK) · ₹0 Free
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white mt-1">
                    Why &quot;Install App&quot; Was Hidden &amp; How to Get Your
                    Android App Now
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-pink-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct 1-Click Native Prompt if already outside iframe */}
            {isInstallable && !isInIframe && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border-2 border-emerald-400/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-emerald-100">
                  <strong className="text-emerald-300 text-sm block">
                    ✅ Android Native Install Ready!
                  </strong>
                  Tap the button below to install GlowCash AI directly into your
                  Android App Drawer!
                </div>
                <button
                  type="button"
                  onClick={install}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Android App Now</span>
                </button>
              </div>
            )}

            {/* Explanation of why AI Studio preview wrapper hides Chrome's Install App button */}
            {isInIframe && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-100 leading-relaxed">
                <strong className="text-amber-300 block mb-1">
                  ⚠️ &quot;Install App&quot; Button Kyun Nahi Dikh Raha Tha?
                </strong>
                Kyunki abhi aap <strong>aistudio.google.com</strong> ke preview
                box (iframe) ke andar hain! Android Chrome kisi bhi preview box
                ke andar <strong>&quot;Install App&quot;</strong> button ko
                security ki wajah se chhupa deta hai. Niche{" "}
                <strong>Method 1</strong> ya <strong>Method 2</strong> use
                karein:
              </div>
            )}

            {/* METHOD 1: 1-Tap Launch Outside AI Studio to Trigger Native Android WebAPK Install */}
            <div className="p-4 rounded-xl bg-[#0B0711] border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Method 1 (Best &amp; Fastest): Direct Android App Install (5
                    Seconds)
                  </span>
                </span>
              </div>
              <p className="text-xs text-pink-100/85 leading-relaxed">
                Niche green button par tap karein—ye app AI Studio se bahar
                seedha <strong>Standalone Android Mode</strong> mein khulega.
                Wahan khulte hi upar{" "}
                <strong>&quot;1-Click Install Android App&quot;</strong> button
                (aur Chrome ke{" "}
                <strong className="inline-flex items-center px-1 rounded bg-white/10">
                  <MoreVertical className="w-3 h-3" /> 3-Dots
                </strong>{" "}
                mein <strong>&quot;Install app&quot;</strong>) turant aa jayega!
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={standaloneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[210px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Standalone App to Install</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* METHOD 2: Download Real .APK File for Android via PWABuilder (100% Free) */}
            <div className="p-4 rounded-xl bg-[#0B0711] border border-pink-500/35 space-y-2.5">
              <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-pink-400" />
                <span>
                  Method 2: Download Real Android .APK File (Via Free
                  PWABuilder)
                </span>
              </div>
              <p className="text-xs text-pink-100/80 leading-relaxed">
                Agar aapko apne phone ke <strong>Downloads folder</strong> mein
                asli <code>GlowCash.apk</code> file chahiye: Niche button par
                tap karein $\rightarrow$ Microsoft ke free{" "}
                <strong>PWABuilder</strong> page par{" "}
                <strong>&quot;Package for Stores&quot;</strong> $\rightarrow${" "}
                <strong>&quot;Android&quot;</strong> $\rightarrow${" "}
                <strong>&quot;Download Package (.apk)&quot;</strong> dabayein!
              </p>
              <a
                href={pwaBuilderApkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-md"
              >
                <Package className="w-4 h-4" />
                <span>Generate &amp; Download Free .APK File</span>
              </a>
            </div>

            {isIOS && (
              <div className="p-3.5 rounded-xl bg-[#0B0711] border border-purple-500/30 text-xs text-pink-100/90">
                <strong>For iPhone / iPad:</strong> Open the standalone link in{" "}
                <strong>Safari</strong> $\rightarrow$ tap <strong>Share</strong>{" "}
                $\rightarrow$ tap <strong>Add to Home Screen</strong>.
              </div>
            )}

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AndroidIframeInstallNotice: React.FC = () => {
  const { isInstalled, isInIframe, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isInstalled || dismissed) return null;

  const standaloneUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(standaloneUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950/90 via-[#150D26] to-pink-950/90 border-b border-emerald-500/40 px-4 py-2.5 no-print">
      <div className="max-w-[1160px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-emerald-100">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isInIframe ? (
              <>
                <strong className="text-emerald-300">
                  Want the Real Android App (Not Website)?
                </strong>{" "}
                AI Studio preview hides Chrome&apos;s Install button. Open the
                direct app link in Chrome to unlock{" "}
                <strong>&quot;Install App&quot;</strong>!
              </>
            ) : isInstallable ? (
              <>
                <strong className="text-emerald-300">
                  Android App Ready!
                </strong>{" "}
                Tap <strong>Install Now</strong> to add GlowCash AI to your
                Android App Drawer.
              </>
            ) : (
              <>
                <strong className="text-emerald-300">
                  Android App Mode Ready:
                </strong>{" "}
                Tap Chrome&apos;s <strong>3-dots (⋮)</strong> top-right $\rightarrow$
                select <strong>&quot;Install app&quot;</strong>!
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && !isInIframe ? (
            <button
              type="button"
              onClick={install}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
          ) : (
            <>
              <a
                href={standaloneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Direct App to Install</span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-pink-200/70 hover:text-white cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        Offline Mode Active — Instant Outfit &amp; Ebook Engine + Saved History
        Work 100% Offline!
      </span>
    </div>
  );
};
