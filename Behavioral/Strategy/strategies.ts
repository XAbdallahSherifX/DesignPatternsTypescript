import { Strategy } from "./strategy.interface";

export class CreditCard implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Credit Card`);
  }
}
export class Paypal implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Paypal`);
  }
}
export class DepitCard implements Strategy {
  pay(amount: number) {
    console.log(`paying ${amount}$ through Depit Card`);
  }
}
