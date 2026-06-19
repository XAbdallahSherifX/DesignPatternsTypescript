# TypeScript Adapter Pattern: Slack Notification Service

This repository demonstrates how to implement the Adapter Design Pattern in TypeScript using a legacy API integration scenario.

## What is the Adapter Pattern?

The Adapter Pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate. It solves the problem of trying to fit a "square peg into a round hole" by introducing a middleman—the adapter—that translates calls from your application's format into a format that a third-party or legacy class can understand.

Think of it like a real-world travel power adapter: if you travel from the US to Europe, your laptop plug won't fit into the wall socket. The travel adapter sits between your plug and the socket, translating the physical interface so your laptop gets power without needing to be completely rebuilt.

**Common use cases for the Adapter Pattern include:**

* **Legacy System Integration:** Wrapping old, deprecated code modules so they can interact with modern, newly written systems.
* **Third-Party Library Wrappers:** Integrating external libraries or APIs (like payment gateways or logging services) without tightly coupling your core business logic to their specific method names.
* **Unified Interfaces:** Aggregating multiple distinct services (e.g., Slack, Email, SMS) under a single, unified method signature so the client code can swap between them seamlessly.

## The Architecture

To understand how this repository works, we have to look at how the code is divided into three distinct concepts: the Adaptee, the Adapter (and its Target Interface), and the Client Code.

### 1. The Adaptee (`adaptee.ts`)

The "Adaptee" is the existing, incompatible class that contains the core functionality you want to use.

In this case, it is a third-party or legacy Slack library. It expects specific method names (`postToChannel`) and parameters (`text`, `heading`) that do not match the standards of our modern application.

```typescript
export class LegacySlackAPI {
  public postToChannel(text: string, heading: string): void {
    console.log(`Posting to Slack -> Heading: '${heading}' | Text: '${text}'`);
  }
}
```

### 2. The Target Interface & Adapter (`adapter.ts`)

This file contains two critical pieces. First, the Target Interface (`NotificationService`). This is the domain-specific standard your existing application relies on.

Second, the Adapter (`SlackNotificationAdapter`). This is the glue. It implements the Target interface but holds a reference to the Adaptee. When the client calls `send()`, the adapter intercepts it and translates it into the `postToChannel()` method that the legacy API expects.

```typescript
import { LegacySlackAPI } from "./adaptee";

export interface NotificationService {
  send(title: string, message: string): void;
}

export class SlackNotificationAdapter implements NotificationService {
  private slackApi: LegacySlackAPI;

  constructor(slackApi: LegacySlackAPI) {
    this.slackApi = slackApi;
  }

  public send(title: string, message: string): void {
    this.slackApi.postToChannel(message, title);
  }
}
```

### 3. The Client Code (`index.ts`)

This is where the application interacts with the system. The client (`notifyAdmin`) is completely oblivious to the existence of the `LegacySlackAPI`. It only knows how to speak to objects that fulfill the `NotificationService` contract.

By wrapping the legacy API inside the adapter, we can pass it to the client code without modifying the client's logic at all.

```typescript
import { LegacySlackAPI } from "./adaptee";
import { NotificationService, SlackNotificationAdapter } from "./adapter";

function notifyAdmin(service: NotificationService): void {
  service.send("System Alert", "The server CPU is at 99%.");
}

const legacyApi = new LegacySlackAPI();
const adapter = new SlackNotificationAdapter(legacyApi);

notifyAdmin(adapter);
```

## Why use this approach? (The Magic of the Adapter Pattern)

You might wonder: Why not just rewrite `LegacySlackAPI` or change the `notifyAdmin` function to accept the legacy class directly?

* **Open/Closed Principle:** You can introduce new adapters into the program without breaking existing client code. If tomorrow you decide to switch from Slack to Discord, you just write a `DiscordNotificationAdapter` and pass it in. The `notifyAdmin` function never has to change.
* **Single Responsibility Principle:** You separate the interface or data conversion code from the primary business logic of the program. The client code handles business rules; the adapter handles translation.
* **Safeguarding the Codebase:** You prevent vendor lock-in and keep third-party code from bleeding all over your core logic. The messy details of the external API are safely encapsulated inside the Adapter.

## Summary

* **Adaptees** (`adaptee.ts`) are the useful but incompatible classes you want to integrate.
* **Target Interfaces** (`adapter.ts`) define the standard your application expects to use.
* **Adapters** (`adapter.ts`) implement the Target Interface and translate requests to the Adaptee.
* **Client Code** (`index.ts`) uses the Target Interface and remains completely isolated from the third-party implementation details.

Use this pattern when you want to use an existing class, but its interface isn't compatible with the rest of your code, or when you want to create a reusable class that cooperates with unrelated or unforeseen classes.
