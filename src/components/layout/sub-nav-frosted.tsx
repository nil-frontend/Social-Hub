import React from "react";

export interface SubNavFrostedProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SubNavFrosted: React.FC<SubNavFrostedProps> = ({ title, subtitle, action }) => {
  return (
    <div className="sticky top-[44px] z-40 h-[52px] bg-apple-parchment/80 backdrop-blur-md border-b border-apple-hairline px-6 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[19px] font-semibold tracking-[-0.01em] text-apple-ink">
            {title}
          </h1>
          {subtitle && (
            <span className="text-[13px] text-apple-ink-muted hidden sm:inline">
              / {subtitle}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
