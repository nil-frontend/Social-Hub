"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { AppleInput, AppleTextarea } from "@/components/ui/apple/input";
import { VideoDropzone, type VideoMetadata } from "@/components/upload/video-dropzone";
import { ThumbnailPicker } from "@/components/upload/thumbnail-picker";
import type { SocialAccount } from "@/types/database";
import { Tv, Check, Calendar, Plus, UploadCloud, AlertCircle } from "lucide-react";

interface UploadWizardProps {
  channels: SocialAccount[];
}

export const UploadWizard: React.FC<UploadWizardProps> = ({ channels }) => {
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>(
    channels.filter((c) => c.is_active).map((c) => c.id)
  );

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacyStatus, setPrivacyStatus] = useState<"public" | "unlisted" | "private">("public");
  const [madeForKids, setMadeForKids] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  const toggleChannel = (channelId: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const selectAllChannels = () => {
    setSelectedChannelIds(channels.map((c) => c.id));
  };

  const deselectAllChannels = () => {
    setSelectedChannelIds([]);
  };

  const handleVideoSelect = (file: File, meta: VideoMetadata) => {
    setVideoFile(file);
    setVideoMetadata(meta);
    if (!title) {
      // Auto-populate title from clean filename
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    setVideoMetadata(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
            New Video Distribution
          </h2>
          <p className="text-[14px] text-apple-ink-muted">
            Select channels, configure metadata, and stream directly to YouTube.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Video Upload & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Video File Dropzone */}
          <section className="space-y-2">
            <h3 className="text-[15px] font-semibold text-apple-ink flex items-center justify-between">
              <span>1. Video File</span>
              {videoFile && (
                <span className="text-xs text-emerald-600 font-normal">Video Ready</span>
              )}
            </h3>
            <VideoDropzone
              selectedFile={videoFile}
              onFileSelect={handleVideoSelect}
              onFileRemove={handleVideoRemove}
            />
          </section>

          {/* Step 2: Thumbnail Picker */}
          <section className="space-y-2">
            <h3 className="text-[15px] font-semibold text-apple-ink">
              2. Custom Thumbnail (Optional)
            </h3>
            <ThumbnailPicker
              selectedThumbnail={thumbnailFile}
              onThumbnailSelect={setThumbnailFile}
              onThumbnailRemove={() => setThumbnailFile(null)}
            />
          </section>

          {/* Step 3: Video Details / Metadata Form */}
          <section className="space-y-4">
            <h3 className="text-[15px] font-semibold text-apple-ink">
              3. Video Details
            </h3>

            <AppleCard variant="canvas" className="p-6 space-y-4 shadow-apple-soft">
              {/* Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-apple-ink">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-apple-ink-muted">
                    {title.length}/100
                  </span>
                </div>
                <AppleInput
                  type="text"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive video title"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-apple-ink">
                    Description
                  </label>
                  <span className="text-[11px] text-apple-ink-muted">
                    {description.length}/5000
                  </span>
                </div>
                <AppleTextarea
                  rows={4}
                  maxLength={5000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video, links, and chapters..."
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-apple-ink">
                  Tags (comma separated)
                </label>
                <AppleInput
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. podcast, tutorial, news"
                />
              </div>

              {/* Privacy Status & COPPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-apple-ink">
                    Visibility Mode
                  </label>
                  <select
                    value={privacyStatus}
                    onChange={(e) => setPrivacyStatus(e.target.value as any)}
                    className="w-full bg-apple-canvas text-apple-ink text-[14px] border border-apple-hairline rounded-xl px-3.5 py-2.5 outline-none focus:border-apple-blue-focus focus:ring-2 focus:ring-apple-blue/20 transition-all"
                  >
                    <option value="public">Public (Everyone can watch)</option>
                    <option value="unlisted">Unlisted (Anyone with link)</option>
                    <option value="private">Private (Only you)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-apple-ink">
                    Audience (COPPA)
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="madeForKids"
                      checked={madeForKids}
                      onChange={(e) => setMadeForKids(e.target.checked)}
                      className="w-4 h-4 rounded text-apple-blue focus:ring-apple-blue cursor-pointer"
                    />
                    <label
                      htmlFor="madeForKids"
                      className="text-xs text-apple-ink-muted cursor-pointer"
                    >
                      This video is made for kids
                    </label>
                  </div>
                </div>
              </div>

              {/* Scheduled Release Toggle */}
              <div className="pt-3 border-t border-apple-divider-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-apple-blue" />
                    <span className="text-[13px] font-medium text-apple-ink">
                      Schedule Release
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      isScheduled ? "bg-apple-blue" : "bg-apple-hairline"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isScheduled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {isScheduled && (
                  <div className="mt-3 p-3.5 rounded-xl bg-apple-pearl border border-apple-hairline space-y-2">
                    <label className="text-xs text-apple-ink-muted block">
                      Release Date & Time (Video will remain private until this time)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full bg-apple-canvas text-apple-ink text-[14px] border border-apple-hairline rounded-xl px-3 py-2 outline-none focus:border-apple-blue-focus"
                    />
                  </div>
                )}
              </div>
            </AppleCard>
          </section>
        </div>

        {/* Right Col: Channel Selector & Dispatch Action */}
        <div className="space-y-6">
          <AppleCard variant="canvas" className="p-6 shadow-apple-soft">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[15px] font-semibold text-apple-ink">
                Select Destination Channels
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-apple-blue">
                <button
                  type="button"
                  onClick={selectAllChannels}
                  className="hover:underline"
                >
                  All
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={deselectAllChannels}
                  className="hover:underline"
                >
                  None
                </button>
              </div>
            </div>

            {channels.length > 0 ? (
              <div className="space-y-2">
                {channels.map((channel) => {
                  const isSelected = selectedChannelIds.includes(channel.id);
                  return (
                    <div
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                        isSelected
                          ? "border-apple-blue bg-apple-blue/5 shadow-apple-soft"
                          : "border-apple-hairline hover:bg-apple-parchment/60"
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
            ) : (
              <div className="p-4 rounded-xl bg-apple-parchment text-center text-xs text-apple-ink-muted space-y-3">
                <p>No YouTube channels connected yet.</p>
                <Link href="/channels">
                  <AppleButton size="sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect Channel</span>
                  </AppleButton>
                </Link>
              </div>
            )}
          </AppleCard>

          {/* Upload Dispatch Action */}
          <AppleCard variant="canvas" className="p-6 shadow-apple-soft space-y-4">
            <h4 className="text-[15px] font-semibold text-apple-ink">
              Publishing Summary
            </h4>

            <div className="space-y-2 text-xs text-apple-ink-muted">
              <div className="flex justify-between">
                <span>Selected Channels:</span>
                <span className="font-semibold text-apple-ink">
                  {selectedChannelIds.length} channel{selectedChannelIds.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Video:</span>
                <span className="font-semibold text-apple-ink">
                  {videoFile ? videoFile.name.slice(0, 20) + "..." : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-semibold text-apple-ink">
                  {isScheduled ? "Scheduled Release" : "Instant Upload"}
                </span>
              </div>
            </div>

            <AppleButton
              className="w-full shadow-apple-soft"
              size="lg"
              disabled={!videoFile || !title || selectedChannelIds.length === 0}
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              <span>
                Distribute to {selectedChannelIds.length} Channel{selectedChannelIds.length !== 1 ? "s" : ""}
              </span>
            </AppleButton>
          </AppleCard>
        </div>
      </div>
    </div>
  );
};
