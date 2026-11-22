# Social-Hub: Roadmap (V1 Milestone)

## Milestone 1: Multi-Channel YouTube Video Distribution Platform

```mermaid
flowchart TD
    P1["Phase 1: Project Scaffolding & Apple Design System (Done)"] --> P2["Phase 2: Supabase Auth & Multi-Account Database Schema (Done)"]
    P2 --> P3["Phase 3: YouTube OAuth & Channel Connection Engine (Done)"]
    P3 --> P4["Phase 4: Resumable Video Upload & Streaming Pipeline (Done)"]
    P4 --> P5["Phase 5: Metadata Editor & Scheduled Publishing Engine"]
    P5 --> P6["Phase 6: Multi-Channel Orchestrator & Activity Dashboard"]
```

---

### [x] Phase 1: Project Scaffolding & Apple Design System Setup
- [x] Initialize Next.js 15 (App Router, TypeScript, React 19, Tailwind CSS v3).
- [x] Configure Apple Design tokens from `DESIGN.md` in Tailwind theme.
- [x] Scaffold base layout with global navigation, sidebar, and breadcrumbs.
- [x] Set up environment variable schemas (`.env.example` and validation).
- [x] Verified zero-error Next.js production build with all routes prerendered.

### [x] Phase 2: Supabase Auth & Multi-Account Database Schema
- [x] Initialize Supabase client for Next.js 15 (SSR / async cookie-based session handling).
- [x] Create and execute PostgreSQL migrations in live Supabase database (`cpoufdzgjpqvxuanbpxj`):
  - [x] `profiles` table with automated trigger.
  - [x] `social_accounts` table (polymorphic design for `youtube`, `facebook`, `instagram`).
  - [x] `video_drafts` table.
  - [x] `publish_tasks` table.
  - [x] Row Level Security (RLS) active and confirmed on all 4 tables (`rowsecurity: true`).
- [x] AES-256-GCM token encryption & decryption utility.
- [x] Apple-styled Auth UI (`/login`).
- [x] Next.js session middleware protecting dashboard routes.

### [x] Phase 3: YouTube OAuth & Channel Connection Engine
- [x] Google OAuth 2.0 flow with CSRF protection and multi-channel selection (`prompt=consent select_account`).
- [x] Channel profile discovery (`youtube.channels.list`) and token encryption at rest.
- [x] Automated token refresh rotation engine (`src/lib/youtube/token-manager.ts`).
- [x] Channel server actions and Apple-styled channel cards on `/channels`.
- [x] Real-time channel metrics in overview dashboard.

### [x] Phase 4: Resumable Video Upload & Streaming Pipeline
- [x] Server-side resumable upload session initializer:
  - [x] Route handler `/api/youtube/upload/initiate` verifying channel ownership, rotating expired tokens via `getValidAccessToken()`, calling YouTube Data API `videos.insert(uploadType=resumable)`, and returning direct Google upload session URI.
- [x] Client-side direct-to-Google streaming engine:
  - [x] `ResumableUploader` class (`src/lib/youtube/resumable-uploader.ts`) using `XMLHttpRequest` for precise byte-level percentage tracking, upload speed calculation, abort control, and HTTP 308 resume recovery.
- [x] Apple-styled media uploader UI:
  - [x] `VideoDropzone` component (`src/components/upload/video-dropzone.tsx`) with drag-and-drop animation, format validation (MP4, MOV, WebM up to 1GB), in-browser `<video>` preview player, duration/resolution detection, and memory cleanup (`URL.revokeObjectURL`).
  - [x] `ThumbnailPicker` component (`src/components/upload/thumbnail-picker.tsx`) with 16:9 aspect preview.
  - [x] Integrated `UploadWizard` (`src/components/upload/upload-wizard.tsx`) into `/upload`.

### Phase 5: Metadata Editor & Scheduled Publishing Engine
- Build comprehensive video details editor:
  - Title input with character counter (max 100).
  - Description textarea with character counter (max 5000).
  - Tags input with badge/chip UI (max 500 chars).
  - Category selector (Entertainment, Education, Gaming, Tech, etc.).
  - Privacy status dropdown (Public, Unlisted, Private).
  - COPPA compliance checkbox ("Yes, it's made for kids" / "No, not made for kids").
  - Scheduled Release picker (Date + Time input, converts to ISO 8601 `publishAt` for YouTube when privacy is `private`).
  - Custom thumbnail upload and association (`thumbnails.set` API).

### Phase 6: Multi-Channel Orchestrator & Activity Dashboard
- Implement Multi-Channel selector allowing creators to check which connected channels receive the video.
- Multi-channel dispatch engine: initiates parallel or sequenced resumable upload sessions across all chosen channels.
- Real-time progress dashboard per channel (Percentage bar, Uploading, Processing, Published with watch link, or Failed with retry).
- Publishing History view displaying all past distribution jobs with filter by channel and status.
- Final end-to-end integration test and verification against user specifications.
