import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { ChannelCard } from "@/components/channels/channel-card";
import { getConnectedChannels } from "@/app/actions/channels";
import { Tv, Plus, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

interface ChannelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChannelsPage({ searchParams }: ChannelsPageProps) {
  const resolvedParams = await searchParams;
  const success = resolvedParams.success as string | undefined;
  const error = resolvedParams.error as string | undefined;

  const channels = await getConnectedChannels();
  const isGoogleConfigured =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID !== "placeholder-google-client-id";

  return (
    <>
      <SubNavFrosted
        title="Connected Channels"
        subtitle="Manage Social Accounts"
        action={
          <a href="/api/auth/youtube/connect">
            <AppleButton size="sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Add YouTube Channel</span>
            </AppleButton>
          </a>
        }
      />

      <DashboardLayout>
        <div className="space-y-6">
          {/* Success Banner */}
          {success === "channel_connected" && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-[14px] text-emerald-800 flex items-center justify-between shadow-apple-soft">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>YouTube channel successfully connected and ready for distribution!</span>
              </div>
              <Link href="/upload">
                <AppleButton size="sm" variant="secondary">
                  Distribute Video
                </AppleButton>
              </Link>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/60 text-[14px] text-rose-800 flex items-center gap-2.5 shadow-apple-soft">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Connection failed: {decodeURIComponent(error)}</span>
            </div>
          )}

          {/* Google Credentials Notice (if not configured yet) */}
          {!isGoogleConfigured && (
            <AppleCard variant="parchment" className="p-5 border-amber-200/60 bg-amber-50/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[15px] font-semibold text-apple-ink">
                      Google OAuth Credentials Required
                    </h4>
                    <p className="text-xs text-apple-ink-muted mt-0.5">
                      To connect your real YouTube channels, add your Google Cloud Client ID and Secret to <code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">.env.local</code>.
                    </p>
                  </div>
                </div>
                <a
                  href="/docs/google-cloud"
                  className="inline-flex items-center gap-1.5 text-xs text-apple-blue font-medium hover:underline shrink-0"
                >
                  <span>Follow Setup Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </AppleCard>
          )}

          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
                Connected YouTube Channels ({channels.length})
              </h2>
              <p className="text-[14px] text-apple-ink-muted">
                Each channel is authenticated with its own OAuth refresh token for parallel distribution.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AppleBadge variant="youtube">YouTube: Active</AppleBadge>
              <AppleBadge variant="neutral">Facebook: V2</AppleBadge>
              <AppleBadge variant="neutral">Instagram: V2</AppleBadge>
            </div>
          </div>

          {/* Channel Grid or Empty State */}
          {channels.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          ) : (
            <AppleCard variant="canvas" className="p-12 text-center flex flex-col items-center shadow-apple-soft">
              <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Tv className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-apple-ink mb-2">
                No YouTube channels connected yet
              </h3>
              <p className="text-[15px] text-apple-ink-muted max-w-md mb-6 leading-relaxed">
                Connect your YouTube channel using Google OAuth. You can link multiple brand channels or multiple Google accounts.
              </p>
              <a href="/api/auth/youtube/connect">
                <AppleButton size="md">
                  <Plus className="w-4 h-4" />
                  <span>Connect YouTube Channel</span>
                </AppleButton>
              </a>

              <div className="mt-8 pt-6 border-t border-apple-divider-soft w-full max-w-sm flex items-center justify-center gap-2 text-xs text-apple-ink-muted">
                <AlertCircle className="w-3.5 h-3.5 text-apple-blue" />
                <span>Supports multiple channels across different Google accounts</span>
              </div>
            </AppleCard>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
