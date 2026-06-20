# TypeScript Iterator Pattern: Seamless Collection Traversal

This repository demonstrates how to implement the Iterator Design Pattern in TypeScript, allowing you to traverse a list of products smoothly while encapsulating the traversal logic.

## What is the Iterator Pattern?

The Iterator Pattern is a behavioral design pattern that lets you sequentially access the elements of a collection without exposing its underlying representation (such as lists, stacks, trees, or graphs).

Instead of manually managing `for` loops and array indexes directly in your main application logic, you extract the traversal behavior into a dedicated "iterator" object. This object assumes responsibility for tracking the current position and providing standard methods to move back and forth.

**Common use cases for the Iterator Pattern include:**

* **Hiding Complex Data Structures:** When you have a complex structure (like a binary tree) but want client code to loop through it as simply as a flat list.
* **Independent Traversals:** When you need multiple, independent loops running over the same collection simultaneously (since each iterator tracks its own state/index).
* **Standardizing Traversal:** Providing a uniform interface for iterating across completely different types of collections in your application.

---

## The Architecture

To understand how this repository works, we can look at the code divided into three distinct roles: The Data Model, The Iterator, and The Client Code.

### 1. The Data Model (`product.ts`)

This represents the specific items being stored in our collection. The `Product` class contains its own data and behavior but knows absolutely nothing about how it is stored or iterated over.

```typescript
export class Product {
  constructor(
    private name: string,
    private price: number
  ) {}

  productInfo() {
    console.log(`This Product (${this.name}) costs $${this.price}`);
  }
}

```

### 2. The Iterator (`iterator.ts`)

The "Iterator" acts as the control mechanism for the collection. It receives the data and maintains its own `index` state. It exposes a clean, standardized interface (`next()`, `prev()`, `start()`, `end()`) so the outside world can retrieve elements without interacting with the raw array directly.

*(Note: The `prev()` method utilizes the prefix decrement `--this.index` to ensure the pointer moves backward before fetching the item, keeping the traversal accurate!)*

```typescript
export class Iterator<T> {
  private data: Array<T>;
  private index: number = 0;

  constructor(data: T[]) {
    this.data = data;
  }

  next() {
    return this.index < this.data.length ? this.data[this.index++] : undefined;
  }
  
  prev() {
    return this.index > 0 ? this.data[--this.index] : undefined;
  }
  
  start() {
    return this.data[(this.index = 0)];
  }
  
  end() {
    return this.data[(this.index = this.data.length - 1)];
  }
}

```

### 3. The Client Code (`index.ts`)

The "Client Code" is where everything is wired together. It creates the raw data, passes it to the Iterator, and safely navigates the collection using only the Iterator's methods.

```typescript
import { Product } from "./product";
import { Iterator } from "./iterator";

// 1. Setup the raw data
const inventory = [
  new Product("Laptop", 1200),
  new Product("Smartphone", 800),
  new Product("Headphones", 150),
  new Product("Monitor", 300)
];

// 2. Instantiate the Iterator
const catalogIterator = new Iterator<Product>(inventory);

// 3. Traverse the collection safely
console.log("--- Moving Forward ---");
let currentProduct = catalogIterator.next();
while (currentProduct) {
  currentProduct.productInfo();
  currentProduct = catalogIterator.next();
}

console.log("\n--- Jumping to Start ---");
const first = catalogIterator.start();
first.productInfo();

console.log("\n--- Moving Backward from End ---");
catalogIterator.end(); // Move index to the end
let previousProduct = catalogIterator.prev();
while (previousProduct) {
  previousProduct.productInfo();
  previousProduct = catalogIterator.prev();
}

```

---

## Why use this approach? (The Magic of the Iterator Pattern)

You might wonder: Why go through this trouble instead of just using `for (let i = 0; i < inventory.length; i++)` directly in `index.ts`?

* **Encapsulation:** The UI or client code pushing the `next()` button doesn't need to know if `this.data` is an Array, a Set, or a custom linked list. If you change how products are stored later, `index.ts` doesn't have to change at all.
* **State Management:** Because the Iterator is an object holding `this.index`, you can pause iteration, pass the Iterator object to a completely different file, and resume exactly where you left off.
* **Cleaner Client Code:** It removes messy index bounds-checking logic (like checking `if (i < array.length)`) from your main business or UI logic, centralizing it inside the Iterator class.

## Summary

* **Data Model** (`product.ts`) holds the individual items that will be placed into the collection.
* **Iterator** (`iterator.ts`) wraps the raw data array and manages the pointer state (`index`), providing simple navigation methods.
* **Client Code** (`index.ts`) ties it all together by associating the data with the iterator and pulling elements one by one without touching the underlying array.

Use this pattern when your collection has a complex data structure under the hood, but you want to provide a simple, flat way for the rest of your app to loop through it!

---