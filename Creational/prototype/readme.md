# TypeScript Prototype Pattern: Shallow vs. Deep Copying

This repository demonstrates how to properly implement the Prototype Pattern in TypeScript, handling both simple primitive data and complex nested objects.

## What is the Prototype Pattern?

The Prototype Pattern is a creational design pattern that allows an object to create a duplicate (or clone) of itself. Instead of relying on external code to piece together a new object by reading the original's properties, the object delegates the cloning process to itself.

**Common use cases for Prototypes include:**

* **State History (Undo/Redo):** Saving snapshots of an object's state before mutating it, allowing you to easily roll back changes.
* **Game Entities:** Spawning hundreds of identical enemies based on a single "template" object, rather than constructing each from scratch.
* **Complex Configurations:** Taking a heavy, default configuration object and cloning it to make minor tweaks for specific user sessions.

While duplicating an object sounds simple, TypeScript's Object-Oriented nature requires us to handle clones carefully to preserve class methods and prevent shared memory bugs.

---

## Approach 1: The Basic Prototype (Primitive Types)

This approach is used when your class only contains primitive data types (`strings`, `numbers`, `booleans`).

### The Code (`approach1.ts`)

```typescript
class Cat {
  private name: string;
  private weight: number;

  constructor(name: string, weight: number) {
    this.name = name;
    this.weight = weight;
  }

  public getName() { return this.name; }
  public setName(name: string) { this.name = name; }

  public clone(): Cat {
    return new Cat(this.name, this.weight);
  }
}

const originalCat = new Cat("Whiskers", 10);
const clonedCat = originalCat.clone();
```

### How it works

When the `clone` method is called, the object takes its current state and passes it directly into its own constructor. Because strings and numbers are primitive types, they are copied *by value*. The new cat has its own entirely separate data in memory.

### Why this is the preferred approach for OOP

Unlike using native tools like `structuredClone()` on the entire class—which strips away methods and ruins the prototype chain—using the `new` keyword guarantees that the cloned object is a true instance of its class. All methods are preserved, and TypeScript maintains strict type safety.

---

## Approach 2: The Deep Copy Prototype (Complex Types)

If your class grows to contain reference types (arrays, plain objects, or instances of other classes), Approach 1 is no longer sufficient. Passing an array directly into a new instance creates a **Shallow Copy**, where both the original and the clone share the exact same array in memory. Mutating one will mutate the other.

### The Code (`approach2.ts`)

```typescript
class Owner {
  constructor(public name: string) {}
  
  public clone(): Owner {
    return new Owner(this.name);
  }
}

class ComplexCat {
  private name: string;
  private toys: string[];
  private details: { age: number };
  private owner: Owner;

  constructor(name: string, toys: string[], details: { age: number }, owner: Owner) {
    this.name = name;
    this.toys = toys;
    this.details = details;
    this.owner = owner;
  }

  public clone(): ComplexCat {
    return new ComplexCat(
      this.name,
      [...this.toys],
      structuredClone(this.details),
      this.owner.clone()
    );
  }
}
```

### How it works

Instead of sharing memory addresses, the clone method manually provisions new memory space for every single reference type to achieve a true **Deep Copy**:

* **Arrays:** The spread syntax (`...`) creates a brand new array. Adding a toy to the cloned cat will no longer affect the original cat.
* **Plain Objects:** We use `structuredClone()` (or the classic `JSON.parse(JSON.stringify())` trick) to create a completely detached clone of the data object. This instantly destroys any memory references.
* **Other Classes:** When your class relies on another class instance, you delegate the cloning to that dependency by calling its own `clone` method.

---

## Summary

* For classes with **primitive data only**, use **Approach 1**. Simply return a new instance of the class. It is fast, clean, and perfectly safe.
* Use **Approach 2** the moment you introduce **reference types**. Always remember to break memory references using the spread operator, `structuredClone()`, or by cascading clone calls down to child classes.
