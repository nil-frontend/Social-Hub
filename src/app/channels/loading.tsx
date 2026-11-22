import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";

export default function ChannelsLoading() {
  return (
    <>
      <SubNavFrosted title="Channels" subtitle="Connected Accounts" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-apple-pearl rounded-md animate-pulse" />
            <div className="h-4 w-80 bg-apple-pearl rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2].map((i) => (
              <AppleCard key={i} variant="canvas" className="p-6 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-apple-pearl animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-apple-pearl rounded-full animate-pulse" />
                    <div className="h-3 w-20 bg-apple-pearl rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="h-9 w-full bg-apple-pearl rounded-apple-pill animate-pulse" />
              </AppleCard>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
