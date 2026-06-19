export interface IProduct {
  getPrice: () => number;
}

export class Product implements IProduct {
  private name: string;
  private price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  getPrice() {
    return this.price;
  }
}
