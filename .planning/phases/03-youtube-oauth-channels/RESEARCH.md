# Phase 3: Research - YouTube OAuth 2.0 & Multi-Channel Management

## Objectives
Implement the complete Google OAuth 2.0 integration allowing creators to link multiple YouTube channels to Social-Hub, store encrypted tokens at rest, manage token lifecycle/refresh, and present an Apple-styled channel dashboard.

## Key Research & Technical Architecture

### 1. Google OAuth 2.0 Protocol for Multi-Account YouTube
- **Authorization Endpoint**: `https://accounts.google.com/o/oauth2/v2/auth`
- **Required Query Parameters**:
  - `client_id`: Configured in `.env.local`
  - `redirect_uri`: `http://localhost:3000/api/auth/youtube/callback` (or `NEXT_PUBLIC_APP_URL`)
  - `response_type`: `code`
  - `scope`:
    - `https://www.googleapis.com/auth/youtube.upload`
    - `https://www.googleapis.com/auth/youtube.readonly`
    - `https://www.googleapis.com/auth/userinfo.profile`
  - `access_type`: `offline` (Mandatory to receive a `refresh_token`)
  - `prompt`: `consent select_account`
    - `consent`: Forces Google to return a `refresh_token` even on subsequent authorisations.
    - `select_account`: Prompts the user to pick which Google account or Brand Channel to connect, allowing multiple channels to be linked sequentially without cache lock-in.
  - `state`: Anti-CSRF token stored in an HttpOnly cookie to verify identity upon callback.

### 2. Code Exchange & Channel Discovery
- **Token Endpoint**: `POST https://oauth2.googleapis.com/token`
  - Body: `code`, `client_id`, `client_secret`, `redirect_uri`, `grant_type=authorization_code`
  - Response: `{ access_token, expires_in (3600), refresh_token, token_type: "Bearer" }`
- **Channel Details Discovery**:
  - `GET https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`
  - Header: `Authorization: Bearer {access_token}`
  - Response items:
    - `items[0].id`: Unique YouTube Channel ID (e.g. `UC...`)
    - `items[0].snippet.title`: Channel Title
    - `items[0].snippet.thumbnails.default.url`: Channel Avatar
    - `items[0].snippet.customUrl`: Handle (e.g. `@channelname`)
    - `items[0].statistics.subscriberCount`: Formatted subscriber count

### 3. Token Storage & Encryption
- Store in `social_accounts` table:
  - `user_id`: Authenticated Supabase user ID (`auth.uid()`)
  - `platform`: `'youtube'`
  - `platform_account_id`: `items[0].id`
  - `account_name`: `items[0].snippet.title`
  - `account_avatar_url`: `items[0].snippet.thumbnails.default.url`
  - `encrypted_access_token`: `encryptToken(access_token)`
  - `encrypted_refresh_token`: `encryptToken(refresh_token)`
  - `token_expires_at`: `NOW() + (expires_in - 300) seconds` (5 minute safety buffer)
  - `platform_metadata`: `{ subscriber_count, custom_url, description }`

### 4. Automated Token Refresh Rotation
- Before any YouTube API operation (resumable upload session initialization), the system checks if `token_expires_at <= NOW()`.
- If expired, `src/lib/youtube/token-manager.ts` calls `https://oauth2.googleapis.com/token` with `grant_type=refresh_token`.
- Updates `encrypted_access_token` and `token_expires_at` in `social_accounts`.
