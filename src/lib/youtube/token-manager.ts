import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken, encryptToken } from "@/lib/crypto";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

/**
 * Returns a guaranteed valid (unexpired) plaintext access token for a connected YouTube channel.
 * If the current access token is expired or within 5 minutes of expiring, transparently
 * refreshes it with Google using the decrypted refresh token and updates the database.
 */
export async function getValidAccessToken(socialAccountId: string): Promise<string> {
  const supabase = createAdminClient();

  // 1. Fetch channel record from database
  const { data: account, error } = await supabase
    .from("social_accounts")
    .select("id, encrypted_access_token, encrypted_refresh_token, token_expires_at")
    .eq("id", socialAccountId)
    .single();

  if (error || !account) {
    throw new Error(`Social account not found: ${socialAccountId}`);
  }

  const now = Date.now();
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0;
  const isExpiringSoon = expiresAt <= now + 5 * 60 * 1000; // 5 minute safety buffer

  // 2. If access token is still fresh, decrypt and return it
  if (!isExpiringSoon && account.encrypted_access_token) {
    return decryptToken(account.encrypted_access_token);
  }

  // 3. Otherwise, refresh using Google OAuth refresh token
  if (!account.encrypted_refresh_token) {
    // If no refresh token available, fallback to existing token if still before absolute expiry
    if (expiresAt > now && account.encrypted_access_token) {
      return decryptToken(account.encrypted_access_token);
    }
    throw new Error(
      "Access token expired and no refresh token is stored. Please reconnect this YouTube channel."
    );
  }

  const refreshToken = decryptToken(account.encrypted_refresh_token);
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const refreshResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    console.error("Token refresh request failed:", refreshResponse.status, errorText);
    throw new Error(`Google token refresh failed: ${errorText}`);
  }

  const tokenData = await refreshResponse.json();
  const newAccessToken = tokenData.access_token;
  const newExpiresIn = tokenData.expires_in || 3600;

  // 4. Encrypt new access token and save updated expiry
  const newEncryptedAccessToken = encryptToken(newAccessToken);
  const newExpiresAt = new Date(Date.now() + (newExpiresIn - 300) * 1000).toISOString();

  await supabase
    .from("social_accounts")
    .update({
      encrypted_access_token: newEncryptedAccessToken,
      token_expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", socialAccountId);

  return newAccessToken;
}
