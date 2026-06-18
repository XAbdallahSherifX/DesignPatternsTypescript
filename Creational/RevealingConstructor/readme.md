# TypeScript Revealing Constructor Pattern: The Configuration Manager

This repository demonstrates how to implement the Revealing Constructor Design Pattern in TypeScript using a secure configuration management system.

## What is the Revealing Constructor Pattern?

The Revealing Constructor Pattern is a creational design pattern designed to construct objects that require complex, flexible initialization but must remain strictly immutable and encapsulated once created.

It solves a very specific problem: How do you allow an object's state to be mutated during its creation phase, without exposing dangerous `set` methods to the public API once the object is fully instantiated?

Instead of exposing public setters, the constructor accepts an "executor" function. The constructor runs this executor immediately, passing it private, scoped mutation functions. Once the executor finishes, the object is locked down.

**Common use cases for the Revealing Constructor Pattern include:**

* **Promises:** The most famous example in JavaScript/TypeScript is the Promise object (`new Promise((resolve, reject) => { ... })`). The resolve and reject functions are only available during instantiation.
* **Configuration Managers:** Building environment or application configurations that must be populated initially but never altered during runtime.
* **Read-Only Data Stores:** Caches or state containers that are populated during a specific setup phase and then frozen.

## The Architecture

To understand how this repository works, we can look at the code through two distinct lenses: The Configuration Class and the Client Code.

### 1. The Product (`config.ts`)

This is the class that encapsulates our state.

Notice that the `Configuration` class does not have a public set method. Instead, the constructor accepts an executor callback. Inside the constructor, we define the `set` function and pass it into the executor. As soon as the executor finishes running, we call `Object.freeze(this)` to completely lock the instance, preventing any further modifications.

```typescript
export class Configuration {
  private settings: Array<{ key: string; value: number | boolean | string }> = [];

  constructor(executor: (set: (key: string, value: number | boolean | string) => void) => void) {
    const set = (key: string, value: number | boolean | string) => {
      this.settings.push({ key, value });
    };
    
    // Execute the user's setup logic, handing them the private 'set' function
    executor(set);
    
    // Lock down the object so it can never be mutated again
    Object.freeze(this);
  }

  getKey(key: string) {
    return this.settings.find((element) => element.key === key);
  }

  getAll() {
    return this.settings;
  }
}
```

### 2. The Client Code (`index.ts`)

This is where the user interacts with the system. The client instantiates the `Configuration` object and provides the executor function inline. They get temporary access to the `set` function, but once this block of code is done executing, they have no way to alter the configuration.

```typescript
import { Configuration } from "./config";

const config = new Configuration((set) => {
  set("Port", 3000);
  set("EnableLogging", true);
  set("Environment", "production");
});

console.log(config.getAll());

// config.set(...) // Error: 'set' does not exist on type 'Configuration'
// config.settings.push(...) // Error: Property 'settings' is private, and object is frozen
```

## Why use this approach? (The Magic of the Revealing Constructor Pattern)

You might wonder: Why not just pass a plain configuration object into the constructor (e.g., `new Configuration({ Port: 3000 })`)?

* **Strict Encapsulation of Mutators:** The `set` function is entirely scoped to the constructor's callback. It doesn't pollute the class's public interface. The object is fundamentally incapable of mutating itself after creation.
* **Complex Initialization Logic:** Unlike passing a static object, the executor function allows the client to run complex logic (loops, conditionals, or data fetching) during the creation phase before the object is finalized.
* **Guaranteed Immutability:** Because of the architecture, we know exactly when the initialization phase ends. This allows us to safely call `Object.freeze(this)`, guaranteeing that the resulting object is 100% immutable for the rest of its lifecycle.

## Summary

* **The Class** (`config.ts`) encapsulates the internal state and limits mutation to a tightly controlled initialization window.
* **The Executor** is the callback function provided by the client, which receives temporary, exclusive access to private mutators (like `set`).
* **Client Code** (`index.ts`) defines the setup logic seamlessly without ever gaining long-term access to alter the object's state.

Use this pattern when you need to construct objects that require dynamic or programmatic setup, but must be completely read-only and immutable throughout the rest of your application's lifecycle.
