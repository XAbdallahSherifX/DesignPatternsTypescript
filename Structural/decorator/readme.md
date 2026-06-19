# TypeScript Decorator Pattern: The Phone Customization System

This repository demonstrates how to implement the Decorator Design Pattern in TypeScript using a dynamic phone pricing and customization system.

## What is the Decorator Pattern?

The Decorator Pattern is a structural design pattern that lets you attach new behaviors or states to objects dynamically by placing them inside special wrapper objects that contain these behaviors.

Instead of relying heavily on standard inheritance—where you might create dozens of subclasses for every possible combination of features (e.g., `GoldenSamsungPhone`, `SilverSamsungPhoneWithScreenProtector`)—the Decorator pattern allows you to stack independent wrappers around a base object. Because the wrappers and the base object share the same interface, the client code interacts with the decorated object exactly as it would the original.

**Common use cases for the Decorator Pattern include:**

* **Data Streams:** Wrapping a basic file reader with a `CompressionDecorator` and then an `EncryptionDecorator` to dynamically change how data is read or written.
* **UI Components:** Adding borders, scrollbars, or drop-shadows to a basic UI panel without altering the panel's core code.
* **Middleware/Networking:** Adding logging, caching, or authentication checks to server requests before they hit the core business logic.
* **Pricing/Customization Systems:** Dynamically calculating the total price of a product with optional add-ons or premium finishes (as seen in this repository).

---

## The Architecture

To understand how this repository works, we look at how the code is divided into four main structural concepts: the Component Interface, the Concrete Component, the Decorators, and the Client Code.

### 1. The Component Interface (`phone.ts`)

The "Component Interface" describes operations that are common to both the base objects and the decorators. This ensures that any decorator can seamlessly replace the base object in the client code.

```typescript
export interface IPhone {
  getPrice(): number;
  getName(): string;
}

```

### 2. The Concrete Component (`phone.ts`)

The "Concrete Component" is the base object being wrapped. It defines the core, default behavior which might be altered by decorators later.

```typescript
export class Phone implements IPhone {
  private name: string;
  private price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  public getPrice(): number {
    return this.price;
  }

  public getName(): string {
    return this.name;
  }
}

```

### 3. The Base & Concrete Decorators (`phone.ts`)

The "Base Decorator" defines the wrapping interface. It holds a reference to a wrapped object and delegates all operations to it. The "Concrete Decorators" extend this base to add their specific behaviors (like adding a premium price markup).

```typescript
// The Base Decorator
export abstract class PhoneDecorator implements IPhone {
  protected wrappedPhone: IPhone;

  constructor(phone: IPhone) {
    this.wrappedPhone = phone;
  }

  public getPrice(): number {
    return this.wrappedPhone.getPrice(); 
  }

  public getName(): string {
    return this.wrappedPhone.getName();
  }
}

// Concrete Decorator 1
export class GoldenPhone extends PhoneDecorator {
  public getPrice(): number {
    return super.getPrice() + 500; 
  }

  public getName(): string {
    return `${super.getName()} (Golden Edition)`;
  }
}

// Concrete Decorator 2
export class SilverPhone extends PhoneDecorator {
  public getPrice(): number {
    return super.getPrice() + 200;
  }
  
  public getName(): string {
    return `${super.getName()} (Silver Edition)`;
  }
}

```

### 4. The Client Code (`customer.ts` & `index.ts`)

The client code (`Customer`) works with all elements strictly through the `IPhone` interface. It doesn't need to know if it is processing a standard phone, a golden phone, or a silver phone wrapped in three layers of accessories.

```typescript
// customer.ts
import { IPhone } from "./phone";

export class Customer {
  private name: string;
  private balance: number;

  constructor(name: string, balance: number) {
    this.name = name;
    this.balance = balance;
  }

  public buyPhone(phone: IPhone): void {
    if (phone.getPrice() > this.balance) {
      throw new Error("Can't buy this phone");
    } else {
      this.balance -= phone.getPrice(); 
      console.log(`Checked out: ${phone.getName()} for $${phone.getPrice()}`);
    }
  }
}

```

The execution (`index.ts`) is where the objects are instantiated and wrapped.

```typescript
// index.ts
import { Customer } from "./customer";
import { Phone, GoldenPhone, SilverPhone } from "./phone";

const customer = new Customer("Abdallah", 2000);

// Create the base component
const basePhone = new Phone("Samsung", 1000);

// Wrap it in a concrete decorator
const goldenPhone = new GoldenPhone(basePhone);

// The customer treats the decorated phone exactly like a base phone
customer.buyPhone(goldenPhone);

```

---

## Why use this approach? (The Magic of the Decorator Pattern)

You might wonder: Why not just create `GoldenPhone` and `SilverPhone` by extending `Phone` directly, or add boolean flags like `isGolden` to the base class?

* **Prevents Class Explosion:** If you have 3 base phones, 4 colors, and 5 accessory types, using standard inheritance would require creating dozens of subclasses (`GoldenSamsungWithCase`, `SilverIPhoneWithHeadphones`, etc.). Decorators allow you to mix and match these features at runtime.
* **Open/Closed Principle:** You can introduce new decorators (like `DiamondPhone` or `ScreenProtector`) without modifying existing code.
* **Single Responsibility Principle:** You can divide a monolithic class that implements many possible variants into several smaller, highly-focused classes.
* **Runtime Flexibility:** Behaviors can be added or removed dynamically while the application is running, rather than being hardcoded at compile-time.

---

## Summary

* **Interfaces** define the common contract that ensures decorators can be substituted for base components without breaking the client.
* **Concrete Components** provide the default, underlying behavior.
* **Decorators** wrap an object, delegate work to it, and execute their own extra logic either before or after the delegation.
* **Client Code** depends only on the interface, remaining totally decoupled from the specific combinations of wrappers being applied.

Use this pattern when you need to assign extra behaviors to objects dynamically without breaking the code that uses these objects, or when extending behaviors via traditional inheritance becomes awkward and bloated.