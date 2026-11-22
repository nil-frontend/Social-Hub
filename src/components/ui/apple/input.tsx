import React from "react";
import { cn } from "@/lib/utils";

export interface AppleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isPill?: boolean;
  error?: string;
}

export const AppleInput = React.forwardRef<HTMLInputElement, AppleInputProps>(
  ({ className, isPill = false, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full bg-apple-canvas text-apple-ink placeholder:text-apple-ink-muted text-[15px] border border-apple-hairline focus:border-apple-blue-focus focus:ring-2 focus:ring-apple-blue/20 transition-all duration-150 outline-none px-4 py-2.5",
            isPill ? "rounded-apple-pill px-5" : "rounded-xl",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-500 font-normal">{error}</p>}
      </div>
    );
  }
);

AppleInput.displayName = "AppleInput";

export interface AppleTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const AppleTextarea = React.forwardRef<HTMLTextAreaElement, AppleTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-apple-canvas text-apple-ink placeholder:text-apple-ink-muted text-[15px] border border-apple-hairline rounded-xl focus:border-apple-blue-focus focus:ring-2 focus:ring-apple-blue/20 transition-all duration-150 outline-none px-4 py-3 resize-y",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-500 font-normal">{error}</p>}
      </div>
    );
  }
);

AppleTextarea.displayName = "AppleTextarea";
