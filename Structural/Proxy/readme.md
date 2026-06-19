# TypeScript Proxy Pattern: The YouTube API Cache

This repository demonstrates how to implement the Proxy Design Pattern in TypeScript using a custom YouTube video data caching system.

## What is the Proxy Pattern?

The Proxy Pattern is a structural design pattern that lets you provide a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform actions before or after the request reaches the original object, without altering the original object's code.

Instead of your client interacting directly with a resource-heavy object (like a database or a third-party API), it interacts with the proxy. The proxy handles the request, does any necessary side-work (like checking a cache, verifying permissions, or initiating a connection), and then delegates the work to the real object if necessary.

**Common use cases for the Proxy Pattern include:**

* **Caching (Caching Proxy):** Storing the results of expensive network requests or database queries to serve future requests faster (as seen in this repository).
* **Lazy Initialization (Virtual Proxy):** Delaying the creation of a massive, memory-heavy object until the exact moment it is first needed.
* **Access Control (Protection Proxy):** Checking if a client has the proper credentials or permissions before allowing them to execute a method on the real object.
* **Logging Requests (Logging Proxy):** Keeping a history of requests made to the service object without cluttering the service's own business logic.

## The Architecture

To understand how this repository works, we have to look at how the code is divided into four distinct concepts: the Subject Interface, the Real Subject, the Proxy, and the Client Code.

### 1. The Subject Interface (`youtube.interface.ts`)

The "Subject Interface" defines the common contract that both the Real Subject and the Proxy must follow. By implementing this interface, the Proxy ensures it can be passed into any client code that expects the real object.

```typescript
export interface YouTubeDownloader {
  getVideoInfo(id: string): string;
}
```

### 2. The Real Subject (`youtube.ts`)

The "Real Subject" is the actual object doing the heavy lifting. In this case, `RealYouTubeAPI` simulates a resource-intensive network request to fetch video data. This class focuses entirely on its core business logic and knows nothing about caching.

```typescript
import { YouTubeDownloader } from "./youtube.interface";

export class RealYouTubeAPI implements YouTubeDownloader {
  public getVideoInfo(id: string): string {
    console.log(`[Network] Fetching metadata for video ID: ${id}...`);
    return `Video Data for ${id} (Title, Duration, Views)`;
  }
}
```

### 3. The Proxy (`youtube.proxy.ts`)

The "Proxy" implements the same interface as the real object but maintains a reference to it.

When `getVideoInfo` is called, the `YouTubeCacheProxy` intercepts the request. It first checks its internal cache. If the data exists, it returns it immediately (saving time and bandwidth). If it doesn't exist, it delegates the call to the real API, stores the result in the cache, and then returns it.

```typescript
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
```

### 4. The Client Code (`index.ts`)

This is where the user interacts with the system. The client code is programmed to rely entirely on the `YouTubeDownloader` interface. Because of this, it is completely unaware of whether it is interacting with the real API or the caching proxy.

```typescript
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
```

## Why use this approach? (The Magic of the Proxy Pattern)

You might wonder: Why not just put the caching logic directly inside the `RealYouTubeAPI` class?

* **Separation of Concerns:** The `RealYouTubeAPI` only cares about making network requests and formatting data. The `YouTubeCacheProxy` only cares about caching. By keeping these separate, both classes remain small, focused, and easy to test.
* **Open/Closed Principle:** You can introduce new proxies without changing the client code or the `RealYouTubeAPI`. If you later need to add a `LoggingProxy` to track API usage, you simply wrap it around the existing logic without modifying the original source code.
* **Client Transparency:** Because the proxy and the real object share the exact same interface, the client code doesn't need to change. You can seamlessly swap a direct API connection for a cached connection in your dependency injection container.

## Summary

* **Interfaces** (`youtube.interface.ts`) define the contract that makes the proxy and real object interchangeable.
* **Real Subjects** (`youtube.ts`) hold the core business logic or resource-heavy operations.
* **Proxies** (`youtube.proxy.ts`) intercept requests to add lifecycle management, caching, security, or logging before delegating to the real subject.
* **Client Code** (`index.ts`) interacts with the interface, completely unaware of the middleman.

Use this pattern when you need to add utility functions (like caching or access control) to a heavy object, especially when you cannot or should not modify the original object's source code.
