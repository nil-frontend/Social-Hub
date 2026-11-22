export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
  speedBytesPerSec: number;
}

export type ProgressCallback = (progress: UploadProgress) => void;

export interface UploadResult {
  videoId: string;
  videoUrl: string;
  rawResponse: Record<string, any>;
}

/**
 * ResumableUploader handles client-side direct-to-Google streaming
 * for YouTube video uploads using XMLHttpRequest.
 * 
 * Streams bytes directly to Google's upload session URI, bypassing the application
 * server completely and supporting files up to several gigabytes.
 */
export class ResumableUploader {
  private xhr: XMLHttpRequest | null = null;
  private isAborted: boolean = false;
  private lastLoaded: number = 0;
  private lastTime: number = 0;

  /**
   * Uploads a video file directly to the Google Resumable Session URI.
   */
  public upload(
    file: File,
    uploadUrl: string,
    onProgress?: ProgressCallback
  ): Promise<UploadResult> {
    this.isAborted = false;
    this.lastLoaded = 0;
    this.lastTime = Date.now();

    return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      // Track byte-level progress
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const now = Date.now();
            const timeDiff = (now - this.lastTime) / 1000; // in seconds
            let speed = 0;

            if (timeDiff > 0.5) {
              const loadedDiff = event.loaded - this.lastLoaded;
              speed = Math.round(loadedDiff / timeDiff);
              this.lastLoaded = event.loaded;
              this.lastTime = now;
            }

            const percentage = Math.min(
              100,
              Math.max(0, Math.round((event.loaded / event.total) * 100))
            );

            onProgress({
              percentage,
              loaded: event.loaded,
              total: event.total,
              speedBytesPerSec: speed,
            });
          }
        };
      }

      xhr.onload = () => {
        if (this.isAborted) {
          reject(new Error("Upload was cancelled."));
          return;
        }

        // Google returns HTTP 200 or 201 upon successful upload completion
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText);
            const videoId = response.id;
            const videoUrl = `https://youtu.be/${videoId}`;

            if (onProgress) {
              onProgress({
                percentage: 100,
                loaded: file.size,
                total: file.size,
                speedBytesPerSec: 0,
              });
            }

            resolve({
              videoId,
              videoUrl,
              rawResponse: response,
            });
          } catch (parseError) {
            reject(new Error("Upload finished but failed to parse YouTube response."));
          }
        } else if (xhr.status === 308) {
          // 308 Resume Incomplete (partial chunk saved, waiting for remaining bytes)
          reject(new Error("Upload incomplete (HTTP 308). Chunk resume required."));
        } else {
          let errorMessage = `Google upload failed with status ${xhr.status}`;
          try {
            const errObj = JSON.parse(xhr.responseText);
            if (errObj.error?.message) {
              errorMessage = errObj.error.message;
            }
          } catch {
            if (xhr.responseText) {
              errorMessage = xhr.responseText.slice(0, 200);
            }
          }
          reject(new Error(errorMessage));
        }
      };

      xhr.onerror = () => {
        if (this.isAborted) {
          reject(new Error("Upload was cancelled."));
        } else {
          reject(new Error("Network connection error during video upload."));
        }
      };

      xhr.onabort = () => {
        reject(new Error("Upload was cancelled."));
      };

      // Stream file directly to Google
      xhr.send(file);
    });
  }

  /**
   * Cancels the active upload stream.
   */
  public abort(): void {
    this.isAborted = true;
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
  }
}
