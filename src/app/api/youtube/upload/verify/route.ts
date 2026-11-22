import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uploadUrl, fileSize, taskId } = await request.json();

    if (!uploadUrl) {
      return NextResponse.json({ error: "uploadUrl is required" }, { status: 400 });
    }

    // Query Google's resumable session status by sending Content-Range: bytes */fileSize
    const googleRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": "0",
        "Content-Range": `bytes */${fileSize || 0}`,
      },
    });

    // Google returns HTTP 200 or 201 when the video upload has finished successfully
    if (googleRes.status === 200 || googleRes.status === 201) {
      const data = await googleRes.json();
      const videoId = data.id;
      const videoUrl = videoId ? `https://youtu.be/${videoId}` : undefined;

      // Update task record in Supabase
      if (taskId && videoId) {
        await supabase
          .from("publish_tasks")
          .update({
            status: "published",
            progress_percent: 100,
            platform_video_id: videoId,
            platform_video_url: videoUrl,
            error_message: null,
            completed_at: new Date().toISOString(),
          })
          .eq("id", taskId);
      }

      return NextResponse.json({
        verified: true,
        videoId,
        videoUrl,
      });
    }

    return NextResponse.json({
      verified: false,
      status: googleRes.status,
    });
  } catch (error: any) {
    console.error("Error verifying Google upload session:", error);
    return NextResponse.json(
      { error: error?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
