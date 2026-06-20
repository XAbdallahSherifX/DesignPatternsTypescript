# TypeScript Chain of Responsibility Pattern: The Support Ticketing System

This repository demonstrates how to implement the Chain of Responsibility Design Pattern in TypeScript using a tiered support request system.


## What is the Chain of Responsibility Pattern?

The Chain of Responsibility Pattern is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request itself or to pass it to the next handler in the chain.

Instead of writing massive `if/else` or `switch` statements in your client code to determine which class should handle a specific task, you link your processing objects into a chain. The client simply hands the request to the first object in the chain, and the system figures out the rest dynamically.

**Common use cases for the Chain of Responsibility Pattern include:**

* **Support/Escalation Systems:** Routing a customer ticket from Tier 1 (Basic) to Tier 2 (Technical), and finally to Tier 3 (Management) as seen in this repository.
* **Middleware Pipelines:** In web frameworks (like Express.js), requests pass through a chain of middleware functions for authentication, logging, and data parsing before reaching the final route handler.
* **Event Bubbling:** In user interfaces, if a specific button doesn't know how to handle a "click" event, it passes the event up the chain to its parent container until something catches it.

---

## The Architecture

To understand how this repository works, we can look at the code divided into three distinct concepts: The Base Handler, The Concrete Handlers, and The Client Code.

### 1. The Base Handler (`handler.ts`)

The "Base Handler" defines the common interface for handling requests and manages the boilerplate logic for linking the chain together. It holds a reference to the `nextHandler`. If a subclass decides it cannot handle the request, it calls `super.handle()`, which seamlessly delegates the request to the next link in the chain.

```typescript
export abstract class Handler {
  private nextHandler: Handler | undefined;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Returning the handler allows us to chain the setup: a.setNext(b).setNext(c)
    return handler;
  }

  public handle(request: string): void {
    if (this.nextHandler) {
      this.nextHandler.handle(request);
    } else {
      console.log(`[System] Unhandled request: '${request}'. No suitable handler found.`);
    }
  }
}

```

### 2. The Concrete Handlers (`support.ts`)

The "Concrete Handlers" contain the actual business logic. Each class is focused on one specific type of request.

When `handle` is called, the handler checks if it meets the criteria to process the request. If it does, it does the work and the execution stops. If it doesn't, it delegates the decision to the parent class (`super.handle`), which passes it along the chain.

```typescript
import { Handler } from "./handler.ts";

export class BasicHandler extends Handler {
  handle(request: string): void {
    if (request === "basic") {
      console.log("[Basic Support] Successfully handled the request.");
    } else {
      super.handle(request); // Pass to the next handler
    }
  }
}

export class TechnicalHandler extends Handler {
  handle(request: string): void {
    if (request === "technical") {
      console.log("[Technical Support] Successfully handled the request.");
    } else {
      super.handle(request); 
    }
  }
}

export class ManagerHandler extends Handler {
  handle(request: string): void {
    if (request === "manager") {
      console.log("[Manager Support] Successfully handled the request.");
    } else {
      super.handle(request); 
    }
  }
}

```

### 3. The Client Code (`index.ts`)

The client code has two responsibilities: it links the handlers together into a logical chain, and then it submits requests to the *start* of the chain. Because of this structure, the client code doesn't need to know which specific handler will eventually resolve the request.

```typescript
import { BasicHandler, ManagerHandler, TechnicalHandler } from "./support.ts";

const basicHandler = new BasicHandler();
const technicalHandler = new TechnicalHandler();
const managerHandler = new ManagerHandler();

// Wire the chain: Basic -> Technical -> Manager
basicHandler.setNext(technicalHandler).setNext(managerHandler);

const req1 = "basic";
const req2 = "technical";
const req3 = "manager";
const req4 = "unknown";

console.log("--- Sending requests to the support chain ---");
basicHandler.handle(req1);
basicHandler.handle(req2);
basicHandler.handle(req3);
basicHandler.handle(req4);

```

---

## Why use this approach? (The Magic of the Chain of Responsibility)

You might wonder: Why not just use a `switch` statement in `index.ts` to route the requests?

* **Decoupling:** The client sending the request (`index.ts`) has no idea *which* object will ultimately process it. It just hands the ticket to the front desk (`basicHandler`) and trusts the system.
* **Single Responsibility Principle:** Each handler is small, focused, and only cares about its specific criteria. `TechnicalHandler` doesn't need to know how `BasicHandler` works.
* **Open/Closed Principle:** You can introduce new handlers without modifying existing code. If you want to add an `ExecutiveHandler` above the `ManagerHandler`, you simply write the new class and update the wiring in `index.ts`. You don't have to touch any of the existing support classes.
* **Dynamic Reconfiguration:** You can change the order of the chain at runtime. Depending on the day or system load, you could easily rewire it so that `technicalHandler` comes first!

## Summary

* **Base Handler** (`handler.ts`) manages the boilerplate of linking objects together and delegating unhandled requests.
* **Concrete Handlers** (`support.ts`) execute the specific business logic if the request matches their criteria.
* **Client Code** (`index.ts`) constructs the chain and passes requests to the entry point, remaining blissfully unaware of how the routing works under the hood.

Use this pattern when your program needs to process a variety of requests in various ways, but you don't know the exact types of requests or their sequences ahead of time.