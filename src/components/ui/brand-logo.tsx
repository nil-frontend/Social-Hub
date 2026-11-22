import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: "glass" | "solid" | "monochrome";
}

const sizeMap = {
  xs: { icon: 20, font: "text-sm", gap: "gap-2" },
  sm: { icon: 28, font: "text-base", gap: "gap-2.5" },
  md: { icon: 36, font: "text-lg", gap: "gap-3" },
  lg: { icon: 48, font: "text-2xl", gap: "gap-3.5" },
  xl: { icon: 64, font: "text-3xl", gap: "gap-4" },
};

/**
 * World-class geometric emblem for Social-Hub:
 * Represents a single creator studio signal radiating cleanly across multiple synchronized broadcast destinations.
 */
export const BrandIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
    >
      <defs>
        {/* Subtle Dark Titanium / Obsidian Canvas */}
        <linearGradient id="sh-bg" x1="60" y1="0" x2="60" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1E22" />
          <stop offset="100%" stopColor="#0B0B0D" />
        </linearGradient>

        {/* Primary Stream Gradient (Action Blue to Electric Azure) */}
        <linearGradient id="sh-blue-stream" x1="60" y1="60" x2="60" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#2997FF" />
        </linearGradient>

        {/* Left Broadcast Gradient */}
        <linearGradient id="sh-left-stream" x1="60" y1="60" x2="28" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </linearGradient>

        {/* Right Broadcast Gradient */}
        <linearGradient id="sh-right-stream" x1="60" y1="60" x2="92" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#00C7BE" />
        </linearGradient>

        {/* Center Core Gradient */}
        <linearGradient id="sh-core" x1="50" y1="50" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D2E9FF" />
        </linearGradient>

        {/* Soft Ambient Core Glow */}
        <radialGradient id="sh-glow" cx="60" cy="60" r="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0071E3" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#0071E3" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0071E3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Apple-Spec Squircle Container */}
      <rect
        x="2"
        y="2"
        width="116"
        height="116"
        rx="28"
        fill="url(#sh-bg)"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="1.5"
      />

      {/* Internal Radial Glow */}
      <circle cx="60" cy="60" r="42" fill="url(#sh-glow)" />

      {/* Minimalist Sub-surface Grid / Constellation Orbit */}
      <circle
        cx="60"
        cy="60"
        r="36"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Vector Transmission Conduits */}
      <line
        x1="60"
        y1="57"
        x2="60"
        y2="28"
        stroke="url(#sh-blue-stream)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="57"
        y1="62"
        x2="31"
        y2="78"
        stroke="url(#sh-left-stream)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="63"
        y1="62"
        x2="89"
        y2="78"
        stroke="url(#sh-right-stream)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Destination Satellite Nodes */}
      {/* Top Node (Master Broadcast Stream) */}
      <circle cx="60" cy="27" r="8" fill="#2997FF" />
      <circle cx="60" cy="27" r="4.5" fill="#FFFFFF" />

      {/* Bottom-Left Node (Secondary Distribution Channel) */}
      <circle cx="30" cy="79" r="7.5" fill="#5E5CE6" />
      <circle cx="30" cy="79" r="4" fill="#FFFFFF" />

      {/* Bottom-Right Node (Tertiary Distribution Channel) */}
      <circle cx="90" cy="79" r="7.5" fill="#00C7BE" />
      <circle cx="90" cy="79" r="4" fill="#FFFFFF" />

      {/* Center Transmitter Core (Source Studio Signal) */}
      <circle
        cx="60"
        cy="60"
        r="14"
        fill="url(#sh-core)"
        stroke="#0066CC"
        strokeWidth="2.5"
      />
      {/* Precision Center Play / Pulse Glyph */}
      <polygon
        points="57,53 66,60 57,67"
        fill="#0066CC"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showWordmark = true,
  wordmarkClassName,
  className,
  ...props
}) => {
  const config = sizeMap[size];

  return (
    <div
      className={cn("inline-flex items-center select-none", config.gap, className)}
      {...props}
    >
      <BrandIcon size={config.icon} />
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight text-apple-ink transition-colors",
            config.font,
            wordmarkClassName
          )}
        >
          Social-Hub
        </span>
      )}
    </div>
  );
};
