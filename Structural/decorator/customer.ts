import { IPhone } from "./phone";

export class Customer {
  private name: string;
  private balance: number;

  constructor(name: string, balance: number) {
    this.name = name;
    this.balance = balance;
  }

  buyPhone(phone: IPhone) {
    if (phone.getPrice() > this.balance) {
      throw new Error("Can't buy this phone");
    } else {
      this.balance -= phone.getPrice();
      console.log(`Checked out: ${phone.getName()} for $${phone.getPrice()}`);
      console.log(`Remaining balance: $${this.balance}`);
    }
  }
}
