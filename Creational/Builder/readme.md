# TypeScript Builder Pattern: The PC Configurator

This repository demonstrates how to implement the Builder Design Pattern in TypeScript using a custom computer configuration system.

## What is the Builder Pattern?

The Builder Pattern is a creational design pattern designed to construct complex objects step by step. It solves the problem of the "telescoping constructor"—an anti-pattern where a class has a massive constructor with dozens of optional parameters, making it incredibly difficult to read and maintain.

Instead of passing a giant list of parameters into a single `new Computer(param1, param2, param3...)` call, you extract the object construction code out of its own class and move it to separate objects called builders.

**Common use cases for the Builder Pattern include:**

* **SQL Query Builders:** Libraries like Knex.js use builders to construct complex SQL queries step-by-step (`.select().from().where()`).
* **Document Generators:** Constructing complex HTML, PDF, or XML documents where nodes and properties need to be appended sequentially.
* **Complex Configurations:** Building objects like HTTP requests, testing mocks, or user profiles where only a subset of dozens of possible properties might be required at any given time.

## The Architecture

To understand how this repository works, we have to look at how the code is divided into three distinct concepts: the Product, the Builder, and the Client Code.

### 1. The Product (`computer.ts`)

The "Product" is the final, complex object being constructed.

Notice that the `Computer` class uses `readonly` properties. Once the computer is built, its hardware configuration shouldn't change. It also features a tightly controlled constructor that accepts a `ComputerBuilder` instance, pulling only the validated data from the builder.

```typescript
import { ComputerBuilder } from "./computer.builder";

export class Computer {
  public readonly computerUsername: string;
  public readonly cpu?: string;
  public readonly gpu?: string;
  public readonly storage?: string;
  public readonly storageSpace?: number;
  public readonly motherBoard?: string;
  public readonly ramSpace?: number;

  constructor(builder: ComputerBuilder) {
    this.computerUsername = builder.getComputerUsername();
    this.cpu = builder.getCpu();
    this.gpu = builder.getGpu();
    this.motherBoard = builder.getMotherBoard();
    this.ramSpace = builder.getRamSpace();
    this.storage = builder.getStorage();
    this.storageSpace = builder.getStorageSpace();
  }
}
```

### 2. The Builder (`computer.builder.ts`)

The "Builder" holds the step-by-step logic required to assemble the product.

It uses private properties to encapsulate state and "fluent" methods (methods that return `this`) to allow method chaining. Finally, it contains the critical `build()` method, which performs any final cross-property validation before finally instantiating the `Computer`.

```typescript
import { Computer } from "./computer";

export class ComputerBuilder {
  private computerUsername: string;
  private cpu?: string;
  private gpu?: string;
  private storage?: string;
  private storageSpace?: number;
  private motherBoard?: string;
  private ramSpace?: number;

  constructor(computerUsername: string) {
    if (!computerUsername || computerUsername.trim() === "") {
      throw new Error("Computer username is required.");
    }
    this.computerUsername = computerUsername;
  }

  public withCpu(cpu: string): this {
    this.cpu = cpu;
    return this;
  }

  public withGpu(gpu: string): this {
    this.gpu = gpu;
    return this;
  }

  public withStorage(storage: string, storageSpace?: number): this {
    this.storage = storage;
    if (storageSpace !== undefined) {
      this.storageSpace = storageSpace;
    }
    return this;
  }

  public withStorageSpace(storageSpace: number): this {
    if (storageSpace < 0) throw new Error("Storage space cannot be negative.");
    this.storageSpace = storageSpace;
    return this;
  }

  public withMotherBoard(motherBoard: string): this {
    this.motherBoard = motherBoard;
    return this;
  }

  public withRamSpace(ramSpace: number): this {
    if (ramSpace <= 0) throw new Error("RAM space must be strictly positive.");
    this.ramSpace = ramSpace;
    return this;
  }

  public build(): Computer {
    if (this.storage && !this.storageSpace) {
      throw new Error("Storage type defined but storage space is missing.");
    }
    
    return new Computer(this);
  }

  public getComputerUsername(): string { return this.computerUsername; }
  public getCpu(): string | undefined { return this.cpu; }
  public getGpu(): string | undefined { return this.gpu; }
  public getStorage(): string | undefined { return this.storage; }
  public getStorageSpace(): number | undefined { return this.storageSpace; }
  public getMotherBoard(): string | undefined { return this.motherBoard; }
  public getRamSpace(): number | undefined { return this.ramSpace; }
}
```

### 3. The Client Code (`index.ts`)

This is where the user interacts with the system. The client never touches the `Computer` constructor directly. Instead, it interacts entirely with the `ComputerBuilder`'s fluent interface, resulting in highly readable, self-documenting code.

```typescript
import { ComputerBuilder } from "./computer.builder";

const computer = new ComputerBuilder("Abdallah")
  .withCpu("Cpu1")
  .withGpu("gpu1")
  .build(); 
  
console.log(computer);
```

## Why use this approach? (The Magic of the Builder Pattern)

You might wonder: Why not just use a standard TypeScript constructor with an optional configuration object (e.g., `new Computer({ cpu: "Cpu1" })`)?

* **Immutability and Encapsulation:** By using the builder, the final `Computer` object can have entirely `readonly` properties. State changes happen inside the builder, but once `build()` is called, the resulting object is safe from unexpected mutations.
* **Complex Validation:** Sometimes validation depends on the presence of multiple properties. For example, if a user specifies a storage type, they must specify a `storageSpace`. The builder's `build()` method gives you a centralized place to validate the entire configuration state before the object is ever created.
* **Fluent Readability:** The `.withGpu().withCpu()` syntax reads like natural language. When building complex test data or large configurations, it drastically reduces cognitive load for developers reading the codebase.

## Summary

* **Products** (`computer.ts`) define the final, immutable object you want to create.
* **Builders** (`computer.builder.ts`) hold the temporary state, validation rules, and the step-by-step methods to construct the product.
* **Client Code** (`index.ts`) wires them together using a clean, readable chain of methods.

Use this pattern when you need to create objects with many possible configuration options, when you want to ensure the final object is immutable, or when object creation involves complex, multi-step validation.
