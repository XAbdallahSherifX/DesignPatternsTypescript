import { YouTubeDownloader } from "./youtube.interface";

export class RealYouTubeAPI implements YouTubeDownloader {
  public getVideoInfo(id: string): string {
    console.log(`[Network] Fetching metadata for video ID: ${id}...`);
    return `Video Data for ${id} (Title, Duration, Views)`;
  }
}
