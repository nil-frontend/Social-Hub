# Phase 5: Research - Metadata Editor, Categories, Custom Thumbnails & Scheduling

## Objectives
Provide creators with full control over YouTube video presentation metadata, including category assignment, tag management, COPPA compliance, scheduled publishing (`publishAt`), and custom thumbnail attachment via the YouTube Data API v3 `thumbnails.set` protocol.

## Key Technical Specifications

### 1. YouTube Video Categories
YouTube categorizes videos using integer category IDs (`snippet.categoryId`). The standard categories supported in the US/Global region:
| ID | Category Name | Typical Use |
|---|---|---|
| `1` | Film & Animation | Short films, animations, trailers |
| `2` | Autos & Vehicles | Car reviews, automotive |
| `10` | Music | Music videos, tracks |
| `15` | Pets & Animals | Animal videos |
| `17` | Sports | Highlights, sports commentary |
| `20` | Gaming | Gameplay, game trailers, walkthroughs |
| `22` | People & Blogs | Vlogs, lifestyle, personal creators (Default) |
| `23` | Comedy | Sketches, standup, humor |
| `24` | Entertainment | Shows, podcasts, viral videos |
| `25` | News & Politics | Current events, journalism |
| `26` | Howto & Style | Tutorials, crafts, beauty, fashion |
| `27` | Education | Explanatory videos, lectures |
| `28` | Science & Technology | Coding, tech reviews, engineering |

### 2. Video Tags & Keyword Optimization
- YouTube accepts an array of strings in `snippet.tags`.
- Character limit: Maximum 500 characters total across all tags combined (including commas).
- Individual tags should be lowercase/trimmed, stripped of special punctuation.

### 3. COPPA (Children's Online Privacy Protection Act)
- YouTube requires every upload to explicitly declare audience:
  - `status.selfDeclaredMadeForKids`: `true` or `false`.
  - If `true`, YouTube disables comments, personalized ads, and notifications for the video.
  - Social-Hub defaults to `false` with a clear toggle and explanation.

### 4. Scheduled Publishing via `status.publishAt`
- **Condition**: In the YouTube Data API, `status.privacyStatus` **MUST** be `'private'` when scheduling.
- **Timestamp**: `status.publishAt` must be an ISO 8601 string (e.g. `2026-11-25T14:30:00.000Z`).
- The scheduled time must be at least 15 minutes in the future.
- When the target timestamp arrives, YouTube automatically switches the video from private to public on the creator's channel.

### 5. Custom Thumbnail Upload Protocol (`thumbnails.set`)
- **Endpoint**: `POST https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={videoId}`
- **Headers**:
  - `Authorization: Bearer {fresh_access_token}`
  - `Content-Type: image/jpeg` or `image/png`
- **Body**: Raw image bytes (up to 2MB).
- **Graceful Error Handling**:
  - YouTube accounts that have not completed phone verification cannot upload custom thumbnails (returns 403 `forbidden` with reason `thumbnailUploadForbidden`).
  - Social-Hub catches this specific error gracefully: the video upload succeeds, and the UI displays an informative notice explaining that phone verification on YouTube is required for custom thumbnails.
