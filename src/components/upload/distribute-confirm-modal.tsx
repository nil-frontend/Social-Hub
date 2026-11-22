"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { YOUTUBE_CATEGORIES } from "@/lib/youtube/categories";
import type { SocialAccount } from "@/types/database";
import type { VideoMetadata } from "@/components/upload/video-dropzone";
import { 
  X, 
  UploadCloud, 
  Tv, 
  Check, 
  Clock, 
  Film, 
  AlertCircle, 
  Tag, 
  Eye, 
  Layers 
} from "lucide-react";

interface DistributeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDispatching: boolean;
  videoFile: File | null;
  videoMetadata: VideoMetadata | null;
  thumbnailFile: File | null;
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  privacyStatus: string;
  isScheduled: boolean;
  scheduledDateTime: string;
  channels: SocialAccount[];
  selectedChannelIds: string[];
  onToggleChannel: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const DistributeConfirmModal: React.FC<DistributeConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDispatching,
  videoFile,
  videoMetadata,
  thumbnailFile,
  title,
  tags,
  categoryId,
  privacyStatus,
  isScheduled,
  scheduledDateTime,
  channels,
  selectedChannelIds,
  onToggleChannel,
  onSelectAll,
  onDeselectAll,
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  if (!isOpen) return null;

  const categoryName =
    YOUTUBE_CATEGORIES.find((c) => c.id === categoryId)?.name || "Default";

  const formattedFileSize = videoFile
    ? (videoFile.size / (1024 * 1024)).toFixed(1) + " MB"
    : "Unknown size";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-apple-canvas rounded-3xl border border-apple-smoke/70 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-apple-hairline flex items-center justify-between bg-apple-parchment/40">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-apple-ink">
              Confirm Video Distribution
            </h3>
            <p className="text-[13px] text-apple-ink-muted">
              Review details and select destination channels before publishing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDispatching}
            className="w-8 h-8 rounded-full bg-apple-smoke/30 hover:bg-apple-smoke/60 flex items-center justify-center text-apple-ink transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm">
          {/* Video Overview Tile */}
          <div className="p-4 rounded-2xl bg-apple-parchment/70 border border-apple-hairline flex gap-4 items-start">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-24 h-14 rounded-xl object-cover border border-apple-smoke/50 shrink-0"
              />
            ) : (
              <div className="w-24 h-14 rounded-xl bg-apple-pearl text-apple-ink-muted flex items-center justify-center shrink-0 border border-apple-hairline">
                <Film className="w-6 h-6 text-apple-ink-muted" />
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-semibold text-apple-ink text-[14px] tracking-tight truncate">
                {title || "Untitled Video"}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-apple-ink-muted">
                <span>{formattedFileSize}</span>
                {videoMetadata && (
                  <>
                    <span>•</span>
                    <span>
                      {videoMetadata.width}x{videoMetadata.height}
                    </span>
                    <span>•</span>
                    <span>{Math.round(videoMetadata.duration)}s</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <AppleBadge size="sm" variant="neutral">
                  <Eye className="w-3 h-3 mr-0.5" />
                  <span className="capitalize">{privacyStatus}</span>
                </AppleBadge>
                {isScheduled && scheduledDateTime ? (
                  <AppleBadge size="sm" variant="warning">
                    <Clock className="w-3 h-3 mr-0.5" />
                    <span>Scheduled</span>
                  </AppleBadge>
                ) : (
                  <AppleBadge size="sm" variant="success">
                    <span>Instant Drop</span>
                  </AppleBadge>
                )}
                <AppleBadge size="sm" variant="neutral">
                  <span>{categoryName}</span>
                </AppleBadge>
              </div>
            </div>
          </div>

          {/* Destination Channel Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-apple-ink flex items-center gap-2">
                <Layers className="w-4 h-4 text-apple-blue" />
                <span>Destination Channels</span>
                <span className="text-xs font-normal text-apple-ink-muted">
                  ({selectedChannelIds.length} of {channels.length} selected)
                </span>
              </label>

              <div className="flex items-center gap-2 text-xs text-apple-blue">
                <button
                  type="button"
                  onClick={onSelectAll}
                  disabled={isDispatching}
                  className="hover:underline cursor-pointer disabled:opacity-50"
                >
                  Select All
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={onDeselectAll}
                  disabled={isDispatching}
                  className="hover:underline cursor-pointer disabled:opacity-50"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {channels.length === 0 ? (
              <div className="p-4 rounded-xl bg-apple-parchment text-center text-xs text-apple-ink-muted">
                No YouTube channels connected yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {channels.map((channel) => {
                  const isSelected = selectedChannelIds.includes(channel.id);
                  return (
                    <div
                      key={channel.id}
                      onClick={() => onToggleChannel(channel.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                        isSelected
                          ? "border-apple-blue bg-apple-blue/5 shadow-apple-soft"
                          : "border-apple-hairline hover:bg-apple-parchment/60 bg-apple-canvas"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-red-50 shrink-0 flex items-center justify-center">
                          {channel.account_avatar_url ? (
                            <Image
                              src={channel.account_avatar_url}
                              alt={channel.account_name}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <Tv className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-apple-ink truncate">
                            {channel.account_name}
                          </p>
                          <p className="text-[11px] text-apple-ink-muted">
                            YouTube Channel
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-apple-blue text-white"
                            : "border border-apple-hairline bg-apple-canvas"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedChannelIds.length === 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Please select at least one channel to distribute this video.</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-apple-hairline flex items-center justify-end gap-3 bg-apple-parchment/30">
          <AppleButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDispatching}
          >
            Cancel
          </AppleButton>

          <AppleButton
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={
              !videoFile ||
              !title ||
              selectedChannelIds.length === 0 ||
              isDispatching
            }
            isLoading={isDispatching}
            className="shadow-apple-soft"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            <span>
              Confirm & Distribute ({selectedChannelIds.length})
            </span>
          </AppleButton>
        </div>
      </div>
    </div>
  );
};
