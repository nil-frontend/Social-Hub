import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <>
      <SubNavFrosted
        title="Publish History"
        subtitle="Distribution Activity & Logs"
      />

      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
              Activity History
            </h2>
            <p className="text-[14px] text-apple-ink-muted">
              Audit log of past uploads, channel destinations, and direct video links.
            </p>
          </div>

          <AppleCard variant="canvas" className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-apple-pearl text-apple-ink-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-apple-ink mb-2">
              No publishing activity yet
            </h3>
            <p className="text-[15px] text-apple-ink-muted max-w-md leading-relaxed">
              Once you distribute a video, its upload progress, processing state, and clickable watch URLs will appear here.
            </p>
          </AppleCard>
        </div>
      </DashboardLayout>
    </>
  );
}
