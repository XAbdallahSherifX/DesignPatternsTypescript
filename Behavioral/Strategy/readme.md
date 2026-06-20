# TypeScript Strategy Pattern: The Dynamic Payment Processor

This repository demonstrates how to implement the Strategy Design Pattern in TypeScript using a flexible payment processor that can seamlessly switch between different payment methods at runtime.

## What is the Strategy Pattern?

The Strategy Pattern is a behavioral design pattern that allows you to define a family of algorithms (or behaviors), encapsulate each one into a separate class, and make their objects interchangeable.

Instead of implementing a single algorithm directly within a monolithic class, the main class delegates the execution to a "strategy" object. This transformation allows the core code to remain unchanged even as you add, remove, or modify the underlying strategies.

**Common use cases for the Strategy Pattern include:**

* **Payment Processing:** (As seen in this repository) Handling various payment gateways (PayPal, Stripe, Credit Card) where the checkout process is the same, but the transaction logic differs.
* **Navigation & Routing:** Calculating routes for different modes of transportation (driving, walking, cycling) on a map application.
* **Sorting & Filtering:** Applying different sorting algorithms (MergeSort, QuickSort) or data filters dynamically based on user preferences or dataset sizes.
* **File Compression:** Allowing a user to save a file in different formats (ZIP, RAR, TAR) through a unified interface.

---

## The Architecture

To understand how this repository works, we can look at the code divided into four distinct roles: The Strategy Interface, The Concrete Strategies, The Context, and The Client Code.

### 1. The Strategy Interface (`strategy.interface.ts`)

The "Strategy Interface" defines the common contract that all concrete strategies must follow. It guarantees to the Context that no matter which strategy is plugged in, it will always have a specific method available to call. In our case, every payment method must implement `pay`.

```typescript
export interface Strategy {
  pay: (amount: number) => void;
}

```

### 2. The Concrete Strategies (`strategies.ts`)

The "Concrete Strategies" contain the actual, distinct business logic. They implement the `Strategy` interface. Notice that they do not care about the surrounding application context; they only focus on doing their specific job.

```typescript
import { Strategy } from "./strategy.interface";

export class CreditCard implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Credit Card`);
  }
}

export class Paypal implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Paypal`);
  }
}

export class DebitCard implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Debit Card`);
  }
}

```

### 3. The Context (`payment-processor.ts`)

The "Context" (`PaymentProcessor`) is the class that requires the interchangeable behaviors. It does not implement the algorithms itself. Instead, it maintains a reference to a `Strategy` object and exposes a setter method to change that strategy at runtime.

When it is time to perform the action, it simply delegates the work to the currently active strategy.

```typescript
import { Strategy } from "./strategy.interface";

export class PaymentProcessor {
  private strategy: Strategy | undefined;

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  processPayment(amount: number) {
    if (!this.strategy) throw new Error("No strategy provided");
    
    // The Context delegates the work to the Strategy
    this.strategy.pay(amount);
  }
}

```

### 4. The Client Code (`index.ts`)

The "Client Code" ties everything together. It handles the logic of deciding *which* strategy to use, instantiates the concrete strategy, and passes it to the context.

```typescript
import { PaymentProcessor } from "./payment-processor";
import { CreditCard, DebitCard, Paypal } from "./strategies";

// 1. Create the Context
const paymentProcessor = new PaymentProcessor();

// 2. Decide on the behavior (often comes from user input or configuration)
const strategy: string = "Debit";

switch (strategy) {
  case "Debit":
    paymentProcessor.setStrategy(new DebitCard());
    break;

  case "Credit":
    paymentProcessor.setStrategy(new CreditCard());
    break;

  case "Paypal":
    paymentProcessor.setStrategy(new Paypal());
    break;
}

// 3. Execute the behavior through the Context
paymentProcessor.processPayment(100); // Output: paying 100$ through Debit Card

```

---

## Why use this approach? (The Magic of the Strategy Pattern)

You might wonder: Why create all these separate files and classes instead of just putting a massive `switch` statement inside `PaymentProcessor.processPayment()`?

* **Open/Closed Principle:** The core `PaymentProcessor` is open for extension but closed for modification. If you need to add "Apple Pay" tomorrow, you don't have to touch the `PaymentProcessor` class at all. You simply create a new `ApplePay` class and pass it in.
* **Elimination of Conditional Logic:** By moving the behavior into separate classes, you avoid bloating your Context class with massive, hard-to-read `if/else` or `switch` blocks handling different edge cases for every single payment type.
* **Runtime Flexibility:** You can seamlessly swap the strategy object while the application is running, allowing the behavior of the `PaymentProcessor` to change dynamically based on user choices.
* **Testability:** You can easily write unit tests for `Paypal` or `CreditCard` in isolation without needing to set up the entire `PaymentProcessor` and its dependencies.

## Summary

* **Strategy Interface** (`strategy.interface.ts`) establishes the contract (`pay`) that all strategies must obey.
* **Concrete Strategies** (`strategies.ts`) implement the interface to provide the distinct algorithms (`CreditCard`, `Paypal`, `DebitCard`).
* **Context** (`payment-processor.ts`) maintains a reference to a strategy and delegates the actual work to it, remaining ignorant of the concrete implementation details.
* **Client Code** (`index.ts`) is responsible for selecting the appropriate concrete strategy and configuring the context.