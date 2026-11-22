# Phase 4: Research - Resumable Video Upload & Streaming Pipeline

## Objectives
Design and implement the high-performance Direct Browser-to-YouTube Resumable Upload protocol. The browser streams multi-gigabyte video bytes directly to Google's YouTube upload infrastructure via an authorized session URI, eliminating server bandwidth costs, memory leaks, and payload size limitations.

## Key Technical Specifications

### 1. YouTube Resumable Upload Protocol (v3)

```
[Browser Client]               [Next.js Server]              [Google YouTube API]
       |                              |                                |
       |--- 1. Initiate Upload ------>|                                |
       |    (metadata, channelId,     |                                |
       |     fileSize, mimeType)      |--- 2. videos.insert ---------->|
       |                              |    (uploadType=resumable,      |
       |                              |     Bearer <token>)            |
       |                              |<-- 3. HTTP 200 + Location -----|
       |                              |       (Resumable Session URI)  |
       |<-- 4. Return Session URI ----|                                |
       |                                                               |
       |=================== 5. Stream Video Bytes ====================>|
       |    (Direct PUT to Google Session URI with chunked progress)   |
       |                                                               |
       |<================== 6. HTTP 200 + Video Resource ==============|
       |                       ({ id: "video_id", ... })               |
```

### 2. Session Initialization (`POST /api/youtube/upload/initiate`)
- **Endpoint**: Next.js Route Handler protected by Supabase session.
- **Payload**:
  - `socialAccountId`: Target YouTube channel UUID in `social_accounts`.
  - `title`: Video title.
  - `description`: Video description.
  - `privacyStatus`: `'public' | 'unlisted' | 'private'`.
  - `madeForKids`: Boolean (COPPA compliance).
  - `tags`: Array of string keywords.
  - `categoryId`: YouTube category ID (default: `'22'`).
  - `scheduledPublishAt`: Optional ISO 8601 timestamp (only when privacy is `'private'`).
  - `fileSize`: Total file size in bytes.
  - `mimeType`: `'video/mp4' | 'video/quicktime' | 'video/webm'`.
- **Google API Call**:
  - `POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`
  - Headers:
    - `Authorization: Bearer {fresh_access_token}`
    - `Content-Type: application/json; charset=UTF-8`
    - `X-Upload-Content-Length: {fileSize}`
    - `X-Upload-Content-Type: {mimeType}`
  - Extract `location` header: returns the unique Google session URI.

### 3. Direct Client-to-Google Streaming (`XMLHttpRequest`)
- We use `XMLHttpRequest` instead of `fetch` because `xhr.upload.onprogress` provides real-time byte progress:
  ```typescript
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent, event.loaded, event.total);
    }
  };
  ```
- **Error Recovery (HTTP 308 Resume Incomplete)**:
  If a network interruption occurs during upload:
  1. Client sends an empty `PUT` request to the session URI with `Content-Range: bytes */{totalSize}`.
  2. Google responds with status `308 Resume Incomplete` and a `Range: bytes=0-{lastByte}` header.
  3. Client slices the remaining file `file.slice(lastByte + 1)` and continues upload seamlessly.

### 4. Apple-Aesthetic File Picker & Media Player
- Drag-and-drop target zone matching Apple's parchment/canvas surface and subtle dashed hairline border.
- Video preview player (`<video>`) generating an in-memory `URL.createObjectURL(file)` to inspect playback, video duration, and resolution before submitting.
- Formats allowed: `video/mp4`, `video/quicktime` (`.mov`), `video/webm`.
- Size constraint: Up to 1GB (`1,073,741,824` bytes).
