import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { 
  Tv, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Plus
} from "lucide-react";

export default function DashboardPage() {
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
            <div className="text-3xl font-semibold tracking-tight text-apple-ink">0</div>
            <p className="text-xs text-apple-ink-muted mt-2 flex items-center gap-1">
              <span>Ready for YouTube OAuth</span>
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
                Step 1 &bull; Get Started
              </AppleBadge>
              <h2 className="text-2xl font-semibold tracking-tight text-apple-ink mb-2">
                Connect your YouTube Channels
              </h2>
              <p className="text-[15px] text-apple-ink-muted mb-6 leading-relaxed">
                To start cross-publishing videos, connect one or more YouTube channels. You can link multiple brand channels or separate Google accounts.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/channels">
                  <AppleButton>
                    <Plus className="w-4 h-4" />
                    <span>Connect Channel</span>
                  </AppleButton>
                </Link>
                <Link href="/docs/google-cloud">
                  <AppleButton variant="ghost">
                    <span>View Setup Guide</span>
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
