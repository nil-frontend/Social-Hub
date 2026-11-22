import React from "react";
import { cn } from "@/lib/utils";

export interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "canvas" | "parchment" | "dark" | "utility";
  hasHover?: boolean;
}

export const AppleCard = React.forwardRef<HTMLDivElement, AppleCardProps>(
  ({ className, variant = "canvas", hasHover = false, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-200 overflow-hidden";

    const variantStyles = {
      canvas: "bg-apple-canvas border border-apple-hairline text-apple-ink",
      parchment: "bg-apple-parchment border border-apple-divider-soft text-apple-ink",
      dark: "bg-apple-tile-1 border border-white/10 text-white",
      utility: "bg-apple-canvas border border-apple-hairline/80 shadow-apple-soft text-apple-ink",
    };

    const hoverStyles = hasHover
      ? "hover:border-apple-ink/20 hover:shadow-apple-product active:scale-[0.99]"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AppleCard.displayName = "AppleCard";
