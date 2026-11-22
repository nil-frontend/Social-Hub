"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { formatBytes } from "@/lib/utils";
import { AppleButton } from "@/components/ui/apple/button";
import { Image as ImageIcon, X, Upload } from "lucide-react";

interface ThumbnailPickerProps {
  onThumbnailSelect: (file: File) => void;
  onThumbnailRemove: () => void;
  selectedThumbnail: File | null;
  disabled?: boolean;
}

const MAX_THUMBNAIL_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export const ThumbnailPicker: React.FC<ThumbnailPickerProps> = ({
  onThumbnailSelect,
  onThumbnailRemove,
  selectedThumbnail,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      setError(`Thumbnail size (${formatBytes(file.size)}) exceeds the 2MB limit.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a JPEG or PNG image.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onThumbnailSelect(file);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onThumbnailRemove();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {error && (
        <p className="text-xs text-rose-500 mb-2 font-normal">{error}</p>
      )}

      {!selectedThumbnail || !previewUrl ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={`border border-dashed border-apple-hairline rounded-xl p-4 text-center cursor-pointer hover:border-apple-blue/60 hover:bg-apple-pearl/40 transition-all ${
            disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-apple-pearl mx-auto flex items-center justify-center text-apple-ink-muted mb-2">
            <ImageIcon className="w-4 h-4 text-apple-blue" />
          </div>
          <p className="text-[13px] font-medium text-apple-ink">
            Upload custom thumbnail (optional)
          </p>
          <p className="text-[11px] text-apple-ink-muted mt-0.5">
            Recommended: 1280 &times; 720 (16:9), max 2MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-apple-hairline group aspect-video bg-black flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Custom Thumbnail Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <AppleButton
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Change
            </AppleButton>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-2 rounded-apple-pill bg-white/90 text-rose-600 hover:bg-white shadow-sm transition-all"
              title="Remove thumbnail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
