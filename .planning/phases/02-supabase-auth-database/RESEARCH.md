# Phase 2: Research - Supabase Auth & Multi-Account Database Schema

## Objectives
Establish a secure, tenant-isolated data layer with Supabase for multi-platform social media account management, video drafts, and publishing task telemetry, alongside cookie-based Next.js 15 session authentication and Apple-styled auth UI.

## Key Architecture & Research Findings

### 1. Supabase SSR in Next.js 15 (React 19)
- **Async Cookie API**: In Next.js 15, `cookies()` returns a Promise and must be awaited:
  ```typescript
  import { cookies } from "next/headers";
  const cookieStore = await cookies();
  ```
- **SSR Client Factory Pattern**:
  - `src/lib/supabase/client.ts`: Browser client for React Client Components (`createBrowserClient`).
  - `src/lib/supabase/server.ts`: Server client for Server Components, Route Handlers, and Server Actions (`createServerClient` with `getAll` and `setAll` cookie handlers).
  - `src/lib/supabase/admin.ts`: Supabase service-role client bypassing RLS for privileged background operations and token encryption/decryption.
  - `src/middleware.ts`: Synchronizes session state across requests and enforces route protection.

### 2. Multi-Account Database Design
The schema must support connecting N accounts across YouTube, Facebook, and Instagram per user:
- **`social_accounts` Table**:
  - Polymorphic column `platform` (`'youtube' | 'facebook' | 'instagram'`).
  - `user_id` foreign key referencing `profiles(id)`.
  - Encrypted tokens (`encrypted_access_token`, `encrypted_refresh_token`).
  - `platform_metadata`: JSONB column storing channel-specific properties (e.g. YouTube subscriber count, custom channel URL, channel description).
  - Unique constraint on `(user_id, platform, platform_account_id)` to prevent duplicate account links while allowing multiple channels from different Google accounts.
- **`video_drafts` Table**:
  - Stores title, description, tags array, category ID, privacy status, COPPA kids flag, scheduled publish timestamp, thumbnail URL, and file metrics.
- **`publish_tasks` Table**:
  - Bridges a `video_draft` to a target `social_account`.
  - Tracks granular per-channel progress (`status`, `progress_percent`, `platform_video_id`, `platform_video_url`, `error_message`).
- **Row Level Security (RLS)**:
  - Enabled on 100% of tables.
  - Policy: `auth.uid() = user_id` for select, insert, update, delete.
  - Users can never query or publish to other users' connected social accounts.

### 3. Apple-Aesthetic Auth Interface
- Minimalist, centered white canvas card on parchment background (`#f5f5f7`).
- Action Blue `#0066cc` pill buttons (`active:scale-95`).
- Crisp SF Pro typography with inline validation.
- Seamless tab toggle between Sign In and Sign Up.
