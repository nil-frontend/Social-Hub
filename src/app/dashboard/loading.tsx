import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";

export default function DashboardLoading() {
  return (
    <>
      <SubNavFrosted title="Overview" subtitle="Workspace Dashboard" />
      <DashboardLayout>
        {/* Quick Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[1, 2, 3].map((i) => (
            <AppleCard key={i} variant="canvas" className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-28 bg-apple-pearl rounded-full animate-pulse" />
                <div className="w-4 h-4 bg-apple-pearl rounded-md animate-pulse" />
              </div>
              <div className="h-8 w-16 bg-apple-pearl rounded-lg animate-pulse" />
              <div className="h-3 w-36 bg-apple-pearl rounded-full animate-pulse" />
            </AppleCard>
          ))}
        </div>

        {/* Action Center Skeleton */}
        <AppleCard variant="canvas" className="p-8 space-y-4">
          <div className="h-5 w-32 bg-apple-pearl rounded-full animate-pulse" />
          <div className="h-7 w-64 bg-apple-pearl rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-apple-pearl rounded-full animate-pulse" />
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-40 bg-apple-pearl rounded-apple-pill animate-pulse" />
            <div className="h-10 w-36 bg-apple-pearl rounded-apple-pill animate-pulse" />
          </div>
        </AppleCard>
      </DashboardLayout>
    </>
  );
}
