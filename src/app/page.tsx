import Link from "next/link";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleBadge } from "@/components/ui/apple/badge";
import { BrandIcon } from "@/components/ui/brand-logo";
import { 
  Tv, 
  UploadCloud, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Clock
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-44px)]">
      {/* Hero Section: Apple Minimalist Style */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-6 flex items-center justify-center">
          <BrandIcon size={68} className="shadow-apple-soft hover:scale-105 transition-transform" />
        </div>

        <AppleBadge variant="youtube" className="mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          V1 YouTube Multi-Channel Support Live
        </AppleBadge>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.03em] text-apple-ink max-w-3xl leading-[1.08]">
          One video upload. <br />
          <span className="text-apple-blue">Every channel published.</span>
        </h1>

        <p className="mt-6 text-[19px] sm:text-[21px] text-apple-ink-muted max-w-2xl font-light leading-relaxed">
          Connect multiple YouTube channels and distribute content across your entire network in parallel with zero server bandwidth bottlenecks.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <AppleButton size="lg" className="px-8 shadow-sm">
              <span>Open Social Hub</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </AppleButton>
          </Link>
          <Link href="/channels">
            <AppleButton variant="secondary" size="lg" className="px-8">
              Connect Channels
            </AppleButton>
          </Link>
        </div>
      </section>

      {/* Feature Tiles: Alternating Apple Surface Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppleCard variant="canvas" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-6 text-red-600">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-[21px] font-semibold tracking-tight text-apple-ink mb-2">
                Multi-Channel Support
              </h3>
              <p className="text-[15px] text-apple-ink-muted leading-relaxed">
                Connect and manage unlimited YouTube accounts and brand channels seamlessly. Scalable to Facebook and Instagram in upcoming milestones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-apple-divider-soft flex items-center gap-2 text-xs text-apple-ink-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secure OAuth 2.0 with Auto Token Refresh
            </div>
          </AppleCard>

          <AppleCard variant="canvas" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-apple-blue">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-[21px] font-semibold tracking-tight text-apple-ink mb-2">
                Resumable Browser Streaming
              </h3>
              <p className="text-[15px] text-apple-ink-muted leading-relaxed">
                Upload video files up to 1GB directly from your browser to YouTube servers. Ultra-fast, zero intermediate storage cost, and auto-resume.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-apple-divider-soft flex items-center gap-2 text-xs text-apple-ink-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              MP4, MOV & WebM Support
            </div>
          </AppleCard>

          <AppleCard variant="canvas" className="p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-[21px] font-semibold tracking-tight text-apple-ink mb-2">
                Instant & Scheduled Publishing
              </h3>
              <p className="text-[15px] text-apple-ink-muted leading-relaxed">
                Publish immediately or pick a scheduled future date/time. Configure custom thumbnails, tags, category, and COPPA settings per drop.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-apple-divider-soft flex items-center gap-2 text-xs text-apple-ink-muted">
              <Layers className="w-4 h-4 text-emerald-600" />
              Full YouTube Metadata Control
            </div>
          </AppleCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-apple-hairline text-center text-xs text-apple-ink-muted">
        <p>Social-Hub &bull; Powered by Next.js 15, Supabase, and YouTube Data API v3</p>
      </footer>
    </div>
  );
}
