import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { UploadCloud, Film, Image as ImageIcon, Calendar, AlertCircle } from "lucide-react";

export default function UploadPage() {
  return (
    <>
      <SubNavFrosted
        title="Distribute Video"
        subtitle="Multi-Channel Publisher"
      />

      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
              New Video Distribution
            </h2>
            <p className="text-[14px] text-apple-ink-muted">
              Select channels, upload video file, and customize metadata before dispatching.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols: Video Details Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dropzone */}
              <AppleCard variant="canvas" className="p-8 border-dashed border-2 border-apple-hairline text-center hover:border-apple-blue/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-apple-pearl mx-auto flex items-center justify-center text-apple-ink-muted mb-4">
                  <Film className="w-7 h-7" />
                </div>
                <h4 className="text-[16px] font-medium text-apple-ink mb-1">
                  Drag and drop your video file here
                </h4>
                <p className="text-xs text-apple-ink-muted mb-4">
                  Accepts MP4, MOV, and WebM up to 1GB
                </p>
                <AppleButton variant="secondary" size="sm">
                  <span>Browse Video</span>
                </AppleButton>
              </AppleCard>

              {/* Metadata Fields Placeholder */}
              <AppleCard variant="canvas" className="p-6 space-y-4">
                <h4 className="text-[15px] font-semibold text-apple-ink">
                  Video Metadata
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-apple-ink-muted">Title (required)</label>
                  <div className="h-10 rounded-xl bg-apple-parchment/60 border border-apple-hairline px-4 flex items-center text-xs text-apple-ink-muted">
                    Enter video title (max 100 characters)
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-apple-ink-muted">Description</label>
                  <div className="h-24 rounded-xl bg-apple-parchment/60 border border-apple-hairline p-4 text-xs text-apple-ink-muted">
                    Enter video description...
                  </div>
                </div>
              </AppleCard>
            </div>

            {/* Right Col: Channel Selector & Publish Options */}
            <div className="space-y-6">
              <AppleCard variant="canvas" className="p-6">
                <h4 className="text-[15px] font-semibold text-apple-ink mb-3">
                  Target Channels
                </h4>
                <div className="p-4 rounded-xl bg-apple-parchment text-center text-xs text-apple-ink-muted">
                  No channels connected yet. Connect a channel to distribute.
                </div>
              </AppleCard>

              <AppleCard variant="canvas" className="p-6">
                <h4 className="text-[15px] font-semibold text-apple-ink mb-3">
                  Publishing Mode
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-apple-blue bg-apple-blue/5 flex items-center justify-between text-xs">
                    <span className="font-medium text-apple-ink">Publish Now</span>
                    <AppleBadge variant="youtube" size="sm">Instant</AppleBadge>
                  </div>
                  <div className="p-3 rounded-xl border border-apple-hairline text-xs text-apple-ink-muted flex items-center justify-between">
                    <span>Schedule for Later</span>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
              </AppleCard>

              <AppleButton className="w-full" size="lg" disabled>
                <span>Distribute to 0 Channels</span>
              </AppleButton>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
