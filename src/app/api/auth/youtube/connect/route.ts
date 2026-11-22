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

    // Pass the exact origin of the incoming request (e.g. https://social-hub.nilstudio.dpdns.org)
    const authUrl = getGoogleAuthUrl(state, request.nextUrl.origin);

    const response = NextResponse.redirect(authUrl);

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
