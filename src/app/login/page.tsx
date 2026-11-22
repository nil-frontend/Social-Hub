"use client";

import React, { useState, useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppleButton } from "@/components/ui/apple/button";
import { AppleCard } from "@/components/ui/apple/card";
import { AppleInput } from "@/components/ui/apple/input";
import { signIn, signUp } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Share2, Lock, Mail, User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const urlError = searchParams.get("error");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    mode === "signin" ? signIn : signUp,
    { error: null, success: null }
  );

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) {
        setGoogleError(error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setGoogleError(err?.message || "Failed to initiate Google sign in.");
      setGoogleLoading(false);
    }
  };

  const displayError =
    state?.error ||
    googleError ||
    (urlError
      ? urlError === "auth_code_exchange_failed"
        ? "Authentication session exchange failed. Please try again."
        : decodeURIComponent(urlError)
      : null);

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
          onClick={() => {
            setMode("signin");
            setGoogleError(null);
          }}
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
          onClick={() => {
            setMode("signup");
            setGoogleError(null);
          }}
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
        <div className="space-y-5">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isPending}
            className="w-full h-11 px-4 rounded-apple-pill bg-white hover:bg-neutral-50 active:scale-[0.98] border border-apple-smoke text-apple-ink shadow-sm flex items-center justify-center gap-3 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-apple-blue" />
            ) : (
              <GoogleIcon className="shrink-0" />
            )}
            <span>
              {mode === "signin"
                ? "Continue with Google"
                : "Sign up with Google"}
            </span>
          </button>

          {/* Apple Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-apple-hairline" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-apple-canvas px-3 text-apple-ink-muted">
                or continue with email
              </span>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* Error Message Alert */}
            {displayError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p>{displayError}</p>
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
                {mode === "signin" ? "Sign In with Email" : "Create Account with Email"}
              </AppleButton>
            </div>
          </form>
        </div>
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
