export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface YouTubeChannelProfile {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  avatarUrl: string;
  subscriberCount: string;
}

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const YOUTUBE_CHANNELS_ENDPOINT = "https://www.googleapis.com/youtube/v3/channels";

const REQUIRED_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

/**
 * Returns the configured redirect URI for the YouTube OAuth callback.
 * Automatically enforces https:// for any public/production domain.
 */
export function getRedirectUri(requestOrigin?: string): string {
  let appUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin || "http://localhost:3000";
  appUrl = appUrl.trim();

  // If localhost or 127.0.0.1, keep http://
  if (appUrl.includes("localhost") || appUrl.includes("127.0.0.1")) {
    if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
      appUrl = `http://${appUrl}`;
    }
  } else {
    // For all public domains (e.g. social-hub.nilstudio.dpdns.org), ALWAYS enforce https://
    if (appUrl.startsWith("http://")) {
      appUrl = appUrl.replace(/^http:\/\//, "https://");
    } else if (!appUrl.startsWith("https://")) {
      appUrl = `https://${appUrl}`;
    }
  }

  return `${appUrl.replace(/\/$/, "")}/api/auth/youtube/callback`;
}

/**
 * Generates the Google OAuth 2.0 authorization URL with CSRF state nonce.
 */
export function getGoogleAuthUrl(state: string, requestOrigin?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId === "placeholder-google-client-id") {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured in .env.local. Follow docs/GOOGLE_CLOUD_SETUP_GUIDE.md to obtain credentials."
    );
  }

  const redirectUri = getRedirectUri(requestOrigin);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: REQUIRED_SCOPES,
    access_type: "offline",
    prompt: "consent select_account",
    state: state,
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges the authorization code received in the callback for access and refresh tokens.
 */
export async function exchangeCodeForTokens(
  code: string,
  customRedirectUri?: string
): Promise<GoogleTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = customRedirectUri || getRedirectUri();

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Google token exchange failed:", response.status, errorBody);
    throw new Error(`Failed to exchange Google OAuth code: ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetches the primary YouTube channel profile associated with the access token.
 */
export async function fetchChannelProfile(accessToken: string): Promise<YouTubeChannelProfile> {
  const url = `${YOUTUBE_CHANNELS_ENDPOINT}?part=snippet,statistics&mine=true`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("YouTube channels.list failed:", response.status, errorBody);
    throw new Error(`Failed to fetch YouTube channel profile: ${errorBody}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("No YouTube channel found for this Google account. Please create a channel first.");
  }

  const channel = data.items[0];
  const snippet = channel.snippet || {};
  const stats = channel.statistics || {};

  return {
    id: channel.id,
    title: snippet.title || "Untitled Channel",
    description: snippet.description || "",
    customUrl: snippet.customUrl || undefined,
    avatarUrl:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      "",
    subscriberCount: stats.subscriberCount || "0",
  };
}
