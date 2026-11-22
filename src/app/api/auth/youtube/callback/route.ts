import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens, fetchChannelProfile, getRedirectUri } from "@/lib/youtube/oauth";
import { encryptToken } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const channelsUrl = new URL("/channels", request.url);

  if (error) {
    console.error("Google OAuth returned error:", error);
    channelsUrl.searchParams.set("error", `google_${error}`);
    return NextResponse.redirect(channelsUrl);
  }

  if (!code || !state) {
    channelsUrl.searchParams.set("error", "missing_code_or_state");
    return NextResponse.redirect(channelsUrl);
  }

  // Validate CSRF state from cookie
  const storedState = request.cookies.get("youtube_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    console.error("OAuth state mismatch. Expected:", storedState, "Received:", state);
    channelsUrl.searchParams.set("error", "csrf_state_mismatch");
    return NextResponse.redirect(channelsUrl);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      channelsUrl.searchParams.set("error", "unauthenticated");
      return NextResponse.redirect(channelsUrl);
    }

    // Extract matching client origin
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      request.nextUrl.host;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const origin = isLocal ? `http://${host}` : `https://${host}`;

    // 1. Exchange code for access & refresh tokens using matching redirect URI
    const redirectUri = getRedirectUri(origin);
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // 2. Fetch channel details from YouTube Data API v3
    const profile = await fetchChannelProfile(tokens.access_token);

    // 3. Encrypt tokens for secure storage at rest
    const encryptedAccessToken = encryptToken(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token
      ? encryptToken(tokens.refresh_token)
      : undefined;

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // 4. Upsert channel into social_accounts table
    const accountPayload: any = {
      user_id: user.id,
      platform: "youtube",
      platform_account_id: profile.id,
      account_name: profile.title,
      account_avatar_url: profile.avatarUrl || null,
      encrypted_access_token: encryptedAccessToken,
      token_expires_at: expiresAt,
      is_active: true,
      platform_metadata: {
        custom_url: profile.customUrl,
        subscriber_count: profile.subscriberCount,
        description: profile.description,
      },
      updated_at: new Date().toISOString(),
    };

    if (encryptedRefreshToken) {
      accountPayload.encrypted_refresh_token = encryptedRefreshToken;
    }

    const { error: upsertError } = await supabase
      .from("social_accounts")
      .upsert(accountPayload, {
        onConflict: "user_id,platform,platform_account_id",
      });

    if (upsertError) {
      console.error("Database upsert failed:", upsertError);
      throw upsertError;
    }

    // Clean up CSRF state cookie
    const successResponse = NextResponse.redirect(
      new URL("/channels?success=channel_connected", request.url)
    );
    successResponse.cookies.delete("youtube_oauth_state");

    return successResponse;
  } catch (err: any) {
    console.error("Error completing YouTube OAuth connection:", err);
    channelsUrl.searchParams.set("error", encodeURIComponent(err?.message || "channel_connect_failed"));
    return NextResponse.redirect(channelsUrl);
  }
}
