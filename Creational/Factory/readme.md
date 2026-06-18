# TypeScript Factory Method Pattern: The Enemy Spawner

This repository demonstrates how to implement the Factory Method Pattern in TypeScript using a video game enemy spawning system.

## What is the Factory Method Pattern?

The Factory Method is a foundational creational design pattern. It solves the problem of creating objects without specifying the exact, concrete class of the object that will be created.

Instead of calling a constructor directly (e.g., `new Orc()`) inside your main business logic, you define a standard interface and delegate the actual creation of the object to subclasses.

**Common use cases for the Factory Method include:**

* **Cross-Platform UI:** A core application needs to render a Button, but delegates the creation to `WindowsDialog` or `MacDialog` subclasses to get the OS-specific button.
* **Database Connectors:** A backend service needs to save data, but delegates the creation of the connection object to `MySQLConnector` or `MongoConnector` subclasses.
* **Video Game Spawners:** A game engine needs to spawn entities on a map, but allows specific level-spawners to decide exactly what type of enemy appears.

## The Architecture

To understand how this repository works, we have to look at how the code is divided into three distinct files: the Products, the Creators, and the Client Code.

### 1. The Products (`enemy.ts`)

A "Product" is simply the object being created by the factory.

First, we define an `Enemy` interface. This is the contract that guarantees every enemy in the game will have an `attack()` method. Then, we create specific ("concrete") implementations of that interface: `Orc` and `Goblin`.

```typescript

export interface Enemy {
  attack: () => void;
}

export class Orc implements Enemy {
  attack() {
    console.log("Orc is attacking");
  }
}

export class Goblin implements Enemy {
  attack() {
    console.log("Goblin is attacking");
  }
}
```

### 2. The Creators (`spawner.ts`)

The "Creator" is the machine that makes the product.

Notice that the abstract `Spawner` class contains the core business logic (`spawn()`). It dictates how an enemy is processed (a portal opens, then the enemy attacks). However, it relies on an abstract method (`createEnemy`) to actually get the enemy object.

It is up to the subclasses (`OrcSpawner` and `GoblinSpawner`) to implement that method and decide which enemy gets created.

```typescript

import { Enemy, Goblin, Orc } from "./enemy";

export abstract class Spawner {

  protected abstract createEnemy(): Enemy;

  public spawn(): void {
    const enemy: Enemy = this.createEnemy();
    console.log("A portal opens...");
    enemy.attack();
  }
}

export class OrcSpawner extends Spawner {
  protected createEnemy(): Enemy {
    return new Orc();
  }
}

export class GoblinSpawner extends Spawner {
  protected createEnemy(): Enemy {
    return new Goblin();
  }
}
```

### 3. The Client Code (`index.ts`)

This is where the game actually runs. The client code only interacts with the generic `Spawner` type. It never has to touch the `Orc` or `Goblin` classes directly.

```typescript

import { GoblinSpawner, OrcSpawner, Spawner } from "./spawner";

function runGameLevel() {
  console.log("--- Level 1 Starts ---");
  
  let currentSpawner: Spawner = new GoblinSpawner();
  currentSpawner.spawn();

  console.log("\n--- Level 2 Starts ---");

  currentSpawner = new OrcSpawner();
  currentSpawner.spawn();
}

runGameLevel();
```

## Why use this approach? (The Magic of the Factory Method)

You might wonder: Why go through the trouble of creating all these classes instead of just writing `if (level === 1) { new Goblin() }`?

* **The Open/Closed Principle:** Imagine you want to release a DLC expansion for your game featuring a Dragon. With this pattern, you simply create a `Dragon` class and a `DragonSpawner` class. You do not have to modify any existing code. The core `Spawner` and `index.ts` logic remains perfectly untouched and safe from new bugs.
* **Single Responsibility Principle:** The code that uses the enemy (the `spawn` method) is completely separated from the code that creates the enemy (the `new Orc()` call). If an Orc suddenly requires complex configuration parameters to be instantiated, the core game loop doesn't get cluttered with that setup logic.
* **TypeScript Type Safety:** Because the factory method (`createEnemy`) is strongly typed to return an `Enemy`, the TypeScript compiler guarantees that whatever object comes out of the factory will successfully execute `.attack()`.

## Summary

* **Products** (`enemy.ts`) define what is being created.
* **Creators** (`spawner.ts`) define how they are created and how they are used.
* **Client Code** (`index.ts`) wires them together.

Use this pattern when you have a core workflow that needs to operate on multiple, varying types of objects without tying your main application logic to those specific classes.
