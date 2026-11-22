# Research: YouTube Data API v3 Resumable Upload & Multi-Account OAuth

## 1. Google OAuth 2.0 Multi-Account Handling
To allow users to connect multiple YouTube channels:
- When initiating the OAuth flow, request:
  - `access_type=offline` (crucial to obtain a `refresh_token`)
  - `prompt=consent` (forces Google to return a `refresh_token` even on re-authorization)
  - `scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly`
- **Channel Identity**:
  - After code exchange, call `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true` using the access token.
  - Returns `items[0].id` (YouTube Channel ID), `items[0].snippet.title` (Channel name), and `items[0].snippet.thumbnails.default.url` (Avatar).
  - Multiple channels belonging to the same user are stored as separate rows in `social_accounts` with `platform = 'youtube'`.
  - When connecting a new channel, the user can select whichever Google account / Brand channel they wish from Google's account chooser.

## 2. Resumable Video Upload Protocol (Direct from Browser)
Uploading directly through a Next.js server consumes server bandwidth and has payload limits. Direct Resumable Upload avoids this:

```
+-----------------------------------------------------------------------------------+
| 1. Client sends metadata to Next.js API (/api/youtube/upload/initiate)            |
| 2. Next.js server calls YouTube API with Channel's Access Token:                  |
|    POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable   |
|    Headers: Authorization: Bearer {access_token}, X-Upload-Content-Type: video/mp4|
|    Body: { snippet: { title, ... }, status: { privacyStatus, ... } }              |
| 3. YouTube returns 200 with 'Location' header: {RESUMABLE_SESSION_URI}            |
| 4. Next.js returns RESUMABLE_SESSION_URI to Client                                |
| 5. Client PUTs video chunks directly to RESUMABLE_SESSION_URI (Google server)     |
| 6. Client receives 200 OK + Video Resource JSON from YouTube                      |
+-----------------------------------------------------------------------------------+
```

### Advantages:
1. Zero server bandwidth consumption.
2. Supports files up to Google's maximum (our app configures 1GB for V1).
3. Client can track native `XMLHttpRequest` or `Fetch` upload progress events with exact byte counts and percentages.
4. If a network interruption occurs, the client can query the session URI (`PUT` with `Content-Range: bytes */{totalLength}`) to find the uploaded byte offset and resume seamlessly.

## 3. Scheduled Publishing via YouTube Data API
YouTube supports scheduling video releases:
- The video's `status.privacyStatus` MUST be set to `private`.
- The `status.publishAt` field is set to an ISO 8601 timestamp (e.g. `2026-12-01T10:00:00.000Z`).
- The channel must be in good standing and phone-verified for scheduling to activate.
- In Social-Hub, when the user toggles "Schedule for later", the privacy status is automatically set to `private` in the API payload with the chosen `publishAt` datetime.

## 4. Quota Consideration
- A standard YouTube Data API project has a default quota of 10,000 units/day.
- A video insert (`videos.insert`) costs **1,600 units**.
- This allows ~6 video uploads per day on the free default quota tier.
- The platform should surface remaining quota guidance and link creators to Google Cloud quota increase requests for high-volume publishing.
