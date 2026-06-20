import { ICommand } from "./commands";

class CommandManager {
  private trace: ICommand[] = [];
  private undone: ICommand[] = [];

  run(command: ICommand) {
    command.execute();
    this.trace.push(command);

    this.undone = [];
  }

  printTrace() {
    console.log("Command Trace:");
    this.trace.forEach((command) => {
      console.log(`- ${command.name}`);
    });
  }

  undo() {
    let command = this.trace.pop();
    if (command) {
      console.log(`Undoing: ${command.name}...`);
      command.undo();
      this.undone.push(command);
    } else {
      console.log("Nothing to undo.");
    }
  }

  redo() {
    let command = this.undone.pop();
    if (command) {
      console.log(`Redoing: ${command.name}...`);
      command.execute();
      this.trace.push(command);
    } else {
      console.log("Nothing to redo.");
    }
  }
}

export default new CommandManager();
