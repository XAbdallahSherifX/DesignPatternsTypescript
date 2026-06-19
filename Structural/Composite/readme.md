# TypeScript Composite Pattern: The Product Box System

This repository demonstrates how to implement the Composite Design Pattern in TypeScript using a nested packaging and pricing system.

## What is the Composite Pattern?

The Composite Pattern is a structural design pattern that allows you to compose objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects and compositions of objects uniformly.

Instead of writing complex client code that has to check whether it's dealing with a simple object or a complex container of objects, the Composite pattern gives them both a shared interface. When you call a method on a composite object, it simply delegates the request down the tree to all of its children, returning the aggregated result.

**Common use cases for the Composite Pattern include:**

* **File Systems:** Treating individual files and nested directories exactly the same way when calculating total file size or searching for a name.
* **UI Components:** Rendering complex graphical interfaces where a "Window" contains "Panels," which contain "Buttons" and "Text Inputs," all sharing a generic `render()` method.
* **Menu Systems:** Building navigation menus where a menu item might be a simple link or a dropdown containing further sub-menus.
* **Packaging and Pricing:** Calculating the total weight or price of an order where boxes can contain single items, as well as smaller boxes filled with more items (as seen in this repository).

## The Architecture

To understand how this repository works, we have to look at how the code is divided into four distinct concepts: the Component Interface, the Leaf, the Composite, and the Client Code.

### 1. The Component Interface (`product.ts`)

The "Component Interface" describes operations that are common to both simple and complex elements of the tree. By implementing this interface, the Composite ensures it can be passed into any client code that expects a standard item.

```typescript
export interface IProduct {
  getPrice: () => number;
}
```

### 2. The Leaf (`product.ts`)

The "Leaf" is the basic building block of the tree. It doesn't have any children. Because they represent the bottom of the hierarchy, leaf objects do the actual work or hold the actual value.

```typescript
export class Product implements IProduct {
  private name: string;
  private price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  public getPrice(): number {
    return this.price;
  }
}
```

### 3. The Composite (`box.ts`)

The "Composite" (or container) is an element that has sub-elements: leaves or other containers. It doesn't know the exact concrete classes of its children; it works with all of them via the component interface.

When `getPrice()` is called, the Box doesn't have a static price of its own. Instead, it iterates over all its children, asks for their prices, and sums them up.

```typescript
import { IProduct } from "./product.ts";

export class Box implements IProduct {
  private readonly name: string;
  private products: IProduct[];

  constructor(name: string, products: IProduct[] = []) {
    this.name = name;
    // We create a shallow copy to prevent external mutation leaks
    this.products = [...products];
  }

  // Child management methods
  public add(product: IProduct): void {
    this.products.push(product);
  }

  public remove(product: IProduct): void {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  // The core interface implementation
  public getPrice(): number {
    return this.products.reduce((acc, current) => acc + current.getPrice(), 0);
  }
}
```

### 4. The Client Code (`index.ts`)

This is where the user interacts with the system. The client code works with all elements through the `IProduct` interface. As a result, the client can calculate the price of an incredibly complex, deeply nested order using a single method call.

```typescript
import { Box } from "./box.ts";
import { Product } from "./product.ts";

// Create simple leaf products
const phone = new Product("Phone", 1000);
const charger = new Product("Charger", 50);
const headphones = new Product("Headphones", 200);
const receipt = new Product("Paper Receipt", 1);

// Create a small box containing accessories
const accessoriesBox = new Box("Accessories Box", [charger, headphones]);

// Create the main shipping box containing the phone, the receipt, AND the accessories box
const mainShippingBox = new Box("Main Shipping Box", [phone, receipt, accessoriesBox]);

console.log("Client: Calculating total price of the main shipping box...");

// The client simply calls getPrice() once. It doesn't need to know about the nested structure.
console.log(`Total Price: $${mainShippingBox.getPrice()}`);
```

## Why use this approach? (The Magic of the Composite Pattern)

You might wonder: Why not just use `instanceof` checks to see if an item is an array/box and write a recursive loop in the client code?

* **Uniformity:** The client doesn't need to care whether it's talking to a single `Product` or a giant `Box` containing a thousand items. The interface is identical. This strips away complex if/else statements from your business logic.
* **Recursive Delegation:** The pattern naturally leverages recursion. A box asks its children for their prices. If a child is a box, it asks its children, and so on. The math resolves itself elegantly down the tree.
* **Open/Closed Principle:** You can introduce new element types into the app (e.g., a `DiscountedBundle` or `GiftCard`) without breaking existing client code, as long as the new classes implement the `IProduct` interface.

## Summary

* **Interfaces** (`product.ts`) define the contract that makes simple objects and containers interchangeable.
* **Leaves** (`product.ts`) do the actual work and represent the bottom-tier items that hold real values.
* **Composites** (`box.ts`) manage child components and delegate the heavy lifting to them, aggregating the results.
* **Client Code** (`index.ts`) interacts with the tree through the interface, completely unaware of the structural complexity hidden beneath it.

Use this pattern when your core model can be represented as a tree structure (part-whole hierarchy), and you want your client code to treat single objects and groupings of objects identically.
