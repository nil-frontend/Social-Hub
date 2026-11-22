import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { LocalTime } from "@/components/ui/local-time";
import { getConnectedChannels } from "@/app/actions/channels";
import { getPublishStats, getPublishHistory } from "@/app/actions/tasks";
import { 
  Tv, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Plus,
  ArrowRight,
  ExternalLink,
  Layers,
  AlertCircle,
  Loader2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [channels, stats, history] = await Promise.all([
    getConnectedChannels(),
    getPublishStats(),
    getPublishHistory(),
  ]);

  const activeChannels = channels.filter((c) => c.is_active);
  const recentTasks = history.slice(0, 4);

  return (
    <>
      <SubNavFrosted
        title="Overview"
        subtitle="Workspace Dashboard"
        action={
          <Link href="/upload">
            <AppleButton size="sm">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Distribute Video</span>
            </AppleButton>
          </Link>
        }
      />

      <DashboardLayout>
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <AppleCard variant="canvas" className="p-6">
            <div className="flex items-center justify-between text-apple-ink-muted mb-2">
              <span className="text-[13px] font-medium">Connected Channels</span>
              <Tv className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">
              {channels.length}
            </div>
            <p className="text-xs text-apple-ink-muted mt-2 flex items-center gap-1">
              <span>{activeChannels.length} active channels ready</span>
            </p>
          </AppleCard>

          <AppleCard variant="canvas" className="p-6">
            <div className="flex items-center justify-between text-apple-ink-muted mb-2">
              <span className="text-[13px] font-medium">Total Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">
              {stats.totalPublished}
            </div>
            <p className="text-xs text-apple-ink-muted mt-2">
              Across all connected channels
            </p>
          </AppleCard>

          <AppleCard variant="canvas" className="p-6">
            <div className="flex items-center justify-between text-apple-ink-muted mb-2">
              <span className="text-[13px] font-medium">Scheduled Queue</span>
              <Clock className="w-4 h-4 text-apple-blue" />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">
              {stats.totalScheduled}
            </div>
            <p className="text-xs text-apple-ink-muted mt-2">
              Upcoming scheduled drops
            </p>
          </AppleCard>
        </div>

        {/* Action Center & Getting Started */}
        <div className="space-y-8">
          <AppleCard variant="canvas" className="p-8">
            <div className="max-w-xl">
              <AppleBadge variant="youtube" className="mb-3">
                {channels.length > 0 ? "Ready to Distribute" : "Step 1 • Get Started"}
              </AppleBadge>
              <h2 className="text-2xl font-semibold tracking-tight text-apple-ink mb-2">
                {channels.length > 0
                  ? "Distribute your next video"
                  : "Connect your YouTube Channels"}
              </h2>
              <p className="text-[15px] text-apple-ink-muted mb-6 leading-relaxed">
                {channels.length > 0
                  ? `You have ${channels.length} channel${channels.length > 1 ? "s" : ""} connected. Upload a video with rich metadata to distribute across all selected channels simultaneously.`
                  : "To start cross-publishing videos, connect one or more YouTube channels. You can link multiple brand channels or separate Google accounts."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {channels.length > 0 ? (
                  <Link href="/upload">
                    <AppleButton>
                      <UploadCloud className="w-4 h-4" />
                      <span>Start Distribution</span>
                    </AppleButton>
                  </Link>
                ) : (
                  <a href="/api/auth/youtube/connect">
                    <AppleButton>
                      <Plus className="w-4 h-4" />
                      <span>Connect Channel</span>
                    </AppleButton>
                  </a>
                )}
                <Link href="/channels">
                  <AppleButton variant="ghost">
                    <span>Manage Channels ({channels.length})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </AppleButton>
                </Link>
              </div>
            </div>
          </AppleCard>

          {/* Recent Activity Section */}
          {recentTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-apple-ink">
                    Recent Distribution Activity
                  </h3>
                  <p className="text-[13px] text-apple-ink-muted">
                    Latest publishing and streaming tasks across your channels.
                  </p>
                </div>
                <Link href="/history">
                  <AppleButton variant="ghost" size="sm">
                    <span>View all history</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </AppleButton>
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentTasks.map((task) => {
                  const isPublished = task.status === "published";
                  const isFailed = task.status === "failed";
                  const isProcessing = task.status === "processing";
                  const isPending = task.status === "pending";

                  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  const watchUrl =
                    task.platform_video_url ||
                    (task.platform_video_id
                      ? `https://youtu.be/${task.platform_video_id}`
                      : null);

                  return (
                    <AppleCard
                      key={task.id}
                      variant="canvas"
                      className="p-4 transition-all hover:border-apple-smoke"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {task.channel_avatar_url ? (
                            <img
                              src={task.channel_avatar_url}
                              alt={task.channel_name}
                              className="w-9 h-9 rounded-full border border-apple-smoke/50 object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center flex-shrink-0">
                              <Tv className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="text-[14px] font-medium text-apple-ink tracking-tight truncate">
                              {task.video_title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-apple-ink-muted">
                              <span className="truncate max-w-[150px]">{task.channel_name}</span>
                              <span>•</span>
                              <LocalTime date={task.created_at} format="short" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isPublished && (
                            <AppleBadge variant="success" size="sm">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Published</span>
                            </AppleBadge>
                          )}
                          {isProcessing && (
                            <AppleBadge variant="warning" size="sm">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>{task.progress_percent}%</span>
                            </AppleBadge>
                          )}
                          {isPending && (
                            <AppleBadge variant="neutral" size="sm">
                              <Clock className="w-3 h-3" />
                              <span>Queued</span>
                            </AppleBadge>
                          )}
                          {isFailed && (
                            <AppleBadge variant="error" size="sm">
                              <AlertCircle className="w-3 h-3" />
                              <span>Failed</span>
                            </AppleBadge>
                          )}

                          {watchUrl && (
                            <a
                              href={watchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-apple-ink-muted hover:text-apple-blue transition-colors p-1"
                              title="Watch on YouTube"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </AppleCard>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
