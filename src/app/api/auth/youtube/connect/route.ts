import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGoogleAuthUrl } from "@/lib/youtube/oauth";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", "/channels");
      return NextResponse.redirect(loginUrl);
    }

    // Generate a secure random CSRF state nonce
    const state = crypto.randomBytes(24).toString("hex");

    // Extract real client origin respecting load balancer / proxy headers
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      request.nextUrl.host;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const origin = isLocal ? `http://${host}` : `https://${host}`;

    const authUrl = getGoogleAuthUrl(state, origin);

    const response = NextResponse.redirect(authUrl);

    // Prevent any browser or intermediary caching of this dynamic OAuth redirect
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Store state in an HttpOnly, secure cookie valid for 10 minutes
    response.cookies.set("youtube_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error starting YouTube OAuth connect:", error);
    const channelsUrl = new URL("/channels", request.url);
    channelsUrl.searchParams.set("error", encodeURIComponent(error?.message || "oauth_init_failed"));
    return NextResponse.redirect(channelsUrl);
  }
}
