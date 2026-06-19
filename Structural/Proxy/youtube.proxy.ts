import { RealYouTubeAPI } from "./youtube";
import { YouTubeDownloader } from "./youtube.interface";

export class YouTubeCacheProxy implements YouTubeDownloader {
  private realAPI: RealYouTubeAPI;
  private cache: Record<string, string>;

  constructor(realAPI: RealYouTubeAPI) {
    this.realAPI = realAPI;
    this.cache = {};
  }
  
  public getVideoInfo(id: string): string {
    if (!this.cache[id]) {
      console.log(`[Proxy] Cache miss for ${id}. Delegating to Real API.`);
      this.cache[id] = this.realAPI.getVideoInfo(id);
    } else {
      console.log(`[Proxy] Cache hit! Returning cached data for ${id}.`);
    }
    return this.cache[id];
  }
}
