import { ResumableUploader } from "@/lib/youtube/resumable-uploader";
import { createPublishTasks, updatePublishTask } from "@/app/actions/tasks";
import type { SocialAccount } from "@/types/database";

export interface ChannelUploadProgress {
  channelId: string;
  channelName: string;
  avatarUrl: string | null;
  status: "pending" | "initiating" | "uploading" | "thumbnail" | "published" | "failed";
  percentage: number;
  speedBytesPerSec: number;
  videoId?: string;
  videoUrl?: string;
  error?: string;
}

export type ProgressListener = (progressMap: Record<string, ChannelUploadProgress>) => void;

export interface MultiChannelDispatchConfig {
  videoFile: File;
  thumbnailFile?: File | null;
  targetChannels: SocialAccount[];
  metadata: {
    title: string;
    description: string;
    tags: string[];
    categoryId: string;
    privacyStatus: "public" | "unlisted" | "private";
    madeForKids: boolean;
    scheduledPublishAt?: string | null;
    draftId?: string | null;
  };
  onProgress: ProgressListener;
}

/**
 * Orchestrates direct browser-to-YouTube resumable streaming across multiple channels simultaneously.
 */
export async function dispatchMultiChannelUpload(
  config: MultiChannelDispatchConfig
): Promise<void> {
  const { videoFile, thumbnailFile, targetChannels, metadata, onProgress } = config;

  // Initialize in-memory progress map for all target channels
  const progressMap: Record<string, ChannelUploadProgress> = {};
  for (const channel of targetChannels) {
    progressMap[channel.id] = {
      channelId: channel.id,
      channelName: channel.account_name,
      avatarUrl: channel.account_avatar_url,
      status: "pending",
      percentage: 0,
      speedBytesPerSec: 0,
    };
  }
  onProgress({ ...progressMap });

  // 1. Create task records in Supabase to track publishing telemetry
  const { tasks } = await createPublishTasks({
    draftId: metadata.draftId || null,
    channelIds: targetChannels.map((c) => c.id),
  });

  const taskIdMap: Record<string, string> = {};
  for (const t of tasks) {
    taskIdMap[t.social_account_id] = t.id;
  }

  // 2. Upload to all target channels in parallel
  const uploadPromises = targetChannels.map(async (channel) => {
    const taskId = taskIdMap[channel.id];

    try {
      // Step A: Initiate session with Google
      progressMap[channel.id].status = "initiating";
      onProgress({ ...progressMap });

      const initRes = await fetch("/api/youtube/upload/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialAccountId: channel.id,
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: metadata.categoryId,
          privacyStatus: metadata.privacyStatus,
          madeForKids: metadata.madeForKids,
          scheduledPublishAt: metadata.scheduledPublishAt || null,
          fileSize: videoFile.size,
          mimeType: videoFile.type || "video/mp4",
        }),
      });

      if (!initRes.ok) {
        const errJson = await initRes.json();
        throw new Error(errJson.error || `Failed to initiate upload session (${initRes.status})`);
      }

      const { uploadUrl } = await initRes.json();

      // Step B: Stream video file directly to Google Resumable URI
      progressMap[channel.id].status = "uploading";
      onProgress({ ...progressMap });

      if (taskId) {
        await updatePublishTask(taskId, {
          status: "uploading",
          progress_percent: 0,
        });
      }

      const uploader = new ResumableUploader();
      const result = await uploader.upload(videoFile, uploadUrl, (prog) => {
        progressMap[channel.id].percentage = prog.percentage;
        progressMap[channel.id].speedBytesPerSec = prog.speedBytesPerSec;
        onProgress({ ...progressMap });

        if (taskId && prog.percentage % 20 === 0) {
          updatePublishTask(taskId, { progress_percent: prog.percentage });
        }
      });

      const videoId = result.videoId;
      const videoUrl = result.videoUrl;

      // Step C: If custom thumbnail provided, attach it via thumbnails.set
      if (thumbnailFile && videoId) {
        progressMap[channel.id].status = "thumbnail";
        onProgress({ ...progressMap });

        try {
          const thumbFormData = new FormData();
          thumbFormData.append("videoId", videoId);
          thumbFormData.append("socialAccountId", channel.id);
          thumbFormData.append("thumbnail", thumbnailFile);

          await fetch("/api/youtube/thumbnail/set", {
            method: "POST",
            body: thumbFormData,
          });
        } catch (thumbErr) {
          console.warn(`Thumbnail upload failed for channel ${channel.account_name}:`, thumbErr);
        }
      }

      // Step D: Mark complete
      progressMap[channel.id].status = "published";
      progressMap[channel.id].percentage = 100;
      progressMap[channel.id].videoId = videoId;
      progressMap[channel.id].videoUrl = videoUrl;
      onProgress({ ...progressMap });

      if (taskId) {
        await updatePublishTask(taskId, {
          status: "published",
          progress_percent: 100,
          platform_video_id: videoId,
          platform_video_url: videoUrl,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error(`Upload failed for channel ${channel.account_name}:`, err);
      progressMap[channel.id].status = "failed";
      progressMap[channel.id].error = err?.message || "Upload failed";
      onProgress({ ...progressMap });

      if (taskId) {
        await updatePublishTask(taskId, {
          status: "failed",
          error_message: err?.message || "Upload failed",
        });
      }
    }
  });

  await Promise.all(uploadPromises);
}
