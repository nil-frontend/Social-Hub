import React from "react";
import { cn } from "@/lib/utils";

export interface AppleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "utility-dark" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const AppleButton = React.forwardRef<HTMLButtonElement, AppleButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-normal transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.96]";

    const sizeStyles = {
      sm: "h-8 px-3.5 text-[13px] rounded-apple-pill gap-1.5",
      md: "h-10 px-5 text-[15px] rounded-apple-pill gap-2",
      lg: "h-12 px-7 text-[17px] rounded-apple-pill gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-apple-blue text-white hover:bg-apple-blue-focus active:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue-focus shadow-sm",
      secondary:
        "bg-apple-canvas text-apple-blue border border-apple-blue/20 hover:border-apple-blue hover:bg-apple-pearl active:bg-apple-canvas",
      "utility-dark":
        "bg-apple-ink text-white hover:bg-[#2c2c2e] rounded-apple-sm text-[14px] h-9 px-4",
      ghost:
        "bg-transparent text-apple-ink hover:bg-black/5 active:bg-black/10 rounded-apple-md",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 rounded-apple-pill",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

AppleButton.displayName = "AppleButton";
