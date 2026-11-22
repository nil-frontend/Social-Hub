"use client";

import React, { useState, useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleInput } from "@/components/ui/apple/input";
import { signIn, signUp } from "@/app/actions/auth";
import { Share2, Lock, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [state, formAction, isPending] = useActionState(
    mode === "signin" ? signIn : signUp,
    { error: null, success: null }
  );

  return (
    <div className="w-full max-w-md">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-apple-black text-white mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Share2 className="w-6 h-6 text-apple-blue" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-apple-ink">
          {mode === "signin" ? "Sign in to Social-Hub" : "Create your Account"}
        </h1>
        <p className="mt-2 text-[15px] text-apple-ink-muted">
          {mode === "signin"
            ? "Manage and distribute videos to all your channels"
            : "Get started with multi-channel publishing in seconds"}
        </p>
      </div>

      {/* Apple Style Segmented Tab Toggle */}
      <div className="flex bg-apple-pearl p-1 rounded-apple-pill border border-apple-hairline mb-6">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 py-1.5 text-[13px] font-medium rounded-apple-pill transition-all ${
            mode === "signin"
              ? "bg-apple-canvas text-apple-ink shadow-apple-soft"
              : "text-apple-ink-muted hover:text-apple-ink"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 py-1.5 text-[13px] font-medium rounded-apple-pill transition-all ${
            mode === "signup"
              ? "bg-apple-canvas text-apple-ink shadow-apple-soft"
              : "text-apple-ink-muted hover:text-apple-ink"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Auth Form Card */}
      <AppleCard variant="canvas" className="p-8 shadow-apple-soft">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {/* Error Message Alert */}
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p>{state.error}</p>
            </div>
          )}

          {/* Success Message Alert */}
          {state?.success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-700 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <p>{state.success}</p>
            </div>
          )}

          {/* Full Name Field (Sign Up Only) */}
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-apple-ink-muted flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Full Name</span>
              </label>
              <AppleInput
                type="text"
                name="fullName"
                placeholder="Your Name"
                autoComplete="name"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-apple-ink-muted flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email address</span>
            </label>
            <AppleInput
              type="email"
              name="email"
              required
              placeholder="creator@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-apple-ink-muted flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </label>
            <AppleInput
              type="password"
              name="password"
              required
              placeholder="••••••••"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

          <div className="pt-2">
            <AppleButton
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isPending}
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </AppleButton>
          </div>
        </form>
      </AppleCard>

      {/* Back Link */}
      <p className="mt-8 text-center text-xs text-apple-ink-muted">
        <Link href="/" className="hover:text-apple-blue transition-colors">
          &larr; Back to Home
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-44px)] flex flex-col justify-center items-center px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-apple-ink-muted text-xs">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
