import { RealYouTubeAPI } from "./youtube";
import { YouTubeDownloader } from "./youtube.interface";
import { YouTubeCacheProxy } from "./youtube.proxy";

function clientCode(api: YouTubeDownloader) {
  console.log("Client: Requesting video 'dQw4w9WgXcQ'");
  console.log(api.getVideoInfo("dQw4w9WgXcQ"));

  console.log("\nClient: Requesting video 'dQw4w9WgXcQ' again");
  console.log(api.getVideoInfo("dQw4w9WgXcQ"));
}

console.log("--- Executing without Proxy ---");
const realAPI = new RealYouTubeAPI();
clientCode(realAPI);

console.log("\n--- Executing with Proxy ---");
const proxyAPI = new YouTubeCacheProxy(realAPI);
clientCode(proxyAPI);
