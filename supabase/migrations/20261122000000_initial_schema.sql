-- ==============================================================================
-- Social-Hub Initial Schema Migration
-- Polymorphic multi-channel social accounts, video drafts, and publishing tasks
-- ==============================================================================

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically create a profile record when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Social Accounts Table (Supports multiple accounts for YouTube, Facebook, Instagram)
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('youtube', 'facebook', 'instagram')),
    platform_account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_avatar_url TEXT,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    platform_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_platform_account UNIQUE (user_id, platform, platform_account_id)
);

-- 3. Video Drafts Table
CREATE TABLE IF NOT EXISTS public.video_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    category_id TEXT DEFAULT '22',
    privacy_status TEXT NOT NULL DEFAULT 'private' CHECK (privacy_status IN ('public', 'unlisted', 'private')),
    made_for_kids BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_publish_at TIMESTAMPTZ,
    thumbnail_url TEXT,
    original_filename TEXT,
    file_size_bytes BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Publish Tasks Table (Per-channel distribution telemetry)
CREATE TABLE IF NOT EXISTS public.publish_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    draft_id UUID REFERENCES public.video_drafts(id) ON DELETE SET NULL,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploading', 'processing', 'published', 'failed')),
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    platform_video_id TEXT,
    platform_video_url TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes for fast dashboard and task queries
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_platform ON public.social_accounts(user_id, platform);
CREATE INDEX IF NOT EXISTS idx_video_drafts_user_id ON public.video_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_publish_tasks_user_status ON public.publish_tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_publish_tasks_account_id ON public.publish_tasks(social_account_id);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_tasks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Social Accounts Policies
CREATE POLICY "Users can view their own social accounts" 
    ON public.social_accounts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts" 
    ON public.social_accounts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" 
    ON public.social_accounts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" 
    ON public.social_accounts FOR DELETE 
    USING (auth.uid() = user_id);

-- Video Drafts Policies
CREATE POLICY "Users can manage their own video drafts" 
    ON public.video_drafts FOR ALL 
    USING (auth.uid() = user_id);

-- Publish Tasks Policies
CREATE POLICY "Users can manage their own publish tasks" 
    ON public.publish_tasks FOR ALL 
    USING (auth.uid() = user_id);
