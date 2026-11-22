# Social-Hub: Requirements Matrix (V1)

## 1. Authentication & User Management (AUTH)
- [ ] **AUTH-01**: User sign-up, email verification, and login using Supabase Auth.
- [ ] **AUTH-02**: Session management with Next.js middleware and protected route redirection (`/dashboard`, `/channels`, `/upload`, `/history`).
- [ ] **AUTH-03**: Secure logout and user profile display.

## 2. Multi-Account YouTube Integration (CHAN)
- [ ] **CHAN-01**: Google OAuth 2.0 integration requesting `https://www.googleapis.com/auth/youtube.upload` and `https://www.googleapis.com/auth/youtube.readonly` scopes.
- [ ] **CHAN-02**: Ability to connect multiple YouTube channels under a single user workspace (including distinct Google accounts).
- [ ] **CHAN-03**: Fetch and store channel metadata (Channel ID, Channel Title, Avatar, Subscriber count) in Supabase.
- [ ] **CHAN-04**: Secure storage of OAuth access tokens and refresh tokens with automated token refresh when access tokens expire.
- [ ] **CHAN-05**: Channel disconnect / revoke action and active status toggling.

## 3. Video Upload Engine (UPL)
- [ ] **UPL-01**: Drag-and-drop file uploader accepting MP4, MOV, and WebM files up to 1GB.
- [ ] **UPL-02**: Client-side video validation (file type, size limits, video duration preview).
- [ ] **UPL-03**: Optional custom thumbnail image uploader (JPEG/PNG up to 2MB).
- [ ] **UPL-04**: Direct Browser-to-YouTube Resumable Upload protocol implementation:
  - Next.js API route initializes YouTube Resumable Upload session for each target channel using its refreshed access token.
  - Returns authenticated resumable upload URIs to client.
  - Client streams video chunks directly to Google YouTube servers.
  - Client handles byte-level retry on network hiccups.

## 4. Video Metadata & Scheduling (META)
- [ ] **META-01**: Video Title (required, max 100 characters).
- [ ] **META-02**: Video Description (optional, max 5000 characters).
- [ ] **META-03**: Video Tags / Keywords input (comma separated or chip input, max 500 characters total).
- [ ] **META-04**: Privacy Status selector: `public`, `unlisted`, `private`.
- [ ] **META-05**: YouTube COPPA compliance selector: "Made for Kids" (`true` / `false`).
- [ ] **META-06**: Scheduled Publishing: Date and time picker for future release (passes `status.publishAt` ISO 8601 string when privacy is set to `private`).
- [ ] **META-07**: Category selection (Entertainment, Gaming, Education, How-to, Music, etc.).

## 5. Multi-Channel Publishing & Orchestration (PUB)
- [ ] **PUB-01**: Channel selector allowing selection of 1, some, or all connected channels for a single upload job.
- [ ] **PUB-02**: Multi-channel concurrent upload execution with independent progress tracking per channel.
- [ ] **PUB-03**: Post-upload processing status check with YouTube Data API.
- [ ] **PUB-04**: Thumbnail upload dispatch to YouTube API (`thumbnails.set`) after video upload finishes.
- [ ] **PUB-05**: Real-time progress feedback with status badges (`Pending`, `Uploading X%`, `Processing`, `Published`, `Failed`).

## 6. History & Activity Logs (HIST)
- [ ] **HIST-01**: Publishing history dashboard displaying past distribution jobs.
- [ ] **HIST-02**: Detailed view showing target channel, publish timestamp, status, and direct YouTube video link (`https://youtu.be/{videoId}`).
- [ ] **HIST-03**: Error logging for failed uploads with actionable error messages and retry option.

## 7. UI / Design System Compliance (UI)
- [ ] **UI-01**: Implement Apple Design System tokens from `DESIGN.md`:
  - Color palette: Action Blue (`#0066cc`), Canvas (`#ffffff`), Parchment (`#f5f5f7`), Near-Black Ink (`#1d1d1f`).
  - Typography: SF Pro font stack with negative letter-spacing for headlines and 17px body copy.
  - Buttons: Capsule / full-pill CTAs (`rounded-full`) with active state micro-interaction (`scale-95`).
  - Cards: Soft hairline borders (`#e0e0e0` / `rgba(0,0,0,0.08)`), rounded corners (`rounded-2xl`), museum-quality whitespace.
- [ ] **UI-02**: Fully responsive layout across desktop, tablet, and mobile.
