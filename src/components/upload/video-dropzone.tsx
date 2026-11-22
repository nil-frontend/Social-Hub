"use client";

import React, { useRef, useState, useEffect } from "react";
import { formatBytes } from "@/lib/utils";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { Film, UploadCloud, X, Play, Clock, Sparkles } from "lucide-react";

export interface VideoMetadata {
  duration: number; // in seconds
  width: number;
  height: number;
}

interface VideoDropzoneProps {
  onFileSelect: (file: File, metadata: VideoMetadata) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB
const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const ACCEPTED_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const VideoDropzone: React.FC<VideoDropzoneProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generate preview object URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
      setMetadata(null);
    }
  }, [selectedFile]);

  const validateAndProcessFile = (file: File) => {
    setError(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${formatBytes(file.size)}) exceeds the 1GB maximum limit.`);
      return;
    }

    // Validate format
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExtension = ACCEPTED_EXTENSIONS.includes(extension);
    const isValidMime = ACCEPTED_MIME_TYPES.includes(file.type);

    if (!isValidExtension && !isValidMime) {
      setError("Unsupported format. Please select an MP4, MOV, or WebM video.");
      return;
    }

    // Temporarily create URL to read duration and resolution
    const tempUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = tempUrl;

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempUrl);
      const meta: VideoMetadata = {
        duration: Math.round(tempVideo.duration) || 0,
        width: tempVideo.videoWidth || 0,
        height: tempVideo.videoHeight || 0,
      };
      setMetadata(meta);
      onFileSelect(file, meta);
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      // Fallback if metadata fails to load
      const fallbackMeta: VideoMetadata = { duration: 0, width: 0, height: 0 };
      setMetadata(fallbackMeta);
      onFileSelect(file, fallbackMeta);
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700">
          {error}
        </div>
      )}

      {!selectedFile ? (
        /* Empty Dropzone Target */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-apple-blue bg-apple-blue/5 scale-[0.99]"
              : "border-apple-hairline hover:border-apple-blue/60 bg-apple-canvas hover:bg-apple-pearl/40"
          } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
          <div className="w-16 h-16 rounded-2xl bg-apple-pearl mx-auto flex items-center justify-center text-apple-ink-muted mb-4 shadow-apple-soft group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8 text-apple-blue" />
          </div>

          <h3 className="text-[17px] font-semibold text-apple-ink mb-1">
            Choose a video file or drag it here
          </h3>
          <p className="text-[13px] text-apple-ink-muted mb-4 max-w-sm mx-auto">
            Directly streams to YouTube without server bandwidth limits.
          </p>

          <div className="flex items-center justify-center gap-2">
            <AppleBadge variant="neutral" size="sm">MP4</AppleBadge>
            <AppleBadge variant="neutral" size="sm">MOV</AppleBadge>
            <AppleBadge variant="neutral" size="sm">WebM</AppleBadge>
            <span className="text-xs text-apple-ink-muted">&bull;</span>
            <span className="text-xs text-apple-ink-muted">Up to 1GB</span>
          </div>
        </div>
      ) : (
        /* File Selected & Preview Mode */
        <div className="bg-apple-canvas rounded-2xl border border-apple-hairline overflow-hidden shadow-apple-soft">
          {/* Video Player Preview */}
          {previewUrl && (
            <div className="relative bg-black w-full flex items-center justify-center max-h-[380px] overflow-hidden">
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full max-h-[380px] object-contain"
              />
            </div>
          )}

          {/* File Metadata Bar */}
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-apple-divider-soft">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-apple-parchment flex items-center justify-center text-apple-blue shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-medium text-apple-ink truncate">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-apple-ink-muted mt-0.5">
                  <span>{formatBytes(selectedFile.size)}</span>
                  {metadata?.duration ? (
                    <>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(metadata.duration)}
                      </span>
                    </>
                  ) : null}
                  {metadata?.width && metadata?.height ? (
                    <>
                      <span>&bull;</span>
                      <span>{metadata.width} &times; {metadata.height}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <AppleButton
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                Replace
              </AppleButton>
              <button
                type="button"
                onClick={onFileRemove}
                disabled={disabled}
                className="p-2 rounded-apple-pill border border-apple-hairline hover:bg-rose-50 hover:border-rose-200 text-apple-ink-muted hover:text-rose-600 transition-all"
                title="Remove video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
