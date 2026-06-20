# TypeScript Command Pattern: The Calculator with Undo/Redo

This repository demonstrates how to implement the Command Design Pattern in TypeScript using a basic calculator with full undo and redo capabilities.

## What is the Command Pattern?

The Command Pattern is a behavioral design pattern that turns a request or an action into a stand-alone object containing all information about that request.

Instead of calling a method directly on an object, you encapsulate the action into a "command" object. This transformation allows you to pass requests as method arguments, delay or queue a request's execution, and—most importantly—support undoable operations.

**Common use cases for the Command Pattern include:**

* **Undo/Redo Functionality:** Text editors, image manipulation software, or calculators (as seen in this repository) where you need to traverse backward and forward through a history of actions.
* **Job Queues & Schedulers:** Encapsulating tasks as objects so they can be placed in a queue and executed sequentially by background workers.
* **Macros & Scripting:** Recording a sequence of user actions into a list of command objects that can be saved and "replayed" later.

---

## The Architecture

To understand how this repository works, we can look at the code divided into four distinct roles: The Receiver, The Commands, The Invoker, and The Client Code.

### 1. The Receiver (`receiver.ts`)

The "Receiver" contains the actual, core business logic. It knows *how* to perform the operations. In our case, the `Calculator` simply holds a value and knows how to do the math. Notice that it knows absolutely nothing about commands, undo histories, or invokers.

```typescript
export class Calculator {
  public value: number = 0;

  add(amount: number) {
    this.value += amount;
    console.log(`Added ${amount}. Current value: ${this.value}`);
  }

  subtract(amount: number) {
    this.value -= amount;
    console.log(`Subtracted ${amount}. Current value: ${this.value}`);
  }
}

```

### 2. The Commands (`commands.ts`)

The "Commands" act as the middleman between the UI/Invoker and the Receiver. They implement a common interface (`ICommand`) guaranteeing they have an `execute` and `undo` method.

Each concrete command (like `AddCommand` or `SubtractCommand`) holds a reference to the Receiver (`Calculator`) and the specific parameters needed for the action (the `amount`). When `undo()` is called, the command knows exactly how to reverse its specific action on the receiver.

```typescript
import { Calculator } from "./receiver";

export interface ICommand {
  name: string;
  execute: () => void;
  undo: () => void;
}

export class AddCommand implements ICommand {
  name = "AddCommand";
  private calculator: Calculator;
  private amount: number;

  constructor(calculator: Calculator, amount: number) {
    this.calculator = calculator;
    this.amount = amount;
  }

  execute() {
    this.calculator.add(this.amount);
  }

  undo() {
    this.calculator.subtract(this.amount);
  }
}

// SubtractCommand follows the same structure...

```

### 3. The Invoker (`invoker.ts`)

The "Invoker" (`CommandManager`) is responsible for triggering the commands. It doesn't know *how* the math works, nor does it care. It only knows that any object passed to it has an `execute()` and `undo()` method.

Because the Invoker controls the execution, it acts as the perfect place to store a `trace` (history) array of executed commands, enabling the powerful `undo()` and `redo()` features.

```typescript
import { ICommand } from "./commands";

class CommandManager {
  private trace: ICommand[] = [];
  private undone: ICommand[] = [];

  run(command: ICommand) {
    command.execute();
    this.trace.push(command);
    this.undone = []; // Clear redo history on new action
  }

  undo() {
    let command = this.trace.pop();
    if (command) {
      console.log(`Undoing: ${command.name}...`);
      command.undo();
      this.undone.push(command);
    }
  }

  redo() {
    let command = this.undone.pop();
    if (command) {
      console.log(`Redoing: ${command.name}...`);
      command.execute();
      this.trace.push(command);
    }
  }
  
  // ... printTrace() omitted for brevity
}

export default new CommandManager();

```

### 4. The Client Code (`index.ts`)

The "Client Code" is where everything is wired together. It sets up the Receiver, creates specific Command objects, and hands them off to the Invoker to be executed.

```typescript
import CommandManager from "./invoker";
import { AddCommand, SubtractCommand } from "./commands";
import { Calculator } from './receiver';

// 1. Create the Receiver
const calculator = new Calculator();

// 2. Create the Commands
const add10 = new AddCommand(calculator, 10);
const add5 = new AddCommand(calculator, 5);
const sub3 = new SubtractCommand(calculator, 3);

// 3. Execute commands through the Invoker
console.log("--- Running Commands ---");
CommandManager.run(add10); // Added 10. Current value: 10
CommandManager.run(add5);  // Added 5. Current value: 15
CommandManager.run(sub3);  // Subtracted 3. Current value: 12

console.log("\n--- Undoing ---");
CommandManager.undo(); // Undoes sub3 -> Current value: 15
CommandManager.undo(); // Undoes add5 -> Current value: 10

console.log("\n--- Redoing ---");
CommandManager.redo(); // Redoes add5 -> Current value: 15

```

---

## Why use this approach? (The Magic of the Command Pattern)

You might wonder: Why go through all this trouble instead of just calling `calculator.add(10)` directly in `index.ts`?

* **Time Travel (Undo/Redo):** Directly calling `calculator.add(10)` changes the state immediately, making it incredibly difficult to track how to reverse it later. By turning the action into an object, the `CommandManager` can simply store it in an array and trigger `.undo()` when needed.
* **Decoupling:** The UI (or in this case, the `CommandManager` invoker) pushing the buttons doesn't need to know the complex details of the business logic. It just presses `execute()`.
* **Auditing and Logging:** Because every action is tracked as an object in a `trace` array, it's trivial to print out exactly what happened and in what order (e.g., the `printTrace()` method).
* **Delayed Execution:** You can instantiate `new AddCommand(calculator, 10)` now, but wait to pass it to the `CommandManager` until an hour later.

## Summary

* **Receiver** (`receiver.ts`) holds the actual business logic and state (`Calculator`).
* **Commands** (`commands.ts`) wrap the receiver's methods into independent objects with `execute()` and `undo()` capabilities.
* **Invoker** (`invoker.ts`) actually triggers the commands and maintains the history stacks for undo/redo functionality.
* **Client Code** (`index.ts`) ties it all together by associating the receiver with the commands and passing them to the invoker.

Use this pattern when you need to parameterize objects with operations, queue requests, or implement robust undo/redo functionality in your applications.