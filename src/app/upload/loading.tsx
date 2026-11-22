import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";

export default function UploadLoading() {
  return (
    <>
      <SubNavFrosted title="Distribute Video" subtitle="Multi-Channel Publisher" />
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Stepper Skeleton */}
          <div className="flex justify-between max-w-xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-apple-pearl animate-pulse" />
                <div className="h-3 w-16 bg-apple-pearl rounded-full animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>

          {/* Wizard Card Skeleton */}
          <AppleCard variant="canvas" className="p-8 space-y-6">
            <div className="h-6 w-48 bg-apple-pearl rounded-md animate-pulse" />
            <div className="h-4 w-72 bg-apple-pearl rounded-full animate-pulse" />
            <div className="h-64 w-full bg-apple-pearl/60 rounded-3xl animate-pulse border border-apple-hairline" />
            <div className="flex justify-end gap-3 pt-4">
              <div className="h-10 w-28 bg-apple-pearl rounded-apple-pill animate-pulse" />
            </div>
          </AppleCard>
        </div>
      </DashboardLayout>
    </>
  );
}
