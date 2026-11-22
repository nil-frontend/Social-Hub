"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  User, 
  LogOut, 
  ChevronDown, 
  Check, 
  Copy, 
  Tv, 
  UploadCloud, 
  LayoutDashboard 
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

interface UserNavDropdownProps {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
}

export const UserNavDropdown: React.FC<UserNavDropdownProps> = ({
  email,
  displayName,
  avatarUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[12px] text-white/90 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 px-2.5 py-1 rounded-apple-pill border border-white/10 transition-all cursor-pointer select-none"
        aria-expanded={isOpen}
        title="View account details"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-5 h-5 rounded-full object-cover border border-white/20"
          />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
        )}
        <span className="max-w-[130px] truncate font-medium">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Apple-Styled Frosted Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#161618]/95 backdrop-blur-2xl border border-white/15 shadow-apple-card z-50 p-3.5 text-white animate-in fade-in zoom-in-95 duration-150">
          {/* User Identity Section */}
          <div className="flex items-start gap-3 p-1 mb-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-apple-blue/20 text-apple-blue border border-apple-blue/30 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[14px] text-white tracking-tight truncate">
                {displayName}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Signed In</span>
              </div>
            </div>
          </div>

          {/* Email Address Pill with Click-to-Copy */}
          <div
            onClick={handleCopyEmail}
            className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer mb-3"
            title="Click to copy email address"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-apple-blue shrink-0" />
              <span className="text-[12px] font-mono text-white/90 truncate select-all">
                {email}
              </span>
            </div>
            <button
              type="button"
              className="text-white/40 group-hover:text-white/90 transition-colors p-0.5"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5 border-t border-white/10 pt-2 mb-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-white/60" />
              <span>Workspace Dashboard</span>
            </Link>
            <Link
              href="/channels"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-white/60" />
              <span>Connected Channels</span>
            </Link>
            <Link
              href="/upload"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-white/60" />
              <span>Distribute Video</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="border-t border-white/10 pt-2">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer"
              >
                <span className="font-medium">Sign Out</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
