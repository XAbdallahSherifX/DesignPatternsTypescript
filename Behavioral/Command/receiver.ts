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