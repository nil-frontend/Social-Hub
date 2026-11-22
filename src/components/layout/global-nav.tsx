import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut, getCurrentUser } from "@/app/actions/auth";
import { BrandIcon } from "@/components/ui/brand-logo";

export const GlobalNav = async () => {
  const user = await getCurrentUser();

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    user?.email;

  return (
    <header className="sticky top-0 z-50 h-[44px] bg-apple-black text-white/90 backdrop-blur-md px-6 flex items-center justify-between border-b border-white/10 text-[12px] tracking-tight">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" prefetch={true} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <BrandIcon size={22} />
          <span className="font-semibold tracking-tight text-[13.5px] text-white">Social-Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[12px] text-white/70">
          <Link href="/dashboard" prefetch={true} className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/channels" prefetch={true} className="hover:text-white transition-colors">
            Channels
          </Link>
          <Link href="/upload" prefetch={true} className="hover:text-white transition-colors">
            Distribute Video
          </Link>
          <Link href="/history" prefetch={true} className="hover:text-white transition-colors">
            Publish History
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[12px] text-white/80">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || "User avatar"}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
                <span className="hidden sm:inline-block max-w-[140px] truncate">
                  {displayName}
                </span>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-[11px] bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white px-2.5 py-1 rounded-apple-pill transition-all cursor-pointer"
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
              prefetch={true}
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
