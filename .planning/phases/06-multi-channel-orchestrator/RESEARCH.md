# Phase 6: Research - Multi-Channel Upload Orchestrator & Publishing History

## Objectives
Unify the video upload pipeline into an end-to-end multi-channel distribution engine. When a creator clicks "Distribute Video", the engine orchestrates simultaneous or sequential direct uploads to all selected YouTube channels, tracks per-channel percentage progress in real-time, persists task telemetry in Supabase, and provides a publishing history dashboard with direct YouTube watch links.

## Key Technical Specifications

### 1. Multi-Channel Dispatch Architecture

```
User clicks "Distribute to N Channels"
               |
               v
1. Create Draft & Publish Tasks in Supabase (status: 'pending')
               |
               v
2. For each selected channel in parallel (or concurrency pool):
   a. POST /api/youtube/upload/initiate -> receives Google Resumable URI
   b. Updates Supabase task: status = 'uploading', progress = 0%
   c. Instantiates ResumableUploader -> streams video bytes directly to Google
   d. Emits real-time progress events -> updates local UI progress bar & task telemetry
   e. Receives YouTube videoId & watch URL (https://youtu.be/{videoId})
   f. If custom thumbnail provided:
      POST /api/youtube/thumbnail/set -> attaches thumbnail image
   g. Updates Supabase task: status = 'published', progress = 100%, completed_at = NOW()
               |
               v
3. Modal displays completion summary with clickable YouTube watch links
```

### 2. Task Telemetry Schema Integration (`publish_tasks`)
The `publish_tasks` table records:
- `id`: Task UUID
- `user_id`: Authenticated creator
- `draft_id`: Associated video draft
- `social_account_id`: Destination channel ID
- `status`: `'pending' | 'uploading' | 'processing' | 'published' | 'failed'`
- `progress_percent`: `0 - 100`
- `platform_video_id`: YouTube video ID (e.g. `dQw4w9WgXcQ`)
- `platform_video_url`: Direct link (`https://youtu.be/{videoId}`)
- `error_message`: Actionable error string if failed
- `started_at` & `completed_at`: Timestamps

### 3. Apple-Styled Progress Modal & History Table
- **Modal Overlay**: `backdrop-blur-md bg-black/40` overlay with centered rounded-2xl canvas card.
- **Per-Channel Row**:
  - Channel avatar & title.
  - Animated Action Blue progress bar (`bg-apple-blue h-2 rounded-full transition-all duration-200`).
  - Metric readout: `64% • 4.2 MB/s`.
  - Done state: Emerald checkmark with "Watch on YouTube" pill button.
- **Publish History Page (`/history`)**:
  - Filterable by channel and status (`All`, `Published`, `Failed`).
  - Clean card/table view with channel badges, publish date, video title, and external watch link.
