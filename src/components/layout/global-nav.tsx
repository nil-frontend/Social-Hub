import React from "react";
import Link from "next/link";
import { Share2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export const GlobalNav = async () => {
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    // If Supabase is unconfigured or offline during build
  }

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

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-white/70 hidden sm:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-[11px] bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white px-2.5 py-1 rounded-apple-pill transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[12px] bg-apple-blue hover:bg-apple-blue-focus active:scale-95 text-white px-4 py-1 rounded-apple-pill font-medium transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
