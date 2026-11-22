import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens, fetchChannelProfile } from "@/lib/youtube/oauth";
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

    // 1. Exchange code for access & refresh tokens
    const tokens = await exchangeCodeForTokens(code);

    // 2. Fetch channel details from YouTube Data API v3
    const profile = await fetchChannelProfile(tokens.access_token);

    // 3. Encrypt tokens for secure storage at rest
    const encryptedAccessToken = encryptToken(tokens.access_token);
    const encryptedRefreshToken = tokens.refresh_token
      ? encryptToken(tokens.refresh_token)
      : null;

    // Token expires in ~3600s; set 5-minute safety buffer
    const tokenExpiresAt = new Date(Date.now() + (tokens.expires_in - 300) * 1000).toISOString();

    // 4. Upsert channel record in Supabase social_accounts table
    // If re-authorizing an existing channel, preserve existing refresh token if Google didn't return a new one
    const updatePayload: Record<string, any> = {
      user_id: user.id,
      platform: "youtube",
      platform_account_id: profile.id,
      account_name: profile.title,
      account_avatar_url: profile.avatarUrl,
      encrypted_access_token: encryptedAccessToken,
      token_expires_at: tokenExpiresAt,
      platform_metadata: {
        subscriber_count: profile.subscriberCount,
        custom_url: profile.customUrl,
        description: profile.description,
      },
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    if (encryptedRefreshToken) {
      updatePayload.encrypted_refresh_token = encryptedRefreshToken;
    }

    const { error: upsertError } = await supabase
      .from("social_accounts")
      .upsert(updatePayload, {
        onConflict: "user_id,platform,platform_account_id",
      });

    if (upsertError) {
      console.error("Supabase social_accounts upsert failed:", upsertError);
      channelsUrl.searchParams.set("error", "database_save_failed");
      return NextResponse.redirect(channelsUrl);
    }

    // Clear state cookie and redirect with success
    const response = NextResponse.redirect(new URL("/channels?success=channel_connected", request.url));
    response.cookies.delete("youtube_oauth_state");
    return response;
  } catch (err: any) {
    console.error("YouTube OAuth callback error:", err);
    channelsUrl.searchParams.set("error", encodeURIComponent(err?.message || "oauth_failed"));
    return NextResponse.redirect(channelsUrl);
  }
}
