export type Platform = "youtube" | "facebook" | "instagram";
export type PrivacyStatus = "public" | "unlisted" | "private";
export type PublishTaskStatus = "pending" | "uploading" | "processing" | "published" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  platform_account_id: string; // e.g. YouTube Channel ID
  account_name: string; // e.g. Channel Title
  account_avatar_url: string | null;
  encrypted_access_token: string;
  encrypted_refresh_token: string | null;
  token_expires_at: string | null;
  platform_metadata: {
    subscriber_count?: string;
    custom_url?: string;
    description?: string;
    [key: string]: unknown;
  };
  is_active: boolean;
  connected_at: string;
  updated_at: string;
}

export interface VideoDraft {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tags: string[];
  category_id: string;
  privacy_status: PrivacyStatus;
  made_for_kids: boolean;
  scheduled_publish_at: string | null;
  thumbnail_url: string | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
}

export interface PublishTask {
  id: string;
  user_id: string;
  draft_id: string | null;
  social_account_id: string;
  status: PublishTaskStatus;
  progress_percent: number;
  platform_video_id: string | null;
  platform_video_url: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}
