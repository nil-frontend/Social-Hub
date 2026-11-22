import React from "react";
import { cn } from "@/lib/utils";

export interface AppleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "youtube" | "facebook" | "instagram" | "neutral" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

export const AppleBadge: React.FC<AppleBadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-[12px]",
  };

  const variantStyles = {
    youtube: "bg-red-50 text-red-700 border border-red-200/60 font-medium",
    facebook: "bg-blue-50 text-blue-700 border border-blue-200/60 font-medium",
    instagram: "bg-pink-50 text-pink-700 border border-pink-200/60 font-medium",
    neutral: "bg-apple-parchment text-apple-ink-subtle border border-apple-hairline",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/60 font-medium",
    error: "bg-rose-50 text-rose-700 border border-rose-200/60 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
