// 1. Create a common interface for all phones and decorators
export interface IPhone {
  getPrice(): number;
  getName(): string;
}

export class Phone implements IPhone {
  private name: string;
  private price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  getPrice() {
    return this.price;
  }

  getName() {
    return this.name;
  }

  setPrice(price: number) {
    this.price = price;
  }
}
export abstract class PhoneDecorator implements IPhone {
  protected wrappedPhone: IPhone;
  constructor(phone: IPhone) {
    this.wrappedPhone = phone;
  }

  getPrice() {
    return this.wrappedPhone.getPrice();
  }

  getName() {
    return this.wrappedPhone.getName();
  }
}

export class GoldenPhone extends PhoneDecorator {
  getPrice() {
    return super.getPrice() + 500;
  }

  getName() {
    return `${super.getName()} (Golden Edition)`;
  }
}

export class SilverPhone extends PhoneDecorator {
  getPrice() {
    return super.getPrice() + 200;
  }

  getName() {
    return `${super.getName()} (Silver Edition)`;
  }
}
