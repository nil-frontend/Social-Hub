import Link from "next/link";
import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleBadge } from "@/components/ui/apple/badge";
import { Tv, Plus, AlertCircle, ExternalLink } from "lucide-react";

export default function ChannelsPage() {
  return (
    <>
      <SubNavFrosted
        title="Connected Channels"
        subtitle="Manage Social Accounts"
        action={
          <AppleButton size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add YouTube Channel</span>
          </AppleButton>
        }
      />

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-apple-ink">
                Social Accounts
              </h2>
              <p className="text-[14px] text-apple-ink-muted">
                Connect and manage multiple YouTube channels and accounts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AppleBadge variant="youtube">YouTube: Active</AppleBadge>
              <AppleBadge variant="neutral">Facebook: V2</AppleBadge>
              <AppleBadge variant="neutral">Instagram: V2</AppleBadge>
            </div>
          </div>

          {/* Empty State Card */}
          <AppleCard variant="canvas" className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Tv className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-apple-ink mb-2">
              No channels connected yet
            </h3>
            <p className="text-[15px] text-apple-ink-muted max-w-md mb-6 leading-relaxed">
              Connect your first YouTube channel using Google OAuth. You can link multiple brand channels or multiple Google accounts.
            </p>
            <AppleButton size="md">
              <Plus className="w-4 h-4" />
              <span>Connect YouTube Channel</span>
            </AppleButton>

            <div className="mt-8 pt-6 border-t border-apple-divider-soft w-full max-w-sm flex items-center justify-center gap-2 text-xs text-apple-ink-muted">
              <AlertCircle className="w-3.5 h-3.5 text-apple-blue" />
              <span>Requires Google Cloud credentials in .env.local</span>
            </div>
          </AppleCard>
        </div>
      </DashboardLayout>
    </>
  );
}
