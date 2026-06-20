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


export class SubtractCommand implements ICommand {
  name = "SubtractCommand";
  private calculator: Calculator;
  private amount: number;

  constructor(calculator: Calculator, amount: number) {
    this.calculator = calculator;
    this.amount = amount;
  }

  execute() {
    this.calculator.subtract(this.amount);
  }

  undo() {
    this.calculator.add(this.amount);
  }
}
