"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { VideoDraft } from "@/types/database";

/**
 * Saves or updates a video draft in Supabase.
 */
export async function saveVideoDraft(
  draft: Partial<VideoDraft> & { title: string }
): Promise<{ draftId: string | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { draftId: null, error: "Unauthorized" };
    }

    const payload = {
      user_id: user.id,
      title: draft.title,
      description: draft.description || "",
      tags: draft.tags || [],
      category_id: draft.category_id || "22",
      privacy_status: draft.privacy_status || "private",
      made_for_kids: Boolean(draft.made_for_kids),
      scheduled_publish_at: draft.scheduled_publish_at || null,
      thumbnail_url: draft.thumbnail_url || null,
      original_filename: draft.original_filename || null,
      file_size_bytes: draft.file_size_bytes || null,
      updated_at: new Date().toISOString(),
    };

    if (draft.id) {
      // Update existing draft
      const { data, error } = await supabase
        .from("video_drafts")
        .update(payload)
        .eq("id", draft.id)
        .eq("user_id", user.id)
        .select("id")
        .single();

      if (error) throw error;
      revalidatePath("/upload");
      return { draftId: data?.id || draft.id, error: null };
    } else {
      // Insert new draft
      const { data, error } = await supabase
        .from("video_drafts")
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;
      revalidatePath("/upload");
      return { draftId: data?.id || null, error: null };
    }
  } catch (err: any) {
    console.error("Error saving video draft:", err);
    return { draftId: null, error: err?.message || "Failed to save draft" };
  }
}

/**
 * Fetches all video drafts for the current user.
 */
export async function getVideoDrafts(): Promise<VideoDraft[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("video_drafts")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data as VideoDraft[]) || [];
  } catch (err) {
    console.error("Error fetching video drafts:", err);
    return [];
  }
}

/**
 * Deletes a video draft.
 */
export async function deleteVideoDraft(draftId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("video_drafts")
      .delete()
      .eq("id", draftId);

    if (error) throw error;
    revalidatePath("/upload");
    return true;
  } catch (err) {
    console.error("Error deleting draft:", err);
    return false;
  }
}
