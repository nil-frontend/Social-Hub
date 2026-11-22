"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SocialAccount } from "@/types/database";

/**
 * Fetches all connected social accounts for the authenticated user.
 */
export async function getConnectedChannels(): Promise<SocialAccount[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_accounts")
    .select("*")
    .order("connected_at", { ascending: false });

  if (error) {
    console.error("Error fetching social accounts:", error);
    return [];
  }

  return (data as SocialAccount[]) || [];
}

/**
 * Disconnects (deletes) a connected channel from the user's workspace.
 */
export async function disconnectChannel(channelId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("social_accounts")
    .delete()
    .eq("id", channelId);

  if (error) {
    console.error("Error disconnecting channel:", error);
    throw new Error("Failed to disconnect channel");
  }

  revalidatePath("/channels");
  revalidatePath("/dashboard");
  revalidatePath("/upload");
}

/**
 * Toggles a channel's active state.
 */
export async function toggleChannelActive(channelId: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("social_accounts")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", channelId);

  if (error) {
    console.error("Error toggling channel active state:", error);
    throw new Error("Failed to update channel state");
  }

  revalidatePath("/channels");
  revalidatePath("/upload");
}
