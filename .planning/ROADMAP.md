# Social-Hub: Roadmap (V1 Milestone)

## Milestone 1: Multi-Channel YouTube Video Distribution Platform

```mermaid
flowchart TD
    P1["Phase 1: Project Scaffolding & Apple Design System (Done)"] --> P2["Phase 2: Supabase Auth & Multi-Account Database Schema (Done)"]
    P2 --> P3["Phase 3: YouTube OAuth & Channel Connection Engine (Done)"]
    P3 --> P4["Phase 4: Resumable Video Upload & Streaming Pipeline (Done)"]
    P4 --> P5["Phase 5: Metadata Editor & Scheduled Publishing Engine (Done)"]
    P5 --> P6["Phase 6: Multi-Channel Orchestrator & Activity Dashboard (Done)"]
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
  - [x] `profiles`, `social_accounts`, `video_drafts`, `publish_tasks` tables.
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
- [x] Server-side resumable upload session initializer (`/api/youtube/upload/initiate`).
- [x] Client-side direct-to-Google streaming engine (`ResumableUploader` class).
- [x] Apple-styled media uploader UI:
  - [x] `VideoDropzone` component with preview player and memory lifecycle cleanup.
  - [x] `ThumbnailPicker` component for 16:9 images.

### [x] Phase 5: Metadata Editor & Scheduled Publishing Engine
- [x] YouTube Category dictionary (`src/lib/youtube/categories.ts`) covering 14 standard categories.
- [x] Custom thumbnail attachment route (`/api/youtube/thumbnail/set`) calling YouTube `thumbnails.set`, with graceful handling for unverified channels.
- [x] Rich tag chip editor (`TagInput` component) enforcing 500-char combined limit.
- [x] Scheduled date & time picker (`SchedulePicker` component) with local timezone formatting and ISO 8601 conversion.
- [x] Video draft persistence server actions (`saveVideoDraft`, `getVideoDrafts`, `deleteVideoDraft`).
- [x] Integrated `UploadWizard` with categories, tags, scheduling, and draft saving.

### [x] Phase 6: Multi-Channel Orchestrator & Activity Dashboard
- [x] Multi-Channel selector allowing creators to select multiple destination channels simultaneously.
- [x] Multi-channel dispatch engine (`dispatchMultiChannelUpload`): initiates parallel resumable streaming sessions directly to Google endpoints.
- [x] Real-time progress modal (`UploadProgressModal`) tracking per-channel percentage, upload speeds, YouTube watch links, and errors.
- [x] Publishing history view (`/history`) displaying all past distribution jobs with direct watch links and status badges.
- [x] Real-time overview metrics and recent activity feed on `/dashboard`.
- [x] Production build verified with Next.js 15 App Router across all dynamic and static routes.
