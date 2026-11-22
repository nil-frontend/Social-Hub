import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";

export default function HistoryLoading() {
  return (
    <>
      <SubNavFrosted title="Publish History" subtitle="Distribution Activity & Logs" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-apple-pearl rounded-md animate-pulse" />
            <div className="h-4 w-80 bg-apple-pearl rounded-full animate-pulse" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <AppleCard key={i} variant="canvas" className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1">
                    <div className="w-10 h-10 rounded-full bg-apple-pearl animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-44 bg-apple-pearl rounded-full animate-pulse" />
                      <div className="h-3 w-64 bg-apple-pearl rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="h-7 w-24 bg-apple-pearl rounded-full animate-pulse shrink-0" />
                </div>
              </AppleCard>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
