import { Strategy } from "./strategy.interface";
export class PaymentProcessor {
  private strategy: Strategy | undefined;
  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  processPayment(amount: number) {
    if (!this.strategy) throw new Error("No strategy provided");
    this.strategy.pay(amount);
  }
}
