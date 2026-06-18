# TypeScript Singleton Patterns: Module Caching vs. Classic OOP

This repository demonstrates two distinct ways to implement the **Singleton Pattern** in TypeScript.

## What is the Singleton Pattern?

The Singleton is a foundational software design pattern that restricts the instantiation of a class to **one single instance**. It also provides a global point of access to that instance throughout your entire application.

**Common use cases for Singletons include:**

* **Database Connections:** You typically only want one connection pool managing database interactions, rather than opening a new connection every time a file needs data.

* **Configuration Managers:** Loading configuration variables (like environment variables) once and sharing them globally.

* **Logging Services:** A centralized logger that handles writing logs to a file or external service without stepping on its own toes.

* **State Management:** Holding application-level state (like a user's session data) that needs to be accessed by various disconnected components.

While both approaches below achieve the goal of ensuring only one `Dog` exists, they do so using entirely different mechanics.

## Approach 1: The Module Caching Singleton (Idiomatic JS/TS)

This approach creates a standard class and exports an **instance** of that class directly.

### The Code (`approach1.ts`)

```typescript
class Dog {
  private name: string | undefined;

  public getName(): string | undefined {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }
}

export default new Dog();
```

### How it works in JavaScript (The Magic of Module Caching)

To understand why this is a true Singleton, you have to look at how JavaScript engines (like Node.js or browsers using ES Modules) handle file imports under the hood.

1. **First Import:** When `approach1.ts` is imported for the very first time anywhere in your app, the JavaScript engine executes the code in the file top-to-bottom. It creates the `Dog` class and executes `new Dog()`.

2. **The Cache:** The engine then takes that resulting `Dog` object and **caches** it in memory associated with that file path.

3. **Subsequent Imports:** If file B, file C, and file D all import `approach1.ts`, the engine *does not* run the file again. Instead, it immediately returns the exact same cached object reference.

If file B calls `dog.setName("Rex")`, and file C calls `dog.getName()`, file C will receive `"Rex"` because they are looking at the exact same space in memory.

### Why this is the preferred approach for JavaScript/TypeScript

1. **It's Native and Idiomatic:** It leverages built-in language features (module caching) rather than recreating patterns designed for older languages (like Java or C++).

2. **Less Boilerplate:** There is no need to write static variables, private constructors, or `getInstance()` methods. The code is much cleaner, leaner, and easier to read.

3. **Easier Testing:** In testing frameworks like Jest, it is incredibly easy to mock module imports. Resetting the internal static state of a classic Singleton class between test runs can be highly frustrating; module mocking solves this natively.

## Approach 2: The Classic "GoF" Singleton (Strict OOP)

This approach follows the traditional "Gang of Four" (GoF) object-oriented design pattern. It forces the class to manage its own lifecycle.

### The Code (`approach2.ts`)

```typescript
class Dog {
  private name: string | undefined;

  // 1. Hold a private static reference to the single instance
  private static instance: Dog;

  // 2. Make the constructor private to prevent 'new Dog()' outside the class
  private constructor() {}

  // 3. Provide a global, static getter method
  public static getInstance() {
    if (!Dog.instance) {
      Dog.instance = new Dog();
    }
    return Dog.instance;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }
}
```

### How it works

Instead of relying on the file system, the class enforces the rule itself:

1. The `constructor` is marked as `private`. If another developer tries to type `new Dog()` in another file, the TypeScript compiler will throw an error.

2. To get the dog, you must call the static method: `Dog.getInstance()`.

3. **Lazy Initialization:** Notice that `new Dog()` isn't actually called until the very first time `getInstance()` is invoked. If the application runs and nobody ever asks for the Dog, the Dog is never created.

### When to use this approach

While slightly more verbose in JS/TS, this approach is useful if:

* **You need strict lazy initialization:** If creating the instance is extremely heavy on memory or CPU, and you only want to allocate those resources at the exact moment it is needed (not when the file is first parsed).

* **You are in an OOP-heavy environment:** If you are working with a team deeply accustomed to traditional OOP design patterns (coming from Java/C# backgrounds), this pattern will be instantly recognizable to them.

## Summary

* For **95% of your TypeScript/JavaScript projects**, use **Approach 1**. It is elegant, relies on native module caching, and results in highly readable code.

* Use **Approach 2** if you have a strict architectural requirement for lazy initialization or if your team prefers traditional Object-Oriented paradigms.
