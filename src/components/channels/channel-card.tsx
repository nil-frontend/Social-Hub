"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleBadge } from "@/components/ui/apple/badge";
import { AppleButton } from "@/components/ui/apple/button";
import { disconnectChannel, toggleChannelActive } from "@/app/actions/channels";
import type { SocialAccount } from "@/types/database";
import { Tv, Users, Trash2, Power, ExternalLink } from "lucide-react";

interface ChannelCardProps {
  channel: SocialAccount;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const [isPending, startTransition] = useTransition();

  const subscriberCount = channel.platform_metadata?.subscriber_count
    ? parseInt(channel.platform_metadata.subscriber_count as string, 10).toLocaleString()
    : "0";

  const customUrl = channel.platform_metadata?.custom_url as string | undefined;

  const handleDisconnect = () => {
    if (confirm(`Are you sure you want to disconnect "${channel.account_name}"?`)) {
      startTransition(async () => {
        await disconnectChannel(channel.id);
      });
    }
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleChannelActive(channel.id, !channel.is_active);
    });
  };

  return (
    <AppleCard
      variant="canvas"
      className={`p-6 transition-all duration-200 ${
        !channel.is_active ? "opacity-60 bg-apple-parchment/60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-start gap-4 min-w-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-red-50 border border-apple-hairline shrink-0 flex items-center justify-center">
            {channel.account_avatar_url ? (
              <Image
                src={channel.account_avatar_url}
                alt={channel.account_name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <Tv className="w-6 h-6 text-red-600" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[17px] font-semibold text-apple-ink truncate">
                {channel.account_name}
              </h3>
              <AppleBadge variant="youtube" size="sm">
                YouTube
              </AppleBadge>
            </div>

            {customUrl && (
              <a
                href={`https://youtube.com/${customUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-apple-ink-muted hover:text-apple-blue flex items-center gap-1 mt-0.5"
              >
                <span>{customUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <div className="flex items-center gap-4 text-xs text-apple-ink-muted mt-3">
              <span className="flex items-center gap-1.5 font-medium text-apple-ink">
                <Users className="w-3.5 h-3.5 text-apple-ink-muted" />
                <span>{subscriberCount} subscribers</span>
              </span>
              <span>&bull;</span>
              <span>
                Connected {new Date(channel.connected_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`p-2 rounded-apple-pill border transition-all ${
              channel.is_active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-apple-hairline bg-apple-pearl text-apple-ink-muted hover:text-apple-ink"
            }`}
            title={channel.is_active ? "Channel is Active (Click to Pause)" : "Channel is Paused (Click to Activate)"}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDisconnect}
            disabled={isPending}
            className="p-2 rounded-apple-pill border border-apple-hairline hover:border-rose-200 hover:bg-rose-50 text-apple-ink-muted hover:text-rose-600 transition-all"
            title="Disconnect Channel"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AppleCard>
  );
};
