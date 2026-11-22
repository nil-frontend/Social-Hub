"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Tv, 
  UploadCloud, 
  Clock, 
  Settings,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Connected Channels",
      href: "/channels",
      icon: Tv,
    },
    {
      label: "Distribute Video",
      href: "/upload",
      icon: UploadCloud,
    },
    {
      label: "Publish History",
      href: "/history",
      icon: Clock,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Apple Style Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-apple-canvas rounded-2xl border border-apple-hairline p-3 shadow-apple-soft">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-apple-ink-muted uppercase">
              Workspace
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-150 group",
                      isActive
                        ? "bg-apple-blue text-white font-medium shadow-sm"
                        : "text-apple-ink hover:bg-apple-parchment"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-white" : "text-apple-ink-muted group-hover:text-apple-ink"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity",
                        isActive ? "opacity-100 text-white/80" : "text-apple-ink-muted"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-apple-divider-soft px-3">
              <div className="text-[12px] text-apple-ink-muted">
                Status: <span className="text-emerald-600 font-medium">Ready</span>
              </div>
              <p className="text-[11px] text-apple-ink-muted mt-0.5">
                Multi-channel engine v1.0
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
};
