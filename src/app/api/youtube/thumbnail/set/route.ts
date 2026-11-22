import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidAccessToken } from "@/lib/youtube/token-manager";

const YOUTUBE_THUMBNAIL_SET_URL =
  "https://www.googleapis.com/upload/youtube/v3/thumbnails/set";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const videoId = formData.get("videoId") as string;
    const socialAccountId = formData.get("socialAccountId") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (!videoId || !socialAccountId || !thumbnailFile) {
      return NextResponse.json(
        { error: "videoId, socialAccountId, and thumbnail file are required." },
        { status: 400 }
      );
    }

    // 1. Verify channel ownership
    const { data: account, error: accountError } = await supabase
      .from("social_accounts")
      .select("id")
      .eq("id", socialAccountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "Social account not found or access denied." },
        { status: 404 }
      );
    }

    // 2. Obtain fresh access token
    const accessToken = await getValidAccessToken(socialAccountId);

    // 3. Upload thumbnail image bytes directly to YouTube thumbnails.set API
    const imageBytes = Buffer.from(await thumbnailFile.arrayBuffer());
    const mimeType = thumbnailFile.type || "image/jpeg";

    const response = await fetch(`${YOUTUBE_THUMBNAIL_SET_URL}?videoId=${videoId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": mimeType,
      },
      body: imageBytes,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("YouTube thumbnails.set returned status:", response.status, errorText);

      // Gracefully handle unverified channels that cannot upload custom thumbnails
      if (response.status === 403 && errorText.includes("thumbnailUploadForbidden")) {
        return NextResponse.json({
          success: false,
          warning:
            "Custom thumbnail could not be set. YouTube requires channel phone verification to upload custom thumbnails.",
          unverifiedChannel: true,
        });
      }

      return NextResponse.json(
        { error: `Thumbnail upload failed (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      thumbnailUrl: result.items?.[0]?.default?.url || null,
    });
  } catch (error: any) {
    console.error("Error setting custom thumbnail:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
