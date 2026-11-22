import React from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";

export const GlobalNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-[44px] bg-apple-black text-white/90 backdrop-blur-md px-6 flex items-center justify-between border-b border-white/10 text-[12px] tracking-tight">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
          <div className="w-5 h-5 rounded-full bg-apple-blue flex items-center justify-center">
            <Share2 className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold tracking-normal text-[13px] text-white">Social-Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[12px] text-white/70">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/channels" className="hover:text-white transition-colors">
            Channels
          </Link>
          <Link href="/upload" className="hover:text-white transition-colors">
            Distribute Video
          </Link>
          <Link href="/history" className="hover:text-white transition-colors">
            Publish History
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-[12px] bg-white/10 hover:bg-white/20 active:scale-95 text-white px-3 py-1 rounded-apple-pill transition-all"
          >
            Launch Hub
          </Link>
        </div>
      </div>
    </header>
  );
};
