import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleBadge } from "@/components/ui/apple/badge";
import { AppleButton } from "@/components/ui/apple/button";
import { LocalTime } from "@/components/ui/local-time";
import { getPublishHistory } from "@/app/actions/tasks";
import { 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  UploadCloud, 
  Tv, 
  Layers,
  ArrowRight,
  Calendar
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const tasks = await getPublishHistory();

  return (
    <>
      <SubNavFrosted
        title="Publish History"
        subtitle="Distribution Activity & Logs"
        action={
          <Link href="/upload">
            <AppleButton size="sm">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>New Upload</span>
            </AppleButton>
          </Link>
        }
      />

      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
                Distribution Activity
              </h2>
              <p className="text-[14px] text-apple-ink-muted">
                Audit log of all video uploads, target channels, processing states, and live URLs.
              </p>
            </div>
            {tasks.length > 0 && (
              <div className="text-xs text-apple-ink-muted flex items-center gap-1.5 self-start sm:self-auto bg-apple-parchment/60 px-3 py-1.5 rounded-full border border-apple-hairline">
                <Layers className="w-3.5 h-3.5 text-apple-blue" />
                <span>{tasks.length} total broadcast task{tasks.length > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {tasks.length === 0 ? (
            <AppleCard variant="canvas" className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-apple-pearl text-apple-ink-muted flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-apple-ink mb-2">
                No publishing activity yet
              </h3>
              <p className="text-[15px] text-apple-ink-muted max-w-md leading-relaxed mb-6">
                When you distribute videos to your connected YouTube channels, their real-time progress, platform statuses, and clickable watch links will appear here.
              </p>
              <Link href="/upload">
                <AppleButton>
                  <UploadCloud className="w-4 h-4" />
                  <span>Distribute Your First Video</span>
                </AppleButton>
              </Link>
            </AppleCard>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const isPublished = task.status === "published";
                const isFailed = task.status === "failed";
                const isProcessing = task.status === "processing";
                const isPending = task.status === "pending";

                const isScheduledRelease = Boolean(task.scheduled_publish_at);
                const isFutureScheduled =
                  isScheduledRelease &&
                  new Date(task.scheduled_publish_at!) > new Date();

                const watchUrl =
                  task.platform_video_url ||
                  (task.platform_video_id
                    ? `https://youtu.be/${task.platform_video_id}`
                    : null);

                return (
                  <AppleCard
                    key={task.id}
                    variant="canvas"
                    className="p-5 transition-all hover:border-apple-smoke"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Video & Channel Details */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {task.channel_avatar_url ? (
                          <img
                            src={task.channel_avatar_url}
                            alt={task.channel_name}
                            className="w-10 h-10 rounded-full border border-apple-smoke/50 object-cover flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Tv className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <h4 className="text-[15px] font-semibold text-apple-ink tracking-tight truncate">
                            {task.video_title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-apple-ink-muted">
                            <span className="font-medium text-apple-ink truncate max-w-[180px]">
                              {task.channel_name}
                            </span>
                            <span>•</span>
                            <span>
                              <span className="text-apple-ink-subtle">Uploaded:</span>{" "}
                              <LocalTime date={task.created_at} />
                            </span>
                            {task.scheduled_publish_at && (
                              <>
                                <span>•</span>
                                <span className="text-apple-blue font-medium flex items-center gap-1 bg-apple-blue/5 px-2 py-0.5 rounded-md border border-apple-blue/15">
                                  <Calendar className="w-3 h-3 text-apple-blue" />
                                  <span>Scheduled:</span>
                                  <LocalTime date={task.scheduled_publish_at} />
                                </span>
                              </>
                            )}
                            {task.platform_video_id && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[11px] text-apple-ink-subtle">
                                  ID: {task.platform_video_id}
                                </span>
                              </>
                            )}
                          </div>

                          {task.error_message && (
                            <p className="text-xs text-rose-600 bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-200/50 mt-1 inline-block">
                              {task.error_message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Status Badge & Watch Link */}
                      <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-apple-hairline">
                        <div>
                          {isPublished && (
                            isFutureScheduled ? (
                              <AppleBadge variant="warning" size="md">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Scheduled Drop</span>
                              </AppleBadge>
                            ) : (
                              <AppleBadge variant="success" size="md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Published</span>
                              </AppleBadge>
                            )
                          )}
                          {isProcessing && (
                            <AppleBadge variant="warning" size="md">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading ({task.progress_percent}%)</span>
                            </AppleBadge>
                          )}
                          {isPending && (
                            <AppleBadge variant="neutral" size="md">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Queued</span>
                            </AppleBadge>
                          )}
                          {isFailed && (
                            <AppleBadge variant="error" size="md">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Failed</span>
                            </AppleBadge>
                          )}
                        </div>

                        {watchUrl ? (
                          <a
                            href={watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex"
                          >
                            <AppleButton variant="ghost" size="sm">
                              <span>Watch Video</span>
                              <ExternalLink className="w-3.5 h-3.5 text-apple-blue" />
                            </AppleButton>
                          </a>
                        ) : isProcessing ? (
                          <span className="text-xs text-apple-ink-muted italic">
                            Processing stream...
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </AppleCard>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
