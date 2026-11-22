"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PublishTask, PublishTaskStatus } from "@/types/database";

export interface PublishTaskWithDetails extends PublishTask {
  channel_name: string;
  channel_avatar_url: string | null;
  video_title: string;
}

/**
 * Creates pending publishing task records in Supabase for each destination channel.
 */
export async function createPublishTasks(params: {
  draftId?: string | null;
  channelIds: string[];
}): Promise<{ tasks: { id: string; social_account_id: string }[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tasks: [], error: "Unauthorized" };
    }

    const { draftId, channelIds } = params;

    const taskInserts = channelIds.map((channelId) => ({
      user_id: user.id,
      draft_id: draftId || null,
      social_account_id: channelId,
      status: "pending" as PublishTaskStatus,
      progress_percent: 0,
    }));

    const { data, error } = await supabase
      .from("publish_tasks")
      .insert(taskInserts)
      .select("id, social_account_id");

    if (error) throw error;

    revalidatePath("/history");
    revalidatePath("/dashboard");

    return {
      tasks: (data as { id: string; social_account_id: string }[]) || [],
      error: null,
    };
  } catch (err: any) {
    console.error("Error creating publish tasks:", err);
    return { tasks: [], error: err?.message || "Failed to create publish tasks" };
  }
}

/**
 * Updates progress and status of an active publishing task.
 */
export async function updatePublishTask(
  taskId: string,
  update: {
    status?: PublishTaskStatus;
    progress_percent?: number;
    platform_video_id?: string;
    platform_video_url?: string;
    error_message?: string;
    completed_at?: string;
  }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("publish_tasks")
      .update(update)
      .eq("id", taskId);

    if (error) {
      console.error("Error updating publish task:", error);
    }
  } catch (err) {
    console.error("Exception updating publish task:", err);
  }
}

/**
 * Fetches all publishing tasks with joined channel and draft details for current user.
 */
export async function getPublishHistory(): Promise<PublishTaskWithDetails[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("publish_tasks")
      .select(`
        *,
        social_accounts (
          account_name,
          account_avatar_url
        ),
        video_drafts (
          title
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      draft_id: row.draft_id,
      social_account_id: row.social_account_id,
      status: row.status,
      progress_percent: row.progress_percent,
      platform_video_id: row.platform_video_id,
      platform_video_url: row.platform_video_url,
      error_message: row.error_message,
      started_at: row.started_at,
      completed_at: row.completed_at,
      created_at: row.created_at,
      channel_name: row.social_accounts?.account_name || "YouTube Channel",
      channel_avatar_url: row.social_accounts?.account_avatar_url || null,
      video_title: row.video_drafts?.title || "Untitled Video",
    }));
  } catch (err) {
    console.error("Error fetching publish history:", err);
    return [];
  }
}

/**
 * Fetches overview metrics for the dashboard.
 */
export async function getPublishStats(): Promise<{
  totalPublished: number;
  totalScheduled: number;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { totalPublished: 0, totalScheduled: 0 };

    const { count: publishedCount, data: publishedData } = await supabase
      .from("publish_tasks")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("status", "published");

    const { count: scheduledCount, data: scheduledData } = await supabase
      .from("video_drafts")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .not("scheduled_publish_at", "is", null);

    return {
      totalPublished: publishedCount ?? publishedData?.length ?? 0,
      totalScheduled: scheduledCount ?? scheduledData?.length ?? 0,
    };
  } catch (err) {
    console.error("Error fetching publish stats:", err);
    return { totalPublished: 0, totalScheduled: 0 };
  }
}
