"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatBytes } from "@/lib/utils";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import type { ChannelUploadProgress } from "@/lib/youtube/dispatcher";
import { 
  Tv, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface UploadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  progressMap: Record<string, ChannelUploadProgress>;
}

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  progressMap,
}) => {
  if (!isOpen) return null;

  const channelList = Object.values(progressMap);
  const isAllFinished = channelList.every(
    (c) => c.status === "published" || c.status === "failed"
  );
  const successCount = channelList.filter((c) => c.status === "published").length;
  const failureCount = channelList.filter((c) => c.status === "failed").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <AppleCard
        variant="canvas"
        className="w-full max-w-xl p-8 shadow-apple-product space-y-6 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <AppleBadge variant={isAllFinished ? "success" : "youtube"}>
              {isAllFinished ? "Publish Complete" : "Streaming to YouTube"}
            </AppleBadge>
            <span className="text-xs text-apple-ink-muted">
              {successCount}/{channelList.length} Finished
            </span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-apple-ink truncate pt-1">
            {videoTitle}
          </h3>
          <p className="text-xs text-apple-ink-muted">
            Direct browser-to-YouTube streaming via authenticated resumable sessions.
          </p>
        </div>

        {/* Channel Progress Rows List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {channelList.map((channel) => {
            const isUploading = channel.status === "uploading";
            const isSuccess = channel.status === "published";
            const isFailed = channel.status === "failed";
            const isThumbnail = channel.status === "thumbnail";
            const isInitiating = channel.status === "initiating";

            return (
              <div
                key={channel.channelId}
                className="p-4 rounded-xl border border-apple-hairline bg-apple-parchment/40 space-y-2.5"
              >
                {/* Channel Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-red-50 shrink-0 flex items-center justify-center">
                      {channel.avatarUrl ? (
                        <Image
                          src={channel.avatarUrl}
                          alt={channel.channelName}
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
                        {channel.channelName}
                      </p>
                      <p className="text-[11px] text-apple-ink-muted">
                        {isInitiating && "Requesting upload session..."}
                        {isUploading && `Uploading • ${formatBytes(channel.speedBytesPerSec)}/s`}
                        {isThumbnail && "Attaching custom thumbnail..."}
                        {isSuccess && "Published successfully"}
                        {isFailed && `Failed: ${channel.error}`}
                        {channel.status === "pending" && "Waiting..."}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator & Watch Link */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isUploading && (
                      <span className="text-xs font-semibold text-apple-blue">
                        {channel.percentage}%
                      </span>
                    )}

                    {isSuccess && channel.videoUrl && (
                      <a
                        href={channel.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 px-2.5 py-1 rounded-apple-pill font-medium transition-colors"
                      >
                        <span>Watch</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {isFailed && (
                      <span className="text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Error</span>
                      </span>
                    )}

                    {(isInitiating || isThumbnail) && (
                      <Loader2 className="w-4 h-4 text-apple-blue animate-spin" />
                    )}
                  </div>
                </div>

                {/* Animated Action Blue Progress Bar */}
                <div className="w-full bg-apple-divider-soft h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isFailed
                        ? "bg-rose-500"
                        : isSuccess
                        ? "bg-emerald-500"
                        : "bg-apple-blue"
                    }`}
                    style={{
                      width: isSuccess ? "100%" : `${channel.percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-apple-divider-soft flex items-center justify-between gap-4">
          <Link
            href="/history"
            onClick={onClose}
            className="text-xs text-apple-ink-muted hover:text-apple-blue transition-colors flex items-center gap-1"
          >
            <span>View all in Publishing History</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <AppleButton
            size="md"
            onClick={onClose}
            disabled={!isAllFinished}
          >
            <span>{isAllFinished ? "Done" : "Uploading in progress..."}</span>
          </AppleButton>
        </div>
      </AppleCard>
    </div>
  );
};
