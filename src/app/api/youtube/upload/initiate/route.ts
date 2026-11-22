import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getValidAccessToken } from "@/lib/youtube/token-manager";

const YOUTUBE_RESUMABLE_UPLOAD_INIT_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      socialAccountId,
      title,
      description = "",
      privacyStatus = "private",
      madeForKids = false,
      tags = [],
      categoryId = "22",
      scheduledPublishAt = null,
      fileSize,
      mimeType = "video/mp4",
    } = body;

    if (!socialAccountId || !title || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: socialAccountId, title, and fileSize are required." },
        { status: 400 }
      );
    }

    // 1. Verify channel belongs to authenticated user
    const { data: account, error: accountError } = await supabase
      .from("social_accounts")
      .select("id, platform, account_name")
      .eq("id", socialAccountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "Social account not found or access denied." },
        { status: 404 }
      );
    }

    // 2. Obtain fresh, unexpired access token
    const accessToken = await getValidAccessToken(socialAccountId);

    // 3. Construct YouTube Data API v3 metadata payload
    // Note: When scheduling with publishAt, privacyStatus MUST be "private"
    const isScheduled = Boolean(scheduledPublishAt);
    const videoStatus: Record<string, any> = {
      privacyStatus: isScheduled ? "private" : privacyStatus,
      selfDeclaredMadeForKids: Boolean(madeForKids),
    };

    if (isScheduled && scheduledPublishAt) {
      videoStatus.publishAt = new Date(scheduledPublishAt).toISOString();
    }

    const videoSnippet = {
      title: title.slice(0, 100), // Max 100 chars
      description: description.slice(0, 5000), // Max 5000 chars
      tags: Array.isArray(tags) ? tags.slice(0, 50) : [],
      categoryId: String(categoryId),
    };

    // 4. Request Resumable Upload Session URI from Google
    const initResponse = await fetch(YOUTUBE_RESUMABLE_UPLOAD_INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": String(fileSize),
        "X-Upload-Content-Type": mimeType,
      },
      body: JSON.stringify({
        snippet: videoSnippet,
        status: videoStatus,
      }),
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error("YouTube Resumable Upload init failed:", initResponse.status, errorText);
      return NextResponse.json(
        { error: `Google YouTube API error (${initResponse.status}): ${errorText}` },
        { status: initResponse.status }
      );
    }

    // Extract the direct Google session URI from the Location response header
    const uploadUrl = initResponse.headers.get("location");

    if (!uploadUrl) {
      return NextResponse.json(
        { error: "Google did not return an upload session location header." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      uploadUrl,
      socialAccountId,
      channelName: account.account_name,
    });
  } catch (error: any) {
    console.error("Error in /api/youtube/upload/initiate:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
