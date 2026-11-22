import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { getConnectedChannels } from "@/app/actions/channels";
import { 
  Tv, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Plus
} from "lucide-react";

export default async function DashboardPage() {
  const channels = await getConnectedChannels();
  const activeChannels = channels.filter((c) => c.is_active);

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
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">0</div>
            <p className="text-xs text-apple-ink-muted mt-2">
              Across all connected channels
            </p>
          </AppleCard>

          <AppleCard variant="canvas" className="p-6">
            <div className="flex items-center justify-between text-apple-ink-muted mb-2">
              <span className="text-[13px] font-medium">Scheduled Queue</span>
              <Clock className="w-4 h-4 text-apple-blue" />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">0</div>
            <p className="text-xs text-apple-ink-muted mt-2">
              Upcoming scheduled drops
            </p>
          </AppleCard>
        </div>

        {/* Action Center */}
        <div className="space-y-6">
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
                  ? `You have ${channels.length} channel${channels.length > 1 ? "s" : ""} connected. Upload a video to distribute across all selected channels simultaneously.`
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
        </div>
      </DashboardLayout>
    </>
  );
}
