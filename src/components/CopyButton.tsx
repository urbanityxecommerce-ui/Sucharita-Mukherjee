import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "primary" | "subtle";
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = "Copy",
  variant = "default",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-pink-500";

  const variantStyles = {
    default: copied
      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
      : "bg-[#221734] hover:bg-[#2E1F47] text-pink-100 border border-pink-500/20",
    primary: copied
      ? "bg-emerald-600 text-white"
      : "bg-pink-600 hover:bg-pink-500 text-white",
    subtle: copied
      ? "text-emerald-300 bg-emerald-950/50"
      : "text-pink-200/80 hover:text-pink-100 hover:bg-pink-500/10",
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
