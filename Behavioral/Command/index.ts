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
CommandManager.run(add5); // Added 5. Current value: 15
CommandManager.run(sub3); // Subtracted 3. Current value: 12

console.log("\n--- Trace ---");
CommandManager.printTrace();

console.log("\n--- Undoing ---");
CommandManager.undo(); // Undoes sub3 -> Current value: 15
CommandManager.undo(); // Undoes add5 -> Current value: 10

console.log("\n--- Redoing ---");
CommandManager.redo(); // Redoes add5 -> Current value: 15
