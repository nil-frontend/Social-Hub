"use client";

import React, { useState, KeyboardEvent } from "react";
import { AppleBadge } from "@/components/ui/apple/badge";
import { X, Tag as TagIcon } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTotalChars?: number;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  maxTotalChars = 500,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const totalCharsUsed = tags.join(",").length;

  const addTag = (rawTag: string) => {
    const trimmed = rawTag.trim().toLowerCase().replace(/^#/, "");
    if (!trimmed) return;

    // Check duplicate
    if (tags.includes(trimmed)) {
      setInputValue("");
      return;
    }

    // Check total characters constraint (YouTube 500-char limit)
    const newTags = [...tags, trimmed];
    const newTotal = newTags.join(",").length;
    if (newTotal > maxTotalChars) {
      return;
    }

    onChange(newTags);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-apple-ink flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5 text-apple-ink-muted" />
          <span>Tags & Keywords</span>
        </label>
        <span
          className={`text-[11px] ${
            totalCharsUsed > 450 ? "text-amber-600 font-medium" : "text-apple-ink-muted"
          }`}
        >
          {totalCharsUsed}/{maxTotalChars} characters
        </span>
      </div>

      <div
        className={`min-h-[44px] bg-apple-canvas border border-apple-hairline rounded-xl p-2 flex flex-wrap items-center gap-1.5 focus-within:border-apple-blue-focus focus-within:ring-2 focus-within:ring-apple-blue/20 transition-all ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {tags.map((tag, index) => (
          <AppleBadge
            key={`${tag}-${index}`}
            variant="neutral"
            size="sm"
            className="pl-2 pr-1.5 py-1 text-[12px] bg-apple-parchment font-normal flex items-center gap-1"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-apple-ink-muted hover:text-rose-600 rounded-full p-0.5 transition-colors"
              title="Remove tag"
            >
              <X className="w-3 h-3" />
            </button>
          </AppleBadge>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? "Type keyword and press Enter or comma..." : ""}
          disabled={disabled || totalCharsUsed >= maxTotalChars}
          className="flex-1 min-w-[140px] bg-transparent text-[14px] text-apple-ink placeholder:text-apple-ink-muted outline-none px-2 py-1"
        />
      </div>

      <p className="text-[11px] text-apple-ink-muted">
        Press <kbd className="px-1 py-0.5 bg-apple-pearl rounded border border-apple-hairline text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 bg-apple-pearl rounded border border-apple-hairline text-[10px]">,</kbd> to add tag.
      </p>
    </div>
  );
};
